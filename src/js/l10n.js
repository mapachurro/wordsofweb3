// l10n.js

// Environment detection
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// Shared logic (if any)
// function commonLogic() {
    // Any logic that is common to both environments can go here
// }

// Node.js-specific functions
function loadLanguageMapNode() {
    const fs = require('fs');
    const path = require('path');
    const { fileURLToPath } = require('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const languageCodesPath = path.join(__dirname, '../../l10n/language-codes.json');
    return JSON.parse(fs.readFileSync(languageCodesPath, 'utf8'));
}

function convertLanguageFormatNode(value, fromFormat, toFormat) {
    const languageMap = loadLanguageMapNode();
    for (let key in languageMap) {
        if (languageMap[key][fromFormat] === value) {
            return languageMap[key][toFormat];
        }
    }
    return null; // or throw an error if not found
}

// Browser-specific functions
async function loadLanguageMapBrowser() {
    try {
        const response = await fetch('./l10n/language-codes.json');
        if (!response.ok) {
            throw new Error('Failed to load language codes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading language map:', error);
        return {}; // Return an empty object in case of an error
    }
}

async function convertLanguageFormatBrowser(value, fromFormat, toFormat) {
    const languageMap = await loadLanguageMapBrowser();
    for (let key in languageMap) {
        if (languageMap[key][fromFormat] === value) {
            return languageMap[key][toFormat];
        }
    }
    return null; // or throw an error if not found
}

// Export environment-specific functions
export const loadLanguageMap = isNode ? loadLanguageMapNode : loadLanguageMapBrowser;
export const convertLanguageFormat = isNode ? convertLanguageFormatNode : convertLanguageFormatBrowser;
