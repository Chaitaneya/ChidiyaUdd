import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import IconButton from './IconButton';
import { audio } from '../services/audioService';
import Logo from './Logo';
import Modal from './Modal';
import RuleList from './RuleList';
import LoginModal from './LoginModal';
import { DeckToggle, DECK_INFO } from './DeckPicker';
import { useUser } from '../contexts/UserContext';
import { getSessionDisplayName } from '../services/authService';
import { DeckMode } from '../types';

interface MainMenuProps {
  onStart: () => void;
  onMultiplayer: () => void;
  onLeader: () => void;
  highScore: number;
  isSplashActive: boolean;
  deckMode: DeckMode;
  onDeckModeChange: (mode: DeckMode) => void;
}

/* ===============================
   Thick Retro Pixel Cloud
================================ */
const PixelCloud: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 32" className={className} fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
    <rect x="6" y="16" width="52" height="14" />
    <rect x="14" y="8" width="36" height="12" />
    <rect x="24" y="2" width="18" height="10" />
    <rect x="0" y="18" width="10" height="12" />
    <rect x="54" y="18" width="10" height="12" />
  </svg>
);

/* ===============================
   Seamless Cloud Row
================================ */
const CloudRow: React.FC<{ top: string; speed: number; opacity: number }> = ({ top, speed, opacity }) => (
  <div
    className="absolute left-0 w-[200%] flex gap-20 pointer-events-none"
    style={{ top, opacity, animation: `cloud-scroll ${speed}s linear infinite` }}
  >
    {[...Array(12)].map((_, i) => (
      <PixelCloud key={i} className="w-40 text-white shrink-0" />
    ))}
  </div>
);

/* ===============================
   Main Menu
================================ */
const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onMultiplayer,
  onLeader,
  highScore,
  isSplashActive,
  deckMode,
  onDeckModeChange,
}) => {
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const [showHelp, setShowHelp] = useState(false);
  const [loginIntent, setLoginIntent] = useState<'multiplayer' | 'login' | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [deckToast, setDeckToast] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const accountRef = useRef<HTMLDivElement>(null);

  // Multiplayer and login need the internet; everything else works offline.
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  const { session, isSigningIn, isAuthAvailable, signInWithGoogle, signOut } = useUser();

  // Close the account dropdown when clicking anywhere else.
  useEffect(() => {
    if (!showAccountMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setShowAccountMenu(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [showAccountMenu]);

  // Briefly explain the deck after switching it.
  useEffect(() => {
    if (!deckToast) return;
    const t = setTimeout(() => setDeckToast(false), 2600);
    return () => clearTimeout(t);
  }, [deckToast, deckMode]);

  const click = () => {
    audio.resume();
    audio.playClick();
  };

  const handleStart = () => {
    audio.unlock(); // must happen inside the tap so names can be spoken on iOS
    audio.playClick();
    onStart();
  };

  const handleLeader = () => {
    audio.unlock();
    audio.playClick();
    onLeader();
  };

  const handleMultiplayerClick = () => {
    click();
    if (!session) {
      setLoginIntent('multiplayer');
      return;
    }
    onMultiplayer();
  };

  const handleDeckChange = (mode: DeckMode) => {
    click();
    onDeckModeChange(mode);
    setDeckToast(true);
  };

  const handleAccountClick = () => {
    click();
    if (session) setShowAccountMenu((v) => !v);
    else setLoginIntent('login');
  };

  const handleLogout = async () => {
    click();
    setShowAccountMenu(false);
    await signOut();
  };

  const handleMuteToggle = () => {
    audio.resume();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const splashClasses = isSplashActive ? 'opacity-0 pointer-events-none' : 'opacity-100';
  const playerName = getSessionDisplayName(session) || 'Player';
  const multiplayerLocked = isAuthAvailable && !session;

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">
      <CloudRow top="8%" speed={40} opacity={0.05} />
      <CloudRow top="25%" speed={25} opacity={0.03} />
      <CloudRow top="32%" speed={65} opacity={0.05} />
      <CloudRow top="48%" speed={15} opacity={0.02} />
      <CloudRow top="58%" speed={75} opacity={0.09} />
      <CloudRow top="75%" speed={40} opacity={0.1} />

      {/* Deck (top-left) */}
      <div className={`absolute top-4 left-4 z-50 transition-opacity duration-700 ${splashClasses}`}>
        <DeckToggle mode={deckMode} onChange={handleDeckChange} />
        {deckToast && (
          <div className="absolute top-16 left-0 w-48 bg-slate-800 border-2 border-black shadow-[4px_4px_0_0_#000] px-3 py-2 font-retro text-[9px] leading-relaxed text-slate-200 animate-pop-in" role="status">
            {DECK_INFO[deckMode].icon} {DECK_INFO[deckMode].label.toUpperCase()} DECK: {DECK_INFO[deckMode].blurb}
          </div>
        )}
      </div>

      {/* Account, help, sound (top-right) */}
      <div className={`absolute top-4 right-4 flex items-start gap-6 z-50 transition-opacity duration-700 ${splashClasses}`}>
        {isAuthAvailable && (
          <div className="relative" ref={accountRef}>
            <IconButton
              label={session ? 'Account' : 'Login'}
              align="end"
              onClick={handleAccountClick}
              ariaLabel={session ? 'Account menu' : 'Login with Google'}
              title={session ? session.user?.email || 'Logged in' : 'Login to play multiplayer'}
            >
              <img src="/assets/emojis/google.jpg" alt="" style={{ imageRendering: 'pixelated' }} className="w-full h-full object-cover" />
            </IconButton>

            {showAccountMenu && session && (
              <div className="absolute top-16 right-0 bg-slate-800 border-2 border-black shadow-[4px_4px_0_0_#000] z-40 animate-pop-in">
                <div className="px-3 py-2 border-b-2 border-black">
                  <p className="text-slate-300 font-retro text-xs whitespace-nowrap max-w-[180px] truncate">{playerName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-slate-300 hover:bg-slate-700 font-retro text-xs text-left whitespace-nowrap"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        )}

        <IconButton label="Help" align="end" onClick={() => { click(); setShowHelp(true); }} ariaLabel="How to play">
          ?
        </IconButton>

        <IconButton label="Sound" align="end" onClick={handleMuteToggle} ariaLabel={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? '🔇' : '🔊'}
        </IconButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-20 [@media(max-height:760px)]:pb-4 relative z-10">
        <div className={`transition-all duration-[1000ms] scale-90 ${isSplashActive ? 'translate-y-[15vh]' : 'translate-y-0'}`}>
          <Logo />
        </div>

        <div className={`mt-6 transition-opacity duration-700 delay-700 ${splashClasses}`}>
          <div className="bg-orange-500 text-black px-4 py-2 border-2 border-black font-retro text-xs shadow-[4px_4px_0_0_#000] flex items-center gap-2">
            <img src="/assets/emojis/02.png" alt="" className="w-7 h-7" style={{ imageRendering: 'pixelated' }} />
            <span>TOP SCORE: {highScore}</span>
          </div>
        </div>
      </div>

      <div
        className={`w-full flex flex-col gap-4 z-30 pb-4 max-w-sm mx-auto transition-all duration-700 delay-[900ms] ${
          isSplashActive ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <Button onClick={handleStart} className="w-full text-lg py-5 font-retro uppercase">
          <span>Single Player</span>
        </Button>

        <div className="w-full grid grid-cols-2 gap-4">
          <Button
            onClick={handleMultiplayerClick}
            variant="secondary"
            className="w-full h-full text-[10px] sm:text-xs py-3 px-2 font-retro uppercase flex-col gap-1.5"
            disabled={!isAuthAvailable || !online}
            title={
              !online
                ? 'You are offline. Single player and Leader Mode still work!'
                : !isAuthAvailable
                  ? 'Multiplayer is unavailable right now'
                  : !session
                    ? 'Login to play multiplayer'
                    : 'Play multiplayer'
            }
          >
            <span className="text-xl leading-none" aria-hidden="true">{online ? '🤝' : '📴'}</span>
            <span>Multiplayer</span>
            <span className="text-[7px] sm:text-[8px] tracking-normal text-slate-500">
              {!online ? 'Needs internet' : !isAuthAvailable ? 'Unavailable' : multiplayerLocked ? 'Login to play' : '2–8 players'}
            </span>
          </Button>

          <Button
            onClick={handleLeader}
            variant="warning"
            className="w-full h-full text-[10px] sm:text-xs py-3 px-2 font-retro uppercase flex-col gap-1.5"
            title="The phone calls it out, friends play with real fingers"
          >
            <span className="text-xl leading-none" aria-hidden="true">📣</span>
            <span>Leader Mode</span>
            <span className="text-[7px] sm:text-[8px] tracking-normal text-yellow-900">No login needed</span>
          </Button>
        </div>
      </div>

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="How to Play">
        <RuleList
          className="text-xs sm:text-sm"
          items={[
            <>
              If it <span className="text-cyan-300">FLIES</span>, tap{' '}
              <span className="bg-blue-600 text-white px-2 py-1 text-xs border border-black">FLY!</span>
            </>,
            <>If <span className="text-red-400">NOT</span>, wait for the timer.</>,
            <>Wrong answers cost a <span className="text-red-400">♥</span>. Lose all 3 and it's over.</>,
            <>Right answers in a row build a <span className="text-orange-400">🔥 streak</span> bonus. It gets faster!</>,
          ]}
        />

        <div className="mt-6 pt-4 border-t-2 border-black space-y-3 font-retro text-[10px] sm:text-xs leading-relaxed text-slate-300">
          <p>
            <span className="text-green-400">{DECK_INFO.family.icon} FAMILY:</span> kid-safe. Does the thing itself fly?
          </p>
          <p>
            <span className="text-orange-400">{DECK_INFO.masala.icon} MASALA:</span> adds desi slang. Hindi sayings count: "hosh udd gaye" flies!
          </p>
          <p>
            <span className="text-yellow-400">📣 LEADER MODE:</span> the phone calls, friends play with real fingers on a table.
          </p>
        </div>

        <p className="hidden [@media(pointer:fine)]:block mt-6 pt-4 border-t-2 border-black text-slate-400 font-retro text-[10px] leading-relaxed text-center">
          KEYS: SPACE = FLY · P = PAUSE
        </p>
      </Modal>

      <LoginModal
        open={loginIntent !== null}
        onClose={() => setLoginIntent(null)}
        onGoogleClick={signInWithGoogle}
        isSigningIn={isSigningIn}
        openMultiplayerAfterLogin={loginIntent === 'multiplayer'}
      />
    </div>
  );
};

export default MainMenu;
