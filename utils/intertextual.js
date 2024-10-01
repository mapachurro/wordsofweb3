import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeLanguageCodes, convertLocaleFormat, getLocaleInfo } from '../src/js/l10n.js'; // Import l10n.js utilities

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a write stream to a .txt file for logging
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

// Function to inject intertextual links into glossary pages
export default async function intertextualLinks() {
    // Ensure language codes are loaded before proceeding
    await initializeLanguageCodes();

    fs.readdirSync(staticDir).forEach(async (slugDir) => {
        if (slugDir === 'assets') return;  // Skip non-locale directories like 'assets'

        logMessage(`Attempting to convert slug: ${slugDir}`);
        
        // Use centralized locale conversion from l10n.js
        let locale;
        try {
            locale = await convertLocaleFormat(slugDir, 'slug', 'fourLetterDash');
        } catch (err) {
            logMessage(`Failed to convert slug: ${slugDir} - ${err.message}`);
            return;
        }

        logMessage(`Locale code found for ${slugDir}: ${locale}`);

        if (!locale) {
            logMessage(`No matching locale found for slug: ${slugDir}`);
            return; // Skip if no matching locale is found
        }

        const localePath = path.join(localesDir, locale, `${locale}.json`);
        let terms;

        // Try loading terms for the locale
        try {
            const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
            terms = data.terms;
            if (!terms || typeof terms !== 'object') {
                throw new Error(`Terms are not defined or not an object for locale: ${locale}`);
            }
            logMessage(`Successfully loaded terms for locale: ${locale}`);
        } catch (err) {
            logMessage(`Failed to load terms for locale: ${locale} - ${err.message}`);
            return;
        }

        const localeStaticDir = path.join(staticDir, slugDir);
        fs.readdirSync(localeStaticDir).forEach((file) => {
            const filePath = path.join(localeStaticDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            // Find the definition tag in the content
            const descriptionRegex = /<p id="definition">([\s\S]*?)<\/p>/i;
            const descriptionMatch = content.match(descriptionRegex);
            if (!descriptionMatch) {
                logMessage(`No <p id="definition"> tag found in file: ${filePath}`);
                return;  // Skip if no definition tag is found
            }

            let descriptionContent = descriptionMatch[1];  // Content inside <p id="definition">

            // Sort terms by length to prioritize longer matches
            const sortedTerms = Object.keys(terms).sort((a, b) => {
                const termA = terms[a]?.term || "";
                const termB = terms[b]?.term || "";
                return termB.length - termA.length;
            });

            sortedTerms.forEach((termKey) => {
                const term = terms[termKey];
                if (!term || !term.term) {
                    logMessage(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
                    return;
                }

                const escapedTerm = escapeRegExp(term.term); // Escape term for use in RegExp
                const termRegex = new RegExp(`\\b${escapedTerm}\\b`, 'g');

                const fileName = `${term.term.replace(/\s+/g, '-').toLowerCase()}.html`;
                if (file.toLowerCase() === fileName.toLowerCase()) {
                    // logMessage(`Skipping self-linking for term: ${term.term}`);
                    return; // Skip self-linking (avoid linking a term to itself)
                }

                // Replace the term with a hyperlink if not already linked
                descriptionContent = descriptionContent.replace(termRegex, (match) => {
                    const hasAnchorTag = new RegExp(`<a [^>]*>${escapeRegExp(match)}<\/a>`, 'g').test(descriptionContent);
                    if (hasAnchorTag) return match; // Skip if already linked

                    logMessage(`Linking term '${match}' to file '${fileName}' in ${filePath}`);
                    return `<a href="./${fileName}">${match}</a>`;
                });
            });

            // Update the content with intertextual links inserted
            content = content.replace(descriptionRegex, `<p id="definition">${descriptionContent}</p>`);

            // Write the updated content back to the file
            try {
                fs.writeFileSync(filePath, content, 'utf-8');
                logMessage(`Updated: ${filePath}`);
            } catch (err) {
                logMessage(`Failed to write file: ${filePath} - ${err.message}`);
            }
        });
    });

    logMessage('Intertextual links insertion completed.');
}
