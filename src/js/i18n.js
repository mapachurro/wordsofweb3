import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18next
  .use(Backend) // Load translations using http (default public/assets/locales)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    fallbackLng: 'en_US', // Fallback language
    debug: true, // Set to false in production

    interpolation: {
      escapeValue: false, // React already safes from xss
    },

    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json', // Path to translation files
    },

    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },

    react: {
      useSuspense: false, // Set to true if you want to enable suspense
    },

    supportedLngs: [
      'en_US', 'es_ES', 'de_DE', 'it_IT', 'ar_AR', 'zh_CN', 'zh_TW', 'nl_NL', 
      'fr_FR', 'el_GR', 'ha_NG', 'hi_IN', 'hu_HU', 'id_ID', 'it_IT', 'ja_JP', 
      'ko_KR', 'fa_IR', 'ms_MY', 'pcm_NG', 'pl_PL', 'pt_BR', 'ro_RO', 'ru_RU', 
      'es-419', 'tl_PH', 'th_TH', 'tr_TR', 'uk_UA', 'vi_VN'
    ],
  });

export default i18next;
