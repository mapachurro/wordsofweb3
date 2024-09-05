import { renderNavbar, initNavbar, languageOptions } from './navbar.js';
import initSearch from './search.js';
import initExplore from './explore.js';

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = renderNavbar(languageOptions);
            initNavbar();
        }

        // Only initialize search and explore functionality on pages where the elements exist
        if (document.getElementById('search-input') && document.getElementById('search-button')) {
            initSearch();
        }

        if (document.getElementById('explore-container')) {
            initExplore();
        }

        initApp();
    });
}

export function initApp() {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';

    function searchQuery() {
        const searchButton = document.getElementById('search-button');
        if (!searchButton) {
            return; // Exit if the search button doesn't exist
        }

        searchButton.addEventListener('click', function () {
            const searchQuery = document.getElementById('search-input').value.toLowerCase();
            const indexUrl = `./directoryContents.json`;

            fetch(indexUrl)
                .then(response => response.json())
                .then(indexData => {
                    const results = searchIndex(indexData, searchQuery);
                    displayResults(results);
                })
                .catch(err => console.error('Failed to load directory index:', err));
        });

        function searchIndex(indexData, query) {
            const results = [];
            for (const item of indexData) {
                if (item.name.toLowerCase().includes(query)) {
                    results.push(item);
                }
            }
            return results;
        }

        function displayResults(results) {
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p>No results found</p>';
                return;
            }

            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="./${storedLanguage}/${result.link}">${result.name}</a>`;
                resultsContainer.appendChild(listItem);
            });
        }
    }

    searchQuery();
    initExplore();
}
