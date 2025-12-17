import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/hooks/useProgress';
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import LetterCard from '@/components/LetterCard';
import VocabularyCard from '@/components/VocabularyCard';
import SentenceCard from '@/components/SentenceCard';
import Quiz from '@/components/Quiz';
import Flashcard from '@/components/Flashcard';
import WritingPractice from '@/components/WritingPractice';
import { 
  ArrowLeft, BookOpen, Ear, PenTool, GraduationCap, Layers, Lock, 
  CheckCircle, AlertCircle 
} from 'lucide-react';

type ViewMode = 'cards' | 'flashcards' | 'writing' | 'quiz';

const Learn: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level || '1');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { progressByLevel, markAsMemorized, unmarkAsMemorized, getLevelProgress } = useProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels'>('consonants');

  const progress = progressByLevel[levelNum]?.progress || [];
  const levelProgress = getLevelProgress(levelNum);
  const isQuizUnlocked = levelProgress >= 100;

  const isMemorized = (id: string) => progress.some(p => p.item_id === id && p.is_memorized);
  const memorizedIds = progress.filter(p => p.is_memorized).map(p => p.item_id);

  const handleToggleMemorized = async (id: string, type: string) => {
    if (isMemorized(id)) {
      await unmarkAsMemorized(levelNum, type, id);
    } else {
      await markAsMemorized(levelNum, type, id);
    }
  };

  const handleQuizComplete = async () => {
    // Quiz results are handled in the Quiz component
  };

  // Get items for flashcards based on level
  const flashcardItems = useMemo(() => {
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
        return basicSentences.map(item => ({
          id: item.id,
          korean: item.korean,
          romanized: item.romanized,
          arabic: item.arabic,
        }));
      case 4:
        return advancedSentences.map(item => ({
          id: item.id,
          korean: item.korean,
          romanized: item.romanized,
          arabic: item.arabic,
        }));
      default:
        return [];
    }
  }, [levelNum]);

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
    { key: 'cards' as ViewMode, icon: <BookOpen className="w-4 h-4" />, label: language === 'ar' ? 'البطاقات' : '카드' },
    { key: 'flashcards' as ViewMode, icon: <Layers className="w-4 h-4" />, label: language === 'ar' ? 'مراجعة سريعة' : '플래시카드' },
    ...(levelNum === 1 ? [{ key: 'writing' as ViewMode, icon: <PenTool className="w-4 h-4" />, label: language === 'ar' ? 'تدريب الكتابة' : '쓰기 연습' }] : []),
    { key: 'quiz' as ViewMode, icon: <GraduationCap className="w-4 h-4" />, label: language === 'ar' ? 'اختبار' : '시험', locked: !isQuizUnlocked },
  ];

  const renderLevel1 = () => (
    <>
      {/* Tabs for consonants/vowels */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('consonants')}
          className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'consonants' 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('consonants')} ({consonants.length})
        </button>
        <button
          onClick={() => setActiveTab('vowels')}
          className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'vowels' 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('vowels')} ({vowels.length})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(activeTab === 'consonants' ? consonants : vowels).map((letter) => (
          <LetterCard
            key={letter.id}
            korean={letter.korean}
            romanized={letter.romanized}
            arabic={letter.arabic}
            audioText={letter.audioText}
            isMemorized={isMemorized(letter.id)}
            onToggleMemorized={() => handleToggleMemorized(letter.id, activeTab)}
          />
        ))}
      </div>
    </>
  );

  const renderLevel2 = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vocabulary.map((word) => (
        <VocabularyCard
          key={word.id}
          korean={word.korean}
          romanized={word.romanized}
          arabic={word.arabic}
          category={word.category}
          isMemorized={isMemorized(word.id)}
          onToggleMemorized={() => handleToggleMemorized(word.id, 'vocabulary')}
        />
      ))}
    </div>
  );

  const renderLevel3 = () => (
    <div className="grid gap-4 max-w-2xl mx-auto">
      {basicSentences.map((sentence) => (
        <SentenceCard
          key={sentence.id}
          korean={sentence.korean}
          romanized={sentence.romanized}
          arabic={sentence.arabic}
          isMemorized={isMemorized(sentence.id)}
          onToggleMemorized={() => handleToggleMemorized(sentence.id, 'sentences')}
        />
      ))}
    </div>
  );

  const renderLevel4 = () => (
    <div className="grid gap-4 max-w-2xl mx-auto">
      {advancedSentences.map((sentence) => (
        <SentenceCard
          key={sentence.id}
          korean={sentence.korean}
          romanized={sentence.romanized}
          arabic={sentence.arabic}
          isMemorized={isMemorized(sentence.id)}
          onToggleMemorized={() => handleToggleMemorized(sentence.id, 'advanced')}
        />
      ))}
    </div>
  );

  const handleFlashcardMemorize = async (id: string) => {
    const type = levelNum === 1 ? (consonants.find(c => c.id === id) ? 'consonants' : 'vowels') 
      : levelNum === 2 ? 'vocabulary' 
      : levelNum === 3 ? 'sentences' 
      : 'advanced';
    await markAsMemorized(levelNum, type, id);
  };

  const renderQuizLocked = () => (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-muted flex items-center justify-center">
        <Lock className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-3">
        {language === 'ar' ? 'الاختبار مقفل' : '시험 잠김'}
      </h2>
      <p className="text-muted-foreground mb-6">
        {language === 'ar' 
          ? 'يجب عليك حفظ جميع العناصر (100%) قبل فتح الاختبار' 
          : '시험을 열려면 모든 항목을 100% 암기해야 합니다'}
      </p>
      
      {/* Progress indicator */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">
            {language === 'ar' ? 'التقدم الحالي' : '현재 진행 상황'}
          </span>
          <span className="font-bold text-primary">{levelProgress}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>
            {language === 'ar' 
              ? `متبقي ${100 - levelProgress}% للوصول إلى 100%` 
              : `100%까지 ${100 - levelProgress}% 남음`}
          </span>
        </div>
      </div>

      <button
        onClick={() => setViewMode('cards')}
        className="mt-6 korean-button"
      >
        {language === 'ar' ? 'العودة للتعلم' : '학습으로 돌아가기'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('dashboard')}</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-bold">{t(`level${levelNum}` as any)}</h1>
              {isQuizUnlocked && (
                <CheckCircle className="w-5 h-5 text-korean-green" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="text-sm font-semibold min-w-[3rem]">{levelProgress}%</span>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {modes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => !mode.locked && setViewMode(mode.key)}
                disabled={mode.locked}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  viewMode === mode.key 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : mode.locked
                      ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {mode.locked ? <Lock className="w-4 h-4" /> : mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {viewMode === 'quiz' ? (
          isQuizUnlocked ? (
            <Quiz level={levelNum} onComplete={handleQuizComplete} onBack={() => setViewMode('cards')} />
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
        ) : (
          <>
            {levelNum === 1 && renderLevel1()}
            {levelNum === 2 && renderLevel2()}
            {levelNum === 3 && renderLevel3()}
            {levelNum === 4 && renderLevel4()}
          </>
        )}
      </main>
    </div>
  );
};

export default Learn;
