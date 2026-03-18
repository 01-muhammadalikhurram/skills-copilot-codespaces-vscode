/**
 * HadithDetailScreen — lists chapters then hadiths for a selected book.
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useTheme} from '../context/ThemeContext';
import {fetchChapters, fetchHadiths} from '../services/hadithService';
import HadithCard from '../components/HadithCard';

export default function HadithDetailScreen() {
  const {theme} = useTheme();
  const s = styles(theme);
  const route = useRoute();
  const {bookSlug, bookName} = route.params;

  const [chapters, setChapters] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [hadithsLoading, setHadithsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchChapters(bookSlug)
      .then(data => {
        setChapters(data || []);
        if (data && data.length > 0) {
          setSelectedChapter(data[0]);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setChaptersLoading(false));
  }, [bookSlug]);

  useEffect(() => {
    if (!selectedChapter) {
      return;
    }
    setHadithsLoading(true);
    setHadiths([]);
    fetchHadiths(bookSlug, selectedChapter.chapterId || selectedChapter.id, 1)
      .then(data => setHadiths(data?.data || data || []))
      .catch(err => setError(err.message))
      .finally(() => setHadithsLoading(false));
  }, [selectedChapter, bookSlug]);

  if (chaptersLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={s.loadingText}>Loading chapters…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>⚠️ {error}</Text>
        <Text style={s.hintText}>
          Make sure your Hadith API key is configured in src/services/hadithService.js
        </Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Chapter selector */}
      <TouchableOpacity
        style={s.chapterSelector}
        onPress={() => setShowChapterModal(true)}>
        <Text style={s.chapterLabel}>Chapter:</Text>
        <Text style={s.chapterName} numberOfLines={1}>
          {selectedChapter?.chapterEnglish || selectedChapter?.englishName || 'Select…'}
        </Text>
        <Text style={s.chevron}>▾</Text>
      </TouchableOpacity>

      {/* Hadith list */}
      {hadithsLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={hadiths}
          keyExtractor={(item, idx) => String(item.id || idx)}
          renderItem={({item}) => <HadithCard hadith={item} theme={theme} />}
          contentContainerStyle={{padding: 12, paddingBottom: 40}}
          ListEmptyComponent={
            <Text style={s.emptyText}>No hadiths found for this chapter.</Text>
          }
        />
      )}

      {/* Chapter picker modal */}
      <Modal
        visible={showChapterModal}
        animationType="slide"
        onRequestClose={() => setShowChapterModal(false)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{bookName} — Chapters</Text>
            <TouchableOpacity onPress={() => setShowChapterModal(false)}>
              <Text style={s.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={chapters}
            keyExtractor={(item, idx) => String(item.id || idx)}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  s.chapterItem,
                  selectedChapter?.id === item.id && s.chapterItemActive,
                ]}
                onPress={() => {
                  setSelectedChapter(item);
                  setShowChapterModal(false);
                }}>
                <Text style={s.chapterItemNumber}>{item.chapterId || item.id}</Text>
                <Text style={s.chapterItemText} numberOfLines={2}>
                  {item.chapterEnglish || item.englishName || ''}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    loadingText: {marginTop: 12, color: theme.colors.subText},
    errorText: {color: theme.colors.error, fontSize: 15, textAlign: 'center', marginBottom: 8},
    hintText: {color: theme.colors.subText, fontSize: 12, textAlign: 'center'},
    emptyText: {
      color: theme.colors.subText,
      textAlign: 'center',
      marginTop: 40,
      fontStyle: 'italic',
    },
    chapterSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chapterLabel: {
      fontSize: 13,
      color: theme.colors.subText,
      marginRight: 6,
    },
    chapterName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    chevron: {fontSize: 18, color: theme.colors.subText},
    modal: {flex: 1, backgroundColor: theme.colors.background},
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
    },
    modalClose: {fontSize: 18, color: theme.colors.subText, padding: 4},
    chapterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chapterItemActive: {backgroundColor: theme.colors.primary + '18'},
    chapterItemNumber: {
      width: 36,
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    chapterItemText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    },
  });
