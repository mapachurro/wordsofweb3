// This script should ingest a new version of english-terms.csv, and produce a .json file from it 
// which contains the current canonical list of English terms (must align with the list of terms in 
// all-terms.csv), along with their e.g. pronunciation, type of term, definition, etc.

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to input and output files
const inputFilePath = path.join(__dirname, 'english-terms.csv');
const outputDir = path.join(__dirname, 'output_json');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true }); // Ensure directory is created with appropriate options
}

const locale = 'en'; // Adjust the locale as needed
// Initialize an empty object to store terms
const terms = {};

// Function to clean header names (removes 'Term' and square brackets)
function cleanHeader(header) {
  return header.replace(/^Term\s*/, '').replace(/[\[\]]/g, '').trim();
}

fs.createReadStream(inputFilePath)
  .pipe(csvParser())
  .on('headers', (headers) => {
    // Clean headers for consistent access
    headers.forEach((header, index) => {
      headers[index] = cleanHeader(header);
    });
  })
  .on('data', (row) => {
    const termData = {
      term: row['en'] || '',  // Updated to match the cleaned header
      partOfSpeech: row['Part of speech'] || '',
      category: row['Term Category'] || '',
      phonetic: row['Pronunciation (US English)'] || '', // Updated to match the column name
      definition: row['Definition'] || '',
      source: row['Source'] || '',
      dateFirstRecorded: row['Date first recorded'] || '',
    };

    const termKey = termData.term.toLowerCase().replace(/\s+/g, '-');

    terms[termKey] = termData;
  })
  .on('end', () => {
    const outputFilePath = path.join(outputDir, `${locale}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(terms, null, 2));
    console.log(`JSON file has been saved to ${outputFilePath}`);
  })
  .on('error', (err) => {
    console.error('Error processing CSV file:', err);
  });
