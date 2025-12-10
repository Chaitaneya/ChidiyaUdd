
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  // Retro Pixel Style: No rounded corners, hard borders, solid shadow
  // Removed focus:ring-* classes to eliminate the yellow outline on click
  const baseStyle = "px-4 py-3 font-retro text-sm sm:text-base border-4 border-black transition-transform active:translate-x-[4px] active:translate-y-[4px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 uppercase tracking-wide focus:outline-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-white text-black hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-400",
    success: "bg-green-500 text-white hover:bg-green-400"
  };

  return (
    <button 
      type="button"
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
