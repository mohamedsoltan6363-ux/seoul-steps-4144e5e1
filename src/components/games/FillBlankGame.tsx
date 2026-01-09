import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Trophy, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FillBlankGameProps {
  onBack: () => void;
}

interface Question {
  sentence: string;
  blank: string;
  arabic: string;
  options: string[];
  correct: string;
}

const questions: Question[] = [
  { sentence: '저는 ___이에요', blank: '학생', arabic: 'أنا طالب', options: ['학생', '선생님', '의사', '가수'], correct: '학생' },
  { sentence: '오늘 ___가 좋아요', blank: '날씨', arabic: 'الطقس جميل اليوم', options: ['날씨', '음식', '친구', '책'], correct: '날씨' },
  { sentence: '저는 ___를 좋아해요', blank: '한국', arabic: 'أنا أحب كوريا', options: ['한국', '미국', '일본', '중국'], correct: '한국' },
  { sentence: '물 ___', blank: '주세요', arabic: 'أعطني ماء من فضلك', options: ['주세요', '싫어요', '없어요', '있어요'], correct: '주세요' },
  { sentence: '___합니다', blank: '감사', arabic: 'شكراً لك', options: ['감사', '죄송', '실례', '안녕'], correct: '감사' },
  { sentence: '이것은 ___이에요', blank: '사과', arabic: 'هذه تفاحة', options: ['사과', '바나나', '포도', '수박'], correct: '사과' },
  { sentence: '___에 가요', blank: '학교', arabic: 'أذهب إلى المدرسة', options: ['학교', '집', '회사', '병원'], correct: '학교' },
  { sentence: '저는 ___를 공부해요', blank: '한국어', arabic: 'أدرس اللغة الكورية', options: ['한국어', '영어', '일본어', '중국어'], correct: '한국어' },
  { sentence: '___이 뭐예요?', blank: '이름', arabic: 'ما اسمك؟', options: ['이름', '나이', '직업', '취미'], correct: '이름' },
  { sentence: '배가 ___', blank: '고파요', arabic: 'أنا جائع', options: ['고파요', '아파요', '불러요', '커요'], correct: '고파요' },
  { sentence: '많이 ___', blank: '드세요', arabic: 'كل كثيراً (تفضل)', options: ['드세요', '가세요', '오세요', '하세요'], correct: '드세요' },
  { sentence: '___가 얼마예요?', blank: '이것', arabic: 'كم سعر هذا؟', options: ['이것', '저것', '그것', '뭐'], correct: '이것' },
];

const FillBlankGame: React.FC<FillBlankGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateRound = useCallback(() => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion({
      ...randomQuestion,
      options: shuffleArray([...randomQuestion.options])
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
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

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correct;
    setIsCorrect(correct);

    if (correct) {
      const points = showHint ? 5 : 10;
      setScore(score + points);
      speakKorean(currentQuestion!.sentence.replace('___', currentQuestion!.correct));
    }

    setTimeout(() => {
      if (round >= 10) {
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
            {isArabic ? 'ممتاز! 🎉' : '훌륭해요! 🎉'}
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-teal-500/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isArabic ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{round}/10</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-bold">
              {score}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(round / 10) * 100}%` }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          {isArabic ? 'أكمل الفراغ' : '빈칸 채우기'}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {isArabic ? 'اختر الكلمة الصحيحة' : '올바른 단어를 선택하세요'}
        </p>

        {/* Question */}
        {currentQuestion && (
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20">
              <CardContent className="p-6 text-center">
                <p className="font-korean text-3xl font-bold mb-4">
                  {currentQuestion.sentence.replace('___', '____')}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakKorean(currentQuestion.sentence.replace('___', currentQuestion.correct))}
                    className="gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isArabic ? 'استمع' : '듣기'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {isArabic ? 'تلميح' : '힌트'}
                  </Button>
                </div>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-muted-foreground"
                  >
                    {currentQuestion.arabic}
                  </motion.p>
                )}
              </CardContent>
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correct;
                
                let buttonStyle = 'border-border hover:border-teal-500 hover:bg-teal-500/5';
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
                    whileHover={{ scale: selectedAnswer ? 1 : 1.03 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.97 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl border-2 font-korean text-xl transition-all ${buttonStyle}`}
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

export default FillBlankGame;
