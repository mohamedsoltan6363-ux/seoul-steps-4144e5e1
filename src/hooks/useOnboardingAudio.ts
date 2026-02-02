import { useEffect, useRef, useState, useCallback } from 'react';

// Relaxing ambient music generator using Web Audio API
const createAmbientMusic = (audioContext: AudioContext, gainNode: GainNode) => {
  // Create oscillators for a peaceful ambient sound
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  // Base frequencies for a calming C major chord with extensions
  const frequencies = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00]; // C3, E3, G3, C4, E4, G4

  frequencies.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    // Very low volume for ambient background
    oscGain.gain.setValueAtTime(0.02 + (index * 0.005), audioContext.currentTime);
    
    // Slow LFO for gentle volume modulation
    const lfoFreq = 0.1 + (index * 0.02);
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoFreq, audioContext.currentTime);
    lfoGain.gain.setValueAtTime(0.01, audioContext.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);
    
    osc.connect(oscGain);
    oscGain.connect(gainNode);
    
    oscillators.push(osc, lfo);
    gains.push(oscGain);
    
    osc.start();
    lfo.start();
  });

  // Add gentle pink noise for texture
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.005;
    b6 = white * 0.115926;
  }

  const noise = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  noiseGain.gain.setValueAtTime(0.015, audioContext.currentTime);
  
  noise.connect(noiseGain);
  noiseGain.connect(gainNode);
  noise.start();

  return () => {
    oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    try { noise.stop(); } catch (e) {}
  };
};

// Korean TTS using Web Speech API
const speakKorean = (text: string, volume: number = 0.8) => {
  if ('speechSynthesis' in window && text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.volume = volume;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Try to find Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => voice.lang.includes('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};

export const useOnboardingAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const stopMusicRef = useRef<(() => void) | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('onboarding_muted');
    return saved === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = useCallback(() => {
    if (audioContextRef.current || isMuted) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 2);
      
      gainNode.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      
      stopMusicRef.current = createAmbientMusic(audioContext, gainNode);
      setIsPlaying(true);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [isMuted]);

  const stopMusic = useCallback(() => {
    if (stopMusicRef.current) {
      stopMusicRef.current();
      stopMusicRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('onboarding_muted', String(newMuted));

    if (newMuted) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isMuted, startMusic, stopMusic]);

  const speakText = useCallback((koreanText: string) => {
    if (!isMuted && koreanText) {
      speakKorean(koreanText, 0.7);
    }
  }, [isMuted]);

  // Auto-start music on mount
  useEffect(() => {
    if (!isMuted) {
      // Small delay to ensure user interaction has occurred
      const timer = setTimeout(() => {
        startMusic();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMuted, startMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      window.speechSynthesis.cancel();
    };
  }, [stopMusic]);

  // Load voices for TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return {
    isMuted,
    isPlaying,
    toggleMute,
    speakText,
    startMusic,
    stopMusic
  };
};
