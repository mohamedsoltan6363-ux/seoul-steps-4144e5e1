import React, { useState } from 'react';
import { Volume2, Check, RotateCcw, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SentenceCardProps {
  korean: string;
  romanized: string;
  arabic: string;
  isMemorized: boolean;
  onToggleMemorized: () => void;
}

const SentenceCard: React.FC<SentenceCardProps> = ({
  korean,
  romanized,
  arabic,
  isMemorized,
  onToggleMemorized,
}) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className={`sentence-card-pro ${isMemorized ? 'memorized' : ''} animate-scale-in`}>
      {/* Memorized indicator */}
      {isMemorized && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-korean-green flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-primary/20" />
      </div>

      {/* Korean Sentence */}
      <div className="mb-4">
        <span className="font-korean text-2xl md:text-3xl font-bold text-gradient leading-relaxed">
          {korean}
        </span>
      </div>

      {/* Arabic Translation */}
      <div className="mb-3 p-4 rounded-2xl bg-gradient-to-r from-muted to-muted/50">
        <span className="text-lg font-semibold text-foreground leading-relaxed">{arabic}</span>
      </div>

      {/* Romanization */}
      <div className="mb-5 px-2">
        <span className="text-muted-foreground font-korean text-sm">{romanized}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
            ${isPlaying 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-muted hover:bg-primary hover:text-primary-foreground'
            } transition-all duration-300`}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{t('listen')}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleMemorized(); }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300
            ${isMemorized 
              ? 'bg-korean-green text-white shadow-lg' 
              : 'bg-muted hover:bg-korean-green hover:text-white'
            }`}
        >
          {isMemorized ? (
            <>
              <Check className="w-5 h-5" />
              <span className="font-medium">{t('memorized')}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-5 h-5" />
              <span className="font-medium">{t('notMemorized')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SentenceCard;
