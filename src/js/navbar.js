export async function renderNavbar() {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <a class="navbar-brand" href="index.html" id="logo-link">
        <img src="/assets/education-dao-circle.png" alt="Logo" class="logo-image" />
        wordsofweb3
      </a>
      <div class="collapse navbar-collapse" id="navbar-dropdown-container">
        <!-- Language selector will be injected here -->
      </div>
    </nav>
  `;
}

export async function initNavbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const logoElement = document.getElementById("logo-link");

    if (!logoElement) {
      console.error("Navbar logo element not found");
      return;
    }

    // Attach click event to logo
    logoElement.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior
      window.location.href = `/index.html`; // Redirect to root index page
    });
  });
}
