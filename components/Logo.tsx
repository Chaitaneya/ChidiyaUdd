
import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className = '', style = {} }) => {
  return (
    <div className={`flex flex-col items-center ${className}`} style={style}>
      {/* Logo Container - Only the bird moves! */}
      <div className="inline-block relative">
        <div className="text-8xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,1)] wiggle inline-block">
          🐦
        </div>
      </div>
      
      <div className="relative text-center mt-4">
         <h1 className="text-4xl sm:text-5xl text-yellow-400 tracking-tight font-retro leading-snug drop-shadow-[4px_4px_0_rgba(0,0,0,1)] stroke-black" 
             style={{ textShadow: '4px 4px 0px #000' }}>
          Chidiya<br/>Udd!
        </h1>
        <p className="text-green-400 text-xl mt-2 font-retro uppercase tracking-widest text-[0.7rem] sm:text-xs">
          Childhood Game
        </p>
      </div>
    </div>
  );
};

export default Logo;
