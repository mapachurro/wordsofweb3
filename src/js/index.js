import "./navbar.js";
import initSearch from "./search.js";
import initExplore from "./explore.js";
import { convertLocaleFormat, initializeLanguageCodes } from "./l10n.js";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    // Initialize language codes before everything else
    await initializeLanguageCodes();
    console.log("Language codes initialized");

    // Fetch directoryContents.json for use in other scripts
    const locale = document.documentElement.lang;
    const localeSlug = await convertLocaleFormat(locale, "fourLetterDash", "slug");
    
    // Use a path relative to the current page instead of going up a directory
    // This handles both development and production environments better
    const jsonFilePath = `./${localeSlug}/directoryContents.json`;
    
    let directoryContents = [];
    try {
      console.log(`Attempting to load directory contents from: ${jsonFilePath}`);
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error(`Failed to load index file: ${response.statusText} (${response.status})`);
      }
      directoryContents = await response.json();
      console.log("Directory contents loaded successfully", directoryContents);
    } catch (error) {
      console.error("Error loading directory index:", error);
      
      // Fallback attempt with alternative path
      try {
        console.log("Trying fallback path...");
        const fallbackPath = `/${localeSlug}/directoryContents.json`;
        console.log(`Attempting fallback: ${fallbackPath}`);
        const fallbackResponse = await fetch(fallbackPath);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback also failed: ${fallbackResponse.statusText}`);
        }
        directoryContents = await fallbackResponse.json();
        console.log("Directory contents loaded from fallback path", directoryContents);
      } catch (fallbackError) {
        console.error("Fallback attempt also failed:", fallbackError);
      }
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
