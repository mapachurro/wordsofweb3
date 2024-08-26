// Assuming i18n is handled by the backend or by a simple language setting in localStorage
const handleLogoClick = () => {
    const language = document.getElementById('language-selector').value;
    window.location.href = `/${language}/index.html`; // Navigate to the homepage of the current language
  };
  
  const handleLanguageChange = () => {
    const language = document.getElementById('language-selector').value;
    // Update the current language in the URL or i18n setting
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${language}/${currentPath}`;
  };
  
  // Set the default selected value based on current language
  document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const currentLanguage = window.location.pathname.split('/')[1]; // Assumes language is the first segment in the URL
    if (currentLanguage) {
      languageSelector.value = currentLanguage;
    }
  });
  