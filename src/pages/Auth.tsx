import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, ArrowLeft, ArrowRight, Loader2, Phone, MapPin, 
  GraduationCap, Briefcase, School, Users, Calendar, CreditCard, Sparkles,
  CheckCircle2, Circle
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
  const [currentStep, setCurrentStep] = useState(1);
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
  const totalSteps = 4;

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
        () => {
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!form.email || !form.password) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى ملء البريد الإلكتروني وكلمة المرور' : '이메일과 비밀번호를 입력하세요',
            variant: 'destructive',
          });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : '올바른 이메일을 입력하세요',
            variant: 'destructive',
          });
          return false;
        }
        if (form.password.length < 6) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : '비밀번호는 6자 이상이어야 합니다',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 2:
        if (!form.fullNameArabic || !form.fullNameEnglish) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى ملء الاسم بالعربية والإنجليزية' : '아랍어와 영어로 이름을 입력하세요',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 3:
        if (!form.nationalId || form.nationalId.length !== 14) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'الرقم القومي يجب أن يكون 14 رقم' : '주민등록번호는 14자리여야 합니다',
            variant: 'destructive',
          });
          return false;
        }
        if (!form.phone) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى إدخال رقم الهاتف' : '전화번호를 입력하세요',
            variant: 'destructive',
          });
          return false;
        }
        if (!form.latitude || !form.longitude) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى تحديد موقعك الجغرافي' : '위치를 확인해주세요',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 4:
        if (!form.userType) {
          toast({
            title: isRTL ? 'خطأ' : '오류',
            description: isRTL ? 'يرجى اختيار نوع المستخدم' : '사용자 유형을 선택하세요',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(loginForm.email, loginForm.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : '이메일 또는 비밀번호가 잘못되었습니다');
          }
          throw error;
        }
        navigate('/dashboard');
      } else {
        if (!validateStep(currentStep)) {
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(form.email, form.password, form.fullNameArabic);
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error(isRTL ? 'هذا البريد الإلكتروني مسجل بالفعل' : '이미 등록된 이메일입니다');
          }
          throw signUpError;
        }

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
    { value: 'student', label: isRTL ? 'طالب' : '학생', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { value: 'graduate', label: isRTL ? 'خريج' : '졸업생', icon: School, color: 'from-emerald-500 to-teal-500' },
    { value: 'teacher', label: isRTL ? 'معلم' : '교사', icon: Briefcase, color: 'from-purple-500 to-violet-500' },
    { value: 'other', label: isRTL ? 'أخرى' : '기타', icon: Users, color: 'from-amber-500 to-orange-500' },
  ];

  const stepTitles = [
    { title: isRTL ? 'البريد وكلمة المرور' : '이메일 및 비밀번호', icon: Mail },
    { title: isRTL ? 'الاسم الكامل' : '이름', icon: User },
    { title: isRTL ? 'البيانات الشخصية' : '개인 정보', icon: CreditCard },
    { title: isRTL ? 'نوع المستخدم' : '사용자 유형', icon: Users },
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepTitles.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === index + 1;
        const isCompleted = currentStep > index + 1;
        
        return (
          <React.Fragment key={index}>
            <motion.div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30' 
                  : isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-muted text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <StepIcon className="w-5 h-5" />
              )}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-rose-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            {index < stepTitles.length - 1 && (
              <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                currentStep > index + 1 ? 'bg-emerald-500' : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: isRTL ? -20 : 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: isRTL ? 20 : -20 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Step Title */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-foreground">
              {stepTitles[currentStep - 1].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? `الخطوة ${currentStep} من ${totalSteps}` : `${totalSteps}단계 중 ${currentStep}단계`}
            </p>
          </div>

          {currentStep === 1 && (
            <>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="email"
                  placeholder={isRTL ? 'البريد الإلكتروني' : '이메일'}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                  dir="ltr"
                />
              </div>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="password"
                  placeholder={isRTL ? 'كلمة المرور (6 أحرف على الأقل)' : '비밀번호 (최소 6자)'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                  minLength={6}
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'الاسم الرباعي بالعربية' : '아랍어 이름 (4부분)'}
                  value={form.fullNameArabic}
                  onChange={(e) => setForm({ ...form, fullNameArabic: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                />
              </div>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'الاسم الرباعي بالإنجليزية' : '영어 이름 (4부분)'}
                  value={form.fullNameEnglish}
                  onChange={(e) => setForm({ ...form, fullNameEnglish: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                  dir="ltr"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="relative">
                <CreditCard className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'الرقم القومي (14 رقم)' : '주민등록번호 (14자리)'}
                  value={form.nationalId}
                  onChange={(e) => handleNationalIdChange(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                  dir="ltr"
                  maxLength={14}
                />
              </div>

              {extractedInfo.birthDate && (
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{isRTL ? 'تاريخ الميلاد' : '생년월일'}</span>
                    </div>
                    <p className="font-bold text-foreground">{extractedInfo.birthDate}</p>
                  </div>
                  <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      <span>{isRTL ? 'العمر' : '나이'}</span>
                    </div>
                    <p className="font-bold text-foreground">{extractedInfo.age} {isRTL ? 'سنة' : '세'}</p>
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  type="tel"
                  placeholder={isRTL ? 'رقم الهاتف' : '전화번호'}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                  dir="ltr"
                />
              </div>

              <motion.button
                type="button"
                onClick={getLocation}
                disabled={gettingLocation}
                className={`w-full py-4 px-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                  form.latitude 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' 
                    : 'border-border hover:border-primary bg-background/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {gettingLocation ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {form.latitude 
                    ? (isRTL ? 'تم تحديد الموقع ✓' : '위치 확인됨 ✓')
                    : (isRTL ? 'تحديد الموقع الجغرافي' : '위치 확인')
                  }
                </span>
              </motion.button>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {userTypeOptions.map((option) => {
                  const OptionIcon = option.icon;
                  const isSelected = form.userType === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setForm({ ...form, userType: option.value as UserType })}
                      className={`relative p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all overflow-hidden ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 bg-background/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? `bg-gradient-to-br ${option.color} text-white` 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <OptionIcon className="w-7 h-7" />
                      </div>
                      <span className={`relative font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Conditional Fields */}
              <AnimatePresence mode="wait">
                {form.userType === 'student' && (
                  <motion.div
                    key="student"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <School className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'اسم الكلية' : '대학교 이름'}
                      value={form.collegeName}
                      onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50`}
                    />
                  </motion.div>
                )}

                {form.userType === 'graduate' && (
                  <motion.div
                    key="graduate"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <Briefcase className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'المسمى الوظيفي' : '직책'}
                      value={form.jobTitle}
                      onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50`}
                    />
                  </motion.div>
                )}

                {form.userType === 'teacher' && (
                  <motion.div
                    key="teacher"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <School className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'مكان التدريس' : '근무처'}
                      value={form.teachingPlace}
                      onChange={(e) => setForm({ ...form, teachingPlace: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50`}
                    />
                  </motion.div>
                )}

                {form.userType === 'other' && (
                  <motion.div
                    key="other"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <Users className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <input
                      type="text"
                      placeholder={isRTL ? 'حدد مهنتك' : '직업을 입력하세요'}
                      value={form.otherOccupation}
                      onChange={(e) => setForm({ ...form, otherOccupation: e.target.value })}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

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
          <motion.div 
            className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
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
                {isRTL ? 'محمد أيمن يرحب بك في رحلة تعلم الكورية' : 'Mohamed Ayman이 한국어 학습 여정에 오신 것을 환영합니다'}
              </p>
            </div>

            <h2 className="text-xl font-bold text-center mb-6">
              {isLogin ? (isRTL ? 'تسجيل الدخول' : '로그인') : (isRTL ? 'إنشاء حساب جديد' : '회원가입')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
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
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-4 border-2 border-border rounded-2xl focus:border-primary outline-none transition-all bg-background/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {isRTL ? 'تسجيل الدخول' : '로그인'}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                // Registration Form - Multi-Step
                <>
                  {renderStepIndicator()}
                  {renderStep()}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-border hover:border-primary transition-all bg-background/50"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{isRTL ? 'السابق' : '이전'}</span>
                      </motion.button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30 transition-all"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span>{isRTL ? 'التالي' : '다음'}</span>
                        <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>{isRTL ? 'إنشاء حساب' : '회원가입'}</span>
                            <Sparkles className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </>
              )}

              {/* Toggle Login/Register */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setCurrentStep(1);
                  }}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  {isLogin 
                    ? (isRTL ? 'ليس لديك حساب؟ سجل الآن' : '계정이 없으신가요? 회원가입')
                    : (isRTL ? 'لديك حساب بالفعل؟ سجل دخول' : '이미 계정이 있으신가요? 로그인')
                  }
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
