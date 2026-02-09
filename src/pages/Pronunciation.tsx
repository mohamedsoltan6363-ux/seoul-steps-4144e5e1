import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Mic, MicOff, Play, Volume2, 
  CheckCircle2, XCircle, RefreshCw, Star, Heart,
  Sparkles, Trophy, ChevronRight, Loader2
} from 'lucide-react';
import WelcomeBanner from '@/components/WelcomeBanner';

interface PronunciationWord {
  korean: string;
  romanized: string;
  arabic: string;
  audio?: string;
}

const pronunciationLessons = [
  {
    title: { ar: 'التحيات الأساسية', ko: '기본 인사' },
    words: [
      { korean: '안녕하세요', romanized: 'an-nyeong-ha-se-yo', arabic: 'مرحباً' },
      { korean: '감사합니다', romanized: 'gam-sa-ham-ni-da', arabic: 'شكراً' },
      { korean: '죄송합니다', romanized: 'joe-song-ham-ni-da', arabic: 'آسف' },
      { korean: '안녕히 가세요', romanized: 'an-nyeong-hi ga-se-yo', arabic: 'مع السلامة' },
      { korean: '반갑습니다', romanized: 'ban-gab-seub-ni-da', arabic: 'يسعدني مقابلتك' },
      { korean: '안녕', romanized: 'an-nyeong', arabic: 'مرحبا (غير رسمي)' },
      { korean: '좋은 아침입니다', romanized: 'jo-eun a-chim-ip-ni-da', arabic: 'صباح الخير' },
      { korean: '잘 자요', romanized: 'jal ja-yo', arabic: 'تصبح على خير' },
    ]
  },
  {
    title: { ar: 'الأرقام (1-10)', ko: '숫자 1-10' },
    words: [
      { korean: '하나', romanized: 'ha-na', arabic: 'واحد' },
      { korean: '둘', romanized: 'dul', arabic: 'اثنان' },
      { korean: '셋', romanized: 'set', arabic: 'ثلاثة' },
      { korean: '넷', romanized: 'net', arabic: 'أربعة' },
      { korean: '다섯', romanized: 'da-seot', arabic: 'خمسة' },
      { korean: '여섯', romanized: 'yeo-seot', arabic: 'ستة' },
      { korean: '일곱', romanized: 'il-gop', arabic: 'سبعة' },
      { korean: '여덟', romanized: 'yeo-deol', arabic: 'ثمانية' },
      { korean: '아홉', romanized: 'a-hob', arabic: 'تسعة' },
      { korean: '열', romanized: 'yeol', arabic: 'عشرة' },
    ]
  },
  {
    title: { ar: 'الأرقام (11-20)', ko: '숫자 11-20' },
    words: [
      { korean: '열한', romanized: 'yeol-han', arabic: 'حادي عشر' },
      { korean: '열두', romanized: 'yeol-du', arabic: 'اثنا عشر' },
      { korean: '열셋', romanized: 'yeol-set', arabic: 'ثلاثة عشر' },
      { korean: '열넷', romanized: 'yeol-net', arabic: 'أربعة عشر' },
      { korean: '열다섯', romanized: 'yeol-da-seot', arabic: 'خمسة عشر' },
      { korean: '열여섯', romanized: 'yeol-yeo-seot', arabic: 'ستة عشر' },
      { korean: '열일곱', romanized: 'yeol-il-gop', arabic: 'سبعة عشر' },
      { korean: '열여덟', romanized: 'yeol-yeo-deol', arabic: 'ثمانية عشر' },
      { korean: '열아홉', romanized: 'yeol-a-hob', arabic: 'تسعة عشر' },
      { korean: '스무', romanized: 'seu-mu', arabic: 'عشرون' },
    ]
  },
  {
    title: { ar: 'العائلة', ko: '가족' },
    words: [
      { korean: '어머니', romanized: 'eo-meo-ni', arabic: 'أم' },
      { korean: '아버지', romanized: 'a-beo-ji', arabic: 'أب' },
      { korean: '형', romanized: 'hyeong', arabic: 'أخ أكبر' },
      { korean: '누나', romanized: 'nu-na', arabic: 'أخت أكبر' },
      { korean: '동생', romanized: 'dong-saeng', arabic: 'أخ/أخت أصغر' },
      { korean: '할머니', romanized: 'hal-meo-ni', arabic: 'جدة' },
      { korean: '할아버지', romanized: 'hal-a-beo-ji', arabic: 'جد' },
      { korean: '친구', romanized: 'chin-gu', arabic: 'صديق' },
    ]
  },
  {
    title: { ar: 'الطعام الكوري', ko: '한국 음식' },
    words: [
      { korean: '밥', romanized: 'bap', arabic: 'أرز' },
      { korean: '김치', romanized: 'gim-chi', arabic: 'كيمتشي' },
      { korean: '불고기', romanized: 'bul-go-gi', arabic: 'بولغوغي' },
      { korean: '비빔밥', romanized: 'bi-bim-bap', arabic: 'بيبيمباب' },
      { korean: '국', romanized: 'guk', arabic: 'حساء' },
      { korean: '찌개', romanized: 'jji-gae', arabic: 'يخنة' },
      { korean: '계란', romanized: 'gye-ran', arabic: 'بيض' },
      { korean: '떡', romanized: 'tteok', arabic: 'كعكة أرز' },
    ]
  },
  {
    title: { ar: 'المشروبات', ko: '음료' },
    words: [
      { korean: '물', romanized: 'mul', arabic: 'ماء' },
      { korean: '커피', romanized: 'keo-pi', arabic: 'قهوة' },
      { korean: '차', romanized: 'cha', arabic: 'شاي' },
      { korean: '우유', romanized: 'u-yu', arabic: 'حليب' },
      { korean: '주스', romanized: 'ju-seu', arabic: 'عصير' },
      { korean: '소주', romanized: 'so-ju', arabic: 'سوجو' },
      { korean: '맥주', romanized: 'maek-ju', arabic: 'بيرة' },
      { korean: '와인', romanized: 'wa-in', arabic: 'نبيذ' },
    ]
  },
  {
    title: { ar: 'الألوان', ko: '색깔' },
    words: [
      { korean: '빨강', romanized: 'bbalgab', arabic: 'أحمر' },
      { korean: '파랑', romanized: 'pa-rang', arabic: 'أزرق' },
      { korean: '노랑', romanized: 'no-rang', arabic: 'أصفر' },
      { korean: '초록', romanized: 'cho-rok', arabic: 'أخضر' },
      { korean: '검정', romanized: 'geom-jeong', arabic: 'أسود' },
      { korean: '하양', romanized: 'ha-yang', arabic: 'أبيض' },
      { korean: '회색', romanized: 'hoe-saek', arabic: 'رمادي' },
      { korean: '분홍', romanized: 'bun-hong', arabic: 'وردي' },
    ]
  },
  {
    title: { ar: 'أيام الأسبوع', ko: '요일' },
    words: [
      { korean: '월요일', romanized: 'wol-yo-il', arabic: 'الاثنين' },
      { korean: '화요일', romanized: 'hwa-yo-il', arabic: 'الثلاثاء' },
      { korean: '수요일', romanized: 'su-yo-il', arabic: 'الأربعاء' },
      { korean: '목요일', romanized: 'mok-yo-il', arabic: 'الخميس' },
      { korean: '금요일', romanized: 'geum-yo-il', arabic: 'الجمعة' },
      { korean: '토요일', romanized: 'to-yo-il', arabic: 'السبت' },
      { korean: '일요일', romanized: 'il-yo-il', arabic: 'الأحد' },
    ]
  },
  {
    title: { ar: 'أجزاء الجسم', ko: '신체 부위' },
    words: [
      { korean: '머리', romanized: 'meo-ri', arabic: 'رأس' },
      { korean: '눈', romanized: 'nun', arabic: 'عين' },
      { korean: '코', romanized: 'ko', arabic: 'أنف' },
      { korean: '입', romanized: 'ip', arabic: 'فم' },
      { korean: '귀', romanized: 'gwi', arabic: 'أذن' },
      { korean: '손', romanized: 'son', arabic: 'يد' },
      { korean: '발', romanized: 'bal', arabic: 'قدم' },
      { korean: '다리', romanized: 'da-ri', arabic: 'ساق' },
    ]
  },
  {
    title: { ar: 'الأماكن', ko: '장소' },
    words: [
      { korean: '집', romanized: 'jip', arabic: 'منزل' },
      { korean: '학교', romanized: 'hak-gyo', arabic: 'مدرسة' },
      { korean: '회사', romanized: 'hoe-sa', arabic: 'شركة' },
      { korean: '병원', romanized: 'byeong-won', arabic: 'مستشفى' },
      { korean: '은행', romanized: 'eun-haeng', arabic: 'بنك' },
      { korean: '가게', romanized: 'ga-ge', arabic: 'متجر' },
      { korean: '카페', romanized: 'ka-pe', arabic: 'مقهى' },
      { korean: '공원', romanized: 'gong-won', arabic: 'حديقة' },
    ]
  }
];

const Pronunciation: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<{ word: string; score: number }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  const currentLesson = pronunciationLessons[selectedLesson];
  const currentWord = currentLesson.words[currentWordIndex];

  const playKorean = (text: string) => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.7;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
        
        // Simulate scoring (in real app, send to AI for analysis)
        const simulatedScore = Math.floor(Math.random() * 30) + 70;
        setScore(simulatedScore);
        setAttempts(prev => [...prev, { word: currentWord.korean, score: simulatedScore }]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setScore(null);
      setRecordedAudio(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  const nextWord = () => {
    if (currentWordIndex < currentLesson.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setScore(null);
      setRecordedAudio(null);
    }
  };

  const resetPractice = () => {
    setCurrentWordIndex(0);
    setScore(null);
    setRecordedAudio(null);
    setAttempts([]);
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-emerald-500';
    if (s >= 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreEmoji = (s: number) => {
    if (s >= 90) return '🎉';
    if (s >= 70) return '👍';
    return '💪';
  };

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
            <span className="font-medium">{isRTL ? 'العودة' : '돌아가기'}</span>
          </button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            {isRTL ? 'تمارين النطق' : '발음 연습'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Welcome Banner */}
        <WelcomeBanner variant="gradient" className="mb-6" />

        {/* Lesson Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {pronunciationLessons.map((lesson, i) => (
            <button
              key={i}
              onClick={() => { setSelectedLesson(i); resetPractice(); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedLesson === i
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {isRTL ? lesson.title.ar : lesson.title.ko}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{isRTL ? 'التقدم' : '진행'}</span>
            <span>{currentWordIndex + 1} / {currentLesson.words.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentWordIndex + 1) / currentLesson.words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Practice Card */}
        <motion.div
          key={currentWord.korean}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-6 mb-6"
        >
          {/* Word Display */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.5 }}
              className="text-5xl font-korean font-bold mb-3 text-primary"
            >
              {currentWord.korean}
            </motion.div>
            <p className="text-lg text-muted-foreground mb-1">{currentWord.romanized}</p>
            <p className="text-sm text-muted-foreground">{currentWord.arabic}</p>
          </div>

          {/* Listen Button */}
          <button
            onClick={() => playKorean(currentWord.korean)}
            disabled={isPlaying}
            className="w-full mb-4 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isPlaying ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
            {isRTL ? 'استمع للنطق الصحيح' : '올바른 발음 듣기'}
          </button>

          {/* Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${
              isRecording
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6" />
                {isRTL ? 'إيقاف التسجيل' : '녹음 중지'}
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                {isRTL ? 'سجل صوتك' : '녹음 시작'}
              </>
            )}
          </button>

          {/* Recorded Audio Playback */}
          {recordedAudio && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <button
                onClick={playRecordedAudio}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <Play className="w-5 h-5" />
                {isRTL ? 'استمع لتسجيلك' : '내 녹음 듣기'}
              </button>
            </motion.div>
          )}

          {/* Score Display */}
          <AnimatePresence>
            {score !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-muted/50">
                  <span className="text-4xl mb-2">{getScoreEmoji(score)}</span>
                  <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    {score >= 90 
                      ? (isRTL ? 'ممتاز! نطقك رائع!' : '훌륭해요! 발음이 좋아요!')
                      : score >= 70
                      ? (isRTL ? 'جيد! حاول مرة أخرى' : '좋아요! 다시 해보세요')
                      : (isRTL ? 'استمر في المحاولة!' : '계속 연습하세요!')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={resetPractice}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isRTL ? 'إعادة' : '다시'}
          </button>
          <button
            onClick={nextWord}
            disabled={currentWordIndex >= currentLesson.words.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-colors"
          >
            {isRTL ? 'التالي' : '다음'}
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Attempts History */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-card border border-border rounded-2xl"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              {isRTL ? 'محاولاتك' : '연습 기록'}
            </h3>
            <div className="space-y-2">
              {attempts.slice(-5).reverse().map((attempt, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-korean">{attempt.word}</span>
                  <span className={`font-bold ${getScoreColor(attempt.score)}`}>
                    {attempt.score}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Pronunciation;
