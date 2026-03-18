import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

/**
 * Displays a single Hadith with Arabic text and translation.
 */
const HadithCard = ({hadith}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.hadithNumber}>#{hadith.hadithNumber}</Text>
        <Text style={styles.grade} numberOfLines={1}>
          {hadith.grades?.[0]?.grade || ''}
        </Text>
      </View>
      {hadith.hadithArabic ? (
        <Text style={styles.arabicText}>{hadith.hadithArabic}</Text>
      ) : null}
      <View style={styles.divider} />
      <Text style={styles.englishText}>{hadith.hadithEnglish}</Text>
      {hadith.book?.bookName ? (
        <Text style={styles.narrator}>
          Narrated by: {hadith.englishNarrator || ''}
        </Text>
      ) : null}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    hadithNumber: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.primary,
    },
    grade: {
      fontSize: 12,
      color: theme.accent,
      maxWidth: '60%',
    },
    arabicText: {
      fontSize: 18,
      lineHeight: 32,
      textAlign: 'right',
      color: theme.arabicText,
      marginBottom: 12,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 10,
    },
    englishText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.hadithText,
    },
    narrator: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
  });

export default HadithCard;
