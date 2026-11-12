# Plasma Grand Prix

Anti-gravity racing for the browser. Two circuits (Neon Harbor, Selene Dome), six machines, a three-chapter story with a voiced cast, a procedural soundtrack, and a renderer built for phones: tilt or touch steering, landscape, tuned for iPhone Pro Max.

Everything is generated at run time. There are no textures, models or audio files to download: geometry, materials, music and sound effects are all synthesised in code.

## Play

No build step is needed.

```sh
node tools/serve.mjs        # http://localhost:8080
```

Any static host works too. On GitHub: **Settings → Pages → Deploy from a branch → `main` / root**, then open the Pages URL on the phone and use **Share → Add to Home Screen** for a full-screen app.

Tilt steering needs HTTPS (or localhost) and the motion permission prompt on iOS.

## What is in here

| Path | What it does |
| --- | --- |
| `index.html` | Page shell, splash screen, script order |
| `src/vendor/three.r158.min.js` | three.js r158, tree-shaken (MIT) |
| `src/ships.js` | The six machines and their stats |
| `src/track.js` | Circuit generation: layout, surfaces, collision bitmap |
| `src/render3d.js` | The renderer: world building, materials, particles, TAA, FSR-style upscaling, post-processing, adaptive quality |
| `src/device.js` | Picks the quality ceiling for the device, keeps the screen awake |
| `src/physics.js` | Hover physics, AI drivers, race rules |
| `src/audio.js` | Music sequencer, synth instruments, base sound effects, player engine |
| `src/sfx2.js` | Cinema sound layer: positional rival engines with Doppler, wind, impacts, stingers, crowd, slow-motion filter |
| `src/story.js` | Cast, chapters, radio chatter, portraits |
| `src/voice.js` | Voice playback (pre-recorded files if present under `voice/`, speech synthesis otherwise) |
| `src/pilots.js` | Character development: bonds, dossiers, career rank, the PILOTS screen |
| `src/cine.js` | Cinematic director: cutscenes, camera work, lens effects |
| `src/input.js` | Tilt, touch pads, keyboard, settings storage |
| `src/hud.js`, `src/ui.js` | Race HUD and menus |
| `src/main.js` | Boot and the frame loop |
| `tools/build.mjs` | Bundles everything into one HTML file (`dist/index.html`) |

### About the source

The game was first published as a single bundled HTML file. The modules in `src/` were recovered from that bundle and pretty-printed, so the older files (`render3d.js`, `physics.js`, `audio.js`, `story.js`, `ui.js`, ...) have readable structure but short machine-generated variable names. The newer modules (`cine.js`, `sfx2.js`, `pilots.js`, `device.js`) are hand-written and commented.

## Version 3

**Cutscenes.** Every race opens with a three-shot flyover: a crane down over the grid with a title card, a low dolly past the rivals with name cards, and an orbit around your machine that settles into the chase camera. The finish is a 20% slow-motion fly-by from a trackside camera, then a hero orbit with fireworks and confetti for a podium. A wreck gets its own slow-motion orbit. Tap to skip; **Options → Cutscenes** turns them off.

**Lens and effects.** Letterbox, a filmic grade, film grain, chromatic aberration that rises with speed and boost, expanding shock rings on boost and explosions, stronger anamorphic flares on big moments, and a camera that leans into the banking.

**Tracks.** Roughly 1.6x the elevation change (crests hide the road ahead, dips open up the skyline), steeper banking, and neon speed gates every 200 m that stream past in the foreground.

**Resolution.** A new `ultra` tier renders internally at native 3x with 4096 shadow maps and full anisotropic filtering. The auto-scaler climbs to it only on devices that hold frame rate (Pro Max-class phones, iPads, desktops) and drops back if the frame time slips.

**Sound.** Rival engines are placed in stereo with Doppler shift and pass-by whooshes. Wind and hull rumble rise with speed, the boost has an afterburner, impacts ring like metal, explosions have an arena tail, and the cutscenes have their own stingers. The whole mix is filtered down during slow motion.

**Characters.** Each of the seven supporting characters has a four-stage bond with Rin that grows in a way that suits them (beat Auric, hold your line against Odo, bring NOVA home intact for Gus). New stages unlock dossier entries and new radio lines, so the cast talks to you differently as the season goes on. Rin earns licence XP and climbs seven ranks. The **Pilots** screen shows all of it.

## Controls

| | Touch | Keyboard |
| --- | --- | --- |
| Steer | Tilt the phone, or the arrow pads | ← → |
| Accelerate / brake | ACCEL / BRAKE | ↑ or X / ↓ or Z |
| Lean (sharper turn) | Tilt further, or hold a pad | A / S |
| Boost | BOOST | Space |
| Pause | ⏸ | Esc or P |

## Debug

- `?tier=low|medium|high|ultra` caps the quality tier.
- `window.__r3d` holds live renderer stats (fps, internal and output resolution, tier, draw calls).
- `window.__pgp` exposes the running game (`startRace`, `startStory`, `game`, `pause`, `quit`).

## Build a single file

```sh
npm install        # only needed for --minify
npm run build      # dist/index.html, readable
npm run build:min  # dist/index.html, minified
```
