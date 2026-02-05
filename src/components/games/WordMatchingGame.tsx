import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Trophy, RotateCcw, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { vocabulary, consonants, vowels, basicSentences, advancedSentences } from '@/data/koreanData';
import { advancedVocabulary } from '@/data/level3VocabularyData';
import { dailyLifeSentences } from '@/data/level5Data';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WordMatchingGameProps {
  onBack: () => void;
}

interface WordPair {
  id: string;
  korean: string;
  arabic: string;
}

// Combine all content sources for infinite variety
const getAllContent = (): WordPair[] => {
  const allItems: WordPair[] = [];
  
  // Add consonants and vowels
  consonants.forEach(c => allItems.push({ id: `c_${c.id}`, korean: c.korean, arabic: c.arabic }));
  vowels.forEach(v => allItems.push({ id: `v_${v.id}`, korean: v.korean, arabic: v.arabic }));
  
  // Add vocabulary
  vocabulary.forEach(v => allItems.push({ id: v.id, korean: v.korean, arabic: v.arabic }));
  
  // Add advanced vocabulary
  advancedVocabulary.forEach(v => allItems.push({ id: v.id, korean: v.korean, arabic: v.arabic }));
  
  // Add sentences
  basicSentences.forEach(s => allItems.push({ id: s.id, korean: s.korean, arabic: s.arabic }));
  advancedSentences.forEach(s => allItems.push({ id: s.id, korean: s.korean, arabic: s.arabic }));
  dailyLifeSentences.forEach(s => allItems.push({ id: s.id, korean: s.korean, arabic: s.arabic }));
  
  return allItems;
};

const WordMatchingGame = ({ onBack }: WordMatchingGameProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(10); // Increased to 10 rounds
  const [currentPairs, setCurrentPairs] = useState<WordPair[]>([]);
  const [selectedKorean, setSelectedKorean] = useState<string | null>(null);
  const [selectedArabic, setSelectedArabic] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ korean: string; arabic: string } | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [shuffledKorean, setShuffledKorean] = useState<WordPair[]>([]);
  const [shuffledArabic, setShuffledArabic] = useState<WordPair[]>([]);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [allContent] = useState<WordPair[]>(() => getAllContent());

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateRound = useCallback(() => {
    // Filter out already used items
    let availableItems = allContent.filter(item => !usedIds.has(item.id));
    
    // If we've used most items, reset the pool
    if (availableItems.length < 5) {
      setUsedIds(new Set());
      availableItems = [...allContent];
    }
    
    // Shuffle and pick 5 items for variety
    const shuffledItems = shuffleArray(availableItems);
    const pairs = shuffledItems.slice(0, 5);
    
    // Track used items
    setUsedIds(prev => {
      const newSet = new Set(prev);
      pairs.forEach(p => newSet.add(p.id));
      return newSet;
    });
    
    setCurrentPairs(pairs);
    setShuffledKorean(shuffleArray([...pairs]));
    setShuffledArabic(shuffleArray([...pairs]));
    setMatchedPairs([]);
    setSelectedKorean(null);
    setSelectedArabic(null);
    setWrongPair(null);
  }, [allContent, usedIds]);

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (selectedKorean && selectedArabic) {
      const koreanPair = currentPairs.find(p => p.korean === selectedKorean);
      const isMatch = koreanPair?.arabic === selectedArabic;

      if (isMatch && koreanPair) {
        setMatchedPairs(prev => [...prev, koreanPair.id]);
        setScore(prev => prev + 10);
        
        // Check if round is complete
        if (matchedPairs.length + 1 === currentPairs.length) {
          setTimeout(() => {
            if (round < totalRounds) {
              setRound(prev => prev + 1);
              generateRound();
            } else {
              setGameComplete(true);
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }, 500);
        }
      } else {
        setWrongPair({ korean: selectedKorean, arabic: selectedArabic });
        setTimeout(() => setWrongPair(null), 600);
      }

      setTimeout(() => {
        setSelectedKorean(null);
        setSelectedArabic(null);
      }, 300);
    }
  }, [selectedKorean, selectedArabic, currentPairs, matchedPairs.length, round, totalRounds, generateRound]);

  const restartGame = () => {
    setRound(1);
    setScore(0);
    setGameComplete(false);
    setUsedIds(new Set()); // Reset used items for new game
    generateRound();
  };

  const isKoreanMatched = (korean: string) => {
    const pair = currentPairs.find(p => p.korean === korean);
    return pair ? matchedPairs.includes(pair.id) : false;
  };

  const isArabicMatched = (arabic: string) => {
    const pair = currentPairs.find(p => p.arabic === arabic);
    return pair ? matchedPairs.includes(pair.id) : false;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {isArabic ? 'مبروك!' : '축하합니다!'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isArabic ? 'لقد أكملت اللعبة بنجاح' : '게임을 성공적으로 완료했습니다'}
              </p>
              <div className="text-5xl font-bold mb-6 text-primary">{score}</div>
              <p className="text-sm text-muted-foreground mb-8">
                {isArabic ? 'النقاط' : '점수'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={restartGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isArabic ? 'إعادة اللعب' : '다시 하기'}
                </Button>
                <Button variant="outline" onClick={onBack}>
                  {isArabic ? 'العودة' : '돌아가기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isArabic ? 'العودة' : '돌아가기'}
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {isArabic ? `الجولة ${round} من ${totalRounds}` : `라운드 ${round} / ${totalRounds}`}
          </span>
          <span className="text-sm text-muted-foreground">
            {matchedPairs.length}/{currentPairs.length}
          </span>
        </div>
        <Progress value={(matchedPairs.length / currentPairs.length) * 100} className="h-2" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        {isArabic ? 'اربط الكلمات المتطابقة' : '일치하는 단어를 연결하세요'}
      </h2>

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {/* Korean Column */}
        <div className="space-y-3">
          <AnimatePresence>
            {shuffledKorean.map((pair, index) => (
              <motion.div
                key={pair.korean}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    isKoreanMatched(pair.korean)
                      ? 'bg-green-500/20 border-green-500/50 opacity-60'
                      : selectedKorean === pair.korean
                      ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
                      : wrongPair?.korean === pair.korean
                      ? 'bg-red-500/20 border-red-500 animate-shake'
                      : 'hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => !isKoreanMatched(pair.korean) && setSelectedKorean(pair.korean)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-xl font-bold">{pair.korean}</span>
                    {isKoreanMatched(pair.korean) && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Arabic Column */}
        <div className="space-y-3">
          <AnimatePresence>
            {shuffledArabic.map((pair, index) => (
              <motion.div
                key={pair.arabic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    isArabicMatched(pair.arabic)
                      ? 'bg-green-500/20 border-green-500/50 opacity-60'
                      : selectedArabic === pair.arabic
                      ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
                      : wrongPair?.arabic === pair.arabic
                      ? 'bg-red-500/20 border-red-500 animate-shake'
                      : 'hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => !isArabicMatched(pair.arabic) && setSelectedArabic(pair.arabic)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-lg">{pair.arabic}</span>
                    {isArabicMatched(pair.arabic) && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WordMatchingGame;
