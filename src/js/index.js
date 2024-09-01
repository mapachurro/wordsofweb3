import initNavbar from './navbar.js';
import initSearch from './search.js';
import initExplore from './explore.js';
import initl10n from './l10n.js';

document.addEventListener('DOMContentLoaded', () => {
  init
  initNavbar();
  initSearch();
  initExplore();
  initl10n();
});

export function initApp() {
  initNavbar();

  const loadTranslations = async (languageSlug) => {
    const languageCode = convertLanguageFormat(languageSlug, 'slug', 'fourLetterDash');
    const translationFilePath = `./l10n/locales/${languageCode}/translation.json`;

    try {
      const response = await fetch(translationFilePath);
      if (!response.ok) {
        throw new Error('Translation file not found');
      }
      const translations = await response.json();
      updateUIStrings(translations);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const updateUIStrings = (translations) => {
    Object.keys(translations).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = translations[key];
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';
    loadTranslations(storedLanguage);
  });

  function searchQuery() {
    document.getElementById('search-button').addEventListener('click', function () {
      const searchQuery = document.getElementById('search-input').value.toLowerCase();
      const locale = document.documentElement.lang;
      const indexUrl = `./assets/search-indices/${locale}-index.json`;

      fetch(indexUrl)
        .then(response => response.json())
        .then(indexData => {
          const idx = lunr.Index.load(indexData);
          const results = idx.search(searchQuery);

          displayResults(results);
        })
        .catch(err => console.error('Failed to load search index:', err));
    });

    function displayResults(results) {
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';

      results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = result.ref; // term
        resultsContainer.appendChild(listItem);
      });
    }
  }

  // Initialize other functions here if needed
  searchQuery();
  initExplore();
}

window.onload = initApp;
