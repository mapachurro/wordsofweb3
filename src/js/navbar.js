import { convertLanguageFormat } from './l10n.js';
import { loadTranslations } from './index.js';  // Ensure loadTranslations is imported or defined

// Render the navbar HTML dynamically
export function renderNavbar(languageOptions) {
  return `
    <nav class="navbar">
      <div class="logo">
        <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
        <span id="logoText">wordsofweb3</span>
      </div>
      <select id="language-selector" class="language-selector">
        ${languageOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
      </select>    
    </nav>
  `;
}

// Example language options array, you can dynamically generate this based on your locales
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
    const language = localStorage.getItem('selectedLanguage') || 'us-english';
    window.location.href = `/${language}/index.html`;
  };

  const handleLanguageChange = async () => {
    const languageSlug = document.getElementById('language-selector').value;
    const languageCode = await convertLanguageFormat(languageSlug, 'slug', 'fourLetterDash');

    if (languageCode) {
      // Update the language in LocalStorage
      localStorage.setItem('selectedLanguage', languageSlug);

      // Update the <html lang> attribute
      document.documentElement.lang = languageCode;

      // Reload translations
      await loadTranslations(languageSlug);
    } else {
      console.error('Invalid language selection');
    }

    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${languageSlug}/${currentPath}`;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const languageSelector = document.getElementById('language-selector');
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'us-english';
    languageSelector.value = storedLanguage;

    const languageCode = await convertLanguageFormat(storedLanguage, 'slug', 'fourLetterDash');
    document.documentElement.lang = languageCode;

    // Load translations on page load
    await loadTranslations(storedLanguage);
  });

  // Attach event listeners
  document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
  document.querySelector('.logo').addEventListener('click', handleLogoClick);
};
