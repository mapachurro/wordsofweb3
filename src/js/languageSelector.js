import { initializeLanguageCodes, convertLocaleFormat, getLocales, getLocaleInfo } from "./l10n.js";

export async function renderLanguageSelector() {
  await initializeLanguageCodes(); // Ensure language codes are loaded

  const languageOptions = getLocales().map((locale) => {
    const label = getLocaleInfo(locale, "name"); // Get the display name for the locale
    const slug = getLocaleInfo(locale, "slug");
    return { value: slug, label };
  });

  return `
    <select id="language-selector" class="form-select ml-auto language-selector">
      ${languageOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
    </select>
  `;
}

export async function initLanguageSelector() {
  await initializeLanguageCodes(); // Ensure language codes are loaded before initialization
  const languageSelector = document.getElementById("language-selector");

  if (!languageSelector) {
    console.error("Language selector element not found");
    return;
  }

  // Set the dropdown value based on the current language from the URL
  const currentLanguageSlug = window.location.pathname.split("/")[1];
  if (currentLanguageSlug) {
    languageSelector.value = currentLanguageSlug;
  }

  // Event listener for handling language changes
  languageSelector.addEventListener("change", async () => {
    const selectedLanguageSlug = languageSelector.value;

    try {
      const languageCode = await convertLocaleFormat(selectedLanguageSlug, "slug", "fourLetterDash");
      console.log("Language selected: " + languageCode);

      const currentPathParts = window.location.pathname.split("/");
      const currentTerm = currentPathParts.pop() || "index.html";

      // Try to load the new language's equivalent page or fall back to the index page
      const newPath = `/${selectedLanguageSlug}/${currentTerm}`;
      const response = await fetch(newPath);

      if (response.ok) {
        window.location.href = newPath;
      } else {
        window.location.href = `/${selectedLanguageSlug}/index.html`;
      }
    } catch (error) {
      console.error("Error during language selection:", error);
    }
  });
}
