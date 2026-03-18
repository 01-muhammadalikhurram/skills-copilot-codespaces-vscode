import axios from 'axios';

const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const QURAN_AUDIO_BASE = 'https://verses.quran.com';

// Available reciters
export const RECITERS = [
  {id: 7, name: 'Mishary Rashid Alafasy', style: 'Murattal'},
  {id: 1, name: 'AbdulBaset AbdulSamad', style: 'Murattal'},
  {id: 2, name: 'AbdulBaset AbdulSamad', style: 'Mujawwad'},
  {id: 3, name: 'Abu Bakr al-Shatri', style: 'Murattal'},
  {id: 4, name: 'Ahmed ibn Ali al-Ajmy', style: 'Murattal'},
  {id: 5, name: 'Fares Abbad', style: 'Murattal'},
  {id: 6, name: 'Hani Rifai', style: 'Murattal'},
];

// Available translations
export const TRANSLATIONS = [
  {id: 131, name: 'Dr. Mustafa Khattab', language: 'English'},
  {id: 20, name: 'Sahih International', language: 'English'},
  {id: 19, name: 'Abdullah Yusuf Ali', language: 'English'},
  {id: 22, name: 'Pickthal', language: 'English'},
  {id: 85, name: 'Abul Ala Maududi', language: 'Urdu'},
];

/**
 * Fetch the list of all Surahs.
 * @returns {Promise<Array>}
 */
export const fetchSurahs = async () => {
  const response = await axios.get(`${QURAN_API_BASE}/chapters`, {
    params: {language: 'en'},
  });
  return response.data.chapters;
};

/**
 * Fetch details of a single Surah.
 * @param {number} surahNumber - 1-based surah number
 * @returns {Promise<object>}
 */
export const fetchSurahDetails = async surahNumber => {
  const response = await axios.get(`${QURAN_API_BASE}/chapters/${surahNumber}`, {
    params: {language: 'en'},
  });
  return response.data.chapter;
};

/**
 * Fetch verses of a Surah with Arabic text and translation.
 * @param {number} surahNumber
 * @param {number} translationId - translation ID from TRANSLATIONS
 * @param {number} page - page number for pagination
 * @returns {Promise<object>}
 */
export const fetchSurahVerses = async (surahNumber, translationId = 131, page = 1) => {
  const response = await axios.get(`${QURAN_API_BASE}/verses/by_chapter/${surahNumber}`, {
    params: {
      language: 'en',
      translations: translationId,
      fields: 'text_uthmani,verse_key',
      per_page: 50,
      page,
    },
  });
  return response.data;
};

/**
 * Fetch a specific verse by its key (e.g., "2:255").
 * @param {string} verseKey
 * @param {number} translationId
 * @returns {Promise<object>}
 */
export const fetchVerseByKey = async (verseKey, translationId = 131) => {
  const response = await axios.get(`${QURAN_API_BASE}/verses/by_key/${verseKey}`, {
    params: {
      language: 'en',
      translations: translationId,
      fields: 'text_uthmani,verse_key',
    },
  });
  return response.data.verse;
};

/**
 * Search the Quran.
 * @param {string} query
 * @param {number} translationId
 * @returns {Promise<Array>}
 */
export const searchQuran = async (query, translationId = 131) => {
  const response = await axios.get(`${QURAN_API_BASE}/search`, {
    params: {
      q: query,
      translations: translationId,
      language: 'en',
    },
  });
  return response.data.search.results;
};

/**
 * Get audio URL for a verse from a reciter.
 * @param {number} reciterId
 * @param {string} verseKey - e.g., "1:1"
 * @returns {string}
 */
export const getVerseAudioUrl = (reciterId, verseKey) => {
  const [surah, verse] = verseKey.split(':');
  const surahPadded = String(surah).padStart(3, '0');
  const versePadded = String(verse).padStart(3, '0');
  return `${QURAN_AUDIO_BASE}/${reciterId}/${surahPadded}${versePadded}.mp3`;
};

/**
 * Get audio URL for an entire Surah from a reciter.
 * @param {number} reciterId
 * @param {number} surahNumber
 * @returns {Promise<string>}
 */
export const getSurahAudioUrl = async (reciterId, surahNumber) => {
  const response = await axios.get(`${QURAN_API_BASE}/chapter_recitations/${reciterId}/${surahNumber}`);
  return response.data.audio_file?.audio_url;
};
