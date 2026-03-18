import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../context/ThemeContext';
import {fetchHadithChapters} from '../services/hadithService';

const API_KEY_STORAGE = '@noor_hadith_api_key';

const HadithBookScreen = ({route, navigation}) => {
  const {book} = route.params;
  const {theme} = useTheme();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const styles = createStyles(theme);

  useEffect(() => {
    navigation.setOptions({title: book.name});
    loadChapters();
  }, [book.id]);

  const loadChapters = async () => {
    try {
      setError(null);
      const apiKey = await AsyncStorage.getItem(API_KEY_STORAGE);
      if (!apiKey) {
        setError('Hadith API key not configured. Please set it in Settings.');
        setLoading(false);
        return;
      }
      const data = await fetchHadithChapters(book.slug, apiKey);
      setChapters(data || []);
    } catch (err) {
      setError('Failed to load chapters. Please check your connection and API key.');
      console.error('HadithBook error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = chapter => {
    navigation.navigate('HadithList', {book, chapter});
  };

  const renderChapter = ({item}) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => handleChapterPress(item)}
      activeOpacity={0.7}
      accessibilityLabel={`Chapter ${item.chapterNumber}: ${item.chapterEnglish}`}
      accessibilityRole="button">
      <View style={styles.chapterNumber}>
        <Text style={styles.numberText}>{item.chapterNumber}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterName}>{item.chapterEnglish}</Text>
        <Text style={styles.chapterArabic}>{item.chapterArabic}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading chapters...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📚</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsBtnText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        keyExtractor={item => String(item.chapterId || item.chapterNumber)}
        renderItem={renderChapter}
        contentContainerStyle={styles.list}
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
      padding: 24,
    },
    loadingText: {
      marginTop: 12,
      color: theme.textSecondary,
      fontSize: 15,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorText: {
      color: theme.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 16,
    },
    settingsBtn: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    settingsBtnText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 15,
    },
    list: {
      padding: 12,
      paddingBottom: 24,
    },
    chapterCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 14,
      marginVertical: 5,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.07,
      shadowRadius: 2,
      elevation: 2,
    },
    chapterNumber: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.prayerBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    numberText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.primary,
    },
    chapterInfo: {
      flex: 1,
    },
    chapterName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },
    chapterArabic: {
      fontSize: 14,
      color: theme.arabicText,
      marginTop: 2,
    },
    chevron: {
      fontSize: 22,
      color: theme.textSecondary,
    },
  });

export default HadithBookScreen;
