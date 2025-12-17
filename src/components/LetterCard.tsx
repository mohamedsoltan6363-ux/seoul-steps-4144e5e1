import React, { useState } from 'react';
import { Volume2, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LetterCardProps {
  korean: string;
  romanized: string;
  arabic: string;
  audioText: string;
  isMemorized: boolean;
  onToggleMemorized: () => void;
}

const LetterCard: React.FC<LetterCardProps> = ({
  korean,
  romanized,
  arabic,
  audioText,
  isMemorized,
  onToggleMemorized,
}) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className={`letter-card-pro ${isMemorized ? 'memorized' : ''} animate-scale-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Memorized Badge */}
      {isMemorized && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-korean-green flex items-center justify-center shadow-lg z-10">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Sparkle effect on hover */}
      {isHovered && !isMemorized && (
        <div className="absolute top-3 right-3 text-primary/50">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      )}

      {/* Korean Letter - Large and centered */}
      <div className="text-center py-4">
        <div className={`inline-block transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          <span className="font-korean text-6xl md:text-7xl font-bold text-gradient">
            {korean}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary mb-4" />

      {/* Pronunciations */}
      <div className="space-y-2 mb-5">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{language === 'ar' ? 'عربي' : '아랍어'}</span>
          <span className="text-lg font-semibold text-foreground">{arabic}</span>
        </div>
        <div className="flex justify-between items-center px-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{language === 'ar' ? 'إنجليزي' : '영어'}</span>
          <span className="text-lg font-semibold text-foreground font-korean">{romanized}</span>
        </div>
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

export default LetterCard;
