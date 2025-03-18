// This script imports terms from a source file to a target glossary.
// It can be run with a specific file or all files in the ecosystem directory.
// It can be run from the command line with "npm run import" or "npm run import -- <file-path>".
// So, either put the file in the ecosystem directory or run the command with the file path.
// Then be sure to put them in the ./imported directory so you don't try to import them again.

import fs from 'fs';
import path from 'path';
import { initializeLanguageCodes, convertLocaleFormat } from '../../../src/js/l10n.js';

// Initialize language codes
await initializeLanguageCodes();

// Get the directory where this script is located
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configuration with paths relative to script location
const CONFIG = {
  localesDir: path.resolve(__dirname, '../../../locales'),
  importDir: path.resolve(__dirname, './ecosystem'),
  reportsDir: path.resolve(__dirname, './reports'),
  defaultLocale: 'en-US'
};

// Create reports directory if it doesn't exist
if (!fs.existsSync(CONFIG.reportsDir)) {
  fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
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

/**
 * Main function to import terms from a source file to target glossaries
 * @param {string} sourceFilePath - Path to the source JSON file with terms to import
 */
async function importTerms(sourceFilePath) {
  try {
    console.log(`Starting import from: ${sourceFilePath}`);
    
    // Extract source name and locale from filename
    const fileName = path.basename(sourceFilePath);
    const fileNameParts = fileName.replace('.json', '').split('_');
    
    // Determine source name and locale
    let sourceName, sourceLocale;
    if (fileNameParts.length >= 2) {
      sourceName = fileNameParts[1]; // e.g., "poap" from "import-poap_en-US.json"
      sourceLocale = fileNameParts[2] || CONFIG.defaultLocale;
    } else {
      sourceName = path.basename(sourceFilePath, '.json');
      sourceLocale = CONFIG.defaultLocale;
    }
    
    console.log(`Source: ${sourceName}, Locale: ${sourceLocale}`);
    
    // Load source data
    const sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf-8'));
    const sourceTerms = sourceData.terms || {};
    
    // Determine target locale
    let targetLocale = sourceLocale;
    
    // Try to convert using language-codes.json if needed
    if (targetLocale.length === 2) {
      const convertedLocale = convertLocaleFormat(targetLocale, "twoLetter", "fourLetterDash");
      if (convertedLocale) {
        targetLocale = convertedLocale;
      } else {
        targetLocale = FALLBACK_LOCALES[targetLocale] || CONFIG.defaultLocale;
      }
    }
    
    console.log(`Target locale: ${targetLocale}`);
    
    // Check if target locale exists
    const localeFilePath = path.join(CONFIG.localesDir, targetLocale, `${targetLocale}.json`);
    if (!fs.existsSync(localeFilePath)) {
      console.log(`⚠️ Target locale file not found: ${localeFilePath}`);
      return;
    }
    
    // Load target glossary
    const glossaryData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'));
    const glossaryTerms = glossaryData.terms || {};
    
    // Statistics for reporting
    let stats = {
      newTermsAdded: [],
      alternateAdded: [],
      skippedTerms: []
    };
    
    // Process terms from source
    for (const [key, newEntry] of Object.entries(sourceTerms)) {
      if (glossaryTerms[key]) {
        // Term exists - check if we should add as alternate
        const existingEntry = glossaryTerms[key];
        const existingDefinition = existingEntry.definition ? existingEntry.definition.trim() : "";
        const newDefinition = newEntry.definition ? newEntry.definition.trim() : "";
        const newSource = newEntry.definitionSource || `${sourceName} Glossary`;
        
        // Skip if the definitions are identical
        if (existingDefinition === newDefinition) {
          stats.skippedTerms.push(key);
          continue;
        }
        
        // Ensure "additional" is an array (backward compatibility)
        if (!Array.isArray(existingEntry.additional)) {
          existingEntry.additional = [];
        }
        
        // Check if the alternate definition is already present
        const isAlreadyAlternate = existingEntry.additional.some(
          alt => alt.definition.trim() === newDefinition
        );
        
        if (!isAlreadyAlternate && newDefinition) {
          existingEntry.additional.push({
            definition: newDefinition,
            source: newSource
          });
          
          stats.alternateAdded.push(key);
        } else {
          stats.skippedTerms.push(key);
        }
      } else {
        // Add entirely new term
        glossaryTerms[key] = {
          term: newEntry.term || key,
          partOfSpeech: newEntry.partOfSpeech || "",
          termCategory: newEntry.termCategory || "",
          phonetic: newEntry.phonetic || "",
          definition: newEntry.definition || "",
          definitionSource: newEntry.definitionSource || `${sourceName} Glossary`,
          sampleSentence: newEntry.sampleSentence || "",
          extended: newEntry.extended || "",
          additional: Array.isArray(newEntry.additional) ? newEntry.additional : [],
          termSource: newEntry.termSource || `${sourceName} Glossary`,
          dateFirstRecorded: newEntry.dateFirstRecorded || new Date().toISOString().split("T")[0],
          commentary: newEntry.commentary || ""
        };
        stats.newTermsAdded.push(key);
      }
    }
    
    // Save the updated glossary file
    glossaryData.terms = glossaryTerms;
    fs.writeFileSync(localeFilePath, JSON.stringify(glossaryData, null, 2), 'utf-8');
    
    // Generate the report
    const reportContent = `
Import Report for ${sourceName} (${targetLocale})
================================================
Date: ${new Date().toISOString()}
Source: ${sourceFilePath}
Target: ${localeFilePath}

Terms skipped (definitions were identical) (${stats.skippedTerms.length}):
${stats.skippedTerms.join(", ")}

Terms added to 'additional' (${stats.alternateAdded.length}):
${stats.alternateAdded.join(", ")}

New terms added (${stats.newTermsAdded.length}):
${stats.newTermsAdded.join(", ")}
`;
    
    const reportFilePath = path.join(CONFIG.reportsDir, `import_report_${sourceName}_${targetLocale}_${Date.now()}.txt`);
    fs.writeFileSync(reportFilePath, reportContent, 'utf-8');
    
    console.log(`✅ Import completed for ${targetLocale}`);
    console.log(`New terms added: ${stats.newTermsAdded.length}`);
    console.log(`Alternate definitions added: ${stats.alternateAdded.length}`);
    console.log(`Terms skipped (identical definitions): ${stats.skippedTerms.length}`);
    console.log(`Report saved to ${reportFilePath}`);
    
    return stats;
  } catch (error) {
    console.error(`❌ Error importing terms:`, error);
    throw error;
  }
}

/**
 * Process all import files in a directory
 * @param {string} directory - Directory containing import files
 * @param {string} pattern - File pattern to match (e.g., 'import-*.json')
 */
async function processImportFiles(directory = CONFIG.importDir, pattern = 'import-*.json') {
  try {
    console.log(`Looking for import files in: ${directory}`);
    
    // Get all import files - using a more flexible pattern
    const files = fs.readdirSync(directory)
      .filter(file => file.startsWith('import-') && file.endsWith('.json'))
      .map(file => path.join(directory, file));
    
    console.log(`Found ${files.length} import files:`, files);
    
    // Process each file
    for (const file of files) {
      try {
        await importTerms(file);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
    
    console.log("🎉 Finished processing all import files!");
  } catch (error) {
    console.error("❌ Error processing import files:", error);
  }
}

// If this script is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check if a specific file was provided
  const specificFile = process.argv[2];
  
  if (specificFile) {
    const filePath = path.resolve(specificFile);
    if (fs.existsSync(filePath)) {
      await importTerms(filePath);
    } else {
      console.error(`File not found: ${filePath}`);
    }
  } else {
    // Process all import files
    await processImportFiles();
  }
}

// Export functions for use in other scripts
export { importTerms, processImportFiles };