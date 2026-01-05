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

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  greetings: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-400 to-rose-500' },
  family: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-400 to-indigo-500' },
  numbers: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
  food: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-400 to-emerald-500' },
  places: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-400 to-violet-500' },
  time: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-400 to-red-500' },
  body: { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-400 to-rose-500' },
  verbs: { bg: 'bg-cyan-100', text: 'text-cyan-700', gradient: 'from-cyan-400 to-teal-500' },
  adjectives: { bg: 'bg-indigo-100', text: 'text-indigo-700', gradient: 'from-indigo-400 to-purple-500' },
  abstract: { bg: 'bg-violet-100', text: 'text-violet-700', gradient: 'from-violet-400 to-purple-500' },
  professional: { bg: 'bg-slate-100', text: 'text-slate-700', gradient: 'from-slate-400 to-gray-500' },
  academic: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
  medical: { bg: 'bg-rose-100', text: 'text-rose-700', gradient: 'from-rose-400 to-red-500' },
  legal: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-yellow-500' },
  technology: { bg: 'bg-sky-100', text: 'text-sky-700', gradient: 'from-sky-400 to-blue-500' },
  environment: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-400 to-lime-500' },
  social: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', gradient: 'from-fuchsia-400 to-pink-500' },
  emotions: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-400 to-rose-500' },
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
  abstract: { ar: 'مفاهيم', ko: '개념' },
  professional: { ar: 'مهني', ko: '직업' },
  academic: { ar: 'أكاديمي', ko: '학술' },
  medical: { ar: 'طبي', ko: '의료' },
  legal: { ar: 'قانوني', ko: '법률' },
  technology: { ar: 'تقنية', ko: '기술' },
  environment: { ar: 'بيئة', ko: '환경' },
  social: { ar: 'اجتماعي', ko: '사회' },
  emotions: { ar: 'مشاعر', ko: '감정' },
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
  
  const colors = categoryColors[category] || { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-400 to-gray-500' };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(korean);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.7;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className={`vocab-card-pro ${isMemorized ? 'memorized' : ''} animate-scale-in`}>
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
      
      {/* Memorized indicator */}
      {isMemorized && (
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-korean-green flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
          <Tag className="w-3 h-3" />
          {categoryNames[category]?.[language] || category}
        </span>
      </div>

      {/* Korean Word */}
      <div className="text-center mb-2">
        <span className="font-korean text-3xl md:text-4xl font-bold text-gradient">
          {korean}
        </span>
      </div>

      {/* Arabic Translation */}
      <div className="text-center mb-1">
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
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl 
            ${isPlaying 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-muted hover:bg-primary hover:text-primary-foreground'
            } transition-all duration-300`}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">{t('listen')}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleMemorized(); }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300
            ${isMemorized 
              ? 'bg-korean-green text-white shadow-lg' 
              : 'bg-muted hover:bg-korean-green hover:text-white'
            }`}
        >
          {isMemorized ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{t('memorized')}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">{t('notMemorized')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VocabularyCard;
