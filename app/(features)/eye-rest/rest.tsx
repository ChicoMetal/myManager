import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createAudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEyeRestStore } from '@/store/eye-rest.store';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function formatRestCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0
    ? `${m}:${String(s).padStart(2, '0')}`
    : `0:${String(s).padStart(2, '0')}`;
}

export default function RestScreen() {
  const router = useRouter();
  const { modeId, dismissed } = useLocalSearchParams<{ modeId: string; dismissed: string }>();
  const { modes } = useEyeRestStore();
  const mode = modes.find((m) => m.id === modeId);
  const restSeconds = mode?.restDurationSeconds ?? 20;
  const wasDismissed = dismissed === 'true';

  const [secondsLeft, setSecondsLeft] = useState(restSeconds);
  const autoEndedRef = useRef(false);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  // Ref-based countdown for synchronous access inside the interval
  const countdownRef = useRef(restSeconds);
  // Ref for router so interval closure doesn't go stale
  const routerRef = useRef(router);
  routerRef.current = router;

  const playRestEndSignal = useCallback(async () => {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      await setIsAudioActiveAsync(true);
      playerRef.current?.remove();
      const player = createAudioPlayer(require('@/assets/sounds/rest-end.wav'));
      playerRef.current = player;
      player.play();
    } catch {
      // audio unavailable — haptic still fires
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // useLayoutEffect fires synchronously in the commit phase, ensuring the
  // interval is registered before any fake-timer advancement in tests.
  useLayoutEffect(() => {
    const id = setInterval(() => {
      countdownRef.current = countdownRef.current - 1;
      setSecondsLeft(countdownRef.current <= 0 ? 0 : countdownRef.current);
      if (countdownRef.current <= 0) {
        clearInterval(id);
        if (!autoEndedRef.current) {
          autoEndedRef.current = true;
          // Synchronous back() call — no sound for auto-end
          routerRef.current.back();
        }
      }
    }, 1000);
    return () => {
      clearInterval(id);
      playerRef.current?.remove();
    };
  }, []);

  const handleDoneEarly = async () => {
    if (autoEndedRef.current) return;
    autoEndedRef.current = true;
    if (wasDismissed) await playRestEndSignal();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-6 gap-8">

        <View className="items-center gap-2">
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400">
            Resting your eyes
          </Text>
          <Text variant="2xl">{mode?.name ?? 'Eye Rest'}</Text>
        </View>

        <Card className="items-center py-8 px-12">
          <Text variant="4xl" className="text-brand-500 dark:text-brand-300">
            {formatRestCountdown(secondsLeft)}
          </Text>
          <Text variant="sm" className="text-neutral-400 mt-2">
            Look 20 feet away
          </Text>
        </Card>

        <Button
          variant="ghost"
          label="Done early"
          onPress={handleDoneEarly}
          className="mt-4"
        />

      </View>
    </SafeAreaView>
  );
}
