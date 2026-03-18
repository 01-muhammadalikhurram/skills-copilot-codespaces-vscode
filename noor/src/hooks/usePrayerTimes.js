/**
 * usePrayerTimes — fetches and caches daily prayer times from the Aladhan API.
 */
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchPrayerTimes} from '../services/prayerTimesService';

function cacheKey(lat, lon) {
  return `@noor_prayer_${lat.toFixed(2)}_${lon.toFixed(2)}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function usePrayerTimes(location, method = 2) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) {
      return;
    }

    const {latitude, longitude} = location;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Try local cache first (valid for the current calendar day)
        const key = cacheKey(latitude, longitude);
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const {date, data} = JSON.parse(cached);
          if (date === todayKey()) {
            if (!cancelled) {
              setPrayerTimes(data);
              setLoading(false);
            }
            return;
          }
        }

        // Fetch from API
        const data = await fetchPrayerTimes(latitude, longitude, undefined, method);
        await AsyncStorage.setItem(
          key,
          JSON.stringify({date: todayKey(), data}),
        );
        if (!cancelled) {
          setPrayerTimes(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch prayer times.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [location, method]);

  return {prayerTimes, loading, error};
}
