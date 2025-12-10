
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { audio } from '../services/audioService';
import { multiplayer } from '../services/multiplayerService';
import { MultiplayerRoom } from '../types';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score > 0 && score >= highScore;
  
  // Initialize with current room state, but keep it updated
  const [mpRoom, setMpRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom());
  const isMultiplayer = !!mpRoom;

  // Subscribe to live updates so the leaderboard reflects other players' progress
  useEffect(() => {
    if (isMultiplayer) {
      // Update local state whenever a network packet arrives
      const unsub = multiplayer.subscribe((updatedRoom) => {
        setMpRoom(updatedRoom);
      });
      return unsub;
    }
  }, [isMultiplayer]);

  const handleRestart = () => {
    audio.playClick();
    if (isMultiplayer) {
        // Leave room logic for now, simpler
        window.location.reload(); 
    } else {
        onRestart();
    }
  };

  const renderMultiplayerResults = () => {
    if (!mpRoom) return null;
    
    // Sort by Score (High to Low)
    const sorted = [...mpRoom.players].sort((a,b) => b.score - a.score);
    const myId = multiplayer.getCurrentPlayer()?.id;
    
    // Check if anyone is still alive to change the title
    const isGameActive = mpRoom.players.some(p => p.status === 'alive');

    return (
        <div className="w-full max-w-sm bg-white rounded-2xl p-4 text-slate-800 shadow-xl mb-4">
            <h3 className="text-center font-retro text-xl mb-4 border-b-2 border-slate-200 pb-2 flex items-center justify-center gap-2">
                {isGameActive ? (
                   <>🔴 Live Standings</>
                ) : (
                   <>🏁 Final Standings</>
                )}
            </h3>
            <div className="space-y-3">
                {sorted.map((p, idx) => (
                    <div key={p.id} className={`flex items-center justify-between p-2 rounded-lg ${p.id === myId ? 'bg-blue-100 border-2 border-blue-300' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-xl w-6">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                            </span>
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-bold">{p.name} {p.id === myId && '(You)'}</span>
                                {p.status === 'eliminated' && (
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Eliminated</span>
                                )}
                            </div>
                        </div>
                        {p.status === 'alive' ? (
                             <span className="font-retro text-[10px] sm:text-xs text-green-600 animate-pulse tracking-widest border border-green-400 px-2 py-1 rounded bg-green-50">
                                PLAYING...
                             </span>
                        ) : (
                             <span className="font-mono font-bold text-blue-600 text-xl">{p.score}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-fade-in relative z-20">
      
      {isMultiplayer ? (
        <>
            <h2 className="text-3xl font-retro text-yellow-400 drop-shadow-[2px_2px_0_#000]">MATCH OVER</h2>
            {renderMultiplayerResults()}
        </>
      ) : (
        <div className="space-y-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-retro text-red-500 leading-snug drop-shadow-[2px_2px_0_#fff]">
            {isNewHighScore ? 'NEW RECORD!' : 'GAME OVER'}
            </h2>
            
            <div className="bg-slate-800 p-8 border-4 border-white shadow-[8px_8px_0_0_#000] w-full max-w-xs mx-auto relative">
            {isNewHighScore && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 font-retro text-[10px] uppercase border-2 border-black animate-pulse">
                High Score
                </div>
            )}
            
            <p className="text-slate-400 font-retro text-xs mb-4">SCORE</p>
            <p className="text-6xl font-retro text-green-400 mb-6 drop-shadow-[2px_2px_0_#000]">{score}</p>
            </div>

            {!isNewHighScore && highScore > 0 && (
            <p className="text-slate-500 font-retro text-xs">BEST: {highScore}</p>
            )}
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={handleRestart} className="w-full text-xl py-4" variant="primary">
          {isMultiplayer ? 'BACK TO MENU' : 'TRY AGAIN'}
        </Button>
      </div>
    </div>
  );
};

export default GameOver;
