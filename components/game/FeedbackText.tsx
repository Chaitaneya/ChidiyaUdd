import React from 'react';
import { Feedback } from './GameCard';

const TEXT = { hit: 'GREAT!', safe: 'CORRECT!', miss: 'WRONG!' };

/** Big WRONG!/GREAT!/CORRECT! above the card, with optional small extra line. */
const FeedbackText: React.FC<{ feedback: Feedback; extra?: string | null }> = ({ feedback, extra }) => (
  <div className="h-12 sm:h-16 w-full flex flex-col items-center justify-center mb-1 sm:mb-2 shrink-0 relative">
    {feedback && (
      <div
        className={`flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-retro animate-pop-in ${
          feedback === 'miss' ? 'text-red-500' : 'text-green-400'
        }`}
        style={{ textShadow: '3px 3px 0px #000' }}
        aria-live="assertive"
      >
        {TEXT[feedback]}
      </div>
    )}
    {feedback && extra && (
      <div className="mt-1 font-retro text-[10px] sm:text-xs text-yellow-300 animate-pop-in" style={{ textShadow: '2px 2px 0 #000' }}>
        {extra}
      </div>
    )}
  </div>
);

export default FeedbackText;
