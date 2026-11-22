/**
 * Sound & Audio Engine with Web Audio API Procedural Synthesizer
 * Guarantees zero 404s, offline support, and cinematic sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private volume: number = 0.6;
  private isSynthesizingMusic: boolean = false;
  private synthMusicTimer: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public initBackgroundMusic(url: string, defaultVolume: number = 0.6) {
    this.volume = defaultVolume;
    if (typeof window === 'undefined') return;

    if (!this.bgAudio) {
      this.bgAudio = new Audio(url);
      this.bgAudio.loop = true;
      this.bgAudio.volume = this.isMuted ? 0 : this.volume;
      this.bgAudio.preload = 'auto';

      // Fallback if remote audio fails or is blocked
      this.bgAudio.addEventListener('error', () => {
        console.warn('Audio URL playback failed, falling back to Web Audio Procedural Synth.');
        if (!this.isMuted) {
          this.startProceduralLoFiMusic();
        }
      });
    }
  }

  public playBackgroundMusic() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (this.bgAudio) {
      const playPromise = this.bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented by browser policy; wait for user tap
        });
      }
    } else {
      this.startProceduralLoFiMusic();
    }
  }

  public pauseBackgroundMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.stopProceduralLoFiMusic();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.volume = this.isMuted ? 0 : this.volume;
      if (this.isMuted) {
        this.bgAudio.pause();
      } else {
        this.bgAudio.play().catch(() => {});
      }
    }

    if (this.isMuted) {
      this.stopProceduralLoFiMusic();
    } else if (!this.bgAudio || this.bgAudio.paused) {
      this.playBackgroundMusic();
    }

    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgAudio) {
      this.bgAudio.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /* ---------------- SFX PROCEDURAL SYNTHESIZERS ---------------- */

  // 1. Paper / Envelope Opening
  public playEnvelopeOpen() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // 2. Gift Box Pop / Sparkle Burst
  public playGiftPop() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Pop low thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.35 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    // Magical chime cascade
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    chords.forEach((freq, idx) => {
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'triangle';
      bell.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      bellGain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.05);
      bellGain.gain.linearRampToValueAtTime(0.2 * this.volume, ctx.currentTime + idx * 0.05 + 0.02);
      bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.6);

      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(ctx.currentTime + idx * 0.05);
      bell.stop(ctx.currentTime + idx * 0.05 + 0.65);
    });
  }

  // 3. Candle Blow / Breath Air Puff
  public playBlowCandle() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3 * this.volume, ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // 4. Firework Launch & Boom
  public playFirework() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Boom bass
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(140, ctx.currentTime);
    boomOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.5);

    boomGain.gain.setValueAtTime(0.4 * this.volume, ctx.currentTime);
    boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start();
    boomOsc.stop(ctx.currentTime + 0.52);

    // Crackle noise
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  }

  // 5. Card Flip / Click
  public playClick() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  // 6. Game Success / Fanfare
  public playFanfare() {
    if (this.isSfxMuted || this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Cheerful arpeggio notes (Do Mi Sol Do)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /* ---------------- PROCEDURAL LO-FI MUSIC BOX ---------------- */
  // Ambient procedural music box progression: Happy Birthday melody in soft celesta tones
  private startProceduralLoFiMusic() {
    if (this.isSynthesizingMusic || this.isMuted) return;
    this.isSynthesizingMusic = true;

    const notes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear friend
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy birthday to you
    ];

    const durations = [
      0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
      0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
      0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 1.2,
      0.4, 0.4, 0.8, 0.8, 0.8, 1.6
    ];

    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isSynthesizingMusic || this.isMuted) return;
      const ctx = this.getAudioContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = notes[noteIdx] * 1.5; // Sweet bell register

        gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durations[noteIdx] + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durations[noteIdx] + 0.5);
      }

      const nextDelay = (durations[noteIdx] || 0.8) * 1000;
      noteIdx = (noteIdx + 1) % notes.length;
      this.synthMusicTimer = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  private stopProceduralLoFiMusic() {
    this.isSynthesizingMusic = false;
    if (this.synthMusicTimer) {
      clearTimeout(this.synthMusicTimer);
      this.synthMusicTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
