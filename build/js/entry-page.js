import "./navbar.js"


// import { renderNavbar, initNavbar } from "./navbar.js";

// if (typeof document !== "undefined") {
//   document.addEventListener("DOMContentLoaded", async () => {
//     // Render Navbar
//     const navbarContainer = document.getElementById("navbar-container");
//     if (navbarContainer) {
//       const navbarHtml = await renderNavbar(); // RenderNavbar is now async due to locale loading
//       navbarContainer.innerHTML = navbarHtml;
//       initNavbar();
//       console.log("navbar initialized");
//     }
//   });
// }

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
