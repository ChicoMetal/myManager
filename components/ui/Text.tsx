import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

type Variant = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '4xl';

const variantClass: Record<Variant, string> = {
  xs:    'text-xs font-normal leading-4 text-neutral-900 dark:text-neutral-50',
  sm:    'text-sm font-normal leading-5 text-neutral-900 dark:text-neutral-50',
  base:  'text-base font-normal leading-6 text-neutral-900 dark:text-neutral-50',
  lg:    'text-lg font-medium leading-7 text-neutral-900 dark:text-neutral-50',
  xl:    'text-xl font-semibold leading-7 text-neutral-900 dark:text-neutral-50',
  '2xl': 'text-2xl font-bold leading-8 text-neutral-900 dark:text-neutral-50',
  '4xl': 'text-4xl font-bold leading-10 text-neutral-900 dark:text-neutral-50',
};

type Props = TextProps & {
  variant: Variant;
  className?: string;
};

export function Text({ variant, className = '', children, ...rest }: Props) {
  return (
    <RNText className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </RNText>
  );
}
