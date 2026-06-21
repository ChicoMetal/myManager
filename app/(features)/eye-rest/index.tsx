import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Switch, AppState, AppStateStatus, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from 'expo-audio';
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
  const { enabled, pausedModeIds, nextFireAt, setEnabled, toggleModePaused, setNextFireAt, activeModeIds, modes } =
    useEyeRestStore();
  // Memoize so activeModes reference only changes when store data actually changes
  const activeModes = useMemo(
    () => modes.filter(m => activeModeIds.includes(m.id)),
    [modes, activeModeIds]
  );
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

  const schedulableModes = useMemo(
    () => activeModes.filter((m) => !pausedModeIds.includes(m.id)),
    [activeModes, pausedModeIds]
  );

  const reschedule = useCallback(async () => {
    if (!enabled || schedulableModes.length === 0) {
      await cancelAllNotifications();
      setNextFireAt(null);
      return;
    }
    const times = await scheduleEyeRestNotifications(schedulableModes);
    setNextFireAt(times[0]?.getTime() ?? null);
  }, [enabled, schedulableModes, setNextFireAt]);

  // Keep a ref so useFocusEffect never needs reschedule in its deps
  const rescheduleRef = useRef(reschedule);
  rescheduleRef.current = reschedule;

  // Re-schedule on actual screen focus only (not on every render/dep change)
  useFocusEffect(useCallback(() => {
    rescheduling.current = false;
    rescheduleRef.current();
  }, [])); // intentionally empty — fires on focus event, not dep changes

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
      const data = response.notification.request.content.data as any;
      // Ignore rest-over notifications — they are informational only
      if (data?.type === 'rest-over') return;
      const actionId = response.actionIdentifier;
      const modeId = data?.modeId as string | undefined;
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
    if (!enabled || schedulableModes.length === 0 || !nextFireAt) { setCountdown(''); return; }
    const tick = () => {
      const diff = nextFireAt - Date.now();
      if (diff <= 0) {
        if (!rescheduling.current) {
          rescheduling.current = true;
          // App in foreground when alarm fires — run rest period silently
          // (pre-scheduled rest-over notification handles background case)
          const restSecs = schedulableModes[0]?.restDurationSeconds ?? 20;
          setTimeout(async () => {
            try {
              await setAudioModeAsync({ playsInSilentMode: true });
              await setIsAudioActiveAsync(true);
              const player = createAudioPlayer(require('@/assets/sounds/rest-end.wav'));
              player.play();
            } catch {}
            try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
            await reschedule();
            rescheduling.current = false;
          }, restSecs * 1000);
        }
        return;
      }
      setCountdown(formatCountdown(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [enabled, schedulableModes, nextFireAt, reschedule]);

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
    const times = await scheduleEyeRestNotifications(schedulableModes);
    setNextFireAt(times[0]?.getTime() ?? null);
  };

  const handleToggleModePaused = async (modeId: string) => {
    toggleModePaused(modeId);
    // reschedule fires via useFocusEffect dep change — trigger manually here
    // since focus doesn't re-fire on state-only changes
    const isNowPaused = !pausedModeIds.includes(modeId);
    const newSchedulable = isNowPaused
      ? schedulableModes.filter((m) => m.id !== modeId)
      : [...schedulableModes, activeModes.find((m) => m.id === modeId)!];
    if (!enabled || newSchedulable.length === 0) {
      await cancelAllNotifications();
      setNextFireAt(null);
      return;
    }
    const times = await scheduleEyeRestNotifications(newSchedulable);
    setNextFireAt(times[0]?.getTime() ?? null);
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

        {enabled && activeModes.map(mode => {
          const isModePaused = pausedModeIds.includes(mode.id);
          const times = isModePaused ? [] : getNextFireTimes(mode, new Date());
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
            <Card key={mode.id} className={`flex-row items-center gap-3 py-4${isModePaused ? ' opacity-50' : ''}`}>
              <TouchableOpacity
                className="flex-1"
                onPress={() => router.push(`/(features)/eye-rest/mode/${mode.id}` as any)}
                activeOpacity={0.8}
              >
                {isModePaused ? (
                  <View className="flex-row items-center gap-3">
                    <Moon size={22} color={COLORS['neutral-400']} />
                    <View>
                      <Text variant="lg">{mode.name}</Text>
                      <Text variant="sm" className="text-neutral-400">Paused</Text>
                    </View>
                  </View>
                ) : isToday ? (
                  <View className="gap-1">
                    <Text variant="lg">{mode.name}</Text>
                    <Text variant="sm" className="text-neutral-500 dark:text-neutral-400">
                      Every {mode.intervalMinutes} min · {modeLabel}
                    </Text>
                    {mode.id === schedulableModes[0]?.id && countdown ? (
                      <Text variant="2xl" className="text-brand-500 dark:text-brand-300 mt-1">{countdown}</Text>
                    ) : null}
                  </View>
                ) : (
                  <View className="flex-row items-center gap-3">
                    <Moon size={22} color={COLORS['neutral-400']} />
                    <View>
                      <Text variant="lg">{mode.name}</Text>
                      <Text variant="sm" className="text-neutral-400">{`Resumes ${modeLabel}`}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                testID={`pause-btn-${mode.id}`}
                onPress={() => handleToggleModePaused(mode.id)}
                hitSlop={4}
                activeOpacity={0.7}
                className={`items-center justify-center w-12 h-12 rounded-full ${
                  isModePaused
                    ? 'bg-brand-100 dark:bg-brand-900'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              >
                {isModePaused
                  ? <Play size={18} color={COLORS['brand-500']} />
                  : <Pause size={18} color={COLORS['neutral-500']} />}
              </TouchableOpacity>
            </Card>
          );
        })}

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
