import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

const UserAnalytics: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const userStats = [
    {
      period: isRTL ? 'هذا الأسبوع' : '이번 주',
      newUsers: 127,
      activeUsers: 456,
      sessions: 1234,
      avgSessionTime: '23분'
    },
    {
      period: isRTL ? 'الأسبوع الماضي' : '지난 주',
      newUsers: 98,
      activeUsers: 389,
      sessions: 1089,
      avgSessionTime: '21분'
    },
    {
      period: isRTL ? 'هذا الشهر' : '이 달',
      newUsers: 547,
      activeUsers: 2156,
      sessions: 5234,
      avgSessionTime: '22분'
    },
  ];

  const userLevels = [
    { level: isRTL ? 'مبتدئ' : '초급', count: 1200, percentage: 47 },
    { level: isRTL ? 'متوسط' : '중급', count: 890, percentage: 35 },
    { level: isRTL ? 'متقدم' : '고급', count: 320, percentage: 13 },
    { level: isRTL ? 'خبير' : '전문가', count: 137, percentage: 5 },
  ];

  const topUsers = [
    { name: isRTL ? 'أحمد علي' : '김철수', level: isRTL ? 'متقدم' : '고급', points: 4520, streak: 15 },
    { name: isRTL ? 'فاطمة محمد' : '이수진', level: isRTL ? 'متقدم' : '고급', points: 4280, streak: 12 },
    { name: isRTL ? 'محمود إبراهيم' : '박민준', level: isRTL ? 'متوسط' : '중급', points: 3890, streak: 9 },
    { name: isRTL ? 'نور الدين' : '정지훈', level: isRTL ? 'متوسط' : '중급', points: 3650, streak: 7 },
    { name: isRTL ? 'ليلى حسن' : '최지은', level: isRTL ? 'مبتدئ' : '초급', points: 2340, streak: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* User Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <h3 className="text-white font-semibold mb-4">{stat.period}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'مستخدمون جدد' : '신규 사용자'}</span>
                <span className="text-blue-400 font-bold">{stat.newUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'نشط' : '활성'}</span>
                <span className="text-green-400 font-bold">{stat.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'جلسات' : '세션'}</span>
                <span className="text-purple-400 font-bold">{stat.sessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'متوسط الوقت' : '평균 시간'}</span>
                <span className="text-amber-400 font-bold">{stat.avgSessionTime}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Distribution by Level */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          {isRTL ? 'توزيع المستخدمين حسب المستوى' : '레벨별 사용자 분포'}
        </h3>
        <div className="space-y-4">
          {userLevels.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">{item.level}</span>
                <span className="text-slate-400 text-sm">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${
                    ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'][index]
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Users */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          {isRTL ? 'أفضل المستخدمين' : '상위 사용자'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'الاسم' : '이름'}
                </th>
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'المستوى' : '레벨'}
                </th>
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'النقاط' : '포인트'}
                </th>
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'متسلسل' : '스트릭'}
                </th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, index) => (
                <tr key={index} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 text-white">{user.name}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.level.includes(isRTL ? 'متقدم' : '고급')
                        ? 'bg-purple-500/20 text-purple-400'
                        : user.level.includes(isRTL ? 'متوسط' : '중급')
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.level}
                    </span>
                  </td>
                  <td className="py-4 text-amber-400 font-semibold">{user.points}</td>
                  <td className="py-4 flex items-center gap-1 text-green-400">
                    <Clock className="w-4 h-4" />
                    {user.streak}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserAnalytics;
