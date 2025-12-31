document.addEventListener("DOMContentLoaded", () => {
  console.log("S-Visual Studio Portfolio Loaded");

  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      header.style.boxShadow = "none";
    }
  });
});

const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  document.documentElement.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "light" : "dark"
  );

  toggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";
});
