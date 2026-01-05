import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Mail, Lock, User, ArrowLeft, Loader2, Phone, MapPin, 
  GraduationCap, Briefcase, School, Users, Calendar, CreditCard 
} from 'lucide-react';

type UserType = 'student' | 'graduate' | 'teacher' | 'other';

interface RegistrationForm {
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
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
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
        // Login with phone and password
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('phone', loginForm.phone)
          .maybeSingle();

        if (!profile) {
          throw new Error(isRTL ? 'رقم الهاتف غير مسجل' : '등록되지 않은 전화번호입니다');
        }

        // Get user email from auth
        const email = `${loginForm.phone}@korean-learn.app`;
        const { error } = await signIn(email, loginForm.password);
        if (error) throw error;
        navigate('/dashboard');
      } else {
        // Registration validation
        if (!form.fullNameArabic || !form.fullNameEnglish || !form.nationalId || 
            !form.phone || !form.password || !form.userType) {
          throw new Error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : '모든 필수 필드를 입력하세요');
        }
        if (form.nationalId.length !== 14) {
          throw new Error(isRTL ? 'الرقم القومي يجب أن يكون 14 رقم' : '주민등록번호는 14자리여야 합니다');
        }
        if (!form.latitude || !form.longitude) {
          throw new Error(isRTL ? 'يرجى تحديد موقعك الجغرافي' : '위치를 확인해주세요');
        }

        // Create email from phone for Supabase auth
        const email = `${form.phone}@korean-learn.app`;
        
        const { error: signUpError } = await signUp(email, form.password, form.fullNameArabic);
        if (signUpError) throw signUpError;

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
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="font-korean text-xl font-bold text-gradient">한국어</span>
        </button>
        <LanguageSwitcher />
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="korean-card animate-scale-in">
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? (isRTL ? 'تسجيل الدخول' : '로그인') : (isRTL ? 'إنشاء حساب جديد' : '회원가입')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                // Login Form
                <>
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="tel"
                      placeholder={isRTL ? 'رقم الهاتف' : '전화번호'}
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
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
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      required
                      minLength={6}
                    />
                  </div>
                </>
              ) : (
                // Registration Form
                <>
                  {/* Full Name Arabic */}
                  <div className="relative">
                    <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الاسم الرباعي بالعربية' : '아랍어 이름 (4부분)'}
                      value={form.fullNameArabic}
                      onChange={(e) => setForm({ ...form, fullNameArabic: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      required
                    />
                  </div>

                  {/* Full Name English */}
                  <div className="relative">
                    <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الاسم الرباعي بالإنجليزية' : '영어 이름 (4부분)'}
                      value={form.fullNameEnglish}
                      onChange={(e) => setForm({ ...form, fullNameEnglish: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      required
                      dir="ltr"
                    />
                  </div>

                  {/* National ID */}
                  <div className="relative">
                    <CreditCard className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'الرقم القومي (14 رقم)' : '주민등록번호 (14자리)'}
                      value={form.nationalId}
                      onChange={(e) => handleNationalIdChange(e.target.value)}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      required
                      dir="ltr"
                      maxLength={14}
                    />
                  </div>

                  {/* Extracted Birth Date & Age */}
                  {extractedInfo.birthDate && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{isRTL ? 'تاريخ الميلاد' : '생년월일'}</span>
                        </div>
                        <p className="font-semibold">{extractedInfo.birthDate}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-xl">
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
                      placeholder={isRTL ? 'رقم الهاتف' : '전화번호'}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      required
                      dir="ltr"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="password"
                      placeholder={isRTL ? 'كلمة المرور' : '비밀번호'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
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
                      form.latitude ? 'border-korean-green bg-korean-green/10 text-korean-green' : 'border-border hover:border-primary'
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
                        : (isRTL ? 'تحديد الموقع الجغرافي' : '위치 확인')
                      }
                    </span>
                  </button>

                  {/* User Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {isRTL ? 'نوع المستخدم' : '사용자 유형'}
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
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      />
                    </div>
                  )}

                  {form.userType === 'graduate' && (
                    <div className="space-y-3 animate-scale-in">
                      <div className="relative">
                        <School className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                        <input
                          type="text"
                          placeholder={isRTL ? 'اسم الكلية التي تخرجت منها' : '졸업한 대학교'}
                          value={form.collegeName}
                          onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                          className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                        />
                      </div>
                      <div className="relative">
                        <Briefcase className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                        <input
                          type="text"
                          placeholder={isRTL ? 'الوظيفة الحالية' : '현재 직업'}
                          value={form.jobTitle}
                          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                          className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                        />
                      </div>
                    </div>
                  )}

                  {form.userType === 'teacher' && (
                    <div className="relative animate-scale-in">
                      <Briefcase className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'مكان التدريس' : '교육 기관'}
                        value={form.teachingPlace}
                        onChange={(e) => setForm({ ...form, teachingPlace: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      />
                    </div>
                  )}

                  {form.userType === 'other' && (
                    <div className="relative animate-scale-in">
                      <Users className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'صف وضعك' : '상황을 설명해주세요'}
                        value={form.otherOccupation}
                        onChange={(e) => setForm({ ...form, otherOccupation: e.target.value })}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-border rounded-xl focus:border-primary outline-none transition-colors bg-background`}
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full korean-button flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLogin ? (isRTL ? 'تسجيل الدخول' : '로그인') : (isRTL ? 'إنشاء الحساب' : '회원가입')}
              </button>
            </form>

            <p className="text-center mt-6 text-muted-foreground">
              {isLogin ? (isRTL ? 'ليس لديك حساب؟' : '계정이 없으신가요?') : (isRTL ? 'لديك حساب بالفعل؟' : '이미 계정이 있으신가요?')}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? (isRTL ? 'إنشاء حساب' : '회원가입') : (isRTL ? 'تسجيل الدخول' : '로그인')}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;