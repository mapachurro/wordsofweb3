import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fields to check
const fieldsToCheck = [
  'term',
  'partOfSpeech',
  'termCategory',
  'definition',
  'sampleSentence',
  'extended',
  'commentary'
];

// Language mapping based on locale codes
const languageMap = {
  'en': 'en',
  'ar': 'ar',
  'ar-001': 'ar',
  'es': 'es',
  'fr': 'fr',
  'ja': 'ja',
  'ko': 'ko',
  'pt': 'pt',
  'ru': 'ru',
  'zh': 'zh-CN'
  // Add more mappings as needed
};

// Function to extract content from specific fields
function extractFieldsContent(jsonObj) {
  let content = '';
  
  try {
    // If the JSON has a nested structure with terms
    if (jsonObj && typeof jsonObj === 'object') {
      // Handle the case where we have a direct object of terms
      Object.values(jsonObj).forEach(item => {
        if (item && typeof item === 'object') {
          // Check if this is a term entry
          if (fieldsToCheck.some(field => field in item)) {
            fieldsToCheck.forEach(field => {
              if (item[field] && typeof item[field] === 'string' && item[field].trim() !== '') {
                content += item[field] + '\n';
              }
            });
          } else {
            // Recursively check nested objects
            content += extractFieldsContent(item);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error processing JSON:', error);
  }
  
  return content;
}

// Main function
async function checkSpelling() {
  try {
    console.log('Starting glossary spell check...');
    
    // Find all JSON files in the locales directory
    const files = glob.sync('locales/**/*.json');
    console.log(`Found ${files.length} JSON files to check`);
    
    if (files.length === 0) {
      console.log('No JSON files found in the locales directory.');
      return;
    }
    
    // Create a temporary directory for extracted content
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
      console.log(`Created temporary directory: ${tempDir}`);
    }
    
    // Create a results file
    const resultsFile = path.join(tempDir, 'spell-check-results.txt');
    fs.writeFileSync(resultsFile, 'Spell Check Results\n==================\n\n');
    
    // Process each file
    for (const file of files) {
      console.log(`Processing ${file}...`);
      
      try {
        // Determine language from file path
        const localeMatch = file.match(/locales\/([^/]+)/);
        const locale = localeMatch ? localeMatch[1] : 'en';
        const language = languageMap[locale] || 'en';
        
        console.log(`Detected locale: ${locale}, using language: ${language}`);
        
        // Read and parse the JSON file
        const jsonContent = fs.readFileSync(file, 'utf8');
        const jsonObj = JSON.parse(jsonContent);
        
        // Extract content from specific fields
        const extractedContent = extractFieldsContent(jsonObj);
        
        if (extractedContent.trim() === '') {
          console.log(`No content to check in ${file}`);
          continue;
        }
        
        // Write extracted content to a temporary file
        const tempFile = path.join(tempDir, `${path.basename(file, '.json')}_extracted.txt`);
        fs.writeFileSync(tempFile, extractedContent);
        console.log(`Extracted content written to ${tempFile}`);
        
        // Skip spell checking for non-English content
        if (language !== 'en') {
          console.log(`Skipping spell check for non-English content (${language}) in ${file}`);
          fs.appendFileSync(resultsFile, `${file}: Skipped (non-English content: ${language})\n`);
          continue;
        }
        
        // Run cspell on the extracted content
        console.log(`Checking spelling in ${file}...`);
        
        // Use promisified exec to wait for the result
        await new Promise((resolve, reject) => {
          exec(`npx cspell --language-id=${language} "${tempFile}"`, (error, stdout, stderr) => {
            if (error) {
              console.log(`Spelling issues found in ${file}:`);
              console.log(stdout);
              
              // Append results to the results file
              fs.appendFileSync(resultsFile, `\n${file}:\n${stdout}\n`);
            } else {
              console.log(`No spelling issues found in ${file}`);
              fs.appendFileSync(resultsFile, `${file}: No issues found\n`);
            }
            
            if (stderr) {
              console.error(`Error: ${stderr}`);
              fs.appendFileSync(resultsFile, `Error: ${stderr}\n`);
            }
            
            resolve();
          });
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        fs.appendFileSync(resultsFile, `${file}: Error - ${error.message}\n`);
      }
    }
    
    console.log('Spell check complete!');
    console.log(`Results saved to ${resultsFile}`);
    
  } catch (error) {
    console.error('Error during spell check:', error);
  }
}

// Run the spell check
checkSpelling();