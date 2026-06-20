import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import RestScreen from '@/app/(features)/eye-rest/rest';
import { useEyeRestStore } from '@/store/eye-rest.store';

jest.useFakeTimers();

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: jest.fn(() => ({ modeId: 'default', dismissed: 'true' })),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
      }),
    },
  },
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: { Success: 'success' },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(() => {
  mockBack.mockClear();
  useEyeRestStore.setState({
    enabled: true,
    paused: false,
    activeModeIds: ['default'],
    modes: [{
      id: 'default',
      name: 'Default',
      intervalMinutes: 20,
      restDurationSeconds: 5,
      activeStart: '09:00',
      activeEnd: '18:00',
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      sound: null,
    }],
    nextFireAt: null,
  });
});

describe('RestScreen', () => {
  it('renders mode name', () => {
    const { getByText } = render(<RestScreen />);
    expect(getByText('Default')).toBeTruthy();
  });

  it('shows initial countdown from restDurationSeconds', () => {
    const { getByText } = render(<RestScreen />);
    expect(getByText('0:05')).toBeTruthy();
  });

  it('navigates back when "Done early" is pressed', async () => {
    const { getByText } = render(<RestScreen />);
    fireEvent.press(getByText('Done early'));
    await waitFor(() => expect(mockBack).toHaveBeenCalled());
  });

  it('plays sound and haptic when dismissed=true and Done early pressed', async () => {
    const { Audio } = require('expo-av');
    const Haptics = require('expo-haptics');
    const { getByText } = render(<RestScreen />);
    fireEvent.press(getByText('Done early'));
    await waitFor(() => {
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(Haptics.notificationAsync).toHaveBeenCalled();
    });
  });

  it('auto-navigates back when countdown reaches 0 without playing sound', async () => {
    const { Audio } = require('expo-av');
    Audio.Sound.createAsync.mockClear();
    render(<RestScreen />);
    act(() => { jest.advanceTimersByTime(6000); });
    await waitFor(() => expect(mockBack).toHaveBeenCalled());
    expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
  });
});
