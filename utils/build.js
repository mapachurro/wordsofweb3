const fs = require('fs');
const path = require('path');
const buildPages = require('./build-pages');
const buildSearchIndices = require('./build-search-indices');

// Paths
const staticDir = path.join(__dirname, '../static/');
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const i18nDir = path.join(__dirname, '../i18n');
const srcJsDir = path.join(__dirname, '../src/js');

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

// Copy term pages to corresponding directories in the build folder
if (fs.existsSync(staticDir)) {
    fs.readdirSync(staticDir).forEach((dir) => {
        const sourcePath = path.join(staticDir, dir);
        const targetPath = path.join(buildDir, dir);
        copyFolderRecursiveSync(sourcePath, targetPath);
    });
    console.log('Term pages copied to build directory.');
} else {
    console.warn('Static directory not found. Term pages not copied.');
}

// Copy CSS files to 'assets/css'
const cssDir = path.join(publicDir, 'assets/css');
if (fs.existsSync(cssDir)) {
    copyFolderRecursiveSync(cssDir, path.join(buildDir, 'assets/css'));
    console.log('CSS files copied to assets/css.');
}

// Copy search indices to 'assets/search-indices'
const searchIndicesDir = path.join(publicDir, 'assets/search-indices');
if (fs.existsSync(searchIndicesDir)) {
    copyFolderRecursiveSync(searchIndicesDir, path.join(buildDir, 'assets/search-indices'));
    console.log('Search indices copied to assets/search-indices.');
}

// Copy JavaScript files to 'js'
if (fs.existsSync(srcJsDir)) {
    copyFolderRecursiveSync(srcJsDir, path.join(buildDir, 'js'));
    console.log('JavaScript files copied to js directory.');
}

// Copy other public assets (e.g., images, favicon) directly to 'assets'
['favicon.ico', 'education-dao-circle.png'].forEach((file) => {
    const filePath = path.join(publicDir, `assets/${file}`);
    if (fs.existsSync(filePath)) {
        copyFileSync(filePath, path.join(buildDir, 'assets', file));
        console.log(`${file} copied to assets.`);
    } else {
        console.warn(`${file} not found in public/assets.`);
    }
});

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
