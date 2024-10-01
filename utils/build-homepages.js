import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLocales, getLocaleInfo, initializeLanguageCodes } from './../src/js/l10n.js'; // Use centralized locale handling

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the template file
const templatePath = path.join(__dirname, 'index-template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

// Directory paths
const localesDir = path.join(__dirname, '../l10n/locales');
const outputDir = path.join(__dirname, '../build');

// Function to build homepages
export default async function buildHomepages() {
    await initializeLanguageCodes(); // Ensure language codes are loaded

    const locales = getLocales(); // Use the centralized locale list

    locales.forEach((locale) => {
        const localePath = path.join(localesDir, locale, 'translation.json');
        let translations;

        try {
            translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
        } catch (err) {
            console.error(`Failed to load translations for locale: ${locale} - ${err.message}`);
            return;
        }

        const languageSlug = getLocaleInfo(locale, 'slug'); // Centralized language slug
        if (languageSlug) {
            const localeOutputDir = path.join(outputDir, languageSlug);
            if (!fs.existsSync(localeOutputDir)) {
                fs.mkdirSync(localeOutputDir, { recursive: true });
            }

            let html = template
                .replace(/{{locale}}/g, locale)
                .replace(/{{title}}/g, translations['Glossary'] || 'Glossary')
                .replace(/{{logoText}}/g, translations['Glossary'] || 'Glossary')
                .replace(/{{searchHeader}}/g, translations['search-heading'] || 'Search')
                .replace(/{{searchPlaceholder}}/g, translations['term'] || 'Search terms...')
                .replace(/{{searchButton}}/g, translations['search-button'] || 'Search')
                .replace(/{{exploreHeader}}/g, translations['Glossary'] || 'Explore');

            // Generate options for the language selector using slugs
            const languageOptions = getLocales()
                .map(code => {
                    const slug = getLocaleInfo(code, 'slug');
                    return `<option value="${slug}">${translations[slug] || slug}</option>`;
                })
                .join('');

            html = html.replace(/{{languageOptions}}/g, languageOptions);

            const filePath = path.join(localeOutputDir, 'index.html');
            fs.writeFileSync(filePath, html, 'utf-8');
            console.log(`Generated: ${filePath}`);
        } else {
            console.warn(`Locale ${locale} does not have a corresponding language name. Skipping.`);
        }
    });
}

// Run the async function
buildHomepages().catch(err => console.error(`Error building homepages: ${err.message}`));




// old version that didn't use l10n.js
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Create equivalent of __dirname for ES Modules context
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load the template file
// const templatePath = path.join(__dirname, 'index-template.html');
// const template = fs.readFileSync(templatePath, 'utf-8');

// // Locale to Language Name Mapping. 
// // IMPORTANT: THIS IS THE LIST OF LOCALES THAT WILL BE BUILT.
// const languageSlugs = {
//     "ar-AR": "العربية",
//     "el-GR": "Ελληνικά",
//     "en-US": "us-english",
//     "es-419": "español-latinoamérica",
//     "fa-IR": "فارسی",
//     "fr-FR": "français",
//     "ha-NG": "hausa",
//     "hi-IN": "हिन्दी",
//     "hu-HU": "magyar",
//     "id-ID": "bahasa-indonesia",
//     "it-IT": "italiano",
//     "ja-JP": "日本語",
//     "ko-KR": "한국어",
//     "ms-MY": "bahasa-melayu",
//     "nl-NL": "nederlands",
//     "pcm-NG": "naijá",
//     "pl-PL": "polski",
//     "pt-BR": "português-brasil",
//     "ro-RO": "română",
//     "ru-RU": "Русский",
//     "th-TH": "ไทย",
//     "tl-PH": "tagalog",
//     "tr-TR": "türkçe",
//     "uk-UA": "Українська",
//     "vi-VN": "tiếng-việt",
//     "zh-CN": "中文-(简体)",
//     "zh-TW": "中文-(繁體)",
// };

// // Directory paths
// const localesDir = path.join(__dirname, '../l10n/locales');
// const outputDir = path.join(__dirname, '../build');

// // Function to build homepages
// export default function buildHomepages() {
//     fs.readdirSync(localesDir).forEach((locale) => {
//         const localePath = path.join(localesDir, locale, 'translation.json');

//         let translations;
//         try {
//             translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
//         } catch (err) {
//             console.error(`Failed to load translations for locale: ${locale} - ${err.message}`);
//             return;
//         }

//         const languageSlug = languageSlugs[locale];
//         if (languageSlug) {
//             const localeOutputDir = path.join(outputDir, languageSlug);
//             if (!fs.existsSync(localeOutputDir)) {
//                 fs.mkdirSync(localeOutputDir, { recursive: true });
//             }

//             let html = template
//                 .replace(/{{locale}}/g, locale)
//                 .replace(/{{title}}/g, translations['Glossary'] || 'Glossary')
//                 .replace(/{{logoText}}/g, translations['Glossary'] || 'Glossary')
//                 .replace(/{{searchHeader}}/g, translations['search-heading'] || 'Search')
//                 .replace(/{{searchPlaceholder}}/g, translations['term'] || 'Search terms...')
//                 .replace(/{{searchButton}}/g, translations['search-button'] || 'Search')
//                 .replace(/{{exploreHeader}}/g, translations['Glossary'] || 'Explore');

//             // Generate options for the language selector
//             const languageOptions = Object.entries(languageSlugs)
//                 .map(([code, name]) => `<option value="${name}">${translations[name] || name}</option>`)
//                 .join('');

//             html = html.replace(/{{languageOptions}}/g, languageOptions);

//             const filePath = path.join(localeOutputDir, 'index.html');
//             fs.writeFileSync(filePath, html, 'utf-8');
//             console.log(`Generated: ${filePath}`);
//         } else {
//             console.warn(`Locale ${locale} does not have a corresponding language name. Skipping.`);
//         }
//     });
// }

// buildHomepages();
