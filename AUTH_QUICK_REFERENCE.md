# Quick Reference - Auth Implementation

## 📦 New Files
- `services/authService.ts` - Auth operations
- `contexts/UserContext.tsx` - User state + hooks
- `components/LoginModal.tsx` - Login UI

## 🔧 Modified Files
- `App.tsx` - Wrapped with UserProvider
- `components/MainMenu.tsx` - Added auth controls

## 🪝 Using Auth in Components

```typescript
import { useUser } from '../contexts/UserContext';

// In your component:
const { session, isLoading, signInWithGoogle, signOut } = useUser();

// Check if logged in
if (session) {
  console.log('User:', session.user?.email);
}
```

## 🚀 Key Imports

```typescript
// Using auth
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';

// Auth flow
const { session, signInWithGoogle, signOut } = useUser();
await signInWithGoogle();  // Opens Google OAuth
await signOut();            // Logs out user
```

## 📋 Gating Logic (Multiplayer Example)

```typescript
const handleMultiplayerClick = () => {
  if (!session) {
    // Not logged in - show login modal
    setShowLoginModal(true);
    return;
  }
  
  // Logged in - proceed to multiplayer
  onMultiplayer();
};
```

## 🎯 Common Tasks

### Check if user is logged in
```typescript
const { session } = useUser();
if (session) { /* logged in */ }
```

### Get user email
```typescript
const email = session?.user?.email;
```

### Get username from email
```typescript
const username = session?.user?.email?.split('@')[0];
```

### Trigger logout
```typescript
const { signOut } = useUser();
await signOut();
```

## 🔐 Protected Features Pattern

```typescript
// Template for gating any feature behind login
const handleFeatureClick = () => {
  if (!session) {
    setShowLoginModal(true);
    return;
  }
  // Feature code here
};

// Button
<Button
  onClick={handleFeatureClick}
  disabled={!session}
>
  {!session ? '🔒 Feature' : 'Feature'}
</Button>
```

## 🎨 Styling Pattern

Existing modal is used for login:
```typescript
<LoginModal
  open={showLogin}
  onClose={() => setShowLogin(false)}
  onGoogleClick={signInWithGoogle}
  isLoading={isLoading}
/>
```

## ⚙️ Deployment Checklist

- [ ] Supabase credentials in `.env`
- [ ] Google OAuth configured in Supabase
- [ ] Build passes: `npm run build`
- [ ] Test single player (no login)
- [ ] Test multiplayer login flow
- [ ] Test logout

## 📚 Related Files

- Auth service: `services/authService.ts`
- Context + hooks: `contexts/UserContext.tsx`
- Login modal: `components/LoginModal.tsx`
- Main menu: `components/MainMenu.tsx`
- App wrapper: `App.tsx`

## 💡 Tips

- Session state updates in real-time via Supabase listener
- Auth loading state available for UI feedback
- Modal design matches existing retro theme
- No breaking changes to existing game logic
