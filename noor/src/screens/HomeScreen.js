/**
 * HomeScreen — welcome / dashboard landing screen.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

const FEATURES = [
  {
    icon: '🕐',
    title: 'Prayer Times',
    subtitle: 'Today\'s accurate prayer schedule',
    screen: 'Prayer',
  },
  {
    icon: '📖',
    title: 'Quran',
    subtitle: 'Read & listen to the Holy Quran',
    screen: 'Quran',
  },
  {
    icon: '📚',
    title: 'Hadith',
    subtitle: 'Browse the six authentic books',
    screen: 'Hadith',
  },
  {
    icon: '⚙️',
    title: 'Settings',
    subtitle: 'Notifications, theme & more',
    screen: 'Settings',
  },
];

export default function HomeScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const s = styles(theme);

  const greeting = getGreeting();

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Text style={s.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
        <Text style={s.greeting}>{greeting}</Text>
        <Text style={s.subtitle}>Welcome to Noor — نور</Text>
      </View>

      <View style={s.grid}>
        {FEATURES.map(item => (
          <TouchableOpacity
            key={item.screen}
            style={s.card}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}>
            <Text style={s.cardIcon}>{item.icon}</Text>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.footer}>
        <Text style={s.footerText}>
          "Indeed, with hardship comes ease." — Quran 94:6
        </Text>
      </View>
    </ScrollView>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning ☀️';
  }
  if (hour < 17) {
    return 'Good Afternoon 🌤';
  }
  return 'Good Evening 🌙';
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    content: {padding: 20, paddingBottom: 40},
    header: {alignItems: 'center', marginBottom: 32, marginTop: 8},
    bismillah: {
      fontSize: 22,
      color: theme.colors.primary,
      marginBottom: 12,
      fontFamily: 'serif',
    },
    greeting: {fontSize: 20, fontWeight: '600', color: theme.colors.text},
    subtitle: {
      fontSize: 14,
      color: theme.colors.subText,
      marginTop: 4,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    cardIcon: {fontSize: 36, marginBottom: 10},
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 11,
      color: theme.colors.subText,
      textAlign: 'center',
    },
    footer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    footerText: {
      fontSize: 13,
      color: theme.colors.subText,
      fontStyle: 'italic',
      lineHeight: 20,
    },
  });
