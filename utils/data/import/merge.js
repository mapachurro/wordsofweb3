import fs from 'fs';

// Load the files
const binanceFilePath = './binance_glossary_en.json';
const glossaryFilePath = './en-US.json';
const outputFilePath = './updated_en-US.json';
const reportFilePath = './merge_report.txt';

const binanceData = JSON.parse(fs.readFileSync(binanceFilePath, 'utf-8'));
const glossaryData = JSON.parse(fs.readFileSync(glossaryFilePath, 'utf-8'));

const binanceTerms = binanceData.terms;
const glossaryTerms = glossaryData.terms;

let addedTerms = [];
let skippedTerms = [];

// Merge terms
for (const [key, newEntry] of Object.entries(binanceTerms)) {
    if (glossaryTerms[key]) {
        // Merge logic: keep existing values, fill in blanks
        const existingEntry = glossaryTerms[key];
        for (const subKey of Object.keys(newEntry)) {
            if (!existingEntry[subKey] || existingEntry[subKey].trim() === "") {
                existingEntry[subKey] = newEntry[subKey];
            }
        }
        skippedTerms.push(key);
    } else {
        // Add new term, keeping terms sorted alphabetically
        glossaryTerms[key] = newEntry;
        addedTerms.push(key);
    }
}

// Sort terms alphabetically
const sortedGlossaryTerms = Object.keys(glossaryTerms).sort().reduce((acc, key) => {
    acc[key] = glossaryTerms[key];
    return acc;
}, {});

glossaryData.terms = sortedGlossaryTerms;

// Save updated glossary
fs.writeFileSync(outputFilePath, JSON.stringify(glossaryData, null, 2));

// Generate report
const reportContent = `Terms already existed and were skipped (${skippedTerms.length}):\n${skippedTerms.join(", ")}\n\n` +
                       `Terms added (${addedTerms.length}):\n${addedTerms.join(", ")}`;
fs.writeFileSync(reportFilePath, reportContent);

console.log(`Merge complete. Updated glossary saved to ${outputFilePath}`);
console.log(`Report generated at ${reportFilePath}`);
