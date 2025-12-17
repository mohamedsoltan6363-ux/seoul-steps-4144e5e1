import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Gamepad2, Link2, Puzzle, Timer } from 'lucide-react';
import WordMatchingGame from '@/components/games/WordMatchingGame';
import LetterPuzzleGame from '@/components/games/LetterPuzzleGame';
import TimeRaceGame from '@/components/games/TimeRaceGame';
import { motion, AnimatePresence } from 'framer-motion';

type GameType = 'menu' | 'matching' | 'puzzle' | 'race';

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
      description: isArabic 
        ? 'اربط الكلمات الكورية بمعانيها العربية' 
        : '한국어 단어를 아랍어 의미와 연결하세요',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500/20',
    },
    {
      id: 'puzzle',
      icon: Puzzle,
      title: isArabic ? 'لغز الحروف' : '글자 퍼즐',
      description: isArabic 
        ? 'رتب الحروف لتكوين الكلمة الصحيحة' 
        : '글자를 배열하여 올바른 단어를 만드세요',
      gradient: 'from-violet-500 to-purple-500',
      bgGlow: 'bg-violet-500/20',
    },
    {
      id: 'race',
      icon: Timer,
      title: isArabic ? 'سباق الوقت' : '시간 경주',
      description: isArabic 
        ? 'أجب على أكبر عدد من الأسئلة قبل انتهاء الوقت' 
        : '시간이 끝나기 전에 최대한 많은 질문에 답하세요',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/20',
    },
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'matching':
        return <WordMatchingGame onBack={() => setCurrentGame('menu')} />;
      case 'puzzle':
        return <LetterPuzzleGame onBack={() => setCurrentGame('menu')} />;
      case 'race':
        return <TimeRaceGame onBack={() => setCurrentGame('menu')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AnimatePresence mode="wait">
        {currentGame === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
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

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border-0 shadow-xl"
                    onClick={() => setCurrentGame(game.id as GameType)}
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                    
                    <CardContent className="relative p-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <game.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-2">{game.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {game.description}
                      </p>

                      {/* Play Button */}
                      <div className={`mt-4 inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${game.gradient} bg-clip-text text-transparent`}>
                        {isArabic ? 'ابدأ اللعب' : '게임 시작'}
                        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key={currentGame}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Games;
