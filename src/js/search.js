import { convertLanguageFormat } from "./l10n.js";

export default function initSearch() {
  document.addEventListener("DOMContentLoaded", async function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");

    if (!searchButton || !searchInput) {
      console.error("Search button or input not found.");
      return;
    }

    searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim().toLowerCase();
      console.log(query);
      if (!query) {
        return;
      }
      fetchSearchResults(query);
    });

    async function fetchSearchResults(query) {
      resultsContainer.innerHTML = ""; // Clear previous results

      // Load the appropriate directory index based on the current language
      const currentLang = document.documentElement.lang; // Assumes `lang` attribute is set on <html>
      const slugLang = await convertLanguageFormat(
        currentLang,
        "fourLetterDash",
        "slug",
      ); // Convert to slug format
      console.log(slugLang);
      const indexFilePath = `./${slugLang}/directoryContents.json`;
      console.log(indexFilePath);

      try {
        const response = await fetch(indexFilePath);
        if (!response.ok) {
          throw new Error(`Failed to load index file: ${response.statusText}`);
        }

        const data = await response.json();
        const results = searchIndex(data, query);
        displayResults(results);
        console.log("json response:" + data);
        console.log("search results:" + results);
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

      const storedLanguage =
        localStorage.getItem("selectedLanguage") || "us-english";
      const list = document.createElement("ul");
      results.forEach((result) => {
        const listItem = document.createElement("li");
        // Construct the URL using a relative path based on the current locale directory
        const resultUrl = `./${result.link}`;
        listItem.innerHTML = `<a href="${resultUrl}">${result.name}</a>`;
        list.appendChild(listItem);
      });
      resultsContainer.appendChild(list);
    }
  });
}
