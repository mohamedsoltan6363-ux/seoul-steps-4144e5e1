import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { vocabulary } from '@/data/koreanData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  onBack: () => void;
}

interface MemoryCard {
  id: string;
  content: string;
  type: 'korean' | 'arabic';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const initializeGame = useCallback(() => {
    const selectedWords = shuffleArray(vocabulary).slice(0, 12); // Increased from 6 to 12 words
    const gameCards: MemoryCard[] = [];
    
    selectedWords.forEach(word => {
      gameCards.push({
        id: `${word.id}-korean`,
        content: word.korean,
        type: 'korean',
        pairId: word.id,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: `${word.id}-arabic`,
        content: word.arabic,
        type: 'arabic',
        pairId: word.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleArray(gameCards));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setGameComplete(false);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      intervalId = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, gameComplete]);

  useEffect(() => {
    if (matchedPairs.length === 6 && matchedPairs.length > 0) {
      setGameComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [matchedPairs]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCard.pairId]);
          setCards(prev => 
            prev.map(card => 
              card.pairId === firstCard.pairId 
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find(c => c.id === cardId)?.isMatched) return;

    setFlippedCards(prev => [...prev, cardId]);
    setMoves(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {isArabic ? 'أحسنت! أكملت اللعبة!' : '잘했어요! 게임 완료!'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{moves}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'حركات' : '이동'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{formatTime(time)}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'الوقت' : '시간'}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack}>
              {isArabic ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
              {isArabic ? 'العودة' : '돌아가기'}
            </Button>
            <Button onClick={initializeGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {isArabic ? 'إعادة اللعب' : '다시 하기'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4" />
            <span>{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>{isArabic ? 'حركات:' : '이동:'}</span>
            <span className="font-bold">{moves}</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-6">
        {isArabic ? 'لعبة الذاكرة' : '메모리 게임'}
      </h2>

      {/* Game Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
        <AnimatePresence>
          {cards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square"
            >
              <Card
                onClick={() => handleCardClick(card.id)}
                className={`h-full cursor-pointer transition-all duration-300 ${
                  card.isMatched 
                    ? 'bg-green-500/20 border-green-500' 
                    : flippedCards.includes(card.id)
                    ? 'bg-primary/20 border-primary'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardContent className="h-full flex items-center justify-center p-2">
                  {(flippedCards.includes(card.id) || card.isMatched) ? (
                    <motion.span
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      className={`text-center ${card.type === 'korean' ? 'font-korean text-lg' : 'text-sm'}`}
                    >
                      {card.content}
                    </motion.span>
                  ) : (
                    <span className="text-2xl">❓</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoryGame;
