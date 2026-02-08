import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { vocabulary, basicSentences } from '@/data/koreanData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Volume2, RotateCcw, Trophy, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ListeningGameProps {
  onBack: () => void;
}

interface Question {
  id: string;
  korean: string;
  correct: string;
  options: string[];
}

const ListeningGame: React.FC<ListeningGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const totalQuestions = 50; // Increased from 10 to 50 questions

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestion = useCallback((): Question => {
    const allItems = [...vocabulary, ...basicSentences];
    const shuffled = shuffleArray(allItems);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4).map(item => item.arabic);
    const options = shuffleArray([correct.arabic, ...wrongOptions]);

    return {
      id: correct.id,
      korean: correct.korean,
      correct: correct.arabic,
      options,
    };
  }, []);

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const question = generateQuestion();
    setCurrentQuestion(question);
    setTimeout(() => speakKorean(question.korean), 500);
  }, [generateQuestion]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (questionIndex + 1 >= totalQuestions) {
        setGameComplete(true);
        if (score >= 7) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        const question = generateQuestion();
        setCurrentQuestion(question);
        setQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeout(() => speakKorean(question.korean), 300);
      }
    }, 1500);
  };

  const restartGame = () => {
    const question = generateQuestion();
    setCurrentQuestion(question);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameComplete(false);
    setTimeout(() => speakKorean(question.korean), 500);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {isArabic ? 'أحسنت!' : '잘했어요!'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {isArabic 
              ? `حصلت على ${score} من ${totalQuestions}` 
              : `${totalQuestions}개 중 ${score}개 정답`}
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
          <span className="text-sm font-medium">
            {questionIndex + 1}/{totalQuestions}
          </span>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Headphones className="w-6 h-6 text-primary" />
          {isArabic ? 'استمع واختر' : '듣고 선택하세요'}
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {isArabic ? 'استمع للكلمة واختر الترجمة الصحيحة' : '단어를 듣고 올바른 번역을 선택하세요'}
        </p>

        {/* Audio Button */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <button
                onClick={() => currentQuestion && speakKorean(currentQuestion.korean)}
                className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                <Volume2 className="w-10 h-10 text-primary-foreground" />
              </button>
              <p className="mt-4 text-sm text-muted-foreground">
                {isArabic ? 'انقر للاستماع' : '클릭하여 듣기'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {currentQuestion?.options.map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full justify-start text-right py-4 h-auto ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-500/20 border-green-500 text-green-600'
                        : 'bg-red-500/20 border-red-500 text-red-600'
                      : selectedAnswer !== null && option === currentQuestion?.correct
                      ? 'bg-green-500/20 border-green-500'
                      : ''
                  }`}
                >
                  <span className="flex-1">{option}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ListeningGame;
