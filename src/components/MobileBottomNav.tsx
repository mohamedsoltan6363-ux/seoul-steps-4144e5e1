import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gamepad2, User, Trophy, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  // Hide on level pages (learn routes) and onboarding
  const hiddenPaths = ['/learn', '/onboarding', '/auth'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '/';

  if (shouldHide) return null;

  const navItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: language === 'ar' ? 'الرئيسية' : '홈',
    },
    { 
      path: '/games', 
      icon: Gamepad2, 
      label: language === 'ar' ? 'الألعاب' : '게임',
    },
    { 
      path: '/leaderboard', 
      icon: Trophy, 
      label: language === 'ar' ? 'المتصدرين' : '순위',
    },
    { 
      path: '/explore', 
      icon: Compass, 
      label: language === 'ar' ? 'اكتشف' : '탐색',
    },
    { 
      path: '/profile', 
      icon: User, 
      label: language === 'ar' ? 'حسابي' : '프로필',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Clean Background */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/40" />
      
      {/* Navigation Items Container */}
      <div className="relative flex items-end justify-around px-2 py-3 safe-area-pb">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
                delay: index * 0.05,
              }}
              className="flex flex-col items-center gap-1.5 py-2 px-2 relative group transition-all duration-200"
            >
              {/* Smooth background on active */}
              {active && (
                <motion.div
                  layoutId="activeNavBg"
                  className="absolute inset-0 bg-primary/8 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                />
              )}

              {/* Icon */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: active ? 1.15 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              >
                <item.icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    active 
                      ? 'text-primary' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
              </motion.div>

              {/* Label - only show if active */}
              {active && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  className="text-xs font-medium text-primary whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}

              {/* Indicator dot */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
