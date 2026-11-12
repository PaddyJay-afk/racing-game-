/* main.js */
(function () {
  "use strict";
  const n = (window.FZ = window.FZ || {}),
    m = 1 / 120,
    ce = 0.1,
    j = { steer: 0, lean: 0, accel: !1, brake: !1, boost: !1, pause: !1 },
    E = { steer: 0, lean: 0, accel: !1, brake: !1, boost: !1, pause: !1 },
    B = { on: !0, speed01: 0, boost: !1, z: 0 },
    ke = { on: !1, speed01: 0 },
    A = { track: null, camera: null, ships: null, time: 0 };
  let J = !0;
  const ge = 1600,
    we = 22500,
    a = {
      world: null,
      n: 0,
      cap: 0,
      x: null,
      y: null,
      a: null,
      b: null,
      z: null,
      cx: 0,
      cy: 0,
      ca: 0,
      cfov: 0,
      cshake: 0,
      cheight: 0,
      chor: 0,
      vs: [],
      src: [],
      cam: { x: 0, y: 0, angle: 0, height: 26, horizon: 0.36, fov: 1.64, shake: 0 },
    };
  function me(e) {
    a.cap >= e ||
      ((a.cap = e),
      (a.x = new Float64Array(e)),
      (a.y = new Float64Array(e)),
      (a.a = new Float64Array(e)),
      (a.b = new Float64Array(e)),
      (a.z = new Float64Array(e)));
  }
  function le(e) {
    for (; e > Math.PI;) e -= 2 * Math.PI;
    for (; e < -Math.PI;) e += 2 * Math.PI;
    return e;
  }
  function Q(e) {
    const t = e.ships,
      s = t.length;
    me(s);
    for (let u = 0; u < s; u++) {
      const p = t[u];
      ((a.x[u] = p.x), (a.y[u] = p.y), (a.a[u] = p.angle), (a.b[u] = p.bank), (a.z[u] = p.z));
    }
    const r = e.camera();
    ((a.cx = r.x),
      (a.cy = r.y),
      (a.ca = r.angle),
      (a.cfov = r.fov),
      (a.cshake = r.shake),
      (a.cheight = r.height),
      (a.chor = r.horizon),
      (a.world = e),
      (a.n = s));
  }
  function be(e, t) {
    const s = e.ships,
      r = s.length;
    (a.world !== e || a.n !== r) && Q(e);
    const u = a.vs,
      p = a.src;
    for (let l = 0; l < r; l++) {
      const h = s[l];
      let k = u[l];
      (!k || p[l] !== h) && ((k = u[l] = Object.create(h)), (p[l] = h));
      const _ = h.x - a.x[l],
        b = h.y - a.y[l];
      if (_ * _ + b * b > ge) {
        ((k.x = h.x), (k.y = h.y), (k.angle = h.angle), (k.bank = h.bank), (k.z = h.z));
        continue;
      }
      ((k.x = a.x[l] + _ * t),
        (k.y = a.y[l] + b * t),
        (k.angle = a.a[l] + le(h.angle - a.a[l]) * t),
        (k.bank = a.b[l] + (h.bank - a.b[l]) * t),
        (k.z = a.z[l] + (h.z - a.z[l]) * t));
    }
    ((u.length = r), (p.length = r));
    const i = e.camera(),
      d = a.cam,
      x = i.x - a.cx,
      I = i.y - a.cy;
    return (
      x * x + I * I > we
        ? ((d.x = i.x), (d.y = i.y), (d.angle = i.angle), (d.fov = i.fov), (d.shake = i.shake))
        : ((d.x = a.cx + x * t),
          (d.y = a.cy + I * t),
          (d.angle = a.ca + le(i.angle - a.ca) * t),
          (d.fov = a.cfov + (i.fov - a.cfov) * t),
          (d.shake = a.cshake + (i.shake - a.cshake) * t)),
      (d.height = i.height),
      (d.horizon = i.horizon),
      u
    );
  }
  let fe,
    R,
    f = null,
    S = null,
    g = 0,
    $ = 0,
    Z = 0,
    T = null,
    P = -1,
    K = 0,
    ue = !1;
  const ee = {};
  let V = 0;
  const w = "neon_harbor",
    Se = { neon_harbor: "race1", lunar_dome: "race3" },
    ve = { title: 1, story: 1, options: 1, soundtest: 1, mymusic: 1, shipselect: 1, trackselect: 1, briefing: 1, pilots: 1 },
    N = {};
  let te = null,
    C = w,
    D = "free",
    W = -1;
  function M(e) {
    const t = n.Track && n.Track.list;
    if (!e || !t) return w;
    for (let s = 0; s < t.length; s++) if (t[s].id === e) return e;
    return w;
  }
  const v = {};
  function pe(e) {
    return N[M(e)] || null;
  }
  function H(e) {
    e = M(e);
    let t = N[e];
    if (!t) {
      const s = v[e];
      (s ? ((t = s.finishNow()), delete v[e]) : (t = n.Track.build(e)), (N[e] = t));
    }
    return t;
  }
  function G(e) {
    if (((e = M(e)), N[e])) return null;
    if (v[e]) return v[e];
    if (!n.Track || typeof n.Track.buildAsync != "function") return null;
    const t = n.Track.buildAsync(e, null, { budgetMs: 5 });
    return (
      (v[e] = t),
      t.then(
        (s) => {
          v[e] === t && (delete v[e], (N[e] = s), c(n.Render, "prepare", s));
        },
        (s) => {
          (v[e] === t && delete v[e], console.warn("[main] track prefetch", e, s));
        },
      ),
      t
    );
  }
  function xe() {
    const e = n.Track && n.Track.list;
    if (e) for (let t = 0; t < e.length; t++) G(e[t].id);
  }
  let q = null;
  function Ie(e) {
    if (((e = M(e || w)), N[e] || !G(e))) {
      ((q = null), L(e));
      return;
    }
    ((q = e),
      v[e].then(() => {
        q === e && ((q = null), L(e));
      }));
  }
  function de(e) {
    let t = Se[e] || "race1";
    try {
      const s = n.Audio && n.Audio.songs;
      s && s.length && !s.some((r) => (r.id || r) === t) && (t = "race1");
    } catch {
      t = "race1";
    }
    return t;
  }
  function c(e, t, s, r, u, p, i) {
    try {
      if (e && typeof e[t] == "function") return e[t](s, r, u, p, i);
    } catch (d) {
      c.warned || ((c.warned = 1), console.warn("[main]", t, d));
    }
  }
  function o(e, t, s, r) {
    return c(n.Audio, e, t, s, r);
  }
  function U(e, t) {
    ((t = !!t), ee[e] !== t && ((ee[e] = t), o("loop", e, t)));
  }
  function ne() {
    V && (clearTimeout(V), (V = 0));
  }
  function se(e) {
    const t = n.Story,
      s = n.Voice;
    if (!(t && t.active)) {
      try {
        if (s && s.speaking) return;
      } catch {}
      o("announce", e);
    }
  }
  function z() {
    for (const e in ee) U(e, !1);
    o("engine", { on: !1, speed01: 0 });
  }
  function X() {
    const e = window.visualViewport,
      t = Math.round(e ? e.width : window.innerWidth),
      s = Math.round(e ? e.height : window.innerHeight);
    c(n.Render, "resize", t, s);
  }
  function L(e) {
    ((C = M(e || w)), (te = H(C)), (S = n.Game.create(te, { laps: 99, rivals: 5, playerIdx: 0, demo: !0 })), (S.countdown = 0), (K = 0));
  }
  let F = 0,
    y = { difficulty: "normal", assist: 0.6, track: w };
  function he(e, t) {
    (ne(),
      z(),
      c(n.Render, "setShowcase", null),
      (R = H(t)),
      (f = n.Game.create(R, e)),
      (P = -1),
      (g = 0),
      n.UI.setScreen("race"),
      c(n.Input, "setMode", "race"),
      o("setTempoScale", 1),
      o("prepare", de(R.id || t)),
      o("playMusic", de(R.id || t), { fadeIn: 0.5 }),
      (T = "race"));
    c(n.Pilots, "raceStart", f, { mode: D, chapter: W });
    c(n.Sfx2, "raceStart", f);
    c(n.Cine, "raceStart", f, R, { mode: D, chapter: W });
  }
  function re() {
    ((D = "free"), (W = -1), c(n.Story, "stop"));
  }
  function Y(e, t) {
    (re(),
      typeof e == "number" && e >= 0 && (F = e),
      t && typeof t == "object"
        ? (y = { difficulty: t.difficulty || y.difficulty, assist: t.assist != null ? t.assist : y.assist, track: M(t.track || y.track) })
        : n.UI &&
          (y = {
            difficulty: n.UI.selectedDifficulty || y.difficulty,
            assist: n.UI.assist != null ? n.UI.assist : y.assist,
            track: M(n.Settings.get("track", y.track)),
          }),
      he({ laps: 5, rivals: 5, playerIdx: 3, playerShip: F, difficulty: y.difficulty, assist: y.assist }, y.track),
      F === 0 && c(n.Story, "startFree"));
  }
  function ae(e) {
    e = e | 0;
    const t = c(n.Story, "raceOptions", e);
    if (!t) return Y(F);
    (re(), (D = "story"), (W = e));
    const s = n.UI && n.UI.assist != null ? n.UI.assist : y.assist;
    (he({ laps: t.laps, rivals: t.rivals, playerIdx: t.playerIdx, playerShip: t.playerShip, difficulty: t.difficulty, assist: s }, t.track),
      c(n.Story, "start", e));
  }
  function _e() {
    D === "story" && W >= 0 ? ae(W) : Y(F, y);
  }
  function Te() {
    (n.UI.setScreen("race"), c(n.Input, "setMode", "race"), (T = "race"), o("resumeMusic"));
    const e = f,
      t = e && e.player;
    e && t && !t.finished && !t.exploded && (t.energyLow && U("lowEnergy", !0), t.inPit && U("pit", !0), e._scrapeOn && U("scrape", !0));
  }
  function ie() {
    f && (z(), c(n.Voice, "stop"), n.UI.setScreen("pause"), c(n.Input, "setMode", "menu"), o("sfx", "pause"), (T = "pause"));
  }
  function ye() {
    (c(n.Cine, "stop"), c(n.Sfx2, "stop"), ne(), z(), re(), (f = null), n.UI.setScreen("title"), c(n.Input, "setMode", "menu"));
  }
  function Me(e, t) {
    if (
      ((e === "title" || e === "story" || e === "briefing") && !ve[t] && (o("setTempoScale", 1), o("playMusic", "title", { fadeIn: 1 })),
      e === "title" && (!S || K > 300 || C !== w) && L(w),
      e !== "briefing" && (q = null),
      e === "shipselect" && G(y.track),
      e === "trackselect" && xe(),
      e === "story")
    ) {
      const s = n.Story && n.Story.chapters;
      if (s) for (let r = 0; r < s.length; r++) s[r] && s[r].track && G(s[r].track);
    }
    if (e === "briefing") {
      const s = n.Story && n.Story.chapters && n.Story.chapters[n.UI.briefingChapter | 0];
      ((f = null), z(), Ie(s && s.track));
    }
    ((e === "story" || e === "trackselect" || e === "shipselect") && C !== w && L(w),
      (e === "title" || e === "boot" || e === "story" || e === "briefing") && c(n.Input, "setMode", "menu"));
  }
  function Ee(e) {
    const t = e.events;
    if (!t || !t.length) return;
    const s = e.player,
      r = n.Story,
      u = !!(r && r.active && r.onEvent);
    for (let p = 0; p < t.length; p++) {
      const i = t[p];
      switch ((u && r.onEvent(i, e), c(n.Cine, "onEvent", i, e), c(n.Sfx2, "onEvent", i, e), c(n.Pilots, "onEvent", i, e), i.type)) {
        case "countdown":
          o("sfx", "countdown");
          break;
        case "go":
          (o("sfx", "go"), se("GO!"));
          break;
        case "wallHit":
          (o("sfx", "wallHit", { intensity: i.intensity == null ? 0.5 : i.intensity }),
            s && (i.intensity || 0) > 0.3 && c(n.Render, "burst", s.x, s.y, "sparks"));
          break;
        case "scrape":
          U("scrape", i.on);
          break;
        case "shipHit":
          o("sfx", "shipHit", { intensity: i.intensity });
          break;
        case "boost":
          o("sfx", "boost");
          break;
        case "dash":
          (o("sfx", "dash"), s && c(n.Render, "burst", s.x, s.y, "dash"));
          break;
        case "boostReady":
          o("sfx", "boostReady");
          break;
        case "lap":
          o("sfx", "lap");
          break;
        case "finalLap":
          (o("sfx", "finalLap"), o("setTempoScale", 1.12), se("Final lap"));
          break;
        case "pit":
          U("pit", i.on);
          break;
        case "lowEnergy":
          U("lowEnergy", i.on);
          break;
        case "overtake":
          i.gained && o("sfx", "overtake");
          break;
        case "explode": {
          const d = i.x != null ? i.x : s ? s.x : 0,
            x = i.y != null ? i.y : s ? s.y : 0;
          if ((c(n.Render, "burst", d, x, "explode"), s)) {
            const I = Math.hypot(d - s.x, x - s.y);
            I < 400 && o("sfx", "explode", { intensity: Math.max(0.2, 1 - I / 400) });
          }
          break;
        }
        case "finish":
          (z(), o("sfx", "finish"), se(i.place === 1 ? "Winner!" : "Finish"), (P = n.Cine && n.Cine.mode === "finish" ? n.Cine.finishHold : 3.5));
          break;
        case "retired":
          (z(),
            o("stopMusic", 0.5),
            ne(),
            (V = setTimeout(() => {
              ((V = 0), o("playMusic", "gameover"));
            }, 600)),
            (P = n.Cine && n.Cine.mode === "wreck" ? n.Cine.wreckHold : 3));
          break;
      }
    }
    t.length = 0;
  }
  function Ae(e, t) {
    if (e) {
      if (((A.track = e.track || (e === S ? te : R)), (A.time = Z), t && J)) {
        const s = g >= m ? 1 : g <= 0 ? 0 : g / m;
        ((A.ships = be(e, s)), (A.camera = a.cam));
      } else ((A.camera = e.camera()), (A.ships = e.ships));
      n.Render.drawFrame(A);
    }
  }
  function O(e) {
    requestAnimationFrame(O);
    let t = $ ? (e - $) / 1e3 : 0;
    (($ = e), t > ce && (t = ce), t < 0 && (t = 0), (Z += t));
    try {
      const s = n.UI,
        r = s.screen;
      if (r !== T) {
        const l = T;
        ((T = r), Me(r, l));
      }
      const u = c(n.Input, "poll") || j;
      let p = S,
        i = !0;
      if (f && (r === "race" || r === "results" || r === "epilogue"))
        if (((p = f), r === "race" && u.pause)) ie();
        else {
          const l = r === "race" ? u : j,
            h = window.__r3d;
          const cn = n.Cine;
          h && h.mode === "loading" ? ((g = 0), cn && cn.mode === "intro" && (cn.state.t = 0)) : cn && cn.hold ? (g = 0) : (g += t * (cn ? cn.timeScale : 1));
          let k = !0;
          for (; g >= m;) {
            let b = l;
            (k ||
              ((b = E),
              (E.steer = l.steer),
              (E.lean = l.lean),
              (E.accel = l.accel),
              (E.brake = l.brake),
              (E.pause = l.pause),
              (E.boost = !1)),
              g - m < m && Q(f),
              f.update(m, b),
              (k = !1),
              (g -= m));
          }
          (Ee(f),
            r === "race" && n.Story && n.Story.active && n.Story.update(t, f),
            h && h.mode === "loading" ? 0 : c(n.Cine, "update", t, f, r),
            c(n.Sfx2, "update", t, f, r),
            c(n.Pilots, "update", t, f, r));
          const _ = f.player;
          if (
            (r === "race" && f.phase === "racing" && _ && !_.exploded
              ? ((B.speed01 = Math.min(1.3, _.speed / 300)), (B.boost = !!_.boosting), (B.z = _.z || 0), o("engine", B))
              : o("engine", ke),
            P > 0 && ((P -= t), P <= 0 && r === "race"))
          ) {
            z();
            let b = null;
            (D === "story" && (b = c(n.Story, "result", f)),
              b && b.chapter != null
                ? (c(n.Story, "hush"), s.setScreen("epilogue", { result: b, game: f }), (T = "epilogue"))
                : (c(n.Story, "hush"), s.setScreen("results", f), (T = "results")),
              c(n.Cine, "results"),
              c(n.Pilots, "raceEnd", f, { mode: D, chapter: W, result: b }),
              c(n.Input, "setMode", "menu"),
              f.phase === "finished" && o("playMusic", "results", { fadeIn: 0.3 }));
          }
        }
      else if (f && r === "pause") ((p = f), (i = !1), (g = 0));
      else if (S) {
        c(n.Cine, "update", t, null, r);
        c(n.Sfx2, "update", t, null, r);
        for (g += t; g >= m;) (g - m < m && Q(S), S.update(m, j), (g -= m));
        ((S.events.length = 0), (K += t), K > 240 && L(C));
      }
      (r === "shipselect"
        ? c(n.Render, "setShowcase", n.UI.selectedShip == null ? F : n.UI.selectedShip)
        : ue && c(n.Render, "setShowcase", null),
        (ue = r === "shipselect"),
        Ae(p, i));
      const d = n.Render.ctx,
        x = n.Render.W,
        I = n.Render.H;
      const hh = n.Cine && n.Cine.hideHud && r === "race";
      if (
        (f && (r === "race" || r === "pause") && !hh && c(n.HUD, "draw", d, x, I, f, Z),
        f && r === "race" && c(n.Cine, "draw", d, x, I, Z),
        s.draw(d, x, I, Z, p),
        !O.splashed)
      ) {
        O.splashed = 1;
        try {
          window.__splashDone && window.__splashDone();
        } catch {}
      }
    } catch (s) {
      O.err || ((O.err = 1), console.error("[main] frame error", s));
    }
  }
  function oe() {
    fe = document.getElementById("game");
    try {
      window.__splash && window.__splash(15, "Starting");
    } catch {}
    n.Render.init(fe);
    c(n.Device, "apply");
    try {
      window.__splash && window.__splash(60, "Building world");
    } catch {}
    (X(),
      window.addEventListener("resize", X),
      window.addEventListener("orientationchange", () => setTimeout(X, 200)),
      window.visualViewport && window.visualViewport.addEventListener("resize", X),
      (R = H(w)),
      n.Input.init(document.getElementById("root")),
      n.Input.setMode("menu"),
      o("warm"),
      n.UI.init({
        startRace: Y,
        startStory: ae,
        resume: Te,
        restart: _e,
        quit: ye,
        getTrack: (e) => {
          try {
            return pe(e) || (n.Track.outline ? n.Track.outline(e) : H(e));
          } catch {
            return null;
          }
        },
        calibrate: () => c(n.Input, "calibrate"),
      }),
      o("setMusicVolume", n.Settings.get("musicVol", 0.7)),
      o("setSfxVolume", n.Settings.get("sfxVol", 0.9)),
      (F = +n.Settings.get("ship", 0) || 0),
      (y.track = M(n.Settings.get("track", w))),
      L(w),
      n.UI.setScreen("boot"),
      document.addEventListener("visibilitychange", () => {
        document.hidden && n.UI.screen === "race" && f && f.phase !== "finished" && ie();
      }),
      document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: !1 }),
      document.addEventListener("gesturestart", (e) => e.preventDefault()),
      "serviceWorker" in navigator &&
        location.protocol === "https:" &&
        window.top === window &&
        window.__PGP_SW &&
        navigator.serviceWorker.register("sw.js").catch(() => {}),
      requestAnimationFrame(O),
      (window.__pgp = {
        get interp() {
          return J;
        },
        set interp(e) {
          J = !!e;
        },
        get game() {
          return f;
        },
        get demo() {
          return S;
        },
        get track() {
          return R;
        },
        get mode() {
          return D;
        },
        get storyChapter() {
          return W;
        },
        getTrack: H,
        peekTrack: pe,
        prefetchTrack: G,
        startRace: Y,
        startStory: ae,
        pause: ie,
        quit: ye,
      }));
  }
  ((n.Main = { boot: oe }), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", oe) : oe());
})();
