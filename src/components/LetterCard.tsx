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
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className={`letter-card ${isMemorized ? 'memorized' : ''} animate-scale-in`}
    >
      {/* Korean Letter */}
      <div className="text-center mb-4">
        <span className="font-korean text-6xl md:text-7xl font-bold text-gradient">
          {korean}
        </span>
      </div>

      {/* Pronunciations */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{t('arabic')}:</span>
          <span className="font-semibold text-foreground">{arabic}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{t('english')}:</span>
          <span className="font-semibold text-foreground font-korean">{romanized}</span>
        </div>
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

export default LetterCard;
