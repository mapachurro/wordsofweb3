const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const translationsCSV = 'ext-sync-terms.csv'; // Translation CSV
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
  fs.createReadStream(translationsCSV)
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
    const localeDir = path.join(outputDir, locale);
    ensureDirectoryExistence(localeDir);

    const outputFilePath = path.join(localeDir, `${locale}.json`);
    let localeData = {};

    // Check if the JSON file already exists
    if (fs.existsSync(outputFilePath)) {
      localeData = JSON.parse(fs.readFileSync(outputFilePath));
    } else {
      localeData = { terms: {} }; // Initialize with an empty terms object
    }

    // Process each row in the CSV
    data.forEach(row => {
      const englishTerm = row['en']; // Assuming the first column is always English
      const translatedTerm = row[locale] || ""; // Get the translation for the current locale

      // Add or update the term in the JSON structure
      localeData.terms[englishTerm] = localeData.terms[englishTerm] || {
        "term": translatedTerm,
        "phonetic": "",
        "partOfSpeech": "",
        "definition": "",
        "termCategory": "",
        "source": "",
        "datefirstseen": ""
      };
    });

    // Write the updated JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(localeData, null, 2));
    console.log(`Generated or updated JSON file for ${locale}: ${outputFilePath}`);
  });
}

// Run the script
processCSV();
