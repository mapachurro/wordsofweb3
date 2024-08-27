// Assuming your translations are already loaded and initialized elsewhere in your app
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

  // Assuming i18next is initialized somewhere in your app or you can initialize here
  await i18next.init({
    lng: 'en', // Default language
    resources: {
      en: {
        translation: {
          "Search the Education DAO Glossary": "Search the Education DAO Glossary",
          "No results found": "No results found",
          // Add other strings here...
        }
      },
      // Add other languages here...
    }
  });

  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  const languageSelector = document.getElementById('language-selector');

  const handleSearch = async () => {
    const query = searchInput.value.trim();
    const language = languageSelector.value;

    currentIndex = await loadIndex(language);
    if (!currentIndex) {
      console.error('Search index not found for language:', language);
      searchResults.innerHTML = `<li>${i18next.t('No results found')}</li>`;
      return;
    }

    const results = currentIndex.search(query);
    displayResults(results);
  };

  const displayResults = (results) => {
    searchResults.innerHTML = ''; // Clear previous results
    if (results.length === 0) {
      searchResults.innerHTML = `<li>${i18next.t('No results found')}</li>`;
      return;
    }
    results.forEach(result => {
      const listItem = document.createElement('li');
      const term = result.ref; // Assuming your search index returns refs
      listItem.textContent = i18next.t(terms[term]) || term; // Translate term if available
      listItem.style.cursor = 'pointer';
      listItem.addEventListener('click', () => handleClick(term));
      searchResults.appendChild(listItem);
    });
  };

  const handleClick = (term) => {
    const language = languageSelector.value; // Get the selected language
    console.log(`You clicked on: ${term} in ${language}`);
    const translatedTerm = i18next.t(terms[term]) || term; // Translate term if available
    window.location.href = `/${language}/term/${encodeURIComponent(translatedTerm)}.html`; // Navigate to the term's page
  };

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSearch();
  });
});
