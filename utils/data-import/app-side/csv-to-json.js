const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Paths to input and output files
const inputFilePath = path.join(__dirname, 'en-glossary-149.csv');
const outputDir = path.join(__dirname, 'output_json');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const locale = 'en'; // Adjust the locale as needed

// Initialize an empty object to store terms
const terms = {};

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const termData = {
      term: row['Term'] || '',
      partOfSpeech: row['Part of speech'] || '',
      category: row['Term Category'] || '',
      phonetic: row['Phonetic'] || '',
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
