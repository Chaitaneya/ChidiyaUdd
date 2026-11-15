import React from 'react';
import { CAPTION } from './game/Hud';

interface IconButtonProps {
  /** Small caption above the button (e.g. "SOUND"). */
  label: string;
  onClick: () => void;
  ariaLabel: string;
  title?: string;
  tone?: 'default' | 'danger';
  /** Which side the caption lines up with. */
  align?: 'start' | 'center' | 'end';
  labelClassName?: string;
  children: React.ReactNode;
}

const ALIGN = { start: 'items-start', center: 'items-center', end: 'items-end' };

/** The square 40px retro button with a caption, used in every top bar. */
const IconButton: React.FC<IconButtonProps> = ({
  label,
  onClick,
  ariaLabel,
  title,
  tone = 'default',
  align = 'center',
  labelClassName = 'text-slate-400',
  children,
}) => (
  <div className={`flex flex-col gap-1 ${ALIGN[align]}`}>
    <span className={`${CAPTION} ${labelClassName}`}>{label}</span>
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`w-10 h-10 border-2 border-black flex items-center justify-center text-lg text-white leading-none shadow-[2px_2px_0_0_#000] active:translate-y-1 overflow-hidden transition-colors ${
        tone === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-700 hover:bg-slate-600'
      }`}
    >
      {children}
    </button>
  </div>
);

export default IconButton;
