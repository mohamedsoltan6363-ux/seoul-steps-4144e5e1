import { useCallback } from 'react';

// Sound frequencies for different effects
const SOUNDS = {
  click: { frequency: 800, duration: 50, type: 'sine' as OscillatorType },
  success: { frequency: 523.25, duration: 150, type: 'sine' as OscillatorType },
  pop: { frequency: 400, duration: 80, type: 'triangle' as OscillatorType },
  swoosh: { frequency: 200, duration: 100, type: 'sawtooth' as OscillatorType },
  chime: { frequency: 659.25, duration: 200, type: 'sine' as OscillatorType },
  bubble: { frequency: 600, duration: 60, type: 'sine' as OscillatorType },
};

export const useSoundEffects = () => {
  const playSound = useCallback((soundType: keyof typeof SOUNDS) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      const sound = SOUNDS[soundType];
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
      
      // Add frequency sweep for more interesting sounds
      if (soundType === 'pop') {
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + sound.duration / 1000);
      } else if (soundType === 'swoosh') {
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + sound.duration / 1000);
      } else if (soundType === 'bubble') {
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + sound.duration / 2000);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + sound.duration / 1000);
      }

      // Volume envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + sound.duration / 1000);

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, sound.duration + 100);
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio not available');
    }
  }, []);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playSuccess = useCallback(() => playSound('success'), [playSound]);
  const playPop = useCallback(() => playSound('pop'), [playSound]);
  const playSwoosh = useCallback(() => playSound('swoosh'), [playSound]);
  const playChime = useCallback(() => playSound('chime'), [playSound]);
  const playBubble = useCallback(() => playSound('bubble'), [playSound]);

  return {
    playSound,
    playClick,
    playSuccess,
    playPop,
    playSwoosh,
    playChime,
    playBubble,
  };
};
