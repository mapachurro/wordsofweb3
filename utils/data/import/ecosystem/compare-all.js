// This script was set up to compare a glossary pulled from Binance academy with ours,
// across locales, and if Binance had a term we didn't, add it to a new .json file that 
// could then be stitched onto ours, complete with attribution to Binance.

import fs from 'fs';
import path from 'path';
import { initializeLanguageCodes, convertLocaleFormat } from '../../../../src/js/l10n.js';

// Initialize language codes
await initializeLanguageCodes();

const LOCALES_DIR = '../../../../locales';
const OUTPUT_DIR = './new-terms';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Improved Fallback Mappings
const FALLBACK_LOCALES = {
    "ar": "ar-001",
    "bg": "bg-BG",
    "cs": "cs-CZ",
    "da": "da-DK",
    "de-CH": "de-DE",
    "el": "el-GR",
    "en": "en-US",
    "es": "es-419",
    "et": "et-EE",
    "hu": "hu-HU",
    "id": "id-ID",
    "it": "it-IT",
    "ja": "ja-JP",
    "ka": "ka-GE",
    "kk": "kk-KZ",
    "lt": "lt-LT",
    "lv": "lv-LV",
    "pl": "pl-PL",
    "pt": "pt-BR",
    "ro": "ro-RO",
    "sk": "sk-SK",
    "sv": "sv-SE",
    "vi": "vi-VN",
    "zh": "zh-CN"
};

// Get all Binance glossary files
const binanceFiles = fs.readdirSync('.').filter(file => file.startsWith('binance_glossary_') && file.endsWith('.json'));

binanceFiles.forEach(binanceFile => {
    const binanceLocale = binanceFile.replace('binance_glossary_', '').replace('.json', '');
    
    // Try to convert using language-codes.json
    let projectLocale = convertLocaleFormat(binanceLocale, "twoLetter", "fourLetterDash");

    // Use fallback if no match is found
    if (!projectLocale) {
        projectLocale = FALLBACK_LOCALES[binanceLocale] || null;
    }

    if (!projectLocale) {
        console.log(`⚠️ No matching project locale for Binance code: ${binanceLocale}`);
        return;
    }

    const localeFilePath = path.join(LOCALES_DIR, projectLocale, `${projectLocale}.json`);

    if (!fs.existsSync(localeFilePath)) {
        console.log(`⚠️ Skipping ${projectLocale} - No existing glossary found.`);
        return;
    }

    const binanceData = JSON.parse(fs.readFileSync(binanceFile, 'utf-8'));
    const binanceTerms = binanceData.terms;

    const existingData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'));
    const existingTerms = new Set(Object.values(existingData.terms).map(term => term.term.toLowerCase()));

    const newTerms = {};
    for (const [termKey, termValue] of Object.entries(binanceTerms)) {
        if (!existingTerms.has(termValue.term.toLowerCase())) {
            newTerms[termKey] = termValue;
        }
    }

    if (Object.keys(newTerms).length > 0) {
        const outputFilePath = path.join(OUTPUT_DIR, `new-terms-${projectLocale}.json`);
        fs.writeFileSync(outputFilePath, JSON.stringify({ terms: newTerms }, null, 4), 'utf-8');
        console.log(`✅ Saved ${outputFilePath} with ${Object.keys(newTerms).length} new terms.`);
    } else {
        console.log(`✅ No new terms found for ${projectLocale}.`);
    }
});

console.log("🎉 Finished processing all languages!");
