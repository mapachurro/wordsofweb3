import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('../../../locales');
const binanceDir = path.resolve('./ecosystem');
const outputDir = localesDir; // Save the merged files in the same directory
const reportDir = path.resolve('./reports');

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const localeFiles = fs.readdirSync(binanceDir).filter(file => file.endsWith('.json'));

localeFiles.forEach(file => {
    const localeCode = file.replace('binance_glossary_', '').replace('.json', '');
    const binanceFilePath = path.join(binanceDir, file);
    const glossaryFilePath = path.join(localesDir, localeCode, `${localeCode}.json`);
    const outputFilePath = glossaryFilePath;
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

    for (const [key, newEntry] of Object.entries(binanceTerms)) {
        if (glossaryTerms[key]) {
            const existingEntry = glossaryTerms[key];
            for (const subKey of Object.keys(newEntry)) {
                if (!existingEntry[subKey] || existingEntry[subKey].trim() === "") {
                    existingEntry[subKey] = newEntry[subKey];
                }
            }
            skippedTerms.push(key);
        } else {
            glossaryTerms[key] = newEntry;
            addedTerms.push(key);
        }
    }

    const sortedGlossaryTerms = Object.keys(glossaryTerms).sort().reduce((acc, key) => {
        acc[key] = glossaryTerms[key];
        return acc;
    }, {});

    glossaryData.terms = sortedGlossaryTerms;
    fs.writeFileSync(outputFilePath, JSON.stringify(glossaryData, null, 2));

    const reportContent = `Terms already existed and were skipped (${skippedTerms.length}):\n${skippedTerms.join(", ")}\n\n` +
                           `Terms added (${addedTerms.length}):\n${addedTerms.join(", ")}`;
    fs.writeFileSync(reportFilePath, reportContent);

    console.log(`Merge complete for ${localeCode}. Updated glossary saved to ${outputFilePath}`);
    console.log(`Report generated at ${reportFilePath}`);
});
