// In Jan 2025, mapachurro was regularizing and standardizing
// the key / value pairs for all the terms in all the locales,
// and adding new ones, and realized that the all-important US
// English file was a big old mishmash of crap, because it's not
// subject to the same script generation process as the rest. Sad!
// This script was used to bring it into line.

import fs from 'fs';

const desiredOrder = [
  "term",
  "partOfSpeech",
  "termCategory",
  "phonetic",
  "definition",
  "definitionSource",
  "sampleSentence",
  "extended",
  "termSource",
  "dateFirstRecorded",
  "commentary",
];

// Load the JSON file
const filePath = '../../locales/en-US/en-US.json'; // Adjust this to the actual path
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const updatedTerms = Object.fromEntries(
  Object.entries(jsonData.terms).map(([key, value]) => {
    const reorderedValue = {};
    // Ensure all desired keys are present in the specified order
    desiredOrder.forEach((keyName) => {
      reorderedValue[keyName] = value[keyName] || ""; // Preserve existing value or set to empty
    });
    return [key, reorderedValue];
  })
);

// Save the updated JSON
const updatedJsonData = { terms: updatedTerms };
fs.writeFileSync(filePath.replace('.json', '-updated.json'), JSON.stringify(updatedJsonData, null, 2), 'utf-8');

console.log("JSON file has been updated and saved as a new file.");
