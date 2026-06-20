import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from './Text';

type Props = {
  value: string;       // "HH:mm"
  onChange: (value: string) => void;
  label?: string;
};

export function TimePicker({ value, onChange, label }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const valid = /^\d{2}:\d{2}$/.test(draft);
    if (valid) {
      const [h, m] = draft.split(':').map(Number);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        onChange(draft);
        setEditing(false);
        return;
      }
    }
    setDraft(value);
    setEditing(false);
  };

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
      {label && (
        <Text variant="base" className="text-neutral-700 dark:text-neutral-300">
          {label}
        </Text>
      )}
      {editing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onBlur={commit}
          onSubmitEditing={commit}
          keyboardType="numbers-and-punctuation"
          autoFocus
          className="text-base font-semibold text-brand-500 dark:text-brand-300 text-right min-w-16"
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity onPress={() => { setDraft(value); setEditing(true); }}>
          <Text variant="base" className="text-brand-500 dark:text-brand-300 font-semibold">
            {value}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
