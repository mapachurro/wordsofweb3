import i18next from './i18n';

const initNavbar = () => {
  const handleLogoClick = () => {
    const language = document.getElementById('language-selector').value;
    window.location.href = `/${language}/index.html`;
  };

  const handleLanguageChange = async () => {
    const language = document.getElementById('language-selector').value;
    i18next.changeLanguage(language, (err, t) => {
      if (err) {
        console.error('Failed to change language:', err);
      } else {
        updateText();
      }
    });

    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${language}/${currentPath}`;
  };

  const updateText = () => {
    document.getElementById('search-button').textContent = i18next.t('Search');
    document.getElementById('search-input').placeholder = i18next.t('Search terms...');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const currentLanguage = window.location.pathname.split('/')[1];
    if (currentLanguage) {
      languageSelector.value = currentLanguage;
      i18next.changeLanguage(currentLanguage, updateText);
    }
  });

  document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
};

export default initNavbar;
