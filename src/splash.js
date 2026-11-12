/* splash API: window.__splash(pct 0-100, label?) updates the bar; window.__splashDone() fades it out.
   Both are safe to call at any time, any number of times, or never (auto-hides if the game never drives it). */
(function () {
  var el = document.getElementById("splash"),
    fill = document.getElementById("sp-fill"),
    lbl = document.getElementById("sp-lbl");
  var driven = false,
    done = false;
  window.__splash = function (pct, label) {
    if (done || !el) return;
    driven = true;
    el.className = "driven";
    var p = +pct;
    if (!(p >= 0)) p = 0;
    if (p > 100) p = 100;
    if (fill) fill.style.transform = "scaleX(" + (p / 100).toFixed(3) + ")";
    if (label != null && lbl) lbl.textContent = String(label);
  };
  window.__splashDone = function () {
    if (done || !el) return;
    done = true;
    el.className += " done";
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      el = fill = lbl = null;
    }, 500);
  };
  // failsafes: a game that never reports progress loses the splash 1.5 s after load; nothing may keep it past 45 s
  addEventListener("load", function () {
    setTimeout(function () {
      if (!driven) window.__splashDone();
    }, 1500);
    setTimeout(function () {
      window.__splashDone();
    }, 45000);
  });
  // PWA: once the page is idle, ask the service worker to fetch the voice files (4 at a time, best effort)
  if (window.__PGP_SW && "serviceWorker" in navigator) {
    var ask = function () {
      try {
        navigator.serviceWorker.ready
          .then(function (r) {
            if (r.active) r.active.postMessage({ type: "precache-voice" });
          })
          .catch(function () {});
      } catch (e) {}
    };
    addEventListener("load", function () {
      if (window.requestIdleCallback) window.requestIdleCallback(ask, { timeout: 10000 });
      else setTimeout(ask, 4000);
    });
  }
})();
