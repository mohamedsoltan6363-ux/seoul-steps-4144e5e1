import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Play, Square, RotateCcw, Volume2, Check, X,
  Star, Award, TrendingUp, AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";

interface PronunciationWord {
  korean: string;
  romanized: string;
  arabic: string;
}

interface PronunciationTrackerProps {
  words: PronunciationWord[];
  onComplete?: (avgScore: number) => void;
}

const PronunciationTracker: React.FC<PronunciationTrackerProps> = ({ 
  words,
  onComplete
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [totalScores, setTotalScores] = useState<number[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentWord = words[currentIndex] || { korean: '안녕', romanized: 'annyeong', arabic: 'مرحبا' };

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        analyzeRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setScore(null);
      setFeedback('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = () => {
    // Simulate pronunciation analysis
    // In a real app, you would send the audio to a speech recognition API
    setTimeout(() => {
      const simulatedScore = Math.floor(Math.random() * 30) + 70; // 70-100
      setScore(simulatedScore);
      setTotalScores(prev => [...prev, simulatedScore]);

      if (simulatedScore >= 90) {
        setFeedback(isRTL ? '🌟 ممتاز! نطق رائع!' : '🌟 훌륭해요! 완벽한 발음!');
      } else if (simulatedScore >= 80) {
        setFeedback(isRTL ? '👍 جيد جداً! استمر!' : '👍 아주 좋아요! 계속하세요!');
      } else if (simulatedScore >= 70) {
        setFeedback(isRTL ? '💪 جيد! حاول مرة أخرى' : '💪 좋아요! 다시 해보세요');
      } else {
        setFeedback(isRTL ? '🔄 حاول الاستماع والتكرار' : '🔄 듣고 따라해 보세요');
      }
    }, 1500);
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playCorrectPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.korean);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAudioBlob(null);
      setScore(null);
      setFeedback('');
    } else {
      const avgScore = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
      onComplete?.(avgScore);
    }
  };

  const handleRetry = () => {
    setAudioBlob(null);
    setScore(null);
    setFeedback('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const avgScore = totalScores.length > 0 
    ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
    : 0;

  if (permissionDenied) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">
          {isRTL ? 'مطلوب إذن الميكروفون' : '마이크 권한 필요'}
        </h3>
        <p className="text-muted-foreground">
          {isRTL 
            ? 'يرجى السماح بالوصول للميكروفون لاستخدام هذه الميزة'
            : '이 기능을 사용하려면 마이크 접근을 허용해주세요'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'تتبع النطق' : '발음 연습'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'سجل صوتك وقارنه' : '녹음하고 비교하세요'}
            </p>
          </div>
        </div>
        
        {totalScores.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-purple-500">{avgScore}%</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <Progress value={((currentIndex + 1) / words.length) * 100} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1}/{words.length}
        </span>
      </div>

      {/* Main Card */}
      <motion.div
        className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-3xl p-8 border border-violet-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Word Display */}
        <div className="text-center mb-8">
          <motion.p
            className="text-6xl font-bold mb-4"
            animate={{ scale: isRecording ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
          >
            {currentWord.korean}
          </motion.p>
          <p className="text-xl text-muted-foreground">{currentWord.romanized}</p>
          <p className="text-lg mt-2">{currentWord.arabic}</p>
        </div>

        {/* Listen Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={playCorrectPronunciation}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="w-5 h-5" />
            {isRTL ? 'استمع للنطق الصحيح' : '올바른 발음 듣기'}
          </motion.button>
        </div>

        {/* Recording Section */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <motion.button
              onClick={startRecording}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic className="w-8 h-8 mx-auto" />
            </motion.button>
          ) : (
            <motion.button
              onClick={stopRecording}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Square className="w-8 h-8 mx-auto" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-400"
                animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.button>
          )}

          {audioBlob && !isRecording && (
            <>
              <motion.button
                onClick={playRecording}
                className="w-14 h-14 rounded-full bg-green-500 text-white self-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Play className="w-6 h-6 mx-auto" />
              </motion.button>
              
              <motion.button
                onClick={handleRetry}
                className="w-14 h-14 rounded-full bg-muted text-muted-foreground self-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <RotateCcw className="w-6 h-6 mx-auto" />
              </motion.button>
            </>
          )}
        </div>

        {isRecording && (
          <motion.p
            className="text-center text-red-500 font-medium"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🎤 {isRTL ? 'جاري التسجيل...' : '녹음 중...'}
          </motion.p>
        )}

        {/* Score Display */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-6"
            >
              <div className="relative inline-block">
                <svg className="w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                    strokeDasharray={352}
                    initial={{ strokeDashoffset: 352 }}
                    animate={{ strokeDashoffset: 352 - (352 * score) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                </div>
              </div>
              
              <motion.p
                className="mt-4 text-lg font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {feedback}
              </motion.p>

              {score >= 80 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.8 }}
                  className="mt-4"
                >
                  <Award className="w-12 h-12 text-amber-500 mx-auto" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setShowTip(!showTip)}
          className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm"
        >
          💡 {isRTL ? 'نصائح' : '팁'}
        </button>

        {score !== null && (
          <motion.button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentIndex < words.length - 1 
              ? (isRTL ? 'التالي' : '다음')
              : (isRTL ? 'إنهاء' : '완료')}
          </motion.button>
        )}
      </div>

      {/* Tips */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4"
          >
            <h4 className="font-bold text-amber-600 mb-2">
              {isRTL ? '💡 نصائح للنطق الجيد' : '💡 좋은 발음을 위한 팁'}
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {isRTL ? 'استمع للنطق الصحيح أولاً' : '먼저 올바른 발음을 들으세요'}</li>
              <li>• {isRTL ? 'تحدث ببطء ووضوح' : '천천히 그리고 명확하게 말하세요'}</li>
              <li>• {isRTL ? 'كرر عدة مرات' : '여러 번 반복하세요'}</li>
              <li>• {isRTL ? 'انتبه للتنغيم' : '억양에 주의하세요'}</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PronunciationTracker;
