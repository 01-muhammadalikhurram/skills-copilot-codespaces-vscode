/**
 * AppNavigator — bottom-tab navigation with stack navigators for each section.
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'react-native';

import {useTheme} from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QuranScreen from '../screens/QuranScreen';
import SurahDetailScreen from '../screens/SurahDetailScreen';
import HadithScreen from '../screens/HadithScreen';
import HadithDetailScreen from '../screens/HadithDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const QuranStack = createNativeStackNavigator();
const HadithStack = createNativeStackNavigator();

function TabIcon({name, color, size = 22}) {
  // Simple emoji-based icons; replace with react-native-vector-icons if desired
  const icons = {
    Home: '🕌',
    Prayer: '🕐',
    Quran: '📖',
    Hadith: '📚',
    Settings: '⚙️',
  };
  return <Text style={{fontSize: size, color}}>{icons[name] || '•'}</Text>;
}

function QuranStackNavigator() {
  const {theme} = useTheme();
  return (
    <QuranStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.card},
        headerTintColor: theme.colors.text,
      }}>
      <QuranStack.Screen
        name="QuranList"
        component={QuranScreen}
        options={{title: 'Quran'}}
      />
      <QuranStack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={({route}) => ({title: route.params?.surahName || 'Surah'})}
      />
    </QuranStack.Navigator>
  );
}

function HadithStackNavigator() {
  const {theme} = useTheme();
  return (
    <HadithStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.card},
        headerTintColor: theme.colors.text,
      }}>
      <HadithStack.Screen
        name="HadithList"
        component={HadithScreen}
        options={{title: 'Hadith'}}
      />
      <HadithStack.Screen
        name="HadithDetail"
        component={HadithDetailScreen}
        options={({route}) => ({title: route.params?.bookName || 'Hadith'})}
      />
    </HadithStack.Navigator>
  );
}

export default function AppNavigator() {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => (
          <TabIcon name={route.name} color={color} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {backgroundColor: theme.colors.card},
        headerTintColor: theme.colors.text,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Noor', tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Prayer"
        component={PrayerTimesScreen}
        options={{title: 'Prayer Times', tabBarLabel: 'Prayer'}}
      />
      <Tab.Screen
        name="Quran"
        component={QuranStackNavigator}
        options={{headerShown: false, tabBarLabel: 'Quran'}}
      />
      <Tab.Screen
        name="Hadith"
        component={HadithStackNavigator}
        options={{headerShown: false, tabBarLabel: 'Hadith'}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings', tabBarLabel: 'Settings'}}
      />
    </Tab.Navigator>
  );
}

