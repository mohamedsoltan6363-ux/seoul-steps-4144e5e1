import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, RotateCcw, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WritingPracticeProps {
  items: Array<{ id: string; korean: string; romanized: string; arabic: string; audioText?: string }>;
  onComplete: () => void;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ items, onComplete }) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Clear and draw guide
    clearCanvas();
  }, [currentIndex, showGuide]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw guide character
    if (showGuide && currentItem) {
      ctx.font = '120px "Noto Sans KR"';
      ctx.fillStyle = 'rgba(var(--primary), 0.1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentItem.korean, rect.width / 2, rect.height / 2);
    }
    
    // Draw grid
    ctx.strokeStyle = 'rgba(var(--border), 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, rect.height / 2);
    ctx.lineTo(rect.width, rect.height / 2);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, 0);
    ctx.lineTo(rect.width / 2, rect.height);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? e.touches[0] : e;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? e.touches[0] : e;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

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
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`text-sm px-3 py-1 rounded-full transition-all ${
              showGuide ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {language === 'ar' ? 'إظهار الدليل' : '가이드 표시'}
          </button>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Character Info */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="font-korean text-4xl font-bold text-gradient">{currentItem.korean}</span>
          <button
            onClick={playAudio}
            className={`p-2 rounded-full ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <p className="text-muted-foreground">{currentItem.arabic} ({currentItem.romanized})</p>
      </div>

      {/* Canvas */}
      <div className="writing-canvas-container">
        <canvas
          ref={canvasRef}
          className="writing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={clearCanvas}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-all"
        >
          <Eraser className="w-5 h-5" />
          <span>{language === 'ar' ? 'مسح' : '지우기'}</span>
        </button>
        <button
          onClick={() => { clearCanvas(); }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{language === 'ar' ? 'إعادة' : '다시'}</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 korean-button flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          <span>{currentIndex === items.length - 1 
            ? (language === 'ar' ? 'إنهاء' : '완료') 
            : (language === 'ar' ? 'التالي' : '다음')
          }</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          className="p-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WritingPractice;
