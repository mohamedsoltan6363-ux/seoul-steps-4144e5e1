import React from 'react';
import { Lock, Play, Check, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface LevelCardProps {
  level: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress: number;
  isCompleted: boolean;
}

const levelColors = [
  'from-blue-500 to-blue-600',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-violet-600',
];

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  title,
  description,
  icon,
  isUnlocked,
  progress,
  isCompleted,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/learn/${level}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`korean-card relative overflow-hidden cursor-pointer group ${
        !isUnlocked ? 'opacity-60' : ''
      }`}
    >
      {/* Gradient Header */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${levelColors[level - 1]}`} />
      
      {/* Level Badge */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${levelColors[level - 1]} flex items-center justify-center text-white shadow-lg`}>
          {isCompleted ? <Check className="w-6 h-6" /> : icon}
        </div>
        
        {!isUnlocked && (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('locked')}</span>
          </div>
        )}
        
        {isCompleted && (
          <div className="flex items-center gap-1 px-3 py-1 bg-korean-gold-light rounded-full">
            <Star className="w-4 h-4 text-korean-gold fill-korean-gold" />
            <span className="text-sm font-semibold text-korean-gold">{t('completed')}</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{t('progress')}</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      {isUnlocked && (
        <button className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
          isCompleted 
            ? 'bg-muted text-foreground hover:bg-muted/80' 
            : `bg-gradient-to-r ${levelColors[level - 1]} text-white hover:shadow-lg`
        }`}>
          <Play className="w-5 h-5" />
          <span>{isCompleted ? t('continue') : t('startLevel')}</span>
        </button>
      )}
    </div>
  );
};

export default LevelCard;
