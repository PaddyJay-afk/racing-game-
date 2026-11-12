/* sfx2.js — cinema sound layer.
 *
 * Sits on top of audio.js (music, UI blips, the player's engine) and adds the "film mix":
 *   - positional rival engines with Doppler shift and stereo pass-bys
 *   - speed-driven wind rush and sub rumble, afterburner roar while boosting
 *   - layered impacts (modal metal ring + sub thump), explosions with a long arena tail
 *   - trailer-style stingers for the cutscenes (braam, riser, whoosh, win swell), fireworks, crowd
 *   - a slow-motion filter on the whole mix while the photo finish runs at 20% speed
 *
 * Everything is synthesised with Web Audio at run time: no samples to download.
 */
(function () {
  "use strict";
  const FZ = (window.FZ = window.FZ || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const MAX_RIVALS = 5;

  const X = {
    ctx: null,
    core: null,
    bus: null, // dry sfx bus
    rev: null, // reverb send
    slow: null, // slow-motion lowpass on the master path
    wind: null,
    burn: null,
    crowd: null,
    rivals: [],
    prev: new Map(), // ship -> last distance (for closing speed)
    stand: null, // grandstand position (start line)
    ok: false,
    failed: false,
    slowK: 1,
  };

  function state() {
    try {
      return FZ.Audio && FZ.Audio._internal && FZ.Audio._internal.state;
    } catch {
      return null;
    }
  }

  /* build the graph the first time audio is running */
  function ensure() {
    if (X.ok) return X.ctx.state === "running";
    if (X.failed) return false;
    const st = state();
    if (!st || !st.ctx || !st.core || st.ctx.state !== "running") return false;
    try {
      const ctx = (X.ctx = st.ctx),
        core = (X.core = st.core);
      X.bus = ctx.createGain();
      X.bus.gain.value = 0.9;
      X.bus.connect(core.sfx);
      // arena reverb: 3.2 s exponentially decaying stereo noise, darker in the tail
      const conv = ctx.createConvolver();
      conv.buffer = impulse(ctx, 3.2, 2.4);
      const revHp = ctx.createBiquadFilter();
      revHp.type = "highpass";
      revHp.frequency.value = 180;
      const revOut = ctx.createGain();
      revOut.gain.value = 0.55;
      X.rev = ctx.createGain();
      X.rev.connect(revHp);
      revHp.connect(conv);
      conv.connect(revOut);
      revOut.connect(core.sfx);
      // slow-motion filter spliced between the pre-bus and the glue compressor
      try {
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 20000;
        lp.Q.value = 0.7;
        core.pre.disconnect(core.glue);
        core.pre.connect(lp);
        lp.connect(core.glue);
        X.slow = lp;
      } catch {
        try {
          core.pre.connect(core.glue);
        } catch {}
        X.slow = null;
      }
      buildWind();
      buildBurn();
      buildCrowd();
      for (let i = 0; i < MAX_RIVALS; i++) X.rivals.push(buildRival(i));
      X.ok = true;
    } catch (e) {
      X.failed = true;
      console.warn("[sfx2] init", e);
      return false;
    }
    return true;
  }

  function impulse(ctx, secs, decay) {
    const sr = ctx.sampleRate,
      n = Math.floor(sr * secs),
      buf = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const env = Math.pow(1 - t, decay) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
        // one-pole lowpass that closes as the tail decays
        const k = 0.9 - 0.75 * t;
        lp += ((Math.random() * 2 - 1) - lp) * k;
        d[i] = lp * env;
      }
      // a few discrete early reflections (grandstands, harbour wall)
      for (const [ms, g] of [
        [23, 0.5],
        [41, 0.38],
        [67, 0.3],
        [97, 0.22],
      ]) {
        const i = Math.floor(((ms + ch * 7) / 1000) * sr);
        if (i < n) d[i] += g * (ch ? -1 : 1);
      }
    }
    return buf;
  }

  function noiseSrc(rate) {
    const s = X.ctx.createBufferSource();
    s.buffer = X.core.noise;
    s.loop = true;
    s.playbackRate.value = rate || 1;
    return s;
  }
  function panner(p) {
    const ctx = X.ctx;
    if (ctx.createStereoPanner) {
      const n = ctx.createStereoPanner();
      n.pan.value = p || 0;
      return n;
    }
    const g = ctx.createGain(); // very old WebKit: no panner, stay centred
    g.pan = { value: 0, setTargetAtTime() {}, setValueAtTime() {}, linearRampToValueAtTime() {} };
    return g;
  }

  /* ---------------------------------------------------------------- continuous layers */
  function buildWind() {
    const ctx = X.ctx;
    const src = noiseSrc(0.8);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.6;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 220;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(bp);
    bp.connect(hp);
    hp.connect(g);
    g.connect(X.bus);
    // low rumble through the hull at speed
    const src2 = noiseSrc(0.35);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 90;
    lp.Q.value = 1.2;
    const g2 = ctx.createGain();
    g2.gain.value = 0;
    src2.connect(lp);
    lp.connect(g2);
    g2.connect(X.bus);
    src.start();
    src2.start();
    X.wind = { bp, g, lp, g2 };
  }

  function buildBurn() {
    const ctx = X.ctx;
    const src = noiseSrc(0.6);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    lp.Q.value = 2.5;
    const sh = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const x = (i / 511) * 2 - 1;
      curve[i] = Math.tanh(x * 3.2);
    }
    sh.curve = curve;
    const g = ctx.createGain();
    g.gain.value = 0;
    // crackle: fast random AM on the roar
    const lfo = ctx.createOscillator();
    lfo.type = "sawtooth";
    lfo.frequency.value = 31;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    src.connect(lp);
    lp.connect(sh);
    sh.connect(g);
    g.connect(X.bus);
    g.connect(X.rev);
    src.start();
    lfo.start();
    X.burn = { lp, g, lfoG };
  }

  function buildCrowd() {
    const ctx = X.ctx;
    const src = noiseSrc(0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 950;
    bp.Q.value = 0.55;
    const bp2 = ctx.createBiquadFilter();
    bp2.type = "peaking";
    bp2.frequency.value = 2200;
    bp2.Q.value = 1.2;
    bp2.gain.value = 5;
    const g = ctx.createGain();
    g.gain.value = 0;
    // slow swell so it breathes like a stadium rather than hissing
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.37;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 1.3;
    const lfo2G = ctx.createGain();
    lfo2G.gain.value = 180;
    lfo2.connect(lfo2G);
    lfo2G.connect(bp.frequency);
    src.connect(bp);
    bp.connect(bp2);
    bp2.connect(g);
    g.connect(X.bus);
    g.connect(X.rev);
    src.start();
    lfo.start();
    lfo2.start();
    X.crowd = { g, lfoG, level: 0, cheer: 0 };
  }

  function buildRival(i) {
    const ctx = X.ctx;
    const o1 = ctx.createOscillator();
    o1.type = "sawtooth";
    const o2 = ctx.createOscillator();
    o2.type = "square";
    o2.detune.value = 9 + i * 3;
    const og = ctx.createGain();
    og.gain.value = 0.35;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    lp.Q.value = 3;
    const ns = noiseSrc(1 + i * 0.07);
    const nb = ctx.createBiquadFilter();
    nb.type = "bandpass";
    nb.frequency.value = 1400;
    nb.Q.value = 0.9;
    const ng = ctx.createGain();
    ng.gain.value = 0.5;
    const g = ctx.createGain();
    g.gain.value = 0;
    const pan = panner(0);
    o1.connect(lp);
    o2.connect(og);
    og.connect(lp);
    lp.connect(g);
    ns.connect(nb);
    nb.connect(ng);
    ng.connect(g);
    g.connect(pan);
    pan.connect(X.bus);
    const send = ctx.createGain();
    send.gain.value = 0.25;
    pan.connect(send);
    send.connect(X.rev);
    o1.start();
    o2.start();
    ns.start();
    return { o1, o2, lp, nb, g, pan, base: 62 + i * 7, whoosh: 0 };
  }

  /* ---------------------------------------------------------------- one-shots */
  function env(g, t, a, peak, d, curve) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    if (curve === "lin") g.gain.linearRampToValueAtTime(0.0001, t + a + d);
    else g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function burstNoise(t, dur, type, f0, f1, q, peak, pan, send, attack) {
    const ctx = X.ctx;
    const s = ctx.createBufferSource();
    s.buffer = X.core.noise;
    s.loop = true;
    s.playbackRate.value = 0.7 + Math.random() * 0.6;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(Math.max(20, f0), t);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain();
    env(g, t, attack || 0.004, peak, dur);
    const p = panner(pan || 0);
    s.connect(f);
    f.connect(g);
    g.connect(p);
    p.connect(X.bus);
    if (send) {
      const sg = ctx.createGain();
      sg.gain.value = send;
      p.connect(sg);
      sg.connect(X.rev);
    }
    s.start(t);
    s.stop(t + dur + 0.1);
    return { src: s, filter: f, gain: g, pan: p };
  }
  function tone(t, dur, type, f0, f1, peak, pan, send, attack, curve) {
    const ctx = X.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(10, f0), t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(10, f1), t + dur);
    const g = ctx.createGain();
    env(g, t, attack || 0.005, peak, dur, curve);
    const p = panner(pan || 0);
    o.connect(g);
    g.connect(p);
    p.connect(X.bus);
    if (send) {
      const sg = ctx.createGain();
      sg.gain.value = send;
      p.connect(sg);
      sg.connect(X.rev);
    }
    o.start(t);
    o.stop(t + dur + 0.1);
    return { osc: o, gain: g };
  }
  function duck(t, depth, hold) {
    try {
      const d = X.core.duck.gain;
      d.cancelScheduledValues(t);
      d.setTargetAtTime(depth, t, 0.03);
      d.setTargetAtTime(1, t + hold, 0.35);
    } catch {}
  }

  const SHOTS = {
    /* metal-on-barrier: modal ring + grit + sub thump */
    impact(t, o) {
      const k = clamp(o.intensity == null ? 0.5 : o.intensity, 0.05, 1),
        pan = clamp(o.pan || 0, -1, 1);
      burstNoise(t, 0.09 + 0.1 * k, "highpass", 1800, 900, 0.7, 0.5 * k, pan, 0.4);
      const modes = o.ship ? [310, 520, 870, 1460] : [420, 760, 1180, 2240, 3100];
      for (let i = 0; i < modes.length; i++) {
        const f = modes[i] * (0.92 + Math.random() * 0.16);
        tone(t + i * 0.003, 0.18 + 0.5 * k * (1 - i / modes.length), "sine", f, f * 0.985, (0.16 * k) / (1 + i * 0.5), pan, 0.5);
      }
      tone(t, 0.2 + 0.15 * k, "sine", 95, 38, 0.75 * k, pan * 0.4, 0.1);
      if (k > 0.55) burstNoise(t + 0.02, 0.45, "bandpass", 3200, 5200, 4, 0.12 * k, pan, 0.6); // sparks sizzle
    },
    /* boost ignition: crack, sub drop, rising jet */
    ignite(t) {
      burstNoise(t, 0.07, "highpass", 2400, 1200, 0.7, 0.55, 0, 0.5);
      tone(t, 0.9, "sine", 120, 34, 0.9, 0, 0.15);
      tone(t, 0.5, "sawtooth", 180, 720, 0.12, 0, 0.5, 0.02);
      burstNoise(t + 0.03, 1.3, "bandpass", 300, 2600, 1.4, 0.4, 0, 0.6, 0.12);
    },
    explode(t, o) {
      const k = clamp(o.intensity == null ? 1 : o.intensity, 0.15, 1),
        pan = clamp(o.pan || 0, -1, 1);
      duck(t, 0.35, 1.2);
      burstNoise(t, 0.12, "highpass", 900, 300, 0.5, 1.0 * k, pan, 0.8);
      tone(t, 1.7, "sine", 72, 24, 1.0 * k, pan * 0.3, 0.3);
      tone(t, 0.9, "triangle", 140, 40, 0.5 * k, pan * 0.3, 0.3);
      burstNoise(t + 0.03, 2.2, "lowpass", 2400, 160, 0.8, 0.8 * k, pan, 0.9, 0.02);
      for (let i = 0; i < 9; i++) {
        // debris pattering down
        const tt = t + 0.25 + Math.random() * 1.5;
        burstNoise(tt, 0.05 + Math.random() * 0.07, "bandpass", 900 + Math.random() * 3000, 600 + Math.random() * 1500, 6, 0.1 * k, clamp(pan + Math.random() - 0.5, -1, 1), 0.7);
      }
    },
    firework(t, o) {
      const pan = clamp(o.pan || 0, -1, 1);
      tone(t, 0.5, "sine", 90, 42, 0.28, pan * 0.6, 0.6);
      burstNoise(t, 0.11, "highpass", 1400, 700, 0.6, 0.3, pan, 0.9);
      for (let i = 0; i < 14; i++) {
        const tt = t + 0.12 + Math.random() * 0.9;
        burstNoise(tt, 0.025, "highpass", 4200 + Math.random() * 3000, 3000, 0.8, 0.07 * (1 - (tt - t)), clamp(pan + (Math.random() - 0.5) * 0.6, -1, 1), 0.8);
      }
    },
    cineWhoosh(t, o) {
      const n = burstNoise(t, 0.85, "bandpass", 260, 3600, 1.1, 0.5, -0.8, 0.5, 0.42);
      try {
        n.pan.pan.setValueAtTime(-0.8, t);
        n.pan.pan.linearRampToValueAtTime(0.8, t + 0.85);
      } catch {}
      tone(t, 0.7, "sine", 70, 38, 0.3, 0, 0.2, 0.3);
    },
    /* trailer braam: stacked detuned saws through a closing filter + sub */
    braam(t, o) {
      const ctx = X.ctx,
        f0 = o.freq || 55,
        dur = o.dur || 2.6,
        peak = o.peak || 0.34;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.Q.value = 1.5;
      lp.frequency.setValueAtTime(2600, t);
      lp.frequency.exponentialRampToValueAtTime(240, t + dur);
      const g = ctx.createGain();
      env(g, t, 0.05, peak, dur);
      const sh = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) curve[i] = Math.tanh(((i / 255) * 2 - 1) * 2.2);
      sh.curve = curve;
      for (const [mul, det] of [
        [1, -11],
        [1, 9],
        [2, -6],
        [2, 7],
        [3, 0],
        [0.5, 0],
      ]) {
        const os = ctx.createOscillator();
        os.type = mul === 0.5 ? "sine" : "sawtooth";
        os.frequency.value = f0 * mul;
        os.detune.value = det;
        const og = ctx.createGain();
        og.gain.value = mul === 0.5 ? 0.9 : 0.5 / mul;
        os.connect(og);
        og.connect(sh);
        os.start(t);
        os.stop(t + dur + 0.2);
      }
      sh.connect(lp);
      lp.connect(g);
      g.connect(X.bus);
      const sg = ctx.createGain();
      sg.gain.value = 0.6;
      g.connect(sg);
      sg.connect(X.rev);
    },
    riser(t, o) {
      const dur = o.dur || 2.6;
      const ctx = X.ctx;
      const n = burstNoise(t, dur, "bandpass", 300, 6500, 2.2, 0.0001, 0, 0.5);
      n.gain.gain.cancelScheduledValues(t);
      n.gain.gain.setValueAtTime(0.0001, t);
      n.gain.gain.exponentialRampToValueAtTime(0.36, t + dur * 0.96);
      n.gain.gain.linearRampToValueAtTime(0.0001, t + dur);
      const os = ctx.createOscillator();
      os.type = "sawtooth";
      os.frequency.setValueAtTime(110, t);
      os.frequency.exponentialRampToValueAtTime(880, t + dur);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.09, t + dur * 0.95);
      og.gain.linearRampToValueAtTime(0.0001, t + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;
      os.connect(lp);
      lp.connect(og);
      og.connect(X.bus);
      og.connect(X.rev);
      os.start(t);
      os.stop(t + dur + 0.1);
    },
    hit(t, o) {
      // cinematic downbeat: sub boom + short noise slam + long tail
      const k = o.k || 1;
      tone(t, 1.6, "sine", 82, 30, 0.95 * k, 0, 0.35);
      burstNoise(t, 0.16, "lowpass", 3000, 400, 0.6, 0.7 * k, 0, 0.9);
      burstNoise(t + 0.02, 1.8, "bandpass", 900, 300, 0.7, 0.16 * k, 0, 1, 0.01);
    },
    /* shimmering chord swell: root + fifth + octave (+ major third for the win) */
    swell(t, o) {
      const ctx = X.ctx,
        root = o.root || 220,
        dur = o.dur || 4.2,
        ratios = o.major ? [1, 1.26, 1.498, 2, 2.52, 3] : [1, 1.498, 2, 3];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(o.peak || 0.16, t + 0.5);
      g.gain.setTargetAtTime(0.0001, t + dur * 0.55, dur * 0.2);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(700, t);
      lp.frequency.exponentialRampToValueAtTime(5200, t + 0.9);
      for (const r of ratios)
        for (const det of [-8, 7]) {
          const os = ctx.createOscillator();
          os.type = "sawtooth";
          os.frequency.value = root * r;
          os.detune.value = det + (Math.random() - 0.5) * 4;
          const og = ctx.createGain();
          og.gain.value = 0.22 / Math.sqrt(r);
          os.connect(og);
          og.connect(lp);
          os.start(t);
          os.stop(t + dur + 0.5);
        }
      lp.connect(g);
      g.connect(X.bus);
      const sg = ctx.createGain();
      sg.gain.value = 0.9;
      g.connect(sg);
      sg.connect(X.rev);
    },
    cineIntro(t) {
      duck(t, 0.55, 2.2);
      SHOTS.braam(t + 0.15, { freq: 55, dur: 2.8, peak: 0.3 });
      SHOTS.hit(t + 0.15, { k: 0.7 });
      SHOTS.cineWhoosh(t, {});
    },
    cineRise(t) {
      SHOTS.riser(t, { dur: 2.7 });
      SHOTS.cineWhoosh(t, {});
      SHOTS.hit(t + 2.72, { k: 0.8 });
    },
    cineFinish(t) {
      duck(t, 0.45, 1.6);
      SHOTS.hit(t, { k: 1 });
      SHOTS.swell(t + 0.1, { root: 196, dur: 4, major: false, peak: 0.12 });
      cheer(0.7);
    },
    cineWin(t) {
      duck(t, 0.4, 1.8);
      SHOTS.hit(t, { k: 1 });
      SHOTS.braam(t, { freq: 73.4, dur: 2.2, peak: 0.2 });
      SHOTS.swell(t + 0.08, { root: 293.7, dur: 5, major: true, peak: 0.17 });
      cheer(1);
    },
    cineWreck(t) {
      duck(t, 0.25, 2.6);
      tone(t, 2.6, "sawtooth", 220, 36, 0.16, 0, 0.6, 0.02); // tape-stop fall
      tone(t, 3.4, "sine", 55, 27, 0.6, 0, 0.3, 0.3);
      burstNoise(t, 2.8, "lowpass", 1800, 120, 0.7, 0.25, 0, 0.8, 0.05);
    },
    go(t) {
      SHOTS.hit(t, { k: 0.55 });
      cheer(0.8);
    },
    finalLap(t) {
      SHOTS.riser(t, { dur: 1.1 });
      SHOTS.hit(t + 1.1, { k: 0.6 });
      cheer(0.6);
    },
    lead(t) {
      SHOTS.swell(t, { root: 293.7, dur: 1.8, major: true, peak: 0.07 });
      cheer(0.5);
    },
  };

  function cheer(k) {
    if (X.crowd) X.crowd.cheer = Math.max(X.crowd.cheer, k);
  }

  function play(name, o) {
    if (!ensure()) return;
    const f = SHOTS[name];
    if (!f) return;
    try {
      f(X.ctx.currentTime + 0.01 + ((o && o.delay) || 0), o || {});
    } catch (e) {
      if (!play.warned) {
        play.warned = 1;
        console.warn("[sfx2]", name, e);
      }
    }
  }

  /* ---------------------------------------------------------------- game hooks */
  function raceStart(game) {
    X.prev = new Map();
    const pl = game && game.player;
    X.stand = pl ? { x: pl.x + Math.cos(pl.angle || 0) * 60, y: pl.y + Math.sin(pl.angle || 0) * 60 } : null;
    if (X.crowd) X.crowd.cheer = 0;
  }

  function stop() {
    if (!X.ok) return;
    const t = X.ctx.currentTime;
    try {
      X.wind.g.gain.setTargetAtTime(0, t, 0.1);
      X.wind.g2.gain.setTargetAtTime(0, t, 0.1);
      X.burn.g.gain.setTargetAtTime(0, t, 0.1);
      X.burn.lfoG.gain.setTargetAtTime(0, t, 0.1);
      X.crowd.g.gain.setTargetAtTime(0, t, 0.3);
      X.crowd.lfoG.gain.setTargetAtTime(0, t, 0.3);
      for (const r of X.rivals) r.g.gain.setTargetAtTime(0, t, 0.1);
      if (X.slow) X.slow.frequency.setTargetAtTime(20000, t, 0.1);
    } catch {}
  }

  function onEvent(ev, game) {
    if (!ev) return;
    const pl = game && game.player;
    switch (ev.type) {
      case "wallHit": {
        const k = ev.intensity == null ? 0.5 : ev.intensity;
        if (k > 0.12) play("impact", { intensity: k, pan: pl ? clamp((pl.lateral || 0) / 40, -0.8, 0.8) : 0 });
        break;
      }
      case "shipHit": {
        let pan = 0;
        if (pl && ev.other != null && game.ships) {
          const o = game.ships.find((s) => s.id === ev.other);
          if (o) pan = clamp(sideOf(pl, o) / 20, -0.9, 0.9);
        }
        play("impact", { intensity: clamp((ev.intensity || 0.4) * 1.1, 0.1, 1), pan, ship: true });
        break;
      }
      case "boost":
      case "dash":
        play("ignite");
        break;
      case "explode": {
        let k = 1,
          pan = 0;
        if (pl && ev.x != null) {
          const d = Math.hypot(ev.x - pl.x, ev.y - pl.y);
          k = clamp(1 - d / 700, 0, 1);
          pan = clamp(sideOf(pl, ev) / 120, -1, 1);
        }
        if (k > 0.05) play("explode", { intensity: k, pan });
        break;
      }
      case "go":
        play("go");
        break;
      case "finalLap":
        play("finalLap");
        break;
      case "overtake":
        if (ev.gained && (ev.place | 0) === 1) play("lead");
        break;
    }
  }

  /* signed lateral offset of b in a's frame (+ = to a's right) */
  function sideOf(a, b) {
    const ang = a.angle || 0;
    return -(b.x - a.x) * Math.sin(ang) + (b.y - a.y) * Math.cos(ang);
  }

  function update(dt, game, screen) {
    if (!ensure()) return;
    const t = X.ctx.currentTime;
    const pl = game && game.player;
    const racing = !!(pl && screen === "race" && game.phase !== "countdown" && !pl.exploded);
    const cine = FZ.Cine;
    // slow-motion filter follows the sim clock
    const ts = cine ? cine.timeScale : 1;
    if (X.slow) {
      const f = ts >= 0.98 ? 20000 : 500 + 5200 * Math.pow(clamp((ts - 0.15) / 0.85, 0, 1), 1.6);
      X.slow.frequency.setTargetAtTime(f, t, 0.08);
    }
    const sp = racing ? clamp((pl.speed || 0) / 300, 0, 1.4) : 0;
    // wind
    X.wind.g.gain.setTargetAtTime(racing ? 0.22 * sp * sp : 0, t, 0.12);
    X.wind.bp.frequency.setTargetAtTime(380 + 1900 * sp, t, 0.15);
    X.wind.g2.gain.setTargetAtTime(racing ? 0.5 * Math.max(0, sp - 0.35) : 0, t, 0.2);
    X.wind.lp.frequency.setTargetAtTime(70 + 60 * sp, t, 0.2);
    // afterburner
    const b = racing && pl.boosting ? 1 : 0;
    X.burn.g.gain.setTargetAtTime(b * 0.3, t, b ? 0.05 : 0.25);
    X.burn.lfoG.gain.setTargetAtTime(b * 0.1, t, 0.1);
    X.burn.lp.frequency.setTargetAtTime(500 + 900 * sp, t, 0.2);
    // crowd: louder near the grandstands, with decaying cheers on big moments
    let near = 0;
    if (pl && X.stand && (screen === "race" || screen === "results" || screen === "epilogue")) {
      const d = Math.hypot(pl.x - X.stand.x, pl.y - X.stand.y);
      near = clamp(1 - d / 520, 0, 1);
    }
    X.crowd.cheer = Math.max(0, X.crowd.cheer - dt * 0.28);
    const lvl = (near * 0.07 + X.crowd.cheer * 0.2) * (cine && cine.mode === "intro" ? 1.6 : 1);
    X.crowd.g.gain.setTargetAtTime(lvl, t, 0.25);
    X.crowd.lfoG.gain.setTargetAtTime(lvl * 0.35, t, 0.3);
    // rivals: distance attenuation, pan by side, Doppler from closing speed
    const ships = (game && game.ships) || [];
    let ri = 0;
    if (pl && (screen === "race" || screen === "results")) {
      for (let i = 0; i < ships.length && ri < MAX_RIVALS; i++) {
        const s = ships[i];
        if (s === pl || s.isPlayer) continue;
        const r = X.rivals[ri++];
        if (s.exploded || game.phase === "countdown") {
          r.g.gain.setTargetAtTime(0, t, 0.1);
          X.prev.delete(s);
          continue;
        }
        const dx = s.x - pl.x,
          dy = s.y - pl.y,
          d = Math.hypot(dx, dy);
        const last = X.prev.get(s);
        X.prev.set(s, d);
        let closing = 0;
        if (last != null && dt > 0 && ts > 0.05) closing = clamp((last - d) / (dt * ts), -400, 400);
        const ssp = clamp((s.speed || 0) / 300, 0, 1.4);
        const dop = 1 + clamp(closing / 900, -0.3, 0.3);
        const f = r.base * (0.8 + 1.5 * ssp) * dop;
        const att = 1 / (1 + (d / 34) * (d / 34));
        const gain = d > 420 ? 0 : 0.16 * att * (0.35 + 0.65 * ssp);
        r.o1.frequency.setTargetAtTime(f, t, 0.05);
        r.o2.frequency.setTargetAtTime(f * 0.5, t, 0.05);
        r.lp.frequency.setTargetAtTime(420 + 1700 * ssp * dop, t, 0.08);
        r.nb.frequency.setTargetAtTime((900 + 1800 * ssp) * dop, t, 0.08);
        r.g.gain.setTargetAtTime(gain, t, 0.06);
        r.pan.pan.setTargetAtTime(clamp(sideOf(pl, s) / 26, -1, 1), t, 0.05);
        // a fast close pass throws a whoosh
        r.whoosh -= dt;
        if (d < 26 && Math.abs(closing) > 55 && r.whoosh <= 0 && racing) {
          r.whoosh = 1.4;
          const pan = clamp(sideOf(pl, s) / 16, -1, 1);
          try {
            const n = burstNoise(t + 0.01, 0.42, "bandpass", closing > 0 ? 700 : 2400, closing > 0 ? 2600 : 600, 1.6, 0.26, pan, 0.4, 0.16);
            n.pan.pan.setValueAtTime(pan, t);
            n.pan.pan.linearRampToValueAtTime(-pan * 0.6, t + 0.42);
          } catch {}
        }
      }
    }
    for (; ri < MAX_RIVALS; ri++) X.rivals[ri].g.gain.setTargetAtTime(0, t, 0.1);
  }

  FZ.Sfx2 = { play, update, onEvent, raceStart, stop, get ready() { return X.ok; }, _x: X };
})();
