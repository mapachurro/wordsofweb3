const lunr = require('lunr');
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const outputDir = path.join(__dirname, '../static/assets/search-indices');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(localesDir).forEach((locale) => {
    const localePath = path.join(localesDir, locale, `${locale}.json`);
    let terms;

    try {
        const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
        terms = data.terms;
        console.log(`Loaded terms for locale: ${locale}`);
    } catch (err) {
        console.error(`Failed to load terms for locale: ${locale} - ${err.message}`);
        return;
    }

    const idx = lunr(function () {
        this.ref('term');
        this.field('term');
        this.field('definition');

        Object.keys(terms).forEach((termKey) => {
            this.add({
                term: terms[termKey].term,
                definition: terms[termKey].definition,
            });
        });
    });

    const indexPath = path.join(outputDir, `${locale}-index.json`);
    fs.writeFileSync(indexPath, JSON.stringify(idx), 'utf-8');
    console.log(`Search index generated for locale: ${locale}`);
});
