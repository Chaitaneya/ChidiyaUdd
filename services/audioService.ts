/**
 * Audio for the game: synthesized UI tones (Web Audio API), short sound
 * clips for wrong answers, and spoken entity names (Web Speech API).
 *
 * Speech uses the browser's built-in voices, so no API key is involved.
 * The workarounds below cover the ways browsers silently drop speech:
 *  - iOS/Safari only allow speech after it is started from a tap, so
 *    `unlock()` must be called from a click handler before the game starts.
 *  - Chrome can drop an utterance queued in the same tick as `cancel()`, and
 *    can garbage-collect an utterance mid-sentence unless it is referenced.
 *  - Chrome's online "Google" voices can fail without a sound; on error we
 *    retry once with an on-device voice.
 */

const MUTE_KEY = 'chidiya_muted';

const FAIL_SOUNDS = [
  { m4a: '/assets/sounds/CHICKEN.m4a', mp3: '/assets/sounds/chicken.mp3' },
  { m4a: '/assets/sounds/MEOW01.m4a', mp3: '/assets/sounds/meow.mp3' },
  { m4a: '/assets/sounds/MEOW02.m4a', mp3: '/assets/sounds/Meoww.mp3' },
];

const INDIAN_VOICE_NAMES = ['Lekha', 'Rishi', 'Neerja', 'Hemant', 'Heera', 'Kalpana', 'Hindi', 'India'];

interface SpeakOptions {
  /** Speech rate, 0.1–10. Defaults to 1. */
  rate?: number;
}

/**
 * A call in two scripts. The game always uses a Hindi voice, which reads the
 * Devanagari. Only on a device with no Hindi voice at all does the fallback
 * (an English voice) get the Latin spelling, since it can't read Devanagari.
 */
export interface SpokenCall {
  hindi: string;
  latin: string;
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

const isHindiVoice = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith('hi');

class AudioService {
  private ctx: AudioContext | null = null;
  private muted = readMuted();
  private failSounds: HTMLAudioElement[] | null = null;

  private voices: SpeechSynthesisVoice[] = [];
  private badVoices = new Set<string>();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speakTimer: ReturnType<typeof setTimeout> | null = null;
  private speechUnlocked = false;

  constructor() {
    if (this.speechSupported()) {
      this.loadVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => this.loadVoices());
    }
  }

  // --------------------------------------------------
  // Mute
  // --------------------------------------------------

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0');
    } catch {
      /* storage unavailable (private mode) - keep in-memory value */
    }
    if (this.muted) this.stopSpeaking();
    return this.muted;
  }

  // --------------------------------------------------
  // Unlocking (call from a click/tap handler)
  // --------------------------------------------------

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  /** Resume the Web Audio context. Must run inside a user gesture on mobile. */
  resume() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') void ctx.resume();
    } catch {
      /* Web Audio unavailable */
    }
  }

  /**
   * Unlock both Web Audio and speech. Call synchronously from the click that
   * starts a game; iOS ignores speech that wasn't first started from a tap.
   */
  unlock() {
    this.resume();
    if (!this.speechSupported() || this.speechUnlocked) return;
    try {
      const silent = new SpeechSynthesisUtterance(' ');
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
      this.speechUnlocked = true;
    } catch {
      /* ignore */
    }
  }

  // --------------------------------------------------
  // Speech
  // --------------------------------------------------

  speechSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  private loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
  }

  /**
   * Always the best Hindi voice (on-device first: those never fail silently).
   * English voices are only a last resort: they can't say "उड़" properly.
   */
  private pickVoice(): SpeechSynthesisVoice | undefined {
    const usable = this.voices.filter((v) => !this.badVoices.has(v.voiceURI));
    const rank = (v: SpeechSynthesisVoice) => {
      let score = 0;
      if (v.lang === 'hi-IN') score += 40;
      else if (v.lang.toLowerCase().startsWith('hi')) score += 35;
      else if (v.lang === 'en-IN') score += 20;
      else if (INDIAN_VOICE_NAMES.some((n) => v.name.includes(n))) score += 15;
      else return -1;
      if (v.localService) score += 10;
      return score;
    };
    return usable
      .map((v) => ({ v, score: rank(v) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score)[0]?.v;
  }

  stopSpeaking() {
    if (this.speakTimer) {
      clearTimeout(this.speakTimer);
      this.speakTimer = null;
    }
    if (!this.speechSupported()) return;
    this.currentUtterance = null;
    window.speechSynthesis.cancel();
  }

  speak(input: string | SpokenCall, options: SpeakOptions = {}) {
    if (this.muted || !input || !this.speechSupported()) return;

    const synth = window.speechSynthesis;
    if (!this.voices.length) this.loadVoices();

    // Cancel whatever is still being said, then queue the new utterance on
    // the next tick so Chrome doesn't drop it along with the cancelled one.
    const busy = synth.speaking || synth.pending;
    this.stopSpeaking();
    if (synth.paused) synth.resume();

    const say = (retry: boolean) => {
      const voice = this.pickVoice();
      // Hindi voices read Devanagari; other voices get the Latin spelling.
      const text = typeof input === 'string' ? input : !voice || isHindiVoice(voice) ? input.hindi : input.latin;
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = typeof input === 'string' || text === input.hindi ? 'hi-IN' : 'en-IN';
      }
      utterance.rate = options.rate ?? 1;
      utterance.pitch = 1;

      utterance.onerror = (event) => {
        // 'interrupted'/'canceled' are expected when the next round starts.
        if (event.error === 'interrupted' || event.error === 'canceled') return;
        console.warn('Speech failed:', event.error, voice?.name);
        if (retry && voice && !voice.localService) {
          this.badVoices.add(voice.voiceURI);
          say(false);
        }
      };
      utterance.onend = () => {
        if (this.currentUtterance === utterance) this.currentUtterance = null;
      };

      this.currentUtterance = utterance; // keep a reference so it isn't GC'd mid-speech
      synth.speak(utterance);
    };

    this.speakTimer = setTimeout(() => {
      this.speakTimer = null;
      say(true);
    }, busy ? 60 : 0);
  }

  // --------------------------------------------------
  // Sound effects
  // --------------------------------------------------

  playTone(freq: number, type: OscillatorType, duration: number, startTime = 0, volume = 0.1) {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.1, 0, 0.1); // C5
    this.playTone(659.25, 'sine', 0.2, 0.1, 0.1); // E5
  }

  private getFailSounds(): HTMLAudioElement[] {
    if (!this.failSounds) {
      const probe = document.createElement('audio');
      const useM4a = probe.canPlayType('audio/mp4') !== '';
      this.failSounds = FAIL_SOUNDS.map((s) => {
        const el = new Audio(useM4a ? s.m4a : s.mp3);
        el.preload = 'auto';
        return el;
      });
    }
    return this.failSounds;
  }

  /** Preload the wrong-answer clips so the first miss isn't silent. */
  preload() {
    this.getFailSounds();
  }

  playFail() {
    if (this.muted) return;
    const sounds = this.getFailSounds();
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound.currentTime = 0;
    sound.play().catch(() => {
      /* autoplay blocked or clip missing - not worth surfacing */
    });
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0, 0.05);
  }

  playPop() {
    this.playTone(400, 'triangle', 0.05, 0, 0.05);
  }

  playCrash() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      /* ignore */
    }
  }

  playGameOver() {
    this.playTone(523.25, 'square', 0.2, 0, 0.05); // C5
    this.playTone(493.88, 'square', 0.2, 0.2, 0.05); // B4
    this.playTone(440.0, 'square', 0.4, 0.4, 0.05); // A4
  }
}

export const audio = new AudioService();
