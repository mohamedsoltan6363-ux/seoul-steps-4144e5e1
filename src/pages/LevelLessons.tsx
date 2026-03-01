import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Lock, CheckCircle, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Lesson {
  id: string;
  title: { ar: string; ko: string };
  duration: string;
  videoId: string;
  completed: boolean;
}

const levelLessons: Record<number, Lesson[]> = {
  1: [
    { id: 'l1-1', title: { ar: 'مقدمة في الحروف الكورية', ko: '한글 소개' }, duration: '10:24', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-2', title: { ar: 'الحروف الساكنة الأساسية', ko: '기본 자음' }, duration: '12:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-3', title: { ar: 'الحروف المتحركة الأساسية', ko: '기본 모음' }, duration: '11:15', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-4', title: { ar: 'الحروف الساكنة المزدوجة', ko: '쌍자음' }, duration: '9:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-5', title: { ar: 'الحروف المتحركة المركبة', ko: '복합 모음' }, duration: '13:20', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-6', title: { ar: 'تكوين المقاطع الكورية', ko: '음절 구성' }, duration: '14:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-7', title: { ar: 'قواعد النطق الأساسية', ko: '발음 규칙' }, duration: '11:50', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-8', title: { ar: 'كتابة الحروف بالترتيب', ko: '글자 쓰기' }, duration: '15:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-9', title: { ar: 'تمارين قراءة أساسية', ko: '읽기 연습' }, duration: '10:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l1-10', title: { ar: 'مراجعة شاملة للحروف', ko: '한글 복습' }, duration: '12:45', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
  2: [
    { id: 'l2-1', title: { ar: 'التحيات اليومية', ko: '일상 인사' }, duration: '10:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-2', title: { ar: 'أفراد العائلة', ko: '가족 구성원' }, duration: '11:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-3', title: { ar: 'الأرقام الكورية', ko: '한국어 숫자' }, duration: '12:15', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-4', title: { ar: 'الطعام والشراب', ko: '음식과 음료' }, duration: '13:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-5', title: { ar: 'الأماكن الشائعة', ko: '주요 장소' }, duration: '10:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-6', title: { ar: 'الوقت والتاريخ', ko: '시간과 날짜' }, duration: '14:20', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-7', title: { ar: 'أجزاء الجسم', ko: '신체 부위' }, duration: '9:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-8', title: { ar: 'الأفعال الأساسية', ko: '기본 동사' }, duration: '15:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-9', title: { ar: 'الصفات الشائعة', ko: '자주 쓰는 형용사' }, duration: '11:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l2-10', title: { ar: 'مراجعة المفردات', ko: '어휘 복습' }, duration: '12:00', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
  3: [
    { id: 'l3-1', title: { ar: 'مفردات المشاعر', ko: '감정 어휘' }, duration: '11:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-2', title: { ar: 'مفردات العمل', ko: '직장 어휘' }, duration: '12:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-3', title: { ar: 'مفردات الصحة', ko: '건강 어휘' }, duration: '10:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-4', title: { ar: 'مفردات التعليم', ko: '교육 어휘' }, duration: '13:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-5', title: { ar: 'مفردات التكنولوجيا', ko: '기술 어휘' }, duration: '11:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-6', title: { ar: 'مفردات البيئة', ko: '환경 어휘' }, duration: '10:15', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-7', title: { ar: 'مفردات قانونية', ko: '법률 어휘' }, duration: '14:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-8', title: { ar: 'مفردات اجتماعية', ko: '사회 어휘' }, duration: '12:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-9', title: { ar: 'مفردات طبية', ko: '의료 어휘' }, duration: '11:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l3-10', title: { ar: 'مراجعة شاملة', ko: '종합 복습' }, duration: '15:00', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
  4: [
    { id: 'l4-1', title: { ar: 'جمل التحية الرسمية', ko: '공식 인사 문장' }, duration: '12:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-2', title: { ar: 'السؤال والإجابة', ko: '질문과 대답' }, duration: '11:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-3', title: { ar: 'جمل التسوق', ko: '쇼핑 문장' }, duration: '13:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-4', title: { ar: 'جمل المطعم', ko: '식당 문장' }, duration: '10:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-5', title: { ar: 'جمل السفر', ko: '여행 문장' }, duration: '14:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-6', title: { ar: 'التعبير عن المشاعر', ko: '감정 표현' }, duration: '11:15', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-7', title: { ar: 'طلب المساعدة', ko: '도움 요청' }, duration: '10:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-8', title: { ar: 'التعريف بالنفس', ko: '자기 소개' }, duration: '12:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-9', title: { ar: 'جمل الاتجاهات', ko: '방향 문장' }, duration: '11:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l4-10', title: { ar: 'مراجعة الجمل', ko: '문장 복습' }, duration: '13:30', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
  5: [
    { id: 'l5-1', title: { ar: 'المحادثات المتقدمة', ko: '고급 대화' }, duration: '15:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-2', title: { ar: 'قواعد التصريف', ko: '활용 규칙' }, duration: '14:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-3', title: { ar: 'الجمل الشرطية', ko: '조건문' }, duration: '12:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-4', title: { ar: 'الأسلوب الرسمي وغير الرسمي', ko: '존칭과 반말' }, duration: '13:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-5', title: { ar: 'التعبيرات الاصطلاحية', ko: '관용 표현' }, duration: '11:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-6', title: { ar: 'الروابط النحوية', ko: '접속사' }, duration: '14:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-7', title: { ar: 'الكلام المنقول', ko: '간접 화법' }, duration: '12:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-8', title: { ar: 'التعبير عن الرأي', ko: '의견 표현' }, duration: '10:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-9', title: { ar: 'محادثات العمل', ko: '비즈니스 대화' }, duration: '15:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l5-10', title: { ar: 'مراجعة متقدمة', ko: '고급 복습' }, duration: '13:00', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
  6: [
    { id: 'l6-1', title: { ar: 'الحياة اليومية في كوريا', ko: '한국의 일상' }, duration: '14:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-2', title: { ar: 'في المطعم الكوري', ko: '한국 식당에서' }, duration: '12:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-3', title: { ar: 'التسوق في كوريا', ko: '한국에서 쇼핑' }, duration: '11:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-4', title: { ar: 'وسائل المواصلات', ko: '교통수단' }, duration: '13:45', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-5', title: { ar: 'زيارة الطبيب', ko: '병원 방문' }, duration: '10:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-6', title: { ar: 'في الفندق', ko: '호텔에서' }, duration: '12:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-7', title: { ar: 'الثقافة الكورية', ko: '한국 문화' }, duration: '15:00', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-8', title: { ar: 'مقابلة العمل', ko: '면접' }, duration: '14:30', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-9', title: { ar: 'محادثة هاتفية', ko: '전화 대화' }, duration: '11:15', videoId: 'dQw4w9WgXcQ', completed: false },
    { id: 'l6-10', title: { ar: 'التقييم النهائي', ko: '최종 평가' }, duration: '16:00', videoId: 'dQw4w9WgXcQ', completed: false },
  ],
};

const LevelLessons: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level || '1');
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`level-${levelNum}-lessons`);
    return saved ? new Set(JSON.parse(saved)) : new Set<string>();
  });
  const [activeVideo, setActiveVideo] = useState<Lesson | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  const lessons = levelLessons[levelNum] || levelLessons[1];

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedLessons.has(lessons[index - 1].id);
  };

  const handleVideoComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
    localStorage.setItem(`level-${levelNum}-lessons`, JSON.stringify([...newCompleted]));
    setActiveVideo(null);
  };

  // Simulate video watching - must watch to completion (use timer)
  React.useEffect(() => {
    if (!activeVideo) { setVideoProgress(0); return; }
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleVideoComplete(activeVideo.id);
          return 100;
        }
        return prev + 0.5; // ~200 seconds to complete
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(`/learn/${levelNum}`)}>
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="font-bold text-lg">
            {isRTL ? `دروس المستوى ${levelNum}` : `레벨 ${levelNum} 수업`}
          </h1>
          <div className="text-sm text-muted-foreground">
            {completedLessons.size}/{lessons.length}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl bg-card rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold">
                  {isRTL ? activeVideo.title.ar : activeVideo.title.ko}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                  title={isRTL ? activeVideo.title.ar : activeVideo.title.ko}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'يجب مشاهدة الدرس كاملاً' : '수업을 끝까지 시청해야 합니다'}
                  </span>
                  <span className="text-sm font-bold text-primary">{Math.floor(videoProgress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-green-500"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lessons List */}
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        {lessons.map((lesson, index) => {
          const unlocked = isLessonUnlocked(index);
          const completed = completedLessons.has(lesson.id);

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => unlocked && !completed && setActiveVideo(lesson)}
                disabled={!unlocked}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  completed
                    ? 'border-green-500/30 bg-green-500/5'
                    : unlocked
                    ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                    : 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Index */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  completed
                    ? 'bg-green-500 text-white'
                    : unlocked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : unlocked ? (
                    <Play className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {isRTL ? `الدرس ${index + 1}` : `수업 ${index + 1}`}
                  </p>
                  <p className="font-bold truncate">
                    {isRTL ? lesson.title.ar : lesson.title.ko}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  {lesson.duration}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelLessons;
