import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Gamepad2, Target, Trophy, Zap, Users, Smile } from 'lucide-react';

const GamesInfo: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const games = [
    {
      titleAr: 'لعبة المطابقة',
      titleKo: 'マッチングゲーム',
      descAr: 'طابق الكلمات الكورية مع صورها أو معانيها. لعبة ممتعة وسريعة تحسن ذاكرتك.',
      descKo: '韓国語の単語を画像または定義と照合します。楽しく、高速で、記憶を改善します。',
      icon: Target,
    },
    {
      titleAr: 'لعبة الإملاء',
      titleKo: 'スペリングゲーム',
      descAr: 'استمع إلى الكلمة واكتبها بالصحة الإملائية الكورية الصحيحة.',
      descKo: '単語を聞いて、正しい韓国語のスペルで書きます。',
      icon: Zap,
    },
    {
      titleAr: 'لعبة الجملة',
      titleKo: '文章ゲーム',
      descAr: 'رتب الكلمات لتكوين جملة صحيحة. تحسن فهمك للنحو والهيكل اللغوي.',
      descKo: 'グラマーと言語構造の理解を向上させます。',
      icon: Smile,
    },
    {
      titleAr: 'لعبة الثقافة',
      titleKo: '文化ゲーム',
      descAr: 'تعرف على الثقافة الكورية من خلال أسئلة تفاعلية وتحديات ممتعة.',
      descKo: 'インタラクティブな質問と楽しいチャレンジを通じて韓国文化を学びます。',
      icon: Users,
    },
    {
      titleAr: 'لعبة التنافس',
      titleKo: '競争ゲーム',
      descAr: 'تنافس مع اللاعبين الآخرين وأثبت مهاراتك اللغوية. اكسب نقاط وشارات.',
      descKo: '他のプレイヤーと競い合い、言語スキルを証明します。ポイントとバッジを獲得しましょう。',
      icon: Trophy,
    },
    {
      titleAr: 'لعبة الاستماع',
      titleKo: 'リスニングゲーム',
      descAr: 'استمع إلى مقاطع فيديو قصيرة وأجب عن الأسئلة. حسّن مهارات الاستماع الخاصة بك.',
      descKo: '短いビデオクリップを聞いて、質問に答えます。リスニングスキルを向上させましょう。',
      icon: Gamepad2,
    },
  ];

  const benefits = [
    { titleAr: 'متعة التعلم', titleKo: '楽しい学習', descAr: 'تعلم اللغة لا يجب أن يكون ممل!' },
    { titleAr: 'تحفيز مستمر', titleKo: '継続的な動機付け', descAr: 'نظام النقاط والشارات يبقيك متحمس.' },
    { titleAr: 'تنافس صحي', titleKo: '健全な競争', descAr: 'تنافس مع أصدقائك وحول التعلم إلى مغامرة.' },
    { titleAr: 'تحسن سريع', titleKo: '迅速な進行', descAr: 'الألعاب التفاعلية تسرع من تحسنك.' },
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
                <Gamepad2 className="w-6 h-6 text-white" />
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
              {isRTL ? 'نظام الألعاب الممتع' : 'ゲームシステム'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isRTL
                ? '20+ لعبة تفاعلية وممتعة تحول التعلم إلى مغامرة شيقة. تعلم مع المرح!'
                : '20以上のインタラクティブなゲームで、学習を楽しい冒険に変えます。'}
            </p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/60 hover:border-cyan-400/80 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-cyan-300 transition-all">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {isRTL ? game.titleAr : game.titleKo}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {isRTL ? game.descAr : game.descKo}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
              {isRTL ? 'فوائد اللعب' : 'ゲームの利点'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/60 text-center hover:shadow-lg transition-all"
                >
                  <h4 className="font-bold text-gray-800 mb-2">
                    {isRTL ? benefit.titleAr : benefit.titleKo}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {benefit.descAr}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default GamesInfo;
