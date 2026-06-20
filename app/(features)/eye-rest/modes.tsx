import React from 'react';
import { View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { useEyeRestStore } from '@/store/eye-rest.store';
import { scheduleEyeRestNotifications } from '@/lib/notifications';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/colors';

export default function ModesScreen() {
  const router = useRouter();
  const { modes, activeModeIds, enabled, toggleModeActive, deleteMode, setNextFireAt, getActiveModes } =
    useEyeRestStore();

  const handleToggle = async (id: string, value: boolean) => {
    toggleModeActive(id);
    if (enabled) {
      const nextActive = value
        ? modes.filter((m) => [...activeModeIds, id].includes(m.id))
        : modes.filter((m) => activeModeIds.filter((x) => x !== id).includes(m.id));
      const times = await scheduleEyeRestNotifications(nextActive);
      setNextFireAt(times[0]?.getTime() ?? null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (modes.length === 1) {
      Alert.alert('Cannot delete', 'At least one mode must exist.');
      return;
    }
    Alert.alert('Delete Mode', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMode(id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="gap-3 pb-24">
        {modes.map((mode) => {
          const isActive = activeModeIds.includes(mode.id);
          return (
            <Card key={mode.id} className="flex-row items-center gap-3">
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => router.push(`/(features)/eye-rest/mode/${mode.id}` as any)}
                  activeOpacity={0.7}
                >
                  <Text variant="lg">{mode.name}</Text>
                  <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mt-1">
                    Every {mode.intervalMinutes} min · {mode.activeStart}–{mode.activeEnd}
                  </Text>
                  <Text variant="sm" className="text-neutral-500 dark:text-neutral-400">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
                      .filter((_, i) => mode.activeDays.includes(i))
                      .join(', ')}
                    {mode.sound ? ` · ${mode.sound}` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <Switch
                testID="mode-toggle"
                value={isActive}
                onValueChange={(v) => handleToggle(mode.id, v)}
                trackColor={{ true: COLORS['brand-400'], false: COLORS['neutral-300'] }}
                thumbColor={isActive ? COLORS['brand-500'] : '#ffffff'}
              />
              <TouchableOpacity
                testID="delete-mode-btn"
                onPress={() => handleDelete(mode.id, mode.name)}
                className="p-2"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={18} color={COLORS['neutral-400']} />
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push('/(features)/eye-rest/mode/new' as any)}
        className="absolute bottom-8 right-6 w-14 h-14 bg-brand-500 dark:bg-brand-300 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
