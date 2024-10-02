import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateLanguageDropdown() {
  const languageCodesPath = path.join(__dirname, '../l10n/language-codes.json');
  const outputPath = path.join(__dirname, './language-dropdown.html');

  const languageCodes = JSON.parse(fs.readFileSync(languageCodesPath, 'utf-8'));

  // Generate language dropdown selector HTML, based on languages currently available in app
  let dropdownHtml = '<select id="language-selector" class="form-select ml-auto language-selector">';
  Object.keys(languageCodes).forEach((locale) => {
    const slug = languageCodes[locale].slug;
    const name = languageCodes[locale].name;
    dropdownHtml += `<option value="/${slug}/index.html">${name}</option>`;
  });
  dropdownHtml += '</select>';

  // Write to File
  fs.writeFileSync(outputPath, dropdownHtml);
  console.log('Language dropdown HTML generated successfully.');
}
