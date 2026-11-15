import React, { useEffect, useRef, useState } from 'react';
import { GameEntity, MultiplayerRoom } from '../types';
import { multiplayer, COUNTDOWN_MS } from '../services/multiplayerService';
import { getCall } from '../services/entityService';
import { audio } from '../services/audioService';
import Button from './Button';
import IconButton from './IconButton';
import GameCard, { Feedback } from './game/GameCard';
import FeedbackText from './game/FeedbackText';
import FlyButton from './game/FlyButton';
import { Hearts, ScoreBox } from './game/Hud';
import { useEffects } from './game/Effects';
import { DECK_INFO } from './DeckPicker';

interface MultiplayerGameProps {
  /** The match finished (or the host left): show the results. */
  onMatchOver: () => void;
  onExit: () => void;
}

/**
 * Synced multiplayer: the host deals the same card to everyone at the same
 * moment and scores each round. This screen shows the card, takes the FLY tap
 * (timed on this device) and shows each round's result.
 */
const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ onMatchOver, onExit }) => {
  const [room, setRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom());
  const [entity, setEntity] = useState<GameEntity | null>(null);
  const [roundActive, setRoundActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [tapped, setTapped] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [extra, setExtra] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(Math.round(COUNTDOWN_MS / 1000));
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const { layer: effectsLayer, burst } = useEffects();

  const roundRef = useRef(-1);
  const roundStartRef = useRef(0);
  const durationRef = useRef(1);
  const tappedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const timeoutsRef = useRef(new Set<number>());
  const onMatchOverRef = useRef(onMatchOver);
  onMatchOverRef.current = onMatchOver;

  const myId = multiplayer.getCurrentPlayer()?.id;
  const me = room?.players.find((p) => p.id === myId);
  const alive = me?.status === 'alive';
  const started = entity !== null;

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
  };

  // Clean up timers on unmount.
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Room updates: scoreboard, and the end of the match.
  useEffect(() => {
    return multiplayer.subscribe((r) => {
      setRoom(r);
      if ((r.status === 'finished' || r.status === 'closed') && !finishedRef.current) {
        finishedRef.current = true;
        later(() => onMatchOverRef.current(), 2000); // let the last result land first
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "GET READY" countdown before the first card.
  useEffect(() => {
    if (started) return;
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [started]);

  // Round start / result from the host.
  useEffect(() => {
    return multiplayer.subscribeRounds((event) => {
      const r = multiplayer.getRoom();
      const card = r?.entities[event.round];
      if (!r || !card) return;

      if (event.type === 'start') {
        roundRef.current = event.round;
        roundStartRef.current = Date.now();
        durationRef.current = event.durationMs;
        tappedRef.current = false;
        setTapped(false);
        setEntity(card);
        setFeedback(null);
        setExtra(null);
        setNote(null);
        setTimeLeft(100);
        setRoundActive(true);
        audio.playPop();
        audio.speak(getCall(card), { rate: event.rate });
        return;
      }

      // Result
      setRoundActive(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const id = multiplayer.getCurrentPlayer()?.id;
      const mine = id ? event.outcomes[id] : undefined;
      if (!mine) {
        // Watching (already out): just reveal the answer.
        setNote(`${card.canFly ? 'UDTA HAI ✅' : 'NAHI UDTA ❌'} ${card.why}`);
        return;
      }
      if (mine.correct) {
        setFeedback(mine.tapped ? 'hit' : 'safe');
        setExtra(`+${mine.gained}${mine.fastest ? '  ⚡ FASTEST' : ''}`);
        audio.playSuccess();
        if (mine.tapped) {
          burst('feather');
          navigator.vibrate?.(50);
        }
      } else {
        setFeedback('miss');
        setNote(card.why);
        burst('smoke');
        audio.playFail();
        navigator.vibrate?.(200);
        if (r.players.find((p) => p.id === id)?.status === 'eliminated') {
          audio.playCrash();
          audio.playGameOver();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local round timer (the bar). The host decides the result.
  useEffect(() => {
    if (!roundActive) return;
    const loop = () => {
      const remaining = 100 - ((Date.now() - roundStartRef.current) / durationRef.current) * 100;
      if (remaining <= 0) {
        setTimeLeft(0);
        setRoundActive(false); // waiting for the host's result
        return;
      }
      setTimeLeft(remaining);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [roundActive]);

  const handleFly = () => {
    if (!roundActive || tappedRef.current || !alive || showQuitConfirm) return;
    tappedRef.current = true;
    setTapped(true);
    multiplayer.submitAnswer(roundRef.current, Date.now() - roundStartRef.current);
    audio.resume();
    audio.playClick();
    navigator.vibrate?.(30);
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

  // Keyboard: Space/Enter = FLY, Esc = leave dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.code === 'Space' || e.key === 'Enter') && !showQuitConfirm) {
        e.preventDefault();
        handleFly();
      } else if (e.key === 'Escape') {
        setShowQuitConfirm((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const rank = (s: string) => (s === 'alive' ? 0 : s === 'eliminated' ? 1 : 2);
  const standings = [...(room?.players ?? [])].sort((a, b) => rank(a.status) - rank(b.status) || b.score - a.score);
  const deck = room ? DECK_INFO[room.deckMode] : DECK_INFO.family;

  const flyHint = tapped ? 'LOCKED IN ✋' : !alive ? 'YOU ARE OUT' : started && !roundActive ? 'WAIT...' : undefined;

  return (
    <div className="flex flex-col items-center h-full w-full relative pt-4 pb-4 select-none">
      {effectsLayer}

      {/* HUD */}
      <div className="w-full max-w-md px-2 sm:px-4 h-12 sm:h-14 flex justify-between items-start z-20 relative shrink-0">
        <Hearts lives={me?.lives ?? 0} />
        <div className="flex items-center gap-3">
          <ScoreBox score={me?.score ?? 0} />
          <IconButton label="Sound" onClick={handleMuteToggle} ariaLabel={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? '🔇' : '🔊'}
          </IconButton>
          <IconButton label="Exit" tone="danger" onClick={() => setShowQuitConfirm(true)} ariaLabel="Leave match">
            ✕
          </IconButton>
        </div>
      </div>

      {/* Live standings (a strip under the HUD, so it never covers the card) */}
      <div className="w-full max-w-md px-2 sm:px-4 mt-3 flex flex-wrap justify-center gap-1.5 z-20 shrink-0" aria-label="Standings">
        {standings.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-1.5 px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000] text-[10px] sm:text-xs font-bold whitespace-nowrap text-black ${
              p.status === 'alive' ? 'bg-white' : 'bg-slate-400 grayscale'
            } ${p.id === myId ? 'outline-2 outline-yellow-400' : ''}`}
          >
            <span className="shrink-0 text-red-600">{p.status === 'alive' ? `${p.lives}♥` : p.status === 'left' ? '👋' : '💀'}</span>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{p.name}</span>
            <span className="text-blue-600 shrink-0">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10 px-2 sm:px-4 min-h-0 pb-16">
        {!alive && started && (
          <p className="mb-2 font-retro text-[10px] text-red-300 bg-black/60 px-3 py-1 border border-red-500">YOU'RE OUT · WATCHING</p>
        )}
        {entity ? (
          <>
            <FeedbackText feedback={feedback} extra={extra} />
            <GameCard entity={entity} timeLeft={timeLeft} active={roundActive} feedback={feedback} note={note} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
            <p className="font-retro text-yellow-400 text-2xl drop-shadow-[3px_3px_0_#000]">GET READY!</p>
            <p className="font-retro text-white text-7xl drop-shadow-[4px_4px_0_#000] animate-pop-in" key={countdown}>
              {countdown > 0 ? countdown : 'GO'}
            </p>
            <p className="font-retro text-[10px] text-slate-300">
              {deck.icon} {deck.label.toUpperCase()} DECK · EVERYONE SEES THE SAME CARD
            </p>
          </div>
        )}
      </div>

      <FlyButton onClick={handleFly} active={roundActive && alive && !tapped} hint={flyHint} />

      {/* Quit Confirmation Overlay */}
      {showQuitConfirm && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center gap-6 backdrop-blur-xs animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-retro text-white drop-shadow-[4px_4px_0_#000]">LEAVE MATCH?</h2>
          <p className="font-retro text-[10px] text-slate-400 text-center px-8 leading-relaxed">
            The match keeps going without you.{me?.isHost ? ' You are the host, so it ends for everyone.' : ''}
          </p>
          <div className="flex flex-col gap-4 w-56 sm:w-64">
            <Button onClick={handleExit} variant="danger">YES, LEAVE</Button>
            <Button onClick={() => setShowQuitConfirm(false)} variant="secondary">CANCEL</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerGame;
