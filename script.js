document.addEventListener("DOMContentLoaded", () => {
  console.log("Susan Awori Portfolio Loaded");

  // Sticky Header Scroll Effect
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
      } else {
        header.style.boxShadow = "none";
      }
    });
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("mobileNav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

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

  // Dark/Light Theme Toggle
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", nextTheme);
      toggle.textContent = nextTheme === "dark" ? "🌙" : "☀️";
    });
  }

  // Service Accordion Cards Toggle
  const serviceCards = document.querySelectorAll(".service-card");
  if (serviceCards.length > 0) {
    serviceCards.forEach((card) => {
      card.addEventListener("click", () => {
        const isActive = card.classList.contains("active");

        serviceCards.forEach((c) => {
          c.classList.remove("active");
          const icon = c.querySelector(".toggle-icon");
          if (icon) icon.textContent = "➔";
        });

        if (!isActive) {
          card.classList.add("active");
          const icon = card.querySelector(".toggle-icon");
          if (icon) icon.textContent = "✕";
        }
      });
    });
  }

  // Contact Form Submission (EmailJS + mailto fallback)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const statusEl = document.getElementById("contactStatus");
    const EMAILJS_PUBLIC_KEY = "-z_ZDeZXEq6pON2tv";

    if (window.emailjs && typeof emailjs.init === "function") {
      try {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      } catch (err) {
        console.warn("EmailJS init failed:", err);
      }
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (statusEl) statusEl.textContent = "Sending message...";
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      if (window.emailjs && typeof emailjs.sendForm === "function") {
        const serviceID = "service_mz6yoxo";
        const templateID = "template_ml1ns7w";

        Promise.race([
          emailjs.sendForm(serviceID, templateID, contactForm),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 15000)
          ),
        ])
          .then(() => {
            if (statusEl)
              statusEl.textContent =
                "🚀 Message received! I'll get back to you soon.";
            contactForm.reset();
            if (submitBtn) submitBtn.disabled = false;
          })
          .catch((err) => {
            console.error("EmailJS error:", err);
            if (statusEl)
              statusEl.textContent =
                "Connecting to your mail app to send your message...";

            const name = document.getElementById("name").value || "";
            const email = document.getElementById("email").value || "";
            const message = document.getElementById("message").value || "";
            const subject = encodeURIComponent("Portfolio Inquiry from " + name);
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );

            window.location.href = `mailto:susanawori15@gmail.com?subject=${subject}&body=${body}`;
            if (submitBtn) submitBtn.disabled = false;
          });
      } else {
        const name = document.getElementById("name").value || "";
        const email = document.getElementById("email").value || "";
        const message = document.getElementById("message").value || "";
        const subject = encodeURIComponent("Portfolio Inquiry from " + name);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:susanawori15@gmail.com?subject=${subject}&body=${body}`;
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Dynamic Year Update
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
