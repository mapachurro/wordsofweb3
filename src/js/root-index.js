import { initializeLanguageCodes, getAllLocalesInfo } from "./l10n.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initializeLanguageCodes(); // Make sure language codes are loaded

  const userLocale = navigator.language || navigator.languages[0];
  const languageMap = getAllLocalesInfo(); // Get the full map of locale information

  // Attempt to find the best match for the user's locale
  const matchedLocale = findBestLocaleMatch(userLocale, languageMap);

  if (matchedLocale) {
    // Redirect to the corresponding localized homepage
    const languageSlug = languageMap[matchedLocale].slug;
    window.location.href = `./${languageSlug}/index.html`;
  } else {
    // If no match is found, display the language selection
    displayLanguageSelection(languageMap);
  }
});

function findBestLocaleMatch(userLocale, languageMap) {
  for (const localeKey in languageMap) {
    if (userLocale.startsWith(localeKey)) {
      return localeKey;
    }
  }
  return null;
}

function displayLanguageSelection(languageMap) {
  const mainElement = document.querySelector("main");
  mainElement.innerHTML = `
    <h1>Welcome to wordsofweb3!</h1>
    <p>What language would you like to select?</p>
    <div id="language-selection">
      ${Object.values(languageMap)
        .map(
          (option) => `
        <button onclick="window.location.href='./${option.slug}/index.html'">${option.name}</button>
      `,
        )
        .join("")}
    </div>
  `;
}
