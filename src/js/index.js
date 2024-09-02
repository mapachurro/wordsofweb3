import { renderNavbar, initNavbar, languageOptions } from './navbar.js';
import initSearch from './search.js';
import initExplore from './explore.js';
import { convertLanguageFormat } from './l10n.js';

// Define loadTranslations at a higher scope
export async function loadTranslations(languageSlug) {
    const languageCode = await convertLanguageFormat(languageSlug, 'slug', 'fourLetterDash');
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
}

function updateUIStrings(translations) {
    Object.keys(translations).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = translations[key];
        }
    });
}

// Ensure that all initialization happens after the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('navbar-container').innerHTML = renderNavbar(languageOptions);
    initNavbar();
    initSearch();
    initExplore();
    initApp();
  });
}


export function initApp() {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';
    loadTranslations(storedLanguage);

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
