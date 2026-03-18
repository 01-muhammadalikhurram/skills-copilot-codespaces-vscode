import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const PrayerCard = ({prayerName, time, isNext = false, onPress}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme, isNext);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${prayerName} prayer at ${time}`}
      accessibilityRole="button">
      <View style={styles.leftSection}>
        <Text style={styles.prayerName}>{prayerName}</Text>
        {isNext && <Text style={styles.nextLabel}>Next Prayer</Text>}
      </View>
      <Text style={styles.time}>{time}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme, isNext) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isNext ? theme.primary : theme.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 6,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    leftSection: {
      flex: 1,
    },
    prayerName: {
      fontSize: 18,
      fontWeight: '600',
      color: isNext ? '#FFFFFF' : theme.text,
    },
    nextLabel: {
      fontSize: 12,
      color: isNext ? 'rgba(255,255,255,0.8)' : theme.textSecondary,
      marginTop: 2,
    },
    time: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isNext ? '#FFFFFF' : theme.prayerTime,
    },
  });

export default PrayerCard;
