import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const SurahCard = ({surah, onPress}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(surah)}
      activeOpacity={0.7}
      accessibilityLabel={`Surah ${surah.name_simple}, ${surah.verses_count} verses`}
      accessibilityRole="button">
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{surah.id}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{surah.name_simple}</Text>
        <Text style={styles.englishName}>{surah.translated_name?.name}</Text>
        <Text style={styles.meta}>
          {surah.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} •{' '}
          {surah.verses_count} verses
        </Text>
      </View>
      <Text style={styles.arabicName}>{surah.name_arabic}</Text>
    </TouchableOpacity>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginVertical: 5,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    numberContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.prayerBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    number: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    englishName: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 1,
    },
    meta: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    arabicName: {
      fontSize: 22,
      color: theme.arabicText,
      fontWeight: '400',
      marginLeft: 8,
    },
  });

export default SurahCard;
