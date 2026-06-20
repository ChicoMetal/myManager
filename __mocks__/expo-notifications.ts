export const SchedulableTriggerInputTypes = { DATE: 'date' };
export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
export const getPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
export const scheduleNotificationAsync = jest.fn().mockResolvedValue('mock-notification-id');
export const cancelAllScheduledNotificationsAsync = jest.fn().mockResolvedValue(undefined);
export const setNotificationChannelAsync = jest.fn().mockResolvedValue(undefined);
export const setNotificationCategoryAsync = jest.fn().mockResolvedValue(undefined);
export const setNotificationHandler = jest.fn();
export const addNotificationResponseReceivedListener = jest.fn(() => ({ remove: jest.fn() }));
