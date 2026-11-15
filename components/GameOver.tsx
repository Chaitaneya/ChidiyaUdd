import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Button from './Button';
import { audio } from '../services/audioService';
import { multiplayer, rankPlayers } from '../services/multiplayerService';
import { MultiplayerRoom } from '../types';

interface GameOverProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  isMultiplayer: boolean;
  onTryAgain: () => void;
  onBackToMenu: () => void;
  onBackToLobby: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  isNewRecord,
  isMultiplayer,
  onTryAgain,
  onBackToMenu,
  onBackToLobby,
}) => {
  const [mpRoom, setMpRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom());
  const shownAtRef = useRef(Date.now());
  const iWon =
    isMultiplayer && mpRoom?.status === 'finished' && rankPlayers(mpRoom.players)[0]?.id === multiplayer.getCurrentPlayer()?.id;

  // 🎉 Confetti for a new single-player record, or winning a match
  useEffect(() => {
    if (!(isNewRecord && !isMultiplayer) && !iWon) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const shared = { particleCount: 90, spread: 55, startVelocity: 35, gravity: 0.9, ticks: 160, colors: ['#FFD700', '#FF6B6B', '#4ADE80', '#60A5FA'] };
    confetti({ ...shared, angle: 20, origin: { x: 0.18, y: 0.55 } });
    confetti({ ...shared, angle: 160, origin: { x: 0.82, y: 0.55 } });
  }, [isNewRecord, isMultiplayer, iWon]);

  useEffect(() => {
    if (!isMultiplayer) return;
    return multiplayer.subscribe(setMpRoom);
  }, [isMultiplayer]);

  const handleTryAgain = () => {
    audio.unlock();
    audio.playClick();
    onTryAgain();
  };

  const handleBackToMenu = () => {
    audio.playClick();
    onBackToMenu();
  };

  const handleBackToLobby = () => {
    audio.playClick();
    onBackToLobby();
  };

  // Enter = try again (ignored briefly so a held key from the game doesn't skip this screen)
  useEffect(() => {
    if (isMultiplayer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || Date.now() - shownAtRef.current < 600) return;
      e.preventDefault();
      handleTryAgain();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const roomClosed = !mpRoom || mpRoom.status === 'closed';

  const renderMultiplayerResults = () => {
    if (!mpRoom) return null;

    const sorted = rankPlayers(mpRoom.players);
    const myId = multiplayer.getCurrentPlayer()?.id;
    const winnerId = mpRoom.status === 'finished' ? sorted[0]?.id : undefined;

    return (
      <div className="w-full max-w-sm bg-white p-4 text-slate-800 border-4 border-black shadow-[6px_6px_0_0_#000] mb-4 max-h-[45vh] overflow-y-auto">
        <h3 className="flex items-center justify-center gap-2 font-retro text-lg sm:text-xl mb-4 border-b-2 border-slate-200 pb-2">
          <span className="text-2xl inline-block -translate-y-[5px]">🏁</span>
          <span>SCOREBOARD</span>
        </h3>

        <div className="space-y-3">
          {sorted.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 border-2 ${
                p.id === myId ? 'bg-blue-100 border-blue-300' : 'bg-slate-50 border-black'
              }`}
            >
              <div className="flex items-center gap-3 w-full justify-start min-w-0">
                <span className="font-bold text-xl w-6 text-left shrink-0">{MEDALS[idx] ?? `${idx + 1}.`}</span>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="font-bold truncate max-w-full">
                    {p.name} {p.id === myId && '(You)'}
                  </span>
                  <div className="text-[10px] text-slate-500 uppercase">
                    {p.id === winnerId
                      ? '👑 Winner · last one standing'
                      : p.status === 'left'
                        ? 'Left'
                        : p.status === 'eliminated' && p.outRound !== undefined
                          ? `Out in round ${p.outRound + 1}`
                          : 'Still in'}
                  </div>
                </div>
              </div>

              <span className="font-mono font-bold text-blue-600 text-xl shrink-0">{p.score}</span>
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
          <h2 className="text-3xl font-retro text-yellow-400 drop-shadow-[2px_2px_0_#000]">{iWon ? 'YOU WIN! 👑' : 'MATCH OVER'}</h2>
          {renderMultiplayerResults()}
          {roomClosed && (
            <p className="text-yellow-300 font-retro text-xs leading-relaxed">THE HOST LEFT THE ROOM</p>
          )}
        </>
      ) : (
        <div className="space-y-6 w-full">
          <h2 className={`text-3xl sm:text-4xl font-retro drop-shadow-[2px_2px_0_#000] ${isNewRecord ? 'text-yellow-400' : 'text-red-500'}`}>
            {isNewRecord ? 'NEW RECORD!' : 'GAME OVER'}
          </h2>

          <div className="bg-slate-800 p-8 border-4 border-white shadow-[8px_8px_0_0_#000] w-full max-w-xs mx-auto relative">
            {isNewRecord && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 font-retro text-[10px] uppercase border-2 border-black whitespace-nowrap">
                High Score
              </div>
            )}

            <p className="text-slate-400 font-retro text-xs mb-4">SCORE</p>
            <p className="text-6xl font-retro text-green-400 drop-shadow-[2px_2px_0_#000]">{score}</p>
          </div>

          {!isNewRecord && highScore > 0 && (
            <p className="font-retro text-yellow-400 text-sm tracking-widest drop-shadow-[2px_2px_0_#000]">
              TOP SCORE: {highScore}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        {isMultiplayer ? (
          !roomClosed && (
            <Button onClick={handleBackToLobby} className="w-full text-lg py-5 font-retro uppercase">
              <span>BACK TO LOBBY</span>
            </Button>
          )
        ) : (
          <Button onClick={handleTryAgain} className="w-full text-lg py-5 font-retro uppercase">
            <span>TRY AGAIN</span>
          </Button>
        )}

        <Button onClick={handleBackToMenu} variant="secondary" className="w-full text-lg py-5 font-retro uppercase">
          <span>BACK TO MENU</span>
        </Button>

        {!isMultiplayer && (
          <p className="hidden [@media(pointer:fine)]:block text-slate-500 font-retro text-[10px] tracking-widest">
            PRESS ENTER TO PLAY AGAIN
          </p>
        )}
      </div>
    </div>
  );
};

export default GameOver;
