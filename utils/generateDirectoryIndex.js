import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeLanguageCodes, convertLocaleFormat } from "../src/js/l10n.js";

// Create equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure language codes are initialized
await initializeLanguageCodes();

// Paths
const localesDir = path.join(__dirname, "../locales");
const staticDir = path.join(__dirname, "../static");

// Read locale directories
const locales = fs.readdirSync(localesDir);

// Function to generate the directory index
function generateIndexForLocale(locale) {
  const localeFile = path.join(localesDir, locale, `${locale}.json`);

  if (!fs.existsSync(localeFile)) {
    console.warn(`Skipping ${locale}: No JSON file found at ${localeFile}`);
    return;
  }

  // Convert `en-US` → `english-us`
  const humanReadableSlug = convertLocaleFormat(locale, "fourLetterDash", "slug");

  if (!humanReadableSlug) {
    console.warn(`No human-readable name found for ${locale}`);
    return;
  }

  const outputDir = path.join(staticDir, humanReadableSlug);
  const outputFile = path.join(outputDir, "directoryContents.json");

  let termsData;
  try {
    termsData = JSON.parse(fs.readFileSync(localeFile, "utf-8")).terms;
  } catch (err) {
    console.error(`Error reading ${localeFile}: ${err.message}`);
    return;
  }

  const indexData = Object.entries(termsData).map(([termKey, termObject]) => ({
    name: termObject.term || termKey, // Use the `term` field if available
    link: `${termKey.replace(/\s+/g, "-").toLowerCase()}.html`,
  }));

  fs.mkdirSync(outputDir, { recursive: true });

  try {
    fs.writeFileSync(outputFile, JSON.stringify(indexData, null, 2), "utf-8");
    console.log(`Generated directory index for ${locale} at ${outputFile}`);
  } catch (writeErr) {
    console.error(`Error writing ${outputFile}: ${writeErr.message}`);
  }
}

export async function generateDirectoryIndex() {
    
// Generate indices for all locales
locales.forEach(generateIndexForLocale);

console.log("Finished generating all directory indices.");
}