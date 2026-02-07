import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Music, Heart, Clock, Star, X, Pause, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  titleKr: string;
  artist: string;
  artistKr: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lyrics?: string;
}

const Songs: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : '전체' },
    { id: 'kpop', label: 'K-Pop' },
    { id: 'ballad', label: isRTL ? 'بالاد' : '발라드' },
    { id: 'children', label: isRTL ? 'أطفال' : '동요' },
    { id: 'ost', label: 'OST' },
  ];

  const songs: Song[] = [
    {
      id: 's1',
      title: isRTL ? 'أغنية الحروف الكورية' : 'Korean Alphabet Song',
      titleKr: '한글 노래',
      artist: isRTL ? 'تعليمي' : 'Educational',
      artistKr: '교육용',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      videoId: 'TYMahTwqo2Y',
      duration: '3:45',
      difficulty: 'beginner',
      category: 'children',
    },
    {
      id: 's2',
      title: isRTL ? 'ثلاث دببة - أغنية أطفال كورية' : 'Three Bears - Korean Children Song',
      titleKr: '곰 세 마리',
      artist: isRTL ? 'أغاني أطفال' : 'Children Songs',
      artistKr: '동요',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=225&fit=crop',
      videoId: 'gomhS-gIH1o',
      duration: '2:30',
      difficulty: 'beginner',
      category: 'children',
    },
    {
      id: 's3',
      title: isRTL ? 'ربيع ربيع ربيع' : 'Spring Spring Spring',
      titleKr: '봄봄봄',
      artist: 'Roy Kim',
      artistKr: '로이킴',
      thumbnail: 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=400&h=225&fit=crop',
      videoId: 'k3-BDy5qMSI',
      duration: '4:12',
      difficulty: 'intermediate',
      category: 'ballad',
    },
    {
      id: 's4',
      title: isRTL ? 'Dynamite' : 'Dynamite',
      titleKr: '다이너마이트',
      artist: 'BTS',
      artistKr: '방탄소년단',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      videoId: 'gdZLi9oWNZg',
      duration: '3:43',
      difficulty: 'intermediate',
      category: 'kpop',
    },
    {
      id: 's5',
      title: isRTL ? 'أغنية الأرقام الكورية' : 'Korean Numbers Song',
      titleKr: '숫자 노래',
      artist: isRTL ? 'تعليمي' : 'Educational',
      artistKr: '교육용',
      thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=225&fit=crop',
      videoId: 'dBUGfs5VUZs',
      duration: '3:15',
      difficulty: 'beginner',
      category: 'children',
    },
    {
      id: 's6',
      title: isRTL ? 'أغنية أيام الأسبوع' : 'Days of the Week Song',
      titleKr: '요일 노래',
      artist: isRTL ? 'تعليمي' : 'Educational',
      artistKr: '교육용',
      thumbnail: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=400&h=225&fit=crop',
      videoId: 'K2yG4iMD1M4',
      duration: '2:58',
      difficulty: 'beginner',
      category: 'children',
    },
    {
      id: 's7',
      title: isRTL ? 'ماي ديستني - OST' : 'My Destiny - OST',
      titleKr: '마이 데스티니',
      artist: 'Lyn',
      artistKr: '린',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=225&fit=crop',
      videoId: 'KSzpMilfNJo',
      duration: '4:25',
      difficulty: 'advanced',
      category: 'ost',
    },
    {
      id: 's8',
      title: isRTL ? 'لوف شوت' : 'Love Shot',
      titleKr: '러브 샷',
      artist: 'EXO',
      artistKr: '엑소',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop',
      videoId: 'pSudEWBAYRE',
      duration: '3:33',
      difficulty: 'intermediate',
      category: 'kpop',
    },
  ];

  const filteredSongs = activeCategory === 'all' 
    ? songs 
    : songs.filter(s => s.category === activeCategory);

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
            <Music className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">
              {isRTL ? 'الأغاني الكورية' : '한국 노래'}
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
          className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-8"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">
                {isRTL ? 'تعلم من خلال الأغاني' : '노래로 배우기'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {isRTL ? 'تعلم الكورية بالأغاني' : '노래로 한국어 배우기'}
            </h2>
            <p className="text-white/80 max-w-xl">
              {isRTL 
                ? 'استمع إلى الأغاني الكورية الشهيرة وتعلم المفردات والنطق الصحيح'
                : '인기 한국 노래를 듣고 어휘와 올바른 발음을 배우세요'}
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

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedSong(song)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={song.thumbnail} 
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                    >
                      <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {song.duration}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(song.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>

                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
                    {getDifficultyLabel(song.difficulty)}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm mb-0.5 line-clamp-1">{song.title}</h3>
                  <p className="text-xs text-primary mb-1">{song.titleKr}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{song.artist} · {song.artistKr}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedSong(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl bg-card rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedSong.videoId}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedSong.title}
                />
                <button
                  onClick={() => setSelectedSong(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-1">{selectedSong.title}</h2>
                <p className="text-sm text-primary font-korean mb-2">{selectedSong.titleKr}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedSong.artist} · {selectedSong.artistKr}
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <span className={`px-2 py-0.5 rounded-lg text-xs ${getDifficultyColor(selectedSong.difficulty)}`}>
                    {getDifficultyLabel(selectedSong.difficulty)}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedSong.duration}</span>
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
