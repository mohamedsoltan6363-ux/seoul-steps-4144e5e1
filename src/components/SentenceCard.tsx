import React, { useState } from 'react';
import { Volume2, Check, RotateCcw } from 'lucide-react';
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
  const { t } = useLanguage();
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
      className={`korean-card ${isMemorized ? 'border-korean-green bg-green-50' : ''} animate-scale-in`}
    >
      {/* Korean Sentence */}
      <div className="mb-4">
        <span className="font-korean text-2xl md:text-3xl font-bold text-gradient leading-relaxed">
          {korean}
        </span>
      </div>

      {/* Arabic Translation */}
      <div className="mb-3 p-3 bg-muted rounded-lg">
        <span className="text-lg font-semibold text-foreground">{arabic}</span>
      </div>

      {/* Romanization */}
      <div className="mb-4 text-center">
        <span className="text-muted-foreground font-korean text-sm">{romanized}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
            ${isPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-primary hover:text-primary-foreground'
            } transition-all duration-300`}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{t('listen')}</span>
        </button>

        <button
          onClick={onToggleMemorized}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300
            ${isMemorized 
              ? 'bg-korean-green text-white' 
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
