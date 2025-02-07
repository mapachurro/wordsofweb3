export default async function initExplore(locale = "en") {
  const exploreContainer = document.getElementById("explore-container");

  // Fetch directoryContents.json dynamically
  try {
    const response = await fetch(`./directoryContents.json`);
    if (!response.ok) throw new Error(`Failed to load directoryContents.json`);
    
    const directoryContents = await response.json();
    console.log("Loaded directoryContents:", JSON.stringify(directoryContents, null, 2));

    if (!directoryContents || directoryContents.length === 0) {
      console.error("No directory contents available for explore feature");
      return;
    }

    // Define Unicode patterns for different scripts
    const scriptPatterns = {
      arabic: /^[\u0600-\u06FF]/,
      cjk: /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/, // Chinese, Japanese, and Korean
      devanagari: /^[\u0900-\u097F]/, // Hindi
      greek: /^[\u0370-\u03FF]/, // Greek
      cyrillic: /^[\u0400-\u04FF]/, // Cyrillic
      latin: /^[A-Za-z]/, // Latin alphabet
    };

    // Ensure the locale is a valid BCP 47 language tag
function getValidLocale(locale) {
  try {
    const normalizedLocale = new Intl.Locale(locale).toString();
    if (Intl.Collator.supportedLocalesOf([normalizedLocale]).length) {
      return normalizedLocale;
    }
  } catch (err) {
    console.warn(`Invalid locale format: ${locale}, falling back to "en"`);
  }
  return "en"; // Default fallback
}

const validLocale = getValidLocale(locale);
console.log(`Using locale: ${validLocale} for sorting`);
const safeLocale = validLocale.replace("_", "-");
const collator = new Intl.Collator(safeLocale);

    // Function to determine the script of a term
    function getScript(text) {
      for (const [script, pattern] of Object.entries(scriptPatterns)) {
        if (pattern.test(text)) {
          return script;
        }
      }
      return "latin"; // Default to Latin if no other script matches
    }

    // Sort directory contents
    const sortedLinks = directoryContents.sort((a, b) => {
      const aScript = getScript(a.name);
      const bScript = getScript(b.name);

      // Sort by script order first
      const scriptOrder = ["arabic", "cjk", "devanagari", "greek", "cyrillic", "latin"];
      const aScriptIndex = scriptOrder.indexOf(aScript);
      const bScriptIndex = scriptOrder.indexOf(bScript);

      if (aScriptIndex !== bScriptIndex) {
        return aScriptIndex - bScriptIndex;
      }

      // If the scripts are the same, sort alphabetically within that script
      return collator.compare(a.name, b.name);
    });

    console.log("Sorted directory contents:", sortedLinks);

    // Create term links
    sortedLinks.forEach((link) => {
      const termLink = document.createElement("a");
      termLink.href = `./${link.link}`;

      // DEBUGGING: Log the exact assignment
      console.log("Appending to Explore section:", {
        href: termLink.href,
        nameUsed: link.name
      });

      termLink.textContent = link.name; // Should use `name`
      termLink.className = "term-link col-12 col-md-4";
      exploreContainer.appendChild(termLink);
    });
  } catch (error) {
    console.error("Error loading directoryContents.json:", error);
  }
}
