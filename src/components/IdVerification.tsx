import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Check, X, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface IdVerificationProps {
  onVerified?: () => void;
}

const IdVerification: React.FC<IdVerificationProps> = ({ onVerified }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [verified, setVerified] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: isRTL ? 'خطأ' : '오류',
        description: isRTL ? 'يرجى اختيار صورة صالحة' : '유효한 이미지를 선택하세요',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: isRTL ? 'خطأ' : '오류',
        description: isRTL ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)' : '이미지 크기가 너무 큽니다 (최대 5MB)',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/id-${side}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (side === 'front') {
        setFrontImage(publicUrl);
      } else {
        setBackImage(publicUrl);
      }

      toast({
        title: isRTL ? 'تم الرفع بنجاح' : '업로드 성공',
        description: isRTL 
          ? `تم رفع صورة ${side === 'front' ? 'الوجه' : 'الظهر'}` 
          : `${side === 'front' ? '앞면' : '뒷면'} 이미지가 업로드되었습니다`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: isRTL ? 'خطأ في الرفع' : '업로드 오류',
        description: isRTL ? 'فشل في رفع الصورة' : '이미지 업로드에 실패했습니다',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage || !nationalId || !fullName) {
      toast({
        title: isRTL ? 'بيانات ناقصة' : '데이터 누락',
        description: isRTL ? 'يرجى ملء جميع الحقول ورفع الصور' : '모든 필드를 입력하고 이미지를 업로드하세요',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Update profile with verification data
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: fullName,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setVerified(true);
      toast({
        title: isRTL ? 'تم التحقق بنجاح' : '인증 성공',
        description: isRTL ? 'تم توثيق هويتك بنجاح' : '신원이 성공적으로 인증되었습니다',
      });
      
      onVerified?.();
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: isRTL ? 'خطأ' : '오류',
        description: isRTL ? 'فشل في التحقق' : '인증에 실패했습니다',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (verified) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">
            {isRTL ? 'تم التحقق من الهوية' : '신원 확인 완료'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'يمكنك الآن طباعة شهادتك' : '이제 인증서를 인쇄할 수 있습니다'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          {isRTL ? 'توثيق الهوية' : '신원 확인'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {isRTL 
            ? 'لطباعة شهادتك، يرجى رفع صورة البطاقة الشخصية (وجه وظهر) للتحقق من هويتك' 
            : '인증서를 인쇄하려면 신분증 사진(앞면과 뒷면)을 업로드하여 신원을 확인하세요'}
        </p>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {isRTL ? 'الاسم الكامل (كما في البطاقة)' : '전체 이름 (신분증과 동일)'}
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isRTL ? 'أدخل اسمك الكامل' : '전체 이름을 입력하세요'}
          />
        </div>

        {/* National ID */}
        <div className="space-y-2">
          <Label htmlFor="nationalId">
            {isRTL ? 'الرقم القومي' : '주민등록번호'}
          </Label>
          <Input
            id="nationalId"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder={isRTL ? 'أدخل الرقم القومي' : '주민등록번호를 입력하세요'}
          />
        </div>

        {/* Image Upload */}
        <div className="grid grid-cols-2 gap-4">
          {/* Front Image */}
          <div className="space-y-2">
            <Label>{isRTL ? 'صورة الوجه' : '앞면'}</Label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => frontInputRef.current?.click()}
              className={`relative aspect-[1.6/1] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                frontImage 
                  ? 'border-green-500 bg-green-500/5' 
                  : 'border-muted-foreground/30 hover:border-primary'
              }`}
            >
              {frontImage ? (
                <img 
                  src={frontImage} 
                  alt="ID Front" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? 'اضغط للرفع' : '클릭하여 업로드'}
                  </span>
                </div>
              )}
              {frontImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFrontImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageUpload(e, 'front')}
              className="hidden"
            />
          </div>

          {/* Back Image */}
          <div className="space-y-2">
            <Label>{isRTL ? 'صورة الظهر' : '뒷면'}</Label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => backInputRef.current?.click()}
              className={`relative aspect-[1.6/1] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                backImage 
                  ? 'border-green-500 bg-green-500/5' 
                  : 'border-muted-foreground/30 hover:border-primary'
              }`}
            >
              {backImage ? (
                <img 
                  src={backImage} 
                  alt="ID Back" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? 'اضغط للرفع' : '클릭하여 업로드'}
                  </span>
                </div>
              )}
              {backImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBackImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageUpload(e, 'back')}
              className="hidden"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={uploading || !frontImage || !backImage || !nationalId || !fullName}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isRTL ? 'جاري التحقق...' : '확인 중...'}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {isRTL ? 'تأكيد البيانات' : '데이터 확인'}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {isRTL 
            ? 'سيتم استخدام هذه البيانات فقط لطباعة الشهادة ولن يتم مشاركتها مع أي جهة أخرى' 
            : '이 데이터는 인증서 인쇄에만 사용되며 제3자와 공유되지 않습니다'}
        </p>
      </CardContent>
    </Card>
  );
};

export default IdVerification;
