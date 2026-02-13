import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Clock, Star, BookOpen, Heart, Share2, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonItem {
  id: string;
  title: string;
  titleKr: string;
  description: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  rating: number;
  episodes: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const Lessons: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : '전체' },
    { id: 'hangul', label: isRTL ? 'الحروف' : '한글' },
    { id: 'basics', label: isRTL ? 'أساسيات' : '기초' },
    { id: 'intermediate', label: isRTL ? 'متوسط' : '중급' },
  ];

  const lessonsList: LessonItem[] = [
    {
      id: '1',
      title: isRTL ? 'الدرس الأول - الحروف الساكنة' : 'Lesson 1 - Korean Consonants',
      titleKr: '첫 번째 수업 - 자음',
      description: isRTL 
        ? 'تعلم الحروف الساكنة الكورية (자음) بشكل تفصيلي مع النطق الصحيح والأمثلة العملية'
        : '한국 자음을 발음과 함께 배우세요. 모든 자음의 올바른 발음을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1456953453510-21fc8c91d9b7?w=400&h=225&fit=crop',
      videoId: 'Nc-0FTYbQ0Y',
      duration: '12:34',
      rating: 4.9,
      episodes: 1,
      category: 'hangul',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: isRTL ? 'الدرس الثاني - الحروف المتحركة' : 'Lesson 2 - Korean Vowels',
      titleKr: '두 번째 수업 - 모음',
      description: isRTL 
        ? 'تعلم الحروف المتحركة الكورية (모음) وكيفية نطقها بشكل صحيح مع ممارسة عملية'
        : '한국 모음을 단계별로 배우고 올바르게 발음하는 방법을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
      videoId: '11Z4UJpKtGI',
      duration: '14:22',
      rating: 4.8,
      episodes: 1,
      category: 'hangul',
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: isRTL ? 'الدرس الثالث - قراءة المقاطع' : 'Lesson 3 - Reading Syllables',
      titleKr: '세 번째 수업 - 음절 읽기',
      description: isRTL 
        ? 'كيفية قراءة المقاطع الكورية بجمع الحروف الساكنة والمتحركة معاً'
        : '자음과 모음을 조합하여 한글 음절을 읽는 방법을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1456953453510-21fc8c91d9b7?w=400&h=225&fit=crop',
      videoId: 'OkuYvvdD5Fs',
      duration: '15:45',
      rating: 4.7,
      episodes: 1,
      category: 'hangul',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: isRTL ? 'الدرس الرابع - قراءة الكلمات' : 'Lesson 4 - Reading Words',
      titleKr: '네 번째 수업 - 단어 읽기',
      description: isRTL 
        ? 'تعلم قراءة الكلمات الكورية كاملة والأساليب الصحيحة للنطق والتشكيل'
        : '기본 한글 단어를 읽고 정확한 발음을 배우는 연습입니다',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
      videoId: 'jjcjCu3iVb0',
      duration: '16:20',
      rating: 4.8,
      episodes: 1,
      category: 'hangul',
      difficulty: 'beginner'
    },
    {
      id: '5',
      title: isRTL ? 'الدرس الخامس - النطق والتشديد' : 'Lesson 5 - Pronunciation & Stress',
      titleKr: '다섯 번째 수업 - 발음과 강조',
      description: isRTL 
        ? 'شرح مفصل لقواعد النطق الكورية والتشديد والنبرات الصوتية'
        : '한국어 발음 규칙과 음절 강조에 대해 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=225&fit=crop',
      videoId: '6vaHtRbF5A8',
      duration: '17:05',
      rating: 4.9,
      episodes: 1,
      category: 'basics',
      difficulty: 'beginner'
    },
    {
      id: '6',
      title: isRTL ? 'الدرس السادس - الأرقام الكورية' : 'Lesson 6 - Korean Numbers',
      titleKr: '여섯 번째 수업 - 한국 숫자',
      description: isRTL 
        ? 'تعلم نظام الأرقام الكوري (الأرقام العربية الكورية والصينية الكورية)'
        : '한국의 숫자 시스템 (고유어와 한자어)을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1515534775068-088395c4f407?w=400&h=225&fit=crop',
      videoId: 'uMOC41HWoIs',
      duration: '18:15',
      rating: 4.8,
      episodes: 1,
      category: 'basics',
      difficulty: 'beginner'
    },
    {
      id: '7',
      title: isRTL ? 'الدرس السابع - المحادثات الأساسية' : 'Lesson 7 - Basic Conversations',
      titleKr: '일곱 번째 수업 - 기초 회화',
      description: isRTL 
        ? 'تعلم التحيات والعبارات الأساسية في المحادثات اليومية الكورية'
        : '일상 한국어 회화의 기본 인사와 표현을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      videoId: 'WV0iFNR8r-U',
      duration: '19:30',
      rating: 4.7,
      episodes: 1,
      category: 'basics',
      difficulty: 'beginner'
    },
    {
      id: '8',
      title: isRTL ? 'الدرس الثامن - التحيات والعبارات' : 'Lesson 8 - Greetings & Phrases',
      titleKr: '여덟 번째 수업 - 인사말과 표현',
      description: isRTL 
        ? 'تعلم التحيات المختلفة والعبارات اللطيفة في المحادثات اليومية'
        : '다양한 상황에서 사용하는 한국어 인사와 표현을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=225&fit=crop',
      videoId: 'Fnq2jtdShkk',
      duration: '20:10',
      rating: 4.8,
      episodes: 1,
      category: 'conversation',
      difficulty: 'beginner'
    },
    {
      id: '9',
      title: isRTL ? 'الدرس التاسع - الأسئلة والإجابات' : 'Lesson 9 - Questions & Answers',
      titleKr: '아홉 번째 수업 - 질문과 답변',
      description: isRTL 
        ? 'تعلم كيفية طرح الأسئلة بالكورية والرد عليها في محادثات يومية'
        : '한국어로 질문하고 답하는 방법을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      videoId: 'OkPIwufe8us',
      duration: '21:35',
      rating: 4.9,
      episodes: 1,
      category: 'conversation',
      difficulty: 'intermediate'
    },
    {
      id: '10',
      title: isRTL ? 'الدرس العاشر - الأفعال الأساسية' : 'Lesson 10 - Basic Verbs',
      titleKr: '열 번째 수업 - 기초 동사',
      description: isRTL 
        ? 'تعلم الأفعال الأساسية الكورية وكيفية استخدامها في الجمل'
        : '기본 한국어 동사의 활용과 사용법을 배웁니다',
      thumbnail: 'https://images.unsplash.com/photo-1456953453510-21fc8c91d9b7?w=400&h=225&fit=crop',
      videoId: 'OJ0aD3tsRpY',
      duration: '22:45',
      rating: 4.8,
      episodes: 1,
      category: 'grammar',
      difficulty: 'intermediate'
    },
    {
      id: '11',
      title: isRTL ? 'الدرس الحادي عشر - المضامين التفاعلية' : 'Lesson 11 - Interactive Practice',
      titleKr: '열한 번째 수업 - 상호작용 연습',
      description: isRTL 
        ? 'تطبيق عملي شامل لكل ما تم تعلمه مع ممارسة تفاعلية'
        : '지금까지 배운 내용을 실제로 연습하고 활용합니다',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
      videoId: 'gA1iRGsyRuk',
      duration: '23:20',
      rating: 4.9,
      episodes: 1,
      category: 'intermediate',
      difficulty: 'intermediate'
    },
  ];

  const filteredLessons = activeCategory === 'all' 
    ? lessonsList 
    : lessonsList.filter(l => l.category === activeCategory);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'beginner': return 'bg-green-500/20 text-green-600';
      case 'intermediate': return 'bg-amber-500/20 text-amber-600';
      case 'advanced': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    if (isRTL) {
      switch(diff) {
        case 'beginner': return 'مبتدئ';
        case 'intermediate': return 'متوسط';
        case 'advanced': return 'متقدم';
        default: return diff;
      }
    }
    switch(diff) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return diff;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">
              {isRTL ? 'الدروس التعليمية' : '학습 동영상'}
            </h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 p-8"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">
                {isRTL ? 'تعلم من البداية' : '기초부터 시작'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {isRTL ? 'دروس اللغة الكورية التعليمية' : '한국어 학습 동영상'}
            </h2>
            <p className="text-white/80 max-w-xl">
              {isRTL 
                ? 'دروس تعليمية شاملة لتعلم اللغة الكورية من الصفر، مع شرح تفصيلي وأمثلة عملية'
                : '한국어를 체계적으로 배우는 교육 동영상, 기초부터 중급 수준까지'}
            </p>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={lesson.thumbnail} 
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                    >
                      <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                    </motion.div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(lesson.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(lesson.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>

                  {/* Difficulty */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                    {getDifficultyLabel(lesson.difficulty)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{lesson.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'درس' : '수업'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-card rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <iframe
                  key={selectedLesson.videoId}
                  src={`https://www.youtube.com/embed/${selectedLesson.videoId}?autoplay=1&rel=0&controls=1&modestbranding=1`}
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  title={selectedLesson.title}
                  frameBorder="0"
                  loading="lazy"
                  style={{ 
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedLesson.title}</h2>
                    <p className="text-sm text-primary font-korean">{selectedLesson.titleKr}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-muted hover:bg-muted/80">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl bg-muted hover:bg-muted/80">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{selectedLesson.description}</p>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{selectedLesson.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">{isRTL ? 'درس تعليمي' : '교육용 동영상'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs ${getDifficultyColor(selectedLesson.difficulty)}`}>
                    {getDifficultyLabel(selectedLesson.difficulty)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
