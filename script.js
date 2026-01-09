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

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const statusEl = document.getElementById("contactStatus");

  // Initialize EmailJS if available (replace YOUR_USER_ID with your EmailJS user ID)
  if (window.emailjs && typeof emailjs.init === "function") {
    emailjs.init("YOUR_USER_ID");
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (statusEl) statusEl.textContent = "Sending...";
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // Use EmailJS if loaded and configured; otherwise fall back to mailto
    if (window.emailjs && typeof emailjs.sendForm === "function") {
      emailjs
        .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", "#contactForm")
        .then(() => {
          if (statusEl) statusEl.textContent = "Message sent — thank you!";
          contactForm.reset();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          if (statusEl)
            statusEl.textContent = "Error sending message — trying fallback.";
          // fallback to mailto
          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;
          const message = document.getElementById("message").value;
          const subject = "New Contact Message from " + name;
          const body =
            "Name: " +
            name +
            "%0D%0AEmail: " +
            email +
            "%0D%0A%0D%0A" +
            message;
          window.location.href = `mailto:susanawori15@gmail.com?subject=${subject}&body=${body}`;
          name + "%0D%0AEmail: " + email + "%0D%0A%0D%0A" + message;
          window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    } else {
      // fallback: open user's mail client
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
      const subject = "New Contact Message from " + name;
      const body =
        "Name: " + name + "%0D%0AEmail: " + email + "%0D%0A%0D%0A" + message;
      window.location.href = `mailto:susanawori15@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
