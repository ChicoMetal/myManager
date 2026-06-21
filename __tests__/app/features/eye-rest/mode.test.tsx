import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ModeEditorScreen from '@/app/(features)/eye-rest/mode/[id]';
import { useEyeRestStore } from '@/store/eye-rest.store';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: jest.fn(() => ({ id: 'new' })),
  Stack: Object.assign(() => null, { Screen: () => null }),
}));

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn().mockReturnValue({ play: jest.fn(), remove: jest.fn() }),
  setIsAudioActiveAsync: jest.fn().mockResolvedValue(undefined),
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(() => {
  mockBack.mockClear();
  useEyeRestStore.setState({
    enabled: false,
    pausedModeIds: [],
    activeModeIds: ['default'],
    modes: [{
      id: 'default',
      name: 'Default',
      intervalMinutes: 20,
      restDurationSeconds: 20,
      activeStart: '09:00',
      activeEnd: '18:00',
      activeDays: [1, 2, 3, 4, 5],
      sound: null,
    }],
    nextFireAt: null,
  });
});

describe('ModeEditorScreen — new mode', () => {
  it('renders name input with empty value', () => {
    const { getByPlaceholderText } = render(<ModeEditorScreen />);
    expect(getByPlaceholderText('Mode name')).toBeTruthy();
  });

  it('saves a new mode and navigates back', async () => {
    const { getByPlaceholderText, getByText } = render(<ModeEditorScreen />);
    fireEvent.changeText(getByPlaceholderText('Mode name'), 'Study');
    fireEvent.press(getByText('Save'));
    await waitFor(() => {
      const modes = useEyeRestStore.getState().modes;
      expect(modes.find(m => m.name === 'Study')).toBeTruthy();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it('does not save when name is empty', () => {
    const { getByText } = render(<ModeEditorScreen />);
    fireEvent.press(getByText('Save'));
    expect(useEyeRestStore.getState().modes).toHaveLength(1);
    expect(mockBack).not.toHaveBeenCalled();
  });
});

describe('ModeEditorScreen — edit existing mode', () => {
  beforeEach(() => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ id: 'default' });
  });

  it('pre-fills name from existing mode', () => {
    const { getByDisplayValue } = render(<ModeEditorScreen />);
    expect(getByDisplayValue('Default')).toBeTruthy();
  });

  it('updates the mode on save', async () => {
    const { getByDisplayValue, getByText } = render(<ModeEditorScreen />);
    fireEvent.changeText(getByDisplayValue('Default'), 'Work');
    fireEvent.press(getByText('Save'));
    await waitFor(() => {
      const mode = useEyeRestStore.getState().modes.find(m => m.id === 'default');
      expect(mode?.name).toBe('Work');
    });
  });
});
