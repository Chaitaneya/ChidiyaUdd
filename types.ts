export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  MP_SETUP = 'MP_SETUP',
  MP_LOBBY = 'MP_LOBBY',
  MP_PLAYING = 'MP_PLAYING',
  LEADER = 'LEADER',
}

/**
 * Which cards are in play.
 * - family: kid-safe, literal rules (does the thing itself fly?)
 * - masala: everything, and Hindi sayings count ("hosh udd gaye" → flies)
 */
export type DeckMode = 'family' | 'masala';

/** One card as written in constants.ts. */
export interface Card {
  /** Shown big on the card: English or Hinglish, Latin script. */
  name: string;
  /** Hindi (Devanagari) shown under the name and spoken aloud. */
  hindi: string;
  canFly: boolean;
  emoji: string;
  /** One line explaining the answer, shown after a wrong guess. */
  why: string;
  /** Grown-up humour: only in the Masala deck. */
  masala?: boolean;
}

/** A card dealt into a game (ids are unique per deal). */
export interface GameEntity extends Card {
  id: string;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  lives: number;
  /** `left` = disconnected or quit mid-match (kept so the scoreboard stays complete). */
  status: 'alive' | 'eliminated' | 'left';
  /** Round in which the player went out (for "last one standing" ranking). */
  outRound?: number;
}

export interface MultiplayerRoom {
  code: string;
  players: Player[];
  /** `closed` = the host left, so nobody can start another match. */
  status: 'waiting' | 'playing' | 'finished' | 'closed';
  deckMode: DeckMode;
  entities: GameEntity[]; // Shared deck for the match
  /** Increments every time the host starts a match. */
  matchId: number;
}

/** Per-player outcome of one synced multiplayer round. */
export interface RoundOutcome {
  tapped: boolean;
  correct: boolean;
  gained: number;
  fastest: boolean;
}
