import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, User, Compass, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide on level pages (learn routes), onboarding, auth, homepage
  const hiddenPaths = ['/learn', '/onboarding', '/auth'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '/';

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    if (shouldHide) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (currentY < 80) {
        setVisible(true);
      } else if (diff > 8) {
        setVisible(false);
      } else if (diff < -8) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  if (shouldHide) return null;

  const navItems = [
    { path: '/dashboard', icon: Home, label: language === 'ar' ? 'الرئيسية' : '홈' },
    { path: '/games', icon: Gamepad2, label: language === 'ar' ? 'الألعاب' : '게임' },
    { path: '/forum', icon: MessageCircle, label: language === 'ar' ? 'المنتدى' : '포럼' },
    { path: '/explore', icon: Compass, label: language === 'ar' ? 'اكتشف' : '탐색' },
    { path: '/profile', icon: User, label: language === 'ar' ? 'حسابي' : '프로필' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none"
        >
          <div className="mx-3 mb-3 pointer-events-auto">
            {/* Glass background with strong blur */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl" />
              <div className="relative flex items-center justify-around px-2 py-2">
                {navItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="relative flex-1 h-14 flex flex-col items-center justify-center gap-0.5 rounded-xl"
                    >
                      {active && (
                        <motion.div
                          layoutId="navActiveBg"
                          className="absolute inset-1 bg-gradient-to-br from-rose-500/15 to-pink-500/15 rounded-xl border border-rose-500/20"
                          transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                        />
                      )}
                      <motion.div
                        className="relative z-10"
                        animate={{ scale: active ? 1.15 : 1, color: active ? 'rgb(244,63,94)' : 'rgb(107,114,128)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      <motion.span
                        className="relative z-10 text-[10px] font-medium"
                        animate={{ opacity: active ? 1 : 0.6, color: active ? 'rgb(244,63,94)' : 'rgb(107,114,128)' }}
                      >
                        {item.label}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomNav;
