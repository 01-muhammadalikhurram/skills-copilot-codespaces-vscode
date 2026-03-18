/**
 * hadithService — wraps the Hadith API (https://hadithapi.com)
 * Provides access to the six authentic Hadith books (Sihah Sitta).
 *
 * API key: obtain a free key at https://hadithapi.com
 * Store it in src/config/secrets.js (see README).
 */
import axios from 'axios';

// Set your Hadith API key via setHadithApiKey() at app start, or use react-native-config
// to load it from a .env file. See README for instructions.
let API_KEY = '';

const BASE_URL = 'https://hadithapi.com/public/api';

export function setHadithApiKey(key) {
  API_KEY = key;
}

/** The six authentic Hadith books */
export const HADITH_BOOKS = [
  {id: 'bukhari', name: 'Sahih Bukhari', slug: 'sahih-bukhari'},
  {id: 'muslim', name: 'Sahih Muslim', slug: 'sahih-muslim'},
  {id: 'abu-dawud', name: 'Sunan Abu Dawud', slug: 'abu-dawud'},
  {id: 'tirmidhi', name: 'Jami At-Tirmidhi', slug: 'al-tirmidhi'},
  {id: 'nasai', name: "Sunan an-Nasa'i", slug: 'sunan-nasai'},
  {id: 'ibn-majah', name: 'Sunan Ibn Majah', slug: 'ibn-e-majah'},
];

/**
 * Fetch the chapters (chapters) of a given book.
 * @param {string} bookSlug  e.g. 'sahih-bukhari'
 */
export async function fetchChapters(bookSlug) {
  const response = await axios.get(`${BASE_URL}/chapters`, {
    params: {apiKey: API_KEY, bookSlug},
    timeout: 10000,
  });
  return response.data.chapters;
}

/**
 * Fetch hadiths for a specific chapter.
 * @param {string} bookSlug
 * @param {number|string} chapterId
 * @param {number} page
 */
export async function fetchHadiths(bookSlug, chapterId, page = 1) {
  const response = await axios.get(`${BASE_URL}/hadiths`, {
    params: {
      apiKey: API_KEY,
      bookSlug,
      chapterId,
      page,
      limit: 20,
    },
    timeout: 10000,
  });
  return response.data.hadiths;
}
