import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../context/ThemeContext';
import HadithCard from '../components/HadithCard';
import {fetchHadithsByChapter} from '../services/hadithService';

const API_KEY_STORAGE = '@noor_hadith_api_key';

const HadithListScreen = ({route, navigation}) => {
  const {book, chapter} = route.params;
  const {theme} = useTheme();
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const styles = createStyles(theme);

  useEffect(() => {
    navigation.setOptions({title: chapter.chapterEnglish || chapter.chapterArabic});
    loadHadiths(1, true);
  }, [chapter.chapterNumber]);

  const loadHadiths = async (pageNum = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }
      const apiKey = await AsyncStorage.getItem(API_KEY_STORAGE);
      if (!apiKey) {
        setError('Hadith API key not configured.');
        return;
      }
      const result = await fetchHadithsByChapter(book.slug, chapter.chapterNumber, apiKey, pageNum);
      const data = result?.data || [];
      setHadiths(prev => (reset ? data : [...prev, ...data]));
      setHasMore(result?.next_page_url !== null);
    } catch (err) {
      setError('Failed to load Hadiths.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadHadiths(nextPage);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return <ActivityIndicator size="small" color={theme.primary} style={styles.footerLoader} />;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={hadiths}
      keyExtractor={item => String(item.id || item.hadithNumber)}
      renderItem={({item}) => <HadithCard hadith={item} />}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
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
      padding: 24,
    },
    errorText: {
      color: theme.textSecondary,
      fontSize: 15,
      textAlign: 'center',
    },
    list: {
      padding: 12,
      paddingBottom: 24,
    },
    footerLoader: {
      marginVertical: 16,
    },
  });

export default HadithListScreen;
