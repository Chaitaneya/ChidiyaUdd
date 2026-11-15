import React from 'react';

export interface SegmentOption<T extends string> {
  id: T;
  icon: string;
  label: string;
  /** One line about the option; only the selected one is shown. */
  description: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
}

/** Shared caption style for every setting in a form (DECK, START PACE, VOICE…). */
export const SETTING_LABEL = 'block text-green-400 font-retro text-[10px] sm:text-xs mb-3 tracking-widest uppercase';

/** Shared style for the single explanation line under a setting. */
export const SETTING_NOTE_TEXT = 'font-vt323 text-lg leading-snug text-slate-300';
export const SETTING_NOTE = `mt-3 ${SETTING_NOTE_TEXT}`;

/**
 * Pick one of a few options: equal retro buttons in a row, with one short
 * line describing the selected option underneath (instead of a wall of text).
 */
function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const current = options.find((o) => o.id === value);
  return (
    <fieldset className="w-full">
      <legend className={SETTING_LABEL}>{label}</legend>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.id)}
              className={`h-12 px-2 flex items-center justify-center gap-2 border-4 shadow-[4px_4px_0_0_#000] font-retro text-[10px] sm:text-xs uppercase transition-colors ${
                selected ? 'bg-yellow-300 border-black text-black' : 'bg-black border-slate-600 text-slate-300 hover:border-slate-400'
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{o.icon}</span>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
      {/* All descriptions share one grid cell, so the space is always the tallest
          one's and switching options never makes the page jump. */}
      <div className="grid mt-3" aria-live="polite">
        {options.map((o) => (
          <p
            key={o.id}
            className={`[grid-area:1/1] ${SETTING_NOTE_TEXT} ${o.id === current?.id ? '' : 'invisible'}`}
            aria-hidden={o.id !== current?.id}
          >
            {o.description}
          </p>
        ))}
      </div>
    </fieldset>
  );
}

export default SegmentedControl;
