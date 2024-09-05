import { convertLanguageFormat } from "./l10n.js";

export function renderNavbar(languageOptions) {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <a class="navbar-brand" href="#">
        <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
        wordsofweb3
      </a>
      <div class="collapse navbar-collapse">
        <select id="language-selector" class="form-select ml-auto">
          ${languageOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join("")}
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

export function initNavbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById("language-selector");
    const logoElement = document.querySelector(".logo");

    // Check if the elements exist before trying to add event listeners
    if (!languageSelector || !logoElement) {
      console.error("Navbar elements not found");
      return;
    }

    const handleLogoClick = () => {
      const selectedLanguage = languageSelector.value;
      window.location.href = `/${selectedLanguage}/index.html`;
    };

    const handleLanguageChange = async () => {
      const languageSlug = languageSelector.value;

      try {
        const languageCode = await convertLanguageFormat(languageSlug, "slug", "fourLetterDash");

        if (languageCode) {
          localStorage.setItem("selectedLanguage", languageSlug);
          console.log("Site language set to: " + languageSlug);

          const currentPathParts = window.location.pathname.split("/");
          const currentPage = currentPathParts.pop() || "index.html";
          const newPath = `/${languageSlug}/${currentPage}`;

          window.location.href = newPath;
        } else {
          throw new Error("Invalid language selection");
        }
      } catch (error) {
        console.error("Error during language selection:", error);
      }
    };

    // Set the language selector to the correct value based on the current URL path or localStorage
    const storedLanguage = localStorage.getItem("selectedLanguage") || window.location.pathname.split("/")[1];
    languageSelector.value = storedLanguage;

    // Set event listeners
    languageSelector.addEventListener("change", handleLanguageChange);
    logoElement.addEventListener("click", handleLogoClick);
  });
}

