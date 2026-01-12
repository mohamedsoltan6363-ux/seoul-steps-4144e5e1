import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface NightModeToggleProps {
  className?: string;
}

const NightModeToggle: React.FC<NightModeToggleProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [isNightMode, setIsNightMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    // Apply filters to the page
    const root = document.documentElement;
    
    if (isNightMode) {
      root.style.filter = `brightness(${brightness / 100}) sepia(${warmth / 100})`;
      root.classList.add('night-mode');
    } else {
      root.style.filter = 'none';
      root.classList.remove('night-mode');
    }

    return () => {
      root.style.filter = 'none';
      root.classList.remove('night-mode');
    };
  }, [isNightMode, brightness, warmth]);

  useEffect(() => {
    if (autoMode) {
      const hour = new Date().getHours();
      const isNight = hour >= 20 || hour < 6;
      setIsNightMode(isNight);
      if (isNight) {
        setBrightness(80);
        setWarmth(30);
      }
    }
  }, [autoMode]);

  const presets = [
    { name: isRTL ? 'قراءة' : '독서', brightness: 85, warmth: 25, icon: '📖' },
    { name: isRTL ? 'دراسة' : '공부', brightness: 90, warmth: 15, icon: '📚' },
    { name: isRTL ? 'ليلي' : '야간', brightness: 70, warmth: 40, icon: '🌙' },
    { name: isRTL ? 'راحة' : '휴식', brightness: 75, warmth: 35, icon: '😌' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          className={`relative p-3 rounded-2xl transition-all ${
            isNightMode
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-muted hover:bg-muted/80'
          } ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isNightMode ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <Moon className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Sun className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {isNightMode && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span className="font-bold">{isRTL ? 'وضع الراحة' : '눈 보호 모드'}</span>
            </div>
            <Switch
              checked={isNightMode}
              onCheckedChange={setIsNightMode}
            />
          </div>

          <AnimatePresence>
            {isNightMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Brightness Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isRTL ? 'السطوع' : '밝기'}
                    </span>
                    <span className="font-medium">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    onValueChange={([val]) => setBrightness(val)}
                    min={50}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Warmth Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isRTL ? 'الدفء' : '따뜻함'}
                    </span>
                    <span className="font-medium">{warmth}%</span>
                  </div>
                  <Slider
                    value={[warmth]}
                    onValueChange={([val]) => setWarmth(val)}
                    min={0}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'إعدادات سريعة' : '빠른 설정'}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((preset) => (
                      <motion.button
                        key={preset.name}
                        className="flex flex-col items-center p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        onClick={() => {
                          setBrightness(preset.brightness);
                          setWarmth(preset.warmth);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-lg">{preset.icon}</span>
                        <span className="text-[10px] mt-1">{preset.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Auto Mode */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">
                      {isRTL ? 'وضع تلقائي' : '자동 모드'}
                    </span>
                  </div>
                  <Switch
                    checked={autoMode}
                    onCheckedChange={setAutoMode}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {isRTL 
                    ? 'يُفعّل تلقائياً من 8 مساءً إلى 6 صباحاً'
                    : '오후 8시부터 오전 6시까지 자동 활성화'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NightModeToggle;
