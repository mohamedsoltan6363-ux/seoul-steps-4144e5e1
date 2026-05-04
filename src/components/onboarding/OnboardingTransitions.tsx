import React from 'react';
import { motion } from 'framer-motion';
import characterImage from '@/assets/onboarding-character.png';
import { Model3DView } from './Model3D';

// ============================================================
// SHARED HELPERS
// ============================================================
const calculateImpactTime = (totalDuration: number, startPosition: number = -60, endPosition: number = 150) => {
  const totalDistance = endPosition - startPosition;
  const distanceToCenter = 50 - startPosition;
  return totalDuration * (distanceToCenter / totalDistance);
};

// Hit character: stands waiting, then gets launched on impact
const HitCharacter: React.FC<{ impactTime: number; direction: 'left' | 'right' | 'up' | 'explode' | 'down' }> = ({ impactTime, direction }) => {
  const launchAnim = () => {
    switch (direction) {
      case 'explode': return { opacity: [1, 1, 0], scale: [1, 1.8, 0], rotate: [0, 180, 540] };
      case 'up': return { opacity: [1, 1, 0], y: [0, -200, -600], rotate: [0, 360, 720] };
      case 'down': return { opacity: [1, 1, 0], y: [0, 100, 350], scale: [1, 0.7, 0.2] };
      default: return {
        opacity: [1, 1, 0],
        x: direction === 'right' ? [0, 250, 600] : [0, -250, -600],
        y: [0, -180, -120],
        rotate: direction === 'right' ? [0, 320, 640] : [0, -320, -640],
      };
    }
  };
  return (
    <>
      {/* Standing/waiting phase - visible BEFORE impact */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1.05, 1],
          y: [0, 0, -5, 0],
        }}
        transition={{
          duration: impactTime,
          times: [0, 0.25, 0.85, 1],
          ease: 'easeOut',
        }}
      >
        <motion.img
          src={characterImage}
          alt="Character"
          className="w-40 h-40 object-contain drop-shadow-2xl"
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {/* Worried face emoji */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl"
          animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          😰
        </motion.div>
      </motion.div>

      {/* Launch phase - happens AT impact */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0 }}
        animate={launchAnim()}
        transition={{ duration: 1.5, delay: impactTime, ease: 'easeOut' }}
      >
        <img src={characterImage} alt="Character" className="w-40 h-40 object-contain drop-shadow-2xl" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 80}%`,
              top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 80}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 0] }}
            transition={{ duration: 0.6, delay: impactTime + i * 0.04 }}
          >💥</motion.div>
        ))}
      </motion.div>
    </>
  );
};

const ImpactEffect: React.FC<{ delay: number; color?: string }> = ({ delay, color = '#fbbf24' }) => (
  <>
    <motion.div
      className="absolute inset-0 bg-white z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.85, 0] }}
      transition={{ duration: 0.3, delay }}
    />
    <motion.div
      className="absolute z-30 rounded-full border-[6px]"
      style={{ left: '50%', bottom: '30%', transform: 'translate(-50%, 50%)', borderColor: color }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: [0, 450], height: [0, 450], opacity: [1, 0] }}
      transition={{ duration: 0.55, delay }}
    />
    <motion.div
      className="absolute inset-0"
      animate={{ x: [0, -10, 10, -8, 8, -5, 5, 0], y: [0, 5, -5, 4, -4, 2, -2, 0] }}
      transition={{ duration: 0.45, delay }}
    />
  </>
);

const ExplosionEffect: React.FC<{ delay: number }> = ({ delay }) => (
  <>
    <motion.div
      className="absolute z-30"
      style={{ left: '50%', bottom: '30%', transform: 'translate(-50%, 50%)' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 2.5, 4, 5] }}
      transition={{ duration: 0.9, delay }}
    >
      <div className="w-40 h-40 rounded-full" style={{
        background: 'radial-gradient(circle, #fde047 0%, #f97316 40%, #dc2626 80%, transparent 100%)',
        filter: 'blur(8px)',
      }} />
    </motion.div>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full z-30"
        style={{
          left: '50%', bottom: '30%',
          width: 15 + Math.random() * 35, height: 15 + Math.random() * 35,
          background: ['#fbbf24', '#f97316', '#dc2626', '#fde047'][i % 4],
        }}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: (Math.random() - 0.5) * 500,
          y: -Math.random() * 300 - 50,
          scale: [0, 1.8, 0],
        }}
        transition={{ duration: 0.8, delay: delay + i * 0.02 }}
      />
    ))}
    <motion.div
      className="absolute inset-0 bg-white z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.25, delay }}
    />
  </>
);

// 1. TANK
export const TankTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 6.5;
  const impactTime = calculateImpactTime(totalDuration, -60, 150);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-amber-50/60 to-orange-100/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#f59e0b" />
      <motion.div
        className="absolute z-20" style={{ bottom: '18%' }}
        initial={{ x: '-60vw' }} animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }}
        onAnimationComplete={onComplete}
      >
        <svg width="450" height="260" viewBox="0 0 450 260">
          <rect x="20" y="180" width="380" height="50" rx="20" fill="#1f2937" />
          {[60, 130, 200, 270, 340].map((x, i) => (
            <motion.circle key={i} cx={x} cy="205" r="28" fill="#0f172a" stroke="#374151" strokeWidth="4"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 205px` }} />
          ))}
          <path d="M40 175 L70 105 L370 105 L400 175 Z" fill="#4b5d3e" />
          <ellipse cx="220" cy="105" rx="80" ry="25" fill="#5a6e4a" />
          <path d="M150 105 L165 50 L290 50 L305 105 Z" fill="#4b5d3e" />
          <rect x="295" y="68" width="160" height="20" fill="#374151" />
          <rect x="445" y="62" width="22" height="32" fill="#1f2937" />
          {[0, 1, 2].map(i => (
            <motion.ellipse key={i} cx={30 - i * 25} cy={140} rx="20" ry="15" fill="#6b7280" opacity={0.5}
              animate={{ x: -50, y: -30, scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 2. BUFFALO/COW
export const BuffaloTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 6;
  const impactTime = calculateImpactTime(totalDuration, -55, 150);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-green-50/60 to-amber-50/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#fb7185" />
      <motion.div className="absolute z-20" style={{ bottom: '15%' }}
        initial={{ x: '-55vw' }} animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <motion.svg width="420" height="280" viewBox="0 0 420 280" animate={{ y: [0, -12, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
          <ellipse cx="210" cy="265" rx="150" ry="18" fill="rgba(0,0,0,0.2)" />
          <ellipse cx="200" cy="150" rx="125" ry="70" fill="#f5f5dc" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="170" cy="125" rx="35" ry="25" fill="#1f2937" />
          <ellipse cx="240" cy="160" rx="30" ry="22" fill="#1f2937" />
          <ellipse cx="345" cy="125" rx="50" ry="45" fill="#f5f5dc" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="385" cy="140" rx="25" ry="20" fill="#fbb6ce" stroke="#1f2937" strokeWidth="2" />
          <path d="M320 80 Q310 60 315 50" stroke="#a16207" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M370 80 Q380 60 375 50" stroke="#a16207" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="335" cy="110" r="6" fill="#0f172a" />
          <circle cx="360" cy="110" r="6" fill="#0f172a" />
          {[120, 165, 240, 285].map((x, i) => (
            <motion.rect key={i} x={x} y="200" width="20" height="65" fill="#f5f5dc" stroke="#1f2937" strokeWidth="2"
              animate={{ rotate: i % 2 === 0 ? [-15, 15, -15] : [15, -15, 15] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: `${x + 10}px 210px` }} />
          ))}
          <motion.g animate={{ opacity: [0.7, 0.2, 0.7], x: [0, 15, 0] }} transition={{ duration: 0.4, repeat: Infinity }}>
            <ellipse cx="410" cy="135" rx="10" ry="5" fill="white" opacity="0.6" />
          </motion.g>
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

// 3. RPG
// 3. RPG - masked shooter on left + rocket flying right
export const RPGTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = calculateImpactTime(totalDuration, -40, 100);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-stone-100/70 to-orange-100/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />

      {/* Masked shooter standing on the left */}
      <motion.div
        className="absolute z-15"
        style={{ left: '5%', bottom: '15%' }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: [0, 1, 1, 0.8], x: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <svg width="180" height="280" viewBox="0 0 180 280">
          {/* Shadow */}
          <ellipse cx="90" cy="270" rx="60" ry="8" fill="rgba(0,0,0,0.3)" />
          {/* Legs */}
          <rect x="65" y="180" width="22" height="85" fill="#1c1917" rx="4" />
          <rect x="93" y="180" width="22" height="85" fill="#1c1917" rx="4" />
          {/* Boots */}
          <ellipse cx="76" cy="268" rx="18" ry="8" fill="#0a0a0a" />
          <ellipse cx="104" cy="268" rx="18" ry="8" fill="#0a0a0a" />
          {/* Body / vest */}
          <rect x="55" y="100" width="70" height="90" fill="#3f3f46" rx="8" />
          <rect x="58" y="115" width="64" height="15" fill="#52525b" />
          <rect x="58" y="140" width="64" height="15" fill="#52525b" />
          {/* Head with mask (balaclava) */}
          <circle cx="90" cy="80" r="30" fill="#1c1917" />
          {/* Eyes slot */}
          <rect x="68" y="72" width="44" height="10" rx="5" fill="#fef3c7" />
          <circle cx="80" cy="77" r="3" fill="#0f172a" />
          <circle cx="100" cy="77" r="3" fill="#0f172a" />
          {/* Arms holding RPG */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            style={{ transformOrigin: '90px 130px' }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <rect x="120" y="115" width="50" height="18" fill="#1c1917" rx="6" />
            <rect x="20" y="120" width="50" height="16" fill="#1c1917" rx="6" />
          </motion.g>
        </svg>
      </motion.div>

      {/* RPG rocket flying */}
      <motion.div className="absolute z-20" style={{ top: '60%' }}
        initial={{ x: '-15vw', rotate: 0 }} animate={{ x: '100vw', rotate: 0 }}
        transition={{ duration: totalDuration * 0.7, delay: 0.6, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="280" height="80" viewBox="0 0 280 80">
          <rect x="20" y="30" width="180" height="20" rx="10" fill="#374151" />
          <path d="M200 25 L260 40 L200 55 Z" fill="#dc2626" />
          <circle cx="240" cy="40" r="8" fill="#fbbf24" />
          {[0, 1, 2, 3].map(i => (
            <motion.circle key={i} cx={20 - i * 20} cy={40} r={10 - i * 2} fill={['#fde047', '#fb923c', '#dc2626', '#7f1d1d'][i]}
              animate={{ x: -30, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 4. ELEPHANT - with proper legs and trunk
export const ElephantTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 7;
  const impactTime = calculateImpactTime(totalDuration, -65, 150);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-stone-100/60 to-amber-100/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="up" />
      <ImpactEffect delay={impactTime} color="#a8a29e" />
      <motion.div className="absolute z-20" style={{ bottom: '10%' }}
        initial={{ x: '-65vw' }} animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <motion.svg width="540" height="420" viewBox="0 0 540 420" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
          {/* Shadow */}
          <ellipse cx="270" cy="405" rx="220" ry="20" fill="rgba(0,0,0,0.3)" />
          
          {/* Body - large rounded */}
          <ellipse cx="240" cy="220" rx="180" ry="115" fill="#9ca3af" stroke="#4b5563" strokeWidth="4" />
          
          {/* Belly highlight */}
          <ellipse cx="240" cy="250" rx="140" ry="70" fill="#d1d5db" opacity="0.5" />
          
          {/* Head */}
          <ellipse cx="420" cy="195" rx="90" ry="85" fill="#9ca3af" stroke="#4b5563" strokeWidth="4" />
          
          {/* Big floppy ear */}
          <motion.path d="M355 145 Q310 130 305 195 Q310 245 365 230 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="3"
            animate={{ rotate: [-8, 8, -8] }} style={{ transformOrigin: '360px 190px' }}
            transition={{ duration: 0.6, repeat: Infinity }} />
          
          {/* TRUNK - long curved trunk */}
          <motion.path
            d="M488 215 Q540 250 530 310 Q525 350 505 375 Q490 395 475 380"
            stroke="#9ca3af" strokeWidth="42" fill="none" strokeLinecap="round"
            animate={{ rotate: [-4, 4, -4] }} style={{ transformOrigin: '488px 215px' }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.path
            d="M488 215 Q540 250 530 310 Q525 350 505 375 Q490 395 475 380"
            stroke="#4b5563" strokeWidth="44" fill="none" strokeLinecap="round" opacity="0.3"
            animate={{ rotate: [-4, 4, -4] }} style={{ transformOrigin: '488px 215px' }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          
          {/* Tusks */}
          <path d="M455 240 Q470 270 463 295" stroke="#fef3c7" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M478 240 Q493 270 486 295" stroke="#fef3c7" strokeWidth="12" fill="none" strokeLinecap="round" />
          
          {/* Eye */}
          <circle cx="415" cy="175" r="10" fill="white" />
          <circle cx="417" cy="178" r="6" fill="#0f172a" />
          
          {/* LEGS - 4 thick legs clearly visible */}
          {[
            { x: 110, y: 305 }, { x: 195, y: 310 },
            { x: 290, y: 310 }, { x: 365, y: 305 }
          ].map((leg, i) => (
            <motion.g key={i}
              animate={{ y: i % 2 === 0 ? [0, -15, 0] : [-15, 0, -15] }}
              transition={{ duration: 0.5, repeat: Infinity }}>
              <rect x={leg.x} y={leg.y} width="48" height="100" fill="#9ca3af" stroke="#4b5563" strokeWidth="3" rx="6" />
              {/* Foot */}
              <ellipse cx={leg.x + 24} cy={leg.y + 100} rx="28" ry="10" fill="#6b7280" stroke="#4b5563" strokeWidth="3" />
              {/* Toenails */}
              <circle cx={leg.x + 8} cy={leg.y + 100} r="4" fill="#fef3c7" />
              <circle cx={leg.x + 24} cy={leg.y + 102} r="4" fill="#fef3c7" />
              <circle cx={leg.x + 40} cy={leg.y + 100} r="4" fill="#fef3c7" />
            </motion.g>
          ))}
          
          {/* Tail */}
          <motion.path d="M65 220 Q35 240 25 275 L20 285" stroke="#9ca3af" strokeWidth="14" fill="none" strokeLinecap="round"
            animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: '65px 220px' }}
            transition={{ duration: 0.6, repeat: Infinity }} />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

// 5. FIGHTER JET (slowed down)
export const FighterJetTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 6;
  const impactTime = calculateImpactTime(totalDuration, -50, 130);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-sky-100/60 to-blue-200/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />
      <motion.div className="absolute z-20" style={{ top: '25%' }}
        initial={{ x: '-50vw' }} animate={{ x: '130vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="320" height="120" viewBox="0 0 320 120">
          <path d="M30 60 L240 50 L290 60 L240 70 Z" fill="#475569" />
          <path d="M100 50 L130 20 L180 20 L160 50 Z" fill="#334155" />
          <path d="M100 70 L130 100 L180 100 L160 70 Z" fill="#334155" />
          <ellipse cx="270" cy="60" rx="20" ry="12" fill="#0f172a" />
          {[0, 1, 2].map(i => (
            <motion.ellipse key={i} cx={20 - i * 15} cy={60} rx={10 - i * 2} ry={6 - i} fill={['#fbbf24', '#f97316', '#dc2626'][i]}
              animate={{ x: -30, opacity: 0, scaleX: 2 }} transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 6. KID THROWING BRICK - kid visible on left side
export const KidThrowTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4.5;
  const impactTime = calculateImpactTime(totalDuration, -10, 90);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-yellow-50/60 to-orange-50/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="left" />
      <ImpactEffect delay={impactTime} color="#dc2626" />

      {/* The naughty kid throwing - visible on the left */}
      <motion.div
        className="absolute z-15"
        style={{ left: '4%', bottom: '15%' }}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: [0, 1, 1, 0.9], x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <svg width="160" height="240" viewBox="0 0 160 240">
          <ellipse cx="80" cy="232" rx="55" ry="6" fill="rgba(0,0,0,0.25)" />
          <rect x="55" y="160" width="20" height="70" fill="#1d4ed8" rx="4" />
          <rect x="85" y="160" width="20" height="70" fill="#1d4ed8" rx="4" />
          <ellipse cx="65" cy="232" rx="16" ry="6" fill="#dc2626" />
          <ellipse cx="95" cy="232" rx="16" ry="6" fill="#dc2626" />
          <rect x="48" y="95" width="64" height="75" fill="#ef4444" rx="10" />
          <circle cx="80" cy="65" r="28" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
          <path d="M55 50 Q80 30 105 50 Q100 40 80 38 Q60 40 55 50 Z" fill="#451a03" />
          <circle cx="71" cy="63" r="3.5" fill="#0f172a" />
          <circle cx="89" cy="63" r="3.5" fill="#0f172a" />
          <path d="M70 78 Q80 86 90 78" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <motion.g
            animate={{ rotate: [-30, 60, -30] }}
            style={{ transformOrigin: '110px 110px' }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <rect x="105" y="105" width="50" height="14" fill="#fde68a" stroke="#92400e" strokeWidth="2" rx="6" />
          </motion.g>
          <rect x="20" y="110" width="40" height="14" fill="#fde68a" stroke="#92400e" strokeWidth="2" rx="6" />
        </svg>
      </motion.div>

      <motion.div className="absolute z-20" style={{ top: '40%' }}
        initial={{ x: '-5vw', y: 0, rotate: 0 }}
        animate={{ x: '90vw', y: [0, -120, 0, -60, 0], rotate: 720 }}
        transition={{ duration: totalDuration * 0.85, delay: 0.5, ease: 'linear' }}
        onAnimationComplete={onComplete}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <rect x="5" y="10" width="70" height="40" fill="#b45309" stroke="#78350f" strokeWidth="3" rx="4" />
          <line x1="5" y1="25" x2="75" y2="25" stroke="#78350f" strokeWidth="2" />
          <line x1="5" y1="40" x2="75" y2="40" stroke="#78350f" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 7. HELICOPTER
export const HelicopterTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = calculateImpactTime(totalDuration, -40, 120);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-slate-100/60 to-zinc-200/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#1e293b" />
      <motion.div className="absolute z-20" style={{ top: '20%' }}
        initial={{ x: '-40vw' }} animate={{ x: '120vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="280" height="180" viewBox="0 0 280 180">
          <ellipse cx="140" cy="100" rx="80" ry="35" fill="#475569" />
          <rect x="60" y="90" width="160" height="20" fill="#334155" />
          <path d="M210 95 L260 100 L210 115" fill="#475569" />
          <motion.g style={{ transformOrigin: '140px 60px' }} animate={{ rotate: 360 }} transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}>
            <rect x="20" y="58" width="240" height="4" fill="#0f172a" />
            <rect x="138" y="40" width="4" height="40" fill="#0f172a" />
          </motion.g>
          <line x1="140" y1="62" x2="140" y2="80" stroke="#1f2937" strokeWidth="3" />
          <line x1="80" y1="135" x2="200" y2="135" stroke="#1f2937" strokeWidth="4" />
          <line x1="100" y1="115" x2="100" y2="135" stroke="#1f2937" strokeWidth="3" />
          <line x1="180" y1="115" x2="180" y2="135" stroke="#1f2937" strokeWidth="3" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 8. ROCKET
export const RocketTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 3;
  const impactTime = calculateImpactTime(totalDuration, -30, 100);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-blue-100/60 to-indigo-200/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />
      <motion.div className="absolute z-20" style={{ top: '35%' }}
        initial={{ x: '-30vw' }} animate={{ x: '100vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="180" height="80" viewBox="0 0 180 80">
          <path d="M20 40 L120 25 L150 40 L120 55 Z" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
          <path d="M150 40 L165 30 L165 50 Z" fill="#dc2626" />
          <circle cx="100" cy="40" r="6" fill="#3b82f6" />
          {[0, 1, 2, 3].map(i => (
            <motion.ellipse key={i} cx={15 - i * 15} cy={40} rx={12 - i * 2} ry={7 - i} fill={['#fde047', '#f97316', '#dc2626', '#7f1d1d'][i]}
              animate={{ x: -40, opacity: 0, scaleX: 2.5 }} transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 9. TRAIN
export const TrainTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = calculateImpactTime(totalDuration, -50, 140);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-slate-100/60 to-zinc-100/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#0ea5e9" />
      <motion.div className="absolute z-20" style={{ bottom: '20%' }}
        initial={{ x: '-50vw' }} animate={{ x: '140vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="500" height="180" viewBox="0 0 500 180">
          <rect x="20" y="40" width="460" height="100" rx="12" fill="#0ea5e9" stroke="#075985" strokeWidth="3" />
          <path d="M450 40 L490 90 L450 140 Z" fill="#0284c7" />
          {[60, 130, 200, 270, 340, 410].map((x, i) => (
            <rect key={i} x={x} y="60" width="40" height="40" fill="#bae6fd" stroke="#075985" strokeWidth="2" rx="4" />
          ))}
          {[80, 200, 320, 420].map((x, i) => (
            <motion.circle key={i} cx={x} cy="155" r="22" fill="#1e293b" stroke="#475569" strokeWidth="3"
              animate={{ rotate: 360 }} transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 155px` }} />
          ))}
          {[0, 1, 2].map(i => (
            <motion.circle key={i} cx={50 - i * 15} cy={20} r={12 - i * 2} fill="white" opacity={0.7 - i * 0.2}
              animate={{ y: -25, scale: 2, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// 10. 🌊 TSUNAMI WAVE
export const TsunamiTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4.5;
  const impactTime = calculateImpactTime(totalDuration, -100, 100);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #bae6fd 0%, #0ea5e9 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#0284c7" />
      <motion.div
        className="absolute z-20 bottom-0"
        initial={{ x: '-100vw' }}
        animate={{ x: '100vw' }}
        transition={{ duration: totalDuration, ease: 'easeInOut' }}
        onAnimationComplete={onComplete}
        style={{ width: '120vw', height: '70vh' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 700" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 400 Q150 100 350 250 Q550 400 750 200 Q950 50 1200 300 L1200 700 L0 700 Z"
            fill="url(#waveGrad)"
            animate={{ d: [
              "M0 400 Q150 100 350 250 Q550 400 750 200 Q950 50 1200 300 L1200 700 L0 700 Z",
              "M0 380 Q150 130 350 230 Q550 380 750 220 Q950 80 1200 280 L1200 700 L0 700 Z",
              "M0 400 Q150 100 350 250 Q550 400 750 200 Q950 50 1200 300 L1200 700 L0 700 Z",
            ]}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          {[...Array(15)].map((_, i) => (
            <motion.circle key={i} cx={100 + i * 75} cy={150 + Math.sin(i) * 80} r={20 + (i % 3) * 10}
              fill="white" opacity={0.6}
              animate={{ y: [-10, 10, -10] }} transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }} />
          ))}
        </svg>
      </motion.div>
      {[...Array(40)].map((_, i) => (
        <motion.div key={i} className="absolute w-0.5 h-8 bg-blue-200 z-10"
          style={{ left: `${(i * 2.5) % 100}%`, top: '-30px' }}
          animate={{ y: '110vh' }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }} />
      ))}
    </motion.div>
  );
};

// 11. 🌋 VOLCANO ERUPTION
export const VolcanoTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = totalDuration * 0.5;
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #7f1d1d 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />
      <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
        animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 0.3, repeat: Infinity }}>
        <svg width="500" height="400" viewBox="0 0 500 400">
          <path d="M50 400 L180 100 L320 100 L450 400 Z" fill="#44403c" stroke="#1c1917" strokeWidth="4" />
          <path d="M180 100 L250 50 L320 100 Z" fill="#7c2d12" />
          <motion.path d="M180 100 Q200 130 195 170 Q190 220 220 250"
            stroke="#ea580c" strokeWidth="20" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.5, repeat: Infinity }} />
          <motion.path d="M320 100 Q300 130 305 170 Q310 220 280 250"
            stroke="#ea580c" strokeWidth="20" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
        </svg>
      </motion.div>
      {[...Array(25)].map((_, i) => (
        <motion.div key={i} className="absolute z-20 rounded-full"
          style={{
            left: '50%', bottom: '60%',
            width: 15 + Math.random() * 25, height: 15 + Math.random() * 25,
            background: `radial-gradient(circle, #fde047, #f97316 50%, #dc2626)`,
            boxShadow: '0 0 20px #f97316',
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [0, -300, 400],
            x: (Math.random() - 0.5) * 800,
            opacity: [0, 1, 0],
            rotate: 360,
          }}
          transition={{ duration: 2.5, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-stone-700 z-15"
          style={{ left: `${40 + i * 3}%`, top: '15%', width: 80, height: 80, filter: 'blur(15px)', opacity: 0.6 }}
          animate={{ y: [-50, -200], scale: [1, 3], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0 }}
        transition={{ duration: totalDuration }}
        onAnimationComplete={onComplete} />
    </motion.div>
  );
};

// 12. ☄️ METEOR FROM SPACE
export const MeteorTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = totalDuration * 0.7;
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #312e81 0%, #0f172a 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="down" />
      <ExplosionEffect delay={impactTime} />
      {[...Array(50)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full"
          style={{ left: `${(i * 3) % 100}%`, top: `${(i * 7) % 60}%` }}
          animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1 + (i % 3), repeat: Infinity, delay: i * 0.05 }} />
      ))}
      <motion.div
        className="absolute z-20"
        initial={{ left: '-10%', top: '-10%', rotate: 45 }}
        animate={{ left: '50%', top: '60%', rotate: 45 }}
        transition={{ duration: totalDuration, ease: 'easeIn' }}
        onAnimationComplete={onComplete}
      >
        <div className="relative">
          <div className="absolute -top-2 -left-96 w-96 h-12 origin-right"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #fde047 30%, #f97316 60%, #dc2626 100%)',
              filter: 'blur(8px)',
              transform: 'rotate(-3deg)',
            }} />
          <div className="relative w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #fbbf24, #ea580c 50%, #7f1d1d 90%)',
              boxShadow: '0 0 40px #f97316, 0 0 80px #dc2626',
            }} />
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{ left: '50%', top: '50%' }}
              animate={{ x: -50 - i * 20, y: (Math.random() - 0.5) * 60, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// 13. 🐉 FIRE DRAGON
export const DragonTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = calculateImpactTime(totalDuration, -50, 130);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #7c2d12 50%, #fbbf24 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />
      <motion.div className="absolute z-20" style={{ top: '20%' }}
        initial={{ x: '-50vw' }} animate={{ x: '130vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <motion.svg width="500" height="280" viewBox="0 0 500 280"
          animate={{ y: [0, -20, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
          <motion.g animate={{ rotate: [-15, 15, -15] }} style={{ transformOrigin: '200px 100px' }} transition={{ duration: 0.4, repeat: Infinity }}>
            <path d="M150 100 Q100 30 200 50 Q220 80 200 110 Z" fill="#7f1d1d" stroke="#3f0d0d" strokeWidth="2" />
            <path d="M250 100 Q300 30 200 50 Q180 80 200 110 Z" fill="#7f1d1d" stroke="#3f0d0d" strokeWidth="2" />
          </motion.g>
          <ellipse cx="200" cy="160" rx="120" ry="40" fill="#15803d" stroke="#052e16" strokeWidth="3" />
          {[140, 170, 200, 230, 260].map((x, i) => (
            <path key={i} d={`M${x} 130 L${x + 15} 145 L${x} 160 L${x - 15} 145 Z`} fill="#22c55e" stroke="#052e16" strokeWidth="1" />
          ))}
          <ellipse cx="350" cy="150" rx="70" ry="50" fill="#15803d" stroke="#052e16" strokeWidth="3" />
          <path d="M330 110 L325 80 L340 100 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
          <path d="M360 105 L370 75 L380 100 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
          <circle cx="365" cy="140" r="10" fill="#fbbf24" />
          <circle cx="365" cy="140" r="5" fill="#000" />
          <path d="M380 165 Q400 175 420 165" stroke="#000" strokeWidth="3" fill="none" />
          {[0, 1, 2, 3, 4].map(i => (
            <motion.ellipse key={i} cx={420 + i * 30} cy={165} rx={20 + i * 5} ry={10 + i * 3}
              fill={['#fde047', '#f97316', '#dc2626', '#7f1d1d', '#3f0d0d'][i]}
              animate={{ x: 30, opacity: [0.9, 0.4, 0], scaleX: 1.5 }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }} />
          ))}
          <motion.path d="M80 160 Q40 170 30 200" stroke="#15803d" strokeWidth="20" fill="none" strokeLinecap="round"
            animate={{ rotate: [-10, 10, -10] }} style={{ transformOrigin: '80px 160px' }}
            transition={{ duration: 0.5, repeat: Infinity }} />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

// 14. 🌪️ TORNADO
export const TornadoTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4;
  const impactTime = calculateImpactTime(totalDuration, -50, 120);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4b5563 0%, #1f2937 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="up" />
      <ImpactEffect delay={impactTime} color="#9ca3af" />
      {[0.5, 1.2, 2, 2.8].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 bg-white z-30"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.15, delay }} />
      ))}
      <motion.div className="absolute z-20 bottom-0"
        initial={{ x: '-50vw' }} animate={{ x: '120vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <motion.svg width="350" height="600" viewBox="0 0 350 600"
          animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 0.3, repeat: Infinity }}>
          <motion.path
            d="M175 0 Q120 100 100 200 Q80 300 110 400 Q130 500 175 600 Q220 500 240 400 Q270 300 250 200 Q230 100 175 0 Z"
            fill="url(#tornadoGrad)" opacity={0.85}
          />
          <defs>
            <linearGradient id="tornadoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f2937" stopOpacity={0.5} />
              <stop offset="50%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <motion.circle key={i}
              cx={175 + Math.cos(i) * (60 + i * 3)}
              cy={50 + i * 28}
              r={3 + (i % 3)}
              fill={['#78350f', '#44403c', '#78716c'][i % 3]}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `175px ${50 + i * 28}px` }} />
          ))}
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

// 15. ⚡ EARTHQUAKE / GROUND SPLIT
export const EarthquakeTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = totalDuration * 0.4;
  React.useEffect(() => {
    const t = setTimeout(onComplete, totalDuration * 1000);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #92400e 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0"
        animate={{ x: [0, -20, 20, -15, 15, -10, 10, -5, 5, 0], y: [0, 10, -10, 8, -8, 5, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0 }}>
        <HitCharacter impactTime={impactTime} direction="down" />
        <motion.div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: '40%' }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <rect x="0" y="0" width="1000" height="400" fill="#78350f" />
            <motion.path
              d="M0 100 L300 120 L350 80 L500 200 L550 50 L700 180 L1000 100 L1000 400 L0 400 Z"
              fill="#1c1917"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ transformOrigin: 'center bottom' }}
            />
            <motion.path
              d="M0 130 L300 150 L350 110 L500 230 L550 80 L700 210 L1000 130 L1000 250 L700 240 L550 130 L500 280 L350 160 L300 200 L0 180 Z"
              fill="url(#lavaGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            />
            <defs>
              <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} className="absolute z-15 rounded-md bg-stone-700"
            style={{ left: `${i * 7}%`, top: '-50px', width: 20 + (i % 3) * 10, height: 20 + (i % 3) * 10 }}
            animate={{ y: '110vh', rotate: 360 }}
            transition={{ duration: 1.5 + Math.random(), delay: i * 0.1, repeat: Infinity }} />
        ))}
        <ImpactEffect delay={impactTime} color="#dc2626" />
      </motion.div>
    </motion.div>
  );
};

// 16. ❄️ ICE / FROZEN BLAST
export const IceBlastTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5;
  const impactTime = calculateImpactTime(totalDuration, -40, 120);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #0c4a6e 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ImpactEffect delay={impactTime} color="#7dd3fc" />
      <motion.div className="absolute z-20" style={{ top: '40%' }}
        initial={{ x: '-40vw' }} animate={{ x: '120vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <motion.svg width="200" height="200" viewBox="0 0 200 200"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <defs>
            <linearGradient id="iceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path d="M100 100 L100 20 L95 30 M100 20 L105 30 M100 50 L90 60 M100 50 L110 60" stroke="url(#iceGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
            </g>
          ))}
          <circle cx="100" cy="100" r="15" fill="url(#iceGrad)" />
        </motion.svg>
      </motion.div>
      {[...Array(60)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          style={{ left: `${(i * 1.7) % 100}%`, top: '-10px' }}
          animate={{ y: '110vh', x: [(Math.random() - 0.5) * 50] }}
          transition={{ duration: 3 + Math.random() * 2, delay: i * 0.04, repeat: Infinity }} />
      ))}
    </motion.div>
  );
};

// 17. ⚡ THUNDER STRIKE
export const ThunderTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4.5;
  const impactTime = totalDuration * 0.5;
  React.useEffect(() => {
    const t = setTimeout(onComplete, totalDuration * 1000);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #581c87 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ImpactEffect delay={impactTime} color="#fde047" />
      {[0.3, 0.6, 1, 1.4, 1.7].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 bg-yellow-100 z-30"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.18, delay }} />
      ))}
      <motion.svg
        className="absolute z-25"
        style={{ left: '50%', top: 0, transform: 'translateX(-50%)', height: '70vh', transformOrigin: 'top' }}
        width="200" viewBox="0 0 200 600"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scaleY: 1 }}
        transition={{ duration: 0.8, delay: impactTime - 0.1 }}
      >
        <path d="M100 0 L70 200 L130 200 L60 400 L150 400 L80 600"
          stroke="#fde047" strokeWidth="12" fill="none" strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 30px #fde047) drop-shadow(0 0 60px #facc15)' }} />
        <path d="M100 0 L70 200 L130 200 L60 400 L150 400 L80 600"
          stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" />
      </motion.svg>
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-slate-700 z-10"
          style={{ left: `${i * 18}%`, top: '5%', width: 200, height: 100, filter: 'blur(20px)', opacity: 0.7 }}
          animate={{ x: [0, 30, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </motion.div>
  );
};

// ============================================================
// 18. 🚜 BULLDOZER - pushes character right
// ============================================================
export const BulldozerTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 6;
  const impactTime = calculateImpactTime(totalDuration, -55, 150);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-yellow-50/70 to-amber-100/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#f59e0b" />
      <motion.div className="absolute z-20" style={{ bottom: '15%' }}
        initial={{ x: '-55vw' }} animate={{ x: '150vw' }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="480" height="280" viewBox="0 0 480 280">
          <ellipse cx="240" cy="270" rx="200" ry="10" fill="rgba(0,0,0,0.25)" />
          <path d="M380 80 L470 200 L470 230 L380 230 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="4" />
          <path d="M385 90 L455 200 L385 200 Z" fill="#fde68a" />
          <rect x="80" y="100" width="280" height="100" rx="10" fill="#f59e0b" stroke="#78350f" strokeWidth="4" />
          <rect x="120" y="60" width="180" height="60" rx="8" fill="#fbbf24" stroke="#78350f" strokeWidth="4" />
          <rect x="135" y="72" width="150" height="36" fill="#0c4a6e" opacity="0.7" />
          <rect x="40" y="195" width="340" height="40" rx="20" fill="#1f2937" />
          {[80, 150, 220, 290, 350].map((x, i) => (
            <motion.circle key={i} cx={x} cy="220" r="22" fill="#0f172a" stroke="#374151" strokeWidth="3"
              animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${x}px 220px` }} />
          ))}
          {[0, 1, 2].map(i => (
            <motion.circle key={i} cx={20 - i * 18} cy={120 + i * 5} r={14 - i * 3} fill="#78716c" opacity={0.5}
              animate={{ x: -40, y: -20, opacity: 0, scale: 2 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }} />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// 19. 🏗️ WRECKING BALL - swings into character
// ============================================================
export const WreckingBallTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 5.5;
  const impactTime = totalDuration * 0.55;
  React.useEffect(() => {
    const t = setTimeout(onComplete, totalDuration * 1000);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-slate-200/70 to-zinc-300/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="left" />
      <ImpactEffect delay={impactTime} color="#475569" />
      {/* Crane on right */}
      <div className="absolute right-4 top-0 bottom-0 z-10">
        <svg width="240" height="100%" viewBox="0 0 240 700" preserveAspectRatio="xMidYMin meet">
          <rect x="100" y="50" width="20" height="650" fill="#374151" />
          <rect x="40" y="40" width="180" height="20" fill="#374151" />
          {/* Pivot point at top-left of arm */}
          <motion.g
            style={{ transformOrigin: '40px 50px' }}
            animate={{ rotate: [-50, 50, -50] }}
            transition={{ duration: totalDuration / 2, repeat: 1, ease: 'easeInOut' }}
          >
            <line x1="40" y1="60" x2="40" y2="280" stroke="#1f2937" strokeWidth="4" />
            <circle cx="40" cy="320" r="45" fill="#374151" stroke="#0f172a" strokeWidth="4" />
            <circle cx="30" cy="310" r="10" fill="#6b7280" />
          </motion.g>
        </svg>
      </div>
      {/* Dust on impact */}
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} className="absolute z-25 rounded-full bg-stone-400"
          style={{ left: '50%', bottom: '30%', width: 20 + i, height: 20 + i, opacity: 0.6, filter: 'blur(4px)' }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: (Math.random() - 0.5) * 400, y: -Math.random() * 200, opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.5, delay: impactTime + i * 0.02 }}
        />
      ))}
    </motion.div>
  );
};

// ============================================================
// 20. ⚽ SOCCER KICK - football slams into character
// ============================================================
export const SoccerKickTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4.5;
  const impactTime = calculateImpactTime(totalDuration, -10, 95);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden bg-gradient-to-b from-emerald-100/70 to-green-200/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Field stripes */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute inset-x-0 h-12" style={{ top: `${i * 12.5}%`, background: i % 2 === 0 ? 'rgba(34,197,94,0.08)' : 'transparent' }} />
      ))}
      <HitCharacter impactTime={impactTime} direction="right" />
      <ImpactEffect delay={impactTime} color="#16a34a" />
      {/* Player on left */}
      <motion.div className="absolute z-15" style={{ left: '4%', bottom: '15%' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <svg width="170" height="240" viewBox="0 0 170 240">
          <ellipse cx="85" cy="232" rx="55" ry="6" fill="rgba(0,0,0,0.25)" />
          <circle cx="85" cy="55" r="26" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
          <path d="M62 45 Q85 25 108 45 Q103 35 85 33 Q67 35 62 45 Z" fill="#1c1917" />
          <circle cx="76" cy="55" r="3" fill="#0f172a" />
          <circle cx="94" cy="55" r="3" fill="#0f172a" />
          <rect x="55" y="80" width="60" height="80" fill="#dc2626" rx="8" />
          <text x="85" y="130" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">10</text>
          <rect x="58" y="160" width="22" height="50" fill="white" rx="4" />
          {/* Kicking leg */}
          <motion.g style={{ transformOrigin: '95px 165px' }}
            animate={{ rotate: [0, -85, 0] }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}>
            <rect x="90" y="160" width="22" height="65" fill="white" rx="4" />
            <ellipse cx="100" cy="225" rx="14" ry="6" fill="#0f172a" />
          </motion.g>
        </svg>
      </motion.div>
      {/* Ball */}
      <motion.div className="absolute z-20" style={{ top: '55%' }}
        initial={{ x: '-5vw', y: 0, rotate: 0 }}
        animate={{ x: '95vw', y: [0, -250, 0, -120, 0], rotate: 1440 }}
        transition={{ duration: totalDuration * 0.85, delay: 0.9, ease: 'linear' }}
        onAnimationComplete={onComplete}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="32" fill="white" stroke="#0f172a" strokeWidth="3" />
          <polygon points="35,18 50,28 44,46 26,46 20,28" fill="#0f172a" />
          <polygon points="35,18 20,28 8,22 12,10" fill="white" stroke="#0f172a" strokeWidth="2" />
          <polygon points="35,18 50,28 62,22 58,10" fill="white" stroke="#0f172a" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// 21. 🎳 BOWLING BALL - rolls in and knocks character down
// ============================================================
export const BowlingTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4.5;
  const impactTime = calculateImpactTime(totalDuration, -20, 110);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fbbf24 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Lane */}
      <div className="absolute left-0 right-0 z-0" style={{ bottom: '12%', height: '60%', background: 'linear-gradient(180deg, #fde68a 0%, #b45309 100%)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.2)' }} />
      <HitCharacter impactTime={impactTime} direction="up" />
      <ImpactEffect delay={impactTime} color="#7c2d12" />
      <motion.div className="absolute z-20" style={{ bottom: '22%' }}
        initial={{ x: '-20vw', rotate: 0 }} animate={{ x: '110vw', rotate: 1080 }}
        transition={{ duration: totalDuration, ease: 'linear' }} onAnimationComplete={onComplete}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs>
            <radialGradient id="bowlGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="72" fill="url(#bowlGrad)" stroke="#0f172a" strokeWidth="4" />
          <circle cx="55" cy="60" r="6" fill="#0f172a" />
          <circle cx="75" cy="60" r="6" fill="#0f172a" />
          <circle cx="65" cy="80" r="6" fill="#0f172a" />
          <ellipse cx="55" cy="50" rx="18" ry="10" fill="white" opacity="0.3" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// 22. 🥷 NINJA STAR / SHURIKEN - lightning fast slice
// ============================================================
export const NinjaTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const totalDuration = 4;
  const impactTime = calculateImpactTime(totalDuration, -15, 110);
  return (
    <motion.div className="absolute inset-0 z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #4c1d95 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HitCharacter impactTime={impactTime} direction="explode" />
      <ExplosionEffect delay={impactTime} />
      {/* Ninja standing on left rooftop silhouette */}
      <motion.div className="absolute z-15" style={{ left: '5%', bottom: '22%' }}
        initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <svg width="160" height="240" viewBox="0 0 160 240">
          <ellipse cx="80" cy="232" rx="50" ry="6" fill="rgba(0,0,0,0.4)" />
          <rect x="60" y="160" width="20" height="70" fill="#1c1917" />
          <rect x="80" y="160" width="20" height="70" fill="#1c1917" />
          <rect x="50" y="100" width="60" height="70" fill="#1c1917" rx="8" />
          <rect x="40" y="120" width="20" height="40" fill="#1c1917" />
          <rect x="100" y="120" width="20" height="40" fill="#1c1917" />
          <circle cx="80" cy="70" r="28" fill="#1c1917" />
          <rect x="58" y="64" width="44" height="8" rx="3" fill="#dc2626" />
          <circle cx="72" cy="68" r="2.5" fill="white" />
          <circle cx="88" cy="68" r="2.5" fill="white" />
          {/* Throwing arm */}
          <motion.g style={{ transformOrigin: '120px 130px' }}
            animate={{ rotate: [80, -40, 80] }} transition={{ duration: 0.4, repeat: Infinity }}>
            <rect x="115" y="125" width="40" height="14" fill="#1c1917" rx="4" />
          </motion.g>
        </svg>
      </motion.div>
      {/* Multiple shurikens */}
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div key={i} className="absolute z-20"
          style={{ top: `${30 + i * 15}%` }}
          initial={{ x: '-15vw', rotate: 0 }} animate={{ x: '110vw', rotate: 2880 }}
          transition={{ duration: totalDuration * 0.7, delay: 0.7 + delay, ease: 'linear' }}
          onAnimationComplete={i === 2 ? onComplete : undefined}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <defs>
              <linearGradient id={`shuri${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>
            <polygon points="40,5 50,30 75,40 50,50 40,75 30,50 5,40 30,30"
              fill={`url(#shuri${i})`} stroke="#0f172a" strokeWidth="2" />
            <circle cx="40" cy="40" r="6" fill="#0f172a" />
          </svg>
        </motion.div>
      ))}
      {/* Speed lines */}
      {[...Array(15)].map((_, i) => (
        <motion.div key={i} className="absolute h-0.5 bg-white/40 z-10"
          style={{ top: `${20 + i * 5}%`, width: '20%' }}
          initial={{ x: '-30%' }} animate={{ x: '130vw' }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.05, repeat: Infinity }} />
      ))}
    </motion.div>
  );
};

// ============================================================
// EXPORT TRANSITIONS ARRAY
// ============================================================
export const transitions = [
  TankTransition,            // 0
  BuffaloTransition,         // 1
  RPGTransition,             // 2
  ElephantTransition,        // 3
  FighterJetTransition,      // 4
  KidThrowTransition,        // 5
  RocketTransition,          // 6
  HelicopterTransition,      // 7
  TrainTransition,           // 8
  TsunamiTransition,         // 9
  VolcanoTransition,         // 10
  MeteorTransition,          // 11
  DragonTransition,          // 12
  TornadoTransition,         // 13
  EarthquakeTransition,      // 14
  IceBlastTransition,        // 15
  ThunderTransition,         // 16
  BulldozerTransition,       // 17
  WreckingBallTransition,    // 18
  SoccerKickTransition,      // 19
  BowlingTransition,         // 20
  NinjaTransition,           // 21
];

