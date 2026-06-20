import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

const containerClass: Record<Variant, string> = {
  primary:   'bg-brand-500 dark:bg-brand-300 rounded-lg px-4 py-3 items-center',
  secondary: 'bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-3 items-center border border-neutral-200 dark:border-neutral-600',
  ghost:     'px-4 py-3 items-center',
};

const textClass: Record<Variant, string> = {
  primary:   'text-white dark:text-neutral-900',
  secondary: 'text-neutral-700 dark:text-neutral-200',
  ghost:     'text-brand-500 dark:text-brand-300',
};

type Props = TouchableOpacityProps & {
  variant: Variant;
  label: string;
  className?: string;
};

export function Button({ variant, label, className = '', disabled, ...rest }: Props) {
  return (
    <TouchableOpacity
      className={`${containerClass[variant]} ${disabled ? 'opacity-40' : ''} ${className}`}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      <Text variant="base" className={textClass[variant]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
