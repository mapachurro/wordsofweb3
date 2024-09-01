const fs = require('fs');
const path = require('path');

const rootDirectory = path.join(__dirname, '../content'); // Adjust this path to your content directory
const locales = ['us-english', 'deutsch', 'italiano']; // Add all your supported locales here

function generateIndexForDirectory(directoryPath, outputPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directoryPath}:`, err);
      return;
    }

    const indexData = files.filter(file => file.endsWith('.html')).map(file => {
      return {
        name: path.basename(file, '.html'), // Remove the .html extension
        link: file
      };
    });

    fs.writeFile(outputPath, JSON.stringify(indexData, null, 2), (err) => {
      if (err) {
        console.error(`Error writing JSON file ${outputPath}:`, err);
      } else {
        console.log(`Index generated at ${outputPath}`);
      }
    });
  });
}

locales.forEach(locale => {
  const directoryPath = path.join(rootDirectory, locale);
  const outputPath = path.join(directoryPath, 'directoryContents.json');
  generateIndexForDirectory(directoryPath, outputPath);
});
