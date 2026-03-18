import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {HADITH_BOOKS} from '../services/hadithService';

const HadithScreen = ({navigation}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const handleBookPress = book => {
    navigation.navigate('HadithBook', {book});
  };

  const renderBook = ({item}) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
      accessibilityLabel={`${item.name} hadith collection`}
      accessibilityRole="button">
      <View style={styles.bookIconContainer}>
        <Text style={styles.bookIcon}>📚</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.name}</Text>
        <Text style={styles.arabicName}>{item.arabicName}</Text>
        <Text style={styles.authorName}>{item.author}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.headerTitle}>الكتب الستة</Text>
        <Text style={styles.headerSubtitle}>The Six Authentic Hadith Books</Text>
      </View>
      <FlatList
        data={HADITH_BOOKS}
        keyExtractor={item => item.id}
        renderItem={renderBook}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerBanner: {
      backgroundColor: theme.primary,
      padding: 20,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      color: '#FFFFFF',
      fontWeight: '300',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.85)',
    },
    list: {
      padding: 12,
      paddingBottom: 24,
    },
    bookCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      shadowColor: theme.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    bookIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.prayerBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    bookIcon: {
      fontSize: 26,
    },
    bookInfo: {
      flex: 1,
    },
    bookName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    arabicName: {
      fontSize: 16,
      color: theme.arabicText,
      marginTop: 2,
    },
    authorName: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    chevron: {
      fontSize: 24,
      color: theme.textSecondary,
      marginLeft: 8,
    },
  });

export default HadithScreen;
