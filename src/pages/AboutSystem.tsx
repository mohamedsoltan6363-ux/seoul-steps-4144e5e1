import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, Users, Target, Lightbulb, Shield, Globe, ChevronRight, Sparkles } from 'lucide-react';

const AboutSystem: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-blue-50 to-cyan-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-cyan-200/30 backdrop-blur-sm bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Seoul Steps</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md hover:shadow-lg transition-all"
            whileHover={{ y: -2 }}
          >
            {isRTL ? 'الرجوع' : '戻る'}
          </motion.button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4">
        {/* Hero Text Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="inline-block mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-300"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              {isRTL ? 'ما هو Seoul Steps؟' : 'Seoul Steps'}
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {isRTL
                ? 'منصة تعليمية ثورية تجمع بين الذكاء الاصطناعي والألعاب المبتكرة والمحتوى الثقافي الحقيقي لإحداث تحول في طريقة تعلمك للغة الكورية'
                : 'AIと革新的なゲーム、本物の文化コンテンツを組み合わせて、韓国語学習を革新するプラットフォーム'}
            </p>
          </motion.div>
        </section>

        {/* Mission & Vision - Large Cards */}
        <section className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative p-10 rounded-3xl bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-2xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-800">
                    {isRTL ? 'رسالتنا' : 'ミッション'}
                  </h2>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {isRTL
                  ? 'تمكين ملايين المتعلمين العرب من إتقان اللغة الكورية من خلال منصة تعليمية آمنة وممتعة وفعالة وسهلة الاستخدام'
                  : 'アラブ学習者が安全で楽しく効果的に韓国語をマスターできるプラットフォームを提供'}
              </p>
              <div className="mt-8 space-y-4">
                {[
                  isRTL ? 'توفير محتوى ثقافي حقيقي' : '本物の文化コンテンツの提供',
                  isRTL ? 'تعليم تفاعلي وممتع' : 'インタラクティブで楽しい教育',
                  isRTL ? 'بيئة آمنة وموثوقة' : '安全で信頼できる環境',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative p-10 rounded-3xl bg-white/80 backdrop-blur-sm border border-amber-200/60 shadow-2xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-800">
                    {isRTL ? 'رؤيتنا' : 'ビジョン'}
                  </h2>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {isRTL
                  ? 'أن نصبح الجسر الثقافي الأول الذي يربط بين العالم العربي والثقافة الكورية على مستوى عالمي'
                  : '世界中のアラブ学習者を韓国文化とつなぐ文化的橋になること'}
              </p>
              <div className="mt-8 space-y-4">
                {[
                  isRTL ? 'نشر الثقافة الكورية في العالم العربي' : '韓国文化をアラブ世界に広める',
                  isRTL ? 'بناء مجتمع عالمي من المتعلمين' : 'グローバル学習コミュニティの構築',
                  isRTL ? 'تحقيق الامتياز في التعليم' : '教育の卓越性を達成',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Core Features - Horizontal Scrollable Cards */}
        <section className="py-20">
          <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">
            {isRTL ? 'المميزات الأساسية' : 'コア機能'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: isRTL ? 'تفاعلي 100%' : '100% インタラクティブ', desc: isRTL ? 'تعلم من خلال الألعاب المبتكرة والتمارين التفاعلية الممتعة' : 'ゲームを通じた楽しい学習' },
              { icon: Users, title: isRTL ? 'مجتمع نشط' : 'アクティブコミュニティ', desc: isRTL ? 'تفاعل مع آلاف المتعلمين وشارك تجاربك' : '学習者とのコミュニティ交流' },
              { icon: Shield, title: isRTL ? 'آمن وموثوق' : '安全で信頼できる', desc: isRTL ? 'بيئة آمنة خالية من الإعلانات المزعجة' : '広告なしの安全な環境' },
              { icon: Globe, title: isRTL ? 'محتوى حقيقي' : '本物のコンテンツ', desc: isRTL ? 'مسلسلات وموسيقى وثقافة كورية حقيقية' : '本物の韓国ドラマと音楽' },
              { icon: Target, title: isRTL ? 'أهداف واضحة' : '明確な目標', desc: isRTL ? '6 مستويات متدرجة مع أهداف محددة' : '6つのレベルで段階的に学習' },
              { icon: Sparkles, title: isRTL ? 'تعلم ذكي' : 'スマート学習', desc: isRTL ? 'نظام متقدم يتابع تقدمك ويقدم لك ما تحتاجه' : 'あなたの進度に合わせたカスタマイズ学習' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15 }}
                  className="group p-8 rounded-3xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/40 shadow-lg hover:shadow-2xl hover:shadow-blue-300/20 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '5,000+', label: isRTL ? 'متعلم' : '学習者' },
              { num: '6', label: isRTL ? 'مستويات' : 'レベル' },
              { num: '20+', label: isRTL ? 'لعبة' : 'ゲーム' },
              { num: '4.9★', label: isRTL ? 'تقييم' : '評価' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm border border-amber-200/40"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {stat.num}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-8">
              {isRTL ? 'هل أنت مستعد للانضمام؟' : 'さあ、始めましょう'}
            </h2>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ y: -5 }}
              className="px-12 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-blue-300/50 hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
            >
              {isRTL ? 'ابدأ الآن' : '今すぐ始める'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutSystem;
