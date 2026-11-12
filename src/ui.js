/* ui.js */
(function () {
  "use strict";
  const T = (window.FZ = window.FZ || {}),
    Rt = [
      "boot",
      "title",
      "shipselect",
      "trackselect",
      "story",
      "briefing",
      "epilogue",
      "race",
      "pause",
      "results",
      "options",
      "soundtest",
      "mymusic",
      "pilots",
    ],
    Ot = [
      { id: "title", title: "TITLE" },
      { id: "race1", title: "RACE 1" },
      { id: "race2", title: "RACE 2" },
      { id: "race3", title: "RACE 3" },
      { id: "results", title: "RESULTS" },
      { id: "gameover", title: "GAME OVER" },
    ],
    xe = [
      "select",
      "confirm",
      "back",
      "countdown",
      "go",
      "boost",
      "dash",
      "boostReady",
      "lap",
      "finalLap",
      "wallHit",
      "shipHit",
      "overtake",
      "explode",
      "finish",
      "pause",
    ],
    Pt = [
      {
        id: 0,
        name: "NOVA",
        pilot: "\u2014",
        glow: 8058623,
        stats: { shield: "C", accel: "C", top: "C", turn: "C", boost: "C" },
        weight: 1200,
        blurb: "",
      },
    ],
    Ye = [
      ["shield", "SHIELD"],
      ["accel", "ACCEL"],
      ["top", "TOP SPEED"],
      ["turn", "TURNING"],
      ["boost", "BOOST"],
    ],
    Nt = { A: 5, B: 4, C: 3, D: 2, E: 1 },
    Ee = [
      ["easy", "EASY", "#46f5a8"],
      ["normal", "NORMAL", "#5ef0ff"],
      ["hard", "HARD", "#ff4058"],
    ],
    ye = () => {
      const e = z.get("difficulty", "normal");
      return Ee.some((t) => t[0] === e) ? e : "normal";
    },
    _e = () => {
      const e = +z.get("assist", 0.6);
      return isFinite(e) ? ae(e, 0, 1) : 0.6;
    },
    s = {
      hooks: {},
      screen: "boot",
      data: null,
      prev: null,
      enterT: -1,
      pendingEnter: !0,
      items: [],
      focus: 0,
      focusVisible: !1,
      flashId: null,
      flashT: -1e9,
      toast: "",
      toastT: -1e9,
      t: 0,
      W: 782,
      H: 360,
      playing: null,
      portrait: !1,
      logo: null,
      prevScreenForBack: "title",
      tapLockUntil: 0,
      ship: 0,
      shipDir: 0,
      shipChangeT: -1e9,
      enterWall: 0,
      trk: 0,
      tmaps: {},
      br: null,
      ep: null,
      rect: { x: 0, y: 0, w: 0, h: 0 },
    },
    W = () => (T.HUD && T.HUD.kit) || null,
    z = {
      get: (e, t) => {
        try {
          return T.Settings ? T.Settings.get(e, t) : t;
        } catch {
          return t;
        }
      },
      set: (e, t) => {
        try {
          T.Settings && T.Settings.set(e, t);
        } catch {}
      },
    };
  function te(e) {
    const t = T.Audio;
    if (!t || typeof t[e] != "function") return;
    const n = Array.prototype.slice.call(arguments, 1);
    try {
      return t[e].apply(t, n);
    } catch (i) {
      console.warn("[ui] audio." + e, i);
    }
  }
  const O = (e) => te("sfx", e);
  function ne(e, t, n) {
    const i = s.hooks && s.hooks[e];
    if (typeof i == "function")
      try {
        arguments.length > 2 ? i(t, n) : arguments.length > 1 ? i(t) : i();
      } catch (l) {
        console.warn("[ui] hook " + e, l);
      }
  }
  const K = () => (window.performance && performance.now ? performance.now() : Date.now()),
    ae = (e, t, n) => (e < t ? t : e > n ? n : e),
    de = (e, t) => Math.floor(e * t * 2) % 2 === 0,
    et = () => (K() - s.enterWall) / 1e3,
    fe = (e) => 1 - Math.pow(1 - ae(e, 0, 1), 3),
    Oe = (e) => (typeof e == "number" ? "#" + ("000000" + ((e >>> 0) & 16777215).toString(16)).slice(-6) : e || "#5ef0ff");
  function ie(e, t) {
    ((s.toast = e), (s.toastT = K() / 1e3), (s.toastDur = t || 1.8));
  }
  const M = {
    ink: "#090418",
    cyan: "#5ef0ff",
    magenta: "#ff4fd8",
    pink: "#ff8ae8",
    amber: "#ffb43c",
    yellow: "#ffe45c",
    green: "#46f5a8",
    red: "#ff4058",
    grey: "#a49ad0",
    violet: "#8a7cd8",
  };
  function d(e, t, n, i, l, o, r, c, a) {
    const f = W();
    return f ? f.T(e, t, n, i, l, o, r, c, a) : 0;
  }
  function re(e, t, n, i, l, o, r, c) {
    const a = W();
    return a ? a.N(e, t, n, i, l, o, r, c) : 0;
  }
  function pe(e, t, n) {
    const i = W();
    return i ? i.tw(e, t, n) : String(e).length * t * 0.5;
  }
  function ee(e, t, n, i, l, o, r, c) {
    const a = W();
    a && a.panel(e, t, n, i, l, o, r, c);
  }
  function X(e, t, n, i, l, o) {
    const r = W();
    r && r.slant(e, t, n, i, l, o);
  }
  function ce() {
    try {
      if (T.Input && T.Input.safeArea) {
        const e = T.Input.safeArea(s.Wd || s.W, s.Hd || s.H),
          t = s.k || 1;
        return { l: e.l / t, r: e.r / t, t: e.t / t, b: e.b / t };
      }
    } catch {}
    return { l: 0, r: 0, t: 0, b: 0 };
  }
  function ke() {
    return Array.isArray(T.SHIPS) && T.SHIPS.length ? T.SHIPS : Pt;
  }
  function Pe() {
    try {
      if (T.Input && T.Input.tiltStatus) return T.Input.tiltStatus();
    } catch {}
    return { code: "off", on: !1, msg: "", detail: "" };
  }
  const P = { dim: null, top: null, bot: null, a: 0, h: 0, ca: -1, ch: -1, ok: null, ctx: null };
  function Dt(e) {
    if (P.ok !== null && P.ctx === e) return P.ok;
    ((P.ctx = e), (P.ok = !1));
    try {
      const t = e.canvas,
        n = t && t.parentNode;
      if (!n || !n.insertBefore || typeof document > "u") return !1;
      const i = (l) => {
        const o = document.createElement("div");
        return (
          o.setAttribute("aria-hidden", "true"),
          (o.style.cssText = "position:absolute;left:0;right:0;pointer-events:none;z-index:1;display:none;" + l),
          n.insertBefore(o, t),
          o
        );
      };
      ((P.dim = i("top:0;bottom:0;")),
        (P.top = i("top:0;background:linear-gradient(to bottom,rgba(6,2,20,0.92),rgba(6,2,20,0));")),
        (P.bot = i("bottom:0;background:linear-gradient(to top,rgba(6,2,20,0.92),rgba(6,2,20,0));")),
        (P.ca = P.ch = -1),
        (P.ok = !0));
    } catch {
      P.ok = !1;
    }
    return P.ok;
  }
  function vt() {
    if (
      P.ok &&
      (P.a !== P.ca &&
        ((P.ca = P.a),
        P.a > 0
          ? ((P.dim.style.background = "rgba(8,2,26," + P.a + ")"), (P.dim.style.display = "block"))
          : (P.dim.style.display = "none")),
      P.h !== P.ch)
    )
      if (((P.ch = P.h), P.h > 0)) {
        const e = (P.h / 360) * 100 + "%";
        ((P.top.style.height = e), (P.bot.style.height = e), (P.top.style.display = "block"), (P.bot.style.display = "block"));
      } else ((P.top.style.display = "none"), (P.bot.style.display = "none"));
  }
  function tt(e) {
    return s.screen !== "pause" && Dt(e);
  }
  function se(e, t, n, i) {
    if (tt(e)) {
      P.a = i;
      return;
    }
    ((e.fillStyle = "rgba(8,2,26," + i + ")"), e.fillRect(0, 0, t, n));
  }
  function le(e, t, n, i) {
    if (tt(e)) {
      P.h = i;
      return;
    }
    const l = W();
    ((e.fillStyle = l.gradV(e, "LBT", 0, i)),
      e.fillRect(0, 0, t, i),
      (e.fillStyle = l.gradV(e, "LBB", n - i, n)),
      e.fillRect(0, n - i, t, i));
  }
  function Ut() {
    const e = W();
    !e ||
      e.STOPS.LBT ||
      ((e.STOPS.LBT = [
        [0, "rgba(6,2,20,0.92)"],
        [1, "rgba(6,2,20,0)"],
      ]),
      (e.STOPS.LBB = [
        [0, "rgba(6,2,20,0)"],
        [1, "rgba(6,2,20,0.92)"],
      ]),
      (e.STOPS.SIDE = [
        [0, "rgba(8,3,26,0.0)"],
        [1, "rgba(8,3,26,0.0)"],
      ]),
      (e.STY.logoP = { grad: "CHROME", glow: "#ff3cd0", lw: 0.12, hq: !0 }),
      (e.STY.logoG = { grad: "GOLD", glow: "#ff7a1c", lw: 0.14, hq: !0 }),
      (e.STY.logoW = { color: "#ffffff", stroke: !1, hq: !0 }),
      (e.STY.btn = { color: "#f6f2ff" }),
      (e.STY.btnHot = { color: "#1a0830", stroke: "rgba(255,255,255,0.6)", lw: 0.1 }));
  }
  function Gt() {
    const e = W(),
      t = (function () {
        try {
          const p = s.ctx.getTransform();
          return Math.max(1, Math.min(4, Math.hypot(p.a, p.b)));
        } catch {
          return 2;
        }
      })(),
      n = 600,
      i = 150,
      l = () => {
        const p = document.createElement("canvas");
        ((p.width = Math.ceil(n * t)), (p.height = Math.ceil(i * t)));
        const g = p.getContext("2d");
        return (g.scale(t, t), [p, g]);
      },
      [o, r] = l();
    (r.save(), r.translate(n / 2, 64), r.rotate(-0.09));
    for (let p = 0; p < 3; p++)
      (r.beginPath(),
        r.ellipse(0, 0, 268 - p * 8, 30 - p * 5, 0, Math.PI * 0.94, Math.PI * 2.1),
        (r.strokeStyle = ["rgba(255,79,216,0.9)", "rgba(94,240,255,0.9)", "rgba(255,255,255,0.9)"][p]),
        (r.lineWidth = 3.2 - p),
        (r.shadowColor = p === 1 ? "#5ef0ff" : "#ff4fd8"),
        (r.shadowBlur = 10 * t),
        r.stroke());
    r.restore();
    const c = 86,
      a = 30,
      f = e.sprite("PLASMA", c, "logoP"),
      b = n / 2 - f.w / 2 - f.ox;
    r.drawImage(f.c, b, 78 - f.oy, f.cw, f.ch);
    const u = e.tw("GRAND PRIX", a, "logoG"),
      h = n / 2 - u / 2,
      w = 120;
    ((r.fillStyle = "rgba(12,4,34,0.85)"),
      X(r, h - 26, w - 28, u + 52, 36, 12),
      r.fill(),
      (r.strokeStyle = "rgba(255,180,60,0.85)"),
      (r.lineWidth = 1.5),
      r.stroke());
    const I = [M.magenta, M.cyan, M.amber];
    for (let p = 0; p < 3; p++) {
      const g = 120 - p * 26,
        y = w - 18 + p * 7;
      ((r.fillStyle = I[p]), X(r, h - 34 - g, y, g, 3, 2), r.fill(), X(r, h + u + 34, y, g, 3, 2), r.fill());
    }
    const k = e.sprite("GRAND PRIX", a, "logoG");
    r.drawImage(k.c, h - k.ox, w - k.oy, k.cw, k.ch);
    const C = e.sprite("PLASMA", c, "logoW");
    return { c: o, w: n, h: i, dpr: t, white: C, wx: n / 2 - C.w / 2 - C.ox, wy: 78 - C.oy };
  }
  function nt(e, t, n, i, l) {
    let o = s.logo;
    const r = (function () {
      try {
        const h = e.getTransform();
        return Math.max(1, Math.min(4, Math.hypot(h.a, h.b)));
      } catch {
        return 2;
      }
    })();
    ((!o || Math.abs(o.dpr - r) > 0.2) && ((s.ctx = e), (o = s.logo = Gt())), (l = l || 1));
    const c = o.w * l,
      a = o.h * l,
      f = t - c / 2;
    ((e.globalAlpha = 1), e.drawImage(o.c, f, n, c, a));
    const b = (i % 3.2) / 3.2,
      u = f + (-60 + b * (o.w + 160)) * l;
    return (
      b < 0.6 &&
        (e.save(),
        X(e, u - 18 * l, n, 26 * l, a * 0.62, 22 * l),
        e.clip(),
        (e.globalAlpha = 0.75),
        e.drawImage(o.white.c, f + o.wx * l, n + o.wy * l, o.white.cw * l, o.white.ch * l),
        e.restore()),
      a
    );
  }
  const Bt = {
      btn: { fill: "BTNHOT", color: "#ffe45c", blur: 14, lw: 1.25 },
      btnGo: { fill: "BTNGO", color: "#46f5a8", blur: 14, lw: 1.25 },
      card: { fill: "PANELHOT", color: "#ffe45c", blur: 14, lw: 2, slant: 16 },
      trk: { fill: "PANELHOT", color: "#ffe45c", blur: 16, lw: 2, slant: 16 },
      pause: { fill: "PANEL", color: "#ff4fd8", blur: 18, lw: 2, slant: 22 },
    },
    Ne = new Map();
  let Ke = 0,
    qe = 0;
  function De(e, t, n, i, l, o, r, c) {
    const a = Bt[t],
      f = W();
    if (!f) return;
    const b = f.dpr ? f.dpr() : 2,
      u = r || "";
    let h = Ne.get(t);
    h || ((h = new Map()), Ne.set(t, h));
    let w = h.get(u);
    w || ((w = new Map()), h.set(u, w));
    let I = w.get(l);
    I || ((I = new Map()), w.set(l, I));
    let k = I.get(o);
    if (!k || k.dpr !== b) {
      (Ke > 24 || qe > 24e6) &&
        (Ne.clear(), (Ke = 0), (qe = 0), (h = new Map()), Ne.set(t, h), (w = new Map()), h.set(u, w), (I = new Map()), w.set(l, I));
      const g = Math.ceil((a.blur * 1.6) / b) + 4,
        y = document.createElement("canvas");
      ((y.width = Math.ceil((l + g * 2) * b)), (y.height = Math.ceil((o + g * 2) * b)));
      const A = y.getContext("2d");
      (A.scale(b, b), (A.shadowColor = a.color), (A.shadowBlur = a.blur));
      const E = f.pauseSink ? f.pauseSink() : null;
      (ee(A, g, g, l, o, a.fill, r || null, { slant: c ?? a.slant, lw: a.lw }),
        f.resumeSink && f.resumeSink(E),
        (k = { c: y, pad: g, dpr: b, cw: y.width / b, ch: y.height / b }),
        I.set(o, k),
        Ke++,
        (qe += y.width * y.height * 4));
    }
    const C = (g) => Math.round(g * b) / b;
    e.drawImage(k.c, C(n - k.pad), C(i - k.pad), k.cw, k.ch);
    const p = W();
    p && p.mark && p.mark(n - k.pad, i - k.pad, k.cw, k.ch);
  }
  function G(e) {
    return (s.items.push(e), e);
  }
  function Ft(e, t) {
    for (let n = s.items.length - 1; n >= 0; n--) {
      const i = s.items[n];
      if (i.disabled) continue;
      const l = i.pad != null ? i.pad : 4;
      if (e >= i.x - l && e <= i.x + i.w + l && t >= i.y - l && t <= i.y + i.h + l) return i;
    }
    return null;
  }
  function Xe() {
    return s.items.filter((e) => !e.disabled && !e.noFocus);
  }
  function Se(e) {
    return s.focusVisible && Xe()[s.focus] === e;
  }
  function q(e, t, n, i) {
    i = i || {};
    const l = Se(t),
      o = s.flashId === t.id && n - s.flashT < 0.18,
      r = l || o,
      c = Math.min(14, t.h * 0.45);
    (r && De(e, i.go ? "btnGo" : "btn", t.x, t.y, t.w, t.h, null, c),
      ee(
        e,
        t.x,
        t.y,
        t.w,
        t.h,
        o ? "#ffffff" : r ? (i.go ? "BTNGO" : "BTNHOT") : i.fill || (i.go ? "BTNGO" : "BTN"),
        r ? "#ffffff" : i.edge || (i.go ? "#b8ffdc" : "rgba(255,79,216,0.85)"),
        { slant: c, lw: 1.5 },
      ),
      !r &&
        !i.go &&
        ((e.fillStyle = "rgba(255,255,255,0.10)"), X(e, t.x + c * 0.5 + 2, t.y + 2, t.w - c - 4, t.h * 0.38, c * 0.35), e.fill()));
    const a = i.size || Math.round(t.h * 0.56);
    if (r) {
      const f = de(n, 3) ? 2 : 0;
      (it(e, t.x - 8 - f, t.y + t.h / 2, -1), it(e, t.x + t.w + 8 + f, t.y + t.h / 2, 1));
    }
    d(e, t.label, t.x + t.w / 2, t.y + t.h / 2 + a * 0.36, a, r || i.go ? "btnHot" : "btn", "center");
  }
  function it(e, t, n, i) {
    e.fillStyle = M.yellow;
    for (let l = 0; l < 2; l++) {
      const o = t + i * l * 7;
      (e.beginPath(),
        e.moveTo(o - i * 6, n - 7),
        e.lineTo(o, n),
        e.lineTo(o - i * 6, n + 7),
        e.lineTo(o - i * 3, n),
        e.closePath(),
        e.fill());
    }
  }
  function st(e, t, n, i, l) {
    const o = Se(t),
      r = s.flashId === t.id && n - s.flashT < 0.18,
      c = t.x + t.w / 2,
      a = t.y + t.h / 2,
      f = t.h / 2;
    (e.beginPath(),
      e.moveTo(c + i * f * 0.9, a),
      e.lineTo(c - i * f * 0.55, a - f),
      e.lineTo(c - i * f * 0.2, a),
      e.lineTo(c - i * f * 0.55, a + f),
      e.closePath(),
      (e.fillStyle = r ? "#ffffff" : o ? M.yellow : "rgba(12,4,34,0.75)"),
      e.fill(),
      (e.strokeStyle = l),
      (e.lineWidth = 2),
      e.stroke());
  }
  function me(e, t, n, i) {
    const l = pe(i, 34, "chromeG"),
      o = W();
    (o.stripes(e, t / 2 - l / 2 - 16, n - 20, -1, 90, [M.magenta, M.cyan, M.amber], 0.95),
      o.stripes(e, t / 2 + l / 2 + 16, n - 20, 1, 90, [M.magenta, M.cyan, M.amber], 0.95),
      d(e, i, t / 2, n, 34, "chromeG", "center"));
  }
  function Ht(e, t, n, i) {
    (se(e, t, n, 0.72), le(e, t, n, 50));
    const l = et(),
      o = nt(e, t / 2, 46 - Math.pow(1 - fe(l / 0.5), 2) * 60, i, 1);
    (de(i, 1.1) && d(e, "TAP TO START", t / 2, 46 + o + 52, 30, "whiteG", "center"),
      d(e, "LANDSCAPE  \u2022  TILT OR TOUCH STEERING  \u2022  SOUND ON", t / 2, n - 38, 13, "grey", "center"),
      d(e, "NEON HARBOR CIRCUIT", t / 2, n - 18, 14, "lblPink", "center"),
      G({ id: "start", x: 0, y: 0, w: t, h: n, noFocus: !0, pad: 0, onTap: lt }));
  }
  function lt() {
    te("unlock");
    let e = null;
    try {
      T.Input && T.Input.requestMotion && z.get("steerMode", "auto") !== "pads" && (e = T.Input.requestMotion());
    } catch {}
    (e &&
      e.then &&
      e.then(
        (t) => {
          if (((s.motionResult = t), t !== "granted")) {
            const n = Pe();
            n.msg && ie(n.msg, 3);
          }
        },
        () => {},
      ),
      O("confirm"),
      J("title"));
  }
  function Vt(e, t, n, i) {
    const l = Pe(),
      o = l.on
        ? "lblGreen"
        : l.code === "pads"
          ? "grey"
          : l.code === "denied" || l.code === "iframe" || l.code === "insecure"
            ? "lblGold"
            : "grey";
    return (d(e, l.msg, t / 2, n, 14, o, "center"), i && l.detail && d(e, l.detail, t / 2, n + 16, 11, "grey", "center"), l);
  }
  function zt(e, t, n, i) {
    le(e, t, n, 60);
    const l = et(),
      o = 18 - Math.pow(1 - fe(l / 0.4), 2) * 120;
    nt(e, t / 2, o, i, 0.9);
    const r = [
        ["race", "RACE"],
        ["story", "STORY"],
        ["pilots", "PILOTS"],
        ["options", "OPTIONS"],
        ["soundtest", "SOUND TEST"],
      ],
      c = 220,
      a = 30,
      f = 5,
      b = 142;
    for (let h = 0; h < r.length; h++) {
      const w = Math.pow(1 - fe((l - 0.05 * h) / 0.3), 2) * (h % 2 ? 1 : -1) * t * 0.6,
        I = G({ id: r[h][0], label: r[h][1], x: Math.round(t / 2 - c / 2 + w), y: b + h * (a + f), w: c, h: a, onTap: Yt });
      q(e, I, i, h < 2 ? { go: !1, size: 20 } : { size: 17 });
    }
    Vt(e, t, n - 26, !0);
    const u = ce();
    d(e, "v3 \xB7 ORIGINAL GAME \xB7 2026", t - Math.max(12, u.r + 8), n - 8, 10, "dim", "right");
  }
  function Yt(e) {
    e.id === "race" ? (O("confirm"), J("shipselect")) : e.id === "story" ? (O("confirm"), J("story")) : (O("select"), J(e.id));
  }
  function Ie(e, t) {
    const n = ke().length,
      i = ((e % n) + n) % n;
    (i !== s.ship && ((s.ship = i), (s.shipDir = t || 0), (s.shipChangeT = K() / 1e3), O("select")), (B.selectedShip = s.ship));
  }
  function ot(e) {
    e !== ye() && (z.set("difficulty", e), (B.selectedDifficulty = e), O("select"));
  }
  function rt() {
    if ((O("confirm"), z.set("ship", s.ship), (B.selectedDifficulty = ye()), (B.assist = _e()), Te().length > 1)) {
      J("trackselect");
      return;
    }
    const e = Te();
    (e.length && te("prepare", e[0].id),
      ne(
        "startRace",
        s.ship,
        e.length
          ? { difficulty: B.selectedDifficulty, assist: B.assist, track: e[0].id }
          : { difficulty: B.selectedDifficulty, assist: B.assist },
      ));
  }
  function _t(e, t, n, i, l, o, r, c, a) {
    const f = Nt[o] || 3;
    d(e, l, t, n + 11, 12, "grey");
    const b = t + 78,
      u = (i - 78 - 30) / 5,
      h = fe((K() / 1e3 - s.shipChangeT - a) / 0.25);
    for (let w = 0; w < 5; w++) {
      const I = w < f * h - 0.001;
      (X(e, b + w * u, n + 1, u - 3, 12, 4),
        (e.fillStyle = I ? (w >= 4 ? "#ffffff" : r) : "rgba(60,36,120,0.55)"),
        e.fill(),
        I && ((e.fillStyle = "rgba(255,255,255,0.35)"), X(e, b + w * u + 2, n + 2, u - 7, 3, 1), e.fill()));
    }
    d(e, o, t + i - 2, n + 14, 18, f >= 5 ? "gold" : f <= 1 ? "red" : "chrome", "right");
  }
  function Kt(e, t, n, i) {
    le(e, t, n, 56);
    const l = ke(),
      o = l[s.ship] || l[0];
    B.selectedShip = s.ship;
    const r = Oe(o.glow != null ? o.glow : o.trim),
      c = ce(),
      a = Math.max(16, c.l + 10),
      f = t - Math.max(16, c.r + 10);
    me(e, t, 40, "SELECT MACHINE");
    const b = 300,
      u = a,
      h = 62,
      w = 228,
      I = K() / 1e3 - s.shipChangeT,
      k = (1 - fe(I / 0.25)) * -s.shipDir * 30;
    (ee(e, u, h, b, w, "PANEL", r, { slant: 18, lw: 1.5 }), (e.fillStyle = r), X(e, u + 14, h + 8, 6, w - 16, 2), e.fill());
    const C = fe(I / 0.2),
      p = s.ship + 1 + "/" + l.length;
    (d(e, p, u + b - 24, h + 22, 12, "grey", "right"),
      d(e, String(o.name || "SHIP").toUpperCase(), u + 30 + k, h + 48, 40, "chromeG", "left", C),
      d(e, "PILOT  " + String(o.pilot || "").toUpperCase(), u + 32 + k, h + 68, 13, "lblPink", "left", C),
      d(e, String(o.blurb || "").toUpperCase(), u + 32 + k, h + 88, 11, "soft", "left", C));
    const g = o.stats || {};
    for (let D = 0; D < Ye.length; D++) _t(e, u + 30, h + 100 + D * 22, b - 54, Ye[D][1], g[Ye[D][0]] || "C", r, i, D * 0.04);
    (d(e, "WEIGHT", u + 30, h + w - 8, 12, "grey"),
      re(e, String(o.weight || 0), u + 108, h + w - 8, 15, "white"),
      d(e, "KG", u + 112 + W().numW(String(o.weight || 0), 15, "white"), h + w - 8, 11, "grey"));
    const y = (u + b + f) / 2,
      A = 160,
      E = G({ id: "prev", x: u + b + 10, y: A - 26, w: 40, h: 52, onTap: () => Ie(s.ship - 1, -1) }),
      L = G({ id: "next", x: f - 40, y: A - 26, w: 40, h: 52, onTap: () => Ie(s.ship + 1, 1) });
    (st(e, E, i, -1, r),
      st(e, L, i, 1, r),
      G({
        id: "showcase",
        x: u + b + 56,
        y: 66,
        w: Math.max(40, f - u - b - 112),
        h: 196,
        noFocus: !0,
        pad: 0,
        onTap: () => Ie(s.ship + 1, 1),
      }));
    const m = 34,
      v = 8,
      Y = y - (l.length * (m + v) - v) / 2,
      Q = 270;
    for (let D = 0; D < l.length; D++) {
      const H = l[D],
        Z = D === s.ship,
        F = G({ id: "ship:" + D, x: Y + D * (m + v), y: Q, w: m, h: 20, noFocus: !0, onTap: () => Ie(D, D > s.ship ? 1 : -1) });
      (X(e, F.x, F.y, F.w, F.h, 7),
        (e.fillStyle = Z ? Oe(H.glow) : "rgba(12,4,34,0.75)"),
        e.fill(),
        (e.strokeStyle = Z ? "#ffffff" : Oe(H.glow)),
        (e.lineWidth = Z ? 2 : 1.2),
        e.stroke(),
        Z || ((e.fillStyle = Oe(H.glow)), X(e, F.x + 10, F.y + 7, F.w - 20, 6, 2), e.fill()));
    }
    const j = n - 50,
      _ = G({ id: "back", label: "BACK", x: a, y: j, w: 120, h: 34, onTap: () => ue() }),
      S = G({ id: "go", label: "GO!", x: f - 170, y: j - 4, w: 170, h: 42, onTap: rt });
    (q(e, _, i, { size: 17 }), q(e, S, i, { go: !0, size: 26 }));
    const R = ye();
    B.selectedDifficulty = R;
    const U = 84,
      V = 6,
      N = (a + 130 + f - 180) / 2 - (3 * U + 2 * V) / 2 + 30;
    d(e, "DIFFICULTY", N - 10, j + 22, 12, "grey", "right");
    for (let D = 0; D < Ee.length; D++) {
      const H = Ee[D],
        Z = H[0] === R,
        F = G({ id: "diff:" + H[0], x: N + D * (U + V), y: j + 3, w: U, h: 28, noFocus: !0, onTap: () => ot(H[0]) });
      (X(e, F.x, F.y, F.w, F.h, 9),
        (e.fillStyle = Z ? H[2] : "rgba(12,4,34,0.78)"),
        e.fill(),
        (e.strokeStyle = Z ? "#ffffff" : H[2]),
        (e.lineWidth = Z ? 2 : 1.2),
        e.stroke(),
        d(e, H[1], F.x + U / 2, F.y + 19, 14, Z ? "btnHot" : "white", "center"));
    }
  }
  const qt = { neon_harbor: ["PORT MERIDIAN", "NIGHT HARBOR CIRCUIT"], lunar_dome: ["SELENE", "LOW-GRAVITY DOME CIRCUIT"] };
  function Te() {
    const e = T.Track && T.Track.list;
    return Array.isArray(e) ? e : [];
  }
  function Xt(e) {
    const t = Te();
    for (let n = 0; n < t.length; n++) if (t[n].id === e) return n;
    return 0;
  }
  function je(e) {
    const t = Te();
    if (!t.length) return;
    const n = ((e % t.length) + t.length) % t.length;
    (n !== s.trk && ((s.trk = n), O("select")), (B.selectedTrack = t[n].id), te("prepare", B.selectedTrack));
  }
  function at() {
    const e = Te(),
      t = e[s.trk] ? e[s.trk].id : void 0;
    (O("confirm"), t && z.set("track", t), ne("startRace", s.ship, { difficulty: B.selectedDifficulty, assist: B.assist, track: t }));
  }
  function jt(e, t, n) {
    const i = e + "|" + t + "|" + n;
    let l = s.tmaps[i];
    if (l !== void 0) return l;
    l = null;
    let o = null;
    try {
      o = typeof s.hooks.getTrack == "function" ? s.hooks.getTrack(e) : null;
    } catch {
      o = null;
    }
    const r = o && o.path;
    if (r && r.length >= 8) {
      let c = 1 / 0,
        a = 1 / 0,
        f = -1 / 0,
        b = -1 / 0;
      for (let g = 0; g < r.length; g += 2) {
        const y = r[g],
          A = r[g + 1];
        (y < c && (c = y), y > f && (f = y), A < a && (a = A), A > b && (b = A));
      }
      const u = 8,
        h = Math.min((t - 2 * u) / Math.max(1, f - c), (n - 2 * u) / Math.max(1, b - a)),
        w = (t - (f - c) * h) / 2 - c * h,
        I = (n - (b - a) * h) / 2 - a * h,
        k = r.length / 2,
        C = Math.max(1, Math.floor(k / 260)),
        p = new Path2D();
      for (let g = 0; g <= k; g += C) {
        const y = (g % k) * 2,
          A = r[y] * h + w,
          E = r[y + 1] * h + I;
        g === 0 ? p.moveTo(A, E) : p.lineTo(A, E);
      }
      (p.closePath(), (l = { p, sx: r[0] * h + w, sy: r[1] * h + I, a: o.ang ? o.ang[0] + Math.PI / 2 : 0 }));
    }
    return ((s.tmaps[i] = l), l);
  }
  function Zt(e, t, n, i) {
    (se(e, t, n, 0.3), le(e, t, n, 56), me(e, t, 40, "SELECT CIRCUIT"));
    const l = Te(),
      o = ce(),
      r = Math.max(16, o.l + 10),
      c = t - Math.max(16, o.r + 10),
      a = Math.max(1, l.length),
      f = 18,
      b = 200,
      u = 62,
      h = Math.min(330, (c - r - f * (a - 1)) / a),
      w = t / 2 - (a * h + (a - 1) * f) / 2;
    B.selectedTrack = l[s.trk] ? l[s.trk].id : B.selectedTrack;
    for (let g = 0; g < l.length; g++) {
      const y = l[g],
        A = g === s.trk,
        E = w + g * (h + f),
        L = qt[y.id] || ["", ""],
        m = G({ id: "track:" + y.id, x: E, y: u, w: h, h: b, onTap: () => je(g) }),
        v = Se(m);
      (A
        ? De(e, "trk", E, u, h, b, M.yellow)
        : ee(e, E, u, h, b, "PANEL", v ? M.yellow : "rgba(255,79,216,0.6)", { slant: 16, lw: v ? 2 : 1.2 }),
        d(e, "CIRCUIT " + (g + 1), E + 24, u + 24, 12, A ? "lblGold" : "lbl"),
        A && d(e, "SELECTED", E + h - 24, u + 24, 12, "lblGreen", "right"));
      const Y = h - 40,
        Q = 104,
        j = E + 20,
        _ = u + 34,
        S = jt(y.id, Y | 0, Q);
      (S &&
        (e.save(),
        e.translate(j, _),
        (e.globalAlpha = A ? 1 : 0.6),
        (e.lineJoin = "round"),
        (e.lineCap = "round"),
        (e.strokeStyle = M.ink),
        (e.lineWidth = 8),
        e.stroke(S.p),
        (e.strokeStyle = A ? M.cyan : M.violet),
        (e.lineWidth = 4.5),
        e.stroke(S.p),
        (e.strokeStyle = "#f0ecff"),
        (e.lineWidth = 1.4),
        e.stroke(S.p),
        (e.strokeStyle = M.yellow),
        (e.lineWidth = 2.4),
        e.beginPath(),
        e.moveTo(S.sx - Math.cos(S.a) * 6, S.sy - Math.sin(S.a) * 6),
        e.lineTo(S.sx + Math.cos(S.a) * 6, S.sy + Math.sin(S.a) * 6),
        e.stroke(),
        e.restore()),
        d(e, String(y.name || y.id).toUpperCase(), E + h / 2, u + b - 46, 30, A ? "chromeG" : "chrome", "center"),
        d(e, L[0], E + h / 2, u + b - 26, 12, "lblPink", "center"),
        d(e, L[1], E + h / 2, u + b - 11, 11, "grey", "center"));
    }
    const I = n - 50,
      k = G({ id: "back", label: "BACK", x: r, y: I, w: 120, h: 34, onTap: () => ue() }),
      C = G({ id: "go", label: "GO!", x: c - 170, y: I - 4, w: 170, h: 42, onTap: at });
    (q(e, k, i, { size: 17 }), q(e, C, i, { go: !0, size: 26 }));
    const p = ke()[s.ship] || ke()[0];
    d(e, String(p.name || "").toUpperCase() + "   \xB7   " + ye().toUpperCase(), t / 2, I + 24, 14, "grey", "center");
  }
  const oe = () => T.Story || null,
    ve = new Map();
  function Ze(e, t, n, i) {
    const l = t + "|" + n + "|" + i + "|" + e;
    let o = ve.get(l);
    return (o || (ve.size > 200 && ve.clear(), (o = mt(e, t, n, i)), ve.set(l, o)), o);
  }
  function Je(e) {
    const t = T.HUD;
    return t && t.ordinal ? t.ordinal(e) : "";
  }
  function Ue() {
    const e = oe();
    return e && Array.isArray(e.chapters) ? e.chapters : [];
  }
  const Me = { prog: null, list: [] };
  function Qe(e) {
    const t = oe();
    let n = null;
    try {
      n = t && t.progress ? t.progress() : null;
    } catch {
      n = null;
    }
    (!n || n !== Me.prog) && ((Me.prog = n), (Me.list.length = 0));
    let i = Me.list[e];
    if (!i) {
      try {
        i = { unlocked: !!t.isUnlocked(e), cleared: !!t.isCleared(e) };
      } catch {
        i = { unlocked: e === 0, cleared: !1 };
      }
      n && (Me.list[e] = i);
    }
    return i;
  }
  function ft() {
    const e = Ue().length;
    let t = 0;
    for (let n = 0; n < e; n++) {
      const i = Qe(n);
      if (i.unlocked && ((t = n), !i.cleared)) return n;
    }
    return t;
  }
  function Jt(e, t, n, i, l) {
    ((e.fillStyle = l),
      (e.strokeStyle = l),
      (e.lineWidth = Math.max(1.5, i * 0.16)),
      e.fillRect(t - i * 0.5, n - i * 0.05, i, i * 0.7),
      e.beginPath(),
      e.arc(t, n - i * 0.08, i * 0.32, Math.PI, 0),
      e.stroke());
  }
  function ct(e, t, n, i, l) {
    ((e.strokeStyle = l),
      (e.lineWidth = Math.max(2, i * 0.2)),
      (e.lineCap = "round"),
      (e.lineJoin = "round"),
      e.beginPath(),
      e.moveTo(t - i * 0.45, n),
      e.lineTo(t - i * 0.12, n + i * 0.35),
      e.lineTo(t + i * 0.5, n - i * 0.4),
      e.stroke(),
      (e.lineCap = "butt"));
  }
  function Qt(e, t, n, i, l) {
    ((e.strokeStyle = l),
      (e.lineWidth = Math.max(2, i * 0.2)),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(t - i * 0.4, n - i * 0.4),
      e.lineTo(t + i * 0.4, n + i * 0.4),
      e.moveTo(t + i * 0.4, n - i * 0.4),
      e.lineTo(t - i * 0.4, n + i * 0.4),
      e.stroke(),
      (e.lineCap = "butt"));
  }
  function $t(e, t, n, i) {
    (se(e, t, n, 0.66), le(e, t, n, 40), me(e, t, 40, "STORY MODE"));
    const l = oe(),
      o = ce(),
      r = Math.max(16, o.l + 10),
      c = t - Math.max(16, o.r + 10),
      a = Ue(),
      f = a.length;
    (l && l.setting && d(e, String(l.setting.era) + "   \xB7   " + String(l.setting.title), t / 2, 62, 12, "lblPink", "center"),
      f || d(e, "STORY MODE IS NOT AVAILABLE IN THIS BUILD", t / 2, 180, 16, "lblGold", "center"));
    const b = 14,
      u = 70,
      h = 212,
      w = Math.min(250, (c - r - b * (f - 1)) / Math.max(1, f)),
      I = t / 2 - (f * w + (f - 1) * b) / 2,
      k = ft(),
      C = l && l.progress ? l.progress() : null;
    let p = 0;
    for (let y = 0; y < f; y++) {
      const A = a[y],
        E = I + y * (w + b),
        L = Qe(y),
        m = !L.unlocked;
      L.cleared && p++;
      const v = G({
          id: "ch:" + y,
          x: E,
          y: u,
          w,
          h,
          onTap: () => {
            if (!Qe(y).unlocked) {
              (O("back"), ie("CLEAR CHAPTER " + y + " FIRST", 1.6));
              return;
            }
            (O("confirm"), J("briefing", { chapter: y }));
          },
        }),
        Y = Se(v),
        Q = y === k && !m,
        j = m ? "rgba(120,108,170,0.55)" : L.cleared ? M.green : Y || Q ? M.yellow : "rgba(255,79,216,0.8)";
      Q || Y ? De(e, "card", E, u, w, h, j) : ee(e, E, u, w, h, m ? "rgba(10,5,30,0.78)" : "PANEL", j, { slant: 16, lw: 1.5 });
      const _ = E + 22,
        S = w - 44;
      ((e.globalAlpha = m ? 0.55 : 1),
        d(e, "CHAPTER " + (A.num != null ? A.num : y + 1), _, u + 26, 12, m ? "grey" : "lblGold"),
        d(e, String(A.title || ""), _, u + 56, 27, m ? "chrome" : "chromeG"));
      const R = Ze(String(A.subtitle || ""), 11, "soft", S);
      for (let N = 0; N < R.length && N < 2; N++) d(e, R[N], _, u + 75 + N * 13, 11, "soft");
      ((e.fillStyle = "rgba(138,124,216,0.5)"),
        e.fillRect(_, u + 106, S, 1),
        d(e, "CIRCUIT", _, u + 124, 10, "grey"),
        d(e, String(A.trackName || ""), _ + 52, u + 125, 15, "white"),
        d(e, "GOAL", _, u + 148, 10, "grey"));
      const U = Ze(String(A.goalText || ""), 12, "white", S - 36);
      for (let N = 0; N < U.length && N < 2; N++) d(e, U[N], _ + 36, u + 149 + N * 14, 12, "white");
      e.globalAlpha = 1;
      const V = u + h - 16;
      if (m) (Jt(e, _ + 7, V - 5, 12, "#a49ad0"), d(e, "LOCKED", _ + 22, V, 13, "grey"));
      else if (L.cleared) {
        (ct(e, _ + 7, V - 4, 12, M.green), d(e, "CLEARED", _ + 22, V, 13, "lblGreen"));
        const N = C && C.best && C.best[A.id];
        N && d(e, "BEST " + N + Je(N), E + w - 22, V, 12, "lblGold", "right");
      } else d(e, "TAP TO BEGIN", _, V, 13, de(i, 1.6) ? "lblGold" : "grey");
    }
    (f && d(e, "CLEARED  " + p + " / " + f, t / 2, u + h + 20, 12, "grey", "center"), (s.toastPos = [t / 2, u + h]));
    const g = G({ id: "back", label: "BACK", x: t / 2 - 70, y: n - 48, w: 140, h: 34, onTap: () => ue() });
    q(e, g, i, { size: 17 });
  }
  function ut(e, t, n) {
    const i = s.rect;
    return ((i.x = e), (i.y = n - 180), (i.w = t - e), (i.h = 138), i);
  }
  function ht() {
    const e = s.br,
      t = e && e.lines[e.idx];
    if (!t) return;
    ((e.t0 = K()), (e.done = !1));
    const n = oe();
    try {
      n && n.speak && n.speak(t);
    } catch {}
  }
  function Wt(e) {
    const t = oe();
    let n = [];
    try {
      n = (t && t.briefing && t.briefing(e)) || [];
    } catch {
      n = [];
    }
    ((s.br = { i: e, lines: n, idx: 0, t0: K(), done: !1, ended: !1 }), (B.briefingChapter = e));
    try {
      const i = t && t.chapters && t.chapters[e];
      i && i.track && te("prepare", i.track);
    } catch {}
    n.length ? ht() : $e();
  }
  function Ge() {
    const e = oe();
    try {
      e && e.hush && e.hush();
    } catch {}
  }
  function $e() {
    const e = s.br;
    !e || e.ended || ((e.ended = !0), Ge(), ne("startStory", e.i));
  }
  function dt() {
    const e = s.br;
    if (!(!e || e.ended)) {
      if (!e.done) {
        ((e.t0 = K() - 1e7), (e.done = !0));
        return;
      }
      (e.idx++, e.idx >= e.lines.length ? $e() : (O("select"), ht()));
    }
  }
  function pt() {
    (Ge(), O("back"), J("story"));
  }
  function We(e, t, n, i, l, o, r, c, a, f) {
    const b = G({ id: t, label: n, x: i, y: l, w: o, h: r, pad: 6, onTap: a });
    return (q(e, b, c, { size: 13, edge: f || "rgba(94,240,255,0.6)" }), b);
  }
  function xt(e, t, n, i) {
    (se(e, t, n, 0.28), le(e, t, n, 92));
    const l = s.br,
      o = Ue(),
      r = l && o[l.i],
      c = ce(),
      a = Math.max(16, c.l + 10),
      f = t - Math.max(16, c.r + 10);
    if (!l || !r) return;
    (d(e, "CHAPTER " + (r.num != null ? r.num : l.i + 1), a + 2, 30, 13, "lblGold"),
      d(e, String(r.title || ""), a, 64, 32, "chromeG"),
      d(e, String(r.subtitle || ""), a + 2, 82, 12, "soft"));
    const b = String(r.trackName || ""),
      u = String(r.goalText || "");
    (d(e, b, f, 30, 15, "white", "right"),
      d(e, "CIRCUIT", f - pe(b, 15, "white") - 8, 30, 10, "grey", "right"),
      d(e, u, f, 50, 13, "white", "right"),
      d(e, "GOAL", f - pe(u, 13, "white") - 8, 50, 10, "grey", "right"));
    const h = l.lines[l.idx];
    G({ id: "adv", x: 0, y: 0, w: t, h: n, noFocus: !0, pad: 0, onTap: dt });
    const w = ut(a, f, n),
      I = oe();
    h && I && I.drawDialogue ? (l.done = !!I.drawDialogue(e, w, i, h, (K() - l.t0) / 1e3)) : (l.done = !0);
    const k = l.lines.length,
      C = t / 2 - (k * 12) / 2;
    for (let p = 0; p < k; p++)
      (e.beginPath(),
        e.arc(C + p * 12 + 6, n - 24, 3, 0, 6.3),
        (e.fillStyle = p === l.idx ? M.yellow : p < l.idx ? M.cyan : "rgba(164,154,208,0.45)"),
        e.fill());
    (We(e, "bback", "BACK", a, n - 38, 84, 26, i, pt),
      We(
        e,
        "skip",
        "SKIP \u25B6\u25B6",
        f - 104,
        n - 38,
        104,
        26,
        i,
        () => {
          (O("confirm"), $e());
        },
        M.amber,
      ));
  }
  function en(e) {
    const t = e && e.result,
      n = t && Array.isArray(t.scene) ? t.scene : [];
    ((s.ep = { res: t, game: e && e.game, lines: n, idx: 0, t0: K(), done: !1, phase: n.length ? "talk" : "verdict", vt: K() }),
      n.length ? gt() : Be());
  }
  function gt() {
    const e = s.ep,
      t = e && e.lines[e.idx];
    if (!t) return;
    ((e.t0 = K()), (e.done = !1));
    const n = oe();
    try {
      n && n.speak && n.speak(t);
    } catch {}
  }
  function Be() {
    const e = s.ep;
    e &&
      ((e.phase = "verdict"),
      (e.vt = K()),
      (s.enterWall = K()),
      Ge(),
      (s.items = []),
      (s.focusVisible = !1),
      (s.focus = e.res && e.res.passed ? 1 : 0),
      (s.tapLockUntil = K() + 150),
      O(e.res && e.res.passed ? "finish" : "back"));
  }
  function bt() {
    const e = s.ep;
    if (!(!e || e.phase !== "talk")) {
      if (!e.done) {
        ((e.t0 = K() - 1e7), (e.done = !0));
        return;
      }
      (e.idx++, e.idx >= e.lines.length ? Be() : (O("select"), gt()));
    }
  }
  function tn(e, t, n, i) {
    const l = s.ep,
      o = l && l.res,
      r = Ue(),
      c = o && r[o.chapter],
      a = ce(),
      f = Math.max(16, a.l + 10),
      b = t - Math.max(16, a.r + 10);
    if (!l || !o) {
      se(e, t, n, 0.7);
      return;
    }
    if (l.phase === "talk") {
      (se(e, t, n, 0.4),
        le(e, t, n, 64),
        c &&
          (d(e, "CHAPTER " + (c.num != null ? c.num : o.chapter + 1), f + 2, 30, 13, "lblGold"),
          d(e, String(c.title || "") + "  \xB7  AFTER THE RACE", f + 2, 52, 18, "chrome")));
      const $ = l.lines[l.idx];
      G({ id: "adv", x: 0, y: 0, w: t, h: n, noFocus: !0, pad: 0, onTap: bt });
      const x = oe();
      $ && x && x.drawDialogue ? (l.done = !!x.drawDialogue(e, ut(f, b, n), i, $, (K() - l.t0) / 1e3)) : (l.done = !0);
      const he = l.lines.length,
        ze = t / 2 - (he * 12) / 2;
      for (let be = 0; be < he; be++)
        (e.beginPath(),
          e.arc(ze + be * 12 + 6, n - 24, 3, 0, 6.3),
          (e.fillStyle = be === l.idx ? M.yellow : be < l.idx ? M.cyan : "rgba(164,154,208,0.45)"),
          e.fill());
      We(
        e,
        "skip",
        "SKIP \u25B6\u25B6",
        b - 104,
        n - 38,
        104,
        26,
        i,
        () => {
          (O("confirm"), Be());
        },
        M.amber,
      );
      return;
    }
    (se(e, t, n, 0.74), le(e, t, n, 40));
    const u = (K() - l.vt) / 1e3,
      h = !!o.passed,
      w = fe(u / 0.3),
      I = h ? "CHAPTER PASSED" : "CHAPTER FAILED",
      k = 1 + (1 - fe(u / 0.35)) * 0.4;
    d(e, I, t / 2, 58, 42, h ? "goldG" : "redG", "center", w, k);
    const C = o.campaignComplete
      ? "CAMPAIGN COMPLETE  \xB7  THE NOON CUP IS YOURS"
      : c
        ? "CHAPTER " + (c.num != null ? c.num : o.chapter + 1) + "  \xB7  " + String(c.title || "")
        : "";
    d(e, C, t / 2, 80, 14, o.campaignComplete && de(i, 2) ? "lblGold" : "lblPink", "center", w);
    const p = 94,
      g = 184,
      y = 330,
      A = Math.min(380, b - f - y - 16),
      E = t / 2 - (y + A + 16) / 2,
      L = E + y + 16;
    (ee(e, E, p, y, g, "PANEL", h ? "rgba(70,245,168,0.8)" : "rgba(255,64,88,0.8)", { slant: 14 }),
      d(e, "GOAL", E + 22, p + 24, 12, "lbl"));
    const m = Ze(String(o.goalText || (c && c.goalText) || ""), 15, "white", y - 90);
    for (let $ = 0; $ < m.length && $ < 2; $++) d(e, m[$], E + 22, p + 46 + $ * 18, 15, "white");
    (h ? ct(e, E + y - 38, p + 40, 26, M.green) : Qt(e, E + y - 38, p + 40, 26, M.red),
      (e.fillStyle = "rgba(138,124,216,0.5)"),
      e.fillRect(E + 20, p + 86, y - 40, 1),
      d(e, "YOU FINISHED", E + 22, p + 108, 12, "lbl"));
    const v = l.game,
      Y = v && v.player,
      Q = T.HUD || {},
      j = o.finished && o.place > 0;
    (j
      ? d(e, o.place + Je(o.place), E + 22, p + 150, 44, o.place === 1 ? "goldG" : h ? "chromeG" : "chrome")
      : d(e, "RETIRED", E + 22, p + 146, 34, "redG"),
      j &&
        Y &&
        Y.finishTime != null &&
        Q.fmtTime &&
        (d(e, "TIME", E + y - 150, p + 128, 11, "grey"), re(e, Q.fmtTime(Y.finishTime), E + y - 22, p + 129, 20, "white", "right")));
    const _ = oe() && oe().progress ? oe().progress() : null,
      S = _ && c && _.best && _.best[c.id];
    (S && (d(e, "BEST", E + y - 150, p + 152, 11, "grey"), d(e, S + Je(S), E + y - 22, p + 153, 15, "lblGold", "right")),
      ee(e, L, p, A, g, "PANEL", "rgba(94,240,255,0.7)", { slant: 14 }),
      d(e, "STANDINGS", L + 22, p + 22, 12, "lbl"));
    const R = v ? St(v) : [],
      U = Q.fmtTime || (($) => (+$ || 0).toFixed(2)),
      V = R.length && R[0].finishTime != null ? R[0].finishTime : null;
    for (let $ = 0; $ < Math.min(6, R.length); $++) {
      const x = R[$],
        he = p + 32 + $ * 24,
        ze = x.isPlayer,
        be = x.place || $ + 1;
      (ze && (X(e, L + 10, he, A - 22, 22, 6), (e.fillStyle = "rgba(255,228,92,0.16)"), e.fill()),
        re(e, String(be), L + 34, he + 18, 17, be === 1 ? "gold" : "white", "right"));
      const En = Q.shipColor ? Q.shipColor(x.shipId != null ? x.shipId : x.colorIdx) : "#fff";
      (X(e, L + 46, he + 6, 18, 11, 4), (e.fillStyle = En), e.fill(), (e.strokeStyle = M.ink), (e.lineWidth = 1), e.stroke());
      const Mn = String(x.name || "SHIP")
        .toUpperCase()
        .slice(0, 12);
      d(e, Mn, L + 74, he + 17, 14, ze ? "gold" : "white");
      let Ae;
      (x.exploded && !x.finished
        ? (Ae = "RETIRED")
        : x.finished && x.finishTime != null
          ? (Ae = $ === 0 || V == null ? U(x.finishTime) : "+" + U(x.finishTime - V, !0))
          : (Ae = `--'--"--`),
        Ae === "RETIRED"
          ? d(e, Ae, L + A - 20, he + 17, 12, "lblRed", "right")
          : re(e, Ae, L + A - 20, he + 17, 13, $ === 0 ? "gold" : "soft", "right"));
    }
    const N = n - 52,
      D = 38,
      H = 176,
      Z = 16,
      F = t / 2 - (3 * H + 2 * Z) / 2,
      Ve = G({
        id: "retry",
        label: "RETRY",
        x: F,
        y: N,
        w: H,
        h: D,
        onTap: () => {
          (O("confirm"), ne("restart"));
        },
      }),
      Lt = h && o.next != null && r[o.next],
      In = G(
        Lt
          ? {
              id: "next",
              label: "NEXT CHAPTER",
              x: F + H + Z,
              y: N,
              w: H,
              h: D,
              onTap: () => {
                (O("confirm"), J("briefing", { chapter: o.next }));
              },
            }
          : {
              id: "chapters",
              label: "CHAPTERS",
              x: F + H + Z,
              y: N,
              w: H,
              h: D,
              onTap: () => {
                (O("select"), J("story"));
              },
            },
      ),
      An = G({
        id: "title",
        label: "TITLE",
        x: F + 2 * (H + Z),
        y: N,
        w: H,
        h: D,
        onTap: () => {
          (O("back"), ne("quit"));
        },
      });
    (q(e, Ve, i, { size: 18 }), q(e, In, i, Lt ? { go: !0, size: 18 } : { size: 18 }), q(e, An, i, { size: 18 }));
  }
  function nn() {
    return s.rows || (s.rows = sn());
  }
  function sn() {
    const e = z.get("steerMode", "auto") === "pads";
    return [
      {
        id: "steer",
        label: "STEERING",
        kind: "toggle",
        value: e ? "TOUCH" : "TILT",
        on: !e,
        act: () => {
          const t = e;
          (z.set("steerMode", t ? "auto" : "pads"), t && T.Input && T.Input.requestMotion && !T.Input.tiltActive && Fe());
        },
      },
      { id: "sens", label: "TILT SENS", kind: "slider", key: "tiltSens", min: 1, max: 10, def: 5 },
      {
        id: "calib",
        label: "CALIBRATE",
        kind: "action",
        value: "HOLD LEVEL & TAP",
        act: () => {
          (T.Input && !T.Input.tiltActive && T.Input.requestMotion && Fe(!0), ne("calibrate"), ie("CENTER SET", 1.2));
        },
      },
      {
        id: "invert",
        label: "INVERT TILT",
        kind: "toggle",
        value: z.get("tiltInvert", !1) ? "ON" : "OFF",
        act: () => z.set("tiltInvert", !z.get("tiltInvert", !1)),
      },
      {
        id: "assist",
        label: "STEER ASSIST",
        kind: "slider",
        key: "assist",
        min: 0,
        max: 10,
        def: 6,
        scale: 10,
        fmt: (t) => (t === 0 ? "OFF" : t === 10 ? "MAX" : t * 10 + "%"),
        apply: (t) => {
          B.assist = t;
        },
      },
      {
        id: "auto",
        label: "AUTO ACCEL",
        kind: "toggle",
        value: z.get("autoAccel", !1) ? "ON" : "OFF",
        act: () => z.set("autoAccel", !z.get("autoAccel", !1)),
      },
      {
        id: "music",
        label: "MUSIC VOL",
        kind: "slider",
        key: "musicVol",
        min: 0,
        max: 10,
        def: 7,
        scale: 10,
        apply: (t) => te("setMusicVolume", t),
      },
      {
        id: "sfxv",
        label: "SFX VOL",
        kind: "slider",
        key: "sfxVol",
        min: 0,
        max: 10,
        def: 9,
        scale: 10,
        apply: (t) => te("setSfxVolume", t),
      },
      {
        id: "voice",
        label: "VOICE",
        kind: "toggle",
        value: z.get("voice.on", !0) !== !1 ? "ON" : "OFF",
        act: () => {
          const t = z.get("voice.on", !0) === !1;
          (yt("setEnabled", t), z.set("voice.on", t));
        },
      },
      {
        id: "voicev",
        label: "VOICE VOL",
        kind: "slider",
        key: "voice.vol",
        min: 0,
        max: 10,
        def: 10,
        scale: 10,
        apply: (t) => yt("setVolume", t),
      },
      {
        id: "cine",
        label: "CUTSCENES",
        kind: "toggle",
        value: z.get("cine.intro", !0) !== !1 ? "ON" : "OFF",
        act: () => {
          const t = z.get("cine.intro", !0) === !1;
          (z.set("cine.intro", t), z.set("cine.finish", t));
        },
      },
      { id: "stest", label: "SOUND TEST", kind: "action", value: "\u25B6", act: () => J("soundtest") },
      { id: "mymusic", label: "MY MUSIC", kind: "action", value: kt() ? kt() + " LOADED  \u25B6" : "\u25B6", act: () => J("mymusic") },
    ];
  }
  function yt(e, t) {
    try {
      T.Voice && typeof T.Voice[e] == "function" && T.Voice[e](t);
    } catch (n) {
      console.warn("[ui] voice." + e, n);
    }
  }
  function Fe(e) {
    try {
      const t = T.Input.requestMotion();
      t &&
        t.then &&
        t.then(
          (n) => {
            if (n !== "granted" && !e) {
              const i = Pe();
              ie(i.msg || "TILT UNAVAILABLE", 2.6);
            } else n === "granted" && !e && ie("TILT ENABLED", 1.4);
          },
          () => {},
        );
    } catch {}
  }
  function Ce(e) {
    const t = z.get(e.key, e.scale ? e.def / e.scale : e.def);
    return ae(Math.round(e.scale ? t * e.scale : t), e.min, e.max);
  }
  function He(e, t) {
    t = ae(Math.round(t), e.min, e.max);
    const n = Ce(e),
      i = e.scale ? t / e.scale : t;
    (z.set(e.key, i), e.apply && e.apply(i), t !== n && O(e.id === "sfxv" ? "confirm" : "select"));
  }
  const ge = 150;
  function ln(e, t, n, i) {
    (se(e, t, n, 0.66), le(e, t, n, 40), me(e, t, 40, "OPTIONS"));
    const l = ce(),
      o = Math.max(16, l.l + 10),
      r = t - Math.max(16, l.r + 10),
      c = 18,
      a = Math.min(360, (r - o - c) / 2),
      f = t / 2 - a - c / 2,
      b = t / 2 + c / 2,
      u = 29,
      h = 6,
      w = 58,
      I = nn(),
      k = (L) => (L < 5 ? [f, w + L * (u + h)] : [b, w + (L - 5) * (u + h)]);
    for (let L = 0; L < I.length; L++) {
      const m = I[L],
        [v, Y] = k(L),
        Q = G({
          id: m.id,
          x: v,
          y: Y,
          w: a,
          h: u,
          row: m,
          onTap: (S, R) => {
            if (m.kind === "slider") {
              const U = v + a - ge - 10;
              R < U + 14
                ? He(m, Ce(m) - 1)
                : R > U + ge - 14
                  ? He(m, Ce(m) + 1)
                  : He(m, m.min + ((R - U - 14) / (ge - 28 - 24)) * (m.max - m.min));
            } else (O("select"), m.act(), (s.rows = null));
          },
          onAdjust: (S) => {
            m.kind === "slider" ? He(m, Ce(m) + S) : m.kind === "toggle" && (O("select"), m.act(), (s.rows = null));
          },
        }),
        j = Se(Q),
        _ = s.flashId === m.id && i - s.flashT < 0.15;
      if (
        (ee(e, v, Y, a, u, _ || j ? "PANELHOT" : "PANEL", j ? M.yellow : "rgba(255,79,216,0.6)", { slant: 10, lw: j ? 2 : 1 }),
        d(e, m.label, v + 18, Y + u / 2 + 6, 16, j ? "gold" : "white"),
        m.kind === "slider")
      ) {
        const S = Ce(m),
          R = v + a - ge - 10,
          U = Y + u / 2;
        (d(e, "\u25C0", R + 6, U + 5, 13, "lbl", "center"), d(e, "\u25B6", R + ge - 6, U + 5, 13, "lbl", "center"));
        const V = R + 16,
          N = ge - 32 - 24,
          D = m.max - m.min;
        for (let H = 0; H < D; H++) {
          const Z = H < S - m.min,
            F = N / D,
            Ve = 5 + (H / Math.max(1, D - 1)) * 12;
          (X(e, V + H * F, U + 8 - Ve, F - 2, Ve, 2),
            (e.fillStyle = Z ? (H / D >= 0.7 ? M.magenta : M.cyan) : "rgba(60,36,120,0.7)"),
            e.fill());
        }
        (m.fmt
          ? d(e, m.fmt(S), R + ge - 16, U + 6, 13, S === 0 ? "grey" : "white", "right")
          : re(e, String(S), R + ge - 16, U + 6, 15, "white", "right"),
          m.id === "sens" &&
            T.Input &&
            T.Input.maxAngle &&
            re(e, Math.round(T.Input.maxAngle()) + "\xB0", R - 6, U + 5, 12, "grey", "right"));
      } else {
        const S = m.on != null ? m.on : m.value === "ON";
        if (m.id === "steer") {
          const U = v + a - 128 - 12,
            V = Y + 5;
          for (let N = 0; N < 2; N++) {
            const D = (N === 0) === S;
            (X(e, U + N * 64, V, 61, u - 10, 6),
              (e.fillStyle = D ? (N === 0 ? M.green : M.cyan) : "rgba(12,4,34,0.7)"),
              e.fill(),
              d(e, N === 0 ? "TILT" : "TOUCH", U + N * 64 + 64 / 2 - 1, V + u / 2 + 1, 13, D ? "btnHot" : "grey", "center"));
          }
        } else d(e, m.value, v + a - 16, Y + u / 2 + 6, 15, S ? "lblGreen" : m.value === "OFF" ? "grey" : "lbl", "right");
      }
      m.id === "calib" && rn(e, v + 132, Y + u / 2, 80);
    }
    const C = w + 5 * (u + h) + 2,
      p = 70,
      g = Pe();
    if (
      (ee(e, f, C, a, p, "rgba(8,3,26,0.7)", g.on ? "rgba(70,245,168,0.7)" : "rgba(255,180,60,0.6)", { slant: 10 }),
      d(e, g.msg, f + 18, C + 21, 14, g.on ? "lblGreen" : g.code === "pads" ? "grey" : "lblGold"),
      g.detail)
    ) {
      const L = mt(g.detail, 10, "grey", on(g) ? a - 180 : a - 40);
      for (let m = 0; m < L.length && m < 3; m++) d(e, L[m], f + 18 - m * 2, C + 36 + m * 11.5, 10, "grey");
    }
    s.toastPos = [b + a / 2, 236];
    const y = !g.on && g.code !== "pads",
      A = n - 48,
      E = G({ id: "back", label: "BACK", x: t / 2 - 70, y: A, w: 140, h: 34, onTap: () => ue() });
    if ((q(e, E, i, { size: 17 }), y)) {
      const L = G({
        id: "tiltfix",
        label: "ENABLE TILT",
        x: f + a - 146,
        y: C + p - 28,
        w: 124,
        h: 22,
        onTap: () => {
          (O("select"), Fe());
        },
      });
      q(e, L, i, { size: 13, edge: M.amber });
    }
  }
  function mt(e, t, n, i) {
    const l = String(e).split(" "),
      o = [];
    let r = "";
    for (const c of l) {
      const a = r ? r + " " + c : c;
      r && pe(a, t, n) > i ? (o.push(r), (r = c)) : (r = a);
    }
    return (r && o.push(r), o);
  }
  function on(e) {
    return !e.on && e.code !== "pads";
  }
  function rn(e, t, n, i) {
    const l = T.Input;
    if (!l || !l.tiltActive) return;
    (X(e, t, n - 3, i, 6, 2), (e.fillStyle = "rgba(10,4,30,0.85)"), e.fill());
    const o = ae(+l.tiltSteer || 0, -1, 1);
    ((e.fillStyle = Math.abs(o) > 0.92 ? M.magenta : M.cyan), X(e, t + i / 2 + o * (i / 2 - 4) - 4, n - 7, 8, 14, 3), e.fill());
  }
  function an() {
    return (T.Audio && Array.isArray(T.Audio.songs) && T.Audio.songs.length ? T.Audio.songs : Ot).map((t) =>
      typeof t == "string" ? { id: t, title: t.toUpperCase() } : { id: t.id, title: String(t.title || t.id).toUpperCase() },
    );
  }
  function fn(e, t, n, i) {
    (se(e, t, n, 0.68), le(e, t, n, 40), me(e, t, 40, "SOUND TEST"));
    const l = ce(),
      o = Math.max(16, l.l + 10),
      r = t - Math.max(16, l.r + 10),
      c = Math.min(350, (r - o - 18) / 2),
      a = t / 2 - c - 9,
      f = t / 2 + 9;
    (d(e, "MUSIC", a + 6, 72, 13, "lbl"), d(e, "SOUND FX", f + 6, 72, 13, "lbl"));
    const b = an(),
      u = 27;
    for (let g = 0; g < Math.min(b.length, 7); g++) {
      const y = b[g],
        A = 80 + g * (u + 5),
        E = s.playing === y.id,
        L = G({
          id: "song:" + y.id,
          x: a,
          y: A,
          w: c,
          h: u,
          onTap: () => {
            s.playing === y.id
              ? (te("stopMusic", 0.3), (s.playing = null), O("back"))
              : (te("playMusic", y.id, { fadeIn: 0.2 }), (s.playing = y.id), (s.musicChanged = !0));
          },
        }),
        m = Se(L);
      if (
        (ee(e, a, A, c, u, E || m ? "PANELHOT" : "PANEL", m ? M.yellow : E ? M.cyan : "rgba(255,79,216,0.55)", { slant: 9 }),
        re(e, (g + 1 < 10 ? "0" : "") + (g + 1), a + 16, A + u / 2 + 5, 13, "grey"),
        d(e, y.title, a + 42, A + u / 2 + 6, 15, E ? "gold" : "white"),
        E)
      )
        for (let v = 0; v < 6; v++) {
          const Y = 3 + (Math.sin(i * (7 + v * 2.3) + v) * 0.5 + 0.5) * 15;
          ((e.fillStyle = v % 2 ? M.magenta : M.cyan), e.fillRect(a + c - 52 + v * 6, A + u - 5 - Y, 4, Y));
        }
      else d(e, "\u266A", a + c - 20, A + u / 2 + 6, 15, "dim", "center");
    }
    const h = 2,
      w = (c - 6) / h,
      I = 22;
    for (let g = 0; g < xe.length; g++) {
      const y = xe[g],
        A = f + (g % h) * (w + 6),
        E = 80 + Math.floor(g / h) * (I + 6),
        L = G({
          id: "sfx:" + y,
          label: y.toUpperCase(),
          x: A,
          y: E,
          w,
          h: I,
          onTap: () => {
            te("sfx", y, y === "wallHit" || y === "shipHit" || y === "explode" ? { intensity: 0.8 } : void 0);
          },
        });
      q(e, L, i, { size: 12, edge: "rgba(94,240,255,0.6)" });
    }
    const k = n - 46,
      C = G({
        id: "stop",
        label: "STOP",
        x: t / 2 - 160,
        y: k,
        w: 150,
        h: 32,
        onTap: () => {
          (te("stopMusic", 0.3), (s.playing = null), O("back"));
        },
      });
    q(e, C, i, { size: 16 });
    const p = G({ id: "back", label: "BACK", x: t / 2 + 10, y: k, w: 150, h: 32, onTap: () => ue() });
    q(e, p, i, { size: 16 });
  }
  const Le = [
      ["title", "TITLE"],
      ["race1", "RACE 1 \xB7 NEON HARBOR"],
      ["race2", "RACE 2"],
      ["race3", "RACE 3"],
      ["results", "RESULTS"],
    ],
    Tt = () => !!(T.Audio && typeof T.Audio.setCustomTrack == "function"),
    wt = (e) => z.get("music." + e + ".name", null);
  function kt() {
    let e = 0;
    for (const t of Le) wt(t[0]) && e++;
    return e;
  }
  function cn() {
    let e = s.fileEl;
    if (e) return e;
    try {
      ((e = s.fileEl = document.createElement("input")),
        (e.type = "file"),
        (e.accept = "audio/*"),
        (e.id = "pgp-music-file"),
        e.setAttribute("aria-hidden", "true"),
        (e.tabIndex = -1),
        (e.style.cssText = "position:fixed;left:-1000px;top:0;width:1px;height:1px;opacity:0;pointer-events:none"),
        e.addEventListener("change", hn),
        document.body.appendChild(e));
    } catch {
      return ((s.fileEl = null), null);
    }
    return e;
  }
  function un(e) {
    if (!Tt()) {
      ie("CUSTOM MUSIC NOT AVAILABLE", 2);
      return;
    }
    const t = cn();
    if (t) {
      s.pickSlot = e;
      try {
        ((t.value = ""), t.click());
      } catch {
        ie("CANNOT OPEN FILE PICKER", 2);
      }
    }
  }
  function hn() {
    const e = s.fileEl,
      t = s.pickSlot,
      n = e && e.files && e.files[0];
    if (!n || !t) return;
    const i = String(n.name || "TRACK").replace(/\.[a-z0-9]{1,5}$/i, "");
    s.busySlot = t;
    let l;
    try {
      l = T.Audio.setCustomTrack(t, n);
    } catch (o) {
      l = Promise.reject(o);
    }
    Promise.resolve(l).then(
      (o) => {
        if (((s.busySlot = null), o === !1)) {
          ie("COULD NOT LOAD THAT FILE", 2.4);
          return;
        }
        (z.set("music." + t + ".name", i), ie("LOADED: " + i.toUpperCase().slice(0, 28), 2));
      },
      (o) => {
        ((s.busySlot = null), console.warn("[ui] setCustomTrack", o), ie("COULD NOT LOAD THAT FILE", 2.4));
      },
    );
  }
  function dn(e) {
    try {
      T.Audio && typeof T.Audio.clearCustomTrack == "function" && T.Audio.clearCustomTrack(e);
    } catch (t) {
      console.warn("[ui] clearCustomTrack", t);
    }
    (z.set("music." + e + ".name", null), O("back"), ie("BUILT-IN MUSIC RESTORED", 1.6));
  }
  function pn(e, t, n, i) {
    if (pe(e, t, n) <= i) return e;
    let l = e;
    for (; l.length > 1 && pe(l + "\u2026", t, n) > i;) l = l.slice(0, -1);
    return l + "\u2026";
  }
  function gn(e, t, n, i) {
    (se(e, t, n, 0.68), le(e, t, n, 40), me(e, t, 40, "MY MUSIC"));
    const l = ce(),
      o = Math.max(16, l.l + 10),
      r = t - Math.max(16, l.r + 10),
      c = Math.min(700, r - o),
      a = t / 2 - c / 2,
      f = Tt(),
      b = 36,
      u = 7,
      h = 60;
    for (let k = 0; k < Le.length; k++) {
      const C = Le[k][0],
        p = h + k * (b + u),
        g = wt(C);
      (ee(e, a, p, c, b, g ? "PANELHOT" : "PANEL", g ? M.cyan : "rgba(255,79,216,0.55)", { slant: 10 }),
        d(e, Le[k][1], a + 20, p + 15, 12, "lbl"));
      const A = s.busySlot === C ? "LOADING\u2026" : g ? "\u266A " + g : "BUILT-IN";
      d(e, pn(A, 15, g ? "gold" : "grey", c - 280), a + 22, p + 31, 15, g ? "gold" : "grey");
      const E = 96,
        L = 26,
        m = p + (b - L) / 2,
        v = G({
          id: "load:" + C,
          label: "LOAD",
          x: a + c - 2 * E - 26,
          y: m,
          w: E,
          h: L,
          disabled: !f,
          onTap: () => {
            (O("select"), un(C));
          },
        }),
        Y = G({ id: "reset:" + C, label: "RESET", x: a + c - E - 18, y: m, w: E, h: L, disabled: !g, onTap: () => dn(C) });
      ((e.globalAlpha = f ? 1 : 0.35),
        q(e, v, i, { size: 13, edge: M.cyan }),
        (e.globalAlpha = 1),
        (e.globalAlpha = g ? 1 : 0.35),
        q(e, Y, i, { size: 13 }),
        (e.globalAlpha = 1));
    }
    const w = h + Le.length * (b + u) + 14;
    ((s.toastPos = [t / 2, w - 18]),
      (s.toast && K() / 1e3 - s.toastT < (s.toastDur || 1.8)) ||
        (f
          ? d(e, "USE MUSIC YOU OWN OR ROYALTY-FREE TRACKS.  FILES STAY ON THIS DEVICE.", t / 2, w, 11, "grey", "center")
          : f || d(e, "CUSTOM MUSIC IS NOT AVAILABLE IN THIS BUILD", t / 2, w, 12, "lblGold", "center")));
    const I = G({ id: "back", label: "BACK", x: t / 2 - 70, y: n - 48, w: 140, h: 34, onTap: () => ue() });
    q(e, I, i, { size: 17 });
  }
  function bn(e, t, n, i, l) {
    se(e, t, n, 0.55);
    const o = 300,
      r = 276,
      c = t / 2 - o / 2,
      a = n / 2 - r / 2 - 8;
    (De(e, "pause", c, a, o, r, M.magenta),
      ee(e, c + 8, a + 6, o - 16, r - 12, null, "rgba(94,240,255,0.35)", { slant: 20 }),
      d(e, "PAUSE", t / 2, a + 46, 38, de(i, 0.8) ? "chromeG" : "goldG", "center"));
    const f = [
        ["resume", "RESUME"],
        ["restart", "RESTART"],
        ["calibrate", "CALIBRATE"],
        ["quit", "QUIT"],
      ],
      b = 200,
      u = 34,
      h = 9,
      w = a + 64;
    for (let I = 0; I < f.length; I++) {
      const k = G({ id: f[I][0], label: f[I][1], x: t / 2 - b / 2, y: w + I * (u + h), w: b, h: u, onTap: yn });
      q(e, k, i, { size: 18 });
    }
    if (l && l.player) {
      const I = l.player,
        k = T.HUD || {},
        C = l.laps || 5,
        p =
          "LAP " +
          Math.min(C, (I.lap | 0) + 1) +
          "/" +
          C +
          "   " +
          (I.place || 1) +
          (k.ordinal ? k.ordinal(I.place || 1) : "") +
          "   " +
          (k.fmtTime ? k.fmtTime(l.raceTime || 0) : "");
      d(e, p, t / 2, a + r - 20, 13, "grey", "center");
    }
  }
  function yn(e) {
    e.id === "resume"
      ? (O("confirm"), ne("resume"))
      : e.id === "restart"
        ? (O("confirm"), ne("restart"))
        : e.id === "calibrate"
          ? (O("select"), T.Input && !T.Input.tiltActive && T.Input.requestMotion && Fe(!0), ne("calibrate"), ie("CENTER SET", 1.2))
          : e.id === "quit" && (O("back"), ne("quit"));
  }
  const we = { g: null, sig: -1, list: null };
  function mn(e) {
    const t = e && e.ships;
    if (!t) return -1;
    let n = t.length;
    for (let i = 0; i < t.length; i++) {
      const l = t[i];
      ((n = (Math.imul(n, 31) + ((l.place | 0) * 4 + (l.finished ? 1 : 0) + (l.exploded ? 2 : 0))) | 0),
        (n = (Math.imul(n, 31) + Math.round((+l.finishTime || 0) * 1e3)) | 0));
    }
    return n;
  }
  function St(e) {
    const t = mn(e);
    if (we.g === e && we.sig === t && we.list && t !== -1) return we.list;
    let n = null;
    try {
      e && typeof e.standings == "function" && (n = e.standings());
    } catch {
      n = null;
    }
    return (
      (!n || !n.length) && (n = ((e && e.ships) || []).slice().sort((i, l) => (i.place || 99) - (l.place || 99))),
      (we.g = e),
      (we.sig = t),
      (we.list = n),
      n
    );
  }
  function Tn(e, t, n, i, l) {
    const o = s.data || l;
    (se(e, t, n, 0.7), le(e, t, n, 40));
    const r = T.HUD || {},
      c = r.fmtTime || ((S) => (+S || 0).toFixed(2)),
      a = r.ordinal || (() => ""),
      f = o && o.player,
      b = (o && o.phase === "retired") || (f && f.exploded && !f.finished);
    me(e, t, 40, b ? "RETIRED" : "RESULTS");
    const u = ce(),
      h = Math.max(16, u.l + 10),
      w = t - Math.max(16, u.r + 10),
      I = Math.min(420, (w - h - 16) * 0.6),
      k = Math.min(250, w - h - 16 - I),
      C = t / 2 - (I + k + 16) / 2,
      p = C + I + 16,
      g = 58,
      y = 222;
    (ee(e, C, g, I, y, "PANEL", "rgba(255,79,216,0.75)", { slant: 14 }), d(e, "STANDINGS", C + 22, g + 22, 13, "lbl"));
    const A = St(o),
      E = A.length && A[0].finishTime != null ? A[0].finishTime : null,
      L = (K() - s.enterWall) / 1e3;
    for (let S = 0; S < Math.min(6, A.length); S++) {
      const R = A[S],
        U = g + 36 + S * 30;
      if (L < 0.1 * S) break;
      const V = (1 - fe((L - 0.1 * S) / 0.25)) * 40,
        N = R.isPlayer,
        D = R.place || S + 1;
      (N && (X(e, C + 12, U, I - 26, 26, 7), (e.fillStyle = de(i, 1.5) ? "rgba(255,228,92,0.24)" : "rgba(255,228,92,0.12)"), e.fill()),
        re(e, String(D), C + 38 + V, U + 21, 22, D === 1 ? "gold" : "white", "right"),
        d(e, a(D), C + 40 + V, U + 13, 10, "grey"));
      const H = r.shipColor ? r.shipColor(R.shipId != null ? R.shipId : R.colorIdx) : "#fff";
      (X(e, C + 64 + V, U + 6, 22, 14, 5), (e.fillStyle = H), e.fill(), (e.strokeStyle = M.ink), (e.lineWidth = 1), e.stroke());
      const Z = String(R.name || (r.shipColorName ? r.shipColorName(R.colorIdx) : "SHIP"))
        .toUpperCase()
        .slice(0, 14);
      (d(e, Z, C + 96 + V, U + 19, 16, N ? "gold" : "white"), N && d(e, "YOU", C + 100 + V + pe(Z, 16, "gold"), U + 18, 10, "lblGold"));
      let F;
      (R.exploded && !R.finished
        ? (F = "RETIRED")
        : R.finished && R.finishTime != null
          ? (F = S === 0 || E == null ? c(R.finishTime) : "+" + c(R.finishTime - E, !0))
          : (F = `--'--"--`),
        F === "RETIRED"
          ? d(e, F, C + I - 22, U + 19, 14, "lblRed", "right")
          : re(e, F, C + I - 22, U + 19, 15, S === 0 ? "gold" : "soft", "right"));
    }
    (ee(e, p, g, k, y, "PANEL", "rgba(94,240,255,0.7)", { slant: 14 }), d(e, "YOUR LAPS", p + 22, g + 22, 13, "lbl"));
    const m = (f && f.lapTimes) || [];
    let v = -1;
    for (let S = 0; S < m.length; S++) (v < 0 || m[S] < m[v]) && (v = S);
    const Y = Math.min(6, Math.max(m.length, (o && o.laps) || 5));
    for (let S = 0; S < Y; S++) {
      const R = g + 34 + S * 25,
        U = S < m.length,
        V = S === v;
      (V && (X(e, p + 12, R, k - 26, 22, 6), (e.fillStyle = de(i, 2) ? "rgba(255,228,92,0.30)" : "rgba(255,228,92,0.16)"), e.fill()),
        d(e, "L" + (S + 1), p + 26, R + 16, 13, "grey"),
        V && d(e, "BEST", p + 54, R + 16, 11, "lblGold"),
        re(e, U ? c(m[S]) : `-'--"--`, p + k - 22, R + 16, 15, V ? "gold" : "white", "right"));
    }
    ((e.fillStyle = "rgba(94,240,255,0.5)"),
      e.fillRect(p + 18, g + y - 40, k - 40, 1),
      d(e, "TOTAL", p + 24, g + y - 16, 14, "lblPink"),
      f && f.finished && f.finishTime != null
        ? re(e, c(f.finishTime), p + k - 22, g + y - 15, 19, "chrome", "right")
        : d(e, b ? "RETIRED" : "--", p + k - 22, g + y - 15, 15, b ? "lblRed" : "white", "right"));
    const Q = n - 46;
    if (f && f.place && !b) {
      const S = f.place + a(f.place) + " PLACE" + (f.place === 1 ? "!" : "");
      d(e, S, t / 2, Q - 8, 30, f.place === 1 ? "goldG" : "chromeG", "center");
    }
    const j = G({
      id: "retry",
      label: "RETRY",
      x: h,
      y: Q,
      w: 160,
      h: 36,
      onTap: () => {
        (O("confirm"), ne("restart"));
      },
    });
    q(e, j, i, { size: 19 });
    const _ = G({
      id: "title",
      label: "TITLE",
      x: w - 160,
      y: Q,
      w: 160,
      h: 36,
      onTap: () => {
        (O("back"), ne("quit"));
      },
    });
    q(e, _, i, { size: 19 });
  }
  function wn() {
    const e = window.innerWidth || 0;
    return (window.innerHeight || 0) > e * 1.05;
  }
  function It(e) {
    let t = s.pcv;
    if (!e) return (t && (t.style.display = "none"), null);
    (t ||
      ((t = s.pcv = document.createElement("canvas")),
      (t.id = "pgp-portrait"),
      (t.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:50;touch-action:none;background:#090418"),
      document.body.appendChild(t)),
      (t.style.display = "block"));
    const n = Math.min(3, window.devicePixelRatio || 1),
      i = window.innerWidth || 320,
      l = window.innerHeight || 640,
      o = Math.round(i * n),
      r = Math.round(l * n);
    return ((t.width !== o || t.height !== r) && ((t.width = o), (t.height = r)), (t._k = n), (t._w = i), (t._h = l), t);
  }
  function kn(e) {
    const t = It(!0);
    if (!t || !W()) return;
    const n = t.getContext("2d");
    n.setTransform(t._k, 0, 0, t._k, 0, 0);
    const i = t._w,
      l = t._h;
    ((n.fillStyle = "#090418"), n.fillRect(0, 0, i, l));
    const o = W();
    (o.stripes(n, i / 2 - 20, l * 0.18, -1, i * 0.4, [M.magenta, M.cyan, M.amber], 0.9),
      o.stripes(n, i / 2 + 20, l * 0.18, 1, i * 0.4, [M.magenta, M.cyan, M.amber], 0.9));
    const r = i / 2,
      c = l * 0.4,
      a = (e % 2.4) / 2.4,
      f = a < 0.25 ? 0 : a < 0.55 ? (fe((a - 0.25) / 0.3) * Math.PI) / 2 : Math.PI / 2;
    (n.save(),
      n.translate(r, c),
      n.rotate(-f),
      o.cut(n, -32, -56, 64, 112, 10),
      (n.fillStyle = "#160a36"),
      n.fill(),
      (n.strokeStyle = M.magenta),
      (n.lineWidth = 3),
      n.stroke(),
      (n.fillStyle = o.gradV(n, "CHROME", -46, 46)),
      n.fillRect(-25, -46, 50, 92),
      n.restore(),
      d(n, "ROTATE YOUR", i / 2, l * 0.62, 34, "chromeG", "center"),
      d(n, "DEVICE", i / 2, l * 0.62 + 40, 34, "chromeG", "center"),
      d(n, "PLASMA GP PLAYS IN LANDSCAPE", i / 2, l * 0.62 + 76, 13, "grey", "center", de(e, 1) ? 1 : 0.5));
  }
  function Sn(e, t, n, i) {
    const l = K() / 1e3 - s.toastT;
    if (!s.toast || l < 0 || l > (s.toastDur || 1.8)) return;
    const o = ae(Math.min(1, l / 0.12) * Math.min(1, ((s.toastDur || 1.8) - l) / 0.25), 0, 1);
    if (o <= 0.01) return;
    const r = pe(s.toast, 14, "lblGold") + 50,
      c = s.toastPos ? s.toastPos[0] : t / 2,
      a = s.toastPos ? s.toastPos[1] : 64;
    ((e.globalAlpha = o),
      ee(e, c - r / 2, a, r, 28, "rgba(10,4,30,0.92)", M.yellow, { slant: 9, lw: 1.5 }),
      (e.globalAlpha = 1),
      d(e, s.toast, c, a + 19, 14, "lblGold", "center", o));
  }
  function At(e, t) {
    if ((s.portrait && s.screen !== "boot") || s.screen === "race" || K() < s.tapLockUntil) return;
    const n = Ft(e, t);
    !n || !n.onTap || ((s.focusVisible = !1), (s.flashId = n.id), (s.flashT = s.t), n.onTap(n, e, t));
  }
  /* drawing kit handed to extension screens (pilots.js) */
  const pgpKit = {
    text: d,
    num: re,
    textW: pe,
    panel: ee,
    slant: X,
    item: G,
    button: q,
    header: me,
    dim: se,
    bars: le,
    safe: ce,
    pal: M,
    go: (e) => J(e),
    back: () => ue(),
    sfx: O,
    focused: (e) => Se(e),
  };
  function Et(e) {
    if (!s.portrait) {
      if (s.screen === "trackselect") {
        je(s.trk - e);
        return;
      }
      s.screen === "shipselect" && Ie(s.ship - e, -e);
    }
  }
  function ue() {
    if (
      (O("back"),
      s.screen === "soundtest" && s.musicChanged && ((s.musicChanged = !1), (s.playing = null), te("playMusic", "title", { fadeIn: 0.5 })),
      s.screen === "soundtest" && s.prevScreenForBack === "options")
    ) {
      (J("options"), (s.prevScreenForBack = "title"));
      return;
    }
    if (s.screen === "mymusic") {
      J("options");
      return;
    }
    if (s.screen === "trackselect") {
      J("shipselect");
      return;
    }
    if (s.screen === "briefing") {
      (Ge(), J("story"));
      return;
    }
    J("title");
  }
  function Mt(e) {
    if (s.screen === "race") return;
    if (s.screen === "boot") {
      e === "ok" && lt();
      return;
    }
    if (s.screen === "briefing") {
      e === "ok" ? dt() : e === "back" && pt();
      return;
    }
    if (s.screen === "epilogue" && s.ep && s.ep.phase === "talk") {
      e === "ok" ? bt() : e === "back" && Be();
      return;
    }
    if (s.screen === "trackselect") {
      if (e === "left" || e === "right") {
        je(s.trk + (e === "left" ? -1 : 1));
        return;
      }
      if (e === "back") {
        ue();
        return;
      }
      if (e === "ok" && !s.focusVisible) {
        ((s.flashId = "go"), (s.flashT = s.t), at());
        return;
      }
    }
    if (s.screen === "shipselect") {
      if (e === "left" || e === "right") {
        Ie(s.ship + (e === "left" ? -1 : 1), e === "left" ? -1 : 1);
        return;
      }
      if (e === "back") {
        ue();
        return;
      }
      if (e === "up" || e === "down") {
        const n = Ee.findIndex((i) => i[0] === ye());
        ot(Ee[ae(n + (e === "up" ? -1 : 1), 0, 2)][0]);
        return;
      }
      if (e === "ok" && !s.focusVisible) {
        ((s.flashId = "go"), (s.flashT = s.t), rt());
        return;
      }
    }
    const t = Xe();
    if (e === "back") {
      s.screen === "pause"
        ? (O("confirm"), ne("resume"))
        : s.screen === "options" || s.screen === "soundtest" || s.screen === "mymusic" || s.screen === "story" || s.screen === "pilots"
          ? ue()
          : s.screen === "epilogue" && (O("select"), J("story"));
      return;
    }
    if (t.length) {
      if (!s.focusVisible && ((s.focusVisible = !0), e === "up" || e === "down")) {
        O("select");
        return;
      }
      if (e === "up" || e === "down") {
        const n = e === "up" ? -1 : 1;
        (s.screen === "soundtest" ? (s.focus = Ct(t, s.focus, 0, n)) : (s.focus = (s.focus + n + t.length) % t.length), O("select"));
      } else if (e === "left" || e === "right") {
        const n = t[s.focus],
          i = e === "left" ? -1 : 1;
        n && n.onAdjust
          ? n.onAdjust(i)
          : (s.screen === "soundtest" ||
              s.screen === "results" ||
              s.screen === "options" ||
              s.screen === "story" ||
              s.screen === "pilots" ||
              s.screen === "epilogue") &&
            ((s.focus = Ct(t, s.focus, i, 0)), O("select"));
      } else if (e === "ok") {
        const n = t[s.focus];
        n && n.onTap && ((s.flashId = n.id), (s.flashT = s.t), n.onTap(n, n.x + n.w / 2, n.y + n.h / 2));
      }
    }
  }
  function Ct(e, t, n, i) {
    const l = e[t];
    if (!l) return 0;
    const o = l.x + l.w / 2,
      r = l.y + l.h / 2;
    let c = t,
      a = 1 / 0;
    for (let f = 0; f < e.length; f++) {
      if (f === t) continue;
      const b = e[f],
        u = b.x + b.w / 2 - o,
        h = b.y + b.h / 2 - r;
      if ((n && (Math.sign(u) !== n || Math.abs(u) < 4)) || (i && (Math.sign(h) !== i || Math.abs(h) < 4))) continue;
      const w = n ? Math.abs(u) + Math.abs(h) * 3 : Math.abs(h) + Math.abs(u) * 3;
      w < a && ((a = w), (c = f));
    }
    return c;
  }
  function J(e, t) {
    if (Rt.indexOf(e) < 0) {
      console.warn("[ui] unknown screen", e);
      return;
    }
    const n = s.screen;
    if ((e === "soundtest" && (s.prevScreenForBack = n === "options" ? "options" : "title"), e === "shipselect")) {
      const i = ke().length;
      ((s.ship = ae((+z.get("ship", 0) || 0) | 0, 0, i - 1)),
        (B.selectedShip = s.ship),
        (s.shipChangeT = -1e9),
        (s.shipDir = 0),
        (B.selectedDifficulty = ye()),
        (B.assist = _e()));
    }
    if (e === "trackselect") {
      const i = Te();
      ((s.trk = ae(Xt(z.get("track", "neon_harbor")), 0, Math.max(0, i.length - 1))),
        (B.selectedTrack = i[s.trk] ? i[s.trk].id : B.selectedTrack),
        te("prepare", B.selectedTrack));
    }
    ((s.rows = null),
      (e === "results" || e === "epilogue") && te("prepare", "title"),
      (s.prev = n),
      (s.screen = e),
      (B.screen = e),
      t !== void 0 ? (s.data = t) : e !== "results" && (s.data = null),
      (s.pendingEnter = !0),
      (s.focus = 0),
      (s.items = []),
      e === "story" ? (s.focus = ft()) : e === "briefing" ? Wt(t && t.chapter != null ? t.chapter | 0 : 0) : e === "epilogue" && en(t),
      (s.tapLockUntil = K() + 150));
  }
  const Re = T.HUD && T.HUD.kit && T.HUD.kit.DirtyList ? new T.HUD.kit.DirtyList() : null,
    B = (T.UI = {
      dirty: Re,
      screen: "boot",
      selectedShip: 0,
      selectedTrack: "neon_harbor",
      briefingChapter: 0,
      selectedDifficulty: "normal",
      assist: 0.6,
      init(e) {
        ((s.hooks = e || {}),
          (s.ship = ae((+z.get("ship", 0) || 0) | 0, 0, ke().length - 1)),
          (B.selectedShip = s.ship),
          (B.selectedDifficulty = ye()),
          (B.assist = _e()),
          T.Input &&
            (T.Input.onTap && T.Input.onTap(At), T.Input.onMenuKey && T.Input.onMenuKey(Mt), T.Input.onSwipe && T.Input.onSwipe(Et)));
      },
      setScreen: J,
      draw(e, t, n, i, l) {
        if (e) {
          ((s.t = i),
            s.pendingEnter && ((s.enterT = i), (s.enterWall = K()), (s.pendingEnter = !1)),
            (s.items = []),
            (s.toastPos = null),
            (P.a = 0),
            (P.h = 0),
            e.save());
          try {
            const o = W();
            if (!o) return;
            Ut();
            const r = n / 360,
              c = t / r,
              a = 360;
            if (
              ((s.k = r),
              (s.Wd = t),
              (s.Hd = n),
              (s.W = c),
              (s.H = a),
              r !== 1 && e.scale(r, r),
              o.syncScale(e),
              (e.imageSmoothingEnabled = !0),
              Re && (o.setSink(Re), s.screen !== "race" && Re.on && (Re.full = !0)),
              s.screen !== "race")
            ) {
              if (s.screen === "shipselect" || s.screen === "trackselect" || s.screen === "story" || s.screen === "briefing") {
                const f = T.HUD;
                f && f.prewarmRace && f.prewarmRace();
              }
              o.pumpWarm && o.pumpWarm(2.5);
            }
            switch (((s.portrait = wn()), s.screen)) {
              case "boot":
                Ht(e, c, a, i);
                break;
              case "title":
                zt(e, c, a, i);
                break;
              case "shipselect":
                Kt(e, c, a, i);
                break;
              case "trackselect":
                Zt(e, c, a, i);
                break;
              case "story":
                $t(e, c, a, i);
                break;
              case "briefing":
                xt(e, c, a, i);
                break;
              case "epilogue":
                tn(e, c, a, i);
                break;
              case "options":
                ln(e, c, a, i);
                break;
              case "soundtest":
                fn(e, c, a, i);
                break;
              case "mymusic":
                gn(e, c, a, i);
                break;
              case "pilots":
                T.Pilots && T.Pilots.drawScreen && T.Pilots.drawScreen(e, c, a, i, pgpKit);
                break;
              case "pause":
                bn(e, c, a, i, l);
                break;
              case "results":
                Tn(e, c, a, i, l);
                T.Pilots && T.Pilots.drawReport && T.Pilots.drawReport(e, c, a, i, pgpKit);
                break;
              default:
                break;
            }
            (s.focus >= Xe().length && (s.focus = 0),
              Sn(e, c, a, i),
              !s.portrait && s.pcv && It(!1),
              s.portrait &&
                (kn(i),
                s.screen === "race" &&
                  l &&
                  (l.phase === "racing" || l.phase === "countdown") &&
                  T.Input &&
                  T.Input.requestPause &&
                  T.Input.requestPause()));
          } catch (o) {
            B._warned || ((B._warned = !0), console.warn("[ui] draw", o));
          } finally {
            const o = W();
            (o && o.setSink && o.setSink(null), vt(), e.restore());
          }
        }
      },
      toast: ie,
      get items() {
        return s.items.map((e) => ({ id: e.id, x: e.x, y: e.y, w: e.w, h: e.h }));
      },
      _state: s,
      _tap: At,
      _key: Mt,
      _swipe: Et,
    });
})();
