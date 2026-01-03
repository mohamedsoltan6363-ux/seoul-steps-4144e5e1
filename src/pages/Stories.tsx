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
  },
  // Medium Stories (6 stories)
  {
    id: 7,
    title: "한국 음식 만들기",
    titleAr: "طبخ الطعام الكوري",
    level: "intermediate",
    paragraphs: [
      {
        korean: "오늘 처음으로 김치찌개를 만들어 봤습니다.",
        romanization: "Oneul cheoeumeuoro kimchijjigae-reul mandeoreo bwasseumnida.",
        arabic: "اليوم جربت صنع كيمتشي جيجي لأول مرة."
      },
      {
        korean: "먼저 돼지고기를 작게 썰어서 냄비에 볶았습니다.",
        romanization: "Meonjeo dwaejigogi-reul jakge sseoreoseo naembie bokasseumnida.",
        arabic: "أولاً قطعت لحم الخنزير إلى قطع صغيرة وقليته في القدر."
      },
      {
        korean: "그 다음에 김치와 양파, 두부를 넣었습니다.",
        romanization: "Geu daeume kimchiwa yangpa, dubureul neoeosseumnida.",
        arabic: "ثم أضفت الكيمتشي والبصل والتوفو."
      },
      {
        korean: "고추장과 간장으로 간을 맞추고 물을 넣어서 끓였습니다.",
        romanization: "Gochujang-gwa ganjang-euro ganeul matchugo mureul neoeoseo kkeullyeosseumnida.",
        arabic: "ضبطت الطعم بصلصة الفلفل الحار وصلصة الصويا ثم أضفت الماء وغليته."
      },
      {
        korean: "30분 정도 끓인 후에 맛을 봤는데 정말 맛있었습니다!",
        romanization: "30bun jeongdo kkeurin hue maseul bwanneunde jeongmal masissesseumnida!",
        arabic: "بعد الغلي لمدة 30 دقيقة تقريباً، تذوقته وكان لذيذاً جداً!"
      },
      {
        korean: "다음에는 불고기도 만들어 보고 싶습니다.",
        romanization: "Daeumeneun bulgogido mandeoreo bogo sipseumnida.",
        arabic: "في المرة القادمة أريد أن أجرب صنع البولجوجي أيضاً."
      }
    ],
    questions: [
      {
        question: "오늘 무엇을 만들었습니까?",
        questionAr: "ماذا صنع اليوم؟",
        options: ["불고기", "비빔밥", "김치찌개", "삼겹살"],
        optionsAr: ["بولجوجي", "بيبيمباب", "كيمتشي جيجي", "سامجيوبسال"],
        correctAnswer: 2
      },
      {
        question: "어떤 고기를 사용했습니까?",
        questionAr: "أي نوع من اللحم استخدم؟",
        options: ["소고기", "닭고기", "돼지고기", "생선"],
        optionsAr: ["لحم بقر", "دجاج", "لحم خنزير", "سمك"],
        correctAnswer: 2
      },
      {
        question: "얼마나 오래 끓였습니까?",
        questionAr: "كم من الوقت غلى؟",
        options: ["10분", "20분", "30분", "1시간"],
        optionsAr: ["10 دقائق", "20 دقيقة", "30 دقيقة", "ساعة واحدة"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "김치찌개", romanization: "kimchijjigae", meaning: "حساء الكيمتشي" },
      { word: "돼지고기", romanization: "dwaejigogi", meaning: "لحم الخنزير" },
      { word: "두부", romanization: "dubu", meaning: "توفو" },
      { word: "끓이다", romanization: "kkeulida", meaning: "يغلي" }
    ]
  },
  {
    id: 8,
    title: "주말 등산",
    titleAr: "تسلق الجبال في عطلة نهاية الأسبوع",
    level: "intermediate",
    paragraphs: [
      {
        korean: "지난 주말에 친구들과 북한산에 등산을 갔습니다.",
        romanization: "Jinan jumare chingudeulgwa Bukhansane deungsaneul gasseumnida.",
        arabic: "في عطلة نهاية الأسبوع الماضية ذهبت لتسلق جبل بوخانسان مع أصدقائي."
      },
      {
        korean: "아침 6시에 일어나서 등산복을 입고 준비했습니다.",
        romanization: "Achim 6sie ireonaseo deungsanbogeul ipgo junbihaesseumnida.",
        arabic: "استيقظت في الساعة 6 صباحاً ولبست ملابس التسلق واستعددت."
      },
      {
        korean: "산 입구에서 친구들을 만나서 함께 올라갔습니다.",
        romanization: "San ipgueseo chingudeureul mannaseo hamkke ollagasseumnida.",
        arabic: "التقيت بأصدقائي عند مدخل الجبل وصعدنا معاً."
      },
      {
        korean: "중간에 힘들어서 잠깐 쉬면서 물을 마셨습니다.",
        romanization: "Junggane himdeurenseo jamkkan swimyeonseo mureul masyeosseumnida.",
        arabic: "في المنتصف كان الأمر صعباً فاستراحت قليلاً وشربت الماء."
      },
      {
        korean: "정상에 도착했을 때 서울의 멋진 풍경을 볼 수 있었습니다.",
        romanization: "Jeongsange dochakhaesseul ttae seoul-ui meotjin punggyeongeul bol su isseosseumnida.",
        arabic: "عندما وصلت إلى القمة استطعت أن أرى المناظر الرائعة لسيول."
      },
      {
        korean: "내려오는 길에 막걸리와 파전을 먹었습니다.",
        romanization: "Naeryeooneun gire makgeolliwa pajeoneul meogeosseumnida.",
        arabic: "في طريق النزول أكلت ماكجولي وباجون."
      },
      {
        korean: "다음 주에도 다른 산에 가려고 합니다.",
        romanization: "Daeum juedo dareun sane garyeogo hamnida.",
        arabic: "أخطط للذهاب إلى جبل آخر الأسبوع القادم أيضاً."
      }
    ],
    questions: [
      {
        question: "어느 산에 갔습니까?",
        questionAr: "إلى أي جبل ذهب؟",
        options: ["설악산", "한라산", "북한산", "지리산"],
        optionsAr: ["سوراكسان", "هالاسان", "بوخانسان", "جيريسان"],
        correctAnswer: 2
      },
      {
        question: "정상에서 무엇을 볼 수 있었습니까?",
        questionAr: "ماذا استطاع أن يرى من القمة؟",
        options: ["바다", "서울 풍경", "별", "비"],
        optionsAr: ["البحر", "مناظر سيول", "النجوم", "المطر"],
        correctAnswer: 1
      },
      {
        question: "내려오면서 무엇을 먹었습니까?",
        questionAr: "ماذا أكل أثناء النزول؟",
        options: ["김치찌개", "삼겹살", "막걸리와 파전", "비빔밥"],
        optionsAr: ["كيمتشي جيجي", "سامجيوبسال", "ماكجولي وباجون", "بيبيمباب"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "등산", romanization: "deungsan", meaning: "تسلق الجبال" },
      { word: "정상", romanization: "jeongsang", meaning: "قمة" },
      { word: "풍경", romanization: "punggyeong", meaning: "منظر طبيعي" },
      { word: "막걸리", romanization: "makgeolli", meaning: "نبيذ الأرز الكوري" }
    ]
  },
  {
    id: 9,
    title: "한국 드라마",
    titleAr: "الدراما الكورية",
    level: "intermediate",
    paragraphs: [
      {
        korean: "요즘 한국 드라마에 빠져 있습니다.",
        romanization: "Yojeum hanguk deuramae ppajyeo isseumnida.",
        arabic: "مؤخراً أنا مدمن على الدراما الكورية."
      },
      {
        korean: "처음에는 자막을 보면서 봤는데 이제는 조금 이해할 수 있습니다.",
        romanization: "Cheoeumeneun jamageul bomyeonseo bwanneunde ijeneun jogeum ihaegal su isseumnida.",
        arabic: "في البداية كنت أشاهد مع الترجمة لكن الآن أستطيع فهم القليل."
      },
      {
        korean: "가장 좋아하는 장르는 로맨스 코미디입니다.",
        romanization: "Gajang joahaneun jangreuneun romaenseu komediimnida.",
        arabic: "النوع المفضل لدي هو الكوميديا الرومانسية."
      },
      {
        korean: "주인공들의 사랑 이야기가 정말 감동적입니다.",
        romanization: "Juingongdeuri sarang iyagiga jeongmal gamdongjeogimnida.",
        arabic: "قصص حب الشخصيات الرئيسية مؤثرة حقاً."
      },
      {
        korean: "드라마를 보면서 한국 문화도 많이 배웁니다.",
        romanization: "Deuramareul bomyeonseo hanguk munhwado mani baeumnida.",
        arabic: "أتعلم الكثير عن الثقافة الكورية أثناء مشاهدة الدراما."
      },
      {
        korean: "친구들에게 좋은 드라마를 추천해 주기도 합니다.",
        romanization: "Chingudeulege joeun deuramareul chucheonhae jugido hamnida.",
        arabic: "أوصي أصدقائي بدراما جيدة أيضاً."
      }
    ],
    questions: [
      {
        question: "가장 좋아하는 장르는 무엇입니까?",
        questionAr: "ما هو النوع المفضل؟",
        options: ["액션", "공포", "로맨스 코미디", "다큐멘터리"],
        optionsAr: ["أكشن", "رعب", "كوميديا رومانسية", "وثائقي"],
        correctAnswer: 2
      },
      {
        question: "드라마를 보면서 무엇을 배웁니까?",
        questionAr: "ماذا يتعلم أثناء مشاهدة الدراما؟",
        options: ["요리", "한국 문화", "운동", "수학"],
        optionsAr: ["الطبخ", "الثقافة الكورية", "الرياضة", "الرياضيات"],
        correctAnswer: 1
      },
      {
        question: "처음에 어떻게 드라마를 봤습니까?",
        questionAr: "كيف كان يشاهد الدراما في البداية؟",
        options: ["자막 없이", "자막을 보면서", "친구와 함께", "영어로"],
        optionsAr: ["بدون ترجمة", "مع الترجمة", "مع صديق", "بالإنجليزية"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "드라마", romanization: "deurama", meaning: "دراما" },
      { word: "자막", romanization: "jamak", meaning: "ترجمة" },
      { word: "장르", romanization: "janreu", meaning: "نوع / صنف" },
      { word: "감동적", romanization: "gamdongjeogin", meaning: "مؤثر" }
    ]
  },
  {
    id: 10,
    title: "한국에서의 생활",
    titleAr: "الحياة في كوريا",
    level: "intermediate",
    paragraphs: [
      {
        korean: "저는 6개월 전에 한국에 왔습니다.",
        romanization: "Jeoneun 6gaewol jeone hanguge wasseumnida.",
        arabic: "جئت إلى كوريا قبل 6 أشهر."
      },
      {
        korean: "처음에는 언어와 문화가 너무 다르서 힘들었습니다.",
        romanization: "Cheoeumeneun eoneowa munhwaga neomu dareoseo himdeuweosseumnida.",
        arabic: "في البداية كان الأمر صعباً لأن اللغة والثقافة مختلفتان جداً."
      },
      {
        korean: "하지만 한국 사람들이 친절해서 금방 적응할 수 있었습니다.",
        romanization: "Hajiman hanguk saramdeuri chinjeolhaeseo geumbang jeokeunghal su isseosseumnida.",
        arabic: "لكن الكوريين لطفاء جداً فاستطعت التأقلم بسرعة."
      },
      {
        korean: "지금은 대중교통을 이용하는 것이 익숙해졌습니다.",
        romanization: "Jigeumeun daejunggyotongeul iyonghaneun geosi iksukhaejyeosseumnida.",
        arabic: "الآن أصبحت معتاداً على استخدام وسائل النقل العام."
      },
      {
        korean: "한국 음식도 처음에는 매웠지만 이제는 좋아합니다.",
        romanization: "Hanguk eumsikdo cheoeumeneun maeweotjiman ijeneun joahamnida.",
        arabic: "كان الطعام الكوري حاراً في البداية لكنني أحبه الآن."
      },
      {
        korean: "앞으로 1년 더 한국에서 공부할 예정입니다.",
        romanization: "Apeuro 1nyeon deo hangugeseo gongbuhal yejeong-imnida.",
        arabic: "أخطط للدراسة في كوريا لمدة سنة أخرى."
      }
    ],
    questions: [
      {
        question: "언제 한국에 왔습니까?",
        questionAr: "متى جاء إلى كوريا؟",
        options: ["1년 전", "6개월 전", "2년 전", "지난 달"],
        optionsAr: ["قبل سنة", "قبل 6 أشهر", "قبل سنتين", "الشهر الماضي"],
        correctAnswer: 1
      },
      {
        question: "한국 음식에 대해 어떻게 느꼈습니까?",
        questionAr: "كيف شعر تجاه الطعام الكوري؟",
        options: ["처음부터 좋아했습니다", "처음에 매웠지만 지금은 좋아합니다", "아직도 싫어합니다", "먹어본 적이 없습니다"],
        optionsAr: ["أحبه من البداية", "كان حاراً في البداية لكن يحبه الآن", "لا يزال يكرهه", "لم يجربه قط"],
        correctAnswer: 1
      },
      {
        question: "앞으로 얼마나 더 한국에 있을 예정입니까?",
        questionAr: "كم من الوقت يخطط للبقاء في كوريا؟",
        options: ["6개월", "1년", "2년", "영원히"],
        optionsAr: ["6 أشهر", "سنة واحدة", "سنتين", "للأبد"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "적응하다", romanization: "jeokeunghada", meaning: "يتأقلم" },
      { word: "대중교통", romanization: "daejunggyotong", meaning: "وسائل النقل العام" },
      { word: "익숙하다", romanization: "iksukada", meaning: "معتاد" },
      { word: "예정", romanization: "yejeong", meaning: "خطة / موعد" }
    ]
  },
  {
    id: 11,
    title: "온라인 쇼핑",
    titleAr: "التسوق عبر الإنترنت",
    level: "intermediate",
    paragraphs: [
      {
        korean: "요즘은 온라인으로 쇼핑하는 것이 편리합니다.",
        romanization: "Yojeumeun onllaineuro shyopinghaneun geosi pyeollihamnida.",
        arabic: "هذه الأيام التسوق عبر الإنترنت مريح جداً."
      },
      {
        korean: "어제 인터넷에서 새 운동화를 주문했습니다.",
        romanization: "Eoje inteonesese sae undonghwareul jumunhaesseumnida.",
        arabic: "أمس طلبت حذاء رياضي جديد من الإنترنت."
      },
      {
        korean: "가격을 비교하고 리뷰를 읽어본 후에 결정했습니다.",
        romanization: "Gagyeogeul bigyohago ribyureul ilgeobon hue gyeoljeonghaesseumnida.",
        arabic: "قارنت الأسعار وقرأت المراجعات ثم قررت."
      },
      {
        korean: "무료 배송이라서 배송비를 내지 않아도 됩니다.",
        romanization: "Muryo baesongiraseo baesongbireul naji anado doemnida.",
        arabic: "لأن الشحن مجاني لا أحتاج لدفع رسوم الشحن."
      },
      {
        korean: "보통 이틀 안에 배달이 됩니다.",
        romanization: "Botong iteul ane baedari doemnida.",
        arabic: "عادة يتم التوصيل خلال يومين."
      },
      {
        korean: "마음에 안 들면 일주일 안에 반품할 수 있습니다.",
        romanization: "Maume an deulmyeon iljuil ane banpumhal su isseumnida.",
        arabic: "إذا لم يعجبني يمكنني إرجاعه خلال أسبوع."
      }
    ],
    questions: [
      {
        question: "무엇을 주문했습니까?",
        questionAr: "ماذا طلب؟",
        options: ["옷", "책", "운동화", "가방"],
        optionsAr: ["ملابس", "كتاب", "حذاء رياضي", "حقيبة"],
        correctAnswer: 2
      },
      {
        question: "배송비는 얼마입니까?",
        questionAr: "كم تكلفة الشحن؟",
        options: ["3000원", "5000원", "무료", "10000원"],
        optionsAr: ["3000 وون", "5000 وون", "مجاني", "10000 وون"],
        correctAnswer: 2
      },
      {
        question: "언제까지 반품할 수 있습니까?",
        questionAr: "حتى متى يمكن الإرجاع؟",
        options: ["3일 안에", "일주일 안에", "한 달 안에", "반품 불가"],
        optionsAr: ["خلال 3 أيام", "خلال أسبوع", "خلال شهر", "لا يمكن الإرجاع"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "온라인", romanization: "onlain", meaning: "عبر الإنترنت" },
      { word: "배송", romanization: "baesong", meaning: "شحن / توصيل" },
      { word: "리뷰", romanization: "ribyu", meaning: "مراجعة" },
      { word: "반품", romanization: "banpum", meaning: "إرجاع" }
    ]
  },
  {
    id: 12,
    title: "건강한 생활",
    titleAr: "الحياة الصحية",
    level: "intermediate",
    paragraphs: [
      {
        korean: "올해부터 건강한 생활을 하려고 노력하고 있습니다.",
        romanization: "Olhaebuteo geonganhan saenghwareul haryeogo noryeokago isseumnida.",
        arabic: "أحاول أن أعيش حياة صحية منذ هذا العام."
      },
      {
        korean: "매일 아침 6시에 일어나서 30분 동안 조깅을 합니다.",
        romanization: "Maeil achim 6sie ireonaseo 30bun dongan jogineul hamnida.",
        arabic: "أستيقظ كل يوم في السادسة صباحاً وأركض لمدة 30 دقيقة."
      },
      {
        korean: "아침 식사로 과일과 요거트를 먹습니다.",
        romanization: "Achim siksaro gwarilgwa yogeoteureul meokseumnida.",
        arabic: "آكل الفواكه والزبادي على الإفطار."
      },
      {
        korean: "일주일에 세 번 헬스장에 가서 운동합니다.",
        romanization: "Iljuire se beon helseujange gaseo undonghamnida.",
        arabic: "أذهب إلى صالة الألعاب الرياضية ثلاث مرات في الأسبوع وأتمرن."
      },
      {
        korean: "밤 11시 전에 자려고 합니다.",
        romanization: "Bam 11si jeone jaryeogo hamnida.",
        arabic: "أحاول أن أنام قبل الساعة 11 ليلاً."
      },
      {
        korean: "이렇게 생활하니까 몸도 마음도 건강해졌습니다.",
        romanization: "Ireoke saenghwalhanikka momdo maeumdo geonganghaeiyeosseumnida.",
        arabic: "بهذا النمط من الحياة أصبح جسمي وعقلي أكثر صحة."
      }
    ],
    questions: [
      {
        question: "아침에 몇 시에 일어납니까?",
        questionAr: "في أي ساعة يستيقظ صباحاً؟",
        options: ["5시", "6시", "7시", "8시"],
        optionsAr: ["الخامسة", "السادسة", "السابعة", "الثامنة"],
        correctAnswer: 1
      },
      {
        question: "일주일에 몇 번 헬스장에 갑니까?",
        questionAr: "كم مرة يذهب إلى صالة الألعاب الرياضية في الأسبوع؟",
        options: ["한 번", "두 번", "세 번", "매일"],
        optionsAr: ["مرة واحدة", "مرتين", "ثلاث مرات", "كل يوم"],
        correctAnswer: 2
      },
      {
        question: "아침 식사로 무엇을 먹습니까?",
        questionAr: "ماذا يأكل على الإفطار؟",
        options: ["밥과 국", "빵과 커피", "과일과 요거트", "라면"],
        optionsAr: ["أرز وحساء", "خبز وقهوة", "فواكه وزبادي", "رامن"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "건강", romanization: "geongang", meaning: "صحة" },
      { word: "조깅", romanization: "joging", meaning: "ركض" },
      { word: "헬스장", romanization: "helseujang", meaning: "صالة الألعاب الرياضية" },
      { word: "노력하다", romanization: "noryeokada", meaning: "يجتهد / يحاول" }
    ]
  },
  // Long Stories (6 stories)
  {
    id: 13,
    title: "한국에서의 첫 번째 여름",
    titleAr: "صيفي الأول في كوريا",
    level: "advanced",
    paragraphs: [
      {
        korean: "작년 여름, 저는 처음으로 한국에서 여름을 보냈습니다.",
        romanization: "Jaknyeon yeoreum, jeoneun cheoeumuro hangugeseo yeoreumeul bonaesseumnida.",
        arabic: "في الصيف الماضي، قضيت صيفي لأول مرة في كوريا."
      },
      {
        korean: "한국의 여름은 생각보다 훨씬 더 덥고 습했습니다.",
        romanization: "Hangugui yeoreumeun saenggakboda hwolssin deo deopgo seupaesseumnida.",
        arabic: "كان صيف كوريا أكثر حرارة ورطوبة مما توقعت."
      },
      {
        korean: "특히 장마철에는 매일 비가 와서 우산을 항상 들고 다녔습니다.",
        romanization: "Teuki jangmacheoreneun maeil biga waseo usaneul hangsang deulgo danyeosseumnida.",
        arabic: "خاصة في موسم الأمطار، كانت تمطر كل يوم فكنت أحمل المظلة دائماً."
      },
      {
        korean: "하지만 한국의 여름에는 즐길 수 있는 것들이 많았습니다.",
        romanization: "Hajiman hangugui yeoreumeneun jeulgil su inneun geotdeuri manasseumnida.",
        arabic: "لكن كان هناك الكثير من الأشياء للاستمتاع بها في صيف كوريا."
      },
      {
        korean: "시원한 냉면과 팥빙수를 자주 먹었습니다.",
        romanization: "Siwonhan naengmyeongwa patbingsureul jaju meogeosseumnida.",
        arabic: "أكلت النينجميون البارد والباتبينجسو كثيراً."
      },
      {
        korean: "친구들과 부산 해운대 해변에도 다녀왔습니다.",
        romanization: "Chingudeulgwa Busan Haeundae haebyeonedo danyeowasseumnida.",
        arabic: "ذهبت أيضاً إلى شاطئ هايونداي في بوسان مع أصدقائي."
      },
      {
        korean: "바다에서 수영하고 불꽃놀이도 구경했습니다.",
        romanization: "Badaeseo suyeonghago bulkkochnorido gugyeonghaesseumnida.",
        arabic: "سبحت في البحر وشاهدت الألعاب النارية أيضاً."
      },
      {
        korean: "한국의 여름 휴가 문화가 정말 재미있었습니다.",
        romanization: "Hangugui yeoreum hyuga munhwaga jeongmal jaemiisseosseumnida.",
        arabic: "كانت ثقافة العطلة الصيفية في كوريا ممتعة حقاً."
      }
    ],
    questions: [
      {
        question: "한국 여름의 날씨는 어땠습니까?",
        questionAr: "كيف كان الطقس في صيف كوريا؟",
        options: ["시원했습니다", "덥고 습했습니다", "건조했습니다", "추웠습니다"],
        optionsAr: ["كان بارداً", "كان حاراً ورطباً", "كان جافاً", "كان بارداً جداً"],
        correctAnswer: 1
      },
      {
        question: "장마철에 무엇을 항상 들고 다녔습니까?",
        questionAr: "ماذا كان يحمل دائماً في موسم الأمطار؟",
        options: ["가방", "우산", "모자", "책"],
        optionsAr: ["حقيبة", "مظلة", "قبعة", "كتاب"],
        correctAnswer: 1
      },
      {
        question: "어느 해변에 갔습니까?",
        questionAr: "إلى أي شاطئ ذهب؟",
        options: ["제주도", "강릉", "해운대", "속초"],
        optionsAr: ["جيجو", "كانجنونج", "هايونداي", "سوكتشو"],
        correctAnswer: 2
      },
      {
        question: "바다에서 무엇을 했습니까?",
        questionAr: "ماذا فعل في البحر؟",
        options: ["낚시", "수영", "서핑", "스쿠버 다이빙"],
        optionsAr: ["صيد السمك", "السباحة", "ركوب الأمواج", "الغوص"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "장마철", romanization: "jangmacheol", meaning: "موسم الأمطار" },
      { word: "냉면", romanization: "naengmyeon", meaning: "نودلز باردة" },
      { word: "팥빙수", romanization: "patbingsu", meaning: "حلوى الثلج الكورية" },
      { word: "불꽃놀이", romanization: "bulkkochnori", meaning: "ألعاب نارية" },
      { word: "해변", romanization: "haebyeon", meaning: "شاطئ" }
    ]
  },
  {
    id: 14,
    title: "한국 결혼식 경험",
    titleAr: "تجربة حفل زفاف كوري",
    level: "advanced",
    paragraphs: [
      {
        korean: "지난 달에 한국 친구의 결혼식에 초대받았습니다.",
        romanization: "Jinan dare hanguk chinguui gyeolhonsike chodaebadasseumnida.",
        arabic: "الشهر الماضي تمت دعوتي لحفل زفاف صديقي الكوري."
      },
      {
        korean: "한국 결혼식은 제가 알던 결혼식과 많이 달랐습니다.",
        romanization: "Hanguk gyeolhonsineun jega aldeon gyeolhonsigwa mani dallasseumnida.",
        arabic: "كان حفل الزفاف الكوري مختلفاً كثيراً عما كنت أعرفه."
      },
      {
        korean: "먼저 예식장에 도착해서 축의금을 냈습니다.",
        romanization: "Meonjeo yesikjange dochakhaeseo chugeuigeumeuil naesseumnida.",
        arabic: "أولاً وصلت إلى قاعة الزفاف ودفعت هدية المال."
      },
      {
        korean: "식장에서 신랑 신부가 입장하고 짧은 예식을 진행했습니다.",
        romanization: "Sikjangeseo sillang sinbuga ipjanghago jjalbeun yesigeul jinhaenghaesseumnida.",
        arabic: "في القاعة دخل العروس والعريس وأقيم حفل قصير."
      },
      {
        korean: "예식이 끝나고 뷔페에서 맛있는 음식을 먹었습니다.",
        romanization: "Yesigi kkeunnago bwipeeseo masinneun eumsigeul meogeosseumnida.",
        arabic: "بعد انتهاء الحفل أكلت طعاماً لذيذاً في البوفيه."
      },
      {
        korean: "친구들과 사진도 많이 찍고 즐거운 시간을 보냈습니다.",
        romanization: "Chingudeulgwa sajindo mani jjikgo jeulgeoun siganeul bonaesseumnida.",
        arabic: "التقطت الكثير من الصور مع الأصدقاء وقضيت وقتاً ممتعاً."
      },
      {
        korean: "신랑 신부에게 축하 인사도 전했습니다.",
        romanization: "Sillang sinbuege chukha insado jeonhaesseumnida.",
        arabic: "قدمت التهنئة للعروسين أيضاً."
      },
      {
        korean: "언젠가 저도 한국에서 결혼식을 하고 싶습니다.",
        romanization: "Eonjenga jeodo hangugeseo gyeolhonsigeul hago sipseumnida.",
        arabic: "يوماً ما أريد أن أقيم حفل زفافي في كوريا أيضاً."
      }
    ],
    questions: [
      {
        question: "결혼식에서 먼저 무엇을 했습니까?",
        questionAr: "ماذا فعل أولاً في حفل الزفاف؟",
        options: ["음식을 먹었습니다", "축의금을 냈습니다", "사진을 찍었습니다", "노래를 불렀습니다"],
        optionsAr: ["أكل الطعام", "دفع هدية المال", "التقط صوراً", "غنى أغنية"],
        correctAnswer: 1
      },
      {
        question: "예식이 끝나고 어디서 음식을 먹었습니까?",
        questionAr: "أين أكل الطعام بعد انتهاء الحفل؟",
        options: ["식당", "집", "뷔페", "카페"],
        optionsAr: ["مطعم", "المنزل", "البوفيه", "مقهى"],
        correctAnswer: 2
      },
      {
        question: "한국 결혼식에 대해 어떻게 생각했습니까?",
        questionAr: "ماذا كان رأيه في حفل الزفاف الكوري؟",
        options: ["지루했습니다", "알던 것과 많이 달랐습니다", "너무 길었습니다", "시끄러웠습니다"],
        optionsAr: ["كان مملاً", "كان مختلفاً كثيراً عما يعرفه", "كان طويلاً جداً", "كان صاخباً"],
        correctAnswer: 1
      },
      {
        question: "앞으로 무엇을 하고 싶습니까?",
        questionAr: "ماذا يريد أن يفعل في المستقبل؟",
        options: ["한국을 떠나고 싶습니다", "한국에서 결혼하고 싶습니다", "더 많은 결혼식에 가고 싶습니다", "결혼하고 싶지 않습니다"],
        optionsAr: ["يريد مغادرة كوريا", "يريد الزواج في كوريا", "يريد الذهاب لمزيد من حفلات الزفاف", "لا يريد الزواج"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "결혼식", romanization: "gyeolhonsik", meaning: "حفل زفاف" },
      { word: "축의금", romanization: "chugeuigeum", meaning: "هدية المال للزفاف" },
      { word: "신랑", romanization: "sillang", meaning: "عريس" },
      { word: "신부", romanization: "sinbu", meaning: "عروس" },
      { word: "예식장", romanization: "yesikjang", meaning: "قاعة الزفاف" }
    ]
  },
  {
    id: 15,
    title: "한국어 능력 시험 준비",
    titleAr: "التحضير لاختبار الكفاءة الكورية",
    level: "advanced",
    paragraphs: [
      {
        korean: "다음 달에 TOPIK 시험을 볼 예정이어서 열심히 공부하고 있습니다.",
        romanization: "Daeum dare TOPIK siheomeul bol yejeongieoseo yeolsimhi gongbuhago isseumnida.",
        arabic: "أخطط لأداء اختبار TOPIK الشهر القادم لذا أدرس بجد."
      },
      {
        korean: "TOPIK은 한국어 능력을 평가하는 공식 시험입니다.",
        romanization: "TOPIKeun hangugeo neungnyeogeul pyeonggahaneun gongshik siheomimnida.",
        arabic: "TOPIK هو الاختبار الرسمي لتقييم الكفاءة في اللغة الكورية."
      },
      {
        korean: "저는 TOPIK II를 준비하고 있는데, 중급과 고급 수준을 평가합니다.",
        romanization: "Jeoneun TOPIK IIreul junbihago inneunde, junggupgwa gogup suneul pyeonggahamnida.",
        arabic: "أنا أستعد لـ TOPIK II، الذي يقيم المستوى المتوسط والمتقدم."
      },
      {
        korean: "듣기, 읽기, 쓰기 세 가지 영역이 있습니다.",
        romanization: "Deutgi, ilkgi, sseugi se gaji yeongnyeogi isseumnida.",
        arabic: "هناك ثلاثة أقسام: الاستماع والقراءة والكتابة."
      },
      {
        korean: "특히 쓰기가 어려워서 매일 작문 연습을 하고 있습니다.",
        romanization: "Teuki sseugiga eoryeowoseo maeil jakmun yeonseubeul hago isseumnida.",
        arabic: "الكتابة صعبة بشكل خاص لذا أتدرب على التعبير يومياً."
      },
      {
        korean: "온라인에서 기출문제를 풀고 모르는 단어를 정리합니다.",
        romanization: "Onlaineseo gichulmunjeereul pulgo moreuneun daneoreul jeongrihamnida.",
        arabic: "أحل أسئلة الاختبارات السابقة عبر الإنترنت وأنظم الكلمات التي لا أعرفها."
      },
      {
        korean: "한국 드라마와 뉴스를 보면서 듣기 실력도 키우고 있습니다.",
        romanization: "Hanguk deuramawa nyuseureul bomyeonseo deutgi sillyeokdo kiugo isseumnida.",
        arabic: "أطور مهارة الاستماع أيضاً من خلال مشاهدة الدراما الكورية والأخبار."
      },
      {
        korean: "6급을 목표로 하고 있어서 정말 열심히 해야 합니다.",
        romanization: "6geubeul mokpyoro hago isseoseo jeongmal yeolsimhi haeya hamnida.",
        arabic: "أستهدف المستوى 6 لذا يجب أن أجتهد حقاً."
      }
    ],
    questions: [
      {
        question: "TOPIK은 무엇입니까?",
        questionAr: "ما هو TOPIK؟",
        options: ["한국어 학교", "한국어 능력 시험", "한국어 책", "한국어 앱"],
        optionsAr: ["مدرسة كورية", "اختبار الكفاءة الكورية", "كتاب كوري", "تطبيق كوري"],
        correctAnswer: 1
      },
      {
        question: "TOPIK II에는 몇 가지 영역이 있습니까?",
        questionAr: "كم عدد الأقسام في TOPIK II؟",
        options: ["1가지", "2가지", "3가지", "4가지"],
        optionsAr: ["قسم واحد", "قسمان", "3 أقسام", "4 أقسام"],
        correctAnswer: 2
      },
      {
        question: "어떤 영역이 가장 어렵습니까?",
        questionAr: "أي قسم هو الأصعب؟",
        options: ["듣기", "읽기", "쓰기", "말하기"],
        optionsAr: ["الاستماع", "القراءة", "الكتابة", "التحدث"],
        correctAnswer: 2
      },
      {
        question: "몇 급을 목표로 하고 있습니까?",
        questionAr: "ما المستوى المستهدف؟",
        options: ["3급", "4급", "5급", "6급"],
        optionsAr: ["المستوى 3", "المستوى 4", "المستوى 5", "المستوى 6"],
        correctAnswer: 3
      }
    ],
    vocabulary: [
      { word: "능력", romanization: "neungnyeok", meaning: "قدرة / كفاءة" },
      { word: "평가", romanization: "pyeongga", meaning: "تقييم" },
      { word: "작문", romanization: "jakmun", meaning: "تعبير كتابي" },
      { word: "기출문제", romanization: "gichulmunje", meaning: "أسئلة اختبارات سابقة" },
      { word: "목표", romanization: "mokpyo", meaning: "هدف" }
    ]
  },
  {
    id: 16,
    title: "한국에서 아르바이트",
    titleAr: "العمل بدوام جزئي في كوريا",
    level: "advanced",
    paragraphs: [
      {
        korean: "저는 한국에서 유학하면서 카페에서 아르바이트를 하고 있습니다.",
        romanization: "Jeoneun hangugeseo yuhakmyeonseo kapeeseo areubaitereul hago isseumnida.",
        arabic: "أنا أعمل بدوام جزئي في مقهى أثناء دراستي في كوريا."
      },
      {
        korean: "일주일에 3일, 저녁 5시부터 10시까지 일합니다.",
        romanization: "Iljuire 3il, jeonyeok 5sibuteo 10sikkaji ilhamnida.",
        arabic: "أعمل 3 أيام في الأسبوع، من الساعة 5 مساءً حتى 10."
      },
      {
        korean: "처음에는 손님들의 주문을 받기가 어려웠습니다.",
        romanization: "Cheoeumeneun sonnimdeurui jumuneul batgiga eoryeowosseumnida.",
        arabic: "في البداية كان من الصعب أخذ طلبات الزبائن."
      },
      {
        korean: "한국어로 메뉴를 설명하고 커피를 만드는 것을 배웠습니다.",
        romanization: "Hangugeoro menyureul seolmyeonghago keopireul mandeuneun geoseul baewosseumnida.",
        arabic: "تعلمت شرح القائمة بالكورية وصنع القهوة."
      },
      {
        korean: "가끔 손님들이 저의 한국어 발음을 칭찬해 주십니다.",
        romanization: "Gakkeum sonnimderi jeoui hangugeo bareumi chingchanhae jusimtnida.",
        arabic: "أحياناً يمدح الزبائن نطقي الكوري."
      },
      {
        korean: "동료들도 친절하게 한국어를 가르쳐 줍니다.",
        romanization: "Dongryodeuldo chinjeolhage hangugeoreul gareuchyeo jumnida.",
        arabic: "الزملاء أيضاً يعلمونني الكورية بلطف."
      },
      {
        korean: "아르바이트 덕분에 한국어 실력이 많이 늘었습니다.",
        romanization: "Areubaiteu deokbune hangugeo sillyeogi mani neureosseumnida.",
        arabic: "بفضل العمل الجزئي تحسنت مهارتي في الكورية كثيراً."
      },
      {
        korean: "생활비도 벌고 한국어도 배우니까 정말 좋습니다.",
        romanization: "Saenghwalbido beolgo hangugeodo baeunikka jeongmal joseumnida.",
        arabic: "أكسب مصروفي وأتعلم الكورية في نفس الوقت، إنه رائع حقاً."
      }
    ],
    questions: [
      {
        question: "어디에서 아르바이트를 합니까?",
        questionAr: "أين يعمل بدوام جزئي؟",
        options: ["식당", "편의점", "카페", "서점"],
        optionsAr: ["مطعم", "متجر صغير", "مقهى", "مكتبة"],
        correctAnswer: 2
      },
      {
        question: "일주일에 며칠 일합니까?",
        questionAr: "كم يوم يعمل في الأسبوع؟",
        options: ["2일", "3일", "4일", "5일"],
        optionsAr: ["يومان", "3 أيام", "4 أيام", "5 أيام"],
        correctAnswer: 1
      },
      {
        question: "아르바이트의 장점은 무엇입니까?",
        questionAr: "ما هي ميزة العمل الجزئي؟",
        options: ["돈만 벌 수 있습니다", "한국어 실력이 늘었습니다", "친구를 사귈 수 없습니다", "피곤합니다"],
        optionsAr: ["يكسب المال فقط", "تحسنت مهارته الكورية", "لا يستطيع تكوين صداقات", "إنه متعب"],
        correctAnswer: 1
      },
      {
        question: "손님들은 무엇을 칭찬했습니까?",
        questionAr: "ماذا مدح الزبائن؟",
        options: ["커피 맛", "친절함", "한국어 발음", "빠른 서비스"],
        optionsAr: ["طعم القهوة", "اللطف", "النطق الكوري", "الخدمة السريعة"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "아르바이트", romanization: "areubaiteu", meaning: "عمل جزئي" },
      { word: "손님", romanization: "sonnim", meaning: "زبون" },
      { word: "주문", romanization: "jumun", meaning: "طلب" },
      { word: "칭찬", romanization: "chingchan", meaning: "مدح" },
      { word: "생활비", romanization: "saenghwalbi", meaning: "مصروف / تكاليف المعيشة" }
    ]
  },
  {
    id: 17,
    title: "한국 전통 문화 체험",
    titleAr: "تجربة الثقافة الكورية التقليدية",
    level: "advanced",
    paragraphs: [
      {
        korean: "지난 주말에 한국 전통 문화를 체험하는 프로그램에 참여했습니다.",
        romanization: "Jinan jumare hanguk jeontong munhwareul cheheopmhaneun peurogeuraeme chamyeohaesseumnida.",
        arabic: "في عطلة نهاية الأسبوع الماضية شاركت في برنامج لتجربة الثقافة الكورية التقليدية."
      },
      {
        korean: "먼저 한복을 입고 전통 다도를 배웠습니다.",
        romanization: "Meonjeo hanbogeul ipgo jeontong dadoreul baewosseumnida.",
        arabic: "أولاً ارتديت الهانبوك وتعلمت طقوس الشاي التقليدية."
      },
      {
        korean: "다도는 차를 만들고 마시는 한국의 전통 예절입니다.",
        romanization: "Dadoneun chareul mandeulgo masineun hangugui jeontong yejeorimnida.",
        arabic: "الدادو هو آداب كورية تقليدية لصنع الشاي وشربه."
      },
      {
        korean: "그 다음에는 한지로 전통 공예품을 만들었습니다.",
        romanization: "Geu daeumeneun hanjiro jeontong gongyepumeul mandeureosseumnida.",
        arabic: "بعد ذلك صنعت حرفاً يدوية تقليدية بورق الهانجي."
      },
      {
        korean: "한지는 한국의 전통 종이로, 아주 튼튼합니다.",
        romanization: "Hanjineun hangugui jeontong jongiro, aju teunteunhamnida.",
        arabic: "الهانجي هو الورق الكوري التقليدي وهو متين جداً."
      },
      {
        korean: "점심에는 궁중 음식을 먹었는데 정말 고급스러웠습니다.",
        romanization: "Jeomsimeneun gungjung eumsigeul meogeonne jeongmal gogeupseureowosseumnida.",
        arabic: "على الغداء أكلت طعام البلاط الملكي وكان فاخراً حقاً."
      },
      {
        korean: "마지막으로 부채춤을 배우고 공연을 관람했습니다.",
        romanization: "Majimageuro buchaechumeul baeugo gongyeoneul gwallam haesseumnida.",
        arabic: "وأخيراً تعلمت رقصة المروحة وشاهدت عرضاً."
      },
      {
        korean: "한국 문화의 아름다움에 감동받았습니다.",
        romanization: "Hanguk munhwaui areumdaume gamdonbadasseumnida.",
        arabic: "تأثرت بجمال الثقافة الكورية."
      }
    ],
    questions: [
      {
        question: "다도는 무엇입니까?",
        questionAr: "ما هو الدادو؟",
        options: ["전통 춤", "차를 만들고 마시는 예절", "전통 음식", "전통 의상"],
        optionsAr: ["رقص تقليدي", "آداب صنع الشاي وشربه", "طعام تقليدي", "زي تقليدي"],
        correctAnswer: 1
      },
      {
        question: "한지로 무엇을 만들었습니까?",
        questionAr: "ماذا صنع بالهانجي؟",
        options: ["음식", "옷", "공예품", "가구"],
        optionsAr: ["طعام", "ملابس", "حرف يدوية", "أثاث"],
        correctAnswer: 2
      },
      {
        question: "점심에 어떤 음식을 먹었습니까?",
        questionAr: "ما نوع الطعام الذي أكله على الغداء؟",
        options: ["비빔밥", "김치찌개", "궁중 음식", "불고기"],
        optionsAr: ["بيبيمباب", "كيمتشي جيجي", "طعام البلاط الملكي", "بولجوجي"],
        correctAnswer: 2
      },
      {
        question: "마지막에 무엇을 배웠습니까?",
        questionAr: "ماذا تعلم في النهاية؟",
        options: ["태권도", "부채춤", "서예", "가야금"],
        optionsAr: ["التايكوندو", "رقصة المروحة", "الخط", "الجاياجيوم"],
        correctAnswer: 1
      }
    ],
    vocabulary: [
      { word: "전통", romanization: "jeontong", meaning: "تقليد / تراث" },
      { word: "다도", romanization: "dado", meaning: "طقوس الشاي" },
      { word: "한지", romanization: "hanji", meaning: "الورق الكوري التقليدي" },
      { word: "궁중", romanization: "gungjung", meaning: "البلاط الملكي" },
      { word: "부채춤", romanization: "buchaechum", meaning: "رقصة المروحة" }
    ]
  },
  {
    id: 18,
    title: "한국에서 병원 가기",
    titleAr: "الذهاب إلى المستشفى في كوريا",
    level: "advanced",
    paragraphs: [
      {
        korean: "어제 갑자기 배가 너무 아파서 병원에 갔습니다.",
        romanization: "Eoje gapjagi baega neomu apaseo byeongwone gasseumnida.",
        arabic: "أمس شعرت فجأة بألم شديد في بطني فذهبت إلى المستشفى."
      },
      {
        korean: "한국에서 병원에 가는 것은 처음이라 긴장했습니다.",
        romanization: "Hangugeseo byeongwone ganeun geoseun cheoeumira ginjanghesseumnida.",
        arabic: "كانت هذه المرة الأولى التي أذهب فيها للمستشفى في كوريا فكنت متوتراً."
      },
      {
        korean: "접수대에서 건강보험증과 신분증을 보여주었습니다.",
        romanization: "Jeopsudaeseo geongang-boheomjjeunggwa sinbunjjeungeul boyeojueosseumnida.",
        arabic: "في مكتب الاستقبال أظهرت بطاقة التأمين الصحي وبطاقة الهوية."
      },
      {
        korean: "의사 선생님께서 어디가 아픈지 물어보셨습니다.",
        romanization: "Uisa seonsaengnimkkeseo eodiga apeunjji mureobosyeosseumnida.",
        arabic: "سألني الطبيب أين أشعر بالألم."
      },
      {
        korean: "한국어로 증상을 설명하기가 어려웠지만 최선을 다했습니다.",
        romanization: "Hangugeoro jeungsangeul seolmyeonghagiga eoryeowotjiman choeseoneul dahaesseumnida.",
        arabic: "كان من الصعب شرح الأعراض بالكورية لكنني بذلت قصارى جهدي."
      },
      {
        korean: "검사를 받고 약을 처방받았습니다.",
        romanization: "Geomsareul batgo yageul cheobangbadasseumnida.",
        arabic: "أجريت الفحص وحصلت على وصفة طبية."
      },
      {
        korean: "약국에서 약을 사고 집에 돌아왔습니다.",
        romanization: "Yakgukeseo yageul sago jibe dorawasseumnida.",
        arabic: "اشتريت الدواء من الصيدلية وعدت إلى المنزل."
      },
      {
        korean: "다행히 큰 문제가 아니어서 안심했습니다.",
        romanization: "Dahaenghi keun munjega anieoseo ansimhaesseumnida.",
        arabic: "لحسن الحظ لم تكن مشكلة كبيرة فاطمأننت."
      }
    ],
    questions: [
      {
        question: "왜 병원에 갔습니까?",
        questionAr: "لماذا ذهب إلى المستشفى؟",
        options: ["머리가 아파서", "배가 아파서", "다리가 아파서", "검진을 받으려고"],
        optionsAr: ["بسبب صداع", "بسبب ألم في البطن", "بسبب ألم في الساق", "للفحص"],
        correctAnswer: 1
      },
      {
        question: "접수할 때 무엇을 보여주었습니까?",
        questionAr: "ماذا أظهر عند التسجيل؟",
        options: ["여권", "건강보험증과 신분증", "학생증", "운전면허증"],
        optionsAr: ["جواز السفر", "بطاقة التأمين والهوية", "بطاقة الطالب", "رخصة القيادة"],
        correctAnswer: 1
      },
      {
        question: "한국어로 무엇을 설명하기 어려웠습니까?",
        questionAr: "ماذا كان من الصعب شرحه بالكورية؟",
        options: ["주소", "이름", "증상", "직업"],
        optionsAr: ["العنوان", "الاسم", "الأعراض", "المهنة"],
        correctAnswer: 2
      },
      {
        question: "병원 방문 결과는 어땠습니까?",
        questionAr: "ما كانت نتيجة زيارة المستشفى؟",
        options: ["입원해야 했습니다", "수술이 필요했습니다", "큰 문제가 아니었습니다", "더 큰 병원에 가야 했습니다"],
        optionsAr: ["احتاج للإقامة", "احتاج لعملية", "لم تكن مشكلة كبيرة", "احتاج للذهاب لمستشفى أكبر"],
        correctAnswer: 2
      }
    ],
    vocabulary: [
      { word: "병원", romanization: "byeongwon", meaning: "مستشفى" },
      { word: "건강보험", romanization: "geongang-boheom", meaning: "تأمين صحي" },
      { word: "증상", romanization: "jeungsang", meaning: "أعراض" },
      { word: "검사", romanization: "geomsa", meaning: "فحص" },
      { word: "처방", romanization: "cheobang", meaning: "وصفة طبية" }
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
