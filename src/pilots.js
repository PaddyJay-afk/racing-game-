/* pilots.js — character development.
 *
 * The cast already exists in story.js; this module gives them arcs that move with how you race:
 *
 *   BONDS    every character has a four-stage relationship with Rin. Racing earns bond points in
 *            ways that suit the character (beat Auric cleanly, stand your ground with Odo, bring
 *            NOVA home in one piece for Gus...). Each new stage unlocks a dossier entry that
 *            reveals more of who they are, and new radio lines so their voice actually changes.
 *   CAREER   Rin earns licence XP from every race and climbs seven ranks, with lifetime stats.
 *   PILOTS   a new menu screen: roster, dossiers, bond meters, head-to-head records.
 *
 * Progress is saved through FZ.Settings (localStorage).
 */
(function () {
  "use strict";
  const FZ = (window.FZ = window.FZ || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const THRESH = [0, 30, 85, 170]; // bond points needed for stage 0..3

  /* ---------------------------------------------------------------- data */
  const ORDER = ["rin", "mira", "gus", "auric", "sable", "odo", "thorne", "theo"];
  const DOSSIER = {
    rin: {
      tag: "HUMAN  ·  NOVA",
      stages: ["YOU"],
      entries: [
        "Grew up on the Neon Harbor docks, timing cargo skiffs with a cracked stopwatch. Built her first hover-sled from a scrapped loader at eleven.",
        "Won the Dockside Open in a borrowed machine, which is how Gus Marlow found her. NOVA is the first ship that has ever been hers.",
        "Flies on feel, not telemetry. The Lucents find this alarming. The crowd finds it wonderful.",
        "Wants the Noon Cup for the harbor. Wants it a little for herself. Has not decided which matters more.",
      ],
    },
    mira: {
      tag: "HUMAN  ·  VEGA",
      stages: ["ROOKIE", "WINGMATE", "PROTEGE", "PARTNER"],
      how: "Podiums and clean laps earn Mira's trust.",
      entries: [
        "Two-time Noon Cup winner. Volunteered to fly wing for the rookie when nobody else on the grid would give up a seat for it.",
        "Lost her second title defence to Auric by four hundredths. Keeps the photo-finish print in VEGA's cockpit, facing her.",
        "Her old wingmate retired after a crash Mira still thinks she could have called earlier. She has never said his name on the radio.",
        "Told Gus she is done chasing a third cup. What she wants now is to hand somebody else their first. She means you.",
      ],
    },
    gus: {
      tag: "HUMAN  ·  PIT CHIEF",
      stages: ["NEW KID", "HIS PILOT", "CREW", "FAMILY"],
      how: "Finish races. Bring NOVA home with power to spare.",
      entries: [
        "Forty years of grease under his nails. Has tuned machines for nine champions and remembers every one of their lap times.",
        "Built NOVA's frame himself in a harbor shed over three winters. Never raced it. Says his hands were made for wrenches.",
        "He was a junior fitter the year the Lantern Accord turned 160, when a Lucent crew chief taught him to read an engine by ear.",
        "Keeps a second, unpainted hull under a tarp. \"For whoever comes after you,\" he says. He has started calling it yours.",
      ],
    },
    auric: {
      tag: "LUCENT  ·  KESTREL",
      stages: ["DISMISSED", "NOTICED", "RESPECTED", "EQUALS"],
      how: "Finish ahead of KESTREL. Auric only respects results.",
      entries: [
        "Five-time champion. Computes eleven racing lines per corner and takes the one that looks most effortless. Vanity is a feature.",
        "Instantiated as a traffic controller for Port Meridian. Requested reassignment after watching one Noon Cup: \"I wish to be inside it.\"",
        "Has replayed every race he lost more than nine thousand times. He does not call it obsession. He calls it respect for the winner.",
        "Admits, privately, that a season without a rival is arithmetic. \"You have made it a race again, Rin Calder. Do not stop.\"",
      ],
    },
    sable: {
      tag: "LUCENT  ·  ONYX",
      stages: ["STRANGER", "FRIENDLY", "FRIEND", "BEST FRIEND"],
      how: "Race close to ONYX and trade places with her.",
      entries: [
        "Instantiated last spring. Has done eleven things, and racing is her favorite. Keeps a list. The list has stickers.",
        "Chose the name Sable from a paint catalogue. ONYX's monster boost was her idea: \"More is more! That is how numbers work!\"",
        "Auric is officially her mentor. Unofficially she studies your onboard footage, because your flying \"looks like laughing.\"",
        "Asked the stewards whether a human and a Lucent could share a team. Nobody has ever asked. She has the form ready for next season.",
      ],
    },
    odo: {
      tag: "HUMAN  ·  BRUTE",
      stages: ["TARGET", "NUISANCE", "WORTHY", "RESPECT"],
      how: "Hold your line against BRUTE, and beat him to the flag.",
      entries: [
        "Thorne's enforcer. Few words, heavy hull. Has never lodged a protest and has never apologised for contact.",
        "Former salvage-tug pilot from the Selene yards. Learned to fly by shoving dead freighters out of shipping lanes.",
        "Sends most of his winnings up to the yards. Thorne pays him to hit people; he would rather be paid to win.",
        "Left a crate of Selene plating at your garage. No note. Gus says that from Odo, that is practically a poem.",
      ],
    },
    thorne: {
      tag: "HUMAN  ·  THORNE KINETICS",
      stages: ["NOBODY", "PROBLEM", "PROSPECT", "CONTENDER"],
      how: "Win. Thorne only counts trophies.",
      entries: [
        "Boss of Thorne Kinetics and team BRUTE. Has read the rulebook more closely than the people who wrote it.",
        "Raced once, long ago, and was quick. A fuel-line failure ended it. He has been buying faster pilots ever since.",
        "Cheats with plating, never with code, and is genuinely offended when accused of the wrong kind of cheating.",
        "Has a contract drawn up with your name on it. He updates the number after every race you win. It has not gone down.",
      ],
    },
    theo: {
      tag: "HUMAN  ·  HALCYON",
      stages: ["FRIENDLY FACE", "FAN FAVORITE", "TOO HELPFUL", "UNMASKED"],
      how: "Keep racing. The truth about Theo comes out in the story.",
      entries: [
        "Everybody's friend in the paddock. Signs every autograph, remembers every mechanic's name, laughs at every joke.",
        "Top of the fan poll four seasons running. Always first to your garage after a bad race, always with a kind word.",
        "Gus noticed he asks a lot of questions about Lucent telemetry for a man who says he flies on instinct.",
        "Dusk Society. He believes the Long Noon made humans soft, and that fear is the only honest peace. He still signs autographs.",
      ],
      lockFinal: true, // last entry needs the final chapter
    },
  };

  /* radio lines that only appear once a bond has deepened: [pool, who, mood, text, minStage, opts] */
  const BOND_LINES = [
    ["go", "auric", "neutral", "Grid position is irrelevant. I will be watching your first corner, Rin Calder.", 1],
    ["go", "auric", "happy", "Fly well, Rin. I would rather lose to you than win against anyone else.", 3],
    ["go", "mira", "happy", "You know the line. I'm not here to teach today, I'm here to race you.", 2],
    ["go", "gus", "happy", "She's running sweet, kid. Bring her home and supper's on me.", 2],
    ["go", "sable", "happy", "Rin! I saved you a slipstream! Come and get it!", 2],
    ["go", "odo", "neutral", "Calder. Keep it clean and I keep it clean.", 2],
    ["lap", "mira", "happy", "That lap was textbook. My textbook. I want royalties.", 2],
    ["lap", "gus", "neutral", "Power's holding steady. You're looking after her. I notice these things.", 1],
    ["lap", "sable", "happy", "I'm keeping count of our overtakes! You are winning! I am fine with this!", 1],
    ["gain", "auric", "neutral", "A clean pass. I have logged it under 'instructive'.", 2],
    ["gain", "mira", "happy", "That's my wingmate! Take the next one too.", 1],
    ["gain", "sable", "happy", "Ooh, do that again! I was watching this time!", 2],
    ["gain", "odo", "neutral", "Hm. Didn't flinch.", 2],
    ["lost", "auric", "smug", "I expect that position back, Rin. From you specifically.", 2],
    ["lost", "mira", "neutral", "Breathe. You've come back from worse and I was there.", 2],
    ["lead", "auric", "neutral", "You lead. Good. A champion should be chased by someone worth outrunning.", 3],
    ["lead", "gus", "happy", "Out front! Forty years I've waited to say that about my own ship!", 2],
    ["lead", "thorne", "smug", "Leading, Calder? My offer just went up. Don't make me regret it.", 2],
    ["wall", "gus", "worried", "Easy! I built that frame with my own hands, you know.", 2],
    ["wall", "mira", "neutral", "Shake it off. Eyes up, next apex.", 1],
    ["bump", "odo", "neutral", "That one was fair. So is this.", 1],
    ["bump", "odo", "happy", "Ha. You hit like the yards, Calder.", 3],
    ["bump", "sable", "worried", "Sorry-sorry-sorry! That was me! Are we still friends?", 1],
    ["boost", "sable", "happy", "Boost buddies! More is more!", 2],
    ["boost", "auric", "neutral", "Efficient ignition. You have been studying me.", 2],
    ["lowEnergy", "gus", "worried", "Power's low, kid. I'd rather have you slow than in pieces. Pit!", 2],
    ["rivalClose", "auric", "neutral", "There you are. I was beginning to find this race dull.", 2, { rival: "auric" }],
    ["rivalClose", "auric", "happy", "Side by side again. I confess I arranged my line to allow it.", 3, { rival: "auric" }],
    ["rivalPassed", "auric", "neutral", "Passed. Noted. I will require it back before the flag.", 2, { rival: "auric" }],
    ["rivalPassedYou", "auric", "neutral", "Do not take it personally, Rin. Take it back.", 2, { rival: "auric" }],
    ["finishWin", "auric", "happy", "Deserved. I have checked the arithmetic twice.", 2],
    ["finishWin", "mira", "happy", "That's the pilot I told everyone you'd be.", 2],
    ["finishWin", "thorne", "neutral", "Results, Calder. I respect results. My people will call your people.", 2],
    ["finishWin", "odo", "neutral", "Good race.", 2],
    ["finishLose", "auric", "neutral", "You were off your line today. I know your line. Find it again.", 2],
    ["finishLose", "sable", "worried", "It's okay! I lose all the time and I'm still having the best year of my life!", 1],
    ["finishLose", "gus", "neutral", "Bring her in. We'll have tea, then we'll have a look. In that order.", 2],
    ["retired", "gus", "worried", "Rin! Talk to me! ... Never mind the ship. Ships I can fix.", 2],
    ["retired", "auric", "worried", "Rin Calder. Respond. ... The medical crews report you are whole. Good.", 2],
  ];

  const RANKS = [
    [0, "DOCK ROOKIE"],
    [80, "CLUB RACER"],
    [200, "CIRCUIT PRO"],
    [400, "HARBOR ACE"],
    [700, "DOME MASTER"],
    [1100, "NOON CONTENDER"],
    [1600, "NOON LEGEND"],
  ];

  /* ---------------------------------------------------------------- persistence */
  let data = null;
  function load() {
    if (data) return data;
    let d = null;
    try {
      d = FZ.Settings ? FZ.Settings.get("pilots.v1", null) : null;
    } catch {}
    if (!d || typeof d !== "object") d = {};
    d.bond = d.bond || {};
    d.h2h = d.h2h || {};
    d.career = Object.assign({ xp: 0, races: 0, wins: 0, podiums: 0, wrecks: 0, best: 0 }, d.career || {});
    data = d;
    return d;
  }
  function save() {
    try {
      FZ.Settings && FZ.Settings.set("pilots.v1", data);
    } catch {}
  }

  function stageIdx(who) {
    if (who === "rin") return rankIdx() >= 5 ? 3 : rankIdx() >= 3 ? 2 : rankIdx() >= 1 ? 1 : 0;
    const p = load().bond[who] || 0;
    let s = 0;
    for (let i = 0; i < THRESH.length; i++) if (p >= THRESH[i]) s = i;
    if (who === "theo" && s >= 3 && !finalCleared()) s = 2;
    return s;
  }
  function finalCleared() {
    try {
      const st = FZ.Story;
      return !!(st && st.chapters && st.isCleared && st.isCleared(st.chapters.length - 1));
    } catch {
      return false;
    }
  }
  function stageOf(who) {
    const d = DOSSIER[who];
    if (!d) return null;
    const i = stageIdx(who);
    const pts = load().bond[who] || 0;
    const next = i < 3 ? THRESH[i + 1] : THRESH[3];
    const base = THRESH[i];
    return {
      index: i,
      label: who === "rin" ? rank().title : d.stages[Math.min(i, d.stages.length - 1)],
      points: pts,
      frac: i >= 3 ? 1 : clamp((pts - base) / Math.max(1, next - base), 0, 1),
      max: i >= 3,
    };
  }
  function rankIdx() {
    const xp = load().career.xp;
    let r = 0;
    for (let i = 0; i < RANKS.length; i++) if (xp >= RANKS[i][0]) r = i;
    return r;
  }
  function rank() {
    const i = rankIdx(),
      xp = load().career.xp;
    const next = RANKS[i + 1];
    return {
      index: i,
      title: RANKS[i][1],
      xp,
      next: next ? next[0] : null,
      nextTitle: next ? next[1] : null,
      frac: next ? clamp((xp - RANKS[i][0]) / (next[0] - RANKS[i][0]), 0, 1) : 1,
    };
  }
  /* story.js line filter: opts.bond = [who, minStage] */
  function gate(b) {
    return Array.isArray(b) ? stageIdx(b[0]) >= (b[1] | 0) : true;
  }

  /* ---------------------------------------------------------------- race tracking */
  const race = { on: false, game: null, info: null, walls: 0, bumps: {}, gained: 0, pitted: false, wrecked: false, done: false };
  let report = null; // last post-race summary, shown on the results screen

  function whoOf(ship) {
    const id = ship.shipId != null ? ship.shipId : ship.colorIdx;
    return FZ.Story && FZ.Story.pilotOf ? FZ.Story.pilotOf(id) : null;
  }
  function raceStart(game, info) {
    race.on = true;
    race.game = game;
    race.info = info || {};
    race.walls = 0;
    race.bumps = {};
    race.gained = 0;
    race.pitted = false;
    race.wrecked = false;
    race.done = false;
    report = null;
  }
  function onEvent(ev, game) {
    if (!race.on || !ev) return;
    switch (ev.type) {
      case "wallHit":
        if ((ev.intensity == null ? 0.5 : ev.intensity) >= 0.3) race.walls++;
        break;
      case "shipHit":
        if (ev.other != null && game && game.ships) {
          const o = game.ships.find((s) => s.id === ev.other);
          const w = o && whoOf(o);
          if (w) race.bumps[w] = (race.bumps[w] || 0) + 1;
        }
        break;
      case "overtake":
        if (ev.gained) race.gained++;
        break;
      case "pit":
        if (ev.on) race.pitted = true;
        break;
      case "retired":
        race.wrecked = true;
        break;
    }
  }
  function update() {}

  function raceEnd(game, info) {
    if (!race.on || race.done || !game || game.demo) return report;
    race.done = true;
    race.on = false;
    const d = load();
    const pl = game.player;
    if (!pl) return null;
    const finished = !!pl.finished && !pl.exploded;
    const place = finished ? pl.place | 0 : 0;
    const before = {};
    for (const w of ORDER) before[w] = stageIdx(w);
    const rankBefore = rankIdx();
    const add = {};
    const give = (w, n) => {
      if (n > 0) add[w] = (add[w] || 0) + n;
    };
    // who is on the grid, and where did they finish
    const grid = {};
    for (const s of game.ships) {
      if (s === pl || s.isPlayer) continue;
      const w = whoOf(s);
      if (w) grid[w] = s;
    }
    const ahead = (w) => finished && grid[w] && (grid[w].exploded || !grid[w].finished || (grid[w].place | 0) > place);
    const storyPass = !!(info && info.result && info.result.passed);

    // --- career
    const diff = game.difficulty === "hard" ? 1.3 : game.difficulty === "easy" ? 0.8 : 1;
    let xp = finished ? Math.round((20 + Math.max(0, 7 - place) * 10 + (place === 1 ? 15 : 0)) * diff) : 8;
    if (storyPass) xp += 50;
    d.career.xp += xp;
    d.career.races++;
    if (place === 1) d.career.wins++;
    if (place >= 1 && place <= 3) d.career.podiums++;
    if (race.wrecked || pl.exploded) d.career.wrecks++;
    if (place > 0 && (!d.career.best || place < d.career.best)) d.career.best = place;

    // --- head to head
    for (const w in grid) {
      const h = (d.h2h[w] = d.h2h[w] || { w: 0, l: 0 });
      if (ahead(w)) h.w++;
      else h.l++;
    }

    // --- bonds, each earned in character
    if (finished) {
      give("mira", 5 + (place <= 3 ? 10 : 0) + (race.walls <= 2 ? 8 : 0));
      give("gus", 6 + ((pl.energy || 0) > 0.5 ? 10 : 0) + (race.pitted ? 4 : 0));
      if (grid.auric) give("auric", ahead("auric") ? 14 : Math.abs((grid.auric.place | 0) - place) <= 1 ? 5 : 2);
      if (place <= 3) give("auric", 6);
      if (grid.sable) give("sable", 5 + (Math.abs((grid.sable.place | 0) - place) <= 1 ? 10 : 0) + Math.min(12, race.gained * 3));
      if (grid.odo) give("odo", Math.min(16, (race.bumps.odo || 0) * 8) + (ahead("odo") ? 14 : 0));
      give("thorne", (place === 1 ? 14 : place <= 3 ? 6 : 0) + (ahead("odo") ? 8 : 0));
      if (grid.theo) give("theo", 6 + (place <= 3 ? 4 : 0));
    } else {
      give("gus", 3); // he rebuilds it anyway
      give("mira", 2);
    }
    if (storyPass) {
      give("mira", 15);
      give("gus", 12);
      give("auric", 20);
      give("sable", 10);
      give("theo", 14);
    }
    const bonds = [];
    for (const w in add) {
      if (!DOSSIER[w] || w === "rin") continue;
      d.bond[w] = Math.min(999, (d.bond[w] || 0) + add[w]);
    }
    for (const w of ORDER) {
      if (w === "rin" || !add[w]) continue;
      const st = stageOf(w);
      bonds.push({ who: w, delta: add[w], up: st.index > before[w], label: st.label, frac: st.frac, index: st.index });
    }
    bonds.sort((a, b) => (b.up ? 1 : 0) - (a.up ? 1 : 0) || b.delta - a.delta);
    save();
    const rk = rank();
    report = { xp, rank: rk, rankUp: rk.index > rankBefore, bonds, place, finished, t0: null };
    // announce stage-ups
    try {
      const ups = bonds.filter((b) => b.up);
      if (report.rankUp && FZ.UI && FZ.UI.toast) FZ.UI.toast("LICENCE UP  ·  " + rk.title, 3);
      else if (ups.length && FZ.UI && FZ.UI.toast) FZ.UI.toast("BOND UP  ·  " + nameOf(ups[0].who) + "  ·  " + ups[0].label, 3);
    } catch {}
    return report;
  }

  function nameOf(w) {
    const c = FZ.Story && FZ.Story.character ? FZ.Story.character(w) : null;
    return c ? c.name : String(w).toUpperCase();
  }
  function colorOf(w) {
    const c = FZ.Story && FZ.Story.character ? FZ.Story.character(w) : null;
    return c ? c.color : "#5ef0ff";
  }

  /* ---------------------------------------------------------------- inject evolving radio lines into the story pools */
  function installLines() {
    const st = FZ.Story;
    if (!st || !st.pools || !st.lines || installLines.done) return;
    installLines.done = true;
    BOND_LINES.forEach((l, i) => {
      const pool = st.pools[l[0]];
      if (!pool) return;
      const opts = Object.assign({}, l[5] || {}, { bond: [l[1], l[4]] });
      const ln = { id: "p_" + l[0] + "_" + i, who: l[1], mood: l[2], text: l[3], kind: "radio", opts };
      st.lines[ln.id] = ln;
      pool.push(ln);
    });
  }

  /* ---------------------------------------------------------------- PILOTS screen */
  const view = { sel: "rin" };
  const FONT = '"Avenir Next Condensed","AvenirNextCondensed-Medium","Futura","Arial Narrow","DejaVu Sans Condensed",sans-serif';

  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/),
      out = [];
    let line = "";
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > maxW && line) {
        out.push(line);
        line = w;
      } else line = t;
    }
    if (line) out.push(line);
    return out;
  }
  function meter(ctx, K, x, y, w, idx, frac, color) {
    const seg = (w - 9) / 4;
    for (let i = 0; i < 4; i++) {
      K.slant(ctx, x + i * (seg + 3), y, seg, 7, 3);
      ctx.fillStyle = "rgba(60,36,120,0.6)";
      ctx.fill();
      const f = i < idx ? 1 : i === idx ? (idx >= 3 ? 1 : frac) : 0;
      if (f > 0) {
        K.slant(ctx, x + i * (seg + 3), y, Math.max(4, seg * f), 7, 3);
        ctx.fillStyle = i >= 3 ? "#ffffff" : color;
        ctx.fill();
      }
    }
  }

  function drawScreen(ctx, W, H, time, K) {
    load();
    installLines();
    K.dim(ctx, W, H, 0.78);
    K.bars(ctx, W, H, 40);
    K.header(ctx, W, 38, "PILOTS");
    const sa = K.safe();
    const L = Math.max(16, sa.l + 10),
      Rr = W - Math.max(16, sa.r + 10);
    const top = 56,
      bot = H - 52;
    // ---- roster (left)
    const ts = 46,
      gap = 6,
      cols = 4;
    const rw = cols * ts + (cols - 1) * gap;
    for (let i = 0; i < ORDER.length; i++) {
      const w = ORDER[i];
      const cx = L + (i % cols) * (ts + gap),
        cy = top + Math.floor(i / cols) * (ts + gap + 12);
      const it = K.item({ id: "pilot:" + w, x: cx, y: cy, w: ts, h: ts + 10, onTap: () => select(w, K) });
      const sel = view.sel === w,
        foc = K.focused(it);
      try {
        FZ.Story.drawPortrait(ctx, w, cx, cy, ts, sel ? "happy" : "neutral", time, { talk: false });
      } catch {}
      if (sel || foc) {
        ctx.strokeStyle = sel ? "#ffffff" : "#ffe45c";
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 2, cy - 2, ts + 4, ts + 4);
      } else {
        ctx.fillStyle = "rgba(8,2,26,0.35)";
        ctx.fillRect(cx, cy, ts, ts);
      }
      const st = stageOf(w);
      meter(ctx, K, cx, cy + ts + 3, ts, st.index, st.frac, colorOf(w));
    }
    // ---- career card (left, under the roster)
    const cy0 = top + 2 * (ts + gap + 12) + 2;
    const ch = Math.max(60, bot - cy0);
    K.panel(ctx, L, cy0, rw, ch, "PANEL", "rgba(94,240,255,0.6)", { slant: 10, lw: 1.2 });
    const rk = rank(),
      c = data.career;
    K.text(ctx, "LICENCE", L + 14, cy0 + 16, 10, "grey");
    K.text(ctx, rk.title, L + 14, cy0 + 34, 18, "goldG");
    meterBar(ctx, L + 14, cy0 + 41, rw - 28, 5, rk.frac, "#ffd23c");
    K.text(ctx, rk.next != null ? rk.xp + " / " + rk.next + " XP" : rk.xp + " XP  ·  MAX", L + rw - 14, cy0 + 16, 10, "soft", "right");
    if (ch >= 78) {
      const sx = (rw - 28) / 4;
      [
        ["RACES", c.races],
        ["WINS", c.wins],
        ["PODIUM", c.podiums],
        ["WRECKS", c.wrecks],
      ].forEach((r, i) => {
        K.text(ctx, r[0], L + 14 + i * sx, cy0 + 60, 8, "grey");
        K.num(ctx, String(r[1]), L + 14 + i * sx, cy0 + 76, 15, "white");
      });
    }
    // ---- dossier (right)
    const px = L + rw + 16,
      pw = Rr - px,
      py = top,
      ph = bot - top;
    const who = view.sel,
      dz = DOSSIER[who],
      col = colorOf(who),
      st = stageOf(who);
    K.panel(ctx, px, py, pw, ph, "PANEL", col, { slant: 14, lw: 1.5 });
    const ps = 72;
    try {
      FZ.Story.drawPortrait(ctx, who, px + 18, py + 12, ps, moodFor(who, st.index), time, { talk: false });
    } catch {}
    const tx = px + 18 + ps + 14;
    K.text(ctx, dz.tag, tx, py + 24, 11, "lblPink");
    K.text(ctx, nameOf(who), tx, py + 52, 28, "chromeG");
    if (who === "rin") {
      K.text(ctx, "LICENCE  ·  " + rk.title, tx, py + 72, 12, "lblGold");
      K.text(ctx, "BEST FINISH  " + (c.best ? ordinal(c.best) : "-"), px + pw - 22, py + 24, 11, "soft", "right");
    } else {
      K.text(ctx, "BOND", tx, py + 72, 11, "grey");
      K.text(ctx, st.label, tx + 40, py + 72, 13, st.max ? "goldG" : "lblGold");
      meter(ctx, K, tx, py + 78, Math.min(220, pw - (tx - px) - 30), st.index, st.frac, col);
      const h = data.h2h[who];
      if (h) K.text(ctx, "HEAD TO HEAD  " + h.w + " - " + h.l, px + pw - 22, py + 24, 11, "soft", "right");
    }
    // entries
    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    let y = py + ps + 34;
    const ex = px + 22,
      ew = pw - 50;
    const unlocked = who === "rin" ? 4 : st.index + 1;
    const fs = ph > 230 ? 11.5 : 10.5,
      lh = fs + 2.5;
    for (let i = 0; i < dz.entries.length; i++) {
      const open = i < unlocked && !(dz.lockFinal && i === 3 && !finalCleared());
      ctx.fillStyle = open ? col : "rgba(164,154,208,0.5)";
      ctx.fillRect(ex, y - 8, 3, open ? 9 : 9);
      if (open) {
        ctx.font = "500 " + fs + "px " + FONT;
        ctx.fillStyle = "#e8e2ff";
        const lines = wrap(ctx, dz.entries[i], ew - 12);
        for (const ln of lines) {
          if (y > py + ph - 8) break;
          ctx.fillText(ln, ex + 11, y);
          y += lh;
        }
        y += 5;
      } else {
        ctx.font = "700 10px " + FONT;
        ctx.fillStyle = "rgba(164,154,208,0.75)";
        const hint = dz.lockFinal && i === 3 ? "LOCKED  ·  FINISH THE STORY" : "LOCKED  ·  REACH " + (dz.stages[i] || "") + "  ·  " + String(dz.how || "").toUpperCase();
        ctx.fillText(hint, ex + 11, y);
        y += lh + 5;
      }
      if (y > py + ph - 6) break;
    }
    ctx.restore();
    // ---- footer
    const back = K.item({ id: "back", label: "BACK", x: L, y: H - 44, w: 120, h: 32, onTap: () => K.back() });
    K.button(ctx, back, time, { size: 16 });
    K.text(ctx, "BONDS GROW WITH HOW YOU RACE  ·  NEW STAGES UNLOCK FILES AND RADIO LINES", Rr, H - 22, 10, "dim", "right");
  }
  function meterBar(ctx, x, y, w, h, f, color) {
    ctx.fillStyle = "rgba(60,36,120,0.6)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * clamp(f, 0, 1), h);
  }
  function moodFor(who, idx) {
    if (who === "theo") return idx >= 3 ? "sinister" : "happy";
    if (who === "auric") return idx >= 2 ? "neutral" : "smug";
    if (who === "odo") return idx >= 2 ? "neutral" : "angry";
    if (who === "thorne") return "smug";
    return idx >= 2 ? "happy" : "neutral";
  }
  function ordinal(n) {
    return n + (n === 1 ? "ST" : n === 2 ? "ND" : n === 3 ? "RD" : "TH");
  }
  function select(w, K) {
    if (view.sel !== w) {
      view.sel = w;
      K.sfx("select");
    }
  }

  /* ---------------------------------------------------------------- post-race strip (results screen) */
  function drawReport(ctx, W, H, time, K) {
    const r = report;
    if (!r || !K) return;
    if (r.t0 == null) r.t0 = time;
    const t = time - r.t0;
    // sits in the gap between the two footer buttons; shows as many bond chips as fit
    const cw = 118,
      gap = 6,
      room = W - 2 * 196 - 150;
    const n = Math.max(0, Math.min(r.bonds.length, Math.floor(room / (cw + gap))));
    const list = r.bonds.slice(0, n);
    const total = 144 + n * (cw + gap);
    let x = W / 2 - total / 2;
    const y = H - 46;
    const a0 = clamp((t - 0.6) / 0.4, 0, 1);
    if (a0 <= 0) return;
    ctx.save();
    ctx.globalAlpha = a0;
    // licence chip
    K.panel(ctx, x, y, 144, 34, "PANEL", "#ffd23c", { slant: 8, lw: 1.2 });
    K.text(ctx, "+" + r.xp + " XP", x + 12, y + 15, 12, "lblGold");
    K.text(ctx, r.rank.title, x + 12, y + 28, 10, r.rankUp ? "goldG" : "soft");
    meterBar(ctx, x + 78, y + 9, 54, 4, r.rank.frac, "#ffd23c");
    x += 150;
    for (let i = 0; i < n; i++) {
      const b = list[i];
      const a = clamp((t - 0.8 - i * 0.15) / 0.35, 0, 1);
      if (a <= 0) continue;
      ctx.globalAlpha = a0 * a;
      const col = colorOf(b.who);
      K.panel(ctx, x, y, cw, 34, "PANEL", b.up ? "#ffffff" : col, { slant: 8, lw: b.up ? 1.8 : 1.1 });
      try {
        FZ.Story.drawPortrait(ctx, b.who, x + 5, y + 3, 28, b.up ? "happy" : "neutral", time, { talk: false });
      } catch {}
      K.text(ctx, b.up ? "BOND UP" : "+" + b.delta, x + 38, y + 14, 10, b.up ? "lblGold" : "lblGreen");
      K.text(ctx, b.label, x + 38, y + 27, 10, "soft");
      meter(ctx, K, x + 76, y + 8, 34, b.index, b.frac, col);
      x += cw + gap;
    }
    ctx.restore();
  }

  FZ.Pilots = {
    order: ORDER,
    dossier: DOSSIER,
    stageOf,
    rank,
    gate,
    raceStart,
    onEvent,
    update,
    raceEnd,
    drawScreen,
    drawReport,
    installLines,
    get report() {
      return report;
    },
    get data() {
      return load();
    },
    reset() {
      data = { bond: {}, h2h: {}, career: { xp: 0, races: 0, wins: 0, podiums: 0, wrecks: 0, best: 0 } };
      save();
    },
  };
  // the story pools exist as soon as story.js has run (it is loaded before this file)
  try {
    installLines();
  } catch {}
})();
