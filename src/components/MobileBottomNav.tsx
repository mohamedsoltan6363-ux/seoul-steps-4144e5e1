import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Gamepad2, User, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  // Hide on level pages (learn routes) and onboarding
  const hiddenPaths = ['/learn', '/onboarding', '/auth', '/'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '/';

  if (shouldHide) return null;

  const navItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: language === 'ar' ? 'الرئيسية' : '홈',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      path: '/games', 
      icon: Gamepad2, 
      label: language === 'ar' ? 'الألعاب' : '게임',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      path: '/leaderboard', 
      icon: Trophy, 
      label: language === 'ar' ? 'المتصدرين' : '순위',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      path: '/songs', 
      icon: BookOpen, 
      label: language === 'ar' ? 'المسلسلات' : '드라마',
      gradient: 'from-rose-500 to-red-500'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: language === 'ar' ? 'حسابي' : '프로필',
      gradient: 'from-green-500 to-emerald-500'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Background with blur */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/50" />
      
      {/* Navigation Items */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all ${
                active ? 'text-white' : 'text-muted-foreground'
              }`}
            >
              {/* Active Background */}
              {active && (
                <motion.div
                  layoutId="activeNavBg"
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl shadow-lg`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1">
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                <span className={`text-[10px] font-medium ${active ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>

              {/* Active Indicator Dot */}
              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-white shadow-lg"
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
