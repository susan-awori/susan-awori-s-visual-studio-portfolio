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

  // Hamburger menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("mobileNav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !hamburger.contains(e.target) &&
        !navMenu.contains(e.target) &&
        navMenu.classList.contains("active")
      ) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
});

const toggle = document.getElementById("themeToggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    document.documentElement.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "light" : "dark",
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
    { passive: true },
  );

  // Keep position on resize
  window.addEventListener("resize", () => goToSlide(current));

  // start
  startAutoplay();
})();

/* Contact form */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const statusEl = document.getElementById("contactStatus");

  // UPDATE: Use v4 Public Key initialization
  const EMAILJS_PUBLIC_KEY = "-z_ZDeZXEq6pON2tv";
  if (window.emailjs && typeof emailjs.init === "function") {
    try {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
      });
      console.log("EmailJS initialized with public key.");
    } catch (err) {
      console.warn("EmailJS init failed:", err);
    }
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (statusEl) statusEl.textContent = "Sending...";
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (window.emailjs && typeof emailjs.sendForm === "function") {
      const formEl = contactForm;

      // Service and Template IDs
      const serviceID = "service_mz6yoxo";
      const templateID = "template_ml1ns7w";

      console.log("Attempting to send contact form via EmailJS...");

      // UPDATE: Wrap in Promise.race to prevent hanging
      Promise.race([
        emailjs.sendForm(serviceID, templateID, formEl),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 15000),
        ),
      ])
        .then((response) => {
          console.log("EmailJS response:", response);
          if (statusEl) statusEl.textContent = "Message sent — thank you!";
          contactForm.reset();
          if (submitBtn) submitBtn.disabled = false;
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          const errMsg = (err && (err.text || err.message)) || "Unknown error";
          if (statusEl)
            statusEl.textContent = `Error: ${errMsg}. Redirecting to email...`;

          // Fallback to mailto
          const name = document.getElementById("name").value || "";
          const email = document.getElementById("email").value || "";
          const message = document.getElementById("message").value || "";
          const subject = encodeURIComponent(
            "New Contact Message from " + name,
          );
          const body = encodeURIComponent(
            "Name: " + name + "\nEmail: " + email + "\n\n" + message,
          );

          window.location.href = `mailto:susanawori15@gmail.com?subject=${subject}&body=${body}`;
          if (submitBtn) submitBtn.disabled = false;
        });
    }
  });
}

// Automatically update the year in the copyright section
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

console.log("Projects board loaded");

// Lightbox for project-gallery thumbnails
(function () {
  const galleryImgs = document.querySelectorAll(".project-gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  }

  galleryImgs.forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
