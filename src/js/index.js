import { renderNavbar, initNavbar } from "./navbar.js";
import { renderLanguageSelector, initLanguageSelector } from "./languageSelector.js";
import initSearch from "./search.js";
import initExplore from "./explore.js";
import { convertLocaleFormat } from "./l10n.js";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    // Render Navbar
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      const navbarHtml = await renderNavbar();
      navbarContainer.innerHTML = navbarHtml;
      initNavbar();
      console.log("navbar initialized");
    }

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

    // Render and Initialize Language Selector
    initLanguageSelector();
    const dropdownContainer = document.getElementById("navbar-dropdown-container");
    if (dropdownContainer) {
      const dropdownHtml = await renderLanguageSelector();
      dropdownContainer.innerHTML = dropdownHtml;
      console.log("language selector initialized");
    }

    // Initialize Search
    if (
      document.getElementById("search-input") &&
      document.getElementById("search-button")
    ) {
      initSearch(); // Calls the search initialization from search.js
      console.log("search initialized");
    }

    // Initialize Explore (if applicable)
    if (document.getElementById("explore-container")) {
      initExplore(); // Calls the explore initialization from explore.js
      console.log("explore feature initialized");
    }
  });
}

export function initApp() {
  // Any other app-wide initialization logic can go here, if needed
}