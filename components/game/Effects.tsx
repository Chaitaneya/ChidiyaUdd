import React, { useEffect, useRef, useState } from 'react';

interface VisualEffect {
  id: number;
  type: 'feather' | 'smoke';
  x: number; // percentage
  y: number; // percentage
  emoji: string;
  delay: number;
}

const SUCCESS_EMOJIS = ['🐦', '💨', '🥶', '🔥'];
const FAIL_EMOJIS = ['🐔', '💀', '🐔', '😵‍💫'];
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

/** Feathers on a good FLY, smoke on a miss. Returns the layer and a trigger. */
export function useEffects() {
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (effects.length === 0) return;
    const timer = setTimeout(() => setEffects([]), 2000);
    return () => clearTimeout(timer);
  }, [effects]);

  const burst = (type: VisualEffect['type']) => {
    const count = type === 'feather' ? 12 : 5;
    const next: VisualEffect[] = Array.from({ length: count }, () => ({
      id: ++idRef.current,
      type,
      x: type === 'feather' ? Math.random() * 90 + 5 : 50 + (Math.random() * 20 - 10),
      y: type === 'feather' ? Math.random() * 10 + 5 : 40 + (Math.random() * 20 - 10),
      emoji: pick(type === 'feather' ? SUCCESS_EMOJIS : FAIL_EMOJIS),
      delay: Math.random() * 0.2,
    }));
    setEffects((prev) => [...prev, ...next]);
  };

  const layer = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50" aria-hidden="true">
      {effects.map((effect) => (
        <div
          key={effect.id}
          className={effect.type === 'feather' ? 'animate-feather' : 'animate-smoke'}
          style={{
            left: `${effect.x}%`,
            top: effect.type === 'smoke' ? `${effect.y}%` : undefined,
            animationDelay: `${effect.delay}s`,
            fontSize: effect.type === 'feather' ? '2.5rem' : '4rem',
          }}
        >
          {effect.emoji}
        </div>
      ))}
    </div>
  );

  return { layer, burst };
}
