import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Characters to check for that might cause issues in URLs
const problematicChars = /[;:<>\\/?%#]/;

// Locale to Language Name Mapping
const languageNames = {
  "ar-AR": "العربية",
  "zh-CN": "中文-(简体)",
  "zh-TW": "中文-(繁體)",
  "nl-NL": "nederlands",
  "fr-FR": "français",
  "el-GR": "Ελληνικά",
  "en-US": "us-english",
  "ha-NG": "hausa",
  "hi-IN": "हिन्दी",
  "hu-HU": "magyar",
  "id-ID": "bahasa-indonesia",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
  "fa-IR": "فارسی",
  "ms-MY": "bahasa-melayu",
  "pcm-NG": "naijá",
  "pl-PL": "polski",
  "pt-BR": "português-brasil",
  "ro-RO": "română",
  "ru-RU": "Русский",
  "es-419": "español-latinoamérica",
  "tl-PH": "tagalog",
  "th-TH": "ไทย",
  "tr-TR": "türkçe",
  "uk-UA": "Українська",
  "vi-VN": "tiếng-việt",
};

// This creates an equivalent of `__dirname` for ESModules contexts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory paths
const localesDir = path.join(__dirname, "../locales");
const outputDir = path.join(__dirname, "../static");
const logFilePath = path.join(__dirname, "page-output.txt");

// Function to log output and errors to a file
function logToFile(message) {
    fs.appendFileSync(logFilePath, `${message}\n`, "utf-8");
}

// Clear the log file before starting
fs.writeFileSync(logFilePath, "", "utf-8");

const template = `
<!DOCTYPE html>
<html lang="{{locale}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <title>{{term}} - wordsofweb3</title>
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo" onclick="handleLogoClick()">
        <img src="../assets/education-dao-circle.png" alt="Logo" class="logo-image" />
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

export default function buildPages(){

    fs.readdirSync(localesDir).forEach((locale) => {
        const localePath = path.join(localesDir, locale, `${locale}.json`);
        let terms;

        try {
            const data = JSON.parse(fs.readFileSync(localePath, "utf-8"));
            terms = data.terms || {}; // Safeguard against missing 'terms' object
            logToFile(`Successfully loaded terms for locale: ${locale}`);
        } catch (err) {
            const errorMessage = `Failed to load terms for locale: ${locale} - ${err.message}`;
            logToFile(errorMessage);
            console.error(errorMessage);
            return; // Skip this locale if the file cannot be read or parsed
        }

        const languageName = languageNames[locale];
        if (languageName) {
            const localeOutputDir = path.join(outputDir, languageName);
            if (!fs.existsSync(localeOutputDir)) {
                fs.mkdirSync(localeOutputDir, { recursive: true });
                logToFile(`Created directory for language: ${languageName}`);
            }

            Object.keys(terms).forEach((termKey) => {
                const termData = terms[termKey] || {};
                const termValue = termData.term || "";
                const phoneticValue = termData.phonetic || "";
                const partOfSpeechValue = termData.partOfSpeech || "";
                const definitionValue = termData.definition || "Definition not available.";
                const termCategoryValue = termData.termCategory || "";

                // Log any missing data
                if (!termData.term)
                    logToFile(`Missing 'term' for entry '${termKey}' in locale ${locale}`);
                if (!termData.phonetic)
                    logToFile(`Missing 'phonetic' for entry '${termKey}' in locale ${locale}`);
                if (!termData.partOfSpeech)
                    logToFile(`Missing 'partOfSpeech' for entry '${termKey}' in locale ${locale}`);
                if (!termData.definition)
                    logToFile(`Missing 'definition' for entry '${termKey}' in locale ${locale}`);
                if (!termData.termCategory)
                    logToFile(`Missing 'termCategory' for entry '${termKey}' in locale ${locale}`);

                if (problematicChars.test(termValue)) {
                    const warningMessage = `Warning: Term '${termValue}' in locale '${locale}' contains problematic characters that may break URLs.`;
                    logToFile(warningMessage);
                    console.warn(warningMessage);
                }

                let html = template
                    .replace(/{{locale}}/g, locale)
                    .replace(/{{term}}/g, termValue)
                    .replace(/{{phonetic}}/g, phoneticValue)
                    .replace(/{{partOfSpeech}}/g, partOfSpeechValue)
                    .replace(/{{definition}}/g, definitionValue)
                    .replace(/{{termCategory}}/g, termCategoryValue);

                const fileName = `${termValue.replace(/\s+/g, "-").toLowerCase().replace(problematicChars, "")}.html`;
                const filePath = path.join(localeOutputDir, fileName);

                try {
                    fs.writeFileSync(filePath, html, "utf-8");
                    logToFile(`Generated: ${filePath}`);
                } catch (err) {
                    const errorMessage = `Failed to write file: ${filePath} - ${err.message}`;
                    logToFile(errorMessage);
                    console.error(errorMessage);
                }
            });
        } else {
            logToFile(`Locale ${locale} does not have a corresponding language name. Skipping.`);
        }
    });

    logToFile("Page build process completed.");
    console.log("Page build process completed. Output logged to page-output.txt.");
}
