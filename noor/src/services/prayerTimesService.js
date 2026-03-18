/**
 * prayerTimesService — wraps the Aladhan API
 * https://aladhan.com/prayer-times-api
 */
import axios from 'axios';

const BASE_URL = 'https://api.aladhan.com/v1';

/**
 * Fetch prayer times for a given latitude/longitude and date.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} date  'DD-MM-YYYY' or leave undefined for today
 * @param {number} method  Calculation method (2 = ISNA, 4 = Umm Al-Qura, etc.)
 */
export async function fetchPrayerTimes(latitude, longitude, date, method = 2) {
  const endpoint = date
    ? `${BASE_URL}/timings/${date}`
    : `${BASE_URL}/timingsByCity`;

  const params = date
    ? {latitude, longitude, method}
    : {city: 'Mecca', country: 'SA', method}; // fallback

  if (latitude && longitude) {
    const today = date || formatDate(new Date());
    const response = await axios.get(`${BASE_URL}/timings/${today}`, {
      params: {latitude, longitude, method},
      timeout: 10000,
    });
    return response.data.data;
  }

  throw new Error('Location unavailable');
}

/**
 * Fetch the prayer calendar for the current month.
 */
export async function fetchMonthlyCalendar(latitude, longitude, method = 2) {
  const now = new Date();
  const response = await axios.get(`${BASE_URL}/calendar`, {
    params: {
      latitude,
      longitude,
      method,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
    timeout: 15000,
  });
  return response.data.data;
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Prayer names shown in the UI */
export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
