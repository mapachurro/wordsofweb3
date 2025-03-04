import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getLocales,
  getLocaleInfo,
  initializeLanguageCodes,
} from "./../src/js/l10n.js"; // Use centralized locale handling

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problematicChars = /[;:<>\\/?%#]/;

// Load the template file
const templatePath = path.join(__dirname, "template.html");
const template = fs.readFileSync(templatePath, "utf-8");

const localesDir = path.join(__dirname, "../locales");
const outputDir = path.join(__dirname, "../static");
const logFilePath = path.join(__dirname, "page-output.txt");

function logToFile(message) {
  fs.appendFileSync(logFilePath, `${message}\n`, "utf-8");
}

// Clear the log file before starting
fs.writeFileSync(logFilePath, "", "utf-8");

// Export the function so it's accessible within the module
export function isValidUrl(string) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z0-9\\-]+\\.)+[a-z]{2,})|' + // domain name
    'localhost|' + // localhost
    '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP address
    '\\[?[a-f0-9:\\.]+\\]?)' + // IPv6
    '(\\:\\d+)?(\\/[-a-z0-9%_.~+]*)*' + // port and path
    '(\\?[;&a-z0-9%_.~+=-]*)?' + // query string
    '(\\#[-a-z0-9_]*)?$','i'); // fragment locator
  return !!urlPattern.test(string);
}

export default async function buildPages() {
  // Initialize language codes
  await initializeLanguageCodes(); // Make sure language codes are loaded before proceeding

  const locales = getLocales(); // Use the centralized locale list

  const crossLocaleMap = {};

  locales.forEach((locale) => {
    const localePath = path.join(localesDir, locale, `${locale}.json`);
    let terms;

    try {
      const data = JSON.parse(fs.readFileSync(localePath, "utf-8"));
      terms = data.terms || {};
      logToFile(`Successfully loaded terms for locale: ${locale}`);
    } catch (err) {
      const errorMessage = `Failed to load terms for locale: ${locale} - ${err.message}`;
      logToFile(errorMessage);
      console.error(errorMessage);
      return;
    }

    Object.keys(terms).forEach((termKey) => {
      if (!crossLocaleMap[termKey]) {
        crossLocaleMap[termKey] = {};
      }
      crossLocaleMap[termKey][locale] = terms[termKey].term;
    });
  });

  locales.forEach((locale) => {
    const localePath = path.join(localesDir, locale, `${locale}.json`);
    let terms;

    try {
      const data = JSON.parse(fs.readFileSync(localePath, "utf-8"));
      terms = data.terms || {};
      logToFile(`Successfully loaded terms for locale: ${locale}`);
    } catch (err) {
      const errorMessage = `Failed to load terms for locale: ${locale} - ${err.message}`;
      logToFile(errorMessage);
      console.error(errorMessage);
      return;
    }

    const languageSlug = getLocaleInfo(locale, "slug"); // Centralized slug
    if (languageSlug) {
      const localeOutputDir = path.join(outputDir, languageSlug);
      if (!fs.existsSync(localeOutputDir)) {
        fs.mkdirSync(localeOutputDir, { recursive: true });
        logToFile(`Created directory for language: ${languageSlug}`);
      }

      Object.keys(terms).forEach((termKey) => {
        const termData = terms[termKey] || {};
        const termValue = termData.term || "";
        const phoneticValue =
          termData.phonetic || "Pronunciation not yet available";
        const partOfSpeechValue =
          termData.partOfSpeech || "Grammatical data not yet available";
        const definitionValue =
          termData.definition || "Definition not available.";
        const additionalDefsArray =
          Array.isArray(termData.additional) && termData.additional.length
            ? termData.additional
            : null;

        // Function to check if a string is a valid URL
        const additionalDef = additionalDefsArray
          ? additionalDefsArray
              .map((alt) => {
                // ✅ 'alt' is properly defined here
                let sourceText = "";
                if (alt.source) {
                  if (isValidUrl(alt.source)) {
                    sourceText = `<a href="${alt.source}" target="_blank" rel="noopener noreferrer">Source</a>`;
                  } else {
                    sourceText = `<strong>${alt.source}</strong>`;
                  }
                }
                return `<div class="additional-definition">
                  <p class="definition-text">${alt.definition}</p>
                  <p class="source-line">${sourceText}</p>
                </div>`;
              })
              .join("")
          : "<p>No additional definitions found. Have another? Submit it!</p>";

        const termCategoryValue = termData.termCategory || "To be determined";
        const definitionSource = termData.definitionSource
          ? isValidUrl(termData.definitionSource)
            ? `<a href="${termData.definitionSource}" target="_blank" rel="noopener noreferrer">Source</a>`
            : `<strong>${termData.definitionSource}</strong>`
          : "Mapachurro probably wrote this.";

          const defSourceArray =
          Array.isArray(termData.definitionSource) && termData.definitionSource.length
            ? termData.definitionSource
            : termData.definitionSource
            ? [termData.definitionSource] // Wrap a single string in an array
            : null;
        
        const defSource = defSourceArray
          ? defSourceArray
              .map((src) =>
                isValidUrl(src)
                  ? `<a href="${src}" target="_blank" rel="noopener noreferrer">Source</a>`
                  : `<strong>${src}</strong>`
              )
              .join(", ") // Separate multiple sources with a comma
          : "Mapachurro probably wrote this.";
        

        const sampleSentence = termData.sampleSentence || "N/A";
        const extended = termData.extended || "No extended definition. ...yet";
        // Enhanced handling for termSource

        const termSource = termData.termSource
          ? isValidUrl(termData.termSource)
            ? `<a href="${termData.termSource}" target="_blank" rel="noopener noreferrer">Term source</a>`
            : `${termData.termSource}`
          : "This word came from... the ether";

        const date = termData.dateFirstRecorded || "Unknown";
        const commentary =
          termData.commentary || "No commentary on this. ...yet";

        if (problematicChars.test(termValue)) {
          logToFile(
            `Warning: Term '${termValue}' in locale '${locale}' contains problematic characters.`,
          );
        }

        // Generate language switcher links using crossLocaleMap
        const languageLinks = getLocales()
          .map((code) => {
            const slug = getLocaleInfo(code, "slug");
            const translatedTerm = crossLocaleMap[termKey][code];
            if (translatedTerm) {
              const safeTranslatedTerm = translatedTerm
                .replace(/\s+/g, "-")
                .toLowerCase()
                .replace(problematicChars, "");
              return `<a href="/${slug}/${safeTranslatedTerm}.html">${slug}</a>`;
            } else {
              return `<span class="unavailable">${slug}</span>`;
            }
          })
          .join(" | ");

        // Generate metadata for Open Graph and Twitter Cards
        const termSlug = termValue
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(problematicChars, "");
        const firstSentence = definitionValue.split(".")[0];

        const metadata = {
          title: termValue,
          term: termValue,
          termSlug: termSlug,
          definitionMetadata: firstSentence,
          locale: languageSlug,
        };

        // Now, populate the template
        let html = template
          .replace(/{{title}}/g, metadata.title)
          .replace(/{{term}}/g, metadata.term)
          .replace(/{{termSlug}}/g, metadata.termSlug)
          .replace(/{{definitionMetadata}}/g, metadata.definitionMetadata)
          .replace(/{{locale}}/g, metadata.locale)
          .replace(/{{phonetic}}/g, phoneticValue)
          .replace(/{{partOfSpeech}}/g, partOfSpeechValue)
          .replace(/{{definition}}/g, definitionValue)
          .replace(/{{termCategory}}/g, termCategoryValue)
          .replace(/{{languageLinks}}/g, languageLinks)
          .replace(/{{definitionSource}}/g, definitionSource)
          .replace(/{{sampleSentence}}/g, sampleSentence)
          .replace(/{{extended}}/g, extended)
          .replace(/{{additionalDef}}/g, additionalDef)
          .replace(/{{termSource}}/g, termSource)
          .replace(/{{dateFirstRecorded}}/g, date)
          .replace(/{{commentary}}/g, commentary);

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
      logToFile(
        `Locale ${locale} does not have a corresponding language name. Skipping.`,
      );
    }
  });

  logToFile("Page build process completed.");
  console.log(
    "Page build process completed. Output logged to page-output.txt.",
  );
}

// Run the async function
buildPages().catch((err) =>
  console.error(`Error building pages: ${err.message}`),
);
