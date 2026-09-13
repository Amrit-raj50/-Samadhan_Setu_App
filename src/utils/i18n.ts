/**
 * Samadhan Setu — i18n Configuration
 * Multi-language support: Hindi, English, Santhali, Ho, Mundari.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hi from './locales/hi.json';
import en from './locales/en.json';
import sat from './locales/sat.json';
import ho from './locales/ho.json';
import mun from './locales/mun.json';

const resources = {
  hi: { translation: hi },
  en: { translation: en },
  sat: { translation: sat },
  ho: { translation: ho },
  mun: { translation: mun },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hi', // Default: Hindi (Devanagari-first)
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
