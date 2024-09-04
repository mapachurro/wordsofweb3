import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertLanguageFormat } from '../src/js/l10n.js';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to escape special characters for use in RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const localesDir = path.join(__dirname, '../locales');
const staticDir = path.join(__dirname, '../static');

export default function intertextualLinks() {
    fs.readdirSync(staticDir).forEach(async (slugDir) => {
        console.log(`Attempting to convert slug: ${slugDir}`);
        
        // Convert slug directory name back to the four-letter-dash format
        const locale = await convertLanguageFormat(slugDir, 'slug', 'fourLetterDash');
        console.log(`Locale code found for ${slugDir}: ${locale}`);
        
        if (!locale) {
            console.warn(`No matching locale found for slug: ${slugDir}`);
            return; // Skip if the conversion fails
        }

        // Ensure we're accessing the correct locale directory for the JSON files
        const localePath = path.join(localesDir, locale, `${locale}.json`);
        console.log('locale path:' + localePath)
        let terms;

        // Attempt to read and parse the JSON file
        try {
            const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
            terms = data.terms; // Access the 'terms' object within the JSON
            console.log(`Successfully loaded terms for locale: ${locale}`);
        } catch (err) {
            console.error(`Failed to load terms for locale: ${locale} - ${err.message}`);
            return; // Skip this locale if the file cannot be read or parsed
        }

        // Now iterate through the HTML files in the static directory for this locale slug
        const localeStaticDir = path.join(staticDir, slugDir);
        fs.readdirSync(localeStaticDir).forEach((file) => {
            const filePath = path.join(localeStaticDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            // Isolate the content inside the <p id="description"> tag
            const descriptionRegex = /<p id="definition">([\s\S]*?)<\/p>/i;
            const descriptionMatch = content.match(descriptionRegex);
            if (!descriptionMatch) {
                console.warn(`No <p id="definition"> tag found in file: ${filePath}`);
                return;
            }

            let descriptionContent = descriptionMatch[1]; // Extract the content inside <p id="description">

            // Sort terms by length in descending order to avoid overlapping replacements
            const sortedTerms = Object.keys(terms).sort((a, b) => terms[b].term.length - terms[a].term.length);

            sortedTerms.forEach((termKey) => {
                const term = terms[termKey];
                if (!term || !term.term) {
                    console.warn(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
                    return; // Skip this term if 'term' is undefined
                }

                const escapedTerm = escapeRegExp(term.term);
                const termRegex = new RegExp(`\\b${escapedTerm}\\b`, 'g');

                // Skip linking the term to itself
                const fileName = `${term.term.replace(/\s+/g, '-').toLowerCase()}.html`;
                if (file.toLowerCase() === fileName.toLowerCase()) {
                    console.log(`Skipping self-linking for term: ${term.term}`);
                    return;
                }

                // Replace only within the description content
                descriptionContent = descriptionContent.replace(termRegex, (match) => {
                    const hasAnchorTag = new RegExp(`<a [^>]*>${escapeRegExp(match)}<\/a>`, 'g').test(descriptionContent);
                    if (hasAnchorTag) return match; // If already inside an <a> tag, return the match as is

                    console.log(`Linking term '${match}' to file '${fileName}' in ${filePath}`);
                    return `<a href="./${fileName}">${match}</a>`;
                });
            });

            // Reassemble the content with the modified description
            content = content.replace(descriptionRegex, `<p id="description">${descriptionContent}</p>`);

            try {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`Updated: ${filePath}`);
            } catch (err) {
                console.error(`Failed to write file: ${filePath} - ${err.message}`);
            }
        });
    });
}
