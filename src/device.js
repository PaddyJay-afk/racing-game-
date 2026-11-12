/* device.js — picks the render ceiling for the device and keeps the screen awake while racing.
 *
 * render3d.js already adapts resolution and tier to the measured frame time; this only decides how
 * high the auto-scaler is allowed to climb. Flagship phones (iPhone Pro Max class: 3x display,
 * 430pt+ wide) and desktops may reach the "ultra" tier: native-resolution internal rendering,
 * 4096 shadow maps and the densest particles. Everything else tops out at "high".
 */
(function () {
  "use strict";
  const FZ = (window.FZ = window.FZ || {});
  const ua = navigator.userAgent || "";
  const touch = (navigator.maxTouchPoints || 0) > 0;
  const dpr = window.devicePixelRatio || 1;
  const sw = Math.min(screen.width || 0, screen.height || 0),
    sl = Math.max(screen.width || 0, screen.height || 0);
  const isIPhone = /iPhone/.test(ua);
  const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touch);
  const cores = navigator.hardwareConcurrency || 4;

  const info = {
    isIPhone,
    isIPad,
    touch,
    dpr,
    /* 430x932 (Pro Max / Plus) and 440x956 (16/17 Pro Max) logical points at 3x */
    proMax: isIPhone && dpr >= 3 && sw >= 428 && sl >= 926,
    desktop: !touch,
    top: "high",
  };
  if (info.proMax || isIPad || (info.desktop && cores >= 8)) info.top = "ultra";
  try {
    const q = new URLSearchParams(location.search).get("tier");
    if (q) info.top = q;
  } catch {}

  let lock = null;
  function wake() {
    try {
      if (!("wakeLock" in navigator) || lock || document.hidden) return;
      navigator.wakeLock.request("screen").then(
        (l) => {
          lock = l;
          l.addEventListener("release", () => {
            lock = null;
          });
        },
        () => {},
      );
    } catch {}
  }

  FZ.Device = {
    info,
    apply() {
      try {
        FZ.Render && FZ.Render.setTopTier && FZ.Render.setTopTier(info.top, false);
      } catch {}
      // tilt steering means long stretches without touches: keep the display on
      const arm = () => wake();
      window.addEventListener("pointerdown", arm, { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) wake();
      });
    },
  };
})();
