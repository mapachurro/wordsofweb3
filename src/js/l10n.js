// l10n.js

// Environment detection
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// Shared logic (if any)
function commonLogic() {
    // Any logic that is common to both environments can go here
}

// Node.js-specific functions (using ES module syntax)
async function loadLanguageMapNode() {
    const { readFileSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const languageCodesPath = join(__dirname, '../../l10n/language-codes.json');
    
    const data = readFileSync(languageCodesPath, 'utf8');
    return JSON.parse(data);
}

async function convertLanguageFormatNode(value, fromFormat, toFormat) {
    const languageMap = await loadLanguageMapNode();  // Await the result here
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
        const response = await fetch('../l10n/language-codes.json');
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
