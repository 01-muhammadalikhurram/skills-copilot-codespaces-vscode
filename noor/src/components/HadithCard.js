/**
 * HadithCard — displays a single Hadith with Arabic text + English translation.
 */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function HadithCard({hadith, theme}) {
  const [showArabic, setShowArabic] = useState(false);
  const s = styles(theme);

  const hadithNumber = hadith.hadithNumber || hadith.id;
  const arabicText = hadith.hadithArabic || hadith.arabic || '';
  const englishText = hadith.hadithEnglish || hadith.english || hadith.text || '';
  const grade = hadith.grades?.[0]?.grade || hadith.status || '';

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.numberBadge}>
          <Text style={s.number}>#{hadithNumber}</Text>
        </View>
        {grade ? <Text style={s.grade}>{grade}</Text> : null}
      </View>

      {arabicText ? (
        <>
          <TouchableOpacity
            onPress={() => setShowArabic(!showArabic)}
            style={s.toggleBtn}>
            <Text style={s.toggleBtnText}>
              {showArabic ? 'Hide Arabic' : 'Show Arabic'} ◀ عربي
            </Text>
          </TouchableOpacity>
          {showArabic && (
            <Text style={s.arabicText}>{arabicText}</Text>
          )}
        </>
      ) : null}

      <Text style={s.englishText}>{englishText}</Text>
    </View>
  );
}

const styles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    numberBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    number: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    grade: {
      fontSize: 11,
      color: theme.colors.success,
      fontStyle: 'italic',
    },
    toggleBtn: {
      marginBottom: 8,
      alignSelf: 'flex-end',
    },
    toggleBtnText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    arabicText: {
      fontSize: 18,
      textAlign: 'right',
      color: theme.colors.text,
      fontFamily: 'serif',
      lineHeight: 36,
      marginBottom: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    englishText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 22,
    },
  });
