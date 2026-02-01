import React from 'react';
import { motion } from 'framer-motion';

// Tank transition - crushes the current slide
export const TankTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Tank SVG */}
      <motion.div
        className="absolute"
        initial={{ x: '-100vw', y: 0 }}
        animate={{ x: '150vw', y: 0 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '30%' }}
      >
        <svg width="300" height="150" viewBox="0 0 300 150" fill="none">
          {/* Tank Body */}
          <rect x="50" y="60" width="180" height="60" rx="10" fill="#4A5568" />
          <rect x="60" y="70" width="160" height="40" rx="5" fill="#2D3748" />
          
          {/* Tank Turret */}
          <rect x="100" y="30" width="80" height="40" rx="5" fill="#4A5568" />
          <rect x="170" y="40" width="80" height="15" rx="3" fill="#718096" />
          
          {/* Tank Tracks */}
          <ellipse cx="80" cy="120" rx="35" ry="25" fill="#1A202C" />
          <ellipse cx="200" cy="120" rx="35" ry="25" fill="#1A202C" />
          
          {/* Track Details */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '80px 120px' }}
          >
            <circle cx="80" cy="120" r="15" fill="#2D3748" stroke="#4A5568" strokeWidth="3" />
          </motion.g>
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '200px 120px' }}
          >
            <circle cx="200" cy="120" r="15" fill="#2D3748" stroke="#4A5568" strokeWidth="3" />
          </motion.g>
          
          {/* Flag on tank */}
          <rect x="90" y="5" width="3" height="30" fill="#8B4513" />
          <motion.path
            d="M93 5 L120 15 L93 25 Z"
            fill="#E53E3E"
            animate={{ scaleX: [1, 0.9, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          
          {/* Smoke */}
          <motion.circle
            cx="240"
            cy="45"
            r="8"
            fill="#A0AEC0"
            opacity="0.6"
            animate={{ y: [-5, -20], opacity: [0.6, 0], scale: [1, 2] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </svg>
      </motion.div>
      
      {/* Dust cloud effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2.5 }}
      />
    </motion.div>
  );
};

// Buffalo/Cow transition - runs and kicks
export const BuffaloTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute"
        initial={{ x: '-100vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '25%' }}
      >
        <svg width="250" height="150" viewBox="0 0 250 150">
          {/* Buffalo Body */}
          <motion.g
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <ellipse cx="125" cy="80" rx="70" ry="45" fill="#4A3728" />
            
            {/* Head */}
            <circle cx="185" cy="60" r="30" fill="#5D4037" />
            
            {/* Horns */}
            <path d="M175 35 Q160 20 150 35" stroke="#2D1F15" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M195 35 Q210 20 220 35" stroke="#2D1F15" strokeWidth="8" fill="none" strokeLinecap="round" />
            
            {/* Eye */}
            <circle cx="195" cy="55" r="5" fill="white" />
            <circle cx="197" cy="55" r="2" fill="#1A1A1A" />
            
            {/* Nose */}
            <ellipse cx="210" cy="70" rx="10" ry="7" fill="#3D2817" />
            <circle cx="205" cy="70" r="2" fill="#1A1A1A" />
            <circle cx="215" cy="70" r="2" fill="#1A1A1A" />
            
            {/* Tail */}
            <motion.path
              d="M55 70 Q30 60 25 80"
              stroke="#3D2817"
              strokeWidth="6"
              fill="none"
              animate={{ rotate: [0, 20, 0, -20, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: '55px 70px' }}
            />
            <circle cx="25" cy="80" r="8" fill="#3D2817" />
          </motion.g>
          
          {/* Front Legs - Running animation */}
          <motion.g
            animate={{ rotate: [30, -30, 30] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ transformOrigin: '160px 120px' }}
          >
            <rect x="155" y="110" width="12" height="45" rx="5" fill="#3D2817" />
          </motion.g>
          <motion.g
            animate={{ rotate: [-30, 30, -30] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ transformOrigin: '180px 120px' }}
          >
            <rect x="175" y="110" width="12" height="45" rx="5" fill="#4A3728" />
          </motion.g>
          
          {/* Back Legs - Kicking animation */}
          <motion.g
            animate={{ rotate: [-20, 40, -20] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ transformOrigin: '90px 120px' }}
          >
            <rect x="85" y="110" width="12" height="45" rx="5" fill="#3D2817" />
          </motion.g>
          <motion.g
            animate={{ rotate: [40, -20, 40] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ transformOrigin: '110px 120px' }}
          >
            <rect x="105" y="110" width="12" height="45" rx="5" fill="#4A3728" />
          </motion.g>
        </svg>
        
        {/* Dust particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-amber-600/40"
            style={{ left: -20 - i * 15, bottom: 10 + i * 5 }}
            animate={{ opacity: [0.8, 0], scale: [0.5, 1.5], y: [0, -20] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Bird flock transition
export const BirdFlockTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: '-10vw', y: `${20 + Math.random() * 40}%` }}
          animate={{ x: '110vw', y: `${20 + Math.random() * 40}%` }}
          transition={{ 
            duration: 2 + Math.random() * 0.5, 
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
          onAnimationComplete={i === 11 ? onComplete : undefined}
        >
          <motion.svg 
            width="40" 
            height="30" 
            viewBox="0 0 40 30"
            animate={{ y: [0, -5, 0, 5, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <motion.path
              d="M20 15 L5 5 M20 15 L35 5"
              stroke="#1A202C"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ d: ['M20 15 L5 5 M20 15 L35 5', 'M20 15 L5 20 M20 15 L35 20', 'M20 15 L5 5 M20 15 L35 5'] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Rocket transition
export const RocketTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        initial={{ y: '100vh', rotate: 0 }}
        animate={{ y: '-100vh', rotate: 0 }}
        transition={{ duration: 1.8, ease: 'easeIn' }}
        onAnimationComplete={onComplete}
      >
        <svg width="80" height="150" viewBox="0 0 80 150">
          {/* Rocket Body */}
          <path d="M40 0 L60 50 L60 100 L20 100 L20 50 Z" fill="#E53E3E" />
          <ellipse cx="40" cy="50" rx="20" ry="50" fill="#F56565" />
          
          {/* Window */}
          <circle cx="40" cy="45" r="12" fill="#63B3ED" stroke="#2D3748" strokeWidth="3" />
          <circle cx="36" cy="42" r="4" fill="white" opacity="0.5" />
          
          {/* Fins */}
          <path d="M20 80 L5 110 L20 100 Z" fill="#C53030" />
          <path d="M60 80 L75 110 L60 100 Z" fill="#C53030" />
          
          {/* Fire */}
          <motion.g
            animate={{ scaleY: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          >
            <path d="M30 100 L40 150 L50 100 Z" fill="#F6AD55" />
            <path d="M35 100 L40 130 L45 100 Z" fill="#FBD38D" />
          </motion.g>
        </svg>
        
        {/* Trail */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full bg-orange-400/50"
            style={{ left: 20, top: 150 + i * 30 }}
            animate={{ opacity: [0.5, 0], scale: [1, 2] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Korean Dragon transition
export const DragonTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute"
        initial={{ x: '-20vw', y: '30%' }}
        animate={{ 
          x: '120vw',
          y: ['30%', '20%', '40%', '25%', '35%', '30%']
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        onAnimationComplete={onComplete}
      >
        {/* Dragon body segments */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: -i * 40 }}
            animate={{ y: [0, -15, 0, 15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          >
            <div 
              className={`w-12 h-12 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-emerald-600'}`}
              style={{ 
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                transform: `scale(${1 - i * 0.08})`
              }}
            />
          </motion.div>
        ))}
        
        {/* Dragon head */}
        <motion.svg 
          width="100" 
          height="80" 
          viewBox="0 0 100 80"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <ellipse cx="50" cy="40" rx="40" ry="30" fill="#10B981" />
          <circle cx="70" cy="30" r="8" fill="white" />
          <circle cx="73" cy="30" r="4" fill="#1A1A1A" />
          <path d="M85 50 L100 45 L95 55 Z" fill="#10B981" />
          
          {/* Horns */}
          <path d="M30 15 Q25 0 35 10" stroke="#059669" strokeWidth="5" fill="none" />
          <path d="M50 10 Q50 -5 55 5" stroke="#059669" strokeWidth="5" fill="none" />
          
          {/* Fire breath */}
          <motion.g
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <path d="M90 40 L130 35 L125 45 L140 40 L120 50 L90 45 Z" fill="#F59E0B" />
          </motion.g>
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

// Butterfly swarm transition
export const ButterflyTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
  
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
    >
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: '-10vw', 
            y: `${Math.random() * 80 + 10}%`,
            rotate: Math.random() * 30 - 15
          }}
          animate={{ 
            x: '110vw',
            y: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 1,
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
          onAnimationComplete={i === 14 ? onComplete : undefined}
        >
          <motion.svg 
            width="40" 
            height="30" 
            viewBox="0 0 40 30"
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <ellipse cx="20" cy="15" rx="3" ry="10" fill={colors[i % colors.length]} />
            <ellipse cx="10" cy="10" rx="10" ry="8" fill={colors[i % colors.length]} opacity="0.8" />
            <ellipse cx="30" cy="10" rx="10" ry="8" fill={colors[i % colors.length]} opacity="0.8" />
            <ellipse cx="8" cy="20" rx="7" ry="5" fill={colors[i % colors.length]} opacity="0.6" />
            <ellipse cx="32" cy="20" rx="7" ry="5" fill={colors[i % colors.length]} opacity="0.6" />
          </motion.svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Train transition
export const TrainTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute flex items-end"
        initial={{ x: '-50vw' }}
        animate={{ x: '120vw' }}
        transition={{ duration: 2.5, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '30%' }}
      >
        {/* Engine */}
        <svg width="180" height="120" viewBox="0 0 180 120">
          {/* Main body */}
          <rect x="30" y="30" width="130" height="60" rx="5" fill="#E53E3E" />
          <rect x="140" y="20" width="30" height="70" rx="3" fill="#C53030" />
          
          {/* Chimney */}
          <rect x="50" y="5" width="25" height="30" fill="#2D3748" />
          <motion.ellipse
            cx="62"
            cy="5"
            rx="15"
            ry="8"
            fill="#A0AEC0"
            animate={{ y: [-5, -25], opacity: [0.8, 0], scale: [1, 2] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          
          {/* Windows */}
          <rect x="145" y="30" width="20" height="25" rx="2" fill="#63B3ED" />
          
          {/* Wheels */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '60px 100px' }}
          >
            <circle cx="60" cy="100" r="18" fill="#1A202C" stroke="#4A5568" strokeWidth="3" />
            <line x1="60" y1="82" x2="60" y2="118" stroke="#4A5568" strokeWidth="2" />
            <line x1="42" y1="100" x2="78" y2="100" stroke="#4A5568" strokeWidth="2" />
          </motion.g>
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '120px 100px' }}
          >
            <circle cx="120" cy="100" r="18" fill="#1A202C" stroke="#4A5568" strokeWidth="3" />
            <line x1="120" y1="82" x2="120" y2="118" stroke="#4A5568" strokeWidth="2" />
            <line x1="102" y1="100" x2="138" y2="100" stroke="#4A5568" strokeWidth="2" />
          </motion.g>
        </svg>
        
        {/* Wagons */}
        {[...Array(3)].map((_, i) => (
          <svg key={i} width="120" height="100" viewBox="0 0 120 100">
            <rect x="10" y="30" width="100" height="50" rx="3" fill={['#4299E1', '#48BB78', '#ECC94B'][i]} />
            <rect x="20" y="40" width="25" height="25" rx="2" fill="white" opacity="0.3" />
            <rect x="55" y="40" width="25" height="25" rx="2" fill="white" opacity="0.3" />
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '35px 90px' }}
            >
              <circle cx="35" cy="90" r="12" fill="#1A202C" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '85px 90px' }}
            >
              <circle cx="85" cy="90" r="12" fill="#1A202C" />
            </motion.g>
          </svg>
        ))}
      </motion.div>
      
      {/* Track */}
      <div className="absolute w-full h-4 bg-gradient-to-r from-transparent via-gray-600 to-transparent" style={{ bottom: '28%' }} />
    </motion.div>
  );
};

// Airplane transition
export const AirplaneTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute"
        initial={{ x: '-20vw', y: '60%' }}
        animate={{ x: '120vw', y: '20%' }}
        transition={{ duration: 2, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
      >
        <motion.svg 
          width="200" 
          height="80" 
          viewBox="0 0 200 80"
          animate={{ rotate: [-5, 0, -5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {/* Body */}
          <ellipse cx="100" cy="40" rx="80" ry="20" fill="#E2E8F0" />
          <ellipse cx="100" cy="40" rx="75" ry="17" fill="#CBD5E0" />
          
          {/* Nose */}
          <ellipse cx="175" cy="40" rx="15" ry="12" fill="#A0AEC0" />
          
          {/* Windows */}
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx={50 + i * 20} cy="38" r="5" fill="#63B3ED" />
          ))}
          
          {/* Wings */}
          <path d="M80 40 L40 70 L60 70 L100 40 Z" fill="#A0AEC0" />
          <path d="M80 40 L40 10 L60 10 L100 40 Z" fill="#A0AEC0" />
          
          {/* Tail */}
          <path d="M20 40 L5 15 L25 25 L25 40 Z" fill="#E53E3E" />
          <path d="M20 40 L5 55 L25 50 L25 40 Z" fill="#E53E3E" />
          
          {/* Engine trails */}
          <motion.ellipse
            cx="-10"
            cy="40"
            rx="30"
            ry="5"
            fill="white"
            opacity="0.5"
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.svg>
        
        {/* Clouds passed */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-10 bg-white rounded-full opacity-30"
            style={{ left: -100 - i * 80, top: 20 + i * 15 }}
            animate={{ opacity: [0.3, 0.1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export const transitions = [
  TankTransition,
  BuffaloTransition,
  BirdFlockTransition,
  RocketTransition,
  DragonTransition,
  ButterflyTransition,
  TrainTransition,
  AirplaneTransition
];
