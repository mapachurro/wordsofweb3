import { convertLanguageFormat } from './l10n.js';

const initNavbar = () => {
  const handleLogoClick = () => {
    const language = localStorage.getItem('selectedLanguage') || 'us-english';
    window.location.href = `/${language}/index.html`;
  };

  const handleLanguageChange = async () => {
    const languageSlug = document.getElementById('language-selector').value;
    const languageCode = convertLanguageFormat(languageSlug, 'slug', 'fourLetterDash');

    if (languageCode) {
      // Update the language in LocalStorage
      localStorage.setItem('selectedLanguage', languageSlug);

      // Update the <html lang> attribute
      document.documentElement.lang = languageCode;

      // Reload translations
      loadTranslations(languageSlug);
    } else {
      console.error('Invalid language selection');
    }

    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${languageSlug}/${currentPath}`;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';
    languageSelector.value = storedLanguage;
    document.documentElement.lang = convertLanguageFormat(storedLanguage, 'slug', 'fourLetterDash');

    // Load translations on page load
    loadTranslations(storedLanguage);
  });

  document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
};

export default initNavbar;
