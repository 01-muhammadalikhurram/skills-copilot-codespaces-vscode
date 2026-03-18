/**
 * PrayerTimesScreen — shows daily prayer times based on GPS location.
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from '../context/ThemeContext';
import useLocation from '../hooks/useLocation';
import usePrayerTimes from '../hooks/usePrayerTimes';
import PrayerCard from '../components/PrayerCard';
import {schedulePrayerReminder, cancelPrayerReminder} from '../utils/notifications';

const PRAYER_DISPLAY = [
  {key: 'Fajr', label: 'Fajr', arabic: 'الفجر', icon: '🌄'},
  {key: 'Sunrise', label: 'Sunrise', arabic: 'الشروق', icon: '🌅'},
  {key: 'Dhuhr', label: 'Dhuhr', arabic: 'الظهر', icon: '☀️'},
  {key: 'Asr', label: 'Asr', arabic: 'العصر', icon: '🌤'},
  {key: 'Maghrib', label: 'Maghrib', arabic: 'المغرب', icon: '🌆'},
  {key: 'Isha', label: 'Isha', arabic: 'العشاء', icon: '🌙'},
];

const REMINDER_OPTIONS = [0, 10, 15, 30];
const REMINDERS_KEY = '@noor_reminders';

export default function PrayerTimesScreen() {
  const {theme} = useTheme();
  const s = styles(theme);
  const {location, loading: locLoading, error: locError} = useLocation();
  const {prayerTimes, loading: timesLoading, error: timesError} = usePrayerTimes(location);

  const [reminders, setReminders] = useState({});
  const [method, setMethod] = useState(2);

  // Load saved reminder settings
  useEffect(() => {
    AsyncStorage.getItem(REMINDERS_KEY).then(val => {
      if (val) {
        setReminders(JSON.parse(val));
      }
    });
  }, []);

  const toggleReminder = async (prayerKey, minutesBefore) => {
    const existing = reminders[prayerKey];
    const newReminders = {...reminders};

    if (existing === minutesBefore) {
      // Cancel
      cancelPrayerReminder(prayerKey, minutesBefore);
      delete newReminders[prayerKey];
    } else {
      // Cancel old if any
      if (existing !== undefined) {
        cancelPrayerReminder(prayerKey, existing);
      }
      // Schedule new
      if (prayerTimes && prayerTimes.timings[prayerKey]) {
        const timeStr = prayerTimes.timings[prayerKey];
        const fireDate = parseTimeToDate(timeStr);
        schedulePrayerReminder(prayerKey, fireDate, minutesBefore);
        newReminders[prayerKey] = minutesBefore;
      }
    }

    setReminders(newReminders);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
  };

  const nextPrayer = getNextPrayer(prayerTimes);
  const isLoading = locLoading || timesLoading;
  const error = locError || timesError;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.dateBar}>
        <Text style={s.dateText}>{formatDateFull(new Date())}</Text>
        {prayerTimes && (
          <Text style={s.hijriText}>
            {prayerTimes.date?.hijri?.date || ''}
          </Text>
        )}
      </View>

      {location && (
        <Text style={s.locationText}>
          📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      )}

      {isLoading && (
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loadingText}>
            {locLoading ? 'Detecting location…' : 'Fetching prayer times…'}
          </Text>
        </View>
      )}

      {error && !isLoading && (
        <View style={s.errorBox}>
          <Text style={s.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {prayerTimes && !isLoading && (
        <>
          {nextPrayer && (
            <View style={s.nextPrayerBox}>
              <Text style={s.nextPrayerLabel}>Next Prayer</Text>
              <Text style={s.nextPrayerName}>
                {nextPrayer.icon} {nextPrayer.label}
              </Text>
              <Text style={s.nextPrayerTime}>
                {prayerTimes.timings[nextPrayer.key]}
              </Text>
            </View>
          )}

          <Text style={s.sectionTitle}>Today's Prayer Times</Text>

          {PRAYER_DISPLAY.map(prayer => (
            <PrayerCard
              key={prayer.key}
              prayer={prayer}
              time={prayerTimes.timings[prayer.key]}
              isNext={nextPrayer?.key === prayer.key}
              reminderMinutes={reminders[prayer.key]}
              reminderOptions={REMINDER_OPTIONS}
              onReminderChange={min => toggleReminder(prayer.key, min)}
              theme={theme}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function parseTimeToDate(timeStr) {
  // Strip any parenthetical timezone suffix, e.g. "(PKT)", "(EET)", "(UTC+5:30)"
  const cleaned = timeStr.replace(/\s*\(.*?\)/, '').trim();
  const [hours, minutes] = cleaned.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function getNextPrayer(prayerTimes) {
  if (!prayerTimes) {
    return null;
  }
  const now = new Date();
  for (const prayer of PRAYER_DISPLAY) {
    const timeStr = prayerTimes.timings[prayer.key];
    if (!timeStr) {
      continue;
    }
    const pDate = parseTimeToDate(timeStr);
    if (pDate > now) {
      return prayer;
    }
  }
  return PRAYER_DISPLAY[0]; // wrap to Fajr of next day
}

function formatDateFull(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    content: {padding: 16, paddingBottom: 40},
    dateBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    dateText: {fontSize: 13, color: theme.colors.subText},
    hijriText: {fontSize: 13, color: theme.colors.primary},
    locationText: {
      fontSize: 11,
      color: theme.colors.subText,
      marginBottom: 16,
    },
    center: {alignItems: 'center', marginTop: 60},
    loadingText: {marginTop: 12, color: theme.colors.subText},
    errorBox: {
      backgroundColor: '#fff3f3',
      borderRadius: 8,
      padding: 14,
      marginTop: 20,
    },
    errorText: {color: '#c0392b', fontSize: 14},
    nextPrayerBox: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    nextPrayerLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    nextPrayerName: {
      fontSize: 26,
      fontWeight: '700',
      color: '#fff',
      marginTop: 6,
    },
    nextPrayerTime: {fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: 4},
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.subText,
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });
