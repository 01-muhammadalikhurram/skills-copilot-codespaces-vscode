/**
 * ThemeContext — provides light/dark theme values and a toggle throughout the app.
 */
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@noor_theme';

export const lightTheme = {
  dark: false,
  colors: {
    primary: '#1a7f4b',       // Islamic green
    secondary: '#c9a84c',     // Gold accent
    background: '#f8f5f0',
    card: '#ffffff',
    text: '#1a1a1a',
    subText: '#666666',
    border: '#e0dbd0',
    prayerCard: '#ffffff',
    success: '#28a745',
    error: '#dc3545',
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: '#2ecc71',
    secondary: '#f0c040',
    background: '#121212',
    card: '#1e1e1e',
    text: '#f0f0f0',
    subText: '#aaaaaa',
    border: '#333333',
    prayerCard: '#1e1e1e',
    success: '#2ecc71',
    error: '#e74c3c',
  },
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({children}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value !== null) {
        setIsDark(value === 'dark');
      }
    });
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, isDark, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
