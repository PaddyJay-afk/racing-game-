/* story.js */
(function () {
  "use strict";
  const q = (window.FZ = window.FZ || {}),
    Ae = {
      era: "THE LONG NOON",
      title: "NOON CUP",
      blurb:
        "Two hundred years after the Lantern Accord, humans and Lucents (artificial minds) share the Meridian Worlds in peace. Every season the Plasma Grand Prix settles the friendliest argument in the system: who flies faster, human or Lucent? The prize is the Noon Cup, and bragging rights until next year. But somebody out there believes noon cannot last forever.",
      places: {
        port_meridian: "Port Meridian: harbor city on the world of Meridian; home of the NEON HARBOR circuit.",
        selene: "Selene: Meridian's moon; the SELENE DOME circuit runs under a pressure dome in low gravity.",
      },
      terms: {
        Lucent: "a free artificial mind; citizen of the Meridian Worlds under the Lantern Accord",
        "Lantern Accord": "the founding peace between humans and Lucents, 200 years ago",
        "Long Noon": "the golden age that followed the Accord",
        "Dusk Society": "a hidden group that believes the Long Noon must end (sequel hook)",
      },
    },
    M = {
      rin: {
        id: "rin",
        name: "RIN CALDER",
        short: "RIN",
        kind: "human",
        align: "hero",
        side: "left",
        ship: 0,
        role: "NOVA pilot (you). Dock kid from Neon Harbor, first season in the Noon Cup.",
        color: "#5ef0ff",
        color2: "#f2f6ff",
        tts: { names: ["Martha", "Samantha", "Serena", "Kate"], lang: "en-GB", pitch: 1.08, rate: 1.04 },
      },
      mira: {
        id: "mira",
        name: "MIRA OKAFOR",
        short: "MIRA",
        kind: "human",
        align: "hero",
        side: "left",
        ship: 3,
        role: "VEGA pilot. Two-time Noon Cup winner, your wingmate and mentor.",
        color: "#ffd23c",
        color2: "#f2b822",
        tts: { names: ["Moira", "Karen", "Fiona"], lang: "en-IE", pitch: 0.98, rate: 1 },
      },
      gus: {
        id: "gus",
        name: "GUS MARLOW",
        short: "GUS",
        kind: "human",
        align: "hero",
        side: "left",
        ship: null,
        role: "Pit chief and engineer for team NOVA. Forty years of grease under his nails.",
        color: "#ff9a3c",
        color2: "#2a3a66",
        tts: { names: ["Arthur", "Daniel", "Oliver"], lang: "en-GB", pitch: 0.82, rate: 0.98 },
      },
      auric: {
        id: "auric",
        name: "AURIC",
        short: "AURIC",
        kind: "ai",
        align: "rival",
        side: "right",
        ship: 1,
        role: "KESTREL pilot. Lucent, five-time champion. Arrogant, precise, honorable.",
        color: "#ff5a5a",
        color2: "#ffd27a",
        tts: { names: ["Daniel", "Arthur", "Rishi"], lang: "en-GB", pitch: 0.55, rate: 0.94 },
      },
      sable: {
        id: "sable",
        name: "SABLE",
        short: "SABLE",
        kind: "ai",
        align: "rival",
        side: "right",
        ship: 5,
        role: "ONYX pilot. Lucent rookie, instantiated last spring. Curious and very excitable.",
        color: "#ff8a2a",
        color2: "#7af6ff",
        tts: { names: ["Tessa", "Karen", "Samantha"], lang: "en-ZA", pitch: 1.45, rate: 1.1 },
      },
      thorne: {
        id: "thorne",
        name: "MAGNUS THORNE",
        short: "THORNE",
        kind: "human",
        align: "villain",
        side: "right",
        ship: null,
        role: "Boss of Thorne Kinetics (team BRUTE). Bends every rule he can find.",
        color: "#ff4058",
        color2: "#1a1424",
        tts: { names: ["Daniel", "Arthur", "Aaron"], lang: "en-GB", pitch: 0.78, rate: 0.92 },
      },
      odo: {
        id: "odo",
        name: "ODO MARSH",
        short: "ODO",
        kind: "human",
        align: "villain",
        side: "right",
        ship: 2,
        role: "BRUTE pilot. Thorne's enforcer. Few words, heavy hull.",
        color: "#8cff5a",
        color2: "#1d2a18",
        tts: { names: ["Rishi", "Arthur", "Fred"], lang: "en-GB", pitch: 0.6, rate: 0.9 },
      },
      theo: {
        id: "theo",
        name: "THEO LINDQVIST",
        short: "THEO",
        kind: "human",
        align: "hidden",
        side: "right",
        ship: 4,
        role: "HALCYON pilot. Fan favorite, everybody's friend... and the hidden saboteur.",
        color: "#c49bff",
        color2: "#e9dcff",
        tts: { names: ["Rishi", "Daniel", "Aaron"], lang: "en-GB", pitch: 1.1, rate: 1.08 },
      },
    },
    ne = { 0: "rin", 1: "auric", 2: "odo", 3: "mira", 4: "theo", 5: "sable" },
    Q = ["neutral", "happy", "angry", "smug", "worried", "shock", "sinister"],
    oe = {
      go: [
        ["gus", "happy", "Lights are green! Open her up, Rin!"],
        ["mira", "neutral", "Go time. Stay on my wing through turn one."],
        ["rin", "neutral", "NOVA is go. Let's light it up."],
        ["auric", "smug", "Initiating victory. Do try to keep up."],
        ["thorne", "smug", "Fly clean, rookie. Or don't. My lawyers adore paperwork.", { ch: [1, 2] }],
        ["sable", "happy", "Racing is my favorite thing I have ever done! And I've done eleven things!"],
        ["odo", "angry", "Out of my lane, little ship."],
        ["theo", "happy", "Good luck out there, Rin! Save some speed for the rest of us!"],
        ["gus", "neutral", "And we're off! Smooth on the throttle, like I showed you."],
      ],
      lap: [
        ["gus", "happy", "Lap's in the book. Engine temps look sweet."],
        ["mira", "neutral", "Good lap. Now do it again, only faster."],
        ["gus", "happy", "Nice and smooth. Purring like a fresh-rebuilt gearbox."],
        ["rin", "neutral", "Found a better line through that last corner."],
        ["sable", "happy", "Your lap time made my cores tingle!"],
        ["auric", "smug", "A respectable lap. By human standards."],
        ["gus", "neutral", "Keep that rhythm. Don't fix what isn't broken."],
        ["mira", "neutral", "Breathe. Eyes up. Next corner."],
      ],
      finalLap: [
        ["gus", "happy", "Final lap! Give it everything she's got, Rin!"],
        ["mira", "neutral", "Last lap. This is where champions are made."],
        ["rin", "neutral", "One lap left. No holding back now."],
        ["auric", "smug", "Final lap. I have already rehearsed my victory speech."],
        ["thorne", "smug", "Final lap. Odo, you know what to do.", { ch: [1, 2] }],
        ["sable", "worried", "Last lap! I'm so nervous I could reboot!"],
        ["odo", "angry", "Last lap. Last chance to get out of my way."],
        ["gus", "happy", "White flag! Burn every drop in the tank!"],
      ],
      gain: [
        ["gus", "happy", "That's a pass! Up one!"],
        ["mira", "happy", "Clean move. Next target."],
        ["rin", "smug", "Excuse me. Coming through."],
        ["gus", "happy", "Ha! Passed him like he was parked!"],
        ["sable", "shock", "Ooh! How did you do that? Teach me!"],
        ["mira", "neutral", "Textbook. Now pull away."],
        ["rin", "happy", "See you at the finish line!"],
        ["odo", "angry", "Lucky. Won't happen twice."],
      ],
      lost: [
        ["gus", "worried", "Lost a spot. Shake it off and reel him back in."],
        ["mira", "neutral", "They got by. Stay patient. They'll make a mistake."],
        ["rin", "angry", "Not for long!"],
        ["auric", "smug", "Pardon me. I am simply more efficient."],
        ["thorne", "smug", "That's the pecking order, rookie."],
        ["odo", "smug", "Behind me. Where you belong."],
        ["sable", "worried", "Sorry! Sorry! Racing is racing!"],
        ["gus", "neutral", "Don't chase him in the corners. Get him on the straight."],
        ["theo", "happy", "Sorry, Rin! Nothing personal!", { nflag: "theoOut" }],
        ["theo", "sinister", "Nothing personal, Rin. Well. A little personal.", { flag: "theoOut" }],
      ],
      lead: [
        ["gus", "happy", "You're leading the Noon Cup! I may cry into my toolbox!"],
        ["mira", "happy", "First place! Clear air ahead. Own it."],
        ["rin", "happy", "Front of the pack. I could get used to this view."],
        ["auric", "smug", "Enjoy the lead. It is a temporary condition."],
        ["thorne", "angry", "Somebody get that rookie out of first place!"],
        ["sable", "happy", "You're winning! Is that allowed? It's wonderful!"],
      ],
      wall: [
        ["gus", "worried", "Easy! I just polished that hull!"],
        ["gus", "angry", "That dent is coming out of my weekend, Rin."],
        ["mira", "neutral", "Walls don't move. Steer around them."],
        ["rin", "worried", "Ow. Okay. Walls are real."],
        ["thorne", "smug", "Ha! Did the rookie forget how to fly?"],
        ["odo", "smug", "Hit the wall. Good."],
        ["sable", "worried", "Oof! Are you okay? That sounded crunchy!"],
        ["auric", "neutral", "Contact with barrier. Inefficient."],
        ["gus", "worried", "Shield's taking a beating. Keep her off the rails."],
        ["theo", "happy", "Ooh. That'll buff out. Probably.", { nflag: "theoOut" }],
      ],
      bump: [
        ["odo", "angry", "Move."],
        ["thorne", "smug", "That's it, Odo. Lean on them.", { ch: [1, 2] }],
        ["rin", "angry", "Hey! Watch the paint!"],
        ["gus", "worried", "Trading paint, are we? Careful."],
        ["sable", "shock", "Bumper cars! Wait. We're not supposed to do that."],
        ["mira", "neutral", "Don't get into a shoving match. Use your speed."],
        ["odo", "smug", "Heavier ship wins."],
      ],
      lowEnergy: [
        ["gus", "shock", "Shields are critical! Get to the pit strip, now!"],
        ["mira", "worried", "You're running on fumes. Pit lane, inside line."],
        ["rin", "worried", "Power's low. I need the recharge strip."],
        ["gus", "worried", "One more hit and she's scrap. Recharge, Rin!"],
        ["sable", "worried", "Your power is low! Please don't explode. I like you!"],
        ["thorne", "smug", "Running low, rookie? Shame."],
        ["auric", "neutral", "Your reserves are concerning. Recharge. I want a real contest."],
      ],
      boost: [
        ["gus", "happy", "Boost away! Hear those injectors sing!"],
        ["rin", "happy", "Punch it!"],
        ["mira", "neutral", "Good timing on that boost."],
        ["gus", "happy", "Plasma's flowing. Hang on to something!"],
        ["sable", "happy", "Zoom! That's the technical term."],
        ["rin", "neutral", "Hold together, NOVA!"],
        ["auric", "smug", "Boosting there? Interesting. Suboptimal, but interesting."],
      ],
      pit: [
        ["gus", "neutral", "Recharging. Hold her steady over the strip."],
        ["mira", "neutral", "Good call. Top up and get back out there."],
        ["rin", "neutral", "Juicing up."],
        ["gus", "happy", "Like a cold drink on a hot day. Drink up, NOVA."],
        ["sable", "happy", "The pit strip! I love the tingly feeling."],
        ["auric", "smug", "Recharging? Then I shall take the time you are losing."],
      ],
      rivalClose: [
        ["mira", "neutral", "Auric is right there. Make him work for it.", { rival: "auric" }],
        ["gus", "neutral", "KESTREL's in range. All straight-line speed. Beat him in the corners.", { rival: "auric" }],
        ["auric", "neutral", "I see you in my rear sensors, Rin Calder.", { rival: "auric" }],
        ["rin", "smug", "Got you in my sights, Auric.", { rival: "auric" }],
        ["auric", "smug", "Close enough to admire. Not close enough to pass.", { rival: "auric" }],
        ["sable", "happy", "Rin versus Auric! This is the best race ever!", { rival: "auric" }],
        ["theo", "sinister", "Come on, Rin. Catch me if you can.", { rival: "theo" }],
        ["gus", "angry", "HALCYON's right there. Don't let him slip away!", { rival: "theo" }],
        ["rin", "angry", "You're not getting away, Theo.", { rival: "theo" }],
        ["mira", "angry", "Theo's in reach. Box him in.", { rival: "theo" }],
        ["auric", "neutral", "Rin. His left flank is open. I will cover the right.", { rival: "theo" }],
        ["sable", "angry", "Get him, Rin! For all of us!", { rival: "theo" }],
      ],
      rivalPassed: [
        ["auric", "shock", "Impossible. Recalculating.", { rival: "auric" }],
        ["gus", "happy", "You passed the champ! You passed the blooming champ!", { rival: "auric" }],
        ["rin", "smug", "Sorry, Auric. The inside line was open.", { rival: "auric" }],
        ["mira", "happy", "That's how you pass a Lucent. Decisively.", { rival: "auric" }],
        ["auric", "angry", "Well played. That will not happen again.", { rival: "auric" }],
        ["sable", "happy", "You passed Auric! He's going to sulk for a week!", { rival: "auric" }],
        ["theo", "angry", "No. No! This was supposed to be my race!", { rival: "theo" }],
        ["gus", "happy", "You're past him! Leave him in your wake!", { rival: "theo" }],
        ["rin", "angry", "That one was for Auric, Theo.", { rival: "theo" }],
      ],
      rivalPassedYou: [
        ["auric", "smug", "Excuse me. The faster mind is passing.", { rival: "auric" }],
        ["mira", "neutral", "Auric's by. Tuck into his slipstream.", { rival: "auric" }],
        ["gus", "neutral", "He got you. Get your nose right up under his tail.", { rival: "auric" }],
        ["rin", "angry", "Not today, Auric.", { rival: "auric" }],
        ["auric", "smug", "There. The natural order is restored.", { rival: "auric" }],
        ["sable", "shock", "Auric's in front again! Oh, this is so exciting!", { rival: "auric" }],
        ["theo", "sinister", "Too slow, Rin. Too slow by half.", { rival: "theo" }],
        ["gus", "angry", "He's past! Don't let that weasel get away!", { rival: "theo" }],
      ],
      finishWin: [
        ["gus", "happy", "Yes! That's my pilot! Drinks are on me! Small ones."],
        ["mira", "happy", "Brilliant flying, Rin. Truly brilliant."],
        ["rin", "happy", "We did it! NOVA, you beauty!"],
        ["auric", "neutral", "Congratulations. I will be reviewing this footage. Carefully."],
        ["sable", "happy", "You did it! I'm saving this memory forever!"],
        ["thorne", "angry", "Enjoy it, Calder. It won't last."],
      ],
      finishLose: [
        ["gus", "neutral", "Not this time. We'll strip her down and come back stronger."],
        ["mira", "neutral", "Every champion has lost a race. Learn from it."],
        ["rin", "angry", "Not good enough. Again."],
        ["auric", "smug", "As predicted. Better luck in your next attempt."],
        ["thorne", "smug", "Ha! Back to the docks, rookie."],
        ["sable", "worried", "Aww. You were really good, though!"],
      ],
      retired: [
        ["gus", "shock", "She's gone! Rin, are you alright? Talk to me!"],
        ["mira", "shock", "Rin! Eject, I've got eyes on you!"],
        ["rin", "worried", "NOVA's down! I'm okay. I'm okay."],
        ["thorne", "smug", "And that is why you don't let dockhands fly."],
        ["sable", "shock", "Oh no! Rin! Somebody help Rin!"],
        ["auric", "worried", "Rin Calder? Rescue teams to the circuit, immediately."],
      ],
    },
    le = {
      go: { prio: 2, cd: 0, chance: 1 },
      lap: { prio: 1, cd: 6, chance: 0.8 },
      finalLap: { prio: 2, cd: 0, chance: 1 },
      gain: { prio: 1, cd: 6, chance: 0.75 },
      lost: { prio: 1, cd: 7, chance: 0.75 },
      lead: { prio: 2, cd: 12, chance: 1 },
      wall: { prio: 1, cd: 9, chance: 0.7 },
      bump: { prio: 1, cd: 10, chance: 0.6 },
      lowEnergy: { prio: 2, cd: 14, chance: 1 },
      boost: { prio: 1, cd: 12, chance: 0.5 },
      pit: { prio: 1, cd: 15, chance: 0.8 },
      rivalClose: { prio: 1, cd: 20, chance: 1 },
      rivalPassed: { prio: 2, cd: 10, chance: 1 },
      rivalPassedYou: { prio: 2, cd: 10, chance: 1 },
      finishWin: { prio: 2, cd: 0, chance: 1 },
      finishLose: { prio: 2, cd: 0, chance: 1 },
      retired: { prio: 2, cd: 0, chance: 1 },
    },
    O = [
      {
        id: "ch1",
        num: 1,
        title: "FIRST LIGHT",
        subtitle: "Port Meridian \xB7 Noon Cup opening round",
        track: "neon_harbor",
        laps: 3,
        difficulty: "easy",
        playerShip: 0,
        rival: "auric",
        goal: { type: "place", place: 3 },
        goalText: "FINISH IN THE TOP 3",
        briefing: [
          ["gus", "happy", "Morning, Rin. Welcome to Port Meridian, and welcome to the Noon Cup."],
          [
            "gus",
            "neutral",
            "Two hundred years of peace between humans and Lucents, and this is still how we settle arguments. Fastest ship wins.",
          ],
          ["rin", "happy", "And this year, a dock kid from Neon Harbor is on the grid."],
          ["mira", "smug", "Don't let it go to your head. I'm Mira. I'll be flying VEGA on your wing."],
          ["auric", "smug", "Ah. The human rookie. I am Auric, five-time champion. I look forward to lapping you."],
          ["sable", "happy", "And I'm Sable! I'm new! Auric says I'm not allowed to be nice to rivals. But hi!"],
          ["thorne", "smug", "Magnus Thorne, Thorne Kinetics. My pilot Odo will be keeping you... humble."],
          ["mira", "neutral", "Today's goal: finish in the top three. Prove you belong out here."],
          ["gus", "neutral", "NOVA's tuned and fuelled. Treat her kindly and she'll treat you kindly."],
        ],
        script: [
          {
            on: "lap",
            lap: 1,
            lines: [
              [
                "theo",
                "happy",
                "Theo Lindqvist here, flying HALCYON! Welcome to the big leagues, Rin. Don't mind Auric. His ego has its own gravity.",
              ],
            ],
          },
        ],
        win: [
          ["gus", "happy", "A podium in your first Noon Cup! The whole harbor is going wild!"],
          ["auric", "neutral", "Acceptable flying, Rin Calder. You may be worth computing after all."],
          ["theo", "happy", "Told you she was good! Humans one, Lucent ego zero."],
          ["gus", "worried", "Odd thing, though. Somebody left tool marks on KESTREL's rear panel. Not Auric's crew. Not mine."],
          ["mira", "neutral", "Next stop, Selene. Pack light. The gravity's low and the tempers are high."],
        ],
        lose: [
          ["mira", "neutral", "Rough start. Everybody has one. Shake it off."],
          ["gus", "neutral", "I'll tighten everything that's loose. You tighten up those racing lines. Then we go again."],
          ["auric", "smug", "Do return when you are ready. I will be here. Winning."],
        ],
      },
      {
        id: "ch2",
        num: 2,
        title: "LOW GRAVITY",
        subtitle: "Selene \xB7 the dome under the stars",
        track: "lunar_dome",
        laps: 4,
        difficulty: "normal",
        playerShip: 0,
        rival: "auric",
        goal: { type: "beat", rival: "auric" },
        goalText: "FINISH AHEAD OF AURIC (KESTREL)",
        briefing: [
          ["mira", "neutral", "Selene Dome. Half the gravity, twice the air time over the crests. Mind your landings."],
          ["auric", "angry", "Someone tampered with my ship at Neon Harbor. A human hand. I would like an explanation."],
          ["thorne", "smug", "Don't look at me, Auric. I don't need tricks to beat a calculator."],
          ["gus", "worried", "He does, actually. BRUTE is carrying ram plating this week. Illegal, but the stewards looked the other way."],
          ["odo", "angry", "Plates stay on. Stay out of my way."],
          ["sable", "worried", "Why is everyone so grumpy? We're supposed to be friends. That's the whole point of the Accord!"],
          ["theo", "neutral", "Maybe some Lucents just push their machines too hard, eh? No offense, Auric."],
          ["auric", "angry", "Some offense, Theo. Considerable offense."],
          ["mira", "neutral", "Today's goal: finish ahead of Auric. Beat the champion, and people will start listening to you."],
        ],
        script: [
          {
            on: "lap",
            lap: 1,
            lines: [
              ["auric", "worried", "My stabilizers. Someone is inside my systems. This is not a malfunction."],
              ["gus", "worried", "I'm picking up a stray signal near KESTREL. That's no glitch. That's a hand on the controls."],
            ],
          },
          { on: "lap", lap: 2, lines: [["thorne", "smug", "Odo, the rookie is getting comfortable. Fix that."]] },
          { on: "finalLap", lines: [["sable", "worried", "Auric's signal is all fuzzy! Rin, be careful. Something is wrong out here."]] },
        ],
        win: [
          ["auric", "neutral", "You beat me, Rin. Fairly. Somebody else is not playing fairly."],
          ["gus", "worried", "I traced that stray signal. It's not Thorne's gear, it's too clever for him. It came from inside the pack."],
          ["thorne", "angry", "I cheat with plating, not with code! Ask anyone!"],
          ["theo", "neutral", "Or maybe Lucent minds are getting unstable. People are starting to say it, you know."],
          ["mira", "worried", "People say a lot of things in a long noon. Somebody wants them saying that."],
          ["rin", "neutral", "Then we find out who at the final. Back to Neon Harbor."],
        ],
        lose: [
          ["auric", "smug", "As expected. The moon favors the precise."],
          ["gus", "neutral", "Low gravity is a different animal. Soften your landings and stay on the throttle."],
          ["mira", "neutral", "You were close. Close is the step before ahead. Again."],
        ],
      },
      {
        id: "ch3",
        num: 3,
        title: "HIGH NOON",
        subtitle: "Port Meridian \xB7 Noon Cup final",
        track: "neon_harbor",
        laps: 5,
        difficulty: "hard",
        playerShip: 0,
        rival: "auric",
        goal: { type: "place", place: 1 },
        goalText: "WIN THE FINAL (1ST PLACE)",
        briefing: [
          ["gus", "worried", "The Noon Cup final. The whole system is watching. And that signal is back, stronger than ever."],
          ["auric", "neutral", "Rin. I do not ask humans for help. I am asking. Someone wants a Lucent to crash in front of the worlds."],
          ["sable", "worried", "If one of us crashes into a human ship, people will be scared of us. Maybe forever."],
          ["mira", "neutral", "Then nobody crashes. We fly together, and we keep our eyes open."],
          ["thorne", "neutral", "For the record, I want to win. I don't want a war. Odo, race clean today."],
          ["odo", "neutral", "Fine. Clean."],
          ["theo", "happy", "Big day, everyone! May the best kind win, eh?"],
          ["gus", "neutral", "Goal: win the final. First place, nothing less. I'll keep hunting that signal."],
        ],
        script: [
          {
            on: "lap",
            lap: 1,
            lines: [
              ["gus", "shock", "Got a fix on the signal! It's riding along with the pack. It's HALCYON's transponder!"],
              [
                "theo",
                "sinister",
                "Clever old Gus. Yes, it's me. Somebody has to show the worlds what these minds become off the leash.",
                { setFlag: "theoOut", setRival: "theo" },
              ],
              ["auric", "angry", "You put your hands inside my mind to frame my kind. That ends now."],
            ],
          },
          {
            on: "lap",
            lap: 2,
            lines: [
              ["sable", "worried", "Theo, you were always nice to me. Was any of it real?"],
              ["theo", "sinister", "Nothing personal, Sable. Noon can't last forever. Dusk is coming."],
            ],
          },
          {
            on: "finalLap",
            lines: [
              ["auric", "neutral", "Rin. I will hold the inside line and jam his transponder. Go and win it. For both our kinds."],
              ["mira", "happy", "The gap is open! Go, Rin, go!"],
            ],
          },
        ],
        win: [
          ["gus", "happy", "She's done it! Rin Calder wins the Noon Cup! And Theo's transponder is in the stewards' hands!"],
          ["auric", "happy", "Champion. A human champion. I find I do not mind as much as I computed."],
          ["sable", "happy", "Humans and Lucents on one podium! Can we do this every year? Please?"],
          ["thorne", "neutral", "Fine flying, Calder. Thorne Kinetics might have a seat for you. Legal plating, even."],
          ["theo", "sinister", "Enjoy your noon, Rin. The Dusk Society isn't one man. It never was."],
          ["mira", "worried", "The Dusk Society. We'll deal with that tomorrow. Tonight, you won."],
          ["rin", "happy", "Tonight, we all won. Humans and Lucents, together."],
        ],
        lose: [
          ["theo", "sinister", "Too slow, Rin. The worlds saw exactly what they needed to see."],
          ["auric", "angry", "This is not over. Rin, we go again. Together."],
          ["gus", "neutral", "Back to the garage. We'll find more speed. There's always more speed."],
        ],
      },
    ],
    H = {};
  function G(e, a, t) {
    const r = a[3] || {},
      i = { id: e, who: a[0], mood: a[1] || "neutral", text: a[2], kind: t, opts: r };
    return ((H[e] = i), i);
  }
  const Y = {};
  for (const e in oe) Y[e] = oe[e].map((a, t) => G("b_" + e + "_" + t, a, "radio"));
  O.forEach((e, a) => {
    const t = "c" + (a + 1) + "_";
    ((e.index = a),
      (e.briefing = e.briefing.map((r, i) => G(t + "brief_" + i, r, "scene"))),
      (e.win = e.win.map((r, i) => G(t + "win_" + i, r, "scene"))),
      (e.lose = e.lose.map((r, i) => G(t + "lose_" + i, r, "scene"))),
      e.script.forEach((r, i) => {
        r.lines = r.lines.map((n, s) => G(t + "s" + i + "_" + s, n, "radio"));
      }),
      (e.trackName = e.track === "lunar_dome" ? "SELENE DOME" : "NEON HARBOR"),
      (e.rivalShip = M[e.rival] ? M[e.rival].ship : null),
      (e.goalShort = e.goal.type === "beat" ? "BEAT " + M[e.goal.rival].short : e.goal.place === 1 ? "WIN" : "TOP " + e.goal.place));
  });
  const o = {
    active: !1,
    ch: -1,
    chapter: null,
    free: !1,
    time: 0,
    cur: null,
    curAge: 0,
    curDur: 0,
    gapUntil: 0,
    queue: [],
    lastEv: {},
    bags: {},
    recentWho: [],
    flags: {},
    rival: null,
    game: null,
    rivalSign: 0,
    rivalArmed: !1,
    scriptDone: {},
    finished: !1,
    resultCache: null,
    rnd: 625341585,
  };
  function se() {
    let e = o.rnd;
    return ((e ^= e << 13), (e >>>= 0), (e ^= e >>> 17), (e ^= e << 5), (e >>>= 0), (o.rnd = e), e / 4294967296);
  }
  const X = () => q.Settings || { get: (e, a) => a, set: (e, a) => a },
    D = () => q.Voice || null,
    he = () => {
      try {
        return X().get("story.voice", !0) !== !1;
      } catch {
        return !0;
      }
    };
  function Pe(e) {
    const a = e.opts || {},
      t = o.chapter;
    return !(
      (a.ch && (!t || a.ch.indexOf(t.num) < 0)) ||
      (a.flag && !o.flags[a.flag]) ||
      (a.nflag && o.flags[a.nflag]) ||
      (a.rival && a.rival !== o.rival) ||
      (a.bond && q.Pilots && !q.Pilots.gate(a.bond)) ||
      (a.bond && !q.Pilots)
    );
  }
  function Ce(e) {
    const a = Y[e];
    if (!a) return null;
    const t = a.filter(Pe);
    if (!t.length) return null;
    let r = o.bags[e];
    (!r || !r.length) && (r = o.bags[e] = t.map((h) => h.id));
    let i = r.filter((h) => t.some((d) => d.id === h));
    i.length || ((r = o.bags[e] = t.map((h) => h.id)), (i = r.slice()));
    const n = o.recentWho[o.recentWho.length - 1],
      s = i.filter((h) => H[h].who !== n),
      l = s.length ? s : i,
      c = l[Math.floor(se() * l.length) % l.length];
    return (r.splice(r.indexOf(c), 1), H[c]);
  }
  function ce(e) {
    const a = D();
    let t = null;
    try {
      t = a && a.duration ? a.duration(e.id) : null;
    } catch {
      t = null;
    }
    return (t > 0 || (t = 0.7 + String(e.text).split(/\s+/).length * 0.34), t);
  }
  function z(e, a) {
    ((o.cur = { ln: e, prio: a }), (o.curAge = 0));
    const t = ce(e);
    ((o.curDur = Math.max(2.2, t + 0.7)), o.recentWho.push(e.who), o.recentWho.length > 3 && o.recentWho.shift());
    const r = e.opts || {};
    if ((r.setFlag && (o.flags[r.setFlag] = !0), r.setRival && ((o.rival = r.setRival), (o.rivalArmed = !1)), he()))
      try {
        const i = D();
        i && i.say && i.say(e.id, e.who, { interrupt: !0, priority: a, kind: e.kind });
      } catch {}
  }
  function ue(e, a, t) {
    if (!e) return !1;
    if (((t = t || {}), !!!o.cur)) return a < 2 && o.time < o.gapUntil ? !1 : (z(e, a), !0);
    if (a > o.cur.prio && !(o.cur.prio >= 3)) return (z(e, a), !0);
    if (a >= 2 || t.queue) {
      if (o.queue.length >= 4) {
        let i = -1;
        for (let n = 0; n < o.queue.length; n++) o.queue[n].prio < a && (i < 0 || o.queue[n].prio < o.queue[i].prio) && (i = n);
        if (i < 0) return !1;
        o.queue.splice(i, 1);
      }
      return (o.queue.push({ ln: e, prio: a, exp: o.time + (a >= 3 ? 30 : 4.5) }), o.queue.sort((i, n) => n.prio - i.prio), !0);
    }
    return !1;
  }
  function C(e, a) {
    const t = le[e];
    if (!t) return !1;
    const r = o.lastEv[e];
    if (!a && r != null && o.time - r < t.cd) return !1;
    if (!a && t.chance < 1 && se() > t.chance) return ((o.lastEv[e] = o.time - t.cd * 0.5), !1);
    const i = Ce(e);
    if (!i) return !1;
    const n = ue(i, t.prio);
    return (n && (o.lastEv[e] = o.time), n);
  }
  function $(e, a) {
    const t = o.chapter;
    if (!t) return !1;
    let r = !1;
    return (
      t.script.forEach((i, n) => {
        o.scriptDone[n] ||
          i.on !== e ||
          (i.lap != null && i.lap !== a) ||
          ((o.scriptDone[n] = !0), i.lines.forEach((s) => ue(s, 3, { queue: !0 })), (r = !0));
      }),
      r
    );
  }
  const Me = {},
    Ie = {
      id: "",
      speaker: "",
      name: "",
      short: "",
      text: "",
      portrait: "",
      mood: "",
      side: "left",
      ai: !1,
      color: "#fff",
      age: 0,
      dur: 0,
      kind: "",
      prio: 0,
      talking: !1,
    };
  function ee(e) {
    return (e && (e.player || (e.ships && e.ships.find((a) => a.isPlayer)))) || null;
  }
  function Re(e) {
    const a = M[o.rival];
    return !e || !e.ships || !a || a.ship == null
      ? null
      : e.ships.find((t) => (t.shipId != null ? t.shipId : t.colorIdx) === a.ship && !t.isPlayer) || null;
  }
  function fe(e) {
    const a = o.chapter,
      t = ee(e);
    if (!a || !t) return { passed: !1, place: 0 };
    const r = t.place | 0,
      i = !!t.finished && !t.exploded && (!e.phase || e.phase === "finished" || t.finished);
    let n = !1;
    if (i) {
      if (a.goal.type === "place") n = r >= 1 && r <= a.goal.place;
      else if (a.goal.type === "beat") {
        const s = M[a.goal.rival],
          l = e.ships && e.ships.find((c) => (c.shipId != null ? c.shipId : c.colorIdx) === s.ship && !c.isPlayer);
        n = !l || !!l.exploded || !l.finished || (l.place | 0) > r;
      }
    }
    return { passed: n, place: r, finished: i };
  }
  const W = { raw: void 0, out: null };
  function Oe(e) {
    const a = (i) => !!i && typeof i == "object" && !Array.isArray(i);
    a(e) || (e = {});
    const t = { v: 1, unlocked: 1, cleared: {}, best: {} };
    for (const i in e) i !== "unlocked" && i !== "cleared" && i !== "best" && i !== "v" && (t[i] = e[i]);
    const r = Math.floor(+e.unlocked);
    if ((isFinite(r) && r >= 1 && (t.unlocked = Math.min(r, O.length || r)), a(e.cleared)))
      for (const i in e.cleared) e.cleared[i] && (t.cleared[i] = !0);
    if (a(e.best))
      for (const i in e.best) {
        const n = +e.best[i];
        isFinite(n) && (t.best[i] = n);
      }
    return t;
  }
  function j(e) {
    let a = null;
    try {
      a = X().get("story.progress", null);
    } catch {
      a = null;
    }
    if (((W.out === null || W.raw !== a) && ((W.raw = a), (W.out = Oe(a))), !e)) return W.out;
    const t = W.out,
      r = { cleared: {}, best: {} };
    for (const i in t) r[i] = t[i];
    return ((r.cleared = Object.assign({}, t.cleared)), (r.best = Object.assign({}, t.best)), r);
  }
  function de(e) {
    try {
      X().set("story.progress", e);
    } catch {}
  }
  const N = {
    setting: Ae,
    cast: M,
    chapters: O,
    lines: H,
    pools: Y,
    policy: le,
    moods: Q,
    pilotOf(e) {
      return ne[e] || null;
    },
    pilotName(e) {
      const a = M[ne[e]];
      return a ? a.name : (q.SHIPS && q.SHIPS[e] && q.SHIPS[e].pilot) || "";
    },
    character(e) {
      return M[e] || null;
    },
    line(e) {
      return H[e] || null;
    },
    get active() {
      return o.active;
    },
    get chapterIndex() {
      return o.ch;
    },
    get chapter() {
      return o.chapter;
    },
    get flags() {
      return o.flags;
    },
    get rival() {
      return o.rival;
    },
    raceOptions(e) {
      const a = O[e];
      return a ? { track: a.track, laps: a.laps, rivals: 5, playerIdx: 5, playerShip: a.playerShip, difficulty: a.difficulty } : null;
    },
    briefing(e) {
      const a = O[e];
      return a ? a.briefing.slice() : [];
    },
    epilogue(e, a) {
      const t = O[e];
      return t ? (a ? t.win : t.lose).slice() : [];
    },
    start(e, a) {
      try {
        const t = O[e | 0];
        if (!t) return null;
        (N.stop(),
          (o.active = !0),
          (o.free = !1),
          (o.ch = e | 0),
          (o.chapter = t),
          (o.rival = t.rival),
          (o.flags = {}),
          (o.scriptDone = {}),
          (o.rnd = (2654435761 ^ ((a && a.seed) || Date.now() & 65535)) >>> 0 || 1));
        try {
          const r = D();
          r && r.preload && r.preload(N.chapterLineIds(e));
        } catch {}
        return t;
      } catch {
        return null;
      }
    },
    startFree(e) {
      return (
        N.stop(),
        (o.active = !0),
        (o.free = !0),
        (o.ch = -1),
        (o.chapter = null),
        (o.rival = (e && e.rival) || "auric"),
        (o.flags = {}),
        (o.scriptDone = {}),
        !0
      );
    },
    stop() {
      ((o.active = !1),
        (o.cur = null),
        (o.queue.length = 0),
        (o.time = 0),
        (o.gapUntil = 0),
        (o.lastEv = {}),
        (o.bags = {}),
        (o.recentWho = []),
        (o.game = null),
        (o.rivalSign = 0),
        (o.rivalArmed = !1),
        (o.finished = !1),
        (o.resultCache = null));
      try {
        const e = D();
        e && e.stop && e.stop();
      } catch {}
    },
    onEvent(e, a) {
      try {
        if (!o.active || !e) return;
        a && (o.game = a);
        const t = typeof e == "string" ? e : e.type;
        if (o.finished && t !== "finish" && t !== "retired") return;
        const r = ee(a);
        switch (t) {
          case "go":
            ((o.rivalArmed = !1), $("go") || C("go", !0));
            break;
          case "lap": {
            const i = e.lap | 0,
              n = (a && a.laps) || (o.chapter && o.chapter.laps) || 5;
            if (i >= n) break;
            !$("lap", i) && i !== n - 1 && C("lap");
            break;
          }
          case "finalLap":
            ($("finalLap"), C("finalLap", !0));
            break;
          case "overtake":
            e.gained ? ((e.place | 0) === 1 ? C("lead") : C("gain")) : C("lost");
            break;
          case "wallHit":
            (e.intensity == null ? 0.5 : e.intensity) >= 0.3 && C("wall");
            break;
          case "shipHit":
            (e.intensity == null ? 0.5 : e.intensity) >= 0.25 && C("bump");
            break;
          case "lowEnergy":
            e.on && C("lowEnergy");
            break;
          case "boost":
            C("boost");
            break;
          case "pit":
            e.on && r && r.energy < 0.7 && C("pit");
            break;
          case "finish": {
            if (o.finished) break;
            ((o.finished = !0), (o.queue.length = 0), (o.cur = null));
            const i = o.free ? (e.place | 0) <= 3 : fe(a).passed;
            C(i ? "finishWin" : "finishLose", !0);
            break;
          }
          case "retired":
            if (o.finished) break;
            ((o.finished = !0), (o.queue.length = 0), (o.cur = null), C("retired", !0));
            break;
        }
      } catch {}
    },
    update(e, a) {
      try {
        if (!o.active) return;
        if (
          ((e = +e || 0),
          e < 0 && (e = 0),
          e > 0.25 && (e = 0.25),
          a && (o.game = a),
          (o.time += e),
          o.cur && ((o.curAge += e), o.curAge >= o.curDur && ((o.cur = null), (o.gapUntil = o.time + 1.2))),
          !o.cur && o.queue.length)
        ) {
          for (; o.queue.length && o.queue[0].exp < o.time;) o.queue.shift();
          const i = o.queue.shift();
          i && z(i.ln, i.prio);
        }
        const t = o.game,
          r = ee(t);
        if (t && r && t.phase === "racing" && !r.finished && !r.exploded) {
          const i = Re(t);
          if (i && !i.exploded && !i.finished) {
            const n = (+i.progress || 0) - (+r.progress || 0),
              s = n > 0 ? 1 : -1;
            (o.rivalArmed
              ? s !== o.rivalSign && Math.abs(n) < 300
                ? ((o.rivalSign = s), C(s < 0 ? "rivalPassed" : "rivalPassedYou"), (o.lastEv.rivalClose = o.time))
                : (o.rivalSign = s)
              : ((o.rivalArmed = !0), (o.rivalSign = s)),
              Math.abs(n) < 90 && o.time > 6 && C("rivalClose"));
          }
        }
      } catch {}
    },
    current() {
      const e = o.cur;
      if (!e) return null;
      const a = e.ln,
        t = M[a.who] || Me,
        r = Ie;
      return (
        (r.id = a.id),
        (r.speaker = a.who),
        (r.name = t.name || a.who),
        (r.short = t.short || a.who),
        (r.text = a.text),
        (r.portrait = a.who),
        (r.mood = a.mood),
        (r.side = t.side || "left"),
        (r.ai = t.kind === "ai"),
        (r.color = t.color || "#fff"),
        (r.age = o.curAge),
        (r.dur = o.curDur),
        (r.kind = a.kind),
        (r.prio = e.prio),
        (r.talking = o.curAge < Math.max(0.8, o.curDur - 0.7)),
        r
      );
    },
    speak(e) {
      const a = typeof e == "string" ? H[e] : e;
      if (!a) return 0;
      if (he())
        try {
          const t = D();
          t && t.say && t.say(a.id, a.who, { interrupt: !0, priority: 3, kind: a.kind });
        } catch {}
      return ce(a);
    },
    hush() {
      ((o.cur = null), (o.queue.length = 0));
      try {
        const e = D();
        e && e.stop && e.stop();
      } catch {}
    },
    result(e) {
      try {
        const a = o.chapter;
        if (!a) return { passed: !1, scene: [], place: 0, chapter: null };
        if (o.resultCache && o.resultCache.game === e) return o.resultCache.r;
        const t = fe(e),
          r = {
            passed: t.passed,
            place: t.place,
            finished: t.finished,
            chapter: a.index,
            goalText: a.goalText,
            scene: (t.passed ? a.win : a.lose).slice(),
            next: t.passed && a.index + 1 < O.length ? a.index + 1 : null,
            campaignComplete: t.passed && a.index === O.length - 1,
          },
          i = j(!0);
        return (
          t.passed && ((i.cleared[a.id] = !0), (i.unlocked = Math.max(i.unlocked, Math.min(O.length, a.index + 2)))),
          t.finished && t.place > 0 && (i.best[a.id] = Math.min(i.best[a.id] || 99, t.place)),
          de(i),
          (o.resultCache = { game: e, r }),
          r
        );
      } catch {
        return { passed: !1, scene: [], place: 0, chapter: null };
      }
    },
    progress() {
      return j();
    },
    isUnlocked(e) {
      return (e | 0) < j().unlocked;
    },
    isCleared(e) {
      const a = O[e];
      return !!(a && j().cleared[a.id]);
    },
    resetProgress() {
      de({ v: 1, unlocked: 1, cleared: {}, best: {} });
    },
    chapterLineIds(e) {
      const a = O[e],
        t = [];
      a && (a.briefing.concat(a.win, a.lose).forEach((r) => t.push(r.id)), a.script.forEach((r) => r.lines.forEach((i) => t.push(i.id))));
      for (const r in Y) Y[r].forEach((i) => t.push(i.id));
      return t;
    },
    exportLines() {
      return Object.keys(H).map((e) => {
        const a = H[e];
        return { id: e, who: a.who, mood: a.mood, text: a.text, kind: a.kind, ai: M[a.who].kind === "ai" };
      });
    },
    hash: Ne,
    _state: o,
  };
  function Ne(e) {
    let a = 2166136261;
    e = String(e);
    for (let t = 0; t < e.length; t++) ((a ^= e.charCodeAt(t)), (a = Math.imul(a, 16777619) >>> 0));
    return ("0000000" + a.toString(16)).slice(-8);
  }
  function E(e, a, t, r, i, n) {
    (e.beginPath(),
      e.moveTo(a + n, t),
      e.lineTo(a + r - n, t),
      e.quadraticCurveTo(a + r, t, a + r, t + n),
      e.lineTo(a + r, t + i - n),
      e.quadraticCurveTo(a + r, t + i, a + r - n, t + i),
      e.lineTo(a + n, t + i),
      e.quadraticCurveTo(a, t + i, a, t + i - n),
      e.lineTo(a, t + n),
      e.quadraticCurveTo(a, t, a + n, t),
      e.closePath());
  }
  function K(e, a, t, r, i, n) {
    (e.beginPath(), e.ellipse(a, t, r, i, n || 0, 0, Math.PI * 2));
  }
  function u(e, a, t, r, i, n, s) {
    (K(e, a, t, r, i, s), (e.fillStyle = n), e.fill());
  }
  function g(e, a) {
    (e.beginPath(), e.moveTo(a[0], a[1]));
    for (let t = 2; t < a.length; t += 2) e.lineTo(a[t], a[t + 1]);
    e.closePath();
  }
  function L(e, a, t, r, i, n) {
    const s = e.createLinearGradient(a, t, r, i);
    return (n.forEach((l, c) => s.addColorStop(l[0], l[1])), s);
  }
  function y(e, a, t) {
    ((e.strokeStyle = a), (e.lineWidth = t), (e.lineCap = "round"), (e.lineJoin = "round"), e.stroke());
  }
  function Ee(e, a, t, r) {
    ((e.fillStyle = L(e, 0, 0, 0, 100, [
      [0, a.bg0],
      [1, a.bg1],
    ])),
      e.fillRect(0, 0, 100, 100),
      (e.globalAlpha = 0.16),
      (e.fillStyle = a.stripe));
    for (let n = -2; n < 6; n++) (g(e, [n * 26, 100, n * 26 + 12, 100, n * 26 + 52, 0, n * 26 + 40, 0]), e.fill());
    if (((e.globalAlpha = 1), r)) {
      ((e.globalAlpha = 0.18), (e.strokeStyle = a.stripe), (e.lineWidth = 0.5));
      for (let n = 5; n < 100; n += 10) (e.beginPath(), e.moveTo(n, 0), e.lineTo(n, 100), e.stroke());
      for (let n = (t * 12) % 10; n < 100; n += 10) (e.beginPath(), e.moveTo(0, n), e.lineTo(100, n), e.stroke());
      e.globalAlpha = 1;
    }
    const i = e.createRadialGradient(50, 40, 10, 50, 50, 70);
    (i.addColorStop(0, "rgba(255,255,255,0.10)"), i.addColorStop(1, "rgba(0,0,0,0.25)"), (e.fillStyle = i), e.fillRect(0, 0, 100, 100));
  }
  function x(e, a, t, r) {
    (e.beginPath(),
      e.moveTo(4, 100),
      e.bezierCurveTo(8, 82, 24, 78, 38, 76),
      e.lineTo(62, 76),
      e.bezierCurveTo(76, 78, 92, 82, 96, 100),
      e.closePath(),
      (e.fillStyle = L(e, 0, 76, 0, 100, [
        [0, a],
        [1, t],
      ])),
      e.fill(),
      r && (e.beginPath(), e.moveTo(30, 100), e.lineTo(40, 77), e.moveTo(70, 100), e.lineTo(60, 77), y(e, r, 2.4)));
  }
  function U(e, a, t) {
    ((e.fillStyle = a),
      E(e, 41, 62, 18, 18, 4),
      e.fill(),
      (e.fillStyle = t),
      (e.globalAlpha = 0.35),
      E(e, 41, 62, 18, 6, 3),
      e.fill(),
      (e.globalAlpha = 1));
  }
  function B(e, a, t, r, i) {
    const n = a.ex || 50,
      s = a.ey || 48,
      l = a.sp || 9,
      c = a.browW || 2.2,
      d = (r * 0.7 + (a.seed || 0)) % 4.2 < 0.12,
      p = t === "smug" ? 0.5 : t === "sinister" ? 0.55 : t === "angry" ? 0.3 : 0,
      m = t === "shock" ? 1.35 : 1;
    for (let w = -1; w <= 1; w += 2) {
      const T = n + w * l;
      t === "happy" && !i
        ? (e.beginPath(), e.arc(T, s + 1.2, 3.2, Math.PI * 1.1, Math.PI * 1.9), y(e, "#2a1a20", 1.6))
        : d
          ? (e.beginPath(), e.moveTo(T - 3.4, s), e.lineTo(T + 3.4, s), y(e, "#2a1a20", 1.4))
          : (u(e, T, s, 3.6 * m, 2.5 * m, "#fbf7f2"),
            u(e, T + (a.look || 0), s + 0.2, 1.8 * m, 1.9 * m, a.iris || "#3a2a1e"),
            u(e, T + (a.look || 0), s + 0.2, 0.8, 0.8, "#0a0608"),
            u(e, T + (a.look || 0) + 0.7, s - 0.6, 0.5, 0.5, "#ffffff"),
            p > 0 && ((e.fillStyle = a.lid || a.skin), e.fillRect(T - 4.4, s - 3.2, 8.8, 3.2 * p * 1.6)),
            K(e, T, s, 3.6 * m, 2.5 * m),
            y(e, "rgba(40,20,20,0.55)", 0.7));
      let I = s - 6,
        k = 0,
        A = 0;
      (t === "angry" || t === "sinister"
        ? ((k = 2.6), (A = -0.6))
        : t === "worried"
          ? ((k = -2.4), (A = 0.6))
          : t === "shock"
            ? (I -= 2.6)
            : t === "happy"
              ? (I -= 1)
              : t === "smug" && w > 0 && ((I -= 2.2), (A = -1)),
        e.beginPath(),
        e.moveTo(T - w * 1.5, I + k),
        e.quadraticCurveTo(T + w * 1.8, I - 1.2 + (k + A) / 2, T + w * 4.8, I + A),
        y(e, a.brow || "#2a1a14", c));
    }
    (e.beginPath(), e.moveTo(n - 0.5, s + 3), e.quadraticCurveTo(n + 2.6, s + 8.5, n - 1.2, s + 9.6), y(e, "rgba(60,30,20,0.45)", 1));
    const f = a.my || s + 15,
      b = i ? (0.5 + 0.5 * Math.sin(r * 19 + (a.seed || 0))) * (0.6 + 0.4 * Math.sin(r * 7.3)) : 0,
      S = a.lip || "#8a3a3a";
    if (b > 0.15 || t === "shock") {
      const w = t === "shock" ? 3.4 : 0.8 + b * 2.6;
      (u(e, n, f, t === "shock" ? 3 : 4.2, w, "#3a0f14"),
        t !== "shock" && ((e.fillStyle = "#f4f0ea"), e.fillRect(n - 3, f - w, 6, Math.min(1.2, w * 0.5))));
    } else
      t === "happy"
        ? (e.beginPath(),
          e.moveTo(n - 6, f - 1.5),
          e.quadraticCurveTo(n, f + 4.5, n + 6, f - 1.5),
          e.closePath(),
          (e.fillStyle = "#3a0f14"),
          e.fill(),
          (e.fillStyle = "#f4f0ea"),
          e.fillRect(n - 4.4, f - 1.2, 8.8, 1.4))
        : t === "smug"
          ? (e.beginPath(), e.moveTo(n - 5, f + 0.5), e.quadraticCurveTo(n + 1, f + 1.6, n + 6, f - 2.2), y(e, S, 1.5))
          : t === "sinister"
            ? (e.beginPath(),
              e.moveTo(n - 7, f - 2),
              e.quadraticCurveTo(n, f + 3.2, n + 7, f - 2),
              y(e, S, 1.5),
              e.beginPath(),
              e.moveTo(n - 5, f - 0.6),
              e.lineTo(n + 5, f - 0.6),
              y(e, "#f4f0ea", 0.8))
            : t === "angry"
              ? (e.beginPath(), e.moveTo(n - 5, f + 1), e.quadraticCurveTo(n, f - 2.2, n + 5, f + 1), y(e, S, 1.6))
              : t === "worried"
                ? (e.beginPath(),
                  e.moveTo(n - 4.5, f + 0.5),
                  e.bezierCurveTo(n - 2, f - 1.5, n + 1, f + 1.6, n + 4.5, f - 0.4),
                  y(e, S, 1.4))
                : (e.beginPath(), e.moveTo(n - 4.6, f), e.quadraticCurveTo(n, f + 1.1, n + 4.6, f), y(e, S, 1.5));
  }
  function pe(e, a, t, r, i) {
    ((e.globalAlpha = i), u(e, a - 13, t + 7, 3.5, 2, r), u(e, a + 13, t + 7, 3.5, 2, r), (e.globalAlpha = 1));
  }
  const Le = {
      rin: { bg0: "#0d3a5a", bg1: "#06142a", stripe: "#5ef0ff" },
      mira: { bg0: "#5a3a08", bg1: "#1e1204", stripe: "#ffd23c" },
      gus: { bg0: "#3a2410", bg1: "#120c08", stripe: "#ff9a3c" },
      auric: { bg0: "#4a0c14", bg1: "#140408", stripe: "#ff5a5a" },
      sable: { bg0: "#4a2408", bg1: "#120804", stripe: "#ff8a2a" },
      thorne: { bg0: "#2a0a14", bg1: "#080408", stripe: "#ff4058" },
      odo: { bg0: "#1e3a12", bg1: "#08120a", stripe: "#8cff5a" },
      theo: { bg0: "#2e1a52", bg1: "#0c0618", stripe: "#c49bff" },
    },
    ae = {
      rin(e, a, t, r) {
        (x(e, "#e8eeff", "#8ea0c8", "#2fd8ff"), (e.fillStyle = "#2fd8ff"), E(e, 34, 74, 32, 7, 3), e.fill());
        const i = "#e9b896";
        (U(e, i, "#8a5a40"),
          u(
            e,
            50,
            45,
            30,
            32,
            L(e, 20, 13, 80, 77, [
              [0, "#ffffff"],
              [0.6, "#cfd8ee"],
              [1, "#7a88a8"],
            ]),
          ),
          e.beginPath(),
          e.moveTo(26, 32),
          e.quadraticCurveTo(50, 8, 74, 32),
          y(e, "#2fd8ff", 4),
          u(e, 50, 51, 19.5, 23, "#1a1e2c"),
          u(e, 50, 52, 18, 22, i),
          (e.fillStyle = "#1a1424"),
          e.beginPath(),
          e.moveTo(32, 46),
          e.quadraticCurveTo(34, 26, 52, 28),
          e.quadraticCurveTo(66, 28, 68, 44),
          e.lineTo(64, 38),
          e.lineTo(58, 41),
          e.lineTo(54, 35),
          e.lineTo(46, 39),
          e.lineTo(40, 34),
          e.lineTo(36, 44),
          e.closePath(),
          e.fill(),
          (e.fillStyle = L(e, 0, 22, 0, 32, [
            [0, "rgba(94,240,255,0.95)"],
            [1, "rgba(20,90,140,0.9)"],
          ])),
          e.beginPath(),
          e.moveTo(28, 30),
          e.quadraticCurveTo(50, 16, 72, 30),
          e.lineTo(70, 34),
          e.quadraticCurveTo(50, 22, 30, 34),
          e.closePath(),
          e.fill(),
          B(e, { ex: 50, ey: 52, sp: 8.5, skin: i, iris: "#2a5a7a", brow: "#1a1424", lip: "#a4504e", seed: 1 }, a, t, r),
          pe(e, 50, 52, "#ff8a8a", 0.25),
          u(e, 22, 50, 4, 9, "#2fd8ff"),
          u(e, 78, 50, 4, 9, "#2fd8ff"));
      },
      mira(e, a, t, r) {
        x(e, "#f2b822", "#7a5410", "#2a1a08");
        const i = "#7a4a30";
        (U(e, i, "#2a1408"), (e.fillStyle = "#1a0e08"), u(e, 50, 18, 13, 9, "#1a0e08"));
        for (let n = 0; n < 9; n++) {
          const s = -0.3 + n * 0.075;
          (e.save(), e.translate(50 + (n - 4) * 4.2, 30), e.rotate(s * (n - 4) * 0.4), E(e, -2.2, -4, 4.4, 34, 2.2), e.fill(), e.restore());
        }
        for (let n = 0; n < 5; n++) u(e, 50 + (n - 2) * 5, 13 + Math.abs(n - 2) * 1.6, 2.5, 2.5, "#ffd23c");
        (u(e, 50, 47, 19, 23, i),
          e.beginPath(),
          e.moveTo(31, 42),
          e.quadraticCurveTo(50, 22, 69, 42),
          e.quadraticCurveTo(60, 30, 50, 30),
          e.quadraticCurveTo(40, 30, 31, 42),
          (e.fillStyle = "#1a0e08"),
          e.fill(),
          B(e, { ex: 50, ey: 48, sp: 8.6, skin: i, iris: "#2a160c", brow: "#140a06", lip: "#4a1e1a", seed: 2 }, a, t, r),
          e.beginPath(),
          e.arc(50, 46, 22, Math.PI * 1.05, Math.PI * 1.95),
          y(e, "#ffd23c", 2.2),
          u(e, 29, 49, 3.6, 6, "#ffd23c"),
          u(e, 71, 49, 3.6, 6, "#ffd23c"),
          e.beginPath(),
          e.moveTo(29, 54),
          e.quadraticCurveTo(32, 66, 42, 64),
          y(e, "#ffd23c", 1.6),
          u(e, 43, 64, 2, 1.6, "#2a1a08"),
          u(e, 70, 58, 1.4, 1.4, "#fff4c0"));
      },
      gus(e, a, t, r) {
        (x(e, "#2a3a66", "#141c34", "#ff9a3c"), (e.fillStyle = "#ff9a3c"), e.fillRect(36, 84, 6, 16), e.fillRect(58, 84, 6, 16));
        const i = "#d89c78";
        (U(e, i, "#6a3a20"),
          u(e, 50, 47, 20, 24, i),
          u(e, 30, 49, 3.6, 5.6, "#c88a68"),
          u(e, 70, 49, 3.6, 5.6, "#c88a68"),
          (e.fillStyle = "#b8b4ac"),
          u(e, 31.5, 40, 3.6, 8, "#b8b4ac"),
          u(e, 68.5, 40, 3.6, 8, "#b8b4ac"),
          (e.globalAlpha = 0.35),
          u(e, 44, 30, 6, 3, "#ffffff"),
          (e.globalAlpha = 1),
          e.beginPath(),
          e.moveTo(30, 34),
          e.quadraticCurveTo(50, 28, 70, 34),
          y(e, "#3a2a1a", 3),
          u(e, 42, 32, 6.5, 5, "#3a2a1a"),
          u(e, 58, 32, 6.5, 5, "#3a2a1a"),
          u(
            e,
            42,
            32,
            5,
            3.6,
            L(e, 0, 28, 0, 36, [
              [0, "#ffd27a"],
              [1, "#ff7a1a"],
            ]),
          ),
          u(
            e,
            58,
            32,
            5,
            3.6,
            L(e, 0, 28, 0, 36, [
              [0, "#ffd27a"],
              [1, "#ff7a1a"],
            ]),
          ),
          e.beginPath(),
          e.moveTo(41, 40),
          e.lineTo(59, 40),
          y(e, "rgba(90,50,30,0.35)", 0.8),
          B(
            e,
            { ex: 50, ey: 48, sp: 8.6, skin: i, iris: "#3a5a6a", brow: "#d8d4cc", browW: 3.2, lip: "#7a3a30", seed: 3, my: 64 },
            a,
            t,
            r,
          ),
          (e.fillStyle = "#c8c4bc"),
          e.beginPath(),
          e.moveTo(31, 52),
          e.quadraticCurveTo(33, 74, 50, 76),
          e.quadraticCurveTo(67, 74, 69, 52),
          e.quadraticCurveTo(66, 66, 58, 66),
          e.quadraticCurveTo(50, 69, 42, 66),
          e.quadraticCurveTo(34, 66, 31, 52),
          e.closePath(),
          e.fill(),
          e.beginPath(),
          e.moveTo(41, 61.5),
          e.quadraticCurveTo(50, 57, 59, 61.5),
          e.quadraticCurveTo(50, 60.5, 41, 61.5),
          y(e, "#d8d4cc", 2.4),
          (e.globalAlpha = 0.4),
          u(e, 62, 55, 3, 1.4, "#2a1a10", -0.4),
          (e.globalAlpha = 1));
      },
      thorne(e, a, t, r) {
        (x(e, "#1a1424", "#08060c", null),
          (e.fillStyle = "#f4f0f4"),
          g(e, [40, 76, 50, 90, 60, 76, 56, 74, 44, 74]),
          e.fill(),
          (e.fillStyle = "#ff4058"),
          g(e, [47.5, 78, 52.5, 78, 54, 96, 50, 100, 46, 96]),
          e.fill(),
          (e.fillStyle = "#2a2234"),
          g(e, [30, 100, 40, 77, 47, 90, 42, 100]),
          e.fill(),
          g(e, [70, 100, 60, 77, 53, 90, 58, 100]),
          e.fill());
        const i = "#efc8aa";
        (U(e, i, "#8a5a48"),
          (e.fillStyle = i),
          g(e, [31, 38, 36, 24, 64, 24, 69, 38, 67, 58, 58, 70, 42, 70, 33, 58]),
          e.fill(),
          u(e, 30.5, 48, 3, 5, "#e0b496"),
          u(e, 69.5, 48, 3, 5, "#e0b496"),
          (e.fillStyle = L(e, 0, 14, 0, 36, [
            [0, "#f4f4f8"],
            [1, "#9a9aa8"],
          ])),
          e.beginPath(),
          e.moveTo(30, 42),
          e.quadraticCurveTo(28, 16, 50, 15),
          e.quadraticCurveTo(72, 16, 70, 42),
          e.quadraticCurveTo(66, 30, 58, 29),
          e.lineTo(50, 36),
          e.lineTo(42, 29),
          e.quadraticCurveTo(34, 30, 30, 42),
          e.closePath(),
          e.fill(),
          e.beginPath(),
          e.moveTo(36, 24),
          e.quadraticCurveTo(50, 18, 66, 26),
          y(e, "rgba(255,255,255,0.6)", 0.8),
          B(
            e,
            { ex: 50, ey: 46, sp: 8.6, skin: i, iris: "#5a6a7a", brow: "#c8c8d0", browW: 2.4, lip: "#9a4a48", seed: 4, my: 61 },
            a,
            t,
            r,
          ),
          e.beginPath(),
          e.moveTo(36, 56),
          e.lineTo(43, 66),
          y(e, "rgba(120,70,60,0.35)", 0.9),
          e.beginPath(),
          e.moveTo(64, 56),
          e.lineTo(57, 66),
          y(e, "rgba(120,70,60,0.35)", 0.9),
          K(e, 58.6, 46, 6, 5.2),
          y(e, "#ff4058", 1.4),
          (e.globalAlpha = 0.25),
          u(e, 58.6, 46, 6, 5.2, "#ff4058"),
          (e.globalAlpha = 1),
          e.beginPath(),
          e.moveTo(64.6, 46),
          e.lineTo(70, 44),
          y(e, "#ff4058", 1));
      },
      odo(e, a, t, r) {
        (x(e, "#3a6a24", "#142410", "#b8ff6a"),
          (e.fillStyle = "#5fcf3a"),
          g(e, [20, 86, 36, 74, 44, 80, 30, 94]),
          e.fill(),
          g(e, [80, 86, 64, 74, 56, 80, 70, 94]),
          e.fill());
        const i = "#c08860";
        ((e.fillStyle = i),
          E(e, 37, 60, 26, 20, 4),
          e.fill(),
          (e.fillStyle = i),
          E(e, 27, 22, 46, 50, 13),
          e.fill(),
          u(e, 26.5, 48, 3.6, 6, "#a87450"),
          u(e, 73.5, 48, 3.6, 6, "#a87450"),
          (e.fillStyle = "#2a2a22"),
          e.beginPath(),
          e.moveTo(27, 38),
          e.quadraticCurveTo(27, 20, 50, 20),
          e.quadraticCurveTo(73, 20, 73, 38),
          e.quadraticCurveTo(62, 30, 50, 30),
          e.quadraticCurveTo(38, 30, 27, 38),
          e.fill(),
          (e.globalAlpha = 0.5));
        for (let n = 0; n < 26; n++) u(e, 30 + ((n * 37) % 40), 24 + ((n * 13) % 9), 0.5, 0.5, "#5a5a4a");
        ((e.globalAlpha = 1),
          B(
            e,
            { ex: 50, ey: 46, sp: 9.4, skin: i, iris: "#2a2a1a", brow: "#1a1a12", browW: 4.2, lip: "#6a3a2a", seed: 5, my: 62 },
            a === "happy" ? "smug" : a,
            t,
            r,
          ),
          e.beginPath(),
          e.moveTo(36, 36),
          e.lineTo(47, 50),
          y(e, "#e8b0a0", 1.4),
          e.beginPath(),
          e.moveTo(38, 38.5),
          e.lineTo(40.6, 37),
          e.moveTo(41, 42.5),
          e.lineTo(43.6, 41),
          e.moveTo(44, 46.5),
          e.lineTo(46.6, 45),
          y(e, "#e8b0a0", 0.8),
          (e.globalAlpha = 0.28),
          (e.fillStyle = "#2a2a1a"),
          E(e, 31, 56, 38, 16, 10),
          e.fill(),
          (e.globalAlpha = 1));
      },
      theo(e, a, t, r) {
        const i = a === "sinister";
        (x(e, "#9b5cf2", "#3a1a6a", "#e9dcff"), (e.fillStyle = "#e9dcff"), g(e, [42, 76, 50, 84, 58, 76]), e.fill());
        const n = "#f2cdb0";
        (U(e, n, "#8a5a48"), u(e, 50, 48, 19, 23, n), u(e, 31, 50, 3.2, 5.2, "#e4b496"), u(e, 69, 50, 3.2, 5.2, "#e4b496"));
        const s = [
          [33, 34],
          [38, 27],
          [45, 23],
          [52, 22],
          [59, 24],
          [65, 29],
          [68, 36],
          [36, 40],
          [64, 40],
          [42, 30],
          [56, 29],
          [49, 28],
        ];
        (s.forEach((l, c) => u(e, l[0], l[1], 6.4, 5.6, c % 2 ? "#f2cf6a" : "#e0b448")),
          s.forEach((l, c) => {
            (e.beginPath(), e.arc(l[0] - 1, l[1] - 1, 2.6, 3.6, 5.6), y(e, "#fff0b0", 0.8));
          }),
          B(e, { ex: 50, ey: 49, sp: 8.6, skin: n, iris: i ? "#c49bff" : "#4a7ab0", brow: "#c89a3a", lip: "#a4504e", seed: 6 }, a, t, r),
          (e.fillStyle = "#c87a50"),
          [
            [40, 55],
            [42.5, 57],
            [44.5, 54.5],
            [55.5, 54.5],
            [57.5, 57],
            [60, 55],
          ].forEach((l) => u(e, l[0], l[1], 0.7, 0.7, "#c87a50")),
          i || pe(e, 50, 49, "#ff8a8a", 0.3),
          e.beginPath(),
          e.moveTo(69, 54),
          e.quadraticCurveTo(66, 66, 57, 65),
          y(e, "#e9dcff", 1.6),
          u(e, 56, 65, 1.8, 1.5, "#3a1a6a"),
          i &&
            ((e.fillStyle = L(e, 0, 20, 0, 80, [
              [0, "rgba(10,0,30,0.65)"],
              [0.55, "rgba(10,0,30,0.15)"],
              [1, "rgba(160,90,255,0.25)"],
            ])),
            e.fillRect(0, 0, 100, 100),
            (e.globalAlpha = 0.85 + 0.15 * Math.sin(t * 6)),
            u(e, 41.4, 49.2, 2.2, 1.1, "#e0c8ff"),
            u(e, 58.6, 49.2, 2.2, 1.1, "#e0c8ff"),
            (e.globalAlpha = 1)));
      },
      auric(e, a, t, r) {
        for (let l = 0; l < 4; l++) ((e.fillStyle = l % 2 ? "#5a0a14" : "#8a1a24"), E(e, 40, 62 + l * 4, 20, 4, 1.5), e.fill());
        (x(e, "#e8e4ec", "#7a7480", "#d8233a"),
          (e.fillStyle = "#d8233a"),
          g(e, [8, 100, 22, 82, 36, 79, 30, 100]),
          e.fill(),
          g(e, [92, 100, 78, 82, 64, 79, 70, 100]),
          e.fill(),
          (e.fillStyle = L(e, 50, 4, 50, 30, [
            [0, "#ff6a5a"],
            [1, "#8a0a18"],
          ])),
          g(e, [46, 30, 50, 2, 54, 30]),
          e.fill(),
          (e.fillStyle = L(e, 28, 16, 72, 74, [
            [0, "#fff2c8"],
            [0.35, "#e8b84a"],
            [0.7, "#a8741e"],
            [1, "#5a3a0a"],
          ])),
          g(e, [50, 12, 70, 22, 72, 48, 62, 70, 50, 76, 38, 70, 28, 48, 30, 22]),
          e.fill(),
          g(e, [50, 12, 70, 22, 72, 48, 62, 70, 50, 76, 38, 70, 28, 48, 30, 22]),
          y(e, "#fff8e0", 0.9),
          e.beginPath(),
          e.moveTo(50, 14),
          e.lineTo(50, 34),
          e.moveTo(32, 50),
          e.lineTo(42, 62),
          e.moveTo(68, 50),
          e.lineTo(58, 62),
          y(e, "rgba(90,50,0,0.55)", 0.8),
          (e.fillStyle = "#12060a"),
          g(e, [30, 38, 70, 38, 69, 52, 31, 52]),
          e.fill());
        const i = 31 + ((t * 26) % 38);
        ((e.fillStyle = "rgba(255,90,90,0.18)"), e.fillRect(i - 3, 38.5, 6, 13));
        const n = a === "angry" ? "#ff3a3a" : a === "happy" ? "#ffe8a0" : a === "worried" ? "#ffb86a" : "#ffffff";
        ((e.shadowColor = n), (e.shadowBlur = 6));
        for (let l = -1; l <= 1; l += 2) {
          const c = 50 + l * 10,
            h = 45;
          (e.beginPath(),
            a === "happy"
              ? e.arc(c, h + 2, 4, Math.PI * 1.15, Math.PI * 1.85)
              : a === "angry"
                ? (e.moveTo(c - 5, h - 2.5 * -l), e.lineTo(c + 5, h + 2.5 * -l))
                : a === "worried"
                  ? (e.moveTo(c - 5, h + 2 * -l), e.lineTo(c + 5, h - 2 * -l))
                  : a === "shock"
                    ? e.arc(c, h, 3.4, 0, Math.PI * 2)
                    : a === "smug" && l < 0
                      ? e.arc(c, h + 2, 4, Math.PI * 1.15, Math.PI * 1.85)
                      : (e.moveTo(c - 5, h), e.lineTo(c + 5, h)),
            y(e, n, 2.2));
        }
        e.shadowBlur = 0;
        const s = 7;
        for (let l = 0; l < s; l++) {
          const h = 1 + (r ? 0.3 + 0.7 * Math.abs(Math.sin(t * 17 + l * 1.7) * Math.sin(t * 5.3 + l)) : 0.12) * 6;
          ((e.fillStyle = a === "angry" ? "#ff3a3a" : "#ff6a5a"), e.fillRect(41 + l * 2.7, 63 - h / 2, 1.7, h));
        }
        for (let l = 0; l < 3; l++)
          (e.beginPath(),
            e.moveTo(33, 56 + l * 3),
            e.lineTo(38, 58 + l * 3),
            e.moveTo(67, 56 + l * 3),
            e.lineTo(62, 58 + l * 3),
            y(e, "rgba(70,40,0,0.6)", 0.9));
      },
      sable(e, a, t, r) {
        (x(e, "#2a2632", "#100e14", "#ff7a1a"), (e.fillStyle = "#ff7a1a"), E(e, 36, 74, 28, 6, 3), e.fill());
        for (let h = 0; h < 3; h++) ((e.fillStyle = "#3a3644"), E(e, 42, 60 + h * 4.5, 16, 4, 2), e.fill());
        (e.beginPath(), e.moveTo(26, 40), e.lineTo(16, 18), e.moveTo(74, 40), e.lineTo(84, 18), y(e, "#3a3644", 2.4));
        const i = Math.sin(t * 5) > 0 ? "#7af6ff" : "#2a6a7a";
        (u(e, 16, 17, 3, 3, i),
          u(e, 84, 17, 3, 3, Math.sin(t * 5 + 2) > 0 ? "#7af6ff" : "#2a6a7a"),
          u(
            e,
            50,
            44,
            27,
            27,
            L(e, 23, 17, 77, 71, [
              [0, "#ffb36a"],
              [0.5, "#ff7a1a"],
              [1, "#8a3a08"],
            ]),
          ),
          u(e, 50, 47, 21, 19, "#15131c"),
          e.beginPath(),
          e.arc(50, 44, 27, Math.PI * 1.2, Math.PI * 1.8),
          y(e, "rgba(255,255,255,0.45)", 1.2));
        const n = Math.sin(t * 1.3) * 1.6,
          s = a === "shock" ? 1.25 : a === "happy" ? 1.05 : 1;
        for (let h = -1; h <= 1; h += 2) {
          const d = 50 + h * 9,
            p = 44;
          if (
            (u(e, d, p, 7 * s, 7 * s, "#0a1a22"),
            (e.shadowColor = "#7af6ff"),
            (e.shadowBlur = 8),
            K(e, d, p, 6 * s, 6 * s),
            y(e, "#7af6ff", 1.2),
            (e.shadowBlur = 0),
            a === "happy")
          )
            (e.beginPath(), e.arc(d, p + 1.5, 3.6, Math.PI * 1.1, Math.PI * 1.9), y(e, "#bffcff", 2));
          else {
            const m = a === "angry" ? 2 : a === "worried" ? 2.6 : 3.1;
            (u(e, d + n, p + (a === "worried" ? 1 : 0), m * s, m * s, "#bffcff"), u(e, d + n + 1, p - 1, 1, 1, "#ffffff"));
          }
          if (a === "angry" || a === "smug" || a === "worried") {
            e.fillStyle = "#15131c";
            const m = a === "angry" ? -h * 2.6 : a === "worried" ? h * 2.6 : 0;
            (g(e, [d - 8, p - 8, d + 8, p - 8, d + 8, p - 2.5 - m, d - 8, p - 2.5 + m]), e.fill());
          }
        }
        const l = {
          neutral: [0, 0, 1, 1, 1, 1, 0, 0],
          happy: [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
          angry: [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
          worried: [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
          shock: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
          smug: [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        };
        let c = l[a] || l.neutral;
        r && Math.sin(t * 18) > 0 && (c = [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0]);
        for (let h = 0; h < c.length; h++) {
          const d = 40.4 + (h % 8) * 2.8,
            p = 58 + Math.floor(h / 8) * 2.8;
          ((e.fillStyle = c[h] ? "#ff9a3c" : "rgba(255,154,60,0.12)"), e.fillRect(d - 1, p - 1, 2, 2));
        }
        ((e.globalAlpha = 0.6 + 0.4 * Math.sin(t * 3)),
          u(e, 33, 54, 1.6, 1.6, "#ff9a3c"),
          u(e, 67, 54, 1.6, 1.6, "#ff9a3c"),
          (e.globalAlpha = 1));
      },
    };
  function ye(e, a, t, r, i, n, s) {
    const l = ae[a],
      c = M[a];
    (e.save(),
      e.scale(t / 100, t / 100),
      E(e, 0, 0, 100, 100, 9),
      e.save(),
      e.clip(),
      Ee(e, Le[a], i, c.kind === "ai"),
      l(e, r, i, n),
      (e.globalAlpha = 0.1),
      (e.fillStyle = "#000"));
    for (let h = 0; h < 100; h += 3) e.fillRect(0, h, 100, 1.2);
    if (((e.globalAlpha = 1), s)) {
      const h = 0.04 + 0.04 * Math.sin(i * 43);
      ((e.fillStyle = "rgba(255,255,255," + h.toFixed(3) + ")"), e.fillRect(0, (i * 60) % 100, 100, 6));
    }
    (e.restore(),
      E(e, 1, 1, 98, 98, 8.5),
      (e.strokeStyle = c.color),
      (e.lineWidth = 3),
      e.stroke(),
      c.kind === "ai" &&
        ((e.fillStyle = c.color),
        g(e, [70, 99, 99, 99, 99, 88, 80, 88]),
        e.fill(),
        (e.fillStyle = "#100810"),
        (e.font = "bold 8px sans-serif"),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        e.fillText("AI", 89.5, 94)),
      e.restore());
  }
  const qe = 0.05,
    V = new Map();
  let te = 0;
  function me(e) {
    const a = e && e.canvas,
      t = a && a.height > 0 ? a.height / 360 : 2;
    return t < 1 ? 1 : t > 4 ? 4 : t;
  }
  ((N.drawPortrait = function (e, a, t, r, i, n, s, l) {
    try {
      const c = ae[a],
        h = M[a];
      if (!e || !c || !h) return;
      ((n = Q.indexOf(n) >= 0 ? n : "neutral"), (s = +s || 0));
      const d = !!(l && l.talk),
        p = !!(l && l.radio),
        m = me(e);
      let f = V.get(a);
      f || ((f = new Map()), V.set(a, f));
      let b = f.get(i);
      if (!b) {
        te > 24 && (V.clear(), (te = 0), (f = new Map()), V.set(a, f));
        const w = document.createElement("canvas");
        ((b = { c: w, g: w.getContext("2d"), dpr: 0, mood: "", talk: null, radio: null, t: -1e9 }), f.set(i, b), te++);
      }
      if (b.dpr !== m || b.mood !== n || b.talk !== d || b.radio !== p || s - b.t >= qe || s < b.t) {
        const w = Math.max(1, Math.ceil(i * m));
        (b.c.width !== w ? ((b.c.width = w), (b.c.height = w)) : b.g.clearRect(0, 0, w, w),
          ye(b.g, a, w, n, s, d, p),
          (b.dpr = m),
          (b.mood = n),
          (b.talk = d),
          (b.radio = p),
          (b.t = s));
      }
      const S = (w) => Math.round(w * m) / m;
      e.drawImage(b.c, S(t), S(r), i, i);
    } catch {}
  }),
    (N.drawPortraitDirect = function (e, a, t, r, i, n, s, l) {
      try {
        if (!e || !ae[a] || !M[a]) return;
        ((n = Q.indexOf(n) >= 0 ? n : "neutral"),
          e.save(),
          e.translate(t, r),
          ye(e, a, i, n, +s || 0, !!(l && l.talk), !!(l && l.radio)),
          e.restore());
      } catch {
        try {
          e.restore();
        } catch {}
      }
    }));
  const He = '"Avenir Next Condensed","AvenirNextCondensed-HeavyItalic","Futura","Arial Narrow",sans-serif',
    be = new Map();
  function F(e, a, t) {
    const r = e * 4096 + (a || 700) * 2 + (t === !1 ? 0 : 1);
    let i = be.get(r);
    return (i || ((i = (t === !1 ? "" : "italic ") + (a || 700) + " " + e + "px " + He), be.set(r, i)), i);
  }
  function we(e, a, t) {
    const r = String(a).split(/\s+/),
      i = [];
    let n = "";
    for (const s of r) {
      const l = n ? n + " " + s : s;
      e.measureText(l).width > t && n ? (i.push(n), (n = s)) : (n = l);
    }
    return (n && i.push(n), i);
  }
  function ve(e, a, t, r, i, n) {
    (e.beginPath(), e.moveTo(a + n, t), e.lineTo(a + r, t), e.lineTo(a + r - n, t + i), e.lineTo(a, t + i), e.closePath());
  }
  N.wrapText = we;
  const Z = new Map();
  let ie = 0;
  const xe = (function () {
    try {
      return document.createElement("canvas").getContext("2d");
    } catch {
      return null;
    }
  })();
  function Te(e, a, t, r, i, n, s) {
    const l = a.id || a.text;
    let c = Z.get(l);
    c || ((c = new Map()), Z.set(l, c));
    const h = r * 4096 + i;
    let d = c.get(h);
    d || ((d = new Map()), c.set(h, d));
    const p = me(e);
    let m = d.get(t);
    if (m && m.dpr === p) return m;
    ie > 80 && (Z.clear(), (ie = 0), (c = new Map()), Z.set(l, c), (d = new Map()), c.set(h, d));
    const f = xe || e;
    f.font = F(r, i, !1);
    const b = we(f, a.text, t),
      S = [],
      w = [];
    let T = 0;
    for (let P = 0; P < b.length; P++) {
      const _ = b[P],
        re = new Float32Array(_.length + 1);
      for (let J = 1; J <= _.length; J++) re[J] = f.measureText(_.slice(0, J)).width;
      (S.push(re), w.push(re[_.length]), (T += _.length + 1));
    }
    const I = Math.ceil(r * 0.95),
      k = Math.ceil(n * p),
      A = b.length,
      R = document.createElement("canvas");
    ((R.width = Math.max(1, Math.ceil((t + 6) * p))), (R.height = Math.max(1, k * Math.max(1, A))));
    const v = R.getContext("2d");
    (v.scale(p, p), (v.font = F(r, i, !1)), (v.fillStyle = s), (v.textBaseline = "alphabetic"), (v.textAlign = "left"));
    for (let P = 0; P < A; P++) v.fillText(b[P], 0, (P * k) / p + I);
    return ((m = { c: R, lines: b, cum: S, widths: w, total: T, asc: I, rowPx: k, dpr: p, lh: n, n: A, tw: t }), d.set(t, m), ie++, m);
  }
  function ke(e, a, t, r, i, n) {
    const s = a.lines[t].length,
      l = r >= s,
      c = a.cum[t][l ? s : r];
    if (!(c > 0)) return;
    const h = a.dpr,
      d = (m) => Math.round(m * h) / h,
      p = l ? a.c.width : Math.min(a.c.width, Math.ceil(c * h) + 1);
    e.drawImage(a.c, 0, t * a.rowPx, p, a.rowPx, d(i), d(n - a.asc), p / h, a.rowPx / h);
  }
  const ge = new Map();
  function De(e) {
    let a = ge.get(e.name);
    return (a === void 0 && ((a = e.name + "  \xB7  LUCENT"), ge.set(e.name, a)), a);
  }
  ((N.drawComm = function (e, a, t, r) {
    try {
      const i = r || N.current();
      if (!i || !e || !a) return !1;
      const n = a.x,
        s = a.y,
        l = a.w,
        c = a.h,
        h = Math.min(1, i.age / 0.15) * Math.min(1, Math.max(0, (i.dur - i.age) / 0.3));
      if (h <= 0) return !1;
      const d = q.HUD && q.HUD.kit;
      (d && d.mark && d.mark(n - 26, s - 4, l + 32, c + 8), e.save(), (e.globalAlpha = h));
      const p = (1 - Math.min(1, i.age / 0.15)) * -20;
      (e.translate(p, 0),
        ve(e, n, s, l, c, 10),
        (e.fillStyle = "rgba(8,4,24,0.78)"),
        e.fill(),
        (e.strokeStyle = i.color),
        (e.lineWidth = 1.5),
        e.stroke());
      const m = c - 8;
      N.drawPortrait(e, i.portrait, n + 6, s + 4, m, i.mood, t, { talk: i.talking, radio: !0 });
      const f = n + m + 14,
        b = l - m - 26;
      ((e.textBaseline = "alphabetic"),
        (e.textAlign = "left"),
        (e.font = F(11, 800)),
        (e.fillStyle = i.color),
        e.fillText(i.ai ? De(i) : i.name, f, s + 13));
      for (let v = 0; v < 4; v++) {
        const P = Math.sin(t * 9 + v) > -0.6 || v < 2;
        ((e.fillStyle = P ? i.color : "rgba(255,255,255,0.2)"), e.fillRect(n + l - 26 + v * 4, s + 12 - (v + 1) * 2.4, 2.6, (v + 1) * 2.4));
      }
      const S = Te(e, i, b, 12, 700, 13, "#f6f2ff"),
        w = Math.floor(i.age * 55),
        T = S.lines,
        I = Math.max(1, Math.floor((c - 18) / 13));
      let k = w,
        A = 0;
      for (let v = 0; v < T.length && !(k <= 0 && v > 0); v++) ((A = v + 1), (k -= T[v].length + 1));
      const R = Math.max(0, A - I);
      k = w;
      for (let v = 0; v < R; v++) k -= T[v].length + 1;
      for (let v = R; v < A; v++) (ke(e, S, v, k < 0 ? 0 : k, f, s + 28 + (v - R) * 13), (k -= T[v].length + 1));
      return (e.restore(), !0);
    } catch {
      try {
        e.restore();
      } catch {}
      return !1;
    }
  }),
    (N.drawDialogue = function (e, a, t, r, i, n) {
      try {
        if (!e || !a || !r) return !0;
        const s = M[r.who] || { name: r.who, color: "#fff", side: "left" },
          l = a.x,
          c = a.y,
          h = a.w,
          d = a.h,
          p = Math.min(d - 12, 120),
          m = s.side === "right";
        (e.save(),
          ve(e, l, c, h, d, 14),
          (e.fillStyle = "rgba(8,4,24,0.86)"),
          e.fill(),
          (e.strokeStyle = s.color),
          (e.lineWidth = 2),
          e.stroke());
        const f = m ? l + h - p - 20 : l + 20,
          b = String(r.text),
          S = i < 0.7 + We(r, b) * 0.34;
        N.drawPortrait(e, r.who, f, c + (d - p) / 2, p, r.mood, t, { talk: S });
        const w = m ? l + 26 : l + p + 36,
          T = h - p - 66;
        ((e.textAlign = "left"),
          (e.textBaseline = "alphabetic"),
          (e.font = F(18, 800)),
          (e.fillStyle = s.color),
          e.fillText(s.name, w, c + 28));
        const I = e.measureText(s.name).width;
        ((e.font = F(11, 700)),
          (e.fillStyle = "rgba(246,242,255,0.55)"),
          e.fillText(s.kind === "ai" ? "LUCENT" : "HUMAN", w + I + 10, c + 28));
        const k = Te(e, r, T, 16, 600, 21, "#f6f2ff"),
          A = Math.floor((i || 0) * 50);
        let R = A;
        for (
          let P = 0;
          P < k.lines.length && (ke(e, k, P, R < 0 ? 0 : R, w, c + 54 + P * 21), (R -= k.lines[P].length + 1), !(R < 0));
          P++
        );
        const v = A >= k.total;
        return (
          v &&
            !(n && n.noHint) &&
            Math.sin(t * 6) > -0.3 &&
            ((e.font = F(12, 800)),
            (e.fillStyle = s.color),
            (e.textAlign = "right"),
            e.fillText("TAP \u25B6", m ? l + h - p - 34 : l + h - 22, c + d - 12)),
          e.restore(),
          v
        );
      } catch {
        try {
          e.restore();
        } catch {}
        return !0;
      }
    }));
  const Se = new Map();
  function We(e, a) {
    const t = e.id || a;
    let r = Se.get(t);
    return (r === void 0 && ((r = a.split(/\s+/).length), Se.set(t, r)), r);
  }
  q.Story = N;
})();
