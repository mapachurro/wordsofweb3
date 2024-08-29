import { convertLanguageFormat } from './l10n.js';

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
function initExplore() {
    const exploreContainer = document.getElementById('explore-container');
    const directoryPath = './us-english/'; // Path to the directory with the entry pages

    fetch(directoryPath) // Fetch the directory contents
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));

        const shuffledLinks = links.sort(() => Math.random() - 0.5); // Shuffle the links

        shuffledLinks.forEach(link => {
          const term = link.textContent.replace('.html', ''); // Remove the .html extension from the term
          const termLink = document.createElement('a');
          termLink.href = directoryPath + link.getAttribute('href');
          termLink.textContent = term;
          termLink.style.display = 'block';
          exploreContainer.appendChild(termLink);
        });
      })
      .catch(error => {
        console.error('Error fetching directory contents:', error);
      });
  }
module.exports = {
    loadTranslations,
    searchQuery,
    initExplore
};