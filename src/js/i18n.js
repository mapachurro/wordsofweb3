import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en_US',
    debug: true,
    backend: {
      loadPath: '/i18n/locales/{{lng}}/translation.json', // Update this path as needed
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    supportedLngs: [
      'en_US', 'es_ES', 'de_DE', 'it_IT', 'ar_AR', 'zh_CN', 'zh_TW', 'nl_NL',
      'fr_FR', 'el_GR', 'ha_NG', 'hi_IN', 'hu_HU', 'id_ID', 'it_IT', 'ja_JP',
      'ko_KR', 'fa_IR', 'ms_MY', 'pcm_NG', 'pl_PL', 'pt_BR', 'ro_RO', 'ru_RU',
      'es-419', 'tl_PH', 'th_TH', 'tr_TR', 'uk_UA', 'vi_VN'
    ],
  });

export default i18next;
