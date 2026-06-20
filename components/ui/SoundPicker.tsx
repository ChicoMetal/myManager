import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createAudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from 'expo-audio';
import { Play, Check } from 'lucide-react-native';
import { Text } from './Text';
import { SOUNDS } from '@/constants/sounds';
import { COLORS } from '@/constants/colors';

type Props = {
  value: string | null;
  onChange: (sound: string | null) => void;
};

export function SoundPicker({ value, onChange }: Props) {
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  const preview = async (file: number | null) => {
    if (!file) return;
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      await setIsAudioActiveAsync(true);
      playerRef.current?.remove();
      const player = createAudioPlayer(file);
      playerRef.current = player;
      player.play();
    } catch {
      // silently ignore preview errors
    }
  };

  return (
    <View className="gap-1">
      {SOUNDS.map((option) => {
        const selected = value === option.key;
        return (
          <TouchableOpacity
            key={String(option.key)}
            onPress={() => onChange(option.key)}
            className={`flex-row items-center justify-between px-3 py-3 rounded-lg ${
              selected ? 'bg-brand-100 dark:bg-neutral-700' : ''
            }`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              {selected ? (
                <Check size={18} color={COLORS['brand-500']} />
              ) : (
                <View className="w-[18px]" />
              )}
              <Text variant="base">{option.label}</Text>
            </View>
            {option.file && (
              <TouchableOpacity
                onPress={() => preview(option.file)}
                className="p-2"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Play size={16} color={COLORS['neutral-400']} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
