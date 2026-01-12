import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, BookOpen, Clock, Star, ChevronRight, Check
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";

interface VideoLesson {
  id: string;
  titleAr: string;
  titleKo: string;
  descriptionAr: string;
  descriptionKo: string;
  duration: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

interface VideoLearningProps {
  level: number;
}

const videoLessons: VideoLesson[] = [
  {
    id: '1',
    titleAr: 'أساسيات الهانغول',
    titleKo: '한글 기초',
    descriptionAr: 'تعلم الحروف الكورية الأساسية',
    descriptionKo: '기본 한글 배우기',
    duration: '5:30',
    thumbnail: '📝',
    category: 'alphabet',
    level: 'beginner',
    completed: true,
  },
  {
    id: '2',
    titleAr: 'الحروف المتحركة',
    titleKo: '모음 배우기',
    descriptionAr: 'شرح تفصيلي للحروف المتحركة',
    descriptionKo: '모음 자세히 알아보기',
    duration: '7:15',
    thumbnail: '🔤',
    category: 'alphabet',
    level: 'beginner',
    completed: true,
  },
  {
    id: '3',
    titleAr: 'التحيات الكورية',
    titleKo: '한국어 인사',
    descriptionAr: 'تعلم التحيات اليومية',
    descriptionKo: '일상 인사 배우기',
    duration: '4:45',
    thumbnail: '👋',
    category: 'greetings',
    level: 'beginner',
    completed: false,
  },
  {
    id: '4',
    titleAr: 'الأرقام الكورية',
    titleKo: '한국어 숫자',
    descriptionAr: 'العد من 1 إلى 100',
    descriptionKo: '1부터 100까지',
    duration: '6:20',
    thumbnail: '🔢',
    category: 'numbers',
    level: 'beginner',
    completed: false,
  },
  {
    id: '5',
    titleAr: 'أيام الأسبوع',
    titleKo: '요일 배우기',
    descriptionAr: 'تعلم أيام الأسبوع',
    descriptionKo: '요일 알아보기',
    duration: '3:50',
    thumbnail: '📅',
    category: 'time',
    level: 'beginner',
    completed: false,
  },
  {
    id: '6',
    titleAr: 'في المطعم',
    titleKo: '식당에서',
    descriptionAr: 'عبارات مفيدة في المطعم',
    descriptionKo: '식당에서 유용한 표현',
    duration: '8:10',
    thumbnail: '🍽️',
    category: 'situations',
    level: 'intermediate',
    completed: false,
  },
  {
    id: '7',
    titleAr: 'التسوق بالكورية',
    titleKo: '쇼핑 표현',
    descriptionAr: 'كيف تتسوق بالكورية',
    descriptionKo: '한국어로 쇼핑하기',
    duration: '6:45',
    thumbnail: '🛍️',
    category: 'situations',
    level: 'intermediate',
    completed: false,
  },
  {
    id: '8',
    titleAr: 'المحادثة اليومية',
    titleKo: '일상 대화',
    descriptionAr: 'محادثات الحياة اليومية',
    descriptionKo: '일상생활 대화',
    duration: '10:30',
    thumbnail: '💬',
    category: 'conversation',
    level: 'advanced',
    completed: false,
  },
];

const VideoLearning: React.FC<VideoLearningProps> = ({ level }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelKo: '전체' },
    { id: 'alphabet', labelAr: 'الحروف', labelKo: '알파벳' },
    { id: 'greetings', labelAr: 'التحيات', labelKo: '인사' },
    { id: 'numbers', labelAr: 'الأرقام', labelKo: '숫자' },
    { id: 'situations', labelAr: 'مواقف', labelKo: '상황' },
    { id: 'conversation', labelAr: 'محادثة', labelKo: '대화' },
  ];

  const filteredVideos = activeCategory === 'all' 
    ? videoLessons 
    : videoLessons.filter(v => v.category === activeCategory);

  const completedCount = videoLessons.filter(v => v.completed).length;
  const totalDuration = videoLessons.reduce((acc, v) => {
    const [mins, secs] = v.duration.split(':').map(Number);
    return acc + mins * 60 + secs;
  }, 0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      beginner: { ar: 'مبتدئ', ko: '초급' },
      intermediate: { ar: 'متوسط', ko: '중급' },
      advanced: { ar: 'متقدم', ko: '고급' },
    };
    return labels[level as keyof typeof labels]?.[isRTL ? 'ar' : 'ko'] || level;
  };

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
              {isRTL ? 'مقاطع تعليمية قصيرة' : '짧은 학습 영상'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{completedCount}/{videoLessons.length}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(totalDuration / 60)}m</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {isRTL ? 'التقدم الإجمالي' : '전체 진행률'}
          </span>
          <span className="font-medium">
            {Math.round((completedCount / videoLessons.length) * 100)}%
          </span>
        </div>
        <Progress value={(completedCount / videoLessons.length) * 100} className="h-2" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-muted hover:bg-muted/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRTL ? cat.labelAr : cat.labelKo}
          </motion.button>
        ))}
      </div>

      {/* Video Player (if selected) */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden"
          >
            {/* Video Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <span className="text-9xl">{selectedVideo.thumbnail}</span>
              
              {/* Play/Pause Overlay */}
              <motion.button
                className="absolute inset-0 flex items-center justify-center bg-black/30"
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </motion.div>
              </motion.button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button
                  className="p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="text-white">
                <h4 className="font-medium">
                  {isRTL ? selectedVideo.titleAr : selectedVideo.titleKo}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setSelectedVideo(null)}
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video List */}
      <div className="space-y-3">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedVideo(video)}
            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
              selectedVideo?.id === video.id
                ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30'
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            {/* Thumbnail */}
            <div className={`relative w-20 h-14 rounded-xl bg-gradient-to-br ${getLevelColor(video.level)} flex items-center justify-center flex-shrink-0`}>
              <span className="text-3xl">{video.thumbnail}</span>
              {video.completed && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">
                {isRTL ? video.titleAr : video.titleKo}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {isRTL ? video.descriptionAr : video.descriptionKo}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${getLevelColor(video.level)} text-white`}>
                  {getLevelLabel(video.level)}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>
              </div>
            </div>

            {/* Play Button */}
            <motion.div
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5 text-white ml-0.5" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VideoLearning;
