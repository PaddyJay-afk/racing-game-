/* render3d.js */
(function () {
  "use strict";
  const Oe = (window.FZ = window.FZ || {}),
    v0 = 360,
    on = 0.62,
    U0 = 120,
    an = 3,
    na = 420,
    ra = 5600,
    ce = 6,
    fe = 2.4,
    kt = 6,
    Lt = 12.5,
    nn = 3200,
    rn = 900,
    sn = 72,
    Ut = 8,
    Mt = 26,
    X = Math.PI * 2;
  let pe = 8;
  const De = { top: [0.08, 0.04, 0.2], mid: [0.48, 0.12, 0.43], low: [1, 0.5, 0.36], fog: [0.42, 0.2, 0.42] },
    a0 = [-0.55, 0.12, -0.83],
    Ue = 2.3,
    je = {
      ultra: {
        name: "ultra",
        partK: 1.3,
        outMax: 3,
        smax: 3,
        smin: 2,
        s0: 2.5,
        samples: 4,
        samples3: 2,
        bloom2: !0,
        shadow: 4096,
        trails: !0,
        shimmer: !0,
        flare: !0,
        radial: 12,
        clouds: 2,
        far: 1,
        water: 2,
        streak: 2,
        rays: 16,
        stars: 190,
        glint: 1,
        rig: 1,
        sharp: 0.2,
        dome: 2,
      },
      high: {
        name: "high",
        partK: 1,
        outMax: 3,
        smax: 2.25,
        smin: 1.75,
        s0: 2.25,
        samples: 4,
        samples3: 2,
        bloom2: !0,
        shadow: 2048,
        trails: !0,
        shimmer: !0,
        flare: !0,
        radial: 10,
        clouds: 2,
        far: 1,
        water: 2,
        streak: 2,
        rays: 16,
        stars: 200,
        glint: 1,
        rig: 1,
        sharp: 0.25,
        dome: 2,
      },
      medium: {
        name: "medium",
        partK: 0.7,
        outMax: 2.5,
        smax: 1.9,
        smin: 1.4,
        s0: 1.75,
        samples: 2,
        samples3: 2,
        bloom2: !1,
        shadow: 1024,
        trails: !0,
        shimmer: !1,
        flare: !0,
        radial: 6,
        clouds: 1,
        far: 1,
        water: 1,
        streak: 1,
        rays: 8,
        stars: 80,
        glint: 1,
        rig: 1,
        sharp: 0.3,
        dome: 1,
      },
      low: {
        name: "low",
        partK: 0.5,
        outMax: 2.25,
        smax: 1.4,
        smin: 1,
        s0: 1.25,
        samples: 0,
        samples3: 0,
        bloom2: !1,
        shadow: 512,
        trails: !1,
        shimmer: !1,
        flare: !1,
        radial: 4,
        clouds: 1,
        far: 0,
        water: 0,
        streak: 0,
        rays: 0,
        stars: 0,
        glint: 0,
        rig: 0,
        sharp: 0.45,
        dome: 0,
      },
    },
    Ot = [0.95, 0.205, 0.16],
    ln = [-0.62, -0.1, -0.78],
    _e = {
      harbor: {
        name: "harbor",
        sun: a0,
        sunCol: 16754804,
        sunI: 1.7,
        hemiSky: 9072840,
        hemiGnd: 2364460,
        hemiI: 0.8,
        fillCol: 5938431,
        fillI: 0.6,
        fillPos: [600, 300, 900],
        fog: De.fog,
        fogNear: na,
        fogFar: ra,
        far: 12e3,
        water: !0,
        exposure: 0.92,
        clear: 722464,
      },
      moon: {
        name: "moon",
        sun: Ot,
        sunCol: 10467583,
        sunI: 0.95,
        hemiSky: 3424348,
        hemiGnd: 1053206,
        hemiI: 0.6,
        fillCol: 5953791,
        fillI: 0.4,
        fillPos: [-400, 160, 700],
        fog: [0.02, 0.05, 0.085],
        fogNear: 500,
        fogFar: 9e3,
        far: 17e3,
        water: !1,
        exposure: 0.95,
        clear: 0,
      },
    },
    cn = {
      harbor: {
        rail: [1, 0.78, 0.3],
        amb: [1, 0.62, 0.12],
        lip: [1, 0.85, 0.5],
        skA: [0.25, 0.85, 1],
        skB: [0.9, 0.3, 0.85],
        marker: [1, 0.9, 0.7],
        barrier: [1, 0.62, 0.15],
        top: [0.24, 0.22, 0.34],
        out: [0.14, 0.13, 0.22],
        out2: [0.22, 0.2, 0.32],
        bot: [0.07, 0.06, 0.12],
        rib: [0.3, 0.28, 0.42],
        post: 4867696,
        pylon: 2893892,
        beacon: [0.3, 0.8, 1],
        gantry: [
          [0.26, 0.24, 0.36],
          [0.1, 0.09, 0.16],
          [0.34, 0.32, 0.46],
        ],
        arch: [
          [1, 0.24, 0.78],
          [0.25, 0.94, 1],
        ],
        mast: [0.22, 0.2, 0.3],
        road: {
          a: "#1d1f36",
          b: "#2a2e4d",
          seam: "#121326",
          rivet: "#4b5180",
          center: "#5a66a8",
          centerE: "#26326a",
          lane: "rgba(120,130,200,0.16)",
          edge: "#e8ecff",
          edgeE: "#a8b0ff",
          dash: "#ff3cc8",
          dashE: "#e02aa0",
          lip: "#0c0c18",
          tint: 12104912,
        },
      },
      moon: {
        rail: [0.35, 0.92, 1],
        amb: [0.3, 0.88, 1],
        lip: [0.85, 0.96, 1],
        skA: [0.3, 0.9, 1],
        skB: [1, 1, 1],
        marker: [0.85, 0.97, 1],
        barrier: [0.32, 0.86, 1],
        top: [0.62, 0.64, 0.7],
        out: [0.5, 0.52, 0.58],
        out2: [0.7, 0.72, 0.78],
        bot: [0.16, 0.17, 0.2],
        rib: [0.55, 0.57, 0.64],
        post: 14212326,
        pylon: 10133680,
        beacon: [1, 0.95, 0.85],
        gantry: [
          [0.72, 0.74, 0.8],
          [0.3, 0.32, 0.38],
          [0.88, 0.9, 0.95],
        ],
        arch: [
          [0.3, 0.9, 1],
          [0.62, 0.7, 0.78],
        ],
        mast: [0.75, 0.77, 0.83],
        road: {
          a: "#1e2330",
          b: "#2b3242",
          seam: "#11141c",
          rivet: "#5a6680",
          center: "#bfefff",
          centerE: "#3aa8c8",
          lane: "rgba(150,220,255,0.14)",
          edge: "#f4faff",
          edgeE: "#c8ecff",
          dash: "#30e0ff",
          dashE: "#18b8e8",
          lip: "#0a0c12",
          tint: 12896984,
        },
      },
    },
    _0 = ["low", "medium", "high", "ultra"];
  function dt(t, e) {
    return typeof t == "number" && isFinite(t) ? t : e;
  }
  function ut(t, e, n) {
    return t < e ? e : t > n ? n : t;
  }
  function $t(t) {
    return function () {
      ((t |= 0), (t = (t + 1831565813) | 0));
      let e = Math.imul(t ^ (t >>> 15), 1 | t);
      return ((e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e), ((e ^ (e >>> 14)) >>> 0) / 4294967296);
    };
  }
  function d0(t) {
    return [((t >> 16) & 255) / 255, ((t >> 8) & 255) / 255, (t & 255) / 255];
  }
  function m0(t, e, n) {
    return [t[0] + (e[0] - t[0]) * n, t[1] + (e[1] - t[1]) * n, t[2] + (e[2] - t[2]) * n];
  }
  function Nt(t, e) {
    return [t[0] * e, t[1] * e, t[2] * e];
  }
  function B0(t) {
    return "#" + (t & 16777215).toString(16).padStart(6, "0");
  }
  function Se(t, e, n, a, o) {
    const l = o * o,
      f = l * o;
    return 0.5 * (2 * e + (-t + n) * o + (2 * t - 5 * e + 4 * n - a) * l + (-t + 3 * e - 3 * n + a) * f);
  }
  (function () {
    const t = Oe.SHIPS || [],
      e = [];
    for (let n = 0; n < 6; n++) {
      const a = t[n] || { name: "SHIP" + n, body: 16777215, trim: 3993855, glow: 8058623 },
        o = d0(a.body),
        l = o[0] + o[1] + o[2] > 2.6;
      e.push({
        name: a.name,
        css: B0(l ? a.trim : a.body),
        body: a.body,
        accent: a.trim,
        glow: a.glow,
        cssBody: B0(a.body),
        cssAccent: B0(a.trim),
        cssGlow: B0(a.glow),
      });
    }
    Oe.SHIP_COLORS = e;
  })();
  const sa = `
    float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
    float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
    float fbm(vec2 p, float oct){ float s = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++) { if (float(i) >= oct) break; s += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
      return s; }
`,
    go =
      sa +
      `
    uniform vec3 uSun; uniform float uClouds;
    vec3 skyCol(vec3 d, float t, float stars, float clouds){
      float y = d.y;
      vec3 top = vec3(${De.top.join(",")}), mid = vec3(${De.mid.join(",")}), low = vec3(${De.low.join(",")}), fogc = vec3(${De.fog.join(",")});
      vec3 c;
      if (y > 0.0) {
        c = mix(fogc, low, smoothstep(0.0, 0.035, y));
        c = mix(c, mid, smoothstep(0.03, 0.22, y));
        c = mix(c, top, smoothstep(0.2, 0.75, y));
      } else c = mix(fogc, fogc * 0.35, smoothstep(0.0, -0.25, y));
      vec3 S = normalize(uSun);
      float s = max(dot(d, S), 0.0);
      vec2 dh = normalize(d.xz + vec2(1e-5));
      float sunAz = max(dot(dh, normalize(S.xz)), 0.0);
      c += vec3(1.0, 0.42, 0.22) * pow(sunAz, 4.0) * smoothstep(0.35, 0.0, y) * 0.35;
      float cl = 0.0;
      if (clouds > 0.5 && y > 0.004) {
        vec2 p = d.xz / (y + 0.06);
        float c1 = fbm(p * vec2(0.55, 1.6) + vec2(t * 0.006, 0.0), clouds > 1.5 ? 5.0 : 3.0);
        float m1 = smoothstep(0.5, 0.8, c1) * smoothstep(0.015, 0.08, y) * smoothstep(0.75, 0.2, y);
        vec3 lit1 = mix(vec3(0.7, 0.22, 0.55), vec3(1.9, 0.85, 0.5), pow(sunAz, 3.0) * smoothstep(0.5, 0.05, y));
        c = mix(c, lit1, m1 * 0.6); cl = m1;
        if (clouds > 1.5) {
          vec2 q = d.xz / (y + 0.025) * 0.9 + vec2(-t * 0.012, t * 0.003);
          float c2 = fbm(q, 4.0);
          float m2 = smoothstep(0.52, 0.7, c2) * smoothstep(0.0, 0.025, y) * smoothstep(0.14, 0.03, y);
          vec3 rim = vec3(2.2, 0.8, 0.4) * pow(sunAz, 2.5) * (1.0 - smoothstep(0.52, 0.66, c2));
          c = mix(c, vec3(0.2, 0.06, 0.2) + rim, m2 * 0.9); cl = max(cl, m2);
        }
      }
      c += vec3(1.0, 0.45, 0.25) * pow(s, 7.0) * 0.5 + vec3(1.0, 0.7, 0.4) * pow(s, 70.0) * 0.9;
      c += vec3(4.0, 3.2, 2.2) * smoothstep(0.9993, 0.9997, s) * (1.0 - cl * 0.7);
      if (stars > 0.5 && y > 0.12) {
        vec3 q3 = d * 260.0; vec3 id = floor(q3); float h = hash13(id);
        if (h > 0.985) {
          vec3 f = fract(q3) - 0.5; float dd = dot(f, f);
          float tw = 0.6 + 0.4 * sin(t * (2.0 + h * 9.0) + h * 40.0);
          c += vec3(0.85, 0.9, 1.0) * smoothstep(0.06, 0.0, dd) * tw * smoothstep(0.12, 0.45, y) * (1.0 - cl) * 1.4;
        }
      }
      return c;
    }
`,
    fn =
      sa +
      `
    uniform vec3 uSun; uniform float uClouds;
    const vec3 EARTH = vec3(${(function () {
      const t = Math.hypot(Ot[0], Ot[1], Ot[2]);
      return Ot.map((e) => (e / t).toFixed(5)).join(",");
    })()});
    const vec3 SUNM = vec3(${(function () {
      const t = ln,
        e = Math.hypot(t[0], t[1], t[2]);
      return t.map((n) => (n / e).toFixed(5)).join(",");
    })()});
    float starL(vec3 d, float sc, float th){ vec3 q = d * sc; vec3 id = floor(q); float h = hash13(id); if (h < th) return 0.0;
      vec3 f = fract(q) - 0.5 - (vec3(hash13(id + 7.1), hash13(id + 3.7), hash13(id + 1.3)) - 0.5) * 0.6;
      float px = max(length(fwidth(q)), 1e-4), rr = max(0.07, px * 0.9);          // at least ~2 px wide, energy kept
      return smoothstep(rr, 0.0, length(f)) * (0.35 + 0.65 * (h - th) / (1.0 - th)) * min(1.0, (0.07 * 0.07) / (rr * rr) * 2.2 + 0.25); }
    vec3 earthCol(vec3 d, float t, vec3 S, out float m){
      const float AR = 0.135;                                  // angular radius (~7.7 deg)
      float ce = dot(d, EARTH); m = 0.0;
      if (ce < cos(AR * 1.35)) return vec3(0.0);
      vec3 tx = normalize(cross(vec3(0.0, 1.0, 0.0), EARTH)), ty = cross(EARTH, tx);
      vec2 p = vec2(dot(d, tx), dot(d, ty)) / sin(AR); float r2 = dot(p, p);
      float r = sqrt(r2);
      vec3 c = vec3(0.0);
      if (r2 < 1.0) {
        m = smoothstep(1.0, 0.985, r);
        vec3 n = p.x * tx + p.y * ty - sqrt(1.0 - r2) * EARTH;      // visible hemisphere faces the viewer
        float day = dot(n, S);
        // body frame: axis tilted, slow spin
        float a = t * 0.004 + 1.3; float ca = cos(a), sa = sin(a);
        vec3 b = vec3(p.x * ca - sqrt(1.0 - r2) * sa, p.y, p.x * sa + sqrt(1.0 - r2) * ca);
        float lat = b.y;
        float cont = fbm(b.xy * 2.2 + vec2(b.z * 1.7, 3.1), 5.0) * 0.6 + fbm(b.zy * 2.6 + 9.0, 4.0) * 0.4;
        float land = smoothstep(0.52, 0.56, cont);
        vec3 ocean = mix(vec3(0.015, 0.05, 0.16), vec3(0.03, 0.11, 0.26), smoothstep(0.35, 0.52, cont));
        vec3 ground = mix(vec3(0.16, 0.15, 0.08), vec3(0.07, 0.15, 0.06), smoothstep(0.6, 0.7, fbm(b.xz * 5.0, 3.0)));
        vec3 alb = mix(ocean, ground, land);
        alb = mix(alb, vec3(0.85, 0.9, 0.95), smoothstep(0.8, 0.9, abs(lat)));
        float cl = fbm(vec2(b.x * 3.0 + b.z * 1.4 + t * 0.002, lat * 5.0 + sin(b.x * 4.0) * 0.6), 5.0);
        float cloud = smoothstep(0.5, 0.75, cl);
        alb = mix(alb, vec3(0.95), cloud * 0.9);
        float lit = smoothstep(-0.08, 0.25, day);
        c = alb * lit * 2.4;
        c += vec3(1.0, 0.95, 0.85) * pow(max(dot(reflect(-S, n), -EARTH), 0.0), 40.0) * (1.0 - land) * (1.0 - cloud) * lit * 1.6;   // ocean sun glint
        float night = smoothstep(0.05, -0.15, day);
        c += vec3(1.0, 0.62, 0.25) * step(0.82, hash12(floor(b.xy * 90.0) + floor(b.z * 40.0))) * land * (1.0 - cloud) * night * 0.6;
        float rim = pow(r, 6.0);
        c += vec3(0.25, 0.55, 1.2) * rim * (lit * 1.2 + 0.05) * 1.3;
        c *= m;
      }
      float halo = exp(-max(r - 1.0, 0.0) * 30.0) * step(0.97, r);
      float hl = smoothstep(-0.3, 0.5, dot(normalize(p.x * tx + p.y * ty), S));
      c += vec3(0.2, 0.45, 1.0) * halo * hl * 0.9;
      return c;
    }
    vec3 skyCol(vec3 d, float t, float stars, float clouds){
      float y = d.y;
      vec3 S = SUNM; float s = max(dot(d, S), 0.0) * smoothstep(-0.04, 0.02, y);
      vec3 c = vec3(0.0012, 0.0014, 0.003);
      c += vec3(0.02, 0.05, 0.085) * exp(-abs(y) * 4.0) * 0.9 + vec3(0.006, 0.014, 0.026) * smoothstep(-0.05, 0.4, y);            // lit city glow scattering in the dome glass
      if (y < 0.0) c = mix(c, vec3(0.022, 0.022, 0.026), smoothstep(0.0, -0.06, y));
      float em; vec3 ec = earthCol(d, t, S, em);
      if (stars > 0.5 && y > -0.02) {
        vec3 gp = normalize(vec3(0.3, 0.8, -0.52));
        float g = dot(d, gp), mw = exp(-g * g * 26.0);
        vec3 bx = normalize(cross(gp, vec3(0.0, 0.0, 1.0)));
        vec2 bp = vec2(atan(dot(d, cross(gp, bx)), dot(d, bx)), g);
        float dust = fbm(vec2(bp.x * 5.0, bp.y * 28.0), 4.0);
        c += vec3(0.06, 0.062, 0.085) * mw * (0.3 + dust) * (1.0 - smoothstep(0.55, 0.72, fbm(vec2(bp.x * 9.0, bp.y * 40.0), 3.0)) * 0.8);
        float st = starL(d, 230.0, 0.972) * 1.3 + starL(d, 560.0, 0.982) * (0.45 + mw * 1.8) + starL(d, 95.0, 0.993) * 3.2;
        vec3 sc = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.86, 0.68), hash13(floor(d * 230.0) + 2.0));
        c += sc * st * smoothstep(-0.02, 0.05, y) * (1.0 - em);
      }
      c = c * (1.0 - em) + ec;
      c += vec3(6.0, 5.8, 5.4) * smoothstep(0.99990, 0.99994, s);
      c += vec3(1.0, 0.96, 0.9) * (pow(s, 900.0) * 1.6 + pow(s, 90.0) * 0.12 + pow(s, 10.0) * 0.015);
      return c;
    }
`;
  function un(t) {
    return t === "moon" ? fn : go;
  }
  const Tt = `
#include <fog_pars_vertex>
`,
    Yt = `
#ifdef USE_FOG
      gl_FragColor.rgb *= (1.0 - smoothstep(fogNear, fogFar, vFogDepth));
#endif
`;
  function Re(t) {
    return (
      (t.transparent = !0),
      (t.depthWrite = !1),
      (t.blending = THREE.CustomBlending),
      (t.blendEquation = THREE.AddEquation),
      (t.blendSrc = THREE.OneFactor),
      (t.blendDst = THREE.OneFactor),
      (t.blendEquationAlpha = THREE.AddEquation),
      (t.blendSrcAlpha = THREE.ZeroFactor),
      (t.blendDstAlpha = THREE.OneFactor),
      t
    );
  }
  function p0(t) {
    return (Re(t), (t.blendSrcAlpha = THREE.OneFactor), t);
  }
  function ia(t) {
    return (
      (t.transparent = !0),
      (t.depthWrite = !1),
      (t.blending = THREE.CustomBlending),
      (t.blendEquation = THREE.AddEquation),
      (t.blendSrc = THREE.SrcAlphaFactor),
      (t.blendDst = THREE.OneMinusSrcAlphaFactor),
      (t.blendEquationAlpha = THREE.AddEquation),
      (t.blendSrcAlpha = THREE.ZeroFactor),
      (t.blendDstAlpha = THREE.OneFactor),
      t
    );
  }
  const n0 = 0.11;
  function Et() {
    ((this.nv = 0), (this.ni = 0), (this.k = 0), (this.useK = !1), (this.P = null), this._grow(2048), this._growI(6144));
  }
  ((Et.prototype._grow = function (t) {
    const e = (n, a, o) => {
      const l = new a(t * o);
      return (n && l.set(n.subarray(0, this.nv * o)), l);
    };
    ((this.P = e(this.P, Float32Array, 3)),
      (this.N = e(this.N, Float32Array, 3)),
      (this.C = e(this.C, Float32Array, 3)),
      (this.UV = e(this.UV, Float32Array, 2)),
      (this.K = e(this.K, Uint8Array, 1)),
      (this.cap = t));
  }),
    (Et.prototype._growI = function (t) {
      const e = new Uint32Array(t);
      (this.I && e.set(this.I.subarray(0, this.ni)), (this.I = e));
    }));
  function W0(t, e, n) {
    const a = e[0] - t[0],
      o = e[1] - t[1],
      l = e[2] - t[2],
      f = n[0] - t[0],
      u = n[1] - t[1],
      r = n[2] - t[2];
    let c = o * r - l * u,
      h = l * f - a * r,
      v = a * u - o * f;
    const i = Math.hypot(c, h, v) || 1;
    return [c / i, h / i, v / i];
  }
  function xo(t) {
    const e = Math.abs(t[0]),
      n = Math.abs(t[1]),
      a = Math.abs(t[2]);
    return e > n && e > a ? 0 : n > a ? 1 : 2;
  }
  ((Et.prototype.vtx = function (t, e, n, a) {
    this.nv >= this.cap && this._grow(this.cap * 2);
    const o = this.nv++,
      l = o * 3,
      f = this.P,
      u = this.N,
      r = this.C;
    ((f[l] = t[0]),
      (f[l + 1] = t[1]),
      (f[l + 2] = t[2]),
      (u[l] = e[0]),
      (u[l + 1] = e[1]),
      (u[l + 2] = e[2]),
      (r[l] = n[0]),
      (r[l + 1] = n[1]),
      (r[l + 2] = n[2]),
      this.useK && (this.K[o] = this.k));
    const c = this.UV,
      h = o * 2;
    return (
      a === 0
        ? ((c[h] = t[2] * n0), (c[h + 1] = t[1] * n0))
        : a === 1
          ? ((c[h] = t[0] * n0), (c[h + 1] = t[2] * n0))
          : ((c[h] = t[0] * n0), (c[h + 1] = t[1] * n0)),
      o
    );
  }),
    (Et.prototype._idx = function (t, e, n) {
      this.ni + 3 > this.I.length && this._growI(this.I.length * 2);
      const a = this.I,
        o = this.ni;
      ((a[o] = t), (a[o + 1] = e), (a[o + 2] = n), (this.ni += 3));
    }),
    (Et.prototype.tri = function (t, e, n, a) {
      let o = W0(t, e, n);
      const l = this.ref;
      if (l) {
        const u = (t[0] + e[0] + n[0]) / 3 - l[0],
          r = (t[1] + e[1] + n[1]) / 3 - l[1],
          c = (t[2] + e[2] + n[2]) / 3 - l[2];
        if (o[0] * u + o[1] * r + o[2] * c < 0) {
          const h = e;
          ((e = n), (n = h), (o = [-o[0], -o[1], -o[2]]));
        }
      }
      const f = xo(o);
      this._idx(this.vtx(t, o, a, f), this.vtx(e, o, a, f), this.vtx(n, o, a, f));
    }),
    (Et.prototype.triS = function (t, e, n, a, o, l, f) {
      const u = W0(t, e, n);
      if (u[0] * (a[0] + o[0] + l[0]) + u[1] * (a[1] + o[1] + l[1]) + u[2] * (a[2] + o[2] + l[2]) < 0) {
        let c = e;
        ((e = n), (n = c), (c = o), (o = l), (l = c));
      }
      const r = xo(u);
      this._idx(this.vtx(t, a, f, r), this.vtx(e, o, f, r), this.vtx(n, l, f, r));
    }),
    (Et.prototype.quad = function (t, e, n, a, o) {
      let l = W0(t, e, n);
      const f = this.ref;
      if (f) {
        const i = (t[0] + e[0] + n[0] + a[0]) / 4 - f[0],
          s = (t[1] + e[1] + n[1] + a[1]) / 4 - f[1],
          d = (t[2] + e[2] + n[2] + a[2]) / 4 - f[2];
        if (l[0] * i + l[1] * s + l[2] * d < 0) {
          const m = e;
          ((e = a), (a = m), (l = [-l[0], -l[1], -l[2]]));
        }
      }
      const u = xo(l),
        r = this.vtx(t, l, o, u),
        c = this.vtx(e, l, o, u),
        h = this.vtx(n, l, o, u),
        v = this.vtx(a, l, o, u);
      (this._idx(r, c, h), this._idx(r, h, v));
    }),
    (Et.prototype.tris = function () {
      return this.ni / 3;
    }),
    (Et.prototype._make = function (t, e) {
      e = e || {};
      const n = this.nv,
        a = t || this.I.subarray(0, this.ni),
        o = a.length;
      let l = null,
        f = n,
        u;
      if (t) {
        const h = this._rm || (this._rm = new Int32Array(n));
        ((l = new Int32Array(Math.min(o, n))), (f = 0));
        const v = new Uint32Array(o);
        for (let i = 0; i < o; i++) {
          const s = a[i];
          let d = h[s];
          (d || ((l[f] = s), (d = h[s] = ++f)), (v[i] = d - 1));
        }
        for (let i = 0; i < f; i++) h[l[i]] = 0;
        u = f < 65536 ? Uint16Array.from(v) : v;
      } else u = f < 65536 ? Uint16Array.from(a) : Uint32Array.from(a);
      const r = (h, v, i) => {
          if (!l) return h.slice(0, f * v);
          for (let s = 0; s < f; s++) {
            const d = l[s] * v,
              m = s * v;
            for (let g = 0; g < v; g++) i[m + g] = h[d + g];
          }
          return i;
        },
        c = new THREE.BufferGeometry();
      if ((c.setAttribute("position", new THREE.BufferAttribute(r(this.P, 3, new Float32Array(f * 3)), 3)), e.normal !== !1)) {
        const h = r(this.N, 3, new Float32Array(f * 3));
        if (e.pack === !1) c.setAttribute("normal", new THREE.BufferAttribute(h, 3));
        else {
          const v = new Int8Array(f * 3);
          for (let i = 0; i < v.length; i++) v[i] = Math.round(h[i] * 127);
          c.setAttribute("normal", new THREE.BufferAttribute(v, 3, !0));
        }
      }
      {
        const h = r(this.C, 3, new Float32Array(f * 3));
        let v = 0;
        for (let i = 0; i < h.length; i++) h[i] > v && (v = h[i]);
        if (e.pack === !1) c.setAttribute("color", new THREE.BufferAttribute(h, 3));
        else if (v <= 1.0001) {
          const i = new Uint8Array(f * 3);
          for (let s = 0; s < i.length; s++) i[s] = Math.round(Math.min(1, Math.max(0, h[s])) * 255);
          c.setAttribute("color", new THREE.BufferAttribute(i, 3, !0));
        } else {
          const i = new Uint16Array(f * 3),
            s = THREE.DataUtils.toHalfFloat;
          for (let d = 0; d < i.length; d++) i[d] = s(h[d]);
          c.setAttribute("color", new THREE.Float16BufferAttribute(i, 3));
        }
      }
      if ((e.uv !== !1 && c.setAttribute("uv", new THREE.BufferAttribute(r(this.UV, 2, new Float32Array(f * 2)), 2)), this.useK)) {
        const h = r(this.K, 1, new Uint8Array(f));
        c.setAttribute("aK", new THREE.BufferAttribute(h, 1));
      }
      return (c.setIndex(new THREE.BufferAttribute(u, 1)), c.computeBoundingSphere(), c);
    }),
    (Et.prototype.geo = function (t) {
      return this._make(null, t);
    }),
    (Et.prototype.split = function (t, e) {
      const n = this.ni / 3,
        a = this.P,
        o = this.I;
      let l = 1e30,
        f = 1e30;
      for (let v = 0; v < this.nv; v++) {
        const i = a[v * 3],
          s = a[v * 3 + 2];
        (i < l && (l = i), s < f && (f = s));
      }
      const u = new Int32Array(n),
        r = new Map();
      for (let v = 0; v < n; v++) {
        const i = o[v * 3] * 3,
          s = o[v * 3 + 1] * 3,
          d = o[v * 3 + 2] * 3,
          m = Math.floor(((a[i] + a[s] + a[d]) / 3 - l) / t),
          g = Math.floor(((a[i + 2] + a[s + 2] + a[d + 2]) / 3 - f) / t),
          p = m * 4096 + g;
        ((u[v] = p), r.set(p, (r.get(p) || 0) + 1));
      }
      const c = [],
        h = new Map();
      for (const [v, i] of r) h.set(v, { n: i, w: 0, sel: new Uint32Array(i * 3) });
      for (let v = 0; v < n; v++) {
        const i = h.get(u[v]);
        ((i.sel[i.w++] = o[v * 3]), (i.sel[i.w++] = o[v * 3 + 1]), (i.sel[i.w++] = o[v * 3 + 2]));
      }
      for (const [, v] of h) c.push(this._make(v.sel, e));
      return c;
    }),
    (Et.prototype.loftS = function (t, e, n, a) {
      const o = t.length,
        l = t[0].length,
        f = [];
      for (let c = 0; c < o; c++) {
        const h = [],
          v = t[c];
        let i = 0,
          s = 0,
          d = 0;
        for (let m = 0; m < l; m++) ((i += v[m][0]), (s += v[m][1]), (d += v[m][2]));
        ((i /= l), (s /= l), (d /= l));
        for (let m = 0; m < l; m++) {
          const g = v[m],
            p = v[(m + 1) % l],
            w = v[(m - 1 + l) % l],
            C = t[Math.min(o - 1, c + 1)][m],
            D = t[Math.max(0, c - 1)][m],
            x = p[0] - w[0],
            H = p[1] - w[1],
            U = p[2] - w[2],
            E = C[0] - D[0],
            y = C[1] - D[1],
            T = C[2] - D[2];
          let M = H * T - U * y,
            S = U * E - x * T,
            z = x * y - H * E,
            B = Math.hypot(M, S, z);
          (B < 1e-6 && ((M = g[0] - i), (S = g[1] - s), (z = g[2] - d), (B = Math.hypot(M, S, z) || 1)),
            (M /= B),
            (S /= B),
            (z /= B),
            M * (g[0] - i) + S * (g[1] - s) + z * (g[2] - d) < 0 && ((M = -M), (S = -S), (z = -z)),
            h.push([M, S, z]));
        }
        f.push(h);
      }
      for (let c = 0; c < o - 1; c++)
        for (let h = 0; h < l; h++) {
          const v = (h + 1) % l,
            i = e(c, h),
            s = t[c][h],
            d = t[c][v],
            m = t[c + 1][v],
            g = t[c + 1][h];
          (this.triS(s, d, m, f[c][h], f[c][v], f[c + 1][v], i), this.triS(s, m, g, f[c][h], f[c + 1][v], f[c + 1][h], i));
        }
      const u = (c) => {
          let h = 0,
            v = 0,
            i = 0;
          for (const s of c) ((h += s[0]), (v += s[1]), (i += s[2]));
          return [h / l, v / l, i / l];
        },
        r = (c, h, v) => {
          const i = u(c),
            s = this.ref;
          this.ref = u(h);
          for (let d = 0; d < l; d++) this.tri(i, c[d], c[(d + 1) % l], v);
          this.ref = s;
        };
      (n && r(t[o - 1], t[o - 2], n), a && r(t[0], t[1], a));
    }),
    (Et.prototype.slabB = function (t, e, n, a, o, l, f) {
      const u = t.length;
      let r = 0,
        c = 0;
      for (const g of t) ((r += g[0]), (c += g[1]));
      ((r /= u), (c /= u));
      const h = t.map((g) => {
          const p = g[0] - r,
            w = g[1] - c,
            C = Math.hypot(p, w) || 1,
            D = Math.min(a, C * 0.4) / C;
          return [g[0] - p * D, g[1] - w * D];
        }),
        v = this.ref;
      this.ref = e(r, c, 0);
      const i = h.map((g) => e(g[0], g[1], n * 0.5)),
        s = t.map((g) => e(g[0], g[1], n * 0.18)),
        d = t.map((g) => e(g[0], g[1], -n * 0.18)),
        m = h.map((g) => e(g[0], g[1], -n * 0.5));
      for (let g = 1; g < u - 1; g++) (this.tri(i[0], i[g], i[g + 1], o), this.tri(m[0], m[g + 1], m[g], f));
      for (let g = 0; g < u; g++) {
        const p = (g + 1) % u;
        (this.quad(i[g], s[g], s[p], i[p], l),
          this.quad(s[g], d[g], d[p], s[p], Nt(l, 0.65)),
          this.quad(d[g], m[g], m[p], d[p], Nt(f, 1.2)));
      }
      this.ref = v;
    }),
    (Et.prototype.obox = function (t, e, n, a, o, l, f, u, r) {
      const c = (i, s, d) => [
          t[0] + e[0] * i + n[0] * s + a[0] * d,
          t[1] + e[1] * i + n[1] * s + a[1] * d,
          t[2] + e[2] * i + n[2] * s + a[2] * d,
        ],
        h = [c(-o, -l, -f), c(o, -l, -f), c(o, -l, f), c(-o, -l, f), c(-o, l, -f), c(o, l, -f), c(o, l, f), c(-o, l, f)],
        v = this.ref;
      ((this.ref = t),
        this.quad(h[4], h[7], h[6], h[5], r || u),
        this.quad(h[0], h[1], h[2], h[3], Nt(u, 0.6)),
        this.quad(h[0], h[4], h[5], h[1], u),
        this.quad(h[2], h[6], h[7], h[3], u),
        this.quad(h[1], h[5], h[6], h[2], Nt(u, 0.85)),
        this.quad(h[3], h[7], h[4], h[0], Nt(u, 0.85)),
        (this.ref = v));
    }));
  const Ft = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1] };
  function la(t, e, n) {
    const a = new Uint8Array(e * e * 4);
    for (let o = 0; o < e; o++)
      for (let l = 0; l < e; l++) {
        const f = (l - 1 + e) % e,
          u = (l + 1) % e,
          r = (o - 1 + e) % e,
          c = (o + 1) % e,
          h = (t[o * e + u] - t[o * e + f]) * n,
          v = (t[c * e + l] - t[r * e + l]) * n,
          i = Math.hypot(h, v, 1),
          s = (o * e + l) * 4;
        ((a[s] = ((-h / i) * 0.5 + 0.5) * 255),
          (a[s + 1] = ((v / i) * 0.5 + 0.5) * 255),
          (a[s + 2] = ((1 / i) * 0.5 + 0.5) * 255),
          (a[s + 3] = 255));
      }
    return a;
  }
  function hn(t, e, n, a) {
    const o = new Uint8Array(e * n * 4);
    for (let l = 0; l < n; l++) {
      const f = ((l - 1 + n) % n) * e,
        u = ((l + 1) % n) * e,
        r = l * e;
      for (let c = 0; c < e; c++) {
        const h = c > 0 ? c - 1 : c,
          v = c < e - 1 ? c + 1 : c,
          i = (t[r + v] - t[r + h]) * a,
          s = (t[u + c] - t[f + c]) * a,
          d = Math.sqrt(i * i + s * s + 1),
          m = (r + c) * 4;
        ((o[m] = ((-i / d) * 0.5 + 0.5) * 255),
          (o[m + 1] = ((s / d) * 0.5 + 0.5) * 255),
          (o[m + 2] = ((1 / d) * 0.5 + 0.5) * 255),
          (o[m + 3] = 255));
      }
    }
    return o;
  }
  function L0(t, e, n, a) {
    const o = new THREE.DataTexture(t, e, a || e, THREE.RGBAFormat);
    return (
      (o.wrapS = o.wrapT = n ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping),
      (o.magFilter = THREE.LinearFilter),
      (o.minFilter = THREE.LinearMipmapLinearFilter),
      (o.generateMipmaps = !0),
      (o.needsUpdate = !0),
      o
    );
  }
  let Be = null;
  function g0() {
    if (Be) return Be;
    const t = 512,
      e = new Float32Array(t * t).fill(0.5),
      n = new Float32Array(t * t).fill(0.88),
      a = $t(901),
      o = (u, r, c, h, v, i) => {
        for (let s = r; s < h; s++)
          for (let d = u; d < c; d++) {
            const m = ((s + t) % t) * t + ((d + t) % t);
            (v !== null && (e[m] = v(e[m], d, s)), i !== null && (n[m] = i(n[m], d, s)));
          }
      };
    function l(u, r, c, h, v) {
      const i = c - u,
        s = h - r;
      if (v > 4 || (i < 70 && s < 70) || (v > 1 && a() < 0.18)) {
        const d = (a() - 0.5) * 0.12,
          m = (a() - 0.5) * 0.07;
        if (
          (o(
            u + 2,
            r + 2,
            c - 2,
            h - 2,
            (g) => g + d,
            (g) => g + m,
          ),
          o(
            u,
            r,
            c,
            r + 2,
            () => 0.15,
            () => 0.5,
          ),
          o(
            u,
            r,
            u + 2,
            h,
            () => 0.15,
            () => 0.5,
          ),
          a() < 0.4)
        )
          for (let g = u + 6; g < c - 4; g += 9)
            o(
              g,
              r + 5,
              g + 2,
              r + 7,
              () => 0.85,
              () => 1,
            );
        if (a() < 0.18 && i > 40 && s > 30)
          for (let g = r + 8; g < h - 8; g += 5)
            o(
              u + 8,
              g,
              c - 8,
              g + 2,
              () => 0.25,
              () => 0.45,
            );
        return;
      }
      if (i > s) {
        const d = u + Math.round(i * (0.3 + a() * 0.4));
        (l(u, r, d, h, v + 1), l(d, r, c, h, v + 1));
      } else {
        const d = r + Math.round(s * (0.3 + a() * 0.4));
        (l(u, r, c, d, v + 1), l(u, d, c, h, v + 1));
      }
    }
    l(0, 0, t, t, 0);
    for (let u = 0; u < t * t; u++) {
      const r = a();
      ((e[u] += (r - 0.5) * 0.02), (n[u] += (r - 0.5) * 0.05));
    }
    const f = new Uint8Array(t * t * 4);
    for (let u = 0; u < t * t; u++) {
      const r = ut(n[u], 0, 1) * 255;
      ((f[u * 4] = r), (f[u * 4 + 1] = r), (f[u * 4 + 2] = r), (f[u * 4 + 3] = 255));
    }
    return (
      (Be = { alb: L0(f, t, !0), nrm: L0(la(e, t, 6), t, !0) }),
      (Be.alb.userData.shared = Be.nrm.userData.shared = !0),
      (Be.alb.anisotropy = Be.nrm.anisotropy = pe),
      Be
    );
  }
  const ca = {
    wedge: [
      [-0.03, 0.34, 2.2, 0.55, 0.5],
      [0, 0.42, 2.4, 0.4, 0.5],
      [0.3, 0.5, 2.7, 0.3, 0.5],
      [0.65, 0.36, 1.9, 0.35, 0.5],
      [0.9, 0.2, 1.1, 0.42, 0.5],
      [1, 0.06, 0.7, 0.48, 0.5],
    ],
    needle: [
      [-0.03, 0.3, 2.3, 0.6, 0.6],
      [0, 0.36, 2.5, 0.5, 0.6],
      [0.28, 0.42, 2.7, 0.4, 0.6],
      [0.62, 0.26, 2, 0.5, 0.6],
      [0.85, 0.12, 1.3, 0.6, 0.6],
      [1.08, 0.02, 0.92, 0.8, 0.6],
    ],
    blunt: [
      [-0.03, 0.44, 2.7, 0.45, 0.4],
      [0, 0.5, 2.9, 0.3, 0.4],
      [0.3, 0.56, 3.1, 0.3, 0.4],
      [0.75, 0.5, 2.6, 0.35, 0.4],
      [0.93, 0.42, 2, 0.4, 0.4],
      [1, 0.3, 1.2, 0.5, 0.4],
    ],
    round: [
      [-0.03, 0.34, 2.4, 0.55, 0.8],
      [0, 0.4, 2.6, 0.4, 0.8],
      [0.25, 0.48, 3, 0.3, 0.8],
      [0.55, 0.44, 2.8, 0.35, 0.8],
      [0.78, 0.32, 2.2, 0.45, 0.8],
      [0.93, 0.17, 1.5, 0.6, 0.8],
      [1, 0.04, 1, 0.85, 0.8],
    ],
  };
  function x0(t, e) {
    let n = 0;
    for (; n < t.length - 2 && e > t[n + 1][0];) n++;
    const a = t[Math.max(0, n - 1)],
      o = t[n],
      l = t[n + 1],
      f = t[Math.min(t.length - 1, n + 2)],
      u = ut((e - o[0]) / (l[0] - o[0]), 0, 1),
      r = [];
    for (let c = 1; c < 5; c++) r.push(Se(a[c], o[c], l[c], f[c], u));
    return r;
  }
  function yo(t, e, n, a, o, l, f, u) {
    const r = [],
      c = (n + a) * 0.5,
      h = (n - a) * 0.5;
    for (let v = 0; v < l; v++) {
      const i = (v * X) / l,
        s = Math.sin(i),
        d = Math.cos(i);
      r.push([t, (u || 0) + c + h * Math.sign(d) * Math.pow(Math.abs(d), o), (f || 0) + e * Math.sign(s) * Math.pow(Math.abs(s), o)]);
    }
    return r;
  }
  function vn(t, e, n, a, o, l, f) {
    const u = [];
    for (let r = 0; r < e.length; r++) {
      const c = [];
      for (let h = 0; h < l; h++) {
        const v = (h * X) / l;
        c.push([e[r], a + Math.cos(v) * n[r], o + Math.sin(v) * n[r]]);
      }
      u.push(c);
    }
    return (t.loftS(u, f, null, null), u);
  }
  const Mo = {};
  function fa(t) {
    if (Mo[t]) return Mo[t];
    const e = Oe.shipById ? Oe.shipById(t) : (Oe.SHIPS && Oe.SHIPS[t]) || { body: 16777215, trim: 3993855, glow: 8058623, model: {} },
      n = e.model || {},
      a = 16 * dt(n.len, 1),
      o = 5.6 * dt(n.wid, 1),
      l = n.fins || "twin",
      f = n.nose || "wedge",
      u = d0(e.body),
      r = d0(e.trim),
      c = d0(e.glow),
      h = m0(Nt(u, 0.3), [0.07, 0.07, 0.1], 0.55),
      v = [0.2, 0.2, 0.26],
      i = [0.06, 0.06, 0.09],
      s = [0.03, 0.05, 0.12],
      d = Nt(u, 0.74),
      m = [1, 1, 1],
      g = [1, 0.12, 0.16],
      p = new Et(),
      w = new Et(),
      C = [],
      D = [],
      x = -a / 2,
      H = ca[f] || ca.wedge,
      U = H[H.length - 1][0],
      E = H[0][0],
      y = 20,
      T = 22,
      M = [],
      S = [];
    for (let P = 0; P < T; P++) {
      const V = P / (T - 1),
        q = E + (U - E) * (1 - Math.pow(1 - V, 1.25)),
        O = x0(H, q);
      (M.push(yo(x + a * q, o * O[0], O[1], O[2], O[3], y)), S.push(q));
    }
    const z = f === "blunt" ? 0.42 : 0.22;
    p.loftS(
      M,
      (P, V) => {
        const q = (V * X) / y,
          O = Math.cos(q),
          I = Math.sin(q),
          K = S[P];
        return (K > 0.6 && K < 0.64) || (O > 0 && Math.abs(I) < z && Math.abs(I) > (f === "blunt" ? 0.18 : -1))
          ? r
          : O < -0.55
            ? h
            : O < -0.05
              ? d
              : K > 0.95
                ? r
                : u;
      },
      r,
      i,
    );
    const B = (P) => x0(H, P)[1],
      b = (P) => o * x0(H, P)[0];
    {
      const P = [];
      for (let K = 0; K < 12; K++) {
        const lt = K / 11,
          it = 0.36 + (0.72 - 0.36) * lt,
          rt = Math.sin(Math.PI * Math.pow(lt, 0.8)),
          J = B(it) - 0.55;
        P.push(yo(x + a * it, o * (0.04 + 0.15 * rt), J + 0.4 + 1.25 * rt, J, 0.7, 16));
      }
      p.loftS(P, (K, lt) => ((K === 0 || K === 10 || K === 5) && Math.cos((lt * X) / 16) > -0.2 ? m0(r, v, 0.3) : s), s, s);
    }
    for (const P of [1, -1]) {
      const q = x + a * 0.46,
        O = b(0.46),
        I = 1.25,
        K = a * 0.13;
      (p.obox([q, I, P * (O * 0.93)], Ft.X, Ft.Y, Ft.Z, K * 0.5, 0.62, 0.42, v, d),
        p.obox([q + K * 0.05, I, P * (O * 0.93 + 0.36)], Ft.X, Ft.Y, Ft.Z, K * 0.4, 0.42, 0.08, i),
        w.quad(
          [q - K * 0.32, I - 0.1, P * (O * 0.93 + 0.45)],
          [q + K * 0.42, I - 0.1, P * (O * 0.93 + 0.45)],
          [q + K * 0.42, I + 0.1, P * (O * 0.93 + 0.45)],
          [q - K * 0.32, I + 0.1, P * (O * 0.93 + 0.45)],
          c,
        ));
      for (let lt = 0; lt < 4; lt++) {
        const it = q - K * 0.75 - lt * 0.55;
        p.obox([it, I + 0.1, P * (b(0.46 - 0.06 - lt * 0.03) * 0.95)], Ft.X, Ft.Y, Ft.Z, 0.18, 0.4, 0.2, i);
      }
    }
    (p.obox([x + a * 0.16, B(0.16) + 0.9, 0], Ft.X, Ft.Y, Ft.Z, 0.12, 1, 0.08, v),
      w.quad(
        [x + a * 0.16 - 0.1, B(0.16) + 1.9, 0.09],
        [x + a * 0.16 + 0.1, B(0.16) + 1.9, 0.09],
        [x + a * 0.16 + 0.1, B(0.16) + 2.1, 0.09],
        [x + a * 0.16 - 0.1, B(0.16) + 2.1, 0.09],
        g,
      ));
    {
      const P = x - 0.06 - a * 0.025,
        V = b(0) * 0.62,
        q = B(0) - 0.55;
      for (const O of [1, -1])
        (w.quad([P, q - 0.22, O * V * 0.25], [P, q - 0.22, O * V], [P, q + 0.22, O * V], [P, q + 0.22, O * V * 0.25], g),
          D.push([P - 0.1, q, O * V * 0.62]));
    }
    for (const P of [1, -1]) {
      const q = x + a * 0.86,
        O = b(0.86),
        I = (x0(H, 0.86)[1] + x0(H, 0.86)[2]) * 0.5;
      w.quad(
        [q - 0.5, I - 0.1, P * (O + 0.03)],
        [q + 0.5, I - 0.1, P * (O + 0.03)],
        [q + 0.5, I + 0.14, P * (O + 0.03)],
        [q - 0.5, I + 0.14, P * (O + 0.03)],
        m,
      );
    }
    for (const P of [1, -1])
      for (let I = 0; I < 6; I++) {
        const K = 0.2 + (0.46 * I) / 6,
          lt = 0.2 + ((0.66 - 0.2) * (I + 0.85)) / 6;
        (K > 0.4 && K < 0.56) ||
          w.quad(
            [x + a * K, 1.2 - 0.13, P * (b(K) + 0.04)],
            [x + a * lt, 1.2 - 0.13, P * (b(lt) + 0.04)],
            [x + a * lt, 1.2 + 0.13, P * (b(lt) + 0.04)],
            [x + a * K, 1.2 + 0.13, P * (b(K) + 0.04)],
            c,
          );
      }
    function F(P, V, q, O, I) {
      const K = [P, P + 0.15, P + 0.5, P + (V - P) * 0.35, P + (V - P) * 0.75, V - 0.2, V],
        lt = [I * 0.88, I * 1.02, I * 1.06, I, I * 0.96, I * 0.86, I * 0.6];
      vn(p, K, lt, q, O, 18, (J) => (J === 1 ? r : J === 3 ? m0(v, u, 0.4) : J === 5 ? d : v));
      const it = [V + 0.05, q, O];
      p.ref = [(P + V) / 2, q, O];
      for (let J = 0; J < 18; J++) {
        const Z = (J * X) / 18,
          $ = ((J + 1) * X) / 18;
        p.tri(it, [V, q + Math.cos($) * I * 0.6, O + Math.sin($) * I * 0.6], [V, q + Math.cos(Z) * I * 0.6, O + Math.sin(Z) * I * 0.6], d);
      }
      p.ref = null;
      const rt = P + 0.45;
      for (let J = 0; J < 18; J++) {
        const Z = (J * X) / 18,
          $ = ((J + 1) * X) / 18;
        (p.quad(
          [P, q + Math.cos(Z) * I * 0.88, O + Math.sin(Z) * I * 0.88],
          [P, q + Math.cos($) * I * 0.88, O + Math.sin($) * I * 0.88],
          [rt, q + Math.cos($) * I * 0.62, O + Math.sin($) * I * 0.62],
          [rt, q + Math.cos(Z) * I * 0.62, O + Math.sin(Z) * I * 0.62],
          i,
        ),
          w.tri(
            [rt + 0.02, q, O],
            [rt + 0.02, q + Math.cos(Z) * I * 0.64, O + Math.sin(Z) * I * 0.64],
            [rt + 0.02, q + Math.cos($) * I * 0.64, O + Math.sin($) * I * 0.64],
            J & 1 ? m : m0(m, c, 0.4),
          ),
          w.quad(
            [P - 0.02, q + Math.cos(Z) * I * 0.9, O + Math.sin(Z) * I * 0.9],
            [P - 0.02, q + Math.cos($) * I * 0.9, O + Math.sin($) * I * 0.9],
            [P - 0.02, q + Math.cos($) * I * 0.98, O + Math.sin($) * I * 0.98],
            [P - 0.02, q + Math.cos(Z) * I * 0.98, O + Math.sin(Z) * I * 0.98],
            c,
          ));
      }
      for (let J = 0; J < 7; J++) {
        const Z = (J * X) / 7 + 0.2,
          $ = Math.cos(Z),
          yt = Math.sin(Z),
          Rt = Math.cos(Z + 0.18),
          ie = Math.sin(Z + 0.18),
          be = rt - 0.12;
        p.quad(
          [be, q + $ * I * 0.12, O + yt * I * 0.12],
          [be, q + $ * I * 0.66, O + yt * I * 0.66],
          [be, q + Rt * I * 0.66, O + ie * I * 0.66],
          [be, q + Rt * I * 0.12, O + ie * I * 0.12],
          i,
        );
      }
      C.push([P, q, O, I]);
    }
    function _(P, V, q, O, I, K, lt) {
      for (const it of K ? [1, -1] : [1]) {
        const rt = O * it + 0.03 * it;
        w.quad([P, q - I, rt], [V, q - I, rt], [V, q + I, rt], [P, q + I, rt], lt || c);
      }
    }
    const R = (P, V) => (q, O, I) => [q, P + I, O * V],
      A = (P, V) => (q, O, I) => [q, O, P * V + I * V];
    if (l === "twin")
      for (const P of [1, -1])
        (p.slabB(
          [
            [x + a * 0.56, o * 0.3],
            [x + a * 0.32, o * 1.02],
            [x + a * 0.08, o * 1.02],
            [x + a * 0.05, o * 0.3],
          ],
          R(1.2, P),
          0.5,
          0.25,
          u,
          r,
          h,
        ),
          p.slabB(
            [
              [x + a * 0, 2.1],
              [x + a * 0.22, 2.1],
              [x + a * 0.1, 5.7],
              [x - a * 0.03, 5.7],
            ],
            A(o * 0.72, P),
            0.4,
            0.14,
            r,
            d,
            d,
          ),
          p.slabB(
            [
              [x + a * 0.12, o * 1],
              [x + a * 0.3, o * 1],
              [x + a * 0.3, o * 1.12],
              [x + a * 0.12, o * 1.12],
            ],
            R(1.2, P),
            0.9,
            0.12,
            v,
            v,
            i,
          ),
          w.quad(
            [x + a * 0.12, 1.45, P * o * 1.13],
            [x + a * 0.3, 1.45, P * o * 1.13],
            [x + a * 0.3, 0.95, P * o * 1.13],
            [x + a * 0.12, 0.95, P * o * 1.13],
            c,
          ),
          w.quad(
            [x - a * 0.03, 5.75, P * (o * 0.72 + 0.22)],
            [x + a * 0.1, 5.75, P * (o * 0.72 + 0.22)],
            [x + a * 0.08, 5.3, P * (o * 0.72 + 0.22)],
            [x - a * 0.02, 5.3, P * (o * 0.72 + 0.22)],
            c,
          ),
          F(x - 0.4, x + a * 0.36, 1.25, P * o * 0.52, 1.15));
    else if (l === "swept") {
      for (const P of [1, -1])
        (p.slabB(
          [
            [x + a * 0.64, o * 0.22],
            [x + a * 0.14, o * 1.1],
            [x + a * 0.02, o * 1.1],
            [x + a * 0.1, o * 0.22],
          ],
          R(1, P),
          0.36,
          0.2,
          u,
          r,
          h,
        ),
          p.slabB(
            [
              [x + a * 0.2, o * 1.14],
              [x - a * 0.03, o * 1.14],
              [x - a * 0.03, o * 0.96],
              [x + a * 0.2, o * 0.96],
            ],
            R(1, P),
            0.7,
            0.12,
            r,
            v,
            i,
          ),
          w.quad(
            [x - a * 0.02, 1.32, P * o * 1.15],
            [x + a * 0.19, 1.32, P * o * 1.15],
            [x + a * 0.19, 0.68, P * o * 1.15],
            [x - a * 0.02, 0.68, P * o * 1.15],
            c,
          ),
          p.slabB(
            [
              [x + a * 0.8, o * 0.2],
              [x + a * 0.72, o * 0.45],
              [x + a * 0.66, o * 0.45],
              [x + a * 0.68, o * 0.2],
            ],
            R(1.1, P),
            0.2,
            0.06,
            r,
            d,
            h,
          ));
      (p.slabB(
        [
          [x + a * 0, 2.3],
          [x + a * 0.34, 2.3],
          [x + a * 0.1, 6.6],
          [x - a * 0.05, 6.6],
        ],
        A(0, 1),
        0.45,
        0.15,
        r,
        d,
        d,
      ),
        w.quad([x - a * 0.05, 6.66, 0.25], [x + a * 0.1, 6.66, 0.25], [x + a * 0.08, 6.1, 0.25], [x - a * 0.04, 6.1, 0.25], c),
        w.quad([x + a * 0.1, 6.66, -0.25], [x - a * 0.05, 6.66, -0.25], [x - a * 0.04, 6.1, -0.25], [x + a * 0.08, 6.1, -0.25], c),
        F(x - 0.5, x + a * 0.32, 1.5, 0, 1.6));
    } else if (l === "pods") {
      for (const P of [1, -1]) {
        const V = o * 0.84 * P,
          q = o * 0.25,
          O = [],
          I = [
            [-0.03, 0.85, 2.5, 0.3],
            [0, 1, 2.7, 0.15],
            [0.2, 1.1, 2.95, 0.1],
            [0.55, 1.05, 2.8, 0.15],
            [0.75, 0.95, 2.55, 0.25],
            [0.86, 0.7, 1.9, 0.45],
            [0.9, 0.4, 1.5, 0.6],
          ];
        for (const K of I) O.push(yo(x + a * K[0], q * K[1], K[2], K[3], 0.38, 16, V));
        (p.loftS(
          O,
          (K, lt) => {
            const it = Math.cos((lt * X) / 16),
              rt = Math.sin((lt * X) / 16) * P;
            return K === 2 || (it > 0.3 && rt < -0.2) ? r : it < -0.5 ? h : d;
          },
          r,
          i,
        ),
          F(x - 0.55, x + a * 0.2, 1.95, V, 0.85),
          F(x - 0.55, x + a * 0.2, 0.78, V, 0.62),
          _(x + a * 0.24, x + a * 0.74, 1.55, V / P + q * 1.1, 0.22, !1, c),
          P < 0 && _(x + a * 0.24, x + a * 0.74, 1.55, -(o * 0.84 + q * 1.1), 0.22, !1, c),
          p.slabB(
            [
              [x + a * 0.62, o * 0.3],
              [x + a * 0.62, o * 0.72],
              [x + a * 0.3, o * 0.72],
              [x + a * 0.3, o * 0.3],
            ],
            R(1.6, P),
            0.7,
            0.18,
            r,
            v,
            h,
          ));
        for (let K = 0; K < 3; K++) p.obox([x + a * (0.4 + K * 0.07), 3, V], Ft.X, Ft.Y, Ft.Z, 0.3, 0.12, q * 0.6, i);
      }
      (p.slabB(
        [
          [x + a * 0.05, 2.8],
          [x + a * 0.26, 2.8],
          [x + a * 0.14, 4.3],
          [x - a * 0, 4.3],
        ],
        A(0, 1),
        1.3,
        0.25,
        r,
        d,
        d,
      ),
        p.obox([x + a * 0.92, 0.9, 0], Ft.X, Ft.Y, Ft.Z, 0.35, 0.5, o * 0.55, v, r));
    } else if (l === "delta") {
      for (const P of [1, -1]) {
        (p.slabB(
          [
            [x + a * 0.8, o * 0.18],
            [x + a * 0.02, o * 1.06],
            [x - a * 0.03, o * 1.06],
            [x - a * 0.03, o * 0.18],
          ],
          R(0.9, P),
          0.5,
          0.3,
          u,
          r,
          h,
        ),
          p.slabB(
            [
              [x - a * 0.03, 1],
              [x + a * 0.17, 1],
              [x + a * 0.05, 3.7],
              [x - a * 0.07, 3.7],
            ],
            A(o * 1.03, P),
            0.34,
            0.1,
            r,
            d,
            d,
          ),
          w.quad(
            [x - a * 0.07, 3.76, P * (o * 1.03 + 0.2)],
            [x + a * 0.05, 3.76, P * (o * 1.03 + 0.2)],
            [x + a * 0.05, 3.3, P * (o * 1.03 + 0.2)],
            [x - a * 0.07, 3.3, P * (o * 1.03 + 0.2)],
            c,
          ));
        const V = [x + a * 0.8, 0.95, P * o * 0.18],
          q = [x + a * 0.02, 0.95, P * o * 1.06];
        (w.quad([V[0], 1.12, V[2]], [q[0], 1.12, q[2]], [q[0], 1.2, q[2]], [V[0], 1.2, V[2]], c),
          F(x - 0.3, x + a * 0.22, 1, P * o * 0.5, 0.8),
          p.slabB(
            [
              [x + a * 0.88, o * 0.14],
              [x + a * 0.8, o * 0.36],
              [x + a * 0.75, o * 0.36],
              [x + a * 0.77, o * 0.14],
            ],
            R(1, P),
            0.18,
            0.05,
            r,
            d,
            h,
          ));
      }
      F(x - 0.4, x + a * 0.3, 1.4, 0, 1.2);
    } else if (l === "ring") {
      const P = x + a * 0.18,
        V = 1.7,
        q = o * 0.95,
        O = o * 0.74,
        I = a * 0.075,
        K = 28,
        lt = [];
      for (const [it, rt] of [
        [P - I, O],
        [P - I * 1.05, (q + O) * 0.5],
        [P - I, q],
        [P, q * 1.03],
        [P + I, q],
        [P + I * 1.05, (q + O) * 0.5],
        [P + I, O],
        [P, O * 0.98],
        [P - I, O],
      ]) {
        const J = [];
        for (let Z = 0; Z < K; Z++) {
          const $ = (Z * X) / K;
          J.push([it, V + Math.cos($) * rt * 0.62, Math.sin($) * rt]);
        }
        lt.push(J);
      }
      p.loftS(lt, (it, rt) => (it === 3 ? ((rt & 3) === 0 ? r : u) : it > 5 ? v : d), null, null);
      for (let it = 0; it < K; it++) {
        const rt = (it * X) / K,
          J = ((it + 1) * X) / K,
          Z = ($, yt, Rt) => [Rt, V + Math.cos($) * yt * 0.62, Math.sin($) * yt];
        w.quad(Z(rt, O * 0.97, P - I * 0.35), Z(J, O * 0.97, P - I * 0.35), Z(J, O * 0.97, P + I * 0.35), Z(rt, O * 0.97, P + I * 0.35), c);
      }
      for (const it of [1, -1])
        (p.slabB(
          [
            [P + I, o * 0.28],
            [P + I, o * 0.8],
            [P - I, o * 0.8],
            [P - I, o * 0.28],
          ],
          R(V, it),
          0.55,
          0.15,
          d,
          r,
          h,
        ),
          p.slabB(
            [
              [x + a * 0.64, o * 0.3],
              [x + a * 0.46, o * 0.64],
              [x + a * 0.36, o * 0.64],
              [x + a * 0.36, o * 0.3],
            ],
            R(1.2, it),
            0.4,
            0.15,
            u,
            r,
            h,
          ),
          F(x - 0.4, x + a * 0.3, 1.4, it * o * 0.3, 0.95));
    }
    for (const P of [1, -1]) {
      const V = o * 0.35 * P;
      w.quad(
        [x + a * 0.15, 0.22, V - 0.5],
        [x + a * 0.15, 0.22, V + 0.5],
        [x + a * 0.62, 0.26, V + 0.5],
        [x + a * 0.62, 0.26, V - 0.5],
        m0(c, m, 0.3),
      );
    }
    const N = [],
      G = [],
      L = [];
    for (const P of C)
      for (const V of [0, 1]) {
        const O = P[3] * (V ? 0.45 : 0.82),
          I = V ? 0.55 : 1;
        for (let K = 0; K < 12; K++) {
          const lt = (K * X) / 12,
            it = ((K + 1) * X) / 12;
          (N.push(
            P[0] - 0.05,
            P[1] + Math.cos(lt) * O,
            P[2] + Math.sin(lt) * O,
            P[0] - 0.05,
            P[1] + Math.cos(it) * O,
            P[2] + Math.sin(it) * O,
            P[0] - 0.05 - 1e-4,
            P[1],
            P[2],
          ),
            G.push(0, 0, I),
            L.push(V, V, V));
        }
      }
    const W = new THREE.BufferGeometry();
    (W.setAttribute("position", new THREE.Float32BufferAttribute(N, 3)),
      W.setAttribute("aT", new THREE.Float32BufferAttribute(G, 1)),
      W.setAttribute("aCore", new THREE.Float32BufferAttribute(L, 1)),
      W.computeBoundingSphere(),
      (W.boundingSphere.radius += 30));
    const Y = [],
      at = p.P,
      st = p.N,
      ft = p.C,
      mt = $t(700 + t),
      Dt = (P, V, q) => {
        for (let O = 0; O < 4e3 && Y.length / 7 < V; O++) {
          const I = (mt() * p.nv) | 0,
            K = I * 3,
            lt = Math.abs(ft[K] - s[0]) < 0.01 && Math.abs(ft[K + 2] - s[2]) < 0.01;
          if (P !== lt || st[K + 1] < -0.2) continue;
          let it = !0;
          for (let rt = 0; rt < Y.length; rt += 7) {
            const J = Y[rt] - at[K],
              Z = Y[rt + 1] - at[K + 1],
              $ = Y[rt + 2] - at[K + 2];
            if (J * J + Z * Z + $ * $ < q * q) {
              it = !1;
              break;
            }
          }
          it && Y.push(at[K], at[K + 1], at[K + 2], st[K], st[K + 1], st[K + 2], P ? 1.4 : 1);
        }
      };
    (Dt(!0, 3, 1.2), Dt(!1, 17, 2.4));
    const Zt = {
      body: p.geo({ pack: !1 }),
      glow: w.geo({ pack: !1 }),
      flame: W,
      engines: C,
      tail: D,
      L: a,
      Wh: o,
      ship: e,
      tris: p.tris() + w.tris(),
      glints: Float32Array.from(Y),
    };
    return ((Mo[t] = Zt), (nt.shipTris[t] = Math.round(Zt.tris)), Zt);
  }
  let tt = null,
    y0 = null,
    Qt = null,
    Ve = null,
    vt,
    et,
    bt,
    Ct,
    wt,
    M0,
    r0,
    It = 956,
    jt = 440,
    N0 = 1,
    w0 = 1,
    wo = 1,
    pt = null,
    xt = null,
    Eo = null;
  const ue = new Map(),
    dn = 2,
    E0 = {},
    I0 = {},
    Jt = { mode: "taa" };
  let b0 = null,
    G0 = null,
    S0 = !1,
    q0 = null;
  const ot = {
      time: { value: 0 },
      sun: { value: null },
      clouds: { value: 2 },
      water: { value: 2 },
      glint: { value: 1 },
      sunV: { value: null },
      maxPx: { value: 300 },
    },
    j = {
      tier: je.high,
      top: "high",
      auto: !0,
      scale: 2.5,
      lock: 0,
      overT: 0,
      underT: 0,
      probeWait: 4e3,
      lastProbe: -1e9,
      ema: 8.3,
      vs: 8.33,
      changes: 0,
      cal: [],
      calN: 0,
      calDone: !1,
    },
    te = {
      W: 0,
      H: v0,
      ctx: null,
      init: mn,
      resize: ua,
      drawFrame: Tr,
      prepare: Hr,
      flushIdle: Sn,
      burst: br,
      elevAt: Xo,
      setShowcase: Sr,
      setQuality: wn,
      warmup: ja,
      setAA: Mn,
      get quality() {
        return j.tier.name;
      },
      get aa() {
        return Jt.mode;
      },
      get stats() {
        return nt;
      },
      debug: null,
      debugLockScale: 0,
      /* cinematic camera override: { on, px, py, pz, tx, ty, tz, fov (vertical deg), roll } in world space (game x,y -> world x,z) */
      cine: null,
      /* per-frame post FX driven by cine.js */
      fx: { ca: 0, shock: [0.5, 0.5, 0, 0], grain: 0.03, cine: 0, bars: 0, desat: 0, fade: 0, anam: 0, bloom: 0, exposure: 1, radial: 0, roll: 0 },
      project: pgpProject,
      camPos: pgpCamPos,
      setTopTier: pgpSetTop,
      get tiers() {
        return _0.slice();
      },
    },
    nt = (window.__r3d = {
      calls: 0,
      tris: 0,
      sceneCalls: 0,
      postCalls: 0,
      shadowCalls: 0,
      pr: 0,
      scale: 0,
      outPR: 0,
      quality: "high",
      auto: !0,
      fps: 0,
      frameMs: 0,
      loading: 0,
      maxStepMs: 0,
      maxStepAt: 0,
      buildMs: 0,
      warmMs: 0,
      shipTris: [],
      showcase: null,
      errors: 0,
      mode: "",
      particles: 0,
      buildings: 0,
      hdr: "",
      tierChanges: 0,
      aa: "taa",
      upscale: "",
      internal: "",
      output: "",
      internalW: 0,
      internalH: 0,
      outputW: 0,
      outputH: 0,
      env: "",
      aniso: 0,
      lodHi: 0,
    });
  function mn(t) {
    y0 = t;
    try {
      ((THREE.ColorManagement.enabled = !1),
        (tt = new THREE.WebGLRenderer({
          canvas: t,
          antialias: !1,
          alpha: !1,
          powerPreference: "high-performance",
          stencil: !1,
          depth: !1,
        })),
        (tt.outputColorSpace = THREE.LinearSRGBColorSpace),
        (tt.toneMapping = THREE.NoToneMapping),
        tt.setClearColor(722464, 1),
        (tt.info.autoReset = !1),
        (tt.shadowMap.enabled = !0),
        (tt.shadowMap.type = THREE.PCFSoftShadowMap),
        (tt.shadowMap.autoUpdate = !0));
      const n = tt.extensions;
      ((q0 =
        (n.has("EXT_color_buffer_float") || n.has("EXT_color_buffer_half_float")) && tt.capabilities.isWebGL2
          ? THREE.HalfFloatType
          : THREE.UnsignedByteType),
        (nt.hdr = q0 === THREE.HalfFloatType ? "half-float" : "ldr"),
        (pe = Math.max(1, tt.capabilities.getMaxAnisotropy() || 1)),
        (nt.aniso = pe),
        tt.capabilities.isWebGL2 || (Jt.mode = "off"));
    } catch (n) {
      (console.warn("[render3d] WebGL init failed", n), (tt = null));
    }
    ((t.style.imageRendering = "auto"),
      (Qt = document.createElement("canvas")),
      (Qt.id = "hud"),
      (Qt.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2;display:block;"),
      t.parentNode && t.parentNode.insertBefore(Qt, t.nextSibling),
      (Ve = Qt.getContext("2d")),
      (te.ctx = Ve),
      (ot.sun.value = new THREE.Vector3(a0[0], a0[1], a0[2]).normalize()),
      (ot.sunV.value = ot.sun.value.clone()),
      (vt = new THREE.Scene()),
      (vt.fog = new THREE.Fog(new THREE.Color(De.fog[0], De.fog[1], De.fog[2]), na, ra)),
      (et = new THREE.PerspectiveCamera(55, 2, 1.5, 12e3)),
      vt.add(et),
      (M0 = new THREE.HemisphereLight(9072840, 2364460, 0.8)),
      (wt = new THREE.DirectionalLight(16754804, 1.7)),
      wt.position.set(a0[0] * 160, 150, a0[2] * 160),
      (wt.castShadow = !0));
    const e = wt.shadow.camera;
    ((e.left = -48),
      (e.right = 48),
      (e.top = 48),
      (e.bottom = -48),
      (e.near = 10),
      (e.far = 520),
      wt.shadow.mapSize.set(1024, 1024),
      (wt.shadow.bias = -6e-4),
      (wt.shadow.normalBias = 0.35),
      (wt.shadow.radius = 3),
      (r0 = new THREE.DirectionalLight(5938431, 0.6)),
      r0.position.set(600, 300, 900),
      vt.add(M0, wt, wt.target, r0),
      (N0 = window.devicePixelRatio || 1),
      tt && gn(),
      Hn(),
      Ha("harbor"),
      kn());
    for (let n = 0; n < 6; n++) fa(n);
    ((j.scale = j.tier.s0), ua(window.innerWidth || 956, window.innerHeight || 440));
  }
  function ua(t, e) {
    if (
      ((It = Math.max(1, dt(t, 956) | 0)),
      (jt = Math.max(1, dt(e, 440) | 0)),
      (te.H = v0),
      (te.W = Math.round((v0 * It) / jt)),
      (N0 = window.devicePixelRatio || 1),
      ha(),
      (wo = Math.min(N0, 3)),
      Qt)
    ) {
      ((Qt.width = Math.round(It * wo)), (Qt.height = Math.round(jt * wo)));
      const n = Qt.height / v0;
      Ve.setTransform(n, 0, 0, n, 0, 0);
    }
    (et && ((et.aspect = It / jt), et.updateProjectionMatrix()), Ct && ((Ct.aspect = It / jt), Ct.updateProjectionMatrix()));
  }
  function ha() {
    tt &&
      ((w0 = Math.min(N0, j.tier ? j.tier.outMax : 3)),
      tt.setPixelRatio(w0),
      tt.setSize(It, jt, !1),
      (y0.style.width = "100%"),
      (y0.style.height = "100%"),
      Ze());
  }
  let gt = null,
    _t = null,
    O0 = null,
    We = null,
    j0 = null,
    R0 = null,
    T0 = null,
    V0 = null,
    va = -1,
    da = -1;
  const ge = [null, null];
  let bo = 0,
    ee = null,
    oe = null,
    So,
    ma,
    K0,
    H0,
    X0,
    Vt,
    Le,
    Z0,
    Ro,
    A0,
    Ke,
    To,
    Ne = !0,
    $0 = 0,
    Ho = 0,
    Ao = 0,
    C0 = 0,
    pa = null,
    Co = 0;
  const Y0 = new Float32Array(32);
  (function () {
    const t = (e, n) => {
      let a = 1,
        o = 0;
      for (; e > 0;) ((a /= n), (o += a * (e % n)), (e = Math.floor(e / n)));
      return o;
    };
    for (let e = 0; e < 16; e++) ((Y0[e * 2] = t(e + 1, 2) - 0.5), (Y0[e * 2 + 1] = t(e + 1, 3) - 0.5));
  })();
  const Xe = 8,
    zo = [],
    ko = [],
    Q0 = [],
    Fo = [];
  for (let t = 0; t < Xe; t++)
    (zo.push(new THREE.Matrix4()),
      ko.push(new THREE.Matrix4()),
      Q0.push(new THREE.Vector4(2, 2, -1, -1)),
      Fo.push(new THREE.Vector4(1, 1, 1, 0)));
  const ga = new THREE.Matrix4(),
    xa = new THREE.Matrix4(),
    ya = new THREE.Matrix4(),
    Ma = new THREE.Matrix4(),
    wa = new THREE.Vector3(),
    Ea = new THREE.Vector3(),
    Po = new THREE.Vector3(),
    Te = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
  function xe(t, e, n, a, o) {
    const l = new THREE.WebGLRenderTarget(Math.max(1, t), Math.max(1, e), {
      type: o || q0,
      format: THREE.RGBAFormat,
      depthBuffer: !!a,
      stencilBuffer: !1,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: !1,
      samples: n || 0,
    });
    return ((l.texture.colorSpace = THREE.NoColorSpace), l);
  }
  function pn() {
    const t = j.tier;
    return j.scale > 2.4 ? Math.min(t.samples, t.samples3) : t.samples;
  }
  function J0(t, e, n, a) {
    return t ? ((t.width !== e || t.height !== n) && t.setSize(e, n), t) : xe(e, n, 0, !1, a);
  }
  function Ze() {
    if (!tt || !Le) return;
    const t = te.debugLockScale || Math.min(j.scale, w0),
      e = Math.max(16, Math.round(It * t)),
      n = Math.max(16, Math.round(jt * t)),
      a = Jt.mode === "taa",
      o = a ? 0 : pn(),
      l = a ? 1 : 0;
    if (
      (!gt || va !== o || da !== l
        ? (gt && (gt.depthTexture && gt.depthTexture.dispose(), gt.dispose()),
          (gt = xe(e, n, o, !0)),
          a && ((gt.depthTexture = new THREE.DepthTexture(e, n)), (gt.depthTexture.type = THREE.UnsignedIntType)),
          (va = o),
          (da = l),
          (Ne = !0))
        : (gt.width !== e || gt.height !== n) && (gt.setSize(e, n), (Ne = !0)),
      a)
    )
      ((ge[0] = J0(ge[0], e, n)), (ge[1] = J0(ge[1], e, n)));
    else for (let i = 0; i < 2; i++) ge[i] && (ge[i].dispose(), (ge[i] = null));
    const f = Math.max(16, y0.width | 0),
      u = Math.max(16, y0.height | 0);
    ((ee = J0(ee, e, n, THREE.UnsignedByteType)),
      f === e && u === n ? oe && (oe.dispose(), (oe = null)) : (oe = J0(oe, f, u, THREE.UnsignedByteType)));
    const r = Math.max(1, e >> 2),
      c = Math.max(1, n >> 2),
      h = Math.max(1, e >> 3),
      v = Math.max(1, n >> 3);
    (_t
      ? (_t.setSize(r, c), O0.setSize(r, c), We.setSize(h, v), j0.setSize(h, v), R0.setSize(h, c), T0.setSize(h, c), V0.setSize(h, v))
      : ((_t = xe(r, c)), (O0 = xe(r, c)), (We = xe(h, v)), (j0 = xe(h, v)), (R0 = xe(h, c)), (T0 = xe(h, c)), (V0 = xe(h, v))),
      (ot.maxPx.value = Math.max(64, Math.round(n * 0.27))),
      (nt.scale = t),
      (nt.pr = t),
      (nt.outPR = w0),
      (nt.internal = e + "x" + n),
      (nt.output = f + "x" + u),
      (nt.internalW = e),
      (nt.internalH = n),
      (nt.outputW = f),
      (nt.outputH = u),
      (nt.aa = Jt.mode),
      (nt.upscale = f !== e || u !== n ? "easu+rcas" : "rcas"));
  }
  function gn() {
    ((So = new THREE.Scene()), (ma = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)));
    const t = q0 !== THREE.HalfFloatType;
    ((H0 = new THREE.ShaderMaterial({
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uTh: { value: t ? 0.72 : 1.05 } },
      vertexShader: Te,
      fragmentShader: `uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uTh; varying vec2 vUv;
        vec3 bp(vec3 c){ float l = max(c.r, max(c.g, c.b)); float k = max(0.0, l - uTh); k = k * k / (k + 0.6); return min(c * (k / max(l, 1e-4)), vec3(24.0)); }
        void main(){ vec2 o = uTexel;
          vec3 c = bp(texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb) + bp(texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb)
                 + bp(texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb) + bp(texture2D(tSrc, vUv + vec2(o.x, o.y)).rgb);
          gl_FragColor = vec4(c * 0.25, 1.0); }`,
      depthTest: !1,
      depthWrite: !1,
    })),
      (X0 = new THREE.ShaderMaterial({
        uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() } },
        vertexShader: Te,
        fragmentShader: `uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
        void main(){ vec2 o = uTexel; gl_FragColor = vec4((texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb
          + texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb + texture2D(tSrc, vUv + vec2(o.x, o.y)).rgb) * 0.25, 1.0); }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      (Vt = new THREE.ShaderMaterial({
        uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
        vertexShader: Te,
        fragmentShader: `uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tSrc, vUv).rgb * 0.2270270;
          c += (texture2D(tSrc, vUv + uDir * 1.3846154).rgb + texture2D(tSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
          c += (texture2D(tSrc, vUv + uDir * 3.2307692).rgb + texture2D(tSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
          gl_FragColor = vec4(c, 1.0); }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      (Z0 = new THREE.ShaderMaterial({
        uniforms: { tSrc: { value: null }, uTexel: { value: 0 }, uStep: { value: 2 }, uFirst: { value: 1 } },
        vertexShader: Te,
        fragmentShader: `uniform sampler2D tSrc; uniform float uTexel; uniform float uStep; uniform float uFirst; varying vec2 vUv;
        void main(){ vec3 acc = vec3(0.0); float ws = 0.0;
          for (int i = -7; i <= 7; i++) { float fi = float(i); float w = exp(-abs(fi) * 0.28);
            vec3 c = texture2D(tSrc, vUv + vec2(fi * uStep * uTexel, 0.0)).rgb;
            if (uFirst > 0.5) { float l = max(c.r, max(c.g, c.b)); c *= smoothstep(0.25, 2.0, l); }
            acc += c * w; ws += w; }
          gl_FragColor = vec4(acc / ws * (uFirst > 0.5 ? 2.2 : 1.6), 1.0); }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      (Ro = new THREE.ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uSunP: { value: new THREE.Vector2() },
          uTaps: { value: 16 },
          uAspect: { value: 2.17 },
          uTime: ot.time,
        },
        vertexShader: Te,
        fragmentShader: `uniform sampler2D tSrc; uniform vec2 uSunP; uniform float uTaps; uniform float uAspect; uniform float uTime; varying vec2 vUv;
        float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        void main(){ vec2 d = uSunP - vUv; float j = h12(gl_FragCoord.xy + fract(uTime) * 17.0);
          vec3 acc = vec3(0.0); float decay = 1.0;
          for (int i = 0; i < 16; i++) { if (float(i) >= uTaps) break; float t = (float(i) + j) / uTaps;
            vec3 c = texture2D(tSrc, vUv + d * t * 0.92).rgb; float l = dot(c, vec3(0.33));
            acc += c * smoothstep(0.25, 1.6, l) * decay; decay *= 0.93; }
          float dist = length(d * vec2(uAspect, 1.0));
          gl_FragColor = vec4(acc / uTaps * exp(-dist * 1.6), 1.0); }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      (Le = new THREE.ShaderMaterial({
        uniforms: {
          tScene: { value: null },
          tB1: { value: null },
          tB2: { value: null },
          uB2: { value: 1 },
          uBloom: { value: 0.85 },
          tStreak: { value: null },
          uStreak: { value: 0 },
          tRay: { value: null },
          uRay: { value: 0 },
          uTime: ot.time,
          uShimmer: { value: 1 },
          uRadial: { value: 0 },
          uTaps: { value: 10 },
          uFocus: { value: new THREE.Vector2(0.5, 0.56) },
          uSunP: { value: new THREE.Vector2(-9, -9) },
          uSunOn: { value: 0 },
          uFlare: { value: 1 },
          uAspect: { value: 2.17 },
          uExposure: { value: 0.92 },
          uVig: { value: 0.32 },
          uFlash: { value: 0 },
          uLdr: { value: t ? 1 : 0 },
          uCA: { value: 0 },
          uShock: { value: new THREE.Vector4(0.5, 0.5, 0, 0) },
          uGrain: { value: 0 },
          uCine: { value: 0 },
          uBars: { value: 0 },
          uDesat: { value: 0 },
          uFade: { value: 0 },
        },
        vertexShader: Te,
        fragmentShader: `uniform sampler2D tScene; uniform sampler2D tB1; uniform sampler2D tB2; uniform float uB2; uniform float uBloom;
        uniform sampler2D tStreak; uniform float uStreak; uniform sampler2D tRay; uniform float uRay;
        uniform float uTime; uniform float uShimmer; uniform float uRadial; uniform float uTaps; uniform vec2 uFocus;
        uniform vec2 uSunP; uniform float uSunOn; uniform float uFlare; uniform float uAspect; uniform float uExposure; uniform float uVig; uniform float uFlash; uniform float uLdr;
        uniform float uCA; uniform vec4 uShock; uniform float uGrain; uniform float uCine; uniform float uBars; uniform float uDesat; uniform float uFade;
        varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
        float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        float disc(vec2 p, vec2 c, float r, float soft){ vec2 d = (p - c) * vec2(uAspect, 1.0); return smoothstep(r, r * soft, length(d)); }
        void main(){
          vec2 uv = vUv;
          if (uShock.w > 0.002) {     // expanding refraction ring (explosions, boost ignition)
            vec2 sd = (uv - uShock.xy) * vec2(uAspect, 1.0); float sl = length(sd), ring = sl - uShock.z;
            float sw = exp(-ring * ring * 520.0) * uShock.w;
            uv -= (sd / max(sl, 1e-4)) / vec2(uAspect, 1.0) * sw * 0.045;
          }
          if (uShimmer > 0.5) {
            float sh = clamp(1.0 - texture2D(tScene, uv).a, 0.0, 1.0);
            if (sh > 0.002) {
              vec2 o = vec2(sin(uv.y * 210.0 + uTime * 27.0) + 0.6 * sin(uv.y * 83.0 - uTime * 19.0 + uv.x * 50.0),
                            cos(uv.x * 190.0 - uTime * 23.0) + 0.6 * sin(uv.x * 61.0 + uTime * 13.0));
              uv += o * 0.0016 * sh;
            }
          }
          vec3 col = texture2D(tScene, uv).rgb;
          if (uRadial > 0.01) {
            vec2 d = uv - uFocus; float k = uRadial * 0.075 * smoothstep(0.06, 0.55, length(d * vec2(uAspect * 0.5, 1.0)));
            vec3 acc = col; float ws = 1.0;
            for (int i = 1; i < 12; i++) { if (float(i) >= uTaps) break; float t = float(i) / uTaps; float w = 1.0 - t * 0.5; acc += texture2D(tScene, uv - d * k * t).rgb * w; ws += w; }
            col = acc / ws;
          }
          if (uCA > 0.002) {          // lens chromatic aberration, grows toward the frame edge
            vec2 cd = uv - 0.5; float ck = uCA * (0.0012 + 0.012 * dot(cd, cd));
            col.r = mix(col.r, texture2D(tScene, uv + cd * ck).r, 0.9);
            col.b = mix(col.b, texture2D(tScene, uv - cd * ck).b, 0.9);
          }
          vec3 bl = texture2D(tB1, vUv).rgb + texture2D(tB2, vUv).rgb * uB2;
          col += bl * uBloom;
          if (uStreak > 0.01) col += texture2D(tStreak, vUv).rgb * vec3(0.55, 0.78, 1.35) * uStreak;
          if (uRay > 0.01) col += texture2D(tRay, vUv).rgb * vec3(1.0, 0.6, 0.38) * uRay;
          if (uFlare > 0.5 && uSunOn > 0.01) {
            float vis = smoothstep(0.35, 2.2, dot(texture2D(tB1, uSunP).rgb, vec3(0.33))) * uSunOn;
            if (vis > 0.002) {
              vec2 c = vec2(0.5), axis = c - uSunP;
              vec3 f = vec3(0.0);
              f += vec3(1.0, 0.45, 0.6) * disc(vUv, uSunP + axis * 0.55, 0.035, 0.2) * 0.22;
              f += vec3(0.4, 0.9, 1.0) * disc(vUv, uSunP + axis * 1.15, 0.06, 0.7) * 0.12;
              f += vec3(1.0, 0.7, 0.3) * disc(vUv, uSunP + axis * 1.45, 0.022, 0.1) * 0.3;
              f += vec3(0.8, 0.3, 1.0) * disc(vUv, uSunP + axis * 1.9, 0.11, 0.85) * 0.08;
              float rr = length((vUv - uSunP) * vec2(uAspect, 1.0));
              f += vec3(1.0, 0.6, 0.4) * smoothstep(0.03, 0.0, abs(rr - 0.22)) * 0.06;
              float dy = abs(vUv.y - uSunP.y), dx = abs(vUv.x - uSunP.x) * uAspect;
              f += vec3(1.0, 0.55, 0.45) * exp(-dy * 260.0) * exp(-dx * 1.6) * 0.55;
              col += f * vis;
            }
          }
          col += vec3(1.0, 0.85, 0.7) * uFlash;
          col *= uExposure;
          col = uLdr > 0.5 ? clamp(col, 0.0, 1.0) : aces(col);
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(vec3(l), col, 1.1);
          col += vec3(-0.012, -0.006, 0.022) * (1.0 - smoothstep(0.0, 0.5, l));
          col *= mix(vec3(1.0), vec3(1.035, 1.0, 0.955), smoothstep(0.4, 1.0, l));
          if (uCine > 0.002) {        // filmic grade: teal shadows / warm highlights + S-curve
            float l2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
            vec3 g = col + mix(vec3(-0.012, 0.022, 0.045), vec3(0.05, 0.014, -0.035), smoothstep(0.12, 0.8, l2));
            g = clamp(g, 0.0, 1.0); g = mix(g, g * g * (3.0 - 2.0 * g), 0.4);
            col = mix(col, g, uCine);
          }
          if (uDesat > 0.002) col = mix(col, vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))) * vec3(0.96, 1.0, 1.06), uDesat);
          vec2 vq = (vUv - 0.5) * vec2(1.0, 0.86);
          col *= 1.0 - (uVig + uCine * 0.22) * pow(clamp(length(vq) * 1.35, 0.0, 1.0), 2.4);
          if (uGrain > 0.001) {       // film grain, stronger in the mids, animated at 24 steps/s
            float gt2 = floor(uTime * 24.0);
            float gn = h12(gl_FragCoord.xy * 0.71 + gt2 * 17.3) + h12(gl_FragCoord.yx * 0.53 + gt2 * 9.1) - 1.0;
            float gl2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
            col += gn * uGrain * (0.35 + 0.65 * (1.0 - abs(gl2 * 2.0 - 1.0)));
          }
          if (uBars > 0.002) col *= 1.0 - smoothstep(1.0 - uBars - 0.003, 1.0 - uBars, abs(vUv.y - 0.5) * 2.0);
          col *= 1.0 - uFade;
          col += (h12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
          gl_FragColor = vec4(col, 1.0);
        }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      xn(),
      (K0 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), H0)),
      (K0.frustumCulled = !1),
      So.add(K0),
      Ze());
  }
  function xn() {
    ((A0 = new THREE.ShaderMaterial({
      uniforms: {
        tCur: { value: null },
        tDepth: { value: null },
        tHist: { value: null },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uJit: { value: new THREE.Vector2() },
        uInvVP: { value: new THREE.Matrix4() },
        uPrevVP: { value: new THREE.Matrix4() },
        uShipInv: { value: zo },
        uShipPrev: { value: ko },
        uShipRect: { value: Q0 },
        uShipBox: { value: Fo },
        uShipN: { value: 0 },
        uReset: { value: 1 },
        uFeed: { value: new THREE.Vector3(0.08, 0.3, 40) },
        uGamma: { value: 1.1 },
      },
      vertexShader: Te,
      fragmentShader: `precision highp float;
        uniform sampler2D tCur; uniform sampler2D tDepth; uniform sampler2D tHist; uniform vec2 uTexel; uniform vec2 uJit;
        uniform mat4 uInvVP; uniform mat4 uPrevVP;
        uniform mat4 uShipInv[${Xe}]; uniform mat4 uShipPrev[${Xe}]; uniform vec4 uShipRect[${Xe}]; uniform vec4 uShipBox[${Xe}]; uniform float uShipN;
        uniform float uReset; uniform vec3 uFeed; uniform float uGamma;
        varying vec2 vUv;
        vec3 tmap(vec3 c){ return c / (1.0 + max(c.r, max(c.g, c.b))); }
        vec3 itmap(vec3 c){ return c / max(1.0 - max(c.r, max(c.g, c.b)), 1e-3); }
        vec3 toY(vec3 c){ return vec3(dot(c, vec3(0.25, 0.5, 0.25)), dot(c, vec3(0.5, 0.0, -0.5)), dot(c, vec3(-0.25, 0.5, -0.25))); }
        vec3 fromY(vec3 y){ return vec3(y.x + y.y - y.z, y.x + y.z, y.x - y.y - y.z); }
        vec3 histCR(vec2 uv){   // 5-tap Catmull-Rom (bilinear-optimised; corner taps dropped)
          vec2 res = 1.0 / uTexel, sp = uv * res, tc = floor(sp - 0.5) + 0.5, f = sp - tc;
          vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f)), w1 = 1.0 + f * f * (-2.5 + 1.5 * f), w2 = f * (0.5 + f * (2.0 - 1.5 * f)), w3 = f * f * (-0.5 + 0.5 * f);
          vec2 w12 = w1 + w2, t0 = (tc - 1.0) * uTexel, t3 = (tc + 2.0) * uTexel, t12 = (tc + w2 / w12) * uTexel;
          vec3 c = texture2D(tHist, vec2(t12.x, t0.y)).rgb * (w12.x * w0.y) + texture2D(tHist, vec2(t0.x, t12.y)).rgb * (w0.x * w12.y)
                 + texture2D(tHist, t12).rgb * (w12.x * w12.y) + texture2D(tHist, vec2(t3.x, t12.y)).rgb * (w3.x * w12.y)
                 + texture2D(tHist, vec2(t12.x, t3.y)).rgb * (w12.x * w3.y);
          float ws = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
          return max(c / ws, vec3(0.0));
        }
        void main(){
          vec4 c0 = texture2D(tCur, vUv);
          vec3 m1 = vec3(0.0), m2 = vec3(0.0), mn = vec3(1e5), mx = vec3(-1e5), acc = vec3(0.0); float wsum = 0.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 o = vec2(float(i), float(j));
            vec3 sy = toY(tmap((i == 0 && j == 0) ? c0.rgb : texture2D(tCur, vUv + o * uTexel).rgb));
            m1 += sy; m2 += sy * sy; mn = min(mn, sy); mx = max(mx, sy);
            vec2 dd = o - uJit; float w = exp(-2.7 * dot(dd, dd));      // jitter-compensated reconstruction (narrow Blackman-Harris fit)
            acc += sy * w; wsum += w;
          }
          vec3 cur = acc / wsum;
          float d = texture2D(tDepth, vUv).r;
          vec4 W = uInvVP * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0); W /= W.w;
          vec4 Wp = W;
          for (int k = 0; k < ${Xe}; k++) {
            if (float(k) >= uShipN) break;
            vec4 r = uShipRect[k];
            if (vUv.x > r.x && vUv.y > r.y && vUv.x < r.z && vUv.y < r.w) {
              vec4 L = uShipInv[k] * W; vec4 b = uShipBox[k];
              if (abs(L.x) < b.x && L.y > -2.5 && L.y < b.y && abs(L.z) < b.z) { Wp = uShipPrev[k] * L; break; }
            }
          }
          vec4 P = uPrevVP * Wp; vec2 puv = P.xy / P.w * 0.5 + 0.5;
          float ml = length((vUv - puv) / uTexel);
          vec3 mu = m1 / 9.0, sig = sqrt(max(m2 / 9.0 - mu * mu, 0.0));
          float g = uGamma * mix(1.0, 0.7, clamp(ml / 32.0, 0.0, 1.0));
          vec3 bmn = max(mn, mu - g * sig), bmx = min(mx, mu + g * sig);
          vec3 hist = toY(tmap(histCR(puv)));
          vec3 hc = 0.5 * (bmx + bmn), he = 0.5 * (bmx - bmn) + 1e-4, hv = hist - hc, ua = abs(hv / he);
          float um = max(ua.x, max(ua.y, ua.z)); if (um > 1.0) hist = hc + hv / um;     // clip toward the box centre
          float a = mix(uFeed.x, uFeed.y, clamp(ml / uFeed.z, 0.0, 1.0));
          a = max(a, clamp(c0.a - 1.0, 0.0, 1.0) * 0.8);
          if (uReset > 0.5 || P.w <= 0.0 || puv.x < 0.0 || puv.y < 0.0 || puv.x > 1.0 || puv.y > 1.0) a = 1.0;
          gl_FragColor = vec4(max(itmap(fromY(mix(hist, cur, a))), vec3(0.0)), c0.a);
        }`,
      depthTest: !1,
      depthWrite: !1,
    })),
      (Ke = new THREE.ShaderMaterial({
        uniforms: { tSrc: { value: null }, uInSize: { value: new THREE.Vector2(1, 1) } },
        vertexShader: Te,
        fragmentShader: `precision highp float;
        uniform sampler2D tSrc; uniform vec2 uInSize; varying vec2 vUv;
        vec3 T(vec2 p){ return texture2D(tSrc, (p + 0.5) / uInSize).rgb; }
        float Lm(vec3 c){ return c.g + 0.5 * (c.r + c.b); }
        void eSet(inout vec2 dir, inout float len, float w, float lA, float lB, float lC, float lD, float lE){
          float lenX = 1.0 / max(max(abs(lD - lC), abs(lC - lB)), 1e-5), dirX = lD - lB;
          dir.x += dirX * w; lenX = clamp(abs(dirX) * lenX, 0.0, 1.0); len += lenX * lenX * w;
          float lenY = 1.0 / max(max(abs(lE - lC), abs(lC - lA)), 1e-5), dirY = lE - lA;
          dir.y += dirY * w; lenY = clamp(abs(dirY) * lenY, 0.0, 1.0); len += lenY * lenY * w;
        }
        void eTap(inout vec3 aC, inout float aW, vec2 off, vec2 dir, vec2 len2, float lob, float clp, vec3 c){
          vec2 v = vec2(off.x * dir.x + off.y * dir.y, off.y * dir.x - off.x * dir.y) * len2;
          float d2 = min(dot(v, v), clp);
          float wB = 0.4 * d2 - 1.0, wA = lob * d2 - 1.0; wB *= wB; wA *= wA; wB = 1.5625 * wB - 0.5625;
          float w = wB * wA; aC += c * w; aW += w;
        }
        void main(){
          vec2 pp = vUv * uInSize - 0.5, fp = floor(pp); pp -= fp;
          vec3 b = T(fp + vec2(0.0, -1.0)), c = T(fp + vec2(1.0, -1.0));
          vec3 e = T(fp + vec2(-1.0, 0.0)), f = T(fp), g = T(fp + vec2(1.0, 0.0)), h = T(fp + vec2(2.0, 0.0));
          vec3 i = T(fp + vec2(-1.0, 1.0)), j = T(fp + vec2(0.0, 1.0)), k = T(fp + vec2(1.0, 1.0)), l = T(fp + vec2(2.0, 1.0));
          vec3 n = T(fp + vec2(0.0, 2.0)), o = T(fp + vec2(1.0, 2.0));
          float bL = Lm(b), cL = Lm(c), eL = Lm(e), fL = Lm(f), gL = Lm(g), hL = Lm(h), iL = Lm(i), jL = Lm(j), kL = Lm(k), lL = Lm(l), nL = Lm(n), oL = Lm(o);
          vec2 dir = vec2(0.0); float len = 0.0;
          eSet(dir, len, (1.0 - pp.x) * (1.0 - pp.y), bL, eL, fL, gL, jL);
          eSet(dir, len, pp.x * (1.0 - pp.y), cL, fL, gL, hL, kL);
          eSet(dir, len, (1.0 - pp.x) * pp.y, fL, iL, jL, kL, nL);
          eSet(dir, len, pp.x * pp.y, gL, jL, kL, lL, oL);
          float dirR = dot(dir, dir); bool zro = dirR < 1.0 / 32768.0;
          dir = zro ? vec2(1.0, 0.0) : dir * inversesqrt(dirR);
          len = len * 0.5; len *= len;
          float stretch = 1.0 / max(abs(dir.x), abs(dir.y));
          vec2 len2 = vec2(1.0 + (stretch - 1.0) * len, 1.0 - 0.5 * len);
          float lob = 0.5 + ((1.0 / 4.0 - 0.04) - 0.5) * len, clp = 1.0 / lob;
          vec3 aC = vec3(0.0); float aW = 0.0;
          eTap(aC, aW, vec2(0.0, -1.0) - pp, dir, len2, lob, clp, b); eTap(aC, aW, vec2(1.0, -1.0) - pp, dir, len2, lob, clp, c);
          eTap(aC, aW, vec2(-1.0, 1.0) - pp, dir, len2, lob, clp, i); eTap(aC, aW, vec2(0.0, 1.0) - pp, dir, len2, lob, clp, j);
          eTap(aC, aW, vec2(0.0, 0.0) - pp, dir, len2, lob, clp, f); eTap(aC, aW, vec2(-1.0, 0.0) - pp, dir, len2, lob, clp, e);
          eTap(aC, aW, vec2(1.0, 1.0) - pp, dir, len2, lob, clp, k); eTap(aC, aW, vec2(2.0, 1.0) - pp, dir, len2, lob, clp, l);
          eTap(aC, aW, vec2(2.0, 0.0) - pp, dir, len2, lob, clp, h); eTap(aC, aW, vec2(1.0, 0.0) - pp, dir, len2, lob, clp, g);
          eTap(aC, aW, vec2(1.0, 2.0) - pp, dir, len2, lob, clp, o); eTap(aC, aW, vec2(0.0, 2.0) - pp, dir, len2, lob, clp, n);
          vec3 mn4 = min(min(f, g), min(j, k)), mx4 = max(max(f, g), max(j, k));
          gl_FragColor = vec4(clamp(aC / aW, mn4, mx4), 1.0);     // de-ring against the 2x2 neighbourhood
        }`,
        depthTest: !1,
        depthWrite: !1,
      })),
      (To = new THREE.ShaderMaterial({
        uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2(1, 1) }, uSharp: { value: 0.85 }, uTime: ot.time },
        vertexShader: Te,
        fragmentShader: `precision highp float;
        uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uSharp; uniform float uTime; varying vec2 vUv;
        float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        void main(){
          vec3 b = texture2D(tSrc, vUv + vec2(0.0, uTexel.y)).rgb, d = texture2D(tSrc, vUv - vec2(uTexel.x, 0.0)).rgb;
          vec3 e = texture2D(tSrc, vUv).rgb;
          vec3 f = texture2D(tSrc, vUv + vec2(uTexel.x, 0.0)).rgb, h = texture2D(tSrc, vUv - vec2(0.0, uTexel.y)).rgb;
          vec3 mn4 = min(min(b, d), min(f, h)), mx4 = max(max(b, d), max(f, h));
          vec3 hitMin = min(mn4, e) / max(4.0 * mx4, vec3(1e-4));
          vec3 hitMax = (1.0 - max(mx4, e)) / min(4.0 * mn4 - 4.0, vec3(-1e-4));
          vec3 lobeRGB = max(-hitMin, hitMax);
          float lobe = max(-0.1875, min(max(lobeRGB.r, max(lobeRGB.g, lobeRGB.b)), 0.0)) * uSharp;
          // noise detection (FSR1 RCAS_DENOISE): back off on isolated single-pixel speckle
          float bL = b.g + 0.5 * (b.r + b.b), dL = d.g + 0.5 * (d.r + d.b), eL = e.g + 0.5 * (e.r + e.b), fL = f.g + 0.5 * (f.r + f.b), hL = h.g + 0.5 * (h.r + h.b);
          float nz = 0.25 * (bL + dL + fL + hL) - eL;
          float rng = max(max(max(bL, dL), max(eL, fL)), hL) - min(min(min(bL, dL), min(eL, fL)), hL);
          nz = clamp(abs(nz) / max(rng, 1e-4), 0.0, 1.0); lobe *= 1.0 - 0.5 * nz;
          vec3 c = (lobe * (b + d + f + h) + e) / (4.0 * lobe + 1.0);
          c += (h12(gl_FragCoord.xy + fract(uTime) * 41.0) - 0.5) / 255.0;
          gl_FragColor = vec4(c, 1.0);
        }`,
        depthTest: !1,
        depthWrite: !1,
      })));
  }
  function Gt(t, e) {
    ((K0.material = t), tt.setRenderTarget(e), tt.render(So, ma));
  }
  function Do(t, e) {
    if (C0 >= Xe || Jt.mode !== "taa") return;
    const n = C0,
      a = t.group.matrixWorld;
    (zo[n].copy(a).invert(), ko[n].copy(t.prevOK ? t.prevMW : a));
    const o = t.M;
    (Fo[n].set(o.L * 0.5 + 2.5, 9, o.Wh * 1.3 + 1.5, 0), Q.setFromMatrixPosition(a), s0.copy(Q).applyMatrix4(e.matrixWorldInverse));
    const l = -s0.z,
      f = Math.max(o.L * 0.5 + 3, o.Wh * 1.4 + 2) + 4;
    if (l < f + e.near) Q0[n].set(-1, -1, 2, 2);
    else {
      Q.project(e);
      const u = Math.tan((e.fov * Math.PI) / 360),
        r = (f / (l * u)) * 0.5 * 1.25,
        c = r / e.aspect,
        h = Q.x * 0.5 + 0.5,
        v = Q.y * 0.5 + 0.5;
      Q0[n].set(h - c, v - r, h + c, v + r);
    }
    C0++;
  }
  function Uo(t) {
    (t.prevMW.copy(t.group.matrixWorld), (t.prevOK = !0));
  }
  function ba(t) {
    const e = j.tier,
      n = gt.width,
      a = gt.height;
    if (((H0.uniforms.tSrc.value = t), H0.uniforms.uTexel.value.set(1 / n, 1 / a), Gt(H0, _t), e.streak > 0)) {
      const r = Z0.uniforms;
      ((r.tSrc.value = _t.texture),
        (r.uTexel.value = 1 / _t.width),
        (r.uStep.value = e.streak > 1 ? 2.5 : 5),
        (r.uFirst.value = 1),
        Gt(Z0, e.streak > 1 ? R0 : T0),
        e.streak > 1 &&
          ((r.tSrc.value = R0.texture), (r.uTexel.value = 1 / R0.width), (r.uStep.value = 4.5), (r.uFirst.value = 0), Gt(Z0, T0)));
    }
    ((Vt.uniforms.tSrc.value = _t.texture),
      Vt.uniforms.uDir.value.set(1.25 / _t.width, 0),
      Gt(Vt, O0),
      (Vt.uniforms.tSrc.value = O0.texture),
      Vt.uniforms.uDir.value.set(0, 1.25 / _t.height),
      Gt(Vt, _t),
      e.bloom2 &&
        ((X0.uniforms.tSrc.value = _t.texture),
        X0.uniforms.uTexel.value.set(0.5 / _t.width, 0.5 / _t.height),
        Gt(X0, We),
        (Vt.uniforms.tSrc.value = We.texture),
        Vt.uniforms.uDir.value.set(1.5 / We.width, 0),
        Gt(Vt, j0),
        (Vt.uniforms.tSrc.value = j0.texture),
        Vt.uniforms.uDir.value.set(0, 1.5 / We.height),
        Gt(Vt, We)));
    const o = Le.uniforms,
      l = e.rays > 0 && o.uRayOn > 0.01;
    if (l) {
      const r = Ro.uniforms;
      ((r.tSrc.value = _t.texture), r.uSunP.value.copy(o.uSunP.value), (r.uTaps.value = e.rays), (r.uAspect.value = It / jt), Gt(Ro, V0));
    }
    ((o.uRay.value = l ? o.uRayOn * 1.6 : 0),
      (o.tRay.value = V0.texture),
      (o.uStreak.value = e.streak > 0 ? o.uStreakK * (1 + dt(te.fx.anam, 0)) : 0),
      (o.tStreak.value = T0.texture),
      (o.tScene.value = t),
      (o.tB1.value = _t.texture),
      (o.tB2.value = We.texture),
      (o.uB2.value = e.bloom2 ? 0.9 : 0),
      (o.uShimmer.value = e.shimmer ? 1 : 0),
      (o.uTaps.value = e.radial),
      (o.uFlare.value = e.flare ? 1 : 0),
      (o.uAspect.value = It / jt),
      Gt(Le, ee));
    let f = ee;
    oe &&
      (oe.width !== ee.width || oe.height !== ee.height) &&
      ((Ke.uniforms.tSrc.value = ee.texture), Ke.uniforms.uInSize.value.set(ee.width, ee.height), Gt(Ke, oe), (f = oe));
    const u = To.uniforms;
    ((u.tSrc.value = f.texture),
      u.uTexel.value.set(1 / f.width, 1 / f.height),
      (u.uSharp.value = Math.pow(2, -(Jt.mode === "taa" ? e.sharp * 0.5 : e.sharp))),
      Gt(To, null));
  }
  function yn() {
    const t = ge[bo],
      e = ge[bo ^ 1],
      n = A0.uniforms;
    return (
      (n.tCur.value = gt.texture),
      (n.tDepth.value = gt.depthTexture),
      (n.tHist.value = e.texture),
      n.uTexel.value.set(1 / gt.width, 1 / gt.height),
      n.uJit.value.set(Ho, Ao),
      (n.uReset.value = Ne ? 1 : 0),
      (n.uShipN.value = C0),
      n.uFeed.value.set(0.075 + Co * 0.05, 0.3, 36),
      Gt(A0, t),
      (bo ^= 1),
      (Ne = !1),
      t.texture
    );
  }
  function Mn(t) {
    return (
      (t !== "taa" && t !== "off") ||
        (t === "taa" && tt && !tt.capabilities.isWebGL2) ||
        (Jt.mode !== t && ((Jt.mode = t), Ze(), (Ne = !0))),
      Jt.mode
    );
  }
  const pgpV = new THREE.Vector3();
  /* world point (game x, game y, height above track) -> screen uv [u, v, inFront] */
  function pgpProject(t, e, n) {
    if (!et) return [0.5, 0.5, 0];
    pgpV.set(dt(t, 0), Xo(t, e) + dt(n, 0), dt(e, 0)).project(et);
    return [pgpV.x * 0.5 + 0.5, pgpV.y * 0.5 + 0.5, pgpV.z < 1 ? 1 : 0];
  }
  function pgpCamPos() {
    return et ? [et.position.x, et.position.y, et.position.z] : [0, 0, 0];
  }
  /* highest tier the auto-scaler may climb to ("ultra" on flagship phones / desktops) */
  function pgpSetTop(t, e) {
    if (!je[t]) return j.top;
    j.top = t;
    if (e && j.auto && _0.indexOf(j.tier.name) < _0.indexOf(t)) to(je[t], !0);
    else if (_0.indexOf(j.tier.name) > _0.indexOf(t)) to(je[t], !0);
    return j.top;
  }
  function wn(t) {
    if (t === "auto") return ((j.auto = !0), (nt.auto = !0), j.tier.name);
    const e = je[t];
    return e ? ((j.auto = !1), (nt.auto = !1), to(e, !0), e.name) : j.tier.name;
  }
  function to(t, e) {
    const n = t !== j.tier;
    if (
      ((j.tier = t),
      (e || j.scale > t.smax || j.scale < t.smin) && (j.scale = ut(t.s0, t.smin, t.smax)),
      n && (j.changes++, (nt.tierChanges = j.changes)),
      (nt.quality = t.name),
      wt &&
        wt.shadow.mapSize.x !== t.shadow &&
        (wt.shadow.mapSize.set(t.shadow, t.shadow), wt.shadow.map && (wt.shadow.map.dispose(), (wt.shadow.map = null))),
      (ot.clouds.value = t.clouds),
      (ot.water.value = t.water),
      (ot.glint.value = t.glint),
      pt && pt.farChunks)
    )
      for (const a of pt.farChunks) a.visible = !!t.far;
    (pt && pt.glass && (pt.glass.visible = t.name !== "low"), se && (se.visible = t.trails), ha());
  }
  let eo = 0;
  function En() {
    const t = performance.now();
    if (eo) {
      const e = Math.min(250, t - eo);
      if (((j.ema += (Math.min(e, Math.max(j.vs * 2.2, 14)) - j.ema) * 0.08), j.calDone))
        j.vs = Math.min(j.vs + 4e-4, Math.max(6.8, Math.min(34, e)));
      else if ((++j.calN > 40 && j.cal.push(e), j.cal.length >= 120)) {
        j.cal.sort((o, l) => o - l);
        const a = j.cal[Math.floor(j.cal.length * 0.25)];
        ((j.vs = a < 12.5 ? 8.33 : a < 25 ? 16.67 : 33.3), (j.calDone = !0), (j.cal = null));
      }
      if (!j.calDone) {
        eo = t;
        return;
      }
      const n = Math.max(8.34, j.vs) * 1.12;
      if (!te.debugLockScale) {
        if ((j.ema > n ? ((j.overT += e), (j.underT = 0)) : ((j.overT = Math.max(0, j.overT - e * 0.5)), (j.underT += e)), j.overT > 900)) {
          ((j.overT = 0), t - j.lastProbe < 2500 && (j.probeWait = Math.min(6e4, j.probeWait * 2)));
          const a = j.tier;
          (j.scale > a.smin + 0.01
            ? ((j.scale = Math.max(a.smin, j.scale - 0.125)), Ze())
            : j.auto && a !== je.low && to(je[_0[_0.indexOf(a.name) - 1]], !1),
            (j.ema = n));
        } else if (j.underT > j.probeWait) {
          j.underT = 0;
          const a = j.tier;
          (j.scale < Math.min(a.smax, w0) - 0.01
            ? ((j.scale = Math.min(a.smax, j.scale + 0.125)), (j.lastProbe = t), Ze())
            : j.auto && a !== (je[j.top] || je.high) && (to(je[_0[_0.indexOf(a.name) + 1]], !1), (j.scale = j.tier.smin), (j.lastProbe = t), Ze()),
            t - j.lastProbe > 5e3 && (j.probeWait = Math.max(4e3, j.probeWait * 0.75)));
        }
      }
    }
    ((eo = t), (nt.frameMs = +j.ema.toFixed(2)), (nt.fps = Math.round(1e3 / j.ema)));
  }
  let $e,
    Ye,
    Sa = null;
  function oo(t, e, n) {
    const a = new THREE.ShaderMaterial({
      uniforms: { uTime: ot.time, uSun: ot.sun, uStars: { value: t ? 1 : 0 }, uClouds: e || { value: 1 } },
      vertexShader:
        "varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }",
      fragmentShader:
        un(n) +
        `uniform float uTime; uniform float uStars; varying vec3 vD;
        void main(){ gl_FragColor = vec4(skyCol(normalize(vD), uTime, uStars, uClouds), 1.0); }`,
      side: THREE.BackSide,
      depthWrite: !1,
      depthTest: !0,
      fog: !1,
    });
    return ((a.extensions = { derivatives: !0 }), a);
  }
  const He = [];
  function Ra(t) {
    He.push(t);
  }
  function bn(t) {
    if (!He.length) return;
    const e = performance.now() + t;
    try {
      for (; He.length && performance.now() < e;) He[0].next().done && He.shift();
    } catch (n) {
      (console.warn("[render3d] idle work", n), He.shift());
    }
  }
  function Sn() {
    let t = 0;
    for (; He.length && t++ < 1e6;) {
      try {
        for (; !He[0].next().done;);
      } catch (e) {
        console.warn("[render3d] idle work", e);
      }
      He.shift();
    }
  }
  function* Rn(t) {
    const n = new Float32Array(65536),
      a = $t(55),
      o = [];
    for (let l = 0; l < 14; l++)
      o.push([Math.round(1 + a() * 9) * (a() < 0.5 ? -1 : 1), Math.round(a() * 9) * (a() < 0.5 ? -1 : 1), a() * X, 1 / (1 + l * 0.45)]);
    for (let l = 0; l < 256; l++) {
      (l & 31) === 31 && (yield);
      for (let f = 0; f < 256; f++) {
        let u = 0;
        for (const r of o) u += Math.sin((X * (r[0] * f + r[1] * l)) / 256 + r[2]) * r[3];
        n[l * 256 + f] = u * 0.05;
      }
    }
    (yield, t.image.data.set(la(n, 256, 3.2)), (t.needsUpdate = !0));
  }
  function Tn() {
    const e = new Uint8Array(262144);
    for (let a = 0; a < e.length; a += 4) ((e[a] = 128), (e[a + 1] = 128), (e[a + 2] = 255), (e[a + 3] = 255));
    const n = L0(e, 256, !0);
    return (Ra(Rn(n)), n);
  }
  function Hn() {
    (($e = new THREE.Mesh(new THREE.SphereGeometry(9e3, 32, 16), oo(!0, ot.clouds, "harbor"))),
      (I0.harbor = $e.material),
      ($e.renderOrder = 4),
      ($e.frustumCulled = !1),
      vt.add($e),
      (Sa = Tn()));
    const t = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTime: { value: 0 }, uSun: { value: null }, uClouds: { value: 1 }, uNrm: { value: null }, uQ: { value: 2 } },
      ]),
      vertexShader: `varying vec3 vW; ${Tt}
        void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader:
        go +
        `uniform float uTime; uniform sampler2D uNrm; uniform float uQ; varying vec3 vW;
        #include <fog_pars_fragment>
        void main(){
          vec3 V = normalize(vW - cameraPosition);
          float dist = length(vW.xz - cameraPosition.xz);
          float amp = 1.0 / (1.0 + dist / 650.0);
          vec2 p = vW.xz; float t = uTime;
          vec3 n1 = texture2D(uNrm, p / 140.0 + vec2(t * 0.011, t * 0.006)).xzy * 2.0 - 1.0;
          vec3 n = n1;
          if (uQ > 0.5) { vec3 n2 = texture2D(uNrm, p / 47.0 + vec2(-t * 0.017, t * 0.021)).xzy * 2.0 - 1.0; n = n1 + n2 * 0.7; }
          if (uQ > 1.5) { vec3 n3 = texture2D(uNrm, p / 13.0 + vec2(t * 0.05, -t * 0.03)).xzy * 2.0 - 1.0; n += n3 * 0.35 * amp; }
          n = normalize(vec3(n.x * amp * 0.9, 1.0, n.z * amp * 0.9));
          vec3 Rf = reflect(V, n); Rf.y = abs(Rf.y) + 0.004;
          float fres = 0.03 + 0.97 * pow(1.0 - max(dot(-V, n), 0.0), 5.0);
          vec3 deep = vec3(0.012, 0.025, 0.07);
          vec3 col = deep + skyCol(normalize(Rf), t, 0.0, 0.0) * fres * 0.85;
          vec3 S = normalize(uSun);
          float sp = pow(max(dot(Rf, S), 0.0), 220.0) * 14.0 + pow(max(dot(Rf, S), 0.0), 18.0) * 0.35;
          col += vec3(1.0, 0.62, 0.38) * sp;
          if (uQ > 0.5) {   // sun glitter: twinkling sparkles concentrated on the sun path
            vec2 gq = floor(p * vec2(0.9, 0.6)); float gh = hash12(gq + floor(t * 6.0) * vec2(7.3, 1.9));
            float sun2 = pow(max(dot(Rf, S), 0.0), 5.0);
            col += vec3(2.6, 1.7, 1.0) * step(0.992 - 0.012 * uQ, gh) * sun2 * amp * 4.0;
          }
          // neon city reflection glints (sparse vertical sparkles)
          vec2 g = floor(p / vec2(5.0, 2.2)); float h = hash12(g);
          float tw = step(0.962, h) * (0.5 + 0.5 * sin(t * 3.0 + h * 50.0)) * amp;
          col += mix(vec3(1.0, 0.25, 0.75), vec3(0.25, 0.9, 1.0), step(0.982, h)) * tw * 0.9;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
      fog: !0,
    });
    ((t.uniforms.uTime = ot.time), (t.uniforms.uSun = ot.sun), (t.uniforms.uNrm.value = Sa), (t.uniforms.uQ = ot.water));
    const e = new THREE.PlaneGeometry(26e3, 26e3, 1, 1);
    (e.rotateX(-Math.PI / 2),
      (Ye = new THREE.Mesh(e, t)),
      (Ye.position.y = -2.5),
      (Ye.frustumCulled = !1),
      (Ye.renderOrder = 3),
      vt.add(Ye));
  }
  function Ta(t) {
    if (E0[t]) {
      xt = E0[t];
      return;
    }
    if (t === "moon") return An();
    try {
      const e = new THREE.Scene();
      e.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), oo(!1, { value: 1 }, "harbor")));
      const n = [16727240, 3993855, 16757800, 10181874, 16738864, 6356880],
        a = $t(3);
      for (let f = 0; f < 22; f++) {
        const u = new THREE.Mesh(
            new THREE.PlaneGeometry(8 + a() * 18, 1.5 + a() * 5),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(n[f % n.length]).multiplyScalar(1.6), side: THREE.DoubleSide }),
          ),
          r = (f / 22) * X + a() * 0.2;
        (u.position.set(Math.cos(r) * 60, -6 + a() * 14, Math.sin(r) * 60), u.lookAt(0, u.position.y, 0), e.add(u));
      }
      const o = new THREE.Mesh(new THREE.CircleGeometry(90, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 1182242 }));
      ((o.position.y = -10), e.add(o));
      const l = new THREE.PMREMGenerator(tt);
      ((xt = l.fromScene(e, 0.02, 0.1, 200).texture), (xt.userData.k = 1), (xt.userData.shared = !0), l.dispose(), ao(e));
    } catch (e) {
      (console.warn("[render3d] env map failed", e), (xt = null));
    }
    E0[t] = xt;
  }
  function An() {
    try {
      const t = new THREE.Scene();
      t.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), oo(!1, { value: 0 }, "moon")));
      const e = $t(31),
        n = [16777215, 9105663, 14218495, 4249855, 16769712];
      for (let l = 0; l < 30; l++) {
        const f = new THREE.Mesh(
            new THREE.PlaneGeometry(4 + e() * 14, 0.6 + e() * 3),
            new THREE.MeshBasicMaterial({
              color: new THREE.Color(n[l % n.length]).multiplyScalar(1.4 + e() * 1.6),
              side: THREE.DoubleSide,
            }),
          ),
          u = e() * X;
        (f.position.set(Math.cos(u) * 60, -3 + e() * 12, Math.sin(u) * 60), f.lookAt(0, f.position.y, 0), t.add(f));
      }
      for (let l = 0; l < 14; l++) {
        const f = (l / 14) * Math.PI,
          u = new THREE.Mesh(
            new THREE.TorusGeometry(70, 0.25, 4, 48, Math.PI),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(10137800).multiplyScalar(0.5) }),
          );
        ((u.rotation.y = f), t.add(u));
      }
      const a = new THREE.Mesh(new THREE.CircleGeometry(90, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 2763568 }));
      ((a.position.y = -10), t.add(a));
      const o = new THREE.PMREMGenerator(tt);
      ((xt = o.fromScene(t, 0.015, 0.1, 200).texture), (xt.userData.shared = !0), o.dispose(), ao(t));
    } catch (t) {
      (console.warn("[render3d] moon env map failed", t), (xt = E0.harbor || null));
    }
    E0.moon = xt;
  }
  function ao(t) {
    const e = new Set();
    t.traverse((n) => {
      (n.geometry && !n.geometry.userData.shared && n.geometry.dispose(),
        n.isInstancedMesh && n.dispose && n.dispose(),
        n.material && (Array.isArray(n.material) ? n.material : [n.material]).forEach((a) => e.add(a)));
    });
    for (const n of e)
      if (!(n.userData && n.userData.shared)) {
        for (const a in n) {
          const o = n[a];
          o && o.isTexture && !o.userData.shared && o.dispose();
        }
        if (n.uniforms)
          for (const a in n.uniforms) {
            const o = n.uniforms[a] && n.uniforms[a].value;
            o && o.isTexture && !o.userData.shared && o.dispose();
          }
        n.dispose();
      }
  }
  function Ha(t) {
    const e = _e[t] || _e.harbor;
    Eo !== e.name &&
      ((Eo = e.name),
      (nt.env = Eo),
      ot.sun.value.set(e.sun[0], e.sun[1], e.sun[2]).normalize(),
      vt.fog.color.setRGB(e.fog[0], e.fog[1], e.fog[2]),
      (vt.fog.near = e.fogNear),
      (vt.fog.far = e.fogFar),
      (et.far = e.far),
      et.updateProjectionMatrix(),
      M0.color.set(e.hemiSky),
      M0.groundColor.set(e.hemiGnd),
      (M0.intensity = e.hemiI),
      wt.color.set(e.sunCol),
      (wt.intensity = e.sunI),
      r0.color.set(e.fillCol),
      (r0.intensity = e.fillI),
      r0.position.set(e.fillPos[0], e.fillPos[1], e.fillPos[2]),
      I0[e.name] || (I0[e.name] = oo(!0, ot.clouds, e.name)),
      ($e.material = I0[e.name]),
      (Ye.visible = !!e.water),
      tt && (tt.setClearColor(e.clear, 1), Ta(e.name)),
      Le && (Le.uniforms.uExposure.value = e.exposure),
      (Ne = !0));
  }
  let Qe = null;
  function Cn() {
    if (Qe) return Qe;
    const t = document.createElement("canvas");
    return (
      (t.width = t.height = 4),
      (Qe = new THREE.CanvasTexture(t)),
      (Qe.colorSpace = THREE.NoColorSpace),
      (Qe.userData.shared = !0),
      Ra(zn(Qe)),
      Qe
    );
  }
  function* zn(t) {
    const n = document.createElement("canvas");
    n.width = n.height = 512;
    const a = n.getContext("2d"),
      o = a.createImageData(512, 512),
      l = o.data,
      f = $t(1234),
      u = [];
    for (let r = 0; r < 26; r++) u.push([f() - 0.5, f() - 0.5, 0.12 + f() * 0.22, f() * X, 0.3 + f() * 0.7]);
    for (let r = 0; r < 16; r++) {
      const c = (r & 3) * 128,
        h = (r >> 2) * 128,
        v = r / 15;
      for (let i = 0; i < 128; i++) {
        (i & 15) === 15 && (yield);
        for (let s = 0; s < 128; s++) {
          const d = (s + 0.5) / 128 - 0.5,
            m = (i + 0.5) / 128 - 0.5;
          let g = 0;
          for (const H of u) {
            const U = 0.35 + v * 0.75,
              E = H[0] * U * 0.9 + Math.cos(H[3] + v * 2) * 0.03,
              y = H[1] * U * 0.9 + Math.sin(H[3] + v * 2) * 0.03,
              T = H[2] * (0.55 + v * 0.65),
              M = ((d - E) ** 2 + (m - y) ** 2) / (T * T);
            M < 1 && (g += (1 - M) * (1 - M) * H[4]);
          }
          const p = Math.hypot(d, m) * 2;
          g *= Math.max(0, 1 - p * p);
          const w = 0.75 + 0.5 * Math.sin(d * 37 + v * 9) * Math.sin(m * 41 - v * 7),
            C = ut(g * w * 1.2, 0, 1),
            D = ut(g * 1.6 - v * 1.4, 0, 1),
            x = ((h + i) * 128 * 4 + c + s) * 4;
          ((l[x] = 255 * ut(0.35 + D, 0, 1)),
            (l[x + 1] = 255 * ut(0.2 + D * 0.9, 0, 1)),
            (l[x + 2] = 255 * ut(0.12 + D * 0.7, 0, 1)),
            (l[x + 3] = 255 * C));
        }
      }
    }
    (a.putImageData(o, 0, 0), t.dispose(), (t.image = n), (t.needsUpdate = !0));
  }
  function ye(t, e, n) {
    ((this.max = t), (this.n = 0), (this.imm = 0), (this.kind = e));
    const a = (h) => new Float32Array(h);
    ((this.px = a(t)),
      (this.py = a(t)),
      (this.pz = a(t)),
      (this.vx = a(t)),
      (this.vy = a(t)),
      (this.vz = a(t)),
      (this.life = a(t)),
      (this.maxl = a(t)),
      (this.s0 = a(t)),
      (this.s1 = a(t)),
      (this.cr = a(t)),
      (this.cg = a(t)),
      (this.cb = a(t)),
      (this.grav = a(t)),
      (this.drag = a(t)),
      (this.a0 = a(t)),
      (this.rot = a(t)));
    const o = t + (n || 0);
    ((this.cap = o), (this.pos = a(o * 3)), (this.col = a(o * 3)), (this.siz = a(o)), (this.alp = a(o)), (this.age = a(o)));
    const l = new THREE.BufferGeometry(),
      f = (h, v) => new THREE.BufferAttribute(h, v).setUsage(THREE.DynamicDrawUsage);
    ((this.aPos = f(this.pos, 3)),
      (this.aCol = f(this.col, 3)),
      (this.aSiz = f(this.siz, 1)),
      (this.aAlp = f(this.alp, 1)),
      (this.aAge = f(this.age, 1)),
      l.setAttribute("position", this.aPos),
      l.setAttribute("color", this.aCol),
      l.setAttribute("aSize", this.aSiz),
      l.setAttribute("aAlpha", this.aAlp),
      l.setAttribute("aAge", this.aAge),
      l.setDrawRange(0, 0));
    const u = e === 1 || e === 2,
      r =
        e === 3
          ? `varying vec3 vC; varying float vA; varying float vAge; varying float vRot;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord * 2.0 - 1.0; float cs = cos(vRot), sn = sin(vRot); p = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y);
          float r = length(p);
          float sp = exp(-abs(p.y) * 30.0) * max(0.0, 1.0 - abs(p.x)) + exp(-abs(p.x) * 30.0) * max(0.0, 1.0 - abs(p.y));
          vec2 q = vec2(p.x + p.y, p.x - p.y) * 0.7071;
          float dg = (exp(-abs(q.y) * 45.0) * max(0.0, 1.0 - abs(q.x) * 1.6) + exp(-abs(q.x) * 45.0) * max(0.0, 1.0 - abs(q.y) * 1.6)) * 0.4;
          float a = sp + dg + exp(-r * r * 60.0) * 2.5 + exp(-r * 7.0) * 0.25;
          if (a < 0.004) discard;
          gl_FragColor = vec4(vC * a * vA * ${Ue.toFixed(2)}, min(a * vA, 2.0) * 0.6); ${Yt} }`
          : e === 0
            ? `varying vec3 vC; varying float vA; varying float vAge;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord * 2.0 - 1.0; float d = dot(p, p); if (d > 1.0) discard;
          float a = 1.0 - d; a = a * a * (0.6 + 0.4 * a);
          float core = smoothstep(0.25, 0.0, d);
          gl_FragColor = vec4((vC * ${Ue.toFixed(2)} + core * 1.2) * a * vA, a * vA * 0.7); ${Yt} }`
            : e === 1
              ? `uniform sampler2D uAtlas; varying vec3 vC; varying float vA; varying float vAge; varying float vRot;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord - 0.5; float cs = cos(vRot), sn = sin(vRot); p = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y) + 0.5;
          if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
          float fr = floor(clamp(vAge, 0.0, 0.999) * 16.0); vec2 cell = vec2(mod(fr, 4.0), floor(fr / 4.0));
          vec4 t = texture2D(uAtlas, (cell + p) / 4.0);
          vec3 hot = mix(vC, vec3(1.0, 0.95, 0.8), t.r * (1.0 - vAge));
          gl_FragColor = vec4(hot * t.a * vA * 3.2 * (1.2 - vAge), t.a * vA * 0.6); ${Yt} }`
              : `uniform sampler2D uAtlas; varying vec3 vC; varying float vA; varying float vAge; varying float vRot;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord - 0.5; float cs = cos(vRot), sn = sin(vRot); p = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y) + 0.5;
          if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
          float fr = floor(clamp(vAge * 0.6 + 0.4, 0.0, 0.999) * 16.0); vec2 cell = vec2(mod(fr, 4.0), floor(fr / 4.0));
          vec4 t = texture2D(uAtlas, (cell + p) / 4.0);
          gl_FragColor = vec4(vC * (0.6 + 0.4 * t.r), t.a * vA);
          #include <fog_fragment>
        }`,
      c = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          { uScale: { value: 400 }, uAtlas: { value: null }, uMaxPx: { value: 300 } },
        ]),
        vertexShader: `attribute float aSize; attribute float aAlpha; attribute float aAge; attribute vec3 color; uniform float uScale; uniform float uMaxPx;
        varying vec3 vC; varying float vA; varying float vAge; varying float vRot; ${Tt}
        void main(){ vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = clamp(aSize * uScale / max(1.0, -mvPosition.z), 1.0, uMaxPx); vC = color; vA = aAlpha; vAge = aAge;
          vRot = fract(sin(dot(position.xz, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831 + aAge;
          #include <fog_vertex>
        }`,
        fragmentShader: r,
        fog: !0,
      });
    ((c.uniforms.uMaxPx = ot.maxPx),
      u && (c.uniforms.uAtlas.value = Cn()),
      e === 2 ? ia(c) : p0(c),
      (this.uScale = c.uniforms.uScale),
      (this.mesh = new THREE.Points(l, c)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = e === 2 ? 9 : 10));
  }
  ((ye.prototype.emit = function (t, e, n, a, o, l, f, u, r, c, h, v, i, s, d) {
    let m = this.n;
    (m >= this.max ? (m = (Math.random() * this.max) | 0) : this.n++,
      (this.px[m] = t),
      (this.py[m] = e),
      (this.pz[m] = n),
      (this.vx[m] = a),
      (this.vy[m] = o),
      (this.vz[m] = l),
      (this.life[m] = f),
      (this.maxl[m] = f),
      (this.s0[m] = u),
      (this.s1[m] = r),
      (this.cr[m] = c),
      (this.cg[m] = h),
      (this.cb[m] = v),
      (this.grav[m] = i),
      (this.drag[m] = s),
      (this.a0[m] = d ?? 1));
  }),
    (ye.prototype.step = function (t) {
      let e = this.n;
      for (let r = 0; r < e; r++) {
        if (((this.life[r] -= t), this.life[r] <= 0)) {
          (e--,
            r !== e &&
              ((this.px[r] = this.px[e]),
              (this.py[r] = this.py[e]),
              (this.pz[r] = this.pz[e]),
              (this.vx[r] = this.vx[e]),
              (this.vy[r] = this.vy[e]),
              (this.vz[r] = this.vz[e]),
              (this.life[r] = this.life[e]),
              (this.maxl[r] = this.maxl[e]),
              (this.s0[r] = this.s0[e]),
              (this.s1[r] = this.s1[e]),
              (this.cr[r] = this.cr[e]),
              (this.cg[r] = this.cg[e]),
              (this.cb[r] = this.cb[e]),
              (this.grav[r] = this.grav[e]),
              (this.drag[r] = this.drag[e]),
              (this.a0[r] = this.a0[e]),
              r--));
          continue;
        }
        const c = Math.max(0, 1 - this.drag[r] * t);
        ((this.vx[r] *= c),
          (this.vy[r] = this.vy[r] * c - this.grav[r] * t),
          (this.vz[r] *= c),
          (this.px[r] += this.vx[r] * t),
          (this.py[r] += this.vy[r] * t),
          (this.pz[r] += this.vz[r] * t));
      }
      this.n = e;
      const n = this.pos,
        a = this.col,
        o = this.siz,
        l = this.alp,
        f = this.age,
        u = this.kind > 0;
      for (let r = 0; r < e; r++) {
        const c = this.life[r] / this.maxl[r];
        ((n[r * 3] = this.px[r]),
          (n[r * 3 + 1] = this.py[r]),
          (n[r * 3 + 2] = this.pz[r]),
          (a[r * 3] = this.cr[r]),
          (a[r * 3 + 1] = this.cg[r]),
          (a[r * 3 + 2] = this.cb[r]),
          (o[r] = this.s1[r] + (this.s0[r] - this.s1[r]) * c),
          (l[r] = this.a0[r] * (u ? Math.min(1, c * 3) * Math.min(1, (1 - c) * 8) : Math.min(1, c * 2.2))),
          (f[r] = 1 - c));
      }
      this.imm = e;
    }),
    (ye.prototype.glow = function (t, e, n, a, o, l, f, u) {
      const r = this.imm;
      r >= this.cap ||
        ((this.pos[r * 3] = t),
        (this.pos[r * 3 + 1] = e),
        (this.pos[r * 3 + 2] = n),
        (this.col[r * 3] = o),
        (this.col[r * 3 + 1] = l),
        (this.col[r * 3 + 2] = f),
        (this.siz[r] = a),
        (this.alp[r] = u),
        (this.age[r] = 0),
        (this.imm = r + 1));
    }),
    (ye.prototype.star = function (t, e, n, a, o, l, f, u, r) {
      const c = this.imm;
      return c >= this.cap
        ? !1
        : ((this.pos[c * 3] = t),
          (this.pos[c * 3 + 1] = e),
          (this.pos[c * 3 + 2] = n),
          (this.col[c * 3] = o),
          (this.col[c * 3 + 1] = l),
          (this.col[c * 3 + 2] = f),
          (this.siz[c] = a),
          (this.alp[c] = u),
          (this.age[c] = r),
          (this.imm = c + 1),
          !0);
    }),
    (ye.prototype.flush = function () {
      const t = this.imm;
      if ((this.mesh.geometry.setDrawRange(0, t), (this.mesh.visible = t > 0), t > 0))
        for (const e of [this.aPos, this.aCol, this.aSiz, this.aAlp, this.aAge])
          ((e.needsUpdate = !0), (e.updateRange.offset = 0), (e.updateRange.count = t * e.itemSize));
    }));
  function _o(t) {
    ((this.max = t), (this.n = 0));
    const e = (o) => new Float32Array(t * o);
    ((this.p = e(3)), (this.v = e(3)), (this.r = e(3)), (this.w = e(3)), (this.life = e(1)), (this.sz = e(1)), (this.floor = e(1)));
    const n = new THREE.TetrahedronGeometry(1, 0);
    n.scale(1, 0.45, 0.8);
    const a = new THREE.MeshStandardMaterial({
      color: 2762288,
      roughness: 0.5,
      metalness: 0.6,
      emissive: 16734736,
      emissiveIntensity: 0.9,
      envMap: null,
    });
    ((this.mesh = new THREE.InstancedMesh(n, a, t)),
      (this.mesh.count = 0),
      (this.mesh.frustumCulled = !1),
      (this.mesh.castShadow = !1),
      (this.mat = a));
  }
  ((_o.prototype.spawn = function (t, e, n, a) {
    let o = this.n < this.max ? this.n++ : (Math.random() * this.max) | 0;
    const l = Math.random() * X,
      f = 25 + Math.random() * 70;
    ((this.p[o * 3] = t),
      (this.p[o * 3 + 1] = e),
      (this.p[o * 3 + 2] = n),
      (this.v[o * 3] = Math.cos(l) * f),
      (this.v[o * 3 + 1] = 30 + Math.random() * 70),
      (this.v[o * 3 + 2] = Math.sin(l) * f),
      (this.r[o * 3] = Math.random() * X),
      (this.r[o * 3 + 1] = Math.random() * X),
      (this.r[o * 3 + 2] = 0),
      (this.w[o * 3] = (Math.random() - 0.5) * 20),
      (this.w[o * 3 + 1] = (Math.random() - 0.5) * 20),
      (this.w[o * 3 + 2] = (Math.random() - 0.5) * 20),
      (this.life[o] = 2.2 + Math.random() * 1.5),
      (this.sz[o] = 0.5 + Math.random() * 1.4),
      (this.floor[o] = a));
  }),
    (_o.prototype.step = function (t) {
      let e = this.n;
      for (let n = 0; n < e; n++) {
        if (((this.life[n] -= t), this.life[n] <= 0)) {
          if ((e--, n !== e)) {
            for (let a = 0; a < 3; a++)
              ((this.p[n * 3 + a] = this.p[e * 3 + a]),
                (this.v[n * 3 + a] = this.v[e * 3 + a]),
                (this.r[n * 3 + a] = this.r[e * 3 + a]),
                (this.w[n * 3 + a] = this.w[e * 3 + a]));
            ((this.life[n] = this.life[e]), (this.sz[n] = this.sz[e]), (this.floor[n] = this.floor[e]), n--);
          }
          continue;
        }
        this.v[n * 3 + 1] -= 160 * t;
        for (let a = 0; a < 3; a++) ((this.p[n * 3 + a] += this.v[n * 3 + a] * t), (this.r[n * 3 + a] += this.w[n * 3 + a] * t));
        if (this.p[n * 3 + 1] < this.floor[n] + 0.4 && this.v[n * 3 + 1] < 0) {
          ((this.p[n * 3 + 1] = this.floor[n] + 0.4), (this.v[n * 3 + 1] *= -0.35), (this.v[n * 3] *= 0.6), (this.v[n * 3 + 2] *= 0.6));
          for (let a = 0; a < 3; a++) this.w[n * 3 + a] *= 0.5;
        }
      }
      this.n = e;
      for (let n = 0; n < e; n++) {
        (Q.set(this.p[n * 3], this.p[n * 3 + 1], this.p[n * 3 + 2]),
          Me.set(this.r[n * 3], this.r[n * 3 + 1], this.r[n * 3 + 2]),
          ne.setFromEuler(Me));
        const a = this.sz[n] * Math.min(1, this.life[n] * 2);
        (re.set(a, a, a), ae.compose(Q, ne, re), this.mesh.setMatrixAt(n, ae));
      }
      ((this.mesh.count = e),
        (this.mesh.visible = e > 0),
        e > 0 && (this.mesh.instanceMatrix.needsUpdate = !0),
        (this.mat.emissiveIntensity = 0.9));
    }));
  const ae = new THREE.Matrix4(),
    ne = new THREE.Quaternion(),
    Q = new THREE.Vector3(),
    s0 = new THREE.Vector3(),
    re = new THREE.Vector3(),
    Me = new THREE.Euler(0, 0, 0, "YZX");
  let Kt = null,
    Je = null,
    zt = null,
    Ae = null,
    Ce = null,
    Ie = null,
    Xt = null,
    ze = null,
    se = null,
    ke = null;
  const i0 = 90,
    he = new Float32Array(i0 * 4),
    Fe = new Float32Array(Ut * 2 * Mt * 3),
    no = new Int32Array(Ut),
    l0 = new Int32Array(Ut),
    Bo = new Float32Array(Ut),
    ro = Ut * 3;
  function kn() {
    ((zt = new ye(nn, 0, 320)),
      (Ae = new ye(600, 1, 0)),
      (Ce = new ye(rn, 2, 0)),
      (Ie = new _o(sn)),
      (Kt = new ye(0, 3, 192)),
      (Kt.mesh.renderOrder = 12),
      vt.add(zt.mesh, Ae.mesh, Ce.mesh, Ie.mesh, Kt.mesh));
    const t = new THREE.BufferGeometry();
    t.setAttribute("position", new THREE.BufferAttribute(new Float32Array(i0 * 6), 3).setUsage(THREE.DynamicDrawUsage));
    const e = new Float32Array(i0 * 6);
    for (let p = 0; p < i0; p++) ((e[p * 6 + 3] = 0.9), (e[p * 6 + 4] = 1.3), (e[p * 6 + 5] = 1.6));
    t.setAttribute("color", new THREE.BufferAttribute(e, 3));
    const n = new THREE.LineBasicMaterial({ vertexColors: !0, depthTest: !1, fog: !1 });
    (p0(n),
      (Xt = new THREE.LineSegments(t, n)),
      (Xt.frustumCulled = !1),
      (Xt.renderOrder = 20),
      (Xt.visible = !1),
      (Xt.userData.k = 0),
      et.add(Xt));
    for (let p = 0; p < i0; p++) Aa(p, !0);
    const a = document.createElement("canvas");
    a.width = a.height = 64;
    const o = a.getContext("2d"),
      l = o.createRadialGradient(32, 32, 2, 32, 32, 31);
    (l.addColorStop(0, "rgba(0,0,0,0.85)"),
      l.addColorStop(0.55, "rgba(0,0,0,0.5)"),
      l.addColorStop(1, "rgba(0,0,0,0)"),
      (o.fillStyle = l),
      o.fillRect(0, 0, 64, 64));
    const f = new THREE.CanvasTexture(a),
      u = new THREE.PlaneGeometry(1, 1);
    u.rotateX(-Math.PI / 2);
    const r = new THREE.MeshBasicMaterial({ map: f, polygonOffset: !0, polygonOffsetFactor: -4, polygonOffsetUnits: -4, fog: !1 });
    (ia(r), (ze = new THREE.InstancedMesh(u, r, Ut)), (ze.count = 0), (ze.frustumCulled = !1), (ze.renderOrder = 2), vt.add(ze));
    const c = Ut * 2 * Mt * 2,
      h = new THREE.BufferGeometry();
    (h.setAttribute("position", new THREE.BufferAttribute(new Float32Array(c * 3), 3).setUsage(THREE.DynamicDrawUsage)),
      h.setAttribute("aF", new THREE.BufferAttribute(new Float32Array(c), 1).setUsage(THREE.DynamicDrawUsage)));
    const v = [];
    for (let p = 0; p < Ut * 2; p++)
      for (let w = 0; w < Mt - 1; w++) {
        const C = (p * Mt + w) * 2;
        v.push(C, C + 1, C + 2, C + 1, C + 3, C + 2);
      }
    (h.setIndex(v), h.setDrawRange(0, 0));
    const i = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
      vertexShader: `attribute float aF; varying float vF; ${Tt}
        void main(){ vF = aF; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `varying float vF;
        #include <fog_pars_fragment>
        void main(){ float f = vF; vec3 c = mix(vec3(0.9, 0.04, 0.08), vec3(2.6, 0.6, 0.45), f * f); gl_FragColor = vec4(c * f * 1.4, 0.0); ${Yt} }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
    (Re(i), (se = new THREE.Mesh(h, i)), (se.frustumCulled = !1), (se.renderOrder = 11), vt.add(se));
    const s = new THREE.BufferGeometry();
    s.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ro * 4 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    const d = new Float32Array(ro * 4 * 2),
      m = [];
    for (let p = 0; p < ro; p++) (d.set([0, 0, 1, 0, 1, 1, 0, 1], p * 8), m.push(p * 4, p * 4 + 1, p * 4 + 2, p * 4, p * 4 + 2, p * 4 + 3));
    (s.setAttribute("uv", new THREE.BufferAttribute(d, 2)), s.setIndex(m), s.setDrawRange(0, 0));
    const g = new THREE.ShaderMaterial({
      uniforms: { uK: { value: 1 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "uniform float uK; varying vec2 vUv; void main(){ vec2 p = vUv * 2.0 - 1.0; float a = (1.0 - smoothstep(0.2, 1.0, length(p * vec2(0.8, 1.6)))) * smoothstep(-1.0, -0.6, p.x) * uK; gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(a, 0.0, 1.0)); }",
      transparent: !0,
      depthWrite: !1,
      side: THREE.DoubleSide,
    });
    ((g.blending = THREE.CustomBlending),
      (g.blendEquation = THREE.AddEquation),
      (g.blendSrc = THREE.ZeroFactor),
      (g.blendDst = THREE.OneFactor),
      (g.blendEquationAlpha = THREE.AddEquation),
      (g.blendSrcAlpha = THREE.ZeroFactor),
      (g.blendDstAlpha = THREE.OneMinusSrcAlphaFactor),
      (ke = new THREE.Mesh(s, g)),
      (ke.frustumCulled = !1),
      (ke.renderOrder = 30),
      vt.add(ke));
  }
  function Aa(t, e) {
    const n = Math.random() * X,
      a = 6 + Math.random() * 26;
    ((he[t * 4] = Math.cos(n) * a * 1.8),
      (he[t * 4 + 1] = Math.sin(n) * a * 0.9 + 2),
      (he[t * 4 + 2] = e ? -10 - Math.random() * 190 : -160 - Math.random() * 60),
      (he[t * 4 + 3] = 0.7 + Math.random() * 0.6));
  }
  function* Fn(t, e) {
    const n = performance.now(),
      a = t.n,
      o = t.STEP || 4,
      l = t.path,
      f = t.ang,
      u = a * o,
      r = new Float32Array(a),
      c = new Float32Array(a),
      h = new Float32Array(a),
      v = new Float32Array(a),
      i = new Float32Array(a),
      s = new Float32Array(a),
      d = new Float32Array(a),
      m = new Float32Array(a),
      g = new Float32Array(a),
      p = new Float32Array(a),
      w = new Float32Array(a),
      C = new Uint8Array(a);
    for (let E = 0; E < a; E++) {
      ((r[E] = l[2 * E]), (c[E] = l[2 * E + 1]));
      const y = f[E];
      ((i[E] = Math.cos(y)), (s[E] = Math.sin(y)), (h[E] = -Math.sin(y)), (v[E] = Math.cos(y)), (p[E] = t.halfWidth[E]));
    }
    const D = new Float32Array(a);
    for (let E = 0; E < a; E++) {
      let y = f[(E + 3) % a] - f[(E - 3 + a) % a];
      for (; y > Math.PI;) y -= X;
      for (; y < -Math.PI;) y += X;
      D[E] = y / (6 * o);
    }
    for (let E = 0; E < a; E++) {
      let y = 0;
      for (let T = -12; T <= 12; T++) y += D[(E + T + a) % a];
      w[E] = y / 25;
    }
    for (let E = 0; E < a; E++) {
      let y = 0;
      for (let S = -14; S <= 14; S++) y = Math.max(y, Math.abs(D[(E + S + a) % a]));
      C[E] = y > 1 / 150 ? 1 : 0;
      const T = w[E],
        M = Math.abs(T);
      m[E] = -Math.sign(T) * 0.31 * Math.min(1, Math.pow(M * 60, 0.75));
    }
    for (let E = 0; E < a; E++) {
      const y = E / a;
      let T = E * o;
      T > u / 2 && (T -= u);
      const M = ut((Math.abs(T) - 220) / 500, 0, 1),
        S = M * M * (3 - 2 * M);
      d[E] = 46 + S * (16 + 40 * Math.sin(X * 2 * y) + 19 * Math.sin(X * 5 * y + 1.1) + 9 * Math.sin(X * 9 * y + 2));
    }
    for (let E = 0; E < a; E++) d[E] = Math.max(d[E], 10 + Math.abs(m[E]) * (p[E] + kt) + ce);
    const x = new Float32Array(a);
    for (let E = 0; E < 3; E++) {
      for (let y = 0; y < a; y++) {
        let T = 0;
        for (let M = -8; M <= 8; M++) T += d[(y + M + a) % a];
        x[y] = T / 17;
      }
      d.set(x);
    }
    for (let E = 0; E < 2; E++) {
      for (let y = 0; y < a; y++) {
        let T = 0;
        for (let M = -6; M <= 6; M++) T += m[(y + M + a) % a];
        x[y] = T / 13;
      }
      m.set(x);
    }
    for (let E = 0; E < a; E++) g[E] = (d[(E + 1) % a] - d[(E - 1 + a) % a]) / (2 * o);
    const H = _e[t.env] ? t.env : "harbor";
    (yield, Ta(H));
    const U = {
      track: t,
      n: a,
      STEP: o,
      L: u,
      CX: r,
      CZ: c,
      RX: h,
      RZ: v,
      FX: i,
      FZ: s,
      E: d,
      S: m,
      G: g,
      HW: p,
      K: w,
      TIGHT: C,
      hint: -1,
      group: new THREE.Group(),
      tris: 0,
      holo: [],
      rigs: [],
      env: H,
      pal: cn[H],
      lods: [],
      glintPts: [],
      anim: [],
    };
    return (
      (U.nCh = Math.max(2, Math.round(u / Un))),
      (U.lodForce = !0),
      (U.cullD = _e[H].fogFar * 1.02),
      (U.vPer = u / Math.round(u / 64)),
      (U.neon = new Et()),
      (e.T = U),
      (e.envTex = xt),
      yield,
      yield* qn(U),
      yield* On(U),
      yield* jn(U),
      Vn(U),
      yield,
      Kn(U),
      yield,
      Qn(U),
      yield,
      tr(U),
      yield,
      H === "moon" ? (yield* hr(U), Ua(U)) : (Ua(U), yield, yield* er(U), yield, yield* nr(U)),
      yield,
      (U.tris += U.neon.tris()),
      Nn(U.group, U.neon.split((t.size || 2048) / Ln, { normal: !1, uv: !1 }), In()),
      (U.neon = null),
      U.group.traverse((E) => {
        E !== U.group && ((E.matrixAutoUpdate = !1), E.updateMatrix());
      }),
      (U.ms = performance.now() - n),
      (nt.buildMs = Math.round(U.ms)),
      U
    );
  }
  let ht = null;
  const Ca = { harbor: 60, moon: 90 };
  function Wo(t) {
    (za(), (ht = { track: t, gen: null, envTex: null, T: null, steps: 0, est: Ca[t.env] || 70 }), (ht.gen = Fn(t, ht)));
  }
  function za() {
    ht && (ht.T && (vt.remove(ht.T.group), ao(ht.T.group)), (ht = null));
  }
  function Lo(t) {
    if (!ht) return null;
    const e = performance.now() + t,
      n = xt;
    let a = null;
    try {
      for (;;) {
        ht.envTex && (xt = ht.envTex);
        const o = performance.now(),
          l = ht.gen.next(),
          f = performance.now() - o;
        if (
          (ht.steps === 1 ? (nt.envMs = Math.round(f)) : f > nt.maxStepMs && ((nt.maxStepMs = Math.round(f)), (nt.maxStepAt = ht.steps)),
          (ht.envTex = xt),
          ht.steps++,
          l.done)
        ) {
          a = l.value;
          break;
        }
        if (performance.now() > e) break;
      }
    } catch (o) {
      throw (console.warn("[render3d] track build failed", o), (ht = null), (xt = n), o);
    }
    return ((xt = n), a ? ((Ca[a.env] = ht.steps), (ht = null), Pn(a), a) : null);
  }
  function Pn(t) {
    for (ue.set(t.track, t); ue.size > dn;) {
      let e = null;
      for (const [a, o] of ue)
        if (o !== t && o !== pt) {
          e = a;
          break;
        }
      if (e === null) break;
      const n = ue.get(e);
      (ue.delete(e), vt.remove(n.group), ao(n.group));
    }
    if (((t.ready = !0), tt && S0)) {
      t.ready = !1;
      const e = () => {
        t.ready = !0;
      };
      try {
        tt.compileAsync ? tt.compileAsync(t.group, et, vt).then(e, e) : (tt.compile(t.group, et, vt), e());
      } catch {
        e();
      }
    }
  }
  function No(t) {
    (pt && pt !== t && vt.remove(pt.group),
      (pt = t),
      t.group.parent !== vt && vt.add(t.group),
      Ha(t.env),
      to(j.tier, !1),
      (Ne = !0),
      tt && tt.setClearColor(_e[t.env].clear, 1),
      (nt.loading = 0));
  }
  function Dn(t) {
    Wo(t);
    const e = Lo(1e9);
    return ((e.ready = !0), No(e), e);
  }
  const Io = 230,
    Un = 840,
    _n = 900,
    Bn = 2600;
  function Go(t, e, n) {
    const a = e.geometry.boundingSphere;
    (t.lods.push({ lo: e, mkHi: n, hi: null, group: t.group, x: a.center.x, y: a.center.y, z: a.center.z, r: a.radius }), (e.visible = !0));
  }
  function Wn(t, e, n, a) {
    let o = 0,
      l = t.lodForce ? 1e9 : 1;
    const f = t.cullD;
    for (let u = 0; u < t.lods.length; u++) {
      const r = t.lods[u],
        c = r.x - e,
        h = r.y - n,
        v = r.z - a,
        i = Math.sqrt(c * c + h * h + v * v) - r.r;
      if (i < Io + _n && !r.hi && (l > 0 || i < Io * 0.5)) {
        l--;
        const m = r.mkHi();
        ((m.matrixAutoUpdate = !1), m.updateMatrix(), (m.visible = !1), r.group.add(m), (r.hi = m));
      } else i > Bn && r.hi && (r.group.remove(r.hi), r.hi.geometry.dispose(), (r.hi = null));
      const s = i < Io && r.hi !== null,
        d = i > f;
      (r.hi && (r.hi.visible = s), (r.lo.visible = !s && !d), s && o++);
    }
    ((t.lodForce = !1), (nt.lodHi = o));
  }
  function qo(t, e) {
    return [Math.floor((e * t.n) / t.nCh), Math.floor(((e + 1) * t.n) / t.nCh)];
  }
  const Ln = 4;
  function Nn(t, e, n, a) {
    const o = [];
    for (const l of e) {
      const f = new THREE.Mesh(l, n);
      (a && (a.receiveShadow && (f.receiveShadow = !0), a.renderOrder && (f.renderOrder = a.renderOrder)), t.add(f), o.push(f));
    }
    return o;
  }
  function ka(t, e) {
    return (
      (t.defines = t.defines || {}),
      (t.defines.GLINT_MODE = e),
      (t.customProgramCacheKey = () => "glint" + e),
      (t.onBeforeCompile = (n) => {
        ((n.uniforms.uTime = ot.time),
          (n.uniforms.uGlint = ot.glint),
          (n.uniforms.uSunV = ot.sunV),
          (n.vertexShader =
            `varying vec3 vGW;
` +
            n.vertexShader.replace(
              "#include <project_vertex>",
              `#include <project_vertex>
 vGW = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
            )),
          (n.fragmentShader =
            `varying vec3 vGW; uniform float uTime; uniform float uGlint; uniform vec3 uSunV;
` +
            n.fragmentShader.replace(
              "#include <opaque_fragment>",
              `
        if (uGlint > 0.5) {
          vec3 Vg = normalize(vViewPosition); vec3 Rg = reflect(-Vg, normal); float sg = max(dot(Rg, uSunV), 0.0);
          #if GLINT_MODE == 0
            float band = pow(0.5 + 0.5 * sin(dot(vGW.xz, vec2(0.045, 0.028)) - uTime * 1.6), 10.0);
            vec2 cp = floor(vGW.xz * 0.7); float hs = fract(sin(dot(cp, vec2(12.9898, 78.233))) * 43758.5453);
            float spark = step(0.993, hs) * pow(max(0.0, sin(uTime * 7.0 + hs * 60.0)), 6.0);
            outgoingLight += vec3(1.0, 0.62, 0.36) * (pow(sg, 30.0) * (0.15 + 1.7 * band) + pow(sg, 3.0) * spark * 5.0 + spark * 0.35);
          #else
            float sweep = pow(0.5 + 0.5 * sin((vGW.x + vGW.z) * 0.11 + vGW.y * 0.25 - uTime * 2.4), 28.0);
            float fres = pow(1.0 - max(dot(normal, Vg), 0.0), 2.0);
            outgoingLight += vec3(1.0, 0.85, 0.7) * (sweep * (0.6 + 1.6 * fres) * 1.4 + pow(sg, 40.0) * 3.0);
          #endif
        }
        #include <opaque_fragment>`,
            )));
      }),
      t
    );
  }
  function In() {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsLib.fog,
      vertexShader: `attribute vec3 color; varying vec3 vC; ${Tt}
        void main(){ vC = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `varying vec3 vC;
        #include <fog_pars_fragment>
        void main(){ gl_FragColor = vec4(vC * ${Ue.toFixed(2)}, 1.0);
        #include <fog_fragment>
        }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
  }
  const k = { x: 0, z: 0, rx: 0, rz: 0, fx: 0, fz: 0, e: 0, s: 0, g: 0, hw: 0, i: 0 };
  function Pt(t, e, n) {
    const a = t.n;
    let o = e / t.STEP;
    o = ((o % a) + a) % a;
    const l = Math.floor(o),
      f = o - l,
      u = (l - 1 + a) % a,
      r = (l + 1) % a,
      c = (l + 2) % a;
    ((n.x = Se(t.CX[u], t.CX[l], t.CX[r], t.CX[c], f)), (n.z = Se(t.CZ[u], t.CZ[l], t.CZ[r], t.CZ[c], f)));
    const h = Se(t.CX[u], t.CX[l], t.CX[r], t.CX[c], f + 0.01) - n.x,
      v = Se(t.CZ[u], t.CZ[l], t.CZ[r], t.CZ[c], f + 0.01) - n.z,
      i = Math.hypot(h, v) || 1;
    return (
      (n.fx = h / i),
      (n.fz = v / i),
      (n.rx = -n.fz),
      (n.rz = n.fx),
      (n.e = Se(t.E[u], t.E[l], t.E[r], t.E[c], f)),
      (n.s = Se(t.S[u], t.S[l], t.S[r], t.S[c], f)),
      (n.g = t.G[l] + (t.G[r] - t.G[l]) * f),
      (n.hw = t.HW[l] + (t.HW[r] - t.HW[l]) * f),
      (n.i = l),
      n
    );
  }
  function ct(t, e, n) {
    return [t.x + t.rx * e, t.e + e * t.s + n, t.z + t.rz * e];
  }
  let so = null;
  function* Gn(t) {
    const e = !so,
      a = (tt ? tt.capabilities.maxTextureSize : 4096) >= 4096 ? 4096 : 2048,
      o = a / 2,
      l = 2048,
      f = 1024,
      u = 2048,
      r = 1024,
      c = document.createElement("canvas");
    ((c.width = a), (c.height = o));
    const h = c.getContext("2d");
    h.setTransform(a / 1024, 0, 0, o / 1024, 0, 0);
    const v = document.createElement("canvas");
    ((v.width = l), (v.height = f));
    const i = v.getContext("2d");
    (i.setTransform(l / 1024, 0, 0, f / 1024, 0, 0), (i.fillStyle = "#000"), i.fillRect(0, 0, 1024, 1024));
    const s = $t(77),
      d = e ? new Float32Array(u * r).fill(0.5) : null,
      m = u / 1024,
      g = r / 1024,
      p = (y, T, M, S, z) => {
        if (!e) return;
        const B = Math.max(0, Math.round(y * m)),
          b = Math.min(u, Math.round((y + M) * m)),
          F = Math.max(0, Math.round(T * g)),
          _ = Math.min(r, Math.round((T + S) * g));
        for (let R = F; R < _; R++) for (let A = B; A < b; A++) d[R * u + A] = z;
      },
      w = h.createLinearGradient(0, 0, 1024, 0);
    (w.addColorStop(0, t.a), w.addColorStop(0.5, t.b), w.addColorStop(1, t.a), (h.fillStyle = w), h.fillRect(0, 0, 1024, 1024));
    for (let y = 0; y < 1024; y += 256)
      for (let T = 0; T < 1024; T += 256) {
        const M = s() * 0.08 - 0.04;
        if (
          ((h.fillStyle = M > 0 ? "rgba(255,255,255," + M + ")" : "rgba(0,0,0," + -M * 1.5 + ")"),
          h.fillRect(T + 4, y + 4, 248, 248),
          p(T + 4, y + 4, 248, 248, 0.5 + M * 0.6),
          s() < 0.35 &&
            ((h.fillStyle = "rgba(0,0,0,0.12)"), h.fillRect(T + 30 + s() * 100, y + 30 + s() * 100, 60 + s() * 60, 30 + s() * 40)),
          s() < 0.5)
        ) {
          const S = T + 40 + s() * 120,
            z = y + 40 + s() * 120;
          ((h.strokeStyle = "rgba(0,0,0,0.35)"),
            (h.lineWidth = 1.2),
            h.strokeRect(S, z, 46, 30),
            p(S, z, 46, 1.2, 0.35),
            p(S, z + 29, 46, 1.2, 0.35),
            (h.fillStyle = "rgba(255,255,255,0.10)"));
          for (const [B, b] of [
            [3, 3],
            [41, 3],
            [3, 25],
            [41, 25],
          ])
            h.fillRect(S + B, z + b, 2, 2);
        }
      }
    for (let y = 0; y < 420; y++) {
      const T = s() * 1024,
        M = s() * 1024,
        S = 40 + s() * 260;
      ((h.fillStyle =
        s() < 0.7 ? "rgba(0,0,0," + (0.04 + s() * 0.07).toFixed(3) + ")" : "rgba(255,255,255," + (0.015 + s() * 0.03).toFixed(3) + ")"),
        h.fillRect(T, M, 0.6 + s() * 1.6, S));
    }
    h.fillStyle = t.seam;
    for (let y = 0; y < 1024; y += 256) (h.fillRect(0, y, 1024, 5), p(0, y, 1024, 5, 0.1));
    for (let y = 256; y < 1024; y += 256) (h.fillRect(y - 2, 0, 5, 1024), p(y - 2, 0, 5, 1024, 0.1));
    for (let y = 128; y < 1024; y += 256) ((h.fillStyle = "rgba(10,10,24,0.6)"), h.fillRect(0, y, 1024, 2), p(0, y, 1024, 2, 0.3));
    h.fillStyle = t.rivet;
    for (let y = 0; y < 1024; y += 256)
      for (let T = 0; T < 1024; T += 256)
        for (const [M, S] of [
          [12, 12],
          [238, 12],
          [12, 238],
          [238, 238],
        ])
          (h.fillRect(T + M, y + S, 6, 6), p(T + M, y + S, 6, 6, 0.85));
    for (let y = 0; y < 1024; y += 16) for (let T = 64; T < 1024; T += 256) (h.fillRect(T, y + 7, 2.5, 2.5), p(T, y + 7, 2.5, 2.5, 0.75));
    for (let y = 0; y < 1024; y += 128)
      ((h.fillStyle = t.center),
        h.fillRect(1024 / 2 - 6, y + 16, 12, 68),
        (i.fillStyle = t.centerE),
        i.fillRect(1024 / 2 - 6, y + 16, 12, 68));
    ((h.fillStyle = t.lane), h.fillRect(1024 * 0.25 - 2, 0, 4, 1024), h.fillRect(1024 * 0.75 - 2, 0, 4, 1024));
    for (const y of [0, 1]) {
      const T = y ? 1e3 : 8,
        M = y ? 972 : 28;
      ((h.fillStyle = t.edge), h.fillRect(T, 0, 16, 1024), (i.fillStyle = t.edgeE), i.fillRect(T, 0, 16, 1024));
      for (let S = 0; S < 1024; S += 64)
        ((h.fillStyle = t.dash), h.fillRect(M, S, 20, 32), (i.fillStyle = t.dashE), i.fillRect(M, S, 20, 32));
      ((h.fillStyle = t.lip), h.fillRect(y ? 1016 : 0, 0, 8, 1024), p(y ? 1016 : 0, 0, 8, 1024, 0.2));
    }
    yield;
    const C = document.createElement("canvas");
    C.width = C.height = 256;
    const D = C.getContext("2d"),
      x = D.createImageData(256, 256);
    for (let y = 0; y < 256 * 256; y++) {
      const T = s(),
        M = y * 4;
      ((x.data[M] = x.data[M + 1] = x.data[M + 2] = T > 0.5 ? 255 : 0), (x.data[M + 3] = (Math.abs(T - 0.5) * 2) ** 3 * 34));
    }
    (D.putImageData(x, 0, 0), h.setTransform(1, 0, 0, 1, 0, 0), (h.fillStyle = h.createPattern(C, "repeat")), h.fillRect(0, 0, a, o));
    const H = (y) =>
        function (T) {
          ((T.userData.dim = [y.width, y.height]), (y.width = y.height = 1));
        },
      U = new THREE.CanvasTexture(c),
      E = new THREE.CanvasTexture(v);
    for (const y of [U, E])
      ((y.wrapS = THREE.ClampToEdgeWrapping),
        (y.wrapT = THREE.RepeatWrapping),
        (y.anisotropy = pe),
        (y.minFilter = THREE.LinearMipmapLinearFilter),
        (y.generateMipmaps = !0));
    if (((U.onUpdate = H(c)), (E.onUpdate = H(v)), e)) {
      yield;
      for (let z = 0; z < u * r; z++) d[z] += (s() - 0.5) * 0.012;
      const y = L0(hn(d, u, r, 9), u, !0, r);
      ((y.wrapS = THREE.ClampToEdgeWrapping),
        (y.wrapT = THREE.RepeatWrapping),
        (y.anisotropy = pe),
        (y.minFilter = THREE.LinearMipmapLinearFilter),
        (y.generateMipmaps = !0),
        (y.onUpdate = function () {
          y.image.data = null;
        }),
        yield);
      const T = document.createElement("canvas");
      ((T.width = 512), (T.height = 512));
      const M = T.getContext("2d");
      ((M.fillStyle = "rgb(0,120,0)"), M.fillRect(0, 0, 512, 512));
      for (let z = 0; z < 2800; z++)
        ((M.fillStyle = "rgba(0," + ((90 + s() * 120) | 0) + ",0,0.25)"), M.fillRect(s() * 512, s() * 512, 6 + s() * 18, 8 + s() * 40));
      M.fillStyle = "rgb(0,230,0)";
      for (let z = 0; z < 512; z += 128) M.fillRect(0, z, 512, 3);
      const S = new THREE.CanvasTexture(T);
      ((S.wrapS = THREE.ClampToEdgeWrapping),
        (S.wrapT = THREE.RepeatWrapping),
        (S.anisotropy = pe),
        (S.onUpdate = H(T)),
        (y.userData.shared = S.userData.shared = !0),
        (so = { nrm: y, rough: S }));
    }
    return [U, E, so.nrm, so.rough];
  }
  function Fa(t, e, n, a, o) {
    const l = (n - e) * a,
      f = new Float32Array((l + 1) * o * 3),
      u = new Float32Array((l + 1) * o * 2),
      r = new Float32Array((l + 1) * o * 3);
    for (let i = 0; i <= l; i++) {
      const s = e * t.STEP + (i * t.STEP) / a;
      Pt(t, s, k);
      const d = -k.s * k.rx,
        m = -k.s * k.rz,
        g = Math.hypot(d, 1, m);
      for (let p = 0; p < o; p++) {
        const w = -1 + (2 * p) / (o - 1),
          C = w * k.hw,
          D = i * o + p;
        ((f[D * 3] = k.x + k.rx * C),
          (f[D * 3 + 1] = k.e + C * k.s),
          (f[D * 3 + 2] = k.z + k.rz * C),
          (u[D * 2] = (w + 1) / 2),
          (u[D * 2 + 1] = s / t.vPer),
          (r[D * 3] = d / g),
          (r[D * 3 + 1] = 1 / g),
          (r[D * 3 + 2] = m / g));
      }
    }
    const c = new Uint32Array(l * (o - 1) * 6);
    let h = 0;
    for (let i = 0; i < l; i++)
      for (let s = 0; s < o - 1; s++) {
        const d = i * o + s,
          m = d + 1,
          g = d + o,
          p = g + 1;
        ((c[h++] = d), (c[h++] = m), (c[h++] = g), (c[h++] = m), (c[h++] = p), (c[h++] = g));
      }
    const v = new THREE.BufferGeometry();
    return (
      v.setAttribute("position", new THREE.BufferAttribute(f, 3)),
      v.setAttribute("uv", new THREE.BufferAttribute(u, 2)),
      v.setAttribute("normal", new THREE.BufferAttribute(r, 3)),
      v.setIndex(new THREE.BufferAttribute(c, 1)),
      v.computeBoundingSphere(),
      (v.userData.tris = c.length / 3),
      v
    );
  }
  function* qn(t) {
    const [e, n, a, o] = yield* Gn(t.pal.road),
      l = new THREE.MeshStandardMaterial({
        map: e,
        emissiveMap: n,
        emissive: 16777215,
        emissiveIntensity: Ue * 0.7,
        normalMap: a,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughnessMap: o,
        roughness: 0.62,
        metalness: 0.5,
        envMap: xt,
        envMapIntensity: 0.55,
        color: t.pal.road.tint,
      });
    (ka(l, 0), (t.road = []));
    for (let f = 0; f < t.nCh; f++) {
      yield;
      const [u, r] = qo(t, f),
        c = new THREE.Mesh(Fa(t, u, r, 2, 3), l);
      ((c.receiveShadow = !0),
        t.group.add(c),
        t.road.push(c),
        Go(t, c, () => {
          const h = new THREE.Mesh(Fa(t, u, r, 4, 5), l);
          return ((h.receiveShadow = !0), h);
        }),
        (t.tris += c.geometry.userData.tris));
    }
  }
  function Pa(t, e, n, a) {
    const o = new Et(),
      l = t.pal,
      f = l.amb,
      u = [0.95, 0.12, 0.2],
      r = [0.95, 0.95, 1],
      c = l.top,
      h = l.out,
      v = l.out2,
      i = l.bot,
      s = l.rib,
      d = Object.assign({}, k),
      m = Object.assign({}, k),
      g = [
        [0, 0],
        [0, fe - 0.5],
        [0.5, fe],
        [kt - 0.6, fe],
        [kt, fe - 0.6],
        [kt, -ce + 1.2],
        [kt - 1.2, -ce],
      ];
    for (let w = e * a; w < n * a; w++) {
      (Pt(t, (w * t.STEP) / a, d), Pt(t, ((w + 1) * t.STEP) / a, m));
      const C = (w / a) | 0,
        x = [
          t.TIGHT[C] ? ((C >> 1) & 1 ? u : r) : (C >> 2) % 3 === 0 ? Nt(f, 0.7) : f,
          Nt(c, 1.2),
          c,
          Nt(c, 0.9),
          C % 12 < 1 ? v : h,
          Nt(h, 0.7),
        ];
      for (const T of [1, -1])
        for (let M = 0; M < g.length - 1; M++) {
          const S = g[M],
            z = g[M + 1],
            B = ct(d, T * (d.hw + S[0]), S[1]),
            b = ct(d, T * (d.hw + z[0]), z[1]),
            F = ct(m, T * (m.hw + S[0]), S[1]),
            _ = ct(m, T * (m.hw + z[0]), z[1]);
          T > 0 ? o.quad(B, b, _, F, x[M]) : o.quad(B, F, _, b, x[M]);
        }
      const H = ct(d, -(d.hw + kt - 1.2), -ce),
        U = ct(d, d.hw + kt - 1.2, -ce),
        E = ct(m, m.hw + kt - 1.2, -ce),
        y = ct(m, -(m.hw + kt - 1.2), -ce);
      if ((o.quad(H, y, E, U, i), w % (5 * a) === 0))
        for (let T = -2; T <= 2; T++) {
          const M = T * d.hw * 0.4;
          o.obox(ct(d, M, -ce - 0.8), [d.fx, 0, d.fz], [0, 1, 0], [d.rx, 0, d.rz], 0.6, 0.8, d.hw * 0.18, s);
        }
    }
    const p = o.geo();
    return ((p.userData.tris = o.tris()), p);
  }
  function* On(t) {
    const e = t.n,
      n = t.neon,
      a = t.pal,
      o = Object.assign({}, k),
      l = Object.assign({}, k),
      f = g0(),
      u = new THREE.MeshStandardMaterial({
        vertexColors: !0,
        roughness: 0.42,
        metalness: 0.55,
        envMap: xt,
        envMapIntensity: 0.7,
        side: THREE.DoubleSide,
        map: f.alb,
        normalMap: f.nrm,
        normalScale: new THREE.Vector2(0.5, 0.5),
      });
    for (let r = 0; r < t.nCh; r++) {
      yield;
      const [c, h] = qo(t, r),
        v = new THREE.Mesh(Pa(t, c, h, 1), u);
      ((v.receiveShadow = !0),
        t.group.add(v),
        Go(t, v, () => {
          const i = new THREE.Mesh(Pa(t, c, h, 3), u);
          return ((i.receiveShadow = !0), i);
        }),
        (t.tris += v.geometry.userData.tris));
    }
    for (let r = 0; r < e; r++) {
      ((r & 511) === 511 && (yield), Pt(t, r * t.STEP, o), Pt(t, (r + 1) * t.STEP, l));
      const h = t.TIGHT[r] ? ((r >> 1) & 1 ? [1, 0.2, 0.3] : [1, 0.95, 0.95]) : a.rail;
      for (const v of [1, -1]) {
        const i = v * (o.hw + 3),
          s = v * (l.hw + 3);
        (n.quad(ct(o, i - 0.6, Lt), ct(l, s - 0.6, Lt), ct(l, s - 0.6, Lt + 1.1), ct(o, i - 0.6, Lt + 1.1), h),
          n.quad(ct(o, i - 0.6, Lt + 1.1), ct(l, s - 0.6, Lt + 1.1), ct(l, s + 0.6, Lt + 1.1), ct(o, i + 0.6, Lt + 1.1), Nt(h, 0.8)),
          n.quad(ct(o, i + 0.6, Lt + 1.1), ct(l, s + 0.6, Lt + 1.1), ct(l, s + 0.6, Lt), ct(o, i + 0.6, Lt), Nt(h, 0.6)));
        const d = a.lip;
        n.quad(
          ct(o, v * o.hw, fe - 0.55),
          ct(l, v * l.hw, fe - 0.55),
          ct(l, v * (l.hw + 0.5), fe + 0.02),
          ct(o, v * (o.hw + 0.5), fe + 0.02),
          d,
        );
        const m = r % 6 < 3 ? a.skA : a.skB;
        if (
          (n.quad(
            ct(o, v * (o.hw + kt + 0.05), -2.4),
            ct(l, v * (l.hw + kt + 0.05), -2.4),
            ct(l, v * (l.hw + kt + 0.05), -1.4),
            ct(o, v * (o.hw + kt + 0.05), -1.4),
            m,
          ),
          r % 3 === 0)
        ) {
          const g = ct(o, v * (o.hw + kt + 0.06), 0.2),
            p = ct(l, v * (l.hw + kt + 0.06), 0.2),
            w = (g[0] + p[0]) / 2,
            C = (g[2] + p[2]) / 2;
          n.quad(
            [w - o.fx * 0.6, g[1] - 0.35, C - o.fz * 0.6],
            [w + o.fx * 0.6, g[1] - 0.35, C + o.fz * 0.6],
            [w + o.fx * 0.6, g[1] + 0.35, C + o.fz * 0.6],
            [w - o.fx * 0.6, g[1] + 0.35, C - o.fz * 0.6],
            a.marker,
          );
        }
      }
    }
  }
  function Da(t, e, n, a) {
    const o = (n - e) * a,
      l = t.pal.barrier,
      f = [
        [-0.35, 0],
        [0.35, 0.18],
      ],
      u = (o + 1) * 2 * 2 * f.length,
      r = new Float32Array(u * 3),
      c = new Float32Array(u * 2),
      h = new Float32Array(u * 3),
      v = [];
    let i = 0;
    for (const d of [1, -1])
      for (const [m, g] of f) {
        const p = i;
        for (let w = 0; w <= o; w++) {
          const C = e * t.STEP + (w * t.STEP) / a;
          Pt(t, C, k);
          const D = Math.min(t.n - 1, (C / t.STEP) | 0),
            x = t.TIGHT[D] ? [1, 0.25, 0.35] : l;
          for (let H = 0; H < 2; H++) {
            const U = d * (k.hw + 3 + m + (H ? g : 0));
            ((r[i * 3] = k.x + k.rx * U),
              (r[i * 3 + 1] = k.e + U * k.s + (H ? Lt : fe)),
              (r[i * 3 + 2] = k.z + k.rz * U),
              (c[i * 2] = C),
              (c[i * 2 + 1] = H),
              (h[i * 3] = x[0]),
              (h[i * 3 + 1] = x[1]),
              (h[i * 3 + 2] = x[2]),
              i++);
          }
        }
        for (let w = 0; w < o; w++) {
          const C = p + w * 2;
          v.push(C, C + 2, C + 1, C + 1, C + 2, C + 3);
        }
      }
    const s = new THREE.BufferGeometry();
    return (
      s.setAttribute("position", new THREE.BufferAttribute(r, 3)),
      s.setAttribute("uv", new THREE.BufferAttribute(c, 2)),
      s.setAttribute("color", new THREE.BufferAttribute(h, 3)),
      s.setIndex(v),
      s.computeBoundingSphere(),
      s
    );
  }
  function* jn(t) {
    const e = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 } }]),
      vertexShader: `attribute vec3 color; varying vec2 vUv; varying vec3 vC; ${Tt}
        void main(){ vUv = uv; vC = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; varying vec2 vUv; varying vec3 vC;
        #include <fog_pars_fragment>
        void main(){
          float h = vUv.y, a = vUv.x;
          float base = exp(-h * 7.0) * 1.1;
          float band = smoothstep(0.82, 1.0, fract(h * 3.0 - uTime * 0.9)) * (1.0 - h) * 0.45;
          vec2 hx = vec2(a * 0.35, h * 6.0); vec2 hc = abs(fract(hx + vec2(0.5 * mod(floor(hx.y), 2.0), 0.0)) - 0.5);
          float hexl = smoothstep(0.43, 0.5, max(hc.x, hc.y)) * 0.18 * (1.0 - h * 0.5);
          float sweep = smoothstep(0.86, 1.0, abs(sin(a * 0.45 - uTime * 6.0))) * 0.18 * (1.0 - h * 0.6);
          float scan = smoothstep(0.92, 1.0, fract(a * 0.0125 - uTime * 1.6)) * 0.7;
          float top = smoothstep(0.86, 1.0, h) * 0.55;
          float k = base + band + hexl + sweep + scan * (1.0 - h) + top + 0.035;
          gl_FragColor = vec4(vC * k * 0.6, min(k, 1.0) * 0.45);
          ${Yt}
        }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
    (p0(e), (e.uniforms.uTime = ot.time));
    for (let n = 0; n < t.nCh; n++) {
      yield;
      const [a, o] = qo(t, n),
        l = new THREE.Mesh(Da(t, a, o, 2), e);
      ((l.renderOrder = 5),
        t.group.add(l),
        Go(t, l, () => {
          const f = new THREE.Mesh(Da(t, a, o, 4), e);
          return ((f.renderOrder = 5), f);
        }));
    }
  }
  function Vn(t) {
    const e = t.n,
      n = 5,
      a = Math.floor(e / n) * 2,
      o = new THREE.CylinderGeometry(0.75, 0.95, 1, 8, 1);
    (o.translate(0, 0.5, 0), o.rotateY(Math.PI / 8));
    const l = new THREE.MeshStandardMaterial({ color: t.pal.post, roughness: 0.32, metalness: 0.8, envMap: xt, envMapIntensity: 1 }),
      f = new THREE.InstancedMesh(o, l, a);
    let u = 0;
    for (let s = 0; s < e - n + 1; s += n)
      for (const d of [1, -1]) {
        const m = d * (t.HW[s] + 3);
        (Q.set(t.CX[s] + t.RX[s] * m, t.E[s] + m * t.S[s] + fe - 0.2, t.CZ[s] + t.RZ[s] * m),
          Me.set(0, -t.track.ang[s], 0),
          ne.setFromEuler(Me),
          re.set(1, Lt - fe + 1.4, 1),
          ae.compose(Q, ne, re),
          f.setMatrixAt(u++, ae));
      }
    ((f.count = u), (f.instanceMatrix.needsUpdate = !0), f.computeBoundingSphere(), t.group.add(f));
    const r = 12,
      c = Math.floor(e / r),
      h = new THREE.CylinderGeometry(1.8, 2.6, 1, 6, 1);
    h.translate(0, 0.5, 0);
    const v = new THREE.MeshStandardMaterial({ color: t.pal.pylon, roughness: 0.75, metalness: 0.25, envMap: xt, envMapIntensity: 0.4 }),
      i = new THREE.InstancedMesh(h, v, c * 2);
    u = 0;
    for (let s = 0; s < e; s += r)
      if (!(t.E[s] - ce - Math.abs(t.S[s]) * t.HW[s] * 0.4 < 3))
        for (const m of [1, -1]) {
          const g = m * t.HW[s] * 0.45;
          (Q.set(t.CX[s] + t.RX[s] * g, -1, t.CZ[s] + t.RZ[s] * g),
            Me.set(0, -t.track.ang[s], 0),
            ne.setFromEuler(Me),
            re.set(1, t.E[s] + g * t.S[s] - ce + 1.5, 1),
            ae.compose(Q, ne, re),
            i.setMatrixAt(u++, ae));
        }
    ((i.count = u), (i.instanceMatrix.needsUpdate = !0), i.computeBoundingSphere(), t.group.add(i));
    for (let s = 0; s < e; s += r * 3) {
      const d = t.E[s] - ce;
      if (!(d < 12))
        for (const m of [1, -1]) {
          const g = m * t.HW[s] * 0.45,
            p = t.CX[s] + t.RX[s] * g,
            w = t.CZ[s] + t.RZ[s] * g,
            C = d * 0.5;
          t.neon.quad(
            [p - t.RX[s] * 2.7, C - 0.4, w - t.RZ[s] * 2.7],
            [p - t.RX[s] * 2.7, C + 0.4, w - t.RZ[s] * 2.7],
            [p + t.RX[s] * 2.7, C + 0.4, w + t.RZ[s] * 2.7],
            [p + t.RX[s] * 2.7, C - 0.4, w + t.RZ[s] * 2.7],
            t.pal.beacon,
          );
        }
    }
  }
  function Kn(t) {
    const e = [],
      n = [],
      a = [],
      o = [],
      l = t.track,
      f = t.L;
    function u(i, s, d, m, g) {
      const p = Math.max(1, Math.ceil((s - i) / 1.5)),
        w = e.length / 3;
      for (let C = 0; C <= p; C++) {
        const D = i + ((s - i) * C) / p;
        Pt(t, D, k);
        for (const x of [d, m]) {
          const H = ct(k, x, 0.07);
          (e.push(H[0], H[1], H[2]), n.push(D - i, x - d), a.push(g));
        }
      }
      for (let C = 0; C < p; C++) {
        const D = w + C * 2;
        o.push(D, D + 1, D + 2, D + 1, D + 3, D + 2);
      }
    }
    for (const i of l.dashes || []) u(i.along, i.along + i.len, i.lateral - i.halfWidth, i.lateral + i.halfWidth, 0);
    const r = l.pit;
    if (r) {
      const i = r.a0,
        s = r.a1,
        d = Math.ceil((s - i) / 2),
        m = e.length / 3,
        g = r.side || 1;
      for (let p = 0; p <= d; p++) {
        const w = i + ((s - i) * p) / d;
        Pt(t, w, k);
        const C = g > 0 ? k.hw - r.width : -k.hw,
          D = g > 0 ? k.hw : -k.hw + r.width;
        for (const x of [C, D]) {
          const H = ct(k, x, 0.07);
          (e.push(H[0], H[1], H[2]), n.push(w - i, g > 0 ? x - C : D - x), a.push(1));
        }
      }
      for (let p = 0; p < d; p++) {
        const w = m + p * 2;
        o.push(w, w + 1, w + 2, w + 1, w + 3, w + 2);
      }
    }
    (Pt(t, 0, k), u(f - 6, f + 6, -k.hw, k.hw, 2));
    for (let i = 0; i < 6; i++) {
      const s = 26 + 19 * i,
        d = (i % 2 === 0 ? 1 : -1) * 19;
      u(f - s - 11, f - s + 11, d - 9.5, d + 9.5, 3);
    }
    const c = new THREE.BufferGeometry();
    (c.setAttribute("position", new THREE.Float32BufferAttribute(e, 3)),
      c.setAttribute("uv", new THREE.Float32BufferAttribute(n, 2)),
      c.setAttribute("aKind", new THREE.Float32BufferAttribute(a, 1)),
      c.setIndex(o),
      c.computeBoundingSphere());
    const h = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 } }]),
      vertexShader: `attribute float aKind; varying vec2 vUv; varying float vK; ${Tt}
        void main(){ vUv = uv; vK = aKind; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; varying vec2 vUv; varying float vK;
        #include <fog_pars_fragment>
        void main(){
          vec3 c = vec3(0.0); float t = uTime;
          if (vK < 0.5) {
            float da = vUv.x, dl = vUv.y - 18.0, adl = abs(dl);
            if (adl > 16.4 || da < 1.6 || da > 38.4) c = mod(floor(da / 4.0) + step(0.0, dl), 2.0) > 0.5 ? vec3(1.6, 1.3, 0.35) : vec3(0.06, 0.15, 0.25);
            else { float q = mod(da - adl * 0.9 - t * 42.0, 10.0);
              c = q > 6.5 ? vec3(3.0) : q > 3.0 ? vec3(0.4, 2.2, 2.6) : vec3(0.06, 0.17, 0.3); }
          } else if (vK < 1.5) {
            float w = vUv.y, q = vUv.x + w - t * 24.0;
            float k = mod(floor(q / 7.0), 4.0);
            vec3 pc = k < 0.5 ? vec3(1.0, 0.24, 0.78) : k < 1.5 ? vec3(0.24, 0.94, 1.0) : k < 2.5 ? vec3(1.0, 0.88, 0.25) : vec3(0.38, 1.0, 0.44);
            c = fract(q / 7.0) < 0.2 ? vec3(0.1, 0.08, 0.19) : pc * (1.2 + 0.4 * sin(t * 6.0 + vUv.x * 0.05));
            if (w < 1.2) c = mod(vUv.x, 10.0) < 6.0 ? vec3(1.6) : vec3(0.1, 0.08, 0.19);
          } else if (vK < 2.5) {
            c = mod(floor(vUv.y / 6.0) + floor(vUv.x / 6.0), 2.0) > 0.5 ? vec3(0.95) : vec3(0.06, 0.06, 0.08);
          } else {
            float da = vUv.x, dl = vUv.y;
            bool line = da < 1.6 || dl < 1.3 || dl > 17.7;
            if (!line || da > 20.0) discard;
            c = vec3(0.85, 0.87, 0.95);
          }
          gl_FragColor = vec4(c, 1.0);
          #include <fog_fragment>
        }`,
      fog: !0,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    h.uniforms.uTime = ot.time;
    const v = new THREE.Mesh(c, h);
    ((v.renderOrder = 1), t.group.add(v));
  }
  const Xn = [
      "PLASMA  GRAND  PRIX",
      "NEON HARBOR",
      "BOOST ZONE",
      "HALCYON DRIVES",
      "KESTREL AERO",
      "ONYX FUEL CELLS",
      "VEGA GRIP",
      "HARBOR 99.7 FM",
      "BRUTE ARMOR",
      "NOVA LABS",
    ],
    Zn = [
      "SELENE  DOME  GRAND  PRIX",
      "SELENE DOME",
      "HELIUM-3 REFINERY",
      "TRANQUILITY TRANSIT",
      "REACTOR CORE ONLINE",
      "NOVA LABS LUNAR",
      "MAGLEV LINE C",
      "SECTOR 7 HABITAT",
      "KESTREL ORBITAL",
      "EARTHRISE LOUNGE",
    ],
    Oo = {};
  function $n(t) {
    if (((t = t === "moon" ? "moon" : "harbor"), Oo[t])) return Oo[t];
    const e = t === "moon" ? Zn : Xn;
    let n;
    const a = document.createElement("canvas");
    ((a.width = 1024), (a.height = 1024));
    const o = a.getContext("2d"),
      l =
        t === "moon"
          ? [
              ["#ffffff", "#3cf0ff"],
              ["#7af6ff", "#ffffff"],
              ["#3cf0ff", "#b8f8ff"],
              ["#ffb428", "#ffffff"],
              ["#ffffff", "#7af6ff"],
              ["#9fdcff", "#ffffff"],
              ["#3cf0ff", "#ffe27a"],
              ["#ffffff", "#ffb428"],
            ]
          : [
              ["#3cf0ff", "#ff3cc8"],
              ["#ffb428", "#3cf0ff"],
              ["#ff3cc8", "#ffe040"],
              ["#9b5cf2", "#7af6ff"],
              ["#ff6a5a", "#ffffff"],
              ["#ff7a1a", "#ffb36a"],
              ["#f2b822", "#ffe27a"],
              ["#60ff90", "#3cf0ff"],
            ];
    for (let f = 0; f < 8; f++) {
      const u = f * 128,
        r = e[f === 0 ? 0 : f + 1] || e[1];
      ((o.fillStyle = "rgba(10,4,24,0.92)"),
        o.fillRect(0, u, 1024, 128),
        (o.strokeStyle = l[f][0]),
        (o.lineWidth = 5),
        o.strokeRect(6, u + 6, 1012, 116));
      const c = 'px "Avenir Next Condensed","Futura","Arial Narrow",Arial,sans-serif';
      let h = f === 0 ? 80 : 72;
      o.font = "italic 900 " + h + c;
      const v = o.measureText(r).width;
      (v > 940 && ((h = Math.floor((h * 940) / v)), (o.font = "italic 900 " + h + c)),
        (o.textAlign = "center"),
        (o.textBaseline = "middle"),
        (o.shadowColor = l[f][1]),
        (o.shadowBlur = 16),
        (o.fillStyle = f === 0 ? "#fff2fb" : l[f][0]),
        o.fillText(r, 512, u + 68),
        (o.shadowBlur = 0),
        (o.fillStyle = l[f][1]));
      for (let i = 30; i < 1e3; i += 120) (o.fillRect(i, u + 14, 40, 5), o.fillRect(i + 50, u + 109, 40, 5));
    }
    return ((n = new THREE.CanvasTexture(a)), (n.anisotropy = pe), (n.userData.shared = !0), (Oo[t] = n), n);
  }
  function Yn(t) {
    const e = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uMap: { value: null } }]),
      vertexShader: `attribute float aRow; attribute float aSeed; varying vec2 vUv; varying float vRow; varying float vSeed; ${Tt}
        void main(){ vUv = uv; vRow = aRow; vSeed = aSeed; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; uniform sampler2D uMap; varying vec2 vUv; varying float vRow; varying float vSeed;
        #include <fog_pars_fragment>
        void main(){
          float t = uTime + vSeed * 7.0;
          float gl = step(0.985, fract(sin(floor(t * 9.0) * 12.9898 + vSeed) * 43758.5)) * 0.03;
          float ux = dFdx(vUv.x) < 0.0 ? 1.0 - vUv.x : vUv.x;          // seen from behind: un-mirror the text
          vec2 uv = vec2(ux + gl * sin(vUv.y * 80.0), vUv.y);
          float row = vRow;
          // cycle a few ads on non-title signs
          if (row > 0.5) row = 1.0 + mod(row - 1.0 + floor(t / 6.0), 7.0);
          vec4 s = texture2D(uMap, vec2(uv.x, 1.0 - (row + 1.0 - uv.y) / 8.0));
          float scan = 0.82 + 0.18 * sin(vUv.y * 140.0 - t * 12.0);
          float sweep = smoothstep(0.96, 1.0, sin(vUv.x * 3.0 - t * 1.7)) * 0.6;
          float flick = 0.92 + 0.08 * sin(t * 37.0) * sin(t * 13.0);
          vec3 c = s.rgb * (scan * flick + sweep) * ${Ue.toFixed(2)};
          gl_FragColor = vec4(c * s.a, s.a * 0.6);
          ${Yt}
        }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
    return ((e.uniforms.uTime = ot.time), (e.uniforms.uMap.value = $n(t)), (e.extensions = { derivatives: !0 }), p0(e), e);
  }
  function Qn(t) {
    const e = new Et(),
      n = t.neon,
      a = t.pal.gantry[0],
      o = t.pal.gantry[1],
      l = t.pal.gantry[2],
      f = [0, 1, 0];
    Pt(t, t.L - 10, k);
    const u = [k.fx, 0, k.fz],
      r = [k.rx, 0, k.rz],
      c = k.hw + 12,
      h = k.e + 34;
    t.gantry = { x: k.x, z: k.z, e: k.e, f: u, r, hw: k.hw, lights: [] };
    for (const p of [1, -1]) {
      const w = k.x + r[0] * c * p,
        C = k.z + r[2] * c * p;
      e.obox([w, (h + 4) / 2, C], u, f, r, 3, (h + 4) / 2, 3, a);
      for (let D = 8; D < h - 4; D += 7) e.obox([w, D, C], u, f, r, 3.3, 0.5, 3.3, l);
      (e.obox([w, 1.5, C], u, f, r, 4.5, 1.5, 4.5, o),
        n.quad(
          [w + r[0] * 3.05 * -p - u[0] * 3.1, k.e + 2, C + r[2] * 3.05 * -p - u[2] * 3.1],
          [w - u[0] * 3.1 + r[0] * -p * 1.5, k.e + 2, C - u[2] * 3.1 + r[2] * -p * 1.5],
          [w - u[0] * 3.1 + r[0] * -p * 1.5, h, C - u[2] * 3.1 + r[2] * -p * 1.5],
          [w + r[0] * 3.05 * -p - u[0] * 3.1, h, C + r[2] * 3.05 * -p - u[2] * 3.1],
          [0.25, 0.94, 1],
        ));
    }
    (e.obox([k.x, h, k.z], u, f, r, 3.2, 3, c + 3, a, l), e.obox([k.x, h + 10, k.z], u, f, r, 1.2, 7, c * 0.72, o));
    for (let p = -4; p <= 4; p++) e.obox([k.x + r[0] * p * c * 0.2, h + 3.6, k.z + r[2] * p * c * 0.2], u, f, r, 0.4, 0.6, 0.4, l);
    e.obox([k.x - u[0] * 3.6, h - 4.5, k.z - u[2] * 3.6], u, f, r, 0.8, 1.6, 14, o);
    for (let p = 0; p < 5; p++) {
      const w = (p - 2) * 5.5;
      t.gantry.lights.push([k.x - u[0] * 4.6 + r[0] * w, h - 4.5, k.z - u[2] * 4.6 + r[2] * w]);
    }
    const v = g0(),
      i = new THREE.Mesh(
        e.geo(),
        ka(
          new THREE.MeshStandardMaterial({
            vertexColors: !0,
            roughness: 0.22,
            metalness: 0.85,
            envMap: xt,
            map: v.alb,
            normalMap: v.nrm,
            side: THREE.DoubleSide,
          }),
          1,
        ),
      );
    t.gantry.glints = [];
    for (let p = -6; p <= 6; p++) {
      const w = (p * (c + 3)) / 6;
      (t.gantry.glints.push([k.x + r[0] * w - u[0] * 3.25, h + 2.9, k.z + r[2] * w - u[2] * 3.25, -u[0] * 0.6, 0.8, -u[2] * 0.6]),
        t.gantry.glints.push([k.x + r[0] * w + u[0] * 3.25, h - 2.9, k.z + r[2] * w + u[2] * 3.25, u[0] * 0.7, -0.2, u[2] * 0.7]));
    }
    for (const p of [1, -1])
      for (let w = 8; w < h - 4; w += 7) {
        const C = k.x + r[0] * c * p,
          D = k.z + r[2] * c * p;
        t.gantry.glints.push([
          C - u[0] * 3.35 - r[0] * 3.3 * p,
          w + 0.5,
          D - u[2] * 3.35 - r[2] * 3.3 * p,
          -u[0] * 0.7 - r[0] * 0.7 * p,
          0.1,
          -u[2] * 0.7 - r[2] * 0.7 * p,
        ]);
      }
    (t.group.add(i), (t.tris += e.tris()));
    const s = c * 1.4,
      d = s / 8;
    t.holo.push({ c: [k.x - u[0] * 1.3, h + 10, k.z - u[2] * 1.3], r, w: s, h: d, row: 0, seed: 0 });
    const m = [],
      g = [];
    for (let p = 0; p < t.n; p += 8) g.push([Math.abs(t.K[p]), p]);
    g.sort((p, w) => p[0] - w[0]);
    for (const [, p] of g) {
      if (m.length >= 4) break;
      const w = p * t.STEP;
      let C = w > 700 && w < t.L - 400;
      for (const x of m) {
        let H = Math.abs(x - w);
        ((H = Math.min(H, t.L - H)), H < 1400 && (C = !1));
      }
      if (!C) continue;
      m.push(w);
      const D = t.pal.arch;
      for (let x = 0; x < 3; x++) {
        Pt(t, w + x * 26, k);
        const H = [k.fx, 0, k.fz],
          U = [k.rx, 0, k.rz],
          E = D[(m.length + x) & 1],
          y = k.hw + 9,
          T = k.e - 2,
          M = k.e + 30,
          S = (B, b) => [k.x + U[0] * B, b, k.z + U[2] * B],
          z = [
            [-y, T],
            [-y, M - 9],
            [-y + 9, M],
            [y - 9, M],
            [y, M - 9],
            [y, T],
          ];
        for (let B = 0; B < z.length - 1; B++) {
          const b = z[B],
            F = z[B + 1],
            _ = F[0] - b[0],
            R = F[1] - b[1],
            A = Math.hypot(_, R),
            N = (-R / A) * 1.1,
            G = (_ / A) * 1.1;
          for (const L of [-0.6, 0.6]) {
            const W = (Y) => [Y[0] + H[0] * L, Y[1], Y[2] + H[2] * L];
            n.quad(W(S(b[0] - N, b[1] - G)), W(S(F[0] - N, F[1] - G)), W(S(F[0] + N, F[1] + G)), W(S(b[0] + N, b[1] + G)), E);
          }
          n.quad(
            io(S(b[0] + N, b[1] + G), H, -0.6),
            io(S(F[0] + N, F[1] + G), H, -0.6),
            io(S(F[0] + N, F[1] + G), H, 0.6),
            io(S(b[0] + N, b[1] + G), H, 0.6),
            Nt(E, 0.7),
          );
        }
        (x === 1 &&
          t.holo.push({ c: [k.x, M + 7.5, k.z], r: U, w: y * 1.3, h: (y * 1.3) / 8, row: 1 + (m.length % 7), seed: m.length * 1.7 }),
          t.rigs.push({ a: w + x * 26, ph: (m.length - 1) * 3 + x, y: M - 2.4, w: y - 3 }));
      }
    }
    pgpGates(t, m);
  }
  /* Speed gates: slim neon portals every ~200 m of track. They stream past in the foreground,
     which is the strongest depth and speed cue a racing camera has. Pure emissive quads: ~40 tris each. */
  function pgpGates(t, taken) {
    const n = t.neon,
      D = t.pal.arch,
      step = 208,
      cnt = Math.max(0, Math.floor((t.L - 420) / step));
    let made = 0;
    for (let q = 0; q < cnt; q++) {
      const w = 300 + q * step;
      let ok = w < t.L - 150;
      for (const x of taken) {
        let H = Math.abs(x + 26 - w);
        ((H = Math.min(H, t.L - H)), H < 130 && (ok = !1));
      }
      if (!ok) continue;
      Pt(t, w, k);
      const H = [k.fx, 0, k.fz],
        U = [k.rx, 0, k.rz],
        E = made % 3 === 2 ? [0.35, 0.95, 1] : D[made & 1],
        y = k.hw + 7.5,
        tilt = k.s * y, // follow the banking so the gate sits square to the road
        T = k.e - 2,
        M = k.e + 23,
        S = (B, b) => [k.x + U[0] * B, b + (B / y) * tilt, k.z + U[2] * B],
        z = [
          [-y, T],
          [-y, M - 6],
          [-y + 6, M],
          [y - 6, M],
          [y, M - 6],
          [y, T],
        ];
      for (let B = 0; B < z.length - 1; B++) {
        const b = z[B],
          F = z[B + 1],
          _ = F[0] - b[0],
          R = F[1] - b[1],
          A = Math.hypot(_, R),
          N = (-R / A) * 0.8,
          G = (_ / A) * 0.8;
        for (const L of [-0.45, 0.45]) {
          const W = (Y) => [Y[0] + H[0] * L, Y[1], Y[2] + H[2] * L];
          n.quad(W(S(b[0] - N, b[1] - G)), W(S(F[0] - N, F[1] - G)), W(S(F[0] + N, F[1] + G)), W(S(b[0] + N, b[1] + G)), E);
        }
      }
      made++;
    }
    t.gates = made;
  }
  function Jn(t, e) {
    const n = 0.5 + 0.5 * Math.sin(e * 3 - t * 1.15);
    return 0.3 + 0.7 * n * n * n;
  }
  function tr(t) {
    const e = [],
      n = [],
      a = [],
      o = [],
      l = [],
      f = (h, v, i, s, d, m) => {
        const g = e.length / 3;
        for (const p of [h, v, i, s]) e.push(p[0], p[1], p[2]);
        (n.push(0, 0, 1, 0, 1, 1, 0, 1), a.push(d, d, d, d), o.push(m, m, m, m), l.push(g, g + 1, g + 2, g, g + 2, g + 3));
      };
    t.gantry && t.rigs.push({ a: t.L - 10 - 3.6, ph: 12, y: t.gantry.e + 34 - 3.2, w: t.gantry.hw + 10 });
    for (const h of t.rigs) {
      Pt(t, h.a, k);
      const v = [k.fx, 0, k.fz],
        i = [k.rx, 0, k.rz],
        s = h.w,
        d = h.y,
        m = (C, D, x) => [k.x + i[0] * C + v[0] * x, d + D, k.z + i[2] * C + v[2] * x];
      (f(m(-s, 0, -0.9), m(s, 0, -0.9), m(s, 0, 0.9), m(-s, 0, 0.9), 0, h.ph),
        f(m(-s, 0, -0.95), m(s, 0, -0.95), m(s, 0.9, -0.95), m(-s, 0.9, -0.95), 0, h.ph));
      const g = -k.hw * 0.98,
        p = k.hw * 0.98,
        w = (C, D) => {
          const x = ct(k, C, 0.16);
          return [x[0] + v[0] * D, x[1] + D * k.g, x[2] + v[2] * D];
        };
      (f(w(g, -14), w(p, -14), w(p, 14), w(g, 14), 1, h.ph), (h.x = k.x), (h.z = k.z), (h.wy = d), (h.rx = k.rx), (h.rz = k.rz));
    }
    const u = new THREE.BufferGeometry();
    (u.setAttribute("position", new THREE.Float32BufferAttribute(e, 3)),
      u.setAttribute("uv", new THREE.Float32BufferAttribute(n, 2)),
      u.setAttribute("aKind", new THREE.Float32BufferAttribute(a, 1)),
      u.setAttribute("aPh", new THREE.Float32BufferAttribute(o, 1)),
      u.setIndex(l),
      u.computeBoundingSphere());
    const r = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 } }]),
      vertexShader: `attribute float aKind; attribute float aPh; uniform float uTime; varying vec2 vUv; varying float vK; varying float vB; ${Tt}
        void main(){ vUv = uv; vK = aKind; float v = 0.5 + 0.5 * sin(uTime * 3.0 - aPh * 1.15); vB = 0.3 + 0.7 * v * v * v;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `varying vec2 vUv; varying float vK; varying float vB;
        #include <fog_pars_fragment>
        void main(){ vec3 c;
          if (vK < 0.5) { float seg = step(0.12, fract(vUv.x * 18.0)); c = vec3(1.4, 1.7, 2.0) * (0.25 + seg * 1.4) * vB * 1.6; }
          else { vec2 p = vUv * 2.0 - 1.0; float e = (1.0 - smoothstep(0.0, 1.0, length(p * vec2(1.0, 1.15)))); c = vec3(0.45, 0.7, 1.0) * e * e * vB * 0.55; }
          gl_FragColor = vec4(c, 0.0); ${Yt} }`,
      side: THREE.DoubleSide,
      fog: !0,
      polygonOffset: !0,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    (Re(r), (r.uniforms.uTime = ot.time));
    const c = new THREE.Mesh(u, r);
    ((c.renderOrder = 6), t.group.add(c));
  }
  function io(t, e, n) {
    return [t[0] + e[0] * n, t[1], t[2] + e[2] * n];
  }
  function Ua(t) {
    const e = new Et(),
      n = t.pal.mast,
      a = $t(808);
    let o = 0;
    for (let s = 60; s < t.n - 60 && o < 10; s += 90 + ((a() * 60) | 0)) {
      if (Math.abs(t.K[s]) > 1 / 400) continue;
      Pt(t, s * t.STEP, k);
      const d = a() < 0.5 ? 1 : -1,
        m = d * (k.hw + 26),
        g = ct(k, m, 0),
        p = 2,
        w = k.e + 26;
      e.obox([g[0], (p + w) / 2, g[2]], [k.fx, 0, k.fz], [0, 1, 0], [k.rx, 0, k.rz], 1.2, (w - p) / 2, 1.2, n);
      const C = 70,
        D = C / 8,
        x = [k.fx * -d, 0, k.fz * -d],
        H = [g[0] - k.fx * 1.5, w + D * 0.5 + 1, g[2] - k.fz * 1.5];
      (e.obox(H, [k.fx, 0, k.fz], [0, 1, 0], [k.rx, 0, k.rz], 0.8, D * 0.55, 1, [0.06, 0.05, 0.1]),
        t.holo.push({ c: [H[0] - k.fx * 1, H[1], H[2] - k.fz * 1], r: [k.rx, 0, k.rz], w: C, h: D, row: 1 + (o % 7), seed: 3 + o * 2.3 }),
        o++);
    }
    const l = g0();
    (t.group.add(
      new THREE.Mesh(
        e.geo(),
        new THREE.MeshStandardMaterial({ vertexColors: !0, roughness: 0.45, metalness: 0.6, envMap: xt, map: l.alb }),
      ),
    ),
      (t.tris += e.tris()));
    const f = [],
      u = [],
      r = [],
      c = [],
      h = [];
    for (const s of t.holo) {
      const d = f.length / 3,
        m = s.w / 2,
        g = s.h / 2,
        p = s.c,
        w = s.r,
        C = [
          [-m, -g, 0, 0],
          [m, -g, 1, 0],
          [m, g, 1, 1],
          [-m, g, 0, 1],
        ];
      for (const D of C) (f.push(p[0] + w[0] * D[0], p[1] + D[1], p[2] + w[2] * D[0]), u.push(D[2], D[3]), r.push(s.row), c.push(s.seed));
      h.push(d, d + 1, d + 2, d, d + 2, d + 3);
    }
    const v = new THREE.BufferGeometry();
    (v.setAttribute("position", new THREE.Float32BufferAttribute(f, 3)),
      v.setAttribute("uv", new THREE.Float32BufferAttribute(u, 2)),
      v.setAttribute("aRow", new THREE.Float32BufferAttribute(r, 1)),
      v.setAttribute("aSeed", new THREE.Float32BufferAttribute(c, 1)),
      v.setIndex(h),
      v.computeBoundingSphere());
    const i = new THREE.Mesh(v, Yn(t.env));
    ((i.renderOrder = 6), t.group.add(i));
  }
  function* er(t) {
    const e = t.track,
      n = e.size || 2048,
      a = e.tex,
      o = e.surf,
      l = e.theme ? e.theme.voidColor >>> 0 : 0,
      f = new Uint32Array(n * n);
    for (let i = 0; i < n * n; i++) {
      (i & 1048575) === 1048575 && (yield);
      const s = a[i] >>> 0;
      s === l ? (f[i] = 0) : o[i] !== 0 ? (f[i] = 4279503372) : (f[i] = s);
    }
    const u = new THREE.DataTexture(new Uint8Array(f.buffer), n, n, THREE.RGBAFormat);
    ((u.magFilter = THREE.LinearFilter),
      (u.minFilter = THREE.LinearMipmapLinearFilter),
      (u.generateMipmaps = !0),
      (u.anisotropy = tt ? Math.min(pe, tt.capabilities.getMaxAnisotropy()) : 1),
      (u.needsUpdate = !0),
      (t.groundTex = u));
    const r = new THREE.PlaneGeometry(n, n, 1, 1);
    (r.rotateX(-Math.PI / 2), r.translate(n / 2, 0, n / 2));
    const c = r.attributes.uv;
    for (let i = 0; i < c.count; i++) c.setY(i, 1 - c.getY(i));
    const h = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uMap: { value: u } }]),
        vertexShader: `varying vec2 vUv; ${Tt} void main(){ vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
        fragmentShader: `uniform sampler2D uMap; varying vec2 vUv;
        #include <fog_pars_fragment>
        void main(){ vec4 c = texture2D(uMap, vUv); if (c.a < 0.5) discard; vec3 col = c.rgb * vec3(0.85, 0.82, 1.0);
          float l = max(col.r, max(col.g, col.b)); col *= 1.0 + smoothstep(0.55, 0.9, l) * 1.6;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
        fog: !0,
      }),
      v = new THREE.Mesh(r, h);
    ((v.renderOrder = 2), t.group.add(v));
  }
  const or = [2760509, 1913664, 2829125, 3809072, 2371658, 3353146, 2042410, 3879760];
  function ar(t, e) {
    const n = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTime: { value: 0 }, uGround: { value: null }, uSun: { value: null }, uClouds: { value: 1 } },
      ]),
      vertexShader: `attribute float aSeed; varying vec3 vW; varying vec3 vN; varying float vSeed; varying vec3 vSz; ${Tt}
        void main(){
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vW = w.xyz; vN = normal; vSeed = aSeed; vSz = vec3(instanceMatrix[0][0], instanceMatrix[1][1], instanceMatrix[2][2]);
          vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader:
        go +
        `uniform float uTime; uniform sampler2D uGround; varying vec3 vW; varying vec3 vN; varying float vSeed; varying vec3 vSz;
        #include <fog_pars_fragment>
        void main(){
          float sd = vSeed, style = floor(fract(sd * 3.7) * 4.0);
          vec3 base = mix(vec3(0.06, 0.05, 0.12), vec3(0.12, 0.08, 0.17), sd);
          base = mix(base, vec3(0.05, 0.09, 0.15), step(0.7, fract(sd * 7.3)));
          base = mix(base, vec3(0.13, 0.12, 0.16), step(0.86, fract(sd * 11.1)));
          float H = vSz.y;
          vec3 col;
          vec3 V = normalize(cameraPosition - vW);
          if (vN.y > 0.5) {
            vec2 uv = vW.xz / ${(e || 2048).toFixed(1)};
            if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0 && H < 200.0) col = texture2D(uGround, uv).rgb * 1.05;
            else col = base * 1.5;
          } else if (vN.y < -0.5) col = base * 0.3;
          else {
            float hc = abs(vN.x) > 0.5 ? vW.z : vW.x;
            vec2 cellSz = style < 0.5 ? vec2(3.6, 4.4) : style < 1.5 ? vec2(14.0, 4.4) : style < 2.5 ? vec2(2.4, 30.0) : vec2(5.0, 5.5);
            vec2 cell = vec2(hc / cellSz.x, vW.y / cellSz.y);
            vec2 id = floor(cell), f = fract(cell);
            float win;
            if (style < 0.5) win = step(0.18, f.x) * step(f.x, 0.82) * step(0.25, f.y) * step(f.y, 0.8);
            else if (style < 1.5) win = step(0.06, f.x) * step(f.x, 0.94) * step(0.35, f.y) * step(f.y, 0.75);
            else if (style < 2.5) win = step(0.3, f.x) * step(f.x, 0.7) * step(0.04, f.y);
            else win = step(0.3, f.x) * step(f.x, 0.6) * step(0.3, f.y) * step(f.y, 0.65);
            float h = hash12(id + vec2(sd * 131.0, abs(vN.x) * 17.0 + vN.z * 3.0));
            float litFrac = style > 2.5 ? 0.25 : style > 1.5 ? 0.6 : 0.42;
            float lit = step(1.0 - litFrac, h) * (0.9 + 0.1 * sin(uTime * 0.7 + h * 30.0));
            vec3 wc = h > 0.94 ? vec3(0.45, 0.9, 1.0) : h > 0.88 ? vec3(1.0, 0.45, 0.85) : h > 0.7 ? vec3(1.0, 0.86, 0.62) : vec3(1.0, 0.7, 0.38);
            // crisp window detail: mullions on wide panes, interior depth gradient + blinds, lighter frames
            float mull = style > 0.5 && style < 1.5 ? 1.0 - step(0.9, abs(fract(f.x * 3.0) - 0.5) * 2.0) : 1.0;
            float h2 = hash12(id * 1.37 + sd * 17.0);
            float interior = (0.55 + 0.45 * smoothstep(0.95, 0.3, f.y)) * (h2 > 0.75 ? 0.6 + 0.4 * step(0.5, fract(f.y * 6.0)) : 1.0);
            // anti-aliased window field: TAA resolves sub-pixel detail, so keep it sharp until cells reach ~2-3 px
            vec2 fw = fwidth(cell);
            float lod = smoothstep(0.4, 1.0, max(fw.x, fw.y));
            float wl = mix(win * lit * mull * interior, litFrac * 0.4, lod);
            float frame = (1.0 - win) * step(0.1, f.x) * step(f.x, 0.9) * step(0.16, f.y) * step(f.y, 0.88) * (1.0 - lod);
            float sunF = max(dot(vN, normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
            float vert = 0.55 + 0.45 * smoothstep(0.0, H, vW.y);
            col = base * vert * (0.7 + 0.25 * abs(vN.z)) + vec3(0.55, 0.2, 0.12) * sunF * 0.4 * vert;
            // glassy facades reflect the sky a little (fresnel)
            float fres = pow(1.0 - max(dot(V, vN), 0.0), 4.0);
            vec3 rd = reflect(-V, vN); rd.y = abs(rd.y);
            col += skyCol(rd, uTime, 0.0, 0.0) * fres * 0.3 * step(0.5, fract(sd * 5.3));
            col += wc * wl * 1.35 + vec3(0.06, 0.055, 0.08) * frame * (0.6 + 0.4 * sunF);
            // floor lines
            col *= 0.9 + 0.1 * step(0.08, fract(vW.y / 13.2));
            // neon crown band / vertical neon strip on some towers
            vec3 nc = fract(sd * 13.0) > 0.5 ? vec3(1.0, 0.25, 0.8) : (fract(sd * 17.0) > 0.5 ? vec3(0.25, 0.95, 1.0) : vec3(1.0, 0.7, 0.2));
            float crown = step(0.55, sd) * step(H - 1.8, vW.y) * step(vW.y, H - 0.5);
            float vstrip = step(0.82, fract(sd * 23.0)) * step(0.15, vW.y / H) * smoothstep(0.6, 0.0, abs(fract(hc / max(6.0, vSz.x * 0.5)) - 0.5) * 12.0);
            col = mix(col, nc * 2.4, crown);
            col += nc * vstrip * 1.6 * (0.8 + 0.2 * sin(uTime * 2.0 + sd * 10.0));
          }
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
      fog: !0,
    });
    return (
      (n.uniforms.uTime = ot.time),
      (n.uniforms.uSun = ot.sun),
      (n.uniforms.uGround.value = t),
      (n.extensions = { derivatives: !0 }),
      n
    );
  }
  function* nr(t) {
    const e = t.track,
      n = e.size || 2048,
      a = n / 2048,
      o = n / 2,
      l = e.tex,
      f = new Set(or.map((M) => (4278190080 | ((M & 255) << 16) | (M & 65280) | ((M >> 16) & 255)) >>> 0)),
      u = new Uint8Array(n * n),
      r = new Int32Array((n * n) / 4),
      c = [];
    for (let M = 2; M < n - 2; M += 2)
      for (let S = 2; S < n - 2; S += 2) {
        S === 2 && (M & 255) === 2 && (yield);
        const z = M * n + S;
        if (u[z]) continue;
        const B = l[z] >>> 0;
        if (!f.has(B)) continue;
        let b = 0,
          F = S,
          _ = S,
          R = M,
          A = M,
          N = 0;
        for (r[b++] = z, u[z] = 1; b > 0 && b < r.length - 4;) {
          const W = r[--b],
            Y = W % n,
            at = (W / n) | 0;
          (N++,
            Y < F && (F = Y),
            Y > _ && (_ = Y),
            at < R && (R = at),
            at > A && (A = at),
            Y > 0 && !u[W - 1] && l[W - 1] >>> 0 === B && ((u[W - 1] = 1), (r[b++] = W - 1)),
            Y < n - 1 && !u[W + 1] && l[W + 1] >>> 0 === B && ((u[W + 1] = 1), (r[b++] = W + 1)),
            W >= n && !u[W - n] && l[W - n] >>> 0 === B && ((u[W - n] = 1), (r[b++] = W - n)),
            W < n * (n - 1) && !u[W + n] && l[W + n] >>> 0 === B && ((u[W + n] = 1), (r[b++] = W + n)));
        }
        const G = _ - F + 5,
          L = A - R + 5;
        G >= 12 && L >= 12 && N > 60 && c.push([F - 2, R - 2, G, L]);
      }
    const h = t.n;
    function v(M, S) {
      let z = 1e9,
        B = 0;
      for (let b = 0; b < h; b += 6) {
        const F = t.CX[b] - M,
          _ = t.CZ[b] - S,
          R = F * F + _ * _;
        R < z && ((z = R), (B = b));
      }
      return [Math.sqrt(z) - t.HW[B], t.E[B]];
    }
    const i = $t(4242),
      s = [],
      d = [];
    for (const M of c) {
      const S = M[0] + M[2] / 2,
        z = M[1] + M[3] / 2,
        [B, b] = v(S, z),
        F = ut((B - 30) * 0.9, 14, 150);
      let _ = 14 + i() * i() * 140;
      (i() < 0.12 && (_ += 60), (_ = Math.min(_, F)), B < 80 && _ > b - 8 && _ < b + 40 && (_ = Math.max(12, b - 12)));
      const R = i();
      if (_ > 70 && M[2] > 22 && M[3] > 22 && i() < 0.6) {
        const W = _ * (0.55 + i() * 0.15);
        (s.push([S, z, M[2], M[3], W, R, 0]), s.push([S, z, M[2] * 0.68, M[3] * 0.68, _, R, 0]), (_ = _));
      } else s.push([S, z, M[2], M[3], _, R, 0]);
      const A = 1 + ((i() * 3) | 0),
        N = _,
        G = s[s.length - 1][2],
        L = s[s.length - 1][3];
      for (let W = 0; W < A; W++) {
        const Y = i(),
          at = S + (i() - 0.5) * G * 0.6,
          st = z + (i() - 0.5) * L * 0.6;
        Y < 0.55
          ? d.push([at, N, st, 3 + i() * 5, 1.5 + i() * 2.5, 3 + i() * 5, i()])
          : Y < 0.8
            ? d.push([at, N, st, 0.6, 8 + i() * 18, 0.6, i()])
            : d.push([at, N, st, 5 + i() * 4, 4 + i() * 3, 5 + i() * 4, i()]);
      }
    }
    const m = s.length;
    for (let M = 0; M < 560; M++) {
      const S = i() * X,
        z = (2300 + i() * 2400) * a,
        B = o + Math.cos(S) * z,
        b = o + Math.sin(S) * z,
        F = 30 + i() * 70,
        _ = 30 + i() * 70,
        R = 60 + i() * i() * 520 + (i() < 0.1 ? 250 : 0);
      (s.push([B, b, F, _, R, i(), 1]), R > 300 && i() < 0.5 && s.push([B, b, F * 0.55, _ * 0.55, R * 1.18, i(), 1]));
    }
    const g = ar(t.groundTex, n),
      p = new Map();
    for (const M of s) {
      let S;
      (M[6]
        ? (S = "f" + (((((Math.atan2(M[1] - o, M[0] - o) + Math.PI) / X) * 8) | 0) % 8))
        : (S = "n" + ut(Math.floor(M[0] / (n / 3)), 0, 2) + ut(Math.floor(M[1] / (n / 3)), 0, 2)),
        p.has(S) || p.set(S, []),
        p.get(S).push(M));
    }
    const w = [];
    t.farChunks = [];
    let C = 0;
    for (const [M, S] of p) {
      const z = new THREE.BoxGeometry(1, 1, 1);
      z.translate(0, 0.5, 0);
      const B = new Float32Array(S.length),
        b = new THREE.InstancedMesh(z, g, S.length);
      for (let F = 0; F < S.length; F++) {
        const _ = S[F];
        (Q.set(_[0], 0, _[1]),
          ne.identity(),
          re.set(_[2], _[4], _[3]),
          ae.compose(Q, ne, re),
          b.setMatrixAt(F, ae),
          (B[F] = _[5]),
          _[4] > 90 && w.push(_[0], _[4] + 3, _[1]));
      }
      (z.setAttribute("aSeed", new THREE.InstancedBufferAttribute(B, 1)),
        (b.instanceMatrix.needsUpdate = !0),
        b.computeBoundingSphere(),
        (b.frustumCulled = !0),
        t.group.add(b),
        (C += S.length),
        M[0] === "f" && +M[1] % 2 === 1 && t.farChunks.push(b));
    }
    const D = g0(),
      x = new THREE.MeshStandardMaterial({ color: 3814736, roughness: 0.6, metalness: 0.5, envMap: xt, envMapIntensity: 0.5, map: D.alb }),
      H = new Map();
    for (const M of d) {
      const S = ut(Math.floor(M[0] / (n / 3)), 0, 2) * 3 + ut(Math.floor(M[2] / (n / 3)), 0, 2);
      (H.has(S) || H.set(S, []), H.get(S).push(M));
    }
    for (const [, M] of H) {
      const S = new THREE.BoxGeometry(1, 1, 1);
      S.translate(0, 0.5, 0);
      const z = new THREE.InstancedMesh(S, x, M.length);
      for (let B = 0; B < M.length; B++) {
        const b = M[B];
        (Q.set(b[0], b[1], b[2]),
          Me.set(0, b[6] * X, 0),
          ne.setFromEuler(Me),
          re.set(b[3], b[4], b[5]),
          ae.compose(Q, ne, re),
          z.setMatrixAt(B, ae),
          b[4] > 8 && w.push(b[0], b[1] + b[4] + 0.5, b[2]));
      }
      ((z.instanceMatrix.needsUpdate = !0), z.computeBoundingSphere(), t.group.add(z));
    }
    ((t.buildings = C), (t.nearBuildings = m), (t.props = d.length));
    const U = new THREE.BufferGeometry();
    U.setAttribute("position", new THREE.Float32BufferAttribute(w, 3));
    const E = new Float32Array(w.length / 3);
    for (let M = 0; M < E.length; M++) E[M] = i() * X;
    U.setAttribute("aPh", new THREE.BufferAttribute(E, 1));
    const y = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uScale: { value: 400 } }]),
      vertexShader: `attribute float aPh; uniform float uTime; uniform float uScale; varying float vB; ${Tt}
        void main(){ vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          vB = 0.25 + 0.75 * step(0.55, fract(uTime * 0.6 + aPh));
          gl_PointSize = clamp(9.0 * uScale / -mvPosition.z, 2.0, 32.0);
          #include <fog_vertex>
        }`,
      fragmentShader: `varying float vB;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord * 2.0 - 1.0; float d = dot(p, p); if (d > 1.0) discard; float a = (1.0 - d); a *= a;
          gl_FragColor = vec4(vec3(2.6, 0.3, 0.3) * a * vB, 0.0);
          #ifdef USE_FOG
            gl_FragColor.rgb *= 1.0 - 0.6 * smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        }`,
      fog: !0,
    });
    (Re(y), (y.uniforms.uTime = ot.time), (t.towerLightScale = y.uniforms.uScale));
    const T = new THREE.Points(U, y);
    ((T.frustumCulled = !1), (T.renderOrder = 8), t.group.add(T));
  }
  const _a = `
    float jh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    float jn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(jh(i), jh(i + vec2(1.0, 0.0)), u.x), mix(jh(i + vec2(0.0, 1.0)), jh(i + vec2(1.0, 1.0)), u.x), u.y); }
    vec3 regoAlb(vec2 p){
      float m = jn(p / 900.0) * 0.6 + jn(p / 260.0) * 0.3 + jn(p / 70.0) * 0.1;      // maria / highland patches
      return mix(vec3(0.19, 0.188, 0.186), vec3(0.33, 0.325, 0.315), smoothstep(0.3, 0.75, m));
    }
    float craterH(vec2 p){
      vec2 g = floor(p), f = fract(p); float h = 0.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)), id = g + o;
        if (jh(id) < 0.64) continue;
        vec2 c = o + 0.2 + 0.6 * vec2(jh(id + 3.1), jh(id + 7.7)) - f;
        float R = 0.08 + 0.38 * pow(jh(id + 1.9), 2.0), d = length(c) / R;
        if (d < 1.0) h += (d * d - 1.0) * 0.55 * R;
        else if (d < 1.7) h += exp(-(d - 1.0) * 5.0) * 0.22 * R * (1.7 - d) / 0.7;
      }
      return h;
    }
`;
  function rr(t) {
    const o = new Float32Array(65536).fill(1e4),
      l = 320;
    for (let f = 0; f < t.n; f += 2) {
      const u = t.CX[f],
        r = t.CZ[f],
        c = t.HW[f] + kt,
        h = Math.max(0, Math.floor((u - l - -600) / 16)),
        v = Math.min(255, Math.floor((u + l - -600) / 16)),
        i = Math.max(0, Math.floor((r - l - -600) / 16)),
        s = Math.min(255, Math.floor((r + l - -600) / 16));
      for (let d = i; d <= s; d++)
        for (let m = h; m <= v; m++) {
          const g = -600 + (m + 0.5) * 16,
            p = -600 + (d + 0.5) * 16,
            w = Math.hypot(g - u, p - r) - c,
            C = d * 256 + m;
          w < o[C] && (o[C] = w);
        }
    }
    return function (u, r) {
      const c = Math.floor((u - -600) / 16),
        h = Math.floor((r - -600) / 16);
      return c < 0 || h < 0 || c >= 256 || h >= 256 ? 1e4 : o[h * 256 + c] - 12;
    };
  }
  function we(t, e, n) {
    const a = Math.abs(Math.cos(t)),
      o = Math.abs(Math.sin(t));
    return e / Math.pow(Math.pow(a, n) + Math.pow(o, n), 1 / n);
  }
  function lo(t, e, n, a, o, l, f) {
    const u = [];
    for (let r = 0; r < a.length; r++) {
      const c = Math.max(0.02, a[r][0]),
        h = a[r][1],
        v = [];
      for (let i = 0; i < o; i++) {
        const s = (i * X) / o + (f || 0);
        v.push([e + Math.cos(s) * c, h, n + Math.sin(s) * c]);
      }
      u.push(v);
    }
    return (t.loftS(u, l, null, null), u);
  }
  function sr(t, e, n, a, o, l, f, u, r) {
    const c = t.k;
    t.k = 2;
    for (const h of o) {
      const v = Math.cos(h),
        i = Math.sin(h),
        s = -i,
        d = v;
      for (let m = l; m < f; m++) {
        const g = a[m][0] + 0.25,
          p = a[m + 1][0] + 0.25,
          w = a[m][1],
          C = a[m + 1][1];
        t.quad(
          [e + v * g + s * r, w, n + i * g + d * r],
          [e + v * g - s * r, w, n + i * g - d * r],
          [e + v * p - s * r, C, n + i * p - d * r],
          [e + v * p + s * r, C, n + i * p + d * r],
          u,
        );
      }
    }
    t.k = c;
  }
  function Pe(t, e, n, a, o, l, f, u, r) {
    const c = t.k;
    t.k = r ?? 2;
    for (let h = 0; h < f; h++) {
      const v = (h * X) / f,
        i = ((h + 1) * X) / f;
      t.quad(
        [e + Math.cos(v) * a, o - l, n + Math.sin(v) * a],
        [e + Math.cos(i) * a, o - l, n + Math.sin(i) * a],
        [e + Math.cos(i) * a, o + l, n + Math.sin(i) * a],
        [e + Math.cos(v) * a, o + l, n + Math.sin(v) * a],
        u,
      );
    }
    t.k = c;
  }
  function Bt(t, e, n, a, o, l, f, u, r, c, h) {
    const v = t.k;
    ((t.k = e), t.obox(n, a, o, l, f, u, r, c, h), (t.k = v));
  }
  function qt(t, e, n, a, o, l, f, u) {
    const r = a[0] - n[0],
      c = a[1] - n[1],
      h = a[2] - n[2],
      v = Math.hypot(r, c, h) || 1,
      i = [r / v, c / v, h / v];
    let s = u || [0, 1, 0],
      d = [i[1] * s[2] - i[2] * s[1], i[2] * s[0] - i[0] * s[2], i[0] * s[1] - i[1] * s[0]],
      m = Math.hypot(d[0], d[1], d[2]);
    (m < 1e-4 &&
      ((s = [1, 0, 0]),
      (d = [i[1] * s[2] - i[2] * s[1], i[2] * s[0] - i[0] * s[2], i[0] * s[1] - i[1] * s[0]]),
      (m = Math.hypot(d[0], d[1], d[2]))),
      (d = [d[0] / m, d[1] / m, d[2] / m]),
      (s = [d[1] * i[2] - d[2] * i[1], d[2] * i[0] - d[0] * i[2], d[0] * i[1] - d[1] * i[0]]),
      Bt(t, e, [(n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2], i, s, d, v / 2, l, o, f));
  }
  const Wt = [0.82, 0.83, 0.86],
    Ee = [0.66, 0.68, 0.72],
    Ht = [0.75, 0.78, 0.84],
    co = [0.1, 0.11, 0.13],
    ve = [0.35, 0.92, 1],
    Ge = [1, 1, 1],
    jo = [1, 0.68, 0.22],
    ir = [1, 0.2, 0.22];
  function lr(t, e, n, a, o, l, f, u) {
    let r;
    l === 0
      ? (r = [
          [o * 1.25, 0],
          [o * 1.25, 6],
          [o, 10],
          [o * 0.95, a * 0.3],
          [o * 0.72, a * 0.7],
          [o * 0.9, a * 0.74],
          [o * 0.9, a * 0.78],
          [o * 0.55, a * 0.84],
          [o * 0.22, a * 0.97],
          [0.8, a * 1.05],
          [0.3, a * 1.16],
        ])
      : l === 1
        ? (r = [
            [o * 1.15, 0],
            [o, 8],
            [o, a * 0.24],
            [o * 1.25, a * 0.25],
            [o * 1.25, a * 0.27],
            [o * 0.85, a * 0.29],
            [o * 0.85, a * 0.55],
            [o * 1.1, a * 0.56],
            [o * 1.1, a * 0.58],
            [o * 0.65, a * 0.6],
            [o * 0.6, a * 0.9],
            [o * 0.8, a * 0.92],
            [o * 0.3, a],
            [0.5, a * 1.1],
          ])
        : (r = [
            [o * 1.1, 0],
            [o * 0.6, a * 0.08],
            [o * 0.5, a * 0.5],
            [o * 0.36, a * 0.85],
            [o * 0.6, a * 0.88],
            [o * 0.6, a * 0.9],
            [o * 0.12, a],
            [0.3, a * 1.18],
          ]);
    const c = 20,
      h = f() * X;
    lo(t, e, n, r, c, (s, d) => {
      const m = r[s][1],
        g = r[Math.min(r.length - 1, s + 1)][1];
      if ((l === 2 && s === 0) || (Math.abs(r[s][0] - r[Math.min(r.length - 1, s + 1)][0]) > o * 0.15 && g - m < a * 0.05))
        return ((t.k = 1), Ht);
      const w = Math.cos((d * X) / c - h);
      return m > 8 && m < a * 0.85 && w > 0.2 && l !== 2 ? ((t.k = 3), co) : ((t.k = 0), d & 1 ? Wt : Ee);
    });
    const v = [],
      i = l === 2 ? 3 : 4;
    for (let s = 0; s < i; s++) v.push(h + Math.PI + (s - (i - 1) / 2) * 0.55);
    sr(t, e, n, r, v, 1, r.length - 3, f() < 0.7 ? ve : Ge, 0.45);
    for (let s = 0; s < r.length - 2; s++)
      Math.abs(r[s][1] - r[s + 1][1]) < a * 0.03 &&
        r[s][1] > 5 &&
        Pe(t, e, n, Math.max(r[s][0], r[s + 1][0]) + 0.3, (r[s][1] + r[s + 1][1]) / 2, 0.55, c, Ge);
    return (
      Pe(t, e, n, r[1][0] + 0.3, 4, 0.6, c, ve),
      u.lampPts.push(e, a * (l === 1 ? 1.1 : l === 0 ? 1.16 : 1.18) + 1, n, 1, 0.25, 0.25, 7),
      u.glintPts.push([e + Math.cos(h) * r[5][0], r[5][1], n + Math.sin(h) * r[5][0], Math.cos(h), 0.25, Math.sin(h)]),
      r
    );
  }
  function cr(t, e, n) {
    const a = e.x,
      o = e.y,
      l = n() < 0.7 ? ve : jo;
    if (e.round) {
      const f = e.w * 0.46,
        u = [
          [f + 1.2, 0],
          [f + 1.2, 2.2],
          [f, 2.6],
        ];
      for (let r = 1; r <= 9; r++) {
        const c = ((r / 9) * Math.PI) / 2;
        u.push([f * Math.cos(c), 2.6 + f * 0.62 * Math.sin(c)]);
      }
      (lo(t, a, o, u, 22, (r, c) => (r < 2 ? ((t.k = 1), Ht) : r === 3 || r === 4 ? ((t.k = 3), co) : ((t.k = 0), r & 1 ? Wt : Ee))),
        Pe(t, a, o, f + 1.3, 2.3, 0.35, 22, l),
        Pe(t, a, o, f * Math.cos(((Math.PI / 2) * 7) / 9) + 0.2, 2.6 + f * 0.62 * Math.sin(((Math.PI / 2) * 7) / 9), 0.3, 22, Ge));
    } else {
      const f = e.w >= e.h,
        u = Math.max(e.w, e.h) / 2,
        r = Math.min(e.w, e.h) * 0.45,
        c = 0.72,
        h = r * c * 0.6,
        v = [],
        i = 12,
        s = 18;
      for (let m = 0; m <= i; m++) {
        const g = -1 + (2 * m) / i,
          p = g * u,
          w = Math.max(0, Math.abs(p) - (u - r)),
          C = Math.sqrt(Math.max(4e-4, r * r - w * w)),
          D = [];
        for (let x = 0; x < s; x++) {
          const H = (x * X) / s,
            U = p,
            E = h + Math.sin(H) * C * c,
            y = Math.cos(H) * C;
          D.push(f ? [a + U, E, o + y] : [a + y, E, o + U]);
        }
        v.push(D);
      }
      t.loftS(
        v,
        (m, g) => {
          const p = Math.sin((g * X) / s);
          return p > 0.25 && p < 0.55 ? ((t.k = 3), co) : p < -0.3 ? ((t.k = 1), Ht) : ((t.k = 0), m & 1 ? Wt : Ee);
        },
        null,
        null,
      );
      const d = t.k;
      t.k = 2;
      for (const m of [1, -1]) {
        const g = m > 0 ? 0.12 : Math.PI - 0.12,
          p = Math.cos(g);
        for (let w = 1; w < i - 1; w++) {
          const C = -1 + (2 * w) / i,
            D = -1 + (2 * (w + 1)) / i,
            x = C * u,
            H = D * u,
            U = Math.max(0, Math.abs(x) - (u - r)),
            E = Math.max(0, Math.abs(H) - (u - r)),
            y = Math.sqrt(Math.max(0, r * r - U * U)) + 0.2,
            T = Math.sqrt(Math.max(0, r * r - E * E)) + 0.2,
            M = (S, z, B) => {
              const b = h + Math.sin(g) * z * c + B,
                F = p * z;
              return f ? [a + S, b, o + F] : [a + F, b, o + S];
            };
          t.quad(M(x, y, -0.35), M(H, T, -0.35), M(H, T, 0.35), M(x, y, 0.35), l);
        }
      }
      t.k = d;
    }
  }
  function fr(t, e, n, a, o, l) {
    const f = Math.cos(a),
      u = Math.sin(a),
      r = (s, d, m) => [e + s * f - m * u, d, n + s * u + m * f],
      c = o * 0.11,
      h = [
        [-0.5, 0.1, 0.16, 0.12],
        [-0.42, 0.13, 0.19, 0.12],
        [-0.1, 0.13, 0.2, 0.12],
        [0.2, 0.12, 0.17, 0.12],
        [0.38, 0.09, 0.12, 0.1],
        [0.48, 0.045, 0.07, 0.07],
        [0.52, 0.01, 0.03, 0.03],
      ],
      v = [],
      i = 16;
    for (const s of h) {
      const d = s[0] * o,
        m = s[1] * o,
        g = s[2] * o,
        p = s[3] * o,
        w = [];
      for (let C = 0; C < i; C++) {
        const D = (C * X) / i,
          x = Math.cos(D),
          H = Math.sin(D);
        w.push(r(d, c + p + (x > 0 ? x * g : x * p), H * m));
      }
      v.push(w);
    }
    (t.loftS(
      v,
      (s, d) => {
        const m = Math.cos((d * X) / i);
        return s === 4 && m > 0.3 ? ((t.k = 3), co) : m < -0.5 ? ((t.k = 0), [0.5, 0.52, 0.56]) : ((t.k = 0), Wt);
      },
      null,
      null,
    ),
      (t.k = 0));
    for (const s of [1, -1]) {
      (t.slabB(
        [
          [-0.42 * o, 0.1 * o],
          [0.12 * o, 0.12 * o],
          [-0.3 * o, 0.42 * o],
          [-0.46 * o, 0.42 * o],
        ],
        (g, p, w) => r(g, c + 0.13 * o + w, p * s),
        0.6,
        0.25,
        Wt,
        Ht,
        Ee,
      ),
        qt(t, 1, r(-0.4 * o, 0, s * 0.2 * o), r(-0.36 * o, c + 0.12 * o, s * 0.14 * o), 0.5, 0.5, Ht),
        qt(t, 1, r(0.3 * o, 0, s * 0.1 * o), r(0.28 * o, c + 0.12 * o, s * 0.06 * o), 0.4, 0.4, Ht));
      const d = t.k;
      t.k = 2;
      const m = r(-0.38 * o, c + 0.14 * o, s * 0.43 * o);
      (t.quad(
        [m[0] - 0.6, m[1] - 0.6, m[2]],
        [m[0] + 0.6, m[1] - 0.6, m[2]],
        [m[0] + 0.6, m[1] + 0.6, m[2]],
        [m[0] - 0.6, m[1] + 0.6, m[2]],
        s > 0 ? [0.3, 1, 0.4] : ir,
      ),
        (t.k = d));
    }
    t.slabB(
      [
        [-0.5 * o, 0.3 * o],
        [-0.3 * o, 0.3 * o],
        [-0.42 * o, 0.55 * o],
        [-0.52 * o, 0.55 * o],
      ],
      (s, d, m) => r(s, c + d, m),
      0.5,
      0.2,
      Wt,
      Ht,
      Ee,
    );
    for (const s of [-0.08, 0, 0.08]) {
      const d = r(-0.5 * o, c + 0.13 * o, s * o),
        m = r(-0.56 * o, c + 0.13 * o, s * o);
      qt(t, 1, d, m, o * 0.035, o * 0.035, Ht);
      const g = t.k;
      t.k = 2;
      const p = o * 0.028;
      (t.quad(
        r(-0.562 * o, c + 0.13 * o - p, s * o - p),
        r(-0.562 * o, c + 0.13 * o - p, s * o + p),
        r(-0.562 * o, c + 0.13 * o + p, s * o + p),
        r(-0.562 * o, c + 0.13 * o + p, s * o - p),
        [0.25, 0.6, 0.9],
      ),
        (t.k = g));
    }
    l.glintPts.push([...r(0.3 * o, c + 0.29 * o, 0), 0.3 * f, 0.9, 0.3 * u]);
  }
  function ur(t, e, n, a, o, l, f) {
    const u = l - n,
      r = f - a,
      c = Math.hypot(u, r) || 1,
      h = u / c,
      v = r / c;
    (Bt(t, 1, [n, o / 2, a], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.9, o / 2, 0.9, Ht),
      Bt(t, 0, [n, 2, a], [1, 0, 0], [0, 1, 0], [0, 0, 1], 2.5, 2, 2.5, Ee));
    const i = [-v, 0, h],
      s = [h, 0, v];
    Bt(t, 0, [n, o, a], s, [0, 1, 0], i, 1.2, 1.2, 9, Wt);
    const d = t.k;
    for (let m = -1.5; m <= 1.5; m += 1) {
      const g = n + i[0] * m * 5 + h * 1.6,
        p = a + i[2] * m * 5 + v * 1.6,
        w = o - 2.6;
      (Bt(t, 1, [g - h * 0.6, w, p - v * 0.6], s, [0, 1, 0], i, 1, 1.6, 2, Ht), (t.k = 2));
      const C = (D, x) => [g + i[0] * D, w + x, p + i[2] * D];
      (t.quad(C(-1.7, -1.3), C(1.7, -1.3), C(1.7, 1.3), C(-1.7, 1.3), [1.4, 1.4, 1.35]),
        (t.k = d),
        e.lampPts.push(g + h * 0.3, w, p + v * 0.3, 1, 0.97, 0.9, 30));
    }
    e.cones.push([n + h * 2, o - 2.6, a + v * 2, h, -0.62, v, o * 1.25]);
  }
  function z0(t, e, n) {
    const a = t - 1024,
      o = e - 1024,
      l = Math.hypot(a, o);
    if (l < 1480) return -0.4;
    const f = k0(t / 650, e / 650) * 0.65 + k0(t / 240, e / 240) * 0.25 + k0(t / 90, e / 90) * 0.1;
    let u = Ba((l - 1700) / 1600) * (f * 240 + 15);
    const r = 1 - Math.abs(k0(t / 1900, e / 1900) * 2 - 1),
      c = 1 - Math.abs(k0(t / 820 + 7, e / 820 + 3) * 2 - 1);
    u += Ba((l - 3600) / 3400) * (r * r * 900 + c * 260);
    for (const h of n) {
      const v = Math.hypot(t - h[0], e - h[1]) / h[2];
      v < 1 ? (u += (v * v - 1) * h[2] * 0.22) : v < 1.8 && (u += (Math.exp(-(v - 1) * 4) * h[2] * 0.12 * (1.8 - v)) / 0.8);
    }
    return Math.max(-0.4, u - 0.4);
  }
  function Ba(t) {
    return ((t = ut(t, 0, 1)), t * t * (3 - 2 * t));
  }
  function fo(t, e) {
    let n = (Math.imul(t | 0, 374761393) + Math.imul(e | 0, 668265263)) | 0;
    return ((n = Math.imul(n ^ (n >>> 13), 1274126177)), ((n ^ (n >>> 16)) >>> 0) / 4294967296);
  }
  function k0(t, e) {
    const n = Math.floor(t),
      a = Math.floor(e),
      o = t - n,
      l = e - a,
      f = o * o * (3 - 2 * o),
      u = l * l * (3 - 2 * l),
      r = fo(n, a),
      c = fo(n + 1, a),
      h = fo(n, a + 1),
      v = fo(n + 1, a + 1);
    return r + (c - r) * f + (h - r) * u + (r - c - h + v) * f * u;
  }
  function* hr(t) {
    const e = t.track,
      n = e.landmarks || {},
      a = e.size || 2048,
      o = n.dome || { cx: a / 2, cy: a / 2, r: a * (1010 / 2048), p: 6 },
      l = [o.cx, o.cy],
      f = o.r,
      u = o.p || 6,
      r = 680 * (f / 1010),
      c = rr(t),
      h = $t(24094),
      v = new Et();
    ((v.useK = !0), (v.k = 0), (t.lampPts = []), (t.cones = []));
    const i = t.holo,
      s = n.reactor || { x: 1570, y: 1460, r: 120 },
      d = s.x,
      m = s.y,
      g = s.r;
    {
      const E = [
        [g * 0.9, 0],
        [g * 0.9, 7],
        [g * 0.8, 9],
        [g * 0.5, 14],
        [g * 0.42, 22],
        [g * 0.42, 40],
        [g * 0.46, 42],
        [g * 0.46, 46],
        [g * 0.4, 48],
      ];
      (lo(v, d, m, E, 32, (T, M) => (T === 2 || T === 6 ? ((v.k = 1), Ht) : ((v.k = 0), M & 1 ? Wt : Ee))),
        Pe(v, d, m, g * 0.9 + 0.3, 5.5, 0.6, 40, ve),
        Pe(v, d, m, g * 0.46 + 0.3, 44, 0.8, 32, Ge));
      const y = [
        [g * 0.42, 190],
        [g * 0.5, 194],
        [g * 0.56, 204],
        [g * 0.5, 214],
        [g * 0.3, 224],
        [g * 0.16, 238],
        [g * 0.06, 270],
        [0.8, 310],
      ];
      (lo(v, d, m, y, 32, (T) => ((v.k = T === 2 || T === 5 ? 1 : 0), T === 2 ? Ht : Wt)),
        Pe(v, d, m, g * 0.56 + 0.3, 204, 1, 32, ve),
        Pe(v, d, m, g * 0.3 + 0.3, 224, 0.7, 32, Ge));
      for (let T = 0; T < 8; T++) {
        const M = (T / 8) * X,
          S = Math.cos(M),
          z = Math.sin(M);
        qt(v, 1, [d + S * g * 0.43, 46, m + z * g * 0.43], [d + S * g * 0.43, 192, m + z * g * 0.43], 1.2, 1.6, Ht, [S, 0, z]);
      }
      for (let T = 0; T < 4; T++) {
        const M = (T / 4) * X + 0.4,
          S = Math.cos(M),
          z = Math.sin(M);
        qt(v, 0, [d + S * g * 0.86, 0, m + z * g * 0.86], [d + S * g * 0.48, 150, m + z * g * 0.48], 3, 2.2, Wt, [S, 0.3, z]);
        const B = v.k;
        ((v.k = 2),
          qt(
            v,
            2,
            [d + S * g * 0.86 - z * 3.1, 2, m + z * g * 0.86 + S * 3.1],
            [d + S * g * 0.48 - z * 3.1, 150, m + z * g * 0.48 + S * 3.1],
            0.25,
            0.4,
            ve,
            [S, 0.3, z],
          ),
          (v.k = B));
      }
      (t.lampPts.push(d, 312, m, 0.5, 0.9, 1, 16),
        i.push({ c: [d, 262, m - g * 0.02], r: [1, 0, 0], w: 90, h: 90 / 8, row: 4, seed: 9.1 }),
        (t.reactor = { x: d, z: m, r: g }),
        mr(t, d, m, g));
    }
    if ((yield, n.hub)) {
      const E = n.hub;
      let y = 0,
        T = 1e18;
      for (let M = 0; M < t.n; M++) {
        const S = (t.CX[M] - E.x) ** 2 + (t.CZ[M] - E.y) ** 2;
        S < T && ((T = S), (y = M));
      }
      for (let M = -1; M <= 1; M++) {
        Pt(t, y * t.STEP + M * 36, k);
        const S = k.hw + 26 + (M === 0 ? 8 : 0),
          z = k.e,
          B = (_, R) => [k.x + k.rx * _, R, k.z + k.rz * _],
          b = [k.fx, 0, k.fz];
        for (const _ of [1, -1]) qt(v, 0, B(_ * S, 0), B(_ * S, z), 3.2, 3.2, Wt, b);
        const F = 20;
        for (let _ = 0; _ < F; _++) {
          const R = (_ / F) * Math.PI,
            A = ((_ + 1) / F) * Math.PI,
            N = B(Math.cos(R) * S, z + Math.sin(R) * S),
            G = B(Math.cos(A) * S, z + Math.sin(A) * S);
          qt(v, _ & 1 ? 0 : 1, N, G, 3.2, 3.6, _ & 1 ? Wt : Ht, b);
          const L = B(Math.cos(R) * (S - 3.7), z + Math.sin(R) * (S - 3.7)),
            W = B(Math.cos(A) * (S - 3.7), z + Math.sin(A) * (S - 3.7));
          qt(v, 2, L, W, 1, 0.3, M === 0 ? Ge : ve, b);
        }
        (M === 0 && i.push({ c: B(0, z + S + 12), r: [k.rx, 0, k.rz], w: S * 1.5, h: (S * 1.5) / 8, row: 0, seed: 0.5 }),
          t.rigs.push({
            a: y * t.STEP + M * 36,
            ph: 20 + M,
            y: z + S - 6,
            w: k.hw - 4,
            x: k.x,
            z: k.z,
            wy: z + S - 4,
            rx: k.rx,
            rz: k.rz,
          }));
      }
    }
    yield;
    const p = n.habs || [];
    for (const E of p) cr(v, E, h);
    for (let E = 0; E < p.length; E++)
      for (let y = E + 1; y < p.length; y++) {
        const T = p[E],
          M = p[y],
          S = Math.hypot(T.x - M.x, T.y - M.y);
        if (S > 110 || S < 20) continue;
        let z = !0;
        for (let B = 0; B <= 1; B += 0.1)
          if (c(T.x + (M.x - T.x) * B, T.y + (M.y - T.y) * B) < 10) {
            z = !1;
            break;
          }
        z && (qt(v, 0, [T.x, 3.2, T.y], [M.x, 3.2, M.y], 2.8, 2.6, Ee), qt(v, 2, [T.x, 6, T.y], [M.x, 6, M.y], 0.5, 0.15, ve));
      }
    yield;
    const w = [];
    for (let E = 0; E < 9e3 && w.length < 30; E++) {
      const y = a * 0.05859375 + h() * a * 0.8828125,
        T = a * (120 / 2048) + h() * a * (1808 / 2048),
        M = Math.atan2(T - l[1], y - l[0]),
        S = Math.hypot(y - l[0], T - l[1]) / we(M, f, u);
      if (S > 0.8) continue;
      const z = c(y, T);
      if (z < 30 || (w.length < 22 && z > 230)) continue;
      let B = Math.hypot(y - d, T - m) > g + 60;
      for (const R of p) Math.hypot(R.x - y, R.y - T) < Math.max(R.w, R.h) * 0.6 + 22 && (B = !1);
      for (const R of w) Math.hypot(R[0] - y, R[1] - T) < 105 && (B = !1);
      if (!B) continue;
      const b = r * Math.pow(1 - Math.pow(S, 2.4), 0.7),
        F = Math.min(b - 60, 120 + h() * 260),
        _ = ut(z * 0.25, 9, 16 + h() * 6);
      F < 90 || w.push([y, T, F, _]);
    }
    for (let E = 20, y = 1; E < t.n; E += 40, y = -y) {
      Pt(t, E * t.STEP, k);
      for (const T of [y, -y]) {
        const M = T * (k.hw + 62 + h() * 70),
          S = k.x + k.rx * M,
          z = k.z + k.rz * M,
          B = Math.atan2(z - l[1], S - l[0]),
          b = Math.hypot(S - l[0], z - l[1]) / we(B, f, u);
        if (b > 0.82 || c(S, z) < 26 || Math.hypot(S - d, z - m) < g + 60) continue;
        let F = !0;
        for (const A of p) Math.hypot(A.x - S, A.y - z) < Math.max(A.w, A.h) * 0.6 + 20 && (F = !1);
        for (const A of w) Math.hypot(A[0] - S, A[1] - z) < 95 && (F = !1);
        if (!F) continue;
        const _ = r * Math.pow(1 - Math.pow(b, 2.4), 0.7),
          R = Math.min(_ - 70, 110 + h() * 150);
        if (!(R < 90)) {
          w.push([S, z, R, ut(c(S, z) * 0.22, 8, 14)]);
          break;
        }
      }
    }
    ((t.moonTowers = w),
      w.forEach((E, y) => {
        const T = lr(v, E[0], E[1], E[2], E[3], y % 3, h, t);
        if (y < 5) {
          let M = 0,
            S = 1e18;
          for (let A = 0; A < t.n; A += 3) {
            const N = (t.CX[A] - E[0]) ** 2 + (t.CZ[A] - E[1]) ** 2;
            N < S && ((S = N), (M = A));
          }
          const z = t.CX[M] - E[0],
            B = t.CZ[M] - E[1],
            b = Math.hypot(z, B) || 1,
            F = [-B / b, 0, z / b],
            _ = E[2] * 0.62,
            R = T[4][0] + 6;
          i.push({ c: [E[0] + (z / b) * R, _, E[1] + (B / b) * R], r: F, w: 64, h: 8, row: 1 + (y % 7), seed: 4 + y * 1.3 });
        }
      }),
      yield,
      (n.pads || []).forEach((E, y) => {
        Pe(v, E.x, E.y, E.r + 0.4, 0.9, 0.9, 32, Ee, 0);
        for (let T = 0; T < 12; T++) {
          const M = (T / 12) * X,
            S = E.x + Math.cos(M) * (E.r + 0.6),
            z = E.y + Math.sin(M) * (E.r + 0.6);
          Bt(v, 2, [S, 1.9, z], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.5, 0.3, 0.5, T & 1 ? jo : Ge);
        }
        for (let T = 0; T < 4; T++) {
          const M = (T / 4) * X + Math.PI / 4,
            S = E.x + Math.cos(M) * (E.r + 5),
            z = E.y + Math.sin(M) * (E.r + 5);
          (Bt(v, 1, [S, 6, z], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.5, 6, 0.5, Ht), t.lampPts.push(S, 12.6, z, 1, 0.75, 0.35, 6));
        }
        E.r > 30 && y % 3 !== 2 && fr(v, E.x, E.y, h() * X, Math.min(70, E.r * 1.35), t);
      }),
      yield);
    for (let E = 0, y = 1; E < t.n; E += 72, y = -y)
      for (const T of [y]) {
        Pt(t, E * t.STEP, k);
        const M = T * (k.hw + 46),
          S = k.x + k.rx * M,
          z = k.z + k.rz * M;
        if (c(S, z) < 28) continue;
        const B = k.e + 70 + h() * 40;
        ur(v, t, S, z, B, k.x, k.z);
      }
    yield;
    for (const [E, y] of [
      [0.62, 0.78],
      [0.86, 0.45],
    ]) {
      const T = r * Math.pow(1 - Math.pow(E, 2.4), 0.7) * 0.92;
      for (let M = 0; M < 14; M++) {
        const S = (M / 14) * X + E,
          z = we(S, f, u) * E;
        t.lampPts.push(l[0] + Math.cos(S) * z, T, l[1] + Math.sin(S) * z, 0.55, 0.82, 1, 34 * y + 8);
      }
    }
    (yield, pr(t, v, c, l, f, u), yield);
    for (let E = 0; E < 9; E++) {
      const y = (E / 9) * X + 0.35,
        T = we(y, f, u) * (1.16 + h() * 0.14) + 40,
        M = l[0] + Math.cos(y) * T,
        S = l[1] + Math.sin(y) * T,
        z = Math.atan2(_e.moon.sun[2], _e.moon.sun[0]),
        B = Math.cos(z),
        b = Math.sin(z),
        F = 5 + ((h() * 4) | 0),
        _ = 3 + ((h() * 3) | 0);
      for (let R = 0; R < _; R++)
        for (let A = 0; A < F; A++) {
          const N = (A - F / 2) * 17,
            G = (R - _ / 2) * 15,
            L = M + N * -b + G * B,
            W = S + N * B + G * b;
          Bt(v, 1, [L, 2.2, W], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.35, 2.2, 0.35, Ht);
          const Y = [B * Math.cos(0.9), Math.sin(0.9), b * Math.cos(0.9)],
            at = [-b, 0, B],
            st = [-B * Math.sin(0.9), Math.cos(0.9), -b * Math.sin(0.9)];
          Bt(v, 4, [L, 4.6, W], st, Y, at, 4.5, 0.18, 7.5, [0.05, 0.08, 0.2]);
        }
    }
    (yield, dr(t, v, l, f, u, r), yield, (t.lightMap = xr(t, p, s, l, f, u)), yield* Mr(t), yield);
    const D = vr(a);
    D.uniforms.uLM.value = t.lightMap;
    const x = v.tris(),
      H = x > 14e4 ? ut(Math.ceil(Math.sqrt(x / 7e4)), 2, 8) : 1,
      U = H > 1 ? v.split((t.track.size || 2048) / H, { uv: !1 }) : [v.geo({ uv: !1 })];
    for (const E of U) {
      const y = new THREE.Mesh(E, D);
      ((y.renderOrder = 0), t.group.add(y));
    }
    ((t.tris += x), (t.structTris = Math.round(x)), gr(t));
  }
  function vr(t) {
    const e = new THREE.Color(_e.moon.sunCol).multiplyScalar(0.6),
      n = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          { uTime: { value: 0 }, uSun: { value: null }, uSunC: { value: new THREE.Vector3(e.r, e.g, e.b) }, uLM: { value: null } },
        ]),
        vertexShader: `attribute vec3 color; attribute float aK; varying vec3 vC; varying float vK; varying vec3 vW; varying vec3 vN; ${Tt}
        void main(){ vC = color; vK = aK; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
          vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
        fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform vec3 uSunC; uniform sampler2D uLM; varying vec3 vC; varying float vK; varying vec3 vW; varying vec3 vN;
        #include <fog_pars_fragment>
        float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        const vec3 EARTH = vec3(${(function () {
          const a = Math.hypot(Ot[0], Ot[1], Ot[2]);
          return Ot.map((o) => (o / a).toFixed(5)).join(",");
        })()});
        vec3 envLite(vec3 R, vec3 S){
          float y = R.y;
          vec3 c = vec3(0.004, 0.005, 0.01);
          c += vec3(0.3, 0.6, 0.8) * exp(-abs(y) * 9.0) * 0.32 + vec3(0.9, 0.95, 1.0) * exp(-abs(y - 0.03) * 60.0) * 0.25;   // base light band
          c += vec3(0.35, 0.55, 1.0) * smoothstep(0.986, 0.993, dot(R, EARTH)) * 1.6;
          if (y > 0.08) { vec2 q = R.xz / (y + 0.35) * 5.0; vec2 g = abs(fract(q) - 0.5); c += vec3(0.45, 0.55, 0.65) * smoothstep(0.46, 0.5, max(g.x, g.y)) * 0.12; }
          if (y < 0.0) c = mix(c, vec3(0.045, 0.045, 0.05), smoothstep(0.0, -0.25, y));
          return c;
        }
        void main(){
          vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
          vec3 V = normalize(cameraPosition - vW), S = normalize(uSun);
          float k = vK; vec3 col;
          if (k > 1.5 && k < 2.5) {
            col = vC * ${(Ue * 2).toFixed(2)} * (0.92 + 0.08 * sin(uTime * 2.5 + vW.y * 0.08 + vW.x * 0.03));
          } else {
            vec3 alb = vC; float metal = 0.15, gloss = 60.0; vec3 emis = vec3(0.0);
            float hc = abs(N.x) > abs(N.z) ? vW.z : vW.x;
            if (k > 0.5 && k < 1.5) { metal = 1.0; gloss = 260.0; emis = vec3(0.1, 0.34, 0.5) * smoothstep(80.0, 300.0, vW.y) * 1.1; }   // lit lattice ribs
            else if (k > 2.5 && k < 3.5) {   // dark glazing with lit windows
              vec2 cell = vec2(hc / 3.2, vW.y / 4.2), id = floor(cell), f = fract(cell);
              float win = step(0.12, f.x) * step(f.x, 0.88) * step(0.2, f.y) * step(f.y, 0.85);
              float h = h12(id + floor(vW.xz / 40.0) * 7.0);
              vec2 fw = fwidth(cell); float lod = smoothstep(0.45, 1.0, max(fw.x, fw.y));
              vec3 wc = h > 0.88 ? vec3(0.45, 0.95, 1.0) : h > 0.3 ? vec3(1.0, 0.9, 0.7) : vec3(0.08, 0.12, 0.16);
              emis = mix(wc * win, vec3(0.62, 0.64, 0.6), lod) * 3.2;
              alb = vec3(0.03, 0.035, 0.05); metal = 0.7; gloss = 200.0;
            } else if (k > 3.5) {             // solar cells
              vec2 q = (abs(N.y) > 0.5 ? vW.xz : vec2(hc, vW.y)) / 1.4; vec2 g = abs(fract(q) - 0.5);
              alb = mix(vec3(0.03, 0.06, 0.17), vec3(0.4, 0.45, 0.55), smoothstep(0.44, 0.5, max(g.x, g.y)));
              metal = 0.8; gloss = 700.0;
            } else {                          // white panels with seams
              vec2 q = abs(N.y) > 0.6 ? vW.xz / 7.0 : vec2(hc / 7.0, vW.y / 5.0); vec2 g = abs(fract(q) - 0.5);
              vec2 fw = fwidth(q); float sl = smoothstep(0.5 - max(fw.x, fw.y) * 1.2 - 0.012, 0.5, max(g.x, g.y));
              alb *= 1.0 - sl * 0.35 * (1.0 - smoothstep(0.3, 0.8, max(fw.x, fw.y)));
              alb *= 0.94 + 0.06 * h12(floor(q) + 3.0);
              float by = vW.y / 15.0, fb = fwidth(by);   // light-strip bands on tall white structure
              float band = smoothstep(0.08 + fb, 0.03, fract(by)); band = mix(band, 0.07, smoothstep(0.1, 0.3, fb));
              emis = vec3(0.4, 0.88, 1.0) * band * (1.0 - abs(N.y)) * smoothstep(7.0, 30.0, vW.y) * 2.2;
            }
            float ndl = max(dot(N, S), 0.0);
            vec3 R = reflect(-V, N);
            float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
            vec3 amb = mix(vec3(0.016, 0.017, 0.02), vec3(0.05, 0.06, 0.085), N.y * 0.5 + 0.5);
            vec3 diff = alb * (uSunC * ndl + amb + vec3(0.12, 0.18, 0.34) * max(dot(N, EARTH), 0.0) * 0.18) * (1.0 - metal * 0.85);
            diff += alb * vec3(0.1, 0.17, 0.22) * (0.55 - 0.45 * N.y) * smoothstep(260.0, 0.0, vW.y) * (1.0 - metal * 0.5);   // base light bounce
            col = vec3(0.0);
            float up = smoothstep(70.0, 360.0, vW.y);                     // high structure (dome lattice) up-lit by the base floodlights
            vec3 upl = vec3(0.3, 0.45, 0.55) * max(-N.y, 0.0) * up + vec3(0.1, 0.16, 0.2) * (1.0 - abs(N.y)) * up;
            diff += alb * upl * (metal > 0.5 ? 1.6 : 1.0);
            diff += alb * texture2D(uLM, vW.xz / ${(t || 2048).toFixed(1)}).rgb * 1.6 * smoothstep(160.0, 0.0, vW.y) * (0.6 + 0.4 * (1.0 - abs(N.y))) * (1.0 - metal * 0.6);   // floodlight pools
            vec3 H = normalize(S + V);
            vec3 spec = uSunC * pow(max(dot(N, H), 0.0), gloss) * mix(0.25, 3.0, metal) * ndl;
            vec3 env = envLite(R, S) * mix(fres * 0.7, mix(0.55, 1.0, fres), metal) * mix(vec3(1.0), alb * 0.8 + 0.3, metal);
            col = diff + spec + env + emis;
          }
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
        side: THREE.DoubleSide,
        fog: !0,
      });
    return ((n.uniforms.uTime = ot.time), (n.uniforms.uSun = ot.sun), (n.extensions = { derivatives: !0 }), n);
  }
  function dr(t, e, n, a, o, l) {
    const f = (1 + Math.sqrt(5)) / 2,
      u = [
        [-1, f, 0],
        [1, f, 0],
        [-1, -f, 0],
        [1, -f, 0],
        [0, -1, f],
        [0, 1, f],
        [0, -1, -f],
        [0, 1, -f],
        [f, 0, -1],
        [f, 0, 1],
        [-f, 0, -1],
        [-f, 0, 1],
      ],
      r = [
        [0, 11, 5],
        [0, 5, 1],
        [0, 1, 7],
        [0, 7, 10],
        [0, 10, 11],
        [1, 5, 9],
        [5, 11, 4],
        [11, 10, 2],
        [10, 7, 6],
        [7, 1, 8],
        [3, 9, 4],
        [3, 4, 2],
        [3, 2, 6],
        [3, 6, 8],
        [3, 8, 9],
        [4, 9, 5],
        [2, 4, 11],
        [6, 2, 10],
        [8, 6, 7],
        [9, 8, 1],
      ],
      c = -Math.atan(f),
      h = Math.cos(c),
      v = Math.sin(c),
      i = (R) => {
        const A = Math.hypot(R[0], R[1], R[2]),
          N = R[0] / A,
          G = R[1] / A,
          L = R[2] / A;
        return [N, G * h - L * v, G * v + L * h];
      },
      s = 11,
      d = [],
      m = new Map(),
      g = [],
      p = (R) => Math.round(R[0] * 2e4) + "," + Math.round(R[1] * 2e4) + "," + Math.round(R[2] * 2e4),
      w = (R) => {
        const A = p(R);
        let N = m.get(A);
        return (N === void 0 && ((N = d.length), d.push(R), m.set(A, N)), N);
      },
      C = u.map(i);
    for (const R of r) {
      const A = C[R[0]],
        N = C[R[1]],
        G = C[R[2]],
        L = [];
      for (let W = 0; W <= s; W++) {
        const Y = [];
        for (let at = 0; at <= s - W; at++) {
          const st = 1 - (W + at) / s,
            ft = W / s,
            mt = at / s;
          let Dt = A[0] * st + N[0] * ft + G[0] * mt,
            Zt = A[1] * st + N[1] * ft + G[1] * mt,
            P = A[2] * st + N[2] * ft + G[2] * mt;
          const V = Math.hypot(Dt, Zt, P);
          Y.push(w([Dt / V, Zt / V, P / V]));
        }
        L.push(Y);
      }
      for (let W = 0; W < s; W++)
        for (let Y = 0; Y < s - W; Y++)
          (g.push([L[W][Y], L[W + 1][Y], L[W][Y + 1]]), Y < s - W - 1 && g.push([L[W + 1][Y], L[W + 1][Y + 1], L[W][Y + 1]]));
    }
    const D = d.map((R) => {
        const A = Math.atan2(R[2], R[0]),
          N = Math.max(0, R[1]),
          G = Math.sqrt(Math.max(0, 1 - N * N)),
          L = we(A, a, o);
        return [n[0] + Math.cos(A) * G * L, l * Math.pow(Math.max(0, 1 - Math.pow(G, 2.4)), 0.7), n[1] + Math.sin(A) * G * L];
      }),
      x = g
        .filter((R) => d[R[0]][1] > -0.02 || d[R[1]][1] > -0.02 || d[R[2]][1] > -0.02)
        .filter((R) => Math.max(d[R[0]][1], d[R[1]][1], d[R[2]][1]) > 0.004),
      H = [n[0], -l * 0.6, n[1]],
      U = (R) => {
        const A = R[0] - H[0],
          N = R[1] - H[1],
          G = R[2] - H[2],
          L = Math.hypot(A, N, G) || 1;
        return [A / L, N / L, G / L];
      },
      E = [],
      y = [],
      T = [],
      M = [],
      S = new Map();
    for (const R of x) {
      const A = D[R[0]],
        N = D[R[1]],
        G = D[R[2]];
      let L = W0(A, N, G);
      const W = U([(A[0] + N[0] + G[0]) / 3, (A[1] + N[1] + G[1]) / 3, (A[2] + N[2] + G[2]) / 3]);
      L[0] * W[0] + L[1] * W[1] + L[2] * W[2] < 0 && (L = [-L[0], -L[1], -L[2]]);
      const Y = Math.random();
      [A, N, G].forEach((at, st) => {
        (E.push(at[0] + L[0] * 1.2, at[1] + L[1] * 1.2, at[2] + L[2] * 1.2),
          y.push(L[0], L[1], L[2]),
          T.push(st === 0 ? 1 : 0, st === 1 ? 1 : 0, st === 2 ? 1 : 0),
          M.push(Y));
      });
      for (let at = 0; at < 3; at++) {
        const st = R[at],
          ft = R[(at + 1) % 3],
          mt = st < ft ? st * 1e5 + ft : ft * 1e5 + st,
          Dt = S.get(mt);
        Dt
          ? ((Dt.n[0] += L[0]), (Dt.n[1] += L[1]), (Dt.n[2] += L[2]))
          : S.set(mt, { a: Math.min(st, ft), b: Math.max(st, ft), n: L.slice() });
      }
    }
    const z = new Set();
    for (const R of S.values()) {
      const A = D[R.a],
        N = D[R.b],
        G = Math.hypot(R.n[0], R.n[1], R.n[2]) || 1,
        L = [R.n[0] / G, R.n[1] / G, R.n[2] / G],
        W = [A[0] - L[0] * 1.6, A[1] - L[1] * 1.6, A[2] - L[2] * 1.6],
        Y = [N[0] - L[0] * 1.6, N[1] - L[1] * 1.6, N[2] - L[2] * 1.6];
      if ((qt(e, 1, W, Y, 1, 1.7, [0.7, 0.74, 0.8], L), Math.abs(A[1] - N[1]) < 4 && A[1] > 25)) {
        const st = [W[0] - L[0] * 1.8, W[1] - L[1] * 1.8, W[2] - L[2] * 1.8],
          ft = [Y[0] - L[0] * 1.8, Y[1] - L[1] * 1.8, Y[2] - L[2] * 1.8];
        qt(e, 2, st, ft, 0.5, 0.12, [0.3, 0.75, 0.95], L);
      }
      for (const st of [R.a, R.b])
        if (!z.has(st)) {
          z.add(st);
          const ft = D[st],
            mt = U(ft);
          (Bt(
            e,
            1,
            [ft[0] - mt[0] * 1.6, ft[1] - mt[1] * 1.6, ft[2] - mt[2] * 1.6],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            2,
            2,
            2,
            [0.85, 0.87, 0.92],
          ),
            ft[1] > 30 &&
              (st & 1) === 0 &&
              Bt(
                e,
                2,
                [ft[0] - mt[0] * 3.8, ft[1] - mt[1] * 3.8, ft[2] - mt[2] * 3.8],
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                0.7,
                0.7,
                0.7,
                [0.9, 0.97, 1],
              ),
            ft[1] > 30 &&
              st % 3 === 0 &&
              t.glintPts.push([ft[0] - mt[0] * 4.3, ft[1] - mt[1] * 4.3, ft[2] - mt[2] * 4.3, -mt[0], -mt[1], -mt[2]]));
        }
    }
    const B = 256;
    for (let R = 0; R < B; R++) {
      const A = (R / B) * X,
        N = ((R + 1) / B) * X,
        G = we(A, a, o),
        L = we(N, a, o),
        W = (Y, at, st, ft) => [n[0] + Math.cos(Y) * (at + st), ft, n[1] + Math.sin(Y) * (at + st)];
      ((e.k = 0),
        e.quad(W(A, G, -2, 0), W(N, L, -2, 0), W(N, L, -2, 24), W(A, G, -2, 24), Ee),
        e.quad(W(A, G, 4, 0), W(N, L, 4, 0), W(N, L, 4, 24), W(A, G, 4, 24), Wt),
        e.quad(W(A, G, -2, 24), W(N, L, -2, 24), W(N, L, 4, 24), W(A, G, 4, 24), Ht),
        (e.k = 2),
        e.quad(W(A, G, -2.1, 15), W(N, L, -2.1, 15), W(N, L, -2.1, 16.4), W(A, G, -2.1, 16.4), (R & 7) === 0 ? Ge : ve),
        e.quad(W(A, G, 4.1, 15), W(N, L, 4.1, 15), W(N, L, 4.1, 16.4), W(A, G, 4.1, 16.4), ve),
        (e.k = 0));
    }
    for (let R = 0; R < 4; R++) {
      const A = (R / 4) * X + (Math.PI / 4) * 0,
        N = we(A, a, o),
        G = n[0] + Math.cos(A) * N,
        L = n[1] + Math.sin(A) * N;
      (Bt(e, 0, [G, 20, L], [Math.cos(A), 0, Math.sin(A)], [0, 1, 0], [-Math.sin(A), 0, Math.cos(A)], 14, 20, 34, Wt, Ht),
        Bt(
          e,
          2,
          [G - Math.cos(A) * 14.2, 18, L - Math.sin(A) * 14.2],
          [Math.cos(A), 0, Math.sin(A)],
          [0, 1, 0],
          [-Math.sin(A), 0, Math.cos(A)],
          0.2,
          12,
          20,
          jo,
        ));
    }
    const b = new THREE.BufferGeometry();
    (b.setAttribute("position", new THREE.Float32BufferAttribute(E, 3)),
      b.setAttribute("normal", new THREE.Float32BufferAttribute(y, 3)),
      b.setAttribute("aBary", new THREE.Float32BufferAttribute(T, 3)),
      b.setAttribute("aSeed", new THREE.Float32BufferAttribute(M, 1)),
      b.computeBoundingSphere());
    const F = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uSun: { value: null }, uQ: { value: 2 } }]),
      vertexShader: `attribute vec3 aBary; attribute float aSeed; varying vec3 vB; varying float vS; varying vec3 vW; varying vec3 vN; ${Tt}
        void main(){ vB = aBary; vS = aSeed; vN = normal; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform float uQ; varying vec3 vB; varying float vS; varying vec3 vW; varying vec3 vN;
        #include <fog_pars_fragment>
        const vec3 EARTH = vec3(${(function () {
          const R = Math.hypot(Ot[0], Ot[1], Ot[2]);
          return Ot.map((A) => (A / R).toFixed(5)).join(",");
        })()});
        void main(){
          vec3 V = normalize(cameraPosition - vW), N = normalize(vN); if (dot(N, V) < 0.0) N = -N;
          vec3 S = normalize(uSun), R = reflect(-V, N);
          float nv = max(dot(N, V), 0.0), fres = 0.02 + 0.98 * pow(1.0 - nv, 4.0);
          // per-facet sun flash: whole panel lights when its plane mirrors the sun to the eye (view dependent)
          float sp = max(dot(R, S), 0.0);
          vec3 c = vec3(1.0, 0.97, 0.92) * (pow(sp, 1400.0) * 60.0 + pow(sp, 90.0) * 1.2 * (0.6 + 0.4 * vS));
          // reflections of the base lights below (cyan / white) and of the Earth
          float down = smoothstep(0.05, -0.5, R.y);
          c += vec3(0.003, 0.007, 0.01) * down * (0.3 + fres * 1.2);
          c += mix(vec3(0.25, 0.7, 0.95), vec3(0.9, 0.95, 1.0), vS) * exp(-abs(R.y + 0.06) * 26.0) * (0.05 + fres * 0.3);   // base light band mirrored
          c += vec3(0.25, 0.45, 1.0) * smoothstep(0.985, 0.993, dot(R, EARTH)) * 0.9 * fres;
          // frit / edge band + gentle sweeping sheen that rolls over the panels
          float e = min(vB.x, min(vB.y, vB.z)), fw = fwidth(e);
          c += vec3(0.5, 0.62, 0.72) * (1.0 - smoothstep(0.0, 0.03, e)) * 0.06 * (1.0 - smoothstep(0.02, 0.08, fw));
          float sweep = pow(0.5 + 0.5 * sin(dot(vW.xz, vec2(0.004, 0.003)) + vW.y * 0.01 - uTime * 0.35 + vS * 0.6), 24.0);
          c += vec3(0.4, 0.75, 0.9) * sweep * 0.09 * uQ;
          c += vec3(0.004, 0.006, 0.009) * fres;    // faint tint so the glass reads
          gl_FragColor = vec4(c, 0.0);
          ${Yt}
        }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
    (Re(F), (F.uniforms.uTime = ot.time), (F.uniforms.uSun = ot.sun), (F.uniforms.uQ = ot.glint), (F.extensions = { derivatives: !0 }));
    const _ = new THREE.Mesh(b, F);
    ((_.renderOrder = 7), (_.frustumCulled = !1), t.group.add(_), (t.glass = _), (t.tris += E.length / 9), (t.domeEdges = S.size));
  }
  function mr(t, e, n, a) {
    const o = [],
      l = [],
      f = [],
      u = [],
      r = (s, d, m, g, p) => {
        (o.push(s[0], s[1], s[2]), l.push(d, m, g, p));
      },
      c = (s, d, m, g, p, w, C) => {
        const D = o.length / 3;
        for (let x = 0; x <= 1; x++)
          for (let H = 0; H <= p; H++) {
            const U = (H / p) * X,
              E = x ? d : s;
            r([e + Math.cos(U) * E, x ? g : m, n + Math.sin(U) * E], w, C, H / p, x);
          }
        for (let x = 0; x < p; x++) {
          const H = D + x,
            U = D + x + 1,
            E = D + p + 1 + x,
            y = D + p + 2 + x;
          u.push(H, U, y, H, y, E);
        }
      };
    (c(a * 0.24, a * 0.24, 46, 192, 32, 0, 0), c(a * 0.41, a * 0.41, 46, 192, 40, 2, 0));
    for (let s = 0; s < 3; s++) {
      const d = 76 + s * 46,
        m = a * 0.33,
        g = 2.2,
        p = 48,
        w = 8,
        C = o.length / 3;
      for (let D = 0; D <= p; D++)
        for (let x = 0; x <= w; x++) {
          const H = (D / p) * X,
            U = (x / w) * X,
            E = m + Math.cos(U) * g;
          r([Math.cos(H) * E, Math.sin(U) * g, Math.sin(H) * E], 1, s + 1, D / p, d);
        }
      for (let D = 0; D < p; D++)
        for (let x = 0; x < w; x++) {
          const H = C + D * (w + 1) + x,
            U = H + 1,
            E = H + w + 1,
            y = E + 1;
          u.push(H, E, U, U, E, y);
        }
    }
    c(5, 16, 300, 2600, 24, 3, 0);
    {
      const s = o.length / 3,
        d = 64;
      for (let m = 0; m <= 1; m++)
        for (let g = 0; g <= d; g++) {
          const p = (g / d) * X,
            w = m ? a * 1.45 : a * 0.95;
          r([e + Math.cos(p) * w, 0.6, n + Math.sin(p) * w], 4, 0, g / d, m);
        }
      for (let m = 0; m < d; m++) {
        const g = s + m,
          p = s + m + 1,
          w = s + d + 1 + m,
          C = s + d + 2 + m;
        u.push(g, p, C, g, C, w);
      }
    }
    const h = new THREE.BufferGeometry();
    (h.setAttribute("position", new THREE.Float32BufferAttribute(o, 3)),
      h.setAttribute("aD", new THREE.Float32BufferAttribute(l, 4)),
      h.setIndex(u),
      (h.boundingSphere = new THREE.Sphere(new THREE.Vector3(e, 600, n), 2200)));
    const v = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uC: { value: new THREE.Vector3(e, 0, n) } }]),
      vertexShader: `attribute vec4 aD; uniform float uTime; uniform vec3 uC; varying vec4 vD; varying vec3 vW; varying float vP; ${Tt}
        void main(){ vD = aD; vec3 p = position;
          vP = 0.65 + 0.35 * sin(uTime * 2.6) + 0.15 * sin(uTime * 7.3);
          if (aD.x > 0.5 && aD.x < 1.5) {   // ring: tilt + spin about the tower axis
            float q = aD.y, sp = uTime * (0.6 + q * 0.35) * (mod(q, 2.0) > 0.5 ? 1.0 : -1.0), tl = 0.35 * sin(uTime * 0.4 + q * 2.1);
            float cs = cos(sp), sn = sin(sp); p = vec3(cs * p.x - sn * p.z, p.y, sn * p.x + cs * p.z);
            float ct = cos(tl), st = sin(tl); p = vec3(p.x, ct * p.y - st * p.x, st * p.y + ct * p.x);
            p += uC + vec3(0.0, aD.w, 0.0);
          }
          vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; uniform vec3 uC; varying vec4 vD; varying vec3 vW; varying float vP;
        #include <fog_pars_fragment>
        float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        void main(){
          float kind = vD.x; vec3 c;
          vec3 V = normalize(cameraPosition - vW);
          vec2 radial = normalize(vW.xz - uC.xz + 1e-4); float facing = abs(dot(vec3(radial.x, 0.0, radial.y), V));
          if (kind < 0.5) {
            float flow = sin(vW.y * 0.09 - uTime * 6.0) * 0.5 + 0.5, fil = sin(vD.z * 62.83 * 3.0 + vW.y * 0.05 + uTime * 3.0);
            c = mix(vec3(0.3, 1.6, 2.4), vec3(3.2, 3.6, 4.0), flow * 0.6 + 0.4 * smoothstep(0.6, 1.0, fil)) * (0.6 + 0.6 * vP) * (0.45 + 0.55 * facing);
          } else if (kind < 1.5) {
            c = vec3(0.6, 2.0, 2.8) * (0.7 + 0.5 * vP) * (0.75 + 0.25 * sin(vD.z * 62.83 * 2.0 + uTime * 9.0));
          } else if (kind < 2.5) {
            float rim = pow(1.0 - facing, 3.0);
            c = vec3(0.12, 0.35, 0.5) * (rim * 1.4 + 0.06) * (0.6 + 0.4 * vP);
            c += vec3(0.5, 0.9, 1.0) * step(0.97, fract(vW.y / 9.0)) * 0.15;
          } else if (kind < 3.5) {
            float y = vD.w; float fade = (1.0 - smoothstep(0.0, 1.0, (vW.y - 300.0) / 2300.0));
            float pulse = 0.5 + 0.5 * sin(vW.y * 0.01 - uTime * 5.0);
            c = vec3(0.25, 0.8, 1.2) * pow(facing, 1.5) * fade * (0.35 + 0.65 * pulse) * (0.5 + 0.5 * vP) * 0.55;
          } else {
            float r = vD.w; float wave = 0.5 + 0.5 * sin((1.0 - r) * 12.0 - uTime * 3.0);
            c = vec3(0.2, 0.7, 1.0) * (1.0 - r) * (0.25 + 0.5 * wave) * (0.6 + 0.4 * vP) * 0.6;
          }
          gl_FragColor = vec4(c, 0.0);
          ${Yt}
        }`,
      side: THREE.DoubleSide,
      fog: !0,
    });
    (Re(v), (v.uniforms.uTime = ot.time));
    const i = new THREE.Mesh(h, v);
    ((i.renderOrder = 7), (i.frustumCulled = !0), t.group.add(i));
  }
  function pr(t, e, n, a, o, l) {
    const f = [];
    for (let H = 0; H < 14; H++) {
      const U = (H / 14) * X,
        E = we(U, o, 4) * (0.66 + 0.06 * Math.sin(U * 3 + 1));
      f.push(new THREE.Vector3(a[0] + Math.cos(U) * E, 135 + 14 * Math.sin(U * 2), a[1] + Math.sin(U) * E));
    }
    const c = new THREE.CatmullRomCurve3(f, !0, "catmullrom", 0.5),
      h = 700,
      v = 4.2,
      i = 12,
      s = [],
      d = [],
      m = [],
      g = [],
      p = c.computeFrenetFrames(h, !0);
    for (let H = 0; H <= h; H++) {
      const U = H / h,
        E = c.getPointAt(U),
        y = p.normals[H % h],
        T = p.binormals[H % h];
      for (let M = 0; M <= i; M++) {
        const S = (M / i) * X,
          z = Math.cos(S),
          B = Math.sin(S),
          b = y.x * z + T.x * B,
          F = y.y * z + T.y * B,
          _ = y.z * z + T.z * B;
        (s.push(E.x + b * v, E.y + F * v, E.z + _ * v), m.push(b, F, _), d.push(U, M / i));
      }
    }
    for (let H = 0; H < h; H++)
      for (let U = 0; U < i; U++) {
        const E = H * (i + 1) + U,
          y = E + i + 1;
        g.push(E, y, E + 1, E + 1, y, y + 1);
      }
    const w = new THREE.BufferGeometry();
    (w.setAttribute("position", new THREE.Float32BufferAttribute(s, 3)),
      w.setAttribute("normal", new THREE.Float32BufferAttribute(m, 3)),
      w.setAttribute("uv", new THREE.Float32BufferAttribute(d, 2)),
      w.setIndex(g),
      w.computeBoundingSphere());
    const C = c.getLength(),
      D = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uLen: { value: C } }]),
        vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vW; ${Tt}
        void main(){ vUv = uv; vN = normal; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
        fragmentShader: `uniform float uTime; uniform float uLen; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
        #include <fog_pars_fragment>
        void main(){
          vec3 V = normalize(cameraPosition - vW); float nv = abs(dot(normalize(vN), V));
          float rim = pow(1.0 - nv, 2.5);
          vec3 c = vec3(0.08, 0.3, 0.42) * (rim * 1.2 + 0.05);
          c += vec3(0.6, 0.9, 1.0) * step(0.93, fract(vUv.x * uLen / 14.0)) * 0.1;            // tube frame rings
          float s = vUv.x * uLen;                                                              // pods: two trains each way
          float p1 = fract((s - uTime * 160.0) / (uLen * 0.5)) * uLen * 0.5, p2 = fract((s + uTime * 120.0 + 300.0) / (uLen * 0.5)) * uLen * 0.5;
          float pod = smoothstep(46.0, 40.0, p1) * smoothstep(0.0, 4.0, p1) + smoothstep(38.0, 32.0, p2) * smoothstep(0.0, 4.0, p2);
          c += mix(vec3(0.9, 1.0, 1.0), vec3(0.3, 0.9, 1.0), nv) * pod * (0.6 + 1.6 * nv);
          float lane = smoothstep(0.08, 0.0, abs(vUv.y - 0.75)) + smoothstep(0.08, 0.0, abs(vUv.y - 0.25));
          c += vec3(0.25, 0.8, 1.0) * lane * 0.35 * (0.6 + 0.4 * sin(s * 0.2 - uTime * 12.0));
          gl_FragColor = vec4(c, 0.0);
          ${Yt}
        }`,
        side: THREE.DoubleSide,
        fog: !0,
      });
    (Re(D), (D.uniforms.uTime = ot.time));
    const x = new THREE.Mesh(w, D);
    ((x.renderOrder = 7), t.group.add(x));
    for (let H = 0; H < C; H += 110) {
      const U = c.getPointAt(H / C);
      n(U.x, U.z) < 16 ||
        (qt(e, 0, [U.x, 0, U.z], [U.x, U.y - v - 6, U.z], 2.2, 2.2, Wt, [1, 0, 0]),
        Bt(e, 1, [U.x, U.y - v - 3, U.z], [1, 0, 0], [0, 1, 0], [0, 0, 1], 5, 3, 5, Ht),
        Bt(e, 2, [U.x, U.y - v - 6.3, U.z], [1, 0, 0], [0, 1, 0], [0, 0, 1], 5.1, 0.3, 5.1, ve));
    }
  }
  function gr(t) {
    const e = t.lampPts,
      n = e.length / 7,
      a = new Float32Array(n * 3),
      o = new Float32Array(n * 3),
      l = new Float32Array(n);
    for (let i = 0; i < n; i++)
      (a.set([e[i * 7], e[i * 7 + 1], e[i * 7 + 2]], i * 3),
        o.set([e[i * 7 + 3], e[i * 7 + 4], e[i * 7 + 5]], i * 3),
        (l[i] = e[i * 7 + 6]));
    const f = new THREE.BufferGeometry();
    (f.setAttribute("position", new THREE.BufferAttribute(a, 3)),
      f.setAttribute("color", new THREE.BufferAttribute(o, 3)),
      f.setAttribute("aSize", new THREE.BufferAttribute(l, 1)),
      f.computeBoundingSphere());
    const u = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uScale: { value: 400 }, uMaxPx: { value: 300 } }]),
      vertexShader: `attribute vec3 color; attribute float aSize; uniform float uScale; uniform float uTime; uniform float uMaxPx; varying vec3 vC; varying float vB; ${Tt}
        void main(){ vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition; vC = color;
          vB = aSize < 8.0 ? 0.35 + 0.65 * step(0.5, fract(uTime * 0.7 + position.x * 0.013)) : 1.0;
          gl_PointSize = clamp(aSize * uScale / max(1.0, -mvPosition.z), 2.0, min(380.0, uMaxPx));
          #include <fog_vertex>
        }`,
      fragmentShader: `varying vec3 vC; varying float vB;
        #include <fog_pars_fragment>
        void main(){ vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p); if (r > 1.0) discard;
          float a = exp(-r * r * 40.0) * 3.5 + exp(-r * 5.0) * 0.3 * (1.0 - r);
          a += exp(-abs(p.y) * 60.0) * (1.0 - abs(p.x)) * 0.5;            // anamorphic flare line
          gl_FragColor = vec4(vC * a * vB * 1.8, 0.0);
          ${Yt} }`,
      fog: !0,
    });
    (Re(u), (u.uniforms.uTime = ot.time), (u.uniforms.uMaxPx = ot.maxPx));
    const r = new THREE.Points(f, u);
    ((r.frustumCulled = !1), (r.renderOrder = 8), t.group.add(r), (t.towerLightScale = u.uniforms.uScale), (t.lampScaleK = 1));
    const c = [],
      h = [],
      v = [];
    for (const i of t.cones) {
      const [s, d, m, g, p, w, C] = i,
        D = Math.hypot(g, p, w),
        x = [g / D, p / D, w / D];
      let H = [x[2], 0, -x[0]];
      const U = Math.hypot(H[0], H[2]) || 1;
      H = [H[0] / U, 0, H[2] / U];
      const E = [H[1] * x[2] - H[2] * x[1], H[2] * x[0] - H[0] * x[2], H[0] * x[1] - H[1] * x[0]],
        y = 16,
        T = c.length / 3;
      for (let M = 0; M <= 1; M++)
        for (let S = 0; S <= y; S++) {
          const z = (S / y) * X,
            B = M ? C * 0.42 : 3,
            b = M ? C : 0;
          (c.push(
            s + x[0] * b + (H[0] * Math.cos(z) + E[0] * Math.sin(z)) * B,
            d + x[1] * b + E[1] * Math.sin(z) * B,
            m + x[2] * b + (H[2] * Math.cos(z) + E[2] * Math.sin(z)) * B,
          ),
            h.push(M));
        }
      for (let M = 0; M < y; M++) {
        const S = T + M,
          z = S + 1,
          B = T + y + 1 + M,
          b = B + 1;
        v.push(S, z, b, S, b, B);
      }
    }
    if (c.length) {
      const i = new THREE.BufferGeometry();
      (i.setAttribute("position", new THREE.Float32BufferAttribute(c, 3)),
        i.setAttribute("aF", new THREE.Float32BufferAttribute(h, 1)),
        i.setIndex(v),
        i.computeVertexNormals(),
        i.computeBoundingSphere());
      const s = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
        vertexShader: `attribute float aF; varying float vF; varying vec3 vN; varying vec3 vW; ${Tt}
          void main(){ vF = aF; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,
        fragmentShader: `varying float vF; varying vec3 vN; varying vec3 vW;
          #include <fog_pars_fragment>
          void main(){ vec3 V = normalize(cameraPosition - vW); float e = pow(abs(dot(normalize(vN), V)), 1.6);
            float a = (1.0 - vF) * (1.0 - vF) * e;
            gl_FragColor = vec4(vec3(0.5, 0.58, 0.64) * a * 0.5, 0.0);
            ${Yt} }`,
        side: THREE.DoubleSide,
        fog: !0,
      });
      Re(s);
      const d = new THREE.Mesh(i, s);
      ((d.renderOrder = 8), (d.frustumCulled = !1), t.group.add(d));
    }
    t.lamps = n;
  }
  function xr(t, e, n, a, o, l) {
    const u = (t.track.size || 2048) / 256,
      r = new Float32Array(256 * 256 * 3),
      c = (s, d, m, g, p, w, C) => {
        const D = Math.max(0, Math.floor((s - m) / u)),
          x = Math.min(255, Math.floor((s + m) / u)),
          H = Math.max(0, Math.floor((d - m) / u)),
          U = Math.min(255, Math.floor((d + m) / u));
        for (let E = H; E <= U; E++)
          for (let y = D; y <= x; y++) {
            const T = (y + 0.5) * u - s,
              M = (E + 0.5) * u - d,
              S = 1 - (T * T + M * M) / (m * m);
            if (S <= 0) continue;
            const z = S * S * C,
              B = (E * 256 + y) * 3;
            ((r[B] += g * z), (r[B + 1] += p * z), (r[B + 2] += w * z));
          }
      };
    for (const s of t.cones) {
      const [d, m, g, p, w, C, D] = s,
        x = Math.hypot(p, w, C),
        H = w / x,
        U = H < -0.05 ? Math.min(D * 1.4, m / -H) : D,
        E = d + (p / x) * U,
        y = g + (C / x) * U;
      (c(E, y, D * 0.55, 0.95, 0.97, 1, 0.85), c(d, g, 40, 0.9, 0.95, 1, 0.35));
    }
    const h = t.lampPts;
    for (let s = 0; s < h.length; s += 7) h[s + 6] < 8 && h[s + 1] < 40 && c(h[s], h[s + 2], 34, h[s + 3], h[s + 4], h[s + 5], 0.55);
    for (const s of e) c(s.x, s.y, Math.max(s.w, s.h) * 0.85 + 10, 0.35, 0.85, 1, 0.45);
    for (const s of t.moonTowers || []) c(s[0], s[1], s[3] * 3.2, 0.35, 0.9, 1, 0.6);
    c(n.x, n.y, n.r * 2.2, 0.3, 0.85, 1, 0.9);
    for (let s = 0; s < 96; s++) {
      const d = (s / 96) * X,
        m = we(d, o, l);
      c(a[0] + Math.cos(d) * (m - 18), a[1] + Math.sin(d) * (m - 18), 46, 0.3, 0.85, 1, 0.35);
    }
    for (let s = 0; s < t.n; s += 6) c(t.CX[s], t.CZ[s], t.HW[s] + 30, 0.25, 0.75, 1, 0.16);
    const v = new Uint8Array(256 * 256 * 4);
    for (let s = 0; s < 256 * 256; s++)
      for (let d = 0; d < 3; d++) v[s * 4 + d] = Math.min(255, Math.pow(r[s * 3 + d] / (1 + r[s * 3 + d] * 0.35), 0.85) * 160);
    for (let s = 0; s < 256 * 256; s++) v[s * 4 + 3] = 255;
    const i = new THREE.DataTexture(v, 256, 256, THREE.RGBAFormat);
    return (
      (i.magFilter = THREE.LinearFilter),
      (i.minFilter = THREE.LinearMipmapLinearFilter),
      (i.generateMipmaps = !0),
      (i.wrapS = i.wrapT = THREE.ClampToEdgeWrapping),
      (i.needsUpdate = !0),
      i
    );
  }
  let Vo = null;
  function* yr() {
    if (Vo) return Vo;
    const t = 1024,
      e = document.createElement("canvas");
    e.width = e.height = t;
    const n = e.getContext("2d"),
      a = n.createImageData(t, t),
      o = a.data,
      l = $t(4711),
      f = new Float32Array(t * t);
    for (let r = 0; r < t; r++) for (let c = 0; c < t; c++) f[r * t + c] = 0.5 + (l() - 0.5) * 0.18;
    yield;
    for (let r = 0; r < 520; r++) {
      (r & 63) === 63 && (yield);
      const c = l() * t,
        h = l() * t,
        v = 3 + Math.pow(l(), 3) * 46;
      for (let i = -v * 1.7; i < v * 1.7; i++)
        for (let s = -v * 1.7; s < v * 1.7; s++) {
          const d = Math.hypot(s, i) / v;
          if (d > 1.7) continue;
          const m = ((((c + s) % t) + t) % t) | 0,
            g = ((((h + i) % t) + t) % t) | 0;
          f[g * t + m] += d < 1 ? (d * d - 1) * 0.35 : Math.exp(-(d - 1) * 5) * 0.16;
        }
    }
    yield;
    for (let r = 0; r < t; r++)
      for (let c = 0; c < t; c++) {
        const h = (r * t + c) * 4,
          v = f[r * t + c],
          i = f[r * t + ((c + 1) % t)] - v,
          s = f[((r + 1) % t) * t + c] - v,
          d = ut(0.62 + (i * 0.6 - s * 0.8) * 2.4 + (v - 0.5) * 0.4, 0, 1);
        ((o[h] = o[h + 1] = o[h + 2] = d * 255), (o[h + 3] = 255));
      }
    n.putImageData(a, 0, 0);
    const u = new THREE.CanvasTexture(e);
    return (
      (u.wrapS = u.wrapT = THREE.RepeatWrapping),
      (u.anisotropy = pe),
      (u.colorSpace = THREE.NoColorSpace),
      (u.userData.shared = !0),
      (Vo = u)
    );
  }
  function* Mr(t) {
    const e = t.track,
      n = e.size || 2048,
      a = n / 2048,
      o = n / 2,
      l = new THREE.DataTexture(new Uint8Array(e.tex.buffer.slice(0)), n, n, THREE.RGBAFormat);
    ((l.magFilter = THREE.LinearFilter),
      (l.minFilter = THREE.LinearMipmapLinearFilter),
      (l.generateMipmaps = !0),
      (l.anisotropy = pe),
      (l.needsUpdate = !0),
      (t.groundTex = l));
    const f = yield* yr(),
      u = new THREE.PlaneGeometry(n, n, 1, 1);
    (u.rotateX(-Math.PI / 2), u.translate(n / 2, 0, n / 2));
    const r = u.attributes.uv;
    for (let H = 0; H < r.count; H++) r.setY(H, 1 - r.getY(H));
    const c = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uMap: { value: l }, uDet: { value: f }, uSun: { value: null }, uLM: { value: t.lightMap } },
      ]),
      vertexShader: `varying vec2 vUv; varying vec3 vW; ${Tt} void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader:
        _a +
        `uniform sampler2D uMap; uniform sampler2D uDet; uniform vec3 uSun; uniform sampler2D uLM; varying vec2 vUv; varying vec3 vW;
        #include <fog_pars_fragment>
        void main(){ vec3 c = texture2D(uMap, vUv).rgb;
          float l = max(c.r, max(c.g, c.b)), sat = length(c - vec3(dot(c, vec3(0.333))));
          float lit = max(smoothstep(0.55, 0.9, l), smoothstep(0.12, 0.3, sat) * smoothstep(0.25, 0.55, l));   // painted lamps / light strips
          float d1 = texture2D(uDet, vW.xz / 41.0).r, d2 = texture2D(uDet, vW.xz / 9.0).r;
          float grain = (0.72 + 0.56 * d1) * (0.86 + 0.28 * d2);
          vec3 LM = texture2D(uLM, vUv).rgb * 1.9;
          vec3 night = vec3(0.26, 0.29, 0.36) + LM;                       // Earthshine + interior ambient + floodlight pools
          vec3 col = mix(c * grain * night, c * (1.0 + lit * 1.6), lit);
          float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)) * ${n}.0;
          vec3 rg = regoAlb(vW.xz) * grain * (vec3(0.2, 0.23, 0.3) + LM);
          col = mix(rg, col, smoothstep(8.0, 140.0, edge));
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
      fog: !0,
    });
    c.uniforms.uSun = ot.sun;
    const h = new THREE.Mesh(u, c);
    ((h.renderOrder = 2), t.group.add(h));
    const v = [0, 900, 1300, 1460, 1540];
    for (let H = 1620; H < 9800; H *= 1.075) v.push(H);
    const i = 288,
      s = $t(99),
      d = [];
    for (let H = 0; H < 16; H++) {
      const U = s() * X,
        E = 1900 + s() * 4200;
      d.push([1024 + Math.cos(U) * E, 1024 + Math.sin(U) * E, 80 + s() * s() * 520]);
    }
    const m = v.length,
      g = new Float32Array(m * i * 3),
      p = new Float32Array(m * i * 3);
    for (let H = 0; H < m; H++)
      for (let U = 0; U < i; U++) {
        const E = (U / i) * X,
          y = 1024 + Math.cos(E) * v[H],
          T = 1024 + Math.sin(E) * v[H],
          M = (H * i + U) * 3,
          S = z0(y, T, d),
          z = Math.max(6, v[H] * 0.01),
          B = z0(y + z, T, d) - z0(y - z, T, d),
          b = z0(y, T + z, d) - z0(y, T - z, d);
        ((g[M] = o + (y - 1024) * a), (g[M + 1] = S * a), (g[M + 2] = o + (T - 1024) * a));
        const F = Math.hypot(B, 2 * z, b);
        ((p[M] = -B / F), (p[M + 1] = (2 * z) / F), (p[M + 2] = -b / F));
      }
    const w = [];
    for (let H = 0; H < m - 1; H++)
      for (let U = 0; U < i; U++) {
        const E = (U + 1) % i,
          y = H * i + U,
          T = H * i + E,
          M = (H + 1) * i + U,
          S = (H + 1) * i + E;
        w.push(y, T, M, T, S, M);
      }
    const C = new THREE.BufferGeometry();
    (C.setAttribute("position", new THREE.BufferAttribute(g, 3)),
      C.setAttribute("normal", new THREE.BufferAttribute(p, 3)),
      C.setIndex(w),
      C.computeBoundingSphere());
    const D = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uSun: { value: null }, uDet: { value: f }, uLM: { value: t.lightMap } },
      ]),
      vertexShader: `varying vec3 vW; varying vec3 vN; ${Tt} void main(){ vN = normal; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader:
        _a +
        `uniform vec3 uSun; uniform sampler2D uDet; uniform sampler2D uLM; varying vec3 vW; varying vec3 vN;
        #include <fog_pars_fragment>
        void main(){
          vec3 N = normalize(vN), S = normalize(uSun);
          float dist = length(vW - cameraPosition);
          float h = craterH(vW.xz / 120.0) * 60.0 + craterH(vW.xz / 31.0 + 17.0) * 15.0 * (1.0 - smoothstep(1500.0, 4000.0, dist));
          vec3 dpx = dFdx(vW), dpy = dFdy(vW); float dhx = dFdx(h), dhy = dFdy(h);
          vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
          vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
          N = normalize(abs(det) * N - grad * 0.9 * (1.0 - smoothstep(2500.0, 7000.0, dist) * 0.7));
          float d1 = texture2D(uDet, vW.xz / 41.0).r;
          vec3 alb = regoAlb(vW.xz) * (0.66 + 0.42 * d1) * (1.0 + clamp(h * 0.01, -0.15, 0.25));
          float ndl = max(dot(N, S), 0.0);
          vec3 col = alb * (vec3(0.55, 0.66, 1.0) * ndl * 1.35 + vec3(0.014, 0.016, 0.024) + vec3(0.025, 0.035, 0.06) * max(N.y, 0.0));   // Earthshine
          col += alb * vec3(0.05, 0.1, 0.15) * smoothstep(${(2500 * a).toFixed(1)}, ${(1250 * a).toFixed(1)}, length(vW.xz - vec2(${o.toFixed(1)})));   // dome light spill
          vec2 lu = vW.xz / ${n}.0;
          if (lu.x > 0.0 && lu.y > 0.0 && lu.x < 1.0 && lu.y < 1.0) col += alb * texture2D(uLM, lu).rgb * 1.9;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
      fog: !0,
    });
    ((D.uniforms.uSun = ot.sun), (D.extensions = { derivatives: !0 }));
    const x = new THREE.Mesh(C, D);
    ((x.frustumCulled = !1), (x.renderOrder = 1), t.group.add(x), (t.tris += w.length / 3));
  }
  const qe = { i: 0, lat: 0, f: 0, d2: 0 };
  function Wa(t, e, n, a, o) {
    const l = t.n,
      f = t.CX,
      u = t.CZ;
    let r = 0,
      c = 1e18;
    if (!(a >= 0) || a >= l) {
      for (let i = 0; i < l; i += 2) {
        const s = f[i] - e,
          d = u[i] - n,
          m = s * s + d * d;
        m < c && ((c = m), (r = i));
      }
      for (let i = -2; i <= 2; i++) {
        const s = (r + i + l) % l,
          d = f[s] - e,
          m = u[s] - n,
          g = d * d + m * m;
        g < c && ((c = g), (r = s));
      }
    } else {
      const i = a | 0;
      for (let s = -80; s <= 80; s++) {
        let d = i + s;
        d < 0 ? (d += l) : d >= l && (d -= l);
        const m = f[d] - e,
          g = u[d] - n,
          p = m * m + g * g;
        p < c && ((c = p), (r = d));
      }
      if (c > 4e4) return Wa(t, e, n, -1, o);
    }
    const h = e - f[r],
      v = n - u[r];
    return ((o.i = r), (o.lat = h * t.RX[r] + v * t.RZ[r]), (o.f = (h * t.FX[r] + v * t.FZ[r]) / t.STEP), (o.d2 = c), o);
  }
  function F0(t, e, n, a, o) {
    Wa(t, e, n, a, qe);
    const l = t.n;
    let f = qe.i,
      u = qe.f;
    (u < 0 && ((f = (f - 1 + l) % l), (u += 1)), (u = ut(u, 0, 1)));
    const r = (f - 1 + l) % l,
      c = (f + 1) % l,
      h = (f + 2) % l,
      v = Se(t.E[r], t.E[f], t.E[c], t.E[h], u),
      i = Se(t.S[r], t.S[f], t.S[c], t.S[h], u),
      s = ut(qe.lat, -(t.HW[qe.i] + kt), t.HW[qe.i] + kt);
    return (
      (o.e = v + s * i),
      (o.s = i),
      (o.g = t.G[f] + (t.G[c] - t.G[f]) * u),
      (o.i = qe.i),
      (o.lat = qe.lat),
      (o.a = (f + u) * t.STEP),
      o
    );
  }
  const Ko = { e: 0, s: 0, g: 0, i: 0, lat: 0, a: 0 };
  let La = -1;
  function Xo(t, e) {
    return pt ? (F0(pt, dt(t, 0), dt(e, 0), La, Ko), (La = Ko.i), Ko.e) : 0;
  }
  function wr() {
    const t = g0(),
      e = new THREE.MeshStandardMaterial({
        vertexColors: !0,
        roughness: 0.24,
        metalness: 0.55,
        envMap: xt,
        envMapIntensity: 1.5,
        map: t.alb,
        normalMap: t.nrm,
        normalScale: new THREE.Vector2(0.7, 0.7),
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
        emissive: 0,
      });
    return (
      (e.userData.rigV = { value: new THREE.Vector3() }),
      (e.userData.rigK = { value: 0 }),
      (e.userData.rigC = { value: new THREE.Color(0.6, 0.85, 1) }),
      (e.customProgramCacheKey = () => "shipRig"),
      (e.onBeforeCompile = (n) => {
        ((n.uniforms.uRigV = e.userData.rigV),
          (n.uniforms.uRigK = e.userData.rigK),
          (n.uniforms.uRigC = e.userData.rigC),
          (n.fragmentShader =
            `uniform vec3 uRigV; uniform float uRigK; uniform vec3 uRigC;
` +
            n.fragmentShader.replace(
              "#include <opaque_fragment>",
              `
        if (uRigK > 0.001) {
          vec3 Pv = -vViewPosition; vec3 Lr = uRigV - Pv; float dl = length(Lr); Lr /= dl; vec3 Vr = normalize(vViewPosition);
          vec3 Hr = normalize(Lr + Vr); float nl = max(dot(normal, Lr), 0.0); float spr = pow(max(dot(normal, Hr), 0.0), 70.0);
          float fall = 1.0 / (1.0 + dl * dl * 0.0025);
          outgoingLight += uRigC * uRigK * fall * (nl * diffuseColor.rgb * 0.7 + spr * 4.0);
        }
        #include <opaque_fragment>`,
            )));
      }),
      e
    );
  }
  function Er(t) {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTint: { value: new THREE.Color(1, 1, 1) }, uK: { value: Ue * 1.25 } },
      ]),
      vertexShader: `attribute vec3 color; varying vec3 vC; ${Tt}
        void main(){ vC = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `uniform vec3 uTint; uniform float uK; varying vec3 vC;
        #include <fog_pars_fragment>
        void main(){ gl_FragColor = vec4(vC * uTint * uK, 1.0);
        #include <fog_fragment>
        }`,
      side: THREE.DoubleSide,
      fog: !!t,
    });
  }
  function Zo(t, e) {
    const n = fa(t),
      a = n.ship,
      o = new THREE.Group(),
      l = wr(),
      f = Er(!e),
      u = new THREE.Color(a.glow),
      r = new THREE.ShaderMaterial({
        uniforms: { uLen: { value: 4 }, uCol: { value: u }, uTime: ot.time, uA: { value: 1 }, uSeed: { value: Math.random() * 10 } },
        vertexShader: `attribute float aT; attribute float aCore; uniform float uLen; uniform float uTime; uniform float uSeed; varying float vT; varying float vCore;
        void main(){ vT = aT; vCore = aCore; vec3 p = position;
          float fl = 0.85 + 0.15 * sin(uTime * 61.0 + uSeed) + 0.1 * sin(uTime * 37.0 + uSeed * 3.0);
          p.x -= aT * uLen * fl;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
        fragmentShader: `uniform vec3 uCol; uniform float uA; varying float vT; varying float vCore;
        void main(){ float t = vT / mix(1.0, 0.55, vCore);
          vec3 c = mix(vec3(3.0, 3.0, 3.0), uCol * 2.2, smoothstep(0.0, 0.4, t)); c = mix(c, uCol * 0.5, smoothstep(0.5, 1.0, t));
          c *= mix(1.0, 1.6, vCore);
          gl_FragColor = vec4(c * (1.0 - t) * uA, (1.0 - t) * uA); }`,
        side: THREE.DoubleSide,
      });
    p0(r);
    const c = new THREE.Mesh(n.body, l),
      h = new THREE.Mesh(n.glow, f),
      v = new THREE.Mesh(n.flame, r);
    return (
      (c.castShadow = !0),
      (c.receiveShadow = !e),
      (v.renderOrder = 11),
      o.add(c, h, v),
      (o.rotation.order = "YZX"),
      {
        id: t,
        M: n,
        group: o,
        body: c,
        glow: h,
        flame: v,
        bodyMat: l,
        glowMat: f,
        flameMat: r,
        glowCol: d0(a.glow),
        boostSm: 0,
        hint: -1,
        rigK: 0,
        rigX: 0,
        rigY: 0,
        rigZ: 0,
        prevMW: new THREE.Matrix4(),
        prevOK: !1,
      }
    );
  }
  const St = [];
  function $o(t) {
    (t.bodyMat.dispose(), t.glowMat.dispose(), t.flameMat.dispose());
  }
  function Na(t, e) {
    let n = St[t];
    return ((!n || n.id !== e) && (n && (vt.remove(n.group), $o(n)), (n = Zo(e, !1)), (St[t] = n), vt.add(n.group), (l0[t] = 0)), n);
  }
  let P0 = 0,
    D0 = 0;
  function br(t, e, n, k) {
    try {
      if (!zt || !pt) return;
      ((t = dt(t, 0)), (e = dt(e, 0)));
      const a = Xo(t, e),
        o = a + 4,
        l = j.tier.partK * (et ? ut(1.4 - Q.set(t, o, e).distanceTo(et.position) / 2500, 0.4, 1) : 1);
      if (n === "explode") {
        for (let f = 0, u = Math.ceil(26 * l); f < u; f++) {
          const r = Math.random() * X,
            c = Math.random(),
            h = 8 + Math.random() * 40;
          Ae.emit(
            t + Math.cos(r) * 3,
            o + c * 4,
            e + Math.sin(r) * 3,
            Math.cos(r) * h,
            8 + c * 30,
            Math.sin(r) * h,
            0.7 + Math.random() * 0.7,
            9 + Math.random() * 8,
            26 + Math.random() * 18,
            1,
            0.42 + Math.random() * 0.2,
            0.12,
            -6,
            1.6,
            1,
          );
        }
        for (let f = 0, u = Math.ceil(60 * l); f < u; f++) {
          const r = Math.random() * X,
            c = 60 + Math.random() * 160;
          zt.emit(
            t,
            o,
            e,
            Math.cos(r) * c,
            30 + Math.random() * 90,
            Math.sin(r) * c,
            0.6 + Math.random() * 0.8,
            1.8,
            0.5,
            1,
            0.8,
            0.4,
            160,
            0.6,
          );
        }
        zt.emit(t, o + 2, e, 0, 0, 0, 0.3, 120, 40, 1, 0.75, 0.5, 0, 0);
        for (let f = 0, u = Math.ceil(36 * l); f < u; f++)
          Ce.emit(
            t + (Math.random() - 0.5) * 10,
            o,
            e + (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 22,
            10 + Math.random() * 26,
            (Math.random() - 0.5) * 22,
            1.8 + Math.random() * 1.6,
            10,
            40,
            0.07,
            0.06,
            0.08,
            -4,
            0.8,
            0.8,
          );
        for (let f = 0, u = Math.ceil(18 * l); f < u; f++) Ie.spawn(t, o, e, a);
        if (((D0 = Math.max(D0, 1)), et)) {
          Q.set(t, o, e);
          const f = Q.distanceTo(et.position);
          P0 = Math.max(P0, ut(1 - f / 500, 0, 1) * 0.5);
        }
      } else if (n === "sparks")
        for (let f = 0; f < 40; f++) {
          const u = Math.random() * X,
            r = 40 + Math.random() * 100;
          zt.emit(
            t,
            o,
            e,
            Math.cos(u) * r,
            20 + Math.random() * 60,
            Math.sin(u) * r,
            0.25 + Math.random() * 0.4,
            1.5,
            0.4,
            1,
            0.85,
            0.4,
            160,
            1,
          );
        }
      else if (n === "dash")
        for (let f = 0; f < 56; f++) {
          const u = (f / 56) * X,
            r = 55;
          zt.emit(t, o - 2, e, Math.cos(u) * r, 8 + Math.random() * 8, Math.sin(u) * r, 0.45, 4, 1, 0.3, 0.95, 1, 0, 2);
        }
      else if (n === "firework") {
        /* aerial shell: spherical burst of glowing stars high above the track + a core flash */
        k = k || {};
        const cr = dt(k.r, 1),
          cg = dt(k.g, 0.6),
          cb = dt(k.b, 0.3),
          hy = o + dt(k.h, 110),
          cnt = Math.ceil(90 * l),
          sp = dt(k.speed, 95);
        for (let f = 0; f < cnt; f++) {
          const u = Math.random() * X,
            r = Math.acos(2 * Math.random() - 1),
            c = sp * (0.75 + Math.random() * 0.35),
            w = 0.75 + Math.random() * 0.5;
          zt.emit(
            t,
            hy,
            e,
            Math.sin(r) * Math.cos(u) * c,
            Math.cos(r) * c,
            Math.sin(r) * Math.sin(u) * c,
            1.1 + Math.random() * 0.9,
            5.5,
            0.6,
            cr * w,
            cg * w,
            cb * w,
            38,
            1.5,
          );
        }
        zt.emit(t, hy, e, 0, 0, 0, 0.35, 150, 50, cr, cg, cb, 0, 0);
      } else if (n === "confetti") {
        /* streamer shower falling across the track */
        const pal = [
          [1, 0.3, 0.75],
          [0.3, 0.9, 1],
          [1, 0.85, 0.25],
          [0.5, 1, 0.55],
          [1, 1, 1],
        ];
        for (let f = 0, u = Math.ceil(70 * l); f < u; f++) {
          const c = pal[f % pal.length],
            r = Math.random() * X,
            h = Math.random() * 46;
          zt.emit(
            t + Math.cos(r) * h,
            o + 26 + Math.random() * 30,
            e + Math.sin(r) * h,
            (Math.random() - 0.5) * 26,
            -6 - Math.random() * 10,
            (Math.random() - 0.5) * 26,
            1.6 + Math.random() * 1.6,
            2.6,
            1.6,
            c[0],
            c[1],
            c[2],
            14,
            1.2,
          );
        }
      } else if (n === "ring") {
        /* flat plasma shock ring (boost ignition / photo finish) */
        k = k || {};
        const cr = dt(k.r, 0.4),
          cg = dt(k.g, 0.9),
          cb = dt(k.b, 1),
          sp = dt(k.speed, 120);
        for (let f = 0; f < 72; f++) {
          const u = (f / 72) * X;
          zt.emit(t, o - 1, e, Math.cos(u) * sp, 3 + Math.random() * 5, Math.sin(u) * sp, 0.5, 5, 0.8, cr, cg, cb, 0, 1.6);
        }
        zt.emit(t, o + 1, e, 0, 0, 0, 0.22, 90, 20, cr, cg, cb, 0, 0);
      }
    } catch {}
  }
  function Sr(t) {
    ((b0 = t == null || t === !1 ? null : (((t | 0) % 6) + 6) % 6), (nt.showcase = b0));
  }
  function Ia() {
    ((bt = new THREE.Scene()), (Ct = new THREE.PerspectiveCamera(32, It / jt, 0.5, 2e3)));
    const t = new THREE.Mesh(
      new THREE.SphereGeometry(600, 48, 24),
      new THREE.ShaderMaterial({
        vertexShader:
          "varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `varying vec3 vD; uniform float uTime; uniform vec3 uTint;
        void main(){ vec3 d = normalize(vD); float y = d.y;
          vec3 c = mix(vec3(0.16, 0.05, 0.22), vec3(0.03, 0.02, 0.08), smoothstep(-0.05, 0.6, y));
          c = mix(c, vec3(0.02, 0.01, 0.05), smoothstep(-0.02, -0.3, y));
          float az = atan(d.z, d.x);
          float lines = smoothstep(0.985, 1.0, abs(sin(az * 18.0))) * smoothstep(0.5, 0.0, abs(y - 0.08)) * 0.4;
          float band = exp(-abs(y - 0.02) * 30.0) * 0.5;
          float sweep = smoothstep(0.97, 1.0, sin(az * 2.0 - uTime * 0.8)) * smoothstep(0.4, 0.0, abs(y - 0.1));
          c += vec3(0.9, 0.2, 0.7) * band + vec3(0.3, 0.8, 1.0) * lines * 1.5 + uTint * sweep * 0.35;
          gl_FragColor = vec4(c, 1.0); }`,
        uniforms: { uTime: ot.time, uTint: { value: new THREE.Color(3993855) } },
        side: THREE.BackSide,
        depthWrite: !1,
      }),
    );
    ((t.renderOrder = -10), bt.add(t));
    const e = document.createElement("canvas");
    e.width = e.height = 1024;
    const n = e.getContext("2d"),
      a = n.createRadialGradient(512, 512, 20, 512, 512, 512);
    (a.addColorStop(0, "rgba(30,20,60,0.42)"),
      a.addColorStop(0.6, "rgba(14,10,30,0.7)"),
      a.addColorStop(1, "rgba(6,4,14,1)"),
      (n.fillStyle = a),
      n.fillRect(0, 0, 1024, 1024),
      (n.strokeStyle = "rgba(60,240,255,0.55)"),
      (n.lineWidth = 4));
    for (const w of [240, 360, 472]) (n.beginPath(), n.arc(512, 512, w, 0, X), n.stroke());
    ((n.strokeStyle = "rgba(255,60,200,0.35)"), (n.lineWidth = 3));
    for (let w = 0; w < 36; w++) {
      const C = (w / 36) * X;
      (n.beginPath(),
        n.moveTo(512 + Math.cos(C) * 240, 512 + Math.sin(C) * 240),
        n.lineTo(512 + Math.cos(C) * 472, 512 + Math.sin(C) * 472),
        n.stroke());
    }
    n.fillStyle = "rgba(255,255,255,0.05)";
    for (let w = 0; w < 24; w++) {
      const C = (w / 24) * X;
      (n.save(), n.translate(512, 512), n.rotate(C), n.fillRect(250, -2, 100, 4), n.restore());
    }
    const o = new THREE.CanvasTexture(e);
    o.anisotropy = pe;
    const l = new THREE.Mesh(
      new THREE.CircleGeometry(60, 96).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: o, transparent: !0, depthWrite: !1 }),
    );
    ((l.renderOrder = 1), bt.add(l));
    const f = new THREE.Mesh(
      new THREE.RingGeometry(59.5, 600, 96, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 394254 }),
    );
    ((f.position.y = -0.02), bt.add(f));
    const u = new THREE.MeshBasicMaterial({ color: 3993855, transparent: !0, opacity: 1, depthWrite: !1 }),
      r = new THREE.Mesh(new THREE.RingGeometry(14.5, 15.3, 96).rotateX(-Math.PI / 2), u);
    ((r.position.y = 0.05), bt.add(r), bt.add(new THREE.HemisphereLight(9075416, 1708080, 1)));
    const c = new THREE.DirectionalLight(16773352, 2.4);
    (c.position.set(30, 50, 20), bt.add(c), (c.castShadow = !0), c.shadow.mapSize.set(1024, 1024));
    const h = c.shadow.camera;
    ((h.left = -16),
      (h.right = 16),
      (h.top = 16),
      (h.bottom = -16),
      (h.near = 20),
      (h.far = 140),
      (c.shadow.bias = -8e-4),
      (c.shadow.normalBias = 0.2));
    const v = new THREE.DirectionalLight(16727240, 1.8);
    (v.position.set(-40, 20, -30), bt.add(v));
    const i = new THREE.DirectionalLight(3993855, 1.3);
    (i.position.set(40, 10, -40), bt.add(i));
    const s = new THREE.ShadowMaterial({ opacity: 0.55, depthWrite: !1 }),
      d = new THREE.Mesh(new THREE.CircleGeometry(30, 48).rotateX(-Math.PI / 2), s);
    ((d.position.y = 0.06), (d.receiveShadow = !0), (d.renderOrder = 2), bt.add(d));
    const m = document.createElement("canvas");
    m.width = m.height = 64;
    const g = m.getContext("2d"),
      p = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    (p.addColorStop(0, "rgba(255,255,255,1)"),
      p.addColorStop(0.3, "rgba(255,255,255,0.45)"),
      p.addColorStop(1, "rgba(255,255,255,0)"),
      (g.fillStyle = p),
      g.fillRect(0, 0, 64, 64),
      (Je = new ye(0, 3, 48)),
      (Je.mesh.renderOrder = 12),
      bt.add(Je.mesh),
      (G0 = {
        dome: t,
        floor: l,
        ringM: r,
        rim: v,
        haloTex: new THREE.CanvasTexture(m),
        id: -1,
        vis: null,
        mirror: null,
        sprites: [],
        t0: 0,
        cache: {},
      }));
  }
  function Ga(t) {
    const e = G0;
    if (e.vis) {
      (bt.remove(e.vis.group), bt.remove(e.mirror.group));
      for (const a of e.sprites) bt.remove(a);
    }
    let n = e.cache[t];
    if (!n) {
      const a = Zo(t, !0),
        o = Zo(t, !0);
      ((a.body.castShadow = !0),
        (o.body.castShadow = !1),
        (o.bodyMat.envMapIntensity = 0.5),
        o.bodyMat.color.setScalar(0.42),
        (o.glowMat.uniforms.uK.value = Ue * 0.5));
      const l = [];
      for (const f of a.M.engines) {
        const u = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: e.haloTex,
            color: new THREE.Color(a.M.ship.glow).multiplyScalar(2),
            blending: THREE.AdditiveBlending,
            depthWrite: !1,
            transparent: !0,
          }),
        );
        ((u.userData.e = f), u.scale.setScalar(f[3] * 5), l.push(u));
      }
      n = e.cache[t] = { vis: a, mirror: o, sprites: l };
    }
    ((e.vis = n.vis), (e.mirror = n.mirror), (e.sprites = n.sprites), bt.add(e.vis.group, e.mirror.group));
    for (const a of e.sprites) bt.add(a);
    (e.rim.color.set(e.vis.M.ship.glow),
      e.ringM.material.color.set(e.vis.M.ship.glow).multiplyScalar(2.2),
      e.dome.material.uniforms.uTint.value.set(e.vis.M.ship.glow),
      (e.id = t),
      (e.t0 = ot.time.value));
  }
  function Rr(t) {
    bt || Ia();
    const e = G0;
    e.id !== b0 && Ga(b0);
    const n = e.vis,
      a = e.mirror,
      o = t * 0.55 + 2.2,
      l = 4.2 + Math.sin(t * 2.1) * 0.35;
    (n.group.position.set(0, l, 0),
      n.group.rotation.set(0, o, Math.sin(t * 1.3) * 0.03),
      a.group.position.set(0, -l, 0),
      a.group.rotation.set(0, o, -Math.sin(t * 1.3) * 0.03),
      a.group.scale.set(1, -1, 1));
    const f = 3 + Math.sin(t * 3) * 0.6;
    ((n.flameMat.uniforms.uLen.value = f),
      (a.flameMat.uniforms.uLen.value = f),
      (a.flameMat.uniforms.uA.value = 0.35),
      n.group.updateMatrixWorld(!0));
    for (const s of e.sprites) {
      const d = s.userData.e;
      (Q.set(d[0] - 0.3, d[1], d[2]).applyMatrix4(n.group.matrixWorld), s.position.copy(Q));
    }
    const u = ut((t - e.t0) / 0.6, 0, 1),
      r = 1 - Math.pow(1 - u, 3),
      c = (40 + (1 - r) * 30) * Math.max(1, 2.1 / (It / jt)),
      h = 0.5;
    (Ct.position.set(Math.cos(h) * c, 13 + (1 - r) * 6, Math.sin(h) * c),
      Ct.lookAt(0, 2.8, 0),
      (Ct.aspect = It / jt),
      Ct.updateProjectionMatrix(),
      Ct.updateMatrixWorld());
    const v = j.tier,
      i = t * 1.1;
    ((n.rigX = Math.cos(i) * 14),
      (n.rigY = 16),
      (n.rigZ = Math.sin(i) * 14),
      (n.rigK = v.rig ? 0.9 : 0),
      s0.set(n.rigX, n.rigY, n.rigZ).applyMatrix4(Ct.matrixWorldInverse),
      n.bodyMat.userData.rigV.value.copy(s0),
      (n.bodyMat.userData.rigK.value = n.rigK),
      (a.bodyMat.userData.rigK.value = 0),
      Je.step(0),
      v.stars > 0 && ((Yo = Ct.position.x), (Qo = Ct.position.y), (Jo = Ct.position.z), Oa(Je, n, t, 0, 40, n.rigK * 1.2)),
      Je.flush(),
      (Je.uScale.value = gt.height / (2 * Math.tan((Ct.fov * Math.PI) / 360))),
      a.group.updateMatrixWorld(!0),
      Do(n, Ct),
      Do(a, Ct),
      uo(bt, Ct, 0, 0.9),
      Uo(n),
      Uo(a));
  }
  const de = new THREE.Vector3();
  function uo(t, e, n, a) {
    const o = Jt.mode === "taa" && !!ge[0] && !!gt.depthTexture;
    if (o) {
      (e.getWorldDirection(Po),
        (pa !== e || wa.distanceToSquared(e.position) > 4900 || Po.dot(Ea) < 0.82) && (Ne = !0),
        (pa = e),
        wa.copy(e.position),
        Ea.copy(Po),
        ($0 = ($0 + 1) & 15),
        (Ho = Y0[$0 * 2]),
        (Ao = Y0[$0 * 2 + 1]),
        ya.copy(e.projectionMatrix),
        Ma.copy(e.projectionMatrixInverse));
      const u = e.projectionMatrix.elements;
      ((u[8] -= (2 * Ho) / gt.width), (u[9] -= (2 * Ao) / gt.height), e.projectionMatrixInverse.copy(e.projectionMatrix).invert());
    }
    (tt.setRenderTarget(gt), tt.setClearColor(0, 1), tt.clear(!0, !0, !1), tt.render(t, e));
    let l = gt.texture;
    (o &&
      (xa.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
      A0.uniforms.uInvVP.value.copy(xa).invert(),
      e.projectionMatrix.copy(ya),
      e.projectionMatrixInverse.copy(Ma),
      A0.uniforms.uPrevVP.value.copy(ga),
      ga.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
      (l = yn())),
      (C0 = 0));
    const f = Le.uniforms,
      fx = te.fx;
    f.uCA.value = dt(fx.ca, 0);
    f.uShock.value.set(dt(fx.shock[0], 0.5), dt(fx.shock[1], 0.5), dt(fx.shock[2], 0), dt(fx.shock[3], 0));
    f.uGrain.value = dt(fx.grain, 0);
    f.uCine.value = dt(fx.cine, 0);
    f.uBars.value = dt(fx.bars, 0);
    f.uDesat.value = dt(fx.desat, 0);
    f.uFade.value = ut(dt(fx.fade, 0), 0, 1);
    f.uExposure.value = 0.92 * dt(fx.exposure, 1);
    n = Math.min(1.6, n + dt(fx.radial, 0));
    a = a * (1 + dt(fx.bloom, 0));
    if (((f.uRadial.value = n), (f.uBloom.value = a), (f.uFlash.value = P0), t === vt)) {
      de.copy(ot.sun.value).multiplyScalar(8e3).add(e.position).project(e);
      const u = de.z < 1 && Math.abs(de.x) < 1.15 && Math.abs(de.y) < 1.15;
      (f.uSunP.value.set(de.x * 0.5 + 0.5, de.y * 0.5 + 0.5),
        (f.uSunOn.value = u ? ut(1.2 - Math.max(Math.abs(de.x), Math.abs(de.y)), 0, 1) : 0),
        (f.uRayOn = de.z < 1 ? ut(1.9 - Math.max(Math.abs(de.x), Math.abs(de.y)), 0, 1) : 0),
        (f.uStreakK = 1));
    } else ((f.uSunOn.value = 0), (f.uRayOn = 0), (f.uStreakK = 0.6));
    ba(l);
  }
  const c0 = [1, 1, 1];
  let Yo = 0,
    Qo = 0,
    Jo = 0;
  function ta(t, e, n, a, o, l, f, u, r, c, h, v) {
    let i = Yo - t,
      s = Qo - e,
      d = Jo - n;
    const m = Math.sqrt(i * i + s * s + d * d) || 1;
    ((i /= m), (s /= m), (d /= m));
    const g = a * i + o * s + l * d;
    if (g < 0.04) return 0;
    const p = 2 * g * a - i,
      w = 2 * g * o - s,
      C = 2 * g * l - d,
      D = ot.sun.value;
    let x = p * D.x + w * D.y + C * D.z;
    x = x > 0 ? Math.pow(x, 48) * 1.2 : 0;
    const H = f * 0.7 + u,
      U = Math.cos(H) * 0.94,
      E = Math.sin(H) * 0.94;
    let y = p * U + w * 0.34 + C * E;
    y = y > 0 ? Math.pow(y, 70) * 0.75 : 0;
    let T = 0;
    if (r > 0.001) {
      let S = c - t,
        z = h - e,
        B = v - n;
      const b = Math.sqrt(S * S + z * z + B * B) || 1;
      ((T = (p * S + w * z + C * B) / b), (T = T > 0 ? Math.pow(T, 22) * r * 1.6 : 0));
    }
    const M = x + y + T;
    if (M > 0) {
      const S = T / M;
      ((c0[0] = 1 - 0.45 * S), (c0[1] = 0.82 + 0.06 * S), (c0[2] = 0.66 + 0.4 * S));
    }
    return M;
  }
  const qa = new THREE.Quaternion(),
    ho = new THREE.Vector3();
  function Oa(t, e, n, a, o, l) {
    const f = e.M.glints,
      u = e.group.matrixWorld;
    e.group.getWorldQuaternion(qa);
    let r = 0;
    for (let c = 0; c < f.length && t.imm < o; c += 7) {
      (Q.set(f[c], f[c + 1], f[c + 2]).applyMatrix4(u), ho.set(f[c + 3], f[c + 4], f[c + 5]).applyQuaternion(qa));
      const h = ta(Q.x, Q.y, Q.z, ho.x, ho.y, ho.z, n, a * 1.7 + c * 0.05, l, e.rigX, e.rigY, e.rigZ),
        v = 0.55 + 0.45 * Math.sin(n * 11 + c * 3.1 + a * 2.3),
        i = h * v * f[c + 6];
      if (i > 0.12) {
        const s = (2.2 + Math.min(1.5, i) * 4.5) * f[c + 6];
        (t.star(Q.x, Q.y, Q.z, s, c0[0], c0[1], c0[2], Math.min(1.2, i), n * 0.8 + c), r++);
      }
    }
    return r;
  }
  function ja(t) {
    if (!tt || S0) return;
    const e = performance.now();
    try {
      t && (!pt || pt.track !== t) && Dn(t);
      for (let o = 0; o < 6; o++) Na(Ut - 1 - (o % 2), o);
      (bt || Ia(), Ga(0));
      const n = zt.mesh.visible;
      for (const o of [zt, Ae, Ce, Kt]) ((o.mesh.visible = !0), o.mesh.geometry.setDrawRange(0, 1));
      ((Ie.mesh.visible = !0),
        (Ie.mesh.count = 1),
        (Xt.visible = !0),
        (se.visible = !0),
        (ke.visible = !0),
        ke.geometry.setDrawRange(0, 6),
        se.geometry.setDrawRange(0, 6),
        tt.compile && (tt.compile(vt, et), tt.compile(bt, Ct)),
        uo(vt, et, 0.5, 0.8),
        uo(bt, Ct, 0, 0.9));
      const a = j.tier;
      ((j.tier = je.high), (Le.uniforms.uRayOn = 1), ba(gt.texture), (j.tier = a));
      {
        const o = oe || xe(16, 16, 0, !1, THREE.UnsignedByteType);
        ((Ke.uniforms.tSrc.value = ee.texture), Ke.uniforms.uInSize.value.set(ee.width, ee.height), Gt(Ke, o), oe || o.dispose());
      }
      for (let o = Ut - 2; o < Ut; o++) St[o] && (vt.remove(St[o].group), $o(St[o]), (St[o] = null));
      ((Ie.mesh.count = 0), (Xt.visible = !1), (zt.mesh.visible = n), (G0.id = -1), (S0 = !0));
    } catch (n) {
      (console.warn("[render3d] warmup", n), (S0 = !0));
    }
    nt.warmMs = Math.round(performance.now() - e);
  }
  let ea = -1,
    f0 = 0,
    u0 = null,
    vo = null;
  const h0 = { e: 0, s: 0, g: 0, i: 0, lat: 0, a: 0 },
    oa = { e: 0, s: 0, g: 0, i: 0, lat: 0, a: 0 },
    mo = { e: 0, s: 0, g: 0, i: 0, lat: 0, a: 0 },
    me = { e: 0, s: 0, g: 0, i: 0, lat: 0, a: 0 };
  let Va = -1,
    Ka = -1,
    Xa = -1;
  const At = new THREE.Vector3(),
    Za = new THREE.Vector3();
  function Tr(t) {
    if (!tt) {
      $a();
      return;
    }
    try {
      Ar(t || {});
    } catch (e) {
      (nt.errors++, nt.errors < 3 && console.warn("[render3d] frame error", e));
    }
  }
  function $a() {
    if (!Ve) return;
    (Ve.setTransform(1, 0, 0, 1, 0, 0), Ve.clearRect(0, 0, Qt.width, Qt.height));
    const t = Qt.height / v0;
    Ve.setTransform(t, 0, 0, t, 0, 0);
  }
  function Ya(t) {
    const e = tt.info.render;
    ((nt.calls = e.calls), (nt.tris = e.triangles), (nt.mode = t), (nt.quality = j.tier.name));
  }
  function po() {
    (tt.setRenderTarget(null),
      tt.setClearColor(0, 1),
      tt.clear(),
      (nt.mode = "loading"),
      (nt.loading = ht ? (ht ? Math.min(0.99, ht.steps / Math.max(ht.steps + 4, ht.est)) : 1) : 0.99));
  }
  function Hr(t) {
    !tt || !t || ue.has(t) || (pt && pt.track === t) || (ht && ht.track === t) || Wo(t);
  }
  function Ar(t) {
    (En(), $a());
    const e = dt(t.time, performance.now() / 1e3);
    let n = ea < 0 ? 1 / 60 : e - ea;
    ((!(n >= 0) || n > 0.1) && (n = 1 / 60),
      (ea = e),
      (ot.time.value = e),
      (P0 = Math.max(0, P0 - n * 2.5)),
      tt.info.reset(),
      te.debugLockScale && gt && Math.abs(gt.width - Math.round(It * te.debugLockScale)) > 1 && Ze());
    const a = t.track;
    if ((!S0 && a && ja(a), bn(3), b0 !== null)) {
      (Rr(e), Ya("showcase"));
      return;
    }
    if (!a) return;
    if ((ht && ht.track !== a && !ue.has(a) && !(pt && pt.track === a) && za(), ht)) {
      const b = ht.track === a,
        F = Lo(b ? 9 : 3);
      if (b && !F) {
        po();
        return;
      }
    }
    if (!pt || pt.track !== a) {
      for (let F = 0; F < St.length; F++) St[F] && (vt.remove(St[F].group), $o(St[F]), (St[F] = null));
      u0 = null;
      const b = ue.get(a);
      if (b && !b.ready) {
        po();
        return;
      }
      if (b) (ue.delete(a), ue.set(a, b), No(b));
      else {
        if ((pt && (vt.remove(pt.group), (pt = null)), Wo(a), Lo(9), ht)) {
          po();
          return;
        }
        {
          const F = ue.get(a);
          if (!F.ready) {
            po();
            return;
          }
          No(F);
        }
      }
    }
    const o = pt,
      l = t.camera || {},
      f = dt(l.x, o.CX[0]),
      u = dt(l.y, o.CZ[0]),
      r = dt(l.angle, 0),
      c = dt(l.height, 26) * on,
      h = ut(dt(l.fov, 1.64), 0.5, 2.6),
      v = ut(dt(l.shake, 0), 0, 12) + D0 * 4;
    D0 = Math.max(0, D0 - n * 3);
    const i = It / jt,
      s = (2 * Math.atan(Math.tan(h / 2) / i) * 180) / Math.PI;
    if (
      ((Math.abs(et.fov - s) > 0.01 || Math.abs(et.aspect - i) > 1e-4) && ((et.fov = s), (et.aspect = i), et.updateProjectionMatrix()),
      te.debug === "overhead")
    )
      (et.up.set(0, 0, -1), et.position.set(f, 1400, u + 1), et.lookAt(f, 0, u), et.up.set(0, 1, 0));
    else if (te.cine && te.cine.on) {
      const cc = te.cine,
        cf = ut(dt(cc.fov, 40), 8, 110);
      Math.abs(et.fov - cf) > 0.01 && ((et.fov = cf), et.updateProjectionMatrix());
      const sk = v ? (Math.random() - 0.5) * v * 0.25 : 0;
      (et.position.set(dt(cc.px, f) + sk, dt(cc.py, 60) + sk * 0.6, dt(cc.pz, u)),
        At.set(dt(cc.tx, f), dt(cc.ty, 40), dt(cc.tz, u)),
        et.up.set(0, 1, 0),
        et.lookAt(At),
        cc.roll && et.rotateZ(cc.roll),
        (u0 = null));
    } else {
      const b = Math.cos(r),
        F = Math.sin(r);
      (F0(o, f, u, Va, h0),
        (Va = h0.i),
        F0(o, f + b * 52, u + F * 52, Xa, mo),
        (Xa = mo.i),
        F0(o, f + b * U0, u + F * U0, Ka, oa),
        (Ka = oa.i));
      const _ = Math.max(h0.e, mo.e - 3) + c,
        R = oa.e * 0.6 + mo.e * 0.4 + an;
      u0 === null && ((u0 = _), (vo = R));
      const A = Math.min(1, n * 9);
      ((u0 += (_ - u0) * A), (vo += (R - vo) * A));
      const N = v ? (Math.random() - 0.5) * v * 0.25 : 0,
        G = v ? (Math.random() - 0.5) * v * 0.25 : 0;
      (et.position.set(f + N, u0 + G, u - N * 0.5), At.set(f + b * U0, vo, u + F * U0));
      const L = h0.s * 0.55;
      if ((Za.set(-L * o.RX[h0.i], 1, -L * o.RZ[h0.i]).normalize(), et.up.copy(Za), et.lookAt(At), te.debugLook)) {
        const W = te.debugLook;
        (At.set(et.position.x + W[0] * 100, et.position.y + W[1] * 100, et.position.z + W[2] * 100), et.up.set(0, 1, 0), et.lookAt(At));
      }
      te.fx.roll && et.rotateZ(te.fx.roll);
    }
    (et.updateMatrixWorld(),
      Wn(o, et.position.x, et.position.y, et.position.z),
      ot.sunV.value.copy(ot.sun.value).transformDirection(et.matrixWorldInverse),
      (Yo = et.position.x),
      (Qo = et.position.y),
      (Jo = et.position.z));
    const d = et.position.x,
      m = et.position.y,
      g = et.position.z,
      p = t.ships || [];
    let w = null,
      C = 0,
      D = 0;
    const x = j.tier;
    let H = p[0];
    for (let b = 0; b < p.length; b++)
      if (p[b] && p[b].isPlayer) {
        H = p[b];
        break;
      }
    const U = H ? dt(H.x, f) : f,
      E = H ? dt(H.y, u) : u,
      y = ke.geometry.attributes.position,
      T = y.array;
    for (let b = 0; b < p.length && b < Ut; b++) {
      const F = p[b];
      if (!F) continue;
      F.isPlayer && (w = F);
      const _ = ((dt(F.shipId, dt(F.colorIdx, b)) % 6) + 6) % 6,
        R = Na(b, _),
        A = dt(F.x, 0),
        N = dt(F.y, 0);
      (F0(o, A, N, R.hint, me), (R.hint = me.i));
      const G = !!F.exploded,
        L = G ? 0.6 : dt(F.z, 4) * 0.75,
        W = dt(F.angle, 0),
        Y = -W,
        at = ut(dt(F.bank, 0), -1, 1);
      R.group.position.set(A, me.e + L, N);
      const st = me.i,
        ft = Math.cos(W) * o.FX[st] + Math.sin(W) * o.FZ[st],
        mt = Math.cos(W) * o.RX[st] + Math.sin(W) * o.RZ[st],
        Dt = Math.atan(me.g * ft + me.s * mt),
        Zt = -Math.atan(me.s * ft - me.g * mt);
      (R.group.rotation.set(Zt + (G ? 0.5 : at * 0.5), Y, Dt + (G ? 0.08 : 0)), (R.group.visible = !0));
      const P = dt(F.hitTimer, 0);
      if (G) {
        R.bodyMat.color.setRGB(0.16, 0.13, 0.13);
        const J = 0.6 + 0.4 * Math.sin(e * 23 + b);
        (R.bodyMat.emissive.setRGB(J * 1.2, J * 0.4, 0.03), (R.glow.visible = !1), (R.flame.visible = !1));
      } else {
        R.bodyMat.color.setRGB(1, 1, 1);
        const J = P > 0 ? (Math.sin(e * 60) > 0 ? Math.min(1, P * 3) * 2.5 : 0.2) : 0;
        R.bodyMat.emissive.setRGB(J, J, J);
        const Z = A - d,
          $ = N - g;
        ((R.glow.visible = !0), (R.flame.visible = Z * Z + $ * $ < 800 * 800));
        const yt = !!F.energyLow && Math.sin(e * 14) > 0;
        R.glowMat.uniforms.uTint.value.setRGB(1, yt ? 0.25 : 1, yt ? 0.25 : 1);
      }
      const V = dt(F.speed, 0);
      ((R.boostSm += ((F.boosting ? 1 : 0) - R.boostSm) * Math.min(1, n * 8)),
        (R.flameMat.uniforms.uLen.value = 1.5 + Math.min(1, V / 300) * 4 + R.boostSm * 10),
        (R.flameMat.uniforms.uA.value = 0.6 + R.boostSm * 0.35));
      const q = A - U,
        O = N - E;
      if (!(q * q + O * O < 1764) || G) {
        const J = R.M.L * 1.15,
          Z = R.M.Wh * 2.4,
          $ = 1 / (1 + L * 0.08);
        (Q.set(A, me.e + 0.12, N),
          Me.set(0, Y, 0),
          ne.setFromEuler(Me),
          re.set(J * $, 1, Z * $),
          ae.compose(Q, ne, re),
          ze.setMatrixAt(C++, ae));
      }
      (R.group.updateMatrixWorld(!0), Do(R, et));
      let K = 0;
      if (x.rig && !G) {
        let J = 1e9,
          Z = null;
        for (let $ = 0; $ < o.rigs.length; $++) {
          const yt = o.rigs[$],
            Rt = yt.x - A,
            ie = yt.z - N,
            be = Rt * Rt + ie * ie;
          be < J && ((J = be), (Z = yt));
        }
        if (Z && J < 2025) {
          const $ = (A - Z.x) * Z.rx + (N - Z.z) * Z.rz,
            yt = ut($, -Z.w, Z.w);
          ((R.rigX = Z.x + Z.rx * yt), (R.rigY = Z.wy), (R.rigZ = Z.z + Z.rz * yt));
          const Rt = Math.sqrt(J) / 45;
          ((K = Jn(Z.ph, e) * (1 - Rt) * (1 - Rt) * 1.6),
            s0.set(R.rigX, R.rigY, R.rigZ).applyMatrix4(et.matrixWorldInverse),
            R.bodyMat.userData.rigV.value.copy(s0));
        }
      }
      ((R.rigK = K), (R.bodyMat.userData.rigK.value = K));
      const lt = R.glowCol,
        it = R.M.engines,
        rt = R.group.matrixWorld;
      if (G)
        ((l0[b] = 0),
          Math.random() < 0.6 &&
            Ae.emit(
              A + (Math.random() - 0.5) * 6,
              me.e + 2,
              N + (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              8 + Math.random() * 10,
              (Math.random() - 0.5) * 6,
              0.5 + Math.random() * 0.4,
              5,
              11,
              1,
              0.42,
              0.1,
              -6,
              1,
              0.9,
            ),
          Math.random() < 0.4 &&
            Ce.emit(
              A,
              me.e + 4,
              N,
              (Math.random() - 0.5) * 4,
              12 + Math.random() * 8,
              (Math.random() - 0.5) * 4,
              2.5,
              6,
              26,
              0.06,
              0.05,
              0.07,
              -2,
              0.4,
              0.65,
            ));
      else {
        for (let Z = 0; Z < it.length; Z++) {
          const $ = it[Z];
          if (
            (R.boostSm > 0.3 &&
              Math.random() < 0.22 &&
              (Q.set($[0] - 0.4, $[1], $[2]).applyMatrix4(rt),
              At.set($[0] - 2, $[1], $[2]).applyMatrix4(rt),
              zt.emit(
                At.x,
                At.y,
                At.z,
                (At.x - Q.x) * 30 + (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                (At.z - Q.z) * 30 + (Math.random() - 0.5) * 6,
                0.12 + Math.random() * 0.12,
                $[3] * 1.7,
                0.3,
                lt[0] * 0.8,
                lt[1] * 0.8,
                lt[2] * 0.8,
                0,
                3,
              )),
            x.shimmer && D < ro && V > 30)
          ) {
            const yt = 4 + Math.min(1, V / 300) * 6 + R.boostSm * 10,
              Rt = $[3] * (1.6 + R.boostSm);
            (Q.set($[0] - 0.3, $[1], $[2]).applyMatrix4(rt), At.set($[0] - 0.3 - yt, $[1], $[2]).applyMatrix4(rt));
            let ie = At.x - Q.x,
              be = At.y - Q.y,
              Qa = At.z - Q.z;
            const Ja = d - Q.x,
              tn = m - Q.y,
              en = g - Q.z;
            let t0 = be * en - Qa * tn,
              e0 = Qa * Ja - ie * en,
              o0 = ie * tn - be * Ja;
            const aa = Math.hypot(t0, e0, o0) || 1;
            ((t0 = (t0 / aa) * Rt), (e0 = (e0 / aa) * Rt), (o0 = (o0 / aa) * Rt));
            const le = D * 12;
            ((T[le] = Q.x - t0),
              (T[le + 1] = Q.y - e0),
              (T[le + 2] = Q.z - o0),
              (T[le + 3] = At.x - t0),
              (T[le + 4] = At.y - e0),
              (T[le + 5] = At.z - o0),
              (T[le + 6] = At.x + t0),
              (T[le + 7] = At.y + e0),
              (T[le + 8] = At.z + o0),
              (T[le + 9] = Q.x + t0),
              (T[le + 10] = Q.y + e0),
              (T[le + 11] = Q.z + o0),
              D++);
          }
        }
        const J = dt(F.sparks, 0);
        if (J) {
          const Z = J > 0 ? 1 : -1;
          Q.set(R.M.L * 0.1, 0.8, R.M.Wh * 1.05 * Z).applyMatrix4(rt);
          for (let $ = 0; $ < 5; $++)
            zt.emit(
              Q.x,
              Q.y,
              Q.z,
              -Math.cos(W) * V * 0.4 + (Math.random() - 0.5) * 50,
              15 + Math.random() * 40,
              -Math.sin(W) * V * 0.4 + (Math.random() - 0.5) * 50,
              0.2 + Math.random() * 0.3,
              1.4,
              0.3,
              1,
              0.8 + Math.random() * 0.2,
              0.35,
              120,
              1,
            );
        }
        if (x.trails && ((Bo[b] += n), Bo[b] > 1 / 50)) {
          Bo[b] = 0;
          const Z = (no[b] = (no[b] + 1) % Mt);
          for (let $ = 0; $ < 2; $++) {
            const yt = R.M.tail[$] || R.M.tail[0];
            Q.set(yt[0], yt[1], yt[2]).applyMatrix4(rt);
            const Rt = ((b * 2 + $) * Mt + Z) * 3;
            ((Fe[Rt] = Q.x), (Fe[Rt + 1] = Q.y), (Fe[Rt + 2] = Q.z));
          }
          l0[b] = V > 90 ? Math.min(Mt, l0[b] + 1) : Math.max(0, l0[b] - 2);
        }
      }
    }
    for (let b = p.length; b < St.length; b++) St[b] && ((St[b].group.visible = !1), (St[b].prevOK = !1));
    ((ze.count = C),
      (ze.instanceMatrix.needsUpdate = C > 0),
      (ze.visible = C > 0),
      ke.geometry.setDrawRange(0, D * 6),
      (ke.visible = D > 0),
      D && ((y.needsUpdate = !0), (y.updateRange.offset = 0), (y.updateRange.count = D * 12)),
      wt.target.position.set(U, H ? Xo(U, E) : 40, E));
    {
      const b = ot.sun.value,
        F = Math.hypot(b.x, b.z) || 1;
      wt.position.set(U + (b.x / F) * 155, wt.target.position.y + 150, E + (b.z / F) * 155);
    }
    if ((wt.target.updateMatrixWorld(), x.trails)) {
      const b = se.geometry.attributes.position,
        F = se.geometry.attributes.aF,
        _ = b.array,
        R = F.array;
      let A = 0;
      for (let N = 0; N < Ut; N++) {
        const G = St[N] && St[N].group.visible ? l0[N] : 0;
        for (let L = 0; L < 2; L++) {
          const W = N * 2 + L;
          for (let Y = 0; Y < Mt; Y++) {
            const at = (W * Mt + Y) * 2,
              st = (((no[N] - Y) % Mt) + Mt) % Mt,
              ft = (((no[N] - Math.min(Y + 1, Mt - 1)) % Mt) + Mt) % Mt,
              mt = (W * Mt + st) * 3,
              Dt = (W * Mt + ft) * 3,
              Zt = Fe[mt],
              P = Fe[mt + 1],
              V = Fe[mt + 2];
            let q = Zt - Fe[Dt],
              O = P - Fe[Dt + 1],
              I = V - Fe[Dt + 2];
            Y >= Mt - 1 && ((q = 1), (O = 0), (I = 0));
            const K = d - Zt,
              lt = m - P,
              it = g - V;
            let rt = O * it - I * lt,
              J = I * K - q * it,
              Z = q * lt - O * K;
            const $ = Math.hypot(rt, J, Z) || 1,
              yt = Y < G ? 1 : 0,
              Rt = yt * (1 - Y / Math.max(1, G)) * 0.7,
              ie = 0.24 * yt;
            ((rt = (rt / $) * ie),
              (J = (J / $) * ie),
              (Z = (Z / $) * ie),
              (_[at * 3] = Zt - rt),
              (_[at * 3 + 1] = P - J),
              (_[at * 3 + 2] = V - Z),
              (_[at * 3 + 3] = Zt + rt),
              (_[at * 3 + 4] = P + J),
              (_[at * 3 + 5] = V + Z),
              (R[at] = Rt),
              (R[at + 1] = Rt));
          }
          G > 1 && (A = W + 1);
        }
      }
      (se.geometry.setDrawRange(0, A * (Mt - 1) * 6),
        (se.visible = A > 0),
        A &&
          ((b.needsUpdate = !0),
          (F.needsUpdate = !0),
          (b.updateRange.offset = 0),
          (b.updateRange.count = A * Mt * 6),
          (F.updateRange.offset = 0),
          (F.updateRange.count = A * Mt * 2)));
    }
    if ((zt.step(n), Ae.step(n), Ce.step(n), Ie.step(n), Kt.step(n), x.stars > 0)) {
      for (let b = 0; b < p.length && b < Ut; b++) {
        const F = p[b],
          _ = St[b];
        if (!F || !_ || F.exploded || !_.group.visible) continue;
        const R = _.group.position.x - d,
          A = _.group.position.z - g;
        R * R + A * A > 520 * 520 || Oa(Kt, _, e, b, x.stars, _.rigK);
      }
      if (o.glintPts.length) {
        const b = o.glintPts;
        for (let F = 0; F < b.length && Kt.imm < x.stars; F++) {
          const _ = b[F],
            R = _[0] - d,
            A = _[1] - m,
            N = _[2] - g,
            G = R * R + A * A + N * N;
          if (G > 1400 * 1400) continue;
          const L = ta(_[0], _[1], _[2], _[3], _[4], _[5], e, F * 0.61, 0, 0, 0, 0) * 1.4;
          if (L > 0.15) {
            const W = Math.sqrt(G);
            Kt.star(_[0], _[1], _[2], (5 + Math.min(1.5, L) * 7) * (1 + W / 500), 1, 0.95, 0.88, Math.min(1.2, L), e * 0.5 + F);
          }
        }
      }
      if (o.gantry && o.gantry.glints) {
        const b = o.gantry.x - d,
          F = o.gantry.z - g;
        if (b * b + F * F < 800 * 800) {
          const _ = o.gantry.glints;
          for (let R = 0; R < _.length && Kt.imm < x.stars; R++) {
            const A = _[R],
              N = Math.pow(0.5 + 0.5 * Math.sin((A[0] + A[2]) * 0.11 + A[1] * 0.25 - e * 2.4), 28),
              G = ta(A[0], A[1], A[2], A[3], A[4], A[5], e, R * 0.37, 0, 0, 0, 0) + N * 1.1;
            G > 0.15 && Kt.star(A[0], A[1], A[2], 5 + Math.min(1.5, G) * 7, 1, 0.88, 0.72, Math.min(1.2, G), e * 0.6 + R);
          }
        }
      }
    }
    for (let b = 0; b < p.length && b < Ut; b++) {
      const F = p[b],
        _ = St[b];
      if (!F || !_ || F.exploded) continue;
      const R = _.glowCol,
        A = _.M.engines,
        N = _.group.matrixWorld;
      for (let G = 0; G < A.length; G++) {
        const L = A[G];
        (Q.set(L[0] - 0.4, L[1], L[2]).applyMatrix4(N),
          zt.glow(Q.x, Q.y, Q.z, L[3] * (3.4 + _.boostSm * 2.5), R[0], R[1], R[2], 0.42 + _.boostSm * 0.25));
      }
      for (let G = 0; G < _.M.tail.length; G++) {
        const L = _.M.tail[G];
        (Q.set(L[0], L[1], L[2]).applyMatrix4(N), zt.glow(Q.x, Q.y, Q.z, 2.2, 1, 0.12, 0.15, 0.6));
      }
    }
    if (o.gantry) {
      const b = o.gantry.lights,
        F = e % 8;
      for (let _ = 0; _ < b.length; _++) {
        const R = F < 4 && Math.floor(F) >= _ - 1 && _ < 4,
          A = F >= 4;
        zt.glow(b[_][0], b[_][1], b[_][2], 8, R ? 1 : A ? 0.2 : 0.12, R ? 0.15 : A ? 1 : 0.1, R ? 0.2 : A ? 0.45 : 0.18, 1);
      }
    }
    (zt.flush(), Ae.flush(), Ce.flush(), Kt.flush(), $e.position.copy(et.position), Ye.position.set(et.position.x, -2.5, et.position.z));
    const M = H && H.boosting ? 1 : 0;
    f0 += (M - f0) * Math.min(1, n * 5);
    const S = H ? ut(dt(H.speed, 0) / 300, 0, 1.4) : 0;
    if (((Xt.visible = f0 > 0.02), Xt.visible)) {
      const b = Xt.geometry.attributes.position,
        F = b.array,
        _ = Xt.geometry.attributes.color.array,
        R = 700 * S + 200;
      for (let A = 0; A < i0; A++) {
        ((he[A * 4 + 2] += R * he[A * 4 + 3] * n), he[A * 4 + 2] > -4 && Aa(A, !1));
        const N = he[A * 4],
          G = he[A * 4 + 1],
          L = he[A * 4 + 2],
          W = 10 + 26 * S * he[A * 4 + 3];
        ((F[A * 6] = N), (F[A * 6 + 1] = G), (F[A * 6 + 2] = L), (F[A * 6 + 3] = N), (F[A * 6 + 4] = G), (F[A * 6 + 5] = L - W));
        const Y = f0 * 0.8;
        ((_[A * 6 + 3] = 0.9 * Y), (_[A * 6 + 4] = 1.3 * Y), (_[A * 6 + 5] = 1.6 * Y));
      }
      ((b.needsUpdate = !0), (Xt.geometry.attributes.color.needsUpdate = !0));
    }
    const B = gt.height / (2 * Math.tan((et.fov * Math.PI) / 360));
    ((zt.uScale.value = B),
      (Ae.uScale.value = B),
      (Ce.uScale.value = B),
      (Kt.uScale.value = B),
      o.towerLightScale && (o.towerLightScale.value = o.lampScaleK ? B : (B / 400) * 0.5),
      (Co = Math.min(1, f0 + v * 0.08)),
      uo(vt, et, f0 * (0.6 + 0.4 * Math.min(1, S)), 0.6));
    for (let b = 0; b < St.length; b++) {
      const F = St[b];
      F && F.group.visible && Uo(F);
    }
    ((Co = 0),
      Ya("race"),
      (nt.glints = Kt.imm),
      (nt.particles = zt.n + Ae.n + Ce.n + Ie.n),
      (nt.buildings = o.buildings || 0),
      (nt.structTris = o.structTris || 0),
      (nt.lamps = o.lamps || 0));
  }
  ((te._dbg = {
    get scene() {
      return vt;
    },
    get camera() {
      return et;
    },
    get renderer() {
      return tt;
    },
    get built() {
      return pt;
    },
    Q: j,
  }),
    (Oe.Render = te));
})();
