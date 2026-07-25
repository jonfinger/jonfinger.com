(function () {
  "use strict";

  function normalizePath(pathname) {
    return pathname
      .replace(/index\.html$/, "")
      .replace(/\/$/, "") || "/";
  }

  function updateNavbarProgress() {
    var root = document.documentElement;
    var header = document.getElementById("quarto-header");
    var ticking = false;

    function setState() {
      var y = window.scrollY || window.pageYOffset || 0;
      var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      var progress = max > 0 ? Math.min(y / max, 1) : 0;

      root.style.setProperty("--scroll-progress", progress.toFixed(4));

      if (header) {
        header.classList.toggle("is-scrolled", y > 24);
      }

      ticking = false;
    }

    function onScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(setState);
    }

    setState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  function setActiveNavLink() {
    var current = normalizePath(window.location.pathname);
    var links = document.querySelectorAll("#quarto-header .navbar .nav-link");

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.startsWith("http")) {
        return;
      }

      var target = normalizePath(new URL(href, window.location.origin).pathname);
      if (target === current) {
        link.classList.add("is-active");
      }
    });
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setupReveals() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) {
      return;
    }

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupRails() {
    document.querySelectorAll("[data-rail]").forEach(function (rail) {
      var section = rail.closest("section");
      if (!section) {
        return;
      }

      var prev = section.querySelector("[data-rail-prev]");
      var next = section.querySelector("[data-rail-next]");
      if (!prev || !next) {
        return;
      }

      function step() {
        var card = rail.firstElementChild;
        var gap = parseFloat(window.getComputedStyle(rail).columnGap) || 16;
        return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
      }

      function updateButtons() {
        var max = rail.scrollWidth - rail.clientWidth - 1;
        prev.disabled = rail.scrollLeft <= 1;
        next.disabled = rail.scrollLeft >= max;
      }

      prev.addEventListener("click", function () {
        rail.scrollBy({ left: -step(), behavior: reducedMotion.matches ? "auto" : "smooth" });
      });

      next.addEventListener("click", function () {
        rail.scrollBy({ left: step(), behavior: reducedMotion.matches ? "auto" : "smooth" });
      });

      rail.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      updateButtons();
    });
  }

  function setupTypewriter() {
    var box = document.querySelector("[data-typewriter]");
    if (!box || reducedMotion.matches) {
      return;
    }

    var text = box.querySelector(".dialog-box__text");
    if (!text) {
      return;
    }

    var full = text.textContent;
    var index = 0;
    var timer = null;

    text.textContent = "";
    box.classList.add("is-typing");

    function finish() {
      window.clearInterval(timer);
      text.textContent = full;
      box.classList.remove("is-typing");
      box.removeEventListener("click", finish);
    }

    box.addEventListener("click", finish);

    // Let the box's entrance animation land before the text starts typing.
    window.setTimeout(function () {
      timer = window.setInterval(function () {
        index += 1;
        text.textContent = full.slice(0, index);
        if (index >= full.length) {
          finish();
        }
      }, 22);
    }, 600);
  }

  window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("has-js");
    setActiveNavLink();
    updateNavbarProgress();
    setupReveals();
    setupRails();
    setupTypewriter();
  });
})();
