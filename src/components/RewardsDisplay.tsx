import React from 'react';
import { Trophy, Star, Flame, Target, Crown, Medal, Award, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Achievement {
  id: string;
  unlocked: boolean;
}

interface RewardsDisplayProps {
  totalPoints: number;
  currentLevel: number;
  streakDays: number;
  achievements: Achievement[];
}

const achievementData: Record<string, { titleAr: string; titleKo: string; descriptionAr: string; descriptionKo: string; icon: React.ReactNode; color: string }> = {
  first_letter: { titleAr: 'الحرف الأول', titleKo: '첫 글자', descriptionAr: 'حفظ أول حرف كوري', descriptionKo: '첫 번째 한글 암기', icon: <Star className="w-6 h-6" />, color: 'from-yellow-400 to-amber-500' },
  consonant_master: { titleAr: 'أستاذ الحروف الساكنة', titleKo: '자음 마스터', descriptionAr: 'حفظ جميع الحروف الساكنة', descriptionKo: '모든 자음 암기', icon: <Medal className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
  vowel_master: { titleAr: 'أستاذ الحروف المتحركة', titleKo: '모음 마스터', descriptionAr: 'حفظ جميع الحروف المتحركة', descriptionKo: '모든 모음 암기', icon: <Award className="w-6 h-6" />, color: 'from-pink-400 to-rose-500' },
  level1_complete: { titleAr: 'المستوى الأول', titleKo: '레벨 1 완료', descriptionAr: 'إتمام المستوى الأول', descriptionKo: '레벨 1 완료', icon: <Trophy className="w-6 h-6" />, color: 'from-green-400 to-emerald-500' },
  vocabulary_50: { titleAr: 'جامع الكلمات', titleKo: '단어 수집가', descriptionAr: 'حفظ 50 كلمة', descriptionKo: '50단어 암기', icon: <Target className="w-6 h-6" />, color: 'from-purple-400 to-violet-500' },
  streak_7: { titleAr: 'أسبوع متواصل', titleKo: '7일 연속', descriptionAr: 'التعلم لمدة 7 أيام متتالية', descriptionKo: '7일 연속 학습', icon: <Flame className="w-6 h-6" />, color: 'from-orange-400 to-red-500' },
  quiz_perfect: { titleAr: 'درجة كاملة', titleKo: '만점', descriptionAr: 'الحصول على درجة كاملة في الاختبار', descriptionKo: '퀴즈 만점', icon: <Crown className="w-6 h-6" />, color: 'from-amber-400 to-yellow-500' },
  speed_learner: { titleAr: 'متعلم سريع', titleKo: '빠른 학습자', descriptionAr: 'حفظ 10 عناصر في جلسة واحدة', descriptionKo: '한 세션에 10개 암기', icon: <Zap className="w-6 h-6" />, color: 'from-cyan-400 to-teal-500' },
};

const RewardsDisplay: React.FC<RewardsDisplayProps> = ({ totalPoints, streakDays, achievements }) => {
  const { language } = useLanguage();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-korean-gold to-amber-500 flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gradient">{totalPoints}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'النقاط' : '포인트'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{streakDays}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'أيام متتالية' : '연속 일수'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{unlockedCount}/{Object.keys(achievementData).length}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الإنجازات' : '업적'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">{language === 'ar' ? 'الإنجازات' : '업적'}</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(achievementData).map(([id, data]) => {
            const isUnlocked = achievements.some(a => a.id === id && a.unlocked);
            return (
              <div key={id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isUnlocked ? data.color : 'from-gray-300 to-gray-400'} flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                  <div className={isUnlocked ? 'text-white' : 'text-gray-500'}>{data.icon}</div>
                </div>
                <h4 className={`font-semibold text-sm text-center mb-1 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {language === 'ar' ? data.titleAr : data.titleKo}
                </h4>
                <p className="text-xs text-muted-foreground text-center">
                  {language === 'ar' ? data.descriptionAr : data.descriptionKo}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsDisplay;
