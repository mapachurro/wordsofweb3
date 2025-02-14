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
        const alternateDefsArray =
          Array.isArray(termData.alternate) && termData.alternate.length
            ? termData.alternate
            : null;

        const alternateDef = alternateDefsArray
          ? alternateDefsArray
              .map(
                (alt) =>
                  `<p><strong>Alternate:</strong> ${alt.definition} <em>(${alt.source})</em></p>`,
              )
              .join("")
          : "<p>No alternate definitions found. Have another? Submit it!</p>";

        const termCategoryValue = termData.termCategory || "To be determined";
        const definitionSource = termData.definitionSource || "N/A";
        const sampleSentence = termData.sampleSentence || "N/A";
        const extended = termData.extended || "No extended definition. ...yet";
        const termSource =
          termData.termSource || "This word came from... the ether";
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

        let html = template
          .replace(/{{title}}/g, termValue)
          .replace(/{{locale}}/g, locale)
          .replace(/{{term}}/g, termValue)
          .replace(/{{phonetic}}/g, phoneticValue)
          .replace(/{{partOfSpeech}}/g, partOfSpeechValue)
          .replace(/{{definition}}/g, definitionValue)
          .replace(/{{termCategory}}/g, termCategoryValue)
          .replace(/{{languageLinks}}/g, languageLinks)
          .replace(/{{definitionSource}}/g, definitionSource)
          .replace(/{{sampleSentence}}/g, sampleSentence)
          .replace(/{{extended}}/g, extended)
          .replace(/{{alternateDef}}/g, alternateDef)
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
