import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { vocabulary, consonants, vowels, basicSentences, advancedSentences } from '@/data/koreanData';
import { 
  Search, ArrowLeft, Volume2, BookOpen, Star, 
  Sparkles, Filter, X, Heart, ChevronDown, ChevronUp
} from 'lucide-react';

interface DictionaryEntry {
  id: string;
  korean: string;
  romanized: string;
  arabic: string;
  category?: string;
  type: 'letter' | 'vocabulary' | 'sentence';
  examples?: string[];
}

const Dictionary: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Combine all data into dictionary entries
  const allEntries: DictionaryEntry[] = useMemo(() => {
    const entries: DictionaryEntry[] = [];
    
    // Add consonants and vowels
    consonants.forEach(c => entries.push({
      id: `letter-${c.id}`,
      korean: c.korean,
      romanized: c.romanized,
      arabic: c.arabic,
      type: 'letter',
      category: 'consonant',
      examples: [`${c.korean}나 (${c.romanized}na)`, `${c.korean}다 (${c.romanized}da)`]
    }));
    
    vowels.forEach(v => entries.push({
      id: `letter-${v.id}`,
      korean: v.korean,
      romanized: v.romanized,
      arabic: v.arabic,
      type: 'letter',
      category: 'vowel',
      examples: [`아${v.korean} (a${v.romanized})`, `가${v.korean} (ga${v.romanized})`]
    }));
    
    // Add vocabulary
    vocabulary.forEach(v => entries.push({
      id: `vocab-${v.id}`,
      korean: v.korean,
      romanized: v.romanized,
      arabic: v.arabic,
      type: 'vocabulary',
      category: v.category,
      examples: getVocabExamples(v.korean)
    }));
    
    // Add sentences
    basicSentences.forEach(s => entries.push({
      id: `sentence-${s.id}`,
      korean: s.korean,
      romanized: s.romanized,
      arabic: s.arabic,
      type: 'sentence',
      category: 'basic'
    }));
    
    advancedSentences.forEach(s => entries.push({
      id: `sentence-${s.id}`,
      korean: s.korean,
      romanized: s.romanized,
      arabic: s.arabic,
      type: 'sentence',
      category: 'advanced'
    }));
    
    return entries;
  }, []);

  // Get example sentences for vocabulary
  function getVocabExamples(korean: string): string[] {
    const examples: string[] = [];
    [...basicSentences, ...advancedSentences].forEach(s => {
      if (s.korean.includes(korean) && examples.length < 2) {
        examples.push(s.korean);
      }
    });
    return examples;
  }

  // Filter entries based on search and filters
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.korean.includes(searchQuery) ||
        entry.romanized.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.arabic.includes(searchQuery);
      
      const matchesType = selectedType === 'all' || entry.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [allEntries, searchQuery, selectedType, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allEntries.forEach(e => e.category && cats.add(e.category));
    return Array.from(cats);
  }, [allEntries]);

  // Play pronunciation
  const playPronunciation = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const typeLabels = {
    all: language === 'ar' ? 'الكل' : '전체',
    letter: language === 'ar' ? 'حروف' : '글자',
    vocabulary: language === 'ar' ? 'مفردات' : '단어',
    sentence: language === 'ar' ? 'جمل' : '문장'
  };

  const categoryLabels: Record<string, { ar: string; ko: string }> = {
    all: { ar: 'الكل', ko: '전체' },
    consonant: { ar: 'حروف ساكنة', ko: '자음' },
    vowel: { ar: 'حروف متحركة', ko: '모음' },
    greetings: { ar: 'تحيات', ko: '인사' },
    family: { ar: 'عائلة', ko: '가족' },
    numbers: { ar: 'أرقام', ko: '숫자' },
    food: { ar: 'طعام', ko: '음식' },
    places: { ar: 'أماكن', ko: '장소' },
    time: { ar: 'وقت', ko: '시간' },
    body: { ar: 'جسم', ko: '신체' },
    verbs: { ar: 'أفعال', ko: '동사' },
    adjectives: { ar: 'صفات', ko: '형용사' },
    basic: { ar: 'أساسية', ko: '기초' },
    advanced: { ar: 'متقدمة', ko: '고급' }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'القاموس الذكي' : '스마트 사전'}
            </h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-primary text-white' : 'hover:bg-muted'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-2xl">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث بالكورية أو العربية أو الرومانية...' : '한국어, 아랍어, 로마자로 검색...'}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4 p-4 rounded-2xl bg-card border border-border animate-fade-in">
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">{language === 'ar' ? 'النوع' : '유형'}</p>
              <div className="flex flex-wrap gap-2">
                {(['all', 'letter', 'vocabulary', 'sentence'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedType === type 
                        ? 'bg-primary text-white' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">{language === 'ar' ? 'الفئة' : '카테고리'}</p>
              <div className="flex flex-wrap gap-2">
                {['all', ...categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-secondary text-white' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {categoryLabels[cat]?.[language === 'ar' ? 'ar' : 'ko'] || cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? `${filteredEntries.length} نتيجة` : `${filteredEntries.length}개 결과`}
          </p>
          {favorites.length > 0 && (
            <button className="text-sm text-primary flex items-center gap-1">
              <Heart className="w-4 h-4 fill-current" />
              {favorites.length}
            </button>
          )}
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد نتائج' : '검색 결과가 없습니다'}
              </p>
            </div>
          ) : (
            filteredEntries.slice(0, 50).map((entry) => (
              <div
                key={entry.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-korean ${entry.type === 'letter' ? 'text-3xl' : 'text-xl'} font-bold`}>
                          {entry.korean}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          entry.type === 'letter' ? 'bg-blue-500/10 text-blue-500' :
                          entry.type === 'vocabulary' ? 'bg-pink-500/10 text-pink-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {typeLabels[entry.type]}
                        </span>
                      </div>
                      <p className="text-sm text-primary mb-1">{entry.romanized}</p>
                      <p className="text-muted-foreground">{entry.arabic}</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(entry.korean);
                        }}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(entry.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(entry.id) 
                            ? 'text-red-500' 
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(entry.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  {entry.examples && entry.examples.length > 0 && (
                    <div className="flex items-center justify-center mt-2 pt-2 border-t border-border/50">
                      {expandedEntry === entry.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded content with examples */}
                {expandedEntry === entry.id && entry.examples && entry.examples.length > 0 && (
                  <div className="px-4 pb-4 border-t border-border/50 bg-muted/30 animate-fade-in">
                    <p className="text-sm font-medium mt-3 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      {language === 'ar' ? 'أمثلة' : '예문'}
                    </p>
                    <div className="space-y-2">
                      {entry.examples.map((example, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                        >
                          <span className="font-korean text-sm">{example}</span>
                          <button
                            onClick={() => playPronunciation(example)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {filteredEntries.length > 50 && (
          <p className="text-center text-sm text-muted-foreground mt-4 py-4">
            {language === 'ar' 
              ? `يتم عرض أول 50 نتيجة من ${filteredEntries.length}` 
              : `${filteredEntries.length}개 중 처음 50개 표시`}
          </p>
        )}
      </main>
    </div>
  );
};

export default Dictionary;
