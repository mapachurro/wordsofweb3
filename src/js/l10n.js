import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


export default function initl10n() {
// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLanguageMap() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../../l10n/language-codes.json'), 'utf8'));
}

function convertLanguageFormat(value, fromFormat, toFormat) {
    const languageMap = loadLanguageMap();
    for (let key in languageMap) {
        if (languageMap[key][fromFormat] === value) {
            return languageMap[key][toFormat];
        }
    }
    return null; // or throw an error if not found
}
}
// // Example usage:
// const toSlugName = convertLanguageFormat("en-US", "fourLetterDash", "slug");
// console.log(toSlugName); // Output: "us-english"

// const toFourLetterDash = convertLanguageFormat("us-english", "slug", "fourLetterDash");
// console.log(toFourLetterDash); // Output: "en-US"
