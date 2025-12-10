
export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  MP_SETUP = 'MP_SETUP',
  MP_LOBBY = 'MP_LOBBY',
  MP_GAME_OVER = 'MP_GAME_OVER'
}

export interface GameEntity {
  id: string;
  name: string; // The text to display (e.g., "Parrot")
  canFly: boolean; // True if it flies, false otherwise
  emoji: string; // Visual representation
  translation?: string; // Optional Hindi translation or fun descriptor
}

export interface GameConfig {
  speed: number; // Time in ms per turn
  lives: number;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  lives: number;
  isReady: boolean;
  status: 'alive' | 'eliminated' | 'spectating';
}

export interface MultiplayerRoom {
  code: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  entities: GameEntity[]; // Shared deck for the game
  roundCount: number; // 7, 10, or Infinity (-1)
}
