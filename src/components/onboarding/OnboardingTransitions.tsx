import React from 'react';
import { motion } from 'framer-motion';
import characterImage from '@/assets/onboarding-character.png';

// Character being hit component
const HitCharacter: React.FC<{ delay: number; direction: 'left' | 'right' }> = ({ delay, direction }) => {
  return (
    <motion.div
      className="absolute z-10"
      style={{ 
        bottom: '25%', 
        left: '50%',
        transform: 'translateX(-50%)'
      }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={{ 
        opacity: [1, 1, 0],
        x: direction === 'right' ? [0, 200, 400] : [0, -200, -400],
        y: [0, -150, -100],
        rotate: direction === 'right' ? [0, 180, 360] : [0, -180, -360]
      }}
      transition={{ 
        duration: 1.5, 
        delay: delay,
        ease: 'easeOut'
      }}
    >
      <img 
        src={characterImage} 
        alt="Character" 
        className="w-32 h-32 object-contain drop-shadow-xl"
      />
      {/* Impact stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ 
            left: `${Math.cos(i * 72 * Math.PI / 180) * 30}px`,
            top: `${Math.sin(i * 72 * Math.PI / 180) * 30}px`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 0.5, delay: delay + 0.2 + i * 0.1 }}
        >
          ⭐
        </motion.div>
      ))}
    </motion.div>
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
        transition={{ duration: 0.3, delay: delay }}
      />
      {/* Shockwave */}
      <motion.div
        className="absolute z-30 rounded-full border-4 border-amber-400"
        style={{ 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ 
          width: [0, 400],
          height: [0, 400],
          opacity: [1, 0]
        }}
        transition={{ duration: 0.6, delay: delay }}
      />
    </>
  );
};

// Realistic Tank transition - larger, slower, hits character
export const TankTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-amber-50/50 to-amber-100/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter delay={2.5} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={2.5} />

      {/* Realistic Tank SVG - Much larger and detailed */}
      <motion.div
        className="absolute z-20"
        initial={{ x: '-60vw', y: 0 }}
        animate={{ x: '150vw', y: 0 }}
        transition={{ duration: 6, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={onComplete}
        style={{ bottom: '20%' }}
      >
        <svg width="500" height="280" viewBox="0 0 500 280" fill="none">
          {/* Track base */}
          <path d="M50 220 Q30 220 30 200 L30 180 Q30 160 50 160 L400 160 Q420 160 420 180 L420 200 Q420 220 400 220 Z" fill="#2D2D2D" />
          
          {/* Track wheels - detailed */}
          {[60, 120, 180, 240, 300, 360].map((x, i) => (
            <g key={i}>
              <motion.circle 
                cx={x} 
                cy="190" 
                r="28" 
                fill="#1A1A1A" 
                stroke="#3D3D3D" 
                strokeWidth="4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${x}px 190px` }}
              />
              <circle cx={x} cy="190" r="12" fill="#4A4A4A" />
              {/* Wheel spokes */}
              {[0, 45, 90, 135].map((angle, j) => (
                <motion.line 
                  key={j}
                  x1={x} 
                  y1="190" 
                  x2={x + Math.cos(angle * Math.PI / 180) * 20} 
                  y2={190 + Math.sin(angle * Math.PI / 180) * 20}
                  stroke="#5A5A5A" 
                  strokeWidth="3"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `${x}px 190px` }}
                />
              ))}
            </g>
          ))}
          
          {/* Track belt */}
          <path d="M45 160 L405 160" stroke="#3D3D3D" strokeWidth="8" strokeDasharray="15 10" />
          <path d="M45 220 L405 220" stroke="#3D3D3D" strokeWidth="8" strokeDasharray="15 10" />
          
          {/* Hull - main body */}
          <path d="M60 160 L80 100 L380 100 L400 160 Z" fill="#4A5C4A" />
          <path d="M70 155 L85 105 L375 105 L390 155 Z" fill="#5A6C5A" />
          
          {/* Hull details - armor plates */}
          <rect x="100" y="110" width="60" height="40" fill="#4A5C4A" stroke="#3D4D3D" strokeWidth="2" />
          <rect x="180" y="110" width="100" height="40" fill="#4A5C4A" stroke="#3D4D3D" strokeWidth="2" />
          
          {/* Turret base */}
          <ellipse cx="230" cy="100" rx="80" ry="25" fill="#5A6C5A" />
          
          {/* Turret */}
          <path d="M160 100 L170 50 L290 50 L300 100 Z" fill="#4A5C4A" />
          <rect x="175" y="55" width="110" height="40" rx="5" fill="#5A6C5A" />
          
          {/* Main cannon - long barrel */}
          <rect x="300" y="65" width="150" height="20" fill="#3D4D3D" />
          <rect x="300" y="68" width="150" height="14" fill="#4A5C4A" />
          {/* Cannon muzzle brake */}
          <rect x="440" y="60" width="20" height="30" fill="#3D4D3D" />
          <rect x="445" y="63" width="15" height="8" fill="#2D2D2D" />
          <rect x="445" y="79" width="15" height="8" fill="#2D2D2D" />
          
          {/* Commander's hatch */}
          <ellipse cx="200" cy="55" rx="20" ry="10" fill="#3D4D3D" />
          
          {/* Antenna */}
          <line x1="175" y1="50" x2="175" y2="20" stroke="#2D2D2D" strokeWidth="2" />
          <motion.circle
            cx="175"
            cy="15"
            r="5"
            fill="#E53E3E"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Exhaust smoke */}
          <motion.g>
            {[0, 1, 2, 3].map((i) => (
              <motion.ellipse
                key={i}
                cx={50 - i * 30}
                cy={120}
                rx="20"
                ry="15"
                fill="#6B7280"
                opacity={0.6 - i * 0.15}
                animate={{ 
                  x: [-10, -50],
                  y: [-5, -30],
                  scale: [1, 2],
                  opacity: [0.6 - i * 0.15, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.g>
          
          {/* Ground dust */}
          {[...Array(8)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx={30 - i * 25}
              cy={230}
              rx="25"
              ry="10"
              fill="#D4A574"
              opacity={0.5}
              animate={{ 
                x: [-20, -80],
                scale: [0.5, 2],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </svg>
      </motion.div>
      
      {/* Screen shake effect */}
      <motion.div
        className="absolute inset-0"
        animate={{ 
          x: [0, -5, 5, -3, 3, 0],
          y: [0, 3, -3, 2, -2, 0]
        }}
        transition={{ duration: 0.5, delay: 2.5 }}
      />
    </motion.div>
  );
};

// Realistic Buffalo/Water Buffalo transition - larger, slower, charges and hits
export const BuffaloTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-green-50/50 to-amber-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter delay={2.8} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={2.8} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-50vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: 5.5, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={onComplete}
        style={{ bottom: '18%' }}
      >
        <motion.svg 
          width="450" 
          height="300" 
          viewBox="0 0 450 300"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          {/* Shadow */}
          <ellipse cx="225" cy="280" rx="150" ry="20" fill="rgba(0,0,0,0.2)" />
          
          {/* Back legs */}
          <motion.g
            animate={{ rotate: [-15, 25, -15] }}
            transition={{ duration: 0.35, repeat: Infinity }}
            style={{ transformOrigin: '120px 200px' }}
          >
            <path d="M100 200 Q90 240 85 270 Q85 285 100 285 L115 285 Q125 285 120 270 Q115 240 120 200" fill="#5D4037" />
            <ellipse cx="105" cy="282" rx="15" ry="8" fill="#3E2723" />
          </motion.g>
          <motion.g
            animate={{ rotate: [25, -15, 25] }}
            transition={{ duration: 0.35, repeat: Infinity }}
            style={{ transformOrigin: '160px 200px' }}
          >
            <path d="M145 200 Q135 240 130 270 Q130 285 145 285 L160 285 Q170 285 165 270 Q160 240 165 200" fill="#4E342E" />
            <ellipse cx="150" cy="282" rx="15" ry="8" fill="#3E2723" />
          </motion.g>
          
          {/* Front legs */}
          <motion.g
            animate={{ rotate: [20, -20, 20] }}
            transition={{ duration: 0.35, repeat: Infinity }}
            style={{ transformOrigin: '300px 200px' }}
          >
            <path d="M285 200 Q275 240 270 270 Q270 285 285 285 L300 285 Q310 285 305 270 Q300 240 305 200" fill="#5D4037" />
            <ellipse cx="290" cy="282" rx="15" ry="8" fill="#3E2723" />
          </motion.g>
          <motion.g
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ duration: 0.35, repeat: Infinity }}
            style={{ transformOrigin: '340px 200px' }}
          >
            <path d="M325 200 Q315 240 310 270 Q310 285 325 285 L340 285 Q350 285 345 270 Q340 240 345 200" fill="#4E342E" />
            <ellipse cx="330" cy="282" rx="15" ry="8" fill="#3E2723" />
          </motion.g>
          
          {/* Body */}
          <ellipse cx="220" cy="160" rx="130" ry="70" fill="#6D4C41" />
          <ellipse cx="220" cy="155" rx="120" ry="60" fill="#795548" />
          
          {/* Muscle definition */}
          <path d="M150 130 Q180 110 220 115 Q260 110 290 130" stroke="#5D4037" strokeWidth="3" fill="none" />
          <ellipse cx="280" cy="145" rx="30" ry="25" fill="#6D4C41" />
          <ellipse cx="160" cy="145" rx="30" ry="25" fill="#6D4C41" />
          
          {/* Hump */}
          <ellipse cx="180" cy="100" rx="50" ry="30" fill="#6D4C41" />
          
          {/* Head */}
          <ellipse cx="350" cy="140" rx="50" ry="45" fill="#5D4037" />
          <ellipse cx="365" cy="145" rx="40" ry="35" fill="#6D4C41" />
          
          {/* Snout */}
          <ellipse cx="400" cy="160" rx="25" ry="20" fill="#4E342E" />
          <ellipse cx="395" cy="165" rx="8" ry="5" fill="#3E2723" />
          <ellipse cx="410" cy="165" rx="8" ry="5" fill="#3E2723" />
          
          {/* Steam from nose */}
          <motion.g
            animate={{ opacity: [0.8, 0.2, 0.8], x: [0, 20, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ellipse cx="420" cy="155" rx="10" ry="5" fill="white" opacity="0.5" />
            <ellipse cx="430" cy="150" rx="8" ry="4" fill="white" opacity="0.3" />
          </motion.g>
          
          {/* Horns - curved like water buffalo */}
          <path d="M330 100 Q280 60 260 80" stroke="#3E2723" strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M330 100 Q280 60 260 80" stroke="#4E342E" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M370 100 Q420 60 440 80" stroke="#3E2723" strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M370 100 Q420 60 440 80" stroke="#4E342E" strokeWidth="12" fill="none" strokeLinecap="round" />
          
          {/* Eyes - angry */}
          <ellipse cx="370" cy="125" rx="12" ry="10" fill="white" />
          <circle cx="373" cy="126" r="6" fill="#1A1A1A" />
          <circle cx="375" cy="124" r="2" fill="white" />
          {/* Angry eyebrow */}
          <path d="M358 115 L382 120" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
          
          {/* Ear */}
          <ellipse cx="320" cy="110" rx="15" ry="10" fill="#5D4037" />
          
          {/* Tail - animated */}
          <motion.path
            d="M90 140 Q50 130 40 160 Q30 180 45 190"
            stroke="#5D4037"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            animate={{ rotate: [0, 30, 0, -30, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '90px 140px' }}
          />
          <motion.ellipse
            cx="45"
            cy="190"
            rx="12"
            ry="8"
            fill="#4E342E"
            animate={{ rotate: [0, 30, 0, -30, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '90px 140px' }}
          />
        </motion.svg>
        
        {/* Ground dust clouds */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-600/40"
            style={{ 
              left: -30 - i * 40, 
              bottom: -10,
              width: 40 + Math.random() * 30,
              height: 30 + Math.random() * 20
            }}
            animate={{ 
              opacity: [0.6, 0], 
              scale: [0.8, 2.5], 
              y: [0, -40 - Math.random() * 30],
              x: [-20, -60]
            }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Elephant transition - majestic and powerful
export const ElephantTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-gray-100/50 to-amber-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter delay={3} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={3} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-60vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: 6, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={onComplete}
        style={{ bottom: '10%' }}
      >
        <motion.svg 
          width="500" 
          height="380" 
          viewBox="0 0 500 380"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {/* Shadow */}
          <ellipse cx="280" cy="365" rx="180" ry="15" fill="rgba(0,0,0,0.15)" />
          
          {/* Back legs */}
          <motion.g
            animate={{ rotate: [-8, 12, -8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '150px 250px' }}
          >
            <path d="M130 250 Q115 300 110 340 Q108 360 130 360 L155 360 Q175 360 170 340 Q165 300 170 250" fill="#8D8D8D" />
            <ellipse cx="145" cy="360" rx="25" ry="10" fill="#6D6D6D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [12, -8, 12] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '200px 250px' }}
          >
            <path d="M180 250 Q165 300 160 340 Q158 360 180 360 L205 360 Q225 360 220 340 Q215 300 220 250" fill="#7D7D7D" />
            <ellipse cx="195" cy="360" rx="25" ry="10" fill="#6D6D6D" />
          </motion.g>
          
          {/* Front legs */}
          <motion.g
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '350px 250px' }}
          >
            <path d="M330 250 Q315 300 310 340 Q308 360 330 360 L355 360 Q375 360 370 340 Q365 300 370 250" fill="#8D8D8D" />
            <ellipse cx="345" cy="360" rx="25" ry="10" fill="#6D6D6D" />
          </motion.g>
          <motion.g
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '400px 250px' }}
          >
            <path d="M380 250 Q365 300 360 340 Q358 360 380 360 L405 360 Q425 360 420 340 Q415 300 420 250" fill="#7D7D7D" />
            <ellipse cx="395" cy="360" rx="25" ry="10" fill="#6D6D6D" />
          </motion.g>
          
          {/* Body */}
          <ellipse cx="270" cy="190" rx="160" ry="100" fill="#9E9E9E" />
          <ellipse cx="270" cy="180" rx="150" ry="90" fill="#A8A8A8" />
          
          {/* Head */}
          <ellipse cx="420" cy="140" rx="70" ry="80" fill="#9E9E9E" />
          <ellipse cx="425" cy="135" rx="65" ry="75" fill="#A8A8A8" />
          
          {/* Ears */}
          <motion.ellipse
            cx="380"
            cy="100"
            rx="50"
            ry="70"
            fill="#8D8D8D"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '400px 120px' }}
          />
          <motion.ellipse
            cx="385"
            cy="105"
            rx="40"
            ry="55"
            fill="#C9A9A9"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '400px 120px' }}
          />
          
          {/* Trunk */}
          <motion.path
            d="M470 160 Q490 180 485 220 Q480 260 460 290 Q440 310 420 300"
            stroke="#9E9E9E"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              d: [
                "M470 160 Q490 180 485 220 Q480 260 460 290 Q440 310 420 300",
                "M470 160 Q500 170 500 210 Q500 250 480 280 Q460 300 440 290",
                "M470 160 Q490 180 485 220 Q480 260 460 290 Q440 310 420 300"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Tusks */}
          <path d="M450 180 Q470 200 465 240" stroke="#FFFFF0" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M455 180 Q445 200 450 240" stroke="#FFFFF0" strokeWidth="12" fill="none" strokeLinecap="round" />
          
          {/* Eyes */}
          <ellipse cx="440" cy="110" rx="15" ry="12" fill="white" />
          <circle cx="443" cy="112" r="7" fill="#1A1A1A" />
          <circle cx="446" cy="109" r="2" fill="white" />
          
          {/* Tail */}
          <motion.path
            d="M110 180 Q70 190 60 220"
            stroke="#8D8D8D"
            strokeWidth="8"
            fill="none"
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: '110px 180px' }}
          />
          <motion.ellipse
            cx="60"
            cy="225"
            rx="8"
            ry="15"
            fill="#5D5D5D"
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: '110px 180px' }}
          />
        </motion.svg>
        
        {/* Dust clouds */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/30"
            style={{ 
              left: -50 - i * 35, 
              bottom: 0,
              width: 50 + Math.random() * 40,
              height: 40 + Math.random() * 25
            }}
            animate={{ 
              opacity: [0.5, 0], 
              scale: [0.6, 2],
              y: [0, -50]
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Military Fighter Jet transition
export const FighterJetTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-200/50 to-sky-100/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character waiting to be hit */}
      <HitCharacter delay={1.5} direction="right" />
      
      {/* Impact shockwave */}
      <ImpactEffect delay={1.5} />

      {/* Sonic boom lines */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ 
              top: `${20 + i * 10}%`,
              left: 0,
              right: 0
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1.5, 0] }}
            transition={{ duration: 0.3, delay: 1.5 + i * 0.05 }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute z-20"
        initial={{ x: '-40vw', y: '60%' }}
        animate={{ x: '150vw', y: '30%' }}
        transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
        onAnimationComplete={onComplete}
      >
        <motion.svg 
          width="400" 
          height="150" 
          viewBox="0 0 400 150"
          animate={{ rotate: [-3, 0, -3] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          {/* Fuselage */}
          <path d="M380 75 L300 55 L100 50 L20 65 L20 85 L100 100 L300 95 L380 75 Z" fill="#4A5568" />
          <path d="M375 75 L300 58 L100 53 L25 67 L25 83 L100 97 L300 92 L375 75 Z" fill="#5A6A7A" />
          
          {/* Cockpit */}
          <path d="M310 60 L350 70 L350 80 L310 90 Q290 75 310 60" fill="#63B3ED" opacity="0.8" />
          <path d="M315 65 L340 72 L340 78 L315 85 Q300 75 315 65" fill="#90CDF4" opacity="0.5" />
          
          {/* Wings */}
          <path d="M180 50 L220 10 L260 10 L220 50 Z" fill="#3D4852" />
          <path d="M180 100 L220 140 L260 140 L220 100 Z" fill="#3D4852" />
          
          {/* Horizontal stabilizers */}
          <path d="M50 50 L80 30 L110 30 L90 50 Z" fill="#3D4852" />
          <path d="M50 100 L80 120 L110 120 L90 100 Z" fill="#3D4852" />
          
          {/* Vertical stabilizer */}
          <path d="M40 50 L30 20 L70 20 L80 50 Z" fill="#4A5568" />
          
          {/* Engine exhaust */}
          <ellipse cx="10" cy="75" rx="10" ry="15" fill="#2D3748" />
          
          {/* Afterburner flame */}
          <motion.g
            animate={{ scaleX: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          >
            <ellipse cx="-30" cy="75" rx="40" ry="15" fill="#F59E0B" />
            <ellipse cx="-20" cy="75" rx="25" ry="10" fill="#FBBF24" />
            <ellipse cx="-10" cy="75" rx="15" ry="6" fill="white" />
          </motion.g>
          
          {/* Missiles */}
          <rect x="200" y="48" width="30" height="4" fill="#E53E3E" />
          <rect x="200" y="98" width="30" height="4" fill="#E53E3E" />
          
          {/* Insignia */}
          <circle cx="150" cy="75" r="15" fill="white" />
          <circle cx="150" cy="75" r="10" fill="#3B82F6" />
          <circle cx="150" cy="75" r="5" fill="white" />
        </motion.svg>
        
        {/* Contrail */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: -200, right: '100%' }}
        >
          <motion.div
            className="h-4 bg-gradient-to-l from-white/60 to-transparent"
            style={{ width: 300 }}
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Korean Dragon transition - enhanced
export const DragonTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-emerald-100/50 to-teal-50/50"
    >
      {/* Character waiting to be hit */}
      <HitCharacter delay={2.2} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={2.2} />

      <motion.div
        className="absolute z-20"
        initial={{ x: '-30vw', y: '35%' }}
        animate={{ 
          x: '130vw',
          y: ['35%', '25%', '45%', '30%', '40%', '35%']
        }}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={onComplete}
      >
        {/* Dragon body segments - larger */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: -i * 50 }}
            animate={{ y: [0, -20, 0, 20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          >
            <div 
              className={`rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-emerald-500'}`}
              style={{ 
                width: 60 - i * 3,
                height: 60 - i * 3,
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
              }}
            />
            {/* Scales detail */}
            {i > 0 && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/30"
                style={{ width: (60 - i * 3) * 0.6, height: (60 - i * 3) * 0.6 }}
              />
            )}
          </motion.div>
        ))}
        
        {/* Dragon head - larger and more detailed */}
        <motion.svg 
          width="150" 
          height="120" 
          viewBox="0 0 150 120"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          {/* Head */}
          <ellipse cx="70" cy="60" rx="55" ry="45" fill="#10B981" />
          <ellipse cx="75" cy="55" rx="50" ry="40" fill="#34D399" />
          
          {/* Snout */}
          <ellipse cx="120" cy="65" rx="25" ry="20" fill="#10B981" />
          
          {/* Eye */}
          <ellipse cx="90" cy="45" rx="15" ry="12" fill="white" />
          <circle cx="93" cy="46" r="8" fill="#1A1A1A" />
          <circle cx="96" cy="43" r="3" fill="white" />
          {/* Angry eyebrow */}
          <path d="M75 35 L105 40" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          
          {/* Horns */}
          <path d="M40 25 Q30 5 50 15" stroke="#059669" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M65 20 Q65 0 80 10" stroke="#059669" strokeWidth="8" fill="none" strokeLinecap="round" />
          
          {/* Whiskers */}
          <motion.path
            d="M130 50 Q150 40 165 45"
            stroke="#059669"
            strokeWidth="3"
            fill="none"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '130px 50px' }}
          />
          <motion.path
            d="M130 80 Q150 90 165 85"
            stroke="#059669"
            strokeWidth="3"
            fill="none"
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '130px 80px' }}
          />
          
          {/* Fire breath - larger */}
          <motion.g
            animate={{ opacity: [1, 0.6, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          >
            <path d="M130 55 L200 45 L190 60 L220 55 L185 70 L210 65 L130 75 Z" fill="#F59E0B" />
            <path d="M135 58 L180 50 L175 62 L195 58 L170 68 L135 72 Z" fill="#FBBF24" />
            <path d="M140 62 L160 58 L158 66 L140 68 Z" fill="#FEF3C7" />
          </motion.g>
        </motion.svg>
      </motion.div>
      
      {/* Magical sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
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
            duration: 1.5, 
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

// Bird flock transition - enhanced
export const BirdFlockTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-100/50 to-blue-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character getting lifted by birds */}
      <motion.div
        className="absolute z-10"
        style={{ 
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: [1, 1, 0],
          y: [0, -50, -200],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2,
          delay: 1
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          className="w-28 h-28 object-contain"
        />
      </motion.div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: '-15vw', y: `${15 + Math.random() * 50}%` }}
          animate={{ x: '115vw', y: `${15 + Math.random() * 50}%` }}
          transition={{ 
            duration: 3.5 + Math.random() * 0.8, 
            delay: i * 0.12,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onAnimationComplete={i === 19 ? onComplete : undefined}
        >
          <motion.svg 
            width="60" 
            height="45" 
            viewBox="0 0 60 45"
            animate={{ y: [0, -8, 0, 8, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            {/* Bird body */}
            <ellipse cx="30" cy="22" rx="12" ry="8" fill="#2D3748" />
            {/* Wings */}
            <motion.path
              d="M30 22 L5 8 M30 22 L55 8"
              stroke="#1A202C"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: ['M30 22 L5 8 M30 22 L55 8', 'M30 22 L5 30 M30 22 L55 30', 'M30 22 L5 8 M30 22 L55 8'] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            {/* Head */}
            <circle cx="42" cy="18" r="6" fill="#2D3748" />
            {/* Beak */}
            <path d="M48 18 L55 17 L48 20 Z" fill="#F59E0B" />
          </motion.svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Rocket transition - enhanced
export const RocketTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-indigo-100/50 to-purple-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Character being launched */}
      <motion.div
        className="absolute z-10"
        style={{ 
          left: '50%',
          bottom: '25%',
          transform: 'translateX(-50%)'
        }}
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: [1, 1, 0],
          y: [0, -100, -500],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 1.5,
          delay: 0.8
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          className="w-24 h-24 object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        initial={{ y: '110vh', rotate: 0 }}
        animate={{ y: '-110vh', rotate: 0 }}
        transition={{ duration: 2.5, ease: 'easeIn' }}
        onAnimationComplete={onComplete}
      >
        <svg width="120" height="220" viewBox="0 0 120 220">
          {/* Rocket Body */}
          <path d="M60 0 L90 80 L90 160 L30 160 L30 80 Z" fill="#E53E3E" />
          <ellipse cx="60" cy="80" rx="30" ry="80" fill="#F56565" />
          
          {/* Window */}
          <circle cx="60" cy="70" r="20" fill="#63B3ED" stroke="#2D3748" strokeWidth="4" />
          <circle cx="54" cy="64" r="6" fill="white" opacity="0.6" />
          
          {/* Fins */}
          <path d="M30 130 L5 180 L30 160 Z" fill="#C53030" />
          <path d="M90 130 L115 180 L90 160 Z" fill="#C53030" />
          
          {/* Details */}
          <rect x="25" y="140" width="70" height="5" fill="#C53030" />
          <rect x="25" y="150" width="70" height="3" fill="#C53030" />
          
          {/* Fire - larger and more dynamic */}
          <motion.g
            animate={{ scaleY: [1, 1.4, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 0.08, repeat: Infinity }}
          >
            <path d="M40 160 L60 250 L80 160 Z" fill="#F6AD55" />
            <path d="M45 160 L60 220 L75 160 Z" fill="#FBBF24" />
            <path d="M50 160 L60 190 L70 160 Z" fill="#FEF3C7" />
          </motion.g>
        </svg>
        
        {/* Extended trail */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-orange-400/50"
            style={{ 
              left: 45, 
              top: 220 + i * 40,
              width: 30 - i,
              height: 30 - i
            }}
            animate={{ opacity: [0.5, 0], scale: [1, 2.5] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.03 }}
          />
        ))}
      </motion.div>
      
      {/* Screen shake */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -3, 3, -2, 2, 0] }}
        transition={{ duration: 0.3, delay: 0.8, repeat: 3 }}
      />
    </motion.div>
  );
};

// Butterfly swarm transition - enhanced
export const ButterflyTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
  
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-pink-50/50 to-purple-50/50"
    >
      {/* Character being surrounded and carried */}
      <motion.div
        className="absolute z-10"
        style={{ 
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: [1, 1, 0],
          scale: [1, 0.8, 0],
          rotate: [0, 360, 720]
        }}
        transition={{ 
          duration: 2.5,
          delay: 1
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          className="w-28 h-28 object-contain"
        />
      </motion.div>

      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: '-15vw', 
            y: `${Math.random() * 80 + 10}%`,
            rotate: Math.random() * 30 - 15
          }}
          animate={{ 
            x: '115vw',
            y: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
            rotate: [0, 20, -20, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 1.5,
            delay: i * 0.12,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onAnimationComplete={i === 24 ? onComplete : undefined}
        >
          <motion.svg 
            width="55" 
            height="42" 
            viewBox="0 0 55 42"
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          >
            <ellipse cx="27" cy="21" rx="4" ry="14" fill={colors[i % colors.length]} />
            <ellipse cx="14" cy="14" rx="14" ry="11" fill={colors[i % colors.length]} opacity="0.85" />
            <ellipse cx="40" cy="14" rx="14" ry="11" fill={colors[i % colors.length]} opacity="0.85" />
            <ellipse cx="11" cy="28" rx="10" ry="7" fill={colors[i % colors.length]} opacity="0.7" />
            <ellipse cx="43" cy="28" rx="10" ry="7" fill={colors[i % colors.length]} opacity="0.7" />
            {/* Wing patterns */}
            <circle cx="14" cy="14" r="4" fill="white" opacity="0.4" />
            <circle cx="40" cy="14" r="4" fill="white" opacity="0.4" />
          </motion.svg>
        </motion.div>
      ))}
      
      {/* Magical dust */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </motion.div>
  );
};

// Train transition - enhanced
export const TrainTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-gray-100/50 to-amber-50/50"
    >
      {/* Character waiting on track */}
      <HitCharacter delay={2} direction="right" />
      
      {/* Impact effect */}
      <ImpactEffect delay={2} />

      {/* Track */}
      <div className="absolute w-full" style={{ bottom: '22%' }}>
        <div className="h-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600" />
        <div className="h-8 flex justify-around">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-4 h-full bg-amber-800" />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute flex items-end z-20"
        initial={{ x: '-80vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: 5, ease: 'linear' }}
        onAnimationComplete={onComplete}
        style={{ bottom: '25%' }}
      >
        {/* Engine - larger */}
        <svg width="280" height="180" viewBox="0 0 280 180">
          {/* Main body */}
          <rect x="40" y="40" width="200" height="90" rx="8" fill="#DC2626" />
          <rect x="50" y="50" width="180" height="70" rx="5" fill="#EF4444" />
          <rect x="220" y="25" width="50" height="105" rx="5" fill="#B91C1C" />
          
          {/* Chimney */}
          <rect x="70" y="5" width="40" height="45" fill="#374151" />
          <rect x="65" y="0" width="50" height="10" rx="3" fill="#4B5563" />
          <motion.ellipse
            cx="90"
            cy="0"
            rx="25"
            ry="12"
            fill="#9CA3AF"
            animate={{ y: [-10, -50], opacity: [0.9, 0], scale: [1, 2.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.ellipse
            cx="90"
            cy="-20"
            rx="20"
            ry="10"
            fill="#9CA3AF"
            animate={{ y: [-10, -50], opacity: [0.7, 0], scale: [1, 2] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
          
          {/* Windows */}
          <rect x="230" y="35" width="30" height="40" rx="3" fill="#60A5FA" />
          <rect x="235" y="40" width="20" height="30" rx="2" fill="#93C5FD" />
          
          {/* Front detail */}
          <ellipse cx="270" cy="90" rx="8" ry="15" fill="#DC2626" />
          
          {/* Wheels */}
          {[90, 180].map((x, i) => (
            <motion.g
              key={i}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 155px` }}
            >
              <circle cx={x} cy="155" r="28" fill="#1F2937" stroke="#4B5563" strokeWidth="4" />
              <circle cx={x} cy="155" r="12" fill="#374151" />
              <line x1={x} y1="127" x2={x} y2="183" stroke="#4B5563" strokeWidth="3" />
              <line x1={x - 28} y1="155" x2={x + 28} y2="155" stroke="#4B5563" strokeWidth="3" />
            </motion.g>
          ))}
          
          {/* Cow catcher */}
          <path d="M260 130 L290 160 L260 160 Z" fill="#374151" />
        </svg>
        
        {/* Wagons - larger */}
        {[...Array(4)].map((_, i) => (
          <svg key={i} width="180" height="150" viewBox="0 0 180 150">
            <rect x="15" y="40" width="150" height="80" rx="5" fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i]} />
            <rect x="25" y="50" width="40" height="40" rx="3" fill="white" opacity="0.25" />
            <rect x="75" y="50" width="40" height="40" rx="3" fill="white" opacity="0.25" />
            <rect x="125" y="50" width="30" height="40" rx="3" fill="white" opacity="0.25" />
            {[50, 130].map((x, j) => (
              <motion.g
                key={j}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${x}px 135px` }}
              >
                <circle cx={x} cy="135" r="18" fill="#1F2937" />
              </motion.g>
            ))}
          </svg>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Airplane transition - enhanced military transport
export const AirplaneTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-100/50 to-blue-50/50"
    >
      {/* Character being picked up */}
      <motion.div
        className="absolute z-10"
        style={{ 
          left: '50%',
          bottom: '30%',
          transform: 'translateX(-50%)'
        }}
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: [1, 1, 0],
          y: [0, -50, -200],
          x: [0, 100, 300]
        }}
        transition={{ 
          duration: 2,
          delay: 1.2
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          className="w-24 h-24 object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute z-20"
        initial={{ x: '-30vw', y: '65%' }}
        animate={{ x: '130vw', y: '20%' }}
        transition={{ duration: 3.5, ease: [0.3, 0, 0.3, 1] }}
        onAnimationComplete={onComplete}
      >
        <motion.svg 
          width="350" 
          height="140" 
          viewBox="0 0 350 140"
          animate={{ rotate: [-3, 0, -3] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {/* Body */}
          <ellipse cx="175" cy="70" rx="140" ry="35" fill="#E2E8F0" />
          <ellipse cx="175" cy="68" rx="135" ry="32" fill="#F1F5F9" />
          
          {/* Nose */}
          <ellipse cx="310" cy="70" rx="25" ry="22" fill="#CBD5E0" />
          
          {/* Cockpit windows */}
          <path d="M300 55 Q320 60 325 70 Q320 80 300 85" fill="#60A5FA" opacity="0.8" />
          
          {/* Windows */}
          {[...Array(10)].map((_, i) => (
            <circle key={i} cx={80 + i * 25} cy="65" r="8" fill="#60A5FA" />
          ))}
          
          {/* Wings */}
          <path d="M140 70 L80 120 L120 120 L180 70 Z" fill="#CBD5E0" />
          <path d="M140 70 L80 20 L120 20 L180 70 Z" fill="#CBD5E0" />
          
          {/* Engines on wings */}
          <ellipse cx="100" cy="115" rx="20" ry="10" fill="#94A3B8" />
          <ellipse cx="100" cy="25" rx="20" ry="10" fill="#94A3B8" />
          
          {/* Tail */}
          <path d="M35 70 L10 25 L45 40 L45 70 Z" fill="#DC2626" />
          <path d="M35 70 L10 100 L45 90 L45 70 Z" fill="#DC2626" />
          <path d="M35 70 L15 70 L15 50 L35 60 Z" fill="#EF4444" />
          
          {/* Engine trails */}
          {[25, 115].map((y, i) => (
            <motion.ellipse
              key={i}
              cx={70}
              cy={y}
              rx="40"
              ry="6"
              fill="white"
              opacity="0.4"
              animate={{ scaleX: [1, 2, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.svg>
        
        {/* Contrails */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: -300, width: 400 }}
        >
          <motion.div
            className="h-6 bg-gradient-to-l from-white/50 to-transparent rounded-full"
            animate={{ opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
      
      {/* Clouds */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            width: 100 + Math.random() * 80,
            height: 40 + Math.random() * 30,
            left: `${20 + i * 20}%`,
            top: `${20 + Math.random() * 30}%`,
          }}
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
};

export const transitions = [
  TankTransition,
  BuffaloTransition,
  DragonTransition,
  ElephantTransition,
  FighterJetTransition,
  BirdFlockTransition,
  RocketTransition,
  ButterflyTransition,
  TrainTransition,
  AirplaneTransition
];
