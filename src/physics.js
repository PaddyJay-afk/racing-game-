/* physics.js */
(function () {
  "use strict";
  const et = (window.FZ = window.FZ || {});
  et.KMH = 1.6;
  const a = {
      MAX_SUBSTEP: 1 / 120,
      TOP_SPEED: 300,
      ACCEL: 150,
      OVERSPEED_DECAY: 70,
      COAST_K: 0.22,
      COAST_C: 8,
      BRAKE: 280,
      REVERSE_MAX: 45,
      ROUGH_DRAG: 1.6,
      BOOST_SPEED: 380,
      BOOST_ACCEL: 240,
      BOOST_TIME: 2.5,
      BOOST_COST: 0.12,
      BOOST_MAX: 3,
      DASH_TIME: 1.5,
      STEER_RESP: 16,
      OMEGA_MAX: 2.25,
      OMEGA_LOW_V: 140,
      OMEGA_PIVOT: 0.3,
      OMEGA_HI_DROP: 0.34,
      LEAN_YAW: 0.75,
      GRIP: 11,
      GRIP_SPEED_LOSS: 0.3,
      LEAN_GRIP: 0.7,
      GRIP_MIN: 2.6,
      REDIRECT: 0.93,
      REDIRECT_LEAN: 0.86,
      HULL_R: 6.5,
      WALL_E: 0.35,
      WALL_FRICTION: 0.22,
      WALL_DMG: 0.1,
      WALL_INTENSITY_V: 300,
      WALL_MIN_BOUNCE: 30,
      SCRAPE_DRAIN: 0.035,
      SCRAPE_DRAG: 0.6,
      SHIP_R: 7,
      SHIP_E: 0.55,
      SHIP_DMG: 0.05,
      SHIP_DMG_AI: 0.35,
      SHIP_INTENSITY_V: 160,
      PIT_RATE: 0.3,
      LOW_ENERGY: 0.25,
      HOVER_Z: 4,
      BOB_AMP: 0.7,
      BOB_FREQ: 5.2,
      BANK_RESP: 8,
      CAM_HEIGHT: 26,
      CAM_DIST: 52,
      CAM_HORIZON: 0.36,
      CAM_FOV: 1.64,
      CAM_YAW_MAX: 5.5,
      CAM_YAW_RATE: 10,
      CAM_POS_RATE: 24,
      CAM_SLIP_FOLLOW: 0.25,
      CAM_BOOST_FOV: 0.12,
      CAM_BOOST_PULL: 9,
      CAM_SPEED_PULL: 0.012,
      CAM_SHAKE_DECAY: 9,
      CHECKPOINTS: 8,
      OVERTAKE_DEBOUNCE: 0.35,
      WRONGWAY_ON: 0.7,
      WRONGWAY_OFF: 0.35,
      AI_HZ: 0,
      AI_HZ_BIG: 60,
      AI_BIG_N: 8,
      AI_RUBBER_AHEAD: 0.08,
      AI_RUBBER_BEHIND: 0.04,
      AI_RUBBER_GAP: 900,
      AI_RUBBER_NEAR: 350,
      AI_YIELD_GAP: 70,
      ASSIST_DEFAULT: 0.6,
      ASSIST_YAW_HI: 1.5,
      ASSIST_YAW_V0: 110,
      ASSIST_YAW_V1: 300,
      ASSIST_GUIDE: 3,
      ASSIST_GUIDE_MAX: 1.4,
      ASSIST_SCRUB: 0.015,
      ASSIST_SOFTEN: 0.3,
      ASSIST_LINE_HOLD: 0.35,
      ASSIST_LINE_APEX: 0.5,
      ASSIST_WALL_E: 0.6,
      ASSIST_WALL_FRIC: 0.6,
      ASSIST_WALL_DMG: 0.4,
      ASSIST_GRIP_LOSS: 0.75,
      ASSIST_LEAN_GRIP: 0.6,
      ASSIST_GRIP: 0.35,
    },
    mt = {
      easy: { top: 0.9, corner: 0.89, rubAhead: 0.14, rubBehind: -0.02, rubGap: 700, aggr: 0, yield: 1 },
      normal: { top: 0.925, corner: 0.92, rubAhead: 0.12, rubBehind: 0, rubGap: 900, aggr: 0.3, yield: 0.6 },
      hard: { top: 0.975, corner: 0.97, rubAhead: 0.05, rubBehind: 0, rubGap: 900, aggr: 0.7, yield: 0 },
    },
    ne = () => et.SURF || { VOID: 0, ROAD: 1, WALL: 2, DASH: 3, PIT: 4, ROUGH: 5, START: 6 },
    rt = Math.PI * 2;
  function X(S) {
    return ((S = (S + Math.PI) % rt), S < 0 && (S += rt), S - Math.PI);
  }
  function R(S, u, m) {
    return S < u ? u : S > m ? m : S;
  }
  function nt(S, u) {
    return typeof S == "number" && isFinite(S) ? S : u;
  }
  function Et(S) {
    const u = Math.abs(S),
      m = a.OMEGA_PIVOT + (1 - a.OMEGA_PIVOT) * Math.min(1, u / a.OMEGA_LOW_V),
      d = 1 - a.OMEGA_HI_DROP * R((u - 100) / 280, 0, 1);
    return a.OMEGA_MAX * m * d;
  }
  const z = {
    top: { A: 1.07, B: 1.03, C: 1, D: 0.95, E: 0.9 },
    accel: { A: 1.3, B: 1.08, C: 1, D: 0.94, E: 0.82 },
    turn: { A: 1.12, B: 1.04, C: 1, D: 0.975, E: 0.91 },
    grip: { A: 1.2, B: 1.06, C: 1, D: 0.92, E: 0.82 },
    accelQ: { A: 2.8, B: 2.15, C: 2, D: 1.85, E: 1.7 },
    shield: { A: 0.6, B: 0.8, C: 1, D: 1.25, E: 1.5 },
    boostV: { A: 402, B: 386, C: 380, D: 375, E: 366 },
    boostT: { A: 3, B: 2.6, C: 2.5, D: 2.35, E: 2.2 },
  };
  ((a.GRADES = z), (a.MASS_REF = 1180));
  const ae = [
      { id: 0, name: "NOVA", stats: { shield: "B", accel: "B", top: "B", turn: "B", boost: "B" }, weight: 1180 },
      { id: 1, name: "KESTREL", stats: { shield: "D", accel: "C", top: "A", turn: "B", boost: "C" }, weight: 990 },
      { id: 2, name: "BRUTE", stats: { shield: "A", accel: "D", top: "B", turn: "D", boost: "B" }, weight: 1620 },
      { id: 3, name: "VEGA", stats: { shield: "C", accel: "B", top: "C", turn: "A", boost: "C" }, weight: 1060 },
      { id: 4, name: "HALCYON", stats: { shield: "C", accel: "A", top: "C", turn: "B", boost: "D" }, weight: 1010 },
      { id: 5, name: "ONYX", stats: { shield: "B", accel: "C", top: "B", turn: "C", boost: "A" }, weight: 1290 },
    ],
    ct = () => (et.SHIPS && et.SHIPS.length >= 6 ? et.SHIPS : ae),
    Tt = new Map();
  function Ht(S) {
    if (Tt.has(S)) return Tt.get(S);
    const u = S.stats || {},
      m = (C, v) => (C[u[v]] != null ? C[u[v]] : C.C),
      d = {
        top: m(z.top, "top"),
        accel: m(z.accel, "accel"),
        accelQ: m(z.accelQ, "accel"),
        turn: m(z.turn, "turn"),
        grip: m(z.grip, "turn"),
        dmg: m(z.shield, "shield"),
        boostV: m(z.boostV, "boost"),
        boostT: m(z.boostT, "boost"),
        mass: (S.weight || a.MASS_REF) / a.MASS_REF,
      };
    return (Tt.set(S, d), d);
  }
  const Gt = [
      { top: 1, corner: 0.98, brakeD: 230, line: 0.95, noise: 0, boostStraight: 330 },
      { top: 0.99, corner: 0.97, brakeD: 240, line: 1, margin: 2, noise: 0.14, boostStraight: 240, wallProne: !0 },
      { top: 1, corner: 0.97, brakeD: 360, line: 0.9, noise: 0.03, ram: !0, boostStraight: 300 },
      { top: 1, corner: 0.98, brakeD: 230, line: 1, noise: 0, boostStraight: 340 },
      { top: 1, corner: 0.96, brakeD: 215, line: 0.9, noise: 0.02, boostStraight: 380 },
      { top: 1, corner: 0.97, brakeD: 240, line: 0.8, noise: 0.02, block: !0, boostStraight: 320 },
    ],
    at = { top: 0.98, corner: 0.96, brakeD: 220, line: 0.9, noise: 0, boostStraight: 400 },
    oe = { top: 1, corner: 1.04, brakeD: 250, line: 1, margin: 4, noise: 0, boostStraight: 280 },
    ie = [3, 5, 4, 2, 1, 0],
    le = 23;
  function re(S, u) {
    let m = Math.imul(u + 1, 2654435761) ^ 2246822507;
    ((m = Math.imul(m ^ (m >>> 15), 739982445)), (m ^= m >>> 12));
    const d = (m & 1023) / 1023 - 0.5,
      C = ((m >>> 10) & 1023) / 1023 - 0.5,
      v = ((m >>> 20) & 1023) / 1023;
    return Object.assign({}, S, {
      top: (S.top || 1) * (1 + 0.016 * d),
      corner: (S.corner || 1) * (1 + 0.016 * C),
      brakeD: (S.brakeD || 220) * (1 + 0.1 * C),
      noise: (S.noise || 0) + 0.012 * v,
    });
  }
  function Nt(S, u) {
    return Et(S) * u.turn;
  }
  function ce(S, u) {
    u = u || {};
    const m = ne(),
      d = S.n,
      C = S.STEP,
      v = S.path,
      j = S.ang,
      Q = S.halfWidth,
      bt = S.size,
      se = S.surf,
      kt = S.length || d * C,
      N = !!u.demo,
      Wt = mt[u.difficulty] ? u.difficulty : "normal",
      U = mt[Wt],
      Vt = R(nt(u.assist, a.ASSIST_DEFAULT), 0, 1),
      xt = Math.max(1, u.laps | 0 || 5),
      yt = R(u.rivals == null ? 5 : u.rivals | 0, 0, le),
      Ft = S.grid ? S.grid.length : 0,
      fe = Math.max(Math.min(Ft, 6), yt + 1),
      Ut = R(u.playerIdx == null ? 3 : u.playerIdx | 0, 0, Math.max(0, Math.max(Ft, yt + 1) - 1));
    function _e(t) {
      if (S.grid && S.grid[t]) return S.grid[t];
      if (typeof S.gridSlot == "function") return S.gridSlot(t);
      const n = S.grid[S.grid.length - 1],
        e = 16 * (t - S.grid.length + 1);
      return { x: n.x - Math.cos(n.angle) * e, y: n.y - Math.sin(n.angle) * e, angle: n.angle };
    }
    let q = u.seed >>> 0 || 2654435769;
    function Yt() {
      return ((q ^= q << 13), (q >>>= 0), (q ^= q >>> 17), (q ^= q << 5), (q >>>= 0), q / 4294967296);
    }
    function ot(t, n) {
      const e = Math.floor(t),
        A = Math.floor(n);
      return e < 0 || A < 0 || e >= bt || A >= bt ? m.VOID : se[A * bt + e];
    }
    function ht(t, n) {
      const e = ot(t, n);
      return e === m.WALL || e === m.VOID;
    }
    const k = (t) => ((t % d) + d) % d,
      Be = (t) => v[2 * k(t)],
      He = (t) => v[2 * k(t) + 1],
      It = new Float32Array(d),
      Rt = new Float32Array(d),
      it = new Float32Array(d);
    for (let t = 0; t < d; t++) It[t] = X(j[k(t + 1)] - j[k(t - 1)]) / (2 * C);
    function Xt(t, n, e) {
      const A = 2 * e + 1,
        i = new Float64Array(A),
        f = new Float64Array(d + 2 * e);
      let s = 0;
      for (let p = -e; p <= e; p++) {
        const o = e + 1 - Math.abs(p);
        ((i[p + e] = o), (s += o));
      }
      for (let p = 0; p < d + 2 * e; p++) f[p] = t[k(p - e)];
      for (let p = 0; p < d; p++) {
        let o = 0;
        for (let l = 0; l < A; l++) o += f[p + l] * i[l];
        n[p] = o / s;
      }
    }
    (Xt(It, Rt, 5), Xt(It, it, 18));
    const st = new Float32Array(d).fill(NaN),
      lt = new Float32Array(d).fill(NaN);
    let Zt = 0;
    const Ot = new Uint8Array(d);
    {
      const n = (e, A) => {
        for (let i = Math.floor(e / C) - 16; i <= Math.ceil(A / C) + 16; i++) Ot[k(i)] = 1;
      };
      if (S.pit && S.dashes && typeof S.pit.a0 == "number") {
        n(S.pit.a0, S.pit.a1);
        for (let e = 0; e < S.dashes.length; e++) n(S.dashes[e].along, S.dashes[e].along + (S.dashes[e].len || 40));
      } else Ot.fill(1);
    }
    for (let t = 0; t < d; t++) {
      if (Ot[t] === 0) continue;
      const n = j[t],
        e = -Math.sin(n),
        A = Math.cos(n),
        i = Q[t];
      let f = 0,
        s = 0,
        p = 0,
        o = 0;
      for (let l = -i; l <= i; l += 2) {
        const r = ot(v[2 * t] + e * l, v[2 * t + 1] + A * l);
        r === m.PIT ? ((f += l), s++) : r === m.DASH && ((p += l), o++);
      }
      (s >= 3 && ((st[t] = f / s), Zt++), o >= 2 && (lt[t] = p / o));
    }
    const g = [],
      Kt = ct(),
      zt = R(nt(u.playerShip, 0) | 0, 0, Kt.length - 1);
    function jt(t, n, e, A, i) {
      const f = _e(e),
        s = t === 0 && !N,
        p = Kt[n],
        o = Ht(p);
      let l = s ? at : u.aiPers || Gt[n] || at;
      A > 0 && !s && !u.aiPers && (l = re(l, i));
      const r = N || s ? l : Object.assign({}, l, { top: l.top * U.top, corner: l.corner * U.corner }),
        c = {
          id: t,
          shipId: n,
          name: p.name,
          colorIdx: n,
          isPlayer: s,
          hd: o,
          assist: s ? Vt : 0,
          x: f.x,
          y: f.y,
          z: a.HOVER_Z,
          angle: f.angle,
          vx: 0,
          vy: 0,
          speed: 0,
          bank: 0,
          lean: 0,
          energy: 1,
          boosting: !1,
          boostTimer: 0,
          boostsAvailable: 0,
          lap: 0,
          progress: 0,
          lapTimes: [],
          lapStart: 0,
          finished: !1,
          finishTime: 0,
          place: t + 1,
          exploded: !1,
          hitTimer: 0,
          sparks: 0,
          inPit: !1,
          onDash: !1,
          wrongWay: !1,
          energyLow: !1,
          ai: !s,
          pers: r,
          mass: o.mass,
          idx: 0,
          lateral: 0,
          cp: 1,
          accum: 0,
          steerS: 0,
          yawRate: 0,
          topMul: 1,
          bobPhase: t * 1.7,
          bumpZ: 0,
          bumpV: 0,
          sparkT: 0,
          _rk: 0,
          wallHits: 0,
          shipHits: 0,
          boostsUsed: 0,
          scraping: !1,
          scrapeT: 0,
          stuckT: 0,
          maxStuck: 0,
          wwT: 0,
          avoid: 0,
          noiseV: 0,
          noiseT: 0,
          ramT: 0,
          hitCd: 0,
          dashCd: 0,
          lastSafeX: f.x,
          lastSafeY: f.y,
          ctl: { steer: 0, lean: 0, accel: !1, brake: !1, boost: !1 },
          env: null,
        },
        M = S.locate(c.x, c.y, -1);
      return ((c.idx = M.i), (c.lateral = M.lateral), (c.accum = (M.i > d / 2 ? M.i - d : M.i) * C), (c.progress = c.accum), c);
    }
    const Lt = [];
    for (let t = 0; t < fe; t++) t !== Ut && Lt.push(t);
    g.push(jt(0, zt, Ut, 0, 0));
    const Ct = ie.filter((t) => t !== zt);
    for (let t = 0; t < yt && t < Lt.length; t++) g.push(jt(g.length, Ct[t % Ct.length], Lt[t], (t / Ct.length) | 0, t));
    const O = g[0],
      Qt = new Map(),
      qt = new Map();
    function Pt(t, n) {
      const e = t.line || 1,
        A = t.corner || 1,
        i = t.brakeD || 220,
        f = e + "|" + A + "|" + i + "|" + n.turn + "|" + n.boostV;
      let s = Qt.get(f);
      if (s) return s;
      const p = e + "|" + n.turn;
      let o = qt.get(p);
      if (!o) {
        const r = new Float64Array(d);
        for (let c = 0; c < d; c++) {
          const L = 1 / Math.max(Math.abs(Rt[c]), 1e-5) + (Q[c] - a.HULL_R - 6) * 1.1 * e;
          let T = 300;
          for (let x = 0; x < 6; x++) T = (Et(T) * 0.92 + a.LEAN_YAW * 0.85) * n.turn * L;
          r[c] = T;
        }
        ((o = r), qt.set(p, o));
      }
      s = new Float32Array(d);
      const l = n.boostV + 20;
      for (let r = 0; r < d; r++) s[r] = Math.min(l, o[r] * A);
      for (let r = 0; r < 2; r++)
        for (let c = d - 1; c >= 0; c--) {
          const M = s[k(c + 1)],
            L = Math.sqrt(M * M + 2 * i * C);
          L < s[c] && (s[c] = L);
        }
      return (Qt.set(f, s), s);
    }
    const Jt = new Float32Array(d);
    {
      let t = 0;
      for (let n = 0; n < 2; n++) for (let e = d - 1; e >= 0; e--) ((t = Math.abs(Rt[e]) < 1 / 700 ? t + 1 : 0), (Jt[e] = t * C));
    }
    for (let t = 0; t < g.length; t++) g[t].env = Pt(g[t].pers, g[t].hd);
    function Ae(t) {
      ((O.ai = !0), (O.pers = t || at), (O.env = Pt(O.pers, O.hd)));
    }
    const _ = {
        phase: "countdown",
        countdown: 3,
        raceTime: 0,
        laps: xt,
        ships: g,
        player: O,
        events: [],
        demo: N,
        track: S,
        time: 0,
        difficulty: Wt,
        assist: Vt,
        tuning: a,
        camera: De,
        standings: Oe,
        update: we,
        setAutopilot: Ae,
        _cnLast: 4,
        _placeCand: 0,
        _placeT: 0,
        _placeShown: 0,
        _cam: null,
        _shake: 0,
        _boostCam: 0,
        stats: { maxStuck: 0, nan: 0 },
      },
      $t = u.aiHz != null ? +u.aiHz : g.length > a.AI_BIG_N ? a.AI_HZ_BIG : a.AI_HZ,
      te = $t > 0 ? 1 / $t - 1e-9 : 0;
    let ft = te;
    const b = (t, n) => {
        const e = n || {};
        ((e.type = t), _.events.push(e));
      },
      B = (t) => t === O,
      Se = { steer: 0, lean: 0, accel: !1, brake: !1, boost: !1 };
    function pe(t, n) {
      const e = t.ctl,
        A = t.pers,
        i = t.speed,
        f = t.idx,
        s = Q[f],
        p = 34 + i * 0.3,
        o = k(f + Math.round(p / C)),
        l = a.HULL_R + (A.margin == null ? 7 : A.margin),
        r = Math.max(0, Q[o] - l);
      let c = Math.tanh(it[o] * 260) * r * (A.line || 1) * 0.9;
      for (let y = 4; y < 40; y += 4) {
        const E = k(f + y);
        if (lt[E] === lt[E] && Math.abs(lt[E] - t.lateral) < 40 && !t.boosting) {
          c = lt[E];
          break;
        }
      }
      if (t.energy < 0.5 && Zt)
        for (let y = 0; y < 70; y += 5) {
          const E = k(f + y);
          if (st[E] === st[E]) {
            c = st[E];
            break;
          }
        }
      if (A.block && !N && !O.exploded && O !== t && U.aggr > 0) {
        const y = t.progress - O.progress,
          E = 0.75 * U.aggr;
        y > 8 && y < 170 && (c = c * (1 - E) + O.lateral * E);
      }
      t.ramT -= n;
      let M = null;
      if (A.ram) {
        for (let y = 0; y < g.length; y++) {
          const E = g[y];
          if (E === t || E.exploded || (E === O && !N && (U.aggr <= 0 || (U.aggr < 1 && t.ramT > -2.5 / U.aggr)))) continue;
          const Mt = E.progress - t.progress;
          if (Mt > -12 && Mt < 45 && Math.abs(E.lateral - t.lateral) < 40) {
            M = E;
            break;
          }
        }
        (M && t.ramT < -2.5 && (t.ramT = 1.1), M && t.ramT > 0 && (c = M.lateral));
      }
      if (!N && U.yield > 0 && !O.exploded && O !== t && !A.block) {
        const y = t.progress - O.progress;
        if (y > 0 && y < a.AI_YIELD_GAP && O.speed > t.speed - 10 && Math.abs(O.lateral - t.lateral) < 26) {
          const E = O.lateral > t.lateral ? -1 : 1;
          c += E * 24 * U.yield * (1 - y / a.AI_YIELD_GAP);
        }
      }
      let L = 0;
      const T = Math.cos(t.angle),
        x = Math.sin(t.angle);
      for (let y = 0; y < g.length; y++) {
        const E = g[y];
        if (E === t || E.exploded || (M === E && t.ramT > 0)) continue;
        const Mt = E.x - t.x,
          ve = E.y - t.y,
          dt = Mt * T + ve * x;
        if (dt < -4 || dt > 75) continue;
        const Bt = E.lateral - t.lateral;
        if (Math.abs(Bt) > 20 || (t.speed - E.speed < -20 && dt > 25)) continue;
        let ut = Bt > 0 ? -1 : 1;
        (Math.abs(t.lateral + ut * 20) > s - l && (ut = -ut), (L += ut * (22 - Math.abs(Bt)) * (1 - dt / 90)));
      }
      ((t.avoid += (L - t.avoid) * Math.min(1, n * 5)), (c = R(c + t.avoid, -r, r)));
      const P = j[o],
        Z = v[2 * o] - Math.sin(P) * c,
        H = v[2 * o + 1] + Math.cos(P) * c,
        w = i > 30 ? Math.atan2(t.vy, t.vx) : t.angle,
        I = X(Math.atan2(H - t.y, Z - t.x) - w),
        V = Math.max(10, Math.hypot(Z - t.x, H - t.y));
      let W = ((2 * Math.sin(I)) / V) * Math.max(i, 40);
      ((W += X(w - t.angle) * 1.2),
        Math.abs(I) > 1.4 && (W = Math.sign(I) * 9),
        (t.noiseT -= n),
        t.noiseT <= 0 && ((t.noiseT = 0.3 + Yt() * 0.5), (t.noiseV = (Yt() * 2 - 1) * (A.noise || 0))));
      const h = Nt(i, t.hd);
      let F = W / h + t.noiseV,
        G = 0;
      (Math.abs(F) > 1 && i > 90 && ((G = Math.sign(F)), (F = Math.sign(F) * R((Math.abs(W) - a.LEAN_YAW * t.hd.turn) / h, 0, 1))),
        (e.steer = R(F, -1, 1)),
        (e.lean = G));
      const K = Math.round((i * 0.12 + 8) / C),
        D = t.env;
      let J = Math.min(D[k(f + K)], D[f] + 25);
      return (
        (J *= t.topMul),
        A.wallProne && t.energy > 0.5 && (J *= 1.02),
        (e.accel = i < J + 4),
        (e.brake = i > J + 22),
        (e.boost = !1),
        t.boostsAvailable > 0 &&
          !t.boosting &&
          _.phase !== "countdown" &&
          i > 200 &&
          Jt[f] > (A.boostStraight || 320) &&
          t.energy > 0.35 + a.BOOST_COST &&
          (e.boost = !0),
        t.stuckT > 0.8 && ((e.accel = !0), (e.brake = !1), (e.lean = 0)),
        e
      );
    }
    function ee(t) {
      t.exploded ||
        ((t.exploded = !0),
        (t.vx = t.vy = 0),
        (t.speed = 0),
        (t.boosting = !1),
        (t.boostTimer = 0),
        (t.z = 0),
        (t.sparks = 0),
        (t.energy = 0),
        b("explode", { ship: t.id, x: t.x, y: t.y }),
        B(t) &&
          ((_._shake = Math.max(_._shake, 7)),
          _._scrapeOn && ((_._scrapeOn = !1), b("scrape", { on: !1 })),
          t.inPit && b("pit", { on: !1 }),
          t.energyLow && b("lowEnergy", { on: !1 }),
          t.wrongWay && b("wrongWay", { on: !1 }),
          !N && t.isPlayer && _.phase === "racing" && ((_.phase = "retired"), b("retired"))));
    }
    const _t = (t) => (t.ai ? 0 : t.assist);
    function Dt(t, n) {
      if (t.energy <= 0) {
        ee(t);
        return;
      }
      t.energy = Math.max(0, t.energy - n * t.hd.dmg * (1 - a.ASSIST_WALL_DMG * _t(t)));
    }
    const At = 8,
      wt = [],
      vt = [];
    for (let t = 0; t < At; t++) (wt.push(Math.cos((t * rt) / At)), vt.push(Math.sin((t * rt) / At)));
    const St = { nx: 0, ny: 0, count: 0 };
    function pt(t, n) {
      let e = 0,
        A = 0,
        i = 0;
      const f = a.HULL_R;
      for (let s = 0; s < At; s++) ht(t + wt[s] * f, n + vt[s] * f) && ((e -= wt[s]), (A -= vt[s]), i++);
      return (ht(t, n) && (i += 2), (St.nx = e), (St.ny = A), (St.count = i), St);
    }
    const ge = { i: 0, lateral: 0, along: 0 },
      Me = { i: 0, lateral: 0, along: 0 },
      de = { i: 0, lateral: 0, along: 0 },
      ue = { nx: 0, ny: 0, count: 0 },
      me = a.HULL_R + 12;
    function Ee(t, n) {
      let e = Math.abs(t.lateral) < Q[t.idx] - me ? ue : pt(t.x, t.y);
      if (e.count === 0) {
        (t.scraping && ((t.scrapeT -= n), t.scrapeT <= 0 && (t.scraping = !1)),
          t.sparkT > 0 && (t.sparkT -= n),
          !t.scraping && t.sparkT <= 0 && (t.sparks = 0),
          (t.lastSafeX = t.x),
          (t.lastSafeY = t.y));
        return;
      }
      const A = S.locate(t.x, t.y, t.idx, ge),
        i = j[A.i],
        f = -Math.sin(i),
        s = Math.cos(i),
        p = A.lateral >= 0 ? 1 : -1,
        o = -p * f,
        l = -p * s;
      let r = e.nx,
        c = e.ny,
        M = Math.hypot(r, c);
      const L = Math.abs(A.lateral) > Q[A.i] - a.HULL_R - 4;
      M < 0.001
        ? ((r = o), (c = l))
        : ((r /= M),
          (c /= M),
          L && r * o + c * l > 0.2 && ((r = r * 0.3 + o * 0.7), (c = c * 0.3 + l * 0.7), (M = Math.hypot(r, c)), (r /= M), (c /= M)));
      let T = 0;
      for (; T < 28 && pt(t.x, t.y).count > 0;) ((t.x += r * 0.6), (t.y += c * 0.6), T++);
      if (pt(t.x, t.y).count > 0) {
        const I = S.locate(t.x, t.y, t.idx, Me),
          V = j[I.i],
          W = Q[I.i],
          h = R(I.lateral, -(W - a.HULL_R - 2), W - a.HULL_R - 2);
        ((t.x = v[2 * I.i] - Math.sin(V) * h),
          (t.y = v[2 * I.i + 1] + Math.cos(V) * h),
          pt(t.x, t.y).count > 0 && ((t.x = t.lastSafeX), (t.y = t.lastSafeY)));
      }
      const x = t.vx * r + t.vy * c,
        P = Math.hypot(t.vx, t.vy),
        Z = -Math.sin(t.angle),
        H = Math.cos(t.angle);
      ((t.sparks = -r * Z - c * H > 0 ? 1 : -1), (t.sparkT = 0.1));
      const w = _t(t);
      if (x < 0) {
        const I = R(-x / a.WALL_INTENSITY_V, 0, 1),
          V = t.vx - x * r,
          W = t.vy - x * c,
          h = 1 - a.WALL_FRICTION * (1 - a.ASSIST_WALL_FRIC * w) * Math.min(1, I * 2.2),
          F = 1 - a.ASSIST_WALL_E * w;
        let G = -x * a.WALL_E * F;
        const K = I > 0.12;
        if ((K && (G = Math.max(G, Math.min(a.WALL_MIN_BOUNCE * F, P * 0.5))), (t.vx = V * h + r * G), (t.vy = W * h + c * G), K)) {
          let D = -c,
            J = r;
          D * Math.cos(t.angle) + J * Math.sin(t.angle) < 0 && ((D = -D), (J = -J));
          const y = 0.25 * (1 - 0.6 * w),
            E = Math.atan2(J + c * y, D + r * y);
          ((t.angle = X(t.angle + X(E - t.angle) * Math.min(1, 0.3 + I + 0.5 * w))),
            w > 0 && (t.steerS *= 1 - 0.5 * w),
            t.hitCd <= 0 &&
              (t.wallHits++,
              (t.hitTimer = 0.35),
              (t.hitCd = 0.18),
              (t.bumpV -= 18 * I),
              Dt(t, a.WALL_DMG * I),
              B(t) && (t.finished || b("wallHit", { intensity: I }), (_._shake = Math.max(_._shake, 2 + 5 * I)))));
        } else {
          ((t.scraping = !0),
            (t.scrapeT = 0.12),
            t.energy <= 0 ? ee(t) : (t.energy = Math.max(0, t.energy - a.SCRAPE_DRAIN * t.hd.dmg * (1 - a.ASSIST_WALL_DMG * w) * n)));
          const D = Math.exp(-a.SCRAPE_DRAG * n);
          ((t.vx *= D), (t.vy *= D));
        }
      } else
        ((t.scraping = !0),
          (t.scrapeT = 0.12),
          (t.energy = Math.max(0, t.energy - a.SCRAPE_DRAIN * t.hd.dmg * (1 - a.ASSIST_WALL_DMG * w) * n * 0.5)));
    }
    function Te() {
      const t = a.SHIP_R * 2;
      for (let n = 0; n < g.length; n++) {
        const e = g[n];
        if (!e.exploded)
          for (let A = n + 1; A < g.length; A++) {
            const i = g[A];
            if (i.exploded) continue;
            let f = i.x - e.x,
              s = i.y - e.y;
            const p = f * f + s * s;
            if (p >= t * t) continue;
            let o = Math.sqrt(p);
            o < 1e-4 ? ((f = 1), (s = 0), (o = 1e-4)) : ((f /= o), (s /= o));
            const l = 1 / e.mass,
              r = 1 / i.mass,
              c = l + r,
              M = t - o;
            ((e.x -= (f * M * l) / c), (e.y -= (s * M * l) / c), (i.x += (f * M * r) / c), (i.y += (s * M * r) / c));
            const L = (i.vx - e.vx) * f + (i.vy - e.vy) * s;
            if (L < 0) {
              const T = (-(1 + a.SHIP_E) * L) / c;
              ((e.vx -= T * l * f), (e.vy -= T * l * s), (i.vx += T * r * f), (i.vy += T * r * s));
              const x = R(-L / a.SHIP_INTENSITY_V, 0, 1);
              if (x > 0.08) {
                const P = e.ai && i.ai && !B(e) && !B(i) ? a.SHIP_DMG_AI : 1;
                (e.hitCd <= 0 &&
                  (Dt(e, (a.SHIP_DMG * P * x * i.mass) / e.mass), (e.hitTimer = 0.3), (e.hitCd = 0.15), e.shipHits++, (e.bumpV -= 10 * x)),
                  i.hitCd <= 0 &&
                    (Dt(i, (a.SHIP_DMG * P * x * e.mass) / i.mass),
                    (i.hitTimer = 0.3),
                    (i.hitCd = 0.15),
                    i.shipHits++,
                    (i.bumpV -= 10 * x)),
                  (B(e) || B(i)) &&
                    ((B(e) ? e : i).finished || b("shipHit", { intensity: x, other: B(e) ? i.id : e.id }),
                    (_._shake = Math.max(_._shake, 1.5 + 4 * x))));
              }
            }
          }
      }
    }
    function be(t, n, e, A, i) {
      const f = t.steerS,
        s = Math.abs(f),
        p = R((e - a.ASSIST_YAW_V0) / (a.ASSIST_YAW_V1 - a.ASSIST_YAW_V0), 0, 1),
        o = Math.max(s * s, i ? Math.min(1, s + 0.5) : 0);
      n *= 1 + A * a.ASSIST_YAW_HI * p * o;
      const l = t.idx;
      if (Math.abs(t.lateral) > Q[l] + 2) return n;
      const r = 30 + e * 0.32,
        c = k(l + Math.round(r / C)),
        M = it[c] + it[k(l + Math.round((r * 0.5) / C))],
        L = f + (i || 0) * 0.6;
      if (Math.abs(M) < 1 / 3e3 || L * M <= 0) return n;
      const T = A * R((Math.abs(L) - 0.1) / 0.3, 0, 1);
      if (T <= 0) return n;
      const x = Math.max(0, Q[c] - a.HULL_R - 10),
        P = R(t.lateral * a.ASSIST_LINE_HOLD + Math.tanh(it[c] * 200) * x * a.ASSIST_LINE_APEX, -x, x),
        Z = j[c],
        H = v[2 * c] - Math.sin(Z) * P,
        w = v[2 * c + 1] + Math.cos(Z) * P,
        I = Math.atan2(t.vy, t.vx),
        V = X(Math.atan2(w - t.y, H - t.x) - I),
        W = Math.max(10, Math.hypot(H - t.x, w - t.y)),
        h = ((2 * Math.sin(V)) / W) * e + X(I - t.angle) * 1,
        F = a.ASSIST_GUIDE_MAX * t.hd.turn * t.hd.turn;
      let G = R((h - n) * a.ASSIST_GUIDE, -F, F) * T;
      if (G * L < 0) {
        const K = Math.abs(n) * a.ASSIST_SOFTEN * T;
        G = R(G, -K, K);
      }
      return n + G;
    }
    function xe(t, n, e, A) {
      if (t.exploded) return;
      const i = Math.cos(t.angle),
        f = Math.sin(t.angle),
        s = -f,
        p = i;
      let o = t.vx * i + t.vy * f,
        l = t.vx * s + t.vy * p;
      const r = R(nt(n.steer, 0), -1, 1),
        c = n.lean > 0.5 ? 1 : n.lean < -0.5 ? -1 : 0;
      ((t.lean = c), (t.steerS += (r - t.steerS) * Math.min(1, e * a.STEER_RESP)));
      const M = Math.hypot(t.vx, t.vy),
        L = ot(t.x, t.y);
      if (A) ((t.vx = t.vy = 0), (t.yawRate = 0));
      else {
        const T = t.hd,
          x = _t(t);
        let P = t.steerS * Nt(M, T);
        c && (P += c * a.LEAN_YAW * T.turn * Math.min(1, M / 120));
        let Z = 0;
        if (x > 0 && o > 0) {
          const D = P;
          ((P = be(t, P, M, x, c)), (Z = Math.max(0, Math.abs(P) - Math.abs(D))));
        }
        (o < -1 && (P = -P * 0.6), (t.yawRate = P), (t.angle = X(t.angle + P * e)));
        const H = a.TOP_SPEED * T.top * t.topMul;
        if (t.boostTimer > 0) {
          const D = T.boostV * Math.max(1, t.topMul);
          o < D && (o = Math.min(D, o + a.BOOST_ACCEL * e));
        } else if (n.accel && !n.brake)
          if (o < H) {
            const D = Math.max(0, o) / H;
            ((o += a.ACCEL * T.accel * (1 - Math.pow(D, T.accelQ)) * e), o > H && (o = H));
          } else o = Math.max(H, o - a.OVERSPEED_DECAY * e);
        else {
          const D = (a.COAST_K * Math.abs(o) + a.COAST_C) * e;
          ((o = o > 0 ? Math.max(0, o - D) : Math.min(0, o + D)), o > H && (o = Math.max(H, o - a.OVERSPEED_DECAY * e)));
        }
        (n.brake &&
          t.boostTimer <= 0 &&
          (o > 2 ? (o = Math.max(0, o - a.BRAKE * e)) : n.accel || (o = Math.max(-a.REVERSE_MAX, o - a.BRAKE * 0.25 * e))),
          L === m.ROUGH && (o -= o * a.ROUGH_DRAG * e),
          Z > 0 && o > 0 && (o = Math.max(0, o - a.ASSIST_SCRUB * Z * o * e)));
        const w = Math.min(1.3, M / a.TOP_SPEED),
          I = _t(t);
        let V = a.GRIP * T.grip * (1 + a.ASSIST_GRIP * I) * (1 - a.GRIP_SPEED_LOSS * (1 - a.ASSIST_GRIP_LOSS * I) * w * Math.abs(t.steerS));
        (c && (V *= a.LEAN_GRIP + (1 - a.LEAN_GRIP) * a.ASSIST_LEAN_GRIP * I), V < a.GRIP_MIN * T.grip && (V = a.GRIP_MIN * T.grip));
        const W = Math.exp(-V * e),
          h = Math.sqrt(o * o + l * l),
          F = Math.abs(l) * (1 - W);
        l *= W;
        const G = Math.max(0, h - F * (1 - (c ? a.REDIRECT_LEAN : a.REDIRECT))),
          K = G * G - l * l;
        (K > o * o && (o = (o >= 0 ? 1 : -1) * Math.sqrt(K)), (t.vx = i * o + s * l), (t.vy = f * o + p * l));
      }
      ((t.x += t.vx * e),
        (t.y += t.vy * e),
        t.boostTimer > 0 && ((t.boostTimer -= e), t.boostTimer <= 0 && (t.boostTimer = 0)),
        (t.boosting = t.boostTimer > 0),
        t.hitTimer > 0 && (t.hitTimer = Math.max(0, t.hitTimer - e)),
        t.hitCd > 0 && (t.hitCd -= e),
        t.dashCd > 0 && (t.dashCd -= e));
    }
    function ye(t, n) {
      if (t.exploded) return;
      const e = ot(t.x, t.y),
        A = e === m.PIT;
      (A !== t.inPit && ((t.inPit = A), B(t) && !t.finished && b("pit", { on: A })),
        A && _.phase !== "countdown" && (t.energy = Math.min(1, t.energy + a.PIT_RATE * n)));
      let i = e === m.DASH;
      if (!i) {
        const L = Math.cos(t.angle) * 4,
          T = Math.sin(t.angle) * 4;
        i = ot(t.x + L, t.y + T) === m.DASH;
      }
      (i &&
        !t.onDash &&
        t.dashCd <= 0 &&
        _.phase !== "countdown" &&
        ((t.boostTimer = Math.max(t.boostTimer, a.DASH_TIME)), (t.boosting = !0), (t.dashCd = 0.5), (t.bumpV += 12), B(t) && b("dash")),
        (t.onDash = i));
      const f = t.energyLow ? t.energy < a.LOW_ENERGY + 0.02 : t.energy < a.LOW_ENERGY;
      (f !== t.energyLow && ((t.energyLow = f), B(t) && !t.finished && b("lowEnergy", { on: f })),
        (t.bumpV += (-t.bumpZ * 120 - t.bumpV * 9) * n),
        (t.bumpZ += t.bumpV * n),
        (t.bumpZ = R(t.bumpZ, -3, 3)),
        (t.z = a.HOVER_Z + Math.sin(_.time * a.BOB_FREQ + t.bobPhase) * a.BOB_AMP * (1 - Math.min(0.6, t.speed / 600)) + t.bumpZ));
      const s = Math.hypot(t.vx, t.vy);
      t.speed = s;
      const p = -Math.sin(t.angle),
        o = Math.cos(t.angle),
        l = t.vx * p + t.vy * o,
        r = R((t.steerS * 0.75 + t.lean * 0.35) * Math.min(1, s / 80) - (l / Math.max(s, 60)) * 0.8, -1, 1);
      t.bank += (r - t.bank) * Math.min(1, n * a.BANK_RESP);
      const c = S.locate(t.x, t.y, t.idx, de);
      let M = c.i - t.idx;
      (M > d / 2 ? (M -= d) : M < -d / 2 && (M += d),
        (M = R(M, -40, 40)),
        (t.idx = c.i),
        (t.lateral = c.lateral),
        (t.accum += M * C),
        (t.progress = t.accum));
    }
    function Ie(t, n) {
      if (t.exploded) return;
      const e = a.CHECKPOINTS;
      if (t.cp < e) {
        const p = Math.floor((t.cp * d) / e),
          o = t.accum - t.lap * kt,
          l = k(t.idx - p);
        o >= p * C - 80 && l < 60 && t.cp++;
      }
      if (t.cp >= e && t.accum >= (t.lap + 1) * kt && !t.finished) {
        const p = _.raceTime;
        if ((t.lapTimes.push(p - t.lapStart), (t.lapStart = p), t.lap++, (t.cp = 1), t.lap >= xt))
          ((t.finished = !0),
            (t.finishTime = p),
            B(t) &&
              !N &&
              (gt(),
              (_.phase = "finished"),
              b("finish", { place: t.place, time: p }),
              (t.ai = !0),
              (t.pers = at),
              (t.env = Pt(at, t.hd)),
              _._scrapeOn && ((_._scrapeOn = !1), b("scrape", { on: !1 })),
              t.inPit && b("pit", { on: !1 }),
              t.energyLow && b("lowEnergy", { on: !1 }),
              t.wrongWay && ((t.wrongWay = !1), b("wrongWay", { on: !1 }))));
        else {
          const o = t.boostsAvailable;
          ((t.boostsAvailable = Math.min(a.BOOST_MAX, t.boostsAvailable + 1)),
            B(t) &&
              !t.finished &&
              (b("lap", { lap: t.lap, time: t.lapTimes[t.lapTimes.length - 1] }),
              t.lap === xt - 1 && b("finalLap"),
              t.boostsAvailable > o && b("boostReady", { count: t.boostsAvailable })));
        }
      }
      const A = j[t.idx],
        i = Math.cos(t.angle - A),
        f = t.vx * Math.cos(A) + t.vy * Math.sin(A),
        s = (i < -0.35 && t.speed > 25) || f < -60;
      (s !== t.wrongWay
        ? ((t.wwT += n),
          t.wwT >= (s ? a.WRONGWAY_ON : a.WRONGWAY_OFF) && ((t.wrongWay = s), (t.wwT = 0), B(t) && !t.finished && b("wrongWay", { on: s })))
        : (t.wwT = 0),
        _.phase !== "countdown" && t.speed < 30 ? ((t.stuckT += n), t.stuckT > t.maxStuck && (t.maxStuck = t.stuckT)) : (t.stuckT = 0));
    }
    function Re(t) {
      return t.finished ? 1e12 - t.finishTime : t.exploded ? -1e12 + t.progress : t.progress;
    }
    let Y = g.slice();
    function gt() {
      Y.length !== g.length && ((Y = g.slice()), ($ = new Float64Array(g.length)));
      const t = Y.length;
      for (let n = 0; n < t; n++) Y[n]._rk = Re(Y[n]);
      for (let n = 1; n < t; n++) {
        const e = Y[n],
          A = e._rk;
        let i = n - 1;
        for (; i >= 0;) {
          const f = Y[i],
            s = A - f._rk;
          if (s > 0 || (s === 0 && e.id < f.id)) ((Y[i + 1] = f), i--);
          else break;
        }
        Y[i + 1] = e;
      }
      for (let n = 0; n < t; n++) Y[n].place = n + 1;
      return Y;
    }
    function Oe() {
      return (gt(), Y.slice());
    }
    let $ = new Float64Array(g.length);
    function Le() {
      let t;
      if (!N && _.phase === "racing" && !O.exploded) t = O.progress;
      else {
        $.length < g.length && ($ = new Float64Array(g.length));
        let n = 0;
        for (let e = 0; e < g.length; e++) {
          const A = g[e];
          if (A.exploded) continue;
          const i = A.progress;
          let f = n - 1;
          for (; f >= 0 && $[f] > i;) (($[f + 1] = $[f]), f--);
          (($[f + 1] = i), n++);
        }
        t = n ? $[n >> 1] : 0;
      }
      for (let n = 0; n < g.length; n++) {
        const e = g[n];
        if (!e.ai) {
          e.topMul = 1;
          continue;
        }
        const A = e.progress - t,
          i = N ? 0 : a.AI_RUBBER_NEAR,
          f = Math.max(0, Math.abs(A) - i),
          s = N ? a.AI_RUBBER_GAP : U.rubGap || a.AI_RUBBER_GAP,
          p = R((A < 0 ? -f : f) / Math.max(100, s - i), -1, 1),
          o = N ? -p * (p > 0 ? a.AI_RUBBER_AHEAD : a.AI_RUBBER_BEHIND) : -p * (p > 0 ? U.rubAhead : U.rubBehind);
        e.topMul = (e.pers.top || 1) * (1 + o);
      }
    }
    function Ce() {
      const t = g[0];
      _._cam = { ax: t.x, ay: t.y, ang: t.angle };
    }
    function Pe(t) {
      const n = N ? g[0] : O,
        e = _._cam;
      let A = n.angle;
      if (n.speed > 60) {
        const f = Math.atan2(n.vy, n.vx);
        A = n.angle + X(f - n.angle) * a.CAM_SLIP_FOLLOW;
      }
      e.ang = X(e.ang + R(X(A - e.ang) * Math.min(1, t * a.CAM_YAW_RATE), -a.CAM_YAW_MAX * t, a.CAM_YAW_MAX * t));
      const i = Math.min(1, t * a.CAM_POS_RATE);
      ((e.ax += (n.x - e.ax) * i),
        (e.ay += (n.y - e.ay) * i),
        (_._boostCam += ((n.boosting ? 1 : 0) - _._boostCam) * Math.min(1, t * 4)),
        (_._shake = Math.max(0, _._shake - _._shake * a.CAM_SHAKE_DECAY * t - t)));
    }
    const tt = { x: 0, y: 0, angle: 0, height: a.CAM_HEIGHT, horizon: a.CAM_HORIZON, fov: a.CAM_FOV, shake: 0 };
    function De() {
      const t = _._cam,
        n = N ? g[0] : O,
        e = a.CAM_DIST + a.CAM_BOOST_PULL * _._boostCam + Math.min(400, n.speed) * a.CAM_SPEED_PULL;
      return (
        (tt.x = t.ax - Math.cos(t.ang) * e),
        (tt.y = t.ay - Math.sin(t.ang) * e),
        (tt.angle = t.ang),
        (tt.height = a.CAM_HEIGHT),
        (tt.horizon = a.CAM_HORIZON),
        (tt.fov = a.CAM_FOV + a.CAM_BOOST_FOV * _._boostCam),
        (tt.shake = _._shake),
        tt
      );
    }
    function we(t, n) {
      try {
        if (((t = nt(t, 0)), t <= 0)) return;
        if ((t > 0.1 && (t = 0.1), (n = n || Se), _.phase === "countdown")) {
          _.countdown -= t;
          const o = Math.ceil(_.countdown);
          (o < _._cnLast && o >= 1 && b("countdown", { n: o }),
            (_._cnLast = Math.min(_._cnLast, Math.max(o, 0))),
            _.countdown <= 0 && ((_.countdown = 0), (_.phase = "racing"), b("go")));
        }
        const e = _.phase === "countdown";
        ft += t;
        const A = ft >= te,
          i = ft;
        (A && (ft = 0), !e && A && Le());
        for (let o = 0; o < g.length; o++) {
          const l = g[o];
          if (!l.exploded) {
            if (l.ai) A && pe(l, i);
            else {
              const r = l.ctl;
              _.phase === "racing"
                ? ((r.steer = R(nt(n.steer, 0), -1, 1)),
                  (r.lean = nt(n.lean, 0)),
                  (r.accel = !!n.accel),
                  (r.brake = !!n.brake),
                  (r.boost = !!n.boost))
                : ((r.steer = 0), (r.lean = 0), (r.accel = !1), (r.brake = !1), (r.boost = !1));
            }
            (l.ctl.boost &&
              !e &&
              l.lap >= 1 &&
              l.boostsAvailable > 0 &&
              l.boostTimer <= 0 &&
              l.energy > a.BOOST_COST + 0.01 &&
              (l.boostsAvailable--,
              l.boostsUsed++,
              (l.energy -= a.BOOST_COST),
              (l.boostTimer = l.hd.boostT),
              (l.boosting = !0),
              (l.bumpV += 10),
              B(l) && b("boost")),
              (l.ctl.boost = !1));
          }
        }
        const f = Math.max(1, Math.ceil(t / a.MAX_SUBSTEP - 1e-6)),
          s = t / f;
        for (let o = 0; o < f; o++) {
          if (((_.time += s), !e && _.phase !== "countdown")) {
            let l = !1;
            for (let r = 0; r < g.length; r++) {
              const c = g[r];
              if (!c.finished && !c.exploded) {
                l = !0;
                break;
              }
            }
            l && (_.raceTime += s);
          }
          for (let l = 0; l < g.length; l++) xe(g[l], g[l].ctl, s, e);
          Te();
          for (let l = 0; l < g.length; l++) g[l].exploded || Ee(g[l], s);
          for (let l = 0; l < g.length; l++) {
            const r = g[l];
            (ye(r, s),
              (isFinite(r.x) && isFinite(r.y) && isFinite(r.vx) && isFinite(r.vy) && isFinite(r.angle)) ||
                (_.stats.nan++, (r.x = r.lastSafeX), (r.y = r.lastSafeY), (r.vx = r.vy = 0), (r.angle = j[r.idx] || 0), (r.speed = 0)));
          }
          Pe(s);
        }
        const p = O;
        if (p.exploded) _._scrapeOn && (_._scrapeOn = !1);
        else {
          const o = p.scraping && !e && !p.finished;
          o !== !!_._scrapeOn && ((_._scrapeOn = o), b("scrape", { on: o }));
        }
        if (!e) for (let o = 0; o < g.length; o++) Ie(g[o], t);
        (gt(),
          !e &&
            !p.finished &&
            !p.exploded &&
            (_._placeShown || ((_._placeShown = p.place), (_._placeCand = p.place)),
            p.place !== _._placeCand
              ? ((_._placeCand = p.place), (_._placeT = 0))
              : p.place !== _._placeShown &&
                ((_._placeT += t),
                _._placeT >= a.OVERTAKE_DEBOUNCE &&
                  (b("overtake", { place: p.place, gained: p.place < _._placeShown }), (_._placeShown = p.place)))));
        for (let o = 0; o < g.length; o++) g[o].maxStuck > _.stats.maxStuck && (_.stats.maxStuck = g[o].maxStuck);
      } catch (e) {
        if (!_._warned) {
          _._warned = !0;
          try {
            console.warn("[physics]", e);
          } catch {}
        }
      }
    }
    return (Ce(), gt(), _);
  }
  et.Game = {
    create: ce,
    TUNING: a,
    omegaAt: Et,
    handling: (S) => Ht(ct()[S] || ct()[0]),
    PERS: Gt,
    AUTOPILOT: at,
    PERFECT: oe,
    DIFFICULTY: mt,
    get ROSTER() {
      return ct().map((S) => S.name);
    },
  };
})();
