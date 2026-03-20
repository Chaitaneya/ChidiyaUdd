import React, { useCallback, useEffect } from 'react'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onLoginSuccess?: () => void
  onGoogleClick: () => Promise<void>
  isLoading?: boolean
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onLoginSuccess,
  onGoogleClick,
  isLoading = false,
}) => {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  const handleGoogleClick = async () => {
    try {
      await onGoogleClick()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  if (!open) return null

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm p-8 relative">
        {/* Back Button - Top Left */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white/80 hover:text-white active:scale-90 focus:outline-none z-50 transition-all"
          aria-label="Go back"
        >
          <span className="text-2xl leading-none -translate-y-[1px] inline-block">
            ←
          </span>
        </button>

        {/* Content - Centered with padding for back button */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="text-center">
            <h2 className="text-2xl font-retro text-yellow-400 mb-3 tracking-widest uppercase">
              Multiplayer
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🔒</span>
              <p className="text-slate-200 font-retro text-sm">
                Locked
              </p>
            </div>
          </div>

          <p className="text-slate-300 font-retro text-center text-sm leading-relaxed">
            Login to play with friends
          </p>

          <button
            onClick={handleGoogleClick}
            disabled={isLoading}
            className="w-full bg-white text-slate-900 px-6 py-3 border-2 border-black font-retro font-bold text-sm uppercase shadow-[4px_4px_0_0_#000] hover:bg-slate-100 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed tracking-widest flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-flex items-center justify-center animate-spin">⏳</span>
                {' '}SIGNING IN...
              </>
            ) : (
              <>
                <img
                  src="/assets/emojis/google2.png"
                  alt="Google"
                  style={{ imageRendering: 'pixelated' }}
                  className="w-19 h-10 object-contain"
                />
                {'  '}CONTINUE WITH GOOGLE
              </>
            )}
          </button>

          <p className="text-slate-400 font-retro text-xs text-center">
            `Made with love from Chaitanya and contributers`
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
