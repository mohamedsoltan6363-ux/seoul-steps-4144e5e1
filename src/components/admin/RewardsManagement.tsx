import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Gift, Star, Zap, Users, TrendingUp } from 'lucide-react';

const RewardsManagement: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const badges = [
    { id: 1, name: isRTL ? 'الديناميكي' : '동적 학습자', desc: isRTL ? 'كمل 7 أيام متتالية' : '7일 연속 학습', icon: Zap, color: 'amber', earnedBy: 234 },
    { id: 2, name: isRTL ? 'معلم نجوم' : '스타 교사', desc: isRTL ? 'ساعد 10 مستخدمين' : '10명 도움', icon: Star, color: 'yellow', earnedBy: 156 },
    { id: 3, name: isRTL ? 'بطل' : '챔피언', desc: isRTL ? 'احتل المركز الأول' : '1위 달성', icon: Trophy, color: 'purple', earnedBy: 45 },
    { id: 4, name: isRTL ? 'مكافأة' : '보상', desc: isRTL ? 'أنهِ المستوى' : '레벨 완료', icon: Gift, color: 'pink', earnedBy: 567 },
  ];

  const achievements = [
    {
      id: 1,
      name: isRTL ? 'أول كلمة' : '첫 단어',
      description: isRTL ? 'تعلم أول كلمة' : '첫 단어 학습',
      unlocked: 2547,
      percentage: 100,
      rarity: 'common'
    },
    {
      id: 2,
      name: isRTL ? 'محادثة' : '회화 마스터',
      description: isRTL ? 'أكمل 10 درروس محادثة' : '10개 회화 레슨 완료',
      unlocked: 1234,
      percentage: 48,
      rarity: 'rare'
    },
    {
      id: 3,
      name: isRTL ? 'قاموس خبير' : '사전 전문가',
      description: isRTL ? 'أضف 100 كلمة للقاموس' : '100개 단어 추가',
      unlocked: 456,
      percentage: 18,
      rarity: 'epic'
    },
    {
      id: 4,
      name: isRTL ? 'معلم كامل' : '완전 달인',
      description: isRTL ? 'أكمل جميع المستويات' : '모든 레벨 완료',
      unlocked: 89,
      percentage: 3,
      rarity: 'legendary'
    },
  ];

  const leaderboardRewards = [
    { position: 1, name: isRTL ? 'أحمد علي' : '김철수', points: 4520, reward: '100 نقطة ذهبية' },
    { position: 2, name: isRTL ? 'فاطمة محمد' : '이수진', points: 4280, reward: '75 نقطة ذهبية' },
    { position: 3, name: isRTL ? 'محمود إبراهيم' : '박민준', points: 3890, reward: '50 نقطة ذهبية' },
    { position: 4, name: isRTL ? 'نور الدين' : '정지훈', points: 3650, reward: '30 نقطة ذهبية' },
    { position: 5, name: isRTL ? 'ليلى حسن' : '최지은', points: 2340, reward: '20 نقطة ذهبية' },
  ];

  return (
    <div className="space-y-8">
      {/* Rewards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isRTL ? 'الشارات' : '배지', value: '4', icon: Trophy, color: 'blue' },
          { label: isRTL ? 'الإنجازات' : '성취', value: '12', icon: Star, color: 'amber' },
          { label: isRTL ? 'الهدايا' : '선물', value: '8', icon: Gift, color: 'pink' },
          { label: isRTL ? 'المنح' : '보조금', value: '15.4K', icon: TrendingUp, color: 'green' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colorClass = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            amber: 'bg-amber-50 border-amber-200 text-amber-600',
            pink: 'bg-pink-50 border-pink-200 text-pink-600',
            green: 'bg-green-50 border-green-200 text-green-600',
          };
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`${colorClass[stat.color as keyof typeof colorClass]} border rounded-lg p-6`}
            >
              <Icon className="w-8 h-8 mb-3 opacity-70" />
              <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Badges */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6">{isRTL ? 'الشارات' : '배지'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            const colorMap = {
              amber: 'text-amber-400 bg-amber-500/10',
              yellow: 'text-yellow-400 bg-yellow-500/10',
              purple: 'text-purple-400 bg-purple-500/10',
              pink: 'text-pink-400 bg-pink-500/10',
            };
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-700 transition-colors"
              >
                <div className={`${colorMap[badge.color as keyof typeof colorMap]} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-semibold">{badge.name}</h4>
                <p className="text-slate-400 text-xs mt-1">{badge.desc}</p>
                <p className="text-slate-500 text-xs mt-2">
                  {isRTL ? 'حصل عليها' : '획득한 사람'}: {badge.earnedBy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6">{isRTL ? 'الإنجازات' : '성취'}</h3>
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const rarityColors = {
              common: 'from-gray-400 to-gray-500',
              rare: 'from-blue-400 to-blue-500',
              epic: 'from-purple-400 to-purple-500',
              legendary: 'from-yellow-400 to-yellow-500',
            };
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ x: 4 }}
                className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`} />
                    <div>
                      <h4 className="text-white font-semibold">{achievement.name}</h4>
                      <p className="text-slate-400 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{achievement.unlocked}</p>
                    <p className="text-slate-400 text-xs">{achievement.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.percentage}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Leaderboard Rewards */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          {isRTL ? 'مكافآت الترتيب' : '순위표 보상'}
        </h3>
        <div className="space-y-3">
          {leaderboardRewards.map((item) => (
            <motion.div
              key={item.position}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    item.position === 1
                      ? 'bg-yellow-500'
                      : item.position === 2
                      ? 'bg-gray-400'
                      : item.position === 3
                      ? 'bg-orange-500'
                      : 'bg-slate-600'
                  }`}
                >
                  {item.position}
                </motion.div>
                <div>
                  <p className="text-white font-semibold">{item.name}</p>
                  <p className="text-slate-400 text-sm">{item.points} {isRTL ? 'نقطة' : '포인트'}</p>
                </div>
              </div>
              <span className="text-amber-400 font-semibold text-sm">{item.reward}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RewardsManagement;
