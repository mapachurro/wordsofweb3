const lunr = require('lunr');
const fs = require('fs');
const path = require('path');

// Assuming your locale JSON files are in the ./locales directory
const localesDir = './locales';

const generateIndex = (locale, terms) => {
  const index = lunr(function () {
    this.ref('term');
    this.field('definition');

    Object.entries(terms).forEach(([term, data]) => {
      this.add({
        term: term,
        definition: data.definition || "", // Fallback to empty string if no definition
      });
    });
  });

  return index;
};

// Generate an index for each locale
fs.readdirSync(localesDir).forEach(locale => {
  const localeFilePath = path.join(localesDir, locale, `${locale}.json`);

  if (fs.existsSync(localeFilePath)) {
    const localeFile = fs.readFileSync(localeFilePath);
    const terms = JSON.parse(localeFile).terms;

    if (terms && typeof terms === 'object') {
      const index = generateIndex(locale, terms);
      fs.writeFileSync(`./public/assets/${locale}-index.json`, JSON.stringify(index));
      console.log(`Generated search index for ${locale}`);
    } else {
      console.error(`Error: "terms" is undefined or not an object in ${localeFilePath}`);
    }
  } else {
    console.error(`Error: JSON file not found at ${localeFilePath}`);
  }
});
