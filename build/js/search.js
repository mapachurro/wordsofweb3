import i18next from './i18n.js';

const initSearch = () => {
  console.log("initSearch function called");

  document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded event fired");

    const loadIndex = async (language) => {
      console.log(`Loading index for language: ${language}`);
      const response = await fetch(`./../search-indices/${language}-index.json`);
      if (response.ok) {
        console.log("Index loaded successfully");
        return await response.json();
      } else {
        console.error(`Error loading index for language: ${language}`);
        return null;
      }
    };

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const languageSelector = document.getElementById('language-selector');

    console.log("Search elements initialized");

    const handleSearch = async () => {
      console.log("Search button clicked or Enter key pressed");

      const query = searchInput.value.trim();
      const language = languageSelector.value;

      console.log(`Search query: "${query}" for language: "${language}"`);

      const currentIndex = await loadIndex(language);
      if (!currentIndex) {
        console.error('Search index not found for language:', language);
        searchResults.innerHTML = `<li>${i18next.t('No results found')}</li>`;
        return;
      }

      const results = currentIndex.search(query);
      console.log("Search results:", results);
      displayResults(results);
    };

    const displayResults = (results) => {
      searchResults.innerHTML = '';
      if (results.length === 0) {
        console.log("No results found");
        searchResults.innerHTML = `<li>${i18next.t('No results found')}</li>`;
        return;
      }
      results.forEach(result => {
        const listItem = document.createElement('li');
        const term = result.ref;
        listItem.textContent = i18next.t(terms[term]) || term;
        listItem.style.cursor = 'pointer';
        listItem.addEventListener('click', () => handleClick(term));
        searchResults.appendChild(listItem);
      });
    };

    const handleClick = (term) => {
      console.log(`Term clicked: ${term}`);
      const language = languageSelector.value;
      const translatedTerm = i18next.t(terms[term]) || term;
      window.location.href = `/${language}/term/${encodeURIComponent(translatedTerm)}.html`;
    };

    searchButton.addEventListener('click', handleSearch);
    console.log("Search button event listener attached");

    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        console.log("Enter key pressed");
        handleSearch();
      }
    });
    console.log("Search input keypress event listener attached");
  });
};

export default initSearch;
