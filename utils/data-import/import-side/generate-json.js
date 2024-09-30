// This script is intended to create the .json files located at /locales/<locale-code>/<locale-code>.json.
// They are the structured skeleton of the data that will go in each individual entry page.

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const translationsCSV = 'ext-sync-terms.csv'; // Translation CSV
const outputDir = 'locales'; // The directory where JSON files will be saved

// Function to ensure a directory exists
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to clean header names (removes square brackets)
function cleanHeader(header) {
  return header.replace(/[\[\]]/g, '');
}

// Function to process the CSV file
function processCSV() {
  const results = [];
  fs.createReadStream(translationsCSV)
    .pipe(csvParser())
    .on('headers', (headers) => {
      headers.forEach((header, index) => {
        headers[index] = cleanHeader(header);
      });
    })
    .on('data', (data) => results.push(data))
    .on('end', () => {
      generateJSONFiles(results);
    });
}

// Function to generate JSON files for each locale
function generateJSONFiles(data) {
  const locales = Object.keys(data[0]).slice(1); // Get all locale columns except the first one (English terms)

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
      const englishTerm = row['en']; // English term is the key in the JSON structure
      const translatedTerm = row[locale] || englishTerm; // Use translation if available, otherwise use the English term

      if (englishTerm) {
        localeData.terms[englishTerm] = {
          "term": translatedTerm,
          "phonetic": "",
          "partOfSpeech": "",
          "definition": "",
          "termCategory": "",
          "source": "",
          "datefirstseen": ""
        };
      } else {
        console.warn(`Warning: Found an undefined term in row: ${JSON.stringify(row)}`);
      }
    });

    // Write the updated JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(localeData, null, 2));
    console.log(`Generated or updated JSON file for ${locale}: ${outputFilePath}`);
  });

  console.log('All locales processed successfully.');
}

// Run the script
processCSV();
