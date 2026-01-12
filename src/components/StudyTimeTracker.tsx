import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Play, Pause, RotateCcw, Target, TrendingUp, 
  Calendar, Flame, Award, ChevronRight, Timer
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface StudySession {
  date: string;
  duration: number; // in seconds
  itemsLearned: number;
}

interface StudyTimeTrackerProps {
  onTimeUpdate?: (seconds: number) => void;
  dailyGoalMinutes?: number;
}

const StudyTimeTracker: React.FC<StudyTimeTrackerProps> = ({
  onTimeUpdate,
  dailyGoalMinutes = 30,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<StudySession[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Load saved stats
  useEffect(() => {
    const saved = localStorage.getItem('studyStats');
    if (saved) {
      const stats = JSON.parse(saved);
      setWeeklyStats(stats.weekly || []);
      
      const today = new Date().toDateString();
      const todaySession = stats.weekly?.find((s: StudySession) => s.date === today);
      if (todaySession) {
        setTodayTotal(todaySession.duration);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentSession(prev => prev + 1);
        setTodayTotal(prev => prev + 1);
        onTimeUpdate?.(currentSession + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking, currentSession, onTimeUpdate]);

  // Save stats periodically
  useEffect(() => {
    const saveStats = () => {
      const today = new Date().toDateString();
      const updated = [...weeklyStats];
      const todayIndex = updated.findIndex(s => s.date === today);
      
      if (todayIndex >= 0) {
        updated[todayIndex].duration = todayTotal;
      } else {
        updated.push({ date: today, duration: todayTotal, itemsLearned: 0 });
      }
      
      // Keep only last 7 days
      const last7Days = updated.slice(-7);
      localStorage.setItem('studyStats', JSON.stringify({ weekly: last7Days }));
      setWeeklyStats(last7Days);
    };

    if (todayTotal > 0) {
      saveStats();
    }
  }, [todayTotal, weeklyStats]);

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const dailyGoalSeconds = dailyGoalMinutes * 60;
  const dailyProgress = Math.min(100, (todayTotal / dailyGoalSeconds) * 100);
  const weeklyTotal = weeklyStats.reduce((sum, s) => sum + s.duration, 0);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = isRTL 
      ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const maxDuration = Math.max(...weeklyStats.map(s => s.duration), dailyGoalSeconds);

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger asChild>
        <motion.div
          className={`relative p-4 rounded-2xl cursor-pointer transition-all ${
            isTracking
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
              : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isTracking ? 'bg-white/20' : 'bg-blue-500/20'}`}>
                <Timer className={`w-5 h-5 ${isTracking ? 'text-white' : 'text-blue-500'}`} />
              </div>
              <div>
                <p className={`text-sm ${isTracking ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {isRTL ? 'وقت الدراسة' : '공부 시간'}
                </p>
                <p className={`text-xl font-bold font-mono ${isTracking ? 'text-white' : ''}`}>
                  {formatTime(todayTotal)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                className={`p-3 rounded-xl ${
                  isTracking 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTracking(!isTracking);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isTracking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>
              
              {currentSession > 0 && (
                <motion.button
                  className={`p-3 rounded-xl ${
                    isTracking ? 'bg-white/10' : 'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSession(0);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Progress to daily goal */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className={isTracking ? 'text-white/70' : 'text-muted-foreground'}>
                {isRTL ? 'الهدف اليومي' : '일일 목표'}
              </span>
              <span className={isTracking ? 'text-white' : 'font-medium'}>
                {Math.round(dailyProgress)}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isTracking ? 'bg-white/20' : 'bg-muted'}`}>
              <motion.div
                className={`h-full ${isTracking ? 'bg-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {dailyProgress >= 100 && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="bg-amber-400 text-amber-900 p-1 rounded-full">
                <Award className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {isRTL ? 'إحصائيات وقت الدراسة' : '공부 시간 통계'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <p className="text-3xl font-bold text-blue-500">{Math.floor(todayTotal / 60)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'دقائق اليوم' : '오늘 (분)'}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <p className="text-3xl font-bold text-green-500">{Math.floor(weeklyTotal / 60)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'هذا الأسبوع' : '이번 주 (분)'}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <p className="text-3xl font-bold text-purple-500">{weeklyStats.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'أيام نشطة' : '활성 일수'}
              </p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isRTL ? 'الأسبوع الماضي' : '지난 주'}
            </h4>
            
            <div className="flex items-end justify-between gap-2 h-32">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toDateString();
                const session = weeklyStats.find(s => s.date === dateStr);
                const duration = session?.duration || 0;
                const height = maxDuration > 0 ? (duration / maxDuration) * 100 : 0;
                const isToday = dateStr === new Date().toDateString();

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className={`w-full rounded-t-lg ${
                        isToday
                          ? 'bg-gradient-to-t from-primary to-primary/60'
                          : duration >= dailyGoalSeconds
                            ? 'bg-gradient-to-t from-green-500 to-green-400'
                            : 'bg-gradient-to-t from-muted to-muted-foreground/20'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                    <span className={`text-[10px] ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {getDayName(dateStr)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goals */}
          <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{isRTL ? 'الهدف اليومي' : '일일 목표'}</span>
              </div>
              <span className="text-sm text-muted-foreground">{dailyGoalMinutes} min</span>
            </div>
            <Progress value={dailyProgress} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {dailyProgress >= 100 
                ? (isRTL ? '🎉 أحسنت! حققت هدفك اليومي!' : '🎉 잘했어요! 오늘 목표 달성!')
                : (isRTL 
                    ? `${Math.ceil((dailyGoalSeconds - todayTotal) / 60)} دقيقة متبقية`
                    : `${Math.ceil((dailyGoalSeconds - todayTotal) / 60)}분 남음`)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyTimeTracker;
