//l10n.js: this leverages ./l10n/language-codes.json, and provides a set of functions for you to e.g.
// switch between locale code formats.

// Detect the environment
let languageCodes = null;
let isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export async function initializeLanguageCodes() {
  if (languageCodes) {
    return; // Already loaded
  }

  if (isNode) {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const languageCodesPath = path.join(
      __dirname,
      "../../l10n/language-codes.json",
    );

    languageCodes = JSON.parse(fs.readFileSync(languageCodesPath, "utf-8"));
  } else {
    const response = await fetch("./l10n/language-codes.json");
    if (!response.ok) {
      throw new Error("Failed to load language codes");
    }
    languageCodes = await response.json();
  }
}

export function getAllLocalesInfo() {
  if (!languageCodes) {
    throw new Error(
      "Language codes not loaded yet. Call initializeLanguageCodes() first.",
    );
  }
  return languageCodes;
}

export function getLocaleInfo(locale, key) {
  if (!languageCodes) {
    throw new Error(
      "Language codes not loaded yet. Call initializeLanguageCodes() first.",
    );
  }
  if (!languageCodes[locale]) {
    console.warn(`Locale ${locale} not found in language-codes.json`);
    return null;
  }
  return languageCodes[locale][key];
}

export function getLocales() {
  if (!languageCodes) {
    throw new Error(
      "Language codes not loaded yet. Call initializeLanguageCodes() first.",
    );
  }
  return Object.keys(languageCodes);
}

export function convertLocaleFormat(value, fromFormat, toFormat) {
  if (!languageCodes) {
    throw new Error(
      "Language codes not loaded yet. Call initializeLanguageCodes() first.",
    );
  }
  for (let locale in languageCodes) {
    if (languageCodes[locale][fromFormat] === value) {
      return languageCodes[locale][toFormat];
    }
  }
  return null;
}

export function getAllSlugs() {
  return getLocales().map((locale) => languageCodes[locale].slug);
}

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Path to language-codes.json
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const languageCodesPath = path.join(__dirname, './language-codes.json');

// // Load the language codes JSON file
// let languageCodes;
// try {
//     languageCodes = JSON.parse(fs.readFileSync(languageCodesPath, 'utf-8'));
// } catch (err) {
//     console.error('Error loading language-codes.json:', err.message);
// }

// // Function to get locale info by key (e.g., "slug", "name", etc.)
// export function getLocaleInfo(locale, key) {
//     if (!languageCodes[locale]) {
//         console.warn(`Locale ${locale} not found in language-codes.json`);
//         return null;
//     }
//     return languageCodes[locale][key];
// }

// // Function to get all locales
// export function getLocales() {
//     return Object.keys(languageCodes);
// }

// // Function to convert between formats (e.g., "fourLetterDash" to "slug")
// export function convertLocaleFormat(value, fromFormat, toFormat) {
//     for (let locale in languageCodes) {
//         if (languageCodes[locale][fromFormat] === value) {
//             return languageCodes[locale][toFormat];
//         }
//     }
//     return null; // Return null if not found
// }

// // Utility function to get all language slugs (for building language selectors)
// export function getAllSlugs() {
//     return getLocales().map(locale => languageCodes[locale].slug);
// }
