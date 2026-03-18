# Noor (نور) — Islamic Companion App

**Noor** (Arabic: نور, meaning *light*) is a comprehensive Islamic companion mobile application built with React Native. It features prayer times with GPS detection, full Quran browsing with audio recitations, the six authentic Hadith books, and a clean UI with light/dark theme support.

---

## Features

- 🕌 **Prayer Times** — Automatic GPS-based daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) via the [Aladhan API](https://aladhan.com/prayer-times-api)
- 🔔 **Prayer Reminders** — Customizable push notifications (at prayer time or before)
- 📖 **Quran** — Full Arabic Quran text, English translations, and audio recitations by popular reciters
- 📚 **Hadith** — Browse the six authentic books (Sihah Sitta) by chapter with Arabic and English text
- 🌙 **Dark/Light Theme** — Seamless theme toggle with persistent preferences

---

## Screenshots

> Run the app on a simulator or device to see the UI in action.

---

## Tech Stack

| Library | Purpose |
|---|---|
| React Native 0.73 | Core mobile framework |
| @react-navigation/native | Screen navigation |
| @react-navigation/bottom-tabs | Tab bar navigation |
| @react-navigation/native-stack | Stack navigation for sub-screens |
| react-native-geolocation-service | GPS location access |
| react-native-push-notification | Local push notifications |
| @react-native-async-storage/async-storage | Persistent local storage |
| axios | HTTP API calls |
| react-native-sound | Audio playback for Quran recitations |
| react-native-safe-area-context | Safe area insets |

---

## Prerequisites

- Node.js >= 18
- React Native CLI: `npm install -g react-native-cli`
- Android Studio (for Android) or Xcode (for iOS)
- A physical device or simulator/emulator

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd noor
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. iOS — Install CocoaPods

```bash
cd ios && pod install && cd ..
```

### 4. Obtain API Keys

#### Hadith API Key (required for Hadith feature)

1. Visit [https://hadithapi.com](https://hadithapi.com)
2. Create a free account
3. Copy your API key from the dashboard
4. Open the app → **Settings** → enter and save the API key

#### Prayer Times & Quran

Prayer times use the [Aladhan API](https://aladhan.com/prayer-times-api) (free, no key required).  
Quran data uses the [Quran.com API v4](https://api.quran.com/api/v4) (free, no key required).

### 5. Android — Permissions

Add these to `android/app/src/main/AndroidManifest.xml` (if not already present):

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### 6. iOS — Permissions

Add to `ios/<AppName>/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Noor needs your location to provide accurate prayer times.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Noor needs your location to provide accurate prayer times.</string>
```

### 7. Run the app

**Android:**
```bash
npm run android
# or
npx react-native run-android
```

**iOS:**
```bash
npm run ios
# or
npx react-native run-ios
```

---

## Project Structure

```
noor/
├── App.js                          # Root component (theme + navigation setup)
├── index.js                        # App entry point
├── app.json                        # App configuration
├── package.json
├── babel.config.js
└── src/
    ├── context/
    │   └── ThemeContext.js         # Light/dark theme context & provider
    ├── navigation/
    │   └── AppNavigator.js         # Bottom tab + stack navigation
    ├── screens/
    │   ├── PrayerTimesScreen.js    # GPS-based prayer times
    │   ├── QuranScreen.js          # Surah list with search
    │   ├── SurahDetailScreen.js    # Verses with audio playback
    │   ├── HadithScreen.js         # Six authentic Hadith books list
    │   ├── HadithBookScreen.js     # Chapter list for a Hadith book
    │   ├── HadithListScreen.js     # Hadiths within a chapter
    │   └── SettingsScreen.js       # Theme, notifications, API key
    ├── components/
    │   ├── PrayerCard.js           # Individual prayer time card
    │   ├── SurahCard.js            # Surah list item
    │   ├── VerseCard.js            # Quran verse with translation
    │   ├── HadithCard.js           # Hadith with Arabic & translation
    │   └── ThemeToggle.js          # Light/dark mode switch
    ├── services/
    │   ├── prayerTimesService.js   # Aladhan API integration
    │   ├── quranService.js         # Quran.com API integration
    │   └── hadithService.js        # HadithAPI.com integration
    └── utils/
        └── notifications.js        # Push notification setup & scheduling
```

---

## Prayer Time Calculation Methods

The app defaults to **ISNA** (Islamic Society of North America) calculation method. You can change this by modifying the `method` parameter in `prayerTimesService.js`. Available methods:

| ID | Method |
|---|---|
| 0 | Jafari (Shia) |
| 1 | University of Islamic Sciences, Karachi |
| 2 | ISNA (default) |
| 3 | Muslim World League |
| 4 | Umm Al-Qura (Makkah) |
| 5 | Egyptian General Authority |
| 7 | University of Tehran |

---

## Troubleshooting

**Location not working:**
- Ensure location permissions are granted in device settings
- On Android, check that `ACCESS_FINE_LOCATION` is declared in `AndroidManifest.xml`

**Prayer times not loading:**
- Check internet connectivity
- The app caches the last known location as a fallback

**Hadith not loading:**
- Verify your Hadith API key is entered correctly in Settings
- Ensure a working internet connection

**Audio not playing:**
- `react-native-sound` requires linking — run `pod install` on iOS
- Check that the device volume is not muted

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

MIT

---

*"Indeed, this Quran guides to that which is most suitable."* — Quran 17:9
