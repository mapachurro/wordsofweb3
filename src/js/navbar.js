import { convertLanguageFormat } from "./l10n.js";

// Render the navbar HTML dynamically
export function renderNavbar(languageOptions) {
  return `
    <nav class="navbar">
      <div class="logo">
        <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
        <span id="logoText">wordsofweb3</span>
      </div>
      <select id="language-selector" class="language-selector">
        ${languageOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
      </select>    
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

export function initNavbar() {
  const handleLogoClick = () => {
    const language = localStorage.getItem("selectedLanguage") || "us-english";
    const currentPath = window.location.pathname;
    
    // Redirect to the homepage for the selected language
    if (!currentPath.includes(`/${language}/`)) {
      window.location.href = `/${language}/index.html`;
    } else {
      window.location.href = `${currentPath}`;
    }
  };

  const handleLanguageChange = async () => {
    const languageSlug = document.getElementById("language-selector").value;
    
    try {
      const languageCode = await convertLanguageFormat(languageSlug, "slug", "fourLetterDash");

      if (languageCode) {
        localStorage.setItem("selectedLanguage", languageSlug);
        console.log("Site language set to: " + languageSlug);

        const currentPathParts = window.location.pathname.split("/");
        const currentPage = currentPathParts.pop(); // Get the current page (e.g., index.html or term page)
        const newPath = `/${languageSlug}/${currentPage || "index.html"}`;

        window.location.href = newPath;
      } else {
        throw new Error("Invalid language selection");
      }
    } catch (error) {
      console.error("Error during language selection:", error);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById("language-selector");
    const storedLanguage = localStorage.getItem("selectedLanguage") || "us-english";

    // Set the language selector to the correct value based on the current language
    languageSelector.value = storedLanguage;

    // No need to set document.documentElement.lang or load translations, as we're only navigating between pages
  });

  // Set event listeners
  document.getElementById("language-selector").addEventListener("change", handleLanguageChange);
  document.querySelector(".logo").addEventListener("click", handleLogoClick);
}
