import { COLORS } from './colors';

export type Theme = {
  bg: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  accent: string;
};

export const lightTheme: Theme = {
  bg: COLORS['neutral-50'],
  surface: '#ffffff',
  surfaceElevated: COLORS['neutral-100'],
  textPrimary: COLORS['neutral-900'],
  textSecondary: COLORS['neutral-600'],
  textMuted: COLORS['neutral-400'],
  border: COLORS['neutral-200'],
  primary: COLORS['brand-500'],
  accent: COLORS['accent-500'],
};

export const darkTheme: Theme = {
  bg: COLORS['neutral-900'],
  surface: COLORS['neutral-800'],
  surfaceElevated: COLORS['neutral-700'],
  textPrimary: COLORS['neutral-50'],
  textSecondary: COLORS['neutral-300'],
  textMuted: COLORS['neutral-500'],
  border: COLORS['neutral-700'],
  primary: COLORS['brand-300'],
  accent: COLORS['accent-300'],
};
