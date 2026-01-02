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

if (toggle) {
  toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    document.documentElement.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "light" : "dark"
    );

    toggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";
  });
}

const tabs = document.querySelectorAll(".tab");
const projectLists = document.querySelectorAll(".projects-list");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    projectLists.forEach((list) => list.classList.add("hidden"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

/* Carousel autoplay + pause-on-hover */
(() => {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".slide"));
  if (slides.length <= 1) return;

  let current = 0;
  const autoplayDelay = 5000; // 5s
  let timer = null;

  const slideWidth = () => track.clientWidth;

  function goToSlide(index) {
    const target = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: target * slideWidth(), behavior: "smooth" });
    current = target;
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Pause when hovering the track or interacting
  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);

  // Restart autoplay after user scroll (so manual interaction doesn't break it)
  let isUserScrolling = false;
  track.addEventListener(
    "scroll",
    () => {
      isUserScrolling = true;
      // small debounce
      clearTimeout(track._scrollTimeout);
      track._scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
        // snap to nearest slide after manual scroll
        const idx = Math.round(track.scrollLeft / slideWidth());
        goToSlide(idx);
      }, 150);
    },
    { passive: true }
  );

  // Keep position on resize
  window.addEventListener("resize", () => goToSlide(current));

  // start
  startAutoplay();
})();
