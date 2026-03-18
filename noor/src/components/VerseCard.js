import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

/**
 * Displays a single Quran verse with Arabic text and translation.
 */
const VerseCard = ({verse, showTranslation = true}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // The Quran.com API sometimes wraps text in HTML tags. Since React Native renders
  // text as plain strings (not in a DOM/WebView), we strip angle-bracket characters
  // directly to clean up any markup.
  const rawTranslation = verse.translations?.[0]?.text || '';
  const translation = rawTranslation.split('<').join('').split('>').join('') || '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.verseNumberBadge}>
          <Text style={styles.verseNumber}>{verse.verse_number || verse.id}</Text>
        </View>
        <Text style={styles.verseKey}>{verse.verse_key}</Text>
      </View>
      <Text style={styles.arabicText}>{verse.text_uthmani}</Text>
      {showTranslation && translation ? (
        <Text style={styles.translation}>{translation}</Text>
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
      alignItems: 'center',
      marginBottom: 12,
    },
    verseNumberBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.prayerBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    verseNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary,
    },
    verseKey: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    arabicText: {
      fontSize: 24,
      lineHeight: 42,
      textAlign: 'right',
      color: theme.arabicText,
      fontFamily: 'System',
      marginBottom: 12,
    },
    translation: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
  });

export default VerseCard;
