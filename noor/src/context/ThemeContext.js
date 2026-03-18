import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@noor_theme';

export const lightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  accent: '#FFD700',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  statusBar: 'dark-content',
  tabBar: '#FFFFFF',
  tabBarActive: '#1B5E20',
  tabBarInactive: '#9E9E9E',
  shadow: '#000000',
  arabicText: '#1B5E20',
  verseNumber: '#FFD700',
  hadithText: '#212121',
  prayerTime: '#1B5E20',
  prayerBackground: '#E8F5E9',
  nextPrayer: '#1B5E20',
};

export const darkTheme = {
  mode: 'dark',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  primary: '#4CAF50',
  primaryLight: '#81C784',
  accent: '#FFD700',
  text: '#FFFFFF',
  textSecondary: '#BDBDBD',
  border: '#424242',
  statusBar: 'light-content',
  tabBar: '#1E1E1E',
  tabBarActive: '#4CAF50',
  tabBarInactive: '#757575',
  shadow: '#000000',
  arabicText: '#81C784',
  verseNumber: '#FFD700',
  hadithText: '#FFFFFF',
  prayerTime: '#4CAF50',
  prayerBackground: '#1A2E1A',
  nextPrayer: '#4CAF50',
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, isDark, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
