import React, { useState } from 'react';
import { multiplayer } from '../services/multiplayerService';
import { audio } from '../services/audioService';
import Button from './Button';

interface MultiplayerSetupProps {
  onGameStart: () => void;
  onBack: () => void;
}

// --- Shared Retro Input ---
interface RetroInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
}

const RetroInput: React.FC<RetroInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 20,
}) => (
  <div className="w-full mb-6">
    <label className="block text-green-400 font-retro text-xs mb-2 tracking-widest uppercase text-left">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full bg-black border-4 border-slate-600 p-3 text-xl sm:text-2xl font-vt323 text-yellow-400 focus:border-blue-500 focus:outline-none placeholder-slate-700 uppercase"
    />
  </div>
);

// --- CLEAN ICON-ONLY BACK BUTTON ---
const BackButton = ({
  action,
  defaultBack,
}: {
  action?: () => void;
  defaultBack: () => void;
}) => (
  <button
    onClick={action || defaultBack}
    className="absolute top-4 left-4 text-2xl text-white/80 hover:text-white active:translate-y-[1px] focus:outline-none z-50"
    aria-label="Back"
  >
    ◀️
  </button>
);

const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({
  onGameStart,
  onBack,
}) => {
  const [view, setView] = useState<'menu' | 'create' | 'join'>('menu');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return setError('ENTER NAME!');
    audio.resume();
    audio.warmup();
    await multiplayer.createRoom(name);
    onGameStart();
  };

  const handleJoin = () => {
    if (!name.trim()) return setError('ENTER NAME!');
    if (roomCode.length !== 4) return setError('INVALID CODE!');
    audio.resume();
    audio.warmup();

    const success = multiplayer.joinRoom(roomCode.toUpperCase(), name);
    if (success) {
      onGameStart();
    } else {
      setError('ROOM NOT FOUND!');
    }
  };

  // ===== MENU VIEW =====
  if (view === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        <BackButton defaultBack={onBack} />

        <div className="max-w-sm w-full animate-fade-in flex flex-col items-center gap-8">
          <h1 className="text-3xl sm:text-4xl text-yellow-400 font-retro text-center drop-shadow-[4px_4px_0_#000]">
            MULTIPLAYER
          </h1>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-4">
  <div className="w-full flex flex-col gap-4">
  <Button
    onClick={() => setView('create')}
    className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
  >
    <span className="text-2xl leading-none -translate-y-[4px] inline-block">👑</span>
    <span>HOST GAME</span>
  </Button>

  <Button
    onClick={() => setView('join')}
    variant="secondary"
    className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
  >
    <span className="text-2xl leading-none -translate-y-[4px] inline-block">🎮</span>
    <span>JOIN GAME</span>
  </Button>
</div>
</div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CREATE VIEW =====
  if (view === 'create') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        <BackButton action={() => setView('menu')} defaultBack={onBack} />

        <div className="w-full max-w-sm animate-slide-up">
          <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full">
            <h2 className="text-xl text-white font-retro mb-6 text-center border-b-4 border-black pb-4">
              HOST GAME
            </h2>

            <RetroInput
              label="PLAYER NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="P1"
            />

            {error && (
              <p className="text-red-500 font-retro text-xs mb-4 text-center blink">
                {error}
              </p>
            )}

            <Button onClick={handleCreate} className="w-full text-lg">
              CREATE ROOM
            </Button>

            <button
              onClick={() => setView('menu')}
              className="w-full mt-4 text-slate-500 font-retro text-xs hover:text-white"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== JOIN VIEW =====
  if (view === 'join') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        <BackButton action={() => setView('menu')} defaultBack={onBack} />

        <div className="w-full max-w-sm animate-slide-up">
          <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full">
            <h2 className="text-xl text-white font-retro mb-6 text-center border-b-4 border-black pb-4">
              JOIN GAME
            </h2>

            <RetroInput
              label="PLAYER NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="P2"
            />

            <RetroInput
              label="ROOM CODE"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
            />

            {error && (
              <p className="text-red-500 font-retro text-xs mb-4 text-center blink">
                {error}
              </p>
            )}

            <Button
              onClick={handleJoin}
              variant="success"
              className="w-full text-lg"
            >
              ENTER ROOM
            </Button>

            <button
              onClick={() => setView('menu')}
              className="w-full mt-4 text-slate-500 font-retro text-xs hover:text-white"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MultiplayerSetup;