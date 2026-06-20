export const COLORS = {
  // Brand (blue, ~210°)
  'brand-100': '#e8f4ff',
  'brand-200': '#c8e6ff',
  'brand-300': '#a2d2ff',
  'brand-400': '#7ab8f5',
  'brand-500': '#5299e0',
  'brand-600': '#3d7cc9',
  'brand-700': '#3d5fa0',

  // Accent (periwinkle, ~240°)
  'accent-100': '#ebebff',
  'accent-200': '#d0d0ff',
  'accent-300': '#b8b8ff',
  'accent-400': '#9898f0',
  'accent-500': '#7878db',
  'accent-600': '#6060c8',
  'accent-700': '#5050b0',

  // Warm complement (~30°, split-complementary)
  'warm-200': '#ffe8c8',
  'warm-300': '#ffd6a2',
  'warm-400': '#ffbb7a',
  'warm-500': '#ffaa5c',

  // Semantic status
  success: '#a2ffd2',
  warning: '#ffd6a2',
  error: '#ffa2a2',
  info: '#a2d2ff',

  // Neutrals (blue-gray tinted)
  'neutral-50': '#f7f8fc',
  'neutral-100': '#eef0f8',
  'neutral-200': '#dde0f0',
  'neutral-300': '#bdc2d8',
  'neutral-400': '#9098b8',
  'neutral-500': '#6570a0',
  'neutral-600': '#4a5280',
  'neutral-700': '#333a5c',
  'neutral-800': '#1e2340',
  'neutral-900': '#0d1028',
} as const;

export type ColorToken = keyof typeof COLORS;
