import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Music, Play, Pause, Volume2, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  id: string;
  title: string;
  titleArabic: string;
  artist: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lyrics: {
    korean: string;
    romanized: string;
    arabic: string;
  }[];
  vocabulary: {
    korean: string;
    romanized: string;
    arabic: string;
  }[];
}

const songs: Song[] = [
  {
    id: '1',
    title: '학교 가는 길',
    titleArabic: 'الطريق إلى المدرسة',
    artist: 'أغنية تعليمية',
    difficulty: 'beginner',
    lyrics: [
      { korean: '아침 일찍 일어나', romanized: 'achim iljjik ireonа', arabic: 'أستيقظ مبكراً في الصباح' },
      { korean: '세수하고 밥 먹고', romanized: 'sesuhago bap meokgo', arabic: 'أغسل وجهي وآكل' },
      { korean: '가방 메고 신발 신고', romanized: 'gabang mego sinbal singo', arabic: 'أحمل حقيبتي وألبس حذائي' },
      { korean: '학교에 갑니다', romanized: 'hakgyoe gamnida', arabic: 'أذهب إلى المدرسة' },
      { korean: '친구들을 만나서', romanized: 'chingudeureul mannaseo', arabic: 'ألتقي بأصدقائي' },
      { korean: '같이 공부해요', romanized: 'gachi gongbuhaeyo', arabic: 'ندرس معاً' }
    ],
    vocabulary: [
      { korean: '아침', romanized: 'achim', arabic: 'صباح' },
      { korean: '학교', romanized: 'hakgyo', arabic: 'مدرسة' },
      { korean: '친구', romanized: 'chingu', arabic: 'صديق' },
      { korean: '가방', romanized: 'gabang', arabic: 'حقيبة' }
    ]
  },
  {
    id: '2',
    title: '나의 가족',
    titleArabic: 'عائلتي',
    artist: 'أغنية تعليمية',
    difficulty: 'beginner',
    lyrics: [
      { korean: '우리 가족 소개해요', romanized: 'uri gajok sogaehaeyo', arabic: 'أقدم عائلتي' },
      { korean: '아버지 어머니', romanized: 'abeoji eomeoni', arabic: 'أبي وأمي' },
      { korean: '형과 누나', romanized: 'hyeonggwa nuna', arabic: 'أخي الأكبر وأختي الكبرى' },
      { korean: '동생도 있어요', romanized: 'dongsaengdo isseoyo', arabic: 'لدي أخ/أخت أصغر أيضاً' },
      { korean: '할아버지 할머니', romanized: 'harabeoji halmeoni', arabic: 'جدي وجدتي' },
      { korean: '모두 사랑해요', romanized: 'modu saranghaeyo', arabic: 'أحب الجميع' }
    ],
    vocabulary: [
      { korean: '가족', romanized: 'gajok', arabic: 'عائلة' },
      { korean: '아버지', romanized: 'abeoji', arabic: 'أب' },
      { korean: '어머니', romanized: 'eomeoni', arabic: 'أم' },
      { korean: '사랑', romanized: 'sarang', arabic: 'حب' }
    ]
  },
  {
    id: '3',
    title: '숫자 노래',
    titleArabic: 'أغنية الأرقام',
    artist: 'أغنية تعليمية',
    difficulty: 'beginner',
    lyrics: [
      { korean: '하나 둘 셋 넷 다섯', romanized: 'hana dul set net daseot', arabic: 'واحد اثنان ثلاثة أربعة خمسة' },
      { korean: '여섯 일곱 여덟', romanized: 'yeoseot ilgop yeodeol', arabic: 'ستة سبعة ثمانية' },
      { korean: '아홉 열', romanized: 'ahop yeol', arabic: 'تسعة عشرة' },
      { korean: '숫자를 세어 봐요', romanized: 'sutjareul seeo bwayo', arabic: 'لنعد الأرقام' },
      { korean: '하나부터 열까지', romanized: 'hanabутео yeolkkaji', arabic: 'من واحد إلى عشرة' },
      { korean: '잘 알았어요', romanized: 'jal arasseoyo', arabic: 'فهمت جيداً' }
    ],
    vocabulary: [
      { korean: '하나', romanized: 'hana', arabic: 'واحد' },
      { korean: '둘', romanized: 'dul', arabic: 'اثنان' },
      { korean: '열', romanized: 'yeol', arabic: 'عشرة' },
      { korean: '숫자', romanized: 'sutja', arabic: 'رقم' }
    ]
  },
  {
    id: '4',
    title: '날씨 노래',
    titleArabic: 'أغنية الطقس',
    artist: 'أغنية تعليمية',
    difficulty: 'intermediate',
    lyrics: [
      { korean: '오늘 날씨가 어때요?', romanized: 'oneul nalssiga eottaeyo?', arabic: 'كيف الطقس اليوم؟' },
      { korean: '맑고 화창해요', romanized: 'malkgo hwachanhaeyo', arabic: 'صافٍ ومشرق' },
      { korean: '비가 와요 우산 써요', romanized: 'biga wayo usan sseoyo', arabic: 'تمطر، أستخدم مظلة' },
      { korean: '눈이 와요 춥네요', romanized: 'nuni wayo chupneyo', arabic: 'تثلج، الجو بارد' },
      { korean: '바람이 불어요', romanized: 'barami bureoyo', arabic: 'الرياح تهب' },
      { korean: '날씨가 좋아요', romanized: 'nalssiga joayo', arabic: 'الطقس جميل' }
    ],
    vocabulary: [
      { korean: '날씨', romanized: 'nalssi', arabic: 'طقس' },
      { korean: '비', romanized: 'bi', arabic: 'مطر' },
      { korean: '눈', romanized: 'nun', arabic: 'ثلج' },
      { korean: '바람', romanized: 'baram', arabic: 'رياح' }
    ]
  },
  {
    id: '5',
    title: '한글 노래',
    titleArabic: 'أغنية الهانغول',
    artist: 'أغنية تعليمية',
    difficulty: 'beginner',
    lyrics: [
      { korean: '가나다라 마바사', romanized: 'ga na da ra ma ba sa', arabic: 'جا نا دا را ما با سا' },
      { korean: '아자차카 타파하', romanized: 'a ja cha ka ta pa ha', arabic: 'آ جا تشا كا تا با ها' },
      { korean: '한글을 배워요', romanized: 'hangeureul baeweoyo', arabic: 'نتعلم الهانغول' },
      { korean: '쉽고 재미있어요', romanized: 'swipgo jaemiisseoyo', arabic: 'سهل وممتع' },
      { korean: '매일 연습해요', romanized: 'maeil yeonseubhaeyo', arabic: 'نتمرن كل يوم' },
      { korean: '한글 최고예요', romanized: 'hangeul choegoyeyo', arabic: 'الهانغول الأفضل' }
    ],
    vocabulary: [
      { korean: '한글', romanized: 'hangeul', arabic: 'الهانغول' },
      { korean: '배우다', romanized: 'baeuda', arabic: 'يتعلم' },
      { korean: '쉽다', romanized: 'swipda', arabic: 'سهل' },
      { korean: '연습', romanized: 'yeonseup', arabic: 'تمرين' }
    ]
  }
];

const Songs: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  const speakLyric = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const playFullSong = (song: Song) => {
    setIsPlaying(true);
    let lineIndex = 0;
    
    const speakNextLine = () => {
      if (lineIndex < song.lyrics.length) {
        setCurrentLine(lineIndex);
        const utterance = new SpeechSynthesisUtterance(song.lyrics[lineIndex].korean);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.7;
        utterance.onend = () => {
          lineIndex++;
          setTimeout(speakNextLine, 500);
        };
        speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
        setCurrentLine(0);
      }
    };
    
    speakNextLine();
  };

  const stopPlaying = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentLine(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'intermediate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'advanced': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-muted';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    if (isArabic) {
      switch (difficulty) {
        case 'beginner': return 'مبتدئ';
        case 'intermediate': return 'متوسط';
        case 'advanced': return 'متقدم';
        default: return difficulty;
      }
    }
    return difficulty;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-500/5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isArabic ? 'العودة' : '돌아가기'}
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
              <Music className="w-6 h-6 text-pink-500" />
            </div>
            <h1 className="text-xl font-bold">
              {isArabic ? 'الأغاني الكورية' : '한국어 노래'}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Welcome message */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            {isArabic ? 'محمد أيمن يرحب بك - تعلم الكورية بالأغاني' : 'Mohamed Ayman welcomes you - 노래로 한국어 배우기'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedSong ? (
            // Songs List
            <motion.div
              key="songs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/10"
                    onClick={() => setSelectedSong(song)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{song.title}</h3>
                          <p className="text-muted-foreground text-sm">{song.titleArabic}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${getDifficultyColor(song.difficulty)}`}>
                              {getDifficultyLabel(song.difficulty)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {song.lyrics.length} {isArabic ? 'سطر' : '줄'}
                            </span>
                          </div>
                        </div>
                        <Play className="w-6 h-6 text-pink-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Song Detail
            <motion.div
              key="song-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => { setSelectedSong(null); stopPlaying(); }}
                className="mb-4 gap-2"
              >
                {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isArabic ? 'العودة للقائمة' : '목록으로'}
              </Button>

              {/* Song Header */}
              <Card className="mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Music className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
                      <p className="text-white/80">{selectedSong.titleArabic}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => isPlaying ? stopPlaying() : playFullSong(selectedSong)}
                      className="rounded-full w-14 h-14"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Lyrics */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-pink-500" />
                    {isArabic ? 'كلمات الأغنية' : '가사'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSong.lyrics.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        scale: isPlaying && currentLine === index ? 1.02 : 1,
                        backgroundColor: isPlaying && currentLine === index ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                      }}
                      className={`p-4 rounded-xl cursor-pointer hover:bg-muted transition-all ${
                        isPlaying && currentLine === index ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => speakLyric(line.korean)}
                    >
                      <p className="font-korean text-xl font-bold mb-1">{line.korean}</p>
                      <p className="text-primary text-sm mb-1">{line.romanized}</p>
                      <p className="text-muted-foreground">{line.arabic}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Vocabulary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    {isArabic ? 'المفردات المهمة' : '중요 단어'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSong.vocabulary.map((word, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => speakLyric(word.korean)}
                      >
                        <p className="font-korean text-lg font-bold">{word.korean}</p>
                        <p className="text-xs text-primary">{word.romanized}</p>
                        <p className="text-sm text-muted-foreground">{word.arabic}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Songs;
