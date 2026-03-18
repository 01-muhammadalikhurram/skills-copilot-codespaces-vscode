/**
 * notifications.js — configures react-native-push-notification and provides
 * helpers to schedule/cancel prayer-time reminders.
 */
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

const CHANNEL_ID = 'noor-prayer-reminders';

/** Call once at app launch */
export function setupNotifications() {
  PushNotification.configure({
    onNotification: function (notification) {
      // Handle received notification
    },
    requestPermissions: Platform.OS === 'ios',
  });

  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'Prayer Reminders',
        channelDescription: 'Reminders for the five daily prayers',
        importance: 4,
        vibrate: true,
      },
      created => {}, // callback
    );
  }
}

/**
 * Schedule a local notification for a prayer.
 *
 * @param {string} prayerName   e.g. 'Fajr'
 * @param {Date}   prayerTime   The Date object for when the prayer starts
 * @param {number} minutesBefore  0 = at prayer time, 15 = 15 min before, etc.
 */
export function schedulePrayerReminder(prayerName, prayerTime, minutesBefore = 0) {
  const fireDate = new Date(prayerTime.getTime() - minutesBefore * 60 * 1000);
  if (fireDate <= new Date()) {
    return; // don't schedule past events
  }

  const message =
    minutesBefore > 0
      ? `${prayerName} prayer is in ${minutesBefore} minutes`
      : `It's time for ${prayerName} prayer`;

  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    id: notificationId(prayerName, minutesBefore),
    title: '🕌 Noor',
    message,
    date: fireDate,
    allowWhileIdle: true,
    importance: 'high',
    priority: 'high',
    vibrate: true,
  });
}

/** Cancel all reminders for a specific prayer */
export function cancelPrayerReminder(prayerName, minutesBefore = 0) {
  PushNotification.cancelLocalNotification(
    String(notificationId(prayerName, minutesBefore)),
  );
}

/** Cancel every scheduled Noor notification */
export function cancelAllReminders() {
  PushNotification.cancelAllLocalNotifications();
}

/** Deterministic numeric ID derived from prayer name + offset */
function notificationId(prayerName, minutesBefore) {
  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const idx = prayers.indexOf(prayerName);
  return (idx >= 0 ? idx : prayers.length) * 100 + minutesBefore;
}
