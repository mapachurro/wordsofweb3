const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const staticDir = path.join(__dirname, '../static');

fs.readdirSync(staticDir).forEach((locale) => {
    const localePath = path.join(localesDir, locale, `${locale}.json`);
    const terms = JSON.parse(fs.readFileSync(localePath, 'utf-8'));

    const localeStaticDir = path.join(staticDir, locale);
    fs.readdirSync(localeStaticDir).forEach((file) => {
        const filePath = path.join(localeStaticDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        Object.keys(terms).forEach((term) => {
            const termRegex = new RegExp(`\\b${terms[term].term}\\b`, 'g');
            content = content.replace(termRegex, `<a href="./${terms[term].term.replace(/\s+/g, '-').toLowerCase()}.html">${terms[term].term}</a>`);
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
    });
});
