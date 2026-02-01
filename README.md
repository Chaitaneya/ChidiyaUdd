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


