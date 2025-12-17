import React, { useState } from 'react';
import { Volume2, Check, RotateCcw } from 'lucide-react';
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
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className={`letter-card-mobile ${isMemorized ? 'memorized' : ''} animate-scale-in`}>
      {/* Memorized Badge */}
      {isMemorized && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-korean-green flex items-center justify-center shadow-md z-10">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Korean Letter */}
      <div className="text-center py-2">
        <span className="font-korean text-4xl sm:text-5xl font-bold text-gradient">
          {korean}
        </span>
      </div>

      {/* Divider */}
      <div className="w-10 h-0.5 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary mb-2" />

      {/* Pronunciations - Compact */}
      <div className="space-y-1 mb-3 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{language === 'ar' ? 'عربي' : '아랍어'}</span>
          <span className="font-semibold text-foreground text-sm">{arabic}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{language === 'ar' ? 'إنجليزي' : '영어'}</span>
          <span className="font-semibold text-foreground font-korean text-sm">{romanized}</span>
        </div>
      </div>

      {/* Actions - Stacked on mobile */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs
            ${isPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-primary hover:text-primary-foreground'
            } transition-all duration-300`}
        >
          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{language === 'ar' ? 'استمع' : '듣기'}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleMemorized(); }}
          className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs transition-all duration-300
            ${isMemorized 
              ? 'bg-korean-green text-white' 
              : 'bg-muted hover:bg-korean-green hover:text-white'
            }`}
        >
          {isMemorized ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="font-medium">{language === 'ar' ? 'تم الحفظ' : '암기완료'}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="font-medium">{language === 'ar' ? 'لم يُحفظ' : '미암기'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LetterCard;
