const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Add a collection for each term in each locale
  eleventyConfig.addCollection('terms', function(collectionApi) {
    const localesDir = './locales';
    const locales = fs.readdirSync(localesDir);

    let allTerms = [];
    
    locales.forEach(locale => {
      const localePath = path.join(localesDir, locale);
      const localeFile = fs.readFileSync(`${localePath}/${locale}.json`);
      const termsData = JSON.parse(localeFile).terms;
      
      Object.keys(termsData).forEach(termKey => {
        allTerms.push({
          termKey: termKey,
          locale: locale,
          termData: termsData[termKey],
        });
      });
    });

    return allTerms;
  });

  return {
    dir: {
      input: "src", // Assuming your content is in the src directory
      output: "_site",
    }
  };
};
