import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Switch, AppState, AppStateStatus, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { ChevronRight, Pause, Play, Moon } from 'lucide-react-native';
import { useEyeRestStore } from '@/store/eye-rest.store';
import {
  requestNotificationPermission,
  scheduleEyeRestNotifications,
  cancelAllNotifications,
  registerNotificationCategories,
  getNextFireTimes,
  EYE_REST_ACTION,
} from '@/lib/notifications';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/colors';

function formatCountdown(ms: number): string {
  const total = Math.max(0, ms);
  const hours = Math.floor(total / 3600000);
  const mins = Math.floor((total % 3600000) / 60000);
  const secs = Math.floor((total % 60000) / 1000);
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function EyeRestScreen() {
  const router = useRouter();
  const { enabled, paused, nextFireAt, setEnabled, setPaused, setNextFireAt, getActiveModes, activeModeIds } =
    useEyeRestStore();
  const activeModes = getActiveModes();
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [countdown, setCountdown] = useState('');
  const appState = useRef(AppState.currentState);
  const rescheduling = useRef(false);

  const nextAlarmLabel = useMemo(() => {
    if (!nextFireAt) return '';
    const next = new Date(nextFireAt);
    const now = new Date();
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeStr = `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`;
    if (next.toDateString() === now.toDateString()) return `Today at ${timeStr}`;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (next.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${timeStr}`;
    return `${DAYS[next.getDay()]} at ${timeStr}`;
  }, [nextFireAt]);

  useEffect(() => { registerNotificationCategories(); }, []);

  const reschedule = useCallback(async () => {
    if (!enabled || paused || activeModes.length === 0) return;
    const times = await scheduleEyeRestNotifications(activeModes);
    setNextFireAt(times[0]?.getTime() ?? null);
  }, [enabled, paused, activeModes, setNextFireAt]);

  // Re-schedule whenever screen regains focus (e.g. after rest screen or mode editor)
  useFocusEffect(useCallback(() => {
    rescheduling.current = false;
    reschedule();
  }, [reschedule]));

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        reschedule();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [reschedule]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      const modeId = (response.notification.request.content.data as any)?.modeId as string | undefined;
      if (actionId === EYE_REST_ACTION.STOP_REMINDERS) {
        cancelAllNotifications();
        setNextFireAt(null);
      } else {
        router.push(`/(features)/eye-rest/rest?modeId=${modeId ?? ''}&dismissed=true` as any);
      }
    });
    return () => sub.remove();
  }, [router, setNextFireAt]);

  useEffect(() => {
    if (!enabled || paused || !nextFireAt) { setCountdown(''); return; }
    const tick = () => {
      const diff = nextFireAt - Date.now();
      if (diff <= 0) {
        if (!rescheduling.current) {
          rescheduling.current = true;
          // App in foreground when alarm fires — open rest screen directly.
          // useFocusEffect will reschedule when rest screen closes.
          const firingMode = activeModes[0];
          if (firingMode) {
            router.push(
              `/(features)/eye-rest/rest?modeId=${firingMode.id}&dismissed=true` as any
            );
          } else {
            reschedule().finally(() => { rescheduling.current = false; });
          }
        }
        return;
      }
      setCountdown(formatCountdown(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [enabled, paused, nextFireAt, reschedule]);

  const handleToggle = async (value: boolean) => {
    if (!value) {
      setEnabled(false);
      setNextFireAt(null);
      await cancelAllNotifications();
      return;
    }
    const granted = await requestNotificationPermission();
    if (!granted) { setPermissionDenied(true); return; }
    setPermissionDenied(false);
    setEnabled(true);
    setPaused(false);
    const times = await scheduleEyeRestNotifications(activeModes);
    setNextFireAt(times[0]?.getTime() ?? null);
  };

  const handlePause = async () => {
    if (paused) {
      setPaused(false);
      const times = await scheduleEyeRestNotifications(activeModes);
      setNextFireAt(times[0]?.getTime() ?? null);
    } else {
      setPaused(true);
      setNextFireAt(null);
      await cancelAllNotifications();
    }
  };

  const activeCount = activeModeIds.length;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-6" contentContainerClassName="gap-4 pb-12">

        <Card className="flex-row items-center justify-between">
          <View>
            <Text variant="lg">Eye Rest Reminders</Text>
            <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mt-1">
              {activeCount} active mode{activeCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <Switch
            testID="enable-toggle"
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ true: COLORS['brand-400'], false: COLORS['neutral-300'] }}
            thumbColor={enabled ? COLORS['brand-500'] : '#ffffff'}
          />
        </Card>

        {enabled && (
          <TouchableOpacity
            testID="pause-btn"
            onPress={handlePause}
            className={`flex-row items-center justify-center gap-2 rounded-xl py-3 ${
              paused ? 'bg-brand-100 dark:bg-neutral-700' : 'bg-neutral-100 dark:bg-neutral-800'
            }`}
            activeOpacity={0.7}
          >
            {paused
              ? <Play size={18} color={COLORS['brand-500']} />
              : <Pause size={18} color={COLORS['neutral-500']} />}
            <Text variant="base" className={paused ? 'text-brand-500 dark:text-brand-300 font-semibold' : 'text-neutral-500 dark:text-neutral-400'}>
              {paused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>
        )}

        {permissionDenied && (
          <View className="rounded-xl p-4 gap-2" style={{ backgroundColor: COLORS['error'] + '33' }}>
            <Text variant="sm" className="text-neutral-800 dark:text-neutral-200">
              Notifications are required for reminders. Enable them in Settings.
            </Text>
            <TouchableOpacity onPress={() => Linking.openSettings()}>
              <Text variant="sm" className="text-brand-500 dark:text-brand-300 font-semibold">Open Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        {enabled && !paused && activeModes.map(mode => {
          const times = getNextFireTimes(mode, new Date());
          const modeNextAt = times[0] ?? null;
          const modeLabel = modeNextAt ? (() => {
            const next = modeNextAt;
            const now = new Date();
            const timeStr = `${String(next.getHours()).padStart(2,'0')}:${String(next.getMinutes()).padStart(2,'0')}`;
            if (next.toDateString() === now.toDateString()) return `Today at ${timeStr}`;
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (next.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${timeStr}`;
            const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            return `${DAYS[next.getDay()]} at ${timeStr}`;
          })() : null;
          const isToday = modeLabel?.startsWith('Today') ?? false;

          return (
            <TouchableOpacity
              key={mode.id}
              onPress={() => router.push(`/(features)/eye-rest/mode/${mode.id}` as any)}
              activeOpacity={0.8}
            >
              {isToday ? (
                <Card className="py-4 gap-1">
                  <Text variant="lg">{mode.name}</Text>
                  <Text variant="sm" className="text-neutral-500 dark:text-neutral-400">
                    Every {mode.intervalMinutes} min · {modeLabel}
                  </Text>
                  {mode.id === activeModes[0].id && countdown ? (
                    <Text variant="2xl" className="text-brand-500 dark:text-brand-300 mt-1">{countdown}</Text>
                  ) : null}
                </Card>
              ) : (
                <Card className="flex-row items-center gap-3 py-4">
                  <Moon size={22} color={COLORS['neutral-400']} />
                  <View className="flex-1">
                    <Text variant="lg">{mode.name}</Text>
                    <Text variant="sm" className="text-neutral-400">{`Resumes ${modeLabel}`}</Text>
                  </View>
                </Card>
              )}
            </TouchableOpacity>
          );
        })}

        {enabled && paused && (
          <Card className="items-center py-4">
            <Text variant="base" className="text-neutral-500 dark:text-neutral-400">Paused — tap Resume to continue</Text>
          </Card>
        )}

        <TouchableOpacity onPress={() => router.push('/(features)/eye-rest/modes' as any)} activeOpacity={0.8}>
          <Card className="flex-row items-center justify-between py-3">
            <Text variant="base" className="text-neutral-500 dark:text-neutral-400">Manage modes</Text>
            <ChevronRight size={20} color={COLORS['neutral-400']} />
          </Card>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
