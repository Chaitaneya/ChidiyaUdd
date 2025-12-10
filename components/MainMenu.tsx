
import React, { useState } from 'react';
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
    <svg viewBox="0 0 32 16" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        {/* Main body */}
        <rect x="6" y="8" width="20" height="8" />
        {/* Top */}
        <rect x="10" y="2" width="10" height="6" />
        {/* Left bump */}
        <rect x="2" y="8" width="4" height="6" />
        {/* Right bump */}
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
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">
      
      {/* Static Pixel Clouds - Retro Decor */}
      <PixelCloud className="absolute top-12 left-[-10px] w-32 text-white/10 pointer-events-none z-0" />
      <PixelCloud className="absolute top-6 right-[-20px] w-48 text-white/5 pointer-events-none z-0" />
      <PixelCloud className="absolute top-40 right-8 w-20 text-white/10 pointer-events-none z-0" />

      {/* Top Bar - Fades in after Splash */}
      <div 
        className={`absolute top-4 right-4 z-50 transition-opacity duration-1000 delay-500 ${isSplashActive ? 'opacity-0' : 'opacity-100'}`}
      >
         <button 
             onClick={handleMuteToggle}
             className="w-10 h-10 bg-slate-700 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-xl hover:bg-slate-600 active:translate-y-1 focus:outline-none"
         >
             {isMuted ? '🔇' : '🔊'}
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20 relative z-10">
        
        {/* Logo Container with Animation */}
        <div className={`
          z-40 transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1)
          ${isSplashActive 
            ? 'translate-y-[20vh] scale-[1.5]' // Splash Position: Lower (center) and Larger
            : 'translate-y-0 scale-100'        // Menu Position: Natural flow
          }
        `}>
          <Logo />
        </div>
        
        {/* Menu Content - Fades in after Logo moves up */}
        <div className={`
          flex flex-col items-center w-full transition-opacity duration-700 delay-700
          ${isSplashActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
        `}>
          <div className="bg-orange-500 text-black px-4 py-2 border-2 border-black font-retro text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-6">
              🏆 TOP SCORE: {highScore}
          </div>

          <div className="bg-slate-800/90 p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm text-left relative mt-6 backdrop-blur-sm">
              <div className="absolute top-2 left-2 w-2 h-2 bg-slate-500 rounded-full border border-black"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-slate-500 rounded-full border border-black"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-slate-500 rounded-full border border-black"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-slate-500 rounded-full border border-black"></div>

              <h3 className="text-xl font-retro text-yellow-400 mb-6 text-center tracking-widest uppercase drop-shadow-[2px_2px_0_#000]">
                  How to Play
              </h3>
              <ul className="text-slate-200 space-y-4 text-sm font-retro pl-2">
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">1.</span>
                  <span>
                    If item <span className="text-cyan-300">FLIES</span>, tap <span className="bg-blue-600 text-white px-2 py-1 text-xs border border-black shadow-[2px_2px_0_0_#000]">FLY!</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">2.</span>
                  <span>
                    If <span className="text-red-400">NOT</span>, <span className="text-yellow-400 border-b-2 border-yellow-400">WAIT</span>.
                  </span>
                </li>
              </ul>
          </div>
        </div>
      </div>

      {/* Buttons - Fade in last */}
      <div className={`
        w-full flex flex-col gap-4 z-30 pb-4 max-w-sm mx-auto transition-all duration-700 delay-[900ms]
        ${isSplashActive ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}
      `}>
        <Button onClick={handleStart} disabled={isLoading} className="w-full text-lg py-5">
            {isLoading ? "LOADING..." : "Single Player 👤"}
        </Button>
        
        <Button onClick={handleMultiplayer} variant="secondary" className="w-full text-lg py-5">
            Multiplayer 👥
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;
