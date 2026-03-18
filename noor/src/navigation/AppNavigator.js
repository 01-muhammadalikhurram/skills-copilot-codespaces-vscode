import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'react-native';
import {useTheme} from '../context/ThemeContext';

// Screens
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QuranScreen from '../screens/QuranScreen';
import SurahDetailScreen from '../screens/SurahDetailScreen';
import HadithScreen from '../screens/HadithScreen';
import HadithBookScreen from '../screens/HadithBookScreen';
import HadithListScreen from '../screens/HadithListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const QuranStack = createNativeStackNavigator();
const HadithStack = createNativeStackNavigator();

const TAB_ICONS = {
  PrayerTimes: '🕌',
  Quran: '📖',
  Hadith: '📚',
  Settings: '⚙️',
};

const QuranNavigator = () => {
  const {theme} = useTheme();
  return (
    <QuranStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.primary},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: '700'},
      }}>
      <QuranStack.Screen
        name="QuranList"
        component={QuranScreen}
        options={{title: 'Quran'}}
      />
      <QuranStack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={{title: 'Surah'}}
      />
    </QuranStack.Navigator>
  );
};

const HadithNavigator = () => {
  const {theme} = useTheme();
  return (
    <HadithStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.primary},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: '700'},
      }}>
      <HadithStack.Screen
        name="HadithBooks"
        component={HadithScreen}
        options={{title: 'Hadith'}}
      />
      <HadithStack.Screen
        name="HadithBook"
        component={HadithBookScreen}
        options={{title: 'Chapters'}}
      />
      <HadithStack.Screen
        name="HadithList"
        component={HadithListScreen}
        options={{title: 'Hadiths'}}
      />
    </HadithStack.Navigator>
  );
};

const AppNavigator = () => {
  const {theme} = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => (
            <Text style={{fontSize: focused ? 26 : 22}}>
              {TAB_ICONS[route.name]}
            </Text>
          ),
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.border,
          },
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {fontWeight: '700'},
        })}>
        <Tab.Screen
          name="PrayerTimes"
          component={PrayerTimesScreen}
          options={{title: 'Prayer Times', tabBarLabel: 'Prayers'}}
        />
        <Tab.Screen
          name="Quran"
          component={QuranNavigator}
          options={{headerShown: false, tabBarLabel: 'Quran'}}
        />
        <Tab.Screen
          name="Hadith"
          component={HadithNavigator}
          options={{headerShown: false, tabBarLabel: 'Hadith'}}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings', tabBarLabel: 'Settings'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
