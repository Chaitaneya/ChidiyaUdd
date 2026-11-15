# 🏗️ Project Structure

The full file tree is in the [README](README.md#-project-structure). This page covers where things go when you change the game.

## Layout

- **`components/`** holds the screens: `MainMenu`, `GameScreen` (single player), `MultiplayerGame` (synced rounds), `LeaderMode`, `GameOver`, `MultiplayerSetup`, `Lobby`. Import components directly, e.g. `import Button from './components/Button'`.
- **`components/game/`** holds the pieces every game screen shares, so all modes look the same: `GameCard` (emoji, name, Hindi line, timer, 💡 note), `Hud` (hearts, score), `FeedbackText`, `FlyButton`, `Effects` (feathers/smoke).
- **Shared UI:** `Button`, `IconButton` (square captioned top-bar button), `Modal`, `RuleList` (numbered rules with a hanging indent), `SegmentedControl` (two-option switch with one description line), `DeckPicker` (Family/Masala toggle and chooser), `Logo`, `LoginModal`, `ErrorBoundary`. Top-bar captions all use `CAPTION` from `game/Hud.tsx` so they line up.
- **`services/`** holds logic with no UI: multiplayer rooms and the host's round loop, audio/speech, decks and timing, auth, the Supabase client.
- **`contexts/UserContext.tsx`** is the login state shared across screens.
- **`App.tsx`** decides which screen is shown (`GameState` in `types.ts`), remembers the chosen deck, and follows the multiplayer room to move players between lobby, game and results.
- **`src/index.css`** holds Tailwind plus the custom retro classes (`theme-bg`, `scanlines`, `wiggle`, feather/smoke effects) and theme tokens (`font-retro`, `font-vt323`, `font-hindi`, `animate-pop-in`, `animate-shake`, `animate-fade-in`, `animate-slide-up`).
- **`public/`** is copied to the site root unchanged: `sw.js` (offline), manifest, icons, images, sounds.

## Common Changes

| To... | Edit |
|-------|------|
| Add or change cards | `CARDS` in `constants.ts`: `name` (how kids call it out), `hindi` (Devanagari, shown and spoken as "… उड़!"), `canFly`, `emoji`, a short `why`, and `masala: true` for grown-up humour. Follow the house rules at the top of the file. |
| Tune difficulty | Single player `INITIAL_SPEED`/`MIN_SPEED`/`SPEED_DECREMENT`, multiplayer `SYNC_*`, leader mode `LEADER_*`, all in `constants.ts` |
| Add a screen | New component in `components/`, a `GameState` value in `types.ts`, a branch in `App.tsx` |
| Add a popup | Wrap content in `components/Modal.tsx` so it matches the others |
| Change how names are spoken | `getCall` / `minRoundMs` in `services/entityService.ts`; voice choice in `services/audioService.ts` (always the best Hindi voice; English voices can't say "उड़") |
| Add a multiplayer message | `services/multiplayerService.ts` (`enqueue` for room state, `sendNow` only for time-critical round messages) |
| Change what works offline | `public/sw.js` (bump `VERSION` after editing it) |

## UI Conventions

- Retro look: no rounded corners, `border-4 border-black`, hard shadows like `shadow-[4px_4px_0_0_#000]`, `font-retro` for labels.
- Use `Button` for main actions, `IconButton` in top bars and `Modal` for dialogs; back navigation is the `←` in the top-left corner.
- Pick colourful emoji for small buttons. Some of Apple's emoji are grey by design (👨‍👩‍👧 🔊 👥 📢) and look washed out at 18px. Add the invisible "emoji style" character `U+FE0F` (VS16) after symbols like ☕ so they render in colour instead of as a plain text glyph.
- Start audio from a click handler (`audio.unlock()`) so sound and speech work on iOS.
