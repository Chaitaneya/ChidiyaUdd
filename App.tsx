import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameEntity, DeckMode } from './types';
import { createDeck } from './services/entityService';
import { multiplayer } from './services/multiplayerService';
import { consumeLoginIntent } from './services/authService';
import { audio } from './services/audioService';
import { UserProvider, useUser } from './contexts/UserContext';
import { saveHighScore, getHighScore, getSavedDeckMode, saveDeckMode } from './utils/storage';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import MultiplayerGame from './components/MultiplayerGame';
import GameOver from './components/GameOver';
import MultiplayerSetup from './components/MultiplayerSetup';
import Lobby from './components/Lobby';
import LeaderMode from './components/LeaderMode';

const SPLASH_MS = 2500;

const AppContent: React.FC = () => {
  const { session } = useUser();
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [entities, setEntities] = useState<GameEntity[]>([]);
  const [isMultiplayerGame, setIsMultiplayerGame] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getHighScore());
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mpNotice, setMpNotice] = useState<string | null>(null);
  const [deckMode, setDeckMode] = useState<DeckMode>(() => getSavedDeckMode());

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const startedMatchRef = useRef<string | null>(null);

  useEffect(() => {
    audio.preload();
    const timer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  // Back from Google login after tapping "Multiplayer": go straight there.
  useEffect(() => {
    if (session && consumeLoginIntent() === 'multiplayer') {
      setGameState(GameState.MP_SETUP);
    }
  }, [session]);

  // Multiplayer navigation driven by the room: the host starting a match pulls
  // everyone in (from the lobby or the results screen); the host leaving closes it.
  useEffect(() => {
    return multiplayer.subscribe((room) => {
      const state = gameStateRef.current;
      const matchKey = `${room.code}:${room.matchId}`;

      if (
        room.status === 'playing' &&
        startedMatchRef.current !== matchKey &&
        (state === GameState.MP_LOBBY || state === GameState.GAME_OVER)
      ) {
        startedMatchRef.current = matchKey;
        setIsMultiplayerGame(true);
        setGameKey((k) => k + 1);
        setGameState(GameState.MP_PLAYING);
      } else if (room.status === 'closed' && state === GameState.MP_LOBBY) {
        multiplayer.leaveRoom();
        setMpNotice('THE HOST LEFT THE ROOM');
        setGameState(GameState.MP_SETUP);
      }
    });
  }, []);

  const changeDeckMode = (mode: DeckMode) => {
    setDeckMode(mode);
    saveDeckMode(mode);
  };

  const startSinglePlayer = () => {
    setEntities(createDeck(deckMode, 'sp'));
    setIsMultiplayerGame(false);
    setScore(0);
    setGameKey((k) => k + 1);
    setGameState(GameState.PLAYING);
  };

  const leaveRoomIfAny = () => {
    if (multiplayer.getRoom()) multiplayer.leaveRoom();
  };

  const handleBackToMenu = () => {
    leaveRoomIfAny();
    setScore(0);
    setGameState(GameState.MENU);
  };

  const handleOpenMultiplayer = () => {
    setMpNotice(null);
    setGameState(GameState.MP_SETUP);
  };

  const handleRoomReady = () => {
    setMpNotice(null);
    setGameState(GameState.MP_LOBBY);
  };

  const handleLobbyLeave = () => {
    leaveRoomIfAny();
    setGameState(GameState.MP_SETUP);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    const record = finalScore > 0 && finalScore > highScore;
    setIsNewRecord(record);
    if (record) {
      setHighScore(finalScore);
      saveHighScore(finalScore);
    }
    setGameState(GameState.GAME_OVER);
  };

  const handleMatchOver = () => {
    setScore(multiplayer.getCurrentPlayer()?.score ?? 0);
    setIsNewRecord(false);
    setGameState(GameState.GAME_OVER);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-0 sm:p-4 font-mono">
      {/* Retro pattern background */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* Main App Container */}
      <main className="w-full max-w-[480px] h-[100dvh] sm:h-[min(800px,calc(100dvh-2rem))] theme-bg sm:border-4 border-black shadow-2xl overflow-hidden relative flex flex-col z-10">
        {/* CRT Overlay */}
        <div className="absolute inset-0 scanlines z-50 pointer-events-none"></div>

        {gameState === GameState.MENU && (
          <MainMenu
            onStart={startSinglePlayer}
            onMultiplayer={handleOpenMultiplayer}
            onLeader={() => setGameState(GameState.LEADER)}
            highScore={highScore}
            isSplashActive={showSplash}
            deckMode={deckMode}
            onDeckModeChange={changeDeckMode}
          />
        )}

        {gameState === GameState.LEADER && (
          <LeaderMode deckMode={deckMode} onDeckModeChange={changeDeckMode} onExit={() => setGameState(GameState.MENU)} />
        )}

        {gameState === GameState.MP_SETUP && (
          <MultiplayerSetup
            onRoomReady={handleRoomReady}
            onBack={handleBackToMenu}
            notice={mpNotice}
            defaultDeckMode={deckMode}
            onDeckModeChange={changeDeckMode}
          />
        )}

        {gameState === GameState.MP_LOBBY && <Lobby onLeave={handleLobbyLeave} />}

        {gameState === GameState.PLAYING && (
          <GameScreen
            key={gameKey}
            onGameOver={handleGameOver}
            onExit={handleBackToMenu}
            initialEntities={entities}
            deckMode={deckMode}
          />
        )}

        {gameState === GameState.MP_PLAYING && (
          <MultiplayerGame key={gameKey} onMatchOver={handleMatchOver} onExit={handleBackToMenu} />
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOver
            score={score}
            highScore={highScore}
            isNewRecord={isNewRecord}
            isMultiplayer={isMultiplayerGame}
            onTryAgain={startSinglePlayer}
            onBackToMenu={handleBackToMenu}
            onBackToLobby={() => setGameState(GameState.MP_LOBBY)}
          />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
