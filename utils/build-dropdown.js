import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Paths
const navbarTemplatePath = join(__dirname, '../navbar-template.html');
const indexTemplatePath = join(__dirname, './index-template.html');
const languageCodesPath = join(__dirname, './language-codes.json');

// Read language codes
const languageCodes = JSON.parse(readFileSync(languageCodesPath, 'utf-8'));

// Generate dropdown options from language codes
const generateDropdownOptions = () => {
    let options = '';
    for (const locale in languageCodes) {
        const slug = languageCodes[locale].slug;
        const name = languageCodes[locale].name;
        options += `<option value="/${slug}/index.html">${name}</option>\n`;
    }
    return options;
};

// Function to update templates with dynamic options
export function updateTemplateWithLocales(templateFilePath) {
  // Use the correct variable name 'templateFilePath'
  let template = readFileSync(templateFilePath, 'utf-8');

  // Replace the hardcoded options with dynamic options
  const updatedTemplate = template.replace(
    /<option value="\/english-us\/index.html">English \(US\)<\/option>\n\s*<option value="\/español-latinoamérica\/index.html">Español \(Latinoamérica\)<\/option>\n\s*<option value="\/français\/index.html">Français<\/option>/,
    `<option value="/index.html">Select language...</option>\n${generateDropdownOptions()}`
  );

  // Write back the updated template
  writeFileSync(templateFilePath, updatedTemplate);
}

// Update navbar-template.html and index-template.html
updateTemplateWithLocales(navbarTemplatePath);
updateTemplateWithLocales(indexTemplatePath);
