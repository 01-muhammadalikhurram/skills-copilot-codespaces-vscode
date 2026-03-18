/**
 * PrayerCard — displays a single prayer's name, time, and reminder controls.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function PrayerCard({
  prayer,
  time,
  isNext,
  reminderMinutes,
  reminderOptions,
  onReminderChange,
  theme,
}) {
  const [expanded, setExpanded] = useState(false);
  const s = styles(theme);

  return (
    <View style={[s.card, isNext && s.cardNext]}>
      <TouchableOpacity
        style={s.row}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}>
        <Text style={s.icon}>{prayer.icon}</Text>
        <View style={s.info}>
          <Text style={[s.name, isNext && s.nameNext]}>{prayer.label}</Text>
          <Text style={s.arabic}>{prayer.arabic}</Text>
        </View>
        <View style={s.rightSide}>
          <Text style={[s.time, isNext && s.timeNext]}>{time || '--:--'}</Text>
          {reminderMinutes !== undefined && (
            <View style={s.reminderBadge}>
              <Text style={s.reminderBadgeText}>
                🔔 {reminderMinutes === 0 ? 'At time' : `${reminderMinutes}m`}
              </Text>
            </View>
          )}
        </View>
        <Text style={s.chevron}>{expanded ? '▴' : '▾'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={s.reminderRow}>
          <Text style={s.reminderLabel}>Reminder:</Text>
          {reminderOptions.map(min => (
            <TouchableOpacity
              key={min}
              style={[
                s.reminderBtn,
                reminderMinutes === min && s.reminderBtnActive,
              ]}
              onPress={() => onReminderChange(min)}>
              <Text
                style={[
                  s.reminderBtnText,
                  reminderMinutes === min && s.reminderBtnTextActive,
                ]}>
                {min === 0 ? 'At time' : `${min}m`}
              </Text>
            </TouchableOpacity>
          ))}
          {reminderMinutes !== undefined && (
            <TouchableOpacity
              style={s.cancelBtn}
              onPress={() => onReminderChange(reminderMinutes)}>
              <Text style={s.cancelBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      marginBottom: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardNext: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    icon: {fontSize: 22, marginRight: 12},
    info: {flex: 1},
    name: {fontSize: 16, fontWeight: '600', color: theme.colors.text},
    nameNext: {color: theme.colors.primary},
    arabic: {fontSize: 13, color: theme.colors.subText, marginTop: 2},
    rightSide: {alignItems: 'flex-end', marginRight: 8},
    time: {fontSize: 17, fontWeight: '700', color: theme.colors.text},
    timeNext: {color: theme.colors.primary},
    reminderBadge: {
      marginTop: 3,
      backgroundColor: theme.colors.primary + '22',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    reminderBadgeText: {fontSize: 10, color: theme.colors.primary},
    chevron: {fontSize: 14, color: theme.colors.subText},
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingHorizontal: 14,
      paddingBottom: 12,
      gap: 8,
    },
    reminderLabel: {
      fontSize: 12,
      color: theme.colors.subText,
      marginRight: 4,
    },
    reminderBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: theme.colors.border,
    },
    reminderBtnActive: {
      backgroundColor: theme.colors.primary,
    },
    reminderBtnText: {fontSize: 12, color: theme.colors.text},
    reminderBtnTextActive: {color: '#fff', fontWeight: '600'},
    cancelBtn: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: '#e74c3c22',
    },
    cancelBtnText: {color: '#e74c3c', fontSize: 12, fontWeight: '700'},
  });
