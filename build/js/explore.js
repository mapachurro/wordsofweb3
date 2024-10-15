export default function initExplore(directoryContents) {
  const exploreContainer = document.getElementById("explore-container");

  if (!directoryContents || directoryContents.length === 0) {
    console.error("No directory contents available for explore feature");
    return;
  }

  const shuffledLinks = directoryContents.sort(() => Math.random() - 0.5); // Shuffle the links

  shuffledLinks.forEach((link) => {
    const termLink = document.createElement("a");
    termLink.href = `./${link.link}`; // Ensure the link is relative to the current locale directory
    termLink.textContent = link.name;
    termLink.style.display = "block";
    exploreContainer.appendChild(termLink);
  });
}
