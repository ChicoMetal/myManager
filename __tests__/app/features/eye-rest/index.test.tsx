import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EyeRestScreen from '@/app/(features)/eye-rest/index';
import { useEyeRestStore } from '@/store/eye-rest.store';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: jest.fn(),
}));

jest.mock('expo-notifications');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/lib/notifications', () => ({
  requestNotificationPermission: jest.fn().mockResolvedValue(true),
  scheduleEyeRestNotifications: jest.fn().mockResolvedValue([new Date(Date.now() + 60000)]),
  cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
  registerNotificationCategories: jest.fn(),
  getNextFireTimes: jest.fn().mockReturnValue([new Date(Date.now() + 60000)]),
  EYE_REST_ACTION: { DISMISS: 'DISMISS', STOP_REMINDERS: 'STOP_REMINDERS' },
}));

const defaultMode = {
  id: 'default',
  name: 'Default',
  intervalMinutes: 20,
  restDurationSeconds: 20,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  sound: null,
};

beforeEach(() => {
  useEyeRestStore.setState({
    enabled: false,
    paused: false,
    activeModeIds: ['default'],
    modes: [defaultMode],
    nextFireAt: null,
  });
});

describe('EyeRestScreen', () => {
  it('renders active modes count', () => {
    const { getByText } = render(<EyeRestScreen />);
    expect(getByText(/1 active mode/i)).toBeTruthy();
  });

  it('enables notifications when toggle is turned on', async () => {
    const { getByTestId } = render(<EyeRestScreen />);
    fireEvent(getByTestId('enable-toggle'), 'valueChange', true);
    await waitFor(() => {
      expect(useEyeRestStore.getState().enabled).toBe(true);
    });
  });

  it('shows countdown label after enabling', async () => {
    const { getByTestId, findAllByText } = render(<EyeRestScreen />);
    fireEvent(getByTestId('enable-toggle'), 'valueChange', true);
    const items = await findAllByText(/Default|Today at|Tomorrow at|Resumes/i);
    expect(items.length).toBeGreaterThan(0);
  });

  it('pause button sets paused state and cancels notifications', async () => {
    useEyeRestStore.setState({ enabled: true, paused: false });
    const { getByTestId } = render(<EyeRestScreen />);
    fireEvent.press(getByTestId('pause-btn'));
    await waitFor(() => {
      expect(useEyeRestStore.getState().paused).toBe(true);
    });
    const { cancelAllNotifications } = require('@/lib/notifications');
    expect(cancelAllNotifications).toHaveBeenCalled();
  });

  it('resume button clears paused state and reschedules', async () => {
    useEyeRestStore.setState({ enabled: true, paused: true });
    const { getByTestId } = render(<EyeRestScreen />);
    fireEvent.press(getByTestId('pause-btn'));
    await waitFor(() => {
      expect(useEyeRestStore.getState().paused).toBe(false);
    });
  });

  it('shows permission denied message when permission refused', async () => {
    const { requestNotificationPermission } = require('@/lib/notifications');
    requestNotificationPermission.mockResolvedValueOnce(false);
    const { getByTestId, findByText } = render(<EyeRestScreen />);
    fireEvent(getByTestId('enable-toggle'), 'valueChange', true);
    expect(await findByText(/Notifications are required/i)).toBeTruthy();
  });
});
