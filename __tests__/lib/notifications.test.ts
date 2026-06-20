import { getNextFireTimes, scheduleEyeRestNotifications, registerNotificationCategories, EYE_REST_ACTION } from '@/lib/notifications';
import type { EyeRestMode } from '@/store/eye-rest.store';

jest.mock('expo-notifications');

const workMode: EyeRestMode = {
  id: 'work',
  name: 'Work',
  intervalMinutes: 20,
  restDurationSeconds: 20,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5],
  sound: null,
};

const longRestMode: EyeRestMode = {
  id: 'long',
  name: 'Long Rest',
  intervalMinutes: 60,
  restDurationSeconds: 60,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5],
  sound: 'chime',
};

describe('getNextFireTimes', () => {
  it('returns empty array when current day is not in activeDays', () => {
    const sunday = new Date('2026-06-21T10:00:00');
    expect(getNextFireTimes(workMode, sunday)).toHaveLength(0);
  });

  it('returns fire times within the active window', () => {
    const monday9am = new Date('2026-06-22T09:00:00');
    const times = getNextFireTimes(workMode, monday9am);
    expect(times.length).toBeGreaterThan(0);
    times.forEach((t) => expect(t.getTime()).toBeGreaterThan(monday9am.getTime()));
  });

  it('first fire time is one interval after active start', () => {
    const monday9am = new Date('2026-06-22T09:00:00');
    const first = getNextFireTimes(workMode, monday9am)[0];
    expect(first.getHours()).toBe(9);
    expect(first.getMinutes()).toBe(20);
  });

  it('returns empty array when called after active window ends', () => {
    const monday7pm = new Date('2026-06-22T19:00:00');
    expect(getNextFireTimes(workMode, monday7pm)).toHaveLength(0);
  });
});

describe('scheduleEyeRestNotifications', () => {
  it('merges fire times from multiple modes and caps at 60', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([workMode, longRestMode], monday9am);
    expect(Notifications.scheduleNotificationAsync.mock.calls.length).toBeLessThanOrEqual(60);
    expect(Notifications.scheduleNotificationAsync.mock.calls.length).toBeGreaterThan(0);
  });

  it('uses mode name in notification title', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([longRestMode], monday9am);
    const firstCall = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(firstCall.content.title).toContain('Long Rest');
  });

  it('passes sound filename when mode has sound set', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([longRestMode], monday9am);
    const firstCall = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(firstCall.content.sound).toBe('chime.wav');
  });

  it('passes true for sound when mode sound is null', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([workMode], monday9am);
    const firstCall = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(firstCall.content.sound).toBe(true);
  });

  it('sets categoryIdentifier on all scheduled notifications', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([workMode], monday9am);
    const firstCall = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(firstCall.content.categoryIdentifier).toBe('EYE_REST_ALARM');
  });

  it('includes modeId in notification data', async () => {
    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync.mockClear();
    const monday9am = new Date('2026-06-22T09:00:00');
    await scheduleEyeRestNotifications([workMode], monday9am);
    const firstCall = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(firstCall.content.data.modeId).toBe('work');
  });
});

describe('registerNotificationCategories', () => {
  it('registers EYE_REST_ALARM category with DISMISS and STOP_REMINDERS actions', () => {
    const Notifications = require('expo-notifications');
    Notifications.setNotificationCategoryAsync.mockClear();
    registerNotificationCategories();
    expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
      'EYE_REST_ALARM',
      expect.arrayContaining([
        expect.objectContaining({ identifier: EYE_REST_ACTION.DISMISS }),
        expect.objectContaining({ identifier: EYE_REST_ACTION.STOP_REMINDERS }),
      ])
    );
  });
});
