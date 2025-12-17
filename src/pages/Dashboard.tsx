import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LevelCard from '@/components/LevelCard';
import { BookOpen, MessageSquare, GraduationCap, User, LogOut, Trophy, Flame, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, isLevelUnlocked, getLevelProgress, loading } = useProgress();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  const levels = [
    { level: 1, titleKey: 'level1', icon: <span className="text-2xl">ㄱ</span>, desc: language === 'ar' ? 'تعلم جميع الحروف الكورية الساكنة والمتحركة' : '모든 한글 자음과 모음 배우기' },
    { level: 2, titleKey: 'level2', icon: <BookOpen className="w-6 h-6" />, desc: language === 'ar' ? '80+ كلمة أساسية للحياة اليومية' : '80개 이상의 필수 단어' },
    { level: 3, titleKey: 'level3', icon: <MessageSquare className="w-6 h-6" />, desc: language === 'ar' ? 'جمل أساسية للمحادثة' : '기본 대화 문장' },
    { level: 4, titleKey: 'level4', icon: <GraduationCap className="w-6 h-6" />, desc: language === 'ar' ? 'جمل متقدمة + اختبار نهائي' : '고급 문장 + 최종 시험' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-korean text-xl font-bold text-gradient">한국어</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-muted transition-colors text-destructive">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="korean-card text-center p-4">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-korean-gold" />
            <p className="text-2xl font-bold text-gradient">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
          </div>
          <div className="korean-card text-center p-4">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{currentLevel}</p>
            <p className="text-xs text-muted-foreground">{t('currentLevel')}</p>
          </div>
          <div className="korean-card text-center p-4">
            <Star className="w-6 h-6 mx-auto mb-2 text-korean-pink" />
            <p className="text-2xl font-bold">{getLevelProgress(currentLevel)}%</p>
            <p className="text-xs text-muted-foreground">{t('progress')}</p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="korean-card mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <p className="text-lg font-semibold text-center">
            {language === 'ar' ? '🎯 استمر! أنت تتقدم بشكل رائع' : '🎯 계속하세요! 잘하고 있어요'}
          </p>
        </div>

        {/* Levels */}
        <h2 className="text-xl font-bold mb-4">{t('myLearning')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {levels.map((item) => (
            <LevelCard
              key={item.level}
              level={item.level}
              title={t(item.titleKey)}
              description={item.desc}
              icon={item.icon}
              isUnlocked={isLevelUnlocked(item.level)}
              progress={getLevelProgress(item.level)}
              isCompleted={getLevelProgress(item.level) >= 100}
            />
          ))}
        </div>

        {/* Certificate Button */}
        {getLevelProgress(4) >= 70 && (
          <button
            onClick={() => navigate('/certificate')}
            className="w-full mt-8 korean-button flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            {t('printCertificate')}
          </button>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
