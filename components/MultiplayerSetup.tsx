import React, { useState } from 'react'
import { multiplayer } from '../services/multiplayerService'
import { audio } from '../services/audioService'
import Button from './Button'

interface MultiplayerSetupProps {
  onGameStart: () => void
  onBack: () => void
}

// Shared input component
interface RetroInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  maxLength?: number
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
)

// Back button component
const BackButton: React.FC<{
  action?: () => void
  defaultBack: () => void
}> = ({ action, defaultBack }) => (
  <button
  onClick={action || defaultBack}
  className="absolute top-4 left-4 text-white/80 hover:text-white active:scale-90 focus:outline-none z-50 transition-all"
  aria-label="Go back"
>
  <span className="text-3xl leading-none -translate-y-[1px] inline-block">
    ←
  </span>
</button>
)

// Main component
const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ onGameStart, onBack }) => {
  const [view, setView] = useState<'menu' | 'create' | 'join'>('menu')
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Clear error when input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (error) setError('')
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value.toUpperCase())
    if (error) setError('')
  }

  // Host creates a new room
  const handleCreate = async () => {
    if (!name.trim()) {
      setError('PLEASE ENTER YOUR NAME')
      return
    }

    setIsLoading(true)
    try {
      audio.resume()
      audio.warmup()
      await multiplayer.createRoom(name.trim())
      onGameStart()
    } catch (err) {
      console.error('Failed to create room:', err)
      setError('FAILED TO CREATE ROOM')
      setIsLoading(false)
    }
  }

  // Player joins an existing room
  const handleJoin = async () => {
    if (!name.trim()) {
      setError('PLEASE ENTER YOUR NAME')
      return
    }

    if (roomCode.length !== 4) {
      setError('CODE MUST BE 4 CHARACTERS')
      return
    }

    setIsLoading(true)
    try {
      audio.resume()
      audio.warmup()
      await multiplayer.joinRoom(roomCode, name.trim())
      // Transition to lobby immediately
      onGameStart()
    } catch (err) {
      console.error('Failed to join room:', err)
      setError('FAILED TO JOIN ROOM')
      setIsLoading(false)
    }
  }

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
            <Button
              onClick={() => {
                setView('create')
                setError('')
              }}
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span>HOST GAME</span>
            </Button>

            <Button
              onClick={() => {
                setView('join')
                setError('')
              }}
              variant="secondary"
              className="w-full text-lg py-5 flex items-center justify-center gap-4 font-retro uppercase"
            >
              <span>JOIN GAME</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ===== CREATE ROOM VIEW =====
  if (view === 'create') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        

        <div className="w-full max-w-sm animate-slide-up">
          <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full">
            <h2 className="text-xl text-white font-retro mb-6 text-center border-b-4 border-black pb-4">
              HOST GAME
            </h2>

            <RetroInput
              label="PLAYER NAME"
              value={name}
              onChange={handleNameChange}
              placeholder="P1"
              maxLength={16}
            />

            {error && (
              <p className="text-red-400 font-retro text-sm mb-4 text-center animate-pulse bg-red-900 bg-opacity-40 p-2 border border-red-600">
                ⚠️ {error}
              </p>
            )}

            <Button onClick={handleCreate} disabled={isLoading || !name.trim()} className="w-full text-lg">
              {isLoading ? 'CREATING...' : 'CREATE ROOM'}
            </Button>

            <button
              onClick={() => {
                setView('menu')
                setName('')
                setError('')
              }}
              className="w-full mt-4 text-slate-500 font-retro text-xs hover:text-white transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== JOIN ROOM VIEW =====
  if (view === 'join') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        

        <div className="w-full max-w-sm animate-slide-up">
          <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full">
            <h2 className="text-xl text-white font-retro mb-6 text-center border-b-4 border-black pb-4">
              JOIN GAME
            </h2>

            <RetroInput
              label="PLAYER NAME"
              value={name}
              onChange={handleNameChange}
              placeholder="P2"
              maxLength={16}
            />

            <RetroInput
              label="ROOM CODE"
              value={roomCode}
              onChange={handleCodeChange}
              placeholder="ABCD"
              maxLength={4}
            />

            {error && (
              <p className="text-red-400 font-retro text-sm mb-4 text-center animate-pulse bg-red-900 bg-opacity-40 p-2 border border-red-600">
                ⚠️ {error}
              </p>
            )}

            <Button
              onClick={handleJoin}
              disabled={isLoading || !name.trim() || roomCode.length !== 4}
              variant="primary"
              className="w-full text-lg"
            >
              {isLoading ? 'JOINING...' : 'ENTER ROOM'}
            </Button>

            <button
              onClick={() => {
                setView('menu')
                setName('')
                setRoomCode('')
                setError('')
              }}
              className="w-full mt-4 text-slate-500 font-retro text-xs hover:text-white transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default MultiplayerSetup