import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, TrendingDown, TrendingUp, Target, Lightbulb,
  BookOpen, RotateCcw, ChevronRight, CheckCircle, XCircle, Volume2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import { advancedVocabulary } from '@/data/level3VocabularyData';
import { dailyLifeSentences } from '@/data/level5Data';

interface ErrorItem {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  category: string;
  errorCount: number;
  correctCount: number;
}

interface ErrorAnalysisProps {
  level: number;
}

const ERROR_STORAGE_KEY = 'error_analysis_data';

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ level }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Load real error data from localStorage (tracked during quizzes/practice)
  const [errorData, setErrorData] = useState<Record<string, { errors: number; correct: number }>>(() => {
    const saved = localStorage.getItem(ERROR_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {};
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);

  // Get level-specific items
  const levelItems = useMemo(() => {
    switch (level) {
      case 1: return [...consonants, ...vowels].map(i => ({ ...i, category: 'letters' }));
      case 2: return vocabulary.map(i => ({ ...i, category: i.category || 'vocabulary' }));
      case 3: return advancedVocabulary.map(i => ({ ...i, category: i.category || 'advanced' }));
      case 4: return basicSentences.map(i => ({ ...i, category: 'sentences' }));
      case 5: return advancedSentences.map(i => ({ ...i, category: 'advanced_sentences' }));
      case 6: return dailyLifeSentences.map(i => ({ ...i, category: 'daily' }));
      default: return [];
    }
  }, [level]);

  // Build error items from real data
  const errors: ErrorItem[] = useMemo(() => {
    return levelItems
      .map(item => {
        const data = errorData[item.id] || { errors: 0, correct: 0 };
        return {
          id: item.id,
          korean: item.korean,
          romanized: item.romanized,
          arabic: item.arabic,
          category: item.category,
          errorCount: data.errors,
          correctCount: data.correct,
        };
      })
      .filter(item => item.errorCount > 0 || item.correctCount > 0)
      .sort((a, b) => b.errorCount - a.errorCount);
  }, [levelItems, errorData]);

  // If no data yet, show items that haven't been practiced
  const unpracticedItems = levelItems.filter(item => !errorData[item.id]);

  const categories = useMemo(() => {
    const cats = [...new Set(errors.map(e => e.category))];
    return ['all', ...cats];
  }, [errors]);

  const filteredErrors = selectedCategory === 'all' ? errors : errors.filter(e => e.category === selectedCategory);
  const totalErrors = errors.reduce((sum, e) => sum + e.errorCount, 0);
  const totalCorrect = errors.reduce((sum, e) => sum + e.correctCount, 0);
  const accuracy = totalCorrect + totalErrors > 0 ? Math.round((totalCorrect / (totalCorrect + totalErrors)) * 100) : 0;

  const weakCategories = useMemo(() => {
    const catStats: Record<string, { errors: number; correct: number }> = {};
    errors.forEach(e => {
      if (!catStats[e.category]) catStats[e.category] = { errors: 0, correct: 0 };
      catStats[e.category].errors += e.errorCount;
      catStats[e.category].correct += e.correctCount;
    });
    return Object.entries(catStats)
      .map(([cat, stats]) => ({
        category: cat,
        accuracy: stats.correct + stats.errors > 0 ? (stats.correct / (stats.correct + stats.errors)) * 100 : 0,
        errors: stats.errors,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [errors]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, { ar: string; ko: string }> = {
      all: { ar: 'الكل', ko: '전체' },
      letters: { ar: 'الحروف', ko: '글자' },
      vocabulary: { ar: 'المفردات', ko: '어휘' },
      advanced: { ar: 'متقدم', ko: '고급' },
      sentences: { ar: 'الجمل', ko: '문장' },
      advanced_sentences: { ar: 'جمل متقدمة', ko: '고급 문장' },
      daily: { ar: 'يومي', ko: '일상' },
      greetings: { ar: 'التحيات', ko: '인사' },
      food: { ar: 'الطعام', ko: '음식' },
      numbers: { ar: 'الأرقام', ko: '숫자' },
      family: { ar: 'العائلة', ko: '가족' },
    };
    return labels[cat]?.[isRTL ? 'ar' : 'ko'] || cat;
  };

  const getErrorLevel = (count: number) => {
    if (count >= 6) return { color: 'text-red-500', bg: 'bg-red-500/10', label: isRTL ? 'يحتاج تركيز' : '집중 필요' };
    if (count >= 4) return { color: 'text-amber-500', bg: 'bg-amber-500/10', label: isRTL ? 'متوسط' : '보통' };
    return { color: 'text-green-500', bg: 'bg-green-500/10', label: isRTL ? 'جيد' : '양호' };
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Simulate a practice session recording
  const recordPracticeResult = (itemId: string, correct: boolean) => {
    const updated = { ...errorData };
    if (!updated[itemId]) updated[itemId] = { errors: 0, correct: 0 };
    if (correct) updated[itemId].correct += 1;
    else updated[itemId].errors += 1;
    setErrorData(updated);
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(updated));
  };

  // Practice mode for weak items
  const weakItems = errors.filter(e => e.errorCount >= 2).slice(0, 10);
  const currentPracticeItem = weakItems[practiceIndex];

  if (practiceMode && currentPracticeItem) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{isRTL ? '🎯 تدريب مخصص' : '🎯 맞춤 연습'}</h3>
          <motion.button
            onClick={() => setPracticeMode(false)}
            className="px-4 py-2 rounded-xl bg-muted text-sm"
            whileTap={{ scale: 0.95 }}
          >
            {isRTL ? 'رجوع' : '돌아가기'}
          </motion.button>
        </div>

        <Progress value={((practiceIndex + 1) / weakItems.length) * 100} className="h-2" />

        <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <p className="text-6xl font-bold mb-4">{currentPracticeItem.korean}</p>
          <p className="text-xl text-muted-foreground mb-2">{currentPracticeItem.romanized}</p>
          <p className="text-lg">{currentPracticeItem.arabic}</p>
          
          <motion.button
            onClick={() => speak(currentPracticeItem.korean)}
            className="mt-4 p-3 rounded-full bg-blue-500 text-white mx-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={() => {
              recordPracticeResult(currentPracticeItem.id, false);
              if (practiceIndex < weakItems.length - 1) setPracticeIndex(prev => prev + 1);
              else setPracticeMode(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium"
            whileTap={{ scale: 0.95 }}
          >
            <XCircle className="w-5 h-5" />
            {isRTL ? 'صعب' : '어려움'}
          </motion.button>
          <motion.button
            onClick={() => {
              recordPracticeResult(currentPracticeItem.id, true);
              if (practiceIndex < weakItems.length - 1) setPracticeIndex(prev => prev + 1);
              else setPracticeMode(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-500 font-medium"
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-5 h-5" />
            {isRTL ? 'سهل' : '쉬움'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'تحليل الأخطاء' : '오류 분석'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? `المستوى ${level} - تتبع نقاط الضعف` : `레벨 ${level} - 약점 추적`}
            </p>
          </div>
        </div>
      </div>

      {errors.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">
            {isRTL ? 'لا توجد بيانات بعد' : '아직 데이터 없음'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {isRTL 
              ? 'ابدأ بالتدريب والاختبارات لتتبع أداءك وتحليل أخطائك'
              : '연습과 퀴즈를 시작하여 성과를 추적하고 오류를 분석하세요'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isRTL ? `${unpracticedItems.length} عنصر لم يتم تدريبه بعد` : `${unpracticedItems.length}개 항목 미연습`}
          </p>
        </div>
      ) : (
        <>
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
          {weakCategories.length > 0 && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-500/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {isRTL ? 'نقاط الضعف' : '약점 분야'}
              </h4>
              <div className="space-y-2">
                {weakCategories.slice(0, 3).map((cat, idx) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-red-500 text-white' : 'bg-muted'}`}>
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
          )}

          {/* Category Filter */}
          {categories.length > 2 && (
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
          )}

          {/* Error Items */}
          <div className="space-y-3">
            {filteredErrors.slice(0, 20).map((item, index) => {
              const errorLevel = getErrorLevel(item.errorCount);
              const itemAccuracy = item.correctCount + item.errorCount > 0
                ? (item.correctCount / (item.correctCount + item.errorCount)) * 100 : 0;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-4 rounded-2xl ${errorLevel.bg} border border-current/10 cursor-pointer`}
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${errorLevel.bg} flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${errorLevel.color}`}>{item.errorCount}</span>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{item.korean}</p>
                        <p className="text-sm text-muted-foreground">{item.romanized}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${errorLevel.bg} ${errorLevel.color}`}>{errorLevel.label}</span>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedItem === item.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-current/10"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-background/50">
                          <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المعنى' : '의미'}</p>
                          <p className="font-medium">{item.arabic}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-background/50">
                          <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'نسبة الصحة' : '정확도'}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={itemAccuracy} className="flex-1 h-2" />
                            <span className="font-medium">{Math.round(itemAccuracy)}%</span>
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
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); speak(item.korean); }}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Volume2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Practice Suggestion */}
          {weakItems.length > 0 && (
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
                  <h4 className="font-semibold">{isRTL ? 'تدريب مخصص' : '맞춤 연습'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? `${weakItems.length} عناصر تحتاج تدريب` : `${weakItems.length}개 항목 연습 필요`}
                  </p>
                </div>
                <motion.button
                  onClick={() => { setPracticeMode(true); setPracticeIndex(0); }}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRTL ? 'ابدأ' : '시작'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ErrorAnalysis;
