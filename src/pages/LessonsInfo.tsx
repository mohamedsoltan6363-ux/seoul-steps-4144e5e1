import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Layers, Clock, Zap, Brain, Star } from 'lucide-react';

const LessonsInfo: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const levels = [
    {
      level: 1,
      titleAr: 'المستوى الأول: الأساسيات',
      titleKo: 'レベル1：基礎',
      descAr: 'تعلم الأحرف الكورية (الهانغول) وأساسيات النطق والكلمات الأساسية.',
      descKo: 'ハングル（韓国語の文字）、基本的な発音、および基本的な単語を学習します。',
      topics: ['الهانغول', 'النطق الأساسي', 'التحيات', 'الأرقام'],
    },
    {
      level: 2,
      titleAr: 'المستوى الثاني: المحادثات البسيطة',
      titleKo: 'レベル2：シンプルな会話',
      descAr: 'تطوير مهارات المحادثة البسيطة والجمل الأساسية في الحياة اليومية.',
      descKo: '基本的な日常会話と文法を学習します。',
      topics: ['الجمل البسيطة', 'الحوار اليومي', 'الأسئلة والأجوبة', 'المشاعر'],
    },
    {
      level: 3,
      titleAr: 'المستوى الثالث: المحادثات المتوسطة',
      titleKo: 'レベル3：中レベルの会話',
      descAr: 'محادثات أكثر تعقيداً وفهم السياقات المختلفة وثقافة الحياة الكورية.',
      descKo: 'より複雑な会話と韓国の日常生活文化を学習します。',
      topics: ['المحادثات المعقدة', 'الثقافة الكورية', 'الأفلام والدراما', 'الموسيقى'],
    },
  ];

  const features = [
    {
      icon: Brain,
      titleAr: 'تعلم ذكي',
      titleKo: 'スマート学習',
      descAr: 'خوارزمية ذكية تتكيف مع سرعة تعلمك وتقدم المحتوى المناسب.',
    },
    {
      icon: Clock,
      titleAr: 'دروس قصيرة',
      titleKo: '短いレッスン',
      descAr: 'كل درس يستغرق 5-15 دقيقة فقط، مثالي للتعلم السريع.',
    },
    {
      icon: Zap,
      titleAr: 'تقدم سريع',
      titleKo: '高速進行',
      descAr: 'نتقدم من المستوى المبتدئ إلى المتقدم في وقت قياسي.',
    },
    {
      icon: Star,
      titleAr: 'مكافآت وشارات',
      titleKo: '報酬とバッジ',
      descAr: 'احصل على شارات وجوائز عند إكمال الدروس بنجاح.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-blue-50 to-cyan-50 overflow-hidden relative">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-200/30 backdrop-blur-sm bg-white/60 sticky top-0">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Seoul Steps</span>
            </motion.div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              {isRTL ? 'نظام الدروس' : 'レッスンシステム'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isRTL
                ? 'منهاج شامل ومنظم يأخذك من المستوى المبتدئ إلى الاحترافي عبر 6 مستويات متدرجة.'
                : '初心者から上級者まで、6つのレベルを通じて段階的に学習します。'}
            </p>
          </motion.div>

          {/* Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {levels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/60 hover:border-cyan-400/80 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {level.level}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {isRTL ? level.titleAr : level.titleKo}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {isRTL ? level.descAr : level.descKo}
                </p>
                <div className="space-y-2">
                  {level.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      {topic}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/60 hover:shadow-lg transition-all text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    {isRTL ? feature.titleAr : feature.titleKo}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isRTL ? feature.descAr : feature.descKo}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LessonsInfo;
