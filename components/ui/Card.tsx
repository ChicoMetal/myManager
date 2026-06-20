import React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className = '', children, ...rest }: Props) {
  return (
    <View
      className={`bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
