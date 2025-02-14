import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('../../../locales');
const binanceDir = path.resolve('./ecosystem');
const reportDir = path.resolve('./reports');

const localeFiles = fs.readdirSync(binanceDir).filter(file => file.endsWith('.json'));
const reportFiles = fs.readdirSync(reportDir).filter(file => file.startsWith('merge_report_') && file.endsWith('.txt'));

reportFiles.forEach(reportFile => {
    const localeCode = reportFile.replace('merge_report_', '').replace('.txt', '');
    const reportFilePath = path.join(reportDir, reportFile);
    const glossaryFilePath = path.join(localesDir, localeCode, `${localeCode}.json`);
    const binanceFilePath = path.join(binanceDir, `binance_glossary_${localeCode}.json`);

    if (!fs.existsSync(glossaryFilePath) || !fs.existsSync(binanceFilePath)) {
        console.warn(`Glossary or Binance file for ${localeCode} not found, skipping.`);
        return;
    }

    const glossaryData = JSON.parse(fs.readFileSync(glossaryFilePath, 'utf-8'));
    const binanceData = JSON.parse(fs.readFileSync(binanceFilePath, 'utf-8'));

    const glossaryTerms = glossaryData.terms;
    const binanceTerms = binanceData.terms;

    const reportContent = fs.readFileSync(reportFilePath, 'utf-8');
    const skippedTerms = reportContent.match(/^[a-z0-9-]+/gm) || []; // Extract terms from report

    let updated = false;

    skippedTerms.forEach(termKey => {
        if (glossaryTerms[termKey] && binanceTerms[termKey]) {
            const binanceDefinition = binanceTerms[termKey].definition || "";

            if (!binanceDefinition.trim()) return;

            if (!Array.isArray(glossaryTerms[termKey].alternate)) {
                glossaryTerms[termKey].alternate = [];
            }

            // Avoid duplicate alternate definitions
            if (!glossaryTerms[termKey].alternate.some(alt => alt.definition === binanceDefinition)) {
                glossaryTerms[termKey].alternate.push({
                    definition: binanceDefinition,
                    source: "Binance Glossary"
                });
                updated = true;
            }
        }
    });

    if (updated) {
        fs.writeFileSync(glossaryFilePath, JSON.stringify(glossaryData, null, 2));
        console.log(`Updated alternate definitions for ${localeCode} in ${glossaryFilePath}`);
    }
});
