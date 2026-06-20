import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';

type Props = {
  label: string;
  color?: string;
  className?: string;
};

export function Badge({ label, className = '' }: Props) {
  return (
    <View className={`bg-brand-100 dark:bg-neutral-700 rounded-full px-3 py-1 self-start ${className}`}>
      <Text variant="xs" className="text-brand-600 dark:text-brand-300 font-medium">
        {label}
      </Text>
    </View>
  );
}
