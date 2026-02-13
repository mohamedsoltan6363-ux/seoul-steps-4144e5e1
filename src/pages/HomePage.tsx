import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Gamepad2, Play, Info, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const handleStart = () => navigate('/onboarding');
  const handleSignIn = () => navigate('/auth');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-blue-50 to-cyan-50 overflow-hidden relative">
      {/* Decorative animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles - light blues and warm tones */}
        <motion.div
          className="absolute top-10 right-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Floating decorative elements - geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-300 to-cyan-300 opacity-40"
          animate={{
            y: [0, 20, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-300 opacity-30"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-40 right-1/3 w-16 h-16 rounded-full border-4 border-blue-200/40 opacity-20"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-200/30 backdrop-blur-sm bg-white/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-200">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Seoul Steps</span>
            </motion.div>

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex items-center gap-8"
            >
              {[
                { label: isRTL ? 'عن النظام' : 'システム', icon: Info, path: '/about-system' },
                { label: isRTL ? 'الدروس' : 'レッスン', icon: BookOpen, path: '/lessons-info' },
                { label: isRTL ? 'الألعاب' : 'ゲーム', icon: Gamepad2, path: '/games-info' },
                { label: isRTL ? 'عن المبرمج' : '開発者', icon: User, path: '/developer' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors group cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.button>
                );
              })}
            </motion.nav>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={handleSignIn}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-300/50 transition-all duration-300 shadow-md shadow-blue-200"
            >
              {isRTL ? 'دخول' : '로그인'}
            </motion.button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 min-h-[calc(100vh-120px)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className={`flex flex-col gap-6 ${isRTL ? 'lg:order-2' : ''}`}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-fit"
              >
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-300/30 to-cyan-300/30 border border-cyan-300/60 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {isRTL ? 'تعلم جديد وممتع' : '새로운 학습 방법'}
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight text-balance">
                  {isRTL ? (
                    <>تعلم <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">اللغة الكورية</span> بطريقة <span className="text-amber-600">جديدة</span></>
                  ) : (
                    <>한국어를 배우는 <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">새로운 방법</span></>
                  )}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="text-lg text-gray-600 leading-relaxed max-w-lg"
              >
                {isRTL
                  ? 'منصة تعليمية تفاعلية تجمع بين الدروس والألعاب والمسلسلات الكورية الحقيقية. تعلم بسهولة ومتعة من الصفر إلى الاحتراف!'
                  : '게임, 동영상, 드라마로 배우는 즐거운 한국어 학습 플랫폼. 효과적이고 재미있는 방법으로 한국어를 마스터하세요!'}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-base shadow-lg shadow-blue-300 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isRTL ? 'ابدأ الآن' : '지금 시작하기'}
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  className="px-8 py-4 rounded-xl border-2 border-blue-400 text-blue-700 font-bold text-base bg-white/70 hover:bg-white transition-all duration-300 shadow-md shadow-blue-200/50"
                >
                  {isRTL ? 'تسجيل الدخول' : '로그인'}
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6 }}
                className="flex gap-12 pt-8 border-t border-blue-200/40"
              >
                <div>
                  <div className="text-3xl font-bold text-blue-700">6</div>
                  <div className="text-sm text-gray-600">{isRTL ? 'مستويات تعليمية' : '학습 단계'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-700">20+</div>
                  <div className="text-sm text-gray-600">{isRTL ? 'ألعاب تفاعلية' : '상호작용 게임'}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">100%</div>
                  <div className="text-sm text-gray-600">{isRTL ? 'آمن وممتع' : '안전하고 재미있음'}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Cultural Bridge Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className={`relative h-[500px] lg:h-[600px] ${isRTL ? 'lg:order-1' : ''}`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Main illustration - Cultural Bridge */}
                <motion.div
                  className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-300/40"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cultural_bridge_illustration_20260209_044837-kOfk11bha2Co6QfDutPY3WKt0HbGxr.png"
                    alt="Egyptian-Korean Cultural Bridge"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent" />
                </motion.div>

                {/* Floating badges around the illustration */}
                <motion.div
                  className="absolute -top-5 -left-5 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-sm font-bold text-blue-700 flex items-center gap-2">
                    <span className="text-lg">🇪🇬</span>
                    {isRTL ? 'مصر' : 'Egypt'}
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-5 -right-5 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-cyan-200"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="text-sm font-bold text-cyan-700 flex items-center gap-2">
                    <span className="text-lg">🇰🇷</span>
                    {isRTL ? 'كوريا' : 'Korea'}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Character Images - Bottom of Hero */}
          <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-12 px-4 pointer-events-none">
            {/* Egyptian Flag Image - Left */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className={`relative ${isRTL ? 'order-2' : 'order-1'}`}
            >
              <motion.img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_swap_egyptian_flag_mirrored_1-removebg-preview-MNDdurpGtaLMKBafGvSV2AEHhfT6Tm.png"
                alt="Egyptian Flag Character"
                className="h-40 object-contain drop-shadow-2xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Korean Flag Image - Right */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className={`relative ${isRTL ? 'order-1' : 'order-2'}`}
            >
              <motion.img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_swap_korean_flag_1__1_-removebg-preview%20%281%29-j2BrfggTfr00iZE1WbJxiPurkKMhgJ.png"
                alt="Korean Flag Character"
                className="h-40 object-contain drop-shadow-2xl"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Personal Images Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {isRTL ? 'تعلم مع مطورك' : 'Your Learning Journey'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isRTL ? 'انضم إلى مطور المنصة في رحلة تعلم اللغة الكورية الممتعة' : 'Join the developer in a fun Korean learning experience'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Egyptian Flag Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-blue-200 h-96 bg-gradient-to-br from-amber-100 to-blue-100">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_swap_egyptian_flag_mirrored_1-removebg-preview-MNDdurpGtaLMKBafGvSV2AEHhfT6Tm.png"
                  alt="Egyptian Flag"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.h3
                className="mt-4 text-xl font-bold text-gray-800 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isRTL ? '🇪🇬 مصري بفخر' : '🇪🇬 Proudly Egyptian'}
              </motion.h3>
            </motion.div>

            {/* Korean Flag Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-cyan-200 h-96 bg-gradient-to-br from-blue-100 to-cyan-100">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_swap_korean_flag_1__1_-removebg-preview%20%281%29-j2BrfggTfr00iZE1WbJxiPurkKMhgJ.png"
                  alt="Korean Flag"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-cyan-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.h3
                className="mt-4 text-xl font-bold text-gray-800 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isRTL ? '🇰🇷 عاشق للكوريا' : '🇰🇷 Korea Lover'}
              </motion.h3>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: BookOpen,
                title: isRTL ? 'دروس تفاعلية' : '대화형 레슨',
                description: isRTL ? 'تعلم من خلال بطاقات وفلاش كاردز تفاعلية وممتعة' : '카드와 플래시카드로 즐겁게 배우세요',
              },
              {
                icon: Gamepad2,
                title: isRTL ? 'ألعاب ممتعة' : '즐거운 게임',
                description: isRTL ? '20+ لعبة تعليمية مبتكرة وممتعة جداً' : '20개 이상의 혁신적인 교육용 게임',
              },
              {
                icon: Play,
                title: isRTL ? 'مسلسلات حقيقية' : '실제 드라마',
                description: isRTL ? 'شاهد مسلسلات كورية حقيقية مترجمة' : '실제 한국 드라마로 배우기',
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
                  className="group p-8 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/60 hover:border-cyan-400/80 hover:shadow-xl hover:shadow-cyan-200/40 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-300 group-hover:shadow-cyan-300 transition-all">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Call to Action Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-20" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            <div className="relative z-10 px-8 py-16 text-center md:px-12 md:py-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {isRTL ? 'هل أنت مستعد للبدء؟' : 'সমঝ করেন কি?'}
              </h2>
              <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                {isRTL ? 'انضم إلى آلاف المتعلمين في رحلة تعلم اللغة الكورية الممتعة والفعالة'
                  : '수천 명의 학습자와 함께 재미있고 효과적인 한국어 여행을 시작하세요'}
              </p>
              <motion.button
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-blue-400 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                {isRTL ? 'ابدأ الآن مجاناً' : '지금 무료로 시작'}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-200/40 bg-white/40 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">{isRTL ? 'عن النظام' : '시스템 정보'}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isRTL ? 'منصة Seoul Steps لتعلم اللغة الكورية مصممة خصيصاً للمتعلمين العرب برهبة وإبداع.'
                    : 'Seoul Steps - 아랍 학습자를 위한 혁신적인 한국어 학습 플랫폼'}
                </p>
              </div>

              {/* Developer Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">{isRTL ? 'المطور' : '개발자'}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>{isRTL ? 'محمد عيدمان' : 'Mohamed Aidman'}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {isRTL ? 'مهندس تطوير ويب وبرمجيات' : '웹 및 소프트웨어 개발 엔지니어'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {isRTL ? 'طالب بقسم تكنولوجيا المعلومات، الفرقة الأولى'
                    : 'IT 학과 1학년 학생'}
                </p>
              </div>

              {/* University Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">{isRTL ? 'الجامعة' : '대학'}</h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>{isRTL ? 'جامعة بني سويف التكنولوجية' : '벤이수이프 과학기술대학교'}</strong>
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  {isRTL ? 'محافظة بني سويف، جمهورية مصر العربية'
                    : '이집트 벤이수이프 주'}
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>{isRTL ? 'رئيس الجامعة:' : '총장:'}</strong> {isRTL ? 'د. جان هنري حنا' : 'Dr. Jan Henry Hanna'}</p>
                  <p><strong>{isRTL ? 'نائب الرئيس:' : '부총장:'}</strong> {isRTL ? 'د. محمد علي مراد' : 'Dr. Mohamed Ali Mourad'}</p>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-blue-200/30 pt-8 text-center">
              <p className="text-sm text-gray-600">
                {isRTL ? '© 2025 Seoul Steps - جميع الحقوق محفوظة'
                  : '© 2025 Seoul Steps - All Rights Reserved'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {isRTL ? 'تم تطويره بـ ❤️ للتعليم والابتكار'
                  : 'Developed with ❤️ for Education & Innovation'}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
