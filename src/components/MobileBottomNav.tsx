import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, User, Trophy, Sparkles } from 'lucide-react';
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
      color: '#3B82F6',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'hsl(217 91% 60% / 0.3)'
    },
    { 
      path: '/games', 
      icon: Gamepad2, 
      label: language === 'ar' ? 'الألعاب' : '게임',
      color: '#A855F7',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      glowColor: 'hsl(280 85% 56% / 0.3)'
    },
    { 
      path: '/leaderboard', 
      icon: Trophy, 
      label: language === 'ar' ? 'المتصدرين' : '랭킹',
      color: '#F59E0B',
      bgColor: 'from-amber-500/20 to-orange-500/20',
      glowColor: 'hsl(45 93% 47% / 0.3)'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: language === 'ar' ? 'حسابي' : '프로필',
      color: '#10B981',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      glowColor: 'hsl(160 84% 39% / 0.3)'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const containerVariants = {
    hidden: { y: 100 },
    visible: {
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    }),
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl border-t-2 border-border/50" />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Navigation Items Container */}
      <div className="relative flex items-center justify-around px-3 py-3 safe-area-pb gap-1">
        <AnimatePresence mode="wait">
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <motion.div
                key={item.path}
                custom={index}
                variants={itemVariants}
                className="flex-1 flex justify-center"
              >
                <motion.button
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ y: -2 }}
                  className="relative w-full h-16 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 group"
                >
                  {/* Background glow effect when active */}
                  {active && (
                    <>
                      {/* Outer glow */}
                      <motion.div
                        layoutId="navGlow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -inset-1 rounded-2xl"
                        style={{ boxShadow: `0 0 20px ${item.glowColor}` }}
                      />
                      
                      {/* Background gradient */}
                      <motion.div
                        layoutId="navBg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-2xl`}
                      />
                    </>
                  )}

                  {/* Content */}
                  <motion.div
                    className="relative z-10 flex flex-col items-center gap-1"
                    animate={{
                      scale: active ? 1.1 : 1,
                      color: active ? item.color : 'currentColor',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  >
                    {/* Icon with animated sparkle effect when active */}
                    <div className="relative">
                      <motion.div
                        animate={{
                          filter: active ? 'drop-shadow(0 0 8px ' + item.glowColor + ')' : 'drop-shadow(0 0 0px transparent)',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon 
                          className={`w-6 h-6 ${active ? '' : 'text-muted-foreground'}`}
                          style={{
                            color: active ? item.color : 'inherit',
                          }}
                        />
                      </motion.div>

                      {/* Floating sparkle for extra flair when active */}
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Sparkles 
                            className="w-3 h-3"
                            style={{ color: item.color }}
                            fill={item.color}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Label with animation */}
                    <motion.span 
                      className={`text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 ${
                        active ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                      style={{
                        color: active ? item.color : 'inherit',
                      }}
                      animate={{
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>

                  {/* Ripple effect on click */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-2xl border-2 border-current"
                      style={{ borderColor: item.color }}
                    />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"
      />
    </motion.nav>
  );
};

export default MobileBottomNav;
