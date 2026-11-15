import React, { useEffect, useRef, useState } from 'react'
import { multiplayer, MIN_PLAYERS_TO_START, MAX_PLAYERS } from '../services/multiplayerService'
import { MultiplayerRoom } from '../types'
import Button from './Button'
import { audio } from '../services/audioService'
import { DECK_INFO } from './DeckPicker'

interface LobbyProps {
  onLeave: () => void
}

const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

const Lobby: React.FC<LobbyProps> = ({ onLeave }) => {
  const [room, setRoom] = useState<MultiplayerRoom | null>(multiplayer.getRoom())
  const [copied, setCopied] = useState(false)
  const prevCountRef = useRef(room?.players.length ?? 0)

  const currentPlayer = multiplayer.getCurrentPlayer()
  const isHost = currentPlayer?.isHost ?? false

  useEffect(() => multiplayer.subscribe(setRoom), [])

  // Pop sound when someone joins.
  useEffect(() => {
    const count = room?.players.length ?? 0
    if (count > prevCountRef.current && prevCountRef.current > 0) audio.playPop()
    prevCountRef.current = count
  }, [room?.players.length])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  if (!room) {
    return (
      <div className="font-retro text-white text-center h-full flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-lg mb-2">CONNECTING...</p>
          <p className="text-xs opacity-70">Joining room...</p>
        </div>
      </div>
    )
  }

  const players = room.players.filter((p) => p.status !== 'left')
  const enoughPlayers = players.length >= MIN_PLAYERS_TO_START
  const showLastScores = room.matchId > 0

  const handleStart = () => {
    audio.unlock()
    audio.playClick()
    multiplayer.startGame()
  }

  const handleLeave = () => {
    audio.playClick()
    onLeave()
  }

  const handleShareCode = async () => {
    audio.playClick()
    const text = `Join my Chidiya Udd room! Code: ${room.code}`
    try {
      if (canShare) {
        await navigator.share({ title: 'Chidiya Udd', text, url: window.location.origin })
      } else {
        await navigator.clipboard.writeText(room.code)
        setCopied(true)
      }
    } catch {
      /* share sheet dismissed or clipboard blocked */
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-4 max-w-md mx-auto relative">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={handleLeave}
          className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
          aria-label="Leave room"
        >
          <span className="text-3xl leading-none -translate-y-[1px] inline-block">←</span>
        </button>

        <h2 className="text-xl text-yellow-400 font-retro drop-shadow-[2px_2px_0_#000]">
          {isHost ? 'HOST GAME' : 'JOIN GAME'}
        </h2>

        <div className="w-10" />
      </div>

      {/* ROOM CODE */}
      <div className="w-full mb-6 text-center">
        <h3 className="text-slate-400 font-retro text-xs mb-2 uppercase tracking-widest">ROOM CODE</h3>

        <div className="flex items-stretch justify-center gap-3">
          <div className="bg-black border-4 border-slate-600 px-4 py-2 shadow-[4px_4px_0_0_#000]">
            <span className="text-4xl font-vt323 text-yellow-400 tracking-[0.3em] pl-[0.3em]">{room.code}</span>
          </div>
          <button
            onClick={handleShareCode}
            className="bg-slate-700 hover:bg-slate-600 border-4 border-black shadow-[4px_4px_0_0_#000] px-3 font-retro text-[10px] text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            aria-label={canShare ? 'Share room code' : 'Copy room code'}
          >
            {copied ? 'COPIED!' : canShare ? 'SHARE' : 'COPY'}
          </button>
        </div>

        {/* DECK (host can switch between matches) */}
        <div className="mt-4 flex items-center justify-center gap-2 font-retro text-[10px]">
          <span className="text-slate-400">DECK:</span>
          <span className={room.deckMode === 'masala' ? 'text-orange-400' : 'text-green-400'}>
            {DECK_INFO[room.deckMode].icon} {DECK_INFO[room.deckMode].label.toUpperCase()}
          </span>
          {isHost && (
            <button
              onClick={() => {
                audio.playClick()
                multiplayer.setDeckMode(room.deckMode === 'family' ? 'masala' : 'family')
              }}
              className="ml-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 border-2 border-black shadow-[2px_2px_0_0_#000] text-white active:translate-y-0.5"
            >
              CHANGE
            </button>
          )}
        </div>
      </div>

      {/* PLAYER LIST */}
      <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] w-full flex-1 min-h-0 flex flex-col p-4 mb-6">
        <h2 className="text-white font-retro text-sm text-center border-b-4 border-black mb-4 bg-slate-700 h-10 flex items-center justify-center shrink-0">
          PLAYERS ({players.length}/{MAX_PLAYERS})
        </h2>

        <div className="flex flex-col gap-2 overflow-y-auto min-h-0">
          {players.map((player) => {
            const isMe = player.id === currentPlayer?.id
            return (
              <div
                key={player.id}
                className="flex items-center justify-between bg-black p-3 border-l-4 border-blue-500 animate-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0" aria-hidden="true">{player.isHost ? '👑' : '🕹️'}</span>
                  <span className={`font-vt323 text-2xl uppercase truncate ${isMe ? 'text-green-400' : 'text-white'}`}>
                    {player.name} {isMe && '(YOU)'}
                  </span>
                </div>

                {showLastScores ? (
                  <span className="font-retro text-xs text-blue-300 shrink-0" title="Last match score">
                    {player.score}
                  </span>
                ) : (
                  <div className="w-2 h-2 rounded-full shrink-0 bg-green-500 animate-pulse" />
                )}
              </div>
            )
          })}
        </div>

        {/* HOST CONTROLS */}
        <div className="mt-4 pt-4 border-t-4 border-black text-center shrink-0">
          {isHost ? (
            <Button onClick={handleStart} disabled={!enoughPlayers} variant="primary" className="w-full text-lg">
              {enoughPlayers ? (
                <>
                  <span>{showLastScores ? 'PLAY AGAIN' : 'START GAME'}</span>
                  <span className="-translate-y-[3px] inline-block">▶</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">WAITING FOR PLAYERS...</span>
              )}
            </Button>
          ) : (
            <div className="p-3 border-2 bg-slate-700 border-green-600">
              <p className="text-green-400 font-retro text-xs animate-pulse">⏳ WAITING FOR HOST...</p>
            </div>
          )}
          {isHost && !enoughPlayers && (
            <p className="mt-3 text-slate-400 font-retro text-[10px] leading-relaxed">
              SHARE THE CODE. NEED {MIN_PLAYERS_TO_START}+ PLAYERS
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lobby
