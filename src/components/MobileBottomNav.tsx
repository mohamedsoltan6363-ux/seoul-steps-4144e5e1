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
      transition={{ type: 'spring', stiffness: 280, damping: 35 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-t border-slate-200/50" />
      
      {/* Navigation Items Container */}
      <div className="relative flex items-center justify-around px-3 py-2.5 safe-area-pb">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 40,
                delay: index * 0.04,
              }}
              className="relative w-full h-20 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 group"
            >
              {/* Active background */}
              {active && (
                <motion.div
                  layoutId="navActiveBg"
                  className="absolute inset-0 bg-blue-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                />
              )}

              {/* Icon with smooth animation */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: active ? 1.2 : 1,
                  color: active ? 'rgb(37, 99, 235)' : 'rgb(107, 114, 128)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              >
                <item.icon className="w-6 h-6" />
              </motion.div>

              {/* Label */}
              <motion.span 
                className="text-xs font-semibold transition-colors duration-200"
                animate={{
                  color: active ? 'rgb(37, 99, 235)' : 'rgb(107, 114, 128)',
                  opacity: 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
