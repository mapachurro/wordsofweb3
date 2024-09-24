import { renderNavbar, initNavbar, languageOptions } from "./navbar.js";
import initSearch from "./search.js";
import initExplore from "./explore.js";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize Navbar
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar(languageOptions);
      initNavbar();
      console.log("navbar initialized");
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
