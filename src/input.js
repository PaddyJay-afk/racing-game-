/* input.js */
(function () {
  "use strict";
  const g = (window.FZ = window.FZ || {}),
    F = "pgp.",
    M = Object.create(null),
    B = {};
  g.Settings = {
    get(t, n) {
      let o = M[t];
      if (o === void 0) {
        o = B;
        try {
          const r = window.localStorage.getItem(F + t);
          r != null && (o = JSON.parse(r));
        } catch {}
        M[t] = o;
      }
      return o === B || o === null ? n : o;
    },
    set(t, n) {
      M[t] = n;
      try {
        window.localStorage.setItem(F + t, JSON.stringify(n));
      } catch {}
      return n;
    },
  };
  const m = g.Settings,
    w = Math.PI / 180,
    at = 180 / Math.PI,
    L = 2,
    v = (t, n, o) => (t < n ? n : t > o ? o : t),
    it = (t, n, o) => {
      const r = v((o - t) / (n - t), 0, 1);
      return r * r * (3 - 2 * r);
    },
    X = (t, n, o) => (t < n ? Math.min(n, t + o) : Math.max(n, t - o)),
    l = () => (window.performance && performance.now ? performance.now() : Date.now()),
    st = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    S = ["accel", "brake", "boost", "pause", "left", "right"],
    e = {
      mode: "menu",
      root: null,
      ctl: null,
      probe: null,
      els: {},
      rects: {},
      rectsDirty: !0,
      layout: "",
      touches: new Map(),
      held: {},
      edge: { boost: !1, pause: !1 },
      keys: {},
      keySteer: 0,
      padSteer: 0,
      padHold: 0,
      tapFns: [],
      keyFns: [],
      swipeFns: [],
      tapStarts: new Map(),
      lastTouchT: -1e9,
      mouseDown: null,
      have: !1,
      lastEvt: -1e9,
      lastOrientEvt: -1e9,
      src: "",
      raw: 0,
      filt: 0,
      filtInit: !1,
      active: !1,
      leanOn: 0,
      lastPoll: 0,
      motionState: "unknown",
      listening: !1,
      boostReady: null,
      retryGesture: !1,
      gestureRetries: 0,
      why: "",
      safe: { l: 0, r: 0, t: 0, b: 0 },
      rootW: 0,
      rootH: 0,
    };
  S.forEach((t) => {
    e.held[t] = !1;
  });
  const p = { steer: 0, lean: 0, accel: !1, brake: !1, boost: !1, pause: !1 };
  function I() {
    let t = null;
    try {
      const n = window.screen && screen.orientation;
      n && typeof n.angle == "number" && (t = n.angle);
    } catch {}
    return (t == null && typeof window.orientation == "number" && (t = window.orientation), t == null && (t = 0), ((t % 360) + 360) % 360);
  }
  function Y(t, n) {
    const o = I() * w,
      r = Math.sin(o),
      a = Math.cos(o),
      i = -(t * a - n * r),
      s = t * r + n * a,
      c = Math.hypot(i, s),
      d = Math.atan2(i, s),
      h = Math.asin(v(i, -1, 1)),
      f = it(0.3, 0.6, c);
    return (f * d + (1 - f) * h) * at;
  }
  function ct(t, n, o) {
    const r = I() * w;
    if (t * Math.sin(r) + n * Math.cos(r) < -0.45) {
      if ((e.negSince || (e.negSince = o), o - e.negSince > 700)) return ((e.flip = !e.flip), (e.negSince = 0), (e.filtInit = !1), !0);
    } else e.negSince = 0;
    return !1;
  }
  function z(t, n, o, r) {
    const a = l();
    (e.flip && ((t = -t), (n = -n)),
      ct(t, n, a) && ((t = -t), (n = -n)),
      (e.raw = Y(t, n, o)),
      (e.src = r),
      (e.have = !0),
      (e.lastEvt = a),
      e.filtInit || ((e.filt = e.raw), (e.filtInit = !0)),
      e.active || ((e.active = !0), (u.tiltActive = !0), x()));
  }
  function G(t) {
    if (t == null || t.beta == null || t.gamma == null) return;
    const n = +t.beta,
      o = +t.gamma;
    if (!isFinite(n) || !isFinite(o)) return;
    e.lastOrientEvt = l();
    const r = n * w,
      a = o * w,
      i = Math.cos(r);
    z(-Math.sin(a) * i, Math.sin(r), i * Math.cos(a), "orientation");
  }
  function V(t) {
    if (l() - e.lastOrientEvt < 600) return;
    const n = t && t.accelerationIncludingGravity;
    if (!n || n.x == null || n.y == null || n.z == null) return;
    const o = Math.hypot(n.x, n.y, n.z);
    if (!(o > 4 && o < 20)) return;
    const r = (st ? -1 : 1) / o;
    z(n.x * r, n.y * r, n.z * r, "motion");
  }
  function O() {
    e.listening || ((e.listening = !0), window.addEventListener("deviceorientation", G), window.addEventListener("devicemotion", V));
  }
  function lt() {
    e.listening && ((e.listening = !1), window.removeEventListener("deviceorientation", G), window.removeEventListener("devicemotion", V));
  }
  function A() {
    try {
      if (typeof window.isSecureContext == "boolean") return window.isSecureContext;
    } catch {}
    return location.protocol === "https:" || location.hostname === "localhost" || location.protocol === "file:";
  }
  function y() {
    try {
      return window.self !== window.top;
    } catch {
      return !0;
    }
  }
  function pt() {
    try {
      return !!(
        navigator.standalone ||
        (window.matchMedia && matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches)
      );
    } catch {
      return !1;
    }
  }
  function dt() {
    const t = l(),
      n = setInterval(() => {
        if (e.have) {
          clearInterval(n);
          return;
        }
        l() - t > 1500 && (clearInterval(n), e.have || (e.motionState = u.motionState = "nodata"));
      }, 100);
  }
  function Z() {
    if (e.retryGesture) {
      ((e.retryGesture = !1), e.gestureRetries++);
      try {
        u.requestMotion();
      } catch {}
    }
  }
  function ut() {
    const t = e.motionState;
    if (m.get("steerMode", "auto") === "pads") return { code: "pads", on: !1, msg: "TOUCH PADS SELECTED", detail: "" };
    if (e.active) return { code: "on", on: !0, msg: "TILT STEERING ON", detail: "" };
    const n = y();
    return A()
      ? t === "denied"
        ? {
            code: "denied",
            on: !1,
            msg: "TILT PERMISSION DENIED",
            detail: "ENABLE MOTION & ORIENTATION ACCESS IN SETTINGS \u203A SAFARI, THEN RELAUNCH",
          }
        : n && (t === "blocked" || t === "nodata" || t === "unsupported" || t === "needtap")
          ? { code: "iframe", on: !1, msg: "TILT NEEDS THE HOME-SCREEN APP", detail: "THIS PREVIEW FRAME BLOCKS MOTION SENSORS" }
          : t === "needtap"
            ? { code: "needtap", on: !1, msg: "TAP ENABLE TILT TO ALLOW MOTION", detail: "" }
            : t === "nodata"
              ? {
                  code: "nodata",
                  on: !1,
                  msg: "NO DATA FROM MOTION SENSOR",
                  detail: "CHECK SETTINGS \u203A SAFARI \u203A MOTION & ORIENTATION",
                }
              : t === "unsupported"
                ? { code: "unsupported", on: !1, msg: "NO TILT SENSOR \u2014 TOUCH PADS ON", detail: "" }
                : t === "pending"
                  ? { code: "pending", on: !1, msg: "WAITING FOR MOTION PERMISSION\u2026", detail: "" }
                  : t === "granted"
                    ? { code: "nodata", on: !1, msg: "WAITING FOR TILT DATA\u2026", detail: "" }
                    : { code: "off", on: !1, msg: "TILT OFF \u2014 TAP ENABLE TILT", detail: "" }
      : { code: "insecure", on: !1, msg: "TILT NEEDS A SECURE (HTTPS) PAGE", detail: "TOUCH PADS ON" };
  }
  function U() {
    return 28 - (v(+m.get("tiltSens", 5) || 5, 1, 10) - 1) * 2;
  }
  function K() {
    return e.active && m.get("steerMode", "auto") !== "pads";
  }
  const ft = '"Avenir Next Condensed","Futura","Arial Narrow","DejaVu Sans Condensed",sans-serif',
    W = {
      accel: '<path d="M12 3 L21 13 H15.5 V21 H8.5 V13 H3 Z"/>',
      brake: '<path d="M12 21 L3 11 H8.5 V3 H15.5 V11 H21 Z"/>',
      boost: '<path d="M14 2 L5 13.5 H11 L9 22 L19 9.5 H13 Z"/>',
      pause: '<path d="M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z"/>',
      left: '<path d="M2 12 L14 2 V8 H22 V16 H14 V22 Z"/>',
      right: '<path d="M22 12 L10 2 V8 H2 V16 H10 V22 Z"/>',
    },
    q = { accel: "#46f5a8", brake: "#ff5468", boost: "#ffd23c", pause: "#c9b8ff", left: "#5ef0ff", right: "#5ef0ff" },
    _ = { accel: "ACCEL", brake: "BRAKE", boost: "BOOST", pause: "", left: "", right: "" };
  function ht(t, n) {
    return (
      '<svg class="ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g transform="translate(0.9 1.1)" fill="#090418" opacity=".85">' +
      W[t] +
      '</g><g fill="' +
      n +
      '" stroke="rgba(255,255,255,.55)" stroke-width=".6" stroke-linejoin="round">' +
      W[t] +
      "</g></svg>"
    );
  }
  function gt() {
    const t = "polygon(22% 0,100% 0,100% 100%,22% 100%,0 50%)",
      n = "polygon(0 0,78% 0,100% 50%,78% 100%,0 100%)",
      o = "polygon(14% 0,100% 0,86% 100%,0 100%)";
    return `
#pgp-ctl{position:absolute;inset:0;z-index:5;display:none;pointer-events:none;touch-action:none;
 -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;
 --sl:env(safe-area-inset-left,0px);--sr:env(safe-area-inset-right,0px);--st:env(safe-area-inset-top,0px);--sb:env(safe-area-inset-bottom,0px);
 --ml:max(14px,var(--sl));--mr:max(14px,var(--sr));--mb:max(14px,calc(var(--sb) + 4px));--mt:max(6px,var(--st));
 --gap:12px;font-family:${ft}}
#pgp-ctl.race{display:block;pointer-events:auto}
#pgp-ctl *{pointer-events:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.pgp-btn{position:absolute;box-sizing:border-box;opacity:.8;filter:drop-shadow(0 0 4px var(--c));
 transition:transform 45ms linear,opacity 45ms linear;will-change:transform}
.pgp-btn .face,.pgp-btn .inner{position:absolute;border-radius:50%}
.pgp-btn .face{inset:0;background:linear-gradient(160deg,#fff 0%,var(--c) 38%,var(--c) 62%,rgba(0,0,0,.35) 100%)}
.pgp-btn .inner{inset:3px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;
 background:radial-gradient(ellipse at 50% 18%,rgba(120,80,220,.55) 0%,rgba(36,16,90,.62) 45%,rgba(8,3,26,.72) 100%)}
.pgp-btn .inner::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--c);opacity:0;transition:opacity 45ms linear}
.pgp-btn .inner::after{content:"";position:absolute;left:12%;right:12%;top:5%;height:34%;border-radius:50%;
 background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0))}
.pgp-btn .ico{position:relative;z-index:1;width:46%;height:46%;display:block}
.pgp-btn .lbl{position:relative;z-index:1;font-style:italic;font-weight:800;font-size:13px;letter-spacing:1px;line-height:1;
 color:#fff;text-shadow:0 1px 0 #090418,0 0 4px var(--c)}
.pgp-left .face,.pgp-left .inner{border-radius:0;clip-path:${t};-webkit-clip-path:${t}}
.pgp-right .face,.pgp-right .inner{border-radius:0;clip-path:${n};-webkit-clip-path:${n}}
.pgp-pause .face,.pgp-pause .inner{border-radius:0;clip-path:${o};-webkit-clip-path:${o}}
.pgp-left .inner,.pgp-right .inner{inset:3px 4px}
.pgp-left .ico,.pgp-right .ico{width:44%;height:52%}
.pgp-pause .ico{width:auto;height:62%}
.pgp-btn.on{transform:scale(.92) translateY(2px);opacity:1;filter:drop-shadow(0 0 10px var(--c)) brightness(1.25)}
.pgp-btn.on .inner::before{opacity:.45}
.pgp-boost.dim{opacity:.4;filter:none}
.pgp-boost.ready{animation:pgpPulse .6s ease-in-out infinite alternate}
@keyframes pgpPulse{to{filter:drop-shadow(0 0 12px var(--c)) brightness(1.35)}}
.pgp-btn.hide{display:none}
/* ---- touch-pad layout (default): corners = steer pads, actions stacked above them ---- */
#pgp-ctl{--P:clamp(96px,29vh,128px);--Ph:clamp(70px,21vh,92px);--D:clamp(62px,19vh,84px);--E:clamp(52px,16vh,70px);--A:clamp(84px,25.5vh,112px)}
.pgp-left,.pgp-right{width:var(--P);height:var(--Ph);bottom:var(--mb)}
.pgp-left{left:var(--ml)}
.pgp-right{right:var(--mr)}
.pgp-brake{width:var(--D);height:var(--D);left:calc(var(--ml) + (var(--P) - var(--D)) / 2);bottom:calc(var(--mb) + var(--Ph) + var(--gap))}
.pgp-boost{width:var(--E);height:var(--E);left:calc(var(--ml) + (var(--P) - var(--E)) / 2);bottom:calc(var(--mb) + var(--Ph) + var(--D) + 2 * var(--gap))}
.pgp-accel{width:var(--A);height:var(--A);right:calc(var(--mr) + (var(--P) - var(--A)) / 2);bottom:calc(var(--mb) + var(--Ph) + var(--gap))}
.pgp-pause{width:56px;height:30px;left:50%;top:var(--mt);margin-left:-28px;opacity:.62}
/* ---- tilt layout: no pads, everything drops into the corners ---- */
#pgp-ctl.tilt{--D:clamp(74px,22vh,100px);--E:clamp(58px,18vh,80px);--A:clamp(100px,30vh,136px)}
#pgp-ctl.tilt .pgp-left,#pgp-ctl.tilt .pgp-right{display:none}
#pgp-ctl.tilt .pgp-brake{left:var(--ml);bottom:var(--mb)}
#pgp-ctl.tilt .pgp-boost{left:calc(var(--ml) + (var(--D) - var(--E)) / 2);bottom:calc(var(--mb) + var(--D) + var(--gap))}
#pgp-ctl.tilt .pgp-accel{right:var(--mr);bottom:var(--mb)}
#pgp-safe-probe{position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;
 padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
`;
  }
  function b(t) {
    const n = document.createElement("div");
    ((n.className = "pgp-btn pgp-" + t),
      n.style.setProperty("--c", q[t]),
      (n.innerHTML =
        '<div class="face"></div><div class="inner">' + ht(t, q[t]) + (_[t] ? '<span class="lbl">' + _[t] + "</span>" : "") + "</div>"),
      e.ctl.appendChild(n),
      (e.els[t] = n));
  }
  function $() {
    e.rects = {};
    for (const t of S) {
      const n = e.els[t];
      if (!n) continue;
      const o = n.getBoundingClientRect();
      o.width > 0 &&
        o.height > 0 &&
        (e.rects[t] = {
          l: o.left,
          t: o.top,
          r: o.right,
          b: o.bottom,
          cx: (o.left + o.right) / 2,
          cy: (o.top + o.bottom) / 2,
          hw: o.width / 2,
          hh: o.height / 2,
        });
    }
    e.rectsDirty = !1;
  }
  const E = [
    ["accel", "right"],
    ["brake", "left"],
  ];
  function mt(t, n, o, r) {
    return t && n >= t.l - r && n <= t.r + r && o >= t.t - r && o <= t.b + r;
  }
  function D(t, n) {
    let o = null,
      r = 1 / 0;
    for (const a in e.rects) {
      const i = e.rects[a];
      if (!mt(i, t, n, a === "pause" ? 8 : 14)) continue;
      const c = (t - i.cx) / i.hw,
        d = (n - i.cy) / i.hh,
        h = c * c + d * d;
      h < r && ((r = h), (o = a));
    }
    return o;
  }
  function vt(t, n) {
    for (let o = 0; o < E.length; o++) {
      const r = e.rects[E[o][0]],
        a = e.rects[E[o][1]];
      if (!r || !a) continue;
      const i = Math.min(r.b, a.b),
        s = Math.max(r.t, a.t),
        c = Math.min(i, s) - 6,
        d = Math.max(i, s) + 6,
        h = Math.max(r.l, a.l) - 6,
        f = Math.min(r.r, a.r) + 6;
      if (n >= c && n <= d && t >= h && t <= f) return E[o];
    }
    return null;
  }
  function bt() {
    try {
      navigator.vibrate && navigator.vibrate(8);
    } catch {}
  }
  function R() {
    const t = { accel: !1, brake: !1, boost: !1, pause: !1, left: !1, right: !1 };
    for (const n of e.touches.values()) {
      const o = vt(n.x, n.y);
      if (o) {
        t[o[0]] = t[o[1]] = !0;
        continue;
      }
      let r = D(n.x, n.y);
      (r === "pause" && n.start !== "pause" && (r = null), r && (t[r] = !0));
    }
    for (const n of S) {
      if (t[n] === e.held[n]) continue;
      ((e.held[n] = t[n]), t[n] && (n === "boost" && (e.edge.boost = !0), n === "pause" && (e.edge.pause = !0), bt()));
      const o = e.els[n];
      o && o.classList.toggle("on", t[n]);
    }
  }
  function j() {
    e.touches.clear();
    for (const t of S) ((e.held[t] = !1), e.els[t] && e.els[t].classList.remove("on"));
    ((e.edge.boost = e.edge.pause = !1), (e.padSteer = 0), (e.padHold = 0));
  }
  function yt(t) {
    (t.cancelable && t.preventDefault(), (e.lastTouchT = l()));
    const n = t.type,
      o = n === "touchend" || n === "touchcancel";
    n === "touchstart" && e.rectsDirty && $();
    const r = t.changedTouches || [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a];
      if (o) {
        e.touches.delete(i.identifier);
        continue;
      }
      let s = e.touches.get(i.identifier);
      (s || ((s = { x: 0, y: 0, start: null }), e.touches.set(i.identifier, s)),
        (s.x = i.clientX),
        (s.y = i.clientY),
        (n === "touchstart" || s.start === null) && (s.start = D(s.x, s.y) || ""));
    }
    if (t.touches) {
      const a = new Set();
      for (let i = 0; i < t.touches.length; i++) a.add(t.touches[i].identifier);
      for (const i of Array.from(e.touches.keys())) typeof i == "number" && !a.has(i) && e.touches.delete(i);
    }
    R();
  }
  function wt(t) {
    if (t.pointerType === "touch") return;
    const n = t.type;
    if (n === "pointerdown") {
      (t.cancelable && t.preventDefault(),
        e.rectsDirty && $(),
        e.touches.set("m" + t.pointerId, { x: t.clientX, y: t.clientY, start: D(t.clientX, t.clientY) || "" }));
      try {
        e.ctl.setPointerCapture(t.pointerId);
      } catch {}
    } else if (n === "pointermove") {
      const o = e.touches.get("m" + t.pointerId);
      if (!o) return;
      ((o.x = t.clientX), (o.y = t.clientY));
    } else e.touches.delete("m" + t.pointerId);
    R();
  }
  function St() {
    return g.Render && g.Render.ctx && g.Render.ctx.canvas ? g.Render.ctx.canvas : e.root ? e.root.querySelector("canvas") : null;
  }
  function J(t, n) {
    const o = St();
    let r = t,
      a = n;
    if (o) {
      const i = o.getBoundingClientRect(),
        s = g.Render,
        c = s && s.W > 0 ? s.W : o.width,
        d = s && s.H > 0 ? s.H : o.height;
      i.width > 0 && i.height > 0 && ((r = ((t - i.left) * c) / i.width), (a = ((n - i.top) * d) / i.height));
    }
    for (const i of e.tapFns.slice())
      try {
        i(r, a);
      } catch (s) {
        console.warn("[input] tap handler", s);
      }
  }
  function Et(t) {
    const n = l();
    e.lastTouchT = n;
    const o = t.changedTouches || [];
    for (let r = 0; r < o.length; r++) {
      const a = o[r];
      e.tapStarts.set(a.identifier, { x: a.clientX, y: a.clientY, t: n, mode: e.mode, moved: !1 });
    }
  }
  function xt(t) {
    const n = t.changedTouches || [];
    for (let o = 0; o < n.length; o++) {
      const r = e.tapStarts.get(n[o].identifier);
      r && Math.hypot(n[o].clientX - r.x, n[o].clientY - r.y) > 28 && (r.moved = !0);
    }
  }
  function Q(t) {
    const n = l();
    e.lastTouchT = n;
    let o = !1;
    const r = t.changedTouches || [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a],
        s = e.tapStarts.get(i.identifier);
      (e.tapStarts.delete(i.identifier),
        !(t.type !== "touchcancel" && s && s.mode === "menu" && e.mode === "menu" && tt(s, i.clientX, i.clientY, n)) &&
          (t.type === "touchcancel" ||
            !s ||
            s.moved ||
            s.mode !== "menu" ||
            e.mode !== "menu" ||
            n - s.t > 1500 ||
            Math.hypot(i.clientX - s.x, i.clientY - s.y) > 28 ||
            ((o = !0), J(i.clientX, i.clientY))));
    }
    o && t.cancelable && t.preventDefault();
  }
  function tt(t, n, o, r) {
    const a = n - t.x,
      i = o - t.y;
    if (Math.abs(a) < 44 || Math.abs(a) < Math.abs(i) * 1.4 || r - t.t > 900) return !1;
    const s = a > 0 ? 1 : -1;
    for (const c of e.swipeFns.slice())
      try {
        c(s);
      } catch (d) {
        console.warn("[input] swipe handler", d);
      }
    return !0;
  }
  function kt(t) {
    l() - e.lastTouchT < 800 || t.button !== 0 || (e.mouseDown = { x: t.clientX, y: t.clientY, mode: e.mode, t: l() });
  }
  function Tt(t) {
    if (l() - e.lastTouchT < 800) return;
    const n = e.mouseDown;
    ((e.mouseDown = null),
      !(!n || n.mode !== "menu" || e.mode !== "menu") &&
        (tt(n, t.clientX, t.clientY, l()) || Math.hypot(t.clientX - n.x, t.clientY - n.y) > 14 || J(t.clientX, t.clientY)));
  }
  const et = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "accel",
      x: "accel",
      X: "accel",
      ArrowDown: "brake",
      z: "brake",
      Z: "brake",
      a: "leanL",
      A: "leanL",
      s: "leanR",
      S: "leanR",
    },
    Mt = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      Enter: "ok",
      " ": "ok",
      x: "ok",
      X: "ok",
      Escape: "back",
      Backspace: "back",
      z: "back",
      Z: "back",
    };
  function Lt(t) {
    if (t.metaKey || t.ctrlKey || t.altKey) return;
    const n = t.key;
    if (e.mode === "race") {
      const r = et[n];
      if (r) {
        ((e.keys[r] = !0), t.preventDefault());
        return;
      }
      if (n === " " || n === "Spacebar") {
        (t.repeat || (e.edge.boost = !0), t.preventDefault());
        return;
      }
      (n === "Escape" || n === "p" || n === "P") && (t.repeat || (e.edge.pause = !0), t.preventDefault());
      return;
    }
    const o = Mt[n];
    if (o && (t.preventDefault(), !(t.repeat && (o === "ok" || o === "back"))))
      for (const r of e.keyFns.slice())
        try {
          r(o, t);
        } catch (a) {
          console.warn("[input] key handler", a);
        }
  }
  function It(t) {
    const n = et[t.key];
    n && (e.keys[n] = !1);
  }
  function Ot() {
    ((e.keys = {}), j());
  }
  function x() {
    const t = K() ? "tilt" : "pads";
    t !== e.layout &&
      ((e.layout = t),
      (u.layout = t),
      e.ctl && (e.ctl.classList.toggle("pads", t === "pads"), e.ctl.classList.toggle("tilt", t === "tilt")),
      (e.rectsDirty = !0),
      e.touches.clear(),
      R());
  }
  function N() {
    if (e.probe)
      try {
        const n = getComputedStyle(e.probe);
        e.safe = {
          t: parseFloat(n.paddingTop) || 0,
          r: parseFloat(n.paddingRight) || 0,
          b: parseFloat(n.paddingBottom) || 0,
          l: parseFloat(n.paddingLeft) || 0,
        };
      } catch {}
    const t = e.root ? e.root.getBoundingClientRect() : null;
    ((e.rootW = (t && t.width) || window.innerWidth || 1), (e.rootH = (t && t.height) || window.innerHeight || 1));
  }
  function P() {
    ((e.rectsDirty = !0), N(), setTimeout(N, 250));
  }
  const u = (g.Input = {
    tiltActive: !1,
    get inFrame() {
      return y();
    },
    get standalone() {
      return pt();
    },
    layout: "pads",
    tiltDeg: 0,
    tiltSteer: 0,
    motionState: "unknown",
    init(t) {
      if (((e.root = t || document.body), !document.getElementById("pgp-ctl-style"))) {
        const a = document.createElement("style");
        ((a.id = "pgp-ctl-style"), (a.textContent = gt()), document.head.appendChild(a));
      }
      const n = (e.ctl = document.createElement("div"));
      ((n.id = "pgp-ctl"), e.root.appendChild(n), b("left"), b("right"), b("brake"), b("boost"), b("accel"), b("pause"));
      const o = (e.probe = document.createElement("div"));
      ((o.id = "pgp-safe-probe"), document.body.appendChild(o));
      const r = { passive: !1 };
      (["touchstart", "touchmove", "touchend", "touchcancel"].forEach((a) => n.addEventListener(a, yt, r)),
        ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach((a) => n.addEventListener(a, wt, r)),
        n.addEventListener("contextmenu", (a) => a.preventDefault()),
        e.root.addEventListener("touchstart", Et, { passive: !0 }),
        e.root.addEventListener("touchmove", xt, { passive: !0 }),
        e.root.addEventListener("touchend", Q, r),
        e.root.addEventListener("touchcancel", Q, r),
        e.root.addEventListener("mousedown", kt),
        e.root.addEventListener("mouseup", Tt),
        e.root.addEventListener("dblclick", (a) => a.preventDefault()),
        window.addEventListener("keydown", Lt),
        window.addEventListener("keyup", It),
        window.addEventListener("blur", Ot),
        window.addEventListener("resize", P),
        window.addEventListener("orientationchange", P));
      try {
        screen.orientation && screen.orientation.addEventListener && screen.orientation.addEventListener("change", P);
      } catch {}
      (window.addEventListener("touchend", Z, !0),
        window.addEventListener("click", Z, !0),
        O(),
        N(),
        (e.layout = ""),
        x(),
        u.setMode(e.mode));
    },
    requestMotion() {
      O();
      const t = window.DeviceOrientationEvent,
        n = window.DeviceMotionEvent,
        o = (a) => ((e.motionState = u.motionState = a), a),
        r = [];
      if (
        (t && typeof t.requestPermission == "function" && r.push(t),
        n && typeof n.requestPermission == "function" && n !== t && r.push(n),
        A() || (e.why = "insecure"),
        r.length)
      ) {
        const a = r.map((i) => {
          try {
            return Promise.resolve(i.requestPermission());
          } catch (s) {
            return Promise.reject(s);
          }
        });
        return (
          (e.motionState = u.motionState = "pending"),
          Promise.all(
            a.map((i) =>
              i.then(
                (s) => (s === "granted" ? "granted" : "denied"),
                (s) => "error:" + ((s && s.name) || "Error"),
              ),
            ),
          ).then((i) =>
            i.indexOf("granted") >= 0
              ? ((e.retryGesture = !1), lt(), O(), dt(), o("granted"))
              : i.indexOf("denied") >= 0
                ? ((e.retryGesture = !1), o("denied"))
                : ((e.retryGesture = !y() || e.gestureRetries < 2), o(y() ? "blocked" : "needtap")),
          )
        );
      }
      return !t && !n
        ? Promise.resolve(o("unsupported"))
        : new Promise((a) => {
            if (e.have) {
              a(o("granted"));
              return;
            }
            const i = l(),
              s = setInterval(() => {
                e.have
                  ? (clearInterval(s), a(o("granted")))
                  : l() - i > 1e3 && (clearInterval(s), a(o(y() ? "blocked" : A() ? "unsupported" : "insecure")));
              }, 50);
          });
    },
    calibrate() {
      const t = e.have ? v(e.raw, -60, 60) : 0;
      return ((e.filt = e.raw), m.set("tiltNeutral", t), (e.leanOn = 0), t);
    },
    setMode(t) {
      ((e.mode = t === "race" ? "race" : "menu"),
        e.ctl && e.ctl.classList.toggle("race", e.mode === "race"),
        j(),
        (e.rectsDirty = !0),
        x());
    },
    get mode() {
      return e.mode;
    },
    poll(t) {
      const n = l();
      let o = t ?? (e.lastPoll ? (n - e.lastPoll) / 1e3 : 1 / 60);
      ((e.lastPoll = n), (o = v(o, 0, 0.1)));
      const r = e.have && n - e.lastEvt < (e.active ? 2e3 : 1e3);
      if ((r !== e.active && ((e.active = r), (u.tiltActive = r)), x(), e.have)) {
        const rt = e.raw - e.filt,
          At = Math.abs(rt) > 6 ? 0.022 : 0.04;
        e.filt += rt * (1 - Math.exp(-o / At));
      }
      let a = e.filt - (+m.get("tiltNeutral", 0) || 0);
      (m.get("tiltInvert", !1) && (a = -a), (u.tiltDeg = a));
      const i = U(),
        s = Math.abs(a),
        c = s <= L ? 0 : Math.min(1, (s - L) / (0.92 * i - L)),
        d = Math.min(1, c * (0.62 + 0.38 * c) + 0.06 * c * c * c),
        h = a < 0 ? -d : d;
      (e.leanOn === 0 ? s >= 0.8 * i && (e.leanOn = a < 0 ? -1 : 1) : (s < 0.72 * i || (a < 0 ? -1 : 1) !== e.leanOn) && (e.leanOn = 0),
        (u.tiltSteer = h),
        (u.tiltLean = e.leanOn));
      const f = (e.held.right ? 1 : 0) - (e.held.left ? 1 : 0);
      ((e.padSteer = X(e.padSteer, f, o * (f === 0 || f * e.padSteer < 0 ? 16 : 8))), (e.padHold = f !== 0 ? e.padHold + o : 0));
      const k = (e.keys.right ? 1 : 0) - (e.keys.left ? 1 : 0);
      e.keySteer = X(e.keySteer, k, o * (k === 0 || k * e.keySteer < 0 ? 14 : 7));
      let C = 0,
        T = 0;
      f !== 0 || k !== 0 || e.padSteer !== 0 || e.keySteer !== 0
        ? ((C = v(e.padSteer + e.keySteer, -1, 1)), f !== 0 && e.padHold > 0.45 && (T = f))
        : K() && ((C = h), (T = e.leanOn));
      const nt = (e.keys.leanR ? 1 : 0) - (e.keys.leanL ? 1 : 0);
      nt && (T = nt);
      const ot = e.held.brake || !!e.keys.brake;
      let H = e.held.accel || !!e.keys.accel;
      return (
        !H && !ot && m.get("autoAccel", !1) && (H = !0),
        e.mode === "race"
          ? ((p.steer = C), (p.lean = T), (p.accel = H), (p.brake = ot), (p.boost = e.edge.boost), (p.pause = e.edge.pause))
          : ((p.steer = 0), (p.lean = 0), (p.accel = !1), (p.brake = !1), (p.boost = !1), (p.pause = !1)),
        (e.edge.boost = e.edge.pause = !1),
        p
      );
    },
    requestPause() {
      e.mode === "race" && (e.edge.pause = !0);
    },
    onTap(t) {
      typeof t == "function" && e.tapFns.push(t);
    },
    onMenuKey(t) {
      typeof t == "function" && e.keyFns.push(t);
    },
    onSwipe(t) {
      typeof t == "function" && e.swipeFns.push(t);
    },
    tiltStatus: ut,
    safeArea(t, n) {
      const o = u._safeOverride || e.safe,
        r = t / (e.rootW || t),
        a = n / (e.rootH || n);
      return { l: o.l * r, r: o.r * r, t: o.t * a, b: o.b * a };
    },
    setBoostReady(t) {
      ((t = t == null ? null : !!t),
        !(t === e.boostReady || !e.els.boost) &&
          ((e.boostReady = t), e.els.boost.classList.toggle("ready", t === !0), e.els.boost.classList.toggle("dim", t === !1)));
    },
    maxAngle: U,
    _state: e,
    _steerAngleFromUp: Y,
    _screenAngle: I,
  });
})();
