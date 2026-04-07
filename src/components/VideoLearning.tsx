import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Clock, Check, ChevronRight, Lock, X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";

interface VideoLesson {
  id: string;
  titleAr: string;
  titleKo: string;
  youtubeId: string;
  duration: string;
  thumbnail: string;
}

interface VideoLearningProps {
  level: number;
}

// YouTube video IDs per level
const videosByLevel: Record<number, VideoLesson[]> = {
  1: [
    { id: 'l1v1', titleAr: 'أساسيات الهانغول - الحروف الساكنة', titleKo: '한글 기초 - 자음', youtubeId: '85qJXvyFrIc', duration: '15:00', thumbnail: '📝' },
    { id: 'l1v2', titleAr: 'الحروف المتحركة الكورية', titleKo: '한국어 모음', youtubeId: 's5aObxQDP-4', duration: '12:00', thumbnail: '🔤' },
    { id: 'l1v3', titleAr: 'كيف تقرأ الكلمات الكورية', titleKo: '한국어 읽기', youtubeId: 'TE4iplc0JTA', duration: '18:00', thumbnail: '📖' },
    { id: 'l1v4', titleAr: 'النطق الصحيح للحروف', titleKo: '올바른 발음', youtubeId: 'yGBSHEdMJbI', duration: '10:00', thumbnail: '🎤' },
    { id: 'l1v5', titleAr: 'تمارين كتابة الهانغول', titleKo: '한글 쓰기 연습', youtubeId: 'EKVkNAQHHQQ', duration: '14:00', thumbnail: '✍️' },
  ],
  2: [
    { id: 'l2v1', titleAr: 'المفردات الأساسية - الأرقام', titleKo: '기본 어휘 - 숫자', youtubeId: 'UPQ9MXsTL1k', duration: '12:00', thumbnail: '🔢' },
    { id: 'l2v2', titleAr: 'الألوان بالكورية', titleKo: '한국어 색깔', youtubeId: 'kIEq_V3DSGA', duration: '8:00', thumbnail: '🎨' },
    { id: 'l2v3', titleAr: 'أيام الأسبوع والأشهر', titleKo: '요일과 월', youtubeId: 'fOHF_VjPiJc', duration: '10:00', thumbnail: '📅' },
    { id: 'l2v4', titleAr: 'الطعام والمشروبات', titleKo: '음식과 음료', youtubeId: '0VPY0nlirVQ', duration: '15:00', thumbnail: '🍽️' },
    { id: 'l2v5', titleAr: 'أفراد العائلة', titleKo: '가족 구성원', youtubeId: 'MxKGSqAz4JM', duration: '11:00', thumbnail: '👨‍👩‍👧‍👦' },
  ],
  3: [
    { id: 'l3v1', titleAr: 'المفردات المتقدمة - المهن', titleKo: '고급 어휘 - 직업', youtubeId: 'vFM8VnMTZhM', duration: '14:00', thumbnail: '💼' },
    { id: 'l3v2', titleAr: 'مصطلحات أكاديمية', titleKo: '학술 용어', youtubeId: '0VPY0nlirVQ', duration: '12:00', thumbnail: '🎓' },
    { id: 'l3v3', titleAr: 'مفردات العواطف والمشاعر', titleKo: '감정 어휘', youtubeId: 'fOHF_VjPiJc', duration: '10:00', thumbnail: '😊' },
    { id: 'l3v4', titleAr: 'مصطلحات التكنولوجيا', titleKo: '기술 용어', youtubeId: 'kIEq_V3DSGA', duration: '13:00', thumbnail: '💻' },
    { id: 'l3v5', titleAr: 'مفردات الصحة والطب', titleKo: '건강/의학 어휘', youtubeId: 'UPQ9MXsTL1k', duration: '11:00', thumbnail: '🏥' },
  ],
  4: [
    { id: 'l4v1', titleAr: 'التحيات والتعارف', titleKo: '인사와 소개', youtubeId: '85qJXvyFrIc', duration: '15:00', thumbnail: '👋' },
    { id: 'l4v2', titleAr: 'في المطعم - طلب الطعام', titleKo: '식당에서 - 주문하기', youtubeId: 's5aObxQDP-4', duration: '12:00', thumbnail: '🍜' },
    { id: 'l4v3', titleAr: 'السؤال عن الاتجاهات', titleKo: '길 물어보기', youtubeId: 'TE4iplc0JTA', duration: '10:00', thumbnail: '🗺️' },
    { id: 'l4v4', titleAr: 'التسوق بالكورية', titleKo: '쇼핑 표현', youtubeId: 'yGBSHEdMJbI', duration: '14:00', thumbnail: '🛍️' },
    { id: 'l4v5', titleAr: 'في وسائل المواصلات', titleKo: '대중교통 이용', youtubeId: 'EKVkNAQHHQQ', duration: '11:00', thumbnail: '🚌' },
  ],
  5: [
    { id: 'l5v1', titleAr: 'المحادثة في العمل', titleKo: '직장 대화', youtubeId: 'vFM8VnMTZhM', duration: '16:00', thumbnail: '💼' },
    { id: 'l5v2', titleAr: 'التعبير عن الرأي', titleKo: '의견 표현하기', youtubeId: 'MxKGSqAz4JM', duration: '13:00', thumbnail: '💭' },
    { id: 'l5v3', titleAr: 'المحادثات الهاتفية', titleKo: '전화 대화', youtubeId: 'fOHF_VjPiJc', duration: '11:00', thumbnail: '📱' },
    { id: 'l5v4', titleAr: 'التحدث عن الخطط المستقبلية', titleKo: '미래 계획 이야기', youtubeId: 'kIEq_V3DSGA', duration: '12:00', thumbnail: '🔮' },
    { id: 'l5v5', titleAr: 'مناقشة الأخبار والأحداث', titleKo: '뉴스와 이벤트 토론', youtubeId: '0VPY0nlirVQ', duration: '14:00', thumbnail: '📰' },
  ],
  6: [
    { id: 'l6v1', titleAr: 'الحياة اليومية في كوريا', titleKo: '한국의 일상생활', youtubeId: '85qJXvyFrIc', duration: '18:00', thumbnail: '🏠' },
    { id: 'l6v2', titleAr: 'الثقافة الكورية والعادات', titleKo: '한국 문화와 관습', youtubeId: 's5aObxQDP-4', duration: '15:00', thumbnail: '🎎' },
    { id: 'l6v3', titleAr: 'تعبيرات كورية شائعة', titleKo: '자주 쓰는 한국어 표현', youtubeId: 'TE4iplc0JTA', duration: '12:00', thumbnail: '🗣️' },
    { id: 'l6v4', titleAr: 'محادثات الحياة الاجتماعية', titleKo: '사회생활 대화', youtubeId: 'yGBSHEdMJbI', duration: '14:00', thumbnail: '🤝' },
    { id: 'l6v5', titleAr: 'مراجعة شاملة', titleKo: '종합 복습', youtubeId: 'EKVkNAQHHQQ', duration: '20:00', thumbnail: '🏆' },
  ],
};

const PROGRESS_KEY = 'videoLearningProgress';

const VideoLearning: React.FC<VideoLearningProps> = ({ level }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

  const videos = videosByLevel[level] || videosByLevel[1];

  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedVideos(new Set(data[level] || []));
    }
  }, [level]);

  const markComplete = (videoId: string) => {
    setCompletedVideos(prev => {
      const next = new Set(prev);
      next.add(videoId);
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      saved[level] = Array.from(next);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
      return next;
    });
  };

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedVideos.has(videos[index - 1].id);
  };

  const completedCount = completedVideos.size;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'تعلم بالفيديو' : '비디오 학습'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? `المستوى ${level} - ${videos.length} دروس` : `레벨 ${level} - ${videos.length}개 강의`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <BookOpen className="w-4 h-4" />
          <span>{completedCount}/{videos.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{isRTL ? 'التقدم' : '진행률'}</span>
          <span className="font-medium">{Math.round((completedCount / videos.length) * 100)}%</span>
        </div>
        <Progress value={(completedCount / videos.length) * 100} className="h-2" />
      </div>

      {/* Video Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl overflow-hidden bg-black"
          >
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                title={isRTL ? selectedVideo.titleAr : selectedVideo.titleKo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4 bg-card flex items-center justify-between">
              <div>
                <h4 className="font-medium">{isRTL ? selectedVideo.titleAr : selectedVideo.titleKo}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {selectedVideo.duration}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!completedVideos.has(selectedVideo.id) && (
                  <motion.button
                    onClick={() => markComplete(selectedVideo.id)}
                    className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    {isRTL ? 'إكمال' : '완료'}
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-muted hover:bg-muted/80"
                  whileHover={{ scale: 1.05 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video List */}
      <div className="space-y-3">
        {videos.map((video, index) => {
          const unlocked = isUnlocked(index);
          const completed = completedVideos.has(video.id);
          
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => unlocked && setSelectedVideo(video)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                !unlocked ? 'opacity-50 cursor-not-allowed' :
                selectedVideo?.id === video.id
                  ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {/* Number & Status */}
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                completed ? 'bg-green-500 text-white' : unlocked ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white' : 'bg-muted'
              }`}>
                {completed ? <Check className="w-5 h-5" /> : !unlocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <span className="text-lg">{video.thumbnail}</span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {isRTL ? video.titleAr : video.titleKo}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {video.duration}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    completed ? 'bg-green-500/20 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {completed ? (isRTL ? 'مكتمل' : '완료') : (isRTL ? `الدرس ${index + 1}` : `강의 ${index + 1}`)}
                  </span>
                </div>
              </div>

              {/* Play */}
              {unlocked && (
                <motion.div
                  className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoLearning;
