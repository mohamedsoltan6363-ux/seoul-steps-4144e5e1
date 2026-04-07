import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = 'night_mode_settings';

// Apply night mode globally - survives component unmount
const applyNightMode = (isNightMode: boolean, brightness: number, warmth: number) => {
  const root = document.documentElement;
  if (isNightMode) {
    root.style.filter = `brightness(${brightness / 100}) sepia(${warmth / 100})`;
    root.classList.add('night-mode');
  } else {
    root.style.filter = 'none';
    root.classList.remove('night-mode');
  }
};

// Apply on page load from saved settings
const savedRaw = localStorage.getItem(STORAGE_KEY);
if (savedRaw) {
  try {
    const s = JSON.parse(savedRaw);
    if (s.isNightMode) applyNightMode(true, s.brightness ?? 100, s.warmth ?? 0);
  } catch {}
}

const NightModeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [isNightMode, setIsNightMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const initialized = useRef(false);

  // Load saved settings once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setIsNightMode(s.isNightMode ?? false);
        setBrightness(s.brightness ?? 100);
        setWarmth(s.warmth ?? 0);
        setAutoMode(s.autoMode ?? false);
      } catch {}
    }
    initialized.current = true;
  }, []);

  // Save and apply whenever settings change (after init)
  useEffect(() => {
    if (!initialized.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isNightMode, brightness, warmth, autoMode }));
    applyNightMode(isNightMode, brightness, warmth);
  }, [isNightMode, brightness, warmth, autoMode]);

  // NO cleanup on unmount - settings persist globally

  useEffect(() => {
    if (autoMode) {
      const hour = new Date().getHours();
      const isNight = hour >= 20 || hour < 6;
      setIsNightMode(isNight);
      if (isNight) { setBrightness(80); setWarmth(30); }
    }
  }, [autoMode]);

  const presets = [
    { name: isRTL ? 'قراءة' : '독서', brightness: 85, warmth: 25, icon: '📖' },
    { name: isRTL ? 'دراسة' : '공부', brightness: 90, warmth: 15, icon: '📚' },
    { name: isRTL ? 'ليلي' : '야간', brightness: 70, warmth: 40, icon: '🌙' },
    { name: isRTL ? 'راحة' : '휴식', brightness: 75, warmth: 35, icon: '😌' },
  ];

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isNightMode ? 'bg-indigo-500 text-white' : 'bg-muted'}`}>
            {isNightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <span className="font-bold">{isRTL ? 'وضع الراحة' : '눈 보호 모드'}</span>
            <p className="text-xs text-muted-foreground">
              {isNightMode ? (isRTL ? 'مُفعّل' : '활성화됨') : (isRTL ? 'مُعطّل' : '비활성화')}
            </p>
          </div>
        </div>
        <Switch checked={isNightMode} onCheckedChange={setIsNightMode} />
      </div>

      <AnimatePresence>
        {isNightMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5"
          >
            <div className="space-y-2 p-4 rounded-2xl bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  {isRTL ? 'السطوع' : '밝기'}
                </span>
                <span className="font-bold">{brightness}%</span>
              </div>
              <Slider value={[brightness]} onValueChange={([val]) => setBrightness(val)} min={50} max={100} step={5} />
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {isRTL ? 'الدفء' : '따뜻함'}
                </span>
                <span className="font-bold">{warmth}%</span>
              </div>
              <Slider value={[warmth]} onValueChange={([val]) => setWarmth(val)} min={0} max={50} step={5} />
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground font-medium">{isRTL ? 'إعدادات سريعة' : '빠른 설정'}</span>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <motion.button
                    key={preset.name}
                    className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    onClick={() => { setBrightness(preset.brightness); setWarmth(preset.warmth); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-[10px] mt-1 font-medium">{preset.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-sm font-medium">{isRTL ? 'وضع تلقائي' : '자동 모드'}</span>
                  <p className="text-[10px] text-muted-foreground">
                    {isRTL ? '8 مساءً - 6 صباحاً' : '오후 8시 - 오전 6시'}
                  </p>
                </div>
              </div>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NightModeToggle;
