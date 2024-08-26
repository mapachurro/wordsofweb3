const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const inputCSV = 'ext-sync-terms.csv'; // Replace with your actual file path
const outputDir = 'locales'; // The directory where JSON files will be saved

// Function to ensure a directory exists
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to process the CSV file
function processCSV() {
  const results = [];
  fs.createReadStream(inputCSV)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      generateJSONFiles(results);
    });
}

// Function to generate JSON files for each locale
function generateJSONFiles(data) {
  const locales = Object.keys(data[0]).slice(1); // Get all locale columns except the first one (terms)
  
  locales.forEach(locale => {
    const localeData = {};

    data.forEach(row => {
      const term = row['en']; // Assuming the first column is always English
      const translation = row[locale]; // Get the translation for the current locale
      
      localeData[term] = {
        "Part of speech": "", // Placeholder, populate with actual data when available
        "Term Category": "", // Placeholder
        "Phonetic": "", // Placeholder
        "Definition": translation, // Use the translated term as the definition
        "Source": "", // Placeholder
        "Date first recorded": "" // Placeholder
      };
    });

    const localeDir = path.join(outputDir, locale);
    ensureDirectoryExistence(localeDir);
    
    const outputFilePath = path.join(localeDir, `${locale}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(localeData, null, 2));
    console.log(`Generated JSON file for ${locale}: ${outputFilePath}`);
  });
}

// Run the script
processCSV();
