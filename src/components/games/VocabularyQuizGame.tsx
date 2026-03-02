import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Trophy, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { getAllGameContent, shuffleArray as shufflePool } from '@/components/games/gameContentPool';
import confetti from 'canvas-confetti';

interface VocabularyQuizGameProps {
  onBack: () => void;
}

interface Question {
  korean: string;
  correct: string;
  options: string[];
  type: 'korean-to-arabic' | 'arabic-to-korean';
}

const VocabularyQuizGame: React.FC<VocabularyQuizGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const generateQuestion = useCallback(() => {
    const pool = getAllGameContent();
    const type = Math.random() > 0.5 ? 'korean-to-arabic' : 'arabic-to-korean';
    const shuffled = shufflePool(pool);
    const correctWord = shuffled[0];
    
    const numOptions = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const wrongAnswers = shuffled.slice(1, numOptions);

    const options = shufflePool([
      type === 'korean-to-arabic' ? correctWord.arabic : correctWord.korean,
      ...wrongAnswers.map(w => type === 'korean-to-arabic' ? w.arabic : w.korean)
    ]);

    setQuestion({
      korean: type === 'korean-to-arabic' ? correctWord.korean : correctWord.arabic,
      correct: type === 'korean-to-arabic' ? correctWord.arabic : correctWord.korean,
      options: options as string[],
      type
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [difficulty]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const speakKorean = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question?.correct;
    setIsCorrect(correct);

    if (correct) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      setScore(score + points + (streak * 2));
      setStreak(streak + 1);
      if (question?.type === 'korean-to-arabic') {
        speakKorean(question.korean);
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (round >= 50) { // Changed from 12 to 50 rounds
        setGameComplete(true);
        if (score > 500) { // Adjusted score threshold
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setRound(round + 1);
        generateQuestion();
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
            {isArabic ? 'انتهت اللعبة! 🎉' : '게임 끝! 🎉'}
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            {isArabic ? `النتيجة: ${score} نقطة` : `점수: ${score}점`}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {isArabic ? `أعلى سلسلة: ${streak}` : `최고 연속: ${streak}`}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack}>
              {isArabic ? 'العودة' : '돌아가기'}
            </Button>
            <Button onClick={() => { setRound(1); setScore(0); setStreak(0); setGameComplete(false); generateQuestion(); }}>
              {isArabic ? 'لعب مرة أخرى' : '다시 하기'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-500/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isArabic ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 rounded-full text-orange-500 font-bold">
                <Zap className="w-4 h-4" />
                {streak}
              </span>
            )}
            <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-bold">
              {score}
            </span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty(d)}
              className={difficulty === d ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : ''}
            >
              {isArabic 
                ? d === 'easy' ? 'سهل' : d === 'medium' ? 'متوسط' : 'صعب'
                : d === 'easy' ? '쉬움' : d === 'medium' ? '보통' : '어려움'
              }
            </Button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground">{round}/12</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(round / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {question && (
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {question.type === 'korean-to-arabic' 
                    ? (isArabic ? 'ما معنى هذه الكلمة؟' : '이 단어의 뜻은?')
                    : (isArabic ? 'ما هي الكلمة الكورية؟' : '한국어로 뭐예요?')
                  }
                </p>
                <p className={`text-4xl font-bold ${question.type === 'korean-to-arabic' ? 'font-korean' : ''}`}>
                  {question.korean}
                </p>
                {question.type === 'korean-to-arabic' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakKorean(question.korean)}
                    className="mt-4 gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isArabic ? 'استمع' : '듣기'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Options */}
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === question.correct;
                
                let buttonStyle = 'border-border hover:border-primary hover:bg-primary/5';
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
                    whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${buttonStyle} ${
                      question.type === 'arabic-to-korean' ? 'font-korean text-xl' : 'text-lg'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedAnswer && isCorrectAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {selectedAnswer && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
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

export default VocabularyQuizGame;
