const fs = require('fs');
const path = require('path');

// Directory paths
const localesDir = path.join(__dirname, '../locales');
const outputDir = path.join(__dirname, '../static');
const logFilePath = path.join(__dirname, 'page-output.txt');

// Characters to check for that might cause issues in URLs
const problematicChars = /[;:<>\\/?%#]/;

// Locale to Language Name Mapping
const localeNameMapping = {
  'ar-AR': 'العربية',
  'de-DE': 'deutsch',
  'es-ES': 'español',
  'en-US': 'english',
  'ar_AR': 'العربية',
  'zh_CN': '中文-(简体)',
  'zh_TW': '中文-(繁體)',
  'nl_NL': 'nederlands',
  'fr_FR': 'français',
  'el_GR': 'Ελληνικά',
  'ha_NG': 'hausa',
  'hi_IN': 'हिन्दी',
  'hu_HU': 'magyar',
  'id_ID': 'bahasa-indonesia',
  'ja_JP': '日本語',
  'ko_KR': '한국어',
  'fa_IR': 'فارسی',
  'ms_MY': 'bahasa-melayu',
  'pcm_NG': 'naijá',
  'pl_PL': 'polski',
  'pt_BR': 'português-brasil',
  'ro_RO': 'română',
  'ru_RU': 'Русский',
  'es-419': 'español-latinoamérica',
  'tl_PH': 'tagalog',
  'th_TH': 'ไทย',
  'tr_TR': 'türkçe',
  'uk_UA': 'Українська',
  'vi_VN': 'tiếng-việt'
};


// Function to log output and errors to a file
function logToFile(message) {
    fs.appendFileSync(logFilePath, `${message}\n`, 'utf-8');
}

// Clear the log file before starting
fs.writeFileSync(logFilePath, '', 'utf-8');

const template = `
<!DOCTYPE html>
<html lang="{{locale}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../../css/styles.css">
  <title>{{term}} - wordsofweb3</title>
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <img src="../../assets/education-dao-circle.png" alt="Logo" />
        wordsofweb3
      </div>
    </nav>
  </header>
  <main>
    <h1 id="term">{{term}}</h1>
    <p id="phonetic"><strong>Phonetic:</strong> {{phonetic}}</p>
    <h3 id="partofspeech"><strong>Part of Speech:</strong> {{partOfSpeech}}</h3>
    <h3 id="category"><strong>Category:</strong> {{termCategory}}</h3>
    <p id="definition"><strong>Definition:</strong> {{definition}}</p>
  </main>
  <footer>
    <p>&copy; 2024 Education DAO</p>
  </footer>
</body>
</html>
`;

function buildPages() {
  fs.readdirSync(localesDir).forEach((locale) => {
      const localePath = path.join(localesDir, locale, `${locale}.json`);
      let terms;

      // Attempt to read and parse the JSON file
      try {
          const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
          terms = data.terms; // Access the 'terms' object within the JSON
          logToFile(`Successfully loaded terms for locale: ${locale}`);
      } catch (err) {
          const errorMessage = `Failed to load terms for locale: ${locale} - ${err.message}`;
          logToFile(errorMessage);
          console.error(errorMessage);
          return; // Skip this locale if the file cannot be read or parsed
      }

      // Determine the output directory name based on the locale
      const localeName = localeNameMapping[locale] || locale;
      const localeOutputDir = path.join(outputDir, localeName);
      if (!fs.existsSync(localeOutputDir)) {
          fs.mkdirSync(localeOutputDir, { recursive: true });
          logToFile(`Created directory for locale: ${localeName}`);
      }

      Object.keys(terms).forEach((termKey) => {
          const termData = terms[termKey] || {};
          const termValue = termData.term || '';
          const phoneticValue = termData.phonetic || '';
          const partOfSpeechValue = termData.partOfSpeech || '';
          const definitionValue = termData.definition || 'Definition not available.';
          const termCategoryValue = termData.termCategory || '';

          // Log any missing data
          if (!termData.term) logToFile(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
          if (!termData.phonetic) logToFile(`Missing 'phonetic' for entry '${termKey}' in locale ${locale}`);
          if (!termData.partOfSpeech) logToFile(`Missing 'partOfSpeech' for entry '${termKey}' in locale ${locale}`);
          if (!termData.definition) logToFile(`Missing 'definition' for entry '${termKey}' in locale ${locale}`);
          if (!termData.termCategory) logToFile(`Missing 'termCategory' for entry '${termKey}' in locale ${locale}`);

          // Check for problematic characters in the term value
          if (problematicChars.test(termValue)) {
              const warningMessage = `Warning: Term '${termValue}' in locale '${locale}' contains problematic characters that may break URLs.`;
              logToFile(warningMessage);
              console.warn(warningMessage);
          }

          // Generate the HTML content by replacing placeholders in the template
          const html = template
              .replace(/{{locale}}/g, locale)
              .replace(/{{term}}/g, termValue)
              .replace(/{{phonetic}}/g, phoneticValue)
              .replace(/{{partOfSpeech}}/g, partOfSpeechValue)
              .replace(/{{definition}}/g, definitionValue)
              .replace(/{{termCategory}}/g, termCategoryValue);

          // Handle the filename generation, ensuring safe file names
          const fileName = `${termValue.replace(/\s+/g, '-').toLowerCase().replace(problematicChars, '')}.html`;
          const filePath = path.join(localeOutputDir, fileName);

          try {
              fs.writeFileSync(filePath, html, 'utf-8');
              logToFile(`Generated: ${filePath}`);
          } catch (err) {
              const errorMessage = `Failed to write file: ${filePath} - ${err.message}`;
              logToFile(errorMessage);
              console.error(errorMessage);
          }
      });
  });

  logToFile('Page build process completed.');
  console.log('Page build process completed. Output logged to page-output.txt.');
}

module.exports = buildPages;