// This script will be run during the build, and will not be user-facing.
// It is used to generate static search indices in all locales.

const lunr = require('lunr');
const fs = require('fs');
const terms = require('./terms.json'); // Assuming your terms are stored in a JSON file

const generateIndex = (language) => {
  const index = lunr(function () {
    this.ref('term');
    this.field('definition');

    Object.entries(terms.terms).forEach(([term, data]) => {
      this.add({
        term,
        definition: data.definition[language] || data.definition['en_US'], // Fallback to English
      });
    });
  });

  return index;
};

// Generate an index for each language
const languages = ['en_US', 'es_ES', 'de_DE', 'it_IT']; // Add all your supported languages here

languages.forEach(language => {
  const index = generateIndex(language);
  fs.writeFileSync(`./public/assets/${language}-index.json`, JSON.stringify(index));
});
