# Noor — نور Islamic Companion App

**Noor** (meaning *light* in Arabic) is an open-source React Native application that serves as a comprehensive Islamic companion. It features accurate prayer times, full Quran reading & audio, Hadith browsing, and customisable notifications — all in a clean UI with light and dark themes.

---

## Features

| Feature | Details |
|---|---|
| 🕐 **Prayer Times** | GPS-based times via the [Aladhan API](https://aladhan.com/prayer-times-api). Supports 10+ calculation methods. |
| 🔔 **Prayer Reminders** | Local push notifications (at prayer time or N minutes before) via `react-native-push-notification`. |
| 📖 **Quran** | Full Arabic text + English (Sahih International) translation via [Al-Quran Cloud API](https://alquran.cloud/api). Browse by Surah, tap to listen to audio recitations. |
| 📚 **Hadith** | Browse the six authentic books (Sihah Sitta) via [HadithAPI](https://hadithapi.com). Read Arabic with English translation. |
| 🌙 **Dark / Light Theme** | Toggle from the Settings screen. Preference is persisted locally. |
| 📱 **iOS & Android** | Built with React Native 0.73. |

---

## Project Structure

```
noor/
├── App.js                      # Root component (ThemeProvider + NavigationContainer)
├── index.js                    # App registry entry point
├── app.json
├── package.json
├── babel.config.js
├── metro.config.js
└── src/
    ├── context/
    │   └── ThemeContext.js     # Light/dark theme context & hook
    ├── navigation/
    │   └── AppNavigator.js     # Bottom-tab + stack navigators
    ├── screens/
    │   ├── HomeScreen.js       # Dashboard / welcome screen
    │   ├── PrayerTimesScreen.js
    │   ├── QuranScreen.js      # Surah list
    │   ├── SurahDetailScreen.js# Ayah reader + audio
    │   ├── HadithScreen.js     # Book list
    │   ├── HadithDetailScreen.js # Chapter & hadith reader
    │   └── SettingsScreen.js
    ├── components/
    │   ├── PrayerCard.js
    │   ├── SurahListItem.js
    │   └── HadithCard.js
    ├── services/
    │   ├── prayerTimesService.js  # Aladhan API wrapper
    │   ├── quranService.js        # Al-Quran Cloud API wrapper
    │   └── hadithService.js       # HadithAPI wrapper
    ├── hooks/
    │   ├── useLocation.js         # GPS location hook
    │   └── usePrayerTimes.js      # Prayer times hook (with caching)
    └── utils/
        └── notifications.js       # Push notification setup & helpers
```

---

## Prerequisites

- **Node.js** ≥ 18
- **React Native CLI** — `npm install -g react-native`
- **Xcode** (iOS) or **Android Studio** (Android)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

---

## API Keys

### Aladhan (Prayer Times)
The [Aladhan API](https://aladhan.com/prayer-times-api) is **free** and requires **no API key**. No configuration needed.

### Al-Quran Cloud (Quran)
The [Al-Quran Cloud API](https://alquran.cloud/api) is **free** and requires **no API key**. No configuration needed.

### HadithAPI (Hadith)
1. Register for a free account at <https://hadithapi.com>
2. Copy your API key from the dashboard
3. Open `src/services/hadithService.js` and replace the placeholder:

```js
let API_KEY = '$2y$10$YOUR_HADITH_API_KEY_HERE';
```

with your real key, **or** call `setHadithApiKey('your_key_here')` once at app start (e.g., from `App.js`).

> **Security note:** Do not commit your real API key to version control. Consider using a `.env` file with `react-native-config` for production.

---

## Setup & Installation

```bash
# 1. Navigate into the project directory
cd noor

# 2. Install JavaScript dependencies
npm install

# 3. (iOS only) Install CocoaPods dependencies
cd ios && pod install && cd ..
```

### Android permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### iOS permissions

Add to `ios/Noor/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Noor needs your location to show accurate prayer times.</string>
```

---

## Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `@react-navigation/native` | Navigation container |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `@react-navigation/native-stack` | Stack navigator for Quran/Hadith detail screens |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-screens` | Native screen optimisation |
| `react-native-geolocation-service` | GPS location (iOS & Android) |
| `react-native-push-notification` | Local push notifications |
| `@react-native-async-storage/async-storage` | Persistent local storage |
| `axios` | HTTP client for API calls |
| `react-native-sound` | Audio playback (Quran recitation) |

---

## License

MIT — free to use, modify, and distribute with attribution.

---

*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ*  
*May Allah accept this effort and make it beneficial.*
