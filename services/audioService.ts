
class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      // Create context only when needed
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  // Must be called on a user interaction (click) to unlock audio on browsers
  resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Text-to-Speech for Hinglish/Hindi
  speak(text: string) {
    if (this.muted || !('speechSynthesis' in window)) return;

    const performSpeak = () => {
      try {
        // Cancel any currently playing speech to avoid overlap
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        // Priority Strategy for Indian Accent:
        // 1. Exact 'hi-IN' (Hindi India) - Best for Devanagari text
        // 2. 'en-IN' (English India)
        // 3. Specific known Indian voice names (Android/iOS/Windows/macOS)
        
        let targetVoice = voices.find(v => v.lang === 'hi-IN');

        if (!targetVoice) {
          targetVoice = voices.find(v => v.lang === 'en-IN');
        }
        
        if (!targetVoice) {
            targetVoice = voices.find(v => 
              v.name.includes('Hindi') || 
              v.name.includes('India') || 
              v.name.includes('Lekha') || // iOS/macOS
              v.name.includes('Rishi') || // iOS/macOS
              v.name.includes('Neerja') || // Windows
              v.name.includes('Hemant') || // Windows
              v.name.includes('Heera')     // Windows
            );
        }

        // Fallback: search for any voice starting with 'hi'
        if (!targetVoice) {
            targetVoice = voices.find(v => v.lang.startsWith('hi'));
        }

        if (targetVoice) {
          utterance.voice = targetVoice;
          utterance.lang = targetVoice.lang; // Important to set lang to match voice
        } else {
          // Absolute fallback: force locale and hope OS defaults correctly
          utterance.lang = 'hi-IN';
        }
        
        // Slightly slower rate often sounds more natural/clear for these engines
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Speech failed", e);
      }
    };

    // Browsers like Chrome load voices asynchronously.
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', performSpeak, { once: true });
    } else {
      performSpeak();
    }
  }

  // Warmup needed for iOS to allow speech later
  warmup() {
    if (!('speechSynthesis' in window)) return;
    // Just create a silent utterance to init the engine
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }

  playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 0.1) {
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
      console.error("Audio play failed", e);
    }
  }

  playSuccess() {
    // High pitched pleasant "Ding-Ding"
    this.playTone(523.25, 'sine', 0.1, 0, 0.1); // C5
    this.playTone(659.25, 'sine', 0.2, 0.1, 0.1); // E5
  }

  playFail() {
    // Low pitched "Buzz"
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  }

  playClick() {
    // Short blip
    this.playTone(800, 'sine', 0.05, 0, 0.05);
  }
  
  playPop() {
    this.playTone(400, 'triangle', 0.05, 0, 0.05);
  }

  playCrash() {
    // Dramatic noise crash for game over impact
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      // Rapid pitch drop
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
  }

  playGameOver() {
    // Sad descending melody
    this.playTone(523.25, 'square', 0.2, 0, 0.05); // C5
    this.playTone(493.88, 'square', 0.2, 0.2, 0.05); // B4
    this.playTone(440.00, 'square', 0.4, 0.4, 0.05); // A4
  }
}

export const audio = new AudioService();
