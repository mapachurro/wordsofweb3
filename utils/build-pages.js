const fs = require('fs');
const path = require('path');

// Directory paths
const localesDir = path.join(__dirname, '../locales');
const outputDir = path.join(__dirname, '../static');

// HTML template
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
    <h1>{{term}}</h1>
    <p><strong>Phonetic:</strong> {{phonetic}}</p>
    <p><strong>Part of Speech:</strong> {{partOfSpeech}}</p>
    <p><strong>Definition:</strong> {{definition}}</p>
    <p><strong>Category:</strong> {{termCategory}}</p>
  </main>
  <footer>
    <p>&copy; 2024 Education DAO</p>
  </footer>
</body>
</html>
`;

fs.readdirSync(localesDir).forEach((locale) => {
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

    const localeOutputDir = path.join(outputDir, locale);
    if (!fs.existsSync(localeOutputDir)) {
        fs.mkdirSync(localeOutputDir, { recursive: true });
        console.log(`Created directory for locale: ${locale}`);
    }

    Object.keys(terms).forEach((termKey) => {
        const termData = terms[termKey] || {};
        const termValue = termData.term || '';
        const phoneticValue = termData.phonetic || '';
        const partOfSpeechValue = termData.partOfSpeech || '';
        const definitionValue = termData.definition || 'Definition not available.';
        const termCategoryValue = termData.termCategory || '';

        // Log any missing data
        if (!termData.term) console.warn(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
        if (!termData.phonetic) console.warn(`Missing 'phonetic' for entry '${termKey}' in locale ${locale}`);
        if (!termData.partOfSpeech) console.warn(`Missing 'partOfSpeech' for entry '${termKey}' in locale ${locale}`);
        if (!termData.definition) console.warn(`Missing 'definition' for entry '${termKey}' in locale ${locale}`);
        if (!termData.termCategory) console.warn(`Missing 'termCategory' for entry '${termKey}' in locale ${locale}`);

        // Generate the HTML content by replacing placeholders in the template
        let html = template.replace(/{{locale}}/g, locale)
                           .replace(/{{term}}/g, termValue)
                           .replace(/{{phonetic}}/g, phoneticValue)
                           .replace(/{{partOfSpeech}}/g, partOfSpeechValue)
                           .replace(/{{definition}}/g, definitionValue)
                           .replace(/{{termCategory}}/g, termCategoryValue);

        // Handle the filename generation, ensuring safe file names
        const fileName = `${termValue.replace(/\s+/g, '-').toLowerCase()}.html`;
        const filePath = path.join(localeOutputDir, fileName);

        try {
            fs.writeFileSync(filePath, html, 'utf-8');
            console.log(`Generated: ${filePath}`);
        } catch (err) {
            console.error(`Failed to write file: ${filePath} - ${err.message}`);
        }
    });
});
