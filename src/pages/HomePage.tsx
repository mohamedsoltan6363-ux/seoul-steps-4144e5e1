import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const handleStart = () => navigate('/learn/1');
  const handleSignIn = () => navigate('/auth');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-[0.03]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Seoul</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Steps</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleSignIn}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-300"
            >
              {isRTL ? 'دخول' : '로그인'}
            </motion.button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 min-h-[calc(100vh-80px)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`flex flex-col gap-8 ${isRTL ? 'lg:order-2' : ''}`}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 w-fit"
              >
                <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                  <span className="text-sm font-semibold text-blue-300 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {isRTL ? 'تعلم ذكي' : '스마트 학습'}
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                  {isRTL ? (
                    <>تعلم اللغة <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">الكورية</span> بطريقة جديدة</>
                  ) : (
                    <>한국어를 <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">즐겁게</span> 배우세요</>
                  )}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-300 leading-relaxed max-w-lg"
              >
                {isRTL
                  ? 'منصة تعليمية متقدمة تجمع بين الدروس التفاعلية والألعاب والمسلسلات الكورية الحقيقية لتعلم اللغة الكورية من الصفر إلى الاحتراف.'
                  : '게임, 동영상, 드라마로 배우는 한국어 학습 플랫폼. 재미있고 효과적인 방법으로 한국어를 마스터하세요.'}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 overflow-hidden transition-all"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isRTL ? 'ابدأ الآن' : '지금 시작하기'}
                    <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  className="px-8 py-4 rounded-xl border-2 border-white/20 hover:border-white/40 text-white font-bold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
                >
                  {isRTL ? 'لدي حساب بالفعل' : '계정 로그인'}
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex gap-8 pt-4"
              >
                <div>
                  <div className="text-3xl font-bold text-white">6</div>
                  <div className="text-sm text-gray-400">{isRTL ? 'مستويات' : '레벨'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">20+</div>
                  <div className="text-sm text-gray-400">{isRTL ? 'ألعاب' : '게임'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">{isRTL ? 'متفاعل' : '상호작용'}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`relative h-[600px] ${isRTL ? 'lg:order-1' : ''}`}
            >
              {/* Left Image */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src="/images/hero-flags-left.jpg"
                  alt="Learning Korean"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src="/images/hero-flags-right.jpg"
                  alt="Master Korean"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">
                    {isRTL ? '5000+ متعلم' : '5000+ 학습자'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: isRTL ? 'دروس تفاعلية' : '대화형 레슨',
                description: isRTL ? 'تعلم من خلال بطاقات وفلاش كاردز تفاعلية' : '카드와 플래시카드로 배우세요',
              },
              {
                icon: Sparkles,
                title: isRTL ? 'ألعاب ممتعة' : '즐거운 게임',
                description: isRTL ? '20+ لعبة تعليمية ممتعة وتفاعلية' : '20개 이상의 교육용 게임',
              },
              {
                icon: Trophy,
                title: isRTL ? 'إنجازات' : '성취',
                description: isRTL ? 'اكسب شارات وإنجازات مع كل تقدم' : '뱃지와 보상을 획득하세요',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Footer CTA */}
        <section className="container mx-auto px-4 py-20 text-center border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {isRTL ? 'هل أنت مستعد للبدء؟' : '지금 바로 시작하세요'}
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              {isRTL ? 'انضم إلى آلاف المتعلمين الذين يتعلمون اللغة الكورية بطريقة ممتعة وفعالة'
                : '즐겁고 효과적인 방법으로 한국어를 배우세요'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 overflow-hidden transition-all"
            >
              {isRTL ? 'ابدأ التعلم الآن' : '지금 시작하기'}
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
