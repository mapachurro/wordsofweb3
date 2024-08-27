import i18next from './i18n';

const initSearch = () => {
  // Your search code here...

  document.addEventListener('DOMContentLoaded', async () => {
    // Other code here...

    const loadIndex = async (language) => {
      const response = await fetch(`/assets/${language}-index.json`);
      if (response.ok) {
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

    const handleSearch = async () => {
      const query = searchInput.value.trim();
      const language = languageSelector.value;

      const currentIndex = await loadIndex(language);
      if (!currentIndex) {
        console.error('Search index not found for language:', language);
        searchResults.innerHTML = `<li>${i18next.t('No results found')}</li>`;
        return;
      }

      const results = currentIndex.search(query);
      displayResults(results);
    };

    const displayResults = (results) => {
      searchResults.innerHTML = '';
      if (results.length === 0) {
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
      const language = languageSelector.value;
      const translatedTerm = i18next.t(terms[term]) || term;
      window.location.href = `/${language}/term/${encodeURIComponent(translatedTerm)}.html`;
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') handleSearch();
    });
  });
};

export default initSearch;
