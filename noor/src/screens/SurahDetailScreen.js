/**
 * SurahDetailScreen — displays ayahs with Arabic text + translation, and audio playback.
 */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useTheme} from '../context/ThemeContext';
import {fetchSurah, getAudioUrl, RECITERS} from '../services/quranService';

export default function SurahDetailScreen() {
  const {theme} = useTheme();
  const s = styles(theme);
  const route = useRoute();
  const {surahNumber} = route.params;

  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);

  useEffect(() => {
    fetchSurah(surahNumber)
      .then(setSurah)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [surahNumber]);

  const handleAudioPress = ayah => {
    // In a real app, use react-native-sound or react-native-track-player
    const url = getAudioUrl(surahNumber, ayah.numberInSurah, selectedReciter.id);
    Alert.alert(
      `🔊 ${selectedReciter.name}`,
      `Playing Ayah ${ayah.numberInSurah}\n\n${url}`,
      [{text: 'Close'}],
    );
    setPlayingAyah(playingAyah === ayah.numberInSurah ? null : ayah.numberInSurah);
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={s.loadingText}>Loading Surah…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  const renderAyah = ({item}) => (
    <View style={s.ayahContainer}>
      <View style={s.ayahHeader}>
        <View style={s.ayahNumberBadge}>
          <Text style={s.ayahNumber}>{item.numberInSurah}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleAudioPress(item)}
          style={s.audioBtn}>
          <Text style={s.audioBtnText}>
            {playingAyah === item.numberInSurah ? '⏹' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={s.arabicText}>{item.text}</Text>
      {showTranslation && item.translation ? (
        <Text style={s.translationText}>{item.translation}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={s.container}>
      {/* Header controls */}
      <View style={s.controls}>
        <TouchableOpacity
          style={s.toggleBtn}
          onPress={() => setShowTranslation(!showTranslation)}>
          <Text style={s.toggleBtnText}>
            {showTranslation ? 'Hide' : 'Show'} Translation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.toggleBtn}
          onPress={() => {
            const idx = RECITERS.findIndex(r => r.id === selectedReciter.id);
            setSelectedReciter(RECITERS[(idx + 1) % RECITERS.length]);
          }}>
          <Text style={s.toggleBtnText} numberOfLines={1}>
            🎙 {selectedReciter.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bismillah header (except Al-Fatiha and At-Tawbah) */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <Text style={s.bismillah}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      )}

      <FlatList
        data={surah?.ayahs}
        keyExtractor={item => String(item.number)}
        renderItem={renderAyah}
        contentContainerStyle={{paddingBottom: 40}}
      />
    </View>
  );
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {marginTop: 12, color: theme.colors.subText},
    errorText: {color: theme.colors.error, fontSize: 14},
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    toggleBtn: {
      backgroundColor: theme.colors.primary + '22',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      maxWidth: '48%',
    },
    toggleBtnText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    bismillah: {
      textAlign: 'center',
      fontSize: 20,
      color: theme.colors.primary,
      paddingVertical: 16,
      fontFamily: 'serif',
    },
    ayahContainer: {
      padding: 16,
      backgroundColor: theme.colors.card,
      marginHorizontal: 12,
      marginTop: 8,
      borderRadius: 12,
    },
    ayahHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    ayahNumberBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary + '22',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ayahNumber: {color: theme.colors.primary, fontSize: 13, fontWeight: '700'},
    audioBtn: {
      padding: 8,
      backgroundColor: theme.colors.secondary + '33',
      borderRadius: 20,
    },
    audioBtnText: {fontSize: 16},
    arabicText: {
      fontSize: 24,
      textAlign: 'right',
      color: theme.colors.text,
      lineHeight: 44,
      fontFamily: 'serif',
      marginBottom: 8,
    },
    translationText: {
      fontSize: 13,
      color: theme.colors.subText,
      lineHeight: 20,
      fontStyle: 'italic',
    },
  });
