import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('./../../../locales');  // Adjust if necessary
const solanaFilePath = path.resolve('./ecosystem/solana-en-US.json');
const glossaryFilePath = path.resolve(`${localesDir}/en-US/en-US.json`);
const reportFilePath = path.resolve('./reports/merge_report_en-US.txt');

// Load existing glossary data
const glossaryData = JSON.parse(fs.readFileSync(glossaryFilePath, 'utf-8'));
const solanaData = JSON.parse(fs.readFileSync(solanaFilePath, 'utf-8'));

const glossaryTerms = glossaryData.terms || {};
const solanaTerms = solanaData.terms || {};

let addedTerms = [];
let skippedTerms = [];
let alternateAdded = [];

// Process terms from Solana glossary
for (const [key, newEntry] of Object.entries(solanaTerms)) {
    if (glossaryTerms[key]) {
        const existingEntry = glossaryTerms[key];
        const existingDefinition = existingEntry.definition ? existingEntry.definition.trim() : "";
        const newDefinition = newEntry.definition ? newEntry.definition.trim() : "";
        const newSource = newEntry.definitionSource || "Solana Glossary";

        // Skip if the definitions are identical
        if (existingDefinition === newDefinition) {
            skippedTerms.push(key);
            continue;
        }

        // Ensure "alternate" is an array
        if (!Array.isArray(existingEntry.alternate)) {
            existingEntry.alternate = [];
        }

        // Check if the alternate definition is already present
        const isAlreadyAlternate = existingEntry.alternate.some(
            alt => alt.definition.trim() === newDefinition
        );

        if (!isAlreadyAlternate) {
            existingEntry.alternate.push({
                definition: newDefinition,
                source: newSource
            });

            alternateAdded.push(key);
        }
    } else {
        // Add entirely new term from Solana glossary
        glossaryTerms[key] = {
            term: newEntry.term || key,
            partOfSpeech: newEntry.partOfSpeech || "",
            termCategory: newEntry.termCategory || "",
            phonetic: newEntry.phonetic || "",
            definition: newEntry.definition || "",
            definitionSource: newEntry.definitionSource || "Solana Glossary",
            sampleSentence: newEntry.sampleSentence || "",
            extended: newEntry.extended || "",
            alternate: [],
            termSource: newEntry.termSource || "Solana Glossary",
            dateFirstRecorded: new Date().toISOString().split("T")[0],  // Adds the current date
            commentary: ""
        };
        addedTerms.push(key);
    }
}

// Save the updated glossary file
glossaryData.terms = glossaryTerms;
fs.writeFileSync(glossaryFilePath, JSON.stringify(glossaryData, null, 2), 'utf-8');

// Generate the report
const reportContent = `
Terms skipped (definitions were identical) (${skippedTerms.length}):
${skippedTerms.join(", ")}

Terms added to 'alternate' (${alternateAdded.length}):
${alternateAdded.join(", ")}

New terms added (${addedTerms.length}):
${addedTerms.join(", ")}
`;

fs.writeFileSync(reportFilePath, reportContent, 'utf-8');

console.log(`Merge completed for en-US.json`);
console.log(`New terms added: ${addedTerms.length}`);
console.log(`Alternate definitions added: ${alternateAdded.length}`);
console.log(`Terms skipped (identical definitions): ${skippedTerms.length}`);
console.log(`Report saved to ${reportFilePath}`);
