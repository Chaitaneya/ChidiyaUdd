import React, { useState, useEffect } from 'react';
import Button from './Button';
import { audio } from '../services/audioService';
import Logo from './Logo';

interface MainMenuProps {
  onStart: () => void;
  onMultiplayer: () => void;
  isLoading: boolean;
  highScore: number;
  isSplashActive: boolean;
}

// Simple Pixel Art Cloud SVG Component
const PixelCloud = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 16"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
  >
    <rect x="6" y="8" width="20" height="8" />
    <rect x="10" y="2" width="10" height="6" />
    <rect x="2" y="8" width="4" height="6" />
    <rect x="26" y="8" width="4" height="6" />
  </svg>
);

const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onMultiplayer,
  isLoading,
  highScore,
  isSplashActive
}) => {
  const [isMuted, setIsMuted] = useState(audio.isMuted());

  useEffect(() => {
    audio.warmup();
  }, []);

  const handleStart = () => {
    audio.resume();
    audio.warmup();
    audio.playClick();
    onStart();
  };

  const handleMultiplayer = () => {
    audio.resume();
    audio.warmup();
    audio.playClick();
    onMultiplayer();
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">

      {/* Pixel Clouds */}
      <PixelCloud className="absolute top-12 left-[-10px] w-32 text-white/10 pointer-events-none" />
      <PixelCloud className="absolute top-6 right-[-20px] w-48 text-white/5 pointer-events-none" />
      <PixelCloud className="absolute top-40 right-8 w-20 text-white/10 pointer-events-none" />

      {/* Mute Button */}
      <div
        className={`absolute top-4 right-4 z-50 transition-opacity duration-1000 delay-500 ${
          isSplashActive ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          onClick={handleMuteToggle}
          className="w-10 h-10 bg-slate-700 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-xl hover:bg-slate-600 active:translate-y-1"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20 relative z-10">

        {/* LOGO (ONLY SIZE REDUCED) */}
        <div
          className={`
            z-40 transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1)
            ${
              isSplashActive
                ? 'translate-y-[15vh] sm:translate-y-[20vh] scale-90 sm:scale-[1.15] md:scale-[1.25]'
                : 'translate-y-0 scale-90'
            }
          `}
        >
          <Logo />
        </div>

        {/* INFO PANEL */}
        <div
          className={`flex flex-col items-center w-full transition-opacity duration-700 delay-700 ${
            isSplashActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="bg-orange-500 text-black px-4 py-2 border-2 border-black font-retro text-xs shadow-[4px_4px_0px_0px_#000] mt-6">
            🏆 TOP SCORE: {highScore}
          </div>

          <div className="bg-slate-800/90 p-5 border-4 border-black shadow-[4px_4px_0px_0px_#000] w-full max-w-sm mt-6">
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
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div
        className={`w-full flex flex-col gap-4 z-30 pb-4 max-w-sm mx-auto transition-all duration-700 delay-[900ms] ${
          isSplashActive ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}
      >
        <Button
  onClick={handleStart}
  disabled={isLoading}
  className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
>
  <span className="inline-flex items-center justify-center w-10 h-6 border-2 border-black bg-black/30 text-sm">
    1P
  </span>
  <span>{isLoading ? 'LOADING...' : 'Single Player'}</span>
</Button>

<Button
  onClick={handleMultiplayer}
  variant="secondary"
  className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
>
  <span className="inline-flex items-center justify-center w-10 h-6 border-2 border-black bg-black/20 text-sm">
    MP
  </span>
  <span>Multiplayer</span>
</Button>
      </div>
    </div>
  );
};

export default MainMenu;