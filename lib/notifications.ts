import * as Notifications from 'expo-notifications';
import type { EyeRestMode } from '@/store/eye-rest.store';

export const EYE_REST_ACTION = {
  DISMISS: 'DISMISS',
  STOP_REMINDERS: 'STOP_REMINDERS',
} as const;

const CATEGORY_ID = 'EYE_REST_ALARM';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function registerNotificationCategories(): void {
  Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: EYE_REST_ACTION.DISMISS,
      buttonTitle: 'Dismiss',
      options: { opensAppToForeground: true },
    },
    {
      identifier: EYE_REST_ACTION.STOP_REMINDERS,
      buttonTitle: 'Stop Reminders',
      options: { opensAppToForeground: false, isDestructive: true },
    },
  ]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function getNextFireTimes(mode: EyeRestMode, now: Date = new Date()): Date[] {
  const dayOfWeek = now.getDay();
  if (!mode.activeDays.includes(dayOfWeek)) return [];

  const [startH, startM] = mode.activeStart.split(':').map(Number);
  const [endH, endM] = mode.activeEnd.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const times: Date[] = [];
  let cursor = startMinutes + mode.intervalMinutes;

  while (cursor <= endMinutes) {
    if (cursor > nowMinutes) {
      const fire = new Date(now);
      fire.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);
      times.push(fire);
    }
    cursor += mode.intervalMinutes;
  }

  return times;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

type FireEntry = { fireDate: Date; mode: EyeRestMode };

export async function scheduleEyeRestNotifications(
  modes: EyeRestMode[],
  now: Date = new Date()
): Promise<Date[]> {
  await cancelAllNotifications();

  const entries: FireEntry[] = modes.flatMap((mode) =>
    getNextFireTimes(mode, now).map((fireDate) => ({ fireDate, mode }))
  );

  entries.sort((a, b) => a.fireDate.getTime() - b.fireDate.getTime());
  const capped = entries.slice(0, 60);

  for (const { fireDate, mode } of capped) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `👁 ${mode.name}`,
        body: 'Look 20 feet away for 20 seconds.',
        sound: mode.sound ? `${mode.sound}.wav` : true,
        categoryIdentifier: CATEGORY_ID,
        data: { modeId: mode.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
    });
  }

  return capped.map((e) => e.fireDate);
}
