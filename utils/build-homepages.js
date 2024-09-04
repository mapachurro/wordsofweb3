import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the template file
const templatePath = path.join(__dirname, 'index-template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

// Locale to Language Name Mapping
const languageSlugs = {
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

// Directory paths
const localesDir = path.join(__dirname, '../l10n/locales');
const outputDir = path.join(__dirname, '../build');

// Function to build homepages
export default function buildHomepages() {
    fs.readdirSync(localesDir).forEach((locale) => {
        const localePath = path.join(localesDir, locale, 'translation.json');

        let translations;
        try {
            translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
        } catch (err) {
            console.error(`Failed to load translations for locale: ${locale} - ${err.message}`);
            return;
        }

        const languageSlug = languageSlugs[locale];
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

            // Generate options for the language selector
            const languageOptions = Object.entries(languageSlugs)
                .map(([code, name]) => `<option value="${name}">${translations[name] || name}</option>`)
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

buildHomepages();
