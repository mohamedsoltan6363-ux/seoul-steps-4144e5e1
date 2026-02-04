import React from 'react';
import { motion } from 'framer-motion';
import characterImage from '@/assets/onboarding-character.png';

// Character being hit component - INSTANT impact timing
const HitCharacter: React.FC<{ impactTime: number; direction: 'left' | 'right' | 'up' | 'explode' }> = ({ impactTime, direction }) => {
  // Animation starts exactly at impact time
  const getAnimation = () => {
    switch (direction) {
      case 'explode':
        return {
          opacity: [1, 1, 0],
          scale: [1, 1.5, 0],
          rotate: [0, 45, 180]
        };
      case 'up':
        return {
          opacity: [1, 1, 0],
          y: [0, -100, -400],
          rotate: [0, 180, 360]
        };
      default:
        return {
          opacity: [1, 1, 0],
          x: direction === 'right' ? [0, 150, 400] : [0, -150, -400],
          y: [0, -120, -80],
          rotate: direction === 'right' ? [0, 180, 360] : [0, -180, -360]
        };
    }
  };

  return (
    <motion.div
      className="absolute z-10"
      style={{ 
        bottom: '25%', 
        left: '50%',
        transform: 'translateX(-50%)'
      }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={getAnimation()}
      transition={{ 
        duration: 1.2, 
        delay: impactTime,
        ease: 'easeOut'
      }}
    >
      <img 
        src={characterImage} 
        alt="Character" 
        className="w-36 h-36 object-contain drop-shadow-2xl"
      />
      {/* Impact stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          style={{ 
            left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
            top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 2, 0]
          }}
          transition={{ duration: 0.4, delay: impactTime + i * 0.05 }}
        >
          💥
        </motion.div>
      ))}
    </motion.div>
  );
};

// Explosion effect component
const ExplosionEffect: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <>
      {/* Central explosion */}
      <motion.div
        className="absolute z-30"
        style={{ 
          left: '50%', 
          bottom: '30%',
          transform: 'translate(-50%, 50%)'
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0, 2, 3, 4]
        }}
        transition={{ duration: 0.8, delay }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 blur-md" />
      </motion.div>
      
      {/* Fire particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: '50%',
            bottom: '30%',
            width: 20 + Math.random() * 30,
            height: 20 + Math.random() * 30,
            background: ['#FF6B35', '#F7931E', '#FFD700', '#FF4500'][i % 4]
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: (Math.random() - 0.5) * 300,
            y: -Math.random() * 200 - 50,
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 0.6, delay: delay + i * 0.03 }}
        />
      ))}

      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 bg-white z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.2, delay }}
      />
      
      {/* Shockwave */}
      <motion.div
        className="absolute z-30 rounded-full border-8 border-orange-400"
        style={{ 
          left: '50%', 
          bottom: '30%',
          transform: 'translate(-50%, 50%)'
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ 
          width: [0, 500],
          height: [0, 500],
          opacity: [1, 0]
        }}
        transition={{ duration: 0.5, delay }}
      />
    </>
  );
};

// Impact effect component
const ImpactEffect: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <>
      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 bg-white z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.25, delay }}
      />
      {/* Shockwave */}
      <motion.div
        className="absolute z-30 rounded-full border-4 border-amber-400"
        style={{ 
          left: '50%', 
          bottom: '30%',
          transform: 'translate(-50%, 50%)'
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ 
          width: [0, 350],
          height: [0, 350],
          opacity: [1, 0]
        }}
        transition={{ duration: 0.5, delay }}
      />
      
      {/* Screen shake */}
      <motion.div
        className="absolute inset-0"
        animate={{ 
          x: [0, -8, 8, -6, 6, -4, 4, 0],
          y: [0, 4, -4, 3, -3, 2, -2, 0]
        }}
        transition={{ duration: 0.4, delay }}
      />
    </>
  );
};

// Calculate impact time based on animation - when object reaches center (50vw)
const calculateImpactTime = (totalDuration: number, startPosition: number = -60, endPosition: number = 150) => {
  // Object travels from startPosition to endPosition
  // We need to find when it reaches 50 (center where character is)
  const totalDistance = endPosition - startPosition; // e.g., 210
  const distanceToCenter = 50 - startPosition; // e.g., 110
  const percentToCenter = distanceToCenter / totalDistance; // e.g., 0.52
  return totalDuration * percentToCenter;
};

// Realistic Tank transition - larger, slower, hits character AT IMPACT
export const TankTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 7;
  const impactTime = calculateImpactTime(totalDuration, -60, 150);
  
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-amber-50/50 to-amber-100/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit - triggered at impact */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect - triggered at impact */}
      <ImpactEffect delay={impactTime} />

      {/* Realistic Tank SVG - Much larger and detailed */}
      <motion.div
        className="absolute z-20"
        initial={{ x: '-60vw', y: 0 }}
        animate={{ x: '150vw', y: 0 }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '18%' }}
      >
        <svg width="550" height="320" viewBox="0 0 550 320" fill="none">
          {/* Track base */}
          <path d="M50 260 Q25 260 25 235 L25 210 Q25 185 50 185 L450 185 Q475 185 475 210 L475 235 Q475 260 450 260 Z" fill="#2D2D2D" />
          
          {/* Track wheels - detailed */}
          {[70, 140, 210, 280, 350, 420].map((x, i) => (
            <g key={i}>
              <motion.circle 
                cx={x} 
                cy="222" 
                r="32" 
                fill="#1A1A1A" 
                stroke="#3D3D3D" 
                strokeWidth="5"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${x}px 222px` }}
              />
              <circle cx={x} cy="222" r="14" fill="#4A4A4A" />
              {/* Wheel spokes */}
              {[0, 45, 90, 135].map((angle, j) => (
                <motion.line 
                  key={j}
                  x1={x} 
                  y1="222" 
                  x2={x + Math.cos(angle * Math.PI / 180) * 24} 
                  y2={222 + Math.sin(angle * Math.PI / 180) * 24}
                  stroke="#5A5A5A" 
                  strokeWidth="4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `${x}px 222px` }}
                />
              ))}
            </g>
          ))}
          
          {/* Track belt */}
          <path d="M40 185 L460 185" stroke="#3D3D3D" strokeWidth="10" strokeDasharray="18 12" />
          <path d="M40 260 L460 260" stroke="#3D3D3D" strokeWidth="10" strokeDasharray="18 12" />
          
          {/* Hull - main body */}
          <path d="M60 185 L90 110 L430 110 L460 185 Z" fill="#4A5C4A" />
          <path d="M75 178 L100 118 L420 118 L445 178 Z" fill="#5A6C5A" />
          
          {/* Hull details - armor plates */}
          <rect x="120" y="125" width="70" height="48" fill="#4A5C4A" stroke="#3D4D3D" strokeWidth="3" />
          <rect x="210" y="125" width="120" height="48" fill="#4A5C4A" stroke="#3D4D3D" strokeWidth="3" />
          
          {/* Turret base */}
          <ellipse cx="260" cy="110" rx="95" ry="30" fill="#5A6C5A" />
          
          {/* Turret */}
          <path d="M175 110 L190 50 L330 50 L345 110 Z" fill="#4A5C4A" />
          <rect x="200" y="58" width="130" height="48" rx="6" fill="#5A6C5A" />
          
          {/* Main cannon - long barrel */}
          <rect x="340" y="72" width="180" height="24" fill="#3D4D3D" />
          <rect x="340" y="76" width="180" height="16" fill="#4A5C4A" />
          {/* Cannon muzzle brake */}
          <rect x="510" y="66" width="25" height="36" fill="#3D4D3D" />
          <rect x="516" y="70" width="18" height="10" fill="#2D2D2D" />
          <rect x="516" y="88" width="18" height="10" fill="#2D2D2D" />
          
          {/* Commander's hatch */}
          <ellipse cx="225" cy="58" rx="24" ry="12" fill="#3D4D3D" />
          
          {/* Antenna */}
          <line x1="195" y1="50" x2="195" y2="15" stroke="#2D2D2D" strokeWidth="3" />
          <motion.circle
            cx="195"
            cy="10"
            r="6"
            fill="#E53E3E"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          
          {/* Exhaust smoke */}
          <motion.g>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.ellipse
                key={i}
                cx={40 - i * 35}
                cy={140}
                rx="25"
                ry="18"
                fill="#6B7280"
                opacity={0.6 - i * 0.12}
                animate={{ 
                  x: [-15, -60],
                  y: [-8, -40],
                  scale: [1, 2.5],
                  opacity: [0.6 - i * 0.12, 0]
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity,
                  delay: i * 0.25
                }}
              />
            ))}
          </motion.g>
          
          {/* Ground dust */}
          {[...Array(10)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx={25 - i * 30}
              cy={275}
              rx="30"
              ry="12"
              fill="#D4A574"
              opacity={0.5}
              animate={{ 
                x: [-25, -100],
                scale: [0.5, 2.5],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                delay: i * 0.12
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Realistic Cow transition - bigger, realistic, slower
export const BuffaloTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 6.5;
  const impactTime = calculateImpactTime(totalDuration, -55, 150);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-green-50/50 to-amber-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-55vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '15%' }}
      >
        <motion.svg 
          width="500" 
          height="350" 
          viewBox="0 0 500 350"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        >
          {/* Shadow */}
          <ellipse cx="250" cy="330" rx="170" ry="22" fill="rgba(0,0,0,0.2)" />
          
          {/* Back legs */}
          <motion.g
            animate={{ rotate: [-20, 30, -20] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '130px 230px' }}
          >
            <path d="M110 230 Q95 280 88 320 Q86 338 108 338 L128 338 Q145 338 138 320 Q130 280 140 230" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="115" cy="335" rx="18" ry="10" fill="#2D2D2D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [30, -20, 30] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '180px 230px' }}
          >
            <path d="M165 230 Q150 280 143 320 Q141 338 163 338 L183 338 Q200 338 193 320 Q185 280 195 230" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="170" cy="335" rx="18" ry="10" fill="#2D2D2D" />
          </motion.g>
          
          {/* Front legs */}
          <motion.g
            animate={{ rotate: [25, -25, 25] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '330px 230px' }}
          >
            <path d="M315 230 Q300 280 293 320 Q291 338 313 338 L333 338 Q350 338 343 320 Q335 280 345 230" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="320" cy="335" rx="18" ry="10" fill="#2D2D2D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [-25, 25, -25] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '380px 230px' }}
          >
            <path d="M365 230 Q350 280 343 320 Q341 338 363 338 L383 338 Q400 338 393 320 Q385 280 395 230" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="370" cy="335" rx="18" ry="10" fill="#2D2D2D" />
          </motion.g>
          
          {/* Body - realistic cow shape */}
          <ellipse cx="250" cy="180" rx="145" ry="80" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
          
          {/* Black spots on body - realistic cow pattern */}
          <ellipse cx="200" cy="150" rx="40" ry="30" fill="#2D2D2D" />
          <ellipse cx="280" cy="190" rx="35" ry="25" fill="#2D2D2D" />
          <ellipse cx="160" cy="200" rx="30" ry="22" fill="#2D2D2D" />
          <ellipse cx="320" cy="160" rx="28" ry="20" fill="#2D2D2D" />
          
          {/* Udder */}
          <ellipse cx="220" cy="260" rx="35" ry="20" fill="#FFB6C1" />
          <circle cx="208" cy="272" r="6" fill="#FF69B4" />
          <circle cx="220" cy="275" r="6" fill="#FF69B4" />
          <circle cx="232" cy="272" r="6" fill="#FF69B4" />
          
          {/* Head */}
          <ellipse cx="400" cy="150" rx="55" ry="50" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
          <ellipse cx="400" cy="150" rx="30" ry="25" fill="#2D2D2D" />
          
          {/* Snout - pink */}
          <ellipse cx="450" cy="165" rx="28" ry="22" fill="#FFB6C1" stroke="#4A4A4A" strokeWidth="2" />
          <ellipse cx="442" cy="168" rx="8" ry="6" fill="#4A4A4A" />
          <ellipse cx="458" cy="168" rx="8" ry="6" fill="#4A4A4A" />
          
          {/* Steam from nose - charging */}
          <motion.g
            animate={{ opacity: [0.8, 0.2, 0.8], x: [0, 25, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <ellipse cx="475" cy="158" rx="12" ry="6" fill="white" opacity="0.6" />
            <ellipse cx="488" cy="152" rx="10" ry="5" fill="white" opacity="0.4" />
          </motion.g>
          
          {/* Horns - small cow horns */}
          <path d="M375 105 Q365 85 370 75" stroke="#D4A574" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M425 105 Q435 85 430 75" stroke="#D4A574" strokeWidth="12" fill="none" strokeLinecap="round" />
          
          {/* Ears */}
          <ellipse cx="360" cy="115" rx="20" ry="12" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
          <ellipse cx="362" cy="115" rx="12" ry="7" fill="#FFB6C1" />
          <ellipse cx="440" cy="115" rx="20" ry="12" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
          <ellipse cx="438" cy="115" rx="12" ry="7" fill="#FFB6C1" />
          
          {/* Eyes - determined look */}
          <ellipse cx="390" cy="130" rx="14" ry="12" fill="white" stroke="#4A4A4A" strokeWidth="2" />
          <circle cx="393" cy="132" r="7" fill="#1A1A1A" />
          <circle cx="396" cy="129" r="2" fill="white" />
          <ellipse cx="420" cy="130" rx="14" ry="12" fill="white" stroke="#4A4A4A" strokeWidth="2" />
          <circle cx="423" cy="132" r="7" fill="#1A1A1A" />
          <circle cx="426" cy="129" r="2" fill="white" />
          
          {/* Angry eyebrows */}
          <path d="M375 118 L402 125" stroke="#4A4A4A" strokeWidth="5" strokeLinecap="round" />
          <path d="M432 125 L445 118" stroke="#4A4A4A" strokeWidth="5" strokeLinecap="round" />
          
          {/* Bell on neck */}
          <ellipse cx="380" cy="200" rx="15" ry="18" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          <circle cx="380" cy="210" r="5" fill="#DAA520" />
          
          {/* Tail - animated */}
          <motion.path
            d="M105 160 Q60 145 45 180 Q30 210 55 230"
            stroke="#F5F5DC"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            animate={{ rotate: [0, 35, 0, -35, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: '105px 160px' }}
          />
          <motion.ellipse
            cx="55"
            cy="235"
            rx="18"
            ry="12"
            fill="#2D2D2D"
            animate={{ rotate: [0, 35, 0, -35, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: '105px 160px' }}
          />
        </motion.svg>
        
        {/* Ground dust clouds */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-600/40"
            style={{ 
              left: -40 - i * 45, 
              bottom: -15,
              width: 50 + Math.random() * 35,
              height: 35 + Math.random() * 25
            }}
            animate={{ 
              opacity: [0.6, 0], 
              scale: [0.8, 3], 
              y: [0, -50 - Math.random() * 40],
              x: [-25, -80]
            }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Elephant transition - majestic and powerful
export const ElephantTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 7;
  const impactTime = calculateImpactTime(totalDuration, -60, 150);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-gray-100/50 to-amber-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-60vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '8%' }}
      >
        <motion.svg 
          width="550" 
          height="420" 
          viewBox="0 0 550 420"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.55, repeat: Infinity }}
        >
          {/* Shadow */}
          <ellipse cx="300" cy="400" rx="200" ry="18" fill="rgba(0,0,0,0.15)" />
          
          {/* Back legs */}
          <motion.g
            animate={{ rotate: [-10, 15, -10] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '160px 280px' }}
          >
            <path d="M140 280 Q120 340 115 380 Q112 400 140 400 L170 400 Q195 400 188 380 Q180 340 190 280" fill="#8D8D8D" />
            <ellipse cx="155" cy="400" rx="30" ry="12" fill="#6D6D6D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [15, -10, 15] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '220px 280px' }}
          >
            <path d="M200 280 Q180 340 175 380 Q172 400 200 400 L230 400 Q255 400 248 380 Q240 340 250 280" fill="#7D7D7D" />
            <ellipse cx="215" cy="400" rx="30" ry="12" fill="#6D6D6D" />
          </motion.g>
          
          {/* Front legs */}
          <motion.g
            animate={{ rotate: [12, -12, 12] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '380px 280px' }}
          >
            <path d="M360 280 Q340 340 335 380 Q332 400 360 400 L390 400 Q415 400 408 380 Q400 340 410 280" fill="#8D8D8D" />
            <ellipse cx="375" cy="400" rx="30" ry="12" fill="#6D6D6D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '440px 280px' }}
          >
            <path d="M420 280 Q400 340 395 380 Q392 400 420 400 L450 400 Q475 400 468 380 Q460 340 470 280" fill="#7D7D7D" />
            <ellipse cx="435" cy="400" rx="30" ry="12" fill="#6D6D6D" />
          </motion.g>
          
          {/* Body */}
          <ellipse cx="300" cy="210" rx="180" ry="110" fill="#9E9E9E" />
          <ellipse cx="300" cy="200" rx="170" ry="100" fill="#A8A8A8" />
          
          {/* Head */}
          <ellipse cx="470" cy="150" rx="80" ry="90" fill="#9E9E9E" />
          <ellipse cx="475" cy="145" rx="75" ry="85" fill="#A8A8A8" />
          
          {/* Ears - large flapping */}
          <motion.ellipse
            cx="420"
            cy="110"
            rx="60"
            ry="80"
            fill="#8D8D8D"
            animate={{ rotate: [0, 12, 0, -12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ transformOrigin: '450px 140px' }}
          />
          <motion.ellipse
            cx="425"
            cy="115"
            rx="48"
            ry="65"
            fill="#C9A9A9"
            animate={{ rotate: [0, 12, 0, -12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ transformOrigin: '450px 140px' }}
          />
          
          {/* Trunk */}
          <motion.path
            d="M520 170 Q545 195 540 240 Q535 290 510 325 Q485 350 455 340"
            stroke="#9E9E9E"
            strokeWidth="42"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              d: [
                "M520 170 Q545 195 540 240 Q535 290 510 325 Q485 350 455 340",
                "M520 170 Q560 180 560 230 Q560 280 530 315 Q500 340 470 330",
                "M520 170 Q545 195 540 240 Q535 290 510 325 Q485 350 455 340"
              ]
            }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          
          {/* Tusks - large ivory */}
          <path d="M495 195 Q520 220 515 270" stroke="#FFFFF0" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M500 195 Q485 220 492 270" stroke="#FFFFF0" strokeWidth="16" fill="none" strokeLinecap="round" />
          
          {/* Eyes */}
          <ellipse cx="490" cy="120" rx="18" ry="15" fill="white" />
          <circle cx="494" cy="123" r="9" fill="#1A1A1A" />
          <circle cx="498" cy="118" r="3" fill="white" />
          
          {/* Tail */}
          <motion.path
            d="M120 200 Q75 210 60 250"
            stroke="#8D8D8D"
            strokeWidth="10"
            fill="none"
            animate={{ rotate: [0, 18, 0, -18, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            style={{ transformOrigin: '120px 200px' }}
          />
          <motion.ellipse
            cx="60"
            cy="258"
            rx="10"
            ry="18"
            fill="#5D5D5D"
            animate={{ rotate: [0, 18, 0, -18, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            style={{ transformOrigin: '120px 200px' }}
          />
        </motion.svg>
        
        {/* Dust clouds */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/30"
            style={{ 
              left: -60 - i * 40, 
              bottom: 0,
              width: 55 + Math.random() * 45,
              height: 45 + Math.random() * 30
            }}
            animate={{ 
              opacity: [0.5, 0], 
              scale: [0.6, 2.5],
              y: [0, -60]
            }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// RPG Soldier Transition - Replaces butterfly
export const RPGSoldierTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const rocketLaunchTime = 1.5;
  const impactTime = 2.8;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-slate-200/50 to-gray-100/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character - explodes on impact */}
      <HitCharacter impactTime={impactTime} direction="explode" />
      
      {/* Explosion effect */}
      <ExplosionEffect delay={impactTime} />

      {/* Masked Soldier with RPG - bottom left corner */}
      <motion.div
        className="absolute z-30"
        style={{ left: '8%', bottom: '20%' }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <svg width="180" height="280" viewBox="0 0 180 280">
          {/* Body */}
          <rect x="50" y="120" width="80" height="120" rx="10" fill="#2D3B2D" />
          <rect x="55" y="125" width="70" height="110" rx="8" fill="#3D4B3D" />
          
          {/* Tactical vest */}
          <rect x="60" y="130" width="60" height="80" fill="#1A1A1A" />
          <rect x="65" y="135" width="20" height="15" fill="#2D2D2D" />
          <rect x="95" y="135" width="20" height="15" fill="#2D2D2D" />
          <rect x="65" y="160" width="50" height="10" fill="#2D2D2D" />
          
          {/* Head with mask */}
          <circle cx="90" cy="80" r="45" fill="#1A1A1A" />
          {/* Balaclava */}
          <ellipse cx="90" cy="85" rx="40" ry="42" fill="#1A1A1A" />
          {/* Eyes only visible */}
          <ellipse cx="75" cy="75" rx="12" ry="8" fill="#2D2D2D" />
          <ellipse cx="105" cy="75" rx="12" ry="8" fill="#2D2D2D" />
          <ellipse cx="75" cy="75" rx="6" ry="5" fill="white" />
          <ellipse cx="105" cy="75" rx="6" ry="5" fill="white" />
          <circle cx="76" cy="76" r="3" fill="#1A1A1A" />
          <circle cx="106" cy="76" r="3" fill="#1A1A1A" />
          
          {/* Arms holding RPG */}
          <path d="M130 140 Q160 120 175 100" stroke="#3D4B3D" strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M50 150 Q30 140 20 130" stroke="#3D4B3D" strokeWidth="18" fill="none" strokeLinecap="round" />
          
          {/* Legs */}
          <rect x="55" y="235" width="30" height="45" fill="#2D3B2D" />
          <rect x="95" y="235" width="30" height="45" fill="#2D3B2D" />
          <rect x="50" y="275" width="40" height="8" rx="3" fill="#1A1A1A" />
          <rect x="90" y="275" width="40" height="8" rx="3" fill="#1A1A1A" />
        </svg>
        
        {/* RPG Launcher */}
        <motion.div
          className="absolute"
          style={{ top: 30, left: 100 }}
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 0.15, repeat: 3, delay: rocketLaunchTime - 0.5 }}
        >
          <svg width="250" height="80" viewBox="0 0 250 80">
            {/* Tube */}
            <rect x="0" y="25" width="180" height="30" rx="15" fill="#4A5C4A" />
            <rect x="5" y="30" width="170" height="20" rx="10" fill="#5A6C5A" />
            
            {/* Rear sight */}
            <rect x="20" y="15" width="15" height="10" fill="#3D4D3D" />
            <rect x="20" y="55" width="15" height="10" fill="#3D4D3D" />
            
            {/* Front grip */}
            <rect x="100" y="55" width="25" height="25" rx="5" fill="#3D3D3D" />
            
            {/* Warhead */}
            <path d="M180 40 L220 40 L250 40" stroke="#5A6C5A" strokeWidth="20" strokeLinecap="round" />
            <path d="M220 40 L250 40" stroke="#6B7B6B" strokeWidth="16" strokeLinecap="round" />
            <ellipse cx="250" cy="40" rx="10" ry="14" fill="#8B0000" />
          </svg>
        </motion.div>

        {/* Muzzle flash on launch */}
        <motion.div
          className="absolute"
          style={{ top: 20, left: 5 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 2, 0]
          }}
          transition={{ duration: 0.3, delay: rocketLaunchTime }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-radial from-yellow-400 via-orange-500 to-transparent blur-sm" />
        </motion.div>
      </motion.div>

      {/* Rocket projectile flying to character */}
      <motion.div
        className="absolute z-25"
        style={{ bottom: '35%' }}
        initial={{ x: '15vw', opacity: 0 }}
        animate={{ 
          x: '50vw',
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: impactTime - rocketLaunchTime,
          delay: rocketLaunchTime,
          ease: 'linear'
        }}
      >
        <motion.svg 
          width="80" 
          height="30" 
          viewBox="0 0 80 30"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        >
          {/* Rocket body */}
          <ellipse cx="40" cy="15" rx="35" ry="10" fill="#8B0000" />
          <ellipse cx="35" cy="15" rx="28" ry="8" fill="#A52A2A" />
          
          {/* Warhead tip */}
          <path d="M70 15 L80 15" stroke="#8B0000" strokeWidth="12" strokeLinecap="round" />
          
          {/* Fins */}
          <path d="M5 5 L0 0 L8 10" fill="#8B0000" />
          <path d="M5 25 L0 30 L8 20" fill="#8B0000" />
          
          {/* Flame trail */}
          <motion.g
            animate={{ scaleX: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.05, repeat: Infinity }}
          >
            <ellipse cx="-15" cy="15" rx="20" ry="8" fill="#F59E0B" />
            <ellipse cx="-8" cy="15" rx="12" ry="5" fill="#FBBF24" />
            <ellipse cx="-2" cy="15" rx="6" ry="3" fill="white" />
          </motion.g>
        </motion.svg>
        
        {/* Smoke trail */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gray-400"
            style={{
              left: -20 - i * 25,
              top: 8,
              width: 15 - i,
              height: 15 - i
            }}
            animate={{ opacity: [0.6, 0], scale: [1, 2] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </motion.div>

      {/* Complete after explosion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: impactTime + 1.2 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
};

// Fighter Jet with Bomb Transition - replaces the horizontal flying object
export const FighterJetBombTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const bombDropTime = 1.2;
  const impactTime = 2.2;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-200/50 to-sky-100/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character - explodes on bomb impact */}
      <HitCharacter impactTime={impactTime} direction="explode" />
      
      {/* Explosion effect */}
      <ExplosionEffect delay={impactTime} />

      {/* Fighter Jet flying overhead */}
      <motion.div
        className="absolute z-20"
        initial={{ x: '-30vw', y: '15%' }}
        animate={{ x: '130vw', y: '15%' }}
        transition={{ duration: 4, ease: 'linear' }}
      >
        <motion.svg 
          width="450" 
          height="170" 
          viewBox="0 0 450 170"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          {/* Fuselage */}
          <path d="M420 85 L340 60 L100 55 L20 75 L20 95 L100 115 L340 110 L420 85 Z" fill="#4A5568" />
          <path d="M415 85 L340 63 L100 58 L25 77 L25 93 L100 112 L340 107 L415 85 Z" fill="#5A6A7A" />
          
          {/* Cockpit */}
          <path d="M350 68 L400 80 L400 90 L350 102 Q325 85 350 68" fill="#63B3ED" opacity="0.8" />
          <path d="M355 73 L385 82 L385 88 L355 97 Q340 85 355 73" fill="#90CDF4" opacity="0.5" />
          
          {/* Wings - swept back military style */}
          <path d="M200 55 L250 10 L300 10 L250 55 Z" fill="#3D4852" />
          <path d="M200 115 L250 160 L300 160 L250 115 Z" fill="#3D4852" />
          
          {/* Horizontal stabilizers */}
          <path d="M50 55 L90 30 L130 30 L100 55 Z" fill="#3D4852" />
          <path d="M50 115 L90 140 L130 140 L100 115 Z" fill="#3D4852" />
          
          {/* Vertical stabilizer */}
          <path d="M40 55 L25 20 L75 20 L90 55 Z" fill="#4A5568" />
          
          {/* Engine exhaust */}
          <ellipse cx="8" cy="85" rx="12" ry="18" fill="#2D3748" />
          
          {/* Afterburner flame */}
          <motion.g
            animate={{ scaleX: [1, 1.6, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.08, repeat: Infinity }}
          >
            <ellipse cx="-40" cy="85" rx="50" ry="18" fill="#F59E0B" />
            <ellipse cx="-25" cy="85" rx="30" ry="12" fill="#FBBF24" />
            <ellipse cx="-10" cy="85" rx="18" ry="7" fill="white" />
          </motion.g>
          
          {/* Missiles on wings */}
          <rect x="230" y="52" width="35" height="5" fill="#DC2626" />
          <rect x="230" y="113" width="35" height="5" fill="#DC2626" />
          
          {/* Bomb under fuselage (before drop) */}
          <motion.g
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.1, delay: bombDropTime }}
          >
            <ellipse cx="180" cy="105" rx="25" ry="10" fill="#1A1A1A" />
            <path d="M150 105 L145 115 L150 105 L155 115 Z" fill="#1A1A1A" />
          </motion.g>
          
          {/* Insignia */}
          <circle cx="170" cy="85" r="18" fill="white" />
          <circle cx="170" cy="85" r="12" fill="#3B82F6" />
          <circle cx="170" cy="85" r="6" fill="white" />
        </motion.svg>
        
        {/* Contrail */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: -250, width: 350 }}
        >
          <motion.div
            className="h-5 bg-gradient-to-l from-white/60 to-transparent rounded-full"
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Bomb falling */}
      <motion.div
        className="absolute z-25"
        initial={{ x: '30vw', y: '20%', opacity: 0 }}
        animate={{ 
          x: '50vw',
          y: '75%',
          opacity: [0, 1, 1, 0],
          rotate: [0, 15, 30]
        }}
        transition={{ 
          duration: impactTime - bombDropTime,
          delay: bombDropTime,
          ease: [0.4, 0, 1, 1] // Accelerating fall
        }}
      >
        <svg width="60" height="100" viewBox="0 0 60 100">
          {/* Bomb body */}
          <ellipse cx="30" cy="50" rx="20" ry="45" fill="#1A1A1A" />
          <ellipse cx="30" cy="45" rx="17" ry="38" fill="#2D2D2D" />
          
          {/* Nose */}
          <ellipse cx="30" cy="8" rx="12" ry="12" fill="#1A1A1A" />
          
          {/* Fins */}
          <path d="M10 85 L5 100 L15 90 Z" fill="#1A1A1A" />
          <path d="M50 85 L55 100 L45 90 Z" fill="#1A1A1A" />
          <path d="M25 90 L30 100 L35 90 Z" fill="#1A1A1A" />
          
          {/* Yellow band */}
          <rect x="12" y="35" width="36" height="8" fill="#FBBF24" />
        </svg>
      </motion.div>

      {/* Complete after explosion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: impactTime + 1.2 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
};

// Rocket transition - launches character into sky (keeping this one as is since it's good)
export const RocketTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const impactTime = 0.9;
  
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-indigo-100/50 to-purple-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character being launched */}
      <HitCharacter impactTime={impactTime} direction="up" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        initial={{ y: '120vh', rotate: 0 }}
        animate={{ y: '-120vh', rotate: 0 }}
        transition={{ duration: 2.8, ease: [0.2, 0, 0.8, 1] }}
        onAnimationComplete={onComplete}
      >
        <svg width="140" height="260" viewBox="0 0 140 260">
          {/* Rocket Body */}
          <path d="M70 0 L105 95 L105 190 L35 190 L35 95 Z" fill="#E53E3E" />
          <ellipse cx="70" cy="95" rx="35" ry="95" fill="#F56565" />
          
          {/* Window */}
          <circle cx="70" cy="85" r="25" fill="#63B3ED" stroke="#2D3748" strokeWidth="5" />
          <circle cx="62" cy="77" r="8" fill="white" opacity="0.6" />
          
          {/* Fins */}
          <path d="M35 155 L5 215 L35 190 Z" fill="#C53030" />
          <path d="M105 155 L135 215 L105 190 Z" fill="#C53030" />
          
          {/* Details */}
          <rect x="28" y="170" width="84" height="6" fill="#C53030" />
          <rect x="28" y="182" width="84" height="4" fill="#C53030" />
          
          {/* Fire - large and dynamic */}
          <motion.g
            animate={{ scaleY: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 0.06, repeat: Infinity }}
          >
            <path d="M45 190 L70 300 L95 190 Z" fill="#F6AD55" />
            <path d="M52 190 L70 265 L88 190 Z" fill="#FBBF24" />
            <path d="M58 190 L70 230 L82 190 Z" fill="#FEF3C7" />
          </motion.g>
        </svg>
        
        {/* Extended trail */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-orange-400/50"
            style={{ 
              left: 55, 
              top: 260 + i * 45,
              width: 35 - i * 1.5,
              height: 35 - i * 1.5
            }}
            animate={{ opacity: [0.5, 0], scale: [1, 3] }}
            transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.025 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Korean Dragon transition - enhanced
export const DragonTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5.5;
  const impactTime = calculateImpactTime(totalDuration, -35, 130);

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-emerald-100/50 to-teal-50/50"
    >
      {/* Character waiting to be hit */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-35vw', y: '30%' }}
        animate={{ 
          x: '130vw',
          y: ['30%', '20%', '40%', '25%', '35%', '30%']
        }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
      >
        {/* Dragon body segments - larger */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: -i * 55 }}
            animate={{ y: [0, -25, 0, 25, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.08 }}
          >
            <div 
              className={`rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-emerald-500'}`}
              style={{ 
                width: 70 - i * 3,
                height: 70 - i * 3,
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
              }}
            />
            {/* Scales detail */}
            {i > 0 && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/30"
                style={{ width: (70 - i * 3) * 0.6, height: (70 - i * 3) * 0.6 }}
              />
            )}
          </motion.div>
        ))}
        
        {/* Dragon head - larger and more detailed */}
        <motion.svg 
          width="180" 
          height="140" 
          viewBox="0 0 180 140"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        >
          {/* Head */}
          <ellipse cx="80" cy="70" rx="65" ry="55" fill="#10B981" />
          <ellipse cx="85" cy="65" rx="58" ry="48" fill="#34D399" />
          
          {/* Snout */}
          <ellipse cx="140" cy="75" rx="30" ry="25" fill="#10B981" />
          
          {/* Eye */}
          <ellipse cx="100" cy="50" rx="18" ry="15" fill="white" />
          <circle cx="104" cy="52" r="10" fill="#1A1A1A" />
          <circle cx="108" cy="48" r="4" fill="white" />
          {/* Angry eyebrow */}
          <path d="M82 38 L120 45" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          
          {/* Horns */}
          <path d="M45 28 Q32 5 55 15" stroke="#059669" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M75 22 Q75 -5 95 8" stroke="#059669" strokeWidth="10" fill="none" strokeLinecap="round" />
          
          {/* Whiskers */}
          <motion.path
            d="M155 58 Q180 45 200 52"
            stroke="#059669"
            strokeWidth="4"
            fill="none"
            animate={{ rotate: [0, 12, 0] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '155px 58px' }}
          />
          <motion.path
            d="M155 92 Q180 105 200 98"
            stroke="#059669"
            strokeWidth="4"
            fill="none"
            animate={{ rotate: [0, -12, 0] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '155px 92px' }}
          />
          
          {/* Fire breath - larger */}
          <motion.g
            animate={{ opacity: [1, 0.6, 1], scale: [1, 1.25, 1] }}
            transition={{ duration: 0.12, repeat: Infinity }}
          >
            <path d="M155 65 L240 52 L225 70 L265 62 L220 82 L250 75 L155 88 Z" fill="#F59E0B" />
            <path d="M162 68 L215 58 L205 72 L235 66 L200 80 L162 85 Z" fill="#FBBF24" />
            <path d="M168 72 L190 66 L185 76 L168 80 Z" fill="#FEF3C7" />
          </motion.g>
        </motion.svg>
      </motion.div>
      
      {/* Magical sparkles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{ 
            duration: 1.3, 
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" fill="#10B981" />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Helicopter with Machine Gun Transition - replaces airplane
export const HelicopterTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const shootingStartTime = 1.0;
  const impactTime = 1.8;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-100/50 to-blue-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character - gets hit by bullets */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      {/* Helicopter */}
      <motion.div
        className="absolute z-20"
        initial={{ x: '-25vw', y: '18%' }}
        animate={{ x: '130vw', y: '18%' }}
        transition={{ duration: 4.5, ease: 'linear' }}
        onAnimationComplete={onComplete}
      >
        <svg width="380" height="200" viewBox="0 0 380 200">
          {/* Main rotor */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '190px 30px' }}
          >
            <rect x="40" y="28" width="300" height="8" rx="4" fill="#3D4852" />
            <rect x="186" y="26" width="8" height="12" rx="2" fill="#2D3748" />
          </motion.g>
          
          {/* Rotor mast */}
          <rect x="183" y="35" width="14" height="25" fill="#4A5568" />
          
          {/* Body */}
          <ellipse cx="190" cy="100" rx="100" ry="45" fill="#2D3748" />
          <ellipse cx="190" cy="95" rx="90" ry="40" fill="#3D4852" />
          
          {/* Cockpit */}
          <path d="M270 80 Q310 95 310 105 Q310 115 270 120" fill="#63B3ED" opacity="0.7" />
          <path d="M275 85 Q300 97 300 105 Q300 113 275 118" fill="#90CDF4" opacity="0.4" />
          
          {/* Tail boom */}
          <rect x="90" y="90" width="120" height="20" fill="#2D3748" />
          <path d="M100 90 L40 85 L40 95 L100 110 Z" fill="#2D3748" />
          
          {/* Tail rotor */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.05, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '35px 95px' }}
          >
            <rect x="33" y="75" width="4" height="40" rx="2" fill="#3D4852" />
          </motion.g>
          <circle cx="35" cy="95" r="8" fill="#4A5568" />
          
          {/* Landing skids */}
          <rect x="130" y="145" width="120" height="6" rx="3" fill="#1A1A1A" />
          <rect x="140" y="138" width="8" height="12" fill="#2D3748" />
          <rect x="230" y="138" width="8" height="12" fill="#2D3748" />
          
          {/* Machine gun */}
          <rect x="280" y="120" width="60" height="10" fill="#1A1A1A" />
          <rect x="335" y="118" width="15" height="14" fill="#2D2D2D" />
          
          {/* Military markings */}
          <circle cx="200" cy="100" r="18" fill="white" opacity="0.9" />
          <text x="200" y="108" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1A1A1A">★</text>
        </svg>
        
        {/* Muzzle flashes */}
        <motion.div
          className="absolute"
          style={{ right: -20, top: 118 }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0],
            scale: [0.5, 1.2, 0.5, 1.2, 0.5, 1.2, 0.5, 1.2, 0.5]
          }}
          transition={{ 
            duration: 0.6,
            delay: shootingStartTime,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
          }}
        >
          <div className="w-8 h-8 rounded-full bg-yellow-400 blur-sm" />
        </motion.div>
      </motion.div>

      {/* Bullet tracers */}
      {[0, 0.08, 0.16, 0.24, 0.32].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute h-1 bg-gradient-to-r from-yellow-400 to-yellow-200"
          style={{ 
            top: '28%',
            width: 60
          }}
          initial={{ x: '25vw', opacity: 0 }}
          animate={{ 
            x: '52vw',
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 0.15,
            delay: shootingStartTime + delay,
            ease: 'linear'
          }}
        />
      ))}

      {/* Clouds */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-50"
          style={{
            width: 110 + Math.random() * 70,
            height: 45 + Math.random() * 30,
            left: `${15 + i * 22}%`,
            top: `${25 + Math.random() * 25}%`,
          }}
          animate={{ x: [-25, 25, -25] }}
          transition={{ duration: 4.5 + Math.random() * 2, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
};

// Train transition - enhanced with proper timing
export const TrainTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5.5;
  const impactTime = calculateImpactTime(totalDuration, -80, 150);

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-gray-100/50 to-amber-50/50"
    >
      {/* Character waiting on track */}
      <HitCharacter impactTime={impactTime} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={impactTime} />

      {/* Track */}
      <div className="absolute w-full" style={{ bottom: '20%' }}>
        <div className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600" />
        <div className="h-10 flex justify-around">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="w-5 h-full bg-amber-800" />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute flex items-end z-20"
        initial={{ x: '-80vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '24%' }}
      >
        {/* Engine - larger */}
        <svg width="320" height="200" viewBox="0 0 320 200">
          {/* Main body */}
          <rect x="45" y="45" width="230" height="105" rx="10" fill="#DC2626" />
          <rect x="55" y="55" width="210" height="85" rx="7" fill="#EF4444" />
          <rect x="255" y="28" width="58" height="120" rx="7" fill="#B91C1C" />
          
          {/* Chimney */}
          <rect x="80" y="5" width="48" height="52" fill="#374151" />
          <rect x="74" y="0" width="60" height="12" rx="4" fill="#4B5563" />
          <motion.ellipse
            cx="104"
            cy="0"
            rx="30"
            ry="15"
            fill="#9CA3AF"
            animate={{ y: [-12, -60], opacity: [0.9, 0], scale: [1, 3] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <motion.ellipse
            cx="104"
            cy="-25"
            rx="24"
            ry="12"
            fill="#9CA3AF"
            animate={{ y: [-12, -55], opacity: [0.7, 0], scale: [1, 2.5] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: 0.18 }}
          />
          
          {/* Windows */}
          <rect x="265" y="40" width="38" height="48" rx="4" fill="#60A5FA" />
          <rect x="271" y="46" width="26" height="36" rx="3" fill="#93C5FD" />
          
          {/* Front detail */}
          <ellipse cx="308" cy="105" rx="10" ry="18" fill="#DC2626" />
          
          {/* Wheels */}
          {[105, 210].map((x, i) => (
            <motion.g
              key={i}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 175px` }}
            >
              <circle cx={x} cy="175" r="32" fill="#1F2937" stroke="#4B5563" strokeWidth="5" />
              <circle cx={x} cy="175" r="14" fill="#374151" />
              <line x1={x} y1="143" x2={x} y2="207" stroke="#4B5563" strokeWidth="4" />
              <line x1={x - 32} y1="175" x2={x + 32} y2="175" stroke="#4B5563" strokeWidth="4" />
            </motion.g>
          ))}
          
          {/* Cow catcher */}
          <path d="M295 150 L330 185 L295 185 Z" fill="#374151" />
        </svg>
        
        {/* Wagons - larger */}
        {[...Array(4)].map((_, i) => (
          <svg key={i} width="200" height="170" viewBox="0 0 200 170">
            <rect x="18" y="45" width="165" height="90" rx="6" fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i]} />
            <rect x="28" y="55" width="48" height="48" rx="4" fill="white" opacity="0.25" />
            <rect x="86" y="55" width="48" height="48" rx="4" fill="white" opacity="0.25" />
            <rect x="144" y="55" width="35" height="48" rx="4" fill="white" opacity="0.25" />
            {[55, 145].map((x, j) => (
              <motion.g
                key={j}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${x}px 155px` }}
              >
                <circle cx={x} cy="155" r="22" fill="#1F2937" />
              </motion.g>
            ))}
          </svg>
        ))}
      </motion.div>
    </motion.div>
  );
};

export const transitions = [
  TankTransition,
  BuffaloTransition,
  RPGSoldierTransition,    // Replaced ButterflyTransition
  ElephantTransition,
  FighterJetBombTransition, // Replaced FighterJetTransition  
  DragonTransition,
  RocketTransition,
  HelicopterTransition,     // Replaced AirplaneTransition
  TrainTransition
];
