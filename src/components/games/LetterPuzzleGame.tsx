import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Trophy, RotateCcw, Sparkles, HelpCircle, Lightbulb } from 'lucide-react';
import { vocabulary } from '@/data/koreanData';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LetterPuzzleGameProps {
  onBack: () => void;
}

const LetterPuzzleGame = ({ onBack }: LetterPuzzleGameProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(8);
  const [currentWord, setCurrentWord] = useState<{ korean: string; arabic: string } | null>(null);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get words with 2-4 characters for puzzle
  const getShortWords = useCallback(() => {
    return vocabulary.filter(v => v.korean.length >= 2 && v.korean.length <= 4);
  }, []);

  const generateRound = useCallback(() => {
    const shortWords = getShortWords();
    const randomWord = shortWords[Math.floor(Math.random() * shortWords.length)];
    const letters = randomWord.korean.split('');
    
    setCurrentWord({ korean: randomWord.korean, arabic: randomWord.arabic });
    setShuffledLetters(shuffleArray(letters));
    setSelectedLetters([]);
    setUsedIndices([]);
    setShowHint(false);
    setIsCorrect(null);
  }, [getShortWords]);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleLetterClick = (letter: string, index: number) => {
    if (usedIndices.includes(index)) return;
    
    setSelectedLetters(prev => [...prev, letter]);
    setUsedIndices(prev => [...prev, index]);
  };

  const handleRemoveLetter = (index: number) => {
    const originalIndex = usedIndices[index];
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    setUsedIndices(prev => prev.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    const answer = selectedLetters.join('');
    const correct = answer === currentWord.korean;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + (showHint ? 5 : 15));
      
      setTimeout(() => {
        if (round < totalRounds) {
          setRound(prev => prev + 1);
          generateRound();
        } else {
          setGameComplete(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setSelectedLetters([]);
        setUsedIndices([]);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const restartGame = () => {
    setRound(1);
    setScore(0);
    setGameComplete(false);
    generateRound();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                {isArabic ? 'رائع!' : '대단해요!'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isArabic ? 'لقد حللت جميع الألغاز' : '모든 퍼즐을 풀었습니다'}
              </p>
              <div className="text-5xl font-bold mb-6 text-primary">{score}</div>
              <p className="text-sm text-muted-foreground mb-8">
                {isArabic ? 'النقاط' : '점수'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={restartGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isArabic ? 'إعادة اللعب' : '다시 하기'}
                </Button>
                <Button variant="outline" onClick={onBack}>
                  {isArabic ? 'العودة' : '돌아가기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isArabic ? 'العودة' : '돌아가기'}
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {isArabic ? `الجولة ${round} من ${totalRounds}` : `라운드 ${round} / ${totalRounds}`}
          </span>
        </div>
        <Progress value={(round / totalRounds) * 100} className="h-2" />
      </div>

      {/* Hint Card */}
      <Card className="mb-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'المعنى:' : '의미:'}
              </p>
              <p className="text-lg font-semibold">{currentWord?.arabic}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="gap-2"
            >
              {showHint ? <Lightbulb className="w-4 h-4 text-amber-500" /> : <HelpCircle className="w-4 h-4" />}
              {isArabic ? 'تلميح' : '힌트'}
            </Button>
          </div>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-amber-600 dark:text-amber-400 mt-2"
            >
              {isArabic ? `عدد الحروف: ${currentWord?.korean.length}` : `글자 수: ${currentWord?.korean.length}`}
            </motion.p>
          )}
        </CardContent>
      </Card>

      {/* Answer Area */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2 text-center">
          {isArabic ? 'إجابتك:' : '답변:'}
        </p>
        <div className={`min-h-16 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors ${
          isCorrect === true ? 'border-green-500 bg-green-500/10' :
          isCorrect === false ? 'border-red-500 bg-red-500/10' :
          'border-muted-foreground/30'
        }`}>
          <AnimatePresence mode="popLayout">
            {selectedLetters.map((letter, index) => (
              <motion.button
                key={`${letter}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleRemoveLetter(index)}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
              >
                {letter}
              </motion.button>
            ))}
          </AnimatePresence>
          {selectedLetters.length === 0 && (
            <span className="text-muted-foreground text-sm">
              {isArabic ? 'اضغط على الحروف لترتيبها' : '글자를 클릭하여 배열하세요'}
            </span>
          )}
        </div>
      </div>

      {/* Shuffled Letters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {shuffledLetters.map((letter, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleLetterClick(letter, index)}
            disabled={usedIndices.includes(index)}
            className={`w-14 h-14 rounded-xl font-bold text-xl shadow-md transition-all ${
              usedIndices.includes(index)
                ? 'bg-muted text-muted-foreground opacity-40 cursor-not-allowed'
                : 'bg-card border-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105'
            }`}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedLetters([]);
            setUsedIndices([]);
            setIsCorrect(null);
          }}
          disabled={selectedLetters.length === 0}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isArabic ? 'إعادة' : '다시'}
        </Button>
        <Button
          onClick={checkAnswer}
          disabled={selectedLetters.length !== currentWord?.korean.length}
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
        >
          {isArabic ? 'تحقق' : '확인'}
        </Button>
      </div>
    </div>
  );
};

export default LetterPuzzleGame;
