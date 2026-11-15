import React from 'react';

interface FlyButtonProps {
  onClick: () => void;
  /** Between rounds: greyed out. */
  active: boolean;
  disabled?: boolean;
  /** Replaces the "SPACE" hint, e.g. "LOCKED IN". */
  hint?: string;
}

/** The big blue FLY! button. */
const FlyButton: React.FC<FlyButtonProps> = ({ onClick, active, disabled = false, hint }) => (
  <div className="w-full max-w-md px-2 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 z-10 shrink-0">
    <button
      className={`w-full py-4 sm:py-5 md:py-6 bg-blue-600 text-white font-retro text-lg sm:text-xl md:text-2xl border-4 border-black shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#000] transition-all flex flex-col items-center justify-center gap-1 select-none ${
        !active || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'
      }`}
      onClick={onClick}
      disabled={!active || disabled}
    >
      FLY!
      {hint ? (
        <span className="text-[10px] tracking-widest text-blue-200">{hint}</span>
      ) : (
        <span className="hidden [@media(pointer:fine)]:block text-[10px] tracking-widest text-blue-200">SPACE</span>
      )}
    </button>
  </div>
);

export default FlyButton;
