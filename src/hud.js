/* hud.js */
(function () {
  "use strict";
  const A = (window.FZ = window.FZ || {}),
    te =
      '"Avenir Next Condensed","AvenirNextCondensed-HeavyItalic","Futura","Arial Narrow","DejaVu Sans Condensed","Roboto Condensed",sans-serif',
    H = "#090418",
    we = new Map();
  function ae(e, l, n) {
    const o = e * 4096 + (l || 800) * 2 + (n ? 1 : 0);
    let t = we.get(o);
    return (t || ((t = (n ? "" : "italic ") + (l || 800) + " " + e + "px " + te), we.set(o, t)), t);
  }
  let x = null;
  const ee = new Map();
  let ie = 0;
  function be(e, l, n, o) {
    const t = ae(l, n, o);
    let a = ee.get(t);
    a || ((a = new Map()), ee.set(t, a));
    let i = a.get(e);
    return (
      i === void 0 &&
        (x || (x = document.createElement("canvas").getContext("2d")),
        (x.font = t),
        (i = x.measureText(e).width),
        ie > 3e3 && (ee.clear(), (ie = 0), (a = new Map()), ee.set(t, a)),
        a.set(e, i),
        ie++),
      i
    );
  }
  const V = {
      CHROME: [
        [0, "#ffffff"],
        [0.42, "#c8f4ff"],
        [0.5, "#5aa8ff"],
        [0.54, "#2a3ca8"],
        [0.62, "#7c4ce8"],
        [1, "#ffb8f0"],
      ],
      GOLD: [
        [0, "#fffce8"],
        [0.4, "#ffe86a"],
        [0.5, "#ffb02c"],
        [0.56, "#e0661c"],
        [1, "#ffd870"],
      ],
      RED: [
        [0, "#ffe8ea"],
        [0.42, "#ff8090"],
        [0.5, "#ff3050"],
        [0.56, "#a8102c"],
        [1, "#ff6a80"],
      ],
      GREEN: [
        [0, "#f0fff6"],
        [0.42, "#8cffc8"],
        [0.5, "#2ae890"],
        [0.56, "#0c8a58"],
        [1, "#7cffc0"],
      ],
      CYAN: [
        [0, "#ffffff"],
        [0.42, "#a8f8ff"],
        [0.5, "#2ad0ff"],
        [0.56, "#1060c0"],
        [1, "#88e8ff"],
      ],
      VIOLET: [
        [0, "#ffffff"],
        [0.45, "#e4dcff"],
        [0.5, "#a090f4"],
        [1, "#d8ccff"],
      ],
      PANEL: [
        [0, "rgba(36,18,88,0.80)"],
        [1, "rgba(8,4,28,0.82)"],
      ],
      PANELHOT: [
        [0, "rgba(120,50,200,0.92)"],
        [1, "rgba(40,12,90,0.92)"],
      ],
      BTN: [
        [0, "rgba(52,24,118,0.86)"],
        [0.5, "rgba(26,10,66,0.86)"],
        [1, "rgba(12,4,36,0.88)"],
      ],
      BTNHOT: [
        [0, "#fff6c0"],
        [0.45, "#ffd84a"],
        [0.5, "#ff9a24"],
        [1, "#ffcc4a"],
      ],
      BTNGO: [
        [0, "#d8fff0"],
        [0.45, "#46f5a8"],
        [0.5, "#12b070"],
        [1, "#5cf0b0"],
      ],
    },
    N = {
      white: { color: "#ffffff" },
      chrome: { grad: "CHROME" },
      gold: { grad: "GOLD" },
      red: { grad: "RED" },
      green: { grad: "GREEN" },
      cyan: { grad: "CYAN" },
      violet: { grad: "VIOLET" },
      chromeG: { grad: "CHROME", glow: "#ff4fd8" },
      goldG: { grad: "GOLD", glow: "#ff8a1c" },
      redG: { grad: "RED", glow: "#ff2040" },
      greenG: { grad: "GREEN", glow: "#20ff9a" },
      cyanG: { grad: "CYAN", glow: "#20c8ff" },
      whiteG: { color: "#ffffff", glow: "#5ef0ff" },
      lbl: { color: "#5ef0ff", weight: 700 },
      lblPink: { color: "#ff8ae8", weight: 700 },
      lblGold: { color: "#ffe45c", weight: 700 },
      lblRed: { color: "#ff5468", weight: 700 },
      lblGreen: { color: "#46f5a8", weight: 700 },
      grey: { color: "#a49ad0", weight: 700 },
      dim: { color: "#6c62a0", weight: 700 },
      soft: { color: "#e8e2ff", weight: 600 },
      dark: { color: "#140826", stroke: "rgba(255,255,255,0.35)", lw: 0.08 },
    },
    Te = new WeakMap();
  let le = 0;
  function Me(e) {
    let l = Te.get(e);
    return (l || ((l = new Map()), Te.set(e, l)), le > 400 && (l.clear(), (le = 0)), l);
  }
  function me(e, l, n) {
    let o = e.get(l);
    o || ((o = new Map()), e.set(l, o));
    let t = o.get(n);
    return (t || ((t = new Map()), o.set(n, t)), t);
  }
  function se(e, l, n, o) {
    const t = me(Me(e), l, n);
    let a = t.get(o);
    if (!a) {
      a = e.createLinearGradient(0, n, 0, o);
      const i = V[l] || V.CHROME;
      for (let s = 0; s < i.length; s++) a.addColorStop(i[s][0], i[s][1]);
      (t.set(o, a), le++);
    }
    return a;
  }
  function ye(e, l, n, o, t) {
    const a = me(Me(e), l, n);
    let i = a.get(o);
    if (!i) {
      i = e.createLinearGradient(n, 0, o, 0);
      for (let s = 0; s < t.length; s++) i.addColorStop(t[s][0], t[s][1]);
      (a.set(o, i), le++);
    }
    return i;
  }
  function We(e, l, n, o, t, a, i) {
    ((e.font = ae(t, a.weight, a.upright)),
      (e.textAlign = "left"),
      (e.textBaseline = "alphabetic"),
      (e.lineJoin = "round"),
      (e.miterLimit = 2));
    const s = Math.min((a.lw != null ? a.lw : 0.15) * t, 2.4 + 0.07 * t);
    if (
      (a.glow &&
        (e.save(),
        (e.shadowColor = a.glow),
        (e.shadowBlur = t * 0.24 * i),
        (e.fillStyle = a.glow),
        (e.strokeStyle = a.glow),
        (e.lineWidth = s * 1.6),
        (e.globalAlpha = 0.9),
        e.strokeText(l, n, o),
        e.fillText(l, n, o),
        (e.shadowBlur = t * 0.12 * i),
        e.strokeText(l, n, o),
        e.restore()),
      a.stroke !== !1)
    ) {
      ((e.strokeStyle = a.stroke || H), (e.lineWidth = s), (e.fillStyle = a.stroke || H));
      const r = Math.min(4.5, Math.max(1, t * 0.045));
      (e.strokeText(l, n + r, o + r * 1.3), e.fillText(l, n + r, o + r * 1.3), e.strokeText(l, n, o));
    }
    a.grad
      ? (e.save(),
        e.translate(n, o),
        (e.fillStyle = se(e, a.grad, -Math.round(t * 0.74), Math.round(t * 0.04))),
        e.fillText(l, 0, 0),
        e.restore())
      : ((e.fillStyle = a.color || "#fff"), e.fillText(l, n, o));
  }
  class Ae {
    constructor() {
      ((this.on = !1), (this.full = !1), (this.n = 0), (this.r = []));
    }
    add(l, n, o, t) {
      const a = this.r;
      let i = this.n;
      ((a[i++] = l), (a[i++] = n), (a[i++] = o), (a[i++] = t), (this.n = i));
    }
    reset() {
      ((this.n = 0), (this.full = !1));
    }
  }
  let m = null;
  function re(e) {
    m = e && e.on ? e : null;
  }
  function Ye(e, l, n, o) {
    m && m.add(e, l, n, o);
  }
  const W = new Ae(),
    _e = {
      hud: W,
      clear(e, l, n, o) {
        const t = A.UI && A.UI.dirty,
          a = W.on && !W.full && (!t || (t.on && !t.full));
        if (a) {
          const i = t ? [W, t] : [W];
          for (let s = 0; s < i.length; s++) {
            const r = i[s],
              f = r.r;
            for (let h = 0; h < r.n; h += 4) {
              const d = Math.max(0, Math.floor(f[h] * l) - 2),
                c = Math.max(0, Math.floor(f[h + 1] * l) - 2),
                p = Math.min(n, Math.ceil((f[h] + f[h + 2]) * l) + 2),
                g = Math.min(o, Math.ceil((f[h + 1] + f[h + 3]) * l) + 2);
              p > d && g > c && e.clearRect(d, c, p - d, g - c);
            }
          }
        }
        return (W.reset(), (W.on = !0), t && (t.reset(), (t.on = !0)), a);
      },
    };
  let S = 2;
  function Se(e) {
    ne++;
    const l = e.canvas;
    if (l && l.height > 0) {
      const n = l.height / 360;
      n > 0 && (S = Math.min(4, Math.max(0.5, Math.round(n * 1e3) / 1e3)));
      return;
    }
    try {
      const n = e.getTransform(),
        o = Math.hypot(n.a, n.b);
      o > 0 && (S = Math.min(4, Math.max(0.5, Math.round(o * 1e3) / 1e3)));
    } catch {}
  }
  const fe = 4e7,
    he = new Map();
  let J = 0,
    ce = 0,
    ne = 0,
    Pe = 0;
  function Ue(e, l, n) {
    let o = he.get(e);
    o || ((o = new Map()), he.set(e, o));
    let t = o.get(l);
    t || ((t = new Map()), o.set(l, t));
    let a = t.get(n);
    return (a || ((a = new Map()), t.set(n, a)), a);
  }
  function Ke() {
    const e = [];
    for (const n of he.values()) for (const o of n.values()) for (const t of o.values()) for (const a of t.values()) e.push(a);
    e.sort((n, o) => n.t - o.t);
    const l = fe * 0.7;
    for (let n = 0; n < e.length && J > l; n++) {
      const o = e[n];
      if (o.t >= ne - 3) break;
      (o.map.delete(o.key), (J -= o.bytes), ce--);
    }
  }
  function v(e, l, n) {
    const o = Ue(S, n, l);
    let t = o.get(e);
    if (t) return ((t.t = ne), t);
    const a = N[n] || N.white,
      i = l >= 60 && !a.hq ? Math.min(S, 2) : S,
      s = be(e, l, a.weight, a.upright),
      r = Math.ceil(l * 0.12 + (a.glow ? l * 0.38 : 0) + 3),
      f = Math.ceil(l * 0.82),
      h = Math.ceil(l * 0.24),
      d = Math.ceil(l * 0.24),
      c = Math.ceil(s + d + r * 2),
      p = f + h + r * 2,
      g = document.createElement("canvas");
    ((g.width = Math.max(1, Math.ceil(c * i))), (g.height = Math.max(1, Math.ceil(p * i))));
    const T = g.getContext("2d");
    (T.scale(i, i), We(T, e, r, r + f, l, a, i));
    const G = g.width * g.height * 4;
    return (
      (t = { c: g, w: s, ox: r, oy: r + f, cw: g.width / i, ch: g.height / i, t: ne, bytes: G, map: o, key: e }),
      o.set(e, t),
      (J += G),
      ce++,
      Pe++,
      J > fe && Ke(),
      t
    );
  }
  const Q = [];
  let ke = 0;
  function Ge(e) {
    for (let l = 0; l < e.length; l++) Q.push(e[l]);
  }
  function Ve(e) {
    const l = performance.now();
    for (; Q.length;) {
      const n = Q.shift();
      if (n[3]) {
        for (let o = 0; o < 10; o++) v(Re[o], n[1], n[2]);
        (v("'", n[1], n[2]), v('"', n[1], n[2]), v("%", n[1], n[2]));
      } else v(n[0], n[1], n[2]);
      if (performance.now() - l >= e) break;
    }
    return Q.length > 0;
  }
  const D = (e) => Math.round(e * S) / S;
  function w(e, l, n, o, t, a, i, s, r) {
    if (((l = String(l)), !l)) return 0;
    const f = v(l, t, a),
      h = r || 1;
    let d = n - f.ox * h;
    if (
      (i === "center" ? (d -= (f.w * h) / 2) : i === "right" && (d -= f.w * h),
      m !== null && m.add(d - 1, o - f.oy * h - 1, f.cw * h + 2, f.ch * h + 2),
      s != null && s < 1)
    ) {
      if (s <= 0) return f.w * h;
      const c = e.globalAlpha;
      ((e.globalAlpha = c * s),
        h === 1 ? e.drawImage(f.c, D(d), D(o - f.oy), f.cw, f.ch) : e.drawImage(f.c, d, o - f.oy * h, f.cw * h, f.ch * h),
        (e.globalAlpha = c));
    } else h === 1 ? e.drawImage(f.c, D(d), D(o - f.oy), f.cw, f.ch) : e.drawImage(f.c, d, o - f.oy * h, f.cw * h, f.ch * h);
    return f.w * h;
  }
  function B(e, l, n) {
    const o = N[n] || N.white;
    return be(String(e), l, o.weight, o.upright);
  }
  const Ee = new Map(),
    Re = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  function Ce(e, l) {
    let n = Ee.get(l);
    n || ((n = new Map()), Ee.set(l, n));
    let o = n.get(e);
    if (o == null) {
      o = 0;
      for (let t = 0; t <= 9; t++) o = Math.max(o, B(Re[t], e, l));
      n.set(e, o);
    }
    return o;
  }
  const Oe = (e) => e >= "0" && e <= "9";
  function de(e, l, n) {
    const o = Ce(l, n);
    let t = 0;
    for (let a = 0; a < e.length; a++) {
      const i = e[a];
      t += Oe(i) ? o : B(i, l, n) * 0.92;
    }
    return t;
  }
  function F(e, l, n, o, t, a, i, s) {
    l = String(l);
    const r = Ce(t, a),
      f = de(l, t, a);
    let h = i === "center" ? n - f / 2 : i === "right" ? n - f : n;
    const d = e.globalAlpha;
    if ((s != null && (e.globalAlpha = d * s), m !== null && l.length)) {
      const c = v(l[0], t, a);
      m.add(h - c.ox - 1, o - c.oy - 1, f + c.cw * 2 + 2, c.ch + 2);
    }
    for (let c = 0; c < l.length; c++) {
      const p = l[c];
      if (Oe(p)) {
        const g = v(p, t, a);
        (e.drawImage(g.c, D(h + (r - g.w) / 2 - g.ox), D(o - g.oy), g.cw, g.ch), (h += r));
      } else {
        const g = v(p, t, a);
        (e.drawImage(g.c, D(h - g.ox), D(o - g.oy), g.cw, g.ch), (h += g.w * 0.92));
      }
    }
    return (s != null && (e.globalAlpha = d), f);
  }
  function R(e, l, n, o, t, a) {
    (e.beginPath(), e.moveTo(l + a, n), e.lineTo(l + o, n), e.lineTo(l + o - a, n + t), e.lineTo(l, n + t), e.closePath());
  }
  function Ie(e, l, n, o, t, a) {
    (e.beginPath(),
      e.moveTo(l + a, n),
      e.lineTo(l + o, n),
      e.lineTo(l + o, n + t - a),
      e.lineTo(l + o - a, n + t),
      e.lineTo(l, n + t),
      e.lineTo(l, n + a),
      e.closePath());
  }
  function U(e, l, n, o, t, a, i, s) {
    if (((s = s || Le), m !== null)) {
      const r = (s.lw || 1.25) + 4;
      m.add(l - r, n - r, o + 2 * r, t + 2 * r);
    }
    (s.slant != null ? R(e, l, n, o, t, s.slant) : Ie(e, l, n, o, t, s.cut != null ? s.cut : Math.min(8, t * 0.3)),
      a && ((e.fillStyle = V[a] ? se(e, a, Math.round(n), Math.round(n + t)) : a), e.fill()),
      i && ((e.strokeStyle = i), (e.lineWidth = s.lw || 1.25), e.stroke()),
      s.accent &&
        ((e.fillStyle = s.accent),
        s.slant != null
          ? (R(e, l - 2, n, 6 + s.slant, t, s.slant), e.fill())
          : e.fillRect(l, n + (s.cut != null ? s.cut : Math.min(8, t * 0.3)), 3, t - 2 * (s.cut != null ? s.cut : Math.min(8, t * 0.3)))));
  }
  const Le = {};
  function Ne(e, l, n, o, t, a, i) {
    m !== null && m.add((o < 0 ? l - t : l) - 2, n - 2, t + 4, a.length * 5 + 4);
    const s = e.globalAlpha;
    e.globalAlpha = s * (i ?? 1);
    for (let r = 0; r < a.length; r++) {
      const f = t * (1 - r * 0.22),
        h = n + r * 5;
      ((e.fillStyle = a[r]), o < 0 ? R(e, l - f, h, f, 2.5, 1.5) : R(e, l, h, f, 2.5, 1.5), e.fill());
    }
    e.globalAlpha = s;
  }
  const je = new Map();
  function Xe(e) {
    const l = e.color || "#ffffff",
      n = "c:" + (Array.isArray(l) ? l.join(",") : l) + (e.outline === null ? "n" : "");
    return (
      N[n] ||
        (Array.isArray(l)
          ? ((V[n] = l.map((o, t) => [t / Math.max(1, l.length - 1), o])), (N[n] = { grad: n }))
          : V[l]
            ? (N[n] = { grad: l })
            : (N[n] = { color: l }),
        e.outline === null && (N[n].stroke = !1),
        je.set(n, 1)),
      n
    );
  }
  const bl = (A.Font = {
      H: 7,
      family: te,
      measure(e, l) {
        return B(String(e), Math.round(9 * (l || 1)), "white");
      },
      draw(e, l, n, o, t) {
        t = t || Le;
        const a = Math.round(9 * (t.scale || 1));
        return w(e, String(l), n, o + a * 0.78, a, Xe(t), t.align, t.alpha);
      },
      rows() {
        return [];
      },
    }),
    P = {
      ink: H,
      white: "#f6f2ff",
      cyan: "#5ef0ff",
      blue: "#3c7cff",
      magenta: "#ff4fd8",
      pink: "#ff8ae8",
      amber: "#ffb43c",
      yellow: "#ffe45c",
      green: "#46f5a8",
      red: "#ff4058",
      grey: "#a49ad0",
      violet: "#8a7cd8",
    },
    Ze = ["#7af6ff", "#ff6a5a", "#b8ff6a", "#ffe27a", "#d2a8ff", "#ffb36a"],
    qe = ["NOVA", "KESTREL", "BRUTE", "VEGA", "HALCYON", "ONYX"],
    Je = (e) => "#" + ("000000" + ((e >>> 0) & 16777215).toString(16)).slice(-6),
    ue = [];
  function ve(e) {
    if (((e = (e | 0) % 6), e < 0 && (e += 6), ue[e])) return ue[e];
    let l = null;
    try {
      const n = A.SHIPS && A.SHIPS[e];
      if ((n && typeof n.glow == "number" && (l = Je(n.glow)), !l)) {
        const o = A.SHIP_COLORS && A.SHIP_COLORS[e];
        typeof o == "string" && o[0] === "#" ? (l = o) : o && typeof o == "object" && typeof o.css == "string" && (l = o.css);
      }
    } catch {}
    return (ue[e] = l || Ze[e]);
  }
  function Qe(e) {
    try {
      const l = A.SHIPS && A.SHIPS[e];
      if (l && l.name) return String(l.name).toUpperCase();
    } catch {}
    return qe[(((e | 0) % 6) + 6) % 6];
  }
  function j(e, l) {
    (e == null || !isFinite(e) || e < 0) && (e = 0);
    const n = Math.floor(e * 100 + 1e-6),
      o = Math.floor(n / 6e3),
      t = Math.floor(n / 100) % 60,
      a = n % 100;
    return (l && o === 0 ? "" : o + "'") + (t < 10 ? "0" : "") + t + '"' + (a < 10 ? "0" : "") + a;
  }
  function ge(e) {
    e = e | 0;
    const l = e % 100;
    return l >= 11 && l <= 13 ? "TH" : ["TH", "ST", "ND", "RD"][e % 10] || "TH";
  }
  const k = (e, l) => Math.floor(e * l * 2) % 2 === 0,
    Y = (e, l, n) => (e < l ? l : e > n ? n : e),
    u = {
      game: null,
      lap: 0,
      lapFlashT: -1e9,
      lapFlashTime: 0,
      lapFlashN: 0,
      lapBest: !1,
      finalT: -1e9,
      phase: "",
      finishT: -1e9,
      retireT: -1e9,
      goT: -1e9,
      lastT: 0,
      spd: 0,
      eTrail: 1,
      eLast: 1,
    };
  function $e(e) {
    ((u.game = e),
      (u.lap = e.player ? e.player.lap | 0 : 0),
      (u.lapFlashT = u.finalT = u.finishT = u.retireT = u.goT = -1e9),
      (u.phase = e.phase),
      (u.spd = 0),
      (u.eTrail = u.eLast = e.player ? +e.player.energy || 0 : 1));
  }
  function ze(e, l) {
    u.game !== e && $e(e);
    const n = e.player,
      o = e.laps || 5;
    if (
      (u.phase !== e.phase &&
        (e.phase === "racing" && u.phase === "countdown" && (u.goT = l),
        e.phase === "finished" && (u.finishT = l),
        e.phase === "retired" && (u.retireT = l),
        (u.phase = e.phase)),
      n)
    ) {
      const a = n.lap | 0;
      if (a > u.lap) {
        const i = n.lapTimes && n.lapTimes.length ? n.lapTimes[n.lapTimes.length - 1] : null;
        if (i != null && a <= o) {
          ((u.lapFlashT = l), (u.lapFlashTime = i), (u.lapFlashN = a));
          let s = 1 / 0;
          for (let r = 0; r < n.lapTimes.length - 1; r++) s = Math.min(s, n.lapTimes[r]);
          u.lapBest = a > 1 && i < s;
        }
        a === o - 1 && e.phase === "racing" && (u.finalT = l);
      }
      ((u.lap = a), n.finished && u.finishT < 0 && (u.finishT = l));
    }
    let t = l - u.lastT;
    if (((u.lastT = l), (t >= 0 && t < 0.25) || (t = 0.016), n)) {
      const a = (+n.speed || 0) * (A.KMH || 1.6);
      u.spd += (a - u.spd) * (1 - Math.exp(-t / 0.06));
      const i = Y(+n.energy || 0, 0, 1);
      i >= u.eTrail ? (u.eTrail = i) : (u.eTrail = Math.max(i, u.eTrail - t * 0.35));
    }
    return t;
  }
  function xe(e, l, n, o, t, a) {
    const i = o.laps || 5,
      s = l + 84;
    U(e, l - 4, n - 4, 262, 74, "PANEL", "rgba(94,240,255,0.45)", { slant: 14, accent: P.magenta });
    const r = t.place || 1,
      f = r === 1 ? "goldG" : r <= 3 ? "chromeG" : "violet",
      h = F(e, String(r), l + 12, n + 56, 58, f);
    (w(e, ge(r), l + 14 + h, n + 26, 19, r === 1 ? "gold" : "white"),
      w(e, "/" + ((o.ships && o.ships.length) || 6), l + 14 + h, n + 48, 14, "grey"),
      (e.fillStyle = "rgba(94,240,255,0.35)"),
      R(e, s - 10, n + 2, 2, 62, 10),
      e.fill());
    const d = t.finished && t.finishTime != null ? t.finishTime : +o.raceTime || 0;
    (w(e, "TIME", s + 6, n + 13, 11, "lblPink"), F(e, j(d), s + 4, n + 38, 25, "white"));
    const c = Math.min(i, (t.lap | 0) + 1);
    w(e, "LAP", s, n + 61, 11, "lbl");
    const p = F(e, String(t.finished ? i : c), s + 22, n + 63, 22, c === i ? "gold" : "white");
    if ((w(e, "/" + i, s + 24 + p, n + 63, 13, "soft"), !t.finished && o.phase === "racing")) {
      const g = Math.max(0, d - (+t.lapStart || 0));
      F(e, j(g), s + 158, n + 61, 15, "cyan", "right");
    }
  }
  const el = 178,
    ll = 14;
  function nl(e, l, n, o, t, a) {
    const i = el,
      s = ll,
      r = l - i,
      f = n + 17,
      h = 6,
      d = Y(+o.energy || 0, 0, 1),
      c = d < 0.25;
    (U(e, r - 16, n - 4, i + 20, 62, "PANEL", "rgba(255,79,216,0.45)", { slant: 12 }),
      w(e, "POWER", r - 2, n + 12, 11, c && k(t, 3.5) ? "lblRed" : "lblGold"),
      F(e, Math.round(d * 100) + "%", l - 4, n + 12, 11, c ? "lblRed" : "grey", "right"),
      R(e, r, f, i, s, h),
      (e.fillStyle = "rgba(10,4,30,0.85)"),
      e.fill(),
      (e.strokeStyle = "rgba(255,255,255,0.25)"),
      (e.lineWidth = 1),
      e.stroke());
    const p = Math.max(0, u.eTrail * (i - h));
    u.eTrail > d + 0.004 && (R(e, r, f, p + h, s, h), (e.fillStyle = "rgba(255,255,255,0.55)"), e.fill());
    const g = d * (i - h);
    if (g > 0.5) {
      R(e, r, f, g + h, s, h);
      let M = d > 0.5 ? ol : d > 0.25 ? tl : al;
      if (
        ((e.fillStyle = c && k(t, 3.5) ? "#ffffff" : ye(e, d > 0.5 ? "eg" : d > 0.25 ? "ea" : "er", r, r + i, M)),
        e.fill(),
        R(e, r + 1.5, f + 1.5, g + h - 3, 3.5, 1),
        (e.fillStyle = "rgba(255,255,255,0.45)"),
        e.fill(),
        o.inPit)
      ) {
        (e.save(), R(e, r, f, g + h, s, h), e.clip());
        const E = r + ((t * 220) % (i + 60)) - 30;
        ((e.fillStyle = "rgba(255,255,255,0.75)"), R(e, E, f, 16, s, 8), e.fill(), e.restore());
      }
    }
    ((e.strokeStyle = "rgba(9,4,24,0.55)"), (e.lineWidth = 1.2), e.beginPath());
    for (let M = 1; M < 12; M++) {
      const E = r + ((i - h) * M) / 12;
      (e.moveTo(E + h, f + 1), e.lineTo(E, f + s - 1));
    }
    e.stroke();
    const T = Y(o.boostsAvailable | 0, 0, 3),
      G = n + 38;
    for (let M = 0; M < 3; M++) {
      const E = l - 78 + M * 26 + 4,
        b = M < T,
        y = b && !o.boosting && k(t + M * 0.08, 2.5);
      (De(e, E, G, 20, 12),
        (e.fillStyle = b ? (y ? "#fff2a0" : P.amber) : "rgba(30,16,70,0.8)"),
        e.fill(),
        (e.strokeStyle = b ? "#ffffff" : "rgba(164,154,208,0.6)"),
        (e.lineWidth = 1),
        e.stroke());
    }
    (o.boosting
      ? w(e, "BOOST!", l - 78 - 4, G + 11, 14, k(t, 8) ? "whiteG" : "cyan", "right")
      : T > 0
        ? w(e, "BOOST", l - 78 - 4, G + 11, 13, "lblGold", "right", k(t, 2.5) ? 1 : 0.45)
        : w(e, "BOOST", l - 78 - 4, G + 11, 13, "dim", "right"),
      o.inPit && w(e, "RECHARGING", r - 4, G + 26, 12, k(t, 4) ? "lbl" : "white"));
  }
  const ol = [
      [0, "#0cb070"],
      [1, "#7cffc8"],
    ],
    tl = [
      [0, "#e0661c"],
      [1, "#ffe45c"],
    ],
    al = [
      [0, "#a8102c"],
      [1, "#ff5468"],
    ];
  function De(e, l, n, o, t) {
    const a = t * 0.45;
    (e.beginPath(),
      e.moveTo(l, n),
      e.lineTo(l + o - a, n),
      e.lineTo(l + o, n + t / 2),
      e.lineTo(l + o - a, n + t),
      e.lineTo(l, n + t),
      e.lineTo(l + a, n + t / 2),
      e.closePath());
  }
  const X = 34,
    _ = Math.PI + 0.42,
    $ = 2 * Math.PI - 0.42;
  let Z = null;
  function il(e, l) {
    if (Z && Z.cx === e && Z.cy === l) return Z;
    const n = [],
      o = 56;
    for (let a = 0; a < X; a++) {
      const i = a / (X - 1),
        s = _ + (($ - _) * (a + 0.12)) / X,
        r = _ + (($ - _) * (a + 0.88)) / X,
        f = 62 + i * 7,
        h = new Path2D();
      (h.moveTo(e + Math.cos(s) * o, l + Math.sin(s) * o),
        h.lineTo(e + Math.cos(s) * f, l + Math.sin(s) * f),
        h.lineTo(e + Math.cos(r) * f, l + Math.sin(r) * f),
        h.lineTo(e + Math.cos(r) * o, l + Math.sin(r) * o),
        h.closePath(),
        n.push({ p: h, f: i, col: i < 0.55 ? "#5ef0ff" : i < 0.8 ? "#ffe45c" : "#ff4fd8" }));
    }
    const t = new Path2D();
    return (
      t.arc(e, l, 75, _ - 0.06, $ + 0.06),
      t.arc(e, l, 49, $ + 0.06, _ - 0.06, !0),
      t.closePath(),
      (Z = { cx: e, cy: l, segs: n, back: t }),
      Z
    );
  }
  function sl(e, l, n, o, t) {
    const a = n + 10,
      i = il(l, a);
    (m !== null && m.add(l - 84, a - 86, 168, 70),
      (e.fillStyle = "rgba(8,4,26,0.55)"),
      e.fill(i.back),
      (e.strokeStyle = "rgba(94,240,255,0.30)"),
      (e.lineWidth = 1),
      e.stroke(i.back));
    const s = Y(u.spd / 560, 0, 1),
      r = s * X,
      f = !!o.boosting;
    for (let g = 0; g < X; g++) {
      const T = i.segs[g];
      (g < r
        ? ((e.fillStyle = f && k(t + g * 0.02, 8) ? "#ffffff" : T.col), (e.globalAlpha = g + 1 > r ? 0.4 + 0.6 * (r - g) : 1))
        : ((e.fillStyle = "rgba(60,36,120,0.55)"), (e.globalAlpha = 1)),
        e.fill(T.p));
    }
    e.globalAlpha = 1;
    const h = _ + ($ - _) * s,
      d = Math.cos(h),
      c = Math.sin(h);
    (e.beginPath(),
      e.moveTo(l + d * 77, a + c * 77),
      e.lineTo(l + d * 52 - c * 3, a + c * 52 + d * 3),
      e.lineTo(l + d * 52 + c * 3, a + c * 52 - d * 3),
      e.closePath(),
      (e.fillStyle = f ? "#ffffff" : "#ffe45c"),
      e.fill(),
      (e.strokeStyle = H),
      (e.lineWidth = 1),
      e.stroke());
    const p = Math.max(0, Math.round(u.spd));
    (F(e, String(p), l + 4, n - 16, 34, f && k(t, 6) ? "cyanG" : "chrome", "center"),
      w(e, "KM/H", l + 4, n - 3, 10, f ? "lblGold" : "lbl", "center"));
  }
  let O = null;
  function rl(e, l) {
    const n = e && e.path;
    if (!n || n.length < 8) return null;
    let o = 1 / 0,
      t = 1 / 0,
      a = -1 / 0,
      i = -1 / 0;
    for (let b = 0; b < n.length; b += 2) {
      const y = n[b],
        C = n[b + 1];
      (y < o && (o = y), y > a && (a = y), C < t && (t = C), C > i && (i = C));
    }
    const s = 7,
      r = (l - 2 * s) / Math.max(1, a - o, i - t),
      f = s + (l - 2 * s - (a - o) * r) / 2 - o * r,
      h = s + (l - 2 * s - (i - t) * r) / 2 - t * r,
      d = document.createElement("canvas");
    ((d.width = Math.ceil(l * S)), (d.height = Math.ceil(l * S)));
    const c = d.getContext("2d");
    c.scale(S, S);
    const p = n.length / 2,
      g = Math.max(1, Math.floor(p / 500)),
      T = new Path2D();
    for (let b = 0; b <= p; b += g) {
      const y = (b % p) * 2,
        C = n[y] * r + f,
        L = n[y + 1] * r + h;
      b === 0 ? T.moveTo(C, L) : T.lineTo(C, L);
    }
    (T.closePath(),
      (c.lineJoin = "round"),
      (c.lineCap = "round"),
      (c.strokeStyle = H),
      (c.lineWidth = 7),
      c.stroke(T),
      c.save(),
      (c.shadowColor = "#a070ff"),
      (c.shadowBlur = 6 * S),
      (c.strokeStyle = "rgba(138,124,216,0.9)"),
      (c.lineWidth = 4),
      c.stroke(T),
      c.restore(),
      (c.strokeStyle = "#f0ecff"),
      (c.lineWidth = 1.4),
      c.stroke(T));
    const G = n[0] * r + f,
      M = n[1] * r + h,
      E = e.ang ? e.ang[0] + Math.PI / 2 : 0;
    return (
      (c.strokeStyle = P.yellow),
      (c.lineWidth = 2.2),
      c.beginPath(),
      c.moveTo(G - Math.cos(E) * 5, M - Math.sin(E) * 5),
      c.lineTo(G + Math.cos(E) * 5, M + Math.sin(E) * 5),
      c.stroke(),
      { track: e, size: l, k: r, ox: f, oy: h, canvas: d, dpr: S }
    );
  }
  function fl(e, l, n, o, t, a) {
    const i = t.track;
    if (!i || !i.path || ((!O || O.track !== i || O.size !== o || Math.abs(O.dpr - S) > 0.01) && (O = rl(i, o)), !O)) return;
    (U(e, l - 4, n - 4, o + 8, o + 8, "rgba(10,4,30,0.42)", "rgba(138,124,216,0.5)", { cut: 10 }),
      e.drawImage(O.canvas, D(l), D(n), O.canvas.width / S, O.canvas.height / S));
    const s = O.k,
      r = O.ox + l,
      f = O.oy + n,
      h = t.ships || [];
    let d = null;
    ((e.lineWidth = 1.2), (e.strokeStyle = H));
    for (let c = 0; c < h.length; c++) {
      const p = h[c];
      if (!(!p || p.exploded)) {
        if (p.isPlayer) {
          d = p;
          continue;
        }
        (e.beginPath(), e.arc(p.x * s + r, p.y * s + f, 2.6, 0, 6.2832), (e.fillStyle = ve(p.colorIdx)), e.fill(), e.stroke());
      }
    }
    if (d) {
      const c = d.x * s + r,
        p = d.y * s + f,
        g = +d.angle || 0,
        T = 4 + (k(a, 3) ? 1.5 : 0);
      (e.beginPath(),
        e.arc(c, p, T + 2.5, 0, 6.2832),
        (e.strokeStyle = "rgba(255,255,255,0.6)"),
        e.stroke(),
        e.beginPath(),
        e.moveTo(c + Math.cos(g) * 6, p + Math.sin(g) * 6),
        e.lineTo(c + Math.cos(g + 2.5) * 4.5, p + Math.sin(g + 2.5) * 4.5),
        e.lineTo(c + Math.cos(g - 2.5) * 4.5, p + Math.sin(g - 2.5) * 4.5),
        e.closePath(),
        (e.fillStyle = "#ffffff"),
        e.fill(),
        (e.strokeStyle = H),
        e.stroke());
    }
  }
  const q = 0.58,
    I = 82;
  let K = null;
  function hl(e, l, n) {
    const o = A.Input;
    if (!o || !o.tiltActive || o.mode !== "race") return;
    const t = o.layout === "tilt";
    if (!K || K.cx !== l || K.cy !== n) {
      const p = new Path2D(),
        g = -Math.PI / 2;
      p.arc(l, n, I, g - q, g + q);
      const T = new Path2D();
      for (const G of [-1, -0.5, 0, 0.5, 1]) {
        const M = g + G * q,
          E = G === 0 ? I - 5 : I - 3;
        (T.moveTo(l + Math.cos(M) * E, n + Math.sin(M) * E), T.lineTo(l + Math.cos(M) * (I + 3), n + Math.sin(M) * (I + 3)));
      }
      K = { cx: l, cy: n, p, ticks: T };
    }
    m !== null && m.add(l - 56, n - 98, 112, 38);
    const a = e.globalAlpha;
    ((e.globalAlpha = a * (t ? 0.9 : 0.35)),
      (e.lineCap = "round"),
      (e.strokeStyle = "rgba(10,4,30,0.75)"),
      (e.lineWidth = 5),
      e.stroke(K.p),
      (e.strokeStyle = "rgba(164,154,208,0.55)"),
      (e.lineWidth = 1.2),
      e.stroke(K.p),
      e.stroke(K.ticks));
    const i = Y(+o.tiltSteer || 0, -1, 1),
      s = -Math.PI / 2,
      r = Math.abs(i) > 0.97,
      f = t && o.tiltLean;
    Math.abs(i) > 0.01 &&
      (e.beginPath(),
      e.arc(l, n, I, i < 0 ? s + i * q : s, i < 0 ? s : s + i * q),
      (e.strokeStyle = r ? P.magenta : P.cyan),
      (e.lineWidth = 3),
      e.stroke());
    const h = s + i * q,
      d = Math.cos(h),
      c = Math.sin(h);
    (e.beginPath(),
      e.moveTo(l + d * (I + 6), n + c * (I + 6)),
      e.lineTo(l + d * (I - 5) - c * 3.5, n + c * (I - 5) + d * 3.5),
      e.lineTo(l + d * (I - 5) + c * 3.5, n + c * (I - 5) - d * 3.5),
      e.closePath(),
      (e.fillStyle = f ? "#ffffff" : r ? P.magenta : P.yellow),
      e.fill(),
      (e.strokeStyle = H),
      (e.lineWidth = 1),
      e.stroke(),
      (e.lineCap = "butt"),
      (e.globalAlpha = a));
  }
  function He(e, l, n, o, t, a) {
    m !== null && m.add(-22, n - o / 2 - 6, l + 44, o + 12);
    const i = e.globalAlpha;
    ((e.globalAlpha = i * a),
      (e.fillStyle = "rgba(10,4,32,0.72)"),
      R(e, -20, n - o / 2, l + 40, o, 16),
      e.fill(),
      (e.fillStyle = t),
      R(e, -20, n - o / 2 - 3, l + 40, 2, 1),
      e.fill(),
      R(e, -20, n + o / 2 + 1, l + 40, 2, 1),
      e.fill(),
      (e.globalAlpha = i));
  }
  function pe(e, l, n, o, t, a, i, s) {
    const r = Math.max(0, 1 - i / 0.22),
      f = Math.min(1, i / 0.12),
      h = l / 2 + r * r * l * 0.7;
    (He(e, l, n, s * 1.2, a, f),
      Ne(e, h - B(o, s, t) / 2 - 24, n - 6, -1, 120, [a, P.cyan, P.amber], f),
      w(e, o, h, n + s * 0.36, s, t, "center"));
  }
  function cl(e, l, n, o) {
    if (n.phase === "countdown") {
      const a = Math.max(0, +n.countdown || 0),
        i = Math.ceil(a);
      if (i > 3) {
        w(e, "READY", l / 2, 172, 64, "cyanG", "center", k(o, 2) ? 1 : 0.6);
        return;
      }
      if (i < 1) return;
      const s = i - a,
        r = Math.pow(Math.max(0, 1 - s / 0.25), 2),
        f = i === 3 ? "redG" : i === 2 ? "goldG" : "greenG",
        h = i === 3 ? P.red : i === 2 ? P.amber : P.green;
      s < 0.5 &&
        (m !== null && m.add(l / 2 - 180, 38, 360, 224),
        (e.globalAlpha = 0.8 * (1 - s / 0.5)),
        (e.strokeStyle = h),
        (e.lineWidth = 4 * (1 - s)),
        e.beginPath(),
        e.ellipse(l / 2, 150, 40 + s * 260, (40 + s * 260) * 0.62, 0, 0, 6.2832),
        e.stroke(),
        (e.globalAlpha = 1));
      const d = (1 + r * 0.5) / 1.5;
      w(e, String(i), l / 2, 150 + 52 * d * 1.5 * 0.72, 150, f, "center", 1, d);
    } else if (n.phase === "racing") {
      const a = o - u.goT,
        i = +n.raceTime || 0;
      if (!(i < 2.5 && ((u.goT > 0 && a < 1.1) || (u.goT < 0 && i < 1)))) return;
      const r = u.goT > 0 ? a : i,
        f = r < 0.12 ? 1 : 0.85;
      w(
        e,
        "GO!",
        l / 2,
        150 + 150 * 0.36 * f,
        150,
        k(r, 6) ? "cyanG" : "greenG",
        "center",
        r > 0.8 ? Math.max(0, 1 - (r - 0.8) / 0.3) : 1,
        f,
      );
    }
  }
  function dl() {
    return { count: ce, bytes: J, budget: fe, misses: Pe, queued: Q.length };
  }
  const ul = [
      ["3", 150, "redG"],
      ["2", 150, "goldG"],
      ["1", 150, "greenG"],
      ["GO!", 150, "cyanG"],
      ["GO!", 150, "greenG"],
      ["FINAL LAP", 46, "goldG"],
      ["FINAL LAP", 46, "chromeG"],
      ["FINISH!", 52, "goldG"],
      ["RETIRED", 52, "redG"],
      ["1ST PLACE", 28, "goldG"],
      ["2ND PLACE", 28, "chrome"],
      ["3RD PLACE", 28, "chrome"],
      ["4TH PLACE", 28, "chrome"],
      ["5TH PLACE", 28, "chrome"],
      ["6TH PLACE", 28, "chrome"],
      ["WRONG WAY", 40, "redG"],
      ["TURN AROUND", 14, "white"],
      ["LOW POWER", 20, "redG"],
      ["MACHINE DESTROYED", 16, "white"],
      ["BEST LAP!", 16, "gold"],
      [null, 58, "goldG", 1],
      [null, 58, "chromeG", 1],
      [null, 58, "violet", 1],
      [null, 34, "chrome", 1],
      [null, 34, "cyanG", 1],
      [null, 25, "white", 1],
      [null, 22, "white", 1],
      [null, 22, "gold", 1],
      [null, 15, "cyan", 1],
      [null, 11, "grey", 1],
      [null, 11, "lblRed", 1],
      [null, 34, "goldG", 1],
      [null, 18, "white", 1],
      [null, 18, "gold", 1],
      ["ST", 19, "gold"],
      ["ND", 19, "white"],
      ["RD", 19, "white"],
      ["TH", 19, "white"],
      ["TIME", 11, "lblPink"],
      ["LAP", 11, "lbl"],
      ["KM/H", 10, "lbl"],
      ["LAP 2", 16, "lbl"],
      ["LAP 3", 16, "lbl"],
      ["LAP 4", 16, "lbl"],
      ["LAP 5", 16, "lbl"],
      ["LAP 2", 14, "lbl"],
      ["LAP 3", 14, "lbl"],
      ["LAP 4", 14, "lbl"],
      ["LAP 5", 14, "lbl"],
      ["/5", 13, "soft"],
      ["/3", 13, "soft"],
      ["/6", 14, "grey"],
      ["POWER", 11, "lblGold"],
      ["BOOST", 13, "lblGold"],
      ["BOOST!", 14, "whiteG"],
      ["BOOST!", 14, "cyan"],
      ["RECHARGING", 12, "lbl"],
    ],
    oe = (A.HUD = {
      fmtTime: j,
      ordinal: ge,
      shipColor: ve,
      shipColorName: Qe,
      palette: P,
      grad: { GOLD: "GOLD", CHROME: "CHROME", REDG: "RED", GREENG: "GREEN", CYANG: "CYAN" },
      panel: U,
      kit: {
        T: w,
        N: F,
        tw: B,
        numW: de,
        font: ae,
        FAM: te,
        slant: R,
        cut: Ie,
        panel: U,
        stripes: Ne,
        chevron: De,
        gradV: se,
        gradH: ye,
        syncScale: Se,
        STOPS: V,
        STY: N,
        INK: H,
        blink: k,
        clamp: Y,
        sprite: v,
        DirtyList: Ae,
        setSink: re,
        mark: Ye,
        prewarm: Ge,
        pumpWarm: Ve,
        spriteStats: dl,
        dpr: () => S,
        pauseSink: () => {
          const e = m;
          return ((m = null), e);
        },
        resumeSink: (e) => {
          m = e;
        },
      },
      dirty: _e,
      prewarmRace() {
        ke !== S && ((ke = S), Ge(ul));
      },
      draw(e, l, n, o, t) {
        if (!(!e || !o)) {
          (e.save(), re(W));
          try {
            pl(e, l, n, o, t || 0);
          } catch (a) {
            oe._warned || ((oe._warned = !0), console.warn("[hud]", a));
          }
          (re(null), e.restore());
        }
      },
    }),
    Be = { x: 0, y: 88, w: 262, h: 52 };
  function gl(e, l, n, o, t) {
    const a = A.Story;
    if (!(!a || !a.active))
      try {
        const i = a.chapter,
          s = +o.raceTime || 0;
        if (i && i.goalText && (o.phase === "countdown" || (o.phase === "racing" && s < 6.5))) {
          const r = o.phase === "countdown" ? 1 : Y((6.5 - s) / 1.2, 0, 1),
            f = "CHAPTER " + (i.num != null ? i.num : "") + "  \xB7  " + String(i.title || ""),
            h = String(i.goalText),
            d = Math.max(B(f, 11, "lblPink"), B(h, 16, "gold") + 64) + 40,
            c = l / 2 - d / 2,
            p = 214;
          ((e.globalAlpha = r),
            U(e, c, p, d, 42, "rgba(10,4,30,0.72)", "rgba(255,228,92,0.7)", { slant: 12, lw: 1.5 }),
            w(e, f, l / 2, p + 15, 11, "lblPink", "center", r),
            w(e, "GOAL", c + 22, p + 34, 11, "lbl", "left", r),
            w(e, h, c + 64, p + 35, 16, "gold", "left", r),
            (e.globalAlpha = 1));
        }
        ((Be.x = n - 4), a.drawComm && a.drawComm(e, Be, t));
      } catch (i) {
        ((e.globalAlpha = 1), oe._warnedS || ((oe._warnedS = !0), console.warn("[hud] story overlay", i)));
      }
  }
  function pl(e, l, n, o, t) {
    const a = o.player || (o.ships && o.ships.find((y) => y.isPlayer)) || null,
      i = ze(o, t),
      s = n / 360,
      r = l / s,
      f = 360;
    (s !== 1 && e.scale(s, s), Se(e));
    const h = A.Input && A.Input.safeArea ? A.Input.safeArea(l, n) : { l: 0, r: 0, t: 0, b: 0 },
      d = h.l / s,
      c = h.r / s,
      p = h.t / s,
      g = h.b / s,
      T = Math.max(12, d + 8),
      G = r - Math.max(12, c + 8),
      M = Math.max(10, p + 6),
      E = f - Math.max(8, g + 3);
    ((e.imageSmoothingEnabled = !0),
      a &&
        (xe(e, T, M, o, a, t),
        nl(e, G, M, a, t, i),
        fl(e, G - 78, M + 70, 78, o, t),
        sl(e, r / 2, E, a, t),
        a.energy < 0.25 &&
          o.phase === "racing" &&
          !a.inPit &&
          !a.exploded &&
          k(t, 2) &&
          w(e, "LOW POWER", r / 2, 236, 20, "redG", "center")),
      cl(e, r, o, t),
      gl(e, r, T, o, t));
    const b = 112;
    if (o.phase === "finished" || (a && a.finished)) {
      const y = t - (u.finishT > 0 ? u.finishT : t);
      (pe(e, r, b, "FINISH!", "goldG", P.amber, y, 52),
        a &&
          a.place &&
          w(
            e,
            a.place + ge(a.place) + " PLACE",
            r / 2,
            b + 62,
            28,
            a.place === 1 ? "goldG" : "chrome",
            "center",
            Y((y - 0.3) / 0.2, 0, 1),
          ));
    } else if (o.phase === "retired" || (a && a.exploded)) {
      const y = t - (u.retireT > 0 ? u.retireT : t);
      (pe(e, r, b, "RETIRED", "redG", P.red, y, 52), w(e, "MACHINE DESTROYED", r / 2, b + 56, 16, "white", "center", k(t, 1.5) ? 1 : 0.5));
    } else if (o.phase === "racing" && a) {
      const y = t - u.finalT,
        C = t - u.lapFlashT;
      if (y >= 0 && y < 2.6) {
        if (((y < 2.2 || k(t, 6)) && pe(e, r, b, "FINAL LAP", k(t, 4) ? "goldG" : "chromeG", P.magenta, y, 46), C >= 0 && C < 2.6)) {
          const L = "LAP " + u.lapFlashN,
            z = B(L, 14, "lbl") + 10,
            wl = de(j(u.lapFlashTime), 18, "white"),
            Fe = r / 2 - (z + wl) / 2;
          (w(e, L, Fe, b + 50, 14, "lbl"), F(e, j(u.lapFlashTime), Fe + z, b + 50, 18, u.lapBest ? "gold" : "white"));
        }
      } else if (C >= 0 && C < 2.6) {
        const L = Math.min(1, C / 0.1) * (C > 2.3 ? Math.max(0, (2.6 - C) / 0.3) : 1);
        (He(e, r, b + 2, 50, u.lapBest ? P.amber : P.cyan, L * 0.8),
          w(e, "LAP " + u.lapFlashN, r / 2 - 70, b + 8, 16, "lbl", "right", L),
          F(e, j(u.lapFlashTime), r / 2 - 60, b + 14, 34, u.lapBest ? "goldG" : "chrome", "left", L),
          u.lapBest && k(t, 3) && w(e, "BEST LAP!", r / 2, b + 46, 16, "gold", "center", L));
      }
      if (a.wrongWay) {
        if (k(t, 2.5)) {
          const z = B("WRONG WAY", 40, "redG");
          (U(e, r / 2 - z / 2 - 26, 146, z + 52, 54, "rgba(70,0,20,0.72)", P.red, { slant: 12, lw: 2 }),
            w(e, "WRONG WAY", r / 2, 186, 40, "redG", "center"));
        }
        w(e, "TURN AROUND", r / 2, 216, 14, "white", "center");
      }
    }
    if ((hl(e, r / 2, E + 10), A.Input && A.Input.setBoostReady))
      try {
        A.Input.setBoostReady(a && o.phase === "racing" ? (a.boostsAvailable | 0) > 0 && !a.boosting : null);
      } catch {}
  }
})();
