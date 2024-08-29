

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
