import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Star, Zap, Crown, Trophy, Medal, Award, Sparkles,
  X, ChevronRight, Lock, Check, Gem, Coins, Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  type: 'points' | 'badge' | 'xp_boost' | 'streak_freeze' | 'mystery';
  value: number;
  titleAr: string;
  titleKo: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

interface DailyRewardsSystemProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  onClaimReward: (prize: Prize) => void;
}

const prizes: Prize[] = [
  { id: 'points_10', type: 'points', value: 10, titleAr: '10 نقاط', titleKo: '10 포인트', icon: <Coins className="w-6 h-6" />, rarity: 'common', color: 'from-yellow-400 to-amber-500' },
  { id: 'points_25', type: 'points', value: 25, titleAr: '25 نقطة', titleKo: '25 포인트', icon: <Coins className="w-6 h-6" />, rarity: 'common', color: 'from-yellow-400 to-amber-500' },
  { id: 'points_50', type: 'points', value: 50, titleAr: '50 نقطة', titleKo: '50 포인트', icon: <Star className="w-6 h-6" />, rarity: 'rare', color: 'from-blue-400 to-cyan-500' },
  { id: 'points_100', type: 'points', value: 100, titleAr: '100 نقطة', titleKo: '100 포인트', icon: <Gem className="w-6 h-6" />, rarity: 'epic', color: 'from-purple-400 to-pink-500' },
  { id: 'xp_boost', type: 'xp_boost', value: 2, titleAr: 'مضاعف XP', titleKo: 'XP 부스터', icon: <Zap className="w-6 h-6" />, rarity: 'rare', color: 'from-orange-400 to-red-500' },
  { id: 'streak_freeze', type: 'streak_freeze', value: 1, titleAr: 'تجميد السلسلة', titleKo: '스트릭 프리즈', icon: <Heart className="w-6 h-6" />, rarity: 'epic', color: 'from-pink-400 to-rose-500' },
  { id: 'mystery', type: 'mystery', value: 0, titleAr: 'جائزة غامضة', titleKo: '미스터리 상자', icon: <Sparkles className="w-6 h-6" />, rarity: 'legendary', color: 'from-violet-500 via-purple-500 to-fuchsia-500' },
];

const STORAGE_KEY = 'daily_reward_state';

const DailyRewardsSystem: React.FC<DailyRewardsSystemProps> = ({
  isOpen,
  onClose,
  currentStreak,
  onClaimReward,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showPrize, setShowPrize] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimedHistory, setClaimedHistory] = useState<{ date: string; prizeId: string }[]>([]);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      setClaimedHistory(state.history || []);
      const today = new Date().toDateString();
      if (state.lastClaimed === today) {
        setAlreadyClaimed(true);
        setBoxOpened(true);
        setShowPrize(true);
        const lastPrize = prizes.find(p => p.id === state.lastPrizeId);
        if (lastPrize) setSelectedPrize(lastPrize);
      }
    }
  }, []);

  const getRandomPrize = (): Prize => {
    const weights = { common: 50, rare: 30, epic: 15, legendary: 5 };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let selectedRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) { selectedRarity = rarity as typeof selectedRarity; break; }
    }
    const rarityPrizes = prizes.filter(p => p.rarity === selectedRarity);
    return rarityPrizes[Math.floor(Math.random() * rarityPrizes.length)] || prizes[0];
  };

  const handleOpenBox = () => {
    if (boxOpened || alreadyClaimed) return;
    setIsSpinning(true);
    setBoxOpened(true);

    setTimeout(() => {
      const prize = getRandomPrize();
      setSelectedPrize(prize);
      setIsSpinning(false);
      setShowPrize(true);
      setAlreadyClaimed(true);

      // Save to localStorage
      const today = new Date().toDateString();
      const newHistory = [...claimedHistory, { date: today, prizeId: prize.id }].slice(-30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastClaimed: today,
        lastPrizeId: prize.id,
        history: newHistory,
      }));
      setClaimedHistory(newHistory);

      const confettiConfig = {
        common: { particleCount: 50, spread: 50 },
        rare: { particleCount: 80, spread: 60 },
        epic: { particleCount: 120, spread: 80 },
        legendary: { particleCount: 200, spread: 100, colors: ['#9333ea', '#f472b6', '#fbbf24'] },
      };
      confetti({ ...confettiConfig[prize.rarity], origin: { y: 0.6 } });
      onClaimReward(prize);
    }, 2000);
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      common: { ar: 'عادي', ko: '일반' },
      rare: { ar: 'نادر', ko: '레어' },
      epic: { ar: 'ملحمي', ko: '에픽' },
      legendary: { ar: 'أسطوري', ko: '레전더리' },
    };
    return labels[rarity as keyof typeof labels]?.[isRTL ? 'ar' : 'ko'] || rarity;
  };

  const rarityColors = {
    common: 'text-gray-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-amber-500',
  };

  // Count consecutive days claimed
  const totalClaimedDays = claimedHistory.length;

  // Render content directly (no Dialog wrapper - parent handles the modal)
  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Streak Info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-orange-500">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">
            {isRTL ? 'يوم متتالي' : '일 연속'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isRTL ? `إجمالي المكافآت المحصلة: ${totalClaimedDays}` : `총 획득한 보상: ${totalClaimedDays}`}
        </p>
      </div>

      {/* Prize Box */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {!showPrize ? (
            <motion.div
              key="box"
              className="relative cursor-pointer"
              onClick={handleOpenBox}
              whileHover={!boxOpened ? { scale: 1.05 } : undefined}
              whileTap={!boxOpened ? { scale: 0.95 } : undefined}
            >
              <motion.div
                className={`w-36 h-36 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl ${isSpinning ? 'animate-pulse' : ''}`}
                animate={isSpinning ? { rotateY: [0, 360], scale: [1, 1.1, 1] } : undefined}
                transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
              >
                {isSpinning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="w-14 h-14 text-white" />
                  </motion.div>
                ) : (
                  <Gift className="w-14 h-14 text-white" />
                )}
              </motion.div>
              {!boxOpened && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-card rounded-full shadow-lg text-sm font-medium"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isRTL ? 'اضغط للفتح!' : '터치하여 열기!'}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="prize"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="text-center"
            >
              <div className={`w-36 h-36 rounded-3xl bg-gradient-to-br ${selectedPrize?.color} flex items-center justify-center shadow-2xl mb-4`}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white">
                  {selectedPrize?.icon}
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className={`text-sm font-bold uppercase tracking-wider ${rarityColors[selectedPrize?.rarity || 'common']}`}>
                  {getRarityLabel(selectedPrize?.rarity || 'common')}
                </p>
                <p className="text-2xl font-bold mt-1">{isRTL ? selectedPrize?.titleAr : selectedPrize?.titleKo}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  {alreadyClaimed 
                    ? (isRTL ? '✅ تم الاستلام اليوم!' : '✅ 오늘 수령 완료!')
                    : (isRTL ? 'تمت إضافتها لحسابك!' : '계정에 추가되었습니다!')}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Streak Bonus */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <h4 className="font-semibold text-sm mb-3 text-center">{isRTL ? 'مكافآت السلسلة' : '연속 보너스'}</h4>
        <div className="grid grid-cols-7 gap-1">
          {[1, 3, 5, 7, 14, 21, 30].map((day) => (
            <div
              key={day}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentStreak >= day
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                  : 'bg-muted/50'
              }`}
            >
              {currentStreak >= day ? <Check className="w-4 h-4 text-amber-500" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
              <span className="text-[10px] font-bold mt-1">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyRewardsSystem;
