import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en-US',
    debug: true,
    backend: {
      loadPath: '/i18n/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    supportedLngs: [
      'en-US', 'es-ES', 'de-DE', 'it-IT', 'ar-AR', 'zh-CN', 'zh-TW', 'nl-NL',
      'fr-FR', 'el-GR', 'ha-NG', 'hi-IN', 'hu-HU', 'id-ID', 'ja-JP',
      'ko-KR', 'fa-IR', 'ms-MY', 'pcm-NG', 'pl-PL', 'pt-BR', 'ro-RO', 'ru-RU',
      'es-419', 'tl-PH', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN'
    ],
  }).then(() => {
    console.log('i18next initialized');
    // Initialization complete, you can now safely run your other scripts
    initApp();  // Call a function to start your app logic, defined below
  }).catch((err) => {
    console.error('i18next initialization failed:', err);
  });

i18next.changeLanguage('en_US');

export default i18next;
