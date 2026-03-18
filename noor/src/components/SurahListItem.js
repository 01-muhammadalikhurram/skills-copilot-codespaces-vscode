/**
 * SurahListItem — a single row in the Quran Surah list.
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function SurahListItem({surah, onPress, theme}) {
  const s = styles(theme);
  return (
    <TouchableOpacity style={s.container} onPress={onPress} activeOpacity={0.65}>
      <View style={s.numberBadge}>
        <Text style={s.number}>{surah.number}</Text>
      </View>
      <View style={s.info}>
        <Text style={s.englishName}>{surah.englishName}</Text>
        <Text style={s.translation}>{surah.englishNameTranslation}</Text>
        <Text style={s.meta}>
          {surah.revelationType} · {surah.numberOfAyahs} Ayahs
        </Text>
      </View>
      <Text style={s.arabicName}>{surah.name}</Text>
    </TouchableOpacity>
  );
}

const styles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    numberBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    number: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    info: {flex: 1},
    englishName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 2,
    },
    translation: {
      fontSize: 12,
      color: theme.colors.subText,
      marginBottom: 2,
    },
    meta: {
      fontSize: 11,
      color: theme.colors.subText,
    },
    arabicName: {
      fontSize: 20,
      color: theme.colors.primary,
      fontFamily: 'serif',
      marginLeft: 8,
    },
  });
