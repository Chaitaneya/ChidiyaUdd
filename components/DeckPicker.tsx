import React from 'react';
import { DeckMode } from '../types';
import { cardsFor } from '../services/entityService';
import IconButton from './IconButton';
import SegmentedControl from './SegmentedControl';

export const DECK_INFO: Record<DeckMode, { icon: string; label: string; blurb: string }> = {
  family: { icon: '🧸', label: 'Family', blurb: 'Kid-safe. Does the thing really fly?' },
  masala: { icon: '🌶️', label: 'Masala', blurb: 'Adds desi slang. "Hosh udd gaye" flies too!' },
};

/** Compact top-bar toggle (main menu). */
export const DeckToggle: React.FC<{ mode: DeckMode; onChange: (mode: DeckMode) => void; align?: 'start' | 'end' }> = ({
  mode,
  onChange,
  align = 'start',
}) => (
  <IconButton
    label={DECK_INFO[mode].label}
    labelClassName={mode === 'masala' ? 'text-orange-400' : 'text-green-400'}
    align={align}
    onClick={() => onChange(mode === 'family' ? 'masala' : 'family')}
    ariaLabel={`Deck: ${DECK_INFO[mode].label}. Tap to switch`}
    title={`${DECK_INFO[mode].label} deck: ${DECK_INFO[mode].blurb}`}
  >
    {DECK_INFO[mode].icon}
  </IconButton>
);

/** Family / Masala switch with one line about the chosen deck (creating a room, leader mode). */
export const DeckChooser: React.FC<{ mode: DeckMode; onChange: (mode: DeckMode) => void; label?: string }> = ({
  mode,
  onChange,
  label = 'Deck',
}) => (
  <SegmentedControl
    label={label}
    value={mode}
    onChange={onChange}
    options={(['family', 'masala'] as DeckMode[]).map((m) => ({
      id: m,
      icon: DECK_INFO[m].icon,
      label: DECK_INFO[m].label,
      description: `${DECK_INFO[m].blurb} ${cardsFor(m).length} cards.`,
    }))}
  />
);
