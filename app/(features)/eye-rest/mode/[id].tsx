import React, { useState, useRef } from 'react';
import { View, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useEyeRestStore, EyeRestMode } from '@/store/eye-rest.store';
import { TimePicker } from '@/components/ui/TimePicker';
import { DaySelector } from '@/components/ui/DaySelector';
import { SoundPicker } from '@/components/ui/SoundPicker';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/colors';

const INTERVAL_OPTIONS = [5, 10, 15, 20, 30, 45, 60];
const REST_DURATION_OPTIONS = [10, 20, 30, 60, 90, 120];

export default function ModeEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { modes, addMode, updateMode } = useEyeRestStore();

  const existing = id !== 'new' ? modes.find((m) => m.id === id) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const nameRef = useRef(existing?.name ?? '');
  const [intervalMinutes, setIntervalMinutes] = useState(existing?.intervalMinutes ?? 20);
  const [restDurationSeconds, setRestDurationSeconds] = useState(existing?.restDurationSeconds ?? 20);
  const [activeStart, setActiveStart] = useState(existing?.activeStart ?? '09:00');
  const [activeEnd, setActiveEnd] = useState(existing?.activeEnd ?? '18:00');
  const [activeDays, setActiveDays] = useState<number[]>(existing?.activeDays ?? [1, 2, 3, 4, 5]);
  const [sound, setSound] = useState<string | null>(existing?.sound ?? null);

  const handleSave = () => {
    const currentName = nameRef.current;
    if (!currentName.trim()) {
      Alert.alert('Name required', 'Please enter a name for this mode.');
      return;
    }
    const modeData: Omit<EyeRestMode, 'id'> = {
      name: currentName.trim(),
      intervalMinutes,
      restDurationSeconds,
      activeStart,
      activeEnd,
      activeDays,
      sound,
    };
    if (existing) {
      updateMode(existing.id, modeData);
    } else {
      addMode(modeData);
    }
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['bottom']}>
      <Stack.Screen options={{ title: id === 'new' ? 'New Mode' : 'Edit Mode' }} />
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="gap-4 pb-12">

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-2">Mode Name</Text>
          <TextInput
            value={name}
            onChangeText={(text) => { nameRef.current = text; setName(text); }}
            placeholder="Mode name"
            placeholderTextColor={COLORS['neutral-400']}
            className="text-base text-neutral-900 dark:text-neutral-50 py-1"
            autoFocus={!existing}
            returnKeyType="done"
          />
        </Card>

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-3">
            Reminder Interval
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {INTERVAL_OPTIONS.map((min) => (
              <Button
                key={min}
                variant={intervalMinutes === min ? 'primary' : 'secondary'}
                label={`${min} min`}
                onPress={() => setIntervalMinutes(min)}
                className="flex-0"
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-3">
            Rest Duration
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {REST_DURATION_OPTIONS.map((secs) => (
              <Button
                key={secs}
                variant={restDurationSeconds === secs ? 'primary' : 'secondary'}
                label={secs < 60 ? `${secs}s` : `${secs / 60}m`}
                onPress={() => setRestDurationSeconds(secs)}
                className="flex-0"
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-1">
            Active Hours
          </Text>
          <TimePicker value={activeStart} onChange={setActiveStart} label="Start" />
          <TimePicker value={activeEnd} onChange={setActiveEnd} label="End" />
        </Card>

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-3">
            Active Days
          </Text>
          <DaySelector value={activeDays} onChange={setActiveDays} />
        </Card>

        <Card>
          <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mb-2">
            Notification Sound
          </Text>
          <SoundPicker value={sound} onChange={setSound} />
        </Card>

        <View className="gap-3 mt-2">
          <Button variant="primary" label="Save" onPress={handleSave} />
          <Button variant="ghost" label="Cancel" onPress={() => router.back()} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
