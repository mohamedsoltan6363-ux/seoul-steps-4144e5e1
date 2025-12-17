import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

interface AchievementData {
  id: string;
  titleAr: string;
  titleKo: string;
  descriptionAr: string;
  descriptionKo: string;
  icon: string;
  color: string;
  points: number;
}

const achievementDefinitions: Record<string, AchievementData> = {
  first_letter: { 
    id: 'first_letter',
    titleAr: 'الحرف الأول', 
    titleKo: '첫 글자', 
    descriptionAr: 'حفظ أول حرف كوري', 
    descriptionKo: '첫 번째 한글 암기', 
    icon: 'star', 
    color: 'from-yellow-400 to-amber-500',
    points: 10,
  },
  consonant_master: { 
    id: 'consonant_master',
    titleAr: 'أستاذ الحروف الساكنة', 
    titleKo: '자음 마스터', 
    descriptionAr: 'حفظ جميع الحروف الساكنة', 
    descriptionKo: '모든 자음 암기', 
    icon: 'medal', 
    color: 'from-blue-400 to-blue-600',
    points: 50,
  },
  vowel_master: { 
    id: 'vowel_master',
    titleAr: 'أستاذ الحروف المتحركة', 
    titleKo: '모음 마스터', 
    descriptionAr: 'حفظ جميع الحروف المتحركة', 
    descriptionKo: '모든 모음 암기', 
    icon: 'award', 
    color: 'from-pink-400 to-rose-500',
    points: 50,
  },
  level1_complete: { 
    id: 'level1_complete',
    titleAr: 'المستوى الأول', 
    titleKo: '레벨 1 완료', 
    descriptionAr: 'إتمام المستوى الأول بالكامل', 
    descriptionKo: '레벨 1 완료', 
    icon: 'trophy', 
    color: 'from-green-400 to-emerald-500',
    points: 100,
  },
  vocabulary_25: { 
    id: 'vocabulary_25',
    titleAr: 'متعلم المفردات', 
    titleKo: '단어 입문자', 
    descriptionAr: 'حفظ 25 كلمة', 
    descriptionKo: '25단어 암기', 
    icon: 'book', 
    color: 'from-cyan-400 to-teal-500',
    points: 25,
  },
  vocabulary_50: { 
    id: 'vocabulary_50',
    titleAr: 'جامع الكلمات', 
    titleKo: '단어 수집가', 
    descriptionAr: 'حفظ 50 كلمة', 
    descriptionKo: '50단어 암기', 
    icon: 'target', 
    color: 'from-purple-400 to-violet-500',
    points: 75,
  },
  vocabulary_100: { 
    id: 'vocabulary_100',
    titleAr: 'خبير المفردات', 
    titleKo: '단어 전문가', 
    descriptionAr: 'حفظ 100 كلمة', 
    descriptionKo: '100단어 암기', 
    icon: 'sparkles', 
    color: 'from-indigo-400 to-purple-500',
    points: 150,
  },
  streak_3: { 
    id: 'streak_3',
    titleAr: '3 أيام متتالية', 
    titleKo: '3일 연속', 
    descriptionAr: 'التعلم لمدة 3 أيام متتالية', 
    descriptionKo: '3일 연속 학습', 
    icon: 'flame', 
    color: 'from-orange-400 to-red-500',
    points: 30,
  },
  streak_7: { 
    id: 'streak_7',
    titleAr: 'أسبوع متواصل', 
    titleKo: '7일 연속', 
    descriptionAr: 'التعلم لمدة 7 أيام متتالية', 
    descriptionKo: '7일 연속 학습', 
    icon: 'flame', 
    color: 'from-red-400 to-rose-600',
    points: 70,
  },
  streak_14: { 
    id: 'streak_14',
    titleAr: 'أسبوعان متواصلان', 
    titleKo: '14일 연속', 
    descriptionAr: 'التعلم لمدة 14 يوم متتالي', 
    descriptionKo: '14일 연속 학습', 
    icon: 'zap', 
    color: 'from-amber-400 to-orange-600',
    points: 150,
  },
  streak_30: { 
    id: 'streak_30',
    titleAr: 'شهر متواصل', 
    titleKo: '30일 연속', 
    descriptionAr: 'التعلم لمدة 30 يوم متتالي', 
    descriptionKo: '30일 연속 학습', 
    icon: 'crown', 
    color: 'from-yellow-400 to-amber-600',
    points: 300,
  },
  quiz_perfect: { 
    id: 'quiz_perfect',
    titleAr: 'درجة كاملة', 
    titleKo: '만점', 
    descriptionAr: 'الحصول على درجة كاملة في الاختبار', 
    descriptionKo: '퀴즈 만점', 
    icon: 'crown', 
    color: 'from-amber-400 to-yellow-500',
    points: 100,
  },
  dedicated_learner: { 
    id: 'dedicated_learner',
    titleAr: 'متعلم مثابر', 
    titleKo: '열정적인 학습자', 
    descriptionAr: 'جمع 500 نقطة', 
    descriptionKo: '500 포인트 달성', 
    icon: 'heart', 
    color: 'from-pink-400 to-red-500',
    points: 50,
  },
  expert_learner: { 
    id: 'expert_learner',
    titleAr: 'خبير التعلم', 
    titleKo: '학습 전문가', 
    descriptionAr: 'جمع 1000 نقطة', 
    descriptionKo: '1000 포인트 달성', 
    icon: 'gift', 
    color: 'from-violet-400 to-purple-600',
    points: 100,
  },
  master_learner: { 
    id: 'master_learner',
    titleAr: 'أستاذ التعلم', 
    titleKo: '학습 마스터', 
    descriptionAr: 'إتمام جميع المستويات', 
    descriptionKo: '모든 레벨 완료', 
    icon: 'rocket', 
    color: 'from-amber-400 via-orange-500 to-red-500',
    points: 500,
  },
};

interface AchievementContextType {
  showAchievement: (achievementId: string) => void;
  currentAchievement: AchievementData | null;
  clearAchievement: () => void;
  getAchievementData: (id: string) => AchievementData | undefined;
  allAchievements: typeof achievementDefinitions;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<AchievementData | null>(null);
  const [queue, setQueue] = useState<string[]>([]);

  const showAchievement = useCallback((achievementId: string) => {
    const achievement = achievementDefinitions[achievementId];
    if (achievement) {
      if (currentAchievement) {
        setQueue(prev => [...prev, achievementId]);
      } else {
        setCurrentAchievement(achievement);
      }
    }
  }, [currentAchievement]);

  const clearAchievement = useCallback(() => {
    setCurrentAchievement(null);
    
    // Show next in queue
    setTimeout(() => {
      if (queue.length > 0) {
        const [next, ...rest] = queue;
        setQueue(rest);
        const achievement = achievementDefinitions[next];
        if (achievement) {
          setCurrentAchievement(achievement);
        }
      }
    }, 500);
  }, [queue]);

  const getAchievementData = useCallback((id: string) => {
    return achievementDefinitions[id];
  }, []);

  return (
    <AchievementContext.Provider value={{ 
      showAchievement, 
      currentAchievement, 
      clearAchievement,
      getAchievementData,
      allAchievements: achievementDefinitions
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
