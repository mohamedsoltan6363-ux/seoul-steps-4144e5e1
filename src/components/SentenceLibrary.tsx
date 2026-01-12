import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Volume2, Copy, Check, Star, Heart,
  ChevronRight, Filter, Bookmark, MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from "@/components/ui/input";

interface Sentence {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  category: string;
  situation: string;
  isFavorite: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SentenceLibraryProps {
  level: number;
}

const sentences: Sentence[] = [
  // Greetings
  { id: '1', korean: '안녕하세요', romanized: 'annyeonghaseyo', arabic: 'مرحباً (رسمي)', category: 'greetings', situation: 'meeting', isFavorite: true, difficulty: 'easy' },
  { id: '2', korean: '안녕', romanized: 'annyeong', arabic: 'مرحباً (غير رسمي)', category: 'greetings', situation: 'meeting', isFavorite: false, difficulty: 'easy' },
  { id: '3', korean: '좋은 아침이에요', romanized: 'joeun achimieyo', arabic: 'صباح الخير', category: 'greetings', situation: 'morning', isFavorite: false, difficulty: 'easy' },
  { id: '4', korean: '안녕히 가세요', romanized: 'annyeonghi gaseyo', arabic: 'مع السلامة (للمغادر)', category: 'greetings', situation: 'farewell', isFavorite: false, difficulty: 'medium' },
  { id: '5', korean: '안녕히 계세요', romanized: 'annyeonghi gyeseyo', arabic: 'مع السلامة (للباقي)', category: 'greetings', situation: 'farewell', isFavorite: false, difficulty: 'medium' },
  
  // Restaurant
  { id: '6', korean: '메뉴 좀 주세요', romanized: 'menyu jom juseyo', arabic: 'القائمة من فضلك', category: 'restaurant', situation: 'ordering', isFavorite: true, difficulty: 'easy' },
  { id: '7', korean: '물 좀 주세요', romanized: 'mul jom juseyo', arabic: 'ماء من فضلك', category: 'restaurant', situation: 'ordering', isFavorite: false, difficulty: 'easy' },
  { id: '8', korean: '이거 얼마예요?', romanized: 'igeo eolmayeyo?', arabic: 'كم سعر هذا؟', category: 'restaurant', situation: 'payment', isFavorite: false, difficulty: 'easy' },
  { id: '9', korean: '맛있어요', romanized: 'masisseoyo', arabic: 'لذيذ', category: 'restaurant', situation: 'compliment', isFavorite: true, difficulty: 'easy' },
  { id: '10', korean: '계산해 주세요', romanized: 'gyesanhae juseyo', arabic: 'الحساب من فضلك', category: 'restaurant', situation: 'payment', isFavorite: false, difficulty: 'medium' },
  
  // Shopping
  { id: '11', korean: '이거 보여주세요', romanized: 'igeo boyeojuseyo', arabic: 'أرني هذا', category: 'shopping', situation: 'browsing', isFavorite: false, difficulty: 'medium' },
  { id: '12', korean: '다른 색 있어요?', romanized: 'dareun saek isseoyo?', arabic: 'هل يوجد لون آخر؟', category: 'shopping', situation: 'options', isFavorite: false, difficulty: 'medium' },
  { id: '13', korean: '입어 봐도 돼요?', romanized: 'ibeo bwado dwaeyo?', arabic: 'هل يمكنني تجربته؟', category: 'shopping', situation: 'fitting', isFavorite: false, difficulty: 'hard' },
  { id: '14', korean: '카드로 할게요', romanized: 'kadeuro halgeyo', arabic: 'سأدفع بالبطاقة', category: 'shopping', situation: 'payment', isFavorite: false, difficulty: 'medium' },
  
  // Transportation
  { id: '15', korean: '여기 가 주세요', romanized: 'yeogi ga juseyo', arabic: 'اذهب هنا من فضلك', category: 'transportation', situation: 'taxi', isFavorite: true, difficulty: 'easy' },
  { id: '16', korean: '얼마나 걸려요?', romanized: 'eolmana geollyeoyo?', arabic: 'كم يستغرق؟', category: 'transportation', situation: 'time', isFavorite: false, difficulty: 'medium' },
  { id: '17', korean: '어디서 내려요?', romanized: 'eodiseo naeryeoyo?', arabic: 'أين أنزل؟', category: 'transportation', situation: 'directions', isFavorite: false, difficulty: 'medium' },
  
  // Emergency
  { id: '18', korean: '도와주세요!', romanized: 'dowajuseyo!', arabic: 'ساعدني!', category: 'emergency', situation: 'help', isFavorite: true, difficulty: 'easy' },
  { id: '19', korean: '병원에 가야 해요', romanized: 'byeongwone gaya haeyo', arabic: 'أحتاج للذهاب للمستشفى', category: 'emergency', situation: 'medical', isFavorite: false, difficulty: 'hard' },
  { id: '20', korean: '경찰을 불러 주세요', romanized: 'gyeongchareul bulleo juseyo', arabic: 'اتصل بالشرطة', category: 'emergency', situation: 'police', isFavorite: false, difficulty: 'hard' },
  
  // Daily Life
  { id: '21', korean: '지금 몇 시예요?', romanized: 'jigeum myeot siyeyo?', arabic: 'كم الساعة الآن؟', category: 'daily', situation: 'time', isFavorite: false, difficulty: 'easy' },
  { id: '22', korean: '오늘 날씨가 좋아요', romanized: 'oneul nalssiga joayo', arabic: 'الطقس جميل اليوم', category: 'daily', situation: 'weather', isFavorite: false, difficulty: 'medium' },
  { id: '23', korean: '배고파요', romanized: 'baegopayo', arabic: 'أنا جائع', category: 'daily', situation: 'hunger', isFavorite: true, difficulty: 'easy' },
  { id: '24', korean: '피곤해요', romanized: 'pigonhaeyo', arabic: 'أنا متعب', category: 'daily', situation: 'feeling', isFavorite: false, difficulty: 'easy' },
];

const SentenceLibrary: React.FC<SentenceLibraryProps> = ({ level }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(sentences.filter(s => s.isFavorite).map(s => s.id))
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = [
    { id: 'all', labelAr: 'الكل', labelKo: '전체', icon: '📚' },
    { id: 'greetings', labelAr: 'التحيات', labelKo: '인사', icon: '👋' },
    { id: 'restaurant', labelAr: 'المطعم', labelKo: '식당', icon: '🍽️' },
    { id: 'shopping', labelAr: 'التسوق', labelKo: '쇼핑', icon: '🛍️' },
    { id: 'transportation', labelAr: 'المواصلات', labelKo: '교통', icon: '🚌' },
    { id: 'emergency', labelAr: 'طوارئ', labelKo: '긴급', icon: '🆘' },
    { id: 'daily', labelAr: 'يومي', labelKo: '일상', icon: '🏠' },
  ];

  const filteredSentences = sentences.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = 
      s.korean.includes(searchQuery) ||
      s.romanized.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabic.includes(searchQuery);
    const matchesFavorites = !showFavoritesOnly || favorites.has(s.id);
    
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/10 text-green-500';
      case 'medium': return 'bg-amber-500/10 text-amber-500';
      case 'hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    const labels = {
      easy: { ar: 'سهل', ko: '쉬움' },
      medium: { ar: 'متوسط', ko: '보통' },
      hard: { ar: 'صعب', ko: '어려움' },
    };
    return labels[diff as keyof typeof labels]?.[isRTL ? 'ar' : 'ko'] || diff;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'مكتبة الجمل' : '문장 라이브러리'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'جمل جاهزة لكل موقف' : '상황별 유용한 문장'}
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
            showFavoritesOnly
              ? 'bg-pink-500 text-white'
              : 'bg-muted hover:bg-muted/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
          {favorites.size}
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={isRTL ? 'ابحث عن جملة...' : '문장 검색...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-muted hover:bg-muted/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{cat.icon}</span>
            <span>{isRTL ? cat.labelAr : cat.labelKo}</span>
          </motion.button>
        ))}
      </div>

      {/* Sentences List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredSentences.map((sentence, index) => (
            <motion.div
              key={sentence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.03 }}
              className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl p-4 border border-cyan-500/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-2xl font-bold mb-1">{sentence.korean}</p>
                  <p className="text-sm text-muted-foreground">{sentence.romanized}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => toggleFavorite(sentence.id)}
                    className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`w-5 h-5 ${
                      favorites.has(sentence.id) 
                        ? 'fill-pink-500 text-pink-500' 
                        : 'text-muted-foreground'
                    }`} />
                  </motion.button>
                </div>
              </div>

              <p className="text-lg mb-3">{sentence.arabic}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(sentence.difficulty)}`}>
                    {getDifficultyLabel(sentence.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {categories.find(c => c.id === sentence.category)?.icon} {' '}
                    {isRTL 
                      ? categories.find(c => c.id === sentence.category)?.labelAr
                      : categories.find(c => c.id === sentence.category)?.labelKo}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => speak(sentence.korean)}
                    className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => copyToClipboard(sentence.korean, sentence.id)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedId === sentence.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredSentences.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">
            {isRTL ? 'لا توجد نتائج' : '결과 없음'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 'جرب البحث بكلمات مختلفة' : '다른 검색어를 시도해 보세요'}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {isRTL ? 'إجمالي الجمل' : '총 문장'}
          </span>
          <span className="font-bold">{sentences.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">
            {isRTL ? 'المفضلة' : '즐겨찾기'}
          </span>
          <span className="font-bold text-pink-500">{favorites.size}</span>
        </div>
      </div>
    </div>
  );
};

export default SentenceLibrary;
