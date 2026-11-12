/* voice.js */
(function () {
  "use strict";
  const l = (window.FZ = window.FZ || {}),
    e = {
      base: "voice/",
      man: null,
      manP: null,
      manFailed: !1,
      abs: new Map(),
      bufs: new Map(),
      loading: new Map(),
      ahead: new Map(),
      pf: Promise.resolve(),
      noise: null,
      cur: null,
      queue: [],
      seq: 0,
      src: null,
      utter: null,
      safety: 0,
      ctxRef: null,
      bus: null,
      ssVoices: null,
      ducked: !1,
      plays: 0,
      ttsPlays: 0,
      lastError: null,
    },
    S = 0.42,
    C = 8,
    T = 3,
    x = (t, r) => {
      try {
        return l.Settings ? l.Settings.get(t, r) : r;
      } catch {
        return r;
      }
    },
    b = (t, r) => {
      try {
        l.Settings && l.Settings.set(t, r);
      } catch {}
    },
    A = () => x("voice.on", !0) !== !1,
    m = () => {
      const t = +x("voice.vol", 1);
      return isFinite(t) ? Math.max(0, Math.min(1, t)) : 1;
    };
  function d() {
    try {
      return (l.Audio && l.Audio.context) || null;
    } catch {
      return null;
    }
  }
  function D(t) {
    let r = 2166136261;
    t = String(t);
    for (let n = 0; n < t.length; n++) ((r ^= t.charCodeAt(n)), (r = Math.imul(r, 16777619) >>> 0));
    return ("0000000" + r.toString(16)).slice(-8);
  }
  function L() {
    const t = d();
    if (!t) return null;
    if (e.ctxRef !== t || !e.bus)
      try {
        const r = t.createGain();
        r.gain.value = m() * 1;
        const n = t.createDynamicsCompressor();
        ((n.threshold.value = -14),
          (n.knee.value = 6),
          (n.ratio.value = 4),
          (n.attack.value = 0.003),
          (n.release.value = 0.15),
          r.connect(n),
          n.connect(t.destination),
          (e.bus = r),
          (e.ctxRef = t));
      } catch {
        return ((e.bus = null), null);
      }
    return e.bus;
  }
  function p(t) {
    if (e.ducked !== t) {
      e.ducked = t;
      try {
        const r = l.Audio && l.Audio._internal,
          n = r && r.state && r.state.core,
          i = d();
        if (!n || !n.duck || !i) return;
        const s = n.duck.gain,
          a = i.currentTime;
        (s.cancelScheduledValues(a), s.setValueAtTime(s.value, a), s.setTargetAtTime(t ? S : 1, a, t ? 0.05 : 0.3));
      } catch {}
    }
  }
  function P(t, r, n, i) {
    try {
      let s = e.noise;
      if (!s || s.ctx !== t || s.rate !== t.sampleRate) {
        const c = Math.floor(t.sampleRate * 0.07),
          f = t.createBuffer(1, c, t.sampleRate),
          v = f.getChannelData(0);
        for (let k = 0; k < c; k++) v[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / c, 2);
        s = e.noise = { ctx: t, rate: t.sampleRate, buf: f };
      }
      const a = t.createBufferSource();
      a.buffer = s.buf;
      const u = t.createBiquadFilter();
      ((u.type = "bandpass"), (u.frequency.value = 2200), (u.Q.value = 0.8));
      const o = t.createGain();
      if (((o.gain.value = 0.16), a.connect(u), u.connect(o), o.connect(r), a.start(n), a.stop(n + 0.08), i)) {
        const c = t.createOscillator(),
          f = t.createGain();
        ((c.type = "square"),
          c.frequency.setValueAtTime(1650, n),
          c.frequency.setValueAtTime(2200, n + 0.035),
          f.gain.setValueAtTime(1e-4, n),
          f.gain.linearRampToValueAtTime(0.05, n + 0.004),
          f.gain.setValueAtTime(0.05, n + 0.06),
          f.gain.linearRampToValueAtTime(1e-4, n + 0.075),
          c.connect(f),
          f.connect(r),
          c.start(n),
          c.stop(n + 0.08));
      }
    } catch {}
  }
  function y() {
    if (e.man) return Promise.resolve(e.man);
    if (e.manFailed) return Promise.resolve(null);
    if (e.manP) return e.manP;
    if (typeof fetch != "function" || (typeof location < "u" && location.protocol === "file:"))
      return ((e.manFailed = !0), Promise.resolve(null));
    const t = e.base,
      r = (e.manP = fetch(t + "manifest.json", { cache: "no-cache" })
        .then((n) => {
          if (!n.ok) throw new Error("manifest " + n.status);
          return n.json();
        })
        .then((n) => {
          if (!n || !n.lines) throw new Error("bad manifest");
          return (e.base === t && (e.man = n), n);
        })
        .catch((n) => (e.base === t && (e.manFailed = !0), (e.lastError = String(n)), null))
        .then((n) => (e.manP === r && (e.manP = null), e.base === t ? n : y())));
    return e.manP;
  }
  function g(t, r) {
    const n = e.man,
      i = n && n.lines && n.lines[t];
    return !i || (r != null && i.h && i.h !== D(r)) ? null : i;
  }
  function w(t) {
    if (e.abs.has(t.f)) return Promise.resolve(e.abs.get(t.f));
    if (e.loading.has(t.f)) return e.loading.get(t.f);
    const r = fetch(e.base + t.f)
      .then((n) => {
        if (!n.ok) throw new Error(t.f + " " + n.status);
        return n.arrayBuffer();
      })
      .then((n) => (e.abs.set(t.f, n), e.loading.delete(t.f), n))
      .catch((n) => (e.loading.delete(t.f), (e.lastError = String(n)), null));
    return (e.loading.set(t.f, r), r);
  }
  function M(t, r) {
    return new Promise((n) => {
      try {
        const i = r.slice(0),
          s = t.decodeAudioData(
            i,
            (a) => n(a),
            () => n(null),
          );
        s && s.then && s.then(n, () => n(null));
      } catch {
        n(null);
      }
    });
  }
  function _(t, r) {
    const n = d();
    if (!n) return Promise.resolve(null);
    const i = e.bufs.get(t.f);
    if (i) return (e.bufs.delete(t.f), e.bufs.set(t.f, i), Promise.resolve(i));
    const s = e.ahead.get(t.f);
    return s
      ? (e.ahead.delete(t.f), r || V(t.f, s), Promise.resolve(s))
      : w(t)
          .then((a) => (a ? M(n, a) : null))
          .then((a) => (r ? e.abs.delete(t.f) : a && V(t.f, a), a));
  }
  function V(t, r) {
    for (e.bufs.set(t, r); e.bufs.size > C;) e.bufs.delete(e.bufs.keys().next().value);
  }
  function G(t) {
    try {
      const r = /^(.*_)(\d+)$/.exec(t || "");
      if (!r || !e.man) return;
      const n = d(),
        i = +r[2],
        s = [];
      if (!n) return;
      for (let a = 1; a <= T; a++) {
        const u = g(r[1] + (i + a), null);
        if (!u) break;
        s.push(u);
      }
      for (const a of Array.from(e.ahead.keys())) s.some((u) => u.f === a) || e.ahead.delete(a);
      for (const a of s)
        e.ahead.has(a.f) ||
          e.bufs.has(a.f) ||
          (e.pf = e.pf
            .then(() =>
              e.ahead.has(a.f) || e.bufs.has(a.f) || d() !== n
                ? null
                : w(a)
                    .then((u) => (u ? M(n, u) : null))
                    .then((u) => {
                      if (u) for (e.abs.delete(a.f), e.ahead.set(a.f, u); e.ahead.size > T;) e.ahead.delete(e.ahead.keys().next().value);
                    }),
            )
            .catch(() => {}));
    } catch {}
  }
  function z() {
    try {
      const t = window.speechSynthesis;
      return t ? ((!e.ssVoices || !e.ssVoices.length) && (e.ssVoices = t.getVoices() || []), e.ssVoices) : [];
    } catch {
      return [];
    }
  }
  try {
    window.speechSynthesis &&
      window.speechSynthesis.addEventListener &&
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        e.ssVoices = null;
      });
  } catch {}
  function q(t) {
    const r = l.Story && l.Story.cast && l.Story.cast[t],
      n = (r && r.tts) || { names: ["Daniel", "Samantha"], lang: "en-GB", pitch: 1, rate: 1 },
      i = z().filter((u) => /^en/i.test(u.lang || ""));
    let s = null,
      a = -1;
    for (const u of i) {
      let o = 0;
      const c = u.name || "",
        f = n.names.findIndex((v) => c.toLowerCase().indexOf(v.toLowerCase()) >= 0);
      (f >= 0 && (o += 100 - f * 10),
        /enhanced|premium|neural|natural/i.test(c) && (o += 15),
        n.lang && (u.lang || "").toLowerCase().replace("_", "-") === n.lang.toLowerCase() && (o += 8),
        /novelty|whisper|bells|bad news|boing|bubbles|cellos|jester|organ|trinoids|zarvox|wobble|superstar|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley/i.test(
          c,
        ) && (o -= 200),
        u.localService && (o += 2),
        o > a && ((a = o), (s = u)));
    }
    return { voice: s, pitch: n.pitch || 1, rate: n.rate || 1 };
  }
  function h(t) {
    if (!e.cur || e.cur.token !== t) return;
    ((e.cur = null),
      (e.src = null),
      (e.utter = null),
      e.safety && (clearTimeout(e.safety), (e.safety = 0)),
      e.speakT && (clearTimeout(e.speakT), (e.speakT = 0)));
    const r = e.queue.shift();
    r ? E(r) : p(!1);
  }
  function F() {
    try {
      e.src && ((e.src.onended = null), e.src.stop());
    } catch {}
    try {
      e.utter && window.speechSynthesis && ((e.utter.onend = e.utter.onerror = null), window.speechSynthesis.cancel());
    } catch {}
    (e.safety && (clearTimeout(e.safety), (e.safety = 0)),
      e.speakT && (clearTimeout(e.speakT), (e.speakT = 0)),
      (e.src = null),
      (e.utter = null),
      (e.cur = null));
  }
  function B(t) {
    try {
      const r = window.speechSynthesis,
        n = window.SpeechSynthesisUtterance;
      if (!r || !n) {
        ((t.mode = "none"), setTimeout(() => h(t.token), 50));
        return;
      }
      const i = q(t.who),
        s = new n(t.text);
      (i.voice && (s.voice = i.voice),
        (s.lang = (i.voice && i.voice.lang) || "en-GB"),
        (s.pitch = Math.max(0, Math.min(2, i.pitch))),
        (s.rate = Math.max(0.5, Math.min(2, i.rate))),
        (s.volume = m()),
        (s.onend = s.onerror = () => h(t.token)),
        (e.utter = s),
        (t.mode = "tts"),
        e.ttsPlays++,
        p(!0),
        r.cancel(),
        (e.speakT = setTimeout(() => {
          if (((e.speakT = 0), !e.cur || e.cur.token !== t.token || e.utter !== s)) return;
          try {
            r.speak(s);
          } catch {
            h(t.token);
            return;
          }
          const a = 1.5 + (String(t.text).split(/\s+/).length * 0.42) / s.rate;
          e.safety = setTimeout(() => h(t.token), a * 1e3);
        }, 60)));
    } catch {
      h(t.token);
    }
  }
  function U(t, r) {
    const n = d(),
      i = L();
    if (!n || !i || !r) return !1;
    try {
      if (n.state !== "running")
        try {
          n.resume();
        } catch {}
      try {
        i.gain.setTargetAtTime(m(), n.currentTime, 0.02);
      } catch {}
      const s = n.createBufferSource();
      s.buffer = r;
      const a = n.currentTime + 0.02,
        u = t.kind === "radio";
      return (
        u && P(n, i, a, !0),
        s.connect(i),
        (s.onended = () => h(t.token)),
        s.start(u ? a + 0.06 : a),
        u && P(n, i, a + 0.06 + r.duration, !1),
        (e.src = s),
        (t.mode = "file"),
        (t.dur = r.duration),
        e.plays++,
        p(!0),
        !0
      );
    } catch (s) {
      return ((e.lastError = String(s)), !1);
    }
  }
  function E(t) {
    ((e.cur = t), (t.t0 = Date.now()));
    const r = () => {
      if (!e.cur || e.cur.token !== t.token) return;
      const n = t.id ? g(t.id, t.text) : null;
      if (!n || !d()) {
        B(t);
        return;
      }
      _(n, t.kind === "scene").then((i) => {
        !e.cur || e.cur.token !== t.token || (U(t, i) ? t.id && G(t.id) : B(t));
      });
    };
    t.id && !e.man && !e.manFailed ? y().then(r) : r();
  }
  const R = {
    get base() {
      return e.base;
    },
    set base(t) {
      ((e.base = String(t || "")),
        e.base && !/\/$/.test(e.base) && (e.base += "/"),
        (e.man = null),
        (e.manFailed = !1),
        (e.manP = null),
        e.abs.clear(),
        e.bufs.clear(),
        e.ahead.clear(),
        (e.noise = null));
    },
    get enabled() {
      return A();
    },
    setEnabled(t) {
      (b("voice.on", !!t), t || R.stop());
    },
    get volume() {
      return m();
    },
    setVolume(t) {
      b("voice.vol", Math.max(0, Math.min(1, +t || 0)));
      const r = d();
      try {
        e.bus && r && e.bus.gain.setTargetAtTime(m(), r.currentTime, 0.03);
      } catch {}
    },
    get speaking() {
      return !!e.cur;
    },
    get duckTarget() {
      return e.ducked ? S : 1;
    },
    get current() {
      return e.cur ? { id: e.cur.id, who: e.cur.who, text: e.cur.text, mode: e.cur.mode || "loading", prio: e.cur.prio } : null;
    },
    get ready() {
      return !!e.man;
    },
    get mode() {
      return e.man ? "files" : e.manFailed ? "tts" : "pending";
    },
    say(t, r, n) {
      try {
        if (!A() || t == null) return null;
        n = n || {};
        const i = l.Story,
          s = i && i.line ? i.line(String(t)) : null,
          a = {
            id: s ? s.id : null,
            text: s ? s.text : String(t),
            who: (s && s.who) || r || "gus",
            kind: n.kind || (s && s.kind) || "radio",
            prio: n.priority == null ? 1 : +n.priority,
            token: ++e.seq,
          };
        if (e.cur)
          if (n.interrupt || a.prio > e.cur.prio) F();
          else return n.queue ? (e.queue.length < 6 && e.queue.push(a), a) : null;
        return (E(a), a);
      } catch {
        return null;
      }
    },
    stop() {
      ((e.queue.length = 0), F(), p(!1));
    },
    duration(t) {
      const r = l.Story,
        n = r && r.line ? r.line(t) : null,
        i = g(t, n ? n.text : null);
      return i ? i.d + 0.08 : null;
    },
    has(t) {
      const r = l.Story,
        n = r && r.line ? r.line(t) : null;
      return !!g(t, n ? n.text : null);
    },
    load() {
      return y();
    },
    preload(t) {
      return y()
        .then((r) => {
          if (!r || !t || !t.length) return 0;
          const n = t.map((u) => g(u, null)).filter(Boolean);
          let i = 0,
            s = 0;
          const a = () => (i < n.length ? w(n[i++]).then((u) => (u && s++, a())) : Promise.resolve());
          return Promise.all([a(), a(), a(), a()]).then(() => s);
        })
        .catch(() => 0);
    },
    pickTTS: q,
    _state: e,
  };
  l.Voice = R;
})();
