import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('../../../locales');
const binanceDir = path.resolve('./ecosystem/binance-feb-2025');
const reportDir = path.resolve('./reports');

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const localeFiles = fs.readdirSync(binanceDir).filter(file => file.endsWith('.json'));

localeFiles.forEach(file => {
    const localeCode = file.replace('binance_glossary_', '').replace('.json', '');
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
            if (newEntry.definition && (!existingEntry.alternate || !existingEntry.alternate.some(alt => alt.definition === newEntry.definition))) {
                if (!Array.isArray(existingEntry.alternate)) {
                    existingEntry.alternate = [];
                }
            
                existingEntry.alternate.push({
                    definition: newEntry.definition,
                    source: newEntry.definitionSource || "Binance Glossary"
                });
            
                alternateAdded.push(key);
            }
            
        } else {
            glossaryTerms[key] = newEntry;
            addedTerms.push(key);
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
