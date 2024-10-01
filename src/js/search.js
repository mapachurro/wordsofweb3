export default function initSearch(directoryContents) {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  if (!searchButton || !searchInput || !resultsContainer) {
    console.error("Search button, input, or results container not found.");
    return;
  }

  searchButton.addEventListener("click", function () {
    const query = searchInput.value.trim().toLowerCase();
    console.log("Search initiated for query:", query);
    if (!query) {
      return;
    }
    fetchSearchResults(query);
  });

  function fetchSearchResults(query) {
    resultsContainer.innerHTML = ""; // Clear previous results
    console.log("clear previous search results")

    const results = searchIndex(directoryContents, query);
    displayResults(results);
    console.log("search results: ", results)
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
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found</p>";
      console.log("no results found")
      return;
    }

    const list = document.createElement("ul");
    results.forEach((result) => {
      const listItem = document.createElement("li");
      console.log ("listing results: ", result)
      const resultUrl = `./${result.link}`;
      listItem.innerHTML = `<a href="${resultUrl}">${result.name}</a>`;
      list.appendChild(listItem);
    });
    resultsContainer.appendChild(list);
  }
}
