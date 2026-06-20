import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';

const DAYS = [
  { label: 'Su', value: 0 },
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
];

type Props = {
  value: number[];
  onChange: (days: number[]) => void;
};

export function DaySelector({ value, onChange }: Props) {
  const toggle = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter(d => d !== day).sort((a, b) => a - b));
    } else {
      onChange([...value, day].sort((a, b) => a - b));
    }
  };

  return (
    <View className="flex-row gap-2">
      {DAYS.map(({ label, value: dayValue }) => {
        const active = value.includes(dayValue);
        return (
          <TouchableOpacity
            key={dayValue}
            role="button"
            accessible={true}
            onPress={() => toggle(dayValue)}
            className={`w-9 h-9 rounded-full items-center justify-center ${
              active
                ? 'bg-brand-500 dark:bg-brand-300'
                : 'bg-neutral-100 dark:bg-neutral-700'
            }`}
            activeOpacity={0.7}
          >
            <Text
              variant="xs"
              className={active ? 'text-white dark:text-neutral-900 font-semibold' : 'text-neutral-500 dark:text-neutral-400'}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
