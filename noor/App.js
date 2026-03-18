/**
 * Noor - Islamic Companion App
 * A comprehensive Islamic app featuring Prayer Times, Quran, and Hadith
 */

import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import {configurePushNotifications} from './src/utils/notifications';

const AppContent = () => {
  const {theme} = useTheme();

  useEffect(() => {
    configurePushNotifications();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.primary}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
