const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

module.exports = function(eleventyConfig) {
  // Add a collection for each term in each locale
  eleventyConfig.addCollection('terms', function() {
    const localesDir = './locales';
    const locales = fs.readdirSync(localesDir);
  
    let allTerms = [];
    
    locales.forEach(locale => {
      const localePath = path.join(localesDir, locale);
      const jsonFilePath = `${localePath}/${locale}.json`;
  
      if (fs.existsSync(jsonFilePath)) {
        const localeFile = fs.readFileSync(jsonFilePath);
        const termsData = JSON.parse(localeFile).terms;
  
        if (termsData && typeof termsData === 'object') {
          Object.keys(termsData).forEach(termKey => {
            allTerms.push({
              termKey: termKey,
              locale: locale,
              termData: termsData[termKey],
            });
          });
        } else {
          console.error(`Error: "terms" is undefined or not an object in ${jsonFilePath}`);
        }
      } else {
        console.error(`Error: JSON file not found at ${jsonFilePath}`);
      }
    });
  
    if (allTerms.length === 0) {
      console.error('No terms were found in the JSON files.');
    }
  
    return allTerms;
  });
  

  eleventyConfig.on('afterBuild', () => {
    console.log('Running Lunr.js index generation...');
    execSync('node utils/build-search-indices.js', { stdio: 'inherit' });
  });

  // Passthrough copy for static assets and translation files
  eleventyConfig.addPassthroughCopy("public/assets");
  eleventyConfig.addPassthroughCopy("i18n/locales");

  return {
    dir: {
      input: "src",
      output: "_site",
    }
  };
};
