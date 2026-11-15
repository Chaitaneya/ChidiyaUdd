import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit';
}

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500',
  secondary: 'bg-white text-black hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-400',
  success: 'bg-green-500 text-white hover:bg-green-400',
  warning: 'bg-yellow-400 text-black hover:bg-yellow-300',
};

// Retro pixel style: no rounded corners, hard borders, solid shadow.
// Keyboard focus shows a chunky yellow outline (mouse clicks don't).
const BASE =
  'px-4 py-3 font-retro text-sm sm:text-base border-4 border-black transition-transform active:translate-x-[4px] active:translate-y-[4px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 uppercase tracking-wide';

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  title,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`${BASE} ${VARIANTS[variant]} ${
      disabled ? 'opacity-50 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]' : ''
    } ${className}`}
  >
    {children}
  </button>
);

export default Button;
