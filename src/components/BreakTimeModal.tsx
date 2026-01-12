import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Coffee, Heart, Sparkles, Music, Wind, Gamepad2, 
  Brain, Target, Star, Zap, Play, Pause, X,
  Timer, RefreshCw, ChevronRight, Palette
} from 'lucide-react';

interface BreakTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyDuration: number; // in minutes
}

const BreakTimeModal: React.FC<BreakTimeModalProps> = ({ isOpen, onClose, studyDuration }) => {
  const { language } = useLanguage();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [breakTimer, setBreakTimer] = useState(10 * 60); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentColor, setCurrentColor] = useState(0);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, breakTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathCount(prev => (prev + 1) % 4);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activities = [
    {
      id: 'breathing',
      icon: Wind,
      title: language === 'ar' ? 'تمارين التنفس' : '호흡 운동',
      desc: language === 'ar' ? 'استرخِ مع تمارين التنفس العميق' : '깊은 호흡으로 휴식하세요',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'music',
      icon: Music,
      title: language === 'ar' ? 'موسيقى هادئة' : '차분한 음악',
      desc: language === 'ar' ? 'استمع لموسيقى كورية هادئة' : '편안한 한국 음악을 들어보세요',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'game',
      icon: Gamepad2,
      title: language === 'ar' ? 'لعبة سريعة' : '빠른 게임',
      desc: language === 'ar' ? 'العب لعبة قصيرة ممتعة' : '짧고 재미있는 게임을 해보세요',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'stretch',
      icon: Heart,
      title: language === 'ar' ? 'تمارين إطالة' : '스트레칭',
      desc: language === 'ar' ? 'مدّد عضلاتك واسترخِ' : '근육을 풀고 휴식하세요',
      color: 'from-rose-500 to-red-500',
    },
    {
      id: 'color',
      icon: Palette,
      title: language === 'ar' ? 'تأمل الألوان' : '색상 명상',
      desc: language === 'ar' ? 'استرخِ مع تغير الألوان' : '색상 변화로 휴식하세요',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'mindfulness',
      icon: Brain,
      title: language === 'ar' ? 'تأمل قصير' : '짧은 명상',
      desc: language === 'ar' ? 'صفِّ ذهنك واسترح' : '마음을 비우고 쉬세요',
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  const renderActivity = () => {
    switch (selectedActivity) {
      case 'breathing':
        return (
          <div className="text-center py-8">
            <motion.div
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center"
              animate={{
                scale: breathCount < 2 ? [1, 1.5, 1.5, 1] : [1.5, 1, 1, 1.5],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-white text-center">
                <Wind className="w-16 h-16 mx-auto mb-2" />
                <p className="text-xl font-bold">
                  {breathCount === 0 && (language === 'ar' ? 'شهيق' : '들이쉬기')}
                  {breathCount === 1 && (language === 'ar' ? 'احتفظ' : '유지')}
                  {breathCount === 2 && (language === 'ar' ? 'زفير' : '내쉬기')}
                  {breathCount === 3 && (language === 'ar' ? 'استرخِ' : '휴식')}
                </p>
              </div>
            </motion.div>
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className="mt-6 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold"
            >
              {isBreathing ? (language === 'ar' ? 'إيقاف' : '정지') : (language === 'ar' ? 'ابدأ' : '시작')}
            </button>
          </div>
        );

      case 'color':
        return (
          <div className="text-center py-8">
            <motion.div
              className="w-64 h-64 mx-auto rounded-3xl flex items-center justify-center"
              animate={{ backgroundColor: colors[currentColor] }}
              transition={{ duration: 2 }}
            >
              <Sparkles className="w-20 h-20 text-white" />
            </motion.div>
            <button
              onClick={() => setCurrentColor((prev) => (prev + 1) % colors.length)}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
            >
              {language === 'ar' ? 'اللون التالي' : '다음 색상'}
            </button>
          </div>
        );

      case 'game':
        return (
          <div className="text-center py-8">
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
              {[...Array(9)].map((_, i) => (
                <motion.button
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white text-2xl font-bold flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    // Simple tap game
                  }}
                >
                  <motion.div
                    animate={{ 
                      opacity: Math.random() > 0.5 ? [1, 0, 1] : [0, 1, 0],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className="w-8 h-8" />
                  </motion.div>
                </motion.button>
              ))}
            </div>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'اضغط على النجوم المضيئة!' : '빛나는 별을 탭하세요!'}
            </p>
          </div>
        );

      case 'stretch':
        return (
          <div className="text-center py-8 space-y-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white"
            >
              <Heart className="w-16 h-16" />
            </motion.div>
            <div className="space-y-2">
              <p className="font-semibold text-lg">
                {language === 'ar' ? 'تمارين إطالة بسيطة:' : '간단한 스트레칭:'}
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>🙆 {language === 'ar' ? 'مدّ ذراعيك للأعلى' : '팔을 위로 뻗으세요'}</li>
                <li>🔄 {language === 'ar' ? 'دوّر رقبتك ببطء' : '목을 천천히 돌리세요'}</li>
                <li>💪 {language === 'ar' ? 'شد كتفيك للخلف' : '어깨를 뒤로 당기세요'}</li>
                <li>🧘 {language === 'ar' ? 'تنفس بعمق' : '깊게 호흡하세요'}</li>
              </ul>
            </div>
          </div>
        );

      case 'mindfulness':
        return (
          <div className="text-center py-8">
            <motion.div
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(99, 102, 241, 0.4)',
                  '0 0 0 40px rgba(99, 102, 241, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-20 h-20 text-white" />
            </motion.div>
            <div className="mt-6 space-y-4">
              <p className="text-lg font-semibold">
                {language === 'ar' ? 'أغمض عينيك...' : '눈을 감으세요...'}
              </p>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'ركّز على أنفاسك واستمع للهدوء من حولك'
                  : '호흡에 집중하고 주변의 평온함을 느끼세요'}
              </p>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="text-center py-8">
            <motion.div
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Music className="w-20 h-20 text-white" />
            </motion.div>
            <p className="mt-6 text-lg font-semibold">
              {language === 'ar' ? 'موسيقى هادئة 🎵' : '편안한 음악 🎵'}
            </p>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'استمتع بالهدوء والاسترخاء'
                : '평온함과 휴식을 즐기세요'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/95 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
              >
                <Coffee className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'وقت الراحة! ☕' : '휴식 시간! ☕'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? `لقد درست لمدة ${studyDuration} دقيقة - أحسنت!`
                    : `${studyDuration}분 동안 공부했어요 - 잘했어요!`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Timer */}
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مؤقت الراحة' : '휴식 타이머'}
                  </p>
                  <motion.p 
                    className="text-4xl font-bold font-mono"
                    key={breakTimer}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    {formatTime(breakTimer)}
                  </motion.p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-3 rounded-xl bg-primary text-primary-foreground"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setBreakTimer(10 * 60);
                    setIsTimerRunning(false);
                  }}
                  className="p-3 rounded-xl bg-muted"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Activities Selection or Activity View */}
          {selectedActivity ? (
            <div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                {language === 'ar' ? 'العودة للأنشطة' : '활동으로 돌아가기'}
              </button>
              {renderActivity()}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' ? 'اختر نشاطاً للاسترخاء:' : '휴식 활동을 선택하세요:'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activities.map((activity) => (
                  <motion.button
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity.id)}
                    className="p-4 rounded-2xl border border-border hover:border-primary/50 transition-all text-left group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center mb-3`}>
                      <activity.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-muted-foreground">{activity.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 text-center"
          >
            <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-sm italic">
              {language === 'ar'
                ? '"الراحة جزء من النجاح. استرح لتعود أقوى!" 💪'
                : '"휴식은 성공의 일부입니다. 더 강해지기 위해 쉬세요!" 💪'}
            </p>
          </motion.div>

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {language === 'ar' ? 'العودة للتعلم' : '학습으로 돌아가기'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BreakTimeModal;
