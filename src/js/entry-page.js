document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar(languageOptions);
    initNavbar(); // Initialize navbar event listeners
  }
});

// previous version intended to avoid nodejs / prod interference
// import { renderNavbar, initNavbar, languageOptions } from "./navbar.js";

// if (typeof document !== "undefined") {
//   document.addEventListener("DOMContentLoaded", () => {
//     const navbarContainer = document.getElementById("navbar-container");
//     if (navbarContainer) {
//       navbarContainer.innerHTML = renderNavbar(languageOptions);
//       initNavbar();
//     }
//   });
// }
