const fs = require('fs');
const path = require('path');
const buildPages = require('./build-pages');
const buildSearchIndices = require('./build-search-indices');

// Paths
const staticDir = path.join(__dirname, '../static/');
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const i18nDir = path.join(__dirname, '../i18n');

// Ensure a clean build directory
if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir, { recursive: true });

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

// Function to copy folders recursively with custom target handling
function copyFolderRecursiveSync(source, target) {
    let files = [];

    // Ensure target folder exists
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, path.join(target, file));
            } else {
                copyFileSync(curSource, path.join(target, file));
            }
        });
    }
}

// Run the page build process
buildPages();
console.log('Pages built.');

// Run the search index build process
buildSearchIndices();
console.log('Search indices created.');

// Copy static files to root build directory (not within 'static' folder)
fs.readdirSync(staticDir).forEach((dir) => {
    const sourcePath = path.join(staticDir, dir);
    const targetPath = path.join(buildDir, dir);
    copyFolderRecursiveSync(sourcePath, targetPath);
});
console.log('Static files copied.');

// Copy public assets (e.g., images, css) to 'assets' in build directory
if (fs.existsSync(publicDir)) {
    copyFolderRecursiveSync(publicDir, path.join(buildDir, 'assets'));
    console.log('Public assets copied.');
} else {
    console.warn('Public directory not found.');
}

// Copy i18n assets to 'i18n' in build directory
if (fs.existsSync(i18nDir)) {
    copyFolderRecursiveSync(i18nDir, path.join(buildDir, 'i18n'));
    console.log('i18n assets copied.');
} else {
    console.warn('i18n directory not found.');
}

// Copy index.html and index.js to root build directory
['index.html', 'index.js'].forEach((file) => {
    const filePath = path.join(__dirname, `../${file}`);
    if (fs.existsSync(filePath)) {
        copyFileSync(filePath, buildDir);
        console.log(`${file} copied.`);
    } else {
        console.warn(`${file} not found.`);
    }
});

console.log('Build process completed.');
