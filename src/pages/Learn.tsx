import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/hooks/useProgress';
import { useNotifications } from '@/hooks/useNotifications';
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import { advancedVocabulary } from '@/data/level3VocabularyData';
import { dailyLifeSentences } from '@/data/level5Data';
import LetterCard from '@/components/LetterCard';
import VocabularyCard from '@/components/VocabularyCard';
import SentenceCard from '@/components/SentenceCard';
import EnhancedQuiz from '@/components/EnhancedQuiz';
import Flashcard from '@/components/Flashcard';
import WritingPractice from '@/components/WritingPractice';
import BreakTimeModal from '@/components/BreakTimeModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Ear, PenTool, GraduationCap, Layers, Lock, 
  CheckCircle, AlertCircle, Zap, Target, Trophy, Star, Sparkles,
  Lightbulb, Brain, MessageCircle, Play, Pause, RotateCcw, Volume2,
  ChevronRight, Award, Flame, Heart, Clock, TrendingUp, Bell,
  Shuffle, Filter, Grid, List, Search, Coffee
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type ViewMode = 'cards' | 'flashcards' | 'writing' | 'quiz' | 'practice' | 'challenge';
type DisplayMode = 'grid' | 'list';

const Learn: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level || '1');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { progressByLevel, markAsMemorized, unmarkAsMemorized, getLevelProgress } = useProgress();
  const { addNotification } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels'>('consonants');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [showOnlyUnmemorized, setShowOnlyUnmemorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffled, setShuffled] = useState(false);
  const [dailyGoal] = useState(10);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [studyStartTime] = useState(Date.now());
  const [studyDuration, setStudyDuration] = useState(0);

  const progress = progressByLevel[levelNum]?.progress || [];
  const levelProgress = getLevelProgress(levelNum);
  const isQuizUnlocked = levelProgress >= 100;

  const isMemorized = (id: string) => progress.some(p => p.item_id === id && p.is_memorized);
  const memorizedIds = progress.filter(p => p.is_memorized).map(p => p.item_id);
  const memorizedCount = memorizedIds.length;

  const handleToggleMemorized = async (id: string, type: string) => {
    if (isMemorized(id)) {
      await unmarkAsMemorized(levelNum, type, id);
    } else {
      await markAsMemorized(levelNum, type, id);
      setTodayProgress(prev => prev + 1);
      
      // إشعار عند حفظ عنصر
      if ((memorizedCount + 1) % 5 === 0) {
        addNotification(
          'achievement',
          language === 'ar' ? '🎉 إنجاز جديد!' : '🎉 새로운 성취!',
          language === 'ar' 
            ? `أحسنت! لقد حفظت ${memorizedCount + 1} عنصر` 
            : `잘했어요! ${memorizedCount + 1}개 항목을 암기했습니다`
        );
      }
    }
  };

  // زر اختبار الإشعارات
  const testNotification = () => {
    addNotification(
      'daily',
      language === 'ar' ? '🔔 إشعار تجريبي' : '🔔 테스트 알림',
      language === 'ar' 
        ? 'هذا إشعار تجريبي للتأكد من عمل النظام بشكل صحيح!' 
        : '시스템이 제대로 작동하는지 확인하기 위한 테스트 알림입니다!'
    );
  };

  const handleQuizComplete = async () => {
    addNotification(
      'achievement',
      language === 'ar' ? '🏆 أكملت الاختبار!' : '🏆 시험 완료!',
      language === 'ar' 
        ? 'أحسنت! لقد أكملت اختبار هذا المستوى' 
        : '잘했어요! 이 레벨의 시험을 완료했습니다'
    );
  };

  // Get items for flashcards based on level
  const flashcardItems = useMemo(() => {
    const getItems = () => {
      switch (levelNum) {
        case 1:
          return [...consonants, ...vowels].map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
            audioText: item.audioText,
          }));
        case 2:
          return vocabulary.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 3:
          return advancedVocabulary.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 4:
          return basicSentences.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 5:
          return advancedSentences.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 6:
          return dailyLifeSentences.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        default:
          return [];
      }
    };
    
    let items = getItems();
    if (shuffled) {
      items = [...items].sort(() => Math.random() - 0.5);
    }
    return items;
  }, [levelNum, shuffled]);

  // Get items for writing practice (only level 1)
  const writingItems = useMemo(() => {
    if (levelNum === 1) {
      return [...consonants, ...vowels].map(item => ({
        id: item.id,
        korean: item.korean,
        romanized: item.romanized,
        arabic: item.arabic,
        audioText: item.audioText,
      }));
    }
    return [];
  }, [levelNum]);

  const modes = [
    { key: 'cards' as ViewMode, icon: <BookOpen className="w-4 h-4" />, label: language === 'ar' ? 'البطاقات' : '카드', color: 'from-blue-500 to-cyan-500' },
    { key: 'flashcards' as ViewMode, icon: <Layers className="w-4 h-4" />, label: language === 'ar' ? 'مراجعة سريعة' : '플래시카드', color: 'from-purple-500 to-pink-500' },
    ...(levelNum === 1 ? [{ key: 'writing' as ViewMode, icon: <PenTool className="w-4 h-4" />, label: language === 'ar' ? 'تدريب الكتابة' : '쓰기 연습', color: 'from-green-500 to-emerald-500' }] : []),
    { key: 'practice' as ViewMode, icon: <Target className="w-4 h-4" />, label: language === 'ar' ? 'تدريب مركز' : '집중 연습', color: 'from-orange-500 to-amber-500' },
    { key: 'challenge' as ViewMode, icon: <Zap className="w-4 h-4" />, label: language === 'ar' ? 'تحدي السرعة' : '스피드 챌린지', color: 'from-red-500 to-rose-500' },
    { key: 'quiz' as ViewMode, icon: <GraduationCap className="w-4 h-4" />, label: language === 'ar' ? 'اختبار' : '시험', locked: !isQuizUnlocked, color: 'from-indigo-500 to-violet-500' },
  ];

  // Level info cards
  const levelInfo = {
    1: { title: language === 'ar' ? 'الحروف الكورية' : '한글', subtitle: language === 'ar' ? 'تعلم الأساسيات' : '기초 배우기', total: consonants.length + vowels.length },
    2: { title: language === 'ar' ? 'المفردات الأساسية' : '기본 어휘', subtitle: language === 'ar' ? 'كلمات يومية' : '일상 단어', total: vocabulary.length },
    3: { title: language === 'ar' ? 'المفردات المتقدمة' : '고급 어휘', subtitle: language === 'ar' ? 'توسيع المعرفة' : '지식 확장', total: advancedVocabulary.length },
    4: { title: language === 'ar' ? 'الجمل الأساسية' : '기본 문장', subtitle: language === 'ar' ? 'تكوين الجمل' : '문장 만들기', total: basicSentences.length },
    5: { title: language === 'ar' ? 'الجمل المتقدمة' : '고급 문장', subtitle: language === 'ar' ? 'محادثات معقدة' : '복잡한 대화', total: advancedSentences.length },
    6: { title: language === 'ar' ? 'الحياة اليومية' : '일상 생활', subtitle: language === 'ar' ? 'تطبيق عملي' : '실용적 적용', total: dailyLifeSentences.length },
  };

  const currentLevelInfo = levelInfo[levelNum as keyof typeof levelInfo];

  // Stats cards
  const stats = [
    { 
      icon: <Target className="w-5 h-5" />, 
      label: language === 'ar' ? 'الهدف اليومي' : '일일 목표', 
      value: `${Math.min(todayProgress, dailyGoal)}/${dailyGoal}`,
      color: 'from-blue-500 to-cyan-500',
      progress: (todayProgress / dailyGoal) * 100
    },
    { 
      icon: <CheckCircle className="w-5 h-5" />, 
      label: language === 'ar' ? 'تم الحفظ' : '암기 완료', 
      value: `${memorizedCount}/${currentLevelInfo.total}`,
      color: 'from-green-500 to-emerald-500',
      progress: levelProgress
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      label: language === 'ar' ? 'التقدم' : '진행률', 
      value: `${levelProgress}%`,
      color: 'from-purple-500 to-pink-500',
      progress: levelProgress
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      label: language === 'ar' ? 'المتبقي' : '남음', 
      value: `${currentLevelInfo.total - memorizedCount}`,
      color: 'from-orange-500 to-amber-500',
      progress: ((currentLevelInfo.total - memorizedCount) / currentLevelInfo.total) * 100
    },
  ];

  // Filter items
  const filterItems = <T extends { id: string; korean: string; arabic: string }>(items: T[]) => {
    let filtered = items;
    
    if (showOnlyUnmemorized) {
      filtered = filtered.filter(item => !isMemorized(item.id));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.korean.includes(searchQuery) || 
        item.arabic.includes(searchQuery)
      );
    }
    
    if (shuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    
    return filtered;
  };

  const renderLevel1 = () => {
    const items = activeTab === 'consonants' ? consonants : vowels;
    const filteredItems = filterItems(items);
    
    return (
      <>
        {/* Tabs for consonants/vowels */}
        <div className="flex gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('consonants')}
            className={`flex-1 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeTab === 'consonants' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">ㄱㄴㄷ</span>
              <span>{t('consonants')} ({consonants.length})</span>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('vowels')}
            className={`flex-1 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeTab === 'vowels' 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">ㅏㅓㅗ</span>
              <span>{t('vowels')} ({vowels.length})</span>
            </div>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={displayMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}
          >
            {filteredItems.map((letter, index) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <LetterCard
                  korean={letter.korean}
                  romanized={letter.romanized}
                  arabic={letter.arabic}
                  audioText={letter.audioText}
                  isMemorized={isMemorized(letter.id)}
                  onToggleMemorized={() => handleToggleMemorized(letter.id, activeTab)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </>
    );
  };

  const renderLevel2 = () => {
    const filteredItems = filterItems(vocabulary);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={displayMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}
      >
        {filteredItems.map((word, index) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <VocabularyCard
              korean={word.korean}
              romanized={word.romanized}
              arabic={word.arabic}
              category={word.category}
              isMemorized={isMemorized(word.id)}
              onToggleMemorized={() => handleToggleMemorized(word.id, 'vocabulary')}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderLevel3 = () => {
    const filteredItems = filterItems(advancedVocabulary);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={displayMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}
      >
        {filteredItems.map((word, index) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <VocabularyCard
              korean={word.korean}
              romanized={`${word.romanized} | ${word.romanizedAr}`}
              arabic={word.arabic}
              category={word.category}
              isMemorized={isMemorized(word.id)}
              onToggleMemorized={() => handleToggleMemorized(word.id, 'advancedVocab')}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderLevel4 = () => {
    const filteredItems = filterItems(basicSentences);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 max-w-2xl mx-auto"
      >
        {filteredItems.map((sentence, index) => (
          <motion.div
            key={sentence.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SentenceCard
              korean={sentence.korean}
              romanized={sentence.romanized}
              arabic={sentence.arabic}
              isMemorized={isMemorized(sentence.id)}
              onToggleMemorized={() => handleToggleMemorized(sentence.id, 'sentences')}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderLevel5 = () => {
    const filteredItems = filterItems(advancedSentences);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 max-w-2xl mx-auto"
      >
        {filteredItems.map((sentence, index) => (
          <motion.div
            key={sentence.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SentenceCard
              korean={sentence.korean}
              romanized={sentence.romanized}
              arabic={sentence.arabic}
              isMemorized={isMemorized(sentence.id)}
              onToggleMemorized={() => handleToggleMemorized(sentence.id, 'advanced')}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderLevel6 = () => {
    const filteredItems = filterItems(dailyLifeSentences);
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 max-w-2xl mx-auto"
      >
        {filteredItems.map((sentence, index) => (
          <motion.div
            key={sentence.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SentenceCard
              korean={sentence.korean}
              romanized={sentence.romanized}
              arabic={sentence.arabic}
              isMemorized={isMemorized(sentence.id)}
              onToggleMemorized={() => handleToggleMemorized(sentence.id, 'dailylife')}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const handleFlashcardMemorize = async (id: string) => {
    const type = levelNum === 1 ? (consonants.find(c => c.id === id) ? 'consonants' : 'vowels') 
      : levelNum === 2 ? 'vocabulary' 
      : levelNum === 3 ? 'advancedVocab'
      : levelNum === 4 ? 'sentences' 
      : levelNum === 5 ? 'advanced'
      : 'dailylife';
    await markAsMemorized(levelNum, type, id);
    setTodayProgress(prev => prev + 1);
  };

  const renderQuizLocked = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-12"
    >
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30"
      >
        <Lock className="w-12 h-12 text-white" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-3">
        {language === 'ar' ? 'الاختبار مقفل' : '시험 잠김'}
      </h2>
      <p className="text-muted-foreground mb-6">
        {language === 'ar' 
          ? 'يجب عليك حفظ جميع العناصر (100%) قبل فتح الاختبار' 
          : '시험을 열려면 모든 항목을 100% 암기해야 합니다'}
      </p>
      
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">
            {language === 'ar' ? 'التقدم الحالي' : '현재 진행 상황'}
          </span>
          <span className="font-bold text-primary">{levelProgress}%</span>
        </div>
        <Progress value={levelProgress} className="h-3 mb-4" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>
            {language === 'ar' 
              ? `متبقي ${100 - levelProgress}% للوصول إلى 100%` 
              : `100%까지 ${100 - levelProgress}% 남음`}
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setViewMode('cards')}
        className="mt-6 korean-button"
      >
        {language === 'ar' ? 'العودة للتعلم' : '학습으로 돌아가기'}
      </motion.button>
    </motion.div>
  );

  // Practice Mode - Focused Review
  const renderPracticeMode = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/30"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ar' ? 'تدريب مركز' : '집중 연습'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'راجع العناصر التي لم تحفظها بعد' 
            : '아직 암기하지 못한 항목을 복습하세요'}
        </p>
      </div>

      <div className="grid gap-4">
        {flashcardItems.filter(item => !memorizedIds.includes(item.id)).slice(0, 5).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-korean mb-2">{item.korean}</p>
                <p className="text-muted-foreground">{item.arabic}</p>
                <p className="text-sm text-muted-foreground/70">{item.romanized}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(item.korean);
                    utterance.lang = 'ko-KR';
                    speechSynthesis.speak(utterance);
                  }}
                  className="p-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFlashcardMemorize(item.id)}
                  className="p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-600"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setViewMode('cards')}
        className="w-full mt-6 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
      >
        {language === 'ar' ? 'العودة للبطاقات' : '카드로 돌아가기'}
      </motion.button>
    </motion.div>
  );

  // Challenge Mode - Speed Test
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeTime, setChallengeTime] = useState(30);
  const [currentChallengeItem, setCurrentChallengeItem] = useState(0);

  const renderChallengeMode = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto text-center"
    >
      {!challengeActive ? (
        <>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-500/30"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">
            {language === 'ar' ? 'تحدي السرعة' : '스피드 챌린지'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'ar' 
              ? 'أجب على أكبر عدد من الأسئلة في 30 ثانية!' 
              : '30초 안에 최대한 많은 질문에 답하세요!'}
          </p>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 mb-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">30</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'ثانية' : '초'}</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{flashcardItems.length}</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'سؤال' : '질문'}</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setChallengeActive(true);
              setChallengeScore(0);
              setChallengeTime(30);
              setCurrentChallengeItem(0);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg shadow-lg shadow-red-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              {language === 'ar' ? 'ابدأ التحدي!' : '챌린지 시작!'}
            </div>
          </motion.button>
        </>
      ) : (
        <>
          {/* Timer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Clock className="w-6 h-6 text-red-500" />
              <span className={challengeTime <= 10 ? 'text-red-500 animate-pulse' : ''}>{challengeTime}s</span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>{challengeScore}</span>
            </div>
          </div>

          {/* Question */}
          {currentChallengeItem < flashcardItems.length && (
            <motion.div
              key={currentChallengeItem}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-card to-muted border border-border mb-6"
            >
              <p className="text-5xl font-korean mb-4">{flashcardItems[currentChallengeItem].korean}</p>
              <p className="text-muted-foreground">{language === 'ar' ? 'ما معنى هذه الكلمة؟' : '이 단어의 의미는?'}</p>
            </motion.div>
          )}

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setChallengeScore(prev => prev + 1);
                setCurrentChallengeItem(prev => prev + 1);
              }}
              className="py-4 rounded-xl bg-green-500 text-white font-bold"
            >
              {language === 'ar' ? 'أعرفها ✓' : '알아요 ✓'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentChallengeItem(prev => prev + 1)}
              className="py-4 rounded-xl bg-red-500 text-white font-bold"
            >
              {language === 'ar' ? 'لا أعرفها ✗' : '몰라요 ✗'}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setChallengeActive(false)}
            className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'ar' ? 'إنهاء التحدي' : '챌린지 종료'}
          </motion.button>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <motion.button 
              whileHover={{ x: -5 }}
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{t('dashboard')}</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="text-center">
                <h1 className="font-bold text-lg">{currentLevelInfo.title}</h1>
                <p className="text-xs text-muted-foreground">{currentLevelInfo.subtitle}</p>
              </div>
              {isQuizUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Test Notification Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={testNotification}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
              title={language === 'ar' ? 'اختبار الإشعارات' : '알림 테스트'}
            >
              <Bell className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Progress bar with glow */}
          <div className="relative mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
              <span className="text-sm font-bold min-w-[3.5rem] text-right bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                {levelProgress}%
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 border border-white/10`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <div className="text-white/80">{stat.icon}</div>
                </div>
                <p className="text-xs font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/60 truncate">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {modes.map((mode, index) => (
              <motion.button
                key={mode.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !mode.locked && setViewMode(mode.key)}
                disabled={mode.locked}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  viewMode === mode.key 
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-lg` 
                    : mode.locked
                      ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {mode.locked ? <Lock className="w-4 h-4" /> : mode.icon}
                <span className="hidden sm:inline">{mode.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      {viewMode === 'cards' && (
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث...' : '검색...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted border-none text-sm focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOnlyUnmemorized(!showOnlyUnmemorized)}
                className={`p-2.5 rounded-xl transition-all ${
                  showOnlyUnmemorized 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                title={language === 'ar' ? 'إظهار غير المحفوظة فقط' : '미암기만 표시'}
              >
                <Filter className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShuffled(!shuffled)}
                className={`p-2.5 rounded-xl transition-all ${
                  shuffled 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                title={language === 'ar' ? 'خلط عشوائي' : '무작위 섞기'}
              >
                <Shuffle className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')}
                className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-all"
                title={language === 'ar' ? 'تغيير العرض' : '보기 변경'}
              >
                {displayMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'quiz' ? (
            isQuizUnlocked ? (
              <EnhancedQuiz level={levelNum} onComplete={handleQuizComplete} onBack={() => setViewMode('cards')} />
            ) : (
              renderQuizLocked()
            )
          ) : viewMode === 'flashcards' ? (
            <Flashcard 
              items={flashcardItems}
              onComplete={() => setViewMode('cards')}
              onMarkMemorized={handleFlashcardMemorize}
              memorizedIds={memorizedIds}
            />
          ) : viewMode === 'writing' && levelNum === 1 ? (
            <WritingPractice 
              items={writingItems}
              onComplete={() => setViewMode('cards')}
            />
          ) : viewMode === 'practice' ? (
            renderPracticeMode()
          ) : viewMode === 'challenge' ? (
            renderChallengeMode()
          ) : (
            <motion.div
              key={`cards-${levelNum}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {levelNum === 1 && renderLevel1()}
              {levelNum === 2 && renderLevel2()}
              {levelNum === 3 && renderLevel3()}
              {levelNum === 4 && renderLevel4()}
              {levelNum === 5 && renderLevel5()}
              {levelNum === 6 && renderLevel6()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Tips */}
        {viewMode === 'cards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-pink-500/10 border border-primary/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-1">
                  {language === 'ar' ? '💡 نصيحة اليوم' : '💡 오늘의 팁'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'استخدم زر الاستماع لتحسين نطقك! كرر الكلمات بصوت عالٍ بعد سماعها.' 
                    : '듣기 버튼을 사용하여 발음을 개선하세요! 듣고 나서 큰 소리로 따라 말해보세요.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Learn;
