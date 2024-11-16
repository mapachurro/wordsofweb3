// This should create the alphabetical listing of terms shown on each language's homepage.

export default function initExplore(directoryContents, locale = "en") {
  const exploreContainer = document.getElementById("explore-container");

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
    // Add more patterns as needed
  };

  const collator = new Intl.Collator(locale);

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

  // Create term links and apply responsive classes
  sortedLinks.forEach((link) => {
    const termLink = document.createElement("a");
    termLink.href = `./${link.link}`;
    termLink.textContent = link.name;
    termLink.className = "term-link col-12 col-md-4"; // Responsive classes
    exploreContainer.appendChild(termLink);
  });

  // Helper function to determine the script of a term
  function getScript(text) {
    for (const [script, pattern] of Object.entries(scriptPatterns)) {
      if (pattern.test(text)) {
        return script;
      }
    }
    return "latin"; // Default to Latin if no other script matches
  }
}
