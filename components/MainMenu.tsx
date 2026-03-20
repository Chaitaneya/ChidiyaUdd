import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { audio } from '../services/audioService';
import Logo from './Logo';
import LoginModal from './LoginModal';
import { useUser } from '../contexts/UserContext';

interface MainMenuProps {
  onStart: () => void;
  onMultiplayer: () => void;
  isLoading: boolean;
  highScore: number;
  isSplashActive: boolean;
}

/* ===============================
   Thick Retro Pixel Cloud
================================ */
const PixelCloud: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 64 32"
    className={className}
    fill="currentColor"
    shapeRendering="crispEdges"
  >
    {/* Bottom base */}
    <rect x="6" y="16" width="52" height="14" />
    {/* Middle bumps */}
    <rect x="14" y="8" width="36" height="12" />
    {/* Top bump */}
    <rect x="24" y="2" width="18" height="10" />
    {/* Side puffs */}
    <rect x="0" y="18" width="10" height="12" />
    <rect x="54" y="18" width="10" height="12" />
  </svg>
);

/* ===============================
   Seamless Cloud Row
================================ */
const CloudRow: React.FC<{
  top: string;
  speed: number;
  opacity: number;
}> = ({ top, speed, opacity }) => (
  <div
    className="absolute left-0 w-[200%] flex gap-20 pointer-events-none"
    style={{
      top,
      opacity,
      animation: `cloudScroll ${speed}s linear infinite`
    }}
  >
    {[...Array(12)].map((_, i) => (
      <PixelCloud key={i} className="w-40 text-white flex-shrink-0" />
    ))}
  </div>
);

/* ===============================
   Modal Component
================================ */
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm p-6 relative">

        {/* Consistent Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-red-600 hover:bg-red-500 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-white text-lg active:translate-y-1"
          aria-label="Close Help"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

/* ===============================
   Main Menu
================================ */
const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onMultiplayer,
  isLoading,
  highScore,
  isSplashActive
}) => {
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const [showHelp, setShowHelp] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const { session, isLoading: authLoading, signInWithGoogle, signOut } = useUser();

  useEffect(() => {
    audio.warmup();
  }, []);

  const handleStart = () => {
    audio.resume();
    audio.playClick();
    onStart();
  };

  const handleMultiplayerClick = () => {
    audio.resume();
    audio.playClick();
    
    // If not logged in, show login modal instead of navigating
    if (!session) {
      setShowLoginModal(true);
      return;
    }
    
    onMultiplayer();
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (session) {
      onMultiplayer();
    }
  };

  const handleLogout = async () => {
    audio.resume();
    audio.playClick();
    await signOut();
    setShowLogoutMenu(false);
  };

  const handleAuthButtonClick = async () => {
    audio.resume();
    audio.playClick();
    
    if (session) {
      setShowLogoutMenu(!showLogoutMenu);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleMuteToggle = () => {
    audio.resume();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">

      <style>
        {`
          @keyframes cloudScroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <CloudRow top="8%" speed={40} opacity={0.05} />
      <CloudRow top="25%" speed={25} opacity={0.03} />
      <CloudRow top="32%" speed={65} opacity={0.05} />
      <CloudRow top="48%" speed={15} opacity={0.02} />
      <CloudRow top="58%" speed={75} opacity={0.09} />
      <CloudRow top="75%" speed={40} opacity={0.10} />

      <div
        className={`absolute top-4 right-4 flex items-start gap-6 z-50 transition-opacity duration-700 ${
          isSplashActive ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-end gap-1 relative">
          <span className="text-slate-400 text-[8px] tracking-widest uppercase font-retro">
            Login
          </span>
          <button
            onClick={handleAuthButtonClick}
            className="w-10 h-10 bg-slate-700 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0_0_#000] hover:bg-slate-600 active:translate-y-1 overflow-hidden"
            title={session ? session.user?.email || 'Logged in' : 'Login to play multiplayer'}
          >
            <img
              src="/assets/emojis/google.jpg"
              alt="Login with Google"
              style={{ imageRendering: 'pixelated' }}
              className="w-full h-full object-cover"
            />
          </button>

          {showLogoutMenu && session && (
            <div className="absolute top-16 right-0 bg-slate-800 border-2 border-black shadow-[4px_4px_0_0_#000] z-40">
              <div className="px-3 py-2 border-b border-slate-700">
                <p className="text-slate-300 font-retro text-xs whitespace-nowrap">
                  {session.user?.email?.split('@')[0] || 'Player'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-slate-300 hover:bg-slate-700 font-retro text-xs text-left whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-slate-400 text-[8px] tracking-widest uppercase font-retro">
            Help
          </span>
          <button
            onClick={() => setShowHelp(true)}
            className="w-10 h-10 bg-slate-700 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0_0_#000] hover:bg-slate-600 active:translate-y-1 overflow-hidden"
          >
            ?
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-slate-400 text-[8px] tracking-widest uppercase font-retro">
            Sound
          </span>
          <button
            onClick={handleMuteToggle}
            className="w-10 h-10 bg-slate-700 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0_0_#000] hover:bg-slate-600 active:translate-y-1 overflow-hidden"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-20 relative z-10">
        <div
          className={`transition-all duration-[1000ms] ${
            isSplashActive
              ? 'translate-y-[15vh] scale-90'
              : 'translate-y-0 scale-90'
          }`}
        >
          <Logo />
        </div>

        <div
          className={`mt-6 transition-opacity duration-700 delay-700 ${
            isSplashActive ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="bg-orange-500 text-black px-4 py-2 border-2 border-black font-retro text-xs shadow-[4px_4px_0_0_#000] flex items-center gap-2">
            <img
              src="\assets\emojis\02.png"
              alt="trophy"
              className="w-7 h-7"
              style={{ imageRendering: 'pixelated' }}
            />
            <span>TOP SCORE: {highScore}</span>
          </div>
        </div>
      </div>

      <div
        className={`w-full flex flex-col gap-4 z-30 pb-4 max-w-sm mx-auto transition-all duration-700 delay-[900ms] ${
          isSplashActive ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}
      >
        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full text-lg py-5 flex items-center justify-center gap-3 font-retro uppercase"
        >
          <span>{isLoading ? 'LOADING...' : 'Single Player'}</span>
        </Button>

        <div className="w-full flex items-center gap-2 group relative">
          <Button
            onClick={handleMultiplayerClick}
            variant="secondary"
            className="flex-1 text-lg py-5 flex items-center justify-center gap-3 font-retro uppercase"
            disabled={!session}
            title={!session ? 'Login to Play multiplayer' : 'Play Multiplayer'}
          >
            <span>Multiplayer</span>
          </Button>
          {!session && (
            <div className="flex items-center justify-center h-14 px-2">
              <span className="text-2xl">🔒</span>
            </div>
          )}
          
          {/* Hover Tooltip */}
          {!session && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 border-2 border-black shadow-[2px_2px_0_0_#000] px-3 py-2 whitespace-nowrap text-slate-200 font-retro text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 hidden group-hover:block">
              Login to play with friends
            </div>
          )}
        </div>
      </div>

      <Modal open={showHelp} onClose={() => setShowHelp(false)}>
        <h3 className="text-xl font-retro text-yellow-400 mb-6 text-center tracking-widest uppercase">
          How to Play
        </h3>

        <ul className="text-slate-200 space-y-4 text-sm font-retro">
          <li>
            <span className="text-green-400 mr-2">1.</span>
            If it <span className="text-cyan-300">FLIES</span>, tap{' '}
            <span className="bg-blue-600 text-white px-2 py-1 text-xs border border-black">
              FLY!
            </span>
          </li>
          <li>
            <span className="text-green-400 mr-2">2.</span>
            If <span className="text-red-400">NOT</span>, wait.
          </li>
        </ul>
      </Modal>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onGoogleClick={signInWithGoogle}
        isLoading={authLoading}
      />
    </div>
  );
};

export default MainMenu;