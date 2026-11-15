import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Retro dialog used by every popup: dark panel, hard shadow, red ✕ in the
 * corner. Closes on ✕, Escape, or a click on the dimmed backdrop.
 */
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-xs z-[100] flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-slate-800 border-4 border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm max-h-full overflow-y-auto p-6 relative animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-red-600 hover:bg-red-500 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-white text-lg active:translate-y-1"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-retro text-yellow-400 mt-1 mb-6 px-10 text-center tracking-wider sm:tracking-widest uppercase leading-relaxed">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};

export default Modal;
