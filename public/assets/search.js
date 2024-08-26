// This is the user-facing search script.
// It queries static search indices built in public/assets/search-indices/

const index = {}; // Load or import your search index here
const terms = {}; // Load your terms JSON here

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  const languageSelector = document.getElementById('language-selector');

  const handleSearch = () => {
    const query = searchInput.value.trim();
    console.log('Searching for:', query);
    const results = index.search(query); // Replace with your search logic
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
