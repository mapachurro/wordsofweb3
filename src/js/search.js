import { initializeLanguageCodes, convertLocaleFormat } from "./l10n.js";

export default function initSearch() {
  document.addEventListener("DOMContentLoaded", async function () {
    await initializeLanguageCodes(); // Ensure language codes are loaded

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");

    if (!searchButton || !searchInput) {
      console.error("Search button or input not found.");
      return;
    }

    // Add click event listener for the search button
    searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        return;
      }
      fetchSearchResults(query);
    });

    // Add "Enter" key event listener for the search input
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchButton.click(); // Trigger the click event on the search button
      }
    });

    async function fetchSearchResults(query) {
      resultsContainer.innerHTML = ""; // Clear previous results

      const currentLang = document.documentElement.lang; // Get the current language from the <html> element
      const slugLang = await convertLocaleFormat(currentLang, "fourLetterDash", "slug"); // Convert to slug format
      const indexFilePath = `./${slugLang}/directoryContents.json`;

      try {
        console.log(`Attempting to fetch index file from: ${indexFilePath}`);
        const response = await fetch(indexFilePath);
        if (!response.ok) {
          throw new Error(`Failed to load index file: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Index file data:", data);

        const results = searchIndex(data, query);
        console.log("Search results:", results);
        displayResults(results);
      } catch (error) {
        console.error("Error loading directory index:", error);
      }
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
        return;
      }

      // Use the stored language to generate the correct path for the links
      const storedLanguage = localStorage.getItem("selectedLanguage") || "us-english";
      const list = document.createElement("ul");
      results.forEach((result) => {
        const listItem = document.createElement("li");
        const resultUrl = `/${storedLanguage}/${result.link}`;
        listItem.innerHTML = `<a href="${resultUrl}">${result.name}</a>`;
        list.appendChild(listItem);
      });
      resultsContainer.appendChild(list);
    }
  });
}
