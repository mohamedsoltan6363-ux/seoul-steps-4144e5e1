import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const AIChatButton: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/ai-chat')}
      className="fixed bottom-20 md:bottom-6 right-4 z-40 group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
      
      {/* Button */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
        {/* Animated Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Icon */}
        <MessageCircle className="w-6 h-6 text-white" />
        
        {/* Sparkle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-card border border-border shadow-lg whitespace-nowrap text-sm font-medium hidden group-hover:block"
      >
        {language === 'ar' ? 'دردش مع AI' : 'AI와 대화'}
      </motion.div>
    </motion.button>
  );
};

export default AIChatButton;
