import React, { createContext, useState, useContext, useCallback } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

interface AchievementContextType {
  achievements: Achievement[];
  currentAchievement: Achievement | null;
  unlockAchievement: (achievement: Achievement) => void;
  clearAchievement: () => void;
  isAchievementUnlocked: (achievementId: string) => boolean;
}

export const AchievementContext = createContext<AchievementContextType | null>(null);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const unlockAchievement = useCallback((achievement: Achievement) => {
    setAchievements(prev => {
      const exists = prev.some(a => a.id === achievement.id);
      if (exists) return prev;
      return [...prev, { ...achievement, unlockedAt: new Date() }];
    });
    setCurrentAchievement(achievement);
  }, []);

  const clearAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  const isAchievementUnlocked = useCallback((achievementId: string) => {
    return achievements.some(a => a.id === achievementId);
  }, [achievements]);

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        currentAchievement,
        unlockAchievement,
        clearAchievement,
        isAchievementUnlocked,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
};
