import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../context/ThemeContext';
import PrayerCard from '../components/PrayerCard';
import {
  fetchPrayerTimes,
  getNextPrayer,
  formatPrayerTime,
  getTimeUntilPrayer,
} from '../services/prayerTimesService';
import {scheduleAllPrayerNotifications} from '../utils/notifications';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const LOCATION_STORAGE_KEY = '@noor_last_location';

const PrayerTimesScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(theme);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return result === RESULTS.GRANTED;
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => reject(error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };

  const loadPrayerTimes = useCallback(async () => {
    try {
      setError(null);
      const hasPermission = await requestLocationPermission();

      let coords;
      if (hasPermission) {
        try {
          coords = await getCurrentLocation();
          await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(coords));
        } catch {
          // Fall back to cached location
          const cached = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
          if (cached) {
            coords = JSON.parse(cached);
          }
        }
      } else {
        // Use cached location if available
        const cached = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        if (cached) {
          coords = JSON.parse(cached);
        } else {
          setError('Location permission is required to show prayer times.');
          setLoading(false);
          return;
        }
      }

      setLocation(coords);
      const times = await fetchPrayerTimes(coords.latitude, coords.longitude);
      setPrayerTimes(times);
      setNextPrayer(getNextPrayer(times));

      // Schedule notifications based on saved settings
      const settingsStr = await AsyncStorage.getItem('@noor_reminder_settings');
      if (settingsStr) {
        const reminderSettings = JSON.parse(settingsStr);
        const timesForNotif = {};
        PRAYER_NAMES.forEach(p => {
          timesForNotif[p] = times[p];
        });
        scheduleAllPrayerNotifications(timesForNotif, reminderSettings);
      }
    } catch (err) {
      setError('Failed to load prayer times. Please check your connection.');
      console.error('Prayer times error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPrayerTimes();
  };

  const handlePrayerPress = prayer => {
    navigation.navigate('Settings', {highlightPrayer: prayer});
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Fetching prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🕌</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
      }>
      {/* Date Header */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getTodayDateString()}</Text>
        {prayerTimes?.date?.hijri && (
          <Text style={styles.hijriDate}>
            {prayerTimes.date.hijri.day}{' '}
            {prayerTimes.date.hijri.month?.en}{' '}
            {prayerTimes.date.hijri.year} AH
          </Text>
        )}
      </View>

      {/* Next Prayer Banner */}
      {nextPrayer && (
        <View style={styles.nextPrayerBanner}>
          <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
          <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
          <Text style={styles.nextPrayerTime}>
            {formatPrayerTime(nextPrayer.time)}
          </Text>
          <Text style={styles.timeUntil}>
            in {getTimeUntilPrayer(nextPrayer.time)}
          </Text>
        </View>
      )}

      {/* Prayer Times List */}
      <Text style={styles.sectionTitle}>Today's Prayers</Text>
      {PRAYER_NAMES.map(prayer => (
        <PrayerCard
          key={prayer}
          prayerName={prayer}
          time={formatPrayerTime(prayerTimes?.[prayer])}
          isNext={nextPrayer?.name === prayer}
          onPress={() => handlePrayerPress(prayer)}
        />
      ))}

      {/* Sunrise & Sunset */}
      <Text style={styles.sectionTitle}>Sun Times</Text>
      <View style={styles.sunTimesRow}>
        <View style={styles.sunTimeItem}>
          <Text style={styles.sunIcon}>🌅</Text>
          <Text style={styles.sunLabel}>Sunrise</Text>
          <Text style={styles.sunTime}>{formatPrayerTime(prayerTimes?.Sunrise)}</Text>
        </View>
        <View style={styles.sunTimeItem}>
          <Text style={styles.sunIcon}>🌇</Text>
          <Text style={styles.sunLabel}>Sunset</Text>
          <Text style={styles.sunTime}>{formatPrayerTime(prayerTimes?.Sunset)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 24,
    },
    loadingText: {
      marginTop: 12,
      color: theme.textSecondary,
      fontSize: 15,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorText: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
    dateContainer: {
      marginBottom: 20,
    },
    dateText: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    hijriDate: {
      fontSize: 14,
      color: theme.primary,
      marginTop: 4,
    },
    nextPrayerBanner: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    nextPrayerLabel: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
      marginBottom: 4,
    },
    nextPrayerName: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: 'bold',
    },
    nextPrayerTime: {
      color: '#FFFFFF',
      fontSize: 22,
      marginTop: 4,
    },
    timeUntil: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 14,
      marginTop: 8,
      backgroundColor: 'rgba(0,0,0,0.15)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
      marginTop: 8,
    },
    sunTimesRow: {
      flexDirection: 'row',
      gap: 12,
    },
    sunTimeItem: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    sunIcon: {
      fontSize: 28,
      marginBottom: 4,
    },
    sunLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    sunTime: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
  });

export default PrayerTimesScreen;
