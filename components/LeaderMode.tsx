import React, { useEffect, useRef, useState } from 'react';
import { DeckMode, GameEntity } from '../types';
import { LEADER_PACES, LEADER_SPEEDUP } from '../constants';
import { callDurationMs, createDeck, getCall } from '../services/entityService';
import { audio } from '../services/audioService';
import Button from './Button';
import IconButton from './IconButton';
import SegmentedControl, { SegmentOption } from './SegmentedControl';
import GameCard from './game/GameCard';
import { StatBox } from './game/Hud';
import { DeckChooser } from './DeckPicker';

interface LeaderModeProps {
  deckMode: DeckMode;
  onDeckModeChange: (mode: DeckMode) => void;
  onExit: () => void;
}

type Pace = keyof typeof LEADER_PACES;
type Phase = 'setup' | 'running' | 'paused';

const PACES: SegmentOption<Pace>[] = [
  { id: 'slow', icon: '🐢', label: 'Slow', description: 'Calm, clear calls. Great for kids.' },
  { id: 'fast', icon: '🐇', label: 'Fast', description: 'A bit quicker, speeds up slowly.' },
];

// Short enough to fit one line each, even on a 320px-wide phone.
const HOW_IT_WORKS: [string, string][] = [
  ['☝️', 'Fingers on the table'],
  ['📣', 'Phone calls "Tota udd!"'],
  ['🐦', 'Lift only if it flies'],
  ['🏆', 'Wrong lift? You\'re out!'],
];

/**
 * Leader mode: the phone is the caller ("Tota udd! Bhains udd!"), faster and
 * faster, while friends play the real game with fingers on a table. Works
 * offline, no login.
 */
const LeaderMode: React.FC<LeaderModeProps> = ({ deckMode, onDeckModeChange, onExit }) => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [pace, setPace] = useState<Pace>('slow');
  const [card, setCard] = useState<GameEntity | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [callCount, setCallCount] = useState(0);
  const [gapMs, setGapMs] = useState<number>(LEADER_PACES.slow.startMs);
  const [isMuted, setIsMuted] = useState(audio.isMuted());

  const deckRef = useRef<GameEntity[]>([]);
  const indexRef = useRef(0);
  const gapRef = useRef<number>(LEADER_PACES.slow.startMs);
  const minGapRef = useRef<number>(LEADER_PACES.slow.minMs);
  const timersRef = useRef(new Set<number>());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const phaseRef = useRef<Phase>('setup');
  phaseRef.current = phase;

  // ---------------- Timers & screen wake lock ----------------

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
  };

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
  };

  const keepScreenOn = async () => {
    try {
      if (!wakeLockRef.current) wakeLockRef.current = (await navigator.wakeLock?.request('screen')) ?? null;
    } catch {
      /* not supported or denied: the game still works */
    }
  };

  const releaseScreen = () => {
    void wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimers();
      releaseScreen();
      audio.stopSpeaking();
    };
  }, []);

  // Switching apps pauses the caller; coming back re-takes the wake lock.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === 'running') pause();
      if (!document.hidden && phaseRef.current !== 'setup') void keepScreenOn();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Calling loop ----------------

  const nextCard = (): GameEntity => {
    if (indexRef.current >= deckRef.current.length) {
      const last = deckRef.current[deckRef.current.length - 1];
      deckRef.current = [...deckRef.current, ...createDeck(deckMode, 'leader', last)];
    }
    return deckRef.current[indexRef.current++];
  };

  const call = () => {
    if (phaseRef.current !== 'running') return;
    const entity = nextCard();
    // The voice always talks at normal speed; only the gap between calls shrinks.
    const rate = 1;
    const speech = callDurationMs(entity, rate);
    // Never call the next one before this one has been said and seen.
    const gap = Math.max(gapRef.current, speech + 800);

    setCard(entity);
    setRevealed(false);
    setCallCount((n) => n + 1);
    setGapMs(gapRef.current);
    audio.speak(getCall(entity), { rate });

    // Reveal the answer once everyone has had a moment to lift (or not).
    later(() => setRevealed(true), Math.min(speech + 450, gap - 250));
    later(call, gap);
    gapRef.current = Math.max(minGapRef.current, Math.round(gapRef.current * LEADER_SPEEDUP));
  };

  const start = () => {
    audio.unlock(); // inside the tap, so speech works on iPhones
    if (audio.isMuted()) {
      audio.toggleMute();
      setIsMuted(false);
    }
    deckRef.current = createDeck(deckMode, 'leader');
    indexRef.current = 0;
    gapRef.current = LEADER_PACES[pace].startMs;
    minGapRef.current = LEADER_PACES[pace].minMs;
    setGapMs(LEADER_PACES[pace].startMs);
    setCallCount(0);
    setCard(null);
    phaseRef.current = 'running';
    setPhase('running');
    void keepScreenOn();
    later(call, 900);
  };

  const pause = () => {
    clearTimers();
    audio.stopSpeaking();
    phaseRef.current = 'paused';
    setPhase('paused');
  };

  const resume = () => {
    audio.unlock();
    phaseRef.current = 'running';
    setPhase('running');
    void keepScreenOn();
    later(call, 700);
  };

  const stop = () => {
    clearTimers();
    audio.stopSpeaking();
    releaseScreen();
    phaseRef.current = 'setup';
    setPhase('setup');
    setCard(null);
  };

  const handleMuteToggle = () => {
    audio.resume();
    setIsMuted(audio.toggleMute());
  };

  // Keyboard: Space = pause/resume, Esc = stop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || phaseRef.current === 'setup') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (phaseRef.current === 'running') pause();
        else resume();
      } else if (e.key === 'Escape') {
        stop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------------- Setup screen ----------------

  if (phase === 'setup') {
    return (
      <div className="flex flex-col h-full w-full">
        {/* Header: back, title, spacer (same pattern as the lobby). Never scrolls. */}
        <div className="shrink-0 w-full max-w-md mx-auto px-4 pt-4 pb-3 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playClick();
              onExit();
            }}
            className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
            aria-label="Go back"
          >
            <span className="text-3xl leading-none -translate-y-[1px] inline-block">←</span>
          </button>
          <h1 className="text-lg sm:text-xl text-yellow-400 font-retro drop-shadow-[2px_2px_0_#000]">LEADER MODE</h1>
          <div className="w-10" />
        </div>

        {/* How it works + settings scroll; START always stays in view below. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-1 pb-4">
          <div className="w-full max-w-sm mx-auto space-y-6 animate-fade-in">
            <ul className="bg-black/30 border-2 border-slate-700 px-4 py-3 space-y-2" aria-label="How it works">
              {HOW_IT_WORKS.map(([icon, text]) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="w-6 text-center text-lg leading-6 shrink-0" aria-hidden="true">{icon}</span>
                  <span className="font-vt323 text-xl leading-6 text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">{text}</span>
                </li>
              ))}
            </ul>

            <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-5 space-y-6">
              <DeckChooser mode={deckMode} onChange={(m) => { audio.playClick(); onDeckModeChange(m); }} />
              <SegmentedControl
                label="Start pace"
                value={pace}
                onChange={(p) => { audio.playClick(); setPace(p); }}
                options={PACES}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full max-w-sm mx-auto px-4 pt-3 pb-4">
          <Button onClick={start} className="w-full text-lg py-4">
            <span>START CALLING</span>
            <span className="-translate-y-[3px] inline-block">▶</span>
          </Button>
          <p className="mt-3 text-center font-retro text-[8px] text-slate-400 leading-relaxed">WORKS OFFLINE · TURN THE VOLUME UP</p>
        </div>
      </div>
    );
  }

  // ---------------- Calling screen ----------------

  const paused = phase === 'paused';

  return (
    <div className="flex flex-col items-center h-full w-full relative pt-4 pb-4 select-none">
      {/* Top bar: same layout as the game screens (stats left, controls right) */}
      <div className="w-full max-w-md px-2 sm:px-4 flex justify-between items-start z-20 shrink-0">
        <StatBox label="Call" value={String(callCount).padStart(2, '0')} tone="yellow" align="start" />
        <div className="flex items-start gap-3">
          <StatBox label="Pace" value={`${(gapMs / 1000).toFixed(1)}s`} />
          <IconButton label="Sound" onClick={handleMuteToggle} ariaLabel={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? '🔇' : '🔊'}
          </IconButton>
          <IconButton label="Stop" tone="danger" onClick={stop} ariaLabel="Stop calling">
            ■
          </IconButton>
        </div>
      </div>

      {isMuted && (
        <p className="font-retro text-[10px] text-red-300 bg-black/60 px-3 py-1 border border-red-500 mt-3">🔇 SOUND IS OFF: NOBODY CAN HEAR THE CALLS</p>
      )}

      {/* The call */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-4 min-h-0 gap-6">
        {card ? (
          <>
            <GameCard entity={card} size="large" active={!paused} />
            <div className="h-20 w-full flex flex-col items-center justify-start">
              {revealed && (
                <div className="flex flex-col items-center gap-2 animate-pop-in">
                  <span
                    className={`font-retro text-xl sm:text-2xl px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] ${
                      card.canFly ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                    }`}
                  >
                    {card.canFly ? '✅️ UDD!' : '❌️ NAHI!'}
                  </span>
                  <span className="font-retro text-[10px] text-slate-200 text-center leading-relaxed">{card.why}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="font-retro text-yellow-400 text-2xl animate-pulse drop-shadow-[3px_3px_0_#000]">FINGERS DOWN!</p>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-md px-2 sm:px-6 pb-4 sm:pb-6 pt-1 shrink-0">
        <Button onClick={paused ? resume : pause} variant={paused ? 'primary' : 'secondary'} className="w-full text-lg py-5">
          {paused ? '▶ RESUME' : '|| PAUSE'}
        </Button>
        <p className="hidden [@media(pointer:fine)]:block mt-3 text-center text-slate-500 font-retro text-[10px] tracking-widest">
          SPACE = PAUSE · ESC = STOP
        </p>
      </div>
    </div>
  );
};

export default LeaderMode;
