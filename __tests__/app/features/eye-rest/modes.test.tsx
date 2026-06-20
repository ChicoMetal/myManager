import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ModesScreen from '@/app/(features)/eye-rest/modes';
import { useEyeRestStore } from '@/store/eye-rest.store';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('expo-notifications');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/lib/notifications', () => ({
  scheduleEyeRestNotifications: jest.fn().mockResolvedValue([]),
  cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
}));

const modes = [
  {
    id: 'default',
    name: 'Default',
    intervalMinutes: 20,
    restDurationSeconds: 20,
    activeStart: '09:00',
    activeEnd: '18:00',
    activeDays: [1, 2, 3, 4, 5],
    sound: null,
  },
  {
    id: 'weekend',
    name: 'Weekend',
    intervalMinutes: 30,
    restDurationSeconds: 30,
    activeStart: '10:00',
    activeEnd: '16:00',
    activeDays: [0, 6],
    sound: 'chime',
  },
];

beforeEach(() => {
  useEyeRestStore.setState({
    enabled: false,
    paused: false,
    activeModeIds: ['default'],
    modes,
    nextFireAt: null,
  });
});

describe('ModesScreen', () => {
  it('renders all modes', () => {
    const { getByText } = render(<ModesScreen />);
    expect(getByText('Default')).toBeTruthy();
    expect(getByText('Weekend')).toBeTruthy();
  });

  it('toggle activates an inactive mode', async () => {
    const { getAllByTestId } = render(<ModesScreen />);
    const toggles = getAllByTestId('mode-toggle');
    fireEvent(toggles[1], 'valueChange', true);
    await waitFor(() => {
      expect(useEyeRestStore.getState().activeModeIds).toContain('weekend');
    });
  });

  it('toggle deactivates an active mode when multiple are active', async () => {
    useEyeRestStore.setState({ activeModeIds: ['default', 'weekend'] });
    const { getAllByTestId } = render(<ModesScreen />);
    const toggles = getAllByTestId('mode-toggle');
    fireEvent(toggles[1], 'valueChange', false);
    await waitFor(() => {
      expect(useEyeRestStore.getState().activeModeIds).not.toContain('weekend');
    });
  });

  it('does not delete the last remaining mode', () => {
    useEyeRestStore.setState({ modes: [modes[0]], activeModeIds: ['default'] });
    const { getAllByTestId } = render(<ModesScreen />);
    const deleteBtns = getAllByTestId('delete-mode-btn');
    fireEvent.press(deleteBtns[0]);
    expect(useEyeRestStore.getState().modes).toHaveLength(1);
  });
});
