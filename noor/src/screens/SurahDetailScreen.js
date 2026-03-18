import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Sound from 'react-native-sound';
import {useTheme} from '../context/ThemeContext';
import VerseCard from '../components/VerseCard';
import {fetchSurahVerses, getVerseAudioUrl, RECITERS} from '../services/quranService';

Sound.setCategory('Playback');

const SurahDetailScreen = ({route, navigation}) => {
  const {surah} = route.params;
  const {theme} = useTheme();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentVerseKey, setCurrentVerseKey] = useState(null);
  const soundRef = useRef(null);
  const selectedReciter = RECITERS[0]; // Default to Mishary Alafasy

  const styles = createStyles(theme);

  useEffect(() => {
    navigation.setOptions({title: surah.name_simple});
    loadVerses(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [surah.id, surah.name_simple]);

  const loadVerses = async (pageNum = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const result = await fetchSurahVerses(surah.id, 131, pageNum);
      const newVerses = result.verses || [];
      setVerses(prev => (reset ? newVerses : [...prev, ...newVerses]));
      setHasMore(result.pagination?.next_page !== null);
    } catch (err) {
      Alert.alert('Error', 'Failed to load verses. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadVerses(nextPage);
    }
  };

  const playVerse = (verseKey) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    if (currentVerseKey === verseKey && playing) {
      setPlaying(false);
      setCurrentVerseKey(null);
      return;
    }

    const audioUrl = getVerseAudioUrl(selectedReciter.id, verseKey);
    setCurrentVerseKey(verseKey);
    setPlaying(true);

    const sound = new Sound(audioUrl, '', error => {
      if (error) {
        console.error('Audio load error:', error);
        setPlaying(false);
        return;
      }
      sound.play(success => {
        if (success) {
          setPlaying(false);
          setCurrentVerseKey(null);
        }
      });
    });

    soundRef.current = sound;
  };

  const renderVerse = ({item}) => (
    <View>
      <VerseCard verse={item} showTranslation />
      <TouchableOpacity
        style={[
          styles.playBtn,
          currentVerseKey === item.verse_key && playing && styles.playBtnActive,
        ]}
        onPress={() => playVerse(item.verse_key)}
        accessibilityLabel={`Play verse ${item.verse_key}`}>
        <Text style={styles.playBtnText}>
          {currentVerseKey === item.verse_key && playing ? '⏸ Pause' : '▶ Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <ActivityIndicator
        size="small"
        color={theme.primary}
        style={styles.footerLoader}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Surah Header */}
      <View style={styles.surahHeader}>
        <Text style={styles.surahName}>{surah.name_arabic}</Text>
        <Text style={styles.surahMeta}>
          {surah.name_simple} • {surah.verses_count} verses •{' '}
          {surah.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
        </Text>
        <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
      </View>

      <FlatList
        data={verses}
        keyExtractor={item => item.id?.toString() || item.verse_key}
        renderItem={renderVerse}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    surahHeader: {
      backgroundColor: theme.primary,
      padding: 20,
      alignItems: 'center',
    },
    surahName: {
      fontSize: 32,
      color: '#FFFFFF',
      fontWeight: '300',
    },
    surahMeta: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 4,
    },
    bismillah: {
      fontSize: 20,
      color: '#FFFFFF',
      marginTop: 12,
      textAlign: 'center',
    },
    list: {
      padding: 12,
      paddingBottom: 24,
    },
    playBtn: {
      alignSelf: 'flex-end',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.prayerBackground,
      marginBottom: 8,
      marginRight: 4,
    },
    playBtnActive: {
      backgroundColor: theme.primary,
    },
    playBtnText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    footerLoader: {
      marginVertical: 16,
    },
  });

export default SurahDetailScreen;
