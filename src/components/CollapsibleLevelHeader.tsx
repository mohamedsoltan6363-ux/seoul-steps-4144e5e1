import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowLeft, BookOpen, Target, CheckCircle, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface CollapsibleLevelHeaderProps {
  levelNum: number;
  levelTitle: string;
  levelSubtitle: string;
  levelProgress: number;
  memorizedCount: number;
  totalItems: number;
  todayProgress: number;
  dailyGoal: number;
  language: string;
}

const CollapsibleLevelHeader: React.FC<CollapsibleLevelHeaderProps> = ({
  levelNum,
  levelTitle,
  levelSubtitle,
  levelProgress,
  memorizedCount,
  totalItems,
  todayProgress,
  dailyGoal,
  language
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const levelColors: Record<number, string> = {
    1: 'from-blue-500 to-indigo-600',
    2: 'from-pink-500 to-rose-600',
    3: 'from-cyan-500 to-blue-600',
    4: 'from-amber-500 to-orange-600',
    5: 'from-purple-500 to-violet-600',
    6: 'from-emerald-500 to-teal-600',
  };

  const stats = [
    { 
      icon: <Target className="w-4 h-4" />, 
      label: isRTL ? 'الهدف اليومي' : '일일 목표', 
      value: `${Math.min(todayProgress, dailyGoal)}/${dailyGoal}`,
      color: 'text-blue-500'
    },
    { 
      icon: <CheckCircle className="w-4 h-4" />, 
      label: isRTL ? 'تم الحفظ' : '암기 완료', 
      value: `${memorizedCount}/${totalItems}`,
      color: 'text-green-500'
    },
    { 
      icon: <TrendingUp className="w-4 h-4" />, 
      label: isRTL ? 'التقدم' : '진행률', 
      value: `${levelProgress}%`,
      color: 'text-purple-500'
    },
    { 
      icon: <Clock className="w-4 h-4" />, 
      label: isRTL ? 'المتبقي' : '남음', 
      value: `${totalItems - memorizedCount}`,
      color: 'text-orange-500'
    },
  ];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
      {/* Collapsed Header - Always Visible */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back button and title */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${levelColors[levelNum] || 'from-primary to-primary/60'} flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm">{levelTitle}</h1>
                <p className="text-xs text-muted-foreground">{levelSubtitle}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats & Toggle */}
          <div className="flex items-center gap-3">
            {/* Quick Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{levelProgress}%</span>
            </div>

            {/* Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mini Progress Bar - Always Visible */}
        <div className="mt-2">
          <Progress value={levelProgress} className="h-1.5" />
        </div>
      </div>

      {/* Expanded Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="px-4 py-4 bg-gradient-to-b from-muted/30 to-transparent">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={stat.color}>{stat.icon}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Full Progress Section */}
              <div className="mt-4 p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {isRTL ? 'إجمالي التقدم' : '전체 진행 상황'}
                  </span>
                  <span className="text-sm font-bold text-primary">{levelProgress}%</span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {isRTL 
                    ? `${memorizedCount} من ${totalItems} عنصر محفوظ` 
                    : `${totalItems}개 중 ${memorizedCount}개 암기 완료`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleLevelHeader;
