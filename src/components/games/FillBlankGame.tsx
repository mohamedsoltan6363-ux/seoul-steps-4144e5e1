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
  // Additional questions (المزيد من الأسئلة)
  { sentence: '___를 좋아해요', blank: '영화', arabic: 'أحب الأفلام', options: ['영화', '책', '음악', '그림'], correct: '영화' },
  { sentence: '지금 ___예요', blank: '몇시', arabic: 'كم الساعة الآن؟', options: ['몇시', '어디', '뭐', '누가'], correct: '몇시' },
  { sentence: '___는 어디에 있어요?', blank: '화장실', arabic: 'أين الحمام؟', options: ['화장실', '주방', '침실', '거실'], correct: '화장실' },
  { sentence: '저는 ___에서 와요', blank: '이집트', arabic: 'أنا من مصر', options: ['이집트', '한국', '미국', '프랑스'], correct: '이집트' },
  { sentence: '___는 맛있어요', blank: '김치', arabic: 'الكيمتشي لذيذ', options: ['김치', '피자', '버거', '초밥'], correct: '김치' },
  { sentence: '매일 ___를 해요', blank: '운동', arabic: 'أتمرن كل يوم', options: ['운동', '공부', '일', '쉬기'], correct: '운동' },
  { sentence: '___는 친구예요', blank: '그사람', arabic: 'هذا الشخص صديقي', options: ['그사람', '내가', '우리', '저'], correct: '그사람' },
  { sentence: '세계에서 가장 ___', blank: '아름답다', arabic: 'الأجمل في العالم', options: ['아름답다', '크다', '멀다', '비싸다'], correct: '아름답다' },
  { sentence: '___을 입었어요', blank: '옷', arabic: 'ارتديت ملابس', options: ['옷', '신발', '모자', '시계'], correct: '옷' },
  { sentence: '___를 배우고 싶어요', blank: '춤', arabic: 'أريد تعلم الرقص', options: ['춤', '노래', '악기', '그리기'], correct: '춤' },
  { sentence: '___가 그려져 있어요', blank: '꽃', arabic: 'هناك زهور مرسومة', options: ['꽃', '나무', '별', '구름'], correct: '꽃' },
  { sentence: '___도록 열심히 공부할게요', blank: '열심히', arabic: 'سأدرس بجد', options: ['열심히', '천천히', '빠르게', '조용히'], correct: '열심히' },
  { sentence: '___이 없어요', blank: '돈', arabic: 'ليس لدي مال', options: ['돈', '시간', '음식', '물'], correct: '돈' },
  { sentence: '___에 놀러 가요', blank: '공원', arabic: 'أذهب للعب في الحديقة', options: ['공원', '도서관', '병원', '학교'], correct: '공원' },
  { sentence: '한국 ___를 좋아해요', blank: '문화', arabic: 'أحب الثقافة الكورية', options: ['문화', '날씨', '음악', '사람'], correct: '문화' },
  { sentence: '___까지 기다려 주세요', blank: '내일', arabic: 'انتظر حتى غداً من فضلك', options: ['내일', '오늘', '어제', '다음주'], correct: '내일' },
  { sentence: '저는 ___과 함께 가요', blank: '친구', arabic: 'أذهب مع الصديق', options: ['친구', '가족', '선생님', '형'], correct: '친구' },
  { sentence: '___는 좋은 음식이에요', blank: '밥', arabic: 'الأرز طعام جيد', options: ['밥', '면', '빵', '과자'], correct: '밥' },
  { sentence: '___를 읽으면 행복해요', blank: '책', arabic: 'أشعر بالسعادة عند قراءة الكتب', options: ['책', '신문', '잡지', '편지'], correct: '책' },
  { sentence: '한국 ___을 봤어요', blank: '드라마', arabic: 'شاهدت مسلسل كوري', options: ['드라마', '영화', '뮤직비디오', '쇼'], correct: '드라마' },
  { sentence: '___가 매워요', blank: '음식', arabic: 'الطعام حار جداً', options: ['음식', '차', '주스', '과자'], correct: '음식' },
  { sentence: '___를 만들고 싶어요', blank: '요리', arabic: 'أريد طهي شيء ما', options: ['요리', '옷', '집', '그림'], correct: '요리' },
  { sentence: '___가 중요해요', blank: '공부', arabic: 'الدراسة مهمة', options: ['공부', '게임', '수면', '음식'], correct: '공부' },
  { sentence: '___를 탈 수 있어요', blank: '자동차', arabic: 'يمكنني قيادة السيارة', options: ['자동차', '자전거', '오토바이', '버스'], correct: '자동차' },
  { sentence: '___는 아침이에요', blank: '지금', arabic: 'الآن صباح', options: ['지금', '어제', '내일', '어제'], correct: '지금' },
  { sentence: '___가 많았어요', blank: '일', arabic: 'كان لدي الكثير من العمل', options: ['일', '시간', '돈', '사람'], correct: '일' },
  { sentence: '___와 함께 여행을 가고 싶어요', blank: '가족', arabic: 'أريد السفر مع العائلة', options: ['가족', '친구', '선생님', '이웃'], correct: '가족' },
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
