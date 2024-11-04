// This should create the alphabetical listing of terms shown on each language's homepage.

export default function initExplore(directoryContents, locale = 'en') {
  const exploreContainer = document.getElementById("explore-container");

  if (!directoryContents || directoryContents.length === 0) {
    console.error("No directory contents available for explore feature");
    return;
  }

  // Sort directoryContents alphabetically based on the locale
  const collator = new Intl.Collator(locale);
  const sortedLinks = directoryContents.sort((a, b) => collator.compare(a.name, b.name));

  sortedLinks.forEach((link) => {
    const termLink = document.createElement("a");
    termLink.href = `./${link.link}`;
    termLink.textContent = link.name;
    termLink.style.display = "block";
    exploreContainer.appendChild(termLink);
  });
}
