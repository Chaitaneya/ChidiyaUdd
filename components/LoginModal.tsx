import React, { useState } from 'react'
import Modal from './Modal'
import { rememberLoginIntent } from '../services/authService'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  /** Resolves true when the browser is redirecting to Google. */
  onGoogleClick: () => Promise<boolean>
  isSigningIn?: boolean
  /** Jump straight to the multiplayer screen once Google sends the player back. */
  openMultiplayerAfterLogin?: boolean
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onGoogleClick,
  isSigningIn = false,
  openMultiplayerAfterLogin = false,
}) => {
  const [error, setError] = useState('')

  const handleGoogleClick = async () => {
    setError('')
    if (openMultiplayerAfterLogin) rememberLoginIntent('multiplayer')
    const redirecting = await onGoogleClick()
    if (!redirecting) setError('LOGIN FAILED. PLEASE TRY AGAIN')
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Multiplayer">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-2 -mt-2">
          <span className="text-3xl" aria-hidden="true">🔒</span>
          <p className="text-slate-200 font-retro text-sm">LOCKED</p>
        </div>

        <p className="text-slate-300 font-retro text-center text-xs sm:text-sm leading-relaxed">
          Login to play with friends
        </p>

        <button
          onClick={handleGoogleClick}
          disabled={isSigningIn}
          className="w-full bg-white text-slate-900 px-4 py-3 border-4 border-black font-retro text-xs sm:text-sm uppercase shadow-[4px_4px_0_0_#000] hover:bg-slate-100 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed tracking-wide flex items-center justify-center gap-3"
        >
          {isSigningIn ? (
            <>
              <span className="inline-flex items-center justify-center animate-spin" aria-hidden="true">⏳</span>
              SIGNING IN...
            </>
          ) : (
            <>
              <img
                src="/assets/emojis/google2.png"
                alt=""
                style={{ imageRendering: 'pixelated' }}
                className="w-14 h-10 object-contain -my-2 -ml-2"
              />
              CONTINUE WITH GOOGLE
            </>
          )}
        </button>

        {error && (
          <p className="w-full text-red-400 font-retro text-xs text-center bg-red-900/40 p-2 border border-red-600" role="alert">
            ⚠️ {error}
          </p>
        )}

        <p className="text-slate-400 font-retro text-[10px] sm:text-xs text-center leading-relaxed">
          Made with love by Chaitanya and contributors
        </p>
      </div>
    </Modal>
  )
}

export default LoginModal
