/**
 * quranService — wraps the Al-Quran Cloud API (https://alquran.cloud/api)
 */
import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

/** Fetch the list of all 114 Surahs */
export async function fetchSurahList() {
  const response = await axios.get(`${BASE_URL}/surah`, {timeout: 10000});
  return response.data.data;
}

/**
 * Fetch a single Surah with Arabic text + English translation side-by-side.
 * @param {number} surahNumber  1–114
 */
export async function fetchSurah(surahNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE_URL}/surah/${surahNumber}`, {timeout: 10000}),
    axios.get(`${BASE_URL}/surah/${surahNumber}/en.sahih`, {timeout: 10000}),
  ]);

  const arabicAyahs = arabicRes.data.data.ayahs;
  const englishAyahs = translationRes.data.data.ayahs;
  const surahInfo = arabicRes.data.data;

  return {
    ...surahInfo,
    ayahs: arabicAyahs.map((ayah, index) => ({
      ...ayah,
      translation: englishAyahs[index]?.text || '',
    })),
  };
}

/**
 * Get the audio URL for a specific ayah from a reciter.
 * The Islamic Network CDN uses a zero-padded 6-digit reference: SSSAAA
 * (3 digits for surah number, 3 digits for ayah number).
 * Default reciter: Mishary Rashid Al-Afasy (ar.alafasy)
 */
export function getAudioUrl(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  const ref =
    String(surahNumber).padStart(3, '0') + String(ayahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ref}.mp3`;
}

/** Popular reciters */
export const RECITERS = [
  {id: 'ar.alafasy', name: 'Mishary Al-Afasy'},
  {id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais'},
  {id: 'ar.husary', name: 'Mahmoud Khalil Al-Hussary'},
  {id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi'},
];
