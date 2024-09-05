import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertLanguageFormat } from '../src/js/l10n.js';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a write stream to a .txt file
const logFilePath = path.join(__dirname, 'intertextual-output.txt');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });  // 'a' flag to append to the file

// Function to log to both the file and the console
function logMessage(message) {
    console.log(message);           // Log to console
    logStream.write(message + '\n'); // Log to file
}

// Function to escape special characters for use in RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const localesDir = path.join(__dirname, '../locales');
const staticDir = path.join(__dirname, '../static');

export default function intertextualLinks() {
    fs.readdirSync(staticDir).forEach(async (slugDir) => {
        if (slugDir === 'assets') return;  // Skip non-locale directories

        logMessage(`Attempting to convert slug: ${slugDir}`);
        
        const locale = await convertLanguageFormat(slugDir, 'slug', 'fourLetterDash');
        logMessage(`Locale code found for ${slugDir}: ${locale}`);

        if (!locale) {
            logMessage(`No matching locale found for slug: ${slugDir}`);
            return; // Skip if the conversion fails
        }

        const localePath = path.join(localesDir, locale, `${locale}.json`);
        let terms;

        try {
            const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
            terms = data.terms;
            logMessage(`Successfully loaded terms for locale: ${locale}`);
        } catch (err) {
            logMessage(`Failed to load terms for locale: ${locale} - ${err.message}`);
            return;
        }

        const localeStaticDir = path.join(staticDir, slugDir);
        fs.readdirSync(localeStaticDir).forEach((file) => {
            const filePath = path.join(localeStaticDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            const descriptionRegex = /<p id="definition">([\s\S]*?)<\/p>/i;
            const descriptionMatch = content.match(descriptionRegex);
                if (!descriptionMatch) {
                    logMessage(`No <p id="definition"> tag found in file: ${filePath}`);
                return;  // Skip this file if no description is found
                }

            let descriptionContent = descriptionMatch[1];  // Content inside <p id="definition">


            const sortedTerms = Object.keys(terms).sort((a, b) => terms[b].term.length - terms[a].term.length);

            sortedTerms.forEach((termKey) => {
                const term = terms[termKey];
                if (!term || !term.term) {
                    logMessage(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
                    return;
                }

                const escapedTerm = escapeRegExp(term.term);
                const termRegex = new RegExp(`\\b${escapedTerm}\\b`, 'g');

                const fileName = `${term.term.replace(/\s+/g, '-').toLowerCase()}.html`;
                if (file.toLowerCase() === fileName.toLowerCase()) {
                    logMessage(`Skipping self-linking for term: ${term.term}`);
                    return;
                }

                descriptionContent = descriptionContent.replace(termRegex, (match) => {
                    const hasAnchorTag = new RegExp(`<a [^>]*>${escapeRegExp(match)}<\/a>`, 'g').test(descriptionContent);
                    if (hasAnchorTag) return match;

                    logMessage(`Linking term '${match}' to file '${fileName}' in ${filePath}`);
                    return `<a href="./${fileName}">${match}</a>`;
                });
            });

            content = content.replace(descriptionRegex, `<p id="definition">${descriptionContent}</p>`);

            try {
                fs.writeFileSync(filePath, content, 'utf-8');
                logMessage(`Updated: ${filePath}`);
            } catch (err) {
                logMessage(`Failed to write file: ${filePath} - ${err.message}`);
            }
        });
    });

    logMessage('Intertextual links inserted.');
}
