import "./navbar.js";
import initSearch from "./search.js";
import initExplore from "./explore.js";
import { convertLocaleFormat, initializeLanguageCodes } from "./l10n.js";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    // Initialize language codes before everything else
    await initializeLanguageCodes();
    console.log("Language codes initialized");

    // Initialize Navbar
    // initNavbar(); 
    // console.log("Navbar initialized");

    // Fetch directoryContents.json for use in other scripts
    const locale = document.documentElement.lang;
    const localeSlug = await convertLocaleFormat(locale, "fourLetterDash", "slug");
    const jsonFilePath = `../${localeSlug}/directoryContents.json`;

    let directoryContents = [];
    try {
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error(`Failed to load index file: ${response.statusText}`);
      }
      directoryContents = await response.json();
      console.log("Directory contents loaded", directoryContents);
    } catch (error) {
      console.error("Error loading directory index:", error);
    }

    // Initialize Search
    if (
      document.getElementById("search-input") &&
      document.getElementById("search-button")
    ) {
      initSearch(directoryContents); // Pass the directory contents to search.js
      console.log("Search initialized");
    }

    // Initialize Explore (if applicable)
    if (document.getElementById("explore-container")) {
      initExplore(directoryContents); // Pass the directory contents to explore.js
      console.log("Explore feature initialized");
    }
  });
}

export function initApp() {
  // Any other app-wide initialization logic can go here, if needed
}
