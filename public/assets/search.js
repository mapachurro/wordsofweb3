// This is the user-facing search script.
// It queries static search indices built in public/assets/

const indices = {}; // Object to hold all search indices
let currentIndex; // To hold the currently loaded index


// Function to load the search index for a given language
const loadIndex = async (language) => {
  if (!indices[language]) {
    try {
      const response = await fetch(`/assets/${language}-index.json`);
      if (!response.ok) throw new Error('Failed to load index');
      const indexJson = await response.json();
      indices[language] = lunr.Index.load(indexJson); // Load the Lunr.js index
    } catch (error) {
      console.error('Error loading index:', error);
    }
  }
  return indices[language];
};

document.addEventListener('DOMContentLoaded', async () => {
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
      return;
    }
  
    const results = currentIndex.search(query);
    displayResults(results);
  };  


  const displayResults = (results) => {
    searchResults.innerHTML = ''; // Clear previous results
    results.forEach(result => {
      const listItem = document.createElement('li');
      const term = result.ref; // Assuming your search index returns refs
      listItem.textContent = terms[term] || term; // Translate term if available
      listItem.style.cursor = 'pointer';
      listItem.addEventListener('click', () => handleClick(term));
      searchResults.appendChild(listItem);
    });
  };

  const handleClick = (term) => {
    const language = languageSelector.value; // Get the selected language
    console.log(`You clicked on: ${term} in ${language}`);
    const translatedTerm = terms[term] || term; // Translate term if available
    window.location.href = `/${language}/term/${encodeURIComponent(translatedTerm)}.html`; // Navigate to the term's page
  };

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSearch();
  });
});
