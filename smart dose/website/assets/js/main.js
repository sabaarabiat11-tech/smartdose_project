/* smartdose — shared site behavior */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var body = document.body;
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Accordion (FAQ) */
  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      /* close siblings within the same accordion group */
      var group = item.closest("[data-accordion-group]");
      if (group) {
        group.querySelectorAll(".accordion-item").forEach(function (sib) {
          if (sib !== item) {
            sib.setAttribute("data-open", "false");
            sib.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
            sib.querySelector(".accordion-panel").style.maxHeight = null;
          }
        });
      }
      item.setAttribute("data-open", String(!isOpen));
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* Respect reduced-motion preference for embedded video */
  document.querySelectorAll("video[autoplay]").forEach(function (v) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.removeAttribute("loop");
      v.pause();
    }
  });

  /* Device illustration cell animation (hero + product page) */
  document.querySelectorAll(".device").forEach(function (device) {
    var cells = device.querySelectorAll(".cell");
    if (!cells.length) return;
    var i = 0;
    function cycle() {
      cells.forEach(function (c) { c.classList.remove("active"); });
      cells[i].classList.add("active");
      i = (i + 1) % cells.length;
    }
    cycle();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(cycle, 1800);
    }
  });

  /* Contact form — hands off to the visitor's email client, addressed to smartdose */
  var contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (contactForm.querySelector("#name") || {}).value || "";
      var email = (contactForm.querySelector("#email") || {}).value || "";
      var reasonEl = contactForm.querySelector("#reason");
      var reason = reasonEl ? reasonEl.value : "";
      var message = (contactForm.querySelector("#message") || {}).value || "";

      var subject = "smartdose contact form: " + reason;
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Reason: " + reason,
        "",
        message
      ];
      var mailto =
        "mailto:smartdose.ee@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;

      var success = document.querySelector("#form-success");
      contactForm.reset();
      if (success) {
        success.classList.add("show");
        success.focus();
      }
    });
  }

  /* Footer year */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
