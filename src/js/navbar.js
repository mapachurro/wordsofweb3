import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';

i18next.use(i18nextXHRBackend).init({
  lng: 'en_US', // Default language
  backend: {
    loadPath: '/i18n/locales/{{lng}}/translation.json' // Path to translation files
  }
}, (err, t) => {
  if (err) {
    console.error('i18next initialization failed:', err);
  } else {
    updateText(); // Update the UI text for the default language
  }
});

const handleLogoClick = () => {
  const language = document.getElementById('language-selector').value;
  window.location.href = `/${language}/index.html`; // Navigate to the homepage of the current language
};

const handleLanguageChange = async () => {
  const language = document.getElementById('language-selector').value;

  // Change language in i18next
  i18next.changeLanguage(language, (err, t) => {
    if (err) {
      console.error('Failed to change language:', err);
    } else {
      updateText(); // Update the UI text after the language change
    }
  });

  // Update the current language in the URL or i18n setting
  const currentPath = window.location.pathname.split('/').slice(2).join('/');
  window.location.href = `/${language}/${currentPath}`;

  // Load the appropriate search index after updating the URL
  currentIndex = await loadIndex(language);

  // Clear previous search results or any other state related to the previous language
  searchResults.innerHTML = '';
};

const updateText = () => {
  document.getElementById('search-button').textContent = i18next.t('Search');
  document.getElementById('search-input').placeholder = i18next.t('Search terms...');
  // Update other UI elements similarly
};

// Set the default selected value based on current language
document.addEventListener('DOMContentLoaded', () => {
  const languageSelector = document.getElementById('language-selector');
  const currentLanguage = window.location.pathname.split('/')[1]; // Assumes language is the first segment in the URL
  if (currentLanguage) {
    languageSelector.value = currentLanguage;
    i18next.changeLanguage(currentLanguage, () => {
      updateText(); // Update UI text for the initial language
    });
  }

  // Load the index for the current language when the page loads
  loadIndex(currentLanguage).then(index => {
    currentIndex = index;
    updateText(); // Update UI text for the initial language
  });
});

// Add event listener for the language selector
document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
