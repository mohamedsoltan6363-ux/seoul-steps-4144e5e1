import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/hooks/useProgress';
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import LetterCard from '@/components/LetterCard';
import VocabularyCard from '@/components/VocabularyCard';
import SentenceCard from '@/components/SentenceCard';
import Quiz from '@/components/Quiz';
import { ArrowLeft, BookOpen, Ear, PenTool, GraduationCap } from 'lucide-react';

type ViewMode = 'cards' | 'listen' | 'practice' | 'quiz';

const Learn: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level || '1');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { progressByLevel, markAsMemorized, unmarkAsMemorized } = useProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels'>('consonants');

  const progress = progressByLevel[levelNum]?.progress || [];
  const isMemorized = (id: string) => progress.some(p => p.item_id === id && p.is_memorized);

  const handleToggleMemorized = async (id: string, type: string) => {
    if (isMemorized(id)) {
      await unmarkAsMemorized(levelNum, type, id);
    } else {
      await markAsMemorized(levelNum, type, id);
    }
  };

  const handleQuizComplete = async (score: number, total: number, passed: boolean) => {
    // Quiz results are handled in the Quiz component
  };

  const modes = [
    { key: 'cards' as ViewMode, icon: <BookOpen className="w-4 h-4" />, label: language === 'ar' ? 'البطاقات' : '카드' },
    { key: 'listen' as ViewMode, icon: <Ear className="w-4 h-4" />, label: language === 'ar' ? 'استماع' : '듣기' },
    { key: 'quiz' as ViewMode, icon: <GraduationCap className="w-4 h-4" />, label: language === 'ar' ? 'اختبار' : '시험' },
  ];

  const renderLevel1 = () => (
    <>
      {/* Tabs for consonants/vowels */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('consonants')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            activeTab === 'consonants' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('consonants')} ({consonants.length})
        </button>
        <button
          onClick={() => setActiveTab('vowels')}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            activeTab === 'vowels' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('vowels')} ({vowels.length})
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('dashboard')}</span>
            </button>
            <h1 className="font-bold">{t(`level${levelNum}` as any)}</h1>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {modes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  viewMode === mode.key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {viewMode === 'quiz' ? (
          <Quiz level={levelNum} onComplete={handleQuizComplete} onBack={() => setViewMode('cards')} />
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
