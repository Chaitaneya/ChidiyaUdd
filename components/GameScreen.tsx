import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEntity, MultiplayerRoom, Player } from '../types';
import { INITIAL_SPEED, MIN_SPEED, SPEED_DECREMENT, MAX_LIVES } from '../constants';
import { fetchNewGameEntities } from '../services/geminiService';
import { multiplayer } from '../services/multiplayerService';
import { audio } from '../services/audioService';
import Button from './Button';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
  initialEntities: GameEntity[];
  isMultiplayer?: boolean;
}

interface VisualEffect {
  id: number;
  type: 'feather' | 'smoke';
  x: number; // percentage
  y: number; // percentage
  emoji: string;
  delay: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onExit, initialEntities, isMultiplayer = false }) => {
  const [entities, setEntities] = useState<GameEntity[]>(initialEntities);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  
  // Game Speed Logic (Smooth Transitions)
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);
  const [targetSpeed, setTargetSpeed] = useState(INITIAL_SPEED);
  
  // Gameplay Enhancements
  const [streak, setStreak] = useState(0);

  // Multiplayer State
  const [mpRoom, setMpRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom());
  
  // Game Loop State
  const [roundActive, setRoundActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100); // Percentage
  const [feedback, setFeedback] = useState<'hit' | 'miss' | 'safe' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const [isEliminated, setIsEliminated] = useState(false);
  
  // Visual Effects State
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const hasActedRef = useRef(false);
  const spokenIdxRef = useRef<number>(-1);
  const targetSpeedRef = useRef(INITIAL_SPEED);

  const successEmojis = ['🐦', '💨', '🥶', '🔥'];
  const failEmojis = ['🐔', '💀', '🐔', '😵‍💫'];

  const getRandom = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
  };


  // Sync ref with state for closure access
  useEffect(() => {
    targetSpeedRef.current = targetSpeed;
  }, [targetSpeed]);

  // Subscribe to Multiplayer Updates
  useEffect(() => {
    if (!isMultiplayer) return;

    const unsubscribe = multiplayer.subscribe((updatedRoom) => {
      setMpRoom(updatedRoom);
    });

    return () => {
      unsubscribe();
    };
  }, [isMultiplayer]);

  // Watch for Multiplayer Game End
  useEffect(() => {
    if (!isMultiplayer || !mpRoom) return;

    if (mpRoom.status === 'finished') {
      // All players are eliminated - both players see game over
      onGameOver(score);
    }
  }, [isMultiplayer, mpRoom?.status, score, onGameOver]);

  // Sync Score/Lives to Network (debounced)
  useEffect(() => {
    if (!isMultiplayer) return;

    // Send state update to network (debounced in service)
    multiplayer.updatePlayerState(score, lives);
  }, [score, lives, isMultiplayer]);

  // Prefetch more entities when running low (Single Player Only)
  useEffect(() => {
    // In Multiplayer, the entity list is fixed by the host at start to ensure fairness
    if (!isMultiplayer && entities.length - currentIdx < 15) {
      fetchNewGameEntities().then(newEntities => {
        setEntities(prev => [...prev, ...newEntities]);
      });
    }
  }, [currentIdx, entities.length, isMultiplayer]);

  // Clean up effects
  useEffect(() => {
    if (effects.length > 0) {
      const timer = setTimeout(() => {
        setEffects([]); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [effects]);

  const triggerFeathers = () => {
    const newEffects: VisualEffect[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      type: 'feather',
      x: Math.random() * 90 + 5,
      y: Math.random() * 10 + 5,
      emoji: getRandom(successEmojis),
      delay: Math.random() * 0.2
    }));
    setEffects(prev => [...prev, ...newEffects]);
  };

  const triggerSmoke = () => {
    const newEffects: VisualEffect[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      type: 'smoke',
      x: 50 + (Math.random() * 20 - 10),
      y: 40 + (Math.random() * 20 - 10),
      emoji: getRandom(failEmojis),
      delay: Math.random() * 0.2
    }));
    setEffects(prev => [...prev, ...newEffects]);
  };

  const endRound = useCallback((success: boolean, type: 'fly' | 'sit') => {
    setRoundActive(false);
    hasActedRef.current = true;
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (success) {
      // Score calculation with Streak Bonus
      setStreak(prev => {
        const newStreak = prev + 1;
        const streakBonus = Math.min(newStreak, 10) * 2; // Cap bonus multiplier
        setScore(s => s + 10 + streakBonus);
        return newStreak;
      });
      
      setFeedback(type === 'fly' ? 'hit' : 'safe');
      audio.playSuccess();
      
      if (type === 'fly') {
        triggerFeathers();
        if (navigator.vibrate) navigator.vibrate(50);
      }

      // Update Target Speed instead of Game Speed directly
      setTargetSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_DECREMENT));
      
      setTimeout(nextRound, 1300);
    } else {
      triggerSmoke();
      setFeedback('miss');
      setStreak(0);
      audio.playFail();
      if (navigator.vibrate) navigator.vibrate(200);

      setLives((l) => {
        const newLives = l - 1;

        if (newLives <= 0) {
          audio.playCrash();
          audio.playGameOver();
          if (navigator.vibrate) navigator.vibrate([200, 100, 400]);

          if (isMultiplayer) {
            multiplayer.updatePlayerState(score, 0);
            setIsEliminated(true);
          } else {
            setTimeout(() => onGameOver(score), 1000);
          }
        } else {
          setTimeout(nextRound, 1700);
        }

        return newLives;
      });
    }
  }, [score, onGameOver, isMultiplayer]);

  const nextRound = () => {
    // If we ran out of entities (Multiplayer end condition usually)
    if (currentIdx >= entities.length - 1) {
        onGameOver(score);
        return;
    }

    // Smoothly transition Game Speed towards Target Speed
    setGameSpeed(prev => {
        const diff = targetSpeedRef.current - prev;
        // Snap to target if very close to avoid infinitesimal updates
        if (Math.abs(diff) < 5) return targetSpeedRef.current;
        // Move 10% of the way towards the target for a smooth curve
        return prev + (diff * 0.1); 
    });

    setFeedback(null);
    setCurrentIdx(prev => prev + 1);
    setTimeLeft(100);
    setRoundActive(true);
    hasActedRef.current = false;
    startTimeRef.current = Date.now();
    audio.playPop();
  };

  useEffect(() => {
    nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentEntity = entities[currentIdx];

  // Speak the entity name when a new round starts
  useEffect(() => {
    if (roundActive && currentEntity && !isPaused && !showQuitConfirm && spokenIdxRef.current !== currentIdx) {
      const textToSpeak = currentEntity.translation || currentEntity.name;
      audio.speak(textToSpeak);
      spokenIdxRef.current = currentIdx;
    }
  }, [currentIdx, roundActive, currentEntity, isPaused, showQuitConfirm]);

  // Main Game Loop using requestAnimationFrame for smoothness
  useEffect(() => {
    if (!roundActive || isPaused || showQuitConfirm || !currentEntity || isEliminated) return;
    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingPct = 100 - (elapsed / gameSpeed) * 100;

      if (remainingPct <= 0) {
        setTimeLeft(0);
        if (hasActedRef.current) return; // Prevent double trigger
        
        // Time ran out logic
        if (currentEntity.canFly) {
            endRound(false, 'fly'); // Should have flown
        } else {
            endRound(true, 'sit'); // Correctly waited
        }
      } else {
        setTimeLeft(remainingPct);
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [roundActive, currentIdx, entities, gameSpeed, endRound, isPaused, showQuitConfirm, currentEntity]);

  const handleFlyAction = () => {
    if (!roundActive || hasActedRef.current || isPaused || showQuitConfirm) return;
    // Resume audio context on user interaction for Android
    audio.resume();
    audio.playClick();
    hasActedRef.current = true; 
    
    if (currentEntity.canFly) {
      endRound(true, 'fly');
    } else {
      endRound(false, 'fly');
    }
  };

  const handlePauseToggle = () => {
    // Multiplayer cannot be paused by one person, this function is mostly for Single Player now
    if (isMultiplayer) return;

    // Resume audio context on user interaction for Android
    audio.resume();
    audio.playClick();
    if (isPaused) {
      const pauseDuration = Date.now() - pausedAtRef.current;
      startTimeRef.current += pauseDuration;
      setIsPaused(false);
    } else {
      pausedAtRef.current = Date.now();
      setIsPaused(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  const handleMuteToggle = () => {
    // Resume audio context on user interaction for Android
    audio.resume();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const getFeedbackText = () => {
    if (feedback === 'miss') return 'WRONG!';
    if (feedback === 'hit') return 'GREAT!';
    if (feedback === 'safe') return 'CORRECT!'; 
    return '';
  };

  if (!currentEntity) return null;

  const primaryName = currentEntity.name;
  const secondaryName = currentEntity.translation ? `(${currentEntity.translation})` : null;

  // --- Live Leaderboard Component for Multiplayer ---
  const renderLeaderboard = () => {
    if (!isMultiplayer || !mpRoom) return null;
    
    // Sort by: Alive first, then Score
    const sortedPlayers = [...mpRoom.players].sort((a, b) => {
        if (a.status === 'alive' && b.status !== 'alive') return -1;
        if (b.status === 'alive' && a.status !== 'alive') return 1;
        return b.score - a.score;
    });

    return (
        <div className="absolute top-28 right-2 sm:right-4 z-30 flex flex-col gap-1 sm:gap-2 pointer-events-none opacity-90 max-w-xs">
            {sortedPlayers.map(p => (
                <div key={p.id} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0_0_#000] text-[10px] sm:text-xs font-bold whitespace-nowrap overflow-hidden ${p.status === 'alive' ? 'bg-white' : 'bg-slate-400 grayscale'}`}>
                    <span className="w-3 sm:w-4 flex-shrink-0">{p.status === 'alive' ? '🟢' : '💀'}</span>
                    <span className="max-w-[50px] sm:max-w-[80px] truncate">{p.name}</span>
                    <span className="text-blue-600 ml-auto flex-shrink-0">{p.score}</span>
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-full w-full relative pt-4 pb-4 select-none">

      {isEliminated && (
        <div className="absolute inset-0 z-[80] bg-black/90 flex flex-col items-center justify-center gap-6">
          <h2 className="text-3xl font-retro text-red-500 drop-shadow-[2px_2px_0_#000]">
            YOU ARE OUT
          </h2>

          <div className="bg-slate-800 px-6 py-4 border-4 border-white shadow-[6px_6px_0_0_#000] text-green-400 font-retro text-2xl">
            SCORE: {score}
          </div>

          <p className="text-slate-400 font-retro text-xs tracking-widest">
            Waiting for other players...
          </p>
        </div>
      )}
      
      {/* Effects Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
        {effects.map((effect) => (
          <div
            key={effect.id}
            className={effect.type === 'feather' ? 'animate-feather' : 'animate-smoke'}
            style={{
              left: `${effect.x}%`,
              top: effect.type === 'smoke' ? `${effect.y}%` : undefined,
              animationDelay: `${effect.delay}s`,
              fontSize: effect.type === 'feather' ? '2.5rem' : '4rem'
            }}
          >
            {effect.emoji}
          </div>
        ))}
      </div>

      {renderLeaderboard()}

      {/* HUD - Fixed Layout */}
      <div className="w-full max-w-md px-2 sm:px-4 h-12 sm:h-14 flex justify-between items-start z-20 font-retro relative shrink-0">
        {/* Left: HP */}
        <div className="flex flex-col items-start gap-0.5 sm:gap-1" role="status" aria-label={`Lives remaining: ${lives}`}>
          <span className="text-red-400 text-[8px] sm:text-xs tracking-widest uppercase">
            Health
          </span>

          <div className="flex gap-1 sm:gap-2 h-6 sm:h-8 items-center">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <div key={i} style={{ opacity: i < lives ? 1 : 0.3 }}>
              <img
                src={i < lives ? '/assets/emojis/heart.png' : '/assets/emojis/heartless.png'}
                alt="heart"
                className="w-6 h-6 sm:w-8 sm:h-8"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          ))}
          </div>
        </div>
        
        {/* Right: Score & Controls */}
        <div className="flex items-center gap-3">
          {/* SCORE */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-green-400 text-[10px] sm:text-xs tracking-widest uppercase">
              Score
            </span>
            <div className="relative bg-slate-800 px-3 py-1 h-10 border-2 border-slate-500 shadow-[2px_2px_0_0_#000] text-green-400 text-sm sm:text-base flex items-center justify-center min-w-[80px]">
              {score.toString().padStart(4, '0')}
              {streak > 1 && (
                <div className="absolute -bottom-3 right-0 text-[9px] text-orange-400 font-bold animate-pulse whitespace-nowrap bg-black px-1 border border-orange-500">
                  🔥 x{streak}
                </div>
              )}
            </div>
          </div>

          {/* SOUND */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-slate-400 text-[10px] sm:text-xs tracking-widest uppercase">
              Sound
            </span>
            <button
              onClick={handleMuteToggle}
              className="w-10 h-10 bg-slate-700 border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] hover:bg-slate-600 active:translate-y-1 focus:outline-none"
            >
              <span className="text-xl leading-none -translate-y-[2px]">
                {isMuted ? '🔇' : '🔊'}
              </span>
            </button>
          </div>

          {/* MENU / EXIT */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-slate-400 text-[10px] sm:text-xs tracking-widest uppercase">
              {isMultiplayer ? 'Exit' : 'Menu'}
            </span>
            <button
              onClick={isMultiplayer ? () => setShowQuitConfirm(true) : handlePauseToggle}
              className={`
                w-10 h-10 border-2 border-black flex items-center justify-center text-white text-lg leading-none shadow-[2px_2px_0_0_#000] active:translate-y-1 focus:outline-none transition-colors
                ${
                  isMultiplayer
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }
              `}
            >
              {isMultiplayer ? '✕' : isPaused ? '▶' : '||'}
            </button>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && !isMultiplayer && !showQuitConfirm && (
        <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl font-retro text-yellow-400 animate-pulse drop-shadow-[4px_4px_0_#000]">PAUSED</h2>
          <div className="flex flex-col gap-4 w-56 sm:w-64">
             <Button onClick={handlePauseToggle} variant="secondary">RESUME</Button>
             <Button onClick={() => setShowQuitConfirm(true)} variant="danger">EXIT GAME</Button>
          </div>
        </div>
      )}

      {/* Quit Confirmation Overlay - Stays within game container */}
      {showQuitConfirm && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center gap-6 backdrop-blur-sm rounded-none">
          <h2 className="text-2xl sm:text-3xl font-retro text-white drop-shadow-[4px_4px_0_#000]">LEAVE GAME?</h2>
          <div className="flex flex-col gap-4 w-56 sm:w-64">
             <Button onClick={onExit} variant="danger">YES, LEAVE</Button>
             <Button onClick={() => setShowQuitConfirm(false)} variant="secondary">CANCEL</Button>
          </div>
        </div>
      )}
      
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10 px-2 sm:px-4 min-h-0">
         
         <div className="h-12 sm:h-16 w-full flex items-center justify-center mb-1 sm:mb-2 shrink-0 relative">
             {feedback && (
              <div
                className={`
                  flex items-center justify-center
                  text-3xl sm:text-4xl md:text-5xl
                  font-retro animate-pop-in
                  ${feedback === 'miss' ? 'text-red-500' : 'text-green-400'}
                `}
                style={{ textShadow: '3px 3px 0px #000' }}
              >
                {feedback === 'miss'
                  ? 'WRONG!'
                  : feedback === 'hit'
                  ? 'GREAT!'
                  : 'CORRECT!'}
              </div>
            )}
         </div>
         
         <div className={`
             relative bg-slate-200 border-4 border-black p-3 sm:p-6 shadow-[8px_8px_0_0_#000]
             flex flex-col items-center gap-2 sm:gap-4 w-full max-w-xs sm:max-w-sm transition-transform duration-100
             ${roundActive ? 'scale-100' : 'scale-95 opacity-80'}
             ${feedback === 'miss' ? 'animate-shake bg-red-200' : ''}
         `}>
            
            <div className="text-5xl sm:text-7xl md:text-9xl filter drop-shadow-md select-none py-1 sm:py-2">
                {currentEntity.emoji}
            </div>
            
            <div className="text-center w-full min-h-[3rem] sm:min-h-[4rem] flex flex-col justify-center">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight leading-none break-words line-clamp-2 text-black mb-0.5 sm:mb-1">
                    {primaryName}
                </h2>
                {secondaryName && (
                    <p className="text-base sm:text-xl md:text-2xl text-blue-800 font-hindi leading-none font-bold bg-white/50 px-2 py-0.5 sm:py-1 inline-block rounded border-2 border-transparent">
                        {secondaryName}
                    </p>
                )}
            </div>

            <div className="w-full h-3 sm:h-4 bg-slate-800 border-2 border-black mt-1 sm:mt-2 relative overflow-hidden">
                <div 
                  className={`h-full border-r-2 border-black ${timeLeft < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${timeLeft}%` }}
                />
            </div>
         </div>
      </div>

      <div className="w-full max-w-md px-2 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 z-10 shrink-0">
         <button
            className={`
              w-full py-4 sm:py-5 md:py-6 bg-blue-600 text-white font-retro text-lg sm:text-xl md:text-2xl border-4 border-black
              shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#000] transition-all
              flex items-center justify-center gap-3 select-none
              ${!roundActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}
              focus:outline-none
            `}
            onClick={handleFlyAction}
            disabled={!roundActive || isEliminated}
         >
            FLY!
         </button>
      </div>

    </div>
  );
};

export default GameScreen;