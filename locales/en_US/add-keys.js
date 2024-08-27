const fs = require('fs');

// Path to the en_US.json file
const filePath = './en_US.json';

// Read the JSON file
const data = fs.readFileSync(filePath, 'utf8');
let termsJson = JSON.parse(data);

// Access the first object in the array and then the terms key
let termsData = termsJson[0].terms;

// Iterate over each term and add missing keys
Object.keys(termsData).forEach(termKey => {
    const termData = termsData[termKey];

    // Add the missing keys if they don't exist
    if (!termData.source) {
        termData.source = "";
    }
    if (!termData.datefirstseen) {
        termData.datefirstseen = "";
    }
});

// Write the updated JSON back to the file
fs.writeFileSync(filePath, JSON.stringify(termsJson, null, 2), 'utf8');

console.log("Missing keys added successfully!");
