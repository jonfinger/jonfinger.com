(function () {
  "use strict";

  var CANONICAL_ORIGIN = "https://jonfinger.com";
  var TOOL_IDS = ["url-lengthener", "useless-facts", "obtuse-helper"];

  var wheel = document.getElementById("tool-wheel");
  var wheelSlices = Array.prototype.slice.call(document.querySelectorAll(".wheel-slice"));
  var listButtons = Array.prototype.slice.call(document.querySelectorAll("[data-tool-list]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tool-panel"));

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
    selectedLength: 1024,
    rotation: 0,
    isDragging: false,
    pointerId: null,
    previousAngle: 0,
    velocity: 0,
    inertiaFrame: null,
    justDragged: false,
    dragDistance: 0
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

  function normalizeAngleDelta(delta) {
    var next = delta;
    while (next > 180) {
      next -= 360;
    }
    while (next < -180) {
      next += 360;
    }
    return next;
  }

  function getPointerAngle(event) {
    var rect = wheel.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var dx = event.clientX - centerX;
    var dy = event.clientY - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }

  function applyRotation() {
    wheel.style.transform = "rotate(" + state.rotation.toFixed(2) + "deg)";
  }

  function stopInertia() {
    if (state.inertiaFrame) {
      window.cancelAnimationFrame(state.inertiaFrame);
      state.inertiaFrame = null;
    }
  }

  function startInertia() {
    stopInertia();

    function step() {
      state.rotation += state.velocity;
      state.velocity *= 0.94;
      applyRotation();

      if (Math.abs(state.velocity) < 0.06) {
        state.velocity = 0;
        state.inertiaFrame = null;
        return;
      }

      state.inertiaFrame = window.requestAnimationFrame(step);
    }

    if (Math.abs(state.velocity) >= 0.06) {
      state.inertiaFrame = window.requestAnimationFrame(step);
    }
  }

  function setSelectedTool(toolId) {
    if (TOOL_IDS.indexOf(toolId) === -1) {
      return;
    }

    state.selectedTool = toolId;

    wheelSlices.forEach(function (slice) {
      slice.classList.toggle("is-selected", slice.getAttribute("data-tool") === toolId);
    });

    listButtons.forEach(function (button) {
      button.classList.toggle("is-selected", button.getAttribute("data-tool-list") === toolId);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-panel") === toolId);
    });
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

  function onWheelPointerDown(event) {
    if (event.button !== 0 && event.pointerType !== "touch") {
      return;
    }

    state.isDragging = true;
    state.pointerId = event.pointerId;
    state.previousAngle = getPointerAngle(event);
    state.velocity = 0;
    state.dragDistance = 0;
    state.justDragged = false;
    wheel.classList.add("is-dragging");
    stopInertia();

    if (wheel.setPointerCapture) {
      wheel.setPointerCapture(event.pointerId);
    }
  }

  function onWheelPointerMove(event) {
    if (!state.isDragging || state.pointerId !== event.pointerId) {
      return;
    }

    var nextAngle = getPointerAngle(event);
    var delta = normalizeAngleDelta(nextAngle - state.previousAngle);

    state.rotation += delta;
    state.previousAngle = nextAngle;
    state.velocity = delta;
    state.dragDistance += Math.abs(delta);

    if (state.dragDistance > 3) {
      state.justDragged = true;
    }

    applyRotation();
  }

  function onWheelPointerUp(event) {
    if (!state.isDragging || state.pointerId !== event.pointerId) {
      return;
    }

    state.isDragging = false;
    state.pointerId = null;
    wheel.classList.remove("is-dragging");
    startInertia();

    if (wheel.releasePointerCapture) {
      try {
        wheel.releasePointerCapture(event.pointerId);
      } catch (_error) {
        // Ignore invalid pointer release race.
      }
    }

    window.setTimeout(function () {
      state.justDragged = false;
    }, 30);
  }

  function initializeWheelSelection() {
    wheelSlices.forEach(function (slice) {
      slice.addEventListener("click", function () {
        if (state.justDragged) {
          return;
        }

        setSelectedTool(slice.getAttribute("data-tool"));
      });
    });

    listButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setSelectedTool(button.getAttribute("data-tool-list"));
      });
    });
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

  wheel.addEventListener("pointerdown", onWheelPointerDown);
  wheel.addEventListener("pointermove", onWheelPointerMove);
  wheel.addEventListener("pointerup", onWheelPointerUp);
  wheel.addEventListener("pointercancel", onWheelPointerUp);

  initializeWheelSelection();
  initializeLengthener();
  setSelectedTool(state.selectedTool);
  applyRotation();
})();
