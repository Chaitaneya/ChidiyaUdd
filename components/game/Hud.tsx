import React from 'react';
import { MAX_LIVES } from '../../constants';

/** Every top-bar caption uses this, so HEALTH / SCORE / SOUND line up exactly. */
export const CAPTION = 'text-[8px] sm:text-[10px] tracking-widest uppercase font-retro leading-none';

/** Pixel hearts with the "HEALTH" caption. */
export const Hearts: React.FC<{ lives: number }> = ({ lives }) => (
  <div className="flex flex-col items-start gap-1" role="status" aria-label={`Lives remaining: ${lives}`}>
    <span className={`${CAPTION} text-red-400`}>Health</span>
    <div className="flex gap-1 sm:gap-2 h-10 items-center">
      {Array.from({ length: MAX_LIVES }).map((_, i) => (
        <img
          key={i}
          src={i < Math.max(lives, 0) ? '/assets/emojis/heart.png' : '/assets/emojis/heartless.png'}
          alt=""
          className="w-6 h-6 sm:w-8 sm:h-8"
          style={{ imageRendering: 'pixelated', opacity: i < lives ? 1 : 0.3 }}
        />
      ))}
    </div>
  </div>
);

/** A caption over a boxed value (score, call count, pace…). */
export const StatBox: React.FC<{
  label: string;
  value: string;
  tone?: 'green' | 'yellow';
  align?: 'start' | 'center';
  minWidth?: string;
  children?: React.ReactNode;
}> = ({ label, value, tone = 'green', align = 'center', minWidth = 'min-w-[64px]', children }) => {
  const color = tone === 'yellow' ? 'text-yellow-400' : 'text-green-400';
  return (
    <div className={`flex flex-col gap-1 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <span className={`${CAPTION} ${color}`}>{label}</span>
      <div
        className={`relative bg-slate-800 px-3 h-10 border-2 border-slate-500 shadow-[2px_2px_0_0_#000] font-retro text-sm sm:text-base flex items-center justify-center ${minWidth} ${color}`}
        aria-live="polite"
      >
        {value}
        {children}
      </div>
    </div>
  );
};

/** Green 4-digit score with a 🔥 streak badge. */
export const ScoreBox: React.FC<{ score: number; streak?: number; label?: string }> = ({ score, streak = 0, label = 'Score' }) => (
  <StatBox label={label} value={score.toString().padStart(4, '0')} minWidth="min-w-[80px]">
    {streak > 1 && (
      <div className="absolute -bottom-3 right-0 text-[9px] text-orange-400 font-bold animate-pulse whitespace-nowrap bg-black px-1 border border-orange-500">
        🔥 x{streak}
      </div>
    )}
  </StatBox>
);
