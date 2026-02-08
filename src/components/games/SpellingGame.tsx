import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { vocabulary } from '@/data/koreanData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Sparkles, Check, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SpellingGameProps {
  onBack: () => void;
}

const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [currentWord, setCurrentWord] = useState<typeof vocabulary[0] | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const totalRounds = 50; // Increased from 8 to 50 rounds

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateRound = useCallback(() => {
    const shortWords = vocabulary.filter(v => v.korean.length <= 4 && v.korean.length >= 2);
    const word = shuffleArray(shortWords)[0];
    const letters = word.korean.split('');
    
    setCurrentWord(word);
    setScrambledLetters(shuffleArray(letters));
    setSelectedLetters([]);
    setUsedIndices([]);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (usedIndices.includes(index)) return;
    setSelectedLetters(prev => [...prev, letter]);
    setUsedIndices(prev => [...prev, index]);
  };

  const handleRemoveLetter = (index: number) => {
    const letterToRemove = selectedLetters[index];
    const originalIndex = usedIndices.find((_, i) => {
      const usedBefore = usedIndices.slice(0, i);
      const lettersBefore = usedBefore.map(idx => scrambledLetters[idx]);
      const countBefore = lettersBefore.filter(l => l === letterToRemove).length;
      const selectedBefore = selectedLetters.slice(0, index).filter(l => l === letterToRemove).length;
      return countBefore === selectedBefore && scrambledLetters[usedIndices[i]] === letterToRemove;
    });

    if (originalIndex !== undefined) {
      setUsedIndices(prev => prev.filter((_, i) => i !== index));
      setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    }
  };

  const checkAnswer = () => {
    const answer = selectedLetters.join('');
    const correct = answer === currentWord?.korean;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      speakKorean(currentWord!.korean);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setGameComplete(true);
        if (score >= 6) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        setRound(prev => prev + 1);
        generateRound();
      }
    }, 1500);
  };

  const restartGame = () => {
    setRound(1);
    setScore(0);
    setGameComplete(false);
    generateRound();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {isArabic ? 'أحسنت!' : '잘했어요!'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {isArabic 
              ? `حصلت على ${score} من ${totalRounds}` 
              : `${totalRounds}개 중 ${score}개 정답`}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack}>
              {isArabic ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
              {isArabic ? 'العودة' : '돌아가기'}
            </Button>
            <Button onClick={restartGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {isArabic ? 'إعادة اللعب' : '다시 하기'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{round}/{totalRounds}</span>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          {isArabic ? 'رتب الحروف' : '글자 배열'}
        </h2>

        {/* Hint Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {isArabic ? 'المعنى:' : '뜻:'}
            </p>
            <p className="text-xl font-medium">{currentWord?.arabic}</p>
            <button
              onClick={() => currentWord && speakKorean(currentWord.korean)}
              className="mt-2 p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Volume2 className="w-5 h-5 text-primary" />
            </button>
          </CardContent>
        </Card>

        {/* Answer Area */}
        <Card className={`mb-6 ${
          isCorrect === true 
            ? 'bg-green-500/20 border-green-500' 
            : isCorrect === false 
            ? 'bg-red-500/20 border-red-500' 
            : ''
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 min-h-[60px] flex-wrap">
              <AnimatePresence>
                {selectedLetters.map((letter, index) => (
                  <motion.button
                    key={`selected-${index}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => handleRemoveLetter(index)}
                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-korean text-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    {letter}
                  </motion.button>
                ))}
              </AnimatePresence>
              {selectedLetters.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  {isArabic ? 'اختر الحروف بالترتيب الصحيح' : '올바른 순서로 글자를 선택하세요'}
                </p>
              )}
            </div>
            {isCorrect !== null && (
              <div className={`mt-3 flex items-center justify-center gap-2 ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                <span className="font-korean text-lg">{currentWord?.korean}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scrambled Letters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {scrambledLetters.map((letter, index) => (
            <motion.button
              key={`scrambled-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleLetterClick(letter, index)}
              disabled={usedIndices.includes(index) || isCorrect !== null}
              className={`w-14 h-14 rounded-xl border-2 font-korean text-xl font-bold flex items-center justify-center transition-all ${
                usedIndices.includes(index)
                  ? 'opacity-30 border-muted'
                  : 'border-border bg-card hover:border-primary hover:scale-105'
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedLetters([]);
              setUsedIndices([]);
            }}
            disabled={selectedLetters.length === 0 || isCorrect !== null}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isArabic ? 'إعادة' : '다시'}
          </Button>
          <Button
            onClick={checkAnswer}
            disabled={selectedLetters.length !== scrambledLetters.length || isCorrect !== null}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            {isArabic ? 'تحقق' : '확인'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpellingGame;
