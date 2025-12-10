
import React, { useEffect, useState } from 'react';
import { multiplayer } from '../services/multiplayerService';
import { MultiplayerRoom } from '../types';
import Button from './Button';
import { audio } from '../services/audioService';

interface LobbyProps {
  onStartGame: () => void;
  onLeave: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ onStartGame, onLeave }) => {
  const [room, setRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom());
  const currentPlayer = multiplayer.getCurrentPlayer();

  useEffect(() => {
    const unsub = multiplayer.subscribe((updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.status === 'playing') {
        onStartGame();
      }
    });
    return unsub;
  }, [onStartGame]);

  // Play sound when a new player joins
  useEffect(() => {
    if (room && room.players.length > 1) {
       audio.playPop();
    }
  }, [room?.players.length]);

  if (!room) return <div className="font-retro text-white text-center mt-20">CONNECTING...</div>;

  const isHost = currentPlayer?.isHost;
  const hasDeck = room.entities && room.entities.length > 0;
  
  // Dynamic header based on role to match previous button click
  const headerTitle = isHost ? "HOST GAME" : "JOIN GAME";

  const handleStart = () => {
    audio.playClick();
    multiplayer.startGame();
  };
  
  const handleLeave = () => {
    audio.playClick();
    onLeave();
  };

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-4 max-w-md mx-auto relative">
      
      {/* HEADER */}
      <div className="w-full flex items-center justify-between mb-8 z-10">
        <button 
            onClick={handleLeave}
            className="w-10 h-10 bg-slate-700 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-xl hover:bg-slate-600 active:translate-y-1 focus:outline-none text-white"
        >
            ◀️
        </button>
        <h2 className="text-xl text-yellow-400 font-retro drop-shadow-[2px_2px_0_#000]">{headerTitle}</h2>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* ROOM CODE DISPLAY */}
      <div className="w-full mb-8 text-center">
        <h3 className="text-slate-400 font-retro text-xs mb-2 uppercase tracking-widest">ROOM CODE</h3>
        <div className="bg-black border-4 border-slate-600 p-4 inline-block shadow-[4px_4px_0_0_#000]">
           <span className="text-4xl sm:text-5xl font-vt323 font-bold text-yellow-400 tracking-[0.2em] leading-none">
              {room.code}
           </span>
        </div>
      </div>

      {/* PLAYER LIST */}
      <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] w-full flex-1 flex flex-col p-4 mb-6 min-h-0">
        <h2 className="text-white font-retro text-sm text-center border-b-4 border-black pb-3 mb-4 bg-slate-700">
            PLAYERS ({room.players.length})
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {room.players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-black p-3 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{p.isHost ? '👑' : '✈️'}</span>
                        <span className={`font-vt323 text-2xl uppercase ${p.id === currentPlayer?.id ? 'text-green-400' : 'text-white'}`}>
                            {p.name} {p.id === currentPlayer?.id && '<'}
                        </span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                </div>
            ))}
        </div>

        {/* STATUS BAR */}
        <div className="mt-4 pt-4 border-t-4 border-black text-center shrink-0">
            {isHost ? (
                <div className="flex flex-col gap-2">
                    <Button 
                        onClick={handleStart}
                        disabled={!hasDeck}
                        variant="primary"
                        className="w-full text-lg"
                    >
                        {hasDeck ? 'START GAME ▶' : 'LOADING GAME...'}
                    </Button>
                </div>
            ) : (
                <div className="bg-slate-900 p-3 border-2 border-slate-700">
                    <p className="text-green-400 font-retro text-xs animate-pulse">
                        WAITING FOR HOST...
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
