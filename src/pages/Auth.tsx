import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Mail, Lock, User, ArrowLeft, Loader2, Phone, MapPin, 
  GraduationCap, Briefcase, School, Users, Calendar, CreditCard, Sparkles 
} from 'lucide-react';

type UserType = 'student' | 'graduate' | 'teacher' | 'other';

interface RegistrationForm {
  email: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  nationalId: string;
  phone: string;
  password: string;
  userType: UserType | '';
  collegeName: string;
  jobTitle: string;
  teachingPlace: string;
  otherOccupation: string;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string;
}

const Auth: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [form, setForm] = useState<RegistrationForm>({
    email: '',
    fullNameArabic: '',
    fullNameEnglish: '',
    nationalId: '',
    phone: '',
    password: '',
    userType: '',
    collegeName: '',
    jobTitle: '',
    teachingPlace: '',
    otherOccupation: '',
    latitude: null,
    longitude: null,
    locationAddress: ''
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [extractedInfo, setExtractedInfo] = useState({ birthDate: '', age: 0 });

  const isRTL = language === 'ar';

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Extract birth date and age from Egyptian National ID
  const extractFromNationalId = (nationalId: string) => {
    if (nationalId.length !== 14) return;
    
    const century = nationalId.charAt(0) === '2' ? '19' : '20';
    const year = century + nationalId.substring(1, 3);
    const month = nationalId.substring(3, 5);
    const day = nationalId.substring(5, 7);
    
    const birthDate = `${year}-${month}-${day}`;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    setExtractedInfo({ birthDate, age });
  };

  const handleNationalIdChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 14);
    setForm({ ...form, nationalId: cleanedValue });
    if (cleanedValue.length === 14) {
      extractFromNationalId(cleanedValue);
    }
  };

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setForm(prev => ({
            ...prev,
            latitude,
            longitude,
            locationAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setGettingLocation(false);
          toast({
            title: isRTL ? 'تم تحديد الموقع' : '위치 확인됨',
            description: isRTL ? 'تم تحديد موقعك بنجاح' : '위치가 성공적으로 확인되었습니다',
          });
        },
        (error) => {
          setGettingLocation(false);
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'تعذر الحصول على الموقع' : '위치를 가져올 수 없습니다',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login with email and password directly
        const { error } = await signIn(loginForm.email, loginForm.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : '이메일 또는 비밀번호가 잘못되었습니다');
          }
          throw error;
        }
        navigate('/dashboard');
      } else {
        // Registration validation
        if (!form.email || !form.fullNameArabic || !form.fullNameEnglish || !form.nationalId || 
            !form.phone || !form.password || !form.userType) {
          throw new Error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : '모든 필수 필드를 입력하세요');
        }
        if (form.nationalId.length !== 14) {
          throw new Error(isRTL ? 'الرقم القومي يجب أن يكون 14 رقم' : '주민등록번호는 14자리여야 합니다');
        }
        if (!form.latitude || !form.longitude) {
          throw new Error(isRTL ? 'يرجى تحديد موقعك الجغرافي' : '위치를 확인해주세요');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          throw new Error(isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : '올바른 이메일을 입력하세요');
        }

        const { error: signUpError } = await signUp(form.email, form.password, form.fullNameArabic);
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error(isRTL ? 'هذا البريد الإلكتروني مسجل بالفعل' : '이미 등록된 이메일입니다');
          }
          throw signUpError;
        }

        // Wait a bit for auth to complete then update profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await supabase.from('profiles').update({
            full_name_arabic: form.fullNameArabic,
            full_name_english: form.fullNameEnglish,
            national_id: form.nationalId,
            birth_date: extractedInfo.birthDate,
            age: extractedInfo.age,
            phone: form.phone,
            latitude: form.latitude,
            longitude: form.longitude,
            location_address: form.locationAddress,
            user_type: form.userType,
            college_name: form.collegeName || null,
            job_title: form.jobTitle || null,
            teaching_place: form.teachingPlace || null,
            other_occupation: form.otherOccupation || null,
            display_name: form.fullNameArabic
          }).eq('user_id', newUser.id);
          
          // Mark as first time user for welcome modal
          localStorage.setItem('isFirstTimeUser', 'true');
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    { value: 'student', label: isRTL ? 'طالب' : '학생', icon: GraduationCap },
    { value: 'graduate', label: isRTL ? 'خريج' : '졸업생', icon: School },
    { value: 'teacher', label: isRTL ? 'معلم' : '교사', icon: Briefcase },
    { value: 'other', label: isRTL ? 'أخرى' : '기타', icon: Users },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Floating Korean Characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['한', '국', '어', '배', '우', '기', '사', '랑', '행', '복'].map((char, i) => (
          <span
            key={i}
            className="absolute font-korean text-4xl text-primary/10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="font-korean text-xl font-bold text-gradient">한국어</span>
        </button>
        <LanguageSwitcher />
      </header>

      {/* Auth Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 animate-scale-in">
            {/* Decorative corner */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                {isLogin ? (isRTL ? 'مرحباً بعودتك!' : '다시 만나서 반가워요!') : (isRTL ? 'انضم إلينا!' : '우리와 함께하세요!')}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isRTL ? 'محمد أمين يرحب بك في رحلة تعلم الكورية' : 'Mohamed Amin이 한국어 학습 여정에 오신 것을 환영합니다'}
              </p>
            </div>

            <h2 className="text-xl font-bold text-center mb-6">
              {isLogin ? (isRTL ? 'تسجيل الدخول' : '로그인') : (isRTL ? 'إنشاء حساب جديد' : '회원가입')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                // Login Form
                <>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="email"
                      placeholder={isRTL ? 'البريد الإلكتروني' : '이메일'}
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="password"
                      placeholder={isRTL ? 'كلمة المرور' : '비밀번호'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                  </div>
                </>
              ) : (
                // Registration Form
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {/* Email */}
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="email"
                      placeholder={isRTL ? 'البريد الإلكتروني *' : '이메일 *'}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      dir="ltr"
                    />
                  </div>

                  {/* Full Name Arabic */}
                  <div className="relative">
                    <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الاسم الرباعي بالعربية *' : '아랍어 이름 (4부분) *'}
                      value={form.fullNameArabic}
                      onChange={(e) => setForm({ ...form, fullNameArabic: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                    />
                  </div>

                  {/* Full Name English */}
                  <div className="relative">
                    <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الاسم الرباعي بالإنجليزية *' : '영어 이름 (4부분) *'}
                      value={form.fullNameEnglish}
                      onChange={(e) => setForm({ ...form, fullNameEnglish: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      dir="ltr"
                    />
                  </div>

                  {/* National ID */}
                  <div className="relative">
                    <CreditCard className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الرقم القومي (14 رقم) *' : '주민등록번호 (14자리) *'}
                      value={form.nationalId}
                      onChange={(e) => handleNationalIdChange(e.target.value)}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      dir="ltr"
                      maxLength={14}
                    />
                  </div>

                  {/* Extracted Birth Date & Age */}
                  {extractedInfo.birthDate && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{isRTL ? 'تاريخ الميلاد' : '생년월일'}</span>
                        </div>
                        <p className="font-semibold">{extractedInfo.birthDate}</p>
                      </div>
                      <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="w-4 h-4" />
                          <span>{isRTL ? 'العمر' : '나이'}</span>
                        </div>
                        <p className="font-semibold">{extractedInfo.age} {isRTL ? 'سنة' : '세'}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="tel"
                      placeholder={isRTL ? 'رقم الهاتف *' : '전화번호 *'}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      dir="ltr"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="password"
                      placeholder={isRTL ? 'كلمة المرور *' : '비밀번호 *'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                  </div>

                  {/* GPS Location */}
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className={`w-full py-3 px-4 border-2 rounded-xl flex items-center justify-center gap-3 transition-colors ${
                      form.latitude ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border hover:border-primary'
                    }`}
                  >
                    {gettingLocation ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                    <span>
                      {form.latitude 
                        ? (isRTL ? 'تم تحديد الموقع ✓' : '위치 확인됨 ✓')
                        : (isRTL ? 'تحديد الموقع الجغرافي *' : '위치 확인 *')
                      }
                    </span>
                  </button>

                  {/* User Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {isRTL ? 'نوع المستخدم *' : '사용자 유형 *'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {userTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm({ ...form, userType: option.value as UserType })}
                          className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                            form.userType === option.value 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conditional Fields based on User Type */}
                  {form.userType === 'student' && (
                    <div className="relative animate-scale-in">
                      <School className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'اسم الكلية' : '대학교 이름'}
                        value={form.collegeName}
                        onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50`}
                      />
                    </div>
                  )}

                  {form.userType === 'graduate' && (
                    <div className="relative animate-scale-in">
                      <Briefcase className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'المسمى الوظيفي' : '직책'}
                        value={form.jobTitle}
                        onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50`}
                      />
                    </div>
                  )}

                  {form.userType === 'teacher' && (
                    <div className="relative animate-scale-in">
                      <School className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'مكان التدريس' : '근무처'}
                        value={form.teachingPlace}
                        onChange={(e) => setForm({ ...form, teachingPlace: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50`}
                      />
                    </div>
                  )}

                  {form.userType === 'other' && (
                    <div className="relative animate-scale-in">
                      <Users className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'حدد مهنتك' : '직업을 입력하세요'}
                        value={form.otherOccupation}
                        onChange={(e) => setForm({ ...form, otherOccupation: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background/50`}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? (isRTL ? 'تسجيل الدخول' : '로그인') : (isRTL ? 'إنشاء حساب' : '회원가입')}
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  {isLogin 
                    ? (isRTL ? 'ليس لديك حساب؟ سجل الآن' : '계정이 없으신가요? 회원가입')
                    : (isRTL ? 'لديك حساب بالفعل؟ سجل دخول' : '이미 계정이 있으신가요? 로그인')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
