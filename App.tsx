
import React, { useState, useEffect } from 'react';
import { GameState, GameEntity } from './types';
import { FALLBACK_ENTITIES } from './constants';
import { fetchNewGameEntities, shuffleArray } from './services/geminiService';
import { multiplayer } from './services/multiplayerService';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import GameOver from './components/GameOver';
import MultiplayerSetup from './components/MultiplayerSetup';
import Lobby from './components/Lobby';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [entities, setEntities] = useState<GameEntity[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Load High Score on Mount
  useEffect(() => {
    const saved = localStorage.getItem('chidiya_udd_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    
    // Splash Timer: 2.5s duration
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const preloadGame = () => {
    setLoading(true);
    setTimeout(() => {
      const startingData = shuffleArray(FALLBACK_ENTITIES).map((item, index) => ({
        ...item,
        id: `start-${Date.now()}-${index}`
      }));
      setEntities(startingData);
      setGameState(GameState.PLAYING);
      setLoading(false);
    }, 100);
  };

  const handleStartGame = () => {
    preloadGame();
  };

  const handleMultiplayer = () => {
    setGameState(GameState.MP_SETUP);
  };

  const handleLobbyStart = () => {
    setGameState(GameState.MP_LOBBY);
  };
  
  const handleMPGameStart = () => {
    // When host starts game, get the shared entities
    const room = multiplayer.getRoom();
    if (room && room.entities) {
        setEntities(room.entities);
        setGameState(GameState.PLAYING);
    }
  };

  const handleLobbyLeave = () => {
    multiplayer.leaveRoom();
    setGameState(GameState.MP_SETUP);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    if (gameState === GameState.PLAYING && !multiplayer.getRoom()) {
        // Only update local highscore for single player
        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('chidiya_udd_highscore', finalScore.toString());
        }
    }
    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    setGameState(GameState.MENU);
    setScore(0);
  };
  
  const handleExitGame = () => {
    if (multiplayer.getRoom()) {
        multiplayer.leaveRoom();
    }
    setGameState(GameState.MENU);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-0 sm:p-4 font-mono">
      {/* Retro pattern background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>
      
      {/* 
        MAIN APP CONTAINER 
        - Replaced bg-slate-800 with theme-bg for the gradient 
      */}
      <div className="w-full max-w-[480px] h-[100dvh] sm:h-[800px] theme-bg sm:border-4 border-black shadow-2xl overflow-hidden relative flex flex-col z-10">
        
        {/* CRT Overlay */}
        <div className="absolute inset-0 scanlines z-50 pointer-events-none"></div>

        {gameState === GameState.MENU && (
          <MainMenu 
            onStart={handleStartGame} 
            onMultiplayer={handleMultiplayer}
            isLoading={loading} 
            highScore={highScore}
            isSplashActive={showSplash}
          />
        )}

        {gameState === GameState.MP_SETUP && (
            <MultiplayerSetup 
                onGameStart={handleLobbyStart}
                onBack={() => setGameState(GameState.MENU)}
            />
        )}

        {gameState === GameState.MP_LOBBY && (
            <Lobby 
                onStartGame={handleMPGameStart} 
                onLeave={handleLobbyLeave}
            />
        )}

        {gameState === GameState.PLAYING && (
          <GameScreen 
            onGameOver={handleGameOver} 
            onExit={handleExitGame}
            initialEntities={entities} 
            isMultiplayer={!!multiplayer.getRoom()}
          />
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOver 
            score={score} 
            highScore={highScore}
            onRestart={handleRestart} 
          />
        )}

      </div>
    </div>
  );
};

export default App;
