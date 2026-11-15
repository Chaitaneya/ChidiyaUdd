import React, { useState } from 'react'
import {
  multiplayer,
  normalizeRoomCode,
  sanitizePlayerName,
  validatePlayerName,
  PLAYER_NAME_MAX,
  ROOM_CODE_LENGTH,
} from '../services/multiplayerService'
import { audio } from '../services/audioService'
import { getSessionDisplayName } from '../services/authService'
import { useUser } from '../contexts/UserContext'
import { DeckMode } from '../types'
import Button from './Button'
import { DeckChooser } from './DeckPicker'
import { SETTING_LABEL } from './SegmentedControl'

interface MultiplayerSetupProps {
  onRoomReady: () => void
  onBack: () => void
  /** Shown above the menu, e.g. when the host closed the previous room. */
  notice?: string | null
  /** Deck pre-selected when hosting (the one chosen on the main menu). */
  defaultDeckMode: DeckMode
  onDeckModeChange: (mode: DeckMode) => void
}

type View = 'menu' | 'create' | 'join'

interface RetroInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  autoCapitalize?: string
}

const RetroInput: React.FC<RetroInputProps> = ({ label, value, onChange, placeholder, maxLength, autoCapitalize }) => (
  <label className="block w-full mb-6">
    <span className={`${SETTING_LABEL} text-left`}>{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete="off"
      autoCapitalize={autoCapitalize}
      spellCheck={false}
      className="w-full bg-black border-4 border-slate-600 p-3 text-xl sm:text-2xl font-vt323 text-yellow-400 focus:border-blue-500 focus:outline-none placeholder:text-slate-700 uppercase"
    />
  </label>
)

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white active:scale-90 z-50 transition-all"
    aria-label="Go back"
  >
    <span className="text-3xl leading-none -translate-y-[1px] inline-block">←</span>
  </button>
)

const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-red-400 font-retro text-xs sm:text-sm mb-4 text-center bg-red-900/40 p-2 border border-red-600 leading-relaxed" role="alert">
    ⚠️ {message}
  </p>
)

const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ onRoomReady, onBack, notice, defaultDeckMode, onDeckModeChange }) => {
  const { session } = useUser()
  const [view, setView] = useState<View>('menu')
  const [deckMode, setDeckMode] = useState<DeckMode>(defaultDeckMode)
  const [name, setName] = useState(() => sanitizePlayerName(getSessionDisplayName(session)))
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const goTo = (next: View) => {
    audio.playClick()
    setView(next)
    setError('')
  }

  const handleNameChange = (value: string) => {
    setName(sanitizePlayerName(value))
    if (error) setError('')
  }

  const handleCodeChange = (value: string) => {
    setRoomCode(normalizeRoomCode(value))
    if (error) setError('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const nameError = validatePlayerName(name)
    if (nameError) return setError(nameError)
    if (view === 'join' && roomCode.length !== ROOM_CODE_LENGTH) {
      return setError(`CODE MUST BE ${ROOM_CODE_LENGTH} CHARACTERS`)
    }

    audio.unlock() // inside the tap, so names can be spoken during the match
    audio.playClick()
    setIsLoading(true)
    setError('')
    try {
      if (view === 'create') {
        await multiplayer.createRoom(name.trim(), deckMode)
        onDeckModeChange(deckMode)
      } else {
        await multiplayer.joinRoom(roomCode, name.trim())
      }
      onRoomReady()
    } catch (err) {
      console.error('Multiplayer setup failed:', err)
      setError(err instanceof Error ? err.message : 'SOMETHING WENT WRONG')
      setIsLoading(false)
    }
  }

  // ===== MENU VIEW =====
  if (view === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 w-full relative">
        <BackButton onClick={() => { audio.playClick(); onBack() }} />

        <div className="max-w-sm w-full animate-fade-in flex flex-col items-center gap-8">
          <h1 className="text-3xl sm:text-4xl text-yellow-400 font-retro text-center drop-shadow-[4px_4px_0_#000]">
            MULTIPLAYER
          </h1>

          {notice && (
            <p className="w-full text-yellow-300 font-retro text-xs text-center bg-yellow-900/40 p-3 border border-yellow-600 leading-relaxed" role="status">
              {notice}
            </p>
          )}

          {!multiplayer.isAvailable && <ErrorBanner message="MULTIPLAYER IS NOT AVAILABLE RIGHT NOW" />}

          <div className="w-full flex flex-col gap-4">
            <Button
              onClick={() => goTo('create')}
              disabled={!multiplayer.isAvailable}
              className="w-full text-lg py-5 font-retro uppercase"
            >
              <span>HOST GAME</span>
            </Button>

            <Button
              onClick={() => goTo('join')}
              disabled={!multiplayer.isAvailable}
              variant="secondary"
              className="w-full text-lg py-5 font-retro uppercase"
            >
              <span>JOIN GAME</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ===== CREATE / JOIN VIEW =====
  const isJoin = view === 'join'
  const canSubmit = !isLoading && name.trim().length > 0 && (!isJoin || roomCode.length === ROOM_CODE_LENGTH)

  return (
    <div className="flex flex-col items-center justify-center-safe h-full px-4 pt-16 pb-6 w-full relative overflow-y-auto">
      <BackButton onClick={() => goTo('menu')} />

      <form className="w-full max-w-sm animate-slide-up" onSubmit={submit} noValidate>
        <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full">
          <h2 className="text-xl text-white font-retro mb-6 text-center border-b-4 border-black pb-4">
            {isJoin ? 'JOIN GAME' : 'HOST GAME'}
          </h2>

          <RetroInput
            label="PLAYER NAME"
            value={name}
            onChange={handleNameChange}
            placeholder={isJoin ? 'P2' : 'P1'}
            maxLength={PLAYER_NAME_MAX}
            autoCapitalize="words"
          />

          {!isJoin && (
            <div className="mb-4">
              <DeckChooser mode={deckMode} onChange={(m) => { audio.playClick(); setDeckMode(m) }} />
            </div>
          )}

          {isJoin && (
            <RetroInput
              label="ROOM CODE"
              value={roomCode}
              onChange={handleCodeChange}
              placeholder="ABCD"
              maxLength={ROOM_CODE_LENGTH}
              autoCapitalize="characters"
            />
          )}

          {error && <ErrorBanner message={error} />}

          <Button type="submit" disabled={!canSubmit} className="w-full text-lg">
            {isLoading ? (isJoin ? 'JOINING...' : 'CREATING...') : isJoin ? 'ENTER ROOM' : 'CREATE ROOM'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MultiplayerSetup
