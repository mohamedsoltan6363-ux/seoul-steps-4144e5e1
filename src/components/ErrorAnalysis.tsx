import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, TrendingDown, TrendingUp, Target, Lightbulb,
  BookOpen, RotateCcw, ChevronRight, CheckCircle, XCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";

interface ErrorItem {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  category: string;
  errorCount: number;
  lastError: Date;
  correctCount: number;
}

interface ErrorAnalysisProps {
  level: number;
}

// Mock error data - in a real app, this would come from the database
const mockErrors: ErrorItem[] = [
  { id: '1', korean: '감사합니다', romanized: 'gamsahamnida', arabic: 'شكراً', category: 'greetings', errorCount: 5, lastError: new Date(), correctCount: 3 },
  { id: '2', korean: '안녕하세요', romanized: 'annyeonghaseyo', arabic: 'مرحباً', category: 'greetings', errorCount: 3, lastError: new Date(), correctCount: 7 },
  { id: '3', korean: '사랑해요', romanized: 'saranghaeyo', arabic: 'أحبك', category: 'expressions', errorCount: 4, lastError: new Date(), correctCount: 2 },
  { id: '4', korean: '맛있어요', romanized: 'masisseoyo', arabic: 'لذيذ', category: 'food', errorCount: 6, lastError: new Date(), correctCount: 4 },
  { id: '5', korean: '어디예요', romanized: 'eodiyeyo', arabic: 'أين؟', category: 'questions', errorCount: 2, lastError: new Date(), correctCount: 8 },
  { id: '6', korean: '얼마예요', romanized: 'eolmayeyo', arabic: 'كم السعر؟', category: 'shopping', errorCount: 7, lastError: new Date(), correctCount: 3 },
];

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ level }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [errors] = useState<ErrorItem[]>(mockErrors);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = [...new Set(errors.map(e => e.category))];
    return ['all', ...cats];
  }, [errors]);

  const filteredErrors = selectedCategory === 'all'
    ? errors
    : errors.filter(e => e.category === selectedCategory);

  const sortedErrors = [...filteredErrors].sort((a, b) => b.errorCount - a.errorCount);

  const totalErrors = errors.reduce((sum, e) => sum + e.errorCount, 0);
  const totalCorrect = errors.reduce((sum, e) => sum + e.correctCount, 0);
  const accuracy = totalCorrect > 0 
    ? Math.round((totalCorrect / (totalCorrect + totalErrors)) * 100) 
    : 0;

  const weakCategories = useMemo(() => {
    const catStats: Record<string, { errors: number; correct: number }> = {};
    errors.forEach(e => {
      if (!catStats[e.category]) {
        catStats[e.category] = { errors: 0, correct: 0 };
      }
      catStats[e.category].errors += e.errorCount;
      catStats[e.category].correct += e.correctCount;
    });
    
    return Object.entries(catStats)
      .map(([cat, stats]) => ({
        category: cat,
        accuracy: stats.correct / (stats.correct + stats.errors) * 100,
        errors: stats.errors,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [errors]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, { ar: string; ko: string }> = {
      all: { ar: 'الكل', ko: '전체' },
      greetings: { ar: 'التحيات', ko: '인사' },
      expressions: { ar: 'التعبيرات', ko: '표현' },
      food: { ar: 'الطعام', ko: '음식' },
      questions: { ar: 'الأسئلة', ko: '질문' },
      shopping: { ar: 'التسوق', ko: '쇼핑' },
    };
    return labels[cat]?.[isRTL ? 'ar' : 'ko'] || cat;
  };

  const getErrorLevel = (count: number) => {
    if (count >= 6) return { color: 'text-red-500', bg: 'bg-red-500/10', label: isRTL ? 'يحتاج تركيز' : '집중 필요' };
    if (count >= 4) return { color: 'text-amber-500', bg: 'bg-amber-500/10', label: isRTL ? 'متوسط' : '보통' };
    return { color: 'text-green-500', bg: 'bg-green-500/10', label: isRTL ? 'جيد' : '양호' };
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'تحليل الأخطاء' : '오류 분석'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'تتبع نقاط الضعف' : '약점 추적'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
          <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-500">{totalErrors}</p>
          <p className="text-xs text-muted-foreground">{isRTL ? 'إجمالي الأخطاء' : '총 오류'}</p>
        </div>
        <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-500">{accuracy}%</p>
          <p className="text-xs text-muted-foreground">{isRTL ? 'نسبة الصحة' : '정확도'}</p>
        </div>
        <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-500">{errors.length}</p>
          <p className="text-xs text-muted-foreground">{isRTL ? 'للمراجعة' : '복습 필요'}</p>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-500/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          {isRTL ? 'نقاط الضعف' : '약점 분야'}
        </h4>
        <div className="space-y-2">
          {weakCategories.slice(0, 3).map((cat, idx) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-red-500 text-white' : 'bg-muted'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-sm">{getCategoryLabel(cat.category)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={cat.accuracy} className="w-20 h-2" />
                <span className="text-sm font-medium">{Math.round(cat.accuracy)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-muted hover:bg-muted/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {getCategoryLabel(cat)}
          </motion.button>
        ))}
      </div>

      {/* Error Items List */}
      <div className="space-y-3">
        {sortedErrors.map((item, index) => {
          const errorLevel = getErrorLevel(item.errorCount);
          const accuracy = (item.correctCount / (item.correctCount + item.errorCount)) * 100;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl ${errorLevel.bg} border border-current/10 cursor-pointer`}
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${errorLevel.bg} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${errorLevel.color}`}>
                      {item.errorCount}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{item.korean}</p>
                    <p className="text-sm text-muted-foreground">{item.romanized}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${errorLevel.bg} ${errorLevel.color}`}>
                    {errorLevel.label}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedItem === item.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-current/10"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-background/50">
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'المعنى' : '의미'}
                      </p>
                      <p className="font-medium">{item.arabic}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-background/50">
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'نسبة الصحة' : '정확도'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={accuracy} className="flex-1 h-2" />
                        <span className="font-medium">{Math.round(accuracy)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>{item.correctCount} {isRTL ? 'صحيح' : '정답'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-4 h-4" />
                      <span>{item.errorCount} {isRTL ? 'خطأ' : '오답'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {isRTL ? 'تدريب الآن' : '지금 연습'}
                    </motion.button>
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {isRTL ? 'مراجعة' : '복습'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Practice Suggestion */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500 text-white">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">
              {isRTL ? 'تدريب مخصص' : '맞춤 연습'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'تدرب على الكلمات التي تخطئ فيها أكثر'
                : '자주 틀리는 단어를 집중 연습하세요'}
            </p>
          </div>
          <motion.button
            className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRTL ? 'ابدأ' : '시작'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorAnalysis;
