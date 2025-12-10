
import { GameEntity, MultiplayerRoom, Player } from '../types';
import { fetchNewGameEntities, shuffleArray } from './geminiService';
import { FALLBACK_ENTITIES } from '../constants';
import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Events
type NetworkEvent = 
  | { type: 'ROOM_UPDATE'; room: MultiplayerRoom }
  | { type: 'JOIN_REQUEST'; player: Player }
  | { type: 'PLAYER_STATE'; playerId: string; score: number; lives: number; status: 'alive'|'eliminated' };

class MultiplayerService {
  private room: MultiplayerRoom | null = null;
  private currentPlayerId: string | null = null;
  private channel: RealtimeChannel | null = null;
  private listeners: ((room: MultiplayerRoom) => void)[] = [];
  
  // Clean up function to run on unmount/leave
  private cleanup: (() => void) | null = null;

  constructor() {}

  // --- Public API ---

  subscribe(callback: (room: MultiplayerRoom) => void) {
    this.listeners.push(callback);
    if (this.room) callback(this.room);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  getCurrentPlayer(): Player | undefined {
    return this.room?.players.find(p => p.id === this.currentPlayerId);
  }

  getRoom() {
    return this.room;
  }

  async createRoom(playerName: string): Promise<string> {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    this.currentPlayerId = `host-${Date.now()}`;
    
    // Initial Entities
    const initialEntities = shuffleArray(FALLBACK_ENTITIES).map((item, index) => ({
        ...item,
        id: `init-${Date.now()}-${index}`
    }));

    const host: Player = {
      id: this.currentPlayerId,
      name: playerName,
      isHost: true,
      score: 0,
      lives: 3,
      isReady: true,
      status: 'alive'
    };

    this.room = {
      code,
      players: [host],
      status: 'waiting',
      entities: initialEntities, 
      roundCount: -1
    };

    // 1. Connect to Channel
    this.connectToChannel(code);

    // 2. Fetch AI entities in background
    fetchNewGameEntities().then(entities => {
        if (this.room && this.room.code === code && this.room.status === 'waiting') {
            this.room.entities = entities;
            this.broadcastRoom(); // Send update to self and any early joiners
        }
    });

    return code;
  }

  joinRoom(code: string, playerName: string): boolean {
    this.currentPlayerId = `p-${Date.now()}`;
    
    // We don't have the room state yet. We connect and ask to join.
    // Ideally, we'd check if room exists via DB, but for Realtime-only:
    // We subscribe, send a 'JOIN_REQUEST', and wait for the Host to send us the 'ROOM_UPDATE'.
    
    this.connectToChannel(code);

    // Optimistically create a player object to send
    const me: Player = {
        id: this.currentPlayerId,
        name: playerName,
        isHost: false,
        score: 0,
        lives: 3,
        isReady: true,
        status: 'alive'
    };

    // Wait a brief moment for connection to establish, then ask to join
    setTimeout(() => {
        if (this.channel) {
            this.channel.send({
                type: 'broadcast',
                event: 'JOIN_REQUEST',
                payload: { player: me }
            });
        }
    }, 500);

    return true; // We assume valid for now, UI handles "Waiting for host..."
  }

  updatePlayerState(score: number, lives: number) {
    if (!this.room || !this.currentPlayerId || !this.channel) return;

    // Send my update to everyone
    this.channel.send({
        type: 'broadcast',
        event: 'PLAYER_STATE',
        payload: { 
            playerId: this.currentPlayerId, 
            score, 
            lives,
            status: lives <= 0 ? 'eliminated' : 'alive'
        }
    });
  }

  startGame() {
    if (this.room && this.currentPlayerId && this.room.players.find(p => p.id === this.currentPlayerId)?.isHost) {
      if (!this.room.entities || this.room.entities.length === 0) return;
      
      this.room.status = 'playing';
      this.broadcastRoom();
    }
  }

  leaveRoom() {
    if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
    }
    this.room = null;
    this.currentPlayerId = null;
    this.notifyListeners();
  }

  // --- Private Helpers ---

  private connectToChannel(roomCode: string) {
    if (this.channel) this.channel.unsubscribe();

    this.channel = supabase.channel(`room-${roomCode}`, {
        config: {
            broadcast: { self: true } // Receive own messages? No, usually not needed but good for debugging
        }
    });

    this.channel
        .on('broadcast', { event: 'ROOM_UPDATE' }, ({ payload }) => {
            this.room = payload.room;
            this.notifyListeners();
        })
        .on('broadcast', { event: 'JOIN_REQUEST' }, ({ payload }) => {
            // ONLY HOST processes join requests
            if (this.room && this.currentPlayerId && this.room.players[0].id === this.currentPlayerId) {
                const newPlayer = payload.player;
                // Avoid duplicates
                if (!this.room.players.find(p => p.id === newPlayer.id)) {
                    this.room.players.push(newPlayer);
                    this.broadcastRoom(); // Send full state back to everyone (including new joiner)
                }
            }
        })
        .on('broadcast', { event: 'PLAYER_STATE' }, ({ payload }) => {
            if (this.room) {
                const { playerId, score, lives, status } = payload;
                const pIndex = this.room.players.findIndex(p => p.id === playerId);
                if (pIndex !== -1) {
                    // Update the specific player
                    this.room.players[pIndex].score = score;
                    this.room.players[pIndex].lives = lives;
                    this.room.players[pIndex].status = status;
                    
                    // IF HOST: Re-broadcast to keep late joiners in sync? 
                    // For now, we rely on everyone receiving the individual updates.
                    // But to be safe, the Host occasionally syncs the "Truth".
                    this.notifyListeners();
                }
            }
        })
        .subscribe((status) => {
             if (status === 'SUBSCRIBED') {
                 // console.log("Connected to room", roomCode);
             }
        });
  }

  private notifyListeners() {
    if (this.room) {
      this.listeners.forEach(cb => cb(this.room!));
    }
  }

  private broadcastRoom() {
    if (!this.room || !this.channel) return;
    this.notifyListeners(); // Update local
    this.channel.send({
        type: 'broadcast',
        event: 'ROOM_UPDATE',
        payload: { room: this.room }
    });
  }
}

export const multiplayer = new MultiplayerService();
