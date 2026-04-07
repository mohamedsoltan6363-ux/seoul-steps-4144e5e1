// Level 4: Grammar Patterns (قواعد نحوية كورية)
export const grammarPatterns = [
  // Particles (حروف الجر)
  { id: 'gp1', korean: '~은/는', romanized: 'eun/neun', arabic: 'أداة الموضوع (Topic marker)', example: '저는 학생이에요', exampleAr: 'أنا طالب' },
  { id: 'gp2', korean: '~이/가', romanized: 'i/ga', arabic: 'أداة الفاعل (Subject marker)', example: '날씨가 좋아요', exampleAr: 'الطقس جميل' },
  { id: 'gp3', korean: '~을/를', romanized: 'eul/reul', arabic: 'أداة المفعول به (Object marker)', example: '커피를 마셔요', exampleAr: 'أشرب القهوة' },
  { id: 'gp4', korean: '~에', romanized: 'e', arabic: 'في / إلى (مكان/وقت)', example: '학교에 가요', exampleAr: 'أذهب إلى المدرسة' },
  { id: 'gp5', korean: '~에서', romanized: 'eseo', arabic: 'في (مكان الفعل)', example: '카페에서 공부해요', exampleAr: 'أدرس في المقهى' },
  { id: 'gp6', korean: '~으로/로', romanized: 'euro/ro', arabic: 'بواسطة / نحو', example: '버스로 가요', exampleAr: 'أذهب بالباص' },
  { id: 'gp7', korean: '~와/과', romanized: 'wa/gwa', arabic: 'مع / و (رسمي)', example: '친구와 같이 가요', exampleAr: 'أذهب مع صديقي' },
  { id: 'gp8', korean: '~하고', romanized: 'hago', arabic: 'و / مع (غير رسمي)', example: '밥하고 김치', exampleAr: 'أرز وكيمتشي' },
  { id: 'gp9', korean: '~도', romanized: 'do', arabic: 'أيضاً', example: '저도 가요', exampleAr: 'أنا أيضاً أذهب' },
  { id: 'gp10', korean: '~만', romanized: 'man', arabic: 'فقط', example: '물만 주세요', exampleAr: 'أعطني ماء فقط' },

  // Verb Conjugation (تصريف الأفعال)
  { id: 'gp11', korean: '~아/어요', romanized: 'a/eoyo', arabic: 'المضارع (غير رسمي مهذب)', example: '먹어요 / 가요', exampleAr: 'آكل / أذهب' },
  { id: 'gp12', korean: '~습니다/ㅂ니다', romanized: 'seumnida/bnida', arabic: 'المضارع (رسمي)', example: '먹습니다 / 갑니다', exampleAr: 'آكل / أذهب' },
  { id: 'gp13', korean: '~았/었어요', romanized: 'at/eosseoyo', arabic: 'الماضي', example: '먹었어요 / 갔어요', exampleAr: 'أكلت / ذهبت' },
  { id: 'gp14', korean: '~ㄹ/을 거예요', romanized: 'l/eul geoyeyo', arabic: 'المستقبل', example: '먹을 거예요', exampleAr: 'سآكل' },
  { id: 'gp15', korean: '~고 있다', romanized: 'go itda', arabic: 'المضارع المستمر', example: '공부하고 있어요', exampleAr: 'أدرس الآن' },

  // Sentence Endings (نهايات الجمل)
  { id: 'gp16', korean: '~고 싶다', romanized: 'go sipda', arabic: 'أريد أن...', example: '가고 싶어요', exampleAr: 'أريد أن أذهب' },
  { id: 'gp17', korean: '~ㄹ/을 수 있다', romanized: 'l/eul su itda', arabic: 'أستطيع أن...', example: '할 수 있어요', exampleAr: 'أستطيع' },
  { id: 'gp18', korean: '~ㄹ/을 수 없다', romanized: 'l/eul su eopda', arabic: 'لا أستطيع أن...', example: '갈 수 없어요', exampleAr: 'لا أستطيع الذهاب' },
  { id: 'gp19', korean: '~아/어야 하다', romanized: 'a/eoya hada', arabic: 'يجب أن...', example: '공부해야 해요', exampleAr: 'يجب أن أدرس' },
  { id: 'gp20', korean: '~지 마세요', romanized: 'ji maseyo', arabic: 'لا تفعل... (نهي)', example: '걱정하지 마세요', exampleAr: 'لا تقلق' },

  // Connectors (الروابط)
  { id: 'gp21', korean: '~고', romanized: 'go', arabic: 'و (ربط الأفعال)', example: '먹고 자요', exampleAr: 'آكل وأنام' },
  { id: 'gp22', korean: '~지만', romanized: 'jiman', arabic: 'لكن', example: '비싸지만 맛있어요', exampleAr: 'غالي لكن لذيذ' },
  { id: 'gp23', korean: '~아/어서', romanized: 'a/eoseo', arabic: 'لأن / ثم', example: '비가 와서 못 가요', exampleAr: 'لأن المطر تهطل لا أستطيع الذهاب' },
  { id: 'gp24', korean: '~(으)면', romanized: '(eu)myeon', arabic: 'إذا / عندما', example: '시간이 있으면 가요', exampleAr: 'إذا كان لدي وقت أذهب' },
  { id: 'gp25', korean: '~(으)니까', romanized: '(eu)nikka', arabic: 'لأن (سبب قوي)', example: '바쁘니까 내일 해요', exampleAr: 'لأنني مشغول سأفعلها غداً' },

  // Honorifics (التفخيم والتبجيل)
  { id: 'gp26', korean: '~(으)세요', romanized: '(eu)seyo', arabic: 'صيغة الاحترام', example: '앉으세요', exampleAr: 'تفضل بالجلوس' },
  { id: 'gp27', korean: '~(으)십시오', romanized: '(eu)sipsio', arabic: 'الأمر الرسمي', example: '들어오십시오', exampleAr: 'تفضل بالدخول' },
  { id: 'gp28', korean: '~드리다', romanized: 'deurida', arabic: 'يعطي (باحترام)', example: '도와 드릴게요', exampleAr: 'سأساعدك (باحترام)' },
  { id: 'gp29', korean: '~께서', romanized: 'kkeseo', arabic: 'فاعل مُبجَّل', example: '선생님께서 오셨어요', exampleAr: 'جاء المعلم (باحترام)' },
  { id: 'gp30', korean: '~(으)시다', romanized: '(eu)sida', arabic: 'فعل مُبجَّل', example: '아버지가 주무세요', exampleAr: 'أبي نائم (باحترام)' },
];

// Level 5: Additional Advanced Sentences (more sentences for level 5)
export const level5AdditionalSentences = [
  // Work & Career
  { id: 'l5a1', korean: '이력서를 제출했어요', romanized: 'iryeokseoreul jechulhaesseoyo', arabic: 'قدمت سيرتي الذاتية' },
  { id: 'l5a2', korean: '면접 결과를 기다리고 있어요', romanized: 'myeonjeop gyeolgwareul gidarigo isseoyo', arabic: 'أنتظر نتيجة المقابلة' },
  { id: 'l5a3', korean: '회의 시간을 변경해야 해요', romanized: 'hoeui siganeul byeongyeonghaeya haeyo', arabic: 'يجب تغيير موعد الاجتماع' },
  { id: 'l5a4', korean: '프로젝트 마감일이 다가오고 있어요', romanized: 'peurojekteu magamiri dagaogo isseoyo', arabic: 'موعد تسليم المشروع يقترب' },
  { id: 'l5a5', korean: '동료와 협력하는 게 중요해요', romanized: 'dongnyowa hyeomnyeokaneun ge jungyohaeyo', arabic: 'التعاون مع الزملاء مهم' },
  
  // Travel
  { id: 'l5a6', korean: '여권을 갱신해야 해요', romanized: 'yeogwoneul gaengsinhaeya haeyo', arabic: 'يجب تجديد جواز السفر' },
  { id: 'l5a7', korean: '호텔 예약을 확인하고 싶어요', romanized: 'hotel yeyageul hwaginhago sipeoyo', arabic: 'أريد تأكيد حجز الفندق' },
  { id: 'l5a8', korean: '관광 명소를 추천해 주세요', romanized: 'gwangwang myeongsoreul chucheonhae juseyo', arabic: 'أوصني بمعالم سياحية' },
  { id: 'l5a9', korean: '인천 공항에서 서울까지 얼마나 걸려요?', romanized: 'incheon gonghangeseo seoulkkaji eolmana geollyeoyo?', arabic: 'كم يستغرق من مطار إنتشون لسيول؟' },
  { id: 'l5a10', korean: '여행 보험에 가입했어요', romanized: 'yeohaeng boheome gaiphaesseoyo', arabic: 'اشتركت في تأمين السفر' },
  
  // Education
  { id: 'l5a11', korean: '대학교에서 경영학을 전공했어요', romanized: 'daehakgyoeseo gyeongyeonghageul jeonggonghaesseoyo', arabic: 'تخصصت في إدارة الأعمال في الجامعة' },
  { id: 'l5a12', korean: '장학금을 받고 싶어요', romanized: 'janghakgeumeul batgo sipeoyo', arabic: 'أريد الحصول على منحة' },
  { id: 'l5a13', korean: '한국어 능력 시험을 볼 거예요', romanized: 'hangugeo neungnyeok siheomeul bol geoyeyo', arabic: 'سأقدم اختبار إتقان اللغة الكورية' },
  { id: 'l5a14', korean: '논문 주제를 정해야 해요', romanized: 'nonmun jujereul jeonghaeya haeyo', arabic: 'يجب تحديد موضوع الأطروحة' },
  { id: 'l5a15', korean: '졸업한 지 3년이 됐어요', romanized: 'joreophan ji samnyeoni dwaesseoyo', arabic: 'مضى 3 سنوات على تخرجي' },
  
  // Technology
  { id: 'l5a16', korean: '새 스마트폰을 사고 싶어요', romanized: 'sae seumateuponeul sago sipeoyo', arabic: 'أريد شراء هاتف ذكي جديد' },
  { id: 'l5a17', korean: '비밀번호를 잊어버렸어요', romanized: 'bimilbeonhoreul ijeobeoryeosseoyo', arabic: 'نسيت كلمة المرور' },
  { id: 'l5a18', korean: '인터넷 속도가 너무 느려요', romanized: 'inteonet sokdoga neomu neuryeoyo', arabic: 'سرعة الإنترنت بطيئة جداً' },
  { id: 'l5a19', korean: '앱을 업데이트해야 해요', romanized: 'aebeul eopdeiteuaeya haeyo', arabic: 'يجب تحديث التطبيق' },
  { id: 'l5a20', korean: '온라인으로 주문할 수 있어요', romanized: 'ollainero jumunhal su isseoyo', arabic: 'يمكن الطلب عبر الإنترنت' },
  
  // Culture
  { id: 'l5a21', korean: '한복을 입어 보고 싶어요', romanized: 'hanbogeul ibeo bogo sipeoyo', arabic: 'أريد تجربة ارتداء الهانبوك' },
  { id: 'l5a22', korean: '김장철에는 김치를 많이 담가요', romanized: 'gimjangcheoreneun gimchireul mani damgayo', arabic: 'في موسم الكيمجانغ يصنعون كيمتشي كثيراً' },
  { id: 'l5a23', korean: '설날에는 떡국을 먹어요', romanized: 'seollaleneun tteokgugeul meogeoyo', arabic: 'في رأس السنة الكورية نأكل تيكوك' },
  { id: 'l5a24', korean: '사물놀이 공연을 보고 싶어요', romanized: 'samulnori gongyeoneul bogo sipeoyo', arabic: 'أريد مشاهدة عرض ساموُلنوري' },
  { id: 'l5a25', korean: '한국의 사계절이 아름다워요', romanized: 'hangugui sagyejeori areumdawoyo', arabic: 'الفصول الأربعة في كوريا جميلة' },
];

// Level 6: Additional Daily Life (more content)
export const level6ExtraSentences = [
  // Banking & Finance
  { id: 'dl101', korean: '통장을 만들고 싶어요', romanized: 'tongjangeul mandeulgo sipeoyo', arabic: 'أريد فتح حساب بنكي' },
  { id: 'dl102', korean: '송금하고 싶어요', romanized: 'songgeumhago sipeoyo', arabic: 'أريد تحويل أموال' },
  { id: 'dl103', korean: '환전소가 어디에요?', romanized: 'hwanjeonsoga eodieyo?', arabic: 'أين مكتب الصرافة؟' },
  { id: 'dl104', korean: '카드가 안 돼요', romanized: 'kadeuga an dwaeyo', arabic: 'البطاقة لا تعمل' },
  { id: 'dl105', korean: '잔액을 확인해 주세요', romanized: 'janaegeul hwaginhae juseyo', arabic: 'تحقق من الرصيد من فضلك' },
  
  // Hospital & Emergency
  { id: 'dl106', korean: '배가 아파요', romanized: 'baega apayo', arabic: 'بطني يؤلمني' },
  { id: 'dl107', korean: '알레르기가 있어요', romanized: 'allereuriga isseoyo', arabic: 'لدي حساسية' },
  { id: 'dl108', korean: '처방전을 받았어요', romanized: 'cheobangjeoneul badasseoyo', arabic: 'حصلت على وصفة طبية' },
  { id: 'dl109', korean: '보험이 돼요?', romanized: 'boheomi dwaeyo?', arabic: 'هل يغطي التأمين؟' },
  { id: 'dl110', korean: '구급차를 불러 주세요', romanized: 'gugeupchareul bulleo juseyo', arabic: 'اتصل بالإسعاف من فضلك' },
  
  // Post Office & Services
  { id: 'dl111', korean: '소포를 보내고 싶어요', romanized: 'soporeul bonaego sipeoyo', arabic: 'أريد إرسال طرد' },
  { id: 'dl112', korean: '등기우편으로 보내 주세요', romanized: 'deunggipyeoneuro bonae juseyo', arabic: 'أرسله بالبريد المسجل' },
  { id: 'dl113', korean: '배달이 얼마나 걸려요?', romanized: 'baedari eolmana geollyeoyo?', arabic: 'كم يستغرق التوصيل؟' },
  { id: 'dl114', korean: '택배를 받으러 왔어요', romanized: 'taekbaereul badeureo wasseoyo', arabic: 'جئت لاستلام الطرد' },
  { id: 'dl115', korean: '반품하고 싶어요', romanized: 'banpumhago sipeoyo', arabic: 'أريد إرجاع المنتج' },
  
  // Housing
  { id: 'dl116', korean: '월세가 얼마예요?', romanized: 'wolsega eolmayeyo?', arabic: 'كم الإيجار الشهري؟' },
  { id: 'dl117', korean: '수리를 요청했어요', romanized: 'surireul yocheonghaesseoyo', arabic: 'طلبت إصلاحاً' },
  { id: 'dl118', korean: '이사할 거예요', romanized: 'isahal geoyeyo', arabic: 'سأنتقل لمنزل جديد' },
  { id: 'dl119', korean: '관리비가 포함돼요?', romanized: 'gwallibiga pohamdwaeyo?', arabic: 'هل رسوم الصيانة مشمولة؟' },
  { id: 'dl120', korean: '계약서를 확인해 주세요', romanized: 'gyeyakseoreul hwaginhae juseyo', arabic: 'تحقق من العقد من فضلك' },
];
