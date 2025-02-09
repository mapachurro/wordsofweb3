// Importing required modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  initializeLanguageCodes,
  convertLocaleFormat,
} from "../src/js/l10n.js";
// Import scripts that handle different parts of the build process
// import { updateTemplateWithLocales } from "./build-dropdown.js";
import { generateDirectoryIndex } from "./generateDirectoryIndex.js";
import buildPages from "./build-pages.js";
import buildHomepages from "./build-homepages.js";
import intertextualLinks from "./intertextual.js";
import { buildResourcesPage } from "./additional-pages/build-resources.js";

// This creates an equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const staticDir = path.join(__dirname, "../static/");
const buildDir = path.join(__dirname, "../build");
const publicDir = path.join(__dirname, "../public");
// const localesDir = path.join(__dirname, "../locales");
const srcJsDir = path.join(__dirname, "../src/js");
// const navbarTemplatePath = path.join(__dirname, '../navbar-template.html'); // Define path to navbar-template.html
// const indexTemplatePath = path.join(__dirname, '../utils/index-template.html'); // Define path to index-template.html

// Ensure language codes are initialized
await initializeLanguageCodes();

// if (fs.existsSync(staticDir)) {
//   fs.readdirSync(staticDir).forEach((locale) => {
//     const humanReadableName =
//       convertLocaleFormat(locale, "fourLetterDash", "slug") || locale;
//     const sourceFile = path.join(staticDir, locale, "directoryContents.json");
//     const targetDir = path.join(buildDir, humanReadableName);
//     const targetFile = path.join(targetDir, "directoryContents.json");

//     if (fs.existsSync(sourceFile)) {
//       fs.mkdirSync(targetDir, { recursive: true });
//       fs.copyFileSync(sourceFile, targetFile);
//       console.log(
//         `Copied directoryContents.json for ${locale} → ${humanReadableName}`,
//       );
//     } else {
//       console.warn(`directoryContents.json missing for ${locale}, skipping...`);
//     }
//   });
// } else {
//   console.warn(
//     "Locales directory not found, skipping directoryContents.json copying.",
//   );
// }

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

// Main build function to ensure proper sequencing of tasks
async function build() {
  try {
    // Ensure a clean build directory
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
    fs.mkdirSync(buildDir, { recursive: true });

    // Run the entry page generation process
    await buildPages();
    console.log("Pages built.");

    // Run the homepage generation process
    console.log("Beginning index.html generation for all locales");
    await buildHomepages();
    console.log("Built homepages for each locale.");

    // Generate the directoryContents files
    console.log("Generating directory index...");
    await generateDirectoryIndex();
    console.log("Directory index generated.");

    // Create the 'Resources' page
    console.log("Generating resources page...");
    await buildResourcesPage();
    console.log("Resources page built.");

    // Run the intertextual hyperlink creation process (await since it's async)
    await intertextualLinks();
    console.log("Intertextual links inserted.");

    console.log("Build process complete; copying built files starting now.");

    // Copy term pages to corresponding directories in the build folder
    if (fs.existsSync(staticDir)) {
      fs.readdirSync(staticDir).forEach((dir) => {
        const sourcePath = path.join(staticDir, dir);
        const targetPath = path.join(buildDir, dir);
        copyFolderRecursiveSync(sourcePath, targetPath);
      });
      console.log("Term pages and homepages copied to build directory.");
    } else {
      console.warn("Static directory not found. Pages not copied.");
    }

    // Copy CSS files to 'assets/css'
    const cssDir = path.join(publicDir, "assets/css/");
    if (fs.existsSync(cssDir)) {
      copyFolderRecursiveSync(cssDir, path.join(buildDir, "assets/css"));
      console.log("CSS files copied to assets/css.");
    }

    // Copy directoryContents.json files to the build directory
    const localesDir = path.join(__dirname, "../locales");
    if (fs.existsSync(localesDir)) {
      fs.readdirSync(localesDir).forEach((locale) => {
        const sourceFile = path.join(
          localesDir,
          locale,
          "directoryContents.json",
        );
        const targetFile = path.join(
          buildDir,
          convertLocaleFormat(locale, "fourLetterDash", "slug"),
          "directoryContents.json",
        );

        if (fs.existsSync(sourceFile)) {
          // Ensure locale directory exists in build
          fs.mkdirSync(path.dirname(targetFile), { recursive: true });
          copyFileSync(sourceFile, targetFile);
          console.log(`Copied directoryContents.json for ${locale}`);
        } else {
          console.warn(
            `directoryContents.json missing for ${locale}, skipping...`,
          );
        }
      });
    } else {
      console.warn(
        "Locales directory not found, skipping directoryContents.json copying.",
      );
    }

    // Copy search indices to 'assets/search-indices'
    // const searchIndicesDir = path.join(publicDir, "assets/search-indices");
    // if (fs.existsSync(searchIndicesDir)) {
    //   copyFolderRecursiveSync(
    //     searchIndicesDir,
    //     path.join(buildDir, "assets/search-indices"),
    //   );
    //   console.log("Search indices copied to assets/search-indices.");
    // }

    // Copy JavaScript files to 'js'
    if (fs.existsSync(srcJsDir)) {
      copyFolderRecursiveSync(srcJsDir, path.join(buildDir, "js"));
      console.log("JavaScript files copied to js directory.");
    }

    // Copy other public assets (e.g., images, favicon) directly to 'assets'
    ["favicon.ico", "education-dao-circle.png", "language-codes.json"].forEach(
      (file) => {
        const filePath = path.join(publicDir, `assets/${file}`);
        if (fs.existsSync(filePath)) {
          copyFileSync(filePath, path.join(buildDir, "assets", file));
          console.log(`${file} copied to assets.`);
        } else {
          console.warn(`${file} not found in public/assets.`);
        }
      },
    );

    // Copy index.html to root build directory
    ["index.html", "navbar-template.html"].forEach((file) => {
      const filePath = path.join(__dirname, `../${file}`);
      if (fs.existsSync(filePath)) {
        copyFileSync(filePath, buildDir);
        console.log(`${file} copied.`);
      } else {
        console.warn(`${file} not found.`);
      }
    });

    console.log("Build process completed.");
  } catch (error) {
    console.error("An error occurred during the build process:", error);
  }
}

// Run the build process
build();
