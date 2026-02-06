import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Check, Users, Gift, Share2, Trophy, Star, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Referral {
  id: string;
  referred_name: string;
  points_earned: number;
  created_at: string;
}

const ReferralSystem: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralHistory, setReferralHistory] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const POINTS_PER_REFERRAL = 3;

  useEffect(() => {
    if (user) {
      // Generate referral code from user ID
      const code = user.id.substring(0, 8).toUpperCase();
      setReferralCode(code);
      
      // Generate referral link
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/auth?ref=${code}`);

      // Load referral data
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;
    
    try {
      // Get user's profile for total points
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setTotalPoints(profileData.total_points || 0);
      }

      // Simulate referral history (in production, this would come from a referrals table)
      // For now, we'll use localStorage to track referrals
      const storedReferrals = localStorage.getItem(`referrals_${user.id}`);
      if (storedReferrals) {
        const referrals = JSON.parse(storedReferrals);
        setReferralHistory(referrals);
        setTotalReferrals(referrals.length);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(
        isRTL 
          ? (type === 'code' ? 'تم نسخ الكود!' : 'تم نسخ الرابط!') 
          : (type === 'code' ? '코드가 복사되었습니다!' : '링크가 복사되었습니다!')
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(isRTL ? 'فشل النسخ' : '복사 실패');
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isRTL ? 'تعلم الكورية معي!' : '저와 함께 한국어를 배우세요!',
          text: isRTL 
            ? 'انضم إلى منصة تعلم اللغة الكورية واحصل على مكافأة!'
            : '한국어 학습 플랫폼에 가입하고 보상을 받으세요!',
          url: referralLink
        });
      } catch (err) {
        copyToClipboard(referralLink, 'link');
      }
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };

  const rewards = [
    { referrals: 1, reward: isRTL ? '3 نقاط' : '3 포인트', icon: Star },
    { referrals: 5, reward: isRTL ? '20 نقطة' : '20 포인트', icon: Gift },
    { referrals: 10, reward: isRTL ? '50 نقطة + شارة' : '50 포인트 + 배지', icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-6"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isRTL ? 'نظام الإحالة' : '추천 시스템'}
              </h2>
              <p className="text-white/70 text-sm">
                {isRTL ? 'ادعُ أصدقاءك واكسب نقاط' : '친구를 초대하고 포인트를 받으세요'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{totalReferrals}</p>
              <p className="text-white/70 text-xs">
                {isRTL ? 'إحالات ناجحة' : '성공한 추천'}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{totalReferrals * POINTS_PER_REFERRAL}</p>
              <p className="text-white/70 text-xs">
                {isRTL ? 'نقاط مكتسبة' : '획득 포인트'}
              </p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-white/10 rounded-2xl p-4 mb-4">
            <p className="text-white/70 text-xs mb-2">
              {isRTL ? 'كود الإحالة الخاص بك' : '내 추천 코드'}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-xl px-4 py-3 font-mono font-bold text-white text-lg tracking-wider">
                {referralCode}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(referralCode, 'code')}
                className="p-3 bg-white rounded-xl text-primary"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareReferral}
            className="w-full py-4 rounded-2xl bg-white text-primary font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            {isRTL ? 'شارك الرابط' : '링크 공유하기'}
          </motion.button>
        </div>
      </motion.div>

      {/* Rewards Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border/50 p-4"
      >
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          {isRTL ? 'المكافآت' : '보상'}
        </h3>
        <div className="space-y-3">
          {rewards.map((tier, index) => (
            <div 
              key={index}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                totalReferrals >= tier.referrals 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'bg-muted/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                totalReferrals >= tier.referrals ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                <tier.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {tier.referrals} {isRTL ? 'إحالات' : '추천'}
                </p>
                <p className="text-xs text-muted-foreground">{tier.reward}</p>
              </div>
              {totalReferrals >= tier.referrals && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referral History */}
      {referralHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-4"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {isRTL ? 'سجل الإحالات' : '추천 기록'}
          </h3>
          <div className="space-y-2">
            {referralHistory.map((ref, index) => (
              <div 
                key={ref.id || index}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {ref.referred_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ref.referred_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-primary font-bold text-sm">
                  +{ref.points_earned} {isRTL ? 'نقاط' : '포인트'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-muted/30 rounded-2xl p-4"
      >
        <h3 className="font-bold mb-3 text-sm">
          {isRTL ? 'كيف يعمل النظام؟' : '어떻게 작동하나요?'}
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
            <p>{isRTL ? 'شارك رابط الإحالة مع أصدقائك' : '친구에게 추천 링크를 공유하세요'}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
            <p>{isRTL ? 'عندما يسجل صديقك حساب جديد' : '친구가 새 계정을 등록하면'}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
            <p>{isRTL ? `تحصل على ${POINTS_PER_REFERRAL} نقاط تلقائياً!` : `${POINTS_PER_REFERRAL} 포인트를 자동으로 받습니다!`}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralSystem;
