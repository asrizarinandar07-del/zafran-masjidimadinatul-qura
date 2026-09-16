/**
 * Audio Synthesizer using Web Audio API
 * Provides cute, responsive sound effects for Zafran, Cat companion, and Maze interactions.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read user mute preference if available
    try {
      const saved = localStorage.getItem('zafran_audio_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('zafran_audio_muted', JSON.stringify(this.isMuted));
    } catch {
      // ignore
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(140 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  public playCatMeow(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Realistic playful cat meow using dual modulated oscillators
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 * pitchMultiplier, now);
      filter.Q.setValueAtTime(3, now);

      osc.type = 'sine';
      osc2.type = 'triangle';

      const baseFreq = 540 * pitchMultiplier;
      // Meow pitch profile: slight dip then rise then slide down
      osc.frequency.setValueAtTime(baseFreq * 0.9, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.35);

      osc2.frequency.setValueAtTime(baseFreq * 1.8, now);
      osc2.frequency.linearRampToValueAtTime(baseFreq * 2.6, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.7, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {
      // ignore
    }
  }

  public playCatPurr() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now);

      // Tremolo for purr vibration
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(18, now); // 18Hz cat purr cycle
      lfoGain.gain.setValueAtTime(0.08, now);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      lfo.start(now);
      osc.stop(now + 0.65);
      lfo.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  public playCollect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Dual bright bell chime
      const notes = [587.33, 880, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.14, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.36);
      });
    } catch {
      // ignore
    }
  }

  public playGateShift() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // ignore
    }
  }

  public playMultipleMeows(count: number = 3, onMeow?: (idx: number) => void) {
    if (this.isMuted) return;
    const pitches = [1.0, 1.28, 1.12, 1.35];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.playCatMeow(pitches[i % pitches.length]);
        if (onMeow) onMeow(i);
      }, i * 450);
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.92;
      utterance.pitch = 1.12;

      // Try finding Indonesian voice
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      let ended = false;
      const finish = () => {
        if (!ended) {
          ended = true;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Fallback timeout in case speech engine stalls
      const words = text.split(' ').length;
      const maxDuration = Math.max(3000, words * 700);
      setTimeout(finish, maxDuration);

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public playIntroVoice(onMeow?: (idx: number) => void, onComplete?: () => void) {
    const introText = "Ayo ke Masjid Madinatul Qura bersama Zafran";
    this.speak(introText, () => {
      // After speech, play cat meows multiple times
      this.playMultipleMeows(3, onMeow);
      if (onComplete) {
        setTimeout(onComplete, 3 * 450 + 200);
      }
    });
  }

  public playVictoryVoice(onMeow?: (idx: number) => void, onComplete?: () => void) {
    const victoryText = "Zafran Attaqi Subrata Anak Soleh";
    this.speak(victoryText, () => {
      // After speech, play celebratory cat meows
      this.playMultipleMeows(3, onMeow);
      if (onComplete) {
        setTimeout(onComplete, 3 * 450 + 200);
      }
    });
  }

  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Joyful celebratory ascending melody
      const melody = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.35 }, // C6
        { f: 880.00, d: 0.18 }, // A5
        { f: 1046.50, d: 0.6 }   // C6 held
      ];

      let elapsed = 0;
      melody.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + elapsed);

        gain.gain.setValueAtTime(0.18, now + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.001, now + elapsed + note.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + elapsed);
        osc.stop(now + elapsed + note.d + 0.05);

        elapsed += note.d * 0.85;
      });
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
