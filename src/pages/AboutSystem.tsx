import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Zap, Users, Globe, Target, Award } from 'lucide-react';

const AboutSystem: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const features = [
    {
      icon: BookOpen,
      titleAr: 'دروس تفاعلية',
      titleKo: '대화형 레슨',
      descAr: 'دروس مصممة بعناية تجمع بين النظرية والممارسة العملية. كل درس يحتوي على شرح واضح وتمارين تفاعلية.',
      descKo: '이론과 실습을 결합한 신중하게 설계된 레슨. 각 레슨에는 명확한 설명과 대화형 연습이 포함됩니다.',
    },
    {
      icon: Zap,
      titleAr: 'تعلم سريع وفعال',
      titleKo: '빠르고 효과적인 학습',
      descAr: 'نظام متقدم يتابع تقدمك ويقدم لك المحتوى المناسب في الوقت المناسب لتحقيق أقصى فائدة.',
      descKo: '당신의 진도를 추적하고 최대 이점을 위해 적절한 시간에 콘텐츠를 제공하는 고급 시스템.',
    },
    {
      icon: Users,
      titleAr: 'مجتمع تعليمي',
      titleKo: '학습 커뮤니티',
      descAr: 'تواصل مع متعلمين آخرين، شارك تجاربك، واستفد من خبرات الآخرين في نفس الرحلة التعليمية.',
      descKo: '다른 학습자들과 소통하고 경험을 공유하며 같은 학습 여정에서 다른 사람들의 전문 지식을 활용하세요.',
    },
    {
      icon: Globe,
      titleAr: 'محتوى عالمي',
      titleKo: '글로벌 콘텐츠',
      descAr: 'محتوى حقيقي من المسلسلات والأفلام والموسيقى الكورية لتعلم اللغة بطريقة طبيعية وممتعة.',
      descKo: '한국 드라마, 영화, 음악의 실제 콘텐츠로 자연스럽고 재미있는 방식으로 언어를 배우세요.',
    },
    {
      icon: Target,
      titleAr: 'أهداف واضحة',
      titleKo: '명확한 목표',
      descAr: 'كل مستوى له أهداف محددة وواضحة تساعدك على قياس تقدمك وتحفزك للاستمرار.',
      descKo: '각 레벨에는 명확한 목표가 있어 진도를 측정하고 계속 진행하도록 동기를 부여합니다.',
    },
    {
      icon: Award,
      titleAr: 'شهادات وجوائز',
      titleKo: '인증서 및 상',
      descAr: 'احصل على شهادات معتمدة وجوائز عند إكمالك لكل مستوى تعليمي.',
      descKo: '각 교육 수준을 완료할 때 인증서 및 상을 받으세요.',
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

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              {isRTL ? 'عن نظام Seoul Steps' : 'Seoul Stepsについて'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isRTL
                ? 'منصة تعليمية ثورية تجمع بين التكنولوجيا الحديثة والمحتوى الثقافي الحقيقي لتعلم اللغة الكورية بطريقة ممتعة وفعالة.'
                : '최신 기술과 실제 문화 콘텐츠를 결합하여 즐겁고 효과적인 한국어 학습 플랫폼'}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
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
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-cyan-300 transition-all">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {isRTL ? feature.titleAr : feature.titleKo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {isRTL ? feature.descAr : feature.descKo}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-400/10 border border-cyan-300/40 backdrop-blur-sm"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                {isRTL ? 'رسالتنا' : '私たちのミッション'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {isRTL
                  ? 'نؤمن أن تعلم اللغة يجب أن يكون ممتعاً وفعالاً في نفس الوقت. من خلال دمج التكنولوجيا المتقدمة مع المحتوى الثقافي الحقيقي، نهدف إلى إنشاء جيل جديد من المتعلمين المتحمسين الذين يشعرون بالاتصال الحقيقي مع اللغة والثقافة الكورية.'
                  : '言語学習は楽しく、効果的であるべきだと信じています。最先端のテクノロジーと実際の文化的コンテンツを統合することで、韓国語と韓国文化への本当のつながりを感じる、熱心な学習者の新世代を創造することを目指しています。'}
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutSystem;
