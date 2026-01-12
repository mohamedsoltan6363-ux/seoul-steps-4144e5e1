import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, Eye, EyeOff, Volume2, Check, X, ChevronLeft, ChevronRight,
  Shuffle, RotateCcw, Sparkles, Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageWord {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  emoji: string;
  category: string;
}

interface ImageLearningProps {
  level: number;
  onComplete?: (score: number) => void;
}

// Image words with emojis as visual representations
const imageWords: ImageWord[] = [
  // Animals
  { id: 'dog', korean: '개', romanized: 'gae', arabic: 'كلب', emoji: '🐕', category: 'animals' },
  { id: 'cat', korean: '고양이', romanized: 'goyangi', arabic: 'قطة', emoji: '🐈', category: 'animals' },
  { id: 'bird', korean: '새', romanized: 'sae', arabic: 'طائر', emoji: '🐦', category: 'animals' },
  { id: 'fish', korean: '물고기', romanized: 'mulgogi', arabic: 'سمكة', emoji: '🐟', category: 'animals' },
  { id: 'rabbit', korean: '토끼', romanized: 'tokki', arabic: 'أرنب', emoji: '🐰', category: 'animals' },
  { id: 'bear', korean: '곰', romanized: 'gom', arabic: 'دب', emoji: '🐻', category: 'animals' },
  
  // Food
  { id: 'apple', korean: '사과', romanized: 'sagwa', arabic: 'تفاحة', emoji: '🍎', category: 'food' },
  { id: 'rice', korean: '밥', romanized: 'bap', arabic: 'أرز', emoji: '🍚', category: 'food' },
  { id: 'water', korean: '물', romanized: 'mul', arabic: 'ماء', emoji: '💧', category: 'food' },
  { id: 'bread', korean: '빵', romanized: 'ppang', arabic: 'خبز', emoji: '🍞', category: 'food' },
  { id: 'coffee', korean: '커피', romanized: 'keopi', arabic: 'قهوة', emoji: '☕', category: 'food' },
  { id: 'pizza', korean: '피자', romanized: 'pija', arabic: 'بيتزا', emoji: '🍕', category: 'food' },
  
  // Nature
  { id: 'sun', korean: '해', romanized: 'hae', arabic: 'شمس', emoji: '☀️', category: 'nature' },
  { id: 'moon', korean: '달', romanized: 'dal', arabic: 'قمر', emoji: '🌙', category: 'nature' },
  { id: 'star', korean: '별', romanized: 'byeol', arabic: 'نجمة', emoji: '⭐', category: 'nature' },
  { id: 'flower', korean: '꽃', romanized: 'kkot', arabic: 'زهرة', emoji: '🌸', category: 'nature' },
  { id: 'tree', korean: '나무', romanized: 'namu', arabic: 'شجرة', emoji: '🌳', category: 'nature' },
  { id: 'rain', korean: '비', romanized: 'bi', arabic: 'مطر', emoji: '🌧️', category: 'nature' },
  
  // Objects
  { id: 'book', korean: '책', romanized: 'chaek', arabic: 'كتاب', emoji: '📚', category: 'objects' },
  { id: 'phone', korean: '전화', romanized: 'jeonhwa', arabic: 'هاتف', emoji: '📱', category: 'objects' },
  { id: 'car', korean: '자동차', romanized: 'jadongcha', arabic: 'سيارة', emoji: '🚗', category: 'objects' },
  { id: 'house', korean: '집', romanized: 'jip', arabic: 'بيت', emoji: '🏠', category: 'objects' },
  { id: 'clock', korean: '시계', romanized: 'sigye', arabic: 'ساعة', emoji: '⏰', category: 'objects' },
  { id: 'bag', korean: '가방', romanized: 'gabang', arabic: 'حقيبة', emoji: '👜', category: 'objects' },
];

const ImageLearning: React.FC<ImageLearningProps> = ({ level, onComplete }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [score, setScore] = useState(0);
  const [quizOptions, setQuizOptions] = useState<ImageWord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledWords, setShuffledWords] = useState<ImageWord[]>([]);
  const [learnedCount, setLearnedCount] = useState(0);

  const categories = ['animals', 'food', 'nature', 'objects'];

  useMemo(() => {
    const shuffled = [...imageWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, []);

  const currentWord = shuffledWords[currentIndex] || imageWords[0];

  const generateQuizOptions = () => {
    const correct = currentWord;
    const others = imageWords
      .filter(w => w.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [...others, correct].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      if (mode === 'quiz') {
        setTimeout(generateQuizOptions, 100);
      }
    } else {
      onComplete?.(score);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleQuizAnswer = (wordId: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(wordId);
    const correct = wordId === currentWord.id;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
      speak(currentWord.korean);
    }
    
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleShuffle = () => {
    const shuffled = [...imageWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleLearn = () => {
    setLearnedCount(prev => prev + 1);
    speak(currentWord.korean);
  };

  const startQuiz = () => {
    setMode('quiz');
    setCurrentIndex(0);
    setScore(0);
    generateQuizOptions();
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'التعلم بالصور' : '이미지 학습'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'ربط الكلمات بالصور' : '단어와 이미지 연결'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode(mode === 'learn' ? 'quiz' : 'learn')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {mode === 'quiz' 
              ? (isRTL ? 'وضع التعلم' : '학습 모드')
              : (isRTL ? 'وضع الاختبار' : '퀴즈 모드')}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / shuffledWords.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1}/{shuffledWords.length}
        </span>
        {mode === 'quiz' && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500">
            <Star className="w-4 h-4" />
            <span className="font-bold">{score}</span>
          </div>
        )}
      </div>

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
          className="relative"
        >
          {mode === 'learn' ? (
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-3xl p-8 border border-pink-500/20">
              {/* Emoji Display */}
              <motion.div
                className="text-center mb-8"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-9xl">{currentWord.emoji}</span>
              </motion.div>

              {/* Word Info */}
              <div className="text-center space-y-4">
                <AnimatePresence>
                  {showAnswer ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      <p className="text-5xl font-bold">{currentWord.korean}</p>
                      <p className="text-xl text-muted-foreground">{currentWord.romanized}</p>
                      <p className="text-2xl">{currentWord.arabic}</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-sm">
                        {currentWord.category}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl text-muted-foreground"
                    >
                      {isRTL ? 'ما هذا؟' : '이것은 무엇일까요?'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  {showAnswer 
                    ? (isRTL ? 'إخفاء' : '숨기기')
                    : (isRTL ? 'إظهار الإجابة' : '정답 보기')}
                </motion.button>
                
                {showAnswer && (
                  <motion.button
                    onClick={() => speak(currentWord.korean)}
                    className="p-3 rounded-2xl bg-blue-500 text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Volume2 className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Mode */
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-2">
                  {isRTL ? 'ما هذه الصورة بالكورية؟' : '이 이미지는 한국어로?'}
                </p>
                <motion.span
                  className="text-8xl block"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {currentWord.emoji}
                </motion.span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quizOptions.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrectAnswer = option.id === currentWord.id;
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleQuizAnswer(option.id)}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        isSelected
                          ? isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : selectedAnswer && isCorrectAnswer
                            ? 'bg-green-500/20 border-2 border-green-500'
                            : 'bg-muted hover:bg-muted/80'
                      }`}
                      whileHover={!selectedAnswer ? { scale: 1.02 } : undefined}
                      whileTap={!selectedAnswer ? { scale: 0.98 } : undefined}
                      disabled={!!selectedAnswer}
                    >
                      <p className="text-2xl font-bold">{option.korean}</p>
                      <p className="text-sm text-muted-foreground mt-1">{option.romanized}</p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          {isCorrectAnswer ? (
                            <Check className="w-6 h-6 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 mx-auto" />
                          )}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-50 transition-all"
          whileHover={{ x: isRTL ? 5 : -5 }}
        >
          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {isRTL ? 'التالي' : '이전'}
        </motion.button>

        <div className="flex items-center gap-2">
          {mode === 'learn' && (
            <motion.button
              onClick={handleLearn}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              {isRTL ? 'تم التعلم' : '학습 완료'}
            </motion.button>
          )}
        </div>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === shuffledWords.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white disabled:opacity-50 transition-all"
          whileHover={{ x: isRTL ? -5 : 5 }}
        >
          {isRTL ? 'السابق' : '다음'}
          {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
};

export default ImageLearning;
