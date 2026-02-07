<div align="center">
<img width="1200" height="600" alt="Chidiya Udd Poster" src="https://github.com/Chaitaneya/comp/blob/main/image.png?raw=true" />
</div>

# 🐦 Chidiya Udd - The Ultimate Bird Brain Game! 

Test your knowledge in the fastest bird quiz game with **real-time multiplayer action**, powered by Google's Gemini AI! 🤖✨

> **Challenge your friends. Don't let the birds fool you!**

---

## 🎮 Features

✅ **Lightning-Fast Multiplayer** - Play with friends in real-time  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Live Feedback** - 💯 Celebrate wins, 🤦 Learn from mistakes  
✅ **Heart Health System** - ❤️ Track your lives in style  

---

## 🚀 Quick Start

**Prerequisites:** Node.js (v16+)

```bash
# 1. Install dependencies
npm install

# 2. Set your Gemini API key in .env.local
GEMINI_API_KEY=your_api_key_here

# 3. Start the dev server
npm run dev
```

🌐 Open `http://localhost:3000` and start playing!

---

## 🔧 Recent Fixes & Updates

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


