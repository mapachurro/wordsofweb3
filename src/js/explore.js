import { convertLanguageFormat } from "./l10n.js";

export default async function initExplore() {
  const exploreContainer = document.getElementById("explore-container");
  const locale = document.documentElement.lang; // Get the current locale from the HTML lang attribute
  // Convert the four-letter locale code to a slug format
  const localeSlug = await convertLanguageFormat(
    locale,
    "fourLetterDash",
    "slug",
  );
  const jsonFilePath = `../${localeSlug}/directoryContents.json`;

  fetch(jsonFilePath)
    .then((response) => response.json())
    .then((links) => {
      const shuffledLinks = links.sort(() => Math.random() - 0.5); // Shuffle the links

      shuffledLinks.forEach((link) => {
        const termLink = document.createElement("a");
        termLink.href = `./${link.link}`; // Ensure the link is relative to the current locale directory
        termLink.textContent = link.name;
        termLink.style.display = "block";
        exploreContainer.appendChild(termLink);
      });
    })
    .catch((error) => {
      console.error("Error fetching directory contents:", error);
    });
}
