import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const REMINDER_OPTIONS = [
  {label: 'Off', value: -1},
  {label: 'At prayer time', value: 0},
  {label: '5 min before', value: 5},
  {label: '10 min before', value: 10},
  {label: '15 min before', value: 15},
  {label: '30 min before', value: 30},
];

const REMINDER_SETTINGS_KEY = '@noor_reminder_settings';
const HADITH_API_KEY_STORAGE = '@noor_hadith_api_key';

const SettingsScreen = () => {
  const {theme, isDark} = useTheme();
  const [reminderSettings, setReminderSettings] = useState({
    Fajr: -1,
    Dhuhr: -1,
    Asr: -1,
    Maghrib: -1,
    Isha: -1,
  });
  const [hadithApiKey, setHadithApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const styles = createStyles(theme);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
      if (savedReminders) {
        setReminderSettings(JSON.parse(savedReminders));
      }
      const savedApiKey = await AsyncStorage.getItem(HADITH_API_KEY_STORAGE);
      if (savedApiKey) {
        setHadithApiKey(savedApiKey);
        setApiKeySaved(true);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateReminderSetting = async (prayer, value) => {
    const updated = {...reminderSettings, [prayer]: value};
    setReminderSettings(updated);
    try {
      await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
    }
  };

  const saveHadithApiKey = async () => {
    if (!hadithApiKey.trim()) {
      Alert.alert('Invalid', 'Please enter a valid API key.');
      return;
    }
    try {
      await AsyncStorage.setItem(HADITH_API_KEY_STORAGE, hadithApiKey.trim());
      setApiKeySaved(true);
      Alert.alert('Saved', 'Hadith API key saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key.');
    }
  };

  const clearHadithApiKey = async () => {
    try {
      await AsyncStorage.removeItem(HADITH_API_KEY_STORAGE);
      setHadithApiKey('');
      setApiKeySaved(false);
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  };

  const getReminderLabel = value => {
    const option = REMINDER_OPTIONS.find(o => o.value === value);
    return option?.label || 'Off';
  };

  const cycleReminderOption = prayer => {
    const currentValue = reminderSettings[prayer];
    const currentIndex = REMINDER_OPTIONS.findIndex(o => o.value === currentValue);
    const nextIndex = (currentIndex + 1) % REMINDER_OPTIONS.length;
    updateReminderSetting(prayer, REMINDER_OPTIONS[nextIndex].value);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowSubtitle}>
              {isDark ? 'Dark theme active' : 'Light theme active'}
            </Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      {/* Prayer Reminders Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prayer Reminders</Text>
        <Text style={styles.sectionSubtitle}>
          Tap a prayer to cycle through reminder options
        </Text>
        {PRAYER_NAMES.map(prayer => (
          <TouchableOpacity
            key={prayer}
            style={styles.row}
            onPress={() => cycleReminderOption(prayer)}
            activeOpacity={0.7}
            accessibilityLabel={`${prayer} reminder: ${getReminderLabel(reminderSettings[prayer])}`}
            accessibilityRole="button">
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{prayer}</Text>
              <Text style={styles.rowSubtitle}>
                {getReminderLabel(reminderSettings[prayer])}
              </Text>
            </View>
            <View
              style={[
                styles.reminderBadge,
                reminderSettings[prayer] >= 0 && styles.reminderBadgeActive,
              ]}>
              <Text
                style={[
                  styles.reminderBadgeText,
                  reminderSettings[prayer] >= 0 && styles.reminderBadgeTextActive,
                ]}>
                {reminderSettings[prayer] >= 0 ? '🔔' : '🔕'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hadith API Key Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hadith API Configuration</Text>
        <Text style={styles.sectionSubtitle}>
          Enter your API key from hadithapi.com to browse Hadiths
        </Text>
        <View style={styles.apiKeyContainer}>
          <TextInput
            style={styles.apiKeyInput}
            placeholder="Enter Hadith API key..."
            placeholderTextColor={theme.textSecondary}
            value={hadithApiKey}
            onChangeText={text => {
              setHadithApiKey(text);
              setApiKeySaved(false);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Hadith API key input"
          />
          <TouchableOpacity
            style={[styles.saveBtn, apiKeySaved && styles.savedBtn]}
            onPress={saveHadithApiKey}>
            <Text style={styles.saveBtnText}>{apiKeySaved ? '✓ Saved' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        {apiKeySaved && (
          <TouchableOpacity onPress={clearHadithApiKey} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear API Key</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.apiKeyInfo}>
          Get a free API key at{' '}
          <Text style={styles.link}>hadithapi.com</Text>
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>App Name</Text>
          <Text style={styles.aboutValue}>Noor (نور)</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Prayer Times</Text>
          <Text style={styles.aboutValue}>Aladhan API</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Quran Data</Text>
          <Text style={styles.aboutValue}>Quran.com API</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 14,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    rowLeft: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },
    rowSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    reminderBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reminderBadgeActive: {
      backgroundColor: theme.prayerBackground,
    },
    reminderBadgeText: {
      fontSize: 18,
    },
    reminderBadgeTextActive: {},
    apiKeyContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    apiKeyInput: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      fontSize: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    saveBtn: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    savedBtn: {
      backgroundColor: theme.primaryLight,
    },
    saveBtnText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    clearBtn: {
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    clearBtnText: {
      color: '#E53935',
      fontSize: 13,
    },
    apiKeyInfo: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    link: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    aboutLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    aboutValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
  });

export default SettingsScreen;
