import axios from 'axios';

const HADITH_API_BASE = 'https://hadithapi.com/api';

// The six authentic Hadith books (Sihah Sitta)
export const HADITH_BOOKS = [
  {
    id: 'sahih-bukhari',
    name: 'Sahih Bukhari',
    arabicName: 'صحيح البخاري',
    author: 'Imam Muhammad ibn Ismail al-Bukhari',
    slug: 'sahih-bukhari',
  },
  {
    id: 'sahih-muslim',
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    author: 'Imam Muslim ibn al-Hajjaj',
    slug: 'sahih-muslim',
  },
  {
    id: 'sunan-abu-dawud',
    name: 'Sunan Abu Dawud',
    arabicName: 'سنن أبي داود',
    author: "Imam Abu Dawud al-Sijistani",
    slug: 'abu-dawud',
  },
  {
    id: 'jami-al-tirmidhi',
    name: "Jami' al-Tirmidhi",
    arabicName: 'جامع الترمذي',
    author: 'Imam Muhammad ibn Isa al-Tirmidhi',
    slug: 'tirmidhi',
  },
  {
    id: 'sunan-nasai',
    name: "Sunan al-Nasa'i",
    arabicName: 'سنن النسائي',
    author: "Imam Ahmad ibn Shu'ayb al-Nasa'i",
    slug: 'nasai',
  },
  {
    id: 'sunan-ibn-majah',
    name: 'Sunan Ibn Majah',
    arabicName: 'سنن ابن ماجه',
    author: 'Imam Muhammad ibn Yazid ibn Majah',
    slug: 'ibn-majah',
  },
];

/**
 * Fetch chapters (books) of a Hadith collection.
 * Requires an API key from hadithapi.com
 * @param {string} bookSlug - e.g., 'sahih-bukhari'
 * @param {string} apiKey
 * @returns {Promise<Array>}
 */
export const fetchHadithChapters = async (bookSlug, apiKey) => {
  const response = await axios.get(`${HADITH_API_BASE}/${bookSlug}/chapters`, {
    params: {apiKey},
  });
  return response.data.chapters;
};

/**
 * Fetch Hadiths from a chapter.
 * @param {string} bookSlug
 * @param {string|number} chapterNumber
 * @param {string} apiKey
 * @param {number} page
 * @returns {Promise<object>}
 */
export const fetchHadithsByChapter = async (bookSlug, chapterNumber, apiKey, page = 1) => {
  const response = await axios.get(`${HADITH_API_BASE}/hadiths`, {
    params: {
      apiKey,
      book: bookSlug,
      chapter: chapterNumber,
      paginate: 20,
      page,
    },
  });
  return response.data.hadiths;
};

/**
 * Fetch a single Hadith by its number.
 * @param {string} bookSlug
 * @param {number} hadithNumber
 * @param {string} apiKey
 * @returns {Promise<object>}
 */
export const fetchHadithByNumber = async (bookSlug, hadithNumber, apiKey) => {
  const response = await axios.get(`${HADITH_API_BASE}/hadiths`, {
    params: {
      apiKey,
      book: bookSlug,
      hadithNumber,
    },
  });
  const hadiths = response.data.hadiths?.data;
  return hadiths?.[0] || null;
};

/**
 * Get a Hadith book by its ID.
 * @param {string} bookId
 * @returns {object|undefined}
 */
export const getHadithBookById = bookId => {
  return HADITH_BOOKS.find(book => book.id === bookId);
};
