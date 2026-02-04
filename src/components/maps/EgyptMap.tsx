import React from 'react';
import { motion } from 'framer-motion';

interface EgyptMapProps {
  className?: string;
}

// Real SVG path for Egypt based on GeoJSON coordinates
const EgyptMap: React.FC<EgyptMapProps> = ({ className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 400 450"
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        {/* Desert gradient */}
        <linearGradient id="desertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D4A8" />
          <stop offset="30%" stopColor="#D4B896" />
          <stop offset="60%" stopColor="#C9A97A" />
          <stop offset="100%" stopColor="#B8956A" />
        </linearGradient>
        
        {/* Nile Valley gradient */}
        <linearGradient id="nileValleyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="50%" stopColor="#689F38" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        
        {/* Delta gradient */}
        <linearGradient id="deltaGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8BC34A" />
          <stop offset="50%" stopColor="#9CCC65" />
          <stop offset="100%" stopColor="#AED581" />
        </linearGradient>
        
        {/* Sea gradient */}
        <linearGradient id="mediterraneanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="50%" stopColor="#1976D2" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
        
        {/* Red Sea gradient */}
        <linearGradient id="redSeaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D47A1" />
          <stop offset="50%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
        
        {/* Mountain gradient for Sinai */}
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#BCAAA4" />
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="terrainShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        
        {/* Glow effect for cities */}
        <filter id="cityGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Mediterranean Sea */}
      <rect x="0" y="0" width="400" height="60" fill="url(#mediterraneanGradient)" />
      <motion.text 
        x="200" y="30" 
        textAnchor="middle" 
        fill="white" 
        fontSize="11" 
        fontWeight="500"
        opacity="0.8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
      >
        البحر المتوسط
      </motion.text>
      
      {/* Main Egypt landmass - accurate shape based on real coordinates */}
      <motion.path
        d="
          M 80 55 
          L 120 55 L 160 50 L 200 52 L 250 50 L 285 55 L 310 58
          L 315 65 L 320 80 L 340 120 L 355 160 L 365 200 L 370 240
          L 375 280 L 378 320 L 380 360 L 375 400 L 365 430 L 350 440
          L 300 445 L 250 440 L 200 435 L 150 435 L 100 440 L 60 435
          L 40 420 L 30 380 L 25 340 L 28 300 L 35 260 L 45 220
          L 55 180 L 60 140 L 65 100 L 70 70 L 80 55
          Z
        "
        fill="url(#desertGradient)"
        filter="url(#terrainShadow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      
      {/* Sinai Peninsula - more detailed and elevated */}
      <motion.path
        d="
          M 310 58 L 340 55 L 370 60 L 390 80 L 395 120 L 390 160
          L 380 200 L 365 240 L 345 280 L 330 290 L 320 260
          L 330 220 L 340 180 L 350 140 L 355 100 L 340 80 L 320 70 L 310 58
          Z
        "
        fill="url(#mountainGradient)"
        filter="url(#terrainShadow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
      
      {/* Red Sea */}
      <motion.path
        d="
          M 345 280 L 365 290 L 385 320 L 400 360 L 400 450 L 365 450
          L 365 430 L 375 400 L 378 360 L 375 320 L 360 290 L 345 280
          Z
        "
        fill="url(#redSeaGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
      
      {/* Suez Gulf */}
      <motion.path
        d="
          M 320 260 L 340 260 L 355 240 L 360 220 L 355 200 L 345 180
          L 330 160 L 320 150 L 310 165 L 315 190 L 310 220 L 320 260
          Z
        "
        fill="url(#redSeaGradient)"
        opacity="0.9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.6, duration: 1 }}
      />
      
      {/* Aqaba Gulf */}
      <motion.path
        d="
          M 360 220 L 380 200 L 395 170 L 400 140 L 400 200 L 390 230 L 375 260 L 360 220 Z
        "
        fill="url(#redSeaGradient)"
        opacity="0.9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.7, duration: 1 }}
      />
      
      {/* Nile Delta - green fertile area */}
      <motion.path
        d="
          M 160 55 L 200 52 L 250 50 L 255 60 L 260 75 L 255 90 L 245 100
          L 220 105 L 200 100 L 180 105 L 160 100 L 155 85 L 155 70 L 160 55
          Z
        "
        fill="url(#deltaGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
      
      {/* Nile River - accurate path */}
      <motion.path
        d="
          M 200 100 
          Q 210 130 205 160
          Q 200 190 210 220
          Q 215 250 205 280
          Q 198 310 210 340
          Q 218 370 205 400
          L 210 430 L 215 450
        "
        stroke="#2196F3"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
      />
      
      {/* Nile Valley - green strip */}
      <motion.path
        d="
          M 195 100 L 205 100 
          Q 215 130 210 160 Q 205 190 215 220 Q 220 250 210 280 Q 203 310 215 340 Q 223 370 210 400 L 215 430 L 220 450
          L 200 450 L 195 430 L 190 400 Q 195 370 185 340 Q 178 310 190 280 Q 200 250 190 220 Q 185 190 195 160 Q 200 130 195 100
          Z
        "
        fill="url(#nileValleyGradient)"
        opacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
      
      {/* Western Desert terrain texture */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5 }}>
        {[...Array(12)].map((_, i) => (
          <ellipse
            key={i}
            cx={60 + (i % 4) * 40}
            cy={180 + Math.floor(i / 4) * 80}
            rx={15 + Math.random() * 10}
            ry={8 + Math.random() * 5}
            fill="#C9A97A"
            opacity={0.4}
          />
        ))}
      </motion.g>
      
      {/* Cairo marker */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: 'spring' }}
      >
        <circle cx="210" cy="95" r="12" fill="#DC2626" filter="url(#cityGlow)" />
        <circle cx="210" cy="95" r="6" fill="#FEF2F2" />
        <motion.circle 
          cx="210" cy="95" r="18" 
          stroke="#DC2626" 
          strokeWidth="2" 
          fill="none"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="210" y="78" textAnchor="middle" fill="#1A1A1A" fontSize="10" fontWeight="bold">
          القاهرة
        </text>
      </motion.g>
      
      {/* Egyptian Flag small indicator */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3 }}
      >
        <rect x="185" y="55" width="20" height="5" fill="#CE1126" />
        <rect x="185" y="60" width="20" height="5" fill="#FFFFFF" />
        <rect x="185" y="65" width="20" height="5" fill="#000000" />
      </motion.g>
      
      {/* Country name */}
      <motion.text
        x="130"
        y="280"
        fill="#5D4037"
        fontSize="14"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        جمهورية مصر العربية
      </motion.text>
      
      {/* Red Sea label */}
      <motion.text
        x="370"
        y="380"
        fill="white"
        fontSize="9"
        fontWeight="500"
        opacity="0.8"
        transform="rotate(-70 370 380)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2 }}
      >
        البحر الأحمر
      </motion.text>
      
      {/* Some key cities */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        {/* Alexandria */}
        <circle cx="145" cy="58" r="5" fill="#1976D2" />
        <text x="145" y="50" textAnchor="middle" fill="#1A1A1A" fontSize="7">الإسكندرية</text>
        
        {/* Aswan */}
        <circle cx="210" cy="410" r="4" fill="#F57C00" />
        <text x="210" y="425" textAnchor="middle" fill="#5D4037" fontSize="7">أسوان</text>
        
        {/* Luxor */}
        <circle cx="215" cy="350" r="4" fill="#F57C00" />
        <text x="230" y="355" textAnchor="start" fill="#5D4037" fontSize="7">الأقصر</text>
      </motion.g>
      
      {/* Pyramids icon near Cairo */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, type: 'spring' }}
      >
        <polygon points="190,105 200,85 210,105" fill="#D4A574" stroke="#8D6E63" strokeWidth="1" />
        <polygon points="200,105 208,90 216,105" fill="#C9A97A" stroke="#8D6E63" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  );
};

export default EgyptMap;
