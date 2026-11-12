/* cine.js — cinematic director.
 *
 * Owns everything "film": the pre-race flyover, the photo-finish slow-motion, the wreck cam,
 * the results orbit, and the lens FX that react to play (chromatic aberration on boost,
 * shock rings, anamorphic flares, film grain, letterbox).
 *
 * It drives three small hooks in render3d.js:
 *   FZ.Render.cine  — free camera override { on, px, py, pz, tx, ty, tz, fov, roll }
 *   FZ.Render.fx    — post-processing parameters, written every frame
 *   FZ.Render.burst — particle bursts ("firework", "confetti", "ring", ...)
 * and three flags main.js reads: Cine.hold (freeze the sim), Cine.timeScale (slow motion),
 * Cine.hideHud (hide the race HUD while a cutscene owns the frame).
 */
(function () {
  "use strict";
  const FZ = (window.FZ = window.FZ || {});
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => ((t = clamp(t, 0, 1)), t * t * (3 - 2 * t));
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeInOut = (t) => ((t = clamp(t, 0, 1)), t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const wrapPi = (a) => {
    while (a > Math.PI) a -= TAU;
    while (a < -Math.PI) a += TAU;
    return a;
  };

  const R = () => FZ.Render;
  const elev = (x, y) => {
    try {
      return (R() && R().elevAt(x, y)) || 0;
    } catch {
      return 0;
    }
  };
  const sfx = (name, o) => {
    try {
      FZ.Sfx2 && FZ.Sfx2.play(name, o);
    } catch {}
  };
  const setting = (k, d) => {
    try {
      return FZ.Settings ? FZ.Settings.get(k, d) : d;
    } catch {
      return d;
    }
  };

  /* ---------------------------------------------------------------- state */
  const cam = { on: false, px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0, fov: 40, roll: 0 };
  const S = {
    mode: null, // null | "intro" | "finish" | "wreck" | "orbit"
    t: 0, // seconds inside the current mode (real time)
    game: null,
    track: null,
    info: null,
    frame: null, // grid frame for the intro
    cards: [], // lower-third pilot cards scheduled for the intro
    title: null,
    skipT: -1,
    place: 0,
    orbitA: 0,
    fwT: 0,
    // decaying lens pulses
    ca: 0,
    anam: 0,
    bloom: 0,
    shock: 0, // 0..1 progress of the current ring, <0 = none
    shockAt: [0, 0, 0], // game x, y, height
    shockK: 0,
    bars: 0, // current letterbox amount (eased)
    grade: 0,
    desat: 0,
    fade: 0,
    roll: 0,
    boostSm: 0,
    speedSm: 0,
    close: 0,
    lastStage: "",
  };

  const Cine = {
    hold: false,
    timeScale: 1,
    hideHud: false,
    get active() {
      return S.mode === "intro" || S.mode === "finish" || S.mode === "wreck";
    },
    get mode() {
      return S.mode;
    },
    get state() {
      return S;
    },
    finishHold: 6.6,
    wreckHold: 4.4,
    raceStart,
    update,
    draw,
    onEvent,
    stop,
    skip,
    results,
    pulse,
    shockAt,
  };

  /* ---------------------------------------------------------------- helpers */
  function gridFrame(game) {
    const ships = game.ships || [];
    const pl = game.player || ships[0];
    const a = pl.angle || 0;
    const fx = Math.cos(a),
      fy = Math.sin(a),
      rx = -fy,
      ry = fx;
    let gx = 0,
      gy = 0,
      back = 0;
    for (let i = 0; i < ships.length; i++) {
      gx += ships[i].x;
      gy += ships[i].y;
    }
    gx /= Math.max(1, ships.length);
    gy /= Math.max(1, ships.length);
    // furthest-back ship distance (for the dolly range)
    for (let i = 0; i < ships.length; i++) {
      const d = -((ships[i].x - gx) * fx + (ships[i].y - gy) * fy);
      if (d > back) back = d;
    }
    // pole position (furthest forward)
    let front = 0;
    for (let i = 0; i < ships.length; i++) {
      const d = (ships[i].x - gx) * fx + (ships[i].y - gy) * fy;
      if (d > front) front = d;
    }
    // which side of the grid the player sits on, so the dolly runs on the far side and sees them last
    const plLat = (pl.x - gx) * rx + (pl.y - gy) * ry;
    return { gx, gy, fx, fy, rx, ry, a, back, front, side: plLat >= 0 ? -1 : 1 };
  }
  /* point in the grid frame -> world [x, y(up), z] */
  function gp(f, along, lat, h) {
    const x = f.gx + f.fx * along + f.rx * lat,
      y = f.gy + f.fy * along + f.ry * lat;
    return [x, elev(x, y) + h, y];
  }
  function setCam(p, t, fov, roll) {
    cam.on = true;
    cam.px = p[0];
    cam.py = p[1];
    cam.pz = p[2];
    cam.tx = t[0];
    cam.ty = t[1];
    cam.tz = t[2];
    cam.fov = fov;
    cam.roll = roll || 0;
  }
  const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  /* the gameplay chase camera, reconstructed in world space (matches render3d's own maths closely) */
  function chaseCam(game) {
    const c = game.camera();
    const ang = c.angle || 0,
      fx = Math.cos(ang),
      fy = Math.sin(ang);
    const p = [c.x, elev(c.x, c.y) + (c.height || 26) * 0.62, c.y];
    const tx = c.x + fx * 120,
      ty = c.y + fy * 120;
    const t = [tx, elev(tx, ty) + 3, ty];
    const st = R();
    const aspect = st && st.W ? st.W / st.H : 2.17;
    const fov = (2 * Math.atan(Math.tan(clamp(c.fov || 1.64, 0.5, 2.6) / 2) / aspect) * 180) / Math.PI;
    return { p, t, fov };
  }
  function pilotOfShip(ship) {
    const id = ship.shipId != null ? ship.shipId : ship.colorIdx;
    const who = FZ.Story && FZ.Story.pilotOf ? FZ.Story.pilotOf(id) : null;
    const ch = who && FZ.Story.character ? FZ.Story.character(who) : null;
    const sh = (FZ.SHIPS && FZ.SHIPS[id]) || null;
    return { id, who, ch, ship: sh };
  }

  /* ---------------------------------------------------------------- lifecycle */
  function raceStart(game, track, info) {
    stop();
    if (!game || !game.ships || !game.ships.length) return;
    S.game = game;
    S.track = track;
    S.info = info || {};
    if (setting("cine.intro", true) === false) return; // options can turn the flyover off
    S.frame = gridFrame(game);
    S.mode = "intro";
    S.t = 0;
    S.skipT = -1;
    Cine.hold = true;
    Cine.hideHud = true;
    Cine.timeScale = 1;
    S.fade = 1;
    buildIntroCards(game);
    try {
      FZ.Input && FZ.Input.setMode("menu");
    } catch {}
    sfx("cineIntro");
  }

  function buildIntroCards(game) {
    const ships = game.ships.slice();
    const f = S.frame;
    // order rivals back-to-front so cards appear as the dolly passes them
    const rows = ships
      .filter((s) => !s.isPlayer)
      .map((s) => ({ s, along: (s.x - f.gx) * f.fx + (s.y - f.gy) * f.fy }))
      .sort((a, b) => a.along - b.along);
    // show at most three rivals: the story rival first if present, then the front of the grid
    const rivalWho = FZ.Story && FZ.Story.rival;
    let pick = rows.slice(-3);
    if (rivalWho) {
      const rr = rows.find((r) => pilotOfShip(r.s).who === rivalWho);
      if (rr && pick.indexOf(rr) < 0) pick = [rr].concat(rows.slice(-2));
    }
    pick.sort((a, b) => a.along - b.along);
    S.cards = pick.map((r, i) => {
      const p = pilotOfShip(r.s);
      const bond = FZ.Pilots && p.who ? FZ.Pilots.stageOf(p.who) : null;
      return {
        t0: T_GRID + 0.25 + i * ((D_GRID - 0.5) / pick.length),
        dur: (D_GRID - 0.5) / pick.length - 0.08,
        who: p.who,
        name: p.ch ? p.ch.name : (p.ship && p.ship.pilot) || "PILOT",
        shipName: p.ship ? p.ship.name : "",
        color: p.ch ? p.ch.color : "#5ef0ff",
        tag: bond ? bond.label : p.ch && p.ch.kind === "ai" ? "LUCENT" : "HUMAN",
        mood: p.ch && p.ch.align === "villain" ? "smug" : "neutral",
        gridPos: (r.s.place | 0) || 0,
      };
    });
    const pl = game.player;
    const pp = pl ? pilotOfShip(pl) : null;
    S.heroCard = pp
      ? {
          who: pp.who,
          name: pp.ch ? pp.ch.name : (pp.ship && pp.ship.pilot ? String(pp.ship.pilot).toUpperCase() : "YOU"),
          shipName: pp.ship ? pp.ship.name : "",
          color: pp.ch ? pp.ch.color : "#5ef0ff",
          tag: FZ.Pilots ? FZ.Pilots.rank().title : "PILOT",
        }
      : null;
    const tr = S.track || {};
    const st = FZ.Story;
    const chap = S.info && S.info.mode === "story" && st && st.chapters ? st.chapters[S.info.chapter | 0] : null;
    S.title = {
      big: String(tr.name || "GRAND PRIX").toUpperCase(),
      over: chap ? "CHAPTER " + chap.num + "  ·  " + chap.title : "PLASMA GRAND PRIX",
      under: chap ? chap.subtitle : (game.laps || 5) + " LAPS  ·  " + String(game.difficulty || "normal").toUpperCase() + "  ·  " + game.ships.length + " MACHINES",
    };
  }

  function endIntro() {
    S.mode = null;
    Cine.hold = false;
    Cine.hideHud = false;
    cam.on = false;
    S.fade = 0;
    try {
      FZ.Input && FZ.Input.setMode("race");
    } catch {}
  }

  function skip() {
    if (S.mode === "intro" && S.t > 0.5 && S.skipT < 0) {
      S.skipT = S.t;
      sfx("cineWhoosh");
      return true;
    }
    return false;
  }

  function stop() {
    S.mode = null;
    S.game = null;
    S.cards = [];
    S.title = null;
    S.heroCard = null;
    Cine.hold = false;
    Cine.hideHud = false;
    Cine.timeScale = 1;
    cam.on = false;
    S.ca = S.anam = S.bloom = 0;
    S.close = 0;
    S.shock = -1;
    S.fade = 0;
    S.desat = 0;
    S.bars = 0;
    S.grade = 0;
  }

  /* results screen: keep a slow hero orbit running behind the UI */
  function results() {
    if (S.mode === "finish" || S.mode === "wreck" || S.mode === "orbit") {
      S.mode = "orbit";
      Cine.hideHud = false;
      Cine.timeScale = 1;
    }
  }

  function pulse(kind, k) {
    k = k == null ? 1 : k;
    if (kind === "ca") S.ca = Math.max(S.ca, k);
    else if (kind === "anam") S.anam = Math.max(S.anam, k);
    else if (kind === "bloom") S.bloom = Math.max(S.bloom, k);
  }
  function shockAt(x, y, h, k) {
    S.shock = 0;
    S.shockAt[0] = x;
    S.shockAt[1] = y;
    S.shockAt[2] = h || 3;
    S.shockK = k == null ? 1 : k;
  }

  /* ---------------------------------------------------------------- events from the sim */
  function onEvent(ev, game) {
    if (!ev || !game) return;
    const pl = game.player;
    switch (ev.type) {
      case "go":
        pulse("anam", 1.6);
        pulse("ca", 0.8);
        if (pl) {
          shockAt(pl.x, pl.y, 3, 0.9);
          try {
            R().burst(pl.x, pl.y, "ring", { r: 0.3, g: 1, b: 0.6, speed: 150 });
          } catch {}
        }
        break;
      case "boost":
        pulse("ca", 1.3);
        pulse("anam", 1.2);
        pulse("bloom", 0.35);
        if (pl) {
          shockAt(pl.x, pl.y, 3, 1);
          try {
            R().burst(pl.x, pl.y, "ring", { r: 0.35, g: 0.85, b: 1, speed: 130 });
          } catch {}
        }
        break;
      case "dash":
        pulse("ca", 0.9);
        pulse("anam", 0.8);
        break;
      case "wallHit": {
        const k = ev.intensity == null ? 0.5 : ev.intensity;
        pulse("ca", 0.5 + k * 1.4);
        break;
      }
      case "shipHit":
        pulse("ca", 0.4 + (ev.intensity || 0.4) * 1.2);
        break;
      case "finalLap":
        pulse("anam", 2);
        pulse("bloom", 0.5);
        pulse("ca", 0.6);
        break;
      case "overtake":
        if (ev.gained && (ev.place | 0) === 1) {
          pulse("anam", 1.2);
          pulse("bloom", 0.3);
        }
        break;
      case "explode": {
        const x = ev.x != null ? ev.x : pl ? pl.x : 0,
          y = ev.y != null ? ev.y : pl ? pl.y : 0;
        shockAt(x, y, 5, 1.6);
        pulse("ca", 1.6);
        pulse("bloom", 0.6);
        break;
      }
      case "finish":
        beginFinish(game, ev.place | 0);
        break;
      case "retired":
        beginWreck(game);
        break;
    }
  }

  function beginFinish(game, place) {
    if (setting("cine.finish", true) === false) return;
    const pl = game.player;
    if (!pl) return;
    S.mode = "finish";
    S.t = 0;
    S.game = game;
    S.place = place || pl.place || 0;
    S.fwT = 0;
    Cine.hideHud = true;
    Cine.timeScale = 0.2;
    padsOff();
    // trackside camera a little down the road, on the outside of the racing line
    const a = pl.angle || 0,
      fx = Math.cos(a),
      fy = Math.sin(a);
    const side = (pl.lateral || 0) >= 0 ? -1 : 1;
    const cx = pl.x + fx * 58 - fy * 23 * side,
      cy = pl.y + fy * 58 + fx * 23 * side;
    S.fin = { cx, cy, ch: elev(cx, cy) + 2.4, side };
    S.orbitA = a + Math.PI + 0.9 * side;
    pulse("anam", 2.4);
    pulse("bloom", 0.8);
    pulse("ca", 1);
    shockAt(pl.x, pl.y, 3, 1.3);
    try {
      R().burst(pl.x, pl.y, "ring", { r: 1, g: 0.85, b: 0.4, speed: 170 });
    } catch {}
    sfx(S.place === 1 ? "cineWin" : "cineFinish");
  }

  /* the race is over for the player: take the touch pads off the picture */
  function padsOff() {
    try {
      FZ.Input && FZ.Input.setMode("menu");
    } catch {}
  }
  function beginWreck(game) {
    const pl = game.player;
    if (!pl) return;
    S.mode = "wreck";
    S.t = 0;
    S.game = game;
    Cine.hideHud = true;
    Cine.timeScale = 0.3;
    padsOff();
    S.orbitA = (pl.angle || 0) + 2.4;
    sfx("cineWreck");
  }

  /* ---------------------------------------------------------------- intro timeline */
  const D_EST = 3.3, // establishing crane
    D_GRID = 3.5, // grid dolly
    D_HERO = 2.9, // hero orbit + hand-off to the chase cam
    T_GRID = D_EST,
    T_HERO = D_EST + D_GRID,
    T_END = D_EST + D_GRID + D_HERO,
    CUT = 0.14; // dip-to-black half length around cuts

  function introCam(t, game) {
    const f = S.frame;
    if (t < T_GRID) {
      // 1. crane down from high behind the grid, revealing the start gantry and the skyline
      const u = easeInOut(t / D_EST);
      const p = mix3(gp(f, -f.back - 330, 64 * f.side, 150), gp(f, -f.back - 70, 16 * f.side, 24), u);
      const tg = mix3(gp(f, f.front + 420, 0, 60), gp(f, f.front + 160, 0, 10), u);
      setCam(p, tg, lerp(50, 38, u), lerp(-0.05, 0, u) * f.side);
    } else if (t < T_HERO) {
      // 2. low telephoto dolly up the grid, ships sliding past in the foreground
      const u = (t - T_GRID) / D_GRID,
        e = smooth(u);
      const along = lerp(-f.back - 34, f.front + 6, e);
      const p = gp(f, along, 45 * f.side, 3.6 + 1.4 * Math.sin(u * Math.PI));
      const tg = gp(f, along + 52, -10 * f.side, 3.4);
      setCam(p, tg, 36, 0.03 * f.side);
      return 0.7;
    } else {
      // 3. hero orbit around the player's machine, then settle into the chase position
      const u = clamp((t - T_HERO) / D_HERO, 0, 1);
      const pl = game.player;
      const a0 = f.a + 0.62 * f.side, // front three-quarter
        a1 = f.a + Math.PI * f.side * 0.999; // dead astern
      const e = easeInOut(Math.min(1, u / 0.78));
      const a = lerp(a0, a1, e);
      const r = lerp(25, 32, e),
        h = lerp(2.8, 10, e);
      const ox = pl.x + Math.cos(a) * r,
        oy = pl.y + Math.sin(a) * r;
      let p = [ox, elev(ox, oy) + h, oy];
      let tg = [pl.x, elev(pl.x, pl.y) + 3, pl.y];
      let fov = lerp(36, 42, e);
      const cc = chaseCam(game);
      const k = smooth((u - 0.7) / 0.3);
      if (k > 0) {
        p = mix3(p, cc.p, k);
        tg = mix3(tg, cc.t, k);
        fov = lerp(fov, cc.fov, k);
      }
      setCam(p, tg, fov, 0);
      return 1 - k;
    }
    return 0;
  }

  /* ---------------------------------------------------------------- per-frame */
  function update(dt, game, screen) {
    dt = clamp(+dt || 0, 0, 0.1);
    const r = R();
    if (!r) return;
    const fx = r.fx;
    const g = game || S.game;
    const pl = g && g.player;
    let barsT = 0,
      gradeT = 0.22, // a touch of filmic grade is always on
      desatT = 0,
      grainT = 0.016,
      exposure = 1,
      radial = 0,
      closeUp = 0, // engine glow fills the lens in tight shots: pull bloom and streaks back
      rollT = 0;

    if (S.mode === "intro" && g) {
      S.t += dt;
      let t = S.t;
      // a skip fast-forwards through a quick dip to black straight to the hand-off
      if (S.skipT >= 0) {
        const k = (S.t - S.skipT) / 0.22;
        if (k >= 1) {
          endIntro();
        } else {
          S.fade = smooth(k);
        }
      } else {
        // opening fade + dips at the two cuts
        let fade = 1 - smooth(t / 0.7);
        for (const c of [T_GRID, T_HERO]) {
          const d = Math.abs(t - c);
          if (d < CUT) fade = Math.max(fade, 1 - d / CUT);
        }
        S.fade = fade;
        if (t >= T_END) endIntro();
      }
      if (S.mode === "intro") {
        try {
          FZ.Input && FZ.Input.mode !== "menu" && FZ.Input.setMode("menu");
        } catch {}
        closeUp = introCam(Math.min(t, T_END - 0.001), g);
        barsT = t > T_END - 0.5 ? 0 : 0.13;
        gradeT = 1;
        grainT = 0.034;
        if (S.lastStage !== stageOf(t)) {
          S.lastStage = stageOf(t);
          if (S.lastStage === "grid") sfx("cineWhoosh");
          if (S.lastStage === "hero") sfx("cineRise");
        }
      }
    } else if (S.mode === "finish" && g && pl) {
      S.t += dt;
      const t = S.t;
      // 0.0-1.5s: 20% speed fly-by from the trackside camera; then ramp back to real time on a hero orbit
      Cine.timeScale = t < 1.25 ? 0.2 : lerp(0.2, 1, smooth((t - 1.25) / 0.9));
      const px = pl.x,
        py = pl.y,
        pe = elev(px, py);
      if (t < 1.5) {
        const f = S.fin;
        setCam([f.cx, f.ch, f.cy], [px, pe + 2.4, py], lerp(36, 27, smooth(t / 1.5)), 0.05 * f.side);
        S.fade = t > 1.4 ? (t - 1.4) / 0.1 : 0; // dip to black into the orbit
      } else {
        S.orbitA += dt * 0.5;
        const u = smooth((t - 1.5) / 3);
        const rr = lerp(21, 27, u),
          hh = lerp(3, 8.5, u);
        const ox = px + Math.cos(S.orbitA) * rr,
          oy = py + Math.sin(S.orbitA) * rr;
        setCam([ox, Math.max(elev(ox, oy), pe) + hh, oy], [px, pe + 3, py], lerp(34, 40, u), 0);
        S.fade = t < 1.6 ? 1 - (t - 1.5) / 0.1 : 0;
        // celebration
        S.fwT -= dt;
        if (S.fwT <= 0 && S.place >= 1 && S.place <= 3) {
          S.fwT = S.place === 1 ? 0.28 : 0.5;
          fireworkNear(px, py, pl.angle || 0);
        }
        if (S.place === 1 && Math.random() < dt * 5) {
          try {
            r.burst(px + (Math.random() - 0.5) * 60, py + (Math.random() - 0.5) * 60, "confetti");
          } catch {}
        }
      }
      barsT = 0.13;
      gradeT = 1;
      grainT = 0.03;
      exposure = 1 + 0.25 * Math.max(0, 1 - t / 0.5);
      radial = t < 1.4 ? 0.22 * (1 - t / 1.4) : 0;
      closeUp = t > 1.5 ? 1 : 0;
    } else if (S.mode === "wreck" && g && pl) {
      S.t += dt;
      const t = S.t;
      Cine.timeScale = t < 1.6 ? 0.3 : lerp(0.3, 1, smooth((t - 1.6) / 1.2));
      S.orbitA += dt * 0.32;
      const px = pl.x,
        py = pl.y,
        pe = elev(px, py);
      const rr = lerp(22, 44, easeOut(t / 4)),
        hh = lerp(5, 22, easeOut(t / 4));
      const ox = px + Math.cos(S.orbitA) * rr,
        oy = py + Math.sin(S.orbitA) * rr;
      setCam([ox, Math.max(elev(ox, oy), pe) + hh, oy], [px, pe + 3, py], 40, 0.04);
      barsT = 0.13;
      gradeT = 1;
      desatT = 0.72 * smooth(t / 1.2);
      grainT = 0.07;
      S.fade = 0;
    } else if (S.mode === "orbit" && g && pl && (screen === "results" || screen === "epilogue")) {
      S.t += dt;
      S.orbitA += dt * 0.16;
      const px = pl.x,
        py = pl.y,
        pe = elev(px, py);
      const ox = px + Math.cos(S.orbitA) * 30,
        oy = py + Math.sin(S.orbitA) * 30;
      setCam([ox, Math.max(elev(ox, oy), pe) + 9, oy], [px, pe + 3, py], 40, 0);
      gradeT = 0.7;
      grainT = 0.024;
      closeUp = 1;
      desatT = pl.exploded ? 0.5 : 0;
      S.fade = 0;
      Cine.timeScale = 1;
    } else {
      if (S.mode === "orbit") {
        S.mode = null;
      }
      if (!Cine.active) {
        cam.on = false;
        Cine.timeScale = 1;
        S.fade = Math.max(0, S.fade - dt * 4);
      }
      // gameplay lens: speed and boost push the glass
      if (pl && g.phase === "racing" && !pl.exploded) {
        const sp = clamp((pl.speed || 0) / 300, 0, 1.4);
        S.speedSm += (sp - S.speedSm) * Math.min(1, dt * 3);
        S.boostSm += ((pl.boosting ? 1 : 0) - S.boostSm) * Math.min(1, dt * 6);
        // lean the horizon into the turn: reads as weight transfer, sells the banking
        rollT = -clamp(pl.bank || 0, -1, 1) * 0.045 * clamp(sp * 1.4, 0, 1);
      } else {
        S.speedSm += (0 - S.speedSm) * Math.min(1, dt * 3);
        S.boostSm += (0 - S.boostSm) * Math.min(1, dt * 6);
      }
    }

    // ease shared parameters
    const ek = Math.min(1, dt * 5);
    S.bars += (barsT - S.bars) * ek;
    S.grade += (gradeT - S.grade) * Math.min(1, dt * 3);
    S.desat += (desatT - S.desat) * Math.min(1, dt * 2.5);
    S.roll += (rollT - S.roll) * Math.min(1, dt * 4);
    // decay pulses
    S.ca = Math.max(0, S.ca - dt * 2.2);
    S.anam = Math.max(0, S.anam - dt * 1.6);
    S.bloom = Math.max(0, S.bloom - dt * 1.2);

    const speedCA = Math.max(0, S.speedSm - 0.75) * 0.5 + S.boostSm * 0.55;
    fx.ca = Math.min(1.8, S.ca + speedCA + (Cine.active ? 0.3 : 0));
    S.close += (closeUp - S.close) * Math.min(1, dt * 5);
    fx.anam = S.anam + S.boostSm * 0.5 + (Cine.active ? 0.15 : 0) - 0.55 * S.close;
    fx.bloom = S.bloom + S.boostSm * 0.12 - 0.3 * S.close;
    fx.grain = grainT;
    fx.cine = S.grade;
    fx.bars = S.bars;
    fx.desat = S.desat;
    fx.fade = S.fade;
    fx.exposure = exposure;
    fx.radial = radial;
    fx.roll = Cine.active || S.mode === "orbit" ? 0 : S.roll;

    // shock ring
    if (S.shock >= 0) {
      S.shock += dt * 1.9;
      if (S.shock >= 1) {
        S.shock = -1;
        fx.shock[3] = 0;
      } else {
        let uv = [0.5, 0.45, 1];
        try {
          uv = r.project(S.shockAt[0], S.shockAt[1], S.shockAt[2]);
        } catch {}
        fx.shock[0] = uv[0];
        fx.shock[1] = uv[1];
        fx.shock[2] = 0.02 + S.shock * 0.9;
        fx.shock[3] = uv[2] ? (1 - S.shock) * (1 - S.shock) * S.shockK : 0;
      }
    } else fx.shock[3] = 0;

    r.cine = cam;
  }

  function stageOf(t) {
    return t < T_GRID ? "est" : t < T_HERO ? "grid" : "hero";
  }

  const FW = [
    [1, 0.35, 0.8],
    [0.3, 0.9, 1],
    [1, 0.8, 0.25],
    [0.55, 1, 0.5],
    [0.75, 0.5, 1],
    [1, 0.5, 0.3],
  ];
  function fireworkNear(x, y, ang) {
    const r = R();
    if (!r) return;
    const c = FW[(Math.random() * FW.length) | 0];
    const a = ang + (Math.random() - 0.5) * 2.4,
      d = 90 + Math.random() * 190;
    try {
      r.burst(x + Math.cos(a) * d, y + Math.sin(a) * d, "firework", { r: c[0], g: c[1], b: c[2], h: 70 + Math.random() * 90, speed: 70 + Math.random() * 50 });
    } catch {}
    sfx("firework", { delay: 0.05 + d / 900, pan: Math.random() * 2 - 1 });
  }

  /* ---------------------------------------------------------------- 2D overlays (title cards, lower thirds) */
  const FONT = '"Avenir Next Condensed","AvenirNextCondensed-Heavy","Futura","Arial Narrow","DejaVu Sans Condensed",sans-serif';
  function spaced(ctx, text, x, y, px, spacing, align) {
    // letter-spaced caps (canvas letterSpacing is not on every WebKit yet)
    text = String(text);
    let w = 0;
    const ws = [];
    for (let i = 0; i < text.length; i++) {
      const cw = ctx.measureText(text[i]).width;
      ws.push(cw);
      w += cw + (i < text.length - 1 ? spacing : 0);
    }
    let cx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], cx, y);
      cx += ws[i] + spacing;
    }
    return w;
  }
  function safe(W, H) {
    try {
      if (FZ.Input && FZ.Input.safeArea) {
        const st = FZ.UI && FZ.UI._state;
        const k = (st && st.k) || 1;
        const e = FZ.Input.safeArea((st && st.Wd) || W, (st && st.Hd) || H);
        return { l: e.l / k, r: e.r / k, t: e.t / k, b: e.b / k };
      }
    } catch {}
    return { l: 0, r: 0, t: 0, b: 0 };
  }

  function draw(ctx, W, H, time) {
    if (!ctx || !S.mode) return;
    try {
      ctx.save();
      if (S.mode === "intro") drawIntro(ctx, W, H, time);
      else if (S.mode === "finish") drawFinish(ctx, W, H, time);
      else if (S.mode === "wreck") drawWreck(ctx, W, H, time);
    } catch (e) {
      if (!draw.warned) {
        draw.warned = 1;
        console.warn("[cine] draw", e);
      }
    } finally {
      ctx.restore();
    }
  }

  function drawIntro(ctx, W, H, time) {
    const t = S.t,
      sa = safe(W, H);
    const barH = H * 0.5 * S.bars;
    // title card over the establishing shot
    if (S.title && t < T_GRID + 0.2) {
      const a = smooth((t - 0.5) / 0.6) * (1 - smooth((t - (T_GRID - 0.55)) / 0.4));
      if (a > 0.01) {
        const cx = W / 2,
          cy = H * 0.3;
        const slide = (1 - easeOut((t - 0.5) / 0.9)) * 40;
        ctx.globalAlpha = a * 0.55;
        const bg = ctx.createLinearGradient(0, cy - 70, 0, cy + 80);
        bg.addColorStop(0, "rgba(9,4,24,0)");
        bg.addColorStop(0.45, "rgba(9,4,24,0.75)");
        bg.addColorStop(1, "rgba(9,4,24,0)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, cy - 70, W, 150);
        ctx.globalAlpha = a;
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#ff8ae8";
        ctx.font = "700 13px " + FONT;
        spaced(ctx, S.title.over, cx + slide, cy - 34, 13, 5, "center");
        // rule
        const rw = 150 * easeOut((t - 0.6) / 0.8);
        const gr = ctx.createLinearGradient(cx - rw, 0, cx + rw, 0);
        gr.addColorStop(0, "rgba(94,240,255,0)");
        gr.addColorStop(0.5, "rgba(94,240,255,0.95)");
        gr.addColorStop(1, "rgba(94,240,255,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(cx - rw, cy - 26, rw * 2, 1.5);
        ctx.font = "italic 800 54px " + FONT;
        ctx.shadowColor = "rgba(94,240,255,0.85)";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "#ffffff";
        spaced(ctx, S.title.big, cx - slide, cy + 26, 54, 7, "center");
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#e8e2ff";
        ctx.font = "600 13px " + FONT;
        spaced(ctx, String(S.title.under).toUpperCase(), cx + slide * 0.5, cy + 52, 13, 4, "center");
        ctx.globalAlpha = 1;
      }
    }
    // rival lower-thirds during the grid dolly
    for (const c of S.cards) {
      const u = (t - c.t0) / c.dur;
      if (u <= 0 || u >= 1) continue;
      const a = smooth(u / 0.16) * (1 - smooth((u - 0.84) / 0.16));
      lowerThird(ctx, W, H, sa, c, a, u, time, false);
    }
    // the hero card
    if (S.heroCard && t > T_HERO + 0.25 && t < T_END - 0.35) {
      const u = (t - T_HERO - 0.25) / (D_HERO - 0.6);
      const a = smooth(u / 0.16) * (1 - smooth((u - 0.8) / 0.2));
      lowerThird(ctx, W, H, sa, S.heroCard, a, u, time, true);
    }
    // skip hint
    if (t > 1.2 && S.skipT < 0 && t < T_END - 0.6) {
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin(time * 4);
      ctx.fillStyle = "#a49ad0";
      ctx.font = "700 10px " + FONT;
      ctx.textBaseline = "alphabetic";
      spaced(ctx, "TAP TO SKIP", W - Math.max(14, sa.r + 10), H - Math.max(8, barH * 0.5 - 3), 10, 3, "right");
      ctx.globalAlpha = 1;
    }
  }

  function lowerThird(ctx, W, H, sa, c, a, u, time, hero) {
    if (a <= 0.01) return;
    const ps = hero ? 64 : 60;
    const barH = H * 0.5 * S.bars;
    const x0 = hero ? Math.max(26, sa.l + 14) : Math.max(26, sa.l + 14);
    const y0 = H - barH - ps - 16;
    const slide = (1 - easeOut(u / 0.25)) * -36;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(slide, 0);
    // plate
    const pw = 300,
      ph = ps;
    const g = ctx.createLinearGradient(x0, 0, x0 + pw, 0);
    g.addColorStop(0, "rgba(9,4,24,0.86)");
    g.addColorStop(0.75, "rgba(9,4,24,0.6)");
    g.addColorStop(1, "rgba(9,4,24,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0 + 10, y0);
    ctx.lineTo(x0 + pw, y0);
    ctx.lineTo(x0 + pw - 10, y0 + ph);
    ctx.lineTo(x0, y0 + ph);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c.color || "#5ef0ff";
    ctx.fillRect(x0 + ps + 10, y0 + ph - 3, 150 * easeOut(u / 0.4), 2);
    // portrait
    let hasPortrait = false;
    try {
      if (c.who && FZ.Story && FZ.Story.drawPortrait) {
        FZ.Story.drawPortrait(ctx, c.who, x0 + 4, y0 + 2, ps - 4, c.mood || "neutral", time, { radio: true });
        hasPortrait = true;
      }
    } catch {}
    const tx = x0 + (hasPortrait ? ps + 12 : 18);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = c.color || "#5ef0ff";
    ctx.font = "700 10px " + FONT;
    spaced(ctx, String(c.tag || "").toUpperCase(), tx, y0 + 16, 10, 3, "left");
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 800 " + (hero ? 27 : 23) + "px " + FONT;
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 6;
    ctx.fillText(String(c.name), tx, y0 + (hero ? 41 : 39));
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#e8e2ff";
    ctx.font = "600 11px " + FONT;
    spaced(ctx, (c.shipName ? c.shipName : "") + (hero ? "" : c.gridPos ? "   ·   GRID P" + c.gridPos : ""), tx, y0 + ph - 7, 11, 2.5, "left");
    ctx.restore();
  }

  const ORD = ["", "1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH"];
  function drawFinish(ctx, W, H, time) {
    const t = S.t;
    if (t < 0.25) return;
    const a = smooth((t - 0.25) / 0.35) * (1 - smooth((t - (Cine.finishHold - 0.9)) / 0.6));
    if (a <= 0.01) return;
    const cx = W / 2,
      cy = H * 0.5;
    const win = S.place === 1,
      podium = S.place >= 1 && S.place <= 3;
    const big = ORD[S.place] || "FINISH";
    const scale = 1 + (1 - easeOut((t - 0.25) / 0.5)) * 0.9;
    ctx.globalAlpha = a;
    ctx.textBaseline = "alphabetic";
    ctx.save();
    ctx.translate(cx, cy + 20);
    ctx.scale(scale, scale);
    ctx.font = "italic 800 104px " + FONT;
    const gr = ctx.createLinearGradient(0, -80, 0, 6);
    if (win) {
      gr.addColorStop(0, "#fffbe0");
      gr.addColorStop(0.45, "#ffd23c");
      gr.addColorStop(1, "#ff8a1c");
    } else if (podium) {
      gr.addColorStop(0, "#ffffff");
      gr.addColorStop(0.5, "#bfe9ff");
      gr.addColorStop(1, "#5ef0ff");
    } else {
      gr.addColorStop(0, "#ffffff");
      gr.addColorStop(1, "#b9b0e0");
    }
    ctx.shadowColor = win ? "rgba(255,150,40,0.9)" : "rgba(94,240,255,0.8)";
    ctx.shadowBlur = 30;
    ctx.fillStyle = gr;
    ctx.textAlign = "center";
    ctx.fillText(big, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
    const sw = ((t * 0.9) % 2.2) / 2.2;
    ctx.textAlign = "left";
    ctx.fillStyle = win ? "#ffe45c" : "#ff8ae8";
    ctx.font = "700 15px " + FONT;
    const label = win ? "WINNER" : podium ? "PODIUM FINISH" : "RACE COMPLETE";
    const la = smooth((t - 0.7) / 0.4);
    ctx.globalAlpha = a * la;
    spaced(ctx, label, cx, cy - 74 + (1 - la) * 10, 15, 9, "center");
    const rw = 190 * easeOut((t - 0.7) / 0.7);
    const g2 = ctx.createLinearGradient(cx - rw, 0, cx + rw, 0);
    const col = win ? "255,210,60" : "94,240,255";
    g2.addColorStop(0, "rgba(" + col + ",0)");
    g2.addColorStop(0.5 + 0.3 * Math.sin(sw * TAU) * 0.2, "rgba(" + col + ",0.95)");
    g2.addColorStop(1, "rgba(" + col + ",0)");
    ctx.fillStyle = g2;
    ctx.fillRect(cx - rw, cy + 34, rw * 2, 1.5);
    // time under the rule
    const g = S.game,
      pl = g && g.player;
    if (pl && FZ.HUD && FZ.HUD.fmtTime) {
      let tot = pl.finishTime != null ? pl.finishTime : pl.totalTime != null ? pl.totalTime : g.raceTime;
      ctx.fillStyle = "#e8e2ff";
      ctx.font = "600 14px " + FONT;
      let s = "";
      try {
        s = FZ.HUD.fmtTime(tot);
      } catch {}
      if (s) spaced(ctx, "TIME  " + s, cx, cy + 56, 14, 4, "center");
    }
    ctx.globalAlpha = 1;
  }

  function drawWreck(ctx, W, H, time) {
    const t = S.t;
    const a = smooth((t - 0.5) / 0.5) * (1 - smooth((t - (Cine.wreckHold - 0.8)) / 0.6));
    if (a <= 0.01) return;
    const cx = W / 2,
      cy = H * 0.5;
    ctx.globalAlpha = a;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ff5468";
    ctx.font = "700 13px " + FONT;
    spaced(ctx, "MACHINE DESTROYED", cx, cy - 30, 13, 8, "center");
    ctx.font = "italic 800 64px " + FONT;
    ctx.shadowColor = "rgba(255,32,64,0.85)";
    ctx.shadowBlur = 26;
    ctx.fillStyle = "#ffffff";
    spaced(ctx, "RETIRED", cx, cy + 30, 64, 10 + 8 * easeOut(t / 3), "center");
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------- input: tap / key skips the flyover */
  function bindSkip() {
    try {
      const I = FZ.Input;
      if (I && I.onTap) I.onTap(() => skip());
      if (I && I.onMenuKey) I.onMenuKey((k) => (k === "ok" || k === "back") && skip());
    } catch {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(bindSkip, 0));
  else setTimeout(bindSkip, 0);

  FZ.Cine = Cine;
})();
