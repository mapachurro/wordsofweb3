import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('../../../locales');
const binanceDir = path.resolve('./ecosystem');
const reportDir = path.resolve('./reports');

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const localeFiles = fs.readdirSync(binanceDir).filter(file => file.endsWith('.json'));

localeFiles.forEach(file => {
    const localeCode = file.replace('solana-', '').replace('.json', '');
    const binanceFilePath = path.join(binanceDir, file);
    const glossaryFilePath = path.join(localesDir, localeCode, `${localeCode}.json`);
    const reportFilePath = path.join(reportDir, `merge_report_${localeCode}.txt`);

    if (!fs.existsSync(glossaryFilePath)) {
        console.warn(`Canonical glossary file for ${localeCode} not found, skipping.`);
        return;
    }

    const binanceData = JSON.parse(fs.readFileSync(binanceFilePath, 'utf-8'));
    const glossaryData = JSON.parse(fs.readFileSync(glossaryFilePath, 'utf-8'));

    const binanceTerms = binanceData.terms;
    const glossaryTerms = glossaryData.terms;

    let addedTerms = [];
    let skippedTerms = [];
    let alternateAdded = [];

    for (const [key, newEntry] of Object.entries(binanceTerms)) {
        if (glossaryTerms[key]) {
            const existingEntry = glossaryTerms[key];

            // If the Binance definition is the same as the existing one, skip it
            if (newEntry.definition) {
                const existingDefinition = existingEntry.definition ? existingEntry.definition.trim() : "";
                const binanceDefinition = newEntry.definition.trim();
                const binanceSource = newEntry.definitionSource && newEntry.definitionSource.trim() !== "" 
                    ? newEntry.definitionSource 
                    : "Binance Glossary"; // Only use URL if present
            
                // Skip if the Binance definition is the same as the existing main definition
                if (existingDefinition === binanceDefinition) {
                    skippedTerms.push(key);
                    continue;
                }
            
                // Ensure "alternate" is an array
                if (!Array.isArray(existingEntry.alternate)) {
                    existingEntry.alternate = [];
                }
            
                // Check if the alternate definition is already present
                const isAlreadyAlternate = existingEntry.alternate.some(
                    alt => alt.definition.trim() === binanceDefinition
                );
            
                if (!isAlreadyAlternate) {
                    existingEntry.alternate.push({
                        definition: binanceDefinition,
                        source: binanceSource // Only use actual source, not a default
                    });
            
                    alternateAdded.push(key);
                }
            }
        }
    }            

    // Write the updated glossary JSON back
    fs.writeFileSync(glossaryFilePath, JSON.stringify(glossaryData, null, 2));

    // Generate a new report
    const reportContent = 
        `Terms skipped (definitions were identical) (${skippedTerms.length}):\n${skippedTerms.join(", ")}\n\n` +
        `Terms added to 'alternate' (${alternateAdded.length}):\n${alternateAdded.join(", ")}\n\n` +
        `New terms added (${addedTerms.length}):\n${addedTerms.join(", ")}`;

    fs.writeFileSync(reportFilePath, reportContent);

    console.log(`Merge complete for ${localeCode}.`);
    console.log(`Updated glossary saved to ${glossaryFilePath}`);
    console.log(`Report generated at ${reportFilePath}`);
});
