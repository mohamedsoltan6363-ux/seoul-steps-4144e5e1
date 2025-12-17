import React, { useState } from 'react';
import { Volume2, RotateCw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FlashcardItem {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  audioText?: string;
}

interface FlashcardProps {
  items: FlashcardItem[];
  onComplete: () => void;
  onMarkMemorized: (id: string) => void;
  memorizedIds: string[];
}

const Flashcard: React.FC<FlashcardProps> = ({ items, onComplete, onMarkMemorized, memorizedIds }) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentItem = items[currentIndex];
  const isMemorized = memorizedIds.includes(currentItem?.id);
  const progress = ((currentIndex + 1) / items.length) * 100;

  const playAudio = () => {
    if (!currentItem) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentItem.audioText || currentItem.korean);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.7;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnow = () => {
    if (!isMemorized) {
      onMarkMemorized(currentItem.id);
    }
    setReviewedCount(prev => prev + 1);
    handleNext();
  };

  const handleDontKnow = () => {
    setReviewedCount(prev => prev + 1);
    handleNext();
  };

  if (!currentItem) return null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {language === 'ar' ? `تمت المراجعة: ${reviewedCount}` : `복습: ${reviewedCount}`}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="relative h-80 perspective-1000 cursor-pointer mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-face flashcard-front">
            <div className="absolute top-4 right-4">
              {isMemorized && (
                <div className="w-8 h-8 rounded-full bg-korean-green/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-korean-green" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="font-korean text-6xl md:text-7xl font-bold text-gradient mb-4">
                {currentItem.korean}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isPlaying ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                } transition-all`}
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>{t('listen')}</span>
              </button>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground text-sm">
              {language === 'ar' ? 'انقر للقلب' : '클릭하여 뒤집기'}
            </div>
          </div>
          
          {/* Back */}
          <div className="flashcard-face flashcard-back">
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <span className="font-korean text-4xl font-bold text-primary">
                {currentItem.korean}
              </span>
              <div className="text-center space-y-2">
                <p className="text-2xl font-semibold text-foreground">{currentItem.arabic}</p>
                <p className="text-lg text-muted-foreground font-korean">{currentItem.romanized}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 flex gap-3">
          <button
            onClick={handleDontKnow}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold transition-all"
          >
            <X className="w-5 h-5" />
            <span>{language === 'ar' ? 'لا أعرف' : '모르겠어요'}</span>
          </button>
          <button
            onClick={handleKnow}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-korean-green/10 hover:bg-korean-green/20 text-korean-green font-semibold transition-all"
          >
            <Check className="w-5 h-5" />
            <span>{language === 'ar' ? 'أعرف' : '알겠어요'}</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          className="p-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Flip Button */}
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-all"
      >
        <RotateCw className="w-5 h-5" />
        <span>{language === 'ar' ? 'اقلب البطاقة' : '카드 뒤집기'}</span>
      </button>
    </div>
  );
};

export default Flashcard;
