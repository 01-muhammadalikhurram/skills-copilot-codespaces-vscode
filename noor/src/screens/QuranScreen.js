/**
 * QuranScreen — lists all 114 Surahs with search.
 */
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
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../context/ThemeContext';
import {fetchSurahList} from '../services/quranService';
import SurahListItem from '../components/SurahListItem';

export default function QuranScreen() {
  const {theme} = useTheme();
  const s = styles(theme);
  const navigation = useNavigation();

  const [surahs, setSurahs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahList()
      .then(data => {
        setSurahs(data);
        setFiltered(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = useCallback(
    text => {
      setQuery(text);
      if (!text.trim()) {
        setFiltered(surahs);
        return;
      }
      const q = text.toLowerCase();
      setFiltered(
        surahs.filter(
          s =>
            s.englishName.toLowerCase().includes(q) ||
            s.englishNameTranslation.toLowerCase().includes(q) ||
            String(s.number).includes(q),
        ),
      );
    },
    [surahs],
  );

  const onSelectSurah = surah => {
    navigation.navigate('SurahDetail', {
      surahNumber: surah.number,
      surahName: `${surah.number}. ${surah.englishName}`,
    });
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={s.loadingText}>Loading Surahs…</Text>
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

  return (
    <View style={s.container}>
      <TextInput
        style={s.searchInput}
        placeholder="Search Surah…"
        placeholderTextColor={theme.colors.subText}
        value={query}
        onChangeText={onSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.number)}
        renderItem={({item}) => (
          <SurahListItem surah={item} onPress={() => onSelectSurah(item)} theme={theme} />
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background},
    loadingText: {marginTop: 12, color: theme.colors.subText},
    errorText: {color: theme.colors.error, fontSize: 14},
    searchInput: {
      margin: 12,
      padding: 10,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      fontSize: 15,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 16,
    },
  });
