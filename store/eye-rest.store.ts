import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EyeRestMode = {
  id: string;
  name: string;
  intervalMinutes: number;
  restDurationSeconds: number;
  activeStart: string;
  activeEnd: string;
  activeDays: number[];
  sound: string | null;
};

type State = {
  enabled: boolean;
  paused: boolean;
  activeModeIds: string[];
  modes: EyeRestMode[];
  nextFireAt: number | null;
};

type Actions = {
  setEnabled: (enabled: boolean) => void;
  setPaused: (paused: boolean) => void;
  toggleModeActive: (id: string) => void;
  setModeActive: (id: string, active: boolean) => void;
  addMode: (mode: Omit<EyeRestMode, 'id'>) => EyeRestMode;
  updateMode: (id: string, updates: Partial<Omit<EyeRestMode, 'id'>>) => void;
  deleteMode: (id: string) => void;
  setNextFireAt: (ts: number | null) => void;
  getActiveModes: () => EyeRestMode[];
  getStatusLine: () => string;
};

const DEFAULT_MODE: EyeRestMode = {
  id: 'default',
  name: 'Default',
  intervalMinutes: 20,
  restDurationSeconds: 20,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5],
  sound: null,
};

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useEyeRestStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      enabled: false,
      paused: false,
      activeModeIds: ['default'],
      modes: [DEFAULT_MODE],
      nextFireAt: null,

      setEnabled: (enabled) => set({ enabled }),
      setPaused: (paused) => set({ paused }),

      toggleModeActive: (id) => {
        const { activeModeIds } = get();
        if (activeModeIds.includes(id)) {
          if (activeModeIds.length === 1) return;
          set({ activeModeIds: activeModeIds.filter((x) => x !== id) });
        } else {
          set({ activeModeIds: [...activeModeIds, id] });
        }
      },

      setModeActive: (id, active) => {
        const { activeModeIds } = get();
        if (active && !activeModeIds.includes(id)) {
          set({ activeModeIds: [...activeModeIds, id] });
        } else if (!active && activeModeIds.includes(id)) {
          if (activeModeIds.length === 1) return;
          set({ activeModeIds: activeModeIds.filter((x) => x !== id) });
        }
      },

      addMode: (modeData) => {
        const newMode: EyeRestMode = {
          ...modeData,
          restDurationSeconds: modeData.restDurationSeconds ?? 20,
          id: generateId(),
        };
        set((s) => ({ modes: [...s.modes, newMode] }));
        return newMode;
      },

      updateMode: (id, updates) =>
        set((s) => ({
          modes: s.modes.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      deleteMode: (id) => {
        const { modes } = get();
        if (modes.length === 1) return;
        set((s) => ({
          modes: s.modes.filter((m) => m.id !== id),
          activeModeIds: s.activeModeIds.filter((x) => x !== id),
        }));
      },

      setNextFireAt: (ts) => set({ nextFireAt: ts }),

      getActiveModes: () => {
        const { modes, activeModeIds } = get();
        return modes.filter((m) => activeModeIds.includes(m.id));
      },

      getStatusLine: () => {
        const { enabled, paused } = get();
        if (!enabled) return 'Off';
        if (paused) return 'Paused';
        const count = get().getActiveModes().length;
        return `${count} active mode${count !== 1 ? 's' : ''}`;
      },
    }),
    {
      name: 'eye-rest-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
