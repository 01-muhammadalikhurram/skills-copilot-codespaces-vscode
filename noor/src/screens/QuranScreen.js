import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import SurahCard from '../components/SurahCard';
import {fetchSurahs} from '../services/quranService';

const QuranScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const styles = createStyles(theme);

  const loadSurahs = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (err) {
      setError('Failed to load Surahs. Please check your connection.');
      console.error('Quran screen error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSurahs();
  }, [loadSurahs]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSurahs(surahs);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = surahs.filter(
      s =>
        s.name_simple?.toLowerCase().includes(query) ||
        s.translated_name?.name?.toLowerCase().includes(query) ||
        String(s.id) === query,
    );
    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  const handleSurahPress = surah => {
    navigation.navigate('SurahDetail', {surah});
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Quran...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📖</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadSurahs}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Surah by name or number..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          accessibilityLabel="Search Surah"
        />
      </View>

      {/* Surah list */}
      <FlatList
        data={filteredSurahs}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <SurahCard surah={item} onPress={handleSurahPress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Surahs found for "{searchQuery}"</Text>
          </View>
        }
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
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 16,
    },
    retryBtn: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 15,
    },
    searchContainer: {
      padding: 12,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchInput: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.text,
    },
    list: {
      padding: 12,
      paddingBottom: 24,
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 15,
    },
  });

export default QuranScreen;
