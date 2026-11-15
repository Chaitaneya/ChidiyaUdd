import React from 'react';
import { GameEntity } from '../../types';

export type Feedback = 'hit' | 'miss' | 'safe' | null;

interface GameCardProps {
  entity: GameEntity;
  /** Remaining time, 0–100. Omit to hide the timer bar. */
  timeLeft?: number;
  /** Dims the card between rounds. */
  active?: boolean;
  feedback?: Feedback;
  /** Shown in a bubble under the card (e.g. after a wrong answer). */
  note?: string | null;
  /** Leader mode shows the card larger. */
  size?: 'normal' | 'large';
}

/** The white card: emoji, name, Hindi line, timer, and an optional note bubble. */
const GameCard: React.FC<GameCardProps> = ({ entity, timeLeft, active = true, feedback = null, note = null, size = 'normal' }) => {
  const large = size === 'large';
  return (
    <div className={`relative w-full ${large ? 'max-w-sm' : 'max-w-xs sm:max-w-sm'}`}>
      <div
        className={`relative border-4 border-black p-3 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center gap-2 sm:gap-4 w-full transition-transform duration-100 ${
          active ? 'scale-100' : 'scale-95 opacity-80'
        } ${feedback === 'miss' ? 'animate-shake bg-red-200' : 'bg-slate-200'}`}
      >
        <div
          className={`drop-shadow-md select-none py-1 sm:py-2 ${large ? 'text-7xl sm:text-9xl' : 'text-5xl sm:text-7xl md:text-9xl'}`}
          aria-hidden="true"
        >
          {entity.emoji}
        </div>

        <div className="text-center w-full min-h-[3rem] sm:min-h-[4rem] flex flex-col justify-center items-center">
          <h2
            className={`font-bold uppercase tracking-tight leading-none break-words line-clamp-2 text-black mb-0.5 sm:mb-1 ${
              large ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl md:text-3xl'
            }`}
          >
            {entity.name}
          </h2>
          <p
            className={`text-blue-800 font-hindi leading-none font-bold bg-white/50 px-2 py-0.5 sm:py-1 inline-block rounded border-2 border-transparent ${
              large ? 'text-xl sm:text-3xl' : 'text-base sm:text-xl md:text-2xl'
            }`}
          >
            ({entity.hindi})
          </p>
        </div>

        {timeLeft !== undefined && (
          <div className="w-full h-3 sm:h-4 bg-slate-800 border-2 border-black mt-1 sm:mt-2 relative overflow-hidden">
            <div
              className={`h-full border-r-2 border-black ${timeLeft < 30 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${timeLeft}%` }}
            />
          </div>
        )}
      </div>

      {note && (
        <div
          className="absolute left-2 right-2 top-full mt-4 bg-yellow-300 text-black border-4 border-black shadow-[4px_4px_0_0_#000] px-3 py-2 font-retro text-[10px] sm:text-xs leading-relaxed text-center animate-pop-in z-20"
          role="status"
        >
          💡 {note}
        </div>
      )}
    </div>
  );
};

export default GameCard;
