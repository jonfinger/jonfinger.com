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

  function renderProjectCards() {
    var container = document.getElementById("project-grid");
    var dataEl = document.getElementById("project-data");

    if (!container || !dataEl || container.children.length > 0) {
      return;
    }

    var projects;
    try {
      projects = JSON.parse(dataEl.textContent || "[]");
    } catch (_error) {
      return;
    }

    var fragment = document.createDocumentFragment();

    projects.forEach(function (project) {
      var card = document.createElement("a");
      var url = project.url || "#";
      card.className = "project-card";
      card.href = url;
      card.setAttribute("aria-label", (project.title || "Project") + " link");

      var title = document.createElement("h3");
      title.className = "project-card__title";
      title.textContent = project.title || "Untitled project";

      var summary = document.createElement("p");
      summary.className = "project-card__summary";
      summary.textContent = project.summary || "";

      var tags = document.createElement("div");
      tags.className = "project-card__tags";

      (project.tags || []).forEach(function (tag) {
        var tagEl = document.createElement("span");
        tagEl.className = "project-tag";
        tagEl.textContent = tag;
        tags.appendChild(tagEl);
      });

      card.appendChild(title);
      card.appendChild(summary);
      card.appendChild(tags);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("has-js");
    setActiveNavLink();
    updateNavbarProgress();
    renderProjectCards();
  });
})();
