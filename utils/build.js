const fs = require('fs');
const path = require('path');

// Paths
const staticDir = path.join(__dirname, '../static/');
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const i18nDir = path.join(__dirname, '../i18n');

// Create the build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log('Build directory created.');
}

// Function to copy files
function copyFileSync(source, target) {
    let targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Function to copy folders recursively
function copyFolderRecursiveSync(source, target) {
    let files = [];

    // Check if folder needs to be created or integrated
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

// Copy static files
copyFolderRecursiveSync(staticDir, buildDir);
console.log('Static files copied.');

// Copy public assets (e.g., images, css)
if (fs.existsSync(publicDir)) {
    copyFolderRecursiveSync(publicDir, buildDir);
    console.log('Public assets copied.');
} else {
    console.warn('Public directory not found.');
}

// Copy i18n assets
if (fs.existsSync(i18nDir)) {
    copyFolderRecursiveSync(i18nDir, buildDir);
    console.log('i18n assets copied.');
} else {
    console.warn('i18n directory not found.');
}

// Copy index.html
const indexFilePath = path.join(__dirname, '../index.html');
if (fs.existsSync(indexFilePath)) {
    copyFileSync(indexFilePath, buildDir);
    console.log('index.html copied.');
} else {
    console.warn('index.html not found.');
}

console.log('Build process completed.');