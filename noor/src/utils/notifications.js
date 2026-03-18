import PushNotification, {Importance} from 'react-native-push-notification';
import {Platform} from 'react-native';

const CHANNEL_ID = 'noor-prayer-times';
const CHANNEL_NAME = 'Prayer Times';

/**
 * Configure push notifications for the app.
 * Should be called once at app startup.
 */
export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: token => {
      console.log('TOKEN:', token);
    },
    onNotification: notification => {
      console.log('NOTIFICATION:', notification);
    },
    onAction: notification => {
      console.log('ACTION:', notification.action);
    },
    onRegistrationError: err => {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Create notification channel for Android
  PushNotification.createChannel(
    {
      channelId: CHANNEL_ID,
      channelName: CHANNEL_NAME,
      channelDescription: 'Notifications for daily prayer times',
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate: true,
    },
    created => console.log(`Channel created: ${created}`),
  );
};

/**
 * Schedule a local notification for a prayer time.
 * @param {string} prayerName - Name of the prayer (e.g., 'Fajr')
 * @param {Date} prayerDate - Date/time of the prayer
 * @param {number} minutesBefore - Minutes before the prayer to send notification (0 = at prayer time)
 */
export const schedulePrayerNotification = (prayerName, prayerDate, minutesBefore = 0) => {
  const notificationTime = new Date(prayerDate.getTime() - minutesBefore * 60 * 1000);

  if (notificationTime <= new Date()) {
    return; // Don't schedule notifications in the past
  }

  const message =
    minutesBefore > 0
      ? `${prayerName} prayer is in ${minutesBefore} minutes`
      : `It's time for ${prayerName} prayer`;

  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    title: `🕌 ${prayerName} Prayer`,
    message,
    date: notificationTime,
    allowWhileIdle: true,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    priority: 'high',
    userInfo: {prayer: prayerName},
  });
};

/**
 * Cancel all scheduled prayer notifications.
 */
export const cancelAllPrayerNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

/**
 * Schedule notifications for all prayers of the day.
 * @param {object} prayerTimes - Object with prayer names as keys and Date objects as values
 * @param {object} reminderSettings - Object with prayer names as keys and minutes-before as values
 */
export const scheduleAllPrayerNotifications = (prayerTimes, reminderSettings) => {
  cancelAllPrayerNotifications();

  Object.entries(prayerTimes).forEach(([prayer, time]) => {
    const minutesBefore = reminderSettings[prayer] ?? -1;
    // -1 means the reminder is disabled for this prayer
    if (minutesBefore > -1 && time instanceof Date) {
      schedulePrayerNotification(prayer, time, minutesBefore);
      // Also schedule at prayer time if reminder is set before
      if (minutesBefore > 0) {
        schedulePrayerNotification(prayer, time, 0);
      }
    }
  });
};
