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

  window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("has-js");
    setActiveNavLink();
    updateNavbarProgress();
  });
})();
