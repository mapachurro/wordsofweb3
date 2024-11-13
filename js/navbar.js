document.addEventListener('DOMContentLoaded', () => {
  const languageSelector = document.getElementById('language-selector');

  if (!languageSelector) {
    console.error('Language selector not found');
    return;
  }

  // Add change event listener for the dropdown
  languageSelector.addEventListener('change', () => {
    const selectedLanguagePath = languageSelector.value;
    console.log('Language selected:', selectedLanguagePath); // Debug log
    if (selectedLanguagePath) {
      window.location.href = selectedLanguagePath; // Redirect to the selected language's index.html
    } else {
      console.error('Selected language path is invalid');
    }
  });
});