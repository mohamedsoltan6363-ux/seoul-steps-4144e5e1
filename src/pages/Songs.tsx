import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Clock, Star, Film, Tv, Heart, Share2, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KoreanSeries {
  id: string;
  title: string;
  titleKr: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  rating: number;
  episodes: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const Songs: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedSeries, setSelectedSeries] = useState<KoreanSeries | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : '전체' },
    { id: 'drama', label: isRTL ? 'دراما' : '드라마' },
    { id: 'learning', label: isRTL ? 'تعليمي' : '학습' },
    { id: 'conversation', label: isRTL ? 'محادثات' : '대화' },
    { id: 'culture', label: isRTL ? 'ثقافة' : '문화' },
  ];

  const koreanSeries: KoreanSeries[] = [
    {
      id: '1',
      title: isRTL ? 'تعلم الكورية - المحادثات اليومية' : 'Learn Korean - Daily Conversations',
      titleKr: '한국어 배우기 - 일상 대화',
      description: isRTL 
        ? 'تعلم العبارات والمحادثات الأساسية المستخدمة في الحياة اليومية الكورية'
        : '한국 일상생활에서 사용되는 기본 표현과 대화를 배우세요',
      thumbnail: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/0l6HmEF6nQQ',
      duration: '15:30',
      rating: 4.8,
      episodes: 24,
      category: 'learning',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: isRTL ? 'مسلسل كوري مترجم - مستوى مبتدئ' : 'Korean Drama - Beginner Level',
      titleKr: '한국 드라마 - 초급',
      description: isRTL 
        ? 'شاهد مقاطع من المسلسلات الكورية الشهيرة مع ترجمة عربية وكورية'
        : '인기 한국 드라마 클립을 아랍어와 한국어 자막과 함께 시청하세요',
      thumbnail: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/3P1CnWI62Ik',
      duration: '22:45',
      rating: 4.9,
      episodes: 16,
      category: 'drama',
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: isRTL ? 'نطق اللغة الكورية' : 'Korean Pronunciation',
      titleKr: '한국어 발음',
      description: isRTL 
        ? 'تعلم النطق الصحيح للحروف والكلمات الكورية من متحدثين أصليين'
        : '원어민과 함께 한글과 단어의 올바른 발음을 배우세요',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/YTprR3Ud9HA',
      duration: '18:20',
      rating: 4.7,
      episodes: 12,
      category: 'learning',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: isRTL ? 'الثقافة الكورية' : 'Korean Culture',
      titleKr: '한국 문화',
      description: isRTL 
        ? 'استكشف الثقافة والتقاليد الكورية من خلال فيديوهات تعليمية ممتعة'
        : '재미있는 교육 영상을 통해 한국 문화와 전통을 탐험하세요',
      thumbnail: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/kV8v2GKC8WA',
      duration: '25:10',
      rating: 4.6,
      episodes: 20,
      category: 'culture',
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: isRTL ? 'محادثات متقدمة' : 'Advanced Conversations',
      titleKr: '고급 대화',
      description: isRTL 
        ? 'محادثات متقدمة للمتعلمين ذوي المستوى المتوسط والمتقدم'
        : '중급 및 고급 학습자를 위한 고급 대화',
      thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/2N8urTqTxhw',
      duration: '30:00',
      rating: 4.5,
      episodes: 15,
      category: 'conversation',
      difficulty: 'advanced'
    },
    {
      id: '6',
      title: isRTL ? 'K-Drama مقاطع مترجمة' : 'K-Drama Translated Clips',
      titleKr: 'K-드라마 번역 클립',
      description: isRTL 
        ? 'مشاهد مختارة من أشهر المسلسلات الكورية مع شرح اللغة'
        : '인기 한국 드라마의 선별된 장면과 언어 설명',
      thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/GTIFZBsd4mk',
      duration: '28:15',
      rating: 4.9,
      episodes: 30,
      category: 'drama',
      difficulty: 'intermediate'
    },
  ];

  const filteredSeries = activeCategory === 'all' 
    ? koreanSeries 
    : koreanSeries.filter(s => s.category === activeCategory);

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
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
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
            <Tv className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">
              {isRTL ? 'المسلسلات الكورية' : '한국 드라마'}
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
          className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-8"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">
                {isRTL ? 'تعلم من خلال المشاهدة' : '시청하며 배우기'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {isRTL ? 'تعلم الكورية من المسلسلات' : '드라마로 한국어 배우기'}
            </h2>
            <p className="text-white/80 max-w-xl">
              {isRTL 
                ? 'شاهد مقاطع فيديو تعليمية من المسلسلات الكورية مع ترجمة عربية وكورية'
                : '아랍어와 한국어 자막이 있는 한국 드라마 교육 클립을 시청하세요'}
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

        {/* Series Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.map((series, index) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedSeries(series)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={series.thumbnail} 
                    alt={series.title}
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
                    {series.duration}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(series.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(series.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                    />
                  </button>

                  {/* Difficulty Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(series.difficulty)}`}>
                    {getDifficultyLabel(series.difficulty)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{series.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{series.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{series.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {series.episodes} {isRTL ? 'حلقة' : '에피소드'}
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
        {selectedSeries && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedSeries(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-card rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={selectedSeries.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedSeries.title}</h2>
                    <p className="text-sm text-primary font-korean">{selectedSeries.titleKr}</p>
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
                <p className="text-muted-foreground text-sm">{selectedSeries.description}</p>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{selectedSeries.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">{selectedSeries.episodes} {isRTL ? 'حلقة' : '에피소드'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs ${getDifficultyColor(selectedSeries.difficulty)}`}>
                    {getDifficultyLabel(selectedSeries.difficulty)}
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

export default Songs;
