import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { useSoundSettings } from '@/contexts/SoundSettingsContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SoundSettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  embedded?: boolean;
}

const SoundSettingsPanel: React.FC<SoundSettingsPanelProps> = ({ isOpen = true, onClose, embedded = false }) => {
  const { settings, setMuted, setVolume, setEffectsEnabled } = useSoundSettings();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const content = (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header - only show when embedded */}
      {embedded && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              {isRTL ? 'إعدادات الصوت' : '사운드 설정'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'تحكم في أصوات التطبيق' : '앱 사운드 제어'}
            </p>
          </div>
        </div>
      )}

      {/* Master Mute Toggle */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all border border-border/50"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: settings.isMuted ? 0.9 : 1,
              rotate: settings.isMuted ? -10 : 0
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              settings.isMuted 
                ? 'bg-gradient-to-br from-destructive/80 to-destructive' 
                : 'bg-gradient-to-br from-primary/80 to-primary'
            }`}
          >
            {settings.isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </motion.div>
          <div>
            <p className="font-semibold text-foreground">
              {isRTL ? 'كتم الصوت' : '음소거'}
            </p>
            <p className="text-sm text-muted-foreground">
              {settings.isMuted 
                ? (isRTL ? 'الصوت مكتوم حالياً' : '현재 음소거됨')
                : (isRTL ? 'الصوت مفعل' : '활성화됨')
              }
            </p>
          </div>
        </div>
        <Switch
          checked={settings.isMuted}
          onCheckedChange={setMuted}
        />
      </motion.div>

      {/* Volume Slider */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-foreground">
            {isRTL ? 'مستوى الصوت' : '볼륨'}
          </span>
          <span className={`text-lg font-bold px-3 py-1 rounded-full ${
            settings.isMuted 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-primary/20 text-primary'
          }`}>
            {Math.round(settings.volume * 100)}%
          </span>
        </div>
        <div className="px-1">
          <Slider
            value={[settings.volume * 100]}
            onValueChange={([value]) => setVolume(value / 100)}
            max={100}
            step={5}
            disabled={settings.isMuted}
            className={settings.isMuted ? 'opacity-50' : ''}
          />
        </div>
        {/* Volume indicators */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{isRTL ? 'منخفض' : '낮음'}</span>
          <span>{isRTL ? 'متوسط' : '중간'}</span>
          <span>{isRTL ? 'عالي' : '높음'}</span>
        </div>
      </motion.div>

      {/* Sound Effects Toggle */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all border border-border/50"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: settings.effectsEnabled ? [0, 10, -10, 0] : 0 }}
            transition={{ repeat: settings.effectsEnabled ? Infinity : 0, duration: 2 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              settings.effectsEnabled && !settings.isMuted
                ? 'bg-gradient-to-br from-accent/80 to-accent' 
                : 'bg-muted'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${
              settings.effectsEnabled && !settings.isMuted ? 'text-white' : 'text-muted-foreground'
            }`} />
          </motion.div>
          <div>
            <p className="font-semibold text-foreground">
              {isRTL ? 'تأثيرات صوتية' : '효과음'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'أصوات النقر والتفاعل' : '클릭 및 상호작용 효과'}
            </p>
          </div>
        </div>
        <Switch
          checked={settings.effectsEnabled}
          onCheckedChange={setEffectsEnabled}
          disabled={settings.isMuted}
        />
      </motion.div>

      {/* Quick Presets */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-2"
      >
        <p className="text-sm font-medium text-muted-foreground mb-3">
          {isRTL ? 'إعدادات سريعة' : '빠른 설정'}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVolume(0);
              setMuted(true);
            }}
            className="rounded-xl flex flex-col items-center gap-1 h-auto py-3"
          >
            <VolumeX className="w-4 h-4" />
            <span className="text-xs">{isRTL ? 'صامت' : '무음'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVolume(0.3);
              setEffectsEnabled(true);
              setMuted(false);
            }}
            className="rounded-xl flex flex-col items-center gap-1 h-auto py-3"
          >
            <Volume2 className="w-4 h-4 opacity-50" />
            <span className="text-xs">{isRTL ? 'منخفض' : '저음'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVolume(0.8);
              setEffectsEnabled(true);
              setMuted(false);
            }}
            className="rounded-xl flex flex-col items-center gap-1 h-auto py-3"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-xs">{isRTL ? 'عالي' : '고음'}</span>
          </Button>
        </div>
      </motion.div>

      {/* Status indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`p-3 rounded-xl text-center text-sm ${
          settings.isMuted 
            ? 'bg-destructive/10 text-destructive' 
            : 'bg-primary/10 text-primary'
        }`}
      >
        {settings.isMuted 
          ? (isRTL ? '🔇 جميع الأصوات مكتومة' : '🔇 모든 소리가 음소거됨')
          : (isRTL ? `🔊 الصوت مفعل بنسبة ${Math.round(settings.volume * 100)}%` : `🔊 볼륨 ${Math.round(settings.volume * 100)}%로 활성화됨`)
        }
      </motion.div>
    </div>
  );

  // If embedded, just return the content directly
  if (embedded || isOpen) {
    return content;
  }

  return null;
};

export default SoundSettingsPanel;
