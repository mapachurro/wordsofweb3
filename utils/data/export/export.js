//This script takes a single locale's .json file and exports it to a .CSV file.
// As you would expect, the json object keys are the labels in Row 1, and the values
// for each of those keys in each term are each row after that.
import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

const localesDir = path.join(process.cwd(), './locales');
const outputFilePath = path.join(process.cwd(), 'glossary.csv');

let allRows = [];
let headers = new Set(['locale', 'key']);

try {
  const locales = fs.readdirSync(localesDir).filter((dir) =>
    fs.statSync(path.join(localesDir, dir)).isDirectory()
  );

  locales.forEach((locale) => {
    const glossaryFile = path.join(localesDir, locale, `${locale}.json`);
    if (!fs.existsSync(glossaryFile)) {
      console.warn(`Skipping ${locale}: No glossary file found.`);
      return;
    }

    try {
      const jsonData = JSON.parse(fs.readFileSync(glossaryFile, 'utf8'));
      const terms = jsonData.terms;
      if (!terms) {
        console.warn(`Skipping ${locale}: No terms found.`);
        return;
      }

      Object.keys(Object.values(terms)[0] || {}).forEach((key) => headers.add(key));

      const rows = Object.entries(terms).map(([key, values]) => ({
        locale,
        key,
        ...values,
      }));
      
      allRows.push(...rows);
    } catch (error) {
      console.error(`Error processing ${locale}:`, error);
    }
  });

  if (allRows.length > 0) {
    const csv = parse(allRows, { fields: Array.from(headers) });
    fs.writeFileSync(outputFilePath, csv, 'utf8');
    console.log(`CSV successfully created: ${outputFilePath}`);
  } else {
    console.warn('No data extracted from locales. CSV not created.');
  }
} catch (error) {
  console.error('Error reading locales directory:', error);
}
