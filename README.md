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

**Chidiya Udd** is a lightning-fast quiz game where you compete in **real-time multiplayer battles**. Call out entities, make split-second decisions, and prove you're the ultimate Chidiya expert!

- 🏃 **Millisecond Reflexes** - Make decisions in milliseconds or lose a heart
- 🎯 **Streak Multiplier** - Get consecutive answers right to multiply your score
- 👥 **Real-Time Multiplayer** - Play with friends instantly (no waiting!)
- 🕹️ **Retro Aesthetic** - Pixel-perfect UI inspired by 8-bit gaming
- 🗣️ **Hindi Narration** - Hear entity names pronounced in Indian accent
- 📱 **Fully Responsive** - Play on phone, tablet, or desktop

---

## 🎮 How to Play

### Single Player
1. Click **"SINGLE PLAYER"**
2. An entity appears on screen
3. **FLY?** → Tap the **FLY!** button
4. **NOT FLYING?** → Wait (don't tap!)
5. Get it right = +10 points (×streak multiplier)
6. Get it wrong = -1 ❤️
7. Game over when you lose all 3 hearts

### Multiplayer
1. Click **"MULTIPLAYER"** (requires Google login)
2. **HOST**: Create a room → Share room code
3. **PLAYER**: Join room with code
4. Host starts the game
5. Same rules, but compete **live** against friends!
6. See real-time scores on the leaderboard
7. Last one standing wins! 🏆

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Chaitaneya/chidiyauddd.git
cd chidiyaUddV2

# Install dependencies
npm install

# Setup environment (copy .env.example to .env and add Supabase keys)
cp .env.example .env

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 📋 Features

| Feature | Status |
|---------|--------|
| Single Player Mode | ✅ |
| Multiplayer (Real-time) | ✅ |
| Google Authentication | ✅ |
| Retro Pixel UI | ✅ |
| Responsive Design | ✅ |
| High Score Encryption | ✅ |
| Session Timeout Security | ✅ |
| Sound Effects | ✅ |
| Mobile Optimized | ✅ |

---

## 🛠️ Tech Stack

```
Frontend:    React 19 + TypeScript + Vite
Styling:     Tailwind CSS
Backend:     Supabase (Realtime + Auth)
Auth:        Google OAuth 2.0
Hosting:     Vercel (Static SPA)
Realtime:    Supabase Broadcast Channels
```

---

## 📦 Project Structure

```
components/
  ├── screens/       ← Full-page views (MainMenu, GameScreen, etc.)
  ├── common/        ← Reusable UI components (Button, Logo, etc.)
  └── modals/        ← Dialog modals (LoginModal)
services/          ← Business logic (auth, multiplayer, audio)
contexts/          ← Global state management (UserContext)
utils/             ← Helper functions (encrypted storage)
public/            ← Static assets (images, sounds)
docs/              ← Documentation (setup, deployment, security)
```

---

## 🔐 Security Features

✅ Encrypted high score storage  
✅ 30-minute session timeout  
✅ Input validation (XSS prevention)  
✅ Rate limiting on realtime broadcasts  
✅ CORS & CSP security headers  
✅ Error boundary component  
✅ OAuth redirect validation  

---

## 🎮 Demo

### Single Player
- Start game
- Answer correctly to build streaks
- Earn points, break high scores

### Multiplayer
- Login with Google
- Create or join a room
- Play simultaneously with friends
- Real-time leaderboard updates
- Compete to be the last one standing

---

## 👥 Contributing

Found a bug? Want to add a feature? Please open an issue or submit a PR!


---

## 🎯 Credits

Originally inspired by the childhood game "Chidiya Udd" from Indian playgrounds.  
Modernized and reimagined for the web with love for retro gaming.

**Made with ❤️**

---

## 🔗 Links

- **Play Live**: https://chidiyauddd.vercel.app
- **Report Issues**: GitHub Issues

---

```
╔═══════════════════════════════════════════════════════════════╗
║  CHIDIYA UDD - Relive the Childhood Classic                  ║
║  Does it FLY? 🐦 You decide in milliseconds!                 ║
╚═══════════════════════════════════════════════════════════════╝
```


## 🎯 How to Play

### Single-Player Mode

1. **Select "SINGLE PLAYER"** from main menu
2. **Listen** - Hear entity name via text-to-speech (English or Hindi)
3. **Decide** - Click the card or tap screen
4. **React** - Tap **"FLYING 🐦"** if it can fly, or **wait** for timeout
5. **Score**
   - ✅ Correct → +10 points × streak multiplier (max 3×)
   - ❌ Wrong → Lose 1 ❤️
6. **Game Over** when all 3 hearts are gone
7. **New High Score?** Get confetti celebration 🎉

### Multiplayer Mode (1v1)

1. **HOST** clicks **"HOST GAME 👑"**
   - Enter your name
   - Get unique 4-character room code (e.g., **A1B2**)
   - Share code with friend

2. **JOINER** clicks **"JOIN GAME 🎮"**
   - Enter name
   - Enter room code
   - Both appear in waiting lobby

3. **LOBBY**
   - See opponent's name and status
   - Sound plays when second player joins
   - Host clicks **"START GAME ▶"**

4. **GAMEPLAY**
   - Same entities shown to both players
   - Both answer independently
   - Scores update in real-time
   - ⚠️ Player with 0 hearts is eliminated

5. **WINNER** - Last player alive wins! 🏆
   - See final leaderboard with both scores
   - Instant rematch option or back to menu

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React 19.2 | UI framework & state management |
| **Language** | TypeScript 5.8 | Type safety |
| **Build Tool** | Vite 6.2 | Lightning-fast development & production builds |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Fonts** | Press Start 2P, VT323 | Retro pixel aesthetic |
| **Realtime** | Supabase v2 | WebSocket broadcast channels |
| **Audio** | Web Audio API + Speech Synthesis | Sound effects & text-to-speech |
| **Effects** | Canvas Confetti | Celebration animations |
| **Hosting** | Vercel | Automatic deployment |

### Why This Stack?

- **React 19** - Latest stable version with hooks & concurrent features
- **TypeScript** - Catch bugs at compile-time, better IDE support
- **Vite** - Sub-second dev server, optimized production builds
- **Supabase Realtime** - Production-grade WebSocket channels, no backend needed
- **Web Audio API** - Synthesized sounds (no large audio files)
- **Speech Synthesis** - Cross-platform TTS, supports Indian voice packs

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Component Layer                 │
│  MainMenu → GameScreen → GameOver │ MultiplayerSetup   │
│                         ↕                                │
├─────────────────────────────────────────────────────────┤
│                   Services (Business Logic)              │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  multiplayer   │  │   audioSvc   │  │  geminiSvc  │  │
│  │   Service      │  │              │  │  (shuffle)  │  │
│  └────────────────┘  └──────────────┘  └─────────────┘  │
│         ↓                 ↓                      ↓        │
├─────────────────────────────────────────────────────────┤
│                 External Services                        │
│  ┌──────────────────────────────┐  ┌────────────────┐   │
│  │  Supabase Realtime Channels  │  │  Web Audio API │   │
│  │  (Broadcasting, Auth)        │  │  Speech API    │   │
│  └──────────────────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Component Structure

```
App.tsx (Root - State Manager & Router)
├── MainMenu.tsx (Start screen + rules)
├── MultiplayerSetup.tsx (Create/join room)
├── Lobby.tsx (Waiting room)
├── GameScreen.tsx (Core gameplay loop)
├── GameOver.tsx (Results screen)
└── Button.tsx (Reusable retro button)
```

### State Flow

```
Single-Player:
  START → Shuffle deck → PLAYING → Evaluate each round → 
  Update score/lives → GAME_OVER → TRY AGAIN or MENU

Multiplayer:
  CREATE ROOM → LOBBY (wait for player) → 
  START GAME → PLAYING (real-time sync) → 
  GAME_OVER when both players [0 lives] → REMATCH or MENU
```

---

## 📁 Project Structure

```
chidiyaUddV2/
├── index.tsx                    # React entry point
├── index.html                   # HTML template
├── App.tsx                      # Main app & router
├── types.ts                     # TypeScript interfaces
├── constants.ts                 # Game entities (60 cards)
│
├── components/                  # React components
│   ├── MainMenu.tsx            # Start screen
│   ├── GameScreen.tsx          # Gameplay loop
│   ├── GameOver.tsx            # Results screen
│   ├── MultiplayerSetup.tsx    # Room creation/joining
│   ├── Lobby.tsx               # Multiplayer waiting room
│   ├── Button.tsx              # Retro button component
│   ├── Logo.tsx                # Title graphic
│   ├── LoginModal.tsx          # Auth modal (prepared)
│   └── ...
│
├── services/                    # Business logic
│   ├── multiplayerService.ts   # Realtime room sync
│   ├── audioService.ts         # Audio engine
│   ├── supabaseClient.ts       # Supabase setup
│   ├── authService.ts          # Auth functions
│   └── geminiService.ts        # Utilities (shuffle)
│
├── contexts/                    # State management
│   └── UserContext.tsx         # Auth state
│
├── public/
│   └── assets/
│       ├── emojis/            # ChidiyaUdd.gif
│       └── sounds/            # CHICKEN.m4a, MEOW.m4a
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts              # Vite config
├── index.html                  # PWA manifest link
├── manifest.json               # PWA settings
├── vercel.json                 # Vercel deployment
└── .env.example                # Environment template
```

---

##  Game Features

### ✅ Single-Player Features
- [x] Deck of 100 entities (animals, objects, Indian slang)
- [x] Entity randomization
- [x] Text-to-speech with Hindi/Indian accent
- [x] Progressive speed increase (4s → 0.6s per round)
- [x] Streak multiplier (1× → 3×)
- [x] Lives system (start with 3 ❤️)
- [x] High score persistence (localStorage)
- [x] Pause/Resume gameplay
- [x] Audio mute toggle
- [x] Visual feedback (feather particles on win, smoke on fail)
- [x] Responsive mobile design
- [x] PWA installable

### ✅ Multiplayer Features
- [x] Real-time room creation (4-char codes)
- [x] Real-time player joining (WebSocket sync)
- [x] Google OAuth enforcement for multiplayer
- [x] Shared entity deck (fairness)
- [x] Live score/lives sync
- [x] Heartbeat monitoring (connectivity check)
- [x] Game-over detection (all players eliminated)
- [x] Instant rematch (no re-join needed)
- [x] Player status tracking (alive/eliminated)
- [x] Leaderboard on results screen


### ⏳ Future Enhancements (Not Yet Implemented)
- [ ] AI entity generation (Gemini API)
- [ ] Matchmaking/random pairing
- [ ] Spectating mode
- [ ] Power-ups (double points, extra time)
- [ ] Achievements & badges
- [ ] Persistent leaderboard
- [ ] Custom entity packs
- [ ] Sound settings UI

---

##  Audio Design

### Sound Effects (Web Audio API Synthesis)
- **Success** 🎵 - C5 → E5 ding-ding
- **Click** - 800Hz blip
- **Pop** - 400Hz triangle tone
- **Fail** - Random: chicken squawk or meow
- **Crash** - Sawtooth pitch drop (game over)

### Text-to-Speech (Web Speech API)
- **Priority:** Hindi (hi-IN) → English India (en-IN) → English fallback
- **Voices:** Auto-detects Indian voice pack (Lekha, Rishi, Neerja, Hemant)
- **Rate:** 0.9 (slower, clearer pronunciation)
- **Supported:** Both entity names and Hindi translations

---

##  Network Architecture (Multiplayer Deep Dive)

### Supabase Realtime Events

```typescript
// HOST broadcasts room state
{
  event: 'ROOM_UPDATE',
  payload: { room: { code, players[], status, entities[] } }
}

// JOINER sends join request
{
  event: 'JOIN_REQUEST',
  payload: { player: { id, name, isHost, score, lives } }
}

// Each player sends score/lives (debounced 100ms)
{
  event: 'PLAYER_STATE',
  payload: { playerId, score, lives, status }
}

// Heartbeat every 5 seconds (connectivity check)
{
  event: 'PLAYER_HEARTBEAT',
  payload: { playerId, timestamp }
}
```

### Game-Over Detection

```
Player 1 lives → 0
PLAYER_STATE broadcast
↓
Player 2 receives → updates room
↓
checkGameOver() → all alive players = 0?
↓
room.status = 'finished'
↓
ROOM_UPDATE broadcast
↓
Both clients call onGameOver()
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file:

```bash
# Required - Get from Supabase Dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUxxxxxxxxxxxxxxxIkpXVCJ9...

# Optional - For Google OAuth (future)
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### Game Constants (in `constants.ts`)

```typescript
// Adjust game difficulty here
INITIAL_SPEED = 4000      // 4 seconds per round
MIN_SPEED = 600           // Fastest: 0.6 seconds
SPEED_DECREMENT = 80      // Speed increase per streak level
MAX_LIVES = 3             // Starting hearts
FALLBACK_ENTITIES = [...]  // 100 cards
```

---

## 🤝 Contributing

Want to add features? Fork and submit a PR!

### Ideas for Contributors
- [ ] Add more entities to constants.ts
- [ ] Create entity packs (Christmas, Animals, Indian Foods)
- [ ] Implement power-ups
- [ ] Add leaderboard backend
- [ ] Create a bot opponent
- [ ] Add accessibility features
- [ ] Improve TTS voice selection

---

## 📞 Get in Touch

- 💬 Linkedin: www.linkedin.com/in/chaitanyap03
- 📧 Email: chaitanyap.work@gmail.com


---

**Made for the love of Indian childhood games.**
