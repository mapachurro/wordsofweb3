// Importing required modules
import fs from 'fs';
import path from 'path';
import buildPages from './build-pages.js';
import buildHomepages from './build-homepages.js';
import intertextualLinks from './intertextual.js';
import { fileURLToPath } from 'url';

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const staticDir = path.join(__dirname, '../static/');
const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const l10nDir = path.join(__dirname, '../l10n');
const srcJsDir = path.join(__dirname, '../src/js');

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

// Function to generate directory index JSON files
function generateDirectoryIndex(directoryPath) {
    const locales = fs.readdirSync(directoryPath).filter(dir => fs.lstatSync(path.join(directoryPath, dir)).isDirectory());
    locales.forEach(locale => {
        const localePath = path.join(directoryPath, locale);
        const outputPath = path.join(localePath, 'directoryContents.json');

        const files = fs.readdirSync(localePath).filter(file => file.endsWith('.html'));
        const indexData = files.map(file => ({
            name: path.basename(file, '.html'),
            link: file,
        }));

        fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2));
        console.log(`Index generated at ${outputPath}`);
    });
}

// Main build function to ensure proper sequencing of tasks
async function build() {
    try {
        // Ensure a clean build directory
        if (fs.existsSync(buildDir)) {
            fs.rmSync(buildDir, { recursive: true, force: true });
        }
        fs.mkdirSync(buildDir, { recursive: true });

        // Run the entry page generation process
        buildPages();
        console.log('Pages built.');

        // Run the homepage generation process
        buildHomepages();
        console.log('Built homepages for each locale.');

        // Generate directory index files
        generateDirectoryIndex(staticDir);
        console.log('Directory indices generated.');

        // Run the intertextual hyperlink creation process (await since it's async)
        await intertextualLinks();
        console.log('Intertextual links inserted.');

        console.log('Build process complete; copying built files starting now.');

        // Copy term pages to corresponding directories in the build folder
        if (fs.existsSync(staticDir)) {
            fs.readdirSync(staticDir).forEach((dir) => {
                const sourcePath = path.join(staticDir, dir);
                const targetPath = path.join(buildDir, dir);
                copyFolderRecursiveSync(sourcePath, targetPath);
            });
            console.log('Term pages and homepages copied to build directory.');
        } else {
            console.warn('Static directory not found. Pages not copied.');
        }

        // Copy CSS files to 'assets/css'
        const cssDir = path.join(publicDir, 'assets/css/');
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

        // Copy l10n assets to 'l10n' in build directory
        if (fs.existsSync(l10nDir)) {
            copyFolderRecursiveSync(l10nDir, path.join(buildDir, 'l10n'));
            console.log('l10n assets copied.');
        } else {
            console.warn('l10n directory not found.');
        }

        // Copy index.html to root build directory
        ['index.html'].forEach((file) => {
            const filePath = path.join(__dirname, `../${file}`);
            if (fs.existsSync(filePath)) {
                copyFileSync(filePath, buildDir);
                console.log(`${file} copied.`);
            } else {
                console.warn(`${file} not found.`);
            }
        });

        console.log('Build process completed.');

    } catch (error) {
        console.error('An error occurred during the build process:', error);
    }
}

// Run the build process
build();
