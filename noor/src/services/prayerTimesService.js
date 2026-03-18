import axios from 'axios';

const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1';

// Calculation methods supported by Aladhan API
export const CALCULATION_METHODS = {
  MWL: {id: 3, name: 'Muslim World League'},
  ISNA: {id: 2, name: 'Islamic Society of North America'},
  Egypt: {id: 5, name: 'Egyptian General Authority of Survey'},
  Makkah: {id: 4, name: 'Umm Al-Qura University, Makkah'},
  Karachi: {id: 1, name: 'University of Islamic Sciences, Karachi'},
  Tehran: {id: 7, name: 'Institute of Geophysics, University of Tehran'},
  Jafari: {id: 0, name: 'Shia Ithna-Ashari, Leva Institute, Qum'},
};

/**
 * Fetch prayer times for a given location and date from the Aladhan API.
 * @param {number} latitude
 * @param {number} longitude
 * @param {Date} date - defaults to today
 * @param {number} method - calculation method ID (default: 2 ISNA)
 * @returns {Promise<object>} prayer times object
 */
export const fetchPrayerTimes = async (latitude, longitude, date = new Date(), method = 2) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const response = await axios.get(`${ALADHAN_BASE_URL}/timings/${day}-${month}-${year}`, {
    params: {
      latitude,
      longitude,
      method,
    },
  });

  const {timings, date: dateInfo} = response.data.data;

  return {
    Fajr: parseTimeString(timings.Fajr, date),
    Sunrise: parseTimeString(timings.Sunrise, date),
    Dhuhr: parseTimeString(timings.Dhuhr, date),
    Asr: parseTimeString(timings.Asr, date),
    Sunset: parseTimeString(timings.Sunset, date),
    Maghrib: parseTimeString(timings.Maghrib, date),
    Isha: parseTimeString(timings.Isha, date),
    Imsak: parseTimeString(timings.Imsak, date),
    Midnight: parseTimeString(timings.Midnight, date),
    date: dateInfo,
    rawTimings: timings,
  };
};

/**
 * Parse a HH:MM time string into a Date object for the given date.
 */
const parseTimeString = (timeStr, date) => {
  if (!timeStr) {
    return null;
  }
  // Remove timezone indicator if present (e.g., "05:30 (EST)")
  const cleanTime = timeStr.split(' ')[0];
  const [hours, minutes] = cleanTime.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

/**
 * Get the name of the next upcoming prayer from a set of prayer times.
 * @param {object} prayerTimes
 * @returns {{name: string, time: Date} | null}
 */
export const getNextPrayer = prayerTimes => {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const now = new Date();

  for (const prayer of prayerOrder) {
    const time = prayerTimes[prayer];
    if (time && time > now) {
      return {name: prayer, time};
    }
  }

  return null; // All prayers for today have passed
};

/**
 * Format a Date object as a readable time string (e.g., "5:30 AM").
 */
export const formatPrayerTime = date => {
  if (!date) {
    return '--:--';
  }
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

/**
 * Calculate the time remaining until the next prayer.
 * @param {Date} nextPrayerTime
 * @returns {string} formatted time remaining (e.g., "2h 15m")
 */
export const getTimeUntilPrayer = nextPrayerTime => {
  const now = new Date();
  const diffMs = nextPrayerTime - now;

  if (diffMs <= 0) {
    return '0m';
  }

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
