// Sound effects for onboarding transitions
// Uses Web Audio API for procedural sound generation

class OnboardingSoundEffects {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // Tank engine and impact sound
  playTankSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Low rumble for tank engine
      const rumbleOsc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(40, now);
      rumbleOsc.frequency.linearRampToValueAtTime(35, now + 0.5);
      rumbleGain.gain.setValueAtTime(0.15, now);
      rumbleGain.gain.linearRampToValueAtTime(0, now + 0.8);
      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumbleOsc.start(now);
      rumbleOsc.stop(now + 0.8);

      // Impact thud
      setTimeout(() => this.playImpactThud(), 400);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Buffalo/Cow charging sound
  playBuffaloSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Hooves sound
      for (let i = 0; i < 4; i++) {
        const hoofOsc = ctx.createOscillator();
        const hoofGain = ctx.createGain();
        hoofOsc.type = 'square';
        hoofOsc.frequency.setValueAtTime(100 + Math.random() * 50, now + i * 0.1);
        hoofGain.gain.setValueAtTime(0.08, now + i * 0.1);
        hoofGain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.08);
        hoofOsc.connect(hoofGain);
        hoofGain.connect(ctx.destination);
        hoofOsc.start(now + i * 0.1);
        hoofOsc.stop(now + i * 0.1 + 0.1);
      }

      // Moo-like sound
      const mooOsc = ctx.createOscillator();
      const mooGain = ctx.createGain();
      mooOsc.type = 'sawtooth';
      mooOsc.frequency.setValueAtTime(120, now + 0.2);
      mooOsc.frequency.linearRampToValueAtTime(80, now + 0.6);
      mooGain.gain.setValueAtTime(0.1, now + 0.2);
      mooGain.gain.linearRampToValueAtTime(0, now + 0.7);
      mooOsc.connect(mooGain);
      mooGain.connect(ctx.destination);
      mooOsc.start(now + 0.2);
      mooOsc.stop(now + 0.7);

      setTimeout(() => this.playImpactThud(), 500);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Elephant trumpeting and stomp
  playElephantSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Trumpet sound
      const trumpetOsc = ctx.createOscillator();
      const trumpetGain = ctx.createGain();
      trumpetOsc.type = 'sawtooth';
      trumpetOsc.frequency.setValueAtTime(300, now);
      trumpetOsc.frequency.linearRampToValueAtTime(600, now + 0.3);
      trumpetOsc.frequency.linearRampToValueAtTime(400, now + 0.5);
      trumpetGain.gain.setValueAtTime(0.12, now);
      trumpetGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      trumpetGain.gain.linearRampToValueAtTime(0, now + 0.6);
      trumpetOsc.connect(trumpetGain);
      trumpetGain.connect(ctx.destination);
      trumpetOsc.start(now);
      trumpetOsc.stop(now + 0.6);

      // Heavy stomp
      setTimeout(() => {
        const stompOsc = ctx.createOscillator();
        const stompGain = ctx.createGain();
        stompOsc.type = 'sine';
        stompOsc.frequency.setValueAtTime(60, ctx.currentTime);
        stompOsc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.2);
        stompGain.gain.setValueAtTime(0.3, ctx.currentTime);
        stompGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        stompOsc.connect(stompGain);
        stompGain.connect(ctx.destination);
        stompOsc.start(ctx.currentTime);
        stompOsc.stop(ctx.currentTime + 0.3);
      }, 400);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Rocket/Missile launch and explosion
  playRocketSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Whoosh sound
      const whooshNoise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.3));
      }
      whooshNoise.buffer = buffer;
      
      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.frequency.setValueAtTime(2000, now);
      whooshFilter.frequency.linearRampToValueAtTime(500, now + 0.5);
      whooshFilter.Q.value = 2;

      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.2, now);
      whooshGain.gain.linearRampToValueAtTime(0, now + 0.6);

      whooshNoise.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whooshNoise.start(now);

      setTimeout(() => this.playExplosionSound(), 600);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // RPG launch sound
  playRPGSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Launch pop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'square';
      popOsc.frequency.setValueAtTime(200, now);
      popOsc.frequency.linearRampToValueAtTime(50, now + 0.1);
      popGain.gain.setValueAtTime(0.3, now);
      popGain.gain.linearRampToValueAtTime(0, now + 0.15);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.15);

      // Whoosh trail
      setTimeout(() => {
        const trailOsc = ctx.createOscillator();
        const trailGain = ctx.createGain();
        trailOsc.type = 'sawtooth';
        trailOsc.frequency.setValueAtTime(800, ctx.currentTime);
        trailOsc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.4);
        trailGain.gain.setValueAtTime(0.08, ctx.currentTime);
        trailGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        trailOsc.connect(trailGain);
        trailGain.connect(ctx.destination);
        trailOsc.start(ctx.currentTime);
        trailOsc.stop(ctx.currentTime + 0.4);
      }, 100);

      setTimeout(() => this.playExplosionSound(), 800);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Fighter jet flyby and bomb
  playFighterJetSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Jet engine doppler effect
      const jetOsc = ctx.createOscillator();
      const jetGain = ctx.createGain();
      jetOsc.type = 'sawtooth';
      jetOsc.frequency.setValueAtTime(400, now);
      jetOsc.frequency.linearRampToValueAtTime(600, now + 0.3);
      jetOsc.frequency.linearRampToValueAtTime(300, now + 0.8);
      jetGain.gain.setValueAtTime(0.05, now);
      jetGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
      jetGain.gain.linearRampToValueAtTime(0, now + 1);
      jetOsc.connect(jetGain);
      jetGain.connect(ctx.destination);
      jetOsc.start(now);
      jetOsc.stop(now + 1);

      // Bomb whistle
      setTimeout(() => {
        const whistleOsc = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        whistleOsc.type = 'sine';
        whistleOsc.frequency.setValueAtTime(1200, ctx.currentTime);
        whistleOsc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.6);
        whistleGain.gain.setValueAtTime(0.1, ctx.currentTime);
        whistleGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
        whistleOsc.connect(whistleGain);
        whistleGain.connect(ctx.destination);
        whistleOsc.start(ctx.currentTime);
        whistleOsc.stop(ctx.currentTime + 0.6);
      }, 500);

      setTimeout(() => this.playExplosionSound(), 1100);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Helicopter rotor and gunfire
  playHelicopterSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Rotor chop
      for (let i = 0; i < 10; i++) {
        const chopOsc = ctx.createOscillator();
        const chopGain = ctx.createGain();
        chopOsc.type = 'square';
        chopOsc.frequency.setValueAtTime(80, now + i * 0.08);
        chopGain.gain.setValueAtTime(0.06, now + i * 0.08);
        chopGain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.04);
        chopOsc.connect(chopGain);
        chopGain.connect(ctx.destination);
        chopOsc.start(now + i * 0.08);
        chopOsc.stop(now + i * 0.08 + 0.05);
      }

      // Machine gun
      setTimeout(() => {
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            const gunOsc = ctx.createOscillator();
            const gunGain = ctx.createGain();
            gunOsc.type = 'square';
            gunOsc.frequency.setValueAtTime(150, ctx.currentTime);
            gunGain.gain.setValueAtTime(0.12, ctx.currentTime);
            gunGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
            gunOsc.connect(gunGain);
            gunGain.connect(ctx.destination);
            gunOsc.start(ctx.currentTime);
            gunOsc.stop(ctx.currentTime + 0.03);
          }, i * 40);
        }
      }, 400);

      setTimeout(() => this.playImpactThud(), 800);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Kid throwing brick sound
  playKidThrowSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Throw whoosh
      const throwOsc = ctx.createOscillator();
      const throwGain = ctx.createGain();
      throwOsc.type = 'sine';
      throwOsc.frequency.setValueAtTime(300, now);
      throwOsc.frequency.linearRampToValueAtTime(600, now + 0.2);
      throwGain.gain.setValueAtTime(0.1, now);
      throwGain.gain.linearRampToValueAtTime(0, now + 0.25);
      throwOsc.connect(throwGain);
      throwGain.connect(ctx.destination);
      throwOsc.start(now);
      throwOsc.stop(now + 0.25);

      // Brick hit
      setTimeout(() => {
        const hitOsc = ctx.createOscillator();
        const hitGain = ctx.createGain();
        hitOsc.type = 'triangle';
        hitOsc.frequency.setValueAtTime(200, ctx.currentTime);
        hitOsc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.1);
        hitGain.gain.setValueAtTime(0.25, ctx.currentTime);
        hitGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        hitOsc.connect(hitGain);
        hitGain.connect(ctx.destination);
        hitOsc.start(ctx.currentTime);
        hitOsc.stop(ctx.currentTime + 0.15);
      }, 300);

      setTimeout(() => this.playImpactThud(), 350);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Dragon fire breath
  playDragonSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Roar
      const roarOsc = ctx.createOscillator();
      const roarGain = ctx.createGain();
      roarOsc.type = 'sawtooth';
      roarOsc.frequency.setValueAtTime(100, now);
      roarOsc.frequency.linearRampToValueAtTime(150, now + 0.2);
      roarOsc.frequency.linearRampToValueAtTime(80, now + 0.5);
      roarGain.gain.setValueAtTime(0.15, now);
      roarGain.gain.linearRampToValueAtTime(0, now + 0.6);
      roarOsc.connect(roarGain);
      roarGain.connect(ctx.destination);
      roarOsc.start(now);
      roarOsc.stop(now + 0.6);

      // Fire crackle
      setTimeout(() => {
        const fireNoise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        fireNoise.buffer = buffer;
        const fireGain = ctx.createGain();
        fireGain.gain.setValueAtTime(0.1, ctx.currentTime);
        fireGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        fireNoise.connect(fireGain);
        fireGain.connect(ctx.destination);
        fireNoise.start(ctx.currentTime);
      }, 200);

      setTimeout(() => this.playImpactThud(), 600);
    } catch (e) {
      console.log('Audio not available');
    }
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

      // Whistle
      const whistleOsc = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      whistleOsc.type = 'sine';
      whistleOsc.frequency.setValueAtTime(800, now);
      whistleGain.gain.setValueAtTime(0.15, now);
      whistleGain.gain.linearRampToValueAtTime(0, now + 0.5);
      whistleOsc.connect(whistleGain);
      whistleGain.connect(ctx.destination);
      whistleOsc.start(now);
      whistleOsc.stop(now + 0.5);

      // Chug chug
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const chugOsc = ctx.createOscillator();
          const chugGain = ctx.createGain();
          chugOsc.type = 'square';
          chugOsc.frequency.setValueAtTime(50, ctx.currentTime);
          chugGain.gain.setValueAtTime(0.1, ctx.currentTime);
          chugGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
          chugOsc.connect(chugGain);
          chugGain.connect(ctx.destination);
          chugOsc.start(ctx.currentTime);
          chugOsc.stop(ctx.currentTime + 0.08);
        }, 100 + i * 100);
      }

      setTimeout(() => this.playImpactThud(), 700);
    } catch (e) {
      console.log('Audio not available');
    }
  }
}

export const onboardingSounds = new OnboardingSoundEffects();
