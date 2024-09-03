export default function initExplore() {
  const exploreContainer = document.getElementById('explore-container');
  const jsonFilePath = './directoryContents.json'; // Path to the JSON file

  fetch(jsonFilePath) // Fetch the JSON file
    .then(response => response.json())
    .then(links => {
      const shuffledLinks = links.sort(() => Math.random() - 0.5); // Shuffle the links

      shuffledLinks.forEach(link => {
        const termLink = document.createElement('a');
        termLink.href = './' + link.link;
        termLink.textContent = link.name;
        termLink.style.display = 'block';
        exploreContainer.appendChild(termLink);
      });
    })
    .catch(error => {
      console.error('Error fetching directory contents:', error);
    });
}
