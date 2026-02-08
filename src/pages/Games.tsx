import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Gamepad2, Link2, Puzzle, Timer, Brain, Headphones, Sparkles, MessageSquare, BookOpen, Calculator, HelpCircle, Play, Star } from 'lucide-react';
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
    {
      id: 'matching',
      icon: Link2,
      title: isArabic ? 'ربط الكلمات' : '단어 연결',
      description: isArabic ? 'اربط الكلمات الكورية بمعانيها العربية' : '한국어 단어를 의미와 연결하세요',
      longDescription: isArabic ? '50 جولة مثيرة من ربط المفردات' : '50개의 흥미로운 단어 연결 라운드',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500/20',
      difficulty: isArabic ? 'متوسط' : '중간',
      color: 'pink'
    },
    {
      id: 'puzzle',
      icon: Puzzle,
      title: isArabic ? 'لغز الحروف' : '글자 퍼즐',
      description: isArabic ? 'رتب الحروف لتكوين الكلمة الصحيحة' : '글자를 배열하여 단어를 만드세요',
      longDescription: isArabic ? '50 جولة من ألغاز الحروف المشوقة' : '50개의 흥미로운 글자 퍼즐 라운드',
      gradient: 'from-violet-500 to-purple-500',
      bgGlow: 'bg-violet-500/20',
      difficulty: isArabic ? 'سهل' : '쉬움',
      color: 'violet'
    },
    {
      id: 'race',
      icon: Timer,
      title: isArabic ? 'سباق سريع' : '빠른 경주',
      description: isArabic ? 'أجب على 50 سؤال بسرعة واحصل على أعلى نقاط' : '50개의 문제에 빠르게 답하세요',
      longDescription: isArabic ? 'تحدي سريع لاختبار معرفتك' : '속도와 지식을 테스트하세요',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/20',
      difficulty: isArabic ? 'صعب' : '어려움',
      color: 'amber'
    },
    {
      id: 'memory',
      icon: Brain,
      title: isArabic ? 'لعبة الذاكرة' : '메모리 게임',
      description: isArabic ? 'اختبر ذاكرتك بمطابقة الأزواج' : '기억력을 테스트하세요',
      longDescription: isArabic ? '50 جولة من تحديات الذاكرة' : '50개의 메모리 라운드',
      gradient: 'from-cyan-500 to-blue-500',
      bgGlow: 'bg-cyan-500/20',
      difficulty: isArabic ? 'متوسط' : '중간',
      color: 'cyan'
    },
    {
      id: 'listening',
      icon: Headphones,
      title: isArabic ? 'الاستماع' : '듣기',
      description: isArabic ? 'استمع واختر الترجمة الصحيحة' : '듣고 올바른 번역을 선택하세요',
      longDescription: isArabic ? '50 جولة من تمارين الاستماع' : '50개의 청취 연습',
      gradient: 'from-purple-500 to-fuchsia-500',
      bgGlow: 'bg-purple-500/20',
      difficulty: isArabic ? 'متوسط' : '중간',
      color: 'purple'
    },
    {
      id: 'spelling',
      icon: Sparkles,
      title: isArabic ? 'التهجئة' : '철자',
      description: isArabic ? 'رتب الحروف لتهجئة الكلمة الصحيحة' : '철자를 맞춰보세요',
      longDescription: isArabic ? '50 جولة من تمارين التهجئة' : '50개의 철자 연습',
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/20',
      difficulty: isArabic ? 'سهل' : '쉬움',
      color: 'emerald'
    },
    {
      id: 'sentence',
      icon: MessageSquare,
      title: isArabic ? 'بناء الجمل' : '문장 만들기',
      description: isArabic ? 'رتب الكلمات لتكوين جملة صحيحة' : '단어를 배열하여 문장을 만드세요',
      longDescription: isArabic ? '50 جملة مختلفة للترتيب والتعلم' : '50개의 문장 구성 과제',
      gradient: 'from-indigo-500 to-blue-500',
      bgGlow: 'bg-indigo-500/20',
      difficulty: isArabic ? 'صعب' : '어려움',
      color: 'indigo'
    },
    {
      id: 'vocab',
      icon: BookOpen,
      title: isArabic ? 'اختبار المفردات' : '어휘 퀴즈',
      description: isArabic ? 'اختبر معرفتك بالمفردات الكورية' : '어휘력을 테스트하세요',
      longDescription: isArabic ? '50 جولة من اختبارات المفردات' : '50개의 어휘 퀴즈',
      gradient: 'from-sky-500 to-cyan-500',
      bgGlow: 'bg-sky-500/20',
      difficulty: isArabic ? 'متوسط' : '중간',
      color: 'sky'
    },
    {
      id: 'numbers',
      icon: Calculator,
      title: isArabic ? 'الأرقام الكورية' : '숫자 게임',
      description: isArabic ? 'تعلم وتمرن على الأرقام الكورية' : '한국어 숫자를 배우세요',
      longDescription: isArabic ? '50 جولة من الأرقام الكورية والصينية' : '50개의 숫자 학습',
      gradient: 'from-yellow-500 to-amber-500',
      bgGlow: 'bg-yellow-500/20',
      difficulty: isArabic ? 'سهل' : '쉬움',
      color: 'yellow'
    },
    {
      id: 'fillblank',
      icon: HelpCircle,
      title: isArabic ? 'أكمل الفراغ' : '빈칸 채우기',
      description: isArabic ? 'أكمل الجملة بالكلمة الصحيحة' : '올바른 단어로 빈칸을 채우세요',
      longDescription: isArabic ? '50 جملة مختلفة بفراغات متنوعة' : '50개의 빈칸 채우기 문제',
      gradient: 'from-teal-500 to-green-500',
      bgGlow: 'bg-teal-500/20',
      difficulty: isArabic ? 'متوسط' : '중간',
      color: 'teal'
    },
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentGame === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/50"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="gap-2 hover:bg-slate-100"
                  >
                    {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {isArabic ? 'العودة' : '돌아가기'}
                  </Button>

                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Gamepad2 className="w-7 h-7 text-blue-600" />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isArabic ? 'الألعاب التعليمية' : '교육 게임'}
                      </h1>
                      <p className="text-sm text-slate-600 mt-1">
                        {isArabic ? '10 ألعاب تفاعلية مثيرة' : '10개의 재미있는 게임'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-slate-700">
                      {isArabic ? '500+ جولة' : '500+ 라운드'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="container mx-auto px-4 py-12"
            >
              <div className="max-w-3xl mx-auto text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-slate-800 mb-4"
                >
                  {isArabic
                    ? 'تعلم اللغة الكورية من خلال الألعاب المثيرة'
                    : '게임을 통해 한국어를 배우세요'}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-slate-600"
                >
                  {isArabic
                    ? 'اختر لعبتك المفضلة وابدأ رحلة التعلم الممتعة الآن'
                    : '좋아하는 게임을 선택하고 지금 바로 시작하세요'}
                </motion.p>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.5 }}
                    className="group h-full"
                  >
                    <Card
                      className="relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 h-full bg-white group-hover:bg-white backdrop-blur-sm"
                      onClick={() => setCurrentGame(game.id as GameType)}
                    >
                      {/* Background Glow Effect */}
                      <motion.div
                        className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />

                      {/* Gradient Top Border */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${game.gradient}`}
                      />

                      <CardContent className="relative p-6 h-full flex flex-col">
                        {/* Icon Container */}
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 shadow-lg`}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <game.icon className="w-8 h-8 text-white" />
                        </motion.div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                          {game.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-4 flex-grow">
                          {game.description}
                        </p>

                        <p className="text-xs font-medium text-slate-500 mb-4">
                          {game.longDescription}
                        </p>

                        {/* Footer with Difficulty and CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-slate-600">
                              {isArabic ? 'المستوى: ' : '난이도: '}
                            </span>
                            <span className={`text-xs font-bold ${
                              game.difficulty === (isArabic ? 'سهل' : '쉬움') ? 'text-green-600' :
                              game.difficulty === (isArabic ? 'متوسط' : '중간') ? 'text-amber-600' :
                              'text-red-600'
                            }`}>
                              {game.difficulty}
                            </span>
                          </div>

                          <motion.div
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Play className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-600">
                              {isArabic ? 'لعب' : '플레이'}
                            </span>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer Spacing */}
            <div className="h-24" />
          </motion.div>
        ) : (
          <motion.div
            key={currentGame}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Games;
