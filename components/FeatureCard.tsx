import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Eye } from 'lucide-react-native';
import { Text } from './ui/Text';
import { COLORS } from '@/constants/colors';

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Eye,
};

type Props = {
  title: string;
  icon: string;
  accentColor: string;
  status: string;
  onPress: () => void;
};

export function FeatureCard({ title, icon, accentColor, status, onPress }: Props) {
  const IconComponent = ICON_MAP[icon] ?? Eye;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm flex-row items-center gap-4"
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: accentColor + '33' }}
      >
        <IconComponent size={24} color={accentColor} />
      </View>
      <View className="flex-1">
        <Text variant="lg">{title}</Text>
        <Text variant="sm" className="text-neutral-500 dark:text-neutral-400 mt-1">
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
