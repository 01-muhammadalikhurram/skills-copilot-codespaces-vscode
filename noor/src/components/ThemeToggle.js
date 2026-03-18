import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const ThemeToggle = () => {
  const {theme, isDark, toggleTheme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>☀️</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{false: '#E0E0E0', true: theme.primary}}
        thumbColor={isDark ? theme.accent : '#FFFFFF'}
        ios_backgroundColor="#E0E0E0"
        accessibilityLabel="Toggle dark mode"
        accessibilityRole="switch"
      />
      <Text style={styles.label}>🌙</Text>
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    label: {
      fontSize: 18,
    },
  });

export default ThemeToggle;
