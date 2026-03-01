/**
 * Massive content pool for infinite game play.
 * Combines all levels data + generates additional content dynamically.
 */
import { consonants, vowels, vocabulary, basicSentences, advancedSentences } from '@/data/koreanData';
import { advancedVocabulary } from '@/data/level3VocabularyData';
import { dailyLifeSentences } from '@/data/level5Data';

export interface GameItem {
  id: string;
  korean: string;
  arabic: string;
  romanized?: string;
  type: 'letter' | 'number' | 'vocabulary' | 'sentence';
}

// Extra Korean numbers (native + sino-Korean)
const extraNumbers: GameItem[] = [
  { id: 'num-1', korean: '하나', arabic: '١ (واحد)', type: 'number' },
  { id: 'num-2', korean: '둘', arabic: '٢ (اثنان)', type: 'number' },
  { id: 'num-3', korean: '셋', arabic: '٣ (ثلاثة)', type: 'number' },
  { id: 'num-4', korean: '넷', arabic: '٤ (أربعة)', type: 'number' },
  { id: 'num-5', korean: '다섯', arabic: '٥ (خمسة)', type: 'number' },
  { id: 'num-6', korean: '여섯', arabic: '٦ (ستة)', type: 'number' },
  { id: 'num-7', korean: '일곱', arabic: '٧ (سبعة)', type: 'number' },
  { id: 'num-8', korean: '여덟', arabic: '٨ (ثمانية)', type: 'number' },
  { id: 'num-9', korean: '아홉', arabic: '٩ (تسعة)', type: 'number' },
  { id: 'num-10', korean: '열', arabic: '١٠ (عشرة)', type: 'number' },
  { id: 'num-20', korean: '스물', arabic: '٢٠ (عشرون)', type: 'number' },
  { id: 'num-30', korean: '서른', arabic: '٣٠ (ثلاثون)', type: 'number' },
  { id: 'num-40', korean: '마흔', arabic: '٤٠ (أربعون)', type: 'number' },
  { id: 'num-50', korean: '쉰', arabic: '٥٠ (خمسون)', type: 'number' },
  { id: 'num-100', korean: '백', arabic: '١٠٠ (مائة)', type: 'number' },
  { id: 'snum-1', korean: '일', arabic: '١ (واحد صيني)', type: 'number' },
  { id: 'snum-2', korean: '이', arabic: '٢ (اثنان صيني)', type: 'number' },
  { id: 'snum-3', korean: '삼', arabic: '٣ (ثلاثة صيني)', type: 'number' },
  { id: 'snum-4', korean: '사', arabic: '٤ (أربعة صيني)', type: 'number' },
  { id: 'snum-5', korean: '오', arabic: '٥ (خمسة صيني)', type: 'number' },
  { id: 'snum-6', korean: '육', arabic: '٦ (ستة صيني)', type: 'number' },
  { id: 'snum-7', korean: '칠', arabic: '٧ (سبعة صيني)', type: 'number' },
  { id: 'snum-8', korean: '팔', arabic: '٨ (ثمانية صيني)', type: 'number' },
  { id: 'snum-9', korean: '구', arabic: '٩ (تسعة صيني)', type: 'number' },
  { id: 'snum-10', korean: '십', arabic: '١٠ (عشرة صيني)', type: 'number' },
];

// Extra vocabulary beyond what's in the levels
const extraVocabulary: GameItem[] = [
  { id: 'ev-1', korean: '컴퓨터', arabic: 'حاسوب', type: 'vocabulary' },
  { id: 'ev-2', korean: '전화', arabic: 'هاتف', type: 'vocabulary' },
  { id: 'ev-3', korean: '인터넷', arabic: 'إنترنت', type: 'vocabulary' },
  { id: 'ev-4', korean: '음악', arabic: 'موسيقى', type: 'vocabulary' },
  { id: 'ev-5', korean: '영화', arabic: 'فيلم', type: 'vocabulary' },
  { id: 'ev-6', korean: '여행', arabic: 'سفر', type: 'vocabulary' },
  { id: 'ev-7', korean: '비행기', arabic: 'طائرة', type: 'vocabulary' },
  { id: 'ev-8', korean: '기차', arabic: 'قطار', type: 'vocabulary' },
  { id: 'ev-9', korean: '자동차', arabic: 'سيارة', type: 'vocabulary' },
  { id: 'ev-10', korean: '자전거', arabic: 'دراجة', type: 'vocabulary' },
  { id: 'ev-11', korean: '도서관', arabic: 'مكتبة', type: 'vocabulary' },
  { id: 'ev-12', korean: '공원', arabic: 'حديقة', type: 'vocabulary' },
  { id: 'ev-13', korean: '슈퍼마켓', arabic: 'سوبرماركت', type: 'vocabulary' },
  { id: 'ev-14', korean: '약국', arabic: 'صيدلية', type: 'vocabulary' },
  { id: 'ev-15', korean: '우체국', arabic: 'مكتب بريد', type: 'vocabulary' },
  { id: 'ev-16', korean: '경찰서', arabic: 'مركز شرطة', type: 'vocabulary' },
  { id: 'ev-17', korean: '소방서', arabic: 'إطفاء', type: 'vocabulary' },
  { id: 'ev-18', korean: '대사관', arabic: 'سفارة', type: 'vocabulary' },
  { id: 'ev-19', korean: '호텔', arabic: 'فندق', type: 'vocabulary' },
  { id: 'ev-20', korean: '식당', arabic: 'مطعم', type: 'vocabulary' },
  { id: 'ev-21', korean: '카페', arabic: 'مقهى', type: 'vocabulary' },
  { id: 'ev-22', korean: '은행', arabic: 'بنك', type: 'vocabulary' },
  { id: 'ev-23', korean: '시장', arabic: 'سوق', type: 'vocabulary' },
  { id: 'ev-24', korean: '극장', arabic: 'مسرح', type: 'vocabulary' },
  { id: 'ev-25', korean: '미술관', arabic: 'متحف فني', type: 'vocabulary' },
  { id: 'ev-26', korean: '박물관', arabic: 'متحف', type: 'vocabulary' },
  { id: 'ev-27', korean: '수영장', arabic: 'مسبح', type: 'vocabulary' },
  { id: 'ev-28', korean: '체육관', arabic: 'صالة رياضية', type: 'vocabulary' },
  { id: 'ev-29', korean: '놀이공원', arabic: 'مدينة ملاهي', type: 'vocabulary' },
  { id: 'ev-30', korean: '동물원', arabic: 'حديقة حيوان', type: 'vocabulary' },
  { id: 'ev-31', korean: '꽃집', arabic: 'محل زهور', type: 'vocabulary' },
  { id: 'ev-32', korean: '빵집', arabic: 'مخبز', type: 'vocabulary' },
  { id: 'ev-33', korean: '세탁소', arabic: 'مغسلة', type: 'vocabulary' },
  { id: 'ev-34', korean: '미용실', arabic: 'صالون تجميل', type: 'vocabulary' },
  { id: 'ev-35', korean: '이발소', arabic: 'حلاق', type: 'vocabulary' },
  { id: 'ev-36', korean: '주유소', arabic: 'محطة وقود', type: 'vocabulary' },
  { id: 'ev-37', korean: '지하철', arabic: 'مترو', type: 'vocabulary' },
  { id: 'ev-38', korean: '택시', arabic: 'تاكسي', type: 'vocabulary' },
  { id: 'ev-39', korean: '버스', arabic: 'حافلة', type: 'vocabulary' },
  { id: 'ev-40', korean: '정류장', arabic: 'محطة', type: 'vocabulary' },
  { id: 'ev-41', korean: '날씨', arabic: 'طقس', type: 'vocabulary' },
  { id: 'ev-42', korean: '비', arabic: 'مطر', type: 'vocabulary' },
  { id: 'ev-43', korean: '눈', arabic: 'ثلج', type: 'vocabulary' },
  { id: 'ev-44', korean: '바람', arabic: 'رياح', type: 'vocabulary' },
  { id: 'ev-45', korean: '구름', arabic: 'سحاب', type: 'vocabulary' },
  { id: 'ev-46', korean: '하늘', arabic: 'سماء', type: 'vocabulary' },
  { id: 'ev-47', korean: '바다', arabic: 'بحر', type: 'vocabulary' },
  { id: 'ev-48', korean: '산', arabic: 'جبل', type: 'vocabulary' },
  { id: 'ev-49', korean: '강', arabic: 'نهر', type: 'vocabulary' },
  { id: 'ev-50', korean: '호수', arabic: 'بحيرة', type: 'vocabulary' },
  { id: 'ev-51', korean: '사막', arabic: 'صحراء', type: 'vocabulary' },
  { id: 'ev-52', korean: '숲', arabic: 'غابة', type: 'vocabulary' },
  { id: 'ev-53', korean: '섬', arabic: 'جزيرة', type: 'vocabulary' },
  { id: 'ev-54', korean: '별', arabic: 'نجمة', type: 'vocabulary' },
  { id: 'ev-55', korean: '달', arabic: 'قمر', type: 'vocabulary' },
  { id: 'ev-56', korean: '태양', arabic: 'شمس', type: 'vocabulary' },
  { id: 'ev-57', korean: '지구', arabic: 'أرض', type: 'vocabulary' },
  { id: 'ev-58', korean: '우주', arabic: 'فضاء', type: 'vocabulary' },
  { id: 'ev-59', korean: '평화', arabic: 'سلام', type: 'vocabulary' },
  { id: 'ev-60', korean: '행복', arabic: 'سعادة', type: 'vocabulary' },
];

// Extra sentences
const extraSentences: GameItem[] = [
  { id: 'es-1', korean: '오늘 뭐 했어요?', arabic: 'ماذا فعلت اليوم؟', type: 'sentence' },
  { id: 'es-2', korean: '내일 시간 있어요?', arabic: 'هل لديك وقت غداً؟', type: 'sentence' },
  { id: 'es-3', korean: '어디에 가고 싶어요?', arabic: 'أين تريد أن تذهب؟', type: 'sentence' },
  { id: 'es-4', korean: '한국어 잘하시네요!', arabic: 'أنت تتحدث الكورية بشكل جيد!', type: 'sentence' },
  { id: 'es-5', korean: '다시 한 번 말해 주세요', arabic: 'أعد ما قلته من فضلك', type: 'sentence' },
  { id: 'es-6', korean: '천천히 말해 주세요', arabic: 'تحدث ببطء من فضلك', type: 'sentence' },
  { id: 'es-7', korean: '이해했어요', arabic: 'فهمت', type: 'sentence' },
  { id: 'es-8', korean: '모르겠어요', arabic: 'لا أعرف', type: 'sentence' },
  { id: 'es-9', korean: '도와주세요', arabic: 'ساعدني من فضلك', type: 'sentence' },
  { id: 'es-10', korean: '얼마예요?', arabic: 'كم السعر؟', type: 'sentence' },
  { id: 'es-11', korean: '화장실이 어디예요?', arabic: 'أين الحمام؟', type: 'sentence' },
  { id: 'es-12', korean: '메뉴 주세요', arabic: 'أعطني القائمة من فضلك', type: 'sentence' },
  { id: 'es-13', korean: '계산해 주세요', arabic: 'الحساب من فضلك', type: 'sentence' },
  { id: 'es-14', korean: '예약했어요', arabic: 'لدي حجز', type: 'sentence' },
  { id: 'es-15', korean: '좀 깎아 주세요', arabic: 'خصم قليلاً من فضلك', type: 'sentence' },
  { id: 'es-16', korean: '맛있게 드세요', arabic: 'بالعافية', type: 'sentence' },
  { id: 'es-17', korean: '잘 먹겠습니다', arabic: 'سأتناول الطعام بشكل جيد', type: 'sentence' },
  { id: 'es-18', korean: '잘 먹었습니다', arabic: 'أكلت جيداً', type: 'sentence' },
  { id: 'es-19', korean: '조심하세요', arabic: 'كن حذراً', type: 'sentence' },
  { id: 'es-20', korean: '축하해요', arabic: 'مبروك', type: 'sentence' },
  { id: 'es-21', korean: '생일 축하해요', arabic: 'عيد ميلاد سعيد', type: 'sentence' },
  { id: 'es-22', korean: '새해 복 많이 받으세요', arabic: 'سنة جديدة سعيدة', type: 'sentence' },
  { id: 'es-23', korean: '사진 찍어 주세요', arabic: 'التقط صورة لي من فضلك', type: 'sentence' },
  { id: 'es-24', korean: '와이파이 비밀번호가 뭐예요?', arabic: 'ما كلمة سر الواي فاي؟', type: 'sentence' },
  { id: 'es-25', korean: '택시 불러 주세요', arabic: 'اتصل بتاكسي من فضلك', type: 'sentence' },
  { id: 'es-26', korean: '여기서 가까워요?', arabic: 'هل هو قريب من هنا؟', type: 'sentence' },
  { id: 'es-27', korean: '길을 잃었어요', arabic: 'لقد ضللت الطريق', type: 'sentence' },
  { id: 'es-28', korean: '한국에서 왔어요', arabic: 'جئت من كوريا', type: 'sentence' },
  { id: 'es-29', korean: '저는 이집트 사람이에요', arabic: 'أنا مصري', type: 'sentence' },
  { id: 'es-30', korean: '한국어를 배우고 있어요', arabic: 'أنا أتعلم الكورية', type: 'sentence' },
];

/** Get ALL content as GameItem[] */
export function getAllGameContent(): GameItem[] {
  const items: GameItem[] = [];

  // Letters
  consonants.forEach(c => items.push({ id: `c-${c.id}`, korean: c.korean, arabic: c.arabic, romanized: c.romanized, type: 'letter' }));
  vowels.forEach(v => items.push({ id: `v-${v.id}`, korean: v.korean, arabic: v.arabic, romanized: v.romanized, type: 'letter' }));

  // Numbers
  items.push(...extraNumbers);

  // Vocabulary from all levels
  vocabulary.forEach(w => items.push({ id: `voc-${w.id}`, korean: w.korean, arabic: w.arabic, romanized: w.romanized, type: 'vocabulary' }));
  advancedVocabulary.forEach(w => items.push({ id: `avoc-${w.id}`, korean: w.korean, arabic: w.arabic, romanized: w.romanized, type: 'vocabulary' }));

  // Extra vocabulary
  items.push(...extraVocabulary);

  // Sentences from all levels
  basicSentences.forEach(s => items.push({ id: `bs-${s.id}`, korean: s.korean, arabic: s.arabic, romanized: s.romanized, type: 'sentence' }));
  advancedSentences.forEach(s => items.push({ id: `as-${s.id}`, korean: s.korean, arabic: s.arabic, romanized: s.romanized, type: 'sentence' }));
  dailyLifeSentences.forEach(s => items.push({ id: `dl-${s.id}`, korean: s.korean, arabic: s.arabic, romanized: s.romanized, type: 'sentence' }));

  // Extra sentences
  items.push(...extraSentences);

  return items;
}

/** Shuffle array in-place copy */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/** Get N random unique items from pool, excluding usedIds */
export function getRandomItems(pool: GameItem[], count: number, usedIds: Set<string>): GameItem[] {
  const available = pool.filter(item => !usedIds.has(item.id));
  
  // If we've used all items, reset
  if (available.length < count) {
    return shuffleArray(pool).slice(0, count);
  }
  
  return shuffleArray(available).slice(0, count);
}

/** Get vocabulary items (for games that need word pairs) */
export function getVocabularyPool(): GameItem[] {
  return getAllGameContent().filter(item => item.type === 'vocabulary' || item.type === 'sentence');
}

/** Get letter items */
export function getLetterPool(): GameItem[] {
  return getAllGameContent().filter(item => item.type === 'letter');
}
