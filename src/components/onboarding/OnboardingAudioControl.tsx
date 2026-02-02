import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface OnboardingAudioControlProps {
  isMuted: boolean;
  onToggle: () => void;
  isRTL: boolean;
}

const OnboardingAudioControl: React.FC<OnboardingAudioControlProps> = ({ 
  isMuted, 
  onToggle,
  isRTL 
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed top-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all ${
        isRTL ? 'left-6' : 'right-20'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ 
          rotate: isMuted ? 0 : [0, -10, 10, -10, 10, 0],
        }}
        transition={{ duration: 0.5 }}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-gray-500" />
        ) : (
          <Volume2 className="w-5 h-5 text-rose-500" />
        )}
      </motion.div>
      <span className={`text-sm font-medium ${isMuted ? 'text-gray-500' : 'text-gray-700'}`}>
        {isMuted 
          ? (isRTL ? 'الصوت مكتوم' : '음소거') 
          : (isRTL ? 'الصوت مفعّل' : '소리 켜짐')}
      </span>
      
      {/* Sound waves animation when not muted */}
      {!isMuted && (
        <div className="flex items-center gap-0.5 ml-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-rose-400 rounded-full"
              animate={{ 
                height: [4, 12, 4],
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default OnboardingAudioControl;
