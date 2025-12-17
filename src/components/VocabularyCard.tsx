import React, { useState } from 'react';
import { Volume2, Check, RotateCcw, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VocabularyCardProps {
  korean: string;
  romanized: string;
  arabic: string;
  category: string;
  isMemorized: boolean;
  onToggleMemorized: () => void;
}

const categoryColors: Record<string, string> = {
  greetings: 'bg-korean-pink-light text-secondary',
  family: 'bg-korean-blue-light text-primary',
  numbers: 'bg-korean-gold-light text-accent-foreground',
  food: 'bg-green-100 text-green-700',
  places: 'bg-purple-100 text-purple-700',
  time: 'bg-orange-100 text-orange-700',
  body: 'bg-red-100 text-red-700',
  verbs: 'bg-cyan-100 text-cyan-700',
  adjectives: 'bg-indigo-100 text-indigo-700',
};

const categoryNames: Record<string, { ar: string; ko: string }> = {
  greetings: { ar: 'تحيات', ko: '인사' },
  family: { ar: 'عائلة', ko: '가족' },
  numbers: { ar: 'أرقام', ko: '숫자' },
  food: { ar: 'طعام', ko: '음식' },
  places: { ar: 'أماكن', ko: '장소' },
  time: { ar: 'وقت', ko: '시간' },
  body: { ar: 'جسم', ko: '신체' },
  verbs: { ar: 'أفعال', ko: '동사' },
  adjectives: { ar: 'صفات', ko: '형용사' },
};

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  korean,
  romanized,
  arabic,
  category,
  isMemorized,
  onToggleMemorized,
}) => {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(korean);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.7;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className={`letter-card ${isMemorized ? 'memorized' : ''} animate-scale-in`}
    >
      {/* Category Badge */}
      <div className="flex justify-end mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
          <Tag className="w-3 h-3" />
          {categoryNames[category]?.[language] || category}
        </span>
      </div>

      {/* Korean Word */}
      <div className="text-center mb-3">
        <span className="font-korean text-3xl md:text-4xl font-bold text-gradient">
          {korean}
        </span>
      </div>

      {/* Translation */}
      <div className="text-center mb-2">
        <span className="text-xl font-semibold text-foreground">{arabic}</span>
      </div>

      {/* Romanization */}
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground font-korean">{romanized}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
            ${isPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-muted/80'
            } transition-all duration-300`}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="text-sm">{t('listen')}</span>
        </button>

        <button
          onClick={onToggleMemorized}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
            ${isMemorized 
              ? 'bg-korean-green text-white' 
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          {isMemorized ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">{t('memorized')}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">{t('notMemorized')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VocabularyCard;
