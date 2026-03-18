/**
 * SettingsScreen — theme toggle, calculation method, notification preferences.
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from '../context/ThemeContext';
import {cancelAllReminders} from '../utils/notifications';

const METHODS = [
  {id: 1, name: 'Muslim World League'},
  {id: 2, name: 'ISNA (North America)'},
  {id: 3, name: 'Egypt'},
  {id: 4, name: 'Makkah (Umm Al-Qura)'},
  {id: 5, name: 'Karachi'},
  {id: 7, name: 'Tehran'},
  {id: 8, name: 'Gulf'},
  {id: 12, name: 'Turkey'},
];

const NOTIFICATION_OPTIONS = [
  {label: 'At prayer time', value: 0},
  {label: '5 minutes before', value: 5},
  {label: '10 minutes before', value: 10},
  {label: '15 minutes before', value: 15},
  {label: '30 minutes before', value: 30},
];

const SETTINGS_KEY = '@noor_settings';

export default function SettingsScreen() {
  const {theme, isDark, toggleTheme} = useTheme();
  const s = styles(theme);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultReminder, setDefaultReminder] = useState(15);
  const [selectedMethod, setSelectedMethod] = useState(2);
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(val => {
      if (val) {
        const saved = JSON.parse(val);
        setNotificationsEnabled(saved.notificationsEnabled ?? true);
        setDefaultReminder(saved.defaultReminder ?? 15);
        setSelectedMethod(saved.selectedMethod ?? 2);
      }
    });
  }, []);

  const saveSettings = async updates => {
    const current = {notificationsEnabled, defaultReminder, selectedMethod};
    const next = {...current, ...updates};
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const handleNotificationsToggle = async val => {
    setNotificationsEnabled(val);
    await saveSettings({notificationsEnabled: val});
    if (!val) {
      cancelAllReminders();
    }
  };

  const handleMethodSelect = async method => {
    setSelectedMethod(method.id);
    setShowMethodPicker(false);
    await saveSettings({selectedMethod: method.id});
  };

  const handleReminderSelect = async val => {
    setDefaultReminder(val);
    await saveSettings({defaultReminder: val});
  };

  const currentMethod = METHODS.find(m => m.id === selectedMethod) || METHODS[0];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Appearance */}
      <Text style={s.sectionTitle}>Appearance</Text>
      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.rowLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{false: '#ccc', true: theme.colors.primary}}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Prayer Times */}
      <Text style={s.sectionTitle}>Prayer Times</Text>
      <View style={s.card}>
        <TouchableOpacity
          style={s.row}
          onPress={() => setShowMethodPicker(!showMethodPicker)}>
          <Text style={s.rowLabel}>Calculation Method</Text>
          <Text style={s.rowValue}>{currentMethod.name}</Text>
        </TouchableOpacity>

        {showMethodPicker && (
          <View style={s.picker}>
            {METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  s.pickerItem,
                  selectedMethod === method.id && s.pickerItemActive,
                ]}
                onPress={() => handleMethodSelect(method)}>
                <Text
                  style={[
                    s.pickerItemText,
                    selectedMethod === method.id && s.pickerItemTextActive,
                  ]}>
                  {method.name}
                </Text>
                {selectedMethod === method.id && (
                  <Text style={s.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Notifications */}
      <Text style={s.sectionTitle}>Notifications</Text>
      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.rowLabel}>Prayer Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{false: '#ccc', true: theme.colors.primary}}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {notificationsEnabled && (
          <View>
            <Text style={s.subLabel}>Default reminder time</Text>
            {NOTIFICATION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  s.pickerItem,
                  defaultReminder === opt.value && s.pickerItemActive,
                ]}
                onPress={() => handleReminderSelect(opt.value)}>
                <Text
                  style={[
                    s.pickerItemText,
                    defaultReminder === opt.value && s.pickerItemTextActive,
                  ]}>
                  {opt.label}
                </Text>
                {defaultReminder === opt.value && (
                  <Text style={s.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* About */}
      <Text style={s.sectionTitle}>About</Text>
      <View style={s.card}>
        <View style={s.aboutRow}>
          <Text style={s.aboutTitle}>Noor — نور</Text>
          <Text style={s.aboutSubtitle}>Version 1.0.0</Text>
        </View>
        <Text style={s.aboutDesc}>
          Noor is an open-source Islamic companion app providing prayer times,
          Quran, Hadith, and more. May Allah accept this effort.
        </Text>
      </View>

      <Text style={s.credit}>
        Prayer times: aladhan.com · Quran: alquran.cloud · Hadith: hadithapi.com
      </Text>
    </ScrollView>
  );
}

const styles = theme =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    content: {padding: 16, paddingBottom: 40},
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.subText,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 20,
      marginBottom: 8,
      marginLeft: 4,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLabel: {fontSize: 15, color: theme.colors.text},
    rowValue: {fontSize: 13, color: theme.colors.primary, maxWidth: '55%', textAlign: 'right'},
    subLabel: {
      fontSize: 12,
      color: theme.colors.subText,
      padding: 12,
      paddingBottom: 4,
      fontStyle: 'italic',
    },
    picker: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pickerItemActive: {backgroundColor: theme.colors.primary + '15'},
    pickerItemText: {flex: 1, fontSize: 14, color: theme.colors.text},
    pickerItemTextActive: {color: theme.colors.primary, fontWeight: '600'},
    checkmark: {color: theme.colors.primary, fontSize: 16, fontWeight: '700'},
    aboutRow: {flexDirection: 'row', justifyContent: 'space-between', padding: 14, paddingBottom: 0},
    aboutTitle: {fontSize: 16, fontWeight: '700', color: theme.colors.text},
    aboutSubtitle: {fontSize: 12, color: theme.colors.subText, alignSelf: 'center'},
    aboutDesc: {
      fontSize: 13,
      color: theme.colors.subText,
      padding: 14,
      paddingTop: 6,
      lineHeight: 20,
    },
    credit: {
      fontSize: 10,
      color: theme.colors.subText,
      textAlign: 'center',
      marginTop: 24,
      fontStyle: 'italic',
    },
  });
