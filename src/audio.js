/* audio.js */
(function () {
  "use strict";
  const z = (window.FZ = window.FZ || {}),
    Se = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 },
    Je = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  function me(t) {
    let n = Se[t[0]];
    return (t[1] === "#" ? n++ : t[1] === "b" && n--, (n + 12) % 12);
  }
  function ue(t) {
    const n = /^([A-G])([#b]?)(\d)$/.exec(t);
    if (!n) return null;
    let e = Se[n[1]] + (n[2] === "#" ? 1 : n[2] === "b" ? -1 : 0);
    return (+n[3] + 1) * 12 + e;
  }
  function xe(t) {
    return Je[((t % 12) + 12) % 12] + (Math.floor(t / 12) - 1);
  }
  const V = (t) => 440 * Math.pow(2, (t - 69) / 12),
    Ye = {
      major: [0, 2, 4, 5, 7, 9, 11],
      ionian: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      aeolian: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      phrygian: [0, 1, 3, 5, 7, 8, 10],
      lydian: [0, 2, 4, 6, 7, 9, 11],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      harmonic: [0, 2, 3, 5, 7, 8, 11],
    };
  function pe(t) {
    const [n, e] = t.split(" "),
      a = me(n);
    return Ye[e].map((c) => (a + c) % 12);
  }
  const Oe = {
      "": [0, 4, 7],
      m: [0, 3, 7],
      5: [0, 7],
      maj7: [0, 4, 7, 11],
      m7: [0, 3, 7, 10],
      7: [0, 4, 7, 10],
      maj9: [0, 4, 7, 11, 14],
      m9: [0, 3, 7, 10, 14],
      9: [0, 4, 7, 10, 14],
      sus4: [0, 5, 7],
      sus2: [0, 2, 7],
      "7sus4": [0, 5, 7, 10],
      6: [0, 4, 7, 9],
      m6: [0, 3, 7, 9],
      m7b5: [0, 3, 6, 10],
      dim: [0, 3, 6],
      aug: [0, 4, 8],
      add9: [0, 4, 7, 14],
      madd9: [0, 3, 7, 14],
      mmaj7: [0, 3, 7, 11],
      "7b9": [0, 4, 7, 10, 13],
      m11: [0, 3, 7, 10, 17],
      69: [0, 4, 7, 9, 14],
    },
    ge = {};
  function Ce(t) {
    if (ge[t]) return ge[t];
    const n = /^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/.exec(t);
    if (!n || !Oe[n[2]]) throw new Error("bad chord " + t);
    const e = me(n[1]),
      a = Oe[n[2]];
    return (ge[t] = { sym: t, root: e, bass: n[3] ? me(n[3]) : e, iv: a, pcs: a.map((c) => (e + c) % 12) });
  }
  function $(t) {
    const n = [];
    for (const e of String(t).replace(/\|/g, " ").split(/\s+/)) {
      if (!e || e === "|") continue;
      const a = /^(.+)\*(\d+)$/.exec(e);
      if (a) {
        n.push(a[1]);
        for (let c = 1; c < +a[2]; c++) n.push(a[1] === "." ? "." : "-");
      } else n.push(e);
    }
    return n;
  }
  function Ze(t, n, e) {
    const a = pe(e);
    return $(t)
      .map((c) => {
        const i = c[0] === "^" ? "^" : "",
          s = i ? c.slice(1) : c,
          r = /^([A-G][#b]?\d)(.*)$/.exec(s);
        if (!r) return c;
        const o = ue(r[1]);
        let u = -1;
        for (let p = 0; p < 7; p++) a[p] === o % 12 && (u = p);
        let h = o,
          f = u,
          d = n;
        if (f < 0) for (let p = 1; p < 12 && f < 0; p++) for (let m = 0; m < 7; m++) a[m] === (o - p + 120) % 12 && ((f = m), (h = o - p));
        for (; d > 0;) {
          const p = (f + 1) % 7;
          ((h += (a[p] - a[f] + 12) % 12), (f = p), d--);
        }
        for (; d < 0;) {
          const p = (f + 6) % 7;
          ((h -= (a[f] - a[p] + 12) % 12), (f = p), d++);
        }
        return i + xe(h) + r[2];
      })
      .join(" ");
  }
  function J(t, n) {
    return $(t)
      .map((e) => {
        const a = e[0] === "^" ? "^" : "",
          c = a ? e.slice(1) : e,
          i = /^([A-G][#b]?\d)(.*)$/.exec(c);
        return i ? a + xe(ue(i[1]) + n) + i[2] : e;
      })
      .join(" ");
  }
  const q = (t) => ({ gen: "fig", s: t }),
    M = (t) => ({ gen: "stab", s: t }),
    R = (t) => ({ gen: "pad", s: t || "" }),
    G = (t) => ({ gen: "arp", s: t }),
    Y = (t, n, e) => ({ gen: "harm", src: t, lo: n || 3, hi: e || 9 }),
    Ge = { R: 0, O: 12, b2: 1, 2: 2, b3: 3, 4: 5, b5: 6, b6: 8, 6: 9, b7: 10, u: 19, L: -12 };
  function be(t, n, e) {
    let a = t.pcs.slice();
    e && a.length > e && (a = a.filter((s, r) => r !== 2 || a.length <= e).slice(0, Math.max(e, 1)));
    const c = n - 6,
      i = a.map((s) => c + ((((s - c) % 12) + 12) % 12));
    return Array.from(new Set(i)).sort((s, r) => s - r);
  }
  function et(t, n) {
    const e = [];
    let a = null;
    for (const i of $(t)) (i !== "." && i !== "-" && (a = Ce(i)), e.push(a));
    const c = new Array(n);
    for (let i = 0; i < n; i++) c[i] = e.length ? e[Math.floor(i / 4) % e.length] : null;
    return c;
  }
  function Be(t, n, e, a) {
    if (t.length === n) return t;
    if (t.length && n % t.length === 0) {
      const i = [];
      for (; i.length < n;) i.push(...t);
      return i;
    }
    e.push(a + ": " + t.length + " tokens for " + n + " steps");
    const c = t.slice(0, n);
    for (; c.length < n;) c.push(".");
    return c;
  }
  function tt(t, n) {
    return t === "X"
      ? 1
      : t === "x"
        ? n || 0.72
        : t === "g"
          ? 0.36
          : t >= "1" && t <= "9"
            ? +t / 10
            : t === "L" || t === "M" || t === "H"
              ? 1
              : 0.72;
  }
  const Fe = { K: "kick", S: "snare", H: "hat", O: "ohat", C: "crash", P: "clap", R: "rim", Q: "pump" },
    Me = { bars: 1, chords: 1, dr: 1, fill: 1, scale: 1, fx: 1, ramp: 1, opt: 1 };
  function Ee(t) {
    const n = [],
      e = pe(t.scale),
      a = {};
    for (const r in t.pat) {
      const o = t.pat[r],
        u = o.bars * 16,
        h = [];
      for (let p = 0; p < u; p++) h.push([]);
      const f = o.chords ? et(o.chords, u) : null,
        d = t.id + "." + r;
      for (const p in o) {
        if (Me[p]) continue;
        const m = o[p],
          x = t.ch[p];
        if (!x) {
          n.push(d + ": unknown channel " + p);
          continue;
        }
        if (typeof m == "string") {
          const g = Be($(m), u, n, d + "." + p);
          let y = null;
          g.forEach((b, v) => {
            if (b === "-") {
              y && y.len++;
              return;
            }
            if (b === ".") {
              y = null;
              return;
            }
            let T = 0.8,
              O = !1;
            (b[0] === "^" && ((O = !0), (b = b.slice(1))),
              b.endsWith("!") ? ((T = 1), (b = b.slice(0, -1))) : b.endsWith("'") && ((T = 0.55), (b = b.slice(0, -1))));
            const X = b.split("+").map(ue);
            if (X.some((C) => C == null)) {
              (n.push(d + "." + p + ": bad token " + b + " @" + v), (y = null));
              return;
            }
            ((y = { ch: p, m: X.length === 1 ? X[0] : X, len: 1, v: T, sl: O }), h[v].push(y));
          });
        } else {
          if (m && m.gen === "harm") continue;
          if (m && m.gen) {
            if (!f) {
              n.push(d + ": generator needs chords");
              continue;
            }
            if (m.gen === "pad") {
              let b = null;
              for (let v = 0; v < u; v++)
                if (!b || f[v] !== f[v - 1]) {
                  if (!f[v]) {
                    b = null;
                    continue;
                  }
                  ((b = { ch: p, m: be(f[v], x.center || 60, x.max || 4), len: 1, v: 0.8 }), h[v].push(b));
                } else b.len++;
              continue;
            }
            const g = Be($(m.s), u, n, d + "." + p);
            let y = null;
            g.forEach((b, v) => {
              if (b === "-") {
                y && y.len++;
                return;
              }
              if (b === ".") {
                y = null;
                return;
              }
              const T = f[v];
              if (!T) {
                y = null;
                return;
              }
              let O = 0.8;
              if ((b.endsWith("!") && ((O = 1), (b = b.slice(0, -1))), m.gen === "stab")) {
                if (b !== "x" && b !== "X") {
                  n.push(d + "." + p + ": bad stab " + b);
                  return;
                }
                y = { ch: p, m: be(T, x.center || 64, x.max || 4), len: 1, v: b === "X" ? 1 : 0.75 };
              } else if (m.gen === "arp") {
                const X = +b;
                if (isNaN(X)) {
                  n.push(d + "." + p + ": bad arp " + b);
                  return;
                }
                const C = be(T, x.center || 72, 0);
                y = { ch: p, m: C[X % C.length] + 12 * Math.floor(X / C.length), len: 1, v: O * (v % 4 === 0 ? 1 : 0.82) };
              } else {
                const X = x.lo == null ? 28 : x.lo,
                  C = X + ((((T.root - X) % 12) + 12) % 12),
                  de = X + ((((T.bass - X) % 12) + 12) % 12);
                let I,
                  U = !1;
                if (b === "R") ((I = de), (O = O === 1 ? 1 : 0.85));
                else if (b === "g") ((I = de), (U = !0), (O = 0.4));
                else if (b === "a") {
                  let L = null;
                  for (let F = v + 1; F < u + 16; F++) {
                    const j = f[F % u];
                    if (j !== T || F % 16 === 0) {
                      L = j;
                      break;
                    }
                  }
                  ((L = L || T), (I = X + ((((L.bass - X) % 12) + 12) % 12) - 1), I < X - 1 && (I += 12));
                } else if (b === "3") I = C + (T.iv[1] > 12 ? T.iv[1] - 12 : T.iv[1]);
                else if (b === "5") {
                  const L = T.iv.find((F) => F >= 6 && F <= 8);
                  I = C + (L ?? 7);
                } else if (b === "7") {
                  const L = T.iv.find((F) => F === 10 || F === 11 || F === 9);
                  I = C + (L ?? 12);
                } else if (b in Ge) ((I = C + Ge[b]), b === "O" && (O = O === 1 ? 1 : 0.95));
                else {
                  n.push(d + "." + p + ": bad fig token " + b);
                  return;
                }
                y = { ch: p, m: I, len: 1, v: O, ghost: U };
              }
              h[v].push(y);
            });
          }
        }
      }
      for (const p in o) {
        if (Me[p]) continue;
        const m = o[p];
        if (!(!m || m.gen !== "harm")) {
          if (!f) {
            n.push(d + ": harm needs chords");
            continue;
          }
          for (let x = 0; x < u; x++)
            for (const g of h[x].slice()) {
              if (g.ch !== m.src || Array.isArray(g.m)) continue;
              const y = f[x];
              let b = null,
                v = 99;
              for (let T = m.lo; T <= m.hi; T++) {
                const O = g.m - T,
                  X = O % 12;
                if (!y.pcs.includes(X)) continue;
                const C = Math.abs(T - 4) + (y.pcs.indexOf(X) === 0 ? 0.5 : 0);
                C < v && ((v = C), (b = O));
              }
              (b == null && (b = g.m - 5), h[x].push({ ch: p, m: b, len: g.len, v: g.v * 0.9, sl: !1 }));
            }
        }
      }
      if (o.dr) {
        const p = Object.assign({}, o.dr);
        for (const m in p) {
          const x = String(p[m]).replace(/\s+/g, "").split("|"),
            g = [];
          for (let y = 0; y < o.bars; y++) g.push(x[y % x.length]);
          (o.fill && o.fill[m] != null && (g[o.bars - 1] = o.fill[m].replace(/\s+/g, "")), (p[m] = g));
        }
        if (o.fill) {
          for (const m in o.fill)
            if (!p[m]) {
              const x = [];
              for (let g = 0; g < o.bars; g++) x.push(".".repeat(16));
              ((x[o.bars - 1] = o.fill[m].replace(/\s+/g, "")), (p[m] = x));
            }
        }
        for (const m in p)
          p[m].forEach((x, g) => {
            x.length !== 16 && n.push(d + ".dr." + m + " bar " + (g + 1) + ": " + x.length + " chars");
            for (let y = 0; y < 16 && y < x.length; y++) {
              const b = x[y];
              if (b === ".") continue;
              const v = g * 16 + y;
              if (m === "T") {
                const T = b.toLowerCase();
                if ("lmh".indexOf(T) < 0) {
                  n.push(d + ".dr.T bad " + b);
                  continue;
                }
                h[v].push({ drum: "tom" + T, v: b === T ? 0.75 : 1 });
              } else Fe[m] ? h[v].push({ drum: Fe[m], v: tt(b) }) : n.push(d + ": unknown drum lane " + m);
            }
          });
      }
      if (o.fx)
        for (const p of $(o.fx)) {
          const m = /^(\w+)@(\d+)(?:\/(\d+))?$/.exec(p);
          if (!m || !Ie[m[1]] || +m[2] >= u) {
            n.push(d + ": bad fx " + p);
            continue;
          }
          h[+m[2]].push({ fx: m[1], len: +(m[3] || 16) });
        }
      for (const p of h) p.sort((m, x) => (x.drum === "kick" || x.drum === "pump") - (m.drum === "kick" || m.drum === "pump"));
      a[r] = { name: r, steps: u, ev: h, prog: f, scale: o.scale ? pe(o.scale) : e, ramp: o.ramp || null, opt: o.opt || null };
    }
    for (const r of t.order) a[r] || n.push(t.id + ": order references missing pattern " + r);
    for (const r in t.ch) r !== "dr" && !ae[t.ch[r].ins] && n.push(t.id + ": unknown instrument " + t.ch[r].ins);
    const c = 60 / t.bpm / 4;
    let i = 0,
      s = 0;
    return (
      t.order.forEach((r, o) => {
        const u = a[r] ? a[r].steps : 0;
        t.loop >= 0 && o >= t.loop ? (s += u) : (i += u);
      }),
      {
        def: t,
        id: t.id,
        title: t.title,
        bpm: t.bpm,
        pats: a,
        order: t.order,
        loop: t.loop,
        errs: n,
        scale: e,
        introSec: i * c,
        loopSec: s * c,
        stepSec: c,
        totalSec: (i + s) * c,
      }
    );
  }
  function nt() {
    const n = new Float32Array(2048),
      e = 0.62,
      a = 0.36;
    for (let c = 0; c < 2048; c++) {
      const i = (c / 2047) * 2 - 1,
        s = Math.abs(i),
        r = s < e ? s : e + a * Math.tanh((s - e) / a);
      n[c] = Math.sign(i) * r;
    }
    return n;
  }
  function at(t) {
    const e = new Float32Array(1024);
    for (let a = 0; a < 1024; a++) {
      const c = (a / 1023) * 2 - 1;
      e[a] = Math.tanh(c * t) / Math.tanh(t);
    }
    return e;
  }
  function De(t) {
    const e = new Float32Array(1024);
    for (let a = 0; a < 1024; a++) {
      const c = (a / 1023) * 2 - 1;
      e[a] = Math.round(c * t) / t;
    }
    return e;
  }
  function ve(t, n) {
    const e = { ctx: t, waves: {}, curves: {}, jobs: [], ss: [], grit: null, built: !1 },
      a = t.sampleRate;
    ((e.pre = t.createGain()),
      (e.glue = t.createDynamicsCompressor()),
      (e.glue.threshold.value = -16),
      (e.glue.knee.value = 10),
      (e.glue.ratio.value = 2.5),
      (e.glue.attack.value = 0.012),
      (e.glue.release.value = 0.2),
      (e.comp = t.createDynamicsCompressor()),
      (e.comp.threshold.value = -5),
      (e.comp.knee.value = 1),
      (e.comp.ratio.value = 20),
      (e.comp.attack.value = 0.0015),
      (e.comp.release.value = 0.12),
      (e.clip = t.createWaveShaper()),
      (e.clip.curve = nt()),
      (e.master = t.createGain()),
      (e.master.gain.value = 1),
      e.pre.connect(e.glue),
      e.glue.connect(e.comp),
      e.comp.connect(e.clip),
      e.clip.connect(e.master),
      e.master.connect(t.destination),
      (e.music = t.createGain()),
      (e.music.gain.value = 0.7),
      (e.duck = t.createGain()),
      (e.duck.gain.value = 1),
      (e.sfx = t.createGain()),
      (e.sfx.gain.value = 0.9),
      e.music.connect(e.duck),
      e.duck.connect(e.pre),
      e.sfx.connect(e.pre),
      (e.echoIn = t.createGain()),
      (e.echoIn.channelCount = 1),
      (e.echoIn.channelCountMode = "explicit"),
      (e.echoIn.channelInterpretation = "speakers"),
      (e.delay = t.createDelay(2)),
      (e.delay.delayTime.value = 0.3),
      (e.delayR = t.createDelay(2)),
      (e.delayR.delayTime.value = 0.3),
      (e.elp = t.createBiquadFilter()),
      (e.elp.type = "lowpass"),
      (e.elp.frequency.value = 5200),
      (e.elp.Q.value = 0.4),
      (e.ehp = t.createBiquadFilter()),
      (e.ehp.type = "highpass"),
      (e.ehp.frequency.value = 260),
      (e.efb = t.createGain()),
      (e.efb.gain.value = 0.35),
      (e.efb2 = t.createGain()),
      (e.efb2.gain.value = 0.35),
      (e.ewet = t.createGain()),
      (e.ewet.gain.value = 0.5));
    const c = t.createChannelMerger(2);
    (e.echoIn.connect(e.ehp),
      e.ehp.connect(e.delay),
      e.delay.connect(e.elp),
      e.elp.connect(e.efb),
      e.efb.connect(e.delayR),
      e.delayR.connect(e.efb2),
      e.efb2.connect(e.delay),
      e.elp.connect(c, 0, 0),
      e.delayR.connect(c, 0, 1),
      c.connect(e.ewet),
      e.ewet.connect(e.music),
      (e.revIn = t.createGain()),
      (e.rev = t.createConvolver()),
      (e.rev.normalize = !0),
      (e.revHp = t.createBiquadFilter()),
      (e.revHp.type = "highpass"),
      (e.revHp.frequency.value = 220),
      (e.revWet = t.createGain()),
      (e.revWet.gain.value = 0.55),
      e.revIn.connect(e.revHp),
      e.revHp.connect(e.rev),
      e.rev.connect(e.revWet),
      e.revWet.connect(e.music),
      (e.sEchoIn = t.createGain()),
      (e.sDelay = t.createDelay(1)),
      (e.sDelay.delayTime.value = 0.17),
      (e.sFb = t.createGain()),
      (e.sFb.gain.value = 0.3),
      (e.sLp = t.createBiquadFilter()),
      (e.sLp.type = "lowpass"),
      (e.sLp.frequency.value = 3e3),
      e.sEchoIn.connect(e.sDelay),
      e.sDelay.connect(e.sLp),
      e.sLp.connect(e.sFb),
      e.sFb.connect(e.sDelay),
      e.sLp.connect(e.sfx),
      (e.noise = lt(t, 1.5)),
      e.jobs.push(it(e, 2.6)));
    for (const i of [220, 440, 110, 880]) e.jobs.push(ot(e, i));
    return (
      (e.setEcho = function (i, s, r, o) {
        o = o ?? t.currentTime;
        const u = Math.min(1.9, Math.max(0.05, i));
        (e.delay.delayTime.setTargetAtTime(u, o, 0.05),
          e.delayR.delayTime.setTargetAtTime(u, o, 0.05),
          e.efb.gain.setTargetAtTime(s, o, 0.05),
          e.efb2.gain.setTargetAtTime(s, o, 0.05),
          e.ewet.gain.setTargetAtTime(r, o, 0.05));
      }),
      (n && n.lazy) || st(e),
      e
    );
  }
  function Pe(t, n) {
    const e = performance.now();
    for (; t.jobs.length && performance.now() - e < n;) {
      let a;
      try {
        a = t.jobs[0].next();
      } catch {
        a = { done: !0 };
      }
      a.done && t.jobs.shift();
    }
    return (t.jobs.length || (t.built = !0), t.jobs.length > 0);
  }
  function st(t) {
    for (; Pe(t, 1e9););
  }
  function rt(t) {
    const n = typeof window < "u" && window.requestIdleCallback,
      e = (c) => {
        if (t.ctx.state === "closed") return;
        const i = c && c.timeRemaining ? c.timeRemaining() : 0;
        Pe(t, Math.min(7, Math.max(3, i - 1))) && a();
      },
      a = () => {
        n ? n(e, { timeout: 150 }) : setTimeout(e, 24);
      };
    a();
  }
  function* it(t, n) {
    const e = t.ctx,
      a = e.sampleRate,
      c = Math.floor(a * n),
      i = e.createBuffer(2, c, a),
      s = Math.floor(a * 0.018),
      r = Math.exp(-6.9 / (n * a)),
      o = 16384;
    for (let u = 0; u < 2; u++) {
      const h = i.getChannelData(u);
      let f = 991 + u * 7919,
        d = 0,
        p = 1;
      for (let m = s; m < c; m += o) {
        const x = Math.min(c, m + o);
        for (let g = m; g < x; g++) {
          f = (f * 1103515245 + 12345) & 2147483647;
          const y = (g - s) / a,
            b = f / 1073741823 - 1,
            v = 0.75 - 0.6 * Math.min(1, y / n);
          d += (b - d) * v;
          const T = y < 0.08 && (f & 63) === 0 ? 2.5 : 1;
          ((h[g] = d * T * p * Math.min(1, y / 0.01)), (p *= r));
        }
        yield;
      }
    }
    t.rev.buffer = i;
  }
  const ct = (function () {
    const t = new Float32Array(4096);
    for (let n = 0; n < 4096; n++) t[n] = Math.sin((2 * Math.PI * n) / 4096);
    return t;
  })();
  function* ot(t, n) {
    const e = t.ctx,
      a = e.sampleRate,
      c = Math.max(0.5, 220 / n),
      i = Math.round(a * c),
      s = e.createBuffer(2, i, a),
      r = s.getChannelData(0),
      o = s.getChannelData(1),
      u = 4096,
      h = Math.max(2, Math.floor(a / 2 / (n * 2.05))),
      f = new Float32Array(u + 1);
    for (let v = 1; v <= h; v++) {
      const T = (1 / v) * (v > h * 0.7 ? (h - v) / (h * 0.3) : 1);
      for (let O = 0, X = 0; O < u; O++, X = (X + v) & 4095) f[O] += T * ct[X];
    }
    ((f[u] = f[0]), yield);
    const d = [-34, -21, -10, 0, 9, 22, 33],
      p = [-1, 0.65, -0.35, 0, 0.35, -0.65, 1],
      m = [0.8, 0.9, 1, 1.1, 1, 0.9, 0.8];
    let x = n * 31;
    const g = 32768;
    for (let v = 0; v < 7; v++) {
      const T = Math.max(1, Math.round(n * Math.pow(2, d[v] / 1200) * c)) / c,
        O = (T * u) / a;
      x = (x * 1103515245 + 12345) & 2147483647;
      let X = (x / 2147483647) * u;
      x = (x * 1103515245 + 12345) & 2147483647;
      let C = v === 3 ? X : (x / 2147483647) * u;
      const de = m[v] * Math.sqrt((1 - p[v] * 0.6) / 2),
        I = m[v] * Math.sqrt((1 + p[v] * 0.6) / 2);
      for (let U = 0; U < i; U += g) {
        const L = Math.min(i, U + g);
        for (let F = U; F < L; F++) {
          let j = X | 0;
          ((r[F] += (f[j] + (f[j + 1] - f[j]) * (X - j)) * de),
            (j = C | 0),
            (o[F] += (f[j] + (f[j + 1] - f[j]) * (C - j)) * I),
            (X += O),
            X >= u && (X -= u),
            (C += O),
            C >= u && (C -= u));
        }
        yield;
      }
    }
    let y = 0;
    for (let v = 0; v < i; v++) y = Math.max(y, Math.abs(r[v]), Math.abs(o[v]));
    const b = 0.9 / y;
    for (let v = 0; v < i; v++) ((r[v] *= b), (o[v] *= b));
    (t.ss.push({ root: n, buf: s }), t.ss.sort((v, T) => v.root - T.root));
  }
  function lt(t, n) {
    const e = Math.floor(t.sampleRate * n),
      a = t.createBuffer(1, e, t.sampleRate),
      c = a.getChannelData(0);
    let i = 12345;
    for (let s = 0; s < e; s++) ((i = (i * 1103515245 + 12345) & 2147483647), (c[s] = i / 1073741823 - 1));
    return a;
  }
  function ut(t) {
    const n = t.sampleRate,
      e = Math.floor(n * 1),
      a = t.createBuffer(1, e, n),
      c = a.getChannelData(0);
    let i = 4242,
      s = 0;
    for (let r = 0; r < e; r++) {
      i = (i * 1103515245 + 12345) & 2147483647;
      const o = i / 2147483647;
      (o < 0.0016 && (s = 1), (s *= 0.996), (c[r] = (o * 2 - 1) * (0.35 + s * 0.65) * ((r >> 5) & 1 ? 1 : 0.7)));
    }
    return a;
  }
  function _(t, n) {
    const e = "p" + n;
    if (t.waves[e]) return t.waves[e];
    const a = 48,
      c = new Float32Array(a),
      i = new Float32Array(a);
    for (let s = 1; s < a; s++)
      ((c[s] = Math.sin(2 * Math.PI * s * n) / (s * Math.PI)), (i[s] = (1 - Math.cos(2 * Math.PI * s * n)) / (s * Math.PI)));
    return (t.waves[e] = t.ctx.createPeriodicWave(c, i));
  }
  function pt(t) {
    if (t.waves.organ) return t.waves.organ;
    const n = [0, 1, 0.75, 0.5, 0.55, 0, 0.3, 0, 0.28, 0, 0.12, 0, 0.1],
      e = new Float32Array(n.length),
      a = new Float32Array(n);
    return (t.waves.organ = t.ctx.createPeriodicWave(e, a));
  }
  function Te(t, n, e) {
    return t.curves[n] || (t.curves[n] = e());
  }
  function He(t, n, e, a, c, i, s, r) {
    (t.setValueAtTime(0, n),
      t.linearRampToValueAtTime(a, n + c),
      t.setTargetAtTime(a * i, n + c, s),
      t.setTargetAtTime(0, Math.max(e, n + c + 0.002), r));
  }
  function Z(t, n, e, a, c, i, s) {
    const r = t.createOscillator(),
      o = t.createGain();
    ((r.frequency.value = i || 5.6),
      o.gain.setValueAtTime(0, e),
      o.gain.setValueAtTime(0, e + (s || 0.14)),
      o.gain.linearRampToValueAtTime(c, e + (s || 0.14) + 0.25),
      r.connect(o));
    for (const u of n) o.connect(u);
    (r.start(e), r.stop(a + 0.3));
  }
  const ae = {
    supersaw(t, n, e, a, c, i, s, r, o) {
      const u = t.ctx;
      if ((Array.isArray(a) || (a = [a]), !t.ss.length)) return;
      const h = s.att == null ? 0.006 : s.att,
        f = s.rel == null ? 0.12 : s.rel,
        d = e + Math.max(c, h + 0.01),
        p = u.createBiquadFilter();
      ((p.type = "lowpass"), (p.Q.value = s.q || 0.9));
      const m = (s.cut || 3e3) * (0.65 + 0.35 * i);
      s.env
        ? (p.frequency.setValueAtTime(m + s.env, e), p.frequency.setTargetAtTime(m, e, s.envT || 0.08))
        : p.frequency.setValueAtTime(m, e);
      const x = u.createGain(),
        g = (i * (s.gain || 0.3)) / Math.sqrt(a.length);
      (x.gain.setValueAtTime(0, e),
        x.gain.linearRampToValueAtTime(g, e + h),
        s.sus != null && x.gain.setTargetAtTime(g * s.sus, e + h, s.dec || 0.15),
        x.gain.setTargetAtTime(0, d, f / 3),
        p.connect(x),
        x.connect(n));
      for (const y of a) {
        const b = V(y);
        let v = t.ss[0];
        for (const O of t.ss) O.root <= b * 1.03 && (v = O);
        const T = u.createBufferSource();
        ((T.buffer = v.buf),
          (T.loop = !0),
          o && r != null && a.length === 1
            ? (T.playbackRate.setValueAtTime(V(r) / v.root, e),
              T.playbackRate.exponentialRampToValueAtTime(b / v.root, e + (s.slide || 0.07)))
            : (T.playbackRate.value = b / v.root),
          s.vib && c > 0.3 && Z(u, [T.detune], e, d, s.vib, s.vibRate || 5.5, 0.18),
          T.connect(p),
          T.start(e, (y * 0.0731) % v.buf.duration),
          T.stop(d + f * 1.6));
      }
    },
    reese(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = e + Math.max(c, 0.04),
        h = t._sd || 0.12,
        f = r.createBiquadFilter();
      ((f.type = "lowpass"), (f.Q.value = s.q || 4));
      const d = s.cut || 420;
      if (s.wobble) {
        f.frequency.setValueAtTime(d, e);
        const x = r.createOscillator(),
          g = r.createGain();
        ((x.type = s.lfoType || "triangle"),
          (x.frequency.value = 1 / (s.wobble * h)),
          (g.gain.value = s.wdepth || d * 3.2),
          x.connect(g),
          g.connect(f.frequency),
          x.start(e),
          x.stop(u + 0.1));
      } else (f.frequency.setValueAtTime(d + (s.env == null ? 2200 : s.env) * i, e), f.frequency.setTargetAtTime(d, e, s.envT || 0.07));
      const p = r.createGain();
      (p.gain.setValueAtTime(0, e), p.gain.linearRampToValueAtTime(i * (s.gain || 0.42), e + 0.004), p.gain.setTargetAtTime(0, u, 0.02));
      const m = s.det || 16;
      for (const x of [-m, m]) {
        const g = r.createOscillator();
        ((g.type = "sawtooth"), (g.frequency.value = o), (g.detune.value = x), g.connect(f), g.start(e), g.stop(u + 0.15));
      }
      if (s.sq !== 0) {
        const x = r.createOscillator(),
          g = r.createGain();
        (x.setPeriodicWave(_(t, 0.5)),
          (x.frequency.value = o * 0.5),
          (g.gain.value = s.sq || 0.5),
          x.connect(g),
          g.connect(f),
          x.start(e),
          x.stop(u + 0.15));
      }
      (f.connect(p), p.connect(n));
    },
    sub(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = e + Math.max(c, 0.04),
        u = r.createOscillator(),
        h = r.createGain();
      ((u.type = "sine"),
        (u.frequency.value = V(a)),
        h.gain.setValueAtTime(0, e),
        h.gain.linearRampToValueAtTime(i * (s.gain || 0.6), e + 0.006),
        h.gain.setTargetAtTime(0, o, 0.02),
        u.connect(h),
        h.connect(n),
        u.start(e),
        u.stop(o + 0.12));
    },
    spluck(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = s.decay || 0.22,
        h = e + Math.min(Math.max(c, 0.03), u * 3),
        f = r.createBiquadFilter();
      ((f.type = "lowpass"),
        (f.Q.value = s.q || 2),
        f.frequency.setValueAtTime(Math.min(16e3, (s.floor || 400) + (s.bright || 5e3) * i), e),
        f.frequency.setTargetAtTime(s.floor || 400, e, u * 0.35));
      const d = r.createGain();
      (d.gain.setValueAtTime(0, e),
        d.gain.linearRampToValueAtTime(i * (s.gain || 0.36), e + 0.002),
        d.gain.setTargetAtTime(i * (s.gain || 0.36) * (s.sus || 0), e + 0.002, u * 0.45),
        d.gain.setTargetAtTime(0, h, 0.02));
      const p = r.createOscillator();
      ((p.type = "sawtooth"), (p.frequency.value = o), (p.detune.value = -(s.det || 7)));
      const m = r.createOscillator();
      (m.setPeriodicWave(_(t, s.duty || 0.5)), (m.frequency.value = o * (s.oct || 1)), (m.detune.value = s.det || 7));
      const x = s.wide == null ? 0.6 : s.wide;
      if (x && r.createStereoPanner) {
        const g = r.createStereoPanner(),
          y = r.createStereoPanner();
        ((g.pan.value = -x), (y.pan.value = x), p.connect(g), g.connect(f), m.connect(y), y.connect(f));
      } else (p.connect(f), m.connect(f));
      (f.connect(d), d.connect(n), p.start(e), m.start(e), p.stop(h + 0.12), m.stop(h + 0.12));
    },
    square(t, n, e, a, c, i, s, r, o) {
      const u = t.ctx,
        h = V(a),
        f = e + Math.max(c, 0.03),
        d = s.rel || 0.03,
        p = u.createOscillator();
      (p.setPeriodicWave(_(t, s.duty || 0.5)),
        o && r != null
          ? (p.frequency.setValueAtTime(V(r), e), p.frequency.exponentialRampToValueAtTime(h, e + (s.slide || 0.06)))
          : p.frequency.setValueAtTime(h, e));
      const m = u.createGain();
      (He(m.gain, e, f, i * (s.gain || 0.5), 0.004, s.sus == null ? 0.7 : s.sus, s.dec || 0.15, d),
        p.connect(m),
        m.connect(n),
        s.vib && c > 0.24 && Z(u, [p.detune], e, f, s.vib, s.vibRate, s.vibDelay),
        p.start(e),
        p.stop(f + d * 7));
    },
    brass(t, n, e, a, c, i, s, r, o) {
      const u = t.ctx,
        h = V(a),
        f = e + Math.max(c, 0.06),
        d = s.rel || 0.06,
        p = u.createBiquadFilter();
      ((p.type = "lowpass"), (p.Q.value = s.q || 1.6));
      const m = s.cut || 450,
        x = m + (s.bright || 3e3) * i,
        g = s.fa || 0.045;
      (p.frequency.setValueAtTime(m * 0.6, e),
        p.frequency.linearRampToValueAtTime(x, e + g),
        p.frequency.setTargetAtTime(m + (x - m) * (s.fsus || 0.4), e + g, 0.15),
        p.frequency.setTargetAtTime(m * 0.6, f, 0.05));
      const y = u.createGain();
      He(y.gain, e, f, i * 0.42, 0.018, s.sus || 0.78, 0.25, d);
      const b = [];
      for (const v of [-7, 7]) {
        const T = u.createOscillator();
        ((T.type = "sawtooth"),
          o && r != null
            ? (T.frequency.setValueAtTime(V(r), e), T.frequency.exponentialRampToValueAtTime(h, e + 0.07))
            : T.frequency.setValueAtTime(h, e),
          T.detune.setValueAtTime(v - (s.fall == null ? 30 : s.fall), e),
          T.detune.linearRampToValueAtTime(v, e + 0.06),
          T.connect(p),
          T.start(e),
          T.stop(f + d * 7),
          b.push(T.detune));
      }
      (s.vib && c > 0.3 && Z(u, b, e, f, s.vib, s.vibRate || 5.2, 0.2), p.connect(y), y.connect(n));
    },
    strings(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = s.att || 0.2,
        h = e + Math.max(c, u),
        f = s.rel || 0.3,
        d = r.createBiquadFilter();
      ((d.type = "lowpass"), (d.frequency.value = s.cut || 2200), (d.Q.value = 0.5));
      const p = r.createGain();
      (p.gain.setValueAtTime(0, e), p.gain.linearRampToValueAtTime(i * 0.28, e + u), p.gain.setTargetAtTime(0, h, f));
      const m = s.det || 10;
      for (const x of [-m, m]) {
        const g = r.createOscillator();
        ((g.type = "sawtooth"),
          (g.frequency.value = o),
          (g.detune.value = x),
          g.connect(d),
          g.start(e),
          g.stop(h + f * 6),
          s.vib && c > 0.4 && Z(r, [g.detune], e, h, s.vib, 5, 0.3));
      }
      (d.connect(p), p.connect(n));
    },
    organ(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = e + Math.max(c, 0.04),
        h = s.rel || 0.05,
        f = r.createOscillator();
      (f.setPeriodicWave(pt(t)), (f.frequency.value = o));
      const d = r.createGain();
      (d.gain.setValueAtTime(0, e),
        d.gain.linearRampToValueAtTime(i * 0.35, e + 0.008),
        d.gain.setTargetAtTime(i * 0.3, e + 0.008, 0.2),
        d.gain.setTargetAtTime(0, u, h),
        f.connect(d),
        d.connect(n),
        s.vib && c > 0.3 && Z(r, [f.detune], e, u, s.vib, 6.5, 0.05),
        f.start(e),
        f.stop(u + h * 7));
    },
    bell(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = s.decay || 1.1,
        h = e + (s.damp ? Math.min(c, u) : u),
        f = r.createOscillator();
      f.frequency.value = o;
      const d = r.createOscillator();
      d.frequency.value = o * (s.ratio || 3.5);
      const p = r.createGain();
      (p.gain.setValueAtTime(o * (s.index || 2.4), e), p.gain.setTargetAtTime(o * 0.15, e, u * 0.25), d.connect(p), p.connect(f.frequency));
      const m = r.createGain();
      (m.gain.setValueAtTime(0, e),
        m.gain.linearRampToValueAtTime(i * 0.42, e + 0.003),
        m.gain.setTargetAtTime(0, e + 0.003, u * 0.3),
        s.damp && m.gain.setTargetAtTime(0, h, 0.04),
        f.connect(m),
        m.connect(n),
        f.start(e),
        d.start(e),
        f.stop(h + 0.4),
        d.stop(h + 0.4));
    },
    pluck(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = e + Math.max(c, 0.03),
        h = s.decay || 0.22,
        f = r.createOscillator();
      (f.setPeriodicWave(_(t, s.duty || 0.125)), (f.frequency.value = o));
      const d = r.createBiquadFilter();
      ((d.type = "lowpass"),
        (d.Q.value = s.q || 3),
        d.frequency.setValueAtTime(300 + (s.bright || 4500) * i, e),
        d.frequency.setTargetAtTime(s.floor || 500, e, 0.07));
      const p = r.createGain();
      (p.gain.setValueAtTime(0, e),
        p.gain.linearRampToValueAtTime(i * 0.45, e + 0.002),
        p.gain.setTargetAtTime(0, e + 0.002, h * 0.4),
        p.gain.setTargetAtTime(0, u, 0.02),
        f.connect(d),
        d.connect(p),
        p.connect(n),
        f.start(e),
        f.stop(Math.min(u, e + h * 2.5) + 0.12));
    },
    grit(t, n, e, a, c, i, s) {
      const r = t.ctx,
        o = V(a),
        u = e + Math.max(c, 0.05),
        h = r.createBiquadFilter();
      ((h.type = "lowpass"),
        (h.Q.value = s.q || 5),
        h.frequency.setValueAtTime(180 + (s.bright || 2600) * i * i, e),
        h.frequency.setTargetAtTime(s.floor || 320, e, 0.08));
      const f = r.createGain();
      (f.gain.setValueAtTime(0, e), f.gain.linearRampToValueAtTime(i * 0.6, e + 0.004), f.gain.setTargetAtTime(0, u, 0.025));
      const d = r.createOscillator();
      ((d.type = "sawtooth"), (d.frequency.value = o));
      const p = r.createOscillator();
      (p.setPeriodicWave(_(t, 0.5)), (p.frequency.value = o * 0.5));
      const m = r.createGain();
      ((m.gain.value = 0.6),
        d.connect(h),
        p.connect(m),
        m.connect(h),
        h.connect(f),
        f.connect(n),
        d.start(e),
        p.start(e),
        d.stop(u + 0.2),
        p.stop(u + 0.2));
    },
  };
  function P(t, n, e) {
    const a = t.ctx.createBufferSource();
    return ((a.buffer = t.noise), (a.loop = !0), e && (a.playbackRate.value = e), (a._off = (n * 7.31) % 1.2), a);
  }
  const ee = {
      kick(t, n, e, a, c) {
        const i = t.ctx,
          s = i.createOscillator(),
          r = i.createGain(),
          o = c.kLen || 0.42,
          u = c.kf || 230,
          h = c.kEnd || 47;
        (s.frequency.setValueAtTime(u, e),
          s.frequency.exponentialRampToValueAtTime(h * 1.25, e + 0.035),
          s.frequency.exponentialRampToValueAtTime(h, e + 0.18),
          r.gain.setValueAtTime(0, e),
          r.gain.linearRampToValueAtTime(a * 0.95, e + 0.002),
          r.gain.setValueAtTime(a * 0.95, e + 0.05),
          r.gain.exponentialRampToValueAtTime(0.001, e + o),
          s.connect(r),
          r.connect(n.kit),
          s.start(e),
          s.stop(e + o + 0.02));
        const f = P(t, e),
          d = i.createGain(),
          p = i.createBiquadFilter();
        ((p.type = "bandpass"),
          (p.frequency.value = 4200),
          (p.Q.value = 0.7),
          d.gain.setValueAtTime(a * 0.5, e),
          d.gain.exponentialRampToValueAtTime(0.001, e + 0.008),
          f.connect(p),
          p.connect(d),
          d.connect(n.kit),
          f.start(e, f._off),
          f.stop(e + 0.015));
      },
      snare(t, n, e, a, c) {
        const i = t.ctx,
          s = c.sGate || 0.1,
          r = P(t, e),
          o = i.createBiquadFilter(),
          u = i.createGain();
        ((o.type = "bandpass"),
          (o.frequency.value = c.sTone || 2e3),
          (o.Q.value = 0.55),
          u.gain.setValueAtTime(a * 0.8, e),
          u.gain.exponentialRampToValueAtTime(a * 0.32, e + s),
          u.gain.linearRampToValueAtTime(0, e + s + 0.025),
          r.connect(o),
          o.connect(u),
          u.connect(n.snr),
          r.start(e, r._off),
          r.stop(e + s + 0.04));
        const h = i.createOscillator(),
          f = i.createGain();
        ((h.type = "triangle"),
          h.frequency.setValueAtTime(230, e),
          h.frequency.exponentialRampToValueAtTime(165, e + 0.06),
          f.gain.setValueAtTime(a * 0.7, e),
          f.gain.exponentialRampToValueAtTime(0.001, e + 0.11),
          h.connect(f),
          f.connect(n.snr),
          h.start(e),
          h.stop(e + 0.13));
      },
      clap(t, n, e, a) {
        const c = t.ctx,
          i = P(t, e),
          s = c.createBiquadFilter(),
          r = c.createGain();
        ((s.type = "bandpass"), (s.frequency.value = 1250), (s.Q.value = 1.4), r.gain.setValueAtTime(0, e));
        for (let o = 0; o < 3; o++)
          (r.gain.setValueAtTime(a * 0.9, e + o * 0.011), r.gain.setTargetAtTime(a * 0.1, e + o * 0.011 + 0.001, 0.003));
        (r.gain.setValueAtTime(a * 0.7, e + 0.034),
          r.gain.setTargetAtTime(0, e + 0.035, 0.05),
          i.connect(s),
          s.connect(r),
          r.connect(n.snr),
          i.start(e, i._off),
          i.stop(e + 0.3));
      },
      rim(t, n, e, a) {
        const c = t.ctx,
          i = c.createOscillator(),
          s = c.createGain(),
          r = c.createBiquadFilter();
        ((i.type = "square"),
          (i.frequency.value = 1700),
          (r.type = "bandpass"),
          (r.frequency.value = 1700),
          (r.Q.value = 4),
          s.gain.setValueAtTime(a * 0.5, e),
          s.gain.exponentialRampToValueAtTime(0.001, e + 0.03),
          i.connect(r),
          r.connect(s),
          s.connect(n.snr),
          i.start(e),
          i.stop(e + 0.04));
      },
      hat(t, n, e, a, c, i) {
        if (i.oh) {
          try {
            (i.oh.gain.cancelScheduledValues(e), i.oh.gain.setTargetAtTime(0, e, 0.006));
          } catch {}
          i.oh = null;
        }
        const s = t.ctx,
          r = P(t, e),
          o = s.createBiquadFilter(),
          u = s.createGain();
        ((o.type = "highpass"),
          (o.frequency.value = 7800),
          u.gain.setValueAtTime(a * 0.3, e),
          u.gain.exponentialRampToValueAtTime(0.001, e + (c.hLen || 0.04)),
          r.connect(o),
          o.connect(u),
          u.connect(n.hat),
          r.start(e, r._off),
          r.stop(e + 0.06));
      },
      ohat(t, n, e, a, c, i) {
        const s = t.ctx,
          r = P(t, e),
          o = s.createBiquadFilter(),
          u = s.createGain();
        ((o.type = "highpass"),
          (o.frequency.value = 7e3),
          u.gain.setValueAtTime(a * 0.3, e),
          u.gain.setTargetAtTime(0, e + 0.01, c.ohLen || 0.07),
          r.connect(o),
          o.connect(u),
          u.connect(n.hat),
          r.start(e, r._off),
          r.stop(e + 0.45),
          (i.oh = u));
      },
      crash(t, n, e, a) {
        const c = t.ctx,
          i = P(t, e, 0.93),
          s = c.createBiquadFilter(),
          r = c.createGain();
        ((s.type = "highpass"), (s.frequency.value = 3800));
        const o = c.createBiquadFilter();
        ((o.type = "peaking"),
          (o.frequency.value = 6200),
          (o.gain.value = 6),
          (o.Q.value = 1.5),
          r.gain.setValueAtTime(a * 0.42, e),
          r.gain.setTargetAtTime(a * 0.18, e + 0.01, 0.12),
          r.gain.setTargetAtTime(0, e + 0.2, 0.6),
          i.connect(s),
          s.connect(o),
          o.connect(r),
          r.connect(n.hat),
          i.start(e, i._off),
          i.stop(e + 2.6));
      },
      tom(t, n, e, a, c) {
        const i = t.ctx,
          s = i.createOscillator(),
          r = i.createGain();
        (s.frequency.setValueAtTime(c * 1.7, e),
          s.frequency.exponentialRampToValueAtTime(c, e + 0.09),
          r.gain.setValueAtTime(a * 0.9, e),
          r.gain.exponentialRampToValueAtTime(0.001, e + 0.42),
          s.connect(r),
          r.connect(n.tom),
          s.start(e),
          s.stop(e + 0.45));
        const o = P(t, e),
          u = i.createBiquadFilter(),
          h = i.createGain();
        ((u.type = "bandpass"),
          (u.frequency.value = c * 6),
          (u.Q.value = 0.8),
          h.gain.setValueAtTime(a * 0.3, e),
          h.gain.exponentialRampToValueAtTime(0.001, e + 0.05),
          o.connect(u),
          u.connect(h),
          h.connect(n.tom),
          o.start(e, o._off),
          o.stop(e + 0.06));
      },
      toml(t, n, e, a) {
        ee.tom(t, n, e, a, 82);
      },
      tomm(t, n, e, a) {
        ee.tom(t, n, e, a, 118);
      },
      tomh(t, n, e, a) {
        ee.tom(t, n, e, a, 165);
      },
    },
    Ie = {
      riser(t, n, e, a) {
        const c = t.ctx,
          i = P(t, e),
          s = c.createBiquadFilter(),
          r = c.createGain();
        ((s.type = "bandpass"),
          (s.Q.value = 1.4),
          s.frequency.setValueAtTime(250, e),
          s.frequency.exponentialRampToValueAtTime(9e3, e + a),
          r.gain.setValueAtTime(1e-4, e),
          r.gain.exponentialRampToValueAtTime(0.5, e + a * 0.97),
          r.gain.linearRampToValueAtTime(0, e + a),
          i.connect(s),
          s.connect(r),
          r.connect(n),
          i.start(e, i._off),
          i.stop(e + a + 0.05));
        const o = c.createOscillator(),
          u = c.createGain(),
          h = c.createBiquadFilter();
        ((o.type = "sawtooth"),
          (h.type = "highpass"),
          (h.frequency.value = 300),
          o.frequency.setValueAtTime(110, e),
          o.frequency.exponentialRampToValueAtTime(880, e + a),
          u.gain.setValueAtTime(1e-4, e),
          u.gain.exponentialRampToValueAtTime(0.09, e + a * 0.97),
          u.gain.linearRampToValueAtTime(0, e + a),
          o.connect(h),
          h.connect(u),
          u.connect(n),
          o.start(e),
          o.stop(e + a + 0.05));
      },
      down(t, n, e, a) {
        const c = t.ctx,
          i = P(t, e),
          s = c.createBiquadFilter(),
          r = c.createGain();
        ((s.type = "bandpass"),
          (s.Q.value = 1.2),
          s.frequency.setValueAtTime(7e3, e),
          s.frequency.exponentialRampToValueAtTime(200, e + a),
          r.gain.setValueAtTime(0.4, e),
          r.gain.exponentialRampToValueAtTime(0.001, e + a),
          i.connect(s),
          s.connect(r),
          r.connect(n),
          i.start(e, i._off),
          i.stop(e + a + 0.05));
      },
      impact(t, n, e) {
        const a = t.ctx,
          c = a.createOscillator(),
          i = a.createGain();
        (c.frequency.setValueAtTime(110, e),
          c.frequency.exponentialRampToValueAtTime(32, e + 0.6),
          i.gain.setValueAtTime(0.75, e),
          i.gain.exponentialRampToValueAtTime(0.001, e + 1.4),
          c.connect(i),
          i.connect(n),
          c.start(e),
          c.stop(e + 1.5));
        const s = P(t, e),
          r = a.createBiquadFilter(),
          o = a.createGain();
        ((r.type = "lowpass"),
          r.frequency.setValueAtTime(6e3, e),
          r.frequency.exponentialRampToValueAtTime(300, e + 0.8),
          o.gain.setValueAtTime(0.5, e),
          o.gain.exponentialRampToValueAtTime(0.001, e + 1),
          s.connect(r),
          r.connect(o),
          o.connect(n),
          s.start(e, s._off),
          s.stop(e + 1.1));
      },
      swell(t, n, e, a) {
        const c = t.ctx,
          i = P(t, e, 0.9),
          s = c.createBiquadFilter(),
          r = c.createGain();
        ((s.type = "highpass"),
          (s.frequency.value = 5e3),
          r.gain.setValueAtTime(1e-4, e),
          r.gain.exponentialRampToValueAtTime(0.35, e + a * 0.98),
          r.gain.linearRampToValueAtTime(0, e + a),
          i.connect(s),
          s.connect(r),
          r.connect(n),
          i.start(e, i._off),
          i.stop(e + a + 0.05));
      },
    };
  function te(t, n, e, a, c) {
    const i = t.ctx,
      s = i.createGain();
    s.gain.value = a.vol == null ? 0.5 : a.vol;
    let r = s;
    const o = [s];
    if (a.drive) {
      const u = i.createWaveShaper();
      ((u.curve = Te(t, "drive" + a.drive, () => at(a.drive))), r.connect(u), (r = u), o.push(u));
    }
    if (a.crush) {
      const u = i.createWaveShaper();
      ((u.curve = Te(t, "crush" + a.crush, () => De(a.crush))), r.connect(u), (r = u), o.push(u));
    }
    if (a.hp) {
      const u = i.createBiquadFilter();
      ((u.type = "highpass"), (u.frequency.value = a.hp), r.connect(u), (r = u), o.push(u));
    }
    if (a.pan && i.createStereoPanner) {
      const u = i.createStereoPanner();
      ((u.pan.value = a.pan), r.connect(u), (r = u), o.push(u));
    }
    if ((r.connect(n), a.echo)) {
      const u = i.createGain();
      ((u.gain.value = a.echo), r.connect(u), u.connect(e), o.push(u));
    }
    if (a.rev && c) {
      const u = i.createGain();
      ((u.gain.value = a.rev), r.connect(u), u.connect(c), o.push(u));
    }
    return { input: s, nodes: o };
  }
  function K(t, n, e) {
    ((e = e || {}), (this.c = t), (this.song = n));
    const a = t.ctx;
    ((this.out = a.createGain()),
      (this.out.gain.value = 0),
      (this.eSend = a.createGain()),
      (this.eSend.gain.value = 0),
      (this.rSend = a.createGain()),
      (this.rSend.gain.value = 0),
      this.out.connect(t.music),
      this.eSend.connect(t.echoIn),
      this.rSend.connect(t.revIn));
    const c = n.def;
    (c.pump && ((this.sc = a.createGain()), (this.sc.gain.value = 1), this.sc.connect(this.out)), (this.strips = {}), (this.chState = {}));
    for (const r in c.ch) {
      if (r === "dr") continue;
      const o = c.ch[r];
      ((this.strips[r] = te(t, o.sc && this.sc ? this.sc : this.out, this.eSend, o, this.rSend)), (this.chState[r] = { last: null }));
    }
    const i = c.ch.dr || {},
      s = i.vol == null ? 0.8 : i.vol;
    ((this.kit = {
      kit: te(t, this.out, this.eSend, { vol: s * (i.kick || 1), echo: i.kitEcho || 0, drive: i.drive }, this.rSend).input,
      snr: te(
        t,
        this.out,
        this.eSend,
        { vol: s * (i.snare || 1), echo: i.snrEcho == null ? 0.12 : i.snrEcho, pan: 0.04, rev: i.snrRev == null ? 0.35 : i.snrRev },
        this.rSend,
      ).input,
      hat: te(t, this.out, this.eSend, { vol: s * (i.hats || 0.9), pan: 0.24, echo: i.hatEcho || 0, rev: 0.08 }, this.rSend).input,
      tom: te(t, this.out, this.eSend, { vol: s * (i.toms || 0.9), pan: -0.18, echo: 0.1, rev: 0.3 }, this.rSend).input,
    }),
      (this.fxOut = te(t, this.out, this.eSend, { vol: s * (i.fx || 0.8), rev: 0.6, echo: 0.1 }, this.rSend).input),
      (this.drumOpt = i),
      (this.drumState = {}),
      (this.orderIdx = e.startOrder || 0),
      (this.step = 0),
      (this.tempo = e.tempo || 1),
      (this.tempoTarget = this.tempo),
      (this.done = !1),
      (this.started = !1),
      (this.stopping = !1),
      (this.log = []),
      (this.stepTimes = null),
      (this.late = 0));
  }
  ((K.prototype.stepDur = function () {
    return this.song.stepSec / this.tempo;
  }),
    (K.prototype.pumpAt = function (t, n) {
      const e = this.song.def.pump,
        a = this.sc.gain,
        c = 1 - (1 - (e.depth || 0.3)) * Math.min(1, n + 0.2);
      (a.setTargetAtTime(c, t, 0.003), a.setTargetAtTime(1, t + 0.02, (e.release || 0.9) * this.stepDur()));
    }),
    (K.prototype.start = function (t, n) {
      ((this.nextTime = t), (this.started = !0));
      const e = this.song.def.gain || 1;
      for (const c of [this.out.gain, this.eSend.gain, this.rSend.gain])
        (c.setValueAtTime(0, t), n > 0 ? c.linearRampToValueAtTime(e, t + n) : c.setValueAtTime(e, t));
      const a = this.song.def.echo || {};
      this.c.setEcho((a.steps || 3) * this.stepDur(), a.fb == null ? 0.33 : a.fb, a.wet == null ? 0.5 : a.wet, t);
    }),
    (K.prototype.stop = function (t, n) {
      if (!this.stopping) {
        ((this.stopping = !0), (n = Math.max(0.01, n || 0)));
        for (const e of [this.out.gain, this.eSend.gain, this.rSend.gain]) {
          try {
            e.cancelScheduledValues(t);
          } catch {}
          (e.setValueAtTime(e.value, t), e.linearRampToValueAtTime(0, t + n));
        }
        ((this.stopAt = t + n), (this.killAt = t + n + 3));
      }
    }),
    (K.prototype.dispose = function () {
      try {
        (this.out.disconnect(), this.eSend.disconnect(), this.rSend.disconnect());
      } catch {}
    }),
    (K.prototype.pump = function (t, n, e) {
      if (!this.started || this.done) return;
      let a = 0;
      const c = e || 512;
      for (; this.nextTime < t && !this.done && a++ < c;) {
        if (this.stopAt != null && this.nextTime > this.stopAt) {
          this.done = !0;
          break;
        }
        if (n != null && this.nextTime < n - 0.08) {
          (this.late++, this.advance());
          continue;
        }
        (this.schedule(this.nextTime), this.advance());
      }
    }),
    (K.prototype.schedule = function (t) {
      const n = this.song,
        e = n.pats[n.order[this.orderIdx]];
      (this.step === 0 && this.log.length < 400 && this.log.push({ o: this.orderIdx, name: e.name, t }),
        this.stepTimes && this.stepTimes.length < 2e4 && this.stepTimes.push(t));
      const a = e.ev[this.step];
      if (!a.length) return;
      const c = this.stepDur(),
        i = n.def;
      this.c._sd = c;
      const s = t + (this.step & 1 && i.swing ? i.swing * c : 0);
      for (let r = 0; r < a.length; r++) {
        const o = a[r];
        try {
          if (o.fx) {
            Ie[o.fx](this.c, this.fxOut, s, o.len * c, this);
            continue;
          }
          if (o.drum) {
            ((o.drum === "kick" || o.drum === "pump") && this.sc && this.pumpAt(s, o.v),
              o.drum !== "pump" && ee[o.drum](this.c, this.kit, s, o.v, this.drumOpt, this.drumState));
            continue;
          }
          const u = i.ch[o.ch],
            h = ae[u.ins],
            f = this.chState[o.ch],
            d = this.strips[o.ch].input,
            p = o.len * c * (u.gate || 0.94);
          let m = u.opt || {};
          if ((e.opt && e.opt[o.ch] && (m = Object.assign({}, m, e.opt[o.ch])), e.ramp && e.ramp[o.ch])) {
            m = Object.assign({}, m);
            const x = e.ramp[o.ch],
              g = this.step / e.steps;
            for (const y in x) m[y] = x[y][0] + (x[y][1] - x[y][0]) * (x[y][2] === "exp" ? g * g : g);
          }
          if (Array.isArray(o.m)) {
            if (h === ae.supersaw) h(this.c, d, s, u.tr ? o.m.map((x) => x + u.tr) : o.m, p, o.v, m);
            else for (const x of o.m) h(this.c, d, s, x + (u.tr || 0), p, o.v, m);
            f.last = null;
          } else (h(this.c, d, s, o.m + (u.tr || 0), p, o.v, m, f.last, o.sl, o.ghost), (f.last = o.m + (u.tr || 0)));
        } catch {}
      }
    }),
    (K.prototype.advance = function () {
      const t = this.song;
      if (this.tempo !== this.tempoTarget) {
        const n = this.tempoTarget - this.tempo;
        this.tempo = Math.abs(n) < 0.01 ? this.tempoTarget : this.tempo + Math.sign(n) * 0.01;
        const e = t.def.echo || {};
        try {
          const a = (e.steps || 3) * this.stepDur();
          (this.c.delay.delayTime.setTargetAtTime(a, this.nextTime, 0.2), this.c.delayR.delayTime.setTargetAtTime(a, this.nextTime, 0.2));
        } catch {}
      }
      ((this.nextTime += this.stepDur()),
        this.step++,
        this.step >= t.pats[t.order[this.orderIdx]].steps &&
          ((this.step = 0),
          this.orderIdx++,
          this.orderIdx >= t.order.length &&
            (t.loop >= 0
              ? (this.orderIdx = t.loop)
              : ((this.done = !0), (this.endTime = this.nextTime), (this.orderIdx = t.order.length - 1)))));
    }));
  function k(t, n, e, a, c, i, s, r, o) {
    o = o || {};
    const u = t.ctx,
      h = u.createOscillator(),
      f = u.createGain();
    (typeof a == "number" ? h.setPeriodicWave(_(t, a)) : (h.type = a),
      h.frequency.setValueAtTime(c, e),
      i &&
        i !== c &&
        (o.lin
          ? h.frequency.linearRampToValueAtTime(i, e + (o.glide || s))
          : h.frequency.exponentialRampToValueAtTime(i, e + (o.glide || s))));
    const d = o.a || 0.003;
    (f.gain.setValueAtTime(0, e),
      f.gain.linearRampToValueAtTime(r, e + d),
      o.hold && f.gain.setValueAtTime(r, e + d + o.hold),
      f.gain.setTargetAtTime(0, e + d + (o.hold || 0), o.rel || s / 3));
    let p = h;
    if (o.lp) {
      const m = u.createBiquadFilter();
      ((m.type = "lowpass"), (m.frequency.value = o.lp), p.connect(m), (p = m));
    }
    if ((p.connect(f), f.connect(n), o.echo)) {
      const m = u.createGain();
      ((m.gain.value = o.echo), f.connect(m), m.connect(t.sEchoIn));
    }
    return (
      o.vib && Z(u, [h.detune], e, e + s, o.vib, o.vibRate || 6, 0.05),
      h.start(e),
      h.stop(e + d + (o.hold || 0) + (o.rel || s / 3) * 7 + 0.02),
      h
    );
  }
  function Q(t, n, e, a, c, i, s, r, o, u) {
    u = u || {};
    const h = t.ctx,
      f = P(t, e, u.rate),
      d = h.createBiquadFilter(),
      p = h.createGain();
    ((d.type = a),
      (d.Q.value = s),
      d.frequency.setValueAtTime(c, e),
      i && i !== c && d.frequency.exponentialRampToValueAtTime(i, e + (u.glide || r)));
    const m = u.a || 0.002;
    (p.gain.setValueAtTime(0, e),
      p.gain.linearRampToValueAtTime(o, e + m),
      u.hold && p.gain.setValueAtTime(o, e + m + u.hold),
      p.gain.setTargetAtTime(0, e + m + (u.hold || 0), u.rel || r / 4));
    let x = d;
    if (u.crush) {
      const g = h.createWaveShaper();
      ((g.curve = Te(t, "crush" + u.crush, () => De(u.crush))), d.connect(g), (x = g));
    }
    if ((f.connect(d), x.connect(p), p.connect(n), u.echo)) {
      const g = h.createGain();
      ((g.gain.value = u.echo), p.connect(g), g.connect(t.sEchoIn));
    }
    (f.start(e, f._off), f.stop(e + m + (u.hold || 0) + (u.rel || r / 4) * 7 + 0.02));
  }
  function W(t, n, e, a, c, i, s, r) {
    ae[e](t, n, a, c, i, s, r || {});
  }
  function ye(t, n, e, a) {
    const c = t.duck.gain;
    try {
      c.cancelScheduledValues(n);
    } catch {}
    (c.setTargetAtTime(e, n, 0.04), c.setTargetAtTime(1, n + a, 0.25));
  }
  const se = {
      select(t, n, e) {
        (k(t, n, e, 0.25, 1320, 0, 0.05, 0.16, { rel: 0.02 }), k(t, n, e + 0.045, 0.25, 1760, 0, 0.06, 0.13, { rel: 0.025 }));
      },
      confirm(t, n, e) {
        ([72, 76, 79, 84].forEach((a, c) => k(t, n, e + c * 0.045, 0.25, V(a), 0, 0.06, 0.15, { rel: 0.03, echo: 0.3 })),
          W(t, n, "bell", e + 0.18, 96, 0.4, 0.5, { decay: 0.6 }));
      },
      back(t, n, e) {
        (k(t, n, e, 0.5, 784, 0, 0.06, 0.14, { rel: 0.025 }), k(t, n, e + 0.06, 0.5, 523, 0, 0.09, 0.14, { rel: 0.03 }));
      },
      countdown(t, n, e) {
        (k(t, n, e, 0.5, 880, 0, 0.2, 0.2, { hold: 0.14, rel: 0.03, echo: 0.25 }),
          k(t, n, e, "sine", 440, 0, 0.2, 0.12, { hold: 0.14, rel: 0.03 }));
      },
      go(t, n, e) {
        (k(t, n, e, 0.5, 1760, 0, 0.7, 0.2, { hold: 0.5, rel: 0.1, echo: 0.3, vib: 10 }),
          k(t, n, e, 0.25, 880, 0, 0.7, 0.13, { hold: 0.5, rel: 0.1 }),
          Q(t, n, e, "bandpass", 600, 5e3, 1.2, 0.6, 0.12, { rel: 0.2 }));
      },
      wallHit(t, n, e, a) {
        const c = Math.max(0.15, Math.min(1, a && a.intensity != null ? a.intensity : 0.6)),
          i = t.ctx,
          s = i.createOscillator(),
          r = i.createGain();
        (s.frequency.setValueAtTime(150, e),
          s.frequency.exponentialRampToValueAtTime(42, e + 0.12),
          r.gain.setValueAtTime(0.55 * c, e),
          r.gain.exponentialRampToValueAtTime(0.001, e + 0.25 + 0.15 * c),
          s.connect(r),
          r.connect(n),
          s.start(e),
          s.stop(e + 0.45),
          W(t, n, "bell", e, 50 + Math.round(c * 4), 0.2, 0.55 * c, { ratio: 2.76, index: 5, decay: 0.25 + 0.2 * c }),
          W(t, n, "bell", e + 0.004, 63, 0.2, 0.35 * c, { ratio: 1.41, index: 4, decay: 0.18 }),
          Q(t, n, e, "bandpass", 2400, 700, 0.9, 0.18, 0.5 * c, { crush: 6, rel: 0.04 + 0.05 * c }));
      },
      shipHit(t, n, e) {
        (W(t, n, "bell", e, 64, 0.2, 0.45, { ratio: 2.76, index: 4.5, decay: 0.3 }),
          W(t, n, "bell", e + 0.06, 59, 0.2, 0.35, { ratio: 2.76, index: 4.5, decay: 0.25 }),
          Q(t, n, e, "bandpass", 1800, 900, 1, 0.12, 0.35, { crush: 8, rel: 0.03 }),
          k(t, n, e, "triangle", 220, 80, 0.15, 0.3, { rel: 0.05 }));
      },
      boost(t, n, e) {
        Q(t, n, e, "bandpass", 350, 4500, 1.6, 0.9, 0.42, { a: 0.05, hold: 0.45, rel: 0.25, glide: 0.8 });
        const a = t.ctx,
          c = a.createBiquadFilter(),
          i = a.createGain();
        ((c.type = "lowpass"),
          (c.Q.value = 6),
          c.frequency.setValueAtTime(200, e),
          c.frequency.exponentialRampToValueAtTime(3200, e + 0.5),
          c.frequency.setTargetAtTime(600, e + 0.6, 0.3),
          i.gain.setValueAtTime(0, e),
          i.gain.linearRampToValueAtTime(0.32, e + 0.06),
          i.gain.setTargetAtTime(0, e + 0.7, 0.25));
        for (const s of [0, 1.007]) {
          const r = a.createOscillator();
          ((r.type = "sawtooth"),
            r.frequency.setValueAtTime(55 * (1 + s * 0.01), e),
            r.frequency.exponentialRampToValueAtTime(190, e + 0.55),
            r.frequency.setTargetAtTime(150, e + 0.6, 0.3),
            r.connect(c),
            r.start(e),
            r.stop(e + 2.2));
        }
        (c.connect(i), i.connect(n), k(t, n, e + 0.05, 0.125, 400, 2400, 0.5, 0.08, { rel: 0.2, glide: 0.45 }));
      },
      dash(t, n, e) {
        (k(t, n, e, 0.25, 420, 3200, 0.16, 0.2, { glide: 0.15, rel: 0.05 }),
          k(t, n, e + 0.07, 0.125, 840, 5200, 0.14, 0.1, { glide: 0.13, rel: 0.05 }),
          Q(t, n, e, "highpass", 3e3, 8e3, 0.7, 0.2, 0.12, { rel: 0.06 }));
      },
      boostReady(t, n, e) {
        (k(t, n, e, 0.25, V(88), 0, 0.08, 0.15, { rel: 0.03, echo: 0.3 }),
          k(t, n, e + 0.09, 0.25, V(95), 0, 0.2, 0.15, { hold: 0.08, rel: 0.05, echo: 0.3 }),
          W(t, n, "bell", e + 0.09, 95, 0.4, 0.4, { decay: 0.7 }));
      },
      lap(t, n, e) {
        ([79, 83, 86, 91].forEach((a, c) => W(t, n, "bell", e + c * 0.07, a, 0.5, 0.55, { decay: 0.9 })),
          k(t, n, e + 0.21, 0.25, V(91), 0, 0.3, 0.08, { hold: 0.15, rel: 0.08, echo: 0.3 }));
      },
      finalLap(t, n, e) {
        ye(t, e, 0.3, 1.7);
        const a = 0.085;
        ([
          [67, 0, 1],
          [67, 1, 1],
          [72, 2, 2],
          [76, 4, 2],
          [79, 6, 8],
        ].forEach(([c, i, s]) => {
          k(t, n, e + i * a, 0.25, V(c), 0, s * a, 0.16, { hold: s * a * 0.8, rel: 0.05, vib: s > 4 ? 14 : 0, echo: 0.25 });
        }),
          [
            [60, 64, 67],
            [64, 67, 72],
          ].forEach((c, i) => c.forEach((s) => W(t, n, "brass", e + (i ? 6 * a : 0), s, i ? 0.7 : 0.15, 0.85, { bright: 3500 }))));
        for (let c = 0; c < 6; c++) Q(t, n, e + c * a, "bandpass", 2e3, 0, 0.6, 0.07, 0.15 + c * 0.03, { rel: 0.02 });
        Q(t, n, e + 6 * a, "highpass", 4e3, 0, 0.5, 1, 0.18, { rel: 0.35 });
      },
      finish(t, n, e) {
        ye(t, e, 0.25, 2.8);
        const a = 0.11;
        ([
          [0, [58, 62, 65]],
          [3, [60, 64, 67]],
          [6, [62, 66, 69, 74]],
        ].forEach(([i, s], r) =>
          s.forEach((o) => W(t, n, "brass", e + i * a, o, r === 2 ? 1.6 : 0.28, 0.9, { bright: 3800, vib: r === 2 ? 10 : 0 })),
        ),
          [
            [77, 0, 1],
            [79, 1, 1],
            [81, 2, 1],
            [79, 3, 1],
            [81, 4, 1],
            [83, 5, 1],
            [86, 6, 14],
          ].forEach(([i, s, r]) =>
            k(t, n, e + s * a, 0.25, V(i), 0, r * a, 0.15, { hold: r * a * 0.85, rel: 0.08, vib: r > 4 ? 16 : 0, echo: 0.3 }),
          ),
          [0, 3, 6].forEach((i) => {
            const s = t.ctx.createGain();
            ((s.gain.value = 1), s.connect(n), ee.tomh(t, { tom: s }, e + i * a, 0.8));
          }),
          Q(t, n, e + 6 * a, "highpass", 3500, 0, 0.5, 2, 0.22, { rel: 0.6 }));
      },
      explode(t, n, e) {
        (Q(t, n, e, "lowpass", 4e3, 140, 0.7, 1.4, 0.75, { glide: 1.1, rel: 0.45, crush: 12 }),
          k(t, n, e, "sine", 95, 28, 0.9, 0.65, { glide: 0.7, rel: 0.3 }),
          Q(t, n, e + 0.05, "highpass", 2500, 0, 0.6, 0.9, 0.18, { rel: 0.25, rate: 0.5 }),
          W(t, n, "bell", e, 40, 0.5, 0.5, { ratio: 1.73, index: 6, decay: 0.8 }));
      },
      overtake(t, n, e) {
        (k(t, n, e, 0.25, V(88), 0, 0.04, 0.1, { rel: 0.015 }), k(t, n, e + 0.04, 0.25, V(93), 0, 0.06, 0.1, { rel: 0.025 }));
      },
      pause(t, n, e) {
        (k(t, n, e, 0.5, V(83), 0, 0.07, 0.15, { rel: 0.03 }),
          k(t, n, e + 0.08, 0.5, V(88), 0, 0.07, 0.15, { rel: 0.03 }),
          k(t, n, e + 0.16, 0.5, V(83), 0, 0.07, 0.15, { rel: 0.03 }),
          k(t, n, e + 0.24, 0.5, V(88), 0, 0.14, 0.15, { rel: 0.05, echo: 0.3 }));
      },
    },
    re = {
      scrape(t, n, e) {
        const a = t.ctx,
          c = a.createBufferSource();
        ((c.buffer = t.grit || (t.grit = ut(a))), (c.loop = !0));
        const i = a.createBiquadFilter();
        ((i.type = "bandpass"), (i.frequency.value = 2300), (i.Q.value = 1.1));
        const s = a.createOscillator(),
          r = a.createGain();
        ((s.type = "square"), (s.frequency.value = 23), (r.gain.value = 700), s.connect(r), r.connect(i.frequency));
        const o = a.createOscillator(),
          u = a.createGain();
        ((o.type = "sawtooth"), (o.frequency.value = 97), (u.gain.value = 0.25));
        const h = a.createGain();
        return (
          h.gain.setValueAtTime(0, e),
          h.gain.linearRampToValueAtTime(0.38, e + 0.04),
          c.connect(i),
          o.connect(u),
          u.connect(i),
          i.connect(h),
          h.connect(n),
          c.start(e),
          s.start(e),
          o.start(e),
          {
            stop(f) {
              (h.gain.setTargetAtTime(0, f, 0.04), c.stop(f + 0.4), s.stop(f + 0.4), o.stop(f + 0.4));
            },
          }
        );
      },
      pit(t, n, e) {
        const a = t.ctx,
          c = a.createOscillator(),
          i = a.createOscillator();
        ((c.type = "triangle"),
          i.setPeriodicWave(_(t, 0.25)),
          c.frequency.setValueAtTime(220, e),
          c.frequency.linearRampToValueAtTime(440, e + 4),
          i.frequency.setValueAtTime(110.5, e),
          i.frequency.linearRampToValueAtTime(220.5, e + 4));
        const s = a.createOscillator(),
          r = a.createGain();
        ((s.frequency.value = 7.5), (r.gain.value = 60), s.connect(r), r.connect(c.detune), r.connect(i.detune));
        const o = a.createOscillator(),
          u = a.createGain();
        ((o.frequency.value = 15), (u.gain.value = 0.05));
        const h = a.createGain();
        (h.gain.setValueAtTime(0, e), h.gain.linearRampToValueAtTime(0.12, e + 0.1), o.connect(u), u.connect(h.gain));
        const f = a.createGain();
        ((f.gain.value = 0.35), c.connect(h), i.connect(f), f.connect(h), h.connect(n));
        for (const d of [c, i, s, o]) d.start(e);
        return {
          stop(d) {
            (h.gain.cancelScheduledValues(d), h.gain.setTargetAtTime(0, d, 0.05));
            for (const p of [c, i, s, o]) p.stop(d + 0.5);
          },
        };
      },
      lowEnergy(t, n, e) {
        const a = { next: e, stopped: !1 };
        return (
          (a.pump = function (c) {
            for (; !a.stopped && a.next < c;)
              (k(t, n, a.next, 0.5, 1047, 0, 0.09, 0.11, { hold: 0.07, rel: 0.01 }),
                k(t, n, a.next + 0.11, 0.5, 784, 0, 0.09, 0.11, { hold: 0.07, rel: 0.01 }),
                (a.next += 0.6));
          }),
          (a.stop = function () {
            a.stopped = !0;
          }),
          a.pump(e + 0.2),
          a
        );
      },
    };
  function ie(t) {
    const n = t.ctx;
    ((this.c = t),
      (this.out = n.createGain()),
      (this.out.gain.value = 0),
      (this.lp = n.createBiquadFilter()),
      (this.lp.type = "lowpass"),
      (this.lp.Q.value = 3.5),
      (this.lp.frequency.value = 400),
      (this.o1 = n.createOscillator()),
      (this.o1.type = "sawtooth"),
      (this.o2 = n.createOscillator()),
      (this.o2.type = "sawtooth"),
      (this.o2.detune.value = 16),
      (this.o3 = n.createOscillator()),
      this.o3.setPeriodicWave(_(t, 0.3)),
      (this.wh = n.createOscillator()),
      (this.wh.type = "sine"),
      (this.whg = n.createGain()),
      (this.whg.gain.value = 0));
    const e = n.createGain();
    ((e.gain.value = 0.55),
      this.o1.connect(this.lp),
      this.o2.connect(this.lp),
      this.o3.connect(e),
      e.connect(this.lp),
      this.lp.connect(this.out),
      this.wh.connect(this.whg),
      this.whg.connect(this.out),
      (this.ns = n.createBufferSource()),
      (this.ns.buffer = t.noise),
      (this.ns.loop = !0),
      (this.bp = n.createBiquadFilter()),
      (this.bp.type = "bandpass"),
      (this.bp.Q.value = 2.2),
      (this.bp.frequency.value = 900),
      (this.tg = n.createGain()),
      (this.tg.gain.value = 0),
      (this.tb = n.createOscillator()),
      (this.tb.type = "sawtooth"),
      (this.tbf = n.createBiquadFilter()),
      (this.tbf.type = "bandpass"),
      (this.tbf.Q.value = 4),
      (this.tbg = n.createGain()),
      (this.tbg.gain.value = 0),
      this.ns.connect(this.bp),
      this.bp.connect(this.tg),
      this.tg.connect(this.out),
      this.tb.connect(this.tbf),
      this.tbf.connect(this.tbg),
      this.tbg.connect(this.out),
      this.out.connect(t.sfx));
    const a = n.currentTime;
    for (const c of [this.o1, this.o2, this.o3, this.wh, this.tb]) c.start(a);
    (this.ns.start(a), (this.lastT = -1), (this.last = {}));
  }
  ((ie.prototype.dispose = function (t) {
    const n = this.out.gain;
    try {
      (n.cancelScheduledValues(t), n.setTargetAtTime(0, t, 0.02));
    } catch {}
    const e = t + 0.12;
    for (const c of [this.o1, this.o2, this.o3, this.wh, this.tb, this.ns])
      try {
        c.stop(e);
      } catch {}
    const a = this.out;
    this.o1.onended = () => {
      try {
        a.disconnect();
      } catch {}
    };
  }),
    (ie.prototype.set = function (t, n, e) {
      const a = this.c,
        c = a.ctx;
      n = n ?? c.currentTime;
      const i = !!t.on,
        s = Math.max(0, Math.min(1.3, +t.speed01 || 0)),
        r = t.boost ? 1 : 0,
        o = +t.z || 0,
        u = this.last;
      if (
        (!e && n - this.lastT < 0.025 && u.on === i && u.b === r) ||
        (!e && u.on === i && u.b === r && Math.abs((u.s || 0) - s) < 0.004 && Math.abs((u.z || 0) - o) < 0.2)
      )
        return;
      ((this.lastT = n), (u.on = i), (u.s = s), (u.b = r), (u.z = o));
      const h = 0.045,
        f = 52 + s * 185 + r * 30;
      (this.o1.frequency.setTargetAtTime(f, n, h),
        this.o2.frequency.setTargetAtTime(f, n, h),
        this.o3.frequency.setTargetAtTime(f * 0.5, n, h));
      const d = Math.max(-12, Math.min(12, o * 3));
      (this.o1.detune.setTargetAtTime(d, n, 0.08),
        this.wh.frequency.setTargetAtTime(f * 7.02, n, h),
        this.lp.frequency.setTargetAtTime(260 + s * s * 3e3 + r * 1600, n, h),
        this.out.gain.setTargetAtTime(i ? 0.08 + 0.07 * Math.min(1, s) + r * 0.03 : 0, n, i ? 0.06 : 0.12),
        this.whg.gain.setTargetAtTime(i ? 0.012 + 0.03 * s * s : 0, n, h),
        this.bp.frequency.setTargetAtTime(500 + s * 2600 + r * 1500, n, h),
        this.tg.gain.setTargetAtTime(i ? 0.03 * s + r * 0.22 : 0, n, r ? 0.05 : 0.2),
        this.tb.frequency.setTargetAtTime(f * 2.01, n, h),
        this.tbf.frequency.setTargetAtTime(f * 4, n, h),
        this.tbg.gain.setTargetAtTime(i && r ? 0.12 : 0, n, 0.08));
    }));
  const B = {},
    S = "................",
    w = (...t) => t.join("|"),
    A = (t, n) => Array(n).fill(t).join("|"),
    D = (t, n) => w(t, A(S, n - 1)),
    Le = w(
      "x.......x.......",
      "x.......x.......",
      "x...x...x...x...",
      "x...x...x...x...",
      "x.x.x.x.x.x.x.x.",
      "x.x.x.x.x.x.x.x.",
      "xxxxxxxxxxxxxxxx",
      "3456789XXXXX....",
    ),
    ce = w("x...x...x...x...", "x.x.x.x.x.x.x.x.", "xxxxxxxxxxxxxxxx", "3456789XXXXX....");
  ((function () {
    const t = "Fm9 . . . | Dbmaj7 . . . | Bbm7 . . . | C7sus4 . C7 . | Fm9 . . . | Dbmaj7 . . . | Bbm7 . . . | C7sus4 . C7 .",
      n = `
      C6 - . C6 . Ab5 - . Bb5 - . Ab5 . F5 - . | Ab5 - . Ab5 . F5 - . C6 - . Ab5 . F5 - . |
      Db6 - . Db6 . Bb5 - . C6 - . Bb5 . F5 - . | G5 - - - . F5 - . E5 - - - G5 - C6 - |
      C6 - . C6 . Ab5 - . Bb5 - . Ab5 . F5 - . | Ab5 - . Ab5 . F5 - . C6 - . Ab5 . F5 - . |
      Db6 - . Db6 . Bb5 - . C6 - . Bb5 . F5 - . | C6 - - - Bb5 - G5 - E5 - - - G5 - - - `,
      e = "F5*8 Ab5*8 | F5*16 | Db5*8 F5*8 | G5*8 E5*8 | C6*8 Ab5*8 | F5*16 | Db6*8 C6*8 | G5*8 E5*8",
      a = ". . R - . . R - . . O - . . R -",
      c = { K: "x...x...x...x...", P: "....X.......X...", O: "..x...x...x...x.", H: ".g...g...g...g..", C: D("X...............", 8) };
    ((B.race1 = {
      id: "race1",
      title: "NEON HARBOR",
      bpm: 128,
      key: "F minor",
      scale: "F aeolian",
      gain: 0.75,
      echo: { steps: 3, fb: 0.38, wet: 0.45 },
      pump: { depth: 0.22, release: 1.1 },
      ch: {
        bass: { ins: "reese", vol: 0.27, lo: 41, gate: 0.9, sc: 1, opt: { cut: 340, env: 2200, envT: 0.06, q: 5, sq: 0, det: 14 } },
        sub: { ins: "sub", vol: 0.42, lo: 29, gate: 0.9, sc: 1 },
        pad: { ins: "supersaw", vol: 0.58, center: 60, max: 4, sc: 1, rev: 0.25, pan: 0, opt: { att: 0.04, rel: 0.25, cut: 2600 } },
        stab: {
          ins: "supersaw",
          vol: 0.51,
          center: 67,
          max: 4,
          sc: 1,
          echo: 0.22,
          rev: 0.15,
          opt: { att: 0.003, rel: 0.06, cut: 3e3, env: 5e3, envT: 0.06, sus: 0.5, dec: 0.08 },
        },
        lead: {
          ins: "supersaw",
          vol: 0.4,
          gate: 0.85,
          echo: 0.22,
          rev: 0.25,
          opt: { att: 0.004, rel: 0.09, cut: 5200, env: 2500, gain: 0.34, vib: 10 },
        },
        pl: { ins: "spluck", vol: 0.28, tr: 12, pan: 0.18, echo: 0.3, rev: 0.2, opt: { decay: 0.2, bright: 6e3, det: 9 } },
        arp: {
          ins: "spluck",
          vol: 0.2,
          center: 72,
          pan: -0.25,
          echo: 0.4,
          rev: 0.15,
          sc: 1,
          opt: { decay: 0.13, bright: 4500, duty: 0.25 },
        },
        dr: { vol: 0.77, kick: 1.15, snrRev: 0.32 },
      },
      pat: {
        intro: {
          bars: 8,
          chords: t,
          pad: R(),
          arp: G("0 1 2 4 3 1 2 4 0 1 2 4 3 2 1 2"),
          ramp: { pad: { cut: [500, 2600, "exp"] }, arp: { bright: [600, 4500, "exp"] } },
          fx: "swell@0/64 riser@96/32",
          dr: {
            K: w(A(S, 4), A("x...x...x...x...", 3), "x...x...x......."),
            O: w(A(S, 4), A("..x...x...x...x.", 4)),
            Q: w(A("x...x...x...x...", 4), A(S, 4)),
            S: w(A(S, 6), "x...x...x...x...", "x.x.x.x.xxxxXX.."),
          },
        },
        A: {
          bars: 8,
          chords: t,
          pad: R(),
          arp: G("0 1 2 4 3 1 2 4 0 1 2 4 3 2 1 2"),
          bass: q(a),
          sub: q(a),
          pl: n,
          opt: { bass: { cut: 240, env: 900 }, pl: { gain: 0.2, decay: 0.15 }, pad: { cut: 1600 } },
          fx: "impact@0",
          dr: c,
          fill: { P: "....X.......X.XX", O: "..x...x........." },
        },
        build: {
          bars: 8,
          chords: t,
          pad: R(),
          arp: G("0 1 2 4 0 1 2 4 0 1 2 4 0 1 2 4"),
          bass: q(w(A(a, 4), A("R . R . R . R . R . R . R . R .", 3), ". . . . . . . . . . . . . . . .")),
          ramp: { pad: { cut: [900, 8e3, "exp"] }, arp: { bright: [1500, 9e3] } },
          fx: "riser@0/128",
          dr: { K: w(A("x...x...x...x...", 6), "x.x.x.x.x.x.x.x.", "x...x...x......."), S: Le, H: A(".g.g.g.g.g.g.g.g", 8) },
        },
        drop: {
          bars: 8,
          chords: t,
          pad: R(),
          bass: q(a),
          sub: q(a),
          lead: n,
          pl: n,
          stab: M("X . . x . . x . . . x . . x . ."),
          fx: "impact@0",
          dr: c,
          fill: { P: "....X.......XXXX" },
        },
        drop2: {
          bars: 8,
          chords: t,
          pad: R(),
          bass: q(". . R - . . R - . . O - . . R O"),
          sub: q(a),
          lead: n,
          ctr: Y("lead", 3, 9),
          pl: n,
          stab: M("X . . x . . x . . . x . . x . x"),
          arp: G("4 3 2 1 4 3 2 1 4 3 2 1 4 3 2 1"),
          dr: c,
          fill: { K: "x...x...x.......", P: "....X.......X...", O: "..x...x........." },
          fx: "down@120/8",
        },
        brk: {
          bars: 8,
          chords: t,
          pad: R(),
          lead: e,
          arp: G("0 . 2 . 4 . 2 . 1 . 3 . 5 . 3 ."),
          opt: { pad: { att: 0.4, cut: 1400 }, lead: { cut: 2400, env: 0, gain: 0.26, att: 0.08, rel: 0.4 } },
          dr: { Q: A("x...x...x...x...", 8), H: A("..g...g...g...g.", 8), C: D("X...............", 8) },
        },
        build2: {
          bars: 4,
          chords: "Fm9 . . . | Dbmaj7 . . . | Bbm7 . . . | C7sus4 . C7 .",
          pad: R(),
          arp: G("0 1 2 4 0 1 2 4 0 1 2 4 0 1 2 4"),
          pl: n.split("|").slice(0, 4).join("|"),
          bass: q(
            w(
              "R . R . R . R . R . R . R . R .",
              "R . R . R . R . R . R . R . R .",
              "R R R R R R R R R R R R R R R R",
              ". . . . . . . . . . . . . . . .",
            ),
          ),
          ramp: { pad: { cut: [1200, 9e3, "exp"] } },
          fx: "riser@0/64",
          dr: { K: w(A("x...x...x...x...", 3), "x...x...x......."), S: ce, H: A(".g.g.g.g.g.g.g.g", 4) },
        },
        drop3: {
          bars: 8,
          chords: t,
          pad: R(),
          bass: q(". . R - . . R - . . O - . . R O"),
          sub: q(a),
          lead: n,
          ctr: Y("lead", 3, 9),
          pl: J(n, 12),
          stab: M("X . . x . . x . . . x . . x . x"),
          arp: G("4 3 2 1 4 3 2 1 4 3 2 1 4 3 2 1"),
          fx: "impact@0 down@112/16",
          dr: c,
          fill: { K: "x...x...x...x...", P: "....X...X.X.XXXX", O: "..x...x...x....." },
        },
      },
      order: ["intro", "A", "build", "drop", "drop2", "brk", "build2", "drop", "drop3"],
      loop: 1,
    }),
      (B.race1.ch.ctr = {
        ins: "supersaw",
        vol: 0.22,
        pan: -0.2,
        echo: 0.2,
        rev: 0.2,
        opt: { att: 0.004, rel: 0.09, cut: 3800, gain: 0.3 },
      }));
  })(),
    (function () {
      const t = "Dm9 . . . | Bbmaj7 . . . | Gm7 . . . | A7sus4 . A7 . | Dm9 . . . | Bbmaj7 . . . | Gm7 . . . | A7sus4 . A7 .",
        n = `
      A4 - - - D5 - - - E5 - F5 - - - E5 - | D5 - - - - - - - A4 - - - Bb4 - C5 - |
      D5 - - - F5 - - - G5 - - - A5 - Bb5 - | A5 - - - - - - - G5 - - - E5 - C#5 - |
      D5 - - - A5 - - - C6 - - - A5 - - - | Bb5 - - - - - A5 - F5 - - - D5 - F5 - |
      G5 - - - - - F5 - D5 - - - Bb4 - D5 - | E5 - - - - - - - C#5 - - - - - - - `,
        e = G("0 1 2 3 4 3 2 1 0 1 2 3 4 3 2 1"),
        a = q("R . R . O . R . R . R . O . 5 .");
      B.title = {
        id: "title",
        title: "IGNITION",
        bpm: 100,
        key: "D minor",
        scale: "D aeolian",
        gain: 0.95,
        echo: { steps: 3, fb: 0.42, wet: 0.5 },
        pump: { depth: 0.45, release: 1.4 },
        ch: {
          bass: {
            ins: "spluck",
            vol: 0.42,
            lo: 26,
            gate: 0.8,
            sc: 1,
            opt: { wide: 0, decay: 0.16, bright: 1800, floor: 160, q: 3, det: 6 },
          },
          sub: { ins: "sub", vol: 0.34, lo: 26, gate: 0.85, sc: 1 },
          pad: { ins: "supersaw", vol: 0.61, center: 60, max: 4, sc: 1, rev: 0.45, opt: { att: 0.35, rel: 0.6, cut: 1900 } },
          arp: {
            ins: "spluck",
            vol: 0.2,
            center: 69,
            pan: 0.2,
            echo: 0.42,
            rev: 0.25,
            sc: 1,
            opt: { decay: 0.14, bright: 3800, duty: 0.25 },
          },
          lead: {
            ins: "supersaw",
            vol: 0.42,
            gate: 0.95,
            echo: 0.28,
            rev: 0.4,
            opt: { att: 0.02, rel: 0.3, cut: 4200, env: 1500, envT: 0.2, gain: 0.32, vib: 14 },
          },
          oct: { ins: "spluck", vol: 0.2, tr: 12, pan: -0.22, echo: 0.35, rev: 0.3, opt: { decay: 0.45, bright: 5e3, sus: 0.25 } },
          harm: { ins: "supersaw", vol: 0.37, pan: 0.25, echo: 0.2, rev: 0.4, opt: { att: 0.03, rel: 0.3, cut: 3e3, gain: 0.3 } },
          stab: {
            ins: "supersaw",
            vol: 0.44,
            center: 65,
            max: 4,
            sc: 1,
            rev: 0.3,
            opt: { att: 0.003, rel: 0.12, cut: 2500, env: 4e3, envT: 0.07, sus: 0.45, dec: 0.12 },
          },
          dr: { vol: 0.77, kf: 200, kLen: 0.5, snrRev: 0.65, snare: 1.15, toms: 1.1 },
        },
        pat: {
          intro: {
            bars: 4,
            chords: "Dm9 . . . | Bbmaj7 . . . | Gm7 . . . | A7sus4 . A7 .",
            pad: R(),
            fx: "swell@0/32 riser@32/32",
            ramp: { pad: { cut: [500, 2e3, "exp"] } },
            dr: { T: w(S, S, S, "........lmhlmhml"), K: w("X...............", S, "X...............", S) },
          },
          A: {
            bars: 8,
            chords: t,
            pad: R(),
            arp: e,
            bass: a,
            sub: q("R - - - - - - - R - - - - - - -"),
            fx: "impact@0",
            dr: { K: "x.........x.....", S: "........X.......", H: "x.x.x.x.x.x.x.x.", C: D("X...............", 8) },
            fill: { T: "........hhmmllll", S },
          },
          B: {
            bars: 8,
            chords: t,
            pad: R(),
            arp: e,
            bass: a,
            sub: q("R - - - - - - - R - - - - - - -"),
            lead: n,
            oct: n,
            dr: { K: "x.........x.....", S: "........X.......", H: "x.x.x.x.x.x.x.x.", O: "..............x.", C: D("X...............", 8) },
            fill: { S: "........X...XXXX", T: S },
          },
          C: {
            bars: 8,
            chords: t,
            pad: R(),
            arp: e,
            bass: q("R R O R R R O R R R O R R R O R"),
            sub: q("R - - - R - - - R - - - R - - -"),
            lead: n,
            harm: Y("lead", 3, 9),
            oct: n,
            stab: M("X . . x . . x . . . x . X . . ."),
            fx: "impact@0",
            dr: { K: "x...x...x...x...", S: "....X.......X...", O: "..x...x...x...x.", H: "x.x.x.x.x.x.x.x.", C: D("X...............", 8) },
            fill: { S: "....X...X.X.XXXX", T: "........HhMmLl.." },
          },
          D: {
            bars: 8,
            chords: t,
            pad: R(),
            oct: J(n, -12),
            arp: G("0 . 2 . 4 . 2 . 1 . 3 . 5 . 3 ."),
            opt: { pad: { att: 0.6, cut: 1300 } },
            fx: "riser@96/32",
            dr: { Q: A("x...............", 8), T: w(A(S, 7), "....l.l.m.m.h.hh"), C: D("X...............", 8) },
          },
        },
        order: ["intro", "A", "B", "C", "D"],
        loop: 1,
      };
    })(),
    (function () {
      const t = "Cm . . . | Cm . . . | Abmaj7 . . . | G . . . | Cm . . . | Cm . . . | Fm7 . . . | G7 . . .",
        n = `
      G5 - - Eb5 - - C5 - . . Eb5 - D5 - C5 - | C5 - - - - - G4 - - - - - . . Bb4 - |
      Ab5 - - G5 - - Eb5 - . . G5 - F5 - Eb5 - | D5 - - - - - B4 - - - - - . . G4 - |
      G5 - - Eb5 - - C5 - . . Eb5 - D5 - C5 - | C5 - - - - - G4 - - - - - . . Bb4 - |
      Ab5 - - F5 - - C5 - . . Eb5 - F5 - Ab5 - | G5 - - - F5 - - - D5 - - - B4 - - - `,
        e = q("R - - - - - - - R - - - O - - -"),
        a = { K: "x.....x...x.....", P: "....X.......X...", S: "....x.......x...", H: "x.x.x.x.x.x.x.xg", C: D("X...............", 8) };
      B.race2 = {
        id: "race2",
        title: "IRON FOUNDRY",
        bpm: 104,
        key: "C minor",
        scale: "C aeolian",
        gain: 0.62,
        echo: { steps: 3, fb: 0.45, wet: 0.45 },
        pump: { depth: 0.3, release: 1 },
        ch: {
          wob: {
            ins: "reese",
            vol: 0.29,
            lo: 36,
            gate: 0.97,
            sc: 1,
            drive: 2.2,
            opt: { cut: 260, wobble: 4, wdepth: 1300, q: 7, sq: 0.7, det: 18, lfoType: "sine" },
          },
          sub: { ins: "sub", vol: 0.44, lo: 24, gate: 0.95, sc: 1 },
          pad: { ins: "supersaw", vol: 0.51, center: 58, max: 4, sc: 1, rev: 0.4, opt: { att: 0.3, rel: 0.5, cut: 1100 } },
          stab: {
            ins: "supersaw",
            vol: 0.48,
            center: 62,
            max: 4,
            sc: 1,
            echo: 0.25,
            rev: 0.25,
            opt: { att: 0.003, rel: 0.08, cut: 1600, env: 3500, envT: 0.05, sus: 0.4, dec: 0.08 },
          },
          lead: {
            ins: "supersaw",
            vol: 0.36,
            gate: 0.9,
            echo: 0.3,
            rev: 0.3,
            opt: { att: 0.006, rel: 0.12, cut: 2800, env: 2e3, gain: 0.32, vib: 18, vibRate: 4.5 },
          },
          bell: { ins: "bell", vol: 0.2, center: 72, pan: 0.3, echo: 0.45, rev: 0.45, opt: { ratio: 2.41, index: 3, decay: 0.6 } },
          dr: { vol: 0.81, kf: 190, kEnd: 42, kLen: 0.5, drive: 1.5, snrRev: 0.45, kick: 1.1 },
        },
        pat: {
          intro: {
            bars: 4,
            chords: "Cm . . . | Cm . . . | Abmaj7 . . . | G . . .",
            pad: R(),
            bell: G("4 . . 2 . . 1 . . . 3 . . . . . | 0 . . 1 . . 2 . . . 4 . . . . ."),
            fx: "riser@32/32",
            ramp: { pad: { cut: [400, 1200] } },
            dr: { K: w("X...............", S, "X...............", "x...x...x...x.x."), S: w(S, S, S, "x.x.x.x.xxxxXXXX") },
          },
          A: {
            bars: 8,
            chords: t,
            pad: R(),
            sub: q("R - - - - - - - R - - - - - - -"),
            bell: G("4 . . 2 . . 1 . . . 3 . . . . . | 0 . . 1 . . 2 . . . 4 . . . . ."),
            wob: q("R - - . . . R - . . R - . . . ."),
            opt: { wob: { wobble: 0, cut: 200, env: 1400, envT: 0.08 } },
            fx: "impact@0",
            dr: { K: "x.....x...x.....", P: "....X.......X...", H: "x.x.x.x.x.x.x.x.", C: D("X...............", 8) },
            fill: { P: "....X.......X.XX" },
          },
          build: {
            bars: 4,
            chords: "Cm . . . | Cm . . . | Fm7 . . . | G7 . . .",
            pad: R(),
            stab: M("x . . . x . . . x . . . x . . ."),
            fx: "riser@0/64",
            ramp: { pad: { cut: [700, 5e3, "exp"] }, stab: { cut: [800, 4e3] } },
            dr: { K: w("x...x...x...x...", "x...x...x...x...", "x.x.x.x.x.x.x.x.", "x...x..........."), S: ce },
          },
          drop: {
            bars: 8,
            chords: t,
            pad: R(),
            wob: e,
            sub: q("R - - - - - - - R - - - O - - -"),
            stab: M("X . . . . . . . . . X . . . . ."),
            fx: "impact@0",
            dr: a,
            fill: { P: "....X.......XXXX" },
          },
          drop2: {
            bars: 8,
            chords: t,
            pad: R(),
            wob: q("R - - - R - - - R - R - O - - -"),
            sub: q("R - - - - - - - R - - - O - - -"),
            lead: n,
            stab: M("X . . . . . . . . . X . . . . ."),
            opt: { wob: { wobble: 2, wdepth: 1600 } },
            dr: a,
            fill: { K: "x.....x.........", P: "....X...........", S: "........x.x.xxxx" },
            fx: "down@112/16",
          },
          brk: {
            bars: 8,
            chords: t,
            pad: R(),
            lead: J(n, -12),
            bell: G("4 . . 2 . . 1 . . . 3 . . . . . | 0 . . 1 . . 2 . . . 4 . . . . ."),
            opt: { lead: { cut: 1500, env: 0, att: 0.05, rel: 0.4, gain: 0.26 }, pad: { cut: 900 } },
            dr: { Q: A("x.......x.......", 8), H: A("..g...g...g...g.", 8), C: D("X...............", 8) },
          },
          build2: {
            bars: 4,
            chords: "Abmaj7 . . . | Abmaj7 . . . | G . . . | G7 . . .",
            pad: R(),
            lead: "Ab5*16 | G5*16 | D5*16 | B4*8 D5*4 F5*4",
            fx: "riser@0/64",
            ramp: { pad: { cut: [700, 5e3, "exp"] } },
            dr: { K: w("x...x...x...x...", "x...x...x...x...", "x.x.x.x.x.x.x.x.", "x...x..........."), S: ce },
          },
          drop3: {
            bars: 8,
            chords: t,
            pad: R(),
            wob: q("R - R - R - - - R - - - O - O -"),
            sub: q("R - - - - - - - R - - - O - - -"),
            lead: n,
            stab: M("X . . x . . . . . . X . . x . ."),
            opt: { wob: { wobble: 2, lfoType: "square", wdepth: 1100 } },
            fx: "impact@0 down@112/16",
            dr: a,
            fill: { P: "....X...X.X.XXXX", K: "x...x...x...x..." },
          },
        },
        order: ["intro", "A", "build", "drop", "drop2", "brk", "build2", "drop3"],
        loop: 1,
      };
    })(),
    (function () {
      const t = "Cmaj7 . . . | D . . . | Bm7 . . . | Em7 . . . | Cmaj7 . . . | D . . . | Em7 . . . | Dsus4 . D .",
        n = `
      E5 - . G5 . B5 - . A5 - . G5 . E5 - D5 | F#5 - . A5 . D6 - . B5 - . A5 . F#5 - E5 |
      D6 - . B5 . F#5 - . A5 - . B5 . D6 - E6 | B5 - - - . G5 - . E5 - - - . . . . |
      E5 - . G5 . B5 - . A5 - . G5 . E5 - D5 | F#5 - . A5 . D6 - . B5 - . A5 . F#5 - E5 |
      D6 - . B5 . G5 - . A5 - . B5 . D6 - E6 | G5 - - - A5 - - - F#5 - - - D5 - E5 - `,
        e = q("R . . O . . R . . R . . O . R ."),
        a = {
          K: "x...x...x...x...",
          P: "....X.......X...",
          O: "..x...x...x...x.",
          H: ".g...g...g...gg.",
          R: "...........x....",
          C: D("X...............", 8),
        };
      ((B.race3 = {
        id: "race3",
        title: "PRISM BOULEVARD",
        bpm: 125,
        key: "G major",
        scale: "G major",
        swing: 0.04,
        gain: 0.78,
        echo: { steps: 3, fb: 0.35, wet: 0.45 },
        pump: { depth: 0.25, release: 1.1 },
        ch: {
          bass: { ins: "reese", vol: 0.27, lo: 31, gate: 0.8, sc: 1, opt: { cut: 280, env: 4200, envT: 0.045, q: 8, sq: 0.45, det: 7 } },
          sub: { ins: "sub", vol: 0.34, lo: 31, gate: 0.8, sc: 1 },
          pad: { ins: "supersaw", vol: 0.51, center: 62, max: 4, sc: 1, rev: 0.3, opt: { att: 0.05, rel: 0.25, cut: 3e3 } },
          stab: {
            ins: "supersaw",
            vol: 0.48,
            center: 69,
            max: 4,
            sc: 1,
            echo: 0.25,
            rev: 0.2,
            opt: { att: 0.003, rel: 0.06, cut: 3500, env: 6e3, envT: 0.05, sus: 0.4, dec: 0.07 },
          },
          lead: {
            ins: "spluck",
            vol: 0.36,
            gate: 0.9,
            echo: 0.3,
            rev: 0.2,
            pan: 0.05,
            opt: { decay: 0.24, bright: 7e3, sus: 0.3, det: 10, oct: 2 },
          },
          ss: {
            ins: "supersaw",
            vol: 0.51,
            gate: 0.8,
            echo: 0.22,
            rev: 0.25,
            pan: -0.05,
            opt: { att: 0.004, rel: 0.08, cut: 6e3, gain: 0.3 },
          },
          arp: {
            ins: "spluck",
            vol: 0.18,
            center: 76,
            pan: -0.3,
            echo: 0.42,
            rev: 0.2,
            sc: 1,
            opt: { decay: 0.1, bright: 6e3, duty: 0.125 },
          },
          bell: { ins: "bell", vol: 0.14, pan: 0.35, echo: 0.4, rev: 0.4, opt: { decay: 0.9 } },
          dr: { vol: 0.75, kick: 1.1, snrRev: 0.3, hats: 0.9 },
        },
        pat: {
          intro: {
            bars: 8,
            chords: t,
            pad: R(),
            arp: G("0 2 4 2 1 3 5 3 0 2 4 2 1 3 5 3"),
            ramp: { pad: { cut: [600, 3e3, "exp"] }, arp: { bright: [800, 6e3] } },
            fx: "swell@0/64 riser@96/32",
            dr: {
              K: w(A(S, 4), A("x...x...x...x...", 3), "x...x...x......."),
              H: w(A(S, 2), A(".g...g...g...gg.", 6)),
              Q: w(A("x...x...x...x...", 4), A(S, 4)),
              S: w(A(S, 6), "x...x...x...x...", "x.x.x.x.xxxxXX.."),
            },
          },
          A: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: e,
            sub: e,
            lead: n,
            arp: G("0 2 4 2 1 3 5 3 0 2 4 2 1 3 5 3"),
            fx: "impact@0",
            opt: { lead: { bright: 3e3, decay: 0.16 }, bass: { env: 2200 } },
            dr: a,
            fill: { P: "....X.......X.XX" },
          },
          build: {
            bars: 8,
            chords: t,
            pad: R(),
            lead: n,
            arp: G("0 2 4 2 0 2 4 2 0 2 4 2 0 2 4 2"),
            fx: "riser@0/128",
            bass: q(w(A("R . R . R . R . R . R . R . R .", 6), "R R R R R R R R R R R R R R R R", ". . . . . . . . . . . . . . . .")),
            ramp: { pad: { cut: [1e3, 9e3, "exp"] }, lead: { bright: [2e3, 9e3] } },
            dr: { K: w(A("x...x...x...x...", 6), "x.x.x.x.x.x.x.x.", "x...x...x......."), S: Le, H: A(".g.g.g.g.g.g.g.g", 8) },
          },
          drop: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: e,
            sub: e,
            lead: n,
            ss: n,
            stab: M(". . X . . x . . . . X . . x . ."),
            bell: J(n, 12),
            fx: "impact@0",
            dr: a,
            fill: { P: "....X.......XXXX" },
          },
          drop2: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: q("R . . O . . R . O . R . O . R O"),
            sub: e,
            lead: n,
            ss: n,
            ctr: Y("lead", 3, 9),
            stab: M(". . X . . x . . . . X . . x . x"),
            arp: G("5 4 3 2 5 4 3 2 5 4 3 2 5 4 3 2"),
            dr: a,
            fill: { K: "x...x...x.......", O: "..x...x........." },
            fx: "down@120/8",
          },
          brk: {
            bars: 8,
            chords: t,
            pad: R(),
            lead: n,
            bell: G("0 . 2 . 4 . 2 . 1 . 3 . 5 . 3 ."),
            opt: { lead: { bright: 1800, decay: 0.35 }, pad: { att: 0.4, cut: 1800 } },
            dr: { Q: A("x...x...x...x...", 8), P: w(A(S, 7), "....x...x...xxxx"), C: D("X...............", 8) },
          },
          build2: {
            bars: 4,
            chords: "Cmaj7 . . . | D . . . | Em7 . . . | Dsus4 . D .",
            pad: R(),
            lead: n.split("|").slice(4).join("|"),
            fx: "riser@0/64",
            bass: q(
              w(
                "R . R . R . R . R . R . R . R .",
                "R . R . R . R . R . R . R . R .",
                "R R R R R R R R R R R R R R R R",
                ". . . . . . . . . . . . . . . .",
              ),
            ),
            ramp: { pad: { cut: [1200, 9e3, "exp"] } },
            dr: { K: w(A("x...x...x...x...", 3), "x...x...x......."), S: ce, H: A(".g.g.g.g.g.g.g.g", 4) },
          },
          drop3: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: q("R . . O . . R . O . R . O . R O"),
            sub: e,
            lead: n,
            ss: J(n, 12),
            ctr: Y("lead", 3, 9),
            stab: M(". . X . . x . . . . X . . x . x"),
            arp: G("5 4 3 2 5 4 3 2 5 4 3 2 5 4 3 2"),
            fx: "impact@0 down@112/16",
            dr: a,
            fill: { P: "....X...X.X.XXXX", O: "..x...x...x....." },
          },
        },
        order: ["intro", "A", "build", "drop", "drop2", "brk", "build2", "drop3"],
        loop: 1,
      }),
        (B.race3.ch.ctr = {
          ins: "supersaw",
          vol: 0.2,
          pan: 0.25,
          echo: 0.2,
          rev: 0.25,
          opt: { att: 0.004, rel: 0.08, cut: 4e3, gain: 0.3 },
        }));
    })(),
    (function () {
      const t = "Gmaj7 . . . | A . . . | F#m7 . . . | Bm7 . . . | Gmaj7 . . . | A . . . | D/F# . . . | Asus4 . A .",
        n = `
      F#5 - - - A5 - - - B5 - - - A5 - F#5 - | E5 - - - - - - - . . C#5 - E5 - A5 - |
      C#6 - - - B5 - A5 - - - F#5 - - - E5 - | F#5 - - - - - - - D5 - - - E5 - F#5 - |
      B5 - - - D6 - - - E6 - - - D6 - B5 - | C#6 - - - - - - - A5 - B5 - C#6 - E6 - |
      F#6 - - - E6 - D6 - - - A5 - - - B5 - | A5 - - - - - - - . . . . . . . . `,
        e = { K: "x...x...x...x...", P: "....X.......X...", O: "..x...x...x...x.", H: ".g...g...g...g..", C: D("X...............", 8) },
        a = q(". . R - . . R - . . O - . . R -");
      B.results = {
        id: "results",
        title: "VICTORY LANE",
        bpm: 126,
        key: "D major",
        scale: "D major",
        gain: 0.8,
        echo: { steps: 3, fb: 0.38, wet: 0.45 },
        pump: { depth: 0.22, release: 1.1 },
        ch: {
          bass: { ins: "reese", vol: 0.24, lo: 38, gate: 0.9, sc: 1, opt: { cut: 380, env: 1800, q: 4, sq: 0, det: 12 } },
          sub: { ins: "sub", vol: 0.38, lo: 26, gate: 0.9, sc: 1 },
          pad: { ins: "supersaw", vol: 0.58, center: 62, max: 4, sc: 1, rev: 0.35, opt: { att: 0.03, rel: 0.3, cut: 3400 } },
          stab: {
            ins: "supersaw",
            vol: 0.44,
            center: 69,
            max: 4,
            sc: 1,
            echo: 0.2,
            rev: 0.2,
            opt: { att: 0.003, rel: 0.07, cut: 3500, env: 5e3, envT: 0.06, sus: 0.45, dec: 0.09 },
          },
          lead: {
            ins: "supersaw",
            vol: 0.4,
            gate: 0.95,
            echo: 0.25,
            rev: 0.35,
            opt: { att: 0.006, rel: 0.15, cut: 5500, env: 2500, gain: 0.32, vib: 12 },
          },
          pl: { ins: "spluck", vol: 0.24, tr: 12, pan: 0.2, echo: 0.3, rev: 0.25, opt: { decay: 0.3, bright: 6e3, sus: 0.2 } },
          harm: { ins: "supersaw", vol: 0.34, pan: -0.25, echo: 0.2, rev: 0.3, opt: { att: 0.006, rel: 0.15, cut: 4e3, gain: 0.3 } },
          dr: { vol: 0.72, kick: 1.1, snrRev: 0.35 },
        },
        pat: {
          intro: {
            bars: 2,
            chords: "Gmaj7 . . . | Asus4 . A .",
            pad: R(),
            stab: M("X . . X . . X . X . . X . . X . | X . . . . . . . X . . X . X X X"),
            fx: "impact@0 riser@16/16",
            dr: { K: w("X..X..X.X..X..X.", "X.......x...x..."), S: w(S, "x.x.x.x.xxxxXXXX"), C: w("X...............", S) },
          },
          A: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: a,
            sub: a,
            lead: n,
            pl: n,
            stab: M(". . x . . . x . . . x . . . x ."),
            fx: "impact@0",
            dr: e,
            fill: { P: "....X.......X.XX" },
          },
          B: {
            bars: 8,
            chords: t,
            pad: R(),
            pl: n,
            sub: q("R - - - - - - - - - - - - - - -"),
            opt: { pad: { att: 0.3, cut: 2e3 }, pl: { decay: 0.5, sus: 0.3, bright: 3e3 } },
            dr: { Q: A("x...x...x...x...", 8), H: A("..g...g...g...g.", 8), C: D("X...............", 8) },
          },
          build: {
            bars: 4,
            chords: "Gmaj7 . . . | A . . . | D/F# . . . | Asus4 . A .",
            pad: R(),
            pl: n.split("|").slice(4).join("|"),
            fx: "riser@0/64",
            bass: q(
              w(
                "R . R . R . R . R . R . R . R .",
                "R . R . R . R . R . R . R . R .",
                "R R R R R R R R R R R R R R R R",
                ". . . . . . . . . . . . . . . .",
              ),
            ),
            ramp: { pad: { cut: [1200, 9e3, "exp"] } },
            dr: { K: w(A("x...x...x...x...", 3), "x...x...x......."), S: ce, H: A(".g.g.g.g.g.g.g.g", 4) },
          },
          A2: {
            bars: 8,
            chords: t,
            pad: R(),
            bass: a,
            sub: a,
            lead: n,
            harm: Y("lead", 3, 9),
            pl: n,
            stab: M("X . x . . x x . . . x . . x x ."),
            fx: "impact@0",
            dr: e,
            fill: { P: "....X...X.X.XXXX", O: "..x...x...x....." },
          },
        },
        order: ["intro", "A", "B", "build", "A2", "B"],
        loop: 1,
      };
    })(),
    (B.gameover = {
      id: "gameover",
      title: "BURNOUT",
      bpm: 84,
      key: "A minor",
      scale: "A harmonic",
      echo: { steps: 4, fb: 0.45, wet: 0.5 },
      ch: {
        lead: { ins: "spluck", vol: 0.36, pan: 0.08, echo: 0.4, rev: 0.5, opt: { decay: 0.9, sus: 0.35, bright: 2500, det: 8 } },
        pad: { ins: "supersaw", vol: 0.32, center: 57, max: 4, rev: 0.6, opt: { att: 0.5, rel: 1.2, cut: 1300 } },
        bass: { ins: "sub", vol: 0.45, opt: { gain: 0.6 } },
        bell: { ins: "bell", vol: 0.16, pan: 0.3, echo: 0.5, rev: 0.6, opt: { decay: 2, ratio: 3.5, index: 1.6 } },
        dr: { vol: 0.8, kf: 160, kLen: 0.7, toms: 1.2 },
      },
      pat: {
        end: {
          bars: 4,
          chords: "Am . . . | F . . . | Dm . E7 . | Am . . .",
          fx: "impact@0 down@48/16",
          lead: "E5 - - - - - D5 - C5 - - - B4 - A4 - | C5 - - - - - - - A4 - - - F4 - - - | F4 - - - - - - - E4 - - - G#4 - - - | A4*16",
          pad: R(),
          bass: "A1*16 | F1*16 | D2*8 E2*8 | A1*16",
          bell: "A5 . . . . . . . . . . . . . . . | F5 . . . . . . . . . . . . . . . | D5 . . . . . . . E5 . . . . . . . | A4 . . . . . . . . . . . . . . .",
          dr: {
            K: "X...............|................|................|X...............",
            T: "................|................|........l.......|l...............",
          },
        },
      },
      order: ["end"],
      loop: -1,
    }));
  const ft = ["title", "race1", "race2", "race3", "results", "gameover"],
    ht = { neon_harbor: "race1", lunar_dome: "race3" },
    je = {};
  function Ae(t) {
    return B[t] ? je[t] || (je[t] = Ee(B[t])) : null;
  }
  const Ke = 0.3,
    Qe = 90,
    We = 0.12,
    l = {
      ctx: null,
      core: null,
      unlocked: !1,
      player: null,
      old: [],
      pending: null,
      tempo: 1,
      musicVol: 0.7,
      sfxVol: 0.9,
      loops: {},
      engine: null,
      timer: null,
      hiddenSuspended: !1,
      lastSfx: {},
      voices: null,
      gestureBound: !1,
      dbLoaded: !1,
      custom: {},
      customHave: {},
      customEnc: {},
      pendingCustom: {},
      decoding: {},
      want: null,
      engIdle: -1,
      ticks: 0,
    };
  function H() {
    return l.ctx ? l.ctx.currentTime : 0;
  }
  function E() {
    return !!(l.unlocked && l.core && l.ctx && l.ctx.state !== "closed");
  }
  function _e() {
    return !!((l.player && !l.player.custom) || l.old.length || l.loops.lowEnergy);
  }
  function Ne() {
    ((l.timer = null), l.ticks++);
    try {
      if (E()) {
        const t = l.ctx.currentTime,
          n = t + Ke;
        l.player &&
          (l.player.pump(n, t),
          l.player.done && l.player.endTime != null && t > l.player.endTime + 4 && (l.player.dispose(), (l.player = null)));
        for (let a = l.old.length - 1; a >= 0; a--) {
          const c = l.old[a];
          (c.pump(n, t), t > c.killAt && (c.dispose(), l.old.splice(a, 1)));
        }
        const e = l.loops.lowEnergy;
        e && e.pump && e.pump(t + 0.2);
      }
    } catch {}
    _e() && l.ctx && l.ctx.state === "running" && (l.timer = setTimeout(Ne, Qe));
  }
  function N() {
    !l.timer && _e() && E() && (l.timer = setTimeout(Ne, Qe));
  }
  const dt = "plasma-gp-audio",
    Re = "tracks";
  function mt() {
    return new Promise((t, n) => {
      try {
        const e = window.indexedDB;
        if (!e) return n(new Error("no indexedDB"));
        const a = e.open(dt, 1);
        ((a.onupgradeneeded = () => {
          try {
            a.result.createObjectStore(Re);
          } catch {}
        }),
          (a.onsuccess = () => t(a.result)),
          (a.onerror = () => n(a.error || new Error("idb open failed"))));
      } catch (e) {
        n(e);
      }
    });
  }
  function fe(t, n) {
    return mt().then(
      (e) =>
        new Promise((a, c) => {
          try {
            const i = e.transaction(Re, t),
              s = i.objectStore(Re),
              r = n(s);
            ((i.oncomplete = () => {
              (a(r && r.result), e.close());
            }),
              (i.onerror = i.onabort =
                () => {
                  (c(i.error), e.close());
                }));
          } catch (i) {
            c(i);
          }
        }),
    );
  }
  function Ue(t) {
    return t
      ? t instanceof ArrayBuffer
        ? Promise.resolve(t)
        : ArrayBuffer.isView(t)
          ? Promise.resolve(t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength))
          : t.arrayBuffer
            ? t.arrayBuffer()
            : typeof FileReader < "u" && typeof Blob < "u" && t instanceof Blob
              ? new Promise((n, e) => {
                  const a = new FileReader();
                  ((a.onload = () => n(a.result)), (a.onerror = () => e(a.error)), a.readAsArrayBuffer(t));
                })
              : Promise.reject(new Error("unsupported data type"))
      : Promise.reject(new Error("no data"));
  }
  function ze(t) {
    return new Promise((n, e) => {
      try {
        const a = l.ctx.decodeAudioData(t.slice(0), n, e);
        a && a.then && a.then(n, e);
      } catch (a) {
        e(a);
      }
    });
  }
  function oe(t, n, e) {
    const a = t.ctx;
    ((this.c = t),
      (this.id = e),
      (this.custom = !0),
      (this.log = []),
      (this.late = 0),
      (this.out = a.createGain()),
      (this.out.gain.value = 0),
      this.out.connect(t.music),
      (this.src = a.createBufferSource()),
      (this.src.buffer = n),
      (this.src.loop = !0),
      this.src.connect(this.out),
      (this.done = !1),
      (this.stopping = !1),
      (this.tempoTarget = 1));
  }
  ((oe.prototype.start = function (t, n) {
    const e = this.out.gain,
      a = 0.8;
    (e.setValueAtTime(0, t), n > 0 ? e.linearRampToValueAtTime(a, t + n) : e.setValueAtTime(a, t), this.src.start(t));
  }),
    (oe.prototype.stop = function (t, n) {
      if (this.stopping) return;
      ((this.stopping = !0), (n = Math.max(0.01, n || 0)));
      const e = this.out.gain;
      try {
        e.cancelScheduledValues(t);
      } catch {}
      (e.setValueAtTime(e.value, t), e.linearRampToValueAtTime(0, t + n));
      try {
        this.src.stop(t + n + 0.05);
      } catch {}
      this.killAt = t + n + 0.5;
    }),
    (oe.prototype.pump = function () {}),
    (oe.prototype.dispose = function () {
      try {
        (this.src.disconnect(), this.out.disconnect());
      } catch {}
    }));
  const we = 180 * 48e3 * 2 * 4;
  function $e(t) {
    const n = l.ctx;
    if (t.length * t.numberOfChannels * 4 <= we || t.duration <= 180) return Promise.resolve(t);
    let a = t;
    if (t.numberOfChannels > 1) {
      a = n.createBuffer(1, t.length, t.sampleRate);
      const r = a.getChannelData(0),
        o = t.numberOfChannels,
        u = 1 / o;
      for (let h = 0; h < o; h++) {
        const f = t.getChannelData(h);
        if (h === 0) for (let d = 0; d < f.length; d++) r[d] = f[d] * u;
        else for (let d = 0; d < f.length; d++) r[d] += f[d] * u;
      }
    }
    if (a.length * 4 <= we) return Promise.resolve(a);
    const i = window.OfflineAudioContext || window.webkitOfflineAudioContext,
      s = Math.max(16e3, Math.floor(we / (4 * a.duration)));
    if (!i || s >= a.sampleRate) return Promise.resolve(a);
    try {
      const r = new i(1, Math.ceil(a.duration * s), s),
        o = r.createBufferSource();
      ((o.buffer = a), o.connect(r.destination), o.start(0));
      const u = r.startRendering();
      return (
        u && u.then
          ? u
          : new Promise((h) => {
              r.oncomplete = (f) => h(f.renderedBuffer);
            })
      ).catch(() => a);
    } catch {
      return Promise.resolve(a);
    }
  }
  function xt(t) {
    return l.customEnc[t]
      ? Promise.resolve(l.customEnc[t])
      : fe("readonly", (n) => n.get(t))
          .then((n) => (n && n.data ? Ue(n.data) : null))
          .catch(() => null);
  }
  function le() {
    const t = l.player ? l.player.id : null;
    for (const n in l.custom) n !== t && n !== l.want && !(l.pending && l.pending.name === n) && delete l.custom[n];
  }
  function he(t) {
    if (l.custom[t]) return Promise.resolve(l.custom[t]);
    if (l.decoding[t]) return l.decoding[t];
    if (!E()) return Promise.resolve(null);
    const n = xt(t)
      .then((e) => (e ? ze(e).then($e) : (l.customEnc[t] || (l.customHave[t] = !1), null)))
      .catch(() => null)
      .then((e) => (delete l.decoding[t], e && ((l.custom[t] = e), le()), e));
    return ((l.decoding[t] = n), n);
  }
  function qe(t, n) {
    if (l.custom[t] && l.player && l.player.id === t && !l.player.custom && !l.player.stopping) ne(t, { fadeIn: n });
    else if (l.custom[t] && l.pending && l.pending.name === t && E()) {
      const e = l.pending;
      ((l.pending = null), ne(e.name, e.opts));
    }
  }
  function gt() {
    l.dbLoaded ||
      ((l.dbLoaded = !0),
      fe("readonly", (t) => (t.getAllKeys ? t.getAllKeys() : null))
        .then((t) => {
          (t || []).forEach((e) => {
            B[e] && (l.customHave[e] = !0);
          });
          const n = l.player ? l.player.id : l.pending ? l.pending.name : null;
          for (const e of [n, l.want])
            e &&
              l.customHave[e] &&
              !l.custom[e] &&
              he(e).then((a) => {
                a && qe(e, 0.6);
              });
        })
        .catch(() => {}));
  }
  function ne(t, n) {
    const e = l.custom[t],
      a = e ? null : Ae(t);
    if (!e && !a) return;
    const c = H() + 0.06,
      i = n && n.fadeIn != null ? +n.fadeIn : 0;
    if (l.player) {
      const r = n && n.crossfade != null ? +n.crossfade : Math.max(0.35, i || 0.5);
      (l.player.stop(c, r), l.old.push(l.player), (l.player = null));
    }
    try {
      const r = z.Voice && z.Voice.duckTarget != null ? +z.Voice.duckTarget : 1;
      (l.core.duck.gain.cancelScheduledValues(c), l.core.duck.gain.setTargetAtTime(r > 0 && r <= 1 ? r : 1, c, 0.05));
    } catch {}
    const s = e ? new oe(l.core, e, t) : new K(l.core, a, { tempo: l.tempo });
    (s.start(c, i),
      (s.id = t),
      (l.player = s),
      l.want === t && (l.want = null),
      s.pump(H() + Ke, H()),
      le(),
      !e &&
        l.customHave[t] &&
        he(t).then((r) => {
          r && qe(t, 0.6);
        }),
      N());
  }
  function bt() {
    if (l.gestureBound || typeof document > "u") return;
    l.gestureBound = !0;
    const t = () => {
      if (!(!l.ctx || document.hidden) && l.ctx.state !== "running")
        try {
          const n = l.ctx.resume();
          n && n.then && n.then(N, () => {});
        } catch {}
    };
    for (const n of ["touchend", "pointerup", "mousedown", "keydown"])
      try {
        document.addEventListener(n, t, { passive: !0, capture: !0 });
      } catch {}
    document.addEventListener("visibilitychange", () => {
      if (l.ctx)
        try {
          if (document.hidden) l.ctx.state === "running" && ((l.hiddenSuspended = !0), l.ctx.suspend());
          else {
            l.hiddenSuspended = !1;
            const n = l.ctx.resume();
            n && n.then && n.then(N, () => {});
          }
        } catch {}
    });
  }
  /* iOS: system speech hijacks the audio session and silences everything else (see voice.js) */
  function pgpNoTts() {
    try {
      const f = z.Settings && z.Settings.get("voice.tts", null);
      if (f !== null && f !== void 0) return !f;
      const u = navigator.userAgent || "";
      return /iPhone|iPad|iPod/.test(u) || (/Macintosh/.test(u) && (navigator.maxTouchPoints || 0) > 1);
    } catch {
      return !1;
    }
  }
  function Xe() {
    if (l.ctx) return !0;
    if (typeof navigator < "u" && navigator.audioSession)
      try {
        navigator.audioSession.type = "playback";
      } catch {}
    const t = window.AudioContext || window.webkitAudioContext;
    if (!t) return !1;
    try {
      l.ctx = new t({ latencyHint: "interactive" });
    } catch {
      l.ctx = new t();
    }
    return (
      (l.core = ve(l.ctx, { lazy: !0 })),
      (l.core.music.gain.value = l.musicVol),
      (l.core.sfx.gain.value = l.sfxVol),
      (l.ctx.onstatechange = () => {
        (l.ctx.state === "running" && N(),
          l.unlocked &&
            (l.ctx.state === "interrupted" || (l.ctx.state === "suspended" && !l.hiddenSuspended && !document.hidden)) &&
            setTimeout(() => {
              try {
                document.hidden || l.ctx.resume();
              } catch {}
            }, 400));
      }),
      bt(),
      rt(l.core),
      !0
    );
  }
  (function () {
    if (typeof window > "u" || typeof document > "u") return;
    let n = !1;
    const e = () => {
        if (!n) {
          n = !0;
          try {
            Xe();
          } catch {}
        }
      },
      a = ["touchstart", "pointerdown", "mousedown", "keydown"],
      c = () => {
        e();
        for (const s of a) document.removeEventListener(s, c, !0);
      };
    for (const s of a)
      try {
        document.addEventListener(s, c, { capture: !0, passive: !0 });
      } catch {}
    const i = () => {
      const s = window.requestIdleCallback;
      s ? s(e, { timeout: 1500 }) : setTimeout(e, 600);
    };
    document.readyState === "complete" ? i() : window.addEventListener("load", i, { once: !0 });
  })();
  const Ve = {
    songs: ft.map((t) => ({ id: t, title: B[t].title, bpm: B[t].bpm, key: B[t].key })),
    levelTracks: ["race1", "race2", "race3"],
    trackForLevel(t) {
      const n = Ve.levelTracks,
        e = Math.max(1, Math.floor(+t || 1)) - 1;
      return n[e % n.length];
    },
    hasCustomTrack(t) {
      return !!(l.customHave[t] || l.custom[t] || l.pendingCustom[t]);
    },
    prepare(t) {
      try {
        const n = B[t] ? t : ht[t];
        return !n || ((l.want = n), le(), !l.customHave[n] && !l.pendingCustom[n]) ? Promise.resolve(!1) : he(n).then((e) => !!e);
      } catch {
        return Promise.resolve(!1);
      }
    },
    setCustomTrack(t, n, e) {
      try {
        if (!B[t] || !n) return Promise.resolve(!1);
        const a = !(e && e.persist === !1);
        return Ue(n)
          .then((c) => {
            const i = () =>
              a
                ? fe("readwrite", (s) => s.put({ data: c, t: Date.now() }, t))
                    .then(() => !0)
                    .catch(() => !1)
                : Promise.resolve(!1);
            return E()
              ? ze(c)
                  .then($e)
                  .then((s) => {
                    const r = l.player && l.player.id === t;
                    return (
                      (l.customHave[t] = !0),
                      delete l.pendingCustom[t],
                      (l.custom[t] = s),
                      (l.customEnc[t] = c),
                      r && !l.player.stopping ? ne(t, { fadeIn: 0.5 }) : le(),
                      i().then((o) => (o && delete l.customEnc[t], !0))
                    );
                  })
              : ((l.pendingCustom[t] = c), (l.customHave[t] = !0), i().then(() => !0));
          })
          .catch(() => !1);
      } catch {
        return Promise.resolve(!1);
      }
    },
    clearCustomTrack(t) {
      try {
        const n = !!(l.custom[t] || l.customHave[t]),
          e = l.player && l.player.id === t && l.player.custom;
        return (
          delete l.custom[t],
          delete l.customHave[t],
          delete l.pendingCustom[t],
          delete l.customEnc[t],
          delete l.decoding[t],
          n && e && E() && ne(t, { fadeIn: 0.5 }),
          fe("readwrite", (a) => a.delete(t))
            .then(() => !0)
            .catch(() => !1)
        );
      } catch {
        return Promise.resolve(!1);
      }
    },
    get unlocked() {
      return l.unlocked;
    },
    get context() {
      return l.ctx;
    },
    get currentSong() {
      return l.player ? l.player.id : l.pending ? l.pending.name : null;
    },
    warm() {
      try {
        return Xe();
      } catch {
        return !1;
      }
    },
    unlock() {
      try {
        if (!Xe()) return !1;
        if (l.ctx.state !== "running")
          try {
            const e = l.ctx.resume();
            e && e.then && e.then(N, () => {});
          } catch {}
        const t = l.ctx.createBuffer(1, 1, l.ctx.sampleRate),
          n = l.ctx.createBufferSource();
        if (((n.buffer = t), n.connect(l.ctx.destination), n.start(0), !l.unlocked)) {
          l.unlocked = !0;
          try {
            if (window.speechSynthesis && window.SpeechSynthesisUtterance && !pgpNoTts()) {
              const e = new SpeechSynthesisUtterance(" ");
              ((e.volume = 0), window.speechSynthesis.speak(e));
            }
          } catch {}
          for (const e in l.pendingCustom) {
            const a = l.pendingCustom[e];
            (delete l.pendingCustom[e], (l.customHave[e] = !0), (l.customEnc[e] = a));
          }
          if ((gt(), l.pending)) {
            const e = l.pending;
            ((l.pending = null), ne(e.name, e.opts));
          }
          for (const e in l.customEnc)
            (e === l.want || (l.player && l.player.id === e)) &&
              he(e).then((a) => {
                a && qe(e, 0.6);
              });
          N();
        }
        return !0;
      } catch {
        return !1;
      }
    },
    playMusic(t, n) {
      try {
        if (!B[t]) return;
        if (!E()) {
          l.pending = { name: t, opts: n };
          return;
        }
        if (l.player && l.player.id === t && !l.player.stopping && !(n && n.restart)) return;
        ne(t, n || {});
      } catch {}
    },
    stopMusic(t) {
      try {
        if (((l.pending = null), !E() || !l.player)) return;
        (l.player.stop(H(), t == null ? 0.5 : +t), l.old.push(l.player), (l.player = null), le(), N());
      } catch {}
    },
    setTempoScale(t) {
      ((t = Math.max(0.5, Math.min(2, +t || 1))), (l.tempo = t), l.player && (l.player.tempoTarget = t));
    },
    setMusicVolume(t) {
      ((l.musicVol = Math.max(0, Math.min(1, +t || 0))), E() && l.core.music.gain.setTargetAtTime(l.musicVol, H(), 0.03));
    },
    setSfxVolume(t) {
      ((l.sfxVol = Math.max(0, Math.min(1, +t || 0))), E() && l.core.sfx.gain.setTargetAtTime(l.sfxVol, H(), 0.03));
    },
    sfx(t, n) {
      try {
        if (!E() || !se[t]) return;
        const e = H() + 0.005,
          a = t === "wallHit" || t === "shipHit" ? 0.07 : 0.025;
        if (l.lastSfx[t] != null && e - l.lastSfx[t] < a) return;
        ((l.lastSfx[t] = e), se[t](l.core, l.core.sfx, e, n || {}));
      } catch {}
    },
    loop(t, n) {
      try {
        if (!E() || !re[t]) return;
        const e = l.loops[t];
        n && !e
          ? ((l.loops[t] = re[t](l.core, l.core.sfx, H() + 0.005)), t === "lowEnergy" && N())
          : !n && e && (e.stop(H()), delete l.loops[t]);
      } catch {}
    },
    engine(t) {
      try {
        if (!E() || !t) return;
        if (!t.on) {
          const n = l.engine;
          if (!n) return;
          const e = H();
          if (l.engIdle < 0) {
            ((l.engIdle = e), n.set(t, e));
            return;
          }
          if (e - l.engIdle > 0.5) {
            (n.dispose(e), (l.engine = null), (l.engIdle = -1));
            return;
          }
          n.set(t, e);
          return;
        }
        ((l.engIdle = -1), l.engine || (l.engine = new ie(l.core)), l.engine.set(t, H()));
      } catch {}
    },
    announce(t) {
      try {
        if (!l.unlocked || !window.speechSynthesis || !window.SpeechSynthesisUtterance || pgpNoTts()) return;
        const n = window.speechSynthesis;
        if (z.Voice && z.Voice.speaking) return;
        if (l.announceU && (n.speaking || n.pending))
          try {
            n.cancel();
          } catch {}
        const e = new SpeechSynthesisUtterance(String(t));
        if (((l.announceU = e), (e.pitch = 0.3), (e.rate = 1.15), (e.volume = Math.min(1, l.sfxVol * 1.1)), !l.voices))
          try {
            l.voices = n.getVoices() || [];
          } catch {
            l.voices = [];
          }
        if (!l.voices.length)
          try {
            l.voices = n.getVoices() || [];
          } catch {}
        const a =
          l.voices.find((c) => /^en/i.test(c.lang) && /male|daniel|fred|alex|google uk english male/i.test(c.name)) ||
          l.voices.find((c) => /^en/i.test(c.lang));
        (a && (e.voice = a), n.speak(e), E() && ye(l.core, H(), 0.6, 0.9));
      } catch {}
    },
  };
  function ke(t, n) {
    const e = window.OfflineAudioContext || window.webkitOfflineAudioContext,
      a = new e(2, Math.ceil(t * n), n);
    return { ctx: a, core: ve(a) };
  }
  ((Ve._internal = {
    SONGS: B,
    getSong: Ae,
    compileSong: Ee,
    parseChord: Ce,
    parseScale: pe,
    n2m: ue,
    m2n: xe,
    mtof: V,
    dia: Ze,
    tr: J,
    INS: ae,
    SFX: se,
    LOOPS: re,
    DRUM: ee,
    Player: K,
    Engine: ie,
    makeCore: ve,
    renderSong(t, n) {
      n = n || {};
      const e = Ae(t),
        a = n.sampleRate || 32e3,
        c = n.seconds || e.totalSec + (e.loop >= 0 ? (n.tail == null ? 12 : n.tail) : 3),
        { ctx: i, core: s } = ke(c, a);
      s.music.gain.value = n.musicVol == null ? 0.7 : n.musicVol;
      const r = new K(s, e, { startOrder: n.startOrder || 0, tempo: n.tempo || 1 });
      if (((r.stepTimes = []), n.tempoAt)) {
        const d = r.advance.bind(r);
        r.advance = function () {
          for (const p of n.tempoAt) this.nextTime >= p.t && !p.done && ((this.tempoTarget = p.s), (p.done = !0));
          d();
        };
      }
      const o = 0.05,
        u = 0.25;
      (r.start(o, 0), r.pump(u + We, null, 1e6));
      const h = (d) =>
        i.suspend(d).then(() => {
          (r.pump(d + u + We, null, 1e6), d + u < c && h(d + u), i.resume());
        });
      u < c && h(u);
      const f = performance.now();
      return i
        .startRendering()
        .then((d) => ({
          buf: d,
          log: r.log,
          stepTimes: r.stepTimes,
          t0: o,
          renderMs: performance.now() - f,
          info: { introSec: e.introSec, loopSec: e.loopSec, totalSec: e.totalSec, bpm: e.bpm },
        }));
    },
    renderSfx(t, n, e, a) {
      ((a = a || 32e3), (e = e || 3));
      const { ctx: c, core: i } = ke(e, a);
      if (se[t]) se[t](i, i.sfx, 0.02, n || {});
      else if (re[t]) {
        const s = re[t](i, i.sfx, 0.02);
        (s.pump && s.pump(e - 0.6), s.stop(e - 0.6));
      }
      return c.startRendering();
    },
    renderEngine(t, n) {
      ((n = n || 32e3), (t = t || 8));
      const { ctx: e, core: a } = ke(t, n),
        c = new ie(a);
      for (let i = 0.02; i < t; i += 1 / 60) {
        const s = Math.min(1, i / 4.5),
          r = i > 5 && i < 6.5,
          o = i < t - 1;
        c.set({ on: o, speed01: r ? 1.2 : s, boost: r, z: Math.sin(i * 6) * 2 }, i);
      }
      return e.startRendering();
    },
    state: l,
  }),
    (z.Audio = Ve));
})();
