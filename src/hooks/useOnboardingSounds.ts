// Sound effects for onboarding transitions
// Uses Web Audio API for procedural sound generation
// FIXED: Sounds now play at impact time, not before

class OnboardingSoundEffects {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private scheduledSounds: number[] = [];

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // Clear all scheduled sounds
  clearScheduledSounds() {
    this.scheduledSounds.forEach(id => clearTimeout(id));
    this.scheduledSounds = [];
  }

  // Play sound after specific delay (for syncing with collision)
  playTankSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playTankImpact(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playTankImpact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Impact thud first
      this.playImpactThud();

      // Low rumble after impact
      const rumbleOsc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(50, now);
      rumbleOsc.frequency.linearRampToValueAtTime(30, now + 0.4);
      rumbleGain.gain.setValueAtTime(0.2, now);
      rumbleGain.gain.linearRampToValueAtTime(0, now + 0.5);
      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumbleOsc.start(now);
      rumbleOsc.stop(now + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playBuffaloSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playBuffaloImpact(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playBuffaloImpact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Impact thud first
      this.playImpactThud();

      // Moo-like sound after impact
      const mooOsc = ctx.createOscillator();
      const mooGain = ctx.createGain();
      mooOsc.type = 'sawtooth';
      mooOsc.frequency.setValueAtTime(140, now);
      mooOsc.frequency.linearRampToValueAtTime(90, now + 0.4);
      mooGain.gain.setValueAtTime(0.12, now);
      mooGain.gain.linearRampToValueAtTime(0, now + 0.5);
      mooOsc.connect(mooGain);
      mooGain.connect(ctx.destination);
      mooOsc.start(now);
      mooOsc.stop(now + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playElephantSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playElephantImpact(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playElephantImpact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Heavy stomp immediately
      const stompOsc = ctx.createOscillator();
      const stompGain = ctx.createGain();
      stompOsc.type = 'sine';
      stompOsc.frequency.setValueAtTime(60, now);
      stompOsc.frequency.linearRampToValueAtTime(25, now + 0.25);
      stompGain.gain.setValueAtTime(0.4, now);
      stompGain.gain.linearRampToValueAtTime(0, now + 0.35);
      stompOsc.connect(stompGain);
      stompGain.connect(ctx.destination);
      stompOsc.start(now);
      stompOsc.stop(now + 0.35);

      // Trumpet sound after
      const trumpetOsc = ctx.createOscillator();
      const trumpetGain = ctx.createGain();
      trumpetOsc.type = 'sawtooth';
      trumpetOsc.frequency.setValueAtTime(350, now + 0.1);
      trumpetOsc.frequency.linearRampToValueAtTime(500, now + 0.25);
      trumpetOsc.frequency.linearRampToValueAtTime(300, now + 0.4);
      trumpetGain.gain.setValueAtTime(0.15, now + 0.1);
      trumpetGain.gain.linearRampToValueAtTime(0, now + 0.5);
      trumpetOsc.connect(trumpetGain);
      trumpetGain.connect(ctx.destination);
      trumpetOsc.start(now + 0.1);
      trumpetOsc.stop(now + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playRocketSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playExplosionSound(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  playRPGSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playRPGImpact(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playRPGImpact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Direct explosion sound at impact
      this.playExplosionSound();
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playFighterJetSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playExplosionSound(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  playHelicopterSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playHelicopterImpact(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playHelicopterImpact() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Machine gun rapid fire at impact
      for (let i = 0; i < 6; i++) {
        const gunOsc = ctx.createOscillator();
        const gunGain = ctx.createGain();
        gunOsc.type = 'square';
        gunOsc.frequency.setValueAtTime(180, now + i * 0.04);
        gunGain.gain.setValueAtTime(0.15, now + i * 0.04);
        gunGain.gain.linearRampToValueAtTime(0, now + i * 0.04 + 0.03);
        gunOsc.connect(gunGain);
        gunGain.connect(ctx.destination);
        gunOsc.start(now + i * 0.04);
        gunOsc.stop(now + i * 0.04 + 0.03);
      }

      this.playImpactThud();
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playKidThrowSoundAtImpact(delayMs: number = 0) {
    if (this.isMuted) return;
    const timeoutId = window.setTimeout(() => this.playBrickHit(), delayMs);
    this.scheduledSounds.push(timeoutId);
  }

  private playBrickHit() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Brick hit sound immediately
      const hitOsc = ctx.createOscillator();
      const hitGain = ctx.createGain();
      hitOsc.type = 'triangle';
      hitOsc.frequency.setValueAtTime(250, now);
      hitOsc.frequency.linearRampToValueAtTime(80, now + 0.12);
      hitGain.gain.setValueAtTime(0.3, now);
      hitGain.gain.linearRampToValueAtTime(0, now + 0.18);
      hitOsc.connect(hitGain);
      hitGain.connect(ctx.destination);
      hitOsc.start(now);
      hitOsc.stop(now + 0.18);

      this.playImpactThud();
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Legacy methods for backward compatibility
  playTankSound() {
    this.playTankSoundAtImpact(0);
  }

  playBuffaloSound() {
    this.playBuffaloSoundAtImpact(0);
  }

  playElephantSound() {
    this.playElephantSoundAtImpact(0);
  }

  playRocketSound() {
    this.playRocketSoundAtImpact(0);
  }

  playRPGSound() {
    this.playRPGSoundAtImpact(0);
  }

  playFighterJetSound() {
    this.playFighterJetSoundAtImpact(0);
  }

  playHelicopterSound() {
    this.playHelicopterSoundAtImpact(0);
  }

  playKidThrowSound() {
    this.playKidThrowSoundAtImpact(0);
  }

  // Common impact thud
  private playImpactThud() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(80, now);
      thudOsc.frequency.linearRampToValueAtTime(40, now + 0.15);
      thudGain.gain.setValueAtTime(0.4, now);
      thudGain.gain.linearRampToValueAtTime(0, now + 0.2);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.2);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Explosion sound
  private playExplosionSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Create noise buffer
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Low-pass filter for boom
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.linearRampToValueAtTime(100, now + 0.5);

      const explosionGain = ctx.createGain();
      explosionGain.gain.setValueAtTime(0.5, now);
      explosionGain.gain.linearRampToValueAtTime(0, now + 0.6);

      noiseSource.connect(filter);
      filter.connect(explosionGain);
      explosionGain.connect(ctx.destination);
      noiseSource.start(now);

      // Low boom
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(60, now);
      boomOsc.frequency.linearRampToValueAtTime(20, now + 0.3);
      boomGain.gain.setValueAtTime(0.5, now);
      boomGain.gain.linearRampToValueAtTime(0, now + 0.4);
      boomOsc.connect(boomGain);
      boomGain.connect(ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.4);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Train whistle and chug
  playTrainSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      this.playImpactThud();
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Celebration sound for account creation
  playCelebrationSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Musical fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.15, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.35);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }
}

export const onboardingSounds = new OnboardingSoundEffects();
