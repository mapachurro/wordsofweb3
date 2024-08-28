const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const staticDir = path.join(__dirname, '../static');

// Function to escape special characters for use in RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

fs.readdirSync(staticDir).forEach((locale) => {
    const localePath = path.join(localesDir, locale, `${locale}.json`);
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

    const localeStaticDir = path.join(staticDir, locale);
    fs.readdirSync(localeStaticDir).forEach((file) => {
        const filePath = path.join(localeStaticDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Isolate the content inside the <p id="definition"> tag
        const definitionRegex = /<p id="definition">([\s\S]*?)<\/p>/i;
        const definitionMatch = content.match(definitionRegex);
        if (!definitionMatch) {
            console.warn(`No <p id="definition"> tag found in file: ${filePath}`);
            return;
        }

        let definitionContent = definitionMatch[1]; // Extract the content inside <p id="definition">

        Object.keys(terms).forEach((term) => {
            if (!terms[term] || !terms[term].term) {
                console.warn(`Missing 'term' for entry '${term}' in locale ${locale}`);
                return; // Skip this term if 'term' is undefined
            }

            const escapedTerm = escapeRegExp(terms[term].term);
            const termRegex = new RegExp(`\\b${escapedTerm}\\b`, 'g');

            // Skip linking the term to itself
            const fileName = `${terms[term].term.replace(/\s+/g, '-').toLowerCase()}.html`;
            if (file.includes(fileName)) {
                console.log(`Skipping self-linking for term: ${terms[term].term}`);
                return;
            }

            // Replace only within the definition content
            definitionContent = definitionContent.replace(termRegex, (match) => {
                const hasAnchorTag = new RegExp(`<a [^>]*>${escapeRegExp(match)}<\/a>`, 'g').test(definitionContent);
                if (hasAnchorTag) return match; // If already inside an <a> tag, return the match as is

                return `<a href="./${fileName}">${match}</a>`;
            });
        });

        // Reassemble the content with the modified definition
        content = content.replace(definitionRegex, `<p id="definition">${definitionContent}</p>`);

        try {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated: ${filePath}`);
        } catch (err) {
            console.error(`Failed to write file: ${filePath} - ${err.message}`);
        }
    });
});