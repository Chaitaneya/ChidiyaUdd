
import { GameEntity, MultiplayerRoom, Player } from '../types';
import { fetchNewGameEntities, shuffleArray } from './geminiService';
import { FALLBACK_ENTITIES } from '../constants';
import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Mock mode flag for development when Supabase is unavailable
const USE_MOCK_MODE = import.meta.env.DEV;

// Events
type NetworkEvent =
  | { type: 'ROOM_UPDATE'; room: MultiplayerRoom }
  | { type: 'JOIN_REQUEST'; player: Player }
  | { type: 'PLAYER_STATE'; playerId: string; score: number; lives: number; status: 'alive' | 'eliminated' }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'PLAYER_HEARTBEAT'; playerId: string };

class MultiplayerService {
  private room: MultiplayerRoom | null = null;
  private currentPlayerId: string | null = null;
  private channel: RealtimeChannel | null = null;
  private listeners: ((room: MultiplayerRoom) => void)[] = [];
  private heartbeatInterval: number | null = null;
  private lastHeartbeats: Map<string, number> = new Map(); // Track last heartbeat from each player
  private heartbeatTimeout: number | null = null;
  private mockRooms: Map<string, MultiplayerRoom> = new Map(); // Mock storage for development
  private isMockMode: boolean = false;

  // Clean up function to run on unmount/leave
  private cleanup: (() => void) | null = null;

  constructor() { 
    // Check if Supabase is reachable, fallback to mock mode if not
    this.initializeMockMode();
  }

  private initializeMockMode() {
    // Auto-enable mock mode if Supabase is unavailable
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      this.isMockMode = true;
      console.log('📱 MULTIPLAYER: Running in MOCK MODE (local development)');
    }
  }

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

    if (this.isMockMode) {
      // Mock mode: store room locally
      this.mockRooms.set(code, { ...this.room });
      console.log('🎮 Mock: Created room', code, 'as host');
    } else {
      // 1. Connect to Channel
      this.connectToChannel(code);
    }

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

    if (this.isMockMode) {
      // Mock mode: simulate joining an existing room
      const mockRoom = this.mockRooms.get(code);
      if (!mockRoom) {
        console.log('🎮 Mock: Room not found:', code);
        return false;
      }

      const me: Player = {
        id: this.currentPlayerId,
        name: playerName,
        isHost: false,
        score: 0,
        lives: 3,
        isReady: true,
        status: 'alive'
      };

      // Add player to mock room
      mockRoom.players.push(me);
      this.room = { ...mockRoom, players: [...mockRoom.players] };
      this.notifyListeners();
      console.log('🎮 Mock: Joined room', code, 'as', playerName);
      return true;
    }

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
    if (!this.room || !this.currentPlayerId) return;

    // Update local player state
    const pIndex = this.room.players.findIndex(p => p.id === this.currentPlayerId);
    if (pIndex !== -1) {
      this.room.players[pIndex].score = score;
      this.room.players[pIndex].lives = lives;
      this.room.players[pIndex].status = lives <= 0 ? 'eliminated' : 'alive';
    }

    if (this.isMockMode) {
      // Mock mode: just update local and notify
      this.notifyListeners();
      return;
    }

    if (!this.channel) return;

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
      this.startHeartbeat(); // Start heartbeat when game begins
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    // Send heartbeat every 2 seconds
    this.heartbeatInterval = window.setInterval(() => {
      if (this.channel && this.currentPlayerId) {
        this.channel.send({
          type: 'broadcast',
          event: 'PLAYER_HEARTBEAT',
          payload: { playerId: this.currentPlayerId }
        });
      }
    }, 2000);

    // Check for dead players every 7 seconds (must miss 3+ heartbeats = 6+ seconds)
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = window.setInterval(() => {
      this.checkDeadPlayers();
    }, 7000);
  }

  private checkDeadPlayers() {
    if (!this.room || !this.channel) return;

    const now = Date.now();
    const heartbeatThreshold = 6000; // 6 seconds without heartbeat = dead

    this.room.players.forEach(player => {
      if (player.status === 'alive') {
        const lastHB = this.lastHeartbeats.get(player.id) || now;
        if (now - lastHB > heartbeatThreshold) {
          // Player hasn't heartbeat in 6+ seconds, mark as eliminated
          player.status = 'eliminated';
          this.notifyListeners();
        }
      }
    });
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearInterval(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  leaveRoom() {
    // Stop heartbeat
    this.stopHeartbeat();

    if (!this.isMockMode) {
      // Send PLAYER_LEFT event before disconnecting (only in real mode)
      if (this.channel && this.currentPlayerId) {
        this.channel.send({
          type: 'broadcast',
          event: 'PLAYER_LEFT',
          payload: { playerId: this.currentPlayerId }
        });
      }
      
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    } else {
      // Mock mode: clean up local storage
      if (this.room) {
        this.mockRooms.delete(this.room.code);
      }
    }

    this.room = null;
    this.currentPlayerId = null;
    this.lastHeartbeats.clear();
    this.notifyListeners();
  }

  // --- Private Helpers ---

  private connectToChannel(roomCode: string) {
    if (this.isMockMode) {
      // Mock mode: simulate channel subscription
      console.log('🎮 Mock: Connected to room', roomCode);
      return;
    }

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
      .on('broadcast', { event: 'PLAYER_LEFT' }, ({ payload }) => {
        if (this.room) {
          const { playerId } = payload;
          // Mark player as eliminated when they leave
          const pIndex = this.room.players.findIndex(p => p.id === playerId);
          if (pIndex !== -1) {
            this.room.players[pIndex].status = 'eliminated';
            this.notifyListeners();
          }
        }
      })
      .on('broadcast', { event: 'PLAYER_HEARTBEAT' }, ({ payload }) => {
        const { playerId } = payload;
        // Update last heartbeat timestamp for this player
        this.lastHeartbeats.set(playerId, Date.now());
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // console.log("Connected to room", roomCode);
        }
      });
  }

  private notifyListeners() {
    if (this.room) {
      // Create a shallow copy to force React state updates
      const roomCopy = {
        ...this.room,
        players: [...this.room.players]
      };
      this.listeners.forEach(cb => cb(roomCopy));
    }
  }

  private broadcastRoom() {
    if (!this.room || (!this.channel && !this.isMockMode)) return;
    
    if (this.isMockMode) {
      // Mock mode: store room locally and simulate broadcast
      this.mockRooms.set(this.room.code, { ...this.room, players: [...this.room.players] });
      this.notifyListeners(); // Update local
      
      // Simulate other players joining/updating
      setTimeout(() => {
        if (this.room && this.mockRooms.has(this.room.code)) {
          this.notifyListeners();
        }
      }, 500);
      return;
    }

    this.notifyListeners(); // Update local
    this.channel!.send({
      type: 'broadcast',
      event: 'ROOM_UPDATE',
      payload: { room: this.room }
    });
  }
}

export const multiplayer = new MultiplayerService();
