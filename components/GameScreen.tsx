import React, { useState, useEffect, useRef } from 'react';
import { DeckMode, GameEntity } from '../types';
import { INITIAL_SPEED, MIN_SPEED, SPEED_DECREMENT, MAX_LIVES } from '../constants';
import { createDeck, getCall, minRoundMs, speechRateFor } from '../services/entityService';
import { audio } from '../services/audioService';
import Button from './Button';
import IconButton from './IconButton';
import GameCard, { Feedback } from './game/GameCard';
import FeedbackText from './game/FeedbackText';
import FlyButton from './game/FlyButton';
import { Hearts, ScoreBox } from './game/Hud';
import { useEffects } from './game/Effects';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
  initialEntities: GameEntity[];
  deckMode: DeckMode;
}

const NEXT_ROUND_DELAY_MS = 1300;
const AFTER_MISS_DELAY_MS = 2300; // a little longer, so the "why" can be read
const PREFETCH_THRESHOLD = 15;

/** 0 at the starting speed, 1 at top speed. */
const speedProgress = (curveMs: number) => (INITIAL_SPEED - curveMs) / (INITIAL_SPEED - MIN_SPEED);

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onExit, initialEntities, deckMode }) => {
  const [entities, setEntities] = useState<GameEntity[]>(initialEntities);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [roundActive, setRoundActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100); // percentage
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const { layer: effectsLayer, burst } = useEffects();

  // Refs mirror the game state so timers and the animation loop never read
  // stale values (and so state updaters stay free of side effects).
  const entitiesRef = useRef<GameEntity[]>(initialEntities);
  const idxRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const streakRef = useRef(0);
  const curveMsRef = useRef(INITIAL_SPEED); // difficulty curve
  const targetCurveMsRef = useRef(INITIAL_SPEED);
  const roundMsRef = useRef(INITIAL_SPEED); // this round's actual length
  const roundStartRef = useRef(0);
  const frozenAtRef = useRef(0);
  const frozenRef = useRef(false);
  const actedRef = useRef(true); // true whenever no round is accepting input
  const pendingNextRoundRef = useRef(false);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timeoutsRef = useRef(new Set<number>());
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const frozen = isPaused || showQuitConfirm;

  // ---------------- Helpers ----------------

  /** setTimeout that is cancelled automatically if the screen unmounts. */
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
  };

  const finishGame = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onGameOverRef.current(scoreRef.current);
  };

  const speak = (entity: GameEntity) => {
    audio.speak(getCall(entity), { rate: speechRateFor(speedProgress(curveMsRef.current)) });
  };

  // ---------------- Round flow ----------------

  const startRound = (idx: number) => {
    if (finishedRef.current) return;
    if (frozenRef.current) {
      // Paused between rounds: start this one when play resumes.
      pendingNextRoundRef.current = true;
      return;
    }

    // Endless: append a fresh deck before running low.
    if (entitiesRef.current.length - idx < PREFETCH_THRESHOLD) {
      const deck = entitiesRef.current;
      entitiesRef.current = [...deck, ...createDeck(deckMode, 'sp', deck[deck.length - 1])];
      setEntities(entitiesRef.current);
    }
    const entity = entitiesRef.current[idx];

    // Ease the difficulty curve towards its target so speed-ups feel smooth…
    const diff = targetCurveMsRef.current - curveMsRef.current;
    curveMsRef.current = Math.abs(diff) < 5 ? targetCurveMsRef.current : curveMsRef.current + diff * 0.1;
    // …but always leave enough time to hear (and read) longer names.
    const rate = speechRateFor(speedProgress(curveMsRef.current));
    roundMsRef.current = Math.max(curveMsRef.current, minRoundMs(entity, rate));

    idxRef.current = idx;
    setCurrentIdx(idx);
    setFeedback(null);
    setTimeLeft(100);
    setRoundActive(true);
    actedRef.current = false;
    roundStartRef.current = Date.now();

    audio.playPop();
    speak(entity);
  };

  const endRound = (success: boolean, action: 'fly' | 'wait') => {
    if (actedRef.current) return;
    actedRef.current = true;
    setRoundActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (success) {
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      scoreRef.current += 10 + Math.min(newStreak, 10) * 2; // streak bonus, capped
      setStreak(newStreak);
      setScore(scoreRef.current);
      setFeedback(action === 'fly' ? 'hit' : 'safe');
      audio.playSuccess();
      if (action === 'fly') {
        burst('feather');
        navigator.vibrate?.(50);
      }
      targetCurveMsRef.current = Math.max(MIN_SPEED, targetCurveMsRef.current - SPEED_DECREMENT);
      later(() => startRound(idxRef.current + 1), NEXT_ROUND_DELAY_MS);
      return;
    }

    burst('smoke');
    setFeedback('miss');
    streakRef.current = 0;
    setStreak(0);
    audio.playFail();
    navigator.vibrate?.(200);

    livesRef.current -= 1;
    setLives(livesRef.current);

    if (livesRef.current > 0) {
      later(() => startRound(idxRef.current + 1), AFTER_MISS_DELAY_MS);
      return;
    }

    audio.playCrash();
    audio.playGameOver();
    navigator.vibrate?.([200, 100, 400]);
    later(finishGame, 1800);
  };

  // ---------------- Lifecycle ----------------

  // Start the first round once (React StrictMode runs mount effects twice in dev).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startRound(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cancel pending rounds/game-over timers if the player leaves mid-round.
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pausing (or the quit dialog) freezes the round clock.
  useEffect(() => {
    if (frozen === frozenRef.current) return;
    frozenRef.current = frozen;
    if (frozen) {
      frozenAtRef.current = Date.now();
      audio.stopSpeaking();
      return;
    }
    roundStartRef.current += Date.now() - frozenAtRef.current;
    if (pendingNextRoundRef.current) {
      pendingNextRoundRef.current = false;
      startRound(idxRef.current + 1);
    } else if (!actedRef.current) {
      speak(entitiesRef.current[idxRef.current]); // pausing cut the call off
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen]);

  // Round timer (requestAnimationFrame for a smooth bar).
  useEffect(() => {
    if (!roundActive || frozen) return;
    const loop = () => {
      const elapsed = Date.now() - roundStartRef.current;
      const remaining = 100 - (elapsed / roundMsRef.current) * 100;
      if (remaining <= 0) {
        setTimeLeft(0);
        // Time's up: waiting was right only if it can't fly.
        const entity = entitiesRef.current[idxRef.current];
        endRound(!entity.canFly, 'wait');
        return;
      }
      setTimeLeft(remaining);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundActive, frozen, currentIdx]);

  // Pause automatically when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && !finishedRef.current) setIsPaused(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ---------------- Controls ----------------

  const handleFlyAction = () => {
    if (actedRef.current || frozenRef.current) return;
    audio.resume();
    audio.playClick();
    const entity = entitiesRef.current[idxRef.current];
    endRound(entity.canFly, 'fly');
  };

  const handlePauseToggle = () => {
    audio.resume();
    audio.playClick();
    setIsPaused((p) => !p);
  };

  const handleMuteToggle = () => {
    audio.resume();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const handleExit = () => {
    audio.stopSpeaking();
    onExit();
  };

  // Keyboard: Space/Enter = FLY, P = pause, Esc = pause / close dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === 'Space' || e.key === 'Enter') {
        if (frozenRef.current) return; // let focused dialog buttons handle it
        e.preventDefault();
        handleFlyAction();
      } else if (e.key === 'p' || e.key === 'P') {
        if (!showQuitConfirm) handlePauseToggle();
      } else if (e.key === 'Escape') {
        if (showQuitConfirm) setShowQuitConfirm(false);
        else handlePauseToggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const currentEntity = entities[currentIdx];
  if (!currentEntity) return null;

  // ---------------- Render ----------------

  return (
    <div className="flex flex-col items-center h-full w-full relative pt-4 pb-4 select-none">
      {effectsLayer}

      {/* HUD */}
      <div className="w-full max-w-md px-2 sm:px-4 h-12 sm:h-14 flex justify-between items-start z-20 relative shrink-0">
        <Hearts lives={lives} />
        <div className="flex items-center gap-3">
          <ScoreBox score={score} streak={streak} />
          <IconButton label="Sound" onClick={handleMuteToggle} ariaLabel={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? '🔇' : '🔊'}
          </IconButton>
          <IconButton label="Menu" onClick={handlePauseToggle} ariaLabel={isPaused ? 'Resume' : 'Pause'}>
            {isPaused ? '▶' : '||'}
          </IconButton>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && !showQuitConfirm && (
        <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center gap-6 backdrop-blur-xs animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-retro text-yellow-400 animate-pulse drop-shadow-[4px_4px_0_#000]">PAUSED</h2>
          <div className="flex flex-col gap-4 w-56 sm:w-64">
            <Button onClick={handlePauseToggle} variant="secondary">RESUME</Button>
            <Button onClick={() => setShowQuitConfirm(true)} variant="danger">EXIT GAME</Button>
          </div>
          <p className="hidden [@media(pointer:fine)]:block text-slate-500 font-retro text-[10px] tracking-widest">PRESS P TO RESUME</p>
        </div>
      )}

      {/* Quit Confirmation Overlay */}
      {showQuitConfirm && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center gap-6 backdrop-blur-xs animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-retro text-white drop-shadow-[4px_4px_0_#000]">LEAVE GAME?</h2>
          <div className="flex flex-col gap-4 w-56 sm:w-64">
            <Button onClick={handleExit} variant="danger">YES, LEAVE</Button>
            <Button onClick={() => setShowQuitConfirm(false)} variant="secondary">CANCEL</Button>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10 px-2 sm:px-4 min-h-0 pb-16">
        <FeedbackText feedback={feedback} />
        <GameCard
          entity={currentEntity}
          timeLeft={timeLeft}
          active={roundActive}
          feedback={feedback}
          note={feedback === 'miss' ? currentEntity.why : null}
        />
      </div>

      <FlyButton onClick={handleFlyAction} active={roundActive} />
    </div>
  );
};

export default GameScreen;
