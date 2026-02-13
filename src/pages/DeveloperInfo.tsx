import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Code, Heart, Lightbulb, Target, BookOpen, Star } from 'lucide-react';

const DeveloperInfo: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const achievements = [
    {
      titleAr: 'متخصص في تطوير الويب',
      titleKo: 'Web開発のスペシャリスト',
      descAr: 'متخصص في تطوير تطبيقات ويب حديثة باستخدام أحدث التقنيات.',
      descKo: '最新のテクノロジーを使用した最新のWebアプリケーション開発に特化しています。',
      icon: Code,
    },
    {
      titleAr: 'مهندس برمجيات',
      titleKo: 'ソフトウェアエンジニア',
      descAr: 'هندسة الحلول البرمجية المتقدمة والمعقدة بكفاءة واحترافية.',
      descKo: '高度で複雑なソフトウェアソリューションをエンジニアリングします。',
      icon: Lightbulb,
    },
    {
      titleAr: 'عاشق التعليم',
      titleKo: '教育愛好家',
      descAr: 'يؤمن بقوة التكنولوجيا في تحويل التعليم وجعله ممتعاً وفعالاً.',
      descKo: 'テクノロジーの力で教育を変え、楽しく効果的にします。',
      icon: BookOpen,
    },
    {
      titleAr: 'عاشق الثقافة الكورية',
      titleKo: '韓国文化愛好家',
      descAr: 'معجب بالثقافة والفن والموسيقى الكورية. مبرمج وفنان في نفس الوقت.',
      descKo: '韓国文化、芸術、音楽の愛好家。プログラマーでありながらアーティストでもあります。',
      icon: Heart,
    },
    {
      titleAr: 'مبتكر ومبدع',
      titleKo: 'イノベーターとクリエイティブ',
      descAr: 'يسعى دائماً لإنشاء حلول مبتكرة وتجارب مستخدم فريدة.',
      descKo: 'つねにイノベーティブなソリューションとユニークなUXを作成することを目指しています。',
      icon: Target,
    },
    {
      titleAr: 'طموح ومتحمس',
      titleKo: '野心的で熱心',
      descAr: 'يؤمن ببناء منتجات ذات تأثير إيجابي على حياة المستخدمين.',
      descKo: 'ユーザーの生活にプラスの影響を与える製品を構築することを信じています。',
      icon: Star,
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
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Seoul Steps</span>
            </motion.div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-20">
          {/* Developer Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-300"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Code className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              {isRTL ? 'محمد عيدمان' : 'Mohamed Aidman'}
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              {isRTL ? 'مهندس تطوير ويب وبرمجيات' : 'Web & Software Engineer'}
            </p>
            <p className="text-lg text-gray-600 mb-2">
              {isRTL ? 'طالب بقسم تكنولوجيا المعلومات (ICT)' : 'Information Technology (ICT) Student'}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {isRTL ? 'الفرقة الأولى - جامعة بني سويف التكنولوجية' : '1st Year - Beni Suef Technological University'}
            </p>

            <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-400/10 border border-cyan-300/40 backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                {isRTL
                  ? '"Seoul Steps" هو حلم بدأ من رغبة في دمج الشغف بالتكنولوجيا والثقافة الكورية. أنا مؤمن بأن التعليم يجب أن يكون ممتعاً وفعالاً، وأن التكنولوجيا يمكن أن تغير طريقة تعلمنا للغات.'
                  : '"Seoul Steps"は、テクノロジーと韓国文化への情熱を組み合わせたいという願いから始まった夢です。教育は楽しく効果的であるべきであり、テクノロジーは言語学習の方法を変えることができると信じています。'}
              </p>
            </div>
          </motion.div>

          {/* Skills & Characteristics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
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
                      {isRTL ? achievement.titleAr : achievement.titleKo}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {isRTL ? achievement.descAr : achievement.descKo}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-400/10 border border-cyan-300/40 backdrop-blur-sm"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                {isRTL ? 'الرؤية' : 'ビジョン'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {isRTL
                  ? 'أسعى لخلق منصة تعليمية عالمية تجمع بين ملايين المتعلمين الشغوفين بتعلم اللغات والثقافات المختلفة. حيث يكون التعليم ممتعاً وفعالاً وقابلاً للوصول للجميع.'
                  : 'グローバルな教育プラットフォームを作成し、言語と文化の学習に情熱を持つ何百万もの学習者を結びつけることを目指しています。教育が楽しく、効果的で、すべての人が利用できるようにしたいのです。'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web3'].map((tech, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-sm font-semibold shadow-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <p className="text-lg text-gray-700 mb-6">
              {isRTL
                ? 'هل تشارك نفس الشغف؟ انضم إلى رحلة تعلم اللغة الكورية الممتعة والفريدة!'
                : '同じ情熱を共有していますか？楽しくユニークな韓国語学習の旅に参加しましょう！'}
            </p>
            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-blue-400 hover:shadow-xl transition-all"
            >
              {isRTL ? 'العودة للصفحة الرئيسية' : 'ホームページに戻る'}
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default DeveloperInfo;
