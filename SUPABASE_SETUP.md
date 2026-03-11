# Supabase Setup Guide for Chidiya Udd Multiplayer

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New project"**
4. Fill in the project details:
   - **Name**: `chidiya-udd` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click **"Create new project"** and wait for it to initialize

## Step 2: Get Your Credentials

1. Once your project is ready, go to **Settings** → **API** (left sidebar)
2. You'll see:
   - **Project URL** - Copy this (looks like `https://your-project.supabase.co`)
   - **Anon public key** - Copy this (starts with `eyJ...`)

## Step 3: Update Environment Variables

1. Open `.env` in your project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
GEMINI_API_KEY=AIzaSyAVIfaNjQ5C7qbEby7ArBO43OsZEE3oJok
```

**Important:** 
- `VITE_` prefix allows Vite to expose these to the browser (safe - anon key is public-readable)
- Never commit `.env` to git (it's in `.gitignore`)
- The credentials are for development/testing

## Step 4: Restart Your Dev Server

```bash
npm run dev
```

The dev server will reload automatically. Check the console:
- ✅ No more WebSocket errors
- ✅ Multiplayer connect button should work
- ✅ Realtime messages should flow

## Step 5: Test Multiplayer

1. **Host**: Click "MULTIPLAYER" → "HOST GAME" → Enter name → "CREATE ROOM"
2. **Player**: Open another browser tab/window
   - Click "MULTIPLAYER" → "JOIN GAME" → Enter name and room code → "ENTER ROOM"
3. Both should appear in the lobby
4. Host clicks "START GAME"
5. Both transition to gameplay

## Troubleshooting

### Still getting "ERR_NAME_NOT_RESOLVED"?
- 🔍 Check `.env` file - credentials must be set
- 🔍 Check credentials are exactly as shown in Supabase dashboard
- 🔍 Restart dev server after `.env` changes
- 🔍 Check console for missing credentials warning

### Seeing "CHANNEL_ERROR" or "TIMED_OUT"?
- 🔍 Verify Supabase URL is correct (no typos)
- 🔍 Check anon key is correct
- 🔍 Make sure Realtime is enabled (should be by default)
- 🔍 Check browser has internet connection

### Can players see each other in lobby?
- ✅ Supabase Realtime is working
- ✅ Broadcasting is functional

### Players not getting score updates?
- 🔍 Check if Gemini API is working (for entity generation)
- 🔍 Look for errors in browser console
- 🔍 Reload and rejoin room

## File Changes

- **`.env`** - Add Supabase credentials
- **`.env.example`** - Template (commit this to git, not `.env`)
- **`services/supabaseClient.ts`** - Now reads from environment variables

## Security Notes

- ✅ **Anon key is public** - Exposed in browser is normal for Supabase
- ✅ **Row-level security** - Configure in Supabase dashboard if storing data
- ✅ **Never use service role key** - That's for server-side only
- ✅ **Realtime broadcast** - No database queries, fully ephemeral

## Next Steps

- Monitor [Supabase Dashboard](https://supabase.com/dashboard) for usage
- Set up security rules if adding database tables
- Consider adding RLS (Row Level Security) policies
- Review Realtime quotas on your plan

---

**Status**: Ready for multiplayer testing! 🎮
