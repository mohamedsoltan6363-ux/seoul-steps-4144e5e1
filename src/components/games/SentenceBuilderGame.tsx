import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Check, Volume2, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SentenceBuilderGameProps {
  onBack: () => void;
}

interface Sentence {
  id: string;
  korean: string;
  arabic: string;
  words: string[];
}

const sentences: Sentence[] = [
  { id: '1', korean: '안녕하세요', arabic: 'مرحباً', words: ['안녕', '하', '세요'] },
  { id: '2', korean: '감사합니다', arabic: 'شكراً لك', words: ['감사', '합', '니다'] },
  { id: '3', korean: '저는 학생이에요', arabic: 'أنا طالب', words: ['저는', '학생', '이에요'] },
  { id: '4', korean: '물 주세요', arabic: 'أعطني ماء من فضلك', words: ['물', '주', '세요'] },
  { id: '5', korean: '맛있어요', arabic: 'إنه لذيذ', words: ['맛', '있', '어요'] },
  { id: '6', korean: '사랑해요', arabic: 'أحبك', words: ['사랑', '해', '요'] },
  { id: '7', korean: '한국어를 공부해요', arabic: 'أدرس الكورية', words: ['한국어를', '공부', '해요'] },
  { id: '8', korean: '오늘 날씨가 좋아요', arabic: 'الطقس جميل اليوم', words: ['오늘', '날씨가', '좋아요'] },
  { id: '9', korean: '배고파요', arabic: 'أنا جائع', words: ['배', '고파', '요'] },
  { id: '10', korean: '집에 가요', arabic: 'أذهب للمنزل', words: ['집에', '가', '요'] },
  { id: '11', korean: '한국에 가고 싶어요', arabic: 'أريد الذهاب إلى كوريا', words: ['한국에', '가고', '싶어요'] },
  { id: '12', korean: '한국 음식을 좋아해요', arabic: 'أحب الطعام الكوري', words: ['한국', '음식을', '좋아해요'] },
  { id: '13', korean: '영화를 보았어요', arabic: 'شاهدت فيلم', words: ['영화를', '보았어요'] },
  { id: '14', korean: '친구와 만났어요', arabic: 'التقيت بصديق', words: ['친구와', '만났어요'] },
  { id: '15', korean: '책을 읽고 있어요', arabic: 'أقرأ كتاب', words: ['책을', '읽고', '있어요'] },
  { id: '16', korean: '지금은 바빠요', arabic: 'أنا مشغول الآن', words: ['지금은', '바빠요'] },
  { id: '17', korean: '내일 뭐 할 거야?', arabic: 'ماذا ستفعل غداً؟', words: ['내일', '뭐', '할', '거야'] },
  { id: '18', korean: '도움이 필요해요', arabic: 'أحتاج مساعدة', words: ['도움이', '필요해요'] },
  { id: '19', korean: '시간이 없어요', arabic: 'ليس لدي وقت', words: ['시간이', '없어요'] },
  { id: '20', korean: '다시 만나요', arabic: 'نلتقي مرة أخرى', words: ['다시', '만나요'] },
  { id: '21', korean: '계획을 짰어요', arabic: 'عملت خطة', words: ['계획을', '짰어요'] },
  { id: '22', korean: '일이 많았어요', arabic: 'كان لدي الكثير من العمل', words: ['일이', '많았어요'] },
  { id: '23', korean: '휴가를 가요', arabic: 'أأخذ إجازة', words: ['휴가를', '가요'] },
  { id: '24', korean: '파티에 간다', arabic: 'سأذهب إلى حفلة', words: ['파티에', '간다'] },
  { id: '25', korean: '선물을 받았어요', arabic: 'تلقيت هدية', words: ['선물을', '받았어요'] },
  { id: '26', korean: '사진을 찍었어요', arabic: 'التقطت صورة', words: ['사진을', '찍었어요'] },
  { id: '27', korean: '음악을 들어요', arabic: 'أستمع إلى الموسيقى', words: ['음악을', '들어요'] },
  { id: '28', korean: '운동을 하고 싶어요', arabic: 'أريد ممارسة الرياضة', words: ['운동을', '하고', '싶어요'] },
  { id: '29', korean: '옷을 샀어요', arabic: 'اشتريت ملابس', words: ['옷을', '샀어요'] },
  { id: '30', korean: '날씨가 추워요', arabic: 'الجو بارد', words: ['날씨가', '추워요'] },
];

const SentenceBuilderGame: React.FC<SentenceBuilderGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
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
    const availableSentences = sentences.filter(s => s.words.length >= 3);
    const randomSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
    setCurrentSentence(randomSentence);
    setShuffledWords(shuffleArray([...randomSentence.words]));
    setSelectedWords([]);
    setUsedIndices([]);
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

  const handleWordClick = (word: string, index: number) => {
    if (usedIndices.includes(index)) return;
    setSelectedWords([...selectedWords, word]);
    setUsedIndices([...usedIndices, index]);
  };

  const handleRemoveWord = (index: number) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    
    const originalIndex = usedIndices[index];
    const newUsed = [...usedIndices];
    newUsed.splice(index, 1);
    setUsedIndices(newUsed);
  };

  const checkAnswer = () => {
    if (!currentSentence) return;
    
    const isAnswerCorrect = selectedWords.join('') === currentSentence.words.join('');
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 15);
      speakKorean(currentSentence.korean);
      
      setTimeout(() => {
        if (round >= totalRounds) {
          setGameComplete(true);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          setRound(round + 1);
          generateRound();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setSelectedWords([]);
        setUsedIndices([]);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const resetSelection = () => {
    setSelectedWords([]);
    setUsedIndices([]);
    setIsCorrect(null);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-500/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isArabic ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {round}/{totalRounds}
            </span>
            <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-bold">
              {score}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(round / totalRounds) * 100}%` }}
          />
        </div>

        {/* Game Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          {isArabic ? 'بناء الجمل' : '문장 만들기'}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {isArabic ? 'رتب الكلمات لتكوين الجملة الصحيحة' : '올바른 문장을 만들기 위해 단어를 배열하세요'}
        </p>

        {currentSentence && (
          <>
            {/* Hint Card */}
            <Card className="mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-semibold">{currentSentence.arabic}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakKorean(currentSentence.korean)}
                  className="mt-2 gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {isArabic ? 'استمع' : '듣기'}
                </Button>
              </CardContent>
            </Card>

            {/* Answer Area */}
            <Card className={`mb-6 min-h-[80px] transition-colors ${
              isCorrect === true ? 'border-emerald-500 bg-emerald-500/10' :
              isCorrect === false ? 'border-destructive bg-destructive/10' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
                  <AnimatePresence>
                    {selectedWords.map((word, index) => (
                      <motion.button
                        key={`selected-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => handleRemoveWord(index)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-korean text-lg hover:bg-primary/80"
                      >
                        {word}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {selectedWords.length === 0 && (
                    <p className="text-muted-foreground">
                      {isArabic ? 'اضغط على الكلمات لترتيبها' : '단어를 클릭하여 배열하세요'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Words */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {shuffledWords.map((word, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word, index)}
                  disabled={usedIndices.includes(index)}
                  className={`px-6 py-3 rounded-xl font-korean text-xl border-2 transition-all ${
                    usedIndices.includes(index)
                      ? 'opacity-30 cursor-not-allowed border-muted'
                      : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                  }`}
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={resetSelection}
                disabled={selectedWords.length === 0}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {isArabic ? 'إعادة' : '다시'}
              </Button>
              <Button
                onClick={checkAnswer}
                disabled={selectedWords.length !== currentSentence.words.length}
                className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500"
              >
                <Check className="w-4 h-4" />
                {isArabic ? 'تحقق' : '확인'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilderGame;
