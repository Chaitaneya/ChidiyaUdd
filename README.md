```
  ██████╗██╗  ██╗██╗██████╗ ██╗██╗   ██╗ █████╗     ██╗   ██╗██████╗ ██████╗ 
 ██╔════╝██║  ██║██║██╔══██╗██║╚██╗ ██╔╝██╔══██╗    ██║   ██║██╔══██╗██╔══██╗
 ██║     ███████║██║██║  ██║██║ ╚████╔╝ ███████║    ██║   ██║██║  ██║██║  ██║
 ██║     ██╔══██║██║██║  ██║██║  ╚██╔╝  ██╔══██║    ██║   ██║██║  ██║██║  ██║
 ╚██████╗██║  ██║██║██████╔╝██║   ██║   ██║  ██║    ╚██████╔╝██████╔╝██████╔╝
  ╚═════╝╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ 
                                                                               
                      THE LEGENDARY BIRD BRAIN GAME 
```

<div align="center">
  <img src="./public/assets/emojis/ChidiyaUdd.gif" alt="Chidiya Udd - Flying Bird Logo" width="200" style="image-rendering: pixelated; border: 4px solid #000; padding: 10px; background: #1e293b;">
</div>

# 🎮 CHIDIYA UDD 

> *"A childhood classic from the Indian streets, now reimagined as a fast-paced multiplayer brain-teaser with retro pixel vibes."*

---

## 📖 The Story

Back in the 2000s, Indian playgrounds echoed with the sound of "CHIDIYA UDD!" - a simple yet addictive game where kids tested their knowledge. One player would call out an animal or object, and others had **milliseconds** to decide: **DOES IT FLY?**

Now, decades later, we've brought this classic back to life.

- 🏃 **Millisecond Reflexes** - Decide fast or lose a heart
- 🎯 **Streak Bonus** - Consecutive right answers score more
- 👥 **Synced Multiplayer** - 2–8 friends see the same card at the same moment
- 📣 **Leader Mode** - The phone calls "Tota udd! Bhains udd!", you play with real fingers
- 🧸 **Family & 🌶️ Masala decks** - Kid-safe classics, or add desi slang and sayings
- 🗣️ **Hindi Narration** - Every card is called out the playground way: "तोता उड़!"
- 📴 **Works Offline** - Single player and Leader Mode need no internet
- 🕹️ **Retro Aesthetic** - Pixel-perfect UI inspired by 8-bit gaming
- 📱 **Fully Responsive** - Phone, tablet or desktop (installable as an app)

---

## 🎮 How to Play

### Decks
Pick a deck with the 🧸/🌶️ button on the menu (or when creating a room):

- **🧸 Family** (78 cards): kid-safe. Literal rules: does the thing itself fly?
- **🌶️ Masala** (98 cards): everything in Family plus desi slang. **Hindi sayings count**: "hosh udd gaye" means *Hosh* flies!

Every deck is full of rhyme traps: **Maina** flies, **Naina** doesn't. **Patang** flies, **Palang** doesn't. Get one wrong and a 💡 line explains why.

### Single Player
1. Tap **SINGLE PLAYER**. A card appears and is called out: "चिड़िया उड़!"
2. **It flies?** Tap **FLY!** (or press **Space**).
3. **It doesn't?** Wait until the timer runs out.
4. Right = **+10 points + 2 × streak** (streak bonus caps at +20).
5. Wrong = **-1 ❤️** and a 💡 explanation. Lose all 3 hearts and it's game over.
6. Every right answer makes the rounds faster (1.4s → 0.5s), but longer names always get enough time to be heard.
7. Beat your top score for a confetti celebration 🎉

Keyboard: **Space/Enter** = FLY · **P** = pause · **Esc** = pause / close dialogs. The game pauses itself if you switch tabs.

### Multiplayer (synced)
1. Tap **MULTIPLAYER** and log in with Google (you come straight back to multiplayer after login).
2. **Host:** pick the deck (🧸 Family / 🌶️ Masala), create a room and share the 4-character code (**SHARE**/**COPY**).
3. **Players:** enter the code to join (up to 8 players). The host can still switch the deck in the lobby.
4. The host starts once at least 2 players are in. **GET READY 3-2-1**…
5. Everyone sees **the same card at the same moment**. Tap FLY in time (your reaction is timed on your own phone, so lag doesn't count).
6. Right = points + streak bonus, and **⚡ +5 for the fastest correct FLY**. Wrong = -1 ❤️.
7. **Last one standing wins** 👑. Out players keep watching the cards. **PLAY AGAIN** deals a fresh deck.

### 📣 Leader Mode (no internet, no login)
The real playground game, with the phone as the caller:
1. Put the phone in the middle. Everyone keeps one finger on the table.
2. Pick a deck and a pace (🐢 SLOW or 🐇 FAST), then **START CALLING**.
3. The phone calls "कौवा उड़! भैंस उड़!" in a clear Hindi voice, a little faster each time. Lift your finger only if it flies!
4. After each call it shows ✅ UDD! or ❌ NAHI! with the reason, to settle arguments. Last finger standing wins.

**Space** = pause, **Esc** = stop. The screen stays awake while calling.

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Chaitaneya/ChidiyaUdd.git
cd ChidiyaUdd

# Install dependencies
npm install

# Set up environment (copy .env.example to .env and add your Supabase keys)
cp .env.example .env

# Start the dev server, then open http://localhost:3000
npm run dev
```

Other scripts: `npm run build` (production build into `dist/`), `npm run preview` (serve the build), `npm run typecheck`.

Without Supabase keys the game still runs in single player. Login and multiplayer are disabled.

---

## ☁️ Deploying (Vercel)

1. Import the repo in Vercel (framework preset: **Vite**; build `npm run build`, output `dist`).
2. Add **Environment Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In Supabase → **Authentication → URL Configuration**, add your Vercel URL (e.g. `https://chidiyauddd.vercel.app`) to **Site URL / Redirect URLs**, and enable the **Google** provider.
4. Deploy. `vercel.json` adds the security headers (CSP allows Supabase over `https://*.supabase.co` and `wss://*.supabase.co`) and the SPA rewrite.

No Google/Gemini API key is needed: speech uses the browser's built-in voices.

**Offline:** `public/sw.js` (a service worker, production builds only) caches the game on the first visit. When you change `sw.js` itself, bump its `VERSION` so every visitor rebuilds their cache. New deploys of the app are picked up automatically when online.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React 19 + TypeScript 5.8 | UI and state |
| **Build Tool** | Vite 6 | Dev server and production builds |
| **Styling** | Tailwind CSS 4 (`@tailwindcss/vite`) | Utility-first CSS |
| **Fonts** | Press Start 2P, VT323 | Retro pixel look |
| **Realtime** | Supabase Realtime (Broadcast + Presence) | Multiplayer rooms |
| **Auth** | Supabase Auth (Google OAuth) | Login for multiplayer |
| **Audio** | Web Audio API + Web Speech API | Sound effects + spoken names |
| **Effects** | canvas-confetti | Celebrations |
| **Offline** | Service worker (`public/sw.js`) | Play with no internet |
| **Hosting** | Vercel | Static SPA |

---

## 📁 Project Structure

```
ChidiyaUdd/
├── index.html                  # HTML shell (fonts, PWA tags)
├── index.tsx                   # React entry point
├── App.tsx                     # Screen router + multiplayer navigation
├── types.ts                    # Shared TypeScript types
├── constants.ts                # The 98 cards (Family + Masala) + game tuning
│
├── components/
│   ├── MainMenu.tsx            # Start screen, deck toggle, help, login/sound
│   ├── GameScreen.tsx          # Single player (timer, scoring, keyboard)
│   ├── MultiplayerGame.tsx     # Synced multiplayer rounds
│   ├── LeaderMode.tsx          # The phone as the caller
│   ├── GameOver.tsx            # Results (single + multiplayer)
│   ├── MultiplayerSetup.tsx    # Host (with deck choice) / join forms
│   ├── Lobby.tsx               # Waiting room
│   ├── DeckPicker.tsx          # Family/Masala toggle + chooser
│   ├── game/                   # Shared game UI: card, hearts, score, FLY button, effects
│   ├── IconButton.tsx          # Square captioned top-bar button
│   ├── LoginModal.tsx          # Google login prompt
│   ├── Modal.tsx               # Shared retro dialog
│   ├── Button.tsx              # Shared retro button
│   ├── Logo.tsx                # Animated title
│   └── ErrorBoundary.tsx       # Friendly crash screen
│
├── services/
│   ├── multiplayerService.ts   # Rooms + host-run synced rounds over Supabase Realtime
│   ├── audioService.ts         # Sound effects + speech
│   ├── entityService.ts        # Decks, "… उड़!" call, fair round timing
│   ├── authService.ts          # Google login helpers
│   └── supabaseClient.ts       # Supabase client (null if not configured)
│
├── contexts/UserContext.tsx    # Auth state + inactivity sign-out
├── utils/storage.ts            # High score + deck preference storage
├── src/index.css               # Tailwind + custom retro styles
│
├── public/                     # Served as-is
│   ├── sw.js                   # Service worker (offline play)
│   ├── manifest.json           # PWA manifest
│   ├── favicon.svg, icon-192.png, apple-touch-icon.png
│   └── assets/                 # emojis/ (images), sounds/ (fail sounds)
│
├── vite.config.ts
├── tsconfig.json
├── vercel.json                 # Security headers + SPA rewrite
└── .env.example                # Environment template
```

---

## 🌐 Multiplayer Under the Hood

Rooms are Supabase Realtime channels named `room-<CODE>`. **The host is the referee**: it owns the room (players, deck, status), runs the round clock, collects FLY taps and scores every round, so every player sees the same card at the same moment and gets the same result.

| Event | Sent by | Purpose |
|-------|---------|---------|
| `JOIN_REQUEST` | Joiner | Ask the host to be added |
| `ROOM_UPDATE` | Host | Full room state (players, deck, deck mode, status, matchId) |
| `JOIN_REJECTED` | Host | Room full or match already running |
| `ROUND_START` | Host | Show card N now, for D ms (and the speech rate) |
| `ANSWER` | Each player | "I tapped FLY in round N, R ms after it appeared" |
| `ROUND_RESULT` | Host | Everyone's outcome (+points, ⚡ fastest, hearts lost) and the new standings |
| `PLAYER_LEFT` | Leaving player | Quit the room |
| Presence `leave` | Supabase | Closed tab or lost connection |

- Reaction times are measured on each player's own phone, so network lag doesn't count; the host waits an extra 0.6s for answers to arrive.
- Round timing comes from `SYNC_*` in `constants.ts`; long names always get time to be heard.
- The match ends when one player is left (or the deck runs out). Ranking: last one standing, then who went out later, then score.
- Messages are rate-limited to 10/second and **queued, never dropped** (time-critical round messages skip the queue).
- A join with no host answering within 6 seconds fails with **ROOM NOT FOUND**.
- If the host leaves, the room closes and everyone is told so.

---

## ⚙️ Configuration

### Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key   # public by design; keep RLS on any tables
```

### Game Tuning (`constants.ts`)

```typescript
CARDS = [...]             // { name, hindi, canFly, emoji, why, masala? }

// Single player
INITIAL_SPEED = 1400      // ms per round at the start
MIN_SPEED = 500           // fastest round (long names still get time to be heard)
SPEED_DECREMENT = 150     // target speed-up per right answer
MAX_LIVES = 3             // starting hearts

// Multiplayer (synced)
SYNC_START_MS = 1800      // first round
SYNC_MIN_MS = 800         // fastest round
SYNC_STEP_MS = 40         // every round gets this much faster
FASTEST_BONUS = 5         // first correct FLY of a round

// Leader mode
LEADER_PACES = {          // gap between calls: start, and the fastest it gets
  slow: { startMs: 3600, minMs: 2800 },
  fast: { startMs: 2800, minMs: 2200 },
}
LEADER_SPEEDUP = 0.97     // each call comes this much sooner (the voice itself never speeds up)
```

**Adding cards:** write `name` the way kids call it out, `hindi` in Devanagari (it's shown and spoken as "… उड़!"), a short `why`, and `masala: true` for grown-up humour. In development the console warns about missing Hindi or a "why", duplicate names, and two cards that share a word or emoji but have opposite answers.

---

## 🔊 Audio & Speech

- **Effects:** synthesized with the Web Audio API (ding, click, pop, crash), plus chicken/meow clips for wrong answers.
- **Speech:** the browser's built-in voices (no API key). Every card is called the playground way, "तोता उड़!". Always uses the best on-device Hindi voice (`hi-IN`, e.g. Lekha); English voices can't pronounce "उड़". In single player and multiplayer it talks a little faster as rounds speed up; in Leader Mode it always talks at normal speed.
- **Fair timing:** a round always lasts at least long enough to hear the name and react (≈ 260ms + 64ms per Hindi character, at the current speech rate, + 0.3s).
- **No voice?** Check the 🔊 toggle and the device volume, and make sure a Hindi voice is installed (macOS: System Settings → Accessibility → Spoken Content; Windows: Settings → Time & Language → Speech). iPhones must not be on silent mode.

---

## 🔐 Security

- Content-Security-Policy and other security headers (`vercel.json`)
- Player names and room codes validated on input and on receipt
- Rate-limited realtime messages
- 30-minute inactivity sign-out
- High score obfuscated in localStorage (casual tamper protection only)
- Error boundary so a crash never shows a blank page

---

## 👥 Contributing

Found a bug? Want to add a feature? Open an issue or submit a PR!

Ideas: more cards in `constants.ts`, themed card packs, power-ups, a persistent online leaderboard, a bot opponent.

---

## 🎯 Credits

Originally inspired by the childhood game "Chidiya Udd" from Indian playgrounds.  
Modernized and reimagined for the web with love for retro gaming.

**Made with ❤️ by Chaitanya and contributors**

- **Play Live**: https://chidiyauddd.vercel.app
- 💬 LinkedIn: www.linkedin.com/in/chaitanyap03
- 📧 Email: chaitanyap.work@gmail.com

```
╔═══════════════════════════════════════════════════════════════╗
║  CHIDIYA UDD - Relive the Childhood Classic                  ║
║  Does it FLY? 🐦 You decide in milliseconds!                 ║
╚═══════════════════════════════════════════════════════════════╝
```
