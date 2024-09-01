import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the language codes JSON file
const languageCodesPath = path.join(__dirname, '../l10n/language-codes.json');

// Load the language codes JSON file
function loadLanguageCodes() {
    const languageCodes = fs.readFileSync(languageCodesPath, 'utf8');
    return JSON.parse(languageCodes);
}

// Generate the locales array by extracting the 'slug' property from each entry
const languageCodes = loadLanguageCodes();
const locales = Object.values(languageCodes).map(code => code.slug);

// Function to generate index for each directory
function generateIndexForDirectory(directoryPath, outputPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${directoryPath}:`, err);
            return;
        }

        const indexData = files.filter(file => file.endsWith('.html')).map(file => {
            return {
                name: path.basename(file, '.html'), // Remove the .html extension
                link: file
            };
        });

        fs.writeFile(outputPath, JSON.stringify(indexData, null, 2), (err) => {
            if (err) {
                console.error(`Error writing JSON file ${outputPath}:`, err);
            } else {
                console.log(`Index generated at ${outputPath}`);
            }
        });
    });
}

// Generate the index files for each locale directory
locales.forEach(locale => {
    const directoryPath = path.join(__dirname, '../static', locale);
    const outputPath = path.join(directoryPath, 'directoryContents.json');
    generateIndexForDirectory(directoryPath, outputPath);
});
