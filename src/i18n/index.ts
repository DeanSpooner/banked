import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
});

const syncLanguage = async () => {
  if (Platform.OS === 'web' && typeof window === 'undefined') return;

  try {
    const savedLanguage = await AsyncStorage.getItem('user-language');
    if (savedLanguage) {
      await i18next.changeLanguage(savedLanguage);
    } else {
      const deviceLanguage = Localization.getLocales()[0]?.languageCode;
      if (deviceLanguage === 'ja') {
        await i18next.changeLanguage('ja');
      }
    }
  } catch (error) {
    console.log('Error: ', error);
  }
};

syncLanguage();

export { i18next };
