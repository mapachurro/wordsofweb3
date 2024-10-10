import { initializeLanguageCodes } from "./l10n.js";

export async function renderNavbar() {
  try {
    // Fetch the navbar template HTML
    const response = await fetch('../navbar-template.html');
    if (!response.ok) {
      throw new Error('Failed to load navbar template');
    }
    const navbarHtml = await response.text();
    return navbarHtml;
  } catch (error) {
    console.error('Error fetching navbar template:', error);
    return ''; // Return empty HTML in case of error
  }
}

async function handleLogoClick(event) {
  event.preventDefault(); // Prevent the default behavior of adding a hash
  window.location.href = `/index.html`; // Redirect to root index.html
}

export async function initNavbar() {
  await initializeLanguageCodes(); // Ensure language codes are loaded before using the navbar

  document.addEventListener('DOMContentLoaded', async () => {
    const navbarContainer = document.getElementById('navbar-container');
    
    if (!navbarContainer) {
      console.error('Navbar container not found');
      return;
    }

    // Render navbar HTML
    const navbarHtml = await renderNavbar();
    navbarContainer.innerHTML = navbarHtml;

    const languageSelector = document.getElementById('language-selector');
    const logoElement = document.getElementById('logo-link');

    if (!languageSelector || !logoElement) {
      console.error('Navbar elements not found');
      return;
    }

    // Set event listeners
    languageSelector.addEventListener('change', () => {
      const newLanguagePath = languageSelector.value;
      window.location.href = newLanguagePath; // Navigate to the selected language index page
    });
    
    logoElement.addEventListener('click', handleLogoClick); // Attach click event to logo

    // Set the dropdown value based on the current language
    const currentLanguageSlug = window.location.pathname.split('/')[1];
    if (currentLanguageSlug) {
      for (let i = 0; i < languageSelector.options.length; i++) {
        if (languageSelector.options[i].value.includes(currentLanguageSlug)) {
          languageSelector.selectedIndex = i;
          break;
        }
      }
    }
  });
}
