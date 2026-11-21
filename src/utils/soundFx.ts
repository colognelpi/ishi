/**
 * Synthesized Web Audio API Sound Effects for interactive UI & mini-games.
 * Background music is handled separately via the hidden YouTube embed player.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.55;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainLevel = 0.14,
    delay = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick(): void {
    this.playTone(680, 0.08, 'triangle', 0.12);
    this.playTone(920, 0.07, 'sine', 0.08, 0.03);
  }

  public playHeartCatch(): void {
    this.playTone(587.33, 0.09, 'triangle', 0.14);
    this.playTone(880, 0.14, 'sine', 0.16, 0.05);
  }

  public playCardFlip(): void {
    this.playTone(440, 0.06, 'sine', 0.1);
    this.playTone(523.25, 0.08, 'triangle', 0.08, 0.03);
  }

  public playPairMatch(): void {
    this.playTone(523.25, 0.14, 'triangle', 0.14, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.14, 0.08);
    this.playTone(783.99, 0.22, 'sine', 0.16, 0.16);
  }

  public playGameWin(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.26, 'triangle', 0.15, idx * 0.09);
    });
  }

  public playNoDodge(): void {
    this.playTone(392, 0.08, 'triangle', 0.1);
    this.playTone(329.63, 0.1, 'sine', 0.09, 0.05);
  }

  public playYesCelebration(): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    fanfare.forEach((n, idx) => {
      this.playTone(n, 0.38, 'triangle', 0.16, idx * 0.085);
      this.playTone(n * 0.5, 0.35, 'sine', 0.08, idx * 0.085);
    });
  }

  public playNoGentle(): void {
    this.playTone(440, 0.35, 'sine', 0.1, 0);
    this.playTone(392, 0.45, 'sine', 0.09, 0.2);
  }

  public playEnvelopeOpen(): void {
    const chime = [659.25, 783.99, 987.77, 1318.51];
    chime.forEach((n, idx) => {
      this.playTone(n, 0.32, 'sine', 0.12, idx * 0.1);
    });
  }
}

export const soundEngine = new SoundEngine();
