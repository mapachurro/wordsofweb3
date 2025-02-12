// This script is meant to import new terms and apply them to their respective locale-specific .json files.

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const localesDir = path.resolve('./locales');
const importDir = path.resolve('./utils/data/import');
const reportDir = path.resolve('./reports');
const csvFilePath = path.join(importDir, 'import.csv');

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

// Function to process and merge data
const processImport = (locale, newTerms) => {
    const glossaryFilePath = path.join(localesDir, locale, `${locale}.json`);
    const reportFilePath = path.join(reportDir, `merge_report_${locale}.txt`);
    
    if (!fs.existsSync(glossaryFilePath)) {
        console.warn(`Skipping ${locale}: No glossary file found.`);
        return;
    }

    const glossaryData = JSON.parse(fs.readFileSync(glossaryFilePath, 'utf-8'));
    const glossaryTerms = glossaryData.terms || {};
    
    let addedTerms = [];
    let skippedTerms = [];
    
    for (const [key, newEntry] of Object.entries(newTerms)) {
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
    
    glossaryData.terms = Object.keys(glossaryTerms).sort().reduce((acc, key) => {
        acc[key] = glossaryTerms[key];
        return acc;
    }, {});
    
    fs.writeFileSync(glossaryFilePath, JSON.stringify(glossaryData, null, 2));
    
    const reportContent = `Terms already existed and were skipped (${skippedTerms.length}):\n${skippedTerms.join(", ")}\n\n` +
                           `Terms added (${addedTerms.length}):\n${addedTerms.join(", ")}`;
    fs.writeFileSync(reportFilePath, reportContent);
    
    console.log(`Import complete for ${locale}. Glossary updated.`);
};

// Process JSON imports
const jsonFiles = fs.readdirSync(importDir).filter(file => file.startsWith('import-') && file.endsWith('.json'));
jsonFiles.forEach(file => {
    const locale = file.replace('import-', '').replace('.json', '');
    const filePath = path.join(importDir, file);
    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        processImport(locale, jsonData.terms);
    } catch (error) {
        console.error(`Error processing ${file}:`, error);
    }
});

// Process CSV import
if (fs.existsSync(csvFilePath)) {
    try {
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const records = parse(csvData, { columns: true, skip_empty_lines: true });
        const localeData = {};
        
        records.forEach(row => {
            const locale = row.locale;
            const key = row.key;
            delete row.locale;
            delete row.key;
            
            if (!localeData[locale]) localeData[locale] = {};
            localeData[locale][key] = row;
        });
        
        Object.entries(localeData).forEach(([locale, terms]) => processImport(locale, terms));
    } catch (error) {
        console.error('Error processing CSV import:', error);
    }
}
