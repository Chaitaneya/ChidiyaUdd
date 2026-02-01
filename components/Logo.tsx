
import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className = '', style = {} }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`} style={style}>
      {/* Logo Container - Only the bird moves! */}
      <div className="inline-block relative">
        <div className="text-6xl sm:text-7xl md:text-8xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,1)] wiggle inline-block">
          🐦
        </div>
      </div>
      
      <div className="relative text-center mt-2 sm:mt-3 px-4 sm:px-6 w-full">
         <h1 className="text-3xl sm:text-4xl lg:text-5xl text-yellow-400 tracking-tight font-retro leading-tight drop-shadow-[4px_4px_0_rgba(0,0,0,1)] stroke-black" 
             style={{ textShadow: '4px 4px 0px #000' }}>
          Chidiya<br/>Udd!
        </h1>
        <p className="text-green-400 text-xs sm:text-sm lg:text-lg mt-1 sm:mt-2 font-retro uppercase tracking-widest">
          Childhood Game
        </p>
      </div>
    </div>
  );
};

export default Logo;
