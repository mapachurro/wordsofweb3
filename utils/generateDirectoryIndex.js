import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the language codes JSON file and output log file
const languageCodesPath = path.join(__dirname, '../l10n/language-codes.json');
const logFilePath = path.join(__dirname, './directoryOutput.txt');

// Helper function to log messages to a file
function logToFile(message) {
    fs.appendFileSync(logFilePath, `${message}\n`, "utf-8");
}

// Clear log file at start
fs.writeFileSync(logFilePath, "", "utf-8");

// Load the language codes JSON file with error handling
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

// Generate the locales array by extracting the 'slug' property from each entry
const languageCodes = loadLanguageCodes();
const locales = languageCodes ? Object.values(languageCodes).map(code => code.slug) : [];

// Function to generate index for each directory with error handling
function generateIndexForDirectory(directoryPath, outputPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            const errorMessage = `Error reading directory ${directoryPath}: ${err.message}`;
            logToFile(errorMessage);
            console.error(errorMessage);
            return;
        }

        // Filter HTML files and generate index data
        const indexData = files.filter(file => file.endsWith('.html')).map(file => {
            return {
                name: path.basename(file, '.html'), // Remove the .html extension
                link: path.basename(file, '.html')  // Use only the file name without .html
            };
        });

        // Write the index data to JSON file with error handling
        try {
            fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2), "utf-8");
            const successMessage = `Index generated at ${outputPath}`;
            logToFile(successMessage);
            console.log(successMessage);
        } catch (writeErr) {
            const errorMessage = `Error writing JSON file ${outputPath}: ${writeErr.message}`;
            logToFile(errorMessage);
            console.error(errorMessage);
        }
    });
}

// Generate the index files for each locale directory
locales.forEach(locale => {
    const directoryPath = path.join(__dirname, '../static', locale);
    const outputPath = path.join(directoryPath, 'directoryContents.json');
    logToFile(`Generating index for locale: ${locale} at ${directoryPath}`);
    generateIndexForDirectory(directoryPath, outputPath);
});

logToFile("Directory index generation process completed.");
console.log("Directory index generation process completed. Output logged to directoryOutput.txt.");
