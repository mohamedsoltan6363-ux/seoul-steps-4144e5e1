import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Users, CheckCircle, AlertCircle } from 'lucide-react';

const TestsManagement: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const tests = [
    {
      id: 1,
      name: isRTL ? 'اختبار المبتدئين الأول' : '초급 레벨 1 테스트',
      level: isRTL ? 'مبتدئ' : '초급',
      totalTakers: 456,
      passRate: 78,
      avgScore: 74,
      questions: 20,
      duration: '30 دقائق'
    },
    {
      id: 2,
      name: isRTL ? 'اختبار المستوى المتوسط' : '중급 레벨 테스트',
      level: isRTL ? 'متوسط' : '중급',
      totalTakers: 234,
      passRate: 65,
      avgScore: 68,
      questions: 25,
      duration: '45 دقائق'
    },
    {
      id: 3,
      name: isRTL ? 'امتحان TOPIK التجريبي' : 'TOPIK 모의고사',
      level: isRTL ? 'متقدم' : '고급',
      totalTakers: 98,
      passRate: 82,
      avgScore: 82,
      questions: 50,
      duration: '120 دقائق'
    },
    {
      id: 4,
      name: isRTL ? 'اختبار المحادثة' : '회화 능력 테스트',
      level: isRTL ? 'متقدم' : '고급',
      totalTakers: 156,
      passRate: 73,
      avgScore: 76,
      questions: 10,
      duration: '20 دقائق'
    },
  ];

  const recentResults = [
    {
      user: isRTL ? 'أحمد علي' : '김철수',
      test: isRTL ? 'المبتدئين الأول' : '초급 레벨 1',
      score: 92,
      status: 'passed',
      date: '2 ساعة'
    },
    {
      user: isRTL ? 'فاطمة محمد' : '이수진',
      test: isRTL ? 'المستوى المتوسط' : '중급 레벨',
      score: 68,
      status: 'passed',
      date: '4 ساعات'
    },
    {
      user: isRTL ? 'محمود إبراهيم' : '박민준',
      test: isRTL ? 'المحادثة' : '회화 능력',
      score: 55,
      status: 'failed',
      date: '6 ساعات'
    },
    {
      user: isRTL ? 'نور الدين' : '정지훈',
      test: isRTL ? 'المبتدئين الأول' : '초급 레벨 1',
      score: 88,
      status: 'passed',
      date: '1 يوم'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tests Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isRTL ? 'إجمالي الاختبارات' : '총 테스트', value: '24', icon: BarChart3, color: 'blue' },
          { label: isRTL ? 'متلقو الاختبارات' : '응시한 사용자', value: '944', icon: Users, color: 'green' },
          { label: isRTL ? 'معدل النجاح' : '평균 합격률', value: '74.5%', icon: CheckCircle, color: 'purple' },
          { label: isRTL ? 'قيد الانتظار' : '진행 중', value: '12', icon: AlertCircle, color: 'amber' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colorMap = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            green: 'bg-green-50 border-green-200 text-green-600',
            purple: 'bg-purple-50 border-purple-200 text-purple-600',
            amber: 'bg-amber-50 border-amber-200 text-amber-600',
          };
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`${colorMap[stat.color as keyof typeof colorMap]} border rounded-lg p-6`}
            >
              <Icon className="w-8 h-8 mb-3 opacity-70" />
              <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tests List */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6">
          {isRTL ? 'قائمة الاختبارات' : '테스트 목록'}
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
                  {isRTL ? 'المتلقون' : '응시자'}
                </th>
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'معدل النجاح' : '합격률'}
                </th>
                <th className="text-left text-slate-400 py-3 text-sm font-semibold">
                  {isRTL ? 'المتوسط' : '평균'}
                </th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 text-white">{test.name}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                      {test.level}
                    </span>
                  </td>
                  <td className="py-4 text-slate-300">{test.totalTakers}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${test.passRate}%` }}
                        />
                      </div>
                      <span className="text-green-400 font-semibold text-sm">{test.passRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-amber-400 font-semibold">{test.avgScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Results */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-6">
          {isRTL ? 'النتائج الأخيرة' : '최근 결과'}
        </h3>
        <div className="space-y-4">
          {recentResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div>
                <p className="text-white font-medium">{result.user}</p>
                <p className="text-slate-400 text-sm">{result.test}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className={`font-bold text-lg ${result.status === 'passed' ? 'text-green-400' : 'text-red-400'}`}>
                  {result.score}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.status === 'passed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {result.status === 'passed' ? (isRTL ? 'نجح' : '통과') : (isRTL ? 'فشل' : '실패')}
                </span>
                <span className="text-slate-400 text-sm min-w-12">{result.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TestsManagement;
