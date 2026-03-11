import React, { useState, useEffect } from 'react';
import Button from './Button';
import { audio } from '../services/audioService';
import { multiplayer } from '../services/multiplayerService';
import { MultiplayerRoom } from '../types';
import confetti from 'canvas-confetti';

interface GameOverProps {
  score: number;
  highScore: number;
  onTryAgain: () => void;
  onBackToMenu: () => void;
  onBackToLobby?: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  onTryAgain,
  onBackToMenu,
  onBackToLobby,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;

  // Multiplayer state (UNCHANGED)
  const [mpRoom, setMpRoom] = useState<MultiplayerRoom | null>(
    multiplayer.getRoom()
  );
  const isMultiplayer = !!mpRoom;

  // 🎉 Confetti (single-player only)
  useEffect(() => {
    if (!isNewHighScore || isMultiplayer) return;

    // Left burst
    confetti({
      particleCount: 90,
      angle: 20,
      spread: 55,
      startVelocity: 35,
      origin: { x: 0.18, y: 0.55 },
      gravity: 0.9,
      ticks: 160,
      colors: ['#FFD700', '#FF6B6B', '#4ADE80', '#60A5FA'],
    });

    // Right burst
    confetti({
      particleCount: 90,
      angle: 160,
      spread: 55,
      startVelocity: 35,
      origin: { x: 0.82, y: 0.55 },
      gravity: 0.9,
      ticks: 160,
      colors: ['#FFD700', '#FF6B6B', '#4ADE80', '#60A5FA'],
    });
  }, [isNewHighScore, isMultiplayer]);

  // Multiplayer subscription (UNCHANGED)
  useEffect(() => {
    if (isMultiplayer) {
      const unsub = multiplayer.subscribe((updatedRoom) => {
        setMpRoom(updatedRoom);
      });
      return unsub;
    }
  }, [isMultiplayer]);

  const handleTryAgainClick = () => {
    audio.playClick();
    if (isMultiplayer) {
      window.location.reload();
    } else {
      onTryAgain();
    }
  };

  const handleBackToMenuClick = () => {
    audio.playClick();
    onBackToMenu();
  };

  const handleBackToLobbyClick = () => {
    audio.playClick();
    onBackToLobby?.();
  };

  const renderMultiplayerResults = () => {
    if (!mpRoom) return null;

    const sorted = [...mpRoom.players].sort((a, b) => b.score - a.score);
    const myId = multiplayer.getCurrentPlayer()?.id;
    const isGameActive = mpRoom.players.some((p) => p.status === 'alive');

    return (
      <div className="w-full max-w-sm bg-white rounded-2xl p-4 text-slate-800 shadow-xl mb-4">
        <h3 className="flex items-center justify-center gap-2 font-retro text-xl mb-4 border-b-2 border-slate-200 pb-2">
  {!isGameActive && (
    <span className="text-2xl inline-block -translate-y-[5px]">🏁</span>
  )}
  <span>{isGameActive ? 'Live Standings' : 'Final Standings'}</span>
</h3>

        <div className="space-y-3">
          {sorted.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                p.id === myId
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl w-6">
                  {idx === 0
                    ? '🥇'
                    : idx === 1
                    ? '🥈'
                    : idx === 2
                    ? '🥉'
                    : `${idx + 1}.`}
                </span>
                <div>
                  <span className="font-bold">
                    {p.name} {p.id === myId && '(You)'}
                  </span>
                  {p.status === 'eliminated' && (
                    <div className="text-[10px] text-slate-400 uppercase">
                      Eliminated
                    </div>
                  )}
                </div>
              </div>

              {p.status === 'alive' ? (
                <span className="font-retro text-xs text-green-600 border border-green-400 px-2 py-1 rounded bg-green-50">
                  PLAYING…
                </span>
              ) : (
                <span className="font-mono font-bold text-blue-600 text-xl">
                  {p.score}
                </span>
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
          <h2 className="text-3xl font-retro text-yellow-400 drop-shadow-[2px_2px_0_#000]">
            MATCH OVER
          </h2>
          {renderMultiplayerResults()}
        </>
      ) : (
        <div className="space-y-6 w-full">
          <h2 className="text-3xl sm:text-4xl font-retro text-red-500 drop-shadow-[2px_2px_0_#000]">
            {isNewHighScore ? 'NEW RECORD!' : 'GAME OVER'}
          </h2>

          <div className="bg-slate-800 p-8 border-4 border-white shadow-[8px_8px_0_0_#000] w-full max-w-xs mx-auto relative">
            {isNewHighScore && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 font-retro text-[10px] uppercase border-2 border-black">
                High Score
              </div>
            )}

            <p className="text-slate-400 font-retro text-xs mb-4">SCORE</p>
            <p className="text-6xl font-retro text-green-400 drop-shadow-[2px_2px_0_#000]">
              {score}
            </p>
          </div>

          {!isNewHighScore && highScore > 0 && (
            <p className="font-retro text-yellow-400 text-sm tracking-widest drop-shadow-[2px_2px_0_#000]">
              TOP SCORE: {highScore}
            </p>
          )}
        </div>
      )}

      {/* ✅ BUTTONS – Different for Single vs Multiplayer */}
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        {isMultiplayer ? (
          <>
            {/* Multiplayer Buttons */}
            <Button
              onClick={handleBackToLobbyClick}
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span className="text-2xl leading-none -translate-y-[2px]">
                👥
              </span>
              <span>BACK TO LOBBY</span>
            </Button>

            <Button
              onClick={handleBackToMenuClick}
              variant="secondary"
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span className="text-2xl leading-none -translate-y-[2px]">
                🏠
              </span>
              <span>BACK TO MENU</span>
            </Button>
          </>
        ) : (
          <>
            {/* Single Player Buttons */}
            <Button
              onClick={handleTryAgainClick}
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span className="inline-flex items-center justify-center w-10 h-6 border-2 border-black bg-black/30 text-sm">
                1P
              </span>
              <span>TRY AGAIN</span>
            </Button>

            <Button
              onClick={handleBackToMenuClick}
              variant="secondary"
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span className="text-2xl leading-none -translate-y-[2px]">
                🏠
              </span>
              <span>BACK TO MENU</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOver;