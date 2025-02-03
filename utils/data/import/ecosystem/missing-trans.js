//This script can print out a .json file of words that are present in English, but not in 
//other langauges. It depends on another script, in the scraper repo, to produce the matched-
//translations.json file.

import fs from 'fs';

// Load the matched translations file
const translationsFile = './matched-translations.json'; // Adjust path if needed
const enGlossaryFile = '../../../../locales/en-US/en-US.json'; // Your base English glossary

// Load JSON files
const translations = JSON.parse(fs.readFileSync(translationsFile, 'utf8'));
const enGlossary = JSON.parse(fs.readFileSync(enGlossaryFile, 'utf8'));

// Extract the list of locales from `matched-translations.json`
const locales = Object.values(translations).reduce((acc, termObj) => {
    Object.keys(termObj).forEach(locale => acc.add(locale));
    return acc;
}, new Set());

locales.delete("en"); // Remove English, since it's the base reference

// Iterate over each locale
locales.forEach(locale => {
    let newTerms = {};

    Object.entries(translations).forEach(([key, termData]) => {
        // Check if the term is in English but missing in this locale
        if (termData["en"] && !termData[locale]) {
            newTerms[key] = {
                term: termData["en"], // Keep English term as reference
                missingLocale: locale
            };
        }
    });

    // Save only if there are missing terms
    if (Object.keys(newTerms).length > 0) {
        const outputFile = `new-terms-${locale}.json`;
        fs.writeFileSync(outputFile, JSON.stringify(newTerms, null, 2), 'utf8');
        console.log(`Saved ${outputFile} with ${Object.keys(newTerms).length} missing terms.`);
    }
});

console.log("Finished generating missing terms for all locales.");
