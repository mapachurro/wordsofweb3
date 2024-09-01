
function initExplore() {
    const exploreContainer = document.getElementById('explore-container');
    const directoryPath = './us-english/'; // Path to the directory with the entry pages

    fetch(directoryPath) // Fetch the directory contents
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));

        const shuffledLinks = links.sort(() => Math.random() - 0.5); // Shuffle the links

        shuffledLinks.forEach(link => {
          const term = link.textContent.replace('.html', ''); // Remove the .html extension from the term
          const termLink = document.createElement('a');
          termLink.href = directoryPath + link.getAttribute('href');
          termLink.textContent = term;
          termLink.style.display = 'block';
          exploreContainer.appendChild(termLink);
        });
      })
      .catch(error => {
        console.error('Error fetching directory contents:', error);
      });
  }
