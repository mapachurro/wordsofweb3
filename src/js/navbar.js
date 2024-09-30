import { initializeLanguageCodes, getLocales, getLocaleInfo, convertLocaleFormat } from "./l10n.js";

export async function renderNavbar() {
  await initializeLanguageCodes(); // Ensure language codes are loaded

  const languageOptions = getLocales().map(locale => {
    const label = getLocaleInfo(locale, 'name'); // Assuming 'name' gives you the display name for the locale
    const slug = getLocaleInfo(locale, 'slug');
    return { value: slug, label };
  });

  return `
  <nav class="navbar navbar-expand-lg navbar-dark">
    <a class="navbar-brand" href="index.html" id="logo-link">
      <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
      wordsofweb3
    </a>
    <div class="collapse navbar-collapse">
      <select id="language-selector" class="form-select ml-auto language-selector">
        ${languageOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
      </select>
    </div>
  </nav>
`;
}

async function handleLanguageChange() {
  await initializeLanguageCodes(); // Make sure language codes are loaded

  const languageSlug = document.getElementById('language-selector').value;

  try {
    const languageCode = await convertLocaleFormat(languageSlug, "slug", "fourLetterDash");
    console.log("Language selected: " + languageCode);

    if (languageCode) {
      localStorage.setItem("selectedLanguage", languageSlug);
      console.log("Site language set to: " + languageSlug);

      const currentPathParts = window.location.pathname.split("/");
      // const currentPage = currentPathParts.pop() || "index.html";

      // Get the term slug (e.g., 3box-labs) from the current URL
      const termSlug = currentPathParts.pop();

      // Try fetching the localized term page
      const newPath = `/${languageSlug}/${termSlug}.html`;
      const response = await fetch(newPath);

      if (response.ok) {
        window.location.href = newPath;
      } else {
        window.location.href = `/${languageSlug}/index.html`;
      }
    } else {
      throw new Error("Invalid language selection");
    }
  } catch (error) {
    console.error("Error during language selection:", error);
  }
}

async function handleLogoClick(event) {
  event.preventDefault(); // Prevent the default behavior of adding a hash
  window.location.href = `/index.html`; // Redirect to root index.html
}

export function initNavbar() {
  document.addEventListener("DOMContentLoaded", async () => {
    await initializeLanguageCodes(); // Ensure language codes are loaded before initialization
    const languageSelector = document.getElementById("language-selector");
    const logoElement = document.getElementById("logo-link");

    if (!languageSelector || !logoElement) {
      console.error("Navbar elements not found");
      return;
    }

    // Set event listeners
    languageSelector.addEventListener("change", handleLanguageChange);
    logoElement.addEventListener("click", handleLogoClick); // Attach click event to logo
  });
}
