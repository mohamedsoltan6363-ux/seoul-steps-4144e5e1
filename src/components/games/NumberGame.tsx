import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Trophy, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface NumberGameProps {
  onBack: () => void;
}

const koreanNumbers = [
  { num: 1, korean: '하나', sino: '일' },
  { num: 2, korean: '둘', sino: '이' },
  { num: 3, korean: '셋', sino: '삼' },
  { num: 4, korean: '넷', sino: '사' },
  { num: 5, korean: '다섯', sino: '오' },
  { num: 6, korean: '여섯', sino: '육' },
  { num: 7, korean: '일곱', sino: '칠' },
  { num: 8, korean: '여덟', sino: '팔' },
  { num: 9, korean: '아홉', sino: '구' },
  { num: 10, korean: '열', sino: '십' },
  { num: 20, korean: '스물', sino: '이십' },
  { num: 30, korean: '서른', sino: '삼십' },
  { num: 40, korean: '마흔', sino: '사십' },
  { num: 50, korean: '쉰', sino: '오십' },
  { num: 100, korean: '백', sino: '백' },
];

const NumberGame: React.FC<NumberGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<typeof koreanNumbers[0] | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameMode, setGameMode] = useState<'native' | 'sino'>('native');
  const totalRounds = 50; // Increased to 50 rounds

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateRound = useCallback(() => {
    const correctNumber = koreanNumbers[Math.floor(Math.random() * koreanNumbers.length)];
    setCurrentNumber(correctNumber);
    
    const wrongNumbers = shuffleArray(
      koreanNumbers.filter(n => n.num !== correctNumber.num)
    ).slice(0, 3);
    
    setOptions(shuffleArray([correctNumber.num, ...wrongNumbers.map(n => n.num)]));
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const speakKorean = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: number) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentNumber?.num;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
      speakKorean(gameMode === 'native' ? currentNumber!.korean : currentNumber!.sino);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setGameComplete(true);
        if (score > 60) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setRound(round + 1);
        generateRound();
      }
    }, 1500);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {isArabic ? 'أحسنت! 🎉' : '잘했어요! 🎉'}
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            {isArabic ? `النتيجة: ${score} نقطة` : `점수: ${score}점`}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack}>
              {isArabic ? 'العودة' : '돌아가기'}
            </Button>
            <Button onClick={() => { setRound(1); setScore(0); setGameComplete(false); generateRound(); }}>
              {isArabic ? 'لعب مرة أخرى' : '다시 하기'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-amber-500/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isArabic ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{round}/{totalRounds}</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-bold">
              {score}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={gameMode === 'native' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGameMode('native')}
            className={gameMode === 'native' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}
          >
            {isArabic ? 'الأرقام الكورية الأصلية' : '고유어 숫자'}
          </Button>
          <Button
            variant={gameMode === 'sino' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGameMode('sino')}
            className={gameMode === 'sino' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}
          >
            {isArabic ? 'الأرقام الصينية الكورية' : '한자어 숫자'}
          </Button>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(round / totalRounds) * 100}%` }}
          />
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'لعبة الأرقام' : '숫자 게임'}
          </h1>
        </div>

        {/* Question */}
        {currentNumber && (
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic ? 'ما هو هذا الرقم؟' : '이 숫자는 뭐예요?'}
                </p>
                <p className="font-korean text-5xl font-bold mb-4">
                  {gameMode === 'native' ? currentNumber.korean : currentNumber.sino}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakKorean(gameMode === 'native' ? currentNumber.korean : currentNumber.sino)}
                  className="gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {isArabic ? 'استمع' : '듣기'}
                </Button>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentNumber.num;
                
                let buttonStyle = 'border-border hover:border-amber-500 hover:bg-amber-500/5';
                if (selectedAnswer) {
                  if (isCorrectAnswer) {
                    buttonStyle = 'border-emerald-500 bg-emerald-500/10';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'border-destructive bg-destructive/10';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-6 rounded-2xl border-2 text-3xl font-bold transition-all ${buttonStyle}`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NumberGame;
