import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { vocabulary, consonants, vowels, basicSentences, advancedSentences } from '@/data/koreanData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Brain, Check, X, RotateCcw, Clock, Flame, Star, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Review: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { dueItems, totalReviews, masteredCount, recordReview, getDueCount, refreshReviews } = useSpacedRepetition();
  const isRTL = language === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Get full item data from the ID
  const getItemData = (itemId: string, level: number) => {
    if (level === 1) {
      const consonant = consonants.find(c => c.id === itemId);
      if (consonant) return { korean: consonant.korean, romanized: consonant.romanized, arabic: consonant.arabic };
      const vowel = vowels.find(v => v.id === itemId);
      if (vowel) return { korean: vowel.korean, romanized: vowel.romanized, arabic: vowel.arabic };
    }
    if (level === 2) {
      const vocab = vocabulary.find(v => v.id === itemId);
      if (vocab) return { korean: vocab.korean, romanized: vocab.romanized, arabic: vocab.arabic };
    }
    if (level === 3) {
      const sentence = basicSentences.find(s => s.id === itemId);
      if (sentence) return { korean: sentence.korean, romanized: sentence.romanized, arabic: sentence.arabic };
    }
    if (level === 4) {
      const sentence = advancedSentences.find(s => s.id === itemId);
      if (sentence) return { korean: sentence.korean, romanized: sentence.romanized, arabic: sentence.arabic };
    }
    return { korean: itemId, romanized: '', arabic: '' };
  };

  const enrichedItems = useMemo(() => 
    dueItems.map(item => ({
      ...item,
      ...getItemData(item.item_id, item.level)
    })),
  [dueItems]);

  const currentItem = enrichedItems[currentIndex];

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleRating = async (quality: number) => {
    if (!currentItem) return;

    await recordReview(
      currentItem.level,
      currentItem.lesson_type,
      currentItem.item_id,
      quality
    );

    if (quality >= 3) {
      setCorrectCount(prev => prev + 1);
    }
    setReviewedCount(prev => prev + 1);

    if (currentIndex < enrichedItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
      if (correctCount / reviewedCount >= 0.8) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const restartSession = () => {
    refreshReviews();
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionComplete(false);
    setCorrectCount(0);
    setReviewedCount(0);
  };

  if (dueItems.length === 0 && !sessionComplete) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
        <header className="sticky top-0 z-50 glass-effect border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="font-medium">{isRTL ? 'العودة' : '돌아가기'}</span>
            </button>
            <h1 className="font-bold text-lg">{isRTL ? 'المراجعة' : '복습'}</h1>
            <div className="w-20" />
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'أحسنت! لا توجد مراجعات مستحقة' : '잘했어요! 복습할 항목이 없습니다'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isRTL 
                ? 'لقد أتممت جميع المراجعات المطلوبة. عد لاحقاً للمزيد!' 
                : '모든 복습을 완료했습니다. 나중에 다시 확인하세요!'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{totalReviews}</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إجمالي المراجعات' : '총 복습'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-500">{masteredCount}</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تم إتقانها' : '마스터'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => navigate('/dashboard')} className="w-full">
              {isRTL ? 'العودة للوحة التحكم' : '대시보드로 돌아가기'}
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
        <main className="container mx-auto px-4 py-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'أكملت جلسة المراجعة!' : '복습 세션 완료!'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{reviewedCount}</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تمت مراجعتها' : '복습 완료'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-500">{accuracy}%</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الدقة' : '정확도'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={restartSession} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                {isRTL ? 'مراجعة أخرى' : '다시 복습'}
              </Button>
              <Button onClick={() => navigate('/dashboard')} className="flex-1">
                {isRTL ? 'إنهاء' : '완료'}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-primary" />
              <span>{currentIndex + 1}/{enrichedItems.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-500">
              <Check className="w-4 h-4" />
              <span>{correctCount}</span>
            </div>
          </div>
          <div className="w-8" />
        </div>
        <Progress value={(currentIndex / enrichedItems.length) * 100} className="h-1" />
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Flashcard */}
            <Card 
              className="mb-6 cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {isRTL ? `المستوى ${currentItem?.level}` : `레벨 ${currentItem?.level}`}
                  </p>
                  
                  <div className="mb-6">
                    <p className="text-4xl font-korean mb-2">{currentItem?.korean}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakKorean(currentItem?.korean || '');
                      }}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <Volume2 className="w-5 h-5 text-primary" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAnswer ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">{currentItem?.romanized}</p>
                          <p className="text-xl font-medium">{currentItem?.arabic}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'انقر لإظهار الإجابة' : '정답을 보려면 클릭하세요'}
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Rating Buttons */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-center text-sm text-muted-foreground mb-4">
                  {isRTL ? 'كيف كان تذكرك لهذا العنصر؟' : '이 항목을 얼마나 잘 기억했나요?'}
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleRating(1)}
                    className="flex-col h-auto py-4 border-red-500/20 hover:bg-red-500/10 hover:border-red-500"
                  >
                    <X className="w-6 h-6 text-red-500 mb-1" />
                    <span className="text-xs">{isRTL ? 'نسيت' : '잊음'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRating(3)}
                    className="flex-col h-auto py-4 border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500"
                  >
                    <Clock className="w-6 h-6 text-yellow-500 mb-1" />
                    <span className="text-xs">{isRTL ? 'صعب' : '어려움'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRating(5)}
                    className="flex-col h-auto py-4 border-green-500/20 hover:bg-green-500/10 hover:border-green-500"
                  >
                    <Flame className="w-6 h-6 text-green-500 mb-1" />
                    <span className="text-xs">{isRTL ? 'سهل' : '쉬움'}</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Review;
