import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  BookOpen, MessageSquare, GraduationCap, User, LogOut, Trophy, 
  Flame, Star, Play, Lock, Check, Sparkles, Target, ChevronRight,
  Layers, Award
} from 'lucide-react';
import koreanCharacter from '@/assets/korean-character.png';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, isLevelUnlocked, getLevelProgress, loading, progressByLevel } = useProgress();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(language === 'ar' ? 'صباح الخير' : '좋은 아침이에요');
    else if (hour < 18) setGreeting(language === 'ar' ? 'مساء الخير' : '좋은 오후예요');
    else setGreeting(language === 'ar' ? 'مساء الخير' : '좋은 저녁이에요');
  }, [language]);

  const levels = [
    { 
      level: 1, 
      titleKey: 'level1', 
      icon: <span className="text-2xl font-korean">ㄱ</span>, 
      desc: language === 'ar' ? 'تعلم جميع الحروف الكورية' : '모든 한글 배우기',
      color: 'from-blue-500 to-indigo-600',
      items: 40
    },
    { 
      level: 2, 
      titleKey: 'level2', 
      icon: <BookOpen className="w-6 h-6" />, 
      desc: language === 'ar' ? 'كلمات أساسية للحياة اليومية' : '필수 단어',
      color: 'from-pink-500 to-rose-600',
      items: 80
    },
    { 
      level: 3, 
      titleKey: 'level3', 
      icon: <MessageSquare className="w-6 h-6" />, 
      desc: language === 'ar' ? 'جمل أساسية للمحادثة' : '기본 대화 문장',
      color: 'from-amber-500 to-orange-600',
      items: 25
    },
    { 
      level: 4, 
      titleKey: 'level4', 
      icon: <GraduationCap className="w-6 h-6" />, 
      desc: language === 'ar' ? 'جمل متقدمة + اختبار نهائي' : '고급 문장 + 최종 시험',
      color: 'from-purple-500 to-violet-600',
      items: 30
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : '로딩 중...'}</p>
        </div>
      </div>
    );
  }

  const totalMemorized = Object.values(progressByLevel).reduce((sum, p) => sum + p.memorizedCount, 0);
  const totalItems = Object.values(progressByLevel).reduce((sum, p) => sum + p.totalItems, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-korean text-2xl font-bold text-gradient">한국어</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {language === 'ar' ? 'تعلم' : '배우기'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button 
              onClick={() => navigate('/profile')} 
              className="p-2.5 rounded-xl hover:bg-muted transition-all duration-300"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => signOut()} 
              className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Welcome Section */}
        <div className="relative mb-8 p-6 rounded-3xl overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="absolute inset-0 opacity-30" />
          
          <div className="relative flex items-center gap-6">
            <div className="hidden sm:block">
              <img 
                src={koreanCharacter} 
                alt="Korean Character" 
                className="w-32 h-auto animate-float drop-shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">{greeting}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {language === 'ar' ? 'مرحباً بك!' : '환영합니다!'}
              </h1>
              <p className="text-white/80 text-sm">
                {language === 'ar' 
                  ? `لقد حفظت ${totalMemorized} من ${totalItems} عنصر` 
                  : `${totalItems}개 중 ${totalMemorized}개 암기 완료`}
              </p>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden max-w-xs">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${totalItems > 0 ? (totalMemorized / totalItems) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="stat-card text-center p-5">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-white/90" />
            <p className="text-3xl font-bold text-white">{totalPoints}</p>
            <p className="text-xs text-white/70">{t('totalPoints')}</p>
          </div>
          <div className="stat-card stat-card-secondary text-center p-5">
            <Flame className="w-8 h-8 mx-auto mb-2 text-white/90" />
            <p className="text-3xl font-bold text-white">{currentLevel}</p>
            <p className="text-xs text-white/70">{t('currentLevel')}</p>
          </div>
          <div className="stat-card stat-card-success text-center p-5">
            <Target className="w-8 h-8 mx-auto mb-2 text-white/90" />
            <p className="text-3xl font-bold text-white">{totalMemorized}</p>
            <p className="text-xs text-white/70">{language === 'ar' ? 'تم الحفظ' : '암기 완료'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => navigate('/learn/1')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div className="text-start">
              <p className="font-semibold">{language === 'ar' ? 'مراجعة سريعة' : '빠른 복습'}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'بطاقات تعليمية' : '플래시카드'}</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-start">
              <p className="font-semibold">{language === 'ar' ? 'الإنجازات' : '업적'}</p>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'شاهد تقدمك' : '진행 상황 보기'}</p>
            </div>
          </button>
        </div>

        {/* Levels */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('myLearning')}</h2>
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? `${levels.length} مستويات` : `${levels.length}개 레벨`}
          </span>
        </div>

        <div className="space-y-4">
          {levels.map((item) => {
            const isUnlocked = isLevelUnlocked(item.level);
            const progress = getLevelProgress(item.level);
            const isCompleted = progress >= 100;

            return (
              <div
                key={item.level}
                onClick={() => isUnlocked && navigate(`/learn/${item.level}`)}
                className={`level-card-pro ${!isUnlocked ? 'locked' : ''}`}
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />
                
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                      {isCompleted ? <Check className="w-7 h-7" /> : !isUnlocked ? <Lock className="w-6 h-6" /> : item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{t(item.titleKey)}</h3>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-korean-green/10 text-korean-green text-xs font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {t('completed')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>

                      {/* Progress */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[3rem] text-end">{progress}%</span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        {progressByLevel[item.level]?.memorizedCount || 0} / {item.items} {language === 'ar' ? 'عنصر' : '개'}
                      </p>
                    </div>

                    {/* Arrow */}
                    {isUnlocked && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Button */}
        {getLevelProgress(4) >= 70 && (
          <button
            onClick={() => navigate('/certificate')}
            className="w-full mt-8 p-4 rounded-2xl bg-gradient-to-r from-korean-gold to-amber-500 text-white font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300"
          >
            <GraduationCap className="w-6 h-6" />
            {t('printCertificate')}
          </button>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
