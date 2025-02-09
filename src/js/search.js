export default function initSearch(directoryContents) {
  console.log("Loaded search index:", directoryContents);

  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");

  if (!searchButton || !searchInput || !resultsContainer) {
    console.error("Search button, input, or results container not found.");
    return;
  }

  searchButton.addEventListener("click", function () {
    const query = searchInput.value.trim().toLowerCase();
    console.log("Search initiated for query:", query);
    if (!query) {
      resultsContainer.style.display = "none";
      return;
    }
    fetchSearchResults(query);
  });

  function fetchSearchResults(query) {
    const results = searchIndex(directoryContents, query);
    console.log("Search results:", results); // Debug log
    displayResults(results);
  }

  function searchIndex(index, query) {
    return index.filter(item => {
      console.log(`Checking item: ${item.name}, Searching for: ${query}`);
      return item.name.toLowerCase().includes(query);
    });
  }

  function displayResults(results) {
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found</p>";
      console.log("no results found");
      resultsContainer.style.display = "block"; // Show results container for "No results" message
      return;
    }

    const list = document.createElement("ul");
    results.forEach(result => {
      const listItem = document.createElement("li");
      const resultUrl = `./${result.link}`;
      listItem.innerHTML = `<a href="${resultUrl}">${result.name}</a>`; // Use `name` instead of the slug
      list.appendChild(listItem);
    });
    resultsContainer.appendChild(list);
    resultsContainer.style.display = "block"; // Show results container with results
  }
}
