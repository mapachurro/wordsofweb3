import fs from 'fs';

// File paths
const BINANCE_FILE = 'binance_glossary_en.json';
const EXISTING_FILE = '../../../../locales/en-US/en-US.json';
const OUTPUT_FILE = 'new-terms-en.json';

// Load Binance glossary
const binanceData = JSON.parse(fs.readFileSync(BINANCE_FILE, 'utf-8'));
const existingData = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf-8'));

// Extract term keys
const binanceTerms = binanceData.terms;
const existingTerms = new Set(Object.keys(existingData.terms));

// Find missing terms
const newTerms = {};

for (const [termKey, termValue] of Object.entries(binanceTerms)) {
    if (!existingTerms.has(termKey)) {
        newTerms[termKey] = termValue;
    }
}

// Save new terms to JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ terms: newTerms }, null, 4), 'utf-8');

console.log(`✅ Found ${Object.keys(newTerms).length} new terms. Saved to ${OUTPUT_FILE}`);
