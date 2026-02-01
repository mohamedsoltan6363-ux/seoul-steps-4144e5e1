import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundSettings {
  isMuted: boolean;
  volume: number;
  effectsEnabled: boolean;
}

interface SoundSettingsContextType {
  settings: SoundSettings;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setEffectsEnabled: (enabled: boolean) => void;
  toggleMute: () => void;
}

const defaultSettings: SoundSettings = {
  isMuted: false,
  volume: 0.5,
  effectsEnabled: true,
};

const SoundSettingsContext = createContext<SoundSettingsContextType | undefined>(undefined);

export const SoundSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('soundSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('soundSettings', JSON.stringify(settings));
  }, [settings]);

  const setMuted = (muted: boolean) => {
    setSettings(prev => ({ ...prev, isMuted: muted }));
  };

  const setVolume = (volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const setEffectsEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, effectsEnabled: enabled }));
  };

  const toggleMute = () => {
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  return (
    <SoundSettingsContext.Provider value={{ settings, setMuted, setVolume, setEffectsEnabled, toggleMute }}>
      {children}
    </SoundSettingsContext.Provider>
  );
};

export const useSoundSettings = () => {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within SoundSettingsProvider');
  }
  return context;
};
