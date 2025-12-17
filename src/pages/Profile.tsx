import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { ArrowLeft, Trophy, Flame, Star, User } from 'lucide-react';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, getLevelProgress } = useProgress();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">{t('profile')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold">{user?.email}</h2>
          <p className="text-muted-foreground">{language === 'ar' ? 'متعلم اللغة الكورية' : '한국어 학습자'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="korean-card text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-korean-gold" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
          </div>
          <div className="korean-card text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{currentLevel}</p>
            <p className="text-xs text-muted-foreground">{t('currentLevel')}</p>
          </div>
          <div className="korean-card text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-korean-pink" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">{t('achievements')}</p>
          </div>
        </div>

        {/* Progress by Level */}
        <h3 className="font-bold mb-4">{t('progress')}</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((level) => (
            <div key={level} className="korean-card">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{t(`level${level}` as any)}</span>
                <span className="text-primary font-bold">{getLevelProgress(level)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${getLevelProgress(level)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
