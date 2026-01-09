import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Gamepad2, Link2, Puzzle, Timer, Brain, Headphones, Sparkles, MessageSquare, BookOpen, Calculator, HelpCircle } from 'lucide-react';
import WordMatchingGame from '@/components/games/WordMatchingGame';
import LetterPuzzleGame from '@/components/games/LetterPuzzleGame';
import TimeRaceGame from '@/components/games/TimeRaceGame';
import MemoryGame from '@/components/games/MemoryGame';
import ListeningGame from '@/components/games/ListeningGame';
import SpellingGame from '@/components/games/SpellingGame';
import SentenceBuilderGame from '@/components/games/SentenceBuilderGame';
import VocabularyQuizGame from '@/components/games/VocabularyQuizGame';
import NumberGame from '@/components/games/NumberGame';
import FillBlankGame from '@/components/games/FillBlankGame';
import { motion, AnimatePresence } from 'framer-motion';

type GameType = 'menu' | 'matching' | 'puzzle' | 'race' | 'memory' | 'listening' | 'spelling' | 'sentence' | 'vocab' | 'numbers' | 'fillblank';

const Games = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const isArabic = language === 'ar';

  const games = [
    { id: 'matching', icon: Link2, title: isArabic ? 'ربط الكلمات' : '단어 연결', description: isArabic ? 'اربط الكلمات الكورية بمعانيها' : '한국어 단어를 의미와 연결하세요', gradient: 'from-pink-500 to-rose-500', bgGlow: 'bg-pink-500/20' },
    { id: 'puzzle', icon: Puzzle, title: isArabic ? 'لغز الحروف' : '글자 퍼즐', description: isArabic ? 'رتب الحروف لتكوين الكلمة' : '글자를 배열하여 단어를 만드세요', gradient: 'from-violet-500 to-purple-500', bgGlow: 'bg-violet-500/20' },
    { id: 'race', icon: Timer, title: isArabic ? 'سباق الوقت' : '시간 경주', description: isArabic ? 'أجب بسرعة قبل انتهاء الوقت' : '시간 안에 빨리 답하세요', gradient: 'from-amber-500 to-orange-500', bgGlow: 'bg-amber-500/20' },
    { id: 'memory', icon: Brain, title: isArabic ? 'لعبة الذاكرة' : '메모리 게임', description: isArabic ? 'اختبر ذاكرتك بمطابقة الأزواج' : '기억력을 테스트하세요', gradient: 'from-cyan-500 to-blue-500', bgGlow: 'bg-cyan-500/20' },
    { id: 'listening', icon: Headphones, title: isArabic ? 'الاستماع' : '듣기', description: isArabic ? 'استمع واختر الترجمة الصحيحة' : '듣고 올바른 번역을 선택하세요', gradient: 'from-purple-500 to-fuchsia-500', bgGlow: 'bg-purple-500/20' },
    { id: 'spelling', icon: Sparkles, title: isArabic ? 'التهجئة' : '철자', description: isArabic ? 'رتب الحروف لتهجئة الكلمة' : '철자를 맞춰보세요', gradient: 'from-emerald-500 to-teal-500', bgGlow: 'bg-emerald-500/20' },
    { id: 'sentence', icon: MessageSquare, title: isArabic ? 'بناء الجمل' : '문장 만들기', description: isArabic ? 'رتب الكلمات لتكوين جملة' : '단어를 배열하여 문장을 만드세요', gradient: 'from-indigo-500 to-blue-500', bgGlow: 'bg-indigo-500/20' },
    { id: 'vocab', icon: BookOpen, title: isArabic ? 'اختبار المفردات' : '어휘 퀴즈', description: isArabic ? 'اختبر معرفتك بالمفردات' : '어휘력을 테스트하세요', gradient: 'from-sky-500 to-cyan-500', bgGlow: 'bg-sky-500/20' },
    { id: 'numbers', icon: Calculator, title: isArabic ? 'الأرقام الكورية' : '숫자 게임', description: isArabic ? 'تعلم الأرقام الكورية' : '한국어 숫자를 배우세요', gradient: 'from-yellow-500 to-amber-500', bgGlow: 'bg-yellow-500/20' },
    { id: 'fillblank', icon: HelpCircle, title: isArabic ? 'أكمل الفراغ' : '빈칸 채우기', description: isArabic ? 'أكمل الجملة بالكلمة الصحيحة' : '올바른 단어로 빈칸을 채우세요', gradient: 'from-teal-500 to-green-500', bgGlow: 'bg-teal-500/20' },
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'matching': return <WordMatchingGame onBack={() => setCurrentGame('menu')} />;
      case 'puzzle': return <LetterPuzzleGame onBack={() => setCurrentGame('menu')} />;
      case 'race': return <TimeRaceGame onBack={() => setCurrentGame('menu')} />;
      case 'memory': return <MemoryGame onBack={() => setCurrentGame('menu')} />;
      case 'listening': return <ListeningGame onBack={() => setCurrentGame('menu')} />;
      case 'spelling': return <SpellingGame onBack={() => setCurrentGame('menu')} />;
      case 'sentence': return <SentenceBuilderGame onBack={() => setCurrentGame('menu')} />;
      case 'vocab': return <VocabularyQuizGame onBack={() => setCurrentGame('menu')} />;
      case 'numbers': return <NumberGame onBack={() => setCurrentGame('menu')} />;
      case 'fillblank': return <FillBlankGame onBack={() => setCurrentGame('menu')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AnimatePresence mode="wait">
        {currentGame === 'menu' ? (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
                {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isArabic ? 'العودة' : '돌아가기'}
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {isArabic ? 'الألعاب التعليمية' : '교육 게임'}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {games.map((game, index) => (
                <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border-0 shadow-xl h-full" onClick={() => setCurrentGame(game.id as GameType)}>
                    <div className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                    <CardContent className="relative p-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <game.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">{game.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{game.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={currentGame} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Games;
