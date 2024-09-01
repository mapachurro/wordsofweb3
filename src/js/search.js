export default function initSearch(){
document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  searchButton.addEventListener('click', function () {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
          return;
      }

      fetchSearchResults(query);
  });

  function fetchSearchResults(query) {
      resultsContainer.innerHTML = ''; // Clear previous results

      // Load the appropriate search index based on the current language
      const currentLang = document.documentElement.lang; // Assumes `lang` attribute is set on <html>
      const indexFilePath = `./assets/search-indices/${currentLang}-index.json`;

      fetch(indexFilePath)
          .then(response => response.json())
          .then(data => {
              const results = searchIndex(data, query);
              displayResults(results);
          })
          .catch(error => {
              console.error('Error loading search index:', error);
          });
  }

  function searchIndex(index, query) {
      const results = [];
      for (const term in index) {
          if (index[term].term.toLowerCase().includes(query) || index[term].definition.toLowerCase().includes(query)) {
              results.push(index[term]);
          }
      }
      return results;
  }

  function displayResults(results) {
      if (results.length === 0) {
          resultsContainer.innerHTML = '<p>No results found</p>';
          return;
      }

      const list = document.createElement('ul');
      results.forEach(result => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<a href="${result.url}">${result.term}</a>: ${result.definition}`;
          list.appendChild(listItem);
      });
      resultsContainer.appendChild(list);
  }
});
}