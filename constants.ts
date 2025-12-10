
import { GameEntity } from './types';

// Fallback data in case API fails or for initial load
export const FALLBACK_ENTITIES: GameEntity[] = [
  { id: '1', name: 'Sparrow', translation: 'चिड़िया', canFly: true, emoji: '🐦' },
  { id: '2', name: 'Parrot', translation: 'तोता', canFly: true, emoji: '🦜' },
  { id: '3', name: 'Cow', translation: 'गाय', canFly: false, emoji: '🐄' },
  { id: '4', name: 'Airplane', translation: 'प्लेन', canFly: true, emoji: '✈️' }, // Colloquial for Airplane
  { id: '5', name: 'Elephant', translation: 'हाथी', canFly: false, emoji: '🐘' },
  { id: '6', name: 'Crow', translation: 'कौवा', canFly: true, emoji: '🐦‍⬛' },
  { id: '7', name: 'Cat', translation: 'बिल्ली', canFly: false, emoji: '🐱' },
  { id: '8', name: 'Buffalo', translation: 'भैंस', canFly: false, emoji: '🐃' },
  { id: '9', name: 'Eagle', translation: 'चील', canFly: true, emoji: '🦅' },
  { id: '10', name: 'Bus', translation: 'बस', canFly: false, emoji: '🚌' },
  { id: '11', name: 'Butterfly', translation: 'तितली', canFly: true, emoji: '🦋' },
  { id: '12', name: 'Table', translation: 'टेबल', canFly: false, emoji: '🪵' }, // Colloquial for Table
  { id: '13', name: 'Helicopter', translation: 'हेलीकॉप्टर', canFly: true, emoji: '🚁' },
  { id: '14', name: 'Dog', translation: 'कुत्ता', canFly: false, emoji: '🐕' },
  { id: '15', name: 'Rocket', translation: 'रॉकेट', canFly: true, emoji: '🚀' },
  { id: '16', name: 'Mosquito', translation: 'मच्छर', canFly: true, emoji: '🦟' },
  { id: '17', name: 'Chair', translation: 'कुर्सी', canFly: false, emoji: '🪑' },
  { id: '18', name: 'Bat', translation: 'चमगादड़', canFly: true, emoji: '🦇' },
  { id: '19', name: 'Monkey', translation: 'बंदर', canFly: false, emoji: '🐒' },
  { id: '20', name: 'Peacock', translation: 'मोर', canFly: true, emoji: '🦚' },
];

export const INITIAL_SPEED = 2250; // Increased by 0.25s (was 2000)
export const MIN_SPEED = 800; // 0.8 seconds (fastest)
export const SPEED_DECREMENT = 50; // Speed up by 50ms every correct answer
export const MAX_LIVES = 3;