/**
 * HadithScreen — lists the six authentic Hadith books.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../context/ThemeContext';
import {HADITH_BOOKS} from '../services/hadithService';

const BOOK_COLORS = [
  '#1a7f4b',
  '#2980b9',
  '#8e44ad',
  '#c0392b',
  '#d35400',
  '#27ae60',
];

export default function HadithScreen() {
  const {theme} = useTheme();
  const s = styles(theme);
  const navigation = useNavigation();

  const renderBook = ({item, index}) => {
    const color = BOOK_COLORS[index % BOOK_COLORS.length];
    return (
      <TouchableOpacity
        style={[s.card, {borderLeftColor: color}]}
        onPress={() =>
          navigation.navigate('HadithDetail', {
            bookSlug: item.slug,
            bookName: item.name,
            bookId: item.id,
          })
        }
        activeOpacity={0.7}>
        <View style={[s.iconCircle, {backgroundColor: color + '22'}]}>
          <Text style={[s.icon, {color}]}>📚</Text>
        </View>
        <View style={s.bookInfo}>
          <Text style={s.bookName}>{item.name}</Text>
          <Text style={s.bookId}>{item.id}</Text>
        </View>
        <Text style={[s.arrow, {color}]}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      <Text style={s.headerNote}>Sihah Sitta — The Six Authentic Books</Text>
      <FlatList
        data={HADITH_BOOKS}
        keyExtractor={item => item.id}
        renderItem={renderBook}
        contentContainerStyle={s.list}
      />
    </View>
  );
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    headerNote: {
      fontSize: 13,
      color: theme.colors.subText,
      textAlign: 'center',
      paddingVertical: 12,
      fontStyle: 'italic',
    },
    list: {padding: 16, paddingTop: 0},
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    icon: {fontSize: 22},
    bookInfo: {flex: 1},
    bookName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 2,
    },
    bookId: {fontSize: 12, color: theme.colors.subText},
    arrow: {fontSize: 26, fontWeight: '300'},
  });
