import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/hooks/useProgress';
import { useNotifications } from '@/hooks/useNotifications';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import { advancedVocabulary } from '@/data/level3VocabularyData';
import { dailyLifeSentences } from '@/data/level5Data';
import { grammarPatterns, level5AdditionalSentences, level6ExtraSentences } from '@/data/level4GrammarData';

// Combined extended datasets for levels 4-6
const level4Combined = [
  ...basicSentences,
  ...grammarPatterns.map(g => ({
    id: g.id,
    korean: g.korean,
    romanized: g.romanized,
    arabic: `${g.arabic} — ${g.example} (${g.exampleAr})`,
  })),
];
const level5Combined = [...advancedSentences, ...level5AdditionalSentences];
const level6Combined = [...dailyLifeSentences, ...level6ExtraSentences];
import LetterCard from '@/components/LetterCard';
import VocabularyCard from '@/components/VocabularyCard';
import SentenceCard from '@/components/SentenceCard';
import EnhancedQuiz from '@/components/EnhancedQuiz';
import Flashcard from '@/components/Flashcard';
import WritingPractice from '@/components/WritingPractice';
import BreakTimeModal from '@/components/BreakTimeModal';
import DailyRewardsSystem from '@/components/DailyRewardsSystem';
import NightModeToggle from '@/components/NightModeToggle';
import StudyTimeTracker from '@/components/StudyTimeTracker';
import ImageLearning from '@/components/ImageLearning';
import PronunciationTracker from '@/components/PronunciationTracker';
import VideoLearning from '@/components/VideoLearning';
import StudyGroups from '@/components/StudyGroups';
import ErrorAnalysis from '@/components/ErrorAnalysis';
import SentenceLibrary from '@/components/SentenceLibrary';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Ear, PenTool, GraduationCap, Layers, Lock, 
  CheckCircle, AlertCircle, Zap, Target, Trophy, Star, Sparkles,
  Lightbulb, Brain, MessageCircle, Play, Pause, RotateCcw,
  ChevronRight, Award, Flame, Heart, Clock, TrendingUp, Bell,
  Shuffle, Filter, Grid, List, Search, Coffee, Gift, Moon, Timer,
  Image, Mic, Video, Users, BarChart3, BookText, X, Volume2, VolumeX, Settings
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import SoundSettingsPanel from '@/components/SoundSettingsPanel';
import CollapsibleLevelHeader from '@/components/CollapsibleLevelHeader';

type ViewMode = 'cards' | 'flashcards' | 'writing' | 'quiz' | 'practice' | 'challenge';
type DisplayMode = 'grid' | 'list';
type FeatureModal = 'rewards' | 'nightMode' | 'studyTime' | 'imageLearning' | 'pronunciation' | 'video' | 'groups' | 'errors' | 'sentences' | 'soundSettings' | null;

const Learn: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level || '1');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { progressByLevel, markAsMemorized, unmarkAsMemorized, getLevelProgress } = useProgress();
  const { addNotification } = useNotifications();
  const { playPop, playBubble, playSwoosh, playChime } = useSoundEffects();
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
  const [activeFeature, setActiveFeature] = useState<FeatureModal>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

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
          return level4Combined.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 5:
          return level5Combined.map(item => ({
            id: item.id,
            korean: item.korean,
            romanized: item.romanized,
            arabic: item.arabic,
          }));
        case 6:
          return level6Combined.map(item => ({
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
    4: { title: language === 'ar' ? 'الجمل الأساسية' : '기본 문장', subtitle: language === 'ar' ? 'تكوين الجمل' : '문장 만들기', total: level4Combined.length },
    5: { title: language === 'ar' ? 'الجمل المتقدمة' : '고급 문장', subtitle: language === 'ar' ? 'محادثات معقدة' : '복잡한 대화', total: level5Combined.length },
    6: { title: language === 'ar' ? 'الحياة اليومية' : '일상 생활', subtitle: language === 'ar' ? 'تطبيق عملي' : '실용적 적용', total: level6Combined.length },
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
    const filteredItems = filterItems(level4Combined);
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
    const filteredItems = filterItems(level5Combined);
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
    const filteredItems = filterItems(level6Combined);
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

      {/* Collapsible Level Header */}
      <CollapsibleLevelHeader
        levelNum={levelNum}
        levelTitle={currentLevelInfo.title}
        levelSubtitle={currentLevelInfo.subtitle}
        levelProgress={levelProgress}
        memorizedCount={memorizedCount}
        totalItems={currentLevelInfo.total}
        todayProgress={todayProgress}
        dailyGoal={dailyGoal}
        language={language}
      />

      {/* View Mode Tabs */}
      <div className="sticky top-[72px] z-30 bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-2">
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

      {/* Bottom Feature Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
          >
            <div className="container mx-auto px-4 pb-4">
              <div className="relative bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Animated Gradient Border Effect */}
                <motion.div 
                  animate={{ 
                    background: [
                      'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))',
                      'linear-gradient(180deg, rgba(236,72,153,0.3), rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                      'linear-gradient(270deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                      'linear-gradient(360deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))',
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-60" 
                />
                
                <div className="relative p-3">
                  {/* Collapse button */}
                  <button
                    onClick={() => setShowToolbar(false)}
                    title={language === 'ar' ? 'إخفاء الشريط' : '도구 숨기기'}
                    aria-label={language === 'ar' ? 'إخفاء الشريط' : '도구 숨기기'}
                    className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'rewards' as FeatureModal, icon: Gift, label: language === 'ar' ? 'المكافآت' : '보상', color: 'from-yellow-500 to-orange-500', sound: 'chime' as const },
                      { id: 'nightMode' as FeatureModal, icon: Moon, label: language === 'ar' ? 'الليلي' : '야간', color: 'from-indigo-500 to-purple-500', sound: 'swoosh' as const },
                      { id: 'studyTime' as FeatureModal, icon: Timer, label: language === 'ar' ? 'الوقت' : '시간', color: 'from-blue-500 to-cyan-500', sound: 'pop' as const },
                      { id: 'imageLearning' as FeatureModal, icon: Image, label: language === 'ar' ? 'صور' : '이미지', color: 'from-green-500 to-emerald-500', sound: 'bubble' as const },
                      { id: 'pronunciation' as FeatureModal, icon: Mic, label: language === 'ar' ? 'النطق' : '발음', color: 'from-red-500 to-rose-500', sound: 'pop' as const },
                      { id: 'video' as FeatureModal, icon: Video, label: language === 'ar' ? 'فيديو' : '비디오', color: 'from-purple-500 to-pink-500', sound: 'swoosh' as const },
                      { id: 'groups' as FeatureModal, icon: Users, label: language === 'ar' ? 'مجموعات' : '그룹', color: 'from-teal-500 to-cyan-500', sound: 'bubble' as const },
                      { id: 'errors' as FeatureModal, icon: BarChart3, label: language === 'ar' ? 'التحليل' : '분석', color: 'from-orange-500 to-amber-500', sound: 'pop' as const },
                      { id: 'sentences' as FeatureModal, icon: BookText, label: language === 'ar' ? 'الجمل' : '문장', color: 'from-pink-500 to-rose-500', sound: 'chime' as const },
                      { id: 'soundSettings' as FeatureModal, icon: Volume2, label: language === 'ar' ? 'الصوت' : '소리', color: 'from-gray-500 to-slate-600', sound: 'pop' as const },
                    ].map((feature, index) => (
                      <motion.button
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: clickedButton === feature.id ? [1, 1.3, 1] : 1,
                        }}
                        transition={{ 
                          delay: index * 0.05,
                          scale: { duration: 0.3 }
                        }}
                        whileHover={{ 
                          scale: 1.15, 
                          y: -5,
                          rotate: [-2, 2, -2, 0],
                          transition: { rotate: { duration: 0.3 } }
                        }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          // Play sound based on feature
                          if (feature.sound === 'chime') playChime();
                          else if (feature.sound === 'swoosh') playSwoosh();
                          else if (feature.sound === 'bubble') playBubble();
                          else playPop();
                          
                          // Trigger click animation
                          setClickedButton(feature.id);
                          setTimeout(() => setClickedButton(null), 300);
                          
                          setActiveFeature(feature.id);
                        }}
                        title={feature.label}
                        aria-label={feature.label}
                        className={`relative flex flex-col items-center gap-1 p-2 rounded-xl min-w-[60px] transition-all overflow-hidden ${
                          activeFeature === feature.id
                            ? `bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-current/30`
                            : 'hover:bg-muted'
                        }`}
                      >
                        {/* Ripple effect on click */}
                        <AnimatePresence>
                          {clickedButton === feature.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0.8 }}
                              animate={{ scale: 3, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${feature.color}`}
                            />
                          )}
                        </AnimatePresence>
                        
                        {/* Icon with bounce animation */}
                        <motion.div
                          animate={clickedButton === feature.id ? { 
                            rotate: [0, -15, 15, -10, 10, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <feature.icon className="w-5 h-5 relative z-10" />
                        </motion.div>
                        
                        {/* Floating particles on active */}
                        {activeFeature === feature.id && (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0, x: 0 }}
                                animate={{ 
                                  opacity: [0, 1, 0],
                                  y: [-5, -20],
                                  x: [0, (i - 1) * 10]
                                }}
                                transition={{ 
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.3
                                }}
                                className="absolute top-0 w-1 h-1 bg-white rounded-full"
                              />
                            ))}
                          </>
                        )}
                        
                        <span className="text-[10px] font-medium whitespace-nowrap relative z-10">{feature.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating reopen bubble when toolbar is hidden */}
      <AnimatePresence>
        {!showToolbar && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowToolbar(true)}
            title={language === 'ar' ? 'إظهار الأدوات' : '도구 보기'}
            aria-label={language === 'ar' ? 'إظهار الأدوات' : '도구 보기'}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feature Modals */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-auto bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-xl rounded-t-3xl">
                <h2 className="text-lg font-bold">
                  {activeFeature === 'rewards' && (language === 'ar' ? '🎁 المكافآت اليومية' : '🎁 일일 보상')}
                  {activeFeature === 'nightMode' && (language === 'ar' ? '🌙 الوضع الليلي' : '🌙 야간 모드')}
                  {activeFeature === 'studyTime' && (language === 'ar' ? '⏱️ تتبع الوقت' : '⏱️ 시간 추적')}
                  {activeFeature === 'imageLearning' && (language === 'ar' ? '🖼️ التعلم بالصور' : '🖼️ 이미지 학습')}
                  {activeFeature === 'pronunciation' && (language === 'ar' ? '🎤 تتبع النطق' : '🎤 발음 추적')}
                  {activeFeature === 'video' && (language === 'ar' ? '🎬 التعلم بالفيديو' : '🎬 비디오 학습')}
                  {activeFeature === 'groups' && (language === 'ar' ? '👥 مجموعات الدراسة' : '👥 스터디 그룹')}
                  {activeFeature === 'errors' && (language === 'ar' ? '📊 تحليل الأخطاء' : '📊 오류 분석')}
                  {activeFeature === 'sentences' && (language === 'ar' ? '📚 مكتبة الجمل' : '📚 문장 라이브러리')}
                  {activeFeature === 'soundSettings' && (language === 'ar' ? '🔊 إعدادات الصوت' : '🔊 사운드 설정')}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveFeature(null)}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-4">
                {activeFeature === 'rewards' && (
                  <DailyRewardsSystem 
                    isOpen={true}
                    onClose={() => setActiveFeature(null)}
                    currentStreak={todayProgress}
                    onClaimReward={(prize) => {
                      addNotification(
                        'achievement',
                        language === 'ar' ? '🎁 مكافأة!' : '🎁 보상!',
                        language === 'ar' ? `حصلت على ${prize.titleAr}` : `${prize.titleKo} 획득!`
                      );
                    }}
                  />
                )}
                {activeFeature === 'nightMode' && <NightModeToggle />}
                {activeFeature === 'studyTime' && <StudyTimeTracker />}
                {activeFeature === 'imageLearning' && <ImageLearning level={levelNum} />}
                {activeFeature === 'pronunciation' && (
                  <PronunciationTracker 
                    words={flashcardItems.slice(0, 10).map(item => ({
                      korean: item.korean,
                      romanized: item.romanized,
                      arabic: item.arabic
                    }))}
                  />
                )}
                {activeFeature === 'video' && <VideoLearning level={levelNum} />}
                {activeFeature === 'groups' && <StudyGroups />}
                {activeFeature === 'errors' && <ErrorAnalysis level={levelNum} />}
                {activeFeature === 'sentences' && <SentenceLibrary level={levelNum} />}
                {activeFeature === 'soundSettings' && <SoundSettingsPanel embedded />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Break Time Modal */}
      <BreakTimeModal 
        isOpen={showBreakModal} 
        onClose={() => setShowBreakModal(false)}
        studyDuration={Math.floor(studyDuration / 60)}
      />
    </div>
  );
};

export default Learn;
