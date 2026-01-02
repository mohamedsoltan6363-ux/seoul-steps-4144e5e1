import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, BookOpen, Check, X, Volume2, Star, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: number;
  title: string;
  titleAr: string;
  level: "beginner" | "intermediate" | "advanced";
  paragraphs: {
    korean: string;
    romanization: string;
    arabic: string;
  }[];
  questions: {
    question: string;
    questionAr: string;
    options: string[];
    optionsAr: string[];
    correctAnswer: number;
  }[];
  vocabulary: {
    word: string;
    romanization: string;
    meaning: string;
  }[];
}

const stories: Story[] = [
  {
    id: 1,
    title: "나의 하루",
    titleAr: "يومي",
    level: "beginner",
    paragraphs: [
      {
        korean: "안녕하세요! 저는 민수입니다.",
        romanization: "Annyeonghaseyo! Jeoneun Minsu-imnida.",
        arabic: "مرحباً! أنا مينسو."
      },
      {
        korean: "저는 아침에 일찍 일어납니다.",
        romanization: "Jeoneun achime iljjik ireonamnida.",
        arabic: "أستيقظ مبكراً في الصباح."
      },
      {
        korean: "아침을 먹고 학교에 갑니다.",
        romanization: "Achimeul meokgo hakgyoe gamnida.",
        arabic: "آكل الإفطار وأذهب إلى المدرسة."
      },
      {
        korean: "학교에서 한국어를 공부합니다.",
        romanization: "Hakgyoeseo hangugeo-reul gongbuhamnida.",
        arabic: "أدرس اللغة الكورية في المدرسة."
      },
      {
        korean: "저녁에는 가족과 함께 저녁을 먹습니다.",
        romanization: "Jeonyeogeneun gajokgwa hamkke jeonyeogeul meokseumnida.",
        arabic: "في المساء، أتناول العشاء مع عائلتي."
      }
    ],
    questions: [
      {
        question: "이 사람의 이름은 무엇입니까?",
        questionAr: "ما اسم هذا الشخص؟",
        options: ["지수", "민수", "영희", "철수"],
        optionsAr: ["جيسو", "مينسو", "يونغهي", "تشولسو"],
        correctAnswer: 1
      },
      {
        question: "이 사람은 언제 일어납니까?",
        questionAr: "متى يستيقظ هذا الشخص؟",
        options: ["저녁에", "밤에", "아침에 일찍", "오후에"],
        optionsAr: ["في المساء", "في الليل", "مبكراً في الصباح", "بعد الظهر"],
        correctAnswer: 2
      },
      {
        question: "학교에서 무엇을 공부합니까?",
        questionAr: "ماذا يدرس في المدرسة؟",
        options: ["영어", "중국어", "일본어", "한국어"],
        optionsAr: ["الإنجليزية", "الصينية", "اليابانية", "الكورية"],
        correctAnswer: 3
      }
    ],
    vocabulary: [
      { word: "아침", romanization: "achim", meaning: "صباح / إفطار" },
      { word: "학교", romanization: "hakgyo", meaning: "مدرسة" },
      { word: "가족", romanization: "gajok", meaning: "عائلة" },
      { word: "저녁", romanization: "jeonyeok", meaning: "مساء / عشاء" }
    ]
  },
  {
    id: 2,
    title: "카페에서",
    titleAr: "في المقهى",
    level: "beginner",
    paragraphs: [
      {
        korean: "오늘 친구와 카페에 갔습니다.",
        romanization: "Oneul chinguwa kapee gasseumnida.",
        arabic: "ذهبت إلى المقهى مع صديقي اليوم."
      },
      {
        korean: "저는 아메리카노를 주문했습니다.",
        romanization: "Jeoneun amerikano-reul jumunhaesseumnida.",
        arabic: "طلبت قهوة أمريكانو."
      },
      {
        korean: "친구는 라떼를 주문했습니다.",
        romanization: "Chinguneun latte-reul jumunhaesseumnida.",
        arabic: "صديقي طلب لاتيه."
      },
      {
        korean: "우리는 케이크도 먹었습니다.",
        romanization: "Urineun keikeu-do meogeosseumnida.",
        arabic: "أكلنا كعكة أيضاً."
      },
      {
        korean: "카페에서 재미있게 이야기했습니다.",
        romanization: "Kapeeseo jaemiitge iyagihaesseumnida.",
        arabic: "تحدثنا بشكل ممتع في المقهى."
      }
    ],
    questions: [
      {
        question: "누구와 카페에 갔습니까?",
        questionAr: "مع من ذهب إلى المقهى؟",
        options: ["가족", "선생님", "친구", "혼자"],
        optionsAr: ["العائلة", "المعلم", "صديق", "وحده"],
        correctAnswer: 2
      },
      {
        question: "이 사람은 무엇을 주문했습니까?",
        questionAr: "ماذا طلب هذا الشخص؟",
        options: ["라떼", "아메리카노", "주스", "차"],
        optionsAr: ["لاتيه", "أمريكانو", "عصير", "شاي"],
        correctAnswer: 1
      },
      {
        question: "케이크를 먹었습니까?",
        questionAr: "هل أكلوا الكعكة؟",
        options: ["아니요", "모르겠습니다", "네, 먹었습니다", "케이크가 없었습니다"],
        optionsAr: ["لا", "لا أعرف", "نعم، أكلوا", "لم يكن هناك كعكة"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "친구", romanization: "chingu", meaning: "صديق" },
      { word: "카페", romanization: "kape", meaning: "مقهى" },
      { word: "주문하다", romanization: "jumunhada", meaning: "يطلب" },
      { word: "케이크", romanization: "keikeu", meaning: "كعكة" }
    ]
  },
  {
    id: 3,
    title: "서울 여행",
    titleAr: "رحلة إلى سيول",
    level: "intermediate",
    paragraphs: [
      {
        korean: "지난 주말에 서울에 여행을 갔습니다.",
        romanization: "Jinan jumare seoure yeohaengeul gasseumnida.",
        arabic: "ذهبت في رحلة إلى سيول في عطلة نهاية الأسبوع الماضية."
      },
      {
        korean: "먼저 경복궁을 방문했습니다.",
        romanization: "Meonjeo Gyeongbokgungeul bangmunhaesseumnida.",
        arabic: "أولاً، زرت قصر جيونغبوكجونغ."
      },
      {
        korean: "한복을 입고 사진을 많이 찍었습니다.",
        romanization: "Hanbogeul ipgo sajineul mani jjigeosseumnida.",
        arabic: "لبست الهانبوك والتقطت الكثير من الصور."
      },
      {
        korean: "점심에는 비빔밥을 먹었습니다.",
        romanization: "Jeomsimeneun bibimbapeul meogeosseumnida.",
        arabic: "تناولت البيبيمباب على الغداء."
      },
      {
        korean: "오후에는 명동에서 쇼핑을 했습니다.",
        romanization: "Ohue-neun Myeongdongeseo shyopingeul haesseumnida.",
        arabic: "في فترة بعد الظهر، تسوقت في ميونغدونغ."
      },
      {
        korean: "서울은 정말 아름다운 도시입니다.",
        romanization: "Seourun jeongmal areumdaun dosi-imnida.",
        arabic: "سيول مدينة جميلة حقاً."
      }
    ],
    questions: [
      {
        question: "언제 서울에 갔습니까?",
        questionAr: "متى ذهب إلى سيول؟",
        options: ["어제", "지난 주말", "다음 주", "오늘"],
        optionsAr: ["أمس", "عطلة الأسبوع الماضية", "الأسبوع القادم", "اليوم"],
        correctAnswer: 1
      },
      {
        question: "경복궁에서 무엇을 했습니까?",
        questionAr: "ماذا فعل في قصر جيونغبوكجونغ؟",
        options: ["쇼핑했습니다", "한복을 입고 사진을 찍었습니다", "밥을 먹었습니다", "친구를 만났습니다"],
        optionsAr: ["تسوق", "لبس الهانبوك والتقط صوراً", "أكل", "قابل صديقاً"],
        correctAnswer: 1
      },
      {
        question: "점심에 무엇을 먹었습니까?",
        questionAr: "ماذا أكل على الغداء؟",
        options: ["김치찌개", "불고기", "비빔밥", "삼겹살"],
        optionsAr: ["كيمتشي جيجي", "بولجوجي", "بيبيمباب", "سامجيوبسال"],
        correctAnswer: 2
      },
      {
        question: "오후에 어디서 쇼핑을 했습니까?",
        questionAr: "أين تسوق بعد الظهر؟",
        options: ["홍대", "강남", "명동", "이태원"],
        optionsAr: ["هونغداي", "كانغنام", "ميونغدونغ", "إيتايوون"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "여행", romanization: "yeohaeng", meaning: "رحلة / سفر" },
      { word: "경복궁", romanization: "Gyeongbokgung", meaning: "قصر جيونغبوكجونغ" },
      { word: "한복", romanization: "hanbok", meaning: "الزي الكوري التقليدي" },
      { word: "쇼핑", romanization: "shyoping", meaning: "تسوق" },
      { word: "아름답다", romanization: "areumdapda", meaning: "جميل" }
    ]
  },
  {
    id: 4,
    title: "한국어 수업",
    titleAr: "درس اللغة الكورية",
    level: "intermediate",
    paragraphs: [
      {
        korean: "저는 매주 화요일과 목요일에 한국어 수업이 있습니다.",
        romanization: "Jeoneun maeju hwayoilgwa mogyoire hangugeo sueobi isseumnida.",
        arabic: "لدي درس لغة كورية كل يوم ثلاثاء وخميس."
      },
      {
        korean: "선생님은 한국 사람입니다.",
        romanization: "Seonsaengnimeun hanguk saram-imnida.",
        arabic: "المعلم كوري."
      },
      {
        korean: "수업에서 한글, 문법, 그리고 회화를 배웁니다.",
        romanization: "Sueobeseo hangeul, munbeop, geurigo hoehwareul baeumnida.",
        arabic: "في الدرس نتعلم الهانغول والقواعد والمحادثة."
      },
      {
        korean: "저는 특히 회화 연습을 좋아합니다.",
        romanization: "Jeoneun teuki hoehwa yeonseeubeul joahamnida.",
        arabic: "أحب تدريب المحادثة بشكل خاص."
      },
      {
        korean: "한국 드라마를 보면서 발음 연습도 합니다.",
        romanization: "Hanguk deuramareul bomyeonseo bareum yeonseupdo hamnida.",
        arabic: "أتدرب على النطق أيضاً أثناء مشاهدة الدراما الكورية."
      },
      {
        korean: "언젠가 한국에서 유학하고 싶습니다.",
        romanization: "Eonjenga hangugeseo yuhakago sipseumnida.",
        arabic: "أريد الدراسة في كوريا يوماً ما."
      }
    ],
    questions: [
      {
        question: "한국어 수업은 언제 있습니까?",
        questionAr: "متى يكون درس اللغة الكورية؟",
        options: ["월요일과 수요일", "화요일과 목요일", "매일", "주말에"],
        optionsAr: ["الإثنين والأربعاء", "الثلاثاء والخميس", "كل يوم", "في عطلة الأسبوع"],
        correctAnswer: 1
      },
      {
        question: "선생님은 어느 나라 사람입니까?",
        questionAr: "من أي بلد المعلم؟",
        options: ["일본", "중국", "한국", "미국"],
        optionsAr: ["اليابان", "الصين", "كوريا", "أمريكا"],
        correctAnswer: 2
      },
      {
        question: "이 사람이 가장 좋아하는 것은 무엇입니까?",
        questionAr: "ما هو الشيء المفضل لهذا الشخص؟",
        options: ["문법", "한글", "회화 연습", "시험"],
        optionsAr: ["القواعد", "الهانغول", "تدريب المحادثة", "الامتحان"],
        correctAnswer: 2
      },
      {
        question: "발음 연습을 어떻게 합니까?",
        questionAr: "كيف يتدرب على النطق؟",
        options: ["노래를 들으면서", "한국 드라마를 보면서", "책을 읽으면서", "친구와 이야기하면서"],
        optionsAr: ["بالاستماع للأغاني", "بمشاهدة الدراما الكورية", "بقراءة الكتب", "بالتحدث مع الأصدقاء"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "수업", romanization: "sueop", meaning: "درس / حصة" },
      { word: "선생님", romanization: "seonsaengnim", meaning: "معلم" },
      { word: "문법", romanization: "munbeop", meaning: "قواعد" },
      { word: "회화", romanization: "hoehwa", meaning: "محادثة" },
      { word: "유학", romanization: "yuhak", meaning: "دراسة في الخارج" }
    ]
  },
  {
    id: 5,
    title: "첫 만남",
    titleAr: "اللقاء الأول",
    level: "advanced",
    paragraphs: [
      {
        korean: "어제 회사에서 새로운 동료를 만났습니다.",
        romanization: "Eoje hoesaeseo saeroun dongryoreul mannasseumnida.",
        arabic: "التقيت بزميل جديد في الشركة أمس."
      },
      {
        korean: "그 사람의 이름은 김지연이고 마케팅 부서에서 일합니다.",
        romanization: "Geu saram-ui ireumeun Kim Jiyeon-igo maketing buseoseo ilhamnida.",
        arabic: "اسمها كيم جيون وتعمل في قسم التسويق."
      },
      {
        korean: "지연 씨는 대학에서 경영학을 전공했다고 합니다.",
        romanization: "Jiyeon ssineun daehakeseo gyeongyeonghageul jeonggonghaetdago hamnida.",
        arabic: "قالت جيون إنها تخصصت في إدارة الأعمال في الجامعة."
      },
      {
        korean: "점심시간에 함께 밥을 먹으면서 많은 이야기를 나눴습니다.",
        romanization: "Jeomsim-sigane hamkke babeul meogeumyeonseo maneun iyagireul nanwosseumnida.",
        arabic: "تبادلنا الكثير من الحديث أثناء تناول الغداء معاً."
      },
      {
        korean: "지연 씨도 한국 음악과 드라마를 좋아해서 공통점이 많았습니다.",
        romanization: "Jiyeon ssido hanguk eumakgwa deuramareul joahaeeso gongtongjjeomi manasseumnida.",
        arabic: "جيون أيضاً تحب الموسيقى والدراما الكورية، لذا كان لدينا الكثير من القواسم المشتركة."
      },
      {
        korean: "앞으로 좋은 동료가 될 것 같아서 기분이 좋습니다.",
        romanization: "Apeuro joeun dongryoga doel geot gataseo gibuni joseumnida.",
        arabic: "أشعر بالسعادة لأنني أعتقد أننا سنكون زملاء جيدين في المستقبل."
      }
    ],
    questions: [
      {
        question: "새로운 동료를 어디서 만났습니까?",
        questionAr: "أين التقى بالزميل الجديد؟",
        options: ["카페에서", "학교에서", "회사에서", "집에서"],
        optionsAr: ["في المقهى", "في المدرسة", "في الشركة", "في المنزل"],
        correctAnswer: 2
      },
      {
        question: "지연 씨는 어느 부서에서 일합니까?",
        questionAr: "في أي قسم تعمل جيون؟",
        options: ["인사 부서", "마케팅 부서", "개발 부서", "영업 부서"],
        optionsAr: ["قسم الموارد البشرية", "قسم التسويق", "قسم التطوير", "قسم المبيعات"],
        correctAnswer: 1
      },
      {
        question: "지연 씨는 대학에서 무엇을 전공했습니까?",
        questionAr: "ماذا تخصصت جيون في الجامعة؟",
        options: ["한국어", "컴퓨터 공학", "경영학", "디자인"],
        optionsAr: ["اللغة الكورية", "هندسة الحاسوب", "إدارة الأعمال", "التصميم"],
        correctAnswer: 2
      },
      {
        question: "두 사람의 공통점은 무엇입니까?",
        questionAr: "ما هو القاسم المشترك بينهما؟",
        options: ["같은 대학을 다녔습니다", "한국 음악과 드라마를 좋아합니다", "같은 부서에서 일합니다", "같은 고향입니다"],
        optionsAr: ["درسوا في نفس الجامعة", "يحبون الموسيقى والدراما الكورية", "يعملون في نفس القسم", "من نفس المدينة"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "동료", romanization: "dongryo", meaning: "زميل" },
      { word: "부서", romanization: "buseo", meaning: "قسم" },
      { word: "전공", romanization: "jeongong", meaning: "تخصص" },
      { word: "공통점", romanization: "gongtongjjeom", meaning: "قاسم مشترك" },
      { word: "앞으로", romanization: "apeuro", meaning: "في المستقبل" }
    ]
  },
  {
    id: 6,
    title: "취업 면접",
    titleAr: "مقابلة العمل",
    level: "advanced",
    paragraphs: [
      {
        korean: "오늘 중요한 취업 면접이 있었습니다.",
        romanization: "Oneul jungyohan chwiup myeonjeob-i isseosseumnida.",
        arabic: "كان لدي مقابلة عمل مهمة اليوم."
      },
      {
        korean: "아침 일찍 일어나서 양복을 입고 준비했습니다.",
        romanization: "Achim iljjik ireonaseo yangbogeul ipgo junbihaesseumnida.",
        arabic: "استيقظت مبكراً في الصباح وارتديت بدلة واستعددت."
      },
      {
        korean: "면접관들은 저의 경력과 장점에 대해 질문했습니다.",
        romanization: "Myeonjeobgwandeureun jeoui gyeongnyeokgwa jangjeome daehae jilmunhaesseumnida.",
        arabic: "سألني المقابلون عن خبرتي ونقاط قوتي."
      },
      {
        korean: "저는 열심히 일하는 것과 팀워크를 강조했습니다.",
        romanization: "Jeoneun yeolsimhi ilhaneun geotgwa timwokereul gangjohaeseumnida.",
        arabic: "أكدت على العمل الجاد والعمل الجماعي."
      },
      {
        korean: "마지막에 회사에 대한 질문도 했습니다.",
        romanization: "Majimage hoesae daehan jilmundo haesseumnida.",
        arabic: "في النهاية، طرحت أيضاً أسئلة عن الشركة."
      },
      {
        korean: "결과가 나오기까지 2주 정도 기다려야 한다고 합니다.",
        romanization: "Gyeolgwaga naogikkaji iju jeongdo gidaryeoya handago hamnida.",
        arabic: "قالوا إنني يجب أن أنتظر حوالي أسبوعين للحصول على النتيجة."
      },
      {
        korean: "긴장했지만 최선을 다해서 후회는 없습니다.",
        romanization: "Ginjanghae-tjiman choeseoneul dahaeseo huhoe-neun eopseumnida.",
        arabic: "كنت متوتراً لكنني بذلت قصارى جهدي فلا أشعر بالندم."
      }
    ],
    questions: [
      {
        question: "오늘 무엇이 있었습니까?",
        questionAr: "ماذا كان لديه اليوم؟",
        options: ["수업", "여행", "취업 면접", "파티"],
        optionsAr: ["درس", "رحلة", "مقابلة عمل", "حفلة"],
        correctAnswer: 2
      },
      {
        question: "면접을 위해 무엇을 입었습니까?",
        questionAr: "ماذا ارتدى للمقابلة؟",
        options: ["청바지", "양복", "운동복", "한복"],
        optionsAr: ["جينز", "بدلة", "ملابس رياضية", "هانبوك"],
        correctAnswer: 1
      },
      {
        question: "이 사람이 강조한 것은 무엇입니까?",
        questionAr: "ما الذي أكد عليه هذا الشخص؟",
        options: ["높은 연봉", "열심히 일하는 것과 팀워크", "빠른 승진", "긴 휴가"],
        optionsAr: ["راتب عالي", "العمل الجاد والعمل الجماعي", "ترقية سريعة", "إجازة طويلة"],
        correctAnswer: 1
      },
      {
        question: "결과는 언제 나옵니까?",
        questionAr: "متى ستظهر النتيجة؟",
        options: ["오늘", "내일", "2주 후", "한 달 후"],
        optionsAr: ["اليوم", "غداً", "بعد أسبوعين", "بعد شهر"],
        correctAnswer: 2
      },
      {
        question: "면접 후 기분이 어땠습니까?",
        questionAr: "كيف كان شعوره بعد المقابلة؟",
        options: ["후회가 많았습니다", "후회가 없었습니다", "슬펐습니다", "화가 났습니다"],
        optionsAr: ["شعر بالكثير من الندم", "لم يشعر بالندم", "كان حزيناً", "كان غاضباً"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "취업", romanization: "chwiup", meaning: "توظيف / الحصول على عمل" },
      { word: "면접", romanization: "myeonjeop", meaning: "مقابلة" },
      { word: "경력", romanization: "gyeongnyeok", meaning: "خبرة مهنية" },
      { word: "장점", romanization: "jangjeom", meaning: "نقاط القوة" },
      { word: "팀워크", romanization: "timwokeu", meaning: "العمل الجماعي" },
      { word: "후회", romanization: "huhoe", meaning: "ندم" }
    ]
  }
];

const Stories = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === "ar";

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [completedStories, setCompletedStories] = useState<number[]>([]);

  const speakKorean = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setCurrentParagraph(0);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
    setShowVocabulary(false);
  };

  const handleNextParagraph = () => {
    if (selectedStory && currentParagraph < selectedStory.paragraphs.length - 1) {
      setCurrentParagraph(currentParagraph + 1);
    } else {
      setShowVocabulary(true);
    }
  };

  const handlePrevParagraph = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph(currentParagraph - 1);
    }
  };

  const startQuiz = () => {
    setShowVocabulary(false);
    setShowQuiz(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !selectedStory) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === selectedStory.questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: isRTL ? "إجابة صحيحة! 🎉" : "정답입니다! 🎉",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: isRTL ? "إجابة خاطئة" : "틀렸습니다",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuestion < selectedStory.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
        if (!completedStories.includes(selectedStory.id)) {
          setCompletedStories([...completedStories, selectedStory.id]);
        }
      }
    }, 1500);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const getLevelText = (level: string) => {
    if (isRTL) {
      switch (level) {
        case "beginner": return "مبتدئ";
        case "intermediate": return "متوسط";
        case "advanced": return "متقدم";
        default: return level;
      }
    }
    switch (level) {
      case "beginner": return "초급";
      case "intermediate": return "중급";
      case "advanced": return "고급";
      default: return level;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                {isRTL ? "القصص التفاعلية" : "인터랙티브 스토리"}
              </h1>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Trophy className="h-4 w-4 ml-1" />
            {completedStories.length}/{stories.length}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedStory ? (
            // Story Selection Grid
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {isRTL ? "اختر قصة لتبدأ القراءة" : "읽을 스토리를 선택하세요"}
                </h2>
                <p className="text-muted-foreground">
                  {isRTL ? "اقرأ القصص واختبر فهمك من خلال الأسئلة" : "스토리를 읽고 질문을 통해 이해력을 테스트하세요"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-2 ${
                        completedStories.includes(story.id)
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleStorySelect(story)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg mb-1">
                              {story.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {story.titleAr}
                            </p>
                          </div>
                          {completedStories.includes(story.id) && (
                            <div className="bg-green-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge className={getLevelColor(story.level)}>
                            {getLevelText(story.level)}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{story.paragraphs.length} {isRTL ? "فقرات" : "문단"}</span>
                            <span>•</span>
                            <span>{story.questions.length} {isRTL ? "أسئلة" : "질문"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : showVocabulary ? (
            // Vocabulary Section
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    {isRTL ? "المفردات الرئيسية" : "주요 어휘"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedStory.vocabulary.map((vocab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:bg-primary/10"
                          onClick={() => speakKorean(vocab.word)}
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                        <div>
                          <p className="text-lg font-bold text-foreground">{vocab.word}</p>
                          <p className="text-sm text-muted-foreground">{vocab.romanization}</p>
                        </div>
                      </div>
                      <p className="text-foreground font-medium">{vocab.meaning}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowVocabulary(false)}
                  className="flex items-center gap-2"
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {isRTL ? "العودة للقصة" : "스토리로 돌아가기"}
                </Button>
                <Button
                  onClick={startQuiz}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isRTL ? "ابدأ الاختبار" : "퀴즈 시작하기"}
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          ) : showQuiz ? (
            // Quiz Section
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {!quizComplete ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowQuiz(false);
                        setShowVocabulary(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                      {isRTL ? "العودة" : "돌아가기"}
                    </Button>
                    <Badge variant="outline" className="text-lg px-4 py-1">
                      {currentQuestion + 1} / {selectedStory.questions.length}
                    </Badge>
                  </div>

                  <Progress
                    value={((currentQuestion + 1) / selectedStory.questions.length) * 100}
                    className="h-2"
                  />

                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-xl text-center">
                        {isRTL
                          ? selectedStory.questions[currentQuestion].questionAr
                          : selectedStory.questions[currentQuestion].question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedStory.questions[currentQuestion].options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === selectedStory.questions[currentQuestion].correctAnswer;
                        const showResult = selectedAnswer !== null;

                        return (
                          <motion.button
                            key={index}
                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 rounded-lg border-2 text-right transition-all duration-300 ${
                              showResult
                                ? isCorrect
                                  ? "border-green-500 bg-green-500/20 text-green-400"
                                  : isSelected
                                  ? "border-red-500 bg-red-500/20 text-red-400"
                                  : "border-border bg-muted/30 text-muted-foreground"
                                : "border-border bg-muted/30 hover:border-primary hover:bg-primary/10 text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {isRTL
                                  ? selectedStory.questions[currentQuestion].optionsAr[index]
                                  : option}
                              </span>
                              {showResult && (
                                isCorrect ? (
                                  <Check className="h-5 w-5 text-green-500" />
                                ) : isSelected ? (
                                  <X className="h-5 w-5 text-red-500" />
                                ) : null
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Quiz Complete
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-2 border-primary/30 text-center">
                    <CardHeader>
                      <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <Trophy className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">
                        {isRTL ? "أحسنت! 🎉" : "수고하셨습니다! 🎉"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-4xl font-bold text-primary">
                        {score} / {selectedStory.questions.length}
                      </div>
                      <p className="text-muted-foreground">
                        {score === selectedStory.questions.length
                          ? isRTL
                            ? "ممتاز! أجبت على جميع الأسئلة بشكل صحيح!"
                            : "완벽합니다! 모든 질문에 정답을 맞추셨습니다!"
                          : score >= selectedStory.questions.length / 2
                          ? isRTL
                            ? "جيد جداً! استمر في التعلم!"
                            : "잘하셨습니다! 계속 공부하세요!"
                          : isRTL
                          ? "حاول مرة أخرى! يمكنك تحسين نتيجتك!"
                          : "다시 도전해보세요! 더 잘할 수 있습니다!"}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowQuiz(false);
                            setCurrentParagraph(0);
                          }}
                        >
                          {isRTL ? "إعادة القراءة" : "다시 읽기"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={startQuiz}
                        >
                          {isRTL ? "إعادة الاختبار" : "퀴즈 다시하기"}
                        </Button>
                        <Button
                          onClick={() => setSelectedStory(null)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isRTL ? "قصة جديدة" : "새 스토리"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Story Reading View
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedStory(null)}
                  className="flex items-center gap-2"
                >
                  {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                  {isRTL ? "العودة" : "돌아가기"}
                </Button>
                <Badge className={getLevelColor(selectedStory.level)}>
                  {getLevelText(selectedStory.level)}
                </Badge>
              </div>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center border-b border-border">
                  <CardTitle className="text-2xl">{selectedStory.title}</CardTitle>
                  <p className="text-muted-foreground">{selectedStory.titleAr}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? "الفقرة" : "문단"} {currentParagraph + 1} / {selectedStory.paragraphs.length}
                    </span>
                    <Progress
                      value={((currentParagraph + 1) / selectedStory.paragraphs.length) * 100}
                      className="w-32 h-2"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentParagraph}
                      initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
                      className="space-y-4 min-h-[200px] flex flex-col justify-center"
                    >
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-1 text-primary hover:bg-primary/10"
                          onClick={() => speakKorean(selectedStory.paragraphs[currentParagraph].korean)}
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                        <div className="space-y-2 flex-1">
                          <p className="text-2xl font-bold text-foreground leading-relaxed">
                            {selectedStory.paragraphs[currentParagraph].korean}
                          </p>
                          <p className="text-lg text-primary/80">
                            {selectedStory.paragraphs[currentParagraph].romanization}
                          </p>
                          <p className="text-lg text-muted-foreground">
                            {selectedStory.paragraphs[currentParagraph].arabic}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevParagraph}
                  disabled={currentParagraph === 0}
                  className="flex items-center gap-2"
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {isRTL ? "السابق" : "이전"}
                </Button>
                <Button
                  onClick={handleNextParagraph}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {currentParagraph === selectedStory.paragraphs.length - 1
                    ? isRTL
                      ? "المفردات والاختبار"
                      : "어휘 & 퀴즈"
                    : isRTL
                    ? "التالي"
                    : "다음"}
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Stories;
