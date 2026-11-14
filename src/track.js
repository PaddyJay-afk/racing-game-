/* track.js */
(function () {
  "use strict";
  const L0 = (window.FZ = window.FZ || {});
  L0.SURF = { VOID: 0, ROAD: 1, WALL: 2, DASH: 3, PIT: 4, ROUGH: 5, START: 6 };
  const C0 = L0.SURF,
    v = 2048,
    $ = 11,
    It = v - 1,
    l0 = 4,
    b0 = 6,
    k0 = 16,
    z0 = 100,
    h0 = 32767,
    d0 = 72,
    P0 = 12,
    p0 = 20;
  function v0(s, t, c) {
    return 4278190080 | (c << 16) | (t << 8) | s;
  }
  function o(s) {
    return v0((s >> 16) & 255, (s >> 8) & 255, s & 255);
  }
  function i0(s, t, c) {
    const r = (s & 255) + ((t & 255) - (s & 255)) * c,
      d = ((s >> 8) & 255) + (((t >> 8) & 255) - ((s >> 8) & 255)) * c,
      f = ((s >> 16) & 255) + (((t >> 16) & 255) - ((s >> 16) & 255)) * c;
    return v0(r | 0, d | 0, f | 0);
  }
  function Z0(s) {
    return function () {
      ((s |= 0), (s = (s + 1831565813) | 0));
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      return ((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t), ((t ^ (t >>> 14)) >>> 0) / 4294967296);
    };
  }
  function T0(s, t) {
    let c = (Math.imul(s | 0, 374761393) + Math.imul(t | 0, 668265263)) | 0;
    return ((c = Math.imul(c ^ (c >>> 13), 1274126177)), ((c ^ (c >>> 16)) >>> 0) / 4294967296);
  }
  const _0 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((s) => (s + 0.5) / 16),
    G0 = [
      [420, 230],
      [680, 230],
      [940, 230],
      [1200, 230],
      [1450, 232],
      [1700, 270],
      [1840, 420],
      [1890, 680],
      [1850, 960],
      [1880, 1250],
      [1880, 1500],
      [1870, 1700],
      [1810, 1810],
      [1720, 1845],
      [1645, 1790],
      [1630, 1650],
      [1630, 1450],
      [1620, 1250],
      [1600, 1060],
      [1550, 880],
      [1440, 760],
      [1300, 730],
      [1170, 790],
      [1100, 900],
      [1130, 1e3],
      [1220, 1080],
      [1220, 1190],
      [1140, 1290],
      [1150, 1460],
      [1110, 1640],
      [960, 1760],
      [780, 1800],
      [560, 1810],
      [410, 1780],
      [320, 1680],
      [300, 1540],
      [380, 1420],
      [620, 1340],
      [770, 1180],
      [810, 980],
      [900, 790],
      [880, 580],
      [740, 470],
      [560, 520],
      [440, 700],
      [330, 765],
      [245, 655],
      [255, 480],
      [300, 330],
    ],
    Q0 = 1.03,
    V0 = [800, 230],
    J0 = [
      [1630, 1360],
      [720, 1803],
      [830, 1060],
    ],
    $0 = [0, -14, 12];
  function K0(s, t) {
    const c = s.length,
      r = [],
      d = (f, w) => Math.pow(Math.hypot(w[0] - f[0], w[1] - f[1]), 0.5);
    for (let f = 0; f < c; f++) {
      const w = s[(f - 1 + c) % c],
        D = s[f],
        P = s[(f + 1) % c],
        h = s[(f + 2) % c],
        a = 0,
        u = a + d(w, D),
        A = u + d(D, P),
        _ = A + d(P, h);
      for (let m = 0; m < t; m++) {
        const i = u + ((A - u) * m) / t,
          b = (e, l, S, C) => [((C - i) * e[0] + (i - S) * l[0]) / (C - S), ((C - i) * e[1] + (i - S) * l[1]) / (C - S)],
          p = b(w, D, a, u),
          x = b(D, P, u, A),
          k = b(P, h, A, _),
          M = b(p, x, a, A),
          g = b(x, k, u, _);
        r.push(b(M, g, u, A));
      }
    }
    return r;
  }
  const f0 = {
      water: o(727096),
      road0: o(2829898),
      road1: o(3224922),
      roadSeam: o(1908533),
      roadRivet: o(4870010),
      roadAlt0: o(2566724),
      roadAlt1: o(2961490),
      center: o(4608126),
      edgeW: o(15133951),
      edgeM: o(16727240),
      beamCore: o(16773816),
      beamA: o(16757800),
      beamB: o(16738832),
      beamUnder: o(10107408),
      beamTA: o(16053492),
      beamTB: o(15212604),
      beamTUnder: o(7999528),
      house: o(2758704),
      houseHi: o(6175334),
      glow: o(9060384),
      walk0: o(2038576),
      walk1: o(1512484),
      lamp: o(16767072),
      lampHalo: o(8018480),
      chkW: o(15921910),
      chkK: o(1447452),
      dashBase: o(993860),
      dashChev: o(4258047),
      dashTip: o(16777215),
      dashRim: o(16769088),
      pitSep: o(1840176),
      pitRim: o(16777215),
      slot: o(14212336),
      street: o(1184294),
      streetLine: o(2894920),
      plaza: o(1775920),
      plazaLine: o(2302268),
      trailR: o(16724040),
      trailRd: o(8001576),
      trailW: o(16773320),
      trailWd: o(6972528),
      quay: o(4867682),
      quayHi: o(7236232),
      bollard: o(16763968),
      plank0: o(6178872),
      plank1: o(4864044),
      plankGap: o(2760728),
      pierLamp: o(16773280),
    },
    tt = [o(16727240), o(3993855), o(16769088), o(6356848)],
    R0 = [2760509, 1913664, 2829125, 3809072, 2371658, 3353146, 2042410, 3879760].map(o),
    F0 = [16727240, 3993855, 16769088, 8191840, 16738864, 11563263].map(o),
    W0 = [15263984, 13687016, 16732240, 3981567, 16769136].map(o);
  function nt(s, t, c, r, d, f, w, D, P, h, a, u, A) {
    const _ = h - D,
      m = a - P,
      i = Math.sqrt(_ * _ + m * m) || 1,
      b = _ / i,
      p = m / i,
      x = -p,
      k = b,
      M = D - b * A,
      g = P - p * A,
      e = D + b * (i + A),
      l = P + p * (i + A);
    ((d[0] = M - x * u),
      (f[0] = g - k * u),
      (d[1] = M + x * u),
      (f[1] = g + k * u),
      (d[2] = e + x * u),
      (f[2] = l + k * u),
      (d[3] = e - x * u),
      (f[3] = l - k * u));
    let S = 1e9,
      C = -1e9;
    for (let R = 0; R < 4; R++) (f[R] < S && (S = f[R]), f[R] > C && (C = f[R]));
    const X = Math.max(0, Math.floor(S)),
      B = Math.min(v - 1, Math.ceil(C));
    for (let R = X; R <= B; R++) {
      const O = R + 0.5;
      let K = 1e9,
        Z = -1e9;
      for (let t0 = 0; t0 < 4; t0++) {
        const V = (t0 + 1) & 3,
          e0 = f[t0],
          U = f[V];
        if (e0 <= O != U <= O) {
          const H = d[t0] + ((d[V] - d[t0]) * (O - e0)) / (U - e0);
          (H < K && (K = H), H > Z && (Z = H));
        }
      }
      if (K > Z) continue;
      const n0 = Math.max(0, Math.ceil(K - 0.5)) | 0,
        j = Math.min(v - 1, Math.floor(Z - 0.5)) | 0;
      if (n0 > j) continue;
      (n0 < c[R] && (c[R] = n0), j > r[R] && (r[R] = j));
      const q = R << $,
        z = O - P;
      let G = (n0 + 0.5 - D) * x + z * k,
        c0 = (n0 + 0.5 - D) * b + z * p;
      for (let t0 = n0; t0 <= j; t0++, G += x, c0 += b) {
        const V = c0 < 0 ? -c0 : c0 > i ? c0 - i : 0,
          e0 = G < 0 ? -G : G,
          H = ((V === 0 ? e0 : Math.sqrt(e0 * e0 + V * V)) * z0 + 0.5) | 0,
          o0 = q | t0,
          s0 = t[o0];
        H < (s0 < 0 ? -s0 : s0) && ((t[o0] = G < 0 ? -H : H), (s[o0] = w));
      }
    }
  }
  function* et(s) {
    const { n: t, PX: c, PY: r, halfWidth: d, radius: f } = s,
      w = v * v,
      D = new Uint16Array(w),
      P = new Int16Array(w).fill(h0),
      h = new Int32Array(v).fill(v),
      a = new Int32Array(v).fill(-1),
      u = new Float64Array(4),
      A = new Float64Array(4);
    for (let _ = 0; _ < t; _++) {
      (_ & 31) === 0 && (yield _ / t);
      const m = _ + 1 === t ? 0 : _ + 1,
        i = Math.max(d[_], d[m]) + b0 + k0 + 2,
        b = 1 + (2.5 * i) / Math.max(40, f[_]);
      nt(D, P, h, a, u, A, _, c[_], r[_], c[m], r[m], i, b);
    }
    Object.assign(s, { fIdx: D, fLat: P, N2: w, rowMin: h, rowMax: a });
  }
  function* ot(s) {
    const { n: t, PX: c, PY: r, rnd: d } = s,
      f = 16,
      w = v / f,
      D = 300,
      P = new Float32Array(w * w).fill(D);
    for (let b = 0; b < t; b += 4) {
      (b & 255) === 0 && (yield (0.5 * b) / t);
      const p = c[b],
        x = r[b],
        k = Math.max(0, Math.floor((p - D) / f)),
        M = Math.min(w - 1, Math.floor((p + D) / f)),
        g = Math.max(0, Math.floor((x - D) / f)),
        e = Math.min(w - 1, Math.floor((x + D) / f));
      for (let l = g; l <= e; l++) {
        const S = (l + 0.5) * f - x;
        for (let C = k; C <= M; C++) {
          const X = (C + 0.5) * f - p,
            B = Math.sqrt(X * X + S * S),
            R = l * w + C;
          B < P[R] && (P[R] = B);
        }
      }
    }
    const h = new Uint8Array(w * w),
      a = [];
    for (let b = 0; b < w; b++) {
      (b & 15) === 0 && (yield 0.5 + (0.5 * b) / w);
      const p = (b + 0.5) * f;
      a.length = 0;
      for (let x = 0; x < t; x++) {
        const k = (x + 1) % t,
          M = r[x],
          g = r[k];
        M <= p != g <= p && a.push(c[x] + ((c[k] - c[x]) * (p - M)) / (g - M));
      }
      a.sort((x, k) => x - k);
      for (let x = 0; x + 1 < a.length; x += 2) {
        const k = Math.max(0, Math.ceil(a[x] / f - 0.5)),
          M = Math.min(w - 1, Math.floor(a[x + 1] / f - 0.5));
        for (let g = k; g <= M; g++) h[b * w + g] = 1;
      }
    }
    const u = 17,
      A = new Float32Array(u * u),
      _ = new Float32Array(1089);
    for (let b = 0; b < A.length; b++) A[b] = d() * 2 - 1;
    for (let b = 0; b < _.length; b++) _[b] = d() * 2 - 1;
    function m(b, p, x, k) {
      const M = Math.floor(x),
        g = Math.floor(k),
        e = x - M,
        l = k - g,
        S = e * e * (3 - 2 * e),
        C = l * l * (3 - 2 * l),
        X = b[g * p + M],
        B = b[g * p + M + 1],
        R = b[(g + 1) * p + M],
        O = b[(g + 1) * p + M + 1];
      return X + (B - X) * S + (R - X) * C + (X - B - R + O) * S * C;
    }
    const i = new Float32Array(w * w);
    for (let b = 0; b < w; b++)
      for (let p = 0; p < w; p++) {
        const x = 0.7 * m(A, u, p / 8, b / 8) + 0.3 * m(_, 33, p / 4, b / 4),
          k = b * w + p;
        i[k] = (h[k] ? 185 + 60 * x : 108 + 40 * x) - P[k];
      }
    Object.assign(s, { F: i, CN: w, CELL: f });
  }
  function at(s, t, c, r, d, f, w, D, P) {
    for (let h = 0; h < f; h++) c[h] = t[D + h] * (1 - P) + t[D + f + h] * P;
    for (let h = 0; h < v; h++) {
      const a = r[h],
        u = c[a];
      s[w | h] = u + (c[a + 1] - u) * d[h] > 0 ? 1 : 0;
    }
  }
  function* st(s) {
    const { F: t, CN: c, CELL: r, N2: d } = s,
      f = new Uint8Array(d),
      w = new Float32Array(c),
      D = new Float32Array(v),
      P = new Int32Array(v);
    for (let h = 0; h < v; h++) {
      const a = (h + 0.5) / r - 0.5,
        u = Math.max(0, Math.min(c - 2, Math.floor(a)));
      ((P[h] = u), (D[h] = Math.min(1, Math.max(0, a - u))));
    }
    for (let h = 0; h < v; h++) {
      (h & 7) === 0 && (yield h / v);
      const a = (h + 0.5) / r - 0.5,
        u = Math.max(0, Math.min(c - 2, Math.floor(a))),
        A = Math.min(1, Math.max(0, a - u));
      at(f, t, w, P, D, c, h << $, u * c, A);
    }
    Object.assign(s, { land: f });
  }
  const I0 = new Int32Array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]);
  function B0(s, t, c) {
    return s >= 14 ? 0 : s < 3 ? (c ? f0.trailR : f0.trailW) : t * 14 < (14 - s) * 16 ? (c ? f0.trailRd : f0.trailWd) : 0;
  }
  function ft(s, t, c, r, d) {
    const f = c << $,
      w = c + p0,
      D = w % d0,
      P = (w / d0) | 0,
      h = f0.water,
      a = f0.street,
      u = f0.streetLine,
      A = f0.plaza,
      _ = f0.plazaLine,
      m = (c & 3) << 2,
      i = D === 2 || D === 3 || D === 8 || D === 9,
      b = D < 6 ? 0 : 1,
      p = ((T0(P * 7 + b, 11) * 64) | 0) * 9;
    for (let x = 0; x < v; x++) {
      const k = f | x;
      if (t[k] === 0) {
        s[k] = h;
        continue;
      }
      const M = r[x];
      let g;
      if (D < P0) {
        if (((g = a), D === 5 || D === 6)) (x & 7) < 3 && (g = u);
        else if (i) {
          const e = ((((b ? x : -x) + p) % 40) + 40) % 40,
            l = B0(e, I0[m | (x & 3)], b === 0);
          l !== 0 && (g = l);
        }
      } else if (M < P0) {
        if (((g = a), M === 5 || M === 6)) (c & 7) < 3 && (g = u);
        else if (M === 2 || M === 3 || M === 8 || M === 9) {
          const e = M < 6 ? 0 : 1,
            l = ((T0(d[x] * 13 + e, 29) * 64) | 0) * 9,
            S = ((((e ? c : -c) + l) % 44) + 44) % 44,
            C = B0(S, I0[m | (x & 3)], e === 1);
          C !== 0 && (g = C);
        }
      } else g = (M & 7) === 0 || (D & 7) === 0 ? _ : A;
      s[k] = g;
    }
  }
  function* rt(s) {
    const { tex: t, land: c } = s,
      r = new Int32Array(v),
      d = new Int32Array(v);
    for (let f = 0; f < v; f++) ((r[f] = (f + p0) % d0), (d[f] = ((f + p0) / d0) | 0));
    for (let f = 0; f < v; f++) ((f & 7) === 0 && (yield f / v), ft(t, c, f, r, d));
  }
  function it(s, t, c) {
    const r = c << $,
      d = 3 * v,
      f = f0.quay,
      w = f0.quayHi,
      D = f0.bollard;
    for (let P = 3; P < v - 3; P++) {
      const h = r | P;
      if (t[h] !== 0 && (t[h - 3] === 0 || t[h + 3] === 0 || t[h - d] === 0 || t[h + d] === 0)) {
        const a = t[h - 1] === 0 || t[h + 1] === 0 || t[h - v] === 0 || t[h + v] === 0;
        s[h] = (P * 3 + c * 5) % 23 === 0 ? D : a ? w : f;
      }
    }
  }
  function* ct(s) {
    const { tex: t, land: c } = s;
    for (let r = 3; r < v - 3; r++) ((r & 7) === 0 && (yield r / v), it(t, c, r));
  }
  function* lt(s) {
    const { tex: t, land: c, fLat: r, rnd: d } = s;
    function f(P, h, a, u, A) {
      const _ = Math.max(0, P | 0),
        m = Math.max(0, h | 0),
        i = Math.min(v, (P + a) | 0),
        b = Math.min(v, (h + u) | 0);
      for (let p = m; p < b; p++) {
        const x = p << $;
        for (let k = _; k < i; k++) t[x | k] = A;
      }
    }
    function w(P, h, a, u) {
      for (let A = 0; A <= 2; A++)
        for (let _ = 0; _ <= 2; _++) {
          const m = Math.min(v - 1, Math.max(0, (P + (a * _) / 2) | 0)),
            b = (Math.min(v - 1, Math.max(0, (h + (u * A) / 2) | 0)) << $) | m;
          if (!c[b] || r[b] !== h0) return !1;
        }
      return !0;
    }
    function D(P, h, a, u) {
      const A = R0[(d() * R0.length) | 0],
        _ = i0(A, o(10518720), 0.35),
        m = i0(A, 4278190080, 0.45),
        i = o(657942),
        p = d() > 0.6 ? 5 : 3;
      (f(P + p, h + p, a, u, i), f(P, h, a, u, A), f(P, h, a, 2, _), f(P, h, 2, u, _), f(P, h + u - 2, a, 2, m), f(P + a - 2, h, 2, u, m));
      const x = i0(A, o(0), 0.18);
      for (let M = h + 3; M < h + u - 3; M++)
        for (let g = P + 3; g < P + a - 3; g++) ((g + M) & 1) === 0 && (M - h) % 6 === 0 && (t[(M << $) | g] = x);
      const k = d();
      if (k < 0.12 && a > 26 && u > 26) {
        const M = P + a / 2,
          g = h + u / 2,
          e = Math.min(a, u) / 2 - 5;
        for (let S = (g - e) | 0; S <= g + e; S++)
          for (let C = (M - e) | 0; C <= M + e; C++) {
            const X = Math.hypot(C + 0.5 - M, S + 0.5 - g);
            X < e && X > e - 2 ? (t[(S << $) | C] = o(16769088)) : X < e - 2 && (t[(S << $) | C] = o(2763320));
          }
        const l = Math.max(3, e * 0.5) | 0;
        (f(M - l, g - l, 2, l * 2, o(15790320)), f(M + l - 2, g - l, 2, l * 2, o(15790320)), f(M - l, g - 1, l * 2, 2, o(15790320)));
      } else if (k < 0.22) {
        f(P + 4, h + 4, a - 8, u - 8, o(1985074));
        for (let M = 0; M < (a * u) / 40; M++) f(P + 5 + d() * (a - 12), h + 5 + d() * (u - 12), 3, 3, o(3111496));
      } else {
        const M = 1 + ((d() * 4) | 0);
        for (let g = 0; g < M; g++) {
          const e = 4 + ((d() * 4) | 0),
            l = P + 4 + d() * Math.max(1, a - e - 8),
            S = h + 4 + d() * Math.max(1, u - e - 8);
          (f(l + 1, S + 1, e, e, i), f(l, S, e, e, o(6974080)), f(l + 1, S + 1, e - 2, e - 2, o(4868702)));
        }
        if (d() < 0.5) {
          const g = 2 + ((d() * 3) | 0),
            e = d() < 0.5 ? o(6351103) : o(16771232);
          for (let l = 0; l < g; l++) f(P + 5 + l * 6, h + u - 9, 3, 3, e);
        }
      }
      if (d() < 0.45) {
        const M = F0[(d() * F0.length) | 0],
          g = i0(M, 4278190080, 0.55),
          e = (d() * 4) | 0;
        if (e === 0 && a > 14) (f(P + 3, h - 1, a - 6, 5, g), f(P + 4, h, a - 8, 3, M));
        else if (e === 1 && u > 14) (f(P - 1, h + 3, 5, u - 6, g), f(P, h + 4, 3, u - 8, M));
        else if (a > 20 && u > 20) {
          const l = Math.min(a - 8, 30),
            S = 10,
            C = P + (((a - l) / 2) | 0),
            X = h + (((u - S) / 2) | 0);
          (f(C - 1, X - 1, l + 2, S + 2, g), f(C, X, l, S, o(1052700)));
          for (let B = C + 2; B < C + l - 3; B += 4) {
            const R = (d() * 512) | 0;
            for (let O = 0; O < 9; O++) R & (1 << O) && (t[((X + 2 + ((O / 3) | 0) * 2) << $) | (B + (O % 3))] = M);
          }
        }
      }
    }
    for (let P = 0; P * d0 - p0 < v; P++) {
      yield (P * d0) / v;
      for (let h = 0; h * d0 - p0 < v; h++) {
        const a = h * d0 - p0 + P0 + 3,
          u = P * d0 - p0 + P0 + 3,
          A = d0 - P0 - 6,
          _ = d(),
          m = [];
        if (_ < 0.3) m.push([a, u, A, A]);
        else if (_ < 0.6) {
          const i = 18 + ((d() * (A - 36)) | 0);
          m.push([a, u, i - 2, A], [a + i + 2, u, A - i - 2, A]);
        } else if (_ < 0.85) {
          const i = 18 + ((d() * (A - 36)) | 0);
          m.push([a, u, A, i - 2], [a, u + i + 2, A, A - i - 2]);
        } else {
          const i = (A / 2) | 0;
          m.push(
            [a, u, i - 2, i - 2],
            [a + i + 2, u, A - i - 2, i - 2],
            [a, u + i + 2, i - 2, A - i - 2],
            [a + i + 2, u + i + 2, A - i - 2, A - i - 2],
          );
        }
        for (const i of m) i[2] > 8 && i[3] > 8 && w(i[0] - 6, i[1] - 6, i[2] + 12, i[3] + 12) && D(i[0], i[1], i[2], i[3]);
      }
    }
  }
  function* ht(s) {
    const { tex: t, land: c, fLat: r, rnd: d, n: f, PX: w, PY: D, ang: P, halfWidth: h } = s;
    function a(m, i, b, p, x, k, M, g) {
      const e = -p,
        l = b,
        S = [
          [m + b * x - e * M, i + p * x - l * M],
          [m + b * k - e * M, i + p * k - l * M],
          [m + b * k + e * M, i + p * k + l * M],
          [m + b * x + e * M, i + p * x + l * M],
        ];
      let C = 1e9,
        X = -1e9,
        B = 1e9,
        R = -1e9;
      for (const O of S) ((C = Math.min(C, O[0])), (X = Math.max(X, O[0])), (B = Math.min(B, O[1])), (R = Math.max(R, O[1])));
      for (let O = Math.max(0, Math.floor(B)); O <= Math.min(v - 1, Math.ceil(R)); O++)
        for (let K = Math.max(0, Math.floor(C)); K <= Math.min(v - 1, Math.ceil(X)); K++) {
          const Z = K + 0.5 - m,
            n0 = O + 0.5 - i,
            j = Z * b + n0 * p,
            q = Z * e + n0 * l;
          if (j < x || j > k || q < -M || q > M) continue;
          const z = (O << $) | K;
          if (r[z] !== h0) continue;
          const G = g(j - x, q, z);
          G && (t[z] = G);
        }
    }
    function u(m, i, b, p, x, k) {
      const M = W0[(d() * W0.length) | 0],
        g = d() < 0.5 ? o(3820138) : o(2763322),
        e = F0[(d() * F0.length) | 0];
      a(m, i, b, p, -x / 2 - 1, x / 2 + 1, k / 2 + 1, (l, S) => {
        const C = (l - (x / 2 + 1)) / (x / 2 + 1),
          X = (k / 2) * Math.sqrt(Math.max(0, 1 - Math.max(0, C) ** 2 * 1)) * (C < -0.9 ? 0.85 : 1),
          B = Math.abs(S);
        return B > X + 1
          ? 0
          : B > X
            ? i0(e, 4278190080, 0.5)
            : B > X - 1
              ? i0(M, 4278190080, 0.3)
              : C > -0.55 && C < 0.15 && B < X - 1.5
                ? g
                : M;
      });
    }
    function A(m, i, b, p, x) {
      for (let k = 0; k < 60; k++) {
        const M = x / 2 + k * 1.2,
          g = k * 0.45;
        for (const e of [-1, 1]) {
          const l = Math.round(m - b * M - p * g * e),
            S = Math.round(i - p * M + b * g * e);
          if (l < 0 || S < 0 || l >= v || S >= v) continue;
          const C = (S << $) | l;
          c[C] || r[C] !== h0 || (_0[((S & 3) << 2) | (l & 3)] < 1 - k / 60 && (t[C] = k < 10 ? o(13164799) : o(5929648)));
        }
      }
    }
    const _ = 34;
    for (let m = 0; m < f; m += _) {
      yield (0.4 * m) / f;
      const i = -Math.sin(P[m]),
        b = Math.cos(P[m]);
      for (const p of [-1, 1]) {
        const x = h[m] + b0 + k0;
        let k = -1;
        for (let B = x + 2; B < x + 160; B += 2) {
          const R = Math.round(w[m] + i * B * p),
            O = Math.round(D[m] + b * B * p);
          if (R < 0 || O < 0 || R >= v || O >= v) break;
          if (!c[(O << $) | R]) {
            k = B;
            break;
          }
        }
        if (k < 0) continue;
        let M = !0;
        for (let B = k; B < k + 110; B += 4) {
          const R = Math.round(w[m] + i * B * p),
            O = Math.round(D[m] + b * B * p);
          if (R < 0 || O < 0 || R >= v || O >= v || c[(O << $) | R]) {
            M = !1;
            break;
          }
        }
        if (!M) continue;
        const g = 50 + d() * 45,
          e = i * p,
          l = b * p,
          S = w[m],
          C = D[m];
        a(S, C, e, l, k - 4, k + g, 5, (B, R) =>
          B > g && Math.abs(R) < 2
            ? f0.pierLamp
            : Math.abs(R) > 4.2 || (B | 0) % 3 === 0
              ? f0.plankGap
              : ((B / 3) | 0) & 1
                ? f0.plank0
                : f0.plank1,
        );
        const X = 1 + ((d() * 3) | 0);
        for (let B = 0; B < X; B++) {
          const R = k + 12 + B * 22 + d() * 6,
            O = (B & 1 ? 1 : -1) * 11;
          if (R > k + g) break;
          const K = S + e * R - l * O,
            Z = C + l * R + e * O;
          u(K, Z, e, l, 18 + d() * 6, 7);
        }
      }
    }
    for (let m = 0; m < 140; m++) {
      (m & 15) === 0 && (yield 0.4 + (0.5 * m) / 140);
      const i = 40 + d() * (v - 80),
        b = 40 + d() * (v - 80),
        p = ((b | 0) << $) | (i | 0);
      if (c[p] || r[p] !== h0) continue;
      let x = !0;
      for (let l = 0; l < 6.3; l += 0.8) {
        const S = (i + Math.cos(l) * 30) | 0,
          C = (b + Math.sin(l) * 30) | 0;
        (S < 0 || C < 0 || S >= v || C >= v || c[(C << $) | S] || r[(C << $) | S] !== h0) && (x = !1);
      }
      if (!x) continue;
      const k = d() * Math.PI * 2,
        M = Math.cos(k),
        g = Math.sin(k),
        e = 14 + d() * 16;
      (d() < 0.6 && A(i, b, M, g, e), u(i, b, M, g, e, 6 + e * 0.2));
    }
    for (let m = 0; m < 400; m++) {
      const i = (d() * (v - 4)) | 0,
        b = (d() * (v - 4)) | 0,
        p = (b << $) | i;
      if (c[p] || r[p] !== h0 || t[p] !== f0.water) continue;
      const x = d() < 0.5 ? o(16724032) : o(4259696);
      ((t[p] = x), (t[p + 1] = x), (t[p + v] = x), (t[p + v + 1] = x));
    }
  }
  const y0 = (s, t) => s - Math.floor(s / t) * t;
  function xt(s, t, c, r, d, f, w, D, P, h) {
    const { surf: a, length: u, pit: A, dashes: _, slotPos: m } = s,
      i = s.C,
      b = s.PIT,
      p = u / 2,
      x = f > p ? f - u : f;
    if (x > -150 && x < 0)
      for (let k = 0; k < 6; k++) {
        const M = x - m[k].as,
          g = w - m[k].l;
        if (M > -11 && M < 11 && g > -9.5 && g < 9.5) {
          const e = g < 0 ? -g : g;
          (M > 9 || e > 8.2 || (M < -9.8 && e > 4)) && (P = i.slot);
        }
      }
    if (x >= A.a0 && x < A.a1 && w > D - A.w) {
      a[c] = C0.PIT;
      const k = w - (D - A.w);
      if (k < 1.2) P = y0(f, 10) < 6 ? i.pitRim : i.pitSep;
      else {
        const M = x + k,
          g = Math.floor(M / 7);
        ((P = M - g * 7 < 1.4 ? i.pitSep : h < 0.15 ? t.PIT_DIM[g & 3] : b[g & 3]), s.animPit.push(c, M));
      }
    }
    for (let k = 0; k < _.length; k++) {
      const M = _[k];
      let g = f - M.a0;
      (g < -p && (g += u), g > p && (g -= u));
      const e = w - M.lc;
      if (g >= 0 && g < M.len && e > -M.hw && e < M.hw) {
        a[c] = C0.DASH;
        const l = e < 0 ? -e : e;
        if (l > M.hw - 1.6 || g < 1.6 || g > M.len - 1.6) P = (Math.floor(g / 4) + (e > 0 ? 1 : 0)) & 1 ? i.dashRim : i.dashBase;
        else {
          const S = g - 6 + l * 0.9,
            C = y0(S, 10);
          ((P = C > 6.5 ? i.dashTip : C > 3 ? i.dashChev : h < 0.3 ? t.DASH_MID : i.dashBase), s.animDash.push(c, S));
        }
      }
    }
    return (x > -6 && x < 6 && ((a[c] = C0.START), (P = (Math.floor((w + 120) / 6) + Math.floor((x + 6) / 6)) & 1 ? i.chkW : i.chkK)), P);
  }
  function dt(s, t, c) {
    const r = s.tex,
      d = s.surf,
      f = s.fLat,
      w = s.fIdx,
      D = s.PX,
      P = s.PY,
      h = s.dX,
      a = s.dY,
      u = s.halfWidth,
      A = s.tight,
      _ = s.feat,
      m = s.length,
      i = t.PNZ,
      b = t.RC,
      p = t.BAY,
      x = c << $,
      k = s.rowMax[c],
      M = c + 0.5,
      g = (c & 3) << 2;
    for (let e = s.rowMin[c]; e <= k; e++) {
      const l = x | e,
        S = f[l];
      if (S === h0) continue;
      const C = w[l],
        X = S * 0.01,
        B = X < 0 ? -X : X,
        R = u[C];
      if (B >= R + (b0 + k0)) continue;
      let O = C * l0 + (e + 0.5 - D[C]) * h[C] + (M - P[C]) * a[C];
      O < 0 ? (O += m) : O >= m && (O -= m);
      const K = p[g | (e & 3)];
      let Z = 0,
        n0 = 1;
      if (B < R) {
        const j = Math.floor(O * 0.03125),
          q = O - j * 32,
          z = X + 64,
          G = Math.floor(z / 24),
          c0 = z - G * 24,
          t0 = (j + G) & 1,
          V = i[(j * 7 + G) & 1023];
        let e0 = t0 ? (K < 0.25 + V * 0.3 ? 3 : 2) : K < 0.2 + V * 0.3 ? 1 : 0;
        if (
          (q < 1.25 || c0 < 1 ? (e0 = 4) : q < 3 && c0 < 3 && (e0 = 5),
          B < 0.9 && y0(O, 28) < 14 && (e0 = 6),
          B > R - 4.5 && B < R - 2.2 ? (e0 = y0(O, 16) < 9 ? 7 : 8) : B >= R - 2.2 && (e0 = e0 === 4 ? 11 : e0 === 5 ? 12 : t0 ? 10 : 9),
          (Z = b[e0]),
          _[C] !== 0)
        ) {
          ((d[l] = 1), (r[l] = xt(s, t, l, e, c, O, X, R, Z, K)));
          continue;
        }
      } else if (B < R + b0) {
        n0 = 2;
        const j = B - R,
          q = A[C],
          z = O / (q ? 8 : 10),
          G = Math.floor(z),
          c0 = z - G;
        let t0 = G & 1;
        c0 < 0.18 && ((e + c) & 1) === 1 && (t0 ^= 1);
        const V = t.BEAM;
        j < 1
          ? (Z = V[0])
          : j < 1.8 && K < 0.5
            ? (Z = q ? (t0 ? V[11] : V[12]) : t0 ? V[9] : V[10])
            : j < 3.6
              ? (Z = q ? (t0 ? V[4] : V[5]) : t0 ? V[1] : V[2])
              : j < 4.6
                ? (Z = q ? V[6] : V[3])
                : j < 5.3
                  ? (Z = V[7])
                  : (Z = V[8]);
      } else {
        n0 = 0;
        const j = B - R - b0,
          q = t.WALK,
          z = y0(O, 8),
          G = y0(j, 8);
        if (((Z = z < 1 || G < 1 ? q[1] : q[0]), j < 5 && K < (5 - j) * 0.18 && (Z = q[2]), j > 9 && j < 12)) {
          const c0 = y0(O, 40);
          c0 < 3 ? (Z = q[3]) : (c0 < 5 || c0 > 38) && (Z = q[4]);
        }
        j > k0 - 1.2 && (Z = q[1]);
      }
      ((r[l] = Z), (d[l] = n0));
    }
  }
  function* ut(s) {
    const t = s.C,
      c = s.PIT;
    yield 0;
    const r = new Float32Array(1024);
    for (let m = 0; m < 1024; m++) r[m] = T0(m, 77);
    const d = new Int32Array([
        t.road0,
        t.road1,
        t.roadAlt0,
        t.roadAlt1,
        t.roadSeam,
        t.roadRivet,
        t.center,
        t.edgeW,
        t.edgeM,
        i0(t.road0, t.beamA, 0.18),
        i0(t.roadAlt0, t.beamA, 0.18),
        i0(t.roadSeam, t.beamA, 0.18),
        i0(t.roadRivet, t.beamA, 0.18),
      ]),
      f = new Int32Array([
        t.beamCore,
        t.beamA,
        t.beamB,
        t.beamUnder,
        t.beamTA,
        t.beamTB,
        t.beamTUnder,
        t.house,
        t.houseHi,
        i0(t.beamA, t.beamCore, 0.5),
        i0(t.beamB, t.beamCore, 0.5),
        i0(t.beamTA, t.beamCore, 0.5),
        i0(t.beamTB, t.beamCore, 0.5),
      ]),
      w = new Int32Array([t.walk0, t.walk1, t.glow, t.lamp, t.lampHalo]),
      D = new Float64Array(_0),
      P = {
        PNZ: r,
        RC: d,
        BEAM: f,
        WALK: w,
        BAY: D,
        PIT_DIM: c.map((m) => i0(m, 4278190080, 0.25)),
        DASH_MID: i0(t.dashBase, t.dashChev, 0.3),
      },
      { n: h, length: a, pit: u, dashes: A } = s,
      _ = new Uint8Array(h);
    for (let m = 0; m < h; m++) {
      const i = m * l0,
        b = i > a / 2 ? i - a : i;
      let p = (b > -160 && b < 10) || (b > u.a0 - 10 && b < u.a1 + 10);
      for (const x of A) {
        let k = i - x.a0;
        (k < -a / 2 && (k += a), k > a / 2 && (k -= a), k > -10 && k < x.len + 10 && (p = !0));
      }
      _[m] = p ? 1 : 0;
    }
    ((s.feat = _), (s.animPit = []), (s.animDash = []));
    for (let m = 0; m < v; m++) ((m & 3) === 0 && (yield m / v), s.rowMax[m] >= 0 && dt(s, P, m));
  }
  function D0(s) {
    const t = (e) => [1024 + (e[0] - 1024) * s.scale, 1024 + (e[1] - 1024) * s.scale],
      c = s.cp.map(t);
    let r = K0(c, 48);
    const d = t(s.start);
    let f = 0,
      w = 1e18;
    for (let e = 0; e < r.length; e++) {
      const l = (r[e][0] - d[0]) ** 2 + (r[e][1] - d[1]) ** 2;
      l < w && ((w = l), (f = e));
    }
    r = r.slice(f).concat(r.slice(0, f));
    const D = r.length,
      P = new Float64Array(D);
    let h = 0;
    for (let e = 0; e < D; e++) {
      const l = r[e],
        S = r[(e + 1) % D];
      ((P[e] = Math.hypot(S[0] - l[0], S[1] - l[1])), (h += P[e]));
    }
    const a = Math.round(h / l0),
      u = h / a,
      A = new Float32Array(2 * a);
    {
      let e = 0,
        l = 0;
      for (let S = 0; S < a; S++) {
        const C = S * u;
        for (; l + P[e] < C && e < D - 1;) ((l += P[e]), e++);
        const X = (C - l) / P[e],
          B = r[e],
          R = r[(e + 1) % D];
        ((A[2 * S] = B[0] + (R[0] - B[0]) * X), (A[2 * S + 1] = B[1] + (R[1] - B[1]) * X));
      }
    }
    const _ = new Float64Array(a),
      m = new Float64Array(a);
    for (let e = 0; e < a; e++) ((_[e] = A[2 * e]), (m[e] = A[2 * e + 1]));
    const i = new Float32Array(a),
      b = new Float64Array(a),
      p = new Float64Array(a);
    for (let e = 0; e < a; e++) {
      const l = (e - 1 + a) % a,
        S = (e + 1) % a;
      i[e] = Math.atan2(m[S] - m[l], _[S] - _[l]);
      const C = _[S] - _[e],
        X = m[S] - m[e],
        B = Math.hypot(C, X) || 1;
      ((b[e] = C / B), (p[e] = X / B));
    }
    const x = new Float64Array(a);
    for (let e = 0; e < a; e++) {
      const l = i[(e - 6 + a) % a];
      let C = i[(e + 6) % a] - l;
      for (; C > Math.PI;) C -= 2 * Math.PI;
      for (; C < -Math.PI;) C += 2 * Math.PI;
      x[e] = Math.min(9999, (12 * u) / Math.max(1e-6, Math.abs(C)));
    }
    const k = new Float64Array(a),
      M = new Float32Array(a);
    for (let e = 0; e < a; e++) {
      const l = x[e];
      k[e] = s.hw0 + s.hwRange * Math.min(1, Math.max(0, (l - 90) / 330));
    }
    for (let e = 0; e < a; e++) {
      let l = 0,
        S = 1e9;
      for (let C = -24; C <= 24; C++) {
        const X = k[(e + C + a) % a];
        ((l += X), X < S && (S = X));
      }
      M[e] = Math.round((0.5 * (l / 49) + 0.5 * S) * 2) / 2;
    }
    const g = new Uint8Array(a);
    for (let e = 0; e < a; e++) {
      let l = 1e9;
      for (let S = -14; S <= 14; S++) l = Math.min(l, x[(e + S + a) % a]);
      g[e] = l < 150 ? 1 : 0;
    }
    return { xf: t, n: a, sp: u, path: A, PX: _, PY: m, ang: i, dX: b, dY: p, radius: x, halfWidth: M, tight: g };
  }
  function* E0(s) {
    const t = g0[s] || g0.neon_harbor,
      c = Z0(t.seed),
      r = t.C,
      d = D0(t),
      f = d.xf,
      w = d.n,
      D = d.sp,
      P = d.path,
      h = d.PX,
      a = d.PY,
      u = d.ang,
      A = d.dX,
      _ = d.dY,
      m = d.radius,
      i = d.halfWidth,
      b = d.tight;
    function p(U, H) {
      let o0 = 0,
        s0 = 1e18;
      for (let n = 0; n < w; n++) {
        const F = (h[n] - U) ** 2 + (a[n] - H) ** 2;
        F < s0 && ((s0 = F), (o0 = n));
      }
      return o0;
    }
    const x = w * l0,
      k = { a0: 60, a1: 600, w: 22 },
      M = t.dash.map((U, H) => ({ a0: p(f(U)[0], f(U)[1]) * l0, len: 40, lc: t.dashLat[H], hw: 18 }));
    function g(U) {
      if (U < 6) return { back: 26 + 19 * U, lat: (U % 2 === 0 ? 1 : -1) * 19 };
      const H = U - 6;
      return { back: 141 + 7 * H, lat: H % 3 === 0 ? -28 : H % 3 === 1 ? 0 : 28 };
    }
    function e(U) {
      const H = g(U),
        o0 = H.back,
        s0 = H.lat,
        n = w - o0 / l0,
        F = Math.floor(n),
        T = n - F,
        I = ((F % w) + w) % w,
        y = (I + 1) % w,
        L = h[I] + (h[y] - h[I]) * T,
        W = a[I] + (a[y] - a[I]) * T,
        E = u[I];
      return { x: L - Math.sin(E) * s0, y: W + Math.cos(E) * s0, angle: E };
    }
    const l = [],
      S = [];
    for (let U = 0; U < 6; U++) (l.push(e(U)), S.push({ as: -g(U).back, l: g(U).lat }));
    yield 0;
    const C = v * v,
      X = new Uint32Array(C),
      B = new Uint8Array(C);
    yield 0;
    const R = {
        n: w,
        PX: h,
        PY: a,
        ang: u,
        dX: A,
        dY: _,
        halfWidth: i,
        radius: m,
        tight: b,
        length: x,
        pit: k,
        dashes: M,
        slotPos: S,
        rnd: c,
        tex: X,
        surf: B,
        N2: C,
        C: r,
        PIT: t.PIT,
        extra: {},
      },
      O = [et].concat(t.ground, [ut]),
      K = t.weights,
      Z = O.map(() => 0);
    let n0 = 0;
    for (let U = 0; U < O.length; U++) {
      const H = O[U](R);
      for (;;) {
        const o0 = M0(),
          s0 = H.next();
        if (((Z[U] += M0() - o0), s0.done)) break;
        yield n0 + K[U] * (s0.value || 0);
      }
      ((n0 += K[U]), yield n0);
    }
    const j = O.map((U) => U.name.replace(/^ph_/, "")),
      q = 80,
      z = 110,
      G = 30,
      c0 = new Uint8Array(w);
    {
      const U = new Uint8Array(w);
      for (let H = 0; H < w; H++) m[H] < z && (U[H] = 1);
      for (let H = 0; H < w; H++) if (U[H]) for (let o0 = -G; o0 <= G; o0++) c0[(H + o0 + w) % w] = 1;
    }
    function t0(U, H, o0, s0) {
      let n = 0;
      if (!(o0 >= 0) || o0 >= w) {
        let I = 1e18;
        for (let y = 0; y < w; y++) {
          const L = h[y] - U,
            W = a[y] - H,
            E = L * L + W * W;
          E < I && ((I = E), (n = y));
        }
      } else if (c0[o0 | 0] === 1) {
        let I = 1e18;
        const y = o0 | 0;
        for (let L = -q; L <= q; L++) {
          let W = y + L;
          W < 0 ? (W += w) : W >= w && (W -= w);
          const E = h[W] - U,
            Y = a[W] - H,
            N = E * E + Y * Y;
          N < I && ((I = N), (n = W));
        }
      } else {
        let I = o0 | 0,
          y = h[I] - U,
          L = a[I] - H,
          W = y * y + L * L,
          E = I + 1 === w ? 0 : I + 1,
          Y = I === 0 ? w - 1 : I - 1;
        ((y = h[E] - U), (L = a[E] - H));
        const N = y * y + L * L;
        ((y = h[Y] - U), (L = a[Y] - H));
        const J = y * y + L * L;
        if (N < W && N <= J) {
          let r0 = 1;
          for (I = E, W = N; r0 < q;) {
            ((E = I + 1 === w ? 0 : I + 1), (y = h[E] - U), (L = a[E] - H));
            const Q = y * y + L * L;
            if (!(Q < W)) break;
            ((I = E), (W = Q), r0++);
          }
        } else if (J < W) {
          let r0 = 1;
          for (I = Y, W = J; r0 < q;) {
            ((Y = I === 0 ? w - 1 : I - 1), (y = h[Y] - U), (L = a[Y] - H));
            const Q = y * y + L * L;
            if (!(Q < W)) break;
            ((I = Y), (W = Q), r0++);
          }
        }
        n = I;
      }
      const F = u[n],
        T = (U - h[n]) * -Math.sin(F) + (H - a[n]) * Math.cos(F);
      return s0 ? ((s0.i = n), (s0.lateral = T), (s0.along = n * l0), s0) : { i: n, lateral: T, along: n * l0 };
    }
    const V = t.theme,
      e0 = {};
    for (const U in V) e0[U] = V[U] >>> 0;
    return (
      (R.fIdx = R.fLat = R.land = R.F = null),
      {
        id: t.id,
        name: t.name,
        env: t.env,
        size: v,
        tex: X,
        surf: B,
        STEP: l0,
        n: w,
        path: P,
        ang: u,
        halfWidth: i,
        length: x,
        grid: l,
        gridSlot: e,
        locate: t0,
        theme: e0,
        startIndex: 0,
        pit: { a0: k.a0, a1: k.a1, side: 1, width: k.w },
        dashes: M.map((U) => ({ along: U.a0, len: U.len, lateral: U.lc, halfWidth: U.hw })),
        buildMs: 0,
        phaseNames: j,
        phaseMs: Z,
        bridges: [],
        landmarks: R.extra,
        anim: {
          dashIdx: Int32Array.from(R.animDash.filter((U, H) => !(H & 1))),
          dashPh: Float32Array.from(R.animDash.filter((U, H) => H & 1)),
          pitIdx: Int32Array.from(R.animPit.filter((U, H) => !(H & 1))),
          pitPh: Float32Array.from(R.animPit.filter((U, H) => H & 1)),
          dashCols: [r.dashBase >>> 0, i0(r.dashBase, r.dashChev, 0.3) >>> 0, r.dashChev >>> 0, r.dashTip >>> 0],
          pitCols: t.PIT.map((U) => U >>> 0),
          pitDim: t.PIT.map((U) => i0(U, 4278190080, 0.25) >>> 0),
          pitSep: r.pitSep >>> 0,
        },
      }
    );
  }
  const Mt = [
      [490, 1020],
      [800, 1020],
      [1100, 1020],
      [1420, 1020],
      [1660, 1030],
      [1790, 1100],
      [1845, 1260],
      [1845, 1470],
      [1785, 1665],
      [1625, 1785],
      [1420, 1775],
      [1290, 1655],
      [1245, 1490],
      [1225, 1350],
      [1140, 1268],
      [1010, 1245],
      [895, 1292],
      [780, 1270],
      [680, 1300],
      [610, 1390],
      [570, 1540],
      [510, 1700],
      [400, 1800],
      [260, 1770],
      [175, 1620],
      [190, 1460],
      [300, 1330],
      [310, 1180],
      [200, 1040],
      [175, 880],
      [200, 700],
      [250, 520],
      [400, 330],
      [600, 225],
      [800, 250],
      [930, 400],
      [1030, 550],
      [1150, 570],
      [1260, 440],
      [1400, 280],
      [1620, 240],
      [1800, 360],
      [1860, 580],
      [1800, 760],
      [1640, 800],
      [1440, 790],
      [1220, 775],
      [1e3, 765],
      [740, 772],
      [590, 785],
      [480, 850],
      [455, 960],
    ],
    O0 = {
      road0: o(2566968),
      road1: o(3027778),
      roadSeam: o(1645606),
      roadRivet: o(5002860),
      roadAlt0: o(2303795),
      roadAlt1: o(2764605),
      center: o(5661310),
      edgeW: o(15791871),
      edgeM: o(3203327),
      beamCore: o(15400959),
      beamA: o(3726591),
      beamB: o(1732296),
      beamUnder: o(799840),
      beamTA: o(16777215),
      beamTB: o(16753700),
      beamTUnder: o(6961674),
      house: o(1711660),
      houseHi: o(4871794),
      glow: o(1862284),
      walk0: o(2764344),
      walk1: o(2040362),
      lamp: o(16761924),
      lampHalo: o(6969908),
      chkW: o(15922426),
      chkK: o(1316380),
      dashBase: o(2759688),
      dashChev: o(16757800),
      dashTip: o(16777215),
      dashRim: o(3203327),
      pitSep: o(1185310),
      pitRim: o(16777215),
      slot: o(14215423),
    },
    mt = [o(3203327), o(15791871), o(16757800), o(4881663)],
    U0 = [1776673, 2763569, 3816515, 4934997, 6185065, 8027270].map(o),
    Y0 = [2303534, 3290688, 4343635, 5462374, 6778492, 8686490].map(o),
    A0 = 1010,
    u0 = 1024;
  function S0(s, t) {
    const c = (s - u0) / A0,
      r = (t - u0) / A0,
      d = c * c,
      f = r * r;
    return d * d * d + f * f * f;
  }
  function bt(s, t, c, r, d, f, w, D, P, h) {
    const a = t << $,
      u = t / 64,
      A = u | 0,
      _ = u - A,
      m = _ * _ * (3 - 2 * _),
      i = t / 16,
      b = i | 0,
      p = i - b,
      x = p * p * (3 - 2 * p),
      k = (t & 3) << 2,
      M = A * d,
      g = b * f;
    let e = Math.imul(t, 668265263);
    for (let l = 0; l < v; l++) {
      const S = M + w[l],
        C = D[l],
        X = c[S] + (c[S + 1] - c[S]) * C,
        B = c[S + d] + (c[S + d + 1] - c[S + d]) * C,
        R = g + P[l],
        O = h[l],
        K = r[R] + (r[R + 1] - r[R]) * O,
        Z = r[R + f] + (r[R + f + 1] - r[R + f]) * O;
      let j = 1 + (((((X + (B - X) * m) * 0.7 + (K + (Z - K) * x) * 0.3) * 0.5 + 0.5 + (I0[k | (l & 3)] - 7.5) * 0.01375) * 4) | 0);
      j < 1 ? (j = 1) : j > 4 && (j = 4);
      let q = (Math.imul(l, 374761393) + e) | 0;
      ((q = Math.imul(q ^ (q >>> 13), 1274126177)),
        (q = (q ^ (q >>> 16)) & 1023),
        q < 14 ? (j = j + 1) : q < 22 && (j = j - 1),
        (s[a | l] = j));
    }
  }
  function pt(s, t, c, r) {
    const d = r * 1.45,
      f = -0.6,
      w = -0.8,
      D = Math.max(0, Math.floor(t - d)),
      P = Math.min(v - 1, Math.ceil(t + d)),
      h = Math.max(0, Math.floor(c - d)),
      a = Math.min(v - 1, Math.ceil(c + d));
    for (let u = h; u <= a; u++) {
      const A = u + 0.5 - c,
        _ = u << $,
        m = (u & 3) << 2;
      for (let i = D; i <= P; i++) {
        const b = i + 0.5 - t,
          p = Math.sqrt(b * b + A * A),
          x = p / r;
        if (x > 1.45) continue;
        const k = _ | i,
          M = (b * f + A * w) / (p || 1),
          g = (I0[m | (i & 3)] + 0.5) / 16;
        let e = s[k];
        if (x < 0.82) {
          const l = M * Math.min(1, x * 1.6);
          ((e = l > 0.35 ? 0 : l > 0.05 ? 1 : l < -0.45 ? 4 : 2), x < 0.3 && r > 10 && (e = 2));
        } else x < 1.05 ? (e = M < -0.3 ? 5 : M < 0.25 ? 4 : 2) : r > 9 && g < (1.45 - x) * 1.2 && (e = e < 4 ? e + 1 : e);
        s[k] = e;
      }
    }
  }
  function yt(s, t, c) {
    const r = c << $,
      d = (c - u0) / A0,
      f = d * d,
      w = f * f * f,
      D = o(4253951),
      P = o(1871028),
      h = o(9082026),
      a = o(5002342),
      u = o(1381914);
    for (let A = 0; A < v; A++) {
      const _ = (A - u0) / A0,
        m = _ * _,
        i = m * m * m + w,
        b = r | A,
        p = t[b];
      let x;
      (i < 0.948
        ? (x = Y0[p])
        : i < 0.958
          ? (x = (A + c) & 1 ? P : Y0[p])
          : i < 0.966
            ? (x = D)
            : i < 0.99
              ? (x = (((A * 7) ^ (c * 5)) & 15) === 0 ? o(16761924) : h)
              : i < 1
                ? (x = a)
                : i < 1.035
                  ? (x = (A ^ c) & 1 ? u : U0[p > 1 ? p - 1 : 0])
                  : (x = U0[p]),
        (s[b] = x));
    }
  }
  function* wt(s) {
    const { tex: t, fLat: c, rnd: r, n: d, PX: f, PY: w, halfWidth: D } = s,
      P = new Uint8Array(v * v),
      h = 34,
      a = 130,
      u = new Float32Array(h * h),
      A = new Float32Array(a * a);
    for (let n = 0; n < u.length; n++) u[n] = r() * 2 - 1;
    for (let n = 0; n < A.length; n++) A[n] = r() * 2 - 1;
    const _ = new Int32Array(v),
      m = new Float64Array(v),
      i = new Int32Array(v),
      b = new Float64Array(v);
    for (let n = 0; n < v; n++) {
      const F = n / 64,
        T = F | 0,
        I = F - T,
        y = n / 16,
        L = y | 0,
        W = y - L;
      ((_[n] = T), (m[n] = I * I * (3 - 2 * I)), (i[n] = L), (b[n] = W * W * (3 - 2 * W)));
    }
    for (let n = 0; n < v; n++) ((n & 7) === 0 && (yield (0.15 * n) / v), bt(P, n, u, A, h, a, _, m, i, b));
    for (let n = 0; n < 1400; n++) {
      (n & 31) === 0 && (yield 0.15 + (0.3 * n) / 1400);
      const F = r() * v,
        T = r() * v,
        I = 3 + 70 * Math.pow(r(), 3.2);
      (S0(F, T) < 1 && (r() > 0.22 || I > 26)) || pt(P, F, T, I);
    }
    for (let n = 0; n < v; n++) ((n & 7) === 0 && (yield 0.45 + (0.15 * n) / v), yt(t, P, n));
    const p = (n, F, T) => {
        ((n |= 0), (F |= 0), n >= 0 && F >= 0 && n < v && F < v && c[(F << $) | n] === h0 && (t[(F << $) | n] = T));
      },
      x = (n, F, T, I, y) => {
        for (let L = F | 0; (L < F + I) | 0; L++) for (let W = n | 0; (W < n + T) | 0; W++) p(W, L, y);
      };
    function k(n, F, T, I, y) {
      if (n < 4 || F < 4 || T > v - 5 || I > v - 5) return !1;
      for (let L = F; L <= I + 0.1; L += Math.max(1, (I - F) / 12))
        for (let W = n; W <= T + 0.1; W += Math.max(1, (T - n) / 12)) {
          if (c[((L | 0) << $) | (W | 0)] !== h0) return !1;
          const E = S0(W, L);
          if (y ? E > 0.93 : E < 1.08) return !1;
        }
      return !0;
    }
    const M = [],
      g = (n, F, T, I, y) => M.some((L) => n < L[2] + y && T > L[0] - y && F < L[3] + y && I > L[1] - y);
    function e(n, F) {
      let T = 1e9;
      for (let I = 0; I < d; I += 3) {
        const y = Math.hypot(f[I] - n, w[I] - F) - D[I];
        y < T && (T = y);
      }
      return T;
    }
    function l(n, F, T, I) {
      for (let y = Math.floor(F - T); y <= F + T; y++)
        for (let L = Math.floor(n - T); L <= n + T; L++) {
          const W = L + 0.5 - n,
            E = y + 0.5 - F,
            Y = Math.sqrt(W * W + E * E);
          if (Y > T) continue;
          const N = I(Y, W, E, L, y);
          N && p(L, y, N);
        }
    }
    const S = (n, F) => (I0[((F & 3) << 2) | (n & 3)] + 0.5) / 16,
      C = o(3726591),
      X = o(1337996),
      B = o(16757800),
      R = o(8015888),
      O = o(15791871),
      K = o(6055028),
      Z = o(4870496),
      n0 = o(7239304),
      j = o(1711398),
      q = o(5925510);
    yield 0.6;
    for (let n = 0; n < 24; n++) {
      (n & 3) === 0 && (yield 0.6 + (0.04 * n) / 24);
      const F = (n / 24) * Math.PI * 2,
        T = Math.cos(F),
        I = Math.sin(F);
      for (let y = 120; y < 1100; y += 0.7) {
        const L = u0 + T * y,
          W = u0 + I * y,
          E = S0(L, W);
        if (E > 0.945) break;
        const Y = L | 0,
          N = W | 0;
        (((Y + N) & 1) === 0 && p(Y, N, q), E > 0.8 && (y | 0) % 9 === 0 && p(Y, N, B));
      }
    }
    yield 0.64;
    for (let n = 0; n < 3e3; n++) {
      const F = (n / 3e3) * Math.PI * 2,
        T = Math.cos(F),
        I = Math.sin(F),
        y = 0.62 * A0,
        L = u0 + Math.sign(T) * Math.pow(Math.abs(T), 1 / 3) * y,
        W = u0 + Math.sign(I) * Math.pow(Math.abs(I), 1 / 3) * y;
      (n & 1) === 0 && p(L, W, q);
    }
    yield 0.7;
    const z = { x: (f[0] + f[((d / 2) | 0) > 0 ? Math.round(1150 / l0) : 0]) / 2, y: w[0], r: 0 };
    {
      let n = 0;
      for (let F = 0; F < 320; F++) Math.abs(f[F] - 1040) < Math.abs(f[n] - 1040) && (n = F);
      ((z.x = f[n]), (z.y = w[n]));
    }
    ((z.r = 150),
      l(z.x, z.y, z.r, (n, F, T, I, y) => {
        if (n > z.r - 3) return j;
        if (n > z.r - 6) return ((Math.atan2(T, F) * 40) | 0) & 1 ? C : X;
        if (n > z.r - 9) return Z;
        const L = (n / 18) | 0,
          W = L * 6 + 6,
          E = ((Math.atan2(T, F) + Math.PI) / (Math.PI * 2)) * W;
        return n % 18 < 1.2 || E % 1 < 0.05 ? Z : L === 4 && ((E * 2) | 0) & 1 ? R : L & 1 ? K : n0;
      }),
      M.push([z.x - z.r, z.y - z.r, z.x + z.r, z.y + z.r]),
      (s.extra.hub = { x: z.x, y: z.y, r: z.r }),
      yield 0.71);
    {
      let n = 0,
        F = 0,
        T = 0;
      for (let y = 1460; y <= 1720; y += 10) {
        yield 0.715;
        for (let L = 1440; L <= 1720; L += 10) {
          const W = e(L, y);
          W > T && ((T = W), (n = L), (F = y));
        }
      }
      const I = Math.min(120, T - b0 - k0 - 8);
      (l(n, F, I + 4, (y, L, W, E, Y) => {
        const N = Math.atan2(W, L);
        if (y > I) return j;
        if (y > I - 7) return (((N * 12) / Math.PI) | 0) & 1 ? B : j;
        if (y > I - 10) return Z;
        if (y > I * 0.62) return ((((N * 8) / Math.PI) % 2) + 2) % 2 < 0.12 ? n0 : (y | 0) % 6 < 1 ? Z : K;
        if (y > I * 0.58) return C;
        if (y > I * 0.5) return j;
        const J = y / (I * 0.5);
        return J < 0.35 ? O : J < 0.7 ? (S(E, Y) < 0.8 - (J - 0.35) * 1.5 ? o(12122367) : C) : S(E, Y) < 0.9 - J * 0.5 ? C : X;
      }),
        M.push([n - I, F - I, n + I, F + I]),
        (s.extra.reactor = { x: n, y: F, r: I }));
    }
    yield 0.75;
    const G = [];
    for (let n = 0; n < 5e3 && G.length < 70; n++) {
      (n & 255) === 0 && (yield 0.75 + (0.05 * n) / 5e3);
      const F = r() < 0.35,
        T = F ? 30 + r() * 34 : 40 + r() * 56,
        I = F ? T : 22 + r() * 22,
        y = !F && r() < 0.5,
        L = y ? I : T,
        W = y ? T : I,
        E = n < 1800,
        Y = E ? 600 + r() * 700 : 60 + r() * (v - 120),
        N = E ? 1090 + r() * 420 : 60 + r() * (v - 120);
      g(Y, N, Y + L, N + W, 12) ||
        !k(Y - 8, N - 8, Y + L + 8, N + W + 8, !0) ||
        (M.push([Y, N, Y + L, N + W]), G.push({ x0: Y, y0: N, w: L, h: W, round: F, glow: r() < 0.7 ? C : B }));
    }
    const c0 = (n, F, T, I) => {
      const y = Math.hypot(T - n, I - F),
        L = (T - n) / y,
        W = (I - F) / y;
      for (let E = 0; E < y; E += 0.8) if (c[(((F + W * E) | 0) << $) | ((n + L * E) | 0)] !== h0) return;
      for (let E = 0; E < y; E += 0.5)
        for (let Y = -3; Y <= 3; Y++) {
          const N = n + L * E - W * Y,
            J = F + W * E + L * Y;
          p(N, J, Math.abs(Y) === 3 ? j : Math.abs(Y) === 0 && (E | 0) % 8 < 2 ? B : Z);
        }
    };
    for (let n = 0; n < G.length; n++)
      for (let F = n + 1; F < G.length; F++) {
        F === n + 1 && (yield 0.8 + (0.05 * n) / G.length);
        const T = G[n],
          I = G[F],
          y = T.x0 + T.w / 2,
          L = T.y0 + T.h / 2,
          W = I.x0 + I.w / 2,
          E = I.y0 + I.h / 2;
        Math.hypot(y - W, L - E) < 110 && c0(y, L, W, E);
      }
    for (let n = 0; n < G.length; n++) {
      yield 0.85 + (0.07 * n) / G.length;
      const F = G[n],
        { x0: T, y0: I, w: y, h: L, round: W, glow: E } = F,
        Y = T + y / 2,
        N = I + L / 2,
        J = i0(E, j, 0.55),
        r0 = (Q, a0, x0) => {
          if (W) {
            const N0 = Q + 0.5 - Y,
              j0 = a0 + 0.5 - N,
              q0 = y / 2 - x0;
            return N0 * N0 + j0 * j0 < q0 * q0;
          }
          const m0 = Math.min(y, L) / 2,
            w0 = Math.max(Math.abs(Q + 0.5 - Y) - (y / 2 - m0), 0),
            H0 = Math.max(Math.abs(a0 + 0.5 - N) - (L / 2 - m0), 0);
          return w0 * w0 + H0 * H0 < (m0 - x0) * (m0 - x0);
        };
      for (let Q = (I + 2) | 0; Q < I + L + 4; Q++)
        for (let a0 = (T + 2) | 0; a0 < T + y + 4; a0++) r0(a0 - 3, Q - 3, 0) && !r0(a0, Q, 0) && p(a0, Q, o(1184536));
      for (let Q = (I - 1) | 0; Q < I + L + 1; Q++)
        for (let a0 = (T - 1) | 0; a0 < T + y + 1; a0++) {
          if (!r0(a0, Q, 0)) continue;
          let x0;
          (r0(a0, Q, 1.5)
            ? r0(a0, Q, 3)
              ? r0(a0, Q, 6)
                ? (x0 = ((a0 - T) | 0) % 8 === 0 || ((Q - I) | 0) % 8 === 0 ? Z : K)
                : (x0 = (a0 + Q) % 5 === 0 ? E : n0)
              : (x0 = J)
            : (x0 = E),
            p(a0, Q, x0));
        }
      (p(Y, N, O), p(Y + 1, N, O));
    }
    ((s.extra.habs = G.map((n) => ({ x: n.x0 + n.w / 2, y: n.y0 + n.h / 2, w: n.w, h: n.h, round: n.round }))), yield 0.93);
    const t0 = [];
    function V(n, F, T, I) {
      return g(n - T, F - T, n + T, F + T, 10) || !k(n - T - 8, F - T - 8, n + T + 8, F + T + 8, I)
        ? !1
        : (M.push([n - T, F - T, n + T, F + T]),
          t0.push({ x: n, y: F, r: T }),
          l(n, F, T, (y, L, W, E, Y) => {
            const N = Math.atan2(W, L);
            if (y > T - 1.5) return j;
            if (y > T - 6) return (((N * 10) / Math.PI) | 0) & 1 ? B : o(2237484);
            if (y > T - 8) return ((((N * 16) / Math.PI) | 0) & 3) === 0 ? O : o(3027516);
            if (y > T * 0.55 && y < T * 0.55 + 2) return O;
            const J = T * 0.28,
              r0 = Math.abs(L),
              Q = Math.abs(W);
            return (r0 < J && r0 > J - 3 && Q < J) || (Q < 1.5 && r0 < J) ? O : ((E ^ Y) & 7) === 0 ? o(3817034) : o(3159102);
          }),
          !0);
    }
    for (let n = 0; n < 900 && t0.length < 6; n++)
      ((n & 63) === 0 && (yield 0.93), V(150 + r() * 1750, 150 + r() * 1750, 30 + r() * 26, !0));
    let e0 = 0;
    for (let n = 0; n < 3e3 && e0 < 4; n++) ((n & 255) === 0 && (yield 0.95), V(r() * v, r() * v, 26 + r() * 22, !1) && e0++);
    ((s.extra.pads = t0), yield 0.96);
    const U = o(1321564),
      H = o(2906792),
      o0 = o(9082026);
    let s0 = 0;
    for (let n = 0; n < 4e3 && s0 < 26; n++) {
      (n & 127) === 0 && (yield 0.96 + (0.03 * n) / 4e3);
      const F = r() < 0.3,
        T = 2 + ((r() * 4) | 0),
        I = 1 + ((r() * 3) | 0),
        y = 14,
        L = 9,
        W = 4,
        E = T * (y + W),
        Y = I * (L + W + 2),
        N = r() * (v - E),
        J = r() * (v - Y);
      if (!(g(N, J, N + E, J + Y, 8) || !k(N - 4, J - 4, N + E + 4, J + Y + 4, F))) {
        (M.push([N, J, N + E, J + Y]), s0++);
        for (let r0 = 0; r0 < I; r0++) {
          const Q = J + r0 * (L + W + 2);
          x(N, Q + L / 2, E - W, 1, o0);
          for (let a0 = 0; a0 < T; a0++) {
            const x0 = N + a0 * (y + W);
            x(x0 + 2, Q + 2, y, L, o(1052950));
            for (let m0 = 0; m0 < L; m0++) for (let w0 = 0; w0 < y; w0++) p(x0 + w0, Q + m0, w0 % 4 === 0 || m0 % 3 === 0 ? H : U);
          }
        }
      }
    }
    for (const n of t0) {
      let F = null,
        T = 1e9;
      for (const Y of G) {
        const N = Math.hypot(Y.x0 + Y.w / 2 - n.x, Y.y0 + Y.h / 2 - n.y);
        N < T && ((T = N), (F = Y));
      }
      if (!F || T > 260) continue;
      const I = F.x0 + F.w / 2,
        y = F.y0 + F.h / 2,
        L = T,
        W = (I - n.x) / L,
        E = (y - n.y) / L;
      for (let Y = n.r + 4; Y < L - Math.min(F.w, F.h) / 2 - 2; Y += 6) {
        const N = n.x + W * Y,
          J = n.y + E * Y;
        if (c[((J | 0) << $) | (N | 0)] !== h0) break;
        (p(N, J, B), p(N + 1, J, R));
      }
    }
    s.extra.dome = { cx: u0, cy: u0, r: A0, p: 6 };
  }
  const At = {
      id: "lunar_dome",
      name: "SELENE DOME",
      env: "moon",
      seed: 6168142,
      cp: Mt,
      scale: 1.06,
      start: [780, 1020],
      dash: [
        [1845, 1370],
        [1500, 255],
        [185, 860],
      ],
      dashLat: [0, -14, 12],
      hw0: 63,
      hwRange: 18,
      C: O0,
      PIT: mt,
      ground: [wt],
      weights: [0.12, 0.65, 0.23],
      theme: {
        skyTop: o(131848),
        skyMid: o(527130),
        skyBottom: o(1712704),
        horizon: o(4871794),
        voidColor: o(3619135),
        beam: O0.beamA,
        accent: o(16757800),
      },
    },
    g0 = {
      neon_harbor: {
        id: "neon_harbor",
        name: "NEON HARBOR",
        env: "harbor",
        seed: 388817,
        cp: G0,
        scale: Q0,
        start: V0,
        dash: J0,
        dashLat: $0,
        hw0: 66,
        hwRange: 18,
        C: f0,
        PIT: tt,
        ground: [ot, st, rt, ct, lt, ht],
        weights: [0.24, 0.11, 0.02, 0.065, 0.02, 0.02, 0.1, 0.425],
        theme: {
          skyTop: o(1313332),
          skyMid: o(8003182),
          skyBottom: o(16743002),
          horizon: o(12081798),
          voidColor: o(727096),
          beam: f0.beamA,
          accent: o(3993855),
        },
      },
      lunar_dome: At,
    },
    M0 = () => (typeof performance < "u" ? performance.now() : Date.now());
  function gt(s) {
    const t = M0(),
      c = E0(s);
    let r = c.next();
    for (; !r.done;) r = c.next();
    const d = r.value;
    return ((d.buildMs = M0() - t), d);
  }
  function kt(s, t, c) {
    c = c || {};
    const r = c.budgetMs > 0 ? c.budgetMs : 5,
      d = c.defer || (typeof setTimeout == "function" ? (A) => setTimeout(A, 0) : (A) => Promise.resolve().then(A)),
      f = E0(s);
    let w = null,
      D = 0,
      P = null;
    function h(A) {
      if (((w = A.value), (w.buildMs = D), (u.progress = 1), (u.done = !0), (u.track = w), t))
        try {
          t(1);
        } catch {}
      return w;
    }
    function a() {
      if (w) {
        P.resolve(w);
        return;
      }
      try {
        const A = M0();
        let _;
        for (; (_ = f.next()), !(_.done || M0() - A >= r););
        if (((D += M0() - A), _.done)) {
          P.resolve(h(_));
          return;
        }
        if (((u.progress = _.value), t))
          try {
            t(_.value);
          } catch {}
        d(a);
      } catch (A) {
        P.reject(A);
      }
    }
    const u = new Promise((A, _) => {
      P = { resolve: A, reject: _ };
    });
    return (
      (u.progress = 0),
      (u.done = !1),
      (u.track = null),
      (u.finishNow = function () {
        if (w) return w;
        const A = M0();
        let _ = f.next();
        for (; !_.done;) _ = f.next();
        return ((D += M0() - A), h(_));
      }),
      d(a),
      u
    );
  }
  const X0 = {};
  function Pt(s) {
    const t = g0[s] || g0.neon_harbor;
    let c = X0[t.id];
    if (!c) {
      const r = D0(t);
      c = X0[t.id] = {
        id: t.id,
        name: t.name,
        outline: !0,
        size: v,
        STEP: l0,
        n: r.n,
        path: r.path,
        ang: r.ang,
        halfWidth: r.halfWidth,
        length: r.n * l0,
      };
    }
    return c;
  }
  L0.Track = {
    build: gt,
    buildAsync: kt,
    outline: Pt,
    SIZE: v,
    STEP: l0,
    WALL_W: b0,
    list: Object.keys(g0).map((s) => ({ id: s, name: g0[s].name })),
  };
})();
