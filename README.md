<div align="center">
<img width="1200" height="600" alt="Chidiya Udd Poster" src="https://github.com/Chaitaneya/comp/blob/main/image.png?raw=true" />
</div>

# 🐦 Chidiya Udd - The Ultimate Bird Brain Game! 

Test your knowledge in the fastest quiz game with **real-time multiplayer action**

> **Challenge your friends. Don't let the subjects fool you!**

---

## 🎮 Core Features

✅ **Lightning-Fast Multiplayer** - Play with friends in real-time via Supabase Realtime  
✅ **Responsive Design** - Works flawlessly on mobile, tablet, and desktop  
✅ **Retro Pixel UI** - Consistent, polished 8-bit aesthetic across all screens  
✅ **Live Feedback** - 💯 Celebrate wins, 🤦 Learn from mistakes  
✅ **Heart Health System** - ❤️ Track your lives with stylized indicators  
✅ **Single & Multiplayer Modes** - Solo play or realtime competition  

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript 5.8 |
| **Build** | Vite 6.2 (⚡ 2.4s builds) |
| **Styling** | Tailwind CSS + custom retro fonts |
| **Realtime** | Supabase Realtime v2 (broadcast channels) |
| **Audio** | Web Audio API (custom sound synthesis) |
| **Animations** | Canvas Confetti (high-performance particle effects) |

### Project Structure

```
chidiyaUddV2/
├── components/
│   ├── Button.tsx              # Standardized retro button component
│   ├── GameScreen.tsx          # Main gameplay loop (single + multi)
│   ├── GameOver.tsx            # Results screen (conditional UI)
│   ├── Lobby.tsx               # Multiplayer waiting room
│   ├── MainMenu.tsx            # Entry point
│   ├── MultiplayerSetup.tsx    # Create/join rooms
│   ├── Logo.tsx                # Animated title
│   └── ...
├── services/
│   ├── multiplayerService.ts   # Multiplayer networking & sync
│   ├── geminiService.ts        # AI question generation
│   ├── audioService.ts         # Sound engine
│   └── supabaseClient.ts       # Realtime connection
├── App.tsx                     # State management & routing
├── constants.ts                # 50+ fallback game entities
├── types.ts                    # TypeScript definitions
└── ...
```

---

## 🎮 How To Play

### Single Player
1. Tap **"SINGLE PLAYER"** from the main menu
3. **Decide**: Does it FLY? 🐦 or NOT FLY? 🚫
4. Correct → +10 points (streak multiplier up to 3x)
5. Wrong → Lose 1 ❤️ (start with 3)
6. Game ends when all ❤️ are gone
7. Beat your high score! 🏆

### Multiplayer
1. Tap **"MULTIPLAYER"** → **"HOST GAME 👑"** to create a room
2. Friend taps **"JOIN GAME 🎮"** and enters your 4-character room code
3. Both are in the lobby — host taps **"START GAME ▶"**
4. Play side-by-side on the same question deck
5. Real-time leaderboard shows who's winning
6. Last player with ❤️ wins! 🎉
7. **New**: Players can **BACK TO LOBBY** for instant rematches

---

## 🎨 UI Design System

### Retro Pixel Aesthetic

The entire app uses a consistent **8-bit inspired design language**:

**Button System**
- Standardized buttons with 4px hard borders (no rounded corners)
- Solid drop shadows for depth (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- Active state: button "presses" down (translate-y moves down, shadow disappears)
- Disabled state: opacity 50%, grayed out
- Emoji icons vertically centered with `-translate-y-[2px]` adjustments
- All buttons use `font-retro` (VT323 fallback)

Example:
```jsx
<Button variant="primary" onClick={handleStart}>
  <span className="-translate-y-[2px]">▶</span>
  <span>START GAME</span>
</Button>
```

**Color Palette**
- Primary Actions: Blue (`bg-blue-600`)
- Secondary Actions: White (`bg-white text-black`)
- Success/Achievements: Green
- Warnings/Losses: Red
- Text: White on dark backgrounds, black on light
- Accents: Yellow (`text-yellow-400`) for headers

**Typography**
- Headers: VT323 font (monospace pixel font)
- Body: `font-retro` class (system fallback)
- All text uses `uppercase` and `tracking-wide` for authentic 8-bit feel

**Alignment Fixes** ✨
- Emoji icons: Vertically centered in buttons (`flex items-center`)
- Leaderboard headers: Perfectly centered in container bar
- Player list headers: Vertically balanced
- Section headers: Consistent padding and font sizing

### Screen Components

**Main Menu** 
- Centered title (Chidiya Udd logo)
- Two action buttons: Single Player + Multiplayer
- Responsive scaling on mobile devices
- Clean white text on dark background

**Multiplayer Setup**
- "HOST GAME 👑" button (create new room)
- "JOIN GAME 🎮" button (with room code input)
- Back button (arrow icon, no box)
- Consistent alignment with Main Menu

**Multiplayer Lobby**
- Room code display (large yellow monospace text)
- Player list with status indicators:
  - 👑 Host designation
  - 🕹️ Regular player
  - 🟢 Status dot (alive = pulsing green)
- "START GAME ▶" button (host only, enabled if entities loaded)
- Back button for leaving

**Game Over Screen**

*Single Player:*
- High score display with optional 🎉 confetti animation
- Leaderboard (just your score)
- Two buttons: "TRY AGAIN" (1P) + "BACK TO MENU" 🏠

*Multiplayer:*
- Final Standings header (🏁 flag icon, centered)
- Leaderboard with ranking medals: 🥇 🥈 🥉
- Two buttons: "BACK TO LOBBY" (👥) + "BACK TO MENU" 🏠
- Room is kept alive for instant rematch

---

## 🔄 Multiplayer Architecture

### Real-Time Synchronization

**Connection Flow:**
1. Host creates room → Channel subscription established
2. Players join → Send JOIN_REQUEST after confirming channel is ready
3. Host broadcasts ROOM_UPDATE (status, entities, player list)
4. Game starts → Both clients sync player states (score, lives)
5. Game ends → Room status becomes "finished" (host detects all eliminated)
6. All clients receive room.status='finished' → Display synchronized leaderboard

**Key Events** (Broadcast via Supabase):
- `ROOM_UPDATE` - Room state changed (players, entities, status)
- `JOIN_REQUEST` - Player joined (with name/ID)
- `PLAYER_STATE` - Score/lives update (debounced 100ms)
- `PLAYER_LEFT` - Player disconnected
- `PLAYER_HEARTBEAT` - Alive ping (2s interval, 6s timeout)

**State Management:**
- MultiplayerService: Singleton managing all networking
- Room is source of truth (not local client decisions)
- Debounced updates prevent network flooding
- Proper async/await prevents race conditions

### Host vs Non-Host Logic

**Host Responsibilities:**
- Creates room and game entities
- Detects when all players are eliminated → broadcasts room.status='finished'
- Other than game logic, mostly transparent to players

**Both Players:**
- Answer questions in real-time
- State synced automatically (score, lives)
- See live multiplayer leaderboard during gameplay
- See same Game Over screen with identical rankings

### Behind The Scenes

**Services:**
- `multiplayerService.ts` - Connection, joining, state sync, heartbeat
- `supabaseClient.ts` - Realtime channel setup (env-based credentials)
- `geminiService.ts` - AI question generation (fallback to hardcoded entities)
- `audioService.ts` - Click sounds, feedback tones

**Configuration:**
- `.env` file (not committed) → Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`
- `.env.example` → Template reference

---

## 🔧 Setup & Development

### Prerequisites
- Node.js v16+ (v18+ recommended)
- npm or yarn

### Installation

```bash
# 1. Clone and install
git clone <repo-url>
cd chidiyaUddV2
npm install

# 2. Configure environment
cp .env.example .env

# Then edit .env with your keys:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_api_key

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output: `dist/` folder (optimized for deployment)

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build (Vite optimized) |
| `npm run preview` | Preview production build locally |

---

## ✨ Recent Improvements

### Multiplayer Synchronization (v2.0)

**Fixed Game Over Synchronization**
- **Before**: Each player independently decided when the game ended → Different screens
- **After**: Host detects all-eliminated state → broadcasts room.status='finished' → All players show identical leaderboard

**Fix Details:**
- Added `checkGameOver()` method in multiplayerService
- GameScreen now watches for `mpRoom?.status === 'finished'`
- Prevents race conditions with proper async/await in join flow

**Lobby Improvements**
- Host can start game **even if players leave** ✅
- Removed "waiting for players" blocking logic
- Display updates in real-time as players join/leave
- Proper subscription cleanup (no memory leaks)

**Post-Game UX**
- **"BACK TO LOBBY"** button (multiplayer only) → Returns to lobby, room stays alive
- **"BACK TO MENU"** button → Cleanly disconnects, returns to main menu
- Single-player unchanged (TRY AGAIN + BACK TO MENU)

### UI Polish

**Button System Standardization**
- All buttons use consistent styling (font, size, colors, shadows)
- Emoji alignment fixed across all screens
- Hover and active states work uniformly
- Disabled states clearly indicated (50% opacity)

**Alignment Fixes**
- Player list headers ("PLAYERS (n)") centered vertically
- Leaderboard 🏁 icon properly spaced
- Button emojis aligned with text (-translate-y-[2px])
- Start button, home icon, all UI elements aligned

**Visual Improvements**
- Confetti animation only on high scores (single-player)
- "TOP SCORE" text now yellow for visibility
- Consistent shadow styling across all UI elements
- Responsive scaling on mobile devices

### Stability & Performance

**Network Optimization**
- Debounced state updates (100ms batching) → reduced traffic
- Heartbeat system monitors connection (2s ping, 6s timeout)
- Proper event handler cleanup prevents listener accumulation
- Race condition fixed in join flow (await channel subscription)

**Code Quality**
- Removed OffscreenCanvas misuse (confetti stability)
- Standardized error handling and validations
- TypeScript strict mode compliance
- Build time: ~2.4 seconds (135 modules)

---

## 🎯 Gameplay Mechanics

**Entities:** 50+ unique items (birds, animals, objects, vehicles)
- Each has Hindi translation (Hinglish dataset)
- AI can generate new variations
- Fallback list if API fails

**Scoring System:**
- Correct answer: +10 points
- Streak multiplier (up to 3x): consecutive correct answers boost
- High score tracked per session
- Multiplayer leaderboard sorts by points

**Lives System:**
- Start with 3 ❤️ (hearts)
- Wrong answer → lose 1 ❤️
- Game ends at 0 ❤️ (you lose)
- Displayed live during gameplay

**Time System:**
- ~5 seconds per question (automatic timeout)
- No countdown timer shown (implicit)
- Feedback: CORRECT ✅ / WRONG ❌

---

## 📋 Known Limitations & Future Enhancements

**Current State:**
- Questions are on-demand (no pre-generated deck limit)
- Offline multiplayer not supported (requires Supabase)
- Spectator mode not implemented
- No persistent match history

**Future Roadmap:**
- 🧹 Clean/validate Hinglish dataset for better questions
- ⚡ Optimize for large multiplayer lobbies
- 🏆 Background music (orchestral 8-bit)
- 💾 Database storage for match history
- 👀 Spectator mode for eliminated players

---

## 🐛 Troubleshooting

**WebSocket Connection Errors:**
- Verify Supabase credentials in `.env` are correct
- Check Supabase project is active (not paused)
- Try refreshing page or hard reset (Ctrl+Shift+R)

**Questions Not Loading:**
- Check Gemini API key is valid and has quota remaining
- App will fall back to hardcoded entity list if API fails
- Verify `GEMINI_API_KEY` in `.env`

**Multiplayer Not Working:**
- Both players need valid Supabase credentials
- Room code must be entered exactly (case-sensitive)
- Try leaving and recreating the room
- Check network connection is stable

**Audio Not Playing:**
- Some browsers require user interaction before audio works
- Try clicking on game element first, then starting game
- Check browser audio settings (not muted)

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables in project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Deploy (auto-builds with `npm run build`)

### Other Platforms

Build command: `npm run build`  
Output directory: `dist/`

---

## 📄 License

[See LICENSE file](./LICENSE)

---

## 🙏 Credits

Built with ❤️ and 🐦  
Powered by React, Tailwind, Supabase, and Google Gemini AI

**Team** · Chaitaneya & Contributors

---

## 📞 Support

Questions or bug reports? Open an issue on GitHub!

**Last Updated:** March 2026  
**Build:** ✅ Production Ready (135 modules, 450KB minified)

### 🐛 Bugs Squashed
| Issue | Fix |
|-------|-----|
| 🔇 Silent audio on Android | Resume/warmup on user interactions |
| 📱 Non-responsive UI | Applied responsive breakpoints (sm/md/lg) across all components |
| 📜 Title overflow on mobile | Fixed with adaptive padding & scaling |
| ⬛ Quit dialog = full black screen | Changed fixed → absolute positioning |

### ✨ New Polish
- 💖 Health system: boxes → **heart emojis** (❤️/🖤)
- 🎯 Feedback animations: **💯 burst** on correct, **🤦 facepalm** on wrong
- 🔌 **Mock mode** for offline Supabase testing
- 💓 **Heartbeat system** for multiplayer stability (2s send, 6s timeout)

---

### ✅ Changes Made – Summary (for README)
🎮 Main Menu

Fixed title overflow: Reduced and stabilized the “Chidiya Udd” logo sizing so it no longer goes out of bounds on small screens.
Button consistency:
Single Player & Multiplayer buttons now use:
Same font
Same font size
Same emoji size
Same vertical alignment
Icon alignment: Emojis inside buttons were vertically centered and visually balanced.

🧑‍🤝‍🧑 Multiplayer Setup Screen (MultiplayerSetup.tsx)

Button alignment cleanup:
“HOST GAME 👑” and “JOIN GAME 🎮” buttons now match Main Menu alignment and spacing.
Back button polish:
Removed the outer box/border around the back arrow.
Back button is now icon-only, consistent with other screens.
Position fixed to be consistent across screens.

🏟️ Multiplayer Lobby (Lobby.tsx)

Back button fix:
Back button position aligned exactly with Multiplayer Setup screen (same coordinates).
Players list header alignment:
“PLAYERS (n)” title was too high — moved to visual center of the container.
General spacing polish:
Improved vertical rhythm inside the lobby card for better balance.

🎯 In-Game Screen (GameScreen.tsx)

Multiplayer connection indicator:
The “connection / exit” label near the exit button was identified as multiplayer UI state.
Shifted slightly downward so it doesn’t feel glued to the top edge.
Leaderboard position tweak:
Multiplayer live leaderboard moved down a bit to avoid overlapping the HUD.

💥 Game Over Screen (GameOver.tsx)
Single Player

Confetti animation added 🎉
Triggers only when a new high score is achieved.
Fires from left and right inside the play area (not outside overlay).
High score flicker removed:
Removed slow flickering animation from the “High Score” badge.
Shadow consistency:
“NEW RECORD” text shadow changed from white → black (to match buttons).
Top score visibility:
“TOP SCORE” text changed from grey → yellow.
Slightly increased font size for better visibility.
Multiplayer
Final Standings header icon fix:

🏁 flag icon is now:

Properly centered vertically
Slightly larger for visual balance
Back to Menu button icon fix:
Removed boxed background behind 🏠 emoji.
Increased home emoji size.
Vertically aligned emoji with text for a clean pixel-UI look.
Buttons
Two-button layout added:
TRY AGAIN → restarts game immediately (single player).
BACK TO MENU → returns to main menu.
Buttons aligned exactly like Main Menu buttons (same spacing & style).

🧠 App Logic (App.tsx)
Fixed Try Again behavior:
Previously: “Try Again” sent player back to Main Menu.

Now:

Try Again → restarts the game directly.
Back to Menu → exits cleanly to Main Menu.
Separated handlers:
onTryAgain and onBackToMenu introduced for safety and clarity.
High score handling preserved (no logic break).

🧹 Bug Fixes / Stability

Resolved canvas-confetti errors:
Removed OffscreenCanvas misuse.
Prevented canvas resizing after initialization.
Ensured confetti stays inside the game container.
Prevented multiplayer screens from breaking single-player logic.

## 📋 Still To Do

- 🧹 Clean HINGLISH dataset for better questions
- ⚡ Performance optimization for large multiplayer lobbies
- 🏆 Background music

---

## 🏗️ Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS** for styling
- **Vite** for blazing-fast builds
- **Supabase Realtime v2** for multiplayer
- **Google Gemini API** for AI questions
- **Web Audio API** for sounds

---

## 🎯 How to Play

1. **Single Player** - Answer AI-generated questions before time runs out
2. **Multiplayer** - Create or join a room and compete with friends in real-time
3. **Survive** - Keep your ❤️ alive through multiple rounds
4. **Win** - Be the last one standing!

---

**Made with 🐦 and 💜 by the Chidiya Udd team**


