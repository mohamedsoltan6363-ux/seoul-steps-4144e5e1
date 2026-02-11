import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

const LevelsManagement: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isAdding, setIsAdding] = useState(false);

  const levels = [
    {
      id: 1,
      name: isRTL ? 'مبتدئ' : '초급',
      description: isRTL ? 'للمبتدئين تماماً' : '완전한 초보자 수준',
      lessons: 15,
      users: 1200,
      completionRate: 78,
      status: 'active'
    },
    {
      id: 2,
      name: isRTL ? 'متوسط' : '중급',
      description: isRTL ? 'للمتعلمين الوسيطين' : '중급 학습자 수준',
      lessons: 20,
      users: 890,
      completionRate: 65,
      status: 'active'
    },
    {
      id: 3,
      name: isRTL ? 'متقدم' : '고급',
      description: isRTL ? 'للمتقدمين' : '고급 수준',
      lessons: 18,
      users: 320,
      completionRate: 82,
      status: 'active'
    },
    {
      id: 4,
      name: isRTL ? 'خبير' : '전문가',
      description: isRTL ? 'للخبراء والمتقنين' : '전문가 수준',
      lessons: 12,
      users: 137,
      completionRate: 91,
      status: 'active'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Add Level Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAdding(!isAdding)}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
      >
        <Plus className="w-5 h-5" />
        {isRTL ? 'إضافة مستوى جديد' : '새 레벨 추가'}
      </motion.button>

      {/* Add Level Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-white font-semibold mb-4">
            {isRTL ? 'إضافة مستوى جديد' : '새 레벨 추가'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={isRTL ? 'اسم المستوى' : '레벨 이름'}
              className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400"
            />
            <input
              type="text"
              placeholder={isRTL ? 'الوصف' : '설명'}
              className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400"
            />
            <input
              type="number"
              placeholder={isRTL ? 'عدد الدروس' : '레슨 수'}
              className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Save className="w-5 h-5" />
              {isRTL ? 'حفظ' : '저장'}
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              {isRTL ? 'إلغاء' : '취소'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => (
          <motion.div
            key={level.id}
            whileHover={{ y: -4 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">{level.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{level.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-700 rounded text-blue-400 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-700 rounded text-red-400 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'الدروس' : '레슨'}</span>
                <span className="text-white font-semibold">{level.lessons}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isRTL ? 'المستخدمون' : '사용자'}</span>
                <span className="text-white font-semibold">{level.users}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">{isRTL ? 'معدل الإنجاز' : '완료율'}</span>
                  <span className="text-green-400 font-semibold">{level.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level.completionRate}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  />
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  level.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {level.status === 'active' ? (isRTL ? 'نشط' : '활성') : (isRTL ? 'معطل' : '비활성')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LevelsManagement;
