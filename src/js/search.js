import { initializeLanguageCodes, convertLocaleFormat } from "./l10n.js";

export default function initSearch() {
  document.addEventListener("DOMContentLoaded", async function () {
    console.log("Search feature initializing...");

    await initializeLanguageCodes(); // Ensure language codes are loaded

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");

    if (!searchButton || !searchInput) {
      console.error("Search button or input not found.");
      return;
    }

    searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim().toLowerCase();
      console.log("Search button clicked. Query:", query);
      if (!query) {
        console.warn("No query entered.");
        return;
      }
      fetchSearchResults(query);
    });

    async function fetchSearchResults(query) {
      console.log("Fetching search results for query:", query);
      resultsContainer.innerHTML = ""; // Clear previous results

      const currentLang = document.documentElement.lang; // Get the current language from the <html> element
      console.log("Current language:", currentLang);

      const slugLang = await convertLocaleFormat(currentLang, "fourLetterDash", "slug"); // Convert to slug format
      console.log("Slug language:", slugLang);

      const indexFilePath = `./${slugLang}/directoryContents.json`;
      console.log("Index file path:", indexFilePath);

      try {
        const response = await fetch(indexFilePath);
        if (!response.ok) {
          throw new Error(`Failed to load index file: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Data loaded from index file:", data);

        const results = searchIndex(data, query);
        console.log("Search results:", results);
        displayResults(results);
      } catch (error) {
        console.error("Error loading directory index:", error);
      }
    }

    function searchIndex(index, query) {
      console.log("Searching index...");
      const results = [];
      for (const item of index) {
        if (item.name.toLowerCase().includes(query)) {
          results.push(item);
        }
      }
      return results;
    }

    function displayResults(results) {
      console.log("Displaying search results...");
      resultsContainer.innerHTML = ""; // Clear previous results

      if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found</p>";
        return;
      }

      const list = document.createElement("ul");
      results.forEach((result) => {
        const listItem = document.createElement("li");
        const resultUrl = `./${result.link}`;
        listItem.innerHTML = `<a href="${resultUrl}">${result.name}</a>`;
        list.appendChild(listItem);
      });
      resultsContainer.appendChild(list);
    }
  });
}
