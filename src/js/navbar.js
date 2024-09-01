import { convertLanguageFormat } from './l10n.js';

export default function initNavbar() {
  const handleLogoClick = () => {
    const language = localStorage.getItem('selectedLanguage') || 'us-english';
    window.location.href = `/${language}/index.html`;
  };

  const handleLanguageChange = async () => {
    const languageSlug = document.getElementById('language-selector').value;
    const languageCode = await convertLanguageFormat(languageSlug, 'slug', 'fourLetterDash');

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

  document.addEventListener('DOMContentLoaded', async () => {
    const languageSelector = document.getElementById('language-selector');
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';
    languageSelector.value = storedLanguage;

    const languageCode = await convertLanguageFormat(storedLanguage, 'slug', 'fourLetterDash');
    document.documentElement.lang = languageCode;

    // Load translations on page load
    loadTranslations(storedLanguage);
  });

  // Attach event listeners
  document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
  document.querySelector('.logo').addEventListener('click', handleLogoClick);
};
