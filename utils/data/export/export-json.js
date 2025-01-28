//This script takes a single locale's .json file and exports it to a .CSV file.
// As you would expect, the json object keys are the labels in Row 1, and the values
// for each of those keys in each term are each row after that.

import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

// Load JSON file
const inputFilePath = path.join('../../../locales/en-US/en-US.json');
const outputFilePath = path.join('./glossary.csv');

const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
const terms = jsonData.terms;

if (!terms) {
  console.error('No terms found in JSON file.');
  process.exit(1);
}

// Extract column headers dynamically
const headers = ['key', ...Object.keys(Object.values(terms)[0])];

// Convert to CSV format
const rows = Object.entries(terms).map(([key, values]) => ({
  key, // JSON object key (e.g., "51%-attack", "account")
  ...values, // Spread remaining properties
}));

try {
  const csv = parse(rows, { fields: headers });
  fs.writeFileSync(outputFilePath, csv, 'utf8');
  console.log(`CSV successfully created: ${outputFilePath}`);
} catch (error) {
  console.error('Error generating CSV:', error);
}
