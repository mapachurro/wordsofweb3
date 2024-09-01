//Difficulty: this script is both client side and server side. Sad!
//Hence, the following function doesn't work during build. It needs to have a build version and a client version.

export async function loadLanguageMap() {
    try {
        const response = await fetch('../../l10n/language-codes.json');
        if (!response.ok) {
            throw new Error('Failed to load language codes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading language map:', error);
        return {}; // Return an empty object in case of an error
    }
}

export async function convertLanguageFormat(value, fromFormat, toFormat) {
    const languageMap = await loadLanguageMap();
    for (let key in languageMap) {
        if (languageMap[key][fromFormat] === value) {
            return languageMap[key][toFormat];
        }
    }
    return null; // or throw an error if not found
}

// Example usage:
// convertLanguageFormat("en-US", "fourLetterDash", "slug").then(toSlugName => {
//     console.log(toSlugName); // Output: "us-english"
// });

// convertLanguageFormat("us-english", "slug", "fourLetterDash").then(toFourLetterDash => {
//     console.log(toFourLetterDash); // Output: "en-US"
// });
