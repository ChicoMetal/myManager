export type SoundOption = {
  key: string | null;
  label: string;
  file: number | null; // require() result, null = device default
};

export const SOUNDS: SoundOption[] = [
  { key: null,     label: 'Default', file: null },
  { key: 'chime',  label: 'Chime',   file: require('@/assets/sounds/chime.wav') },
  { key: 'bell',   label: 'Bell',    file: require('@/assets/sounds/bell.wav') },
  { key: 'forest', label: 'Forest',  file: require('@/assets/sounds/forest.wav') },
  { key: 'soft',      label: 'Soft',      file: require('@/assets/sounds/soft.wav') },
  { key: 'hero',      label: 'Hero',      file: require('@/assets/sounds/hero.wav') },
  { key: 'submarine', label: 'Submarine', file: require('@/assets/sounds/submarine.wav') },
  { key: 'funk',      label: 'Funk',      file: require('@/assets/sounds/funk.wav') },
];
