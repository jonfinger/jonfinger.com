(function () {
  "use strict";

  var CANONICAL_ORIGIN = "https://jonfinger.com";
  var TOOL_IDS = ["url-lengthener", "useless-facts", "obtuse-helper"];

  var songRows = Array.prototype.slice.call(document.querySelectorAll("[data-tool-select]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tool-panel"));

  var toolCounter = document.getElementById("tool-counter");
  var activeToolReadout = document.getElementById("active-tool-readout");

  var urlForm = document.getElementById("url-form");
  var targetUrlInput = document.getElementById("target-url");
  var presetButtons = Array.prototype.slice.call(document.querySelectorAll(".preset-button"));
  var seedInput = document.getElementById("seed-input");
  var newSeedButton = document.getElementById("new-seed");
  var randomizeSeedCheckbox = document.getElementById("randomize-seed");
  var formError = document.getElementById("form-error");
  var formStatus = document.getElementById("form-status");
  var output = document.getElementById("long-url-output");
  var copyButton = document.getElementById("copy-url");
  var openLink = document.getElementById("open-url");

  var state = {
    selectedTool: "url-lengthener",
    selectedLength: 1024
  };

  function randomSeed() {
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(6);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    }

    return Math.random().toString(16).slice(2, 14);
  }

  function setSeed(value) {
    seedInput.value = value || randomSeed();
  }

  function selectedIndexOf(toolId) {
    return TOOL_IDS.indexOf(toolId);
  }

  function setActiveReadout(toolId) {
    var selected = null;
    var i;

    for (i = 0; i < songRows.length; i += 1) {
      if (songRows[i].getAttribute("data-tool-select") === toolId) {
        selected = songRows[i];
        break;
      }
    }

    if (!selected) {
      return;
    }

    var titleEl = selected.querySelector(".song-row__title");
    if (!titleEl) {
      return;
    }

    activeToolReadout.textContent = "Now selecting: " + titleEl.textContent;
  }

  function setCounter(toolId) {
    var index = selectedIndexOf(toolId);
    if (index < 0) {
      toolCounter.textContent = "-- / --";
      return;
    }

    var humanIndex = String(index + 1).padStart(2, "0");
    var total = String(TOOL_IDS.length).padStart(2, "0");
    toolCounter.textContent = humanIndex + " / " + total;
  }

  function setSelectedTool(toolId, options) {
    if (TOOL_IDS.indexOf(toolId) === -1) {
      return;
    }

    state.selectedTool = toolId;

    songRows.forEach(function (row) {
      var isActive = row.getAttribute("data-tool-select") === toolId;
      row.classList.toggle("is-selected", isActive);
      row.setAttribute("aria-selected", isActive ? "true" : "false");

      if (options && options.focus && isActive) {
        row.focus();
      }
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-panel") === toolId);
    });

    setCounter(toolId);
    setActiveReadout(toolId);
  }

  function showError(message) {
    formError.textContent = message || "";
    if (message) {
      formStatus.textContent = "";
    }
  }

  function showStatus(message) {
    formStatus.textContent = message || "";
    if (message) {
      formError.textContent = "";
    }
  }

  function validateTargetUrl(input) {
    if (!input || !input.trim()) {
      return { ok: false, error: "Enter a target URL first." };
    }

    var parsed;
    try {
      parsed = new URL(input.trim());
    } catch (_error) {
      return { ok: false, error: "Enter a full URL like https://example.com" };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "Only http:// and https:// URLs are allowed." };
    }

    return { ok: true, value: parsed.toString() };
  }

  function encodeBase64Url(value) {
    var bytes = new TextEncoder().encode(value);
    var binary = "";

    bytes.forEach(function (byte) {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function deterministicNoise(length, seed) {
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var hash = 2166136261;
    var i;

    for (i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    var outputNoise = "";
    for (i = 0; i < length; i += 1) {
      hash += i + 0x9e3779b9;
      hash ^= hash >>> 15;
      hash = Math.imul(hash, 2246822519);
      hash ^= hash >>> 13;
      var index = Math.abs(hash) % alphabet.length;
      outputNoise += alphabet.charAt(index);
    }

    return outputNoise;
  }

  function buildLongUrl(target, targetLength, seed) {
    var payload = {
      v: 1,
      target: target,
      ts: Date.now(),
      seed: seed
    };

    var payloadEncoded = encodeBase64Url(JSON.stringify(payload));
    var prefix = CANONICAL_ORIGIN + "/useless-tools/r/?v=1&p=" + payloadEncoded + "&n=";

    var fillSize = targetLength - prefix.length;
    if (fillSize < 12) {
      fillSize = 12;
    }

    var noise = deterministicNoise(fillSize, seed + "|" + target);
    return prefix + noise;
  }

  function setPreset(lengthValue) {
    state.selectedLength = lengthValue;
    presetButtons.forEach(function (button) {
      var isMatch = Number(button.getAttribute("data-length")) === lengthValue;
      button.classList.toggle("is-selected", isMatch);
    });
  }

  function setGeneratedUrl(url) {
    output.value = url;
    openLink.href = url;
    openLink.classList.remove("is-disabled");
    openLink.setAttribute("aria-disabled", "false");
  }

  function resetGeneratedUrl() {
    output.value = "";
    openLink.href = "#";
    openLink.classList.add("is-disabled");
    openLink.setAttribute("aria-disabled", "true");
  }

  function copyGeneratedUrl() {
    var value = output.value;
    if (!value) {
      showError("Generate a URL before copying.");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        showStatus("Copied URL to clipboard.");
      }).catch(function () {
        showError("Clipboard copy failed. Copy manually from the field.");
      });
      return;
    }

    output.focus();
    output.select();

    try {
      var copied = document.execCommand("copy");
      if (copied) {
        showStatus("Copied URL to clipboard.");
      } else {
        showError("Clipboard copy failed. Copy manually from the field.");
      }
    } catch (_error) {
      showError("Clipboard copy failed. Copy manually from the field.");
    }
  }

  function isTypingFocus() {
    var active = document.activeElement;
    if (!active) {
      return false;
    }

    var tag = active.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  }

  function moveSelection(delta) {
    var current = selectedIndexOf(state.selectedTool);
    if (current < 0) {
      current = 0;
    }

    var next = (current + delta + TOOL_IDS.length) % TOOL_IDS.length;
    setSelectedTool(TOOL_IDS[next], { focus: true });
  }

  function initializeSelector() {
    songRows.forEach(function (row) {
      row.addEventListener("click", function () {
        setSelectedTool(row.getAttribute("data-tool-select"));
      });
    });

    document.addEventListener("keydown", function (event) {
      if (isTypingFocus()) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1);
      }
    });

    var selector = document.querySelector(".song-list");
    if (selector) {
      selector.addEventListener("wheel", function (event) {
        event.preventDefault();
        if (event.deltaY > 0) {
          moveSelection(1);
        } else if (event.deltaY < 0) {
          moveSelection(-1);
        }
      }, { passive: false });
    }
  }

  function initializeLengthener() {
    setSeed(randomSeed());
    setPreset(state.selectedLength);
    resetGeneratedUrl();

    presetButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var nextLength = Number(button.getAttribute("data-length"));
        setPreset(nextLength);
      });
    });

    newSeedButton.addEventListener("click", function () {
      setSeed(randomSeed());
      showStatus("Seed regenerated.");
    });

    urlForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (randomizeSeedCheckbox.checked) {
        setSeed(randomSeed());
      }

      var validated = validateTargetUrl(targetUrlInput.value);
      if (!validated.ok) {
        resetGeneratedUrl();
        showError(validated.error);
        return;
      }

      var generated = buildLongUrl(validated.value, state.selectedLength, seedInput.value);
      setGeneratedUrl(generated);
      showStatus("Generated URL with length " + generated.length + " characters.");
    });

    copyButton.addEventListener("click", copyGeneratedUrl);
  }

  initializeSelector();
  initializeLengthener();
  setSelectedTool(state.selectedTool);
})();
