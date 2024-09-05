import { convertLanguageFormat } from './l10n.js';

export default function initSearch(){
    document.addEventListener('DOMContentLoaded', async function () {
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

        async function fetchSearchResults(query) {
            resultsContainer.innerHTML = ''; // Clear previous results

            // Load the appropriate directory index based on the current language
            const currentLang = document.documentElement.lang; // Assumes `lang` attribute is set on <html>
            const slugLang = await convertLanguageFormat(currentLang, 'fourLetterDash', 'slug'); // Convert to slug format
            const indexFilePath = `./${slugLang}/directoryContents.json`;

            fetch(indexFilePath)
                .then(response => response.json())
                .then(data => {
                    const results = searchIndex(data, query);
                    displayResults(results);
                })
                .catch(error => {
                    console.error('Error loading directory index:', error);
                });
        }

        function searchIndex(index, query) {
            const results = [];
            for (const item of index) {
                if (item.name.toLowerCase().includes(query)) {
                    results.push(item);
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
                const currentLang = document.documentElement.lang; // Get the current language from <html lang="">
                const basePath = window.location.pathname.split('/').slice(0, 2).join('/'); // Get the base path like /us-english/
                listItem.innerHTML = `<a href="${basePath}/${result.name}.html">${result.name}</a>`;
                list.appendChild(listItem);
            });
            resultsContainer.appendChild(list);
        }         
    });
}
