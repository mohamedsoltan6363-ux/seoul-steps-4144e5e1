import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, ChevronDown, ChevronUp, 
  Volume2, Sparkles, CheckCircle2, Heart, Star
} from 'lucide-react';

interface GrammarRule {
  id: string;
  title: { ar: string; ko: string };
  description: { ar: string; ko: string };
  pattern: string;
  examples: { korean: string; romanized: string; arabic: string }[];
  tips: { ar: string; ko: string }[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

const grammarRules: GrammarRule[] = [
  {
    id: '1',
    title: { ar: 'أداة الموضوع 은/는', ko: '주격 조사 은/는' },
    description: { 
      ar: 'تُستخدم 은/는 لتحديد موضوع الجملة. نستخدم 은 بعد حرف ساكن و는 بعد حرف متحرك.',
      ko: '은/는은 문장의 주제를 나타냅니다. 받침이 있으면 은, 없으면 는을 사용합니다.'
    },
    pattern: '[اسم] + 은/는',
    examples: [
      { korean: '저는 학생이에요', romanized: 'Jeo-neun hak-saeng-i-e-yo', arabic: 'أنا طالب' },
      { korean: '날씨는 좋아요', romanized: 'Nal-ssi-neun jo-a-yo', arabic: 'الطقس جميل' },
      { korean: '이것은 책이에요', romanized: 'I-geo-seun chaeg-i-e-yo', arabic: 'هذا كتاب' }
    ],
    tips: [
      { ar: 'استخدم 은 بعد الحروف الساكنة مثل: 책은, 밥은', ko: '받침 있으면 은: 책은, 밥은' },
      { ar: 'استخدم 는 بعد الحروف المتحركة مثل: 나는, 커피는', ko: '받침 없으면 는: 나는, 커피는' }
    ],
    level: 'beginner'
  },
  {
    id: '2',
    title: { ar: 'أداة الفاعل 이/가', ko: '주격 조사 이/가' },
    description: { 
      ar: 'تُستخدم 이/가 لتحديد الفاعل. نستخدم 이 بعد حرف ساكن و가 بعد حرف متحرك.',
      ko: '이/가는 주어를 나타냅니다. 받침이 있으면 이, 없으면 가를 사용합니다.'
    },
    pattern: '[فاعل] + 이/가',
    examples: [
      { korean: '비가 와요', romanized: 'Bi-ga wa-yo', arabic: 'المطر ينزل' },
      { korean: '친구가 왔어요', romanized: 'Chin-gu-ga wa-sseo-yo', arabic: 'الصديق جاء' },
      { korean: '물이 필요해요', romanized: 'Mul-i pil-yo-hae-yo', arabic: 'أحتاج ماء' }
    ],
    tips: [
      { ar: 'الفرق: 은/는 للموضوع العام، 이/가 للفاعل المحدد', ko: '은/는는 주제, 이/가는 주어를 나타냅니다' },
      { ar: 'مع الأسئلة نستخدم 이/가 غالباً', ko: '질문에는 주로 이/가를 사용합니다' }
    ],
    level: 'beginner'
  },
  {
    id: '3',
    title: { ar: 'أداة المفعول به 을/를', ko: '목적격 조사 을/를' },
    description: { 
      ar: 'تُستخدم 을/를 لتحديد المفعول به. نستخدم 을 بعد حرف ساكن و를 بعد حرف متحرك.',
      ko: '을/를은 목적어를 나타냅니다.'
    },
    pattern: '[مفعول] + 을/를 + فعل',
    examples: [
      { korean: '밥을 먹어요', romanized: 'Bap-eul meog-eo-yo', arabic: 'آكل الأرز' },
      { korean: '한국어를 배워요', romanized: 'Han-gug-eo-reul bae-wo-yo', arabic: 'أتعلم الكورية' },
      { korean: '책을 읽어요', romanized: 'Chaeg-eul ilg-eo-yo', arabic: 'أقرأ كتاباً' }
    ],
    tips: [
      { ar: 'كل فعل متعدٍ يحتاج مفعولاً به مع 을/를', ko: '타동사는 항상 목적어와 함께 사용합니다' }
    ],
    level: 'beginner'
  },
  {
    id: '4',
    title: { ar: 'أداة المكان/الاتجاه 에', ko: '장소/방향 조사 에' },
    description: { 
      ar: 'تُستخدم 에 للإشارة إلى المكان أو الوجهة أو الوقت.',
      ko: '에는 장소, 방향, 시간을 나타냅니다.'
    },
    pattern: '[مكان/وقت] + 에',
    examples: [
      { korean: '학교에 가요', romanized: 'Hak-gyo-e ga-yo', arabic: 'أذهب إلى المدرسة' },
      { korean: '집에 있어요', romanized: 'Jib-e iss-eo-yo', arabic: 'أنا في البيت' },
      { korean: '세 시에 만나요', romanized: 'Se si-e man-na-yo', arabic: 'نلتقي الساعة 3' }
    ],
    tips: [
      { ar: '에 للمكان الثابت والوجهة', ko: '에는 정적인 장소나 목적지에 사용' },
      { ar: '에서 للمكان الذي يحدث فيه فعل', ko: '에서는 동작이 일어나는 장소에 사용' }
    ],
    level: 'beginner'
  },
  {
    id: '5',
    title: { ar: 'الزمن الماضي 았/었어요', ko: '과거 시제 았/었어요' },
    description: { 
      ar: 'لتحويل الفعل للماضي، نضيف 았어요 أو 었어요 حسب آخر حرف متحرك في جذر الفعل.',
      ko: '과거 시제는 어간에 았어요/었어요를 붙여 만듭니다.'
    },
    pattern: '[جذر الفعل] + 았/었어요',
    examples: [
      { korean: '먹었어요', romanized: 'Meog-eoss-eo-yo', arabic: 'أكلت' },
      { korean: '갔어요', romanized: 'Gass-eo-yo', arabic: 'ذهبت' },
      { korean: '공부했어요', romanized: 'Gong-bu-haess-eo-yo', arabic: 'درست' }
    ],
    tips: [
      { ar: 'إذا كان آخر حرف متحرك ㅏ أو ㅗ استخدم 았어요', ko: 'ㅏ, ㅗ → 았어요' },
      { ar: 'لباقي الحروف المتحركة استخدم 었어요', ko: '그 외 → 었어요' }
    ],
    level: 'intermediate'
  },
  {
    id: '6',
    title: { ar: 'الزمن المستقبل ㄹ/을 거예요', ko: '미래 시제 ㄹ/을 거예요' },
    description: { 
      ar: 'للتعبير عن المستقبل أو النية، نضيف ㄹ/을 거예요 لجذر الفعل.',
      ko: '미래 시제나 의도를 표현할 때 ㄹ/을 거예요를 사용합니다.'
    },
    pattern: '[جذر الفعل] + ㄹ/을 거예요',
    examples: [
      { korean: '갈 거예요', romanized: 'Gal geo-ye-yo', arabic: 'سأذهب' },
      { korean: '먹을 거예요', romanized: 'Meog-eul geo-ye-yo', arabic: 'سآكل' },
      { korean: '공부할 거예요', romanized: 'Gong-bu-hal geo-ye-yo', arabic: 'سأدرس' }
    ],
    tips: [
      { ar: 'إذا انتهى الجذر بحرف متحرك، أضف ㄹ 거예요', ko: '받침 없으면 ㄹ 거예요' },
      { ar: 'إذا انتهى بحرف ساكن، أضف 을 거예요', ko: '받침 있으면 을 거예요' }
    ],
    level: 'intermediate'
  },
  {
    id: '7',
    title: { ar: 'أداة "مع" 와/과، 하고، (이)랑', ko: '함께 조사 와/과, 하고, (이)랑' },
    description: { 
      ar: 'هذه الأدوات تُستخدم للربط بمعنى "مع" أو "و".',
      ko: '"와/과", "하고", "(이)랑"은 "with" 또는 "and"를 의미합니다.'
    },
    pattern: '[اسم] + 와/과 أو 하고 أو (이)랑',
    examples: [
      { korean: '친구와 영화 봤어요', romanized: 'Chin-gu-wa yeong-hwa bwass-eo-yo', arabic: 'شاهدت فيلماً مع صديقي' },
      { korean: '빵하고 우유', romanized: 'Ppang-ha-go u-yu', arabic: 'خبز وحليب' },
      { korean: '엄마랑 쇼핑했어요', romanized: 'Eom-ma-rang syo-ping-haess-eo-yo', arabic: 'تسوقت مع أمي' }
    ],
    tips: [
      { ar: 'و/과 رسمية، ه고عادية، (이)랑 غير رسمية', ko: '와/과 공식, 하고 일반, (이)랑 비공식' }
    ],
    level: 'intermediate'
  },
  {
    id: '8',
    title: { ar: 'التعبير عن الرغبة 고 싶다', ko: '희망 표현 고 싶다' },
    description: { 
      ar: 'للتعبير عن الرغبة "أريد أن..."، نضيف 고 싶어요 لجذر الفعل.',
      ko: '"~하고 싶다"는 원하는 것을 표현합니다.'
    },
    pattern: '[جذر الفعل] + 고 싶어요',
    examples: [
      { korean: '한국에 가고 싶어요', romanized: 'Han-gug-e ga-go sip-eo-yo', arabic: 'أريد الذهاب لكوريا' },
      { korean: '김치 먹고 싶어요', romanized: 'Gim-chi meok-go sip-eo-yo', arabic: 'أريد أكل الكيمتشي' },
      { korean: '한국어 배우고 싶어요', romanized: 'Han-gug-eo bae-u-go sip-eo-yo', arabic: 'أريد تعلم الكورية' }
    ],
    tips: [
      { ar: 'للسؤال عن رغبات الآخرين: 뭐 하고 싶어요?', ko: '상대방에게: 뭐 하고 싶어요?' }
    ],
    level: 'beginner'
  }
];

const Grammar: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const isRTL = language === 'ar';

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  const playKorean = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const filteredRules = grammarRules.filter(rule => 
    selectedLevel === 'all' || rule.level === selectedLevel
  );

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: { ar: 'مبتدئ', ko: '초급', color: 'bg-emerald-500' },
      intermediate: { ar: 'متوسط', ko: '중급', color: 'bg-amber-500' },
      advanced: { ar: 'متقدم', ko: '고급', color: 'bg-rose-500' }
    };
    return badges[level as keyof typeof badges];
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-medium">{isRTL ? 'العودة' : '돌아가기'}</span>
          </button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {isRTL ? 'القواعد الكورية' : '한국어 문법'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Welcome from Mohamed Amin */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-200/20 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">
              {isRTL ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isRTL 
              ? 'القواعد هي أساس اللغة! تعلمها جيداً وستتحدث الكورية بطلاقة.' 
              : '문법은 언어의 기초입니다! 잘 배우면 한국어를 유창하게 할 수 있어요.'}
          </p>
        </motion.div>

        {/* Level Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', ar: 'الكل', ko: '전체' },
            { id: 'beginner', ar: 'مبتدئ', ko: '초급' },
            { id: 'intermediate', ar: 'متوسط', ko: '중급' },
            { id: 'advanced', ar: 'متقدم', ko: '고급' }
          ].map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedLevel === level.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {isRTL ? level.ar : level.ko}
            </button>
          ))}
        </div>

        {/* Grammar Rules */}
        <div className="space-y-4">
          {filteredRules.map((rule, index) => {
            const badge = getLevelBadge(rule.level);
            const isExpanded = expandedRule === rule.id;

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-start">
                      <h3 className="font-bold">{isRTL ? rule.title.ar : rule.title.ko}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs text-white ${badge.color}`}>
                          {isRTL ? badge.ar : badge.ko}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{rule.pattern}</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {isRTL ? rule.description.ar : rule.description.ko}
                        </p>

                        {/* Examples */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            {isRTL ? 'أمثلة' : '예문'}
                          </h4>
                          {rule.examples.map((example, i) => (
                            <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-korean text-lg">{example.korean}</span>
                                <button
                                  onClick={() => playKorean(example.korean)}
                                  className="p-1.5 rounded-lg hover:bg-background transition-colors"
                                >
                                  <Volume2 className="w-4 h-4 text-primary" />
                                </button>
                              </div>
                              <p className="text-xs text-muted-foreground">{example.romanized}</p>
                              <p className="text-sm">{example.arabic}</p>
                            </div>
                          ))}
                        </div>

                        {/* Tips */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {isRTL ? 'نصائح' : '팁'}
                          </h4>
                          {rule.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-emerald-500">•</span>
                              <span>{isRTL ? tip.ar : tip.ko}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Grammar;
