import { convertLanguageFormat } from "./l10n.js";

export function renderNavbar(languageOptions) {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <a class="navbar-brand" href="#">
        <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
        wordsofweb3
      </a>
      <div class="collapse navbar-collapse">
        <select id="language-selector" class="form-select ml-auto language-selector">
          ${languageOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
        </select>
      </div>
    </nav>
  `;
}

export const languageOptions = [
  { value: "us-english", label: "English" },
  { value: "deutsch", label: "Deutsch" },
  { value: "italiano", label: "Italiano" },
  { value: "العربية", label: "العربية" },
  { value: "中文-(简体)", label: "中文 (简体)" },
  { value: "中文-(繁體)", label: "中文 (繁體)" },
  { value: "nederlands", label: "Nederlands" },
  { value: "français", label: "Français" },
  { value: "Ελληνικά", label: "Ελληνικά" },
  { value: "hausa", label: "Hausa" },
  { value: "हिन्दी", label: "हिन्दी" },
  { value: "magyar", label: "Magyar" },
  { value: "bahasa-indonesia", label: "Bahasa Indonesia" },
  { value: "日本語", label: "日本語" },
  { value: "한국어", label: "한국어" },
  { value: "فارسی", label: "فارسی" },
  { value: "bahasa-melayu", label: "Bahasa Melayu" },
  { value: "naijá", label: "Naijá" },
  { value: "polski", label: "Polski" },
  { value: "português-brasil", label: "Português (Brasil)" },
  { value: "română", label: "Română" },
  { value: "Русский", label: "Русский" },
  { value: "español-latinoamérica", label: "Español (Latinoamérica)" },
  { value: "tagalog", label: "Tagalog" },
  { value: "ไทย", label: "ไทย" },
  { value: "türkçe", label: "Türkçe" },
  { value: "Українська", label: "Українська" },
  { value: "tiếng-việt", label: "Tiếng Việt" },
];

// Fix for language change not triggering navigation
const handleLanguageChange = async () => {
  const languageSlug = languageSelector.value;

  try {
    const languageCode = await convertLanguageFormat(languageSlug, "slug", "fourLetterDash");
    console.log("language selected: "+languageCode)

    if (languageCode) {
      localStorage.setItem("selectedLanguage", languageSlug);
      console.log("Site language set to: " + languageSlug);

      const currentPathParts = window.location.pathname.split("/");
      const currentPage = currentPathParts.pop() || "index.html";

      // Get the term slug (e.g., 3box-labs) from the current URL
      const termSlug = currentPathParts.pop();

      // Try fetching the localized term page
      const newPath = `/${languageSlug}/${termSlug}.html`;
      const response = await fetch(newPath);

      // If the term exists in the new language, navigate to it
      if (response.ok) {
        window.location.href = newPath;
      } else {
        // If not, navigate to the homepage in the selected language
        window.location.href = `/${languageSlug}/index.html`;
      }
    } else {
      throw new Error("Invalid language selection");
    }
  } catch (error) {
    console.error("Error during language selection:", error);
  }
};

// Fix for logo click appending #
const handleLogoClick = (event) => {
  console.log("go to homepage in this locale")
  event.preventDefault();  // Prevent the default behavior of adding a hash
  const selectedLanguage = languageSelector.value;
  window.location.href = `/${selectedLanguage}/index.html`;
};

// Make sure the navbar initializes correctly
export function initNavbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById("language-selector");
    const logoElement = document.querySelector(".navbar-brand");

    // Check if the elements exist before trying to add event listeners
    if (!languageSelector || !logoElement) {
      console.error("Navbar elements not found");
      return;
    }

    // Set event listeners
    languageSelector.addEventListener("change", handleLanguageChange);
    logoElement.addEventListener("click", handleLogoClick);
  });
}
