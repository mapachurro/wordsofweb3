import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const languageCodesPath = path.join(__dirname, './../public/assets/language-codes.json');
const logFilePath = path.join(__dirname, './directoryOutput.txt');

// Helper function to log messages to a file
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`, "utf-8");
}

// Clear log file at start
fs.writeFileSync(logFilePath, "", "utf-8");

// Load the language codes JSON file
function loadLanguageCodes() {
    try {
        const languageCodes = fs.readFileSync(languageCodesPath, 'utf8');
        logToFile(`Loaded language codes from ${languageCodesPath}`);
        return JSON.parse(languageCodes);
    } catch (err) {
        logToFile(`Error loading language codes from ${languageCodesPath}: ${err.message}`);
        console.error(`Error loading language codes:`, err);
        return null;
    }
}

const languageCodes = loadLanguageCodes();
const locales = languageCodes ? Object.values(languageCodes).map(code => code.fourLetterDash) : [];

// Function to generate index for each directory with localized term names
function generateIndexForDirectory(directoryPath, locale, outputPath) {
    const localeJSONPath = path.join(directoryPath, `${locale}.json`);

    let termsData;
    try {
        termsData = JSON.parse(fs.readFileSync(localeJSONPath, "utf-8")).terms;
        logToFile(`Loaded terms data for locale ${locale}`);
    } catch (err) {
        const errorMessage = `Error loading terms data for locale ${locale} from ${localeJSONPath}: ${err.message}`;
        logToFile(errorMessage);
        console.error(errorMessage);
        return;
    }

    const indexData = Object.entries(termsData).map(([termKey, termObject]) => {
        const termName = termObject.term || termKey; // Use the localized term name if available, else fallback to the termKey
        logToFile(`Processing term '${termKey}': Display name '${termName}'`); // Log each term and its name
        return {
            name: termName, // Use "term" value from JSON instead of key
            link: `${termKey.replace(/\s+/g, "-").toLowerCase()}.html` // Safe link based on the termKey
        };
    });

    try {
        fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2), "utf-8");
        const successMessage = `Index generated at ${outputPath} with ${indexData.length} entries.`;
        logToFile(successMessage);
        console.log(successMessage);
    } catch (writeErr) {
        const errorMessage = `Error writing JSON file ${outputPath}: ${writeErr.message}`;
        logToFile(errorMessage);
        console.error(errorMessage);
    }
}

// Generate the index files for each locale directory
locales.forEach(locale => {
    const directoryPath = path.join(__dirname, './../locales', locale);
    const outputPath = path.join(directoryPath, 'directoryContents.json');
    logToFile(`Generating index for locale: ${locale} at ${directoryPath}`);
    generateIndexForDirectory(directoryPath, locale, outputPath);
});

logToFile("Directory index generation process completed.");
console.log("Directory index generation process completed. Output logged to directoryOutput.txt.");
