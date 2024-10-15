import { initializeLanguageCodes } from "./l10n.js";

export async function renderNavbar() {
  try {
    // Fetch the navbar template HTML
    const response = await fetch('../navbar-template.html');
    if (!response.ok) {
      throw new Error('Failed to load navbar template');
    }

    const navbarHtml = await response.text();

    // Get the language codes from l10n
    await initializeLanguageCodes();
    const languageCodes = await fetch('/l10n/language-codes.json').then(res => res.json());

    // Generate the dropdown options dynamically
    let options = '';
    for (const locale in languageCodes) {
      const slug = languageCodes[locale].slug;
      const name = languageCodes[locale].name;
      options += `<option value="/${slug}/index.html">${name}</option>\n`;
    }

    // Insert the dynamically generated options into the HTML
    const updatedNavbarHtml = navbarHtml.replace(
      '<option value ="./index.html">Select language...</option>', // Replace placeholder
      options // Inject options dynamically
    );

    return updatedNavbarHtml;
  } catch (error) {
    console.error('Error fetching navbar template:', error);
    return ''; // Return empty HTML in case of error
  }
}

async function handleLogoClick(event) {
  event.preventDefault(); // Prevent the default behavior of adding a hash
  window.location.href = `/index.html`; // Redirect to root index.html
}

export function initNavbar() {
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
      const selectedLanguagePath = languageSelector.value; // Get selected path from the option value
      if (selectedLanguagePath) {
        window.location.href = selectedLanguagePath; // Redirect to the selected language's index.html
      } else {
        console.error('Selected language path is invalid');
      }
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
