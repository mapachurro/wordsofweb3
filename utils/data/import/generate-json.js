// This script is intended to create the .json files located at /locales/<locale-code>/<locale-code>.json.
// They are the structured skeleton of the data that will go in each individual entry page.
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsCSV = path.join(__dirname, 'all-terms.csv'); // Translation CSV
const outputDir = path.join(__dirname, 'locales'); // The directory where JSON files will be saved

// Function to ensure a directory exists
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to clean header names (removes 'Term' and square brackets)
function cleanHeader(header) {
  return header.replace(/^Term\s*/, '').replace(/[\[\]]/g, '').trim();
}

// Function to get the correct header for the English terms
function getEnglishHeader(headers) {
  const englishHeaders = ['en', 'en-US', 'English'];
  return headers.find(header => englishHeaders.includes(header)) || null;
}

// Function to process the CSV file
function processCSV() {
  const results = [];
  let englishHeader = null;

  fs.createReadStream(translationsCSV)
    .pipe(csvParser())
    .on('headers', (headers) => {
      headers.forEach((header, index) => {
        headers[index] = cleanHeader(header);
      });
      englishHeader = getEnglishHeader(headers);
      if (!englishHeader) {
        console.error('Error: No valid English header found in the CSV file.');
        process.exit(1);
      }
    })
    .on('data', (data) => results.push(data))
    .on('end', () => {
      generateJSONFiles(results, englishHeader);
    });
}

// Function to generate JSON files for each locale
function generateJSONFiles(data, englishHeader) {
  const locales = Object.keys(data[0]).filter(key => key !== englishHeader); // Get all locale columns except the English terms

  locales.forEach(locale => {
    const localeDir = path.join(outputDir, locale);
    ensureDirectoryExistence(localeDir);

    const outputFilePath = path.join(localeDir, `${locale}.json`);
    let localeData = {};

    // Check if the JSON file already exists
    if (fs.existsSync(outputFilePath)) {
      localeData = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
    } else {
      localeData = { terms: {} }; // Initialize with an empty terms object
    }

    // Process each row in the CSV
    data.forEach(row => {
      const englishTerm = row[englishHeader]; // English term is the key in the JSON structure
      const translatedTerm = row[locale] || englishTerm; // Use translation if available, otherwise use the English term

      if (englishTerm) {
        const termKey = englishTerm.toLowerCase().replace(/\s+/g, '-');
        localeData.terms[termKey] = {
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
