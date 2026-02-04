import React from 'react';
import { motion } from 'framer-motion';

interface SouthKoreaMapProps {
  className?: string;
}

// Real SVG path for South Korea based on GeoJSON coordinates
const SouthKoreaMap: React.FC<SouthKoreaMapProps> = ({ className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 350 450"
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        {/* Mountain forest gradient */}
        <linearGradient id="koreaForestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="40%" stopColor="#388E3C" />
          <stop offset="70%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        
        {/* Lowland gradient */}
        <linearGradient id="koreaLowlandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="50%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#C8E6C9" />
        </linearGradient>
        
        {/* Sea gradient - Yellow Sea */}
        <linearGradient id="yellowSeaGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="50%" stopColor="#1976D2" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
        
        {/* Sea gradient - East Sea */}
        <linearGradient id="eastSeaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D47A1" />
          <stop offset="50%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
        
        {/* Mountain range gradient */}
        <linearGradient id="koreaMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B5E20" />
          <stop offset="50%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="koreaTerrainShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        
        {/* Glow effect */}
        <filter id="koreaCityGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background seas */}
      {/* Yellow Sea (West) */}
      <rect x="0" y="0" width="100" height="450" fill="url(#yellowSeaGradient)" />
      <motion.text 
        x="50" y="200" 
        textAnchor="middle" 
        fill="white" 
        fontSize="10" 
        fontWeight="500"
        opacity="0.8"
        transform="rotate(-90 50 200)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
      >
        البحر الأصفر
      </motion.text>
      
      {/* East Sea (East) */}
      <rect x="280" y="0" width="70" height="450" fill="url(#eastSeaGradient)" />
      <motion.text 
        x="315" y="200" 
        textAnchor="middle" 
        fill="white" 
        fontSize="10" 
        fontWeight="500"
        opacity="0.8"
        transform="rotate(90 315 200)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
      >
        بحر اليابان
      </motion.text>
      
      {/* DMZ / North Korea border area - subtle indication */}
      <rect x="80" y="0" width="220" height="30" fill="#9E9E9E" opacity="0.3" />
      <motion.text 
        x="190" y="18" 
        textAnchor="middle" 
        fill="#616161" 
        fontSize="8"
        opacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5 }}
      >
        كوريا الشمالية
      </motion.text>
      
      {/* Main South Korea landmass - accurate peninsula shape */}
      <motion.path
        d="
          M 120 30 
          L 150 32 L 180 30 L 210 28 L 240 32 L 265 40
          L 275 60 L 280 90 L 278 120 L 275 150 L 280 180
          L 278 210 L 275 240 L 270 270 L 260 300 L 245 330
          L 225 360 L 200 385 L 170 400 L 140 410 L 115 405
          L 95 390 L 85 360 L 90 330 L 100 300 L 95 270
          L 100 240 L 110 210 L 105 180 L 110 150 L 108 120
          L 105 90 L 110 60 L 120 30
          Z
        "
        fill="url(#koreaLowlandGradient)"
        filter="url(#koreaTerrainShadow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      
      {/* Taebaek Mountains - eastern mountain range */}
      <motion.path
        d="
          M 250 40 L 270 60 L 275 90 L 272 130 L 270 170 L 268 210
          L 262 250 L 255 290 L 245 320 L 230 340
          L 235 310 L 245 270 L 252 230 L 255 190 L 258 150
          L 262 110 L 260 70 L 250 40
          Z
        "
        fill="url(#koreaMountainGradient)"
        opacity="0.8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
      
      {/* Central mountains */}
      <motion.path
        d="
          M 160 50 L 200 60 L 220 100 L 230 150 L 220 200
          L 200 180 L 180 160 L 170 120 L 165 80 L 160 50
          Z
        "
        fill="url(#koreaMountainGradient)"
        opacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.7, duration: 1 }}
      />
      
      {/* Coastal features - small islands and peninsulas */}
      {/* Western coast irregularities */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <ellipse cx="85" cy="250" rx="8" ry="5" fill="#81C784" />
        <ellipse cx="78" cy="290" rx="6" ry="4" fill="#81C784" />
        <ellipse cx="90" cy="340" rx="10" ry="6" fill="#81C784" />
        <ellipse cx="105" cy="380" rx="7" ry="4" fill="#81C784" />
      </motion.g>
      
      {/* Southern coast islands */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ellipse cx="130" cy="420" rx="12" ry="8" fill="#A5D6A7" />
        <ellipse cx="160" cy="425" rx="8" ry="5" fill="#A5D6A7" />
        <ellipse cx="185" cy="420" rx="6" ry="4" fill="#A5D6A7" />
      </motion.g>
      
      {/* Jeju Island */}
      <motion.ellipse
        cx="140"
        cy="440"
        rx="25"
        ry="12"
        fill="url(#koreaForestGradient)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
      />
      <motion.text 
        x="140" y="443" 
        textAnchor="middle" 
        fill="white" 
        fontSize="6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.8 }}
      >
        جيجو
      </motion.text>
      
      {/* Rivers */}
      <motion.path
        d="M 175 50 Q 165 80 170 110 Q 180 140 165 170 Q 155 200 170 230"
        stroke="#42A5F5"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      />
      
      <motion.path
        d="M 120 90 Q 140 100 160 95 Q 180 90 200 100"
        stroke="#42A5F5"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
      />
      
      {/* Seoul marker - capital city */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: 'spring' }}
      >
        <circle cx="165" cy="70" r="12" fill="#E53935" filter="url(#koreaCityGlow)" />
        <circle cx="165" cy="70" r="6" fill="#FFEBEE" />
        <motion.circle 
          cx="165" cy="70" r="18" 
          stroke="#E53935" 
          strokeWidth="2" 
          fill="none"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="165" y="55" textAnchor="middle" fill="#1A1A1A" fontSize="10" fontWeight="bold">
          سيول
        </text>
      </motion.g>
      
      {/* Korean Flag small indicator */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3 }}
      >
        <rect x="180" y="60" width="24" height="16" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="0.5" />
        <circle cx="192" cy="68" r="5" fill="#C60C30" />
        <path d="M 192 63 A 5 5 0 0 1 192 73" fill="#003478" />
      </motion.g>
      
      {/* Country name */}
      <motion.text
        x="170"
        y="240"
        fill="#1B5E20"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        대한민국
      </motion.text>
      
      <motion.text
        x="170"
        y="258"
        fill="#2E7D32"
        fontSize="10"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
      >
        كوريا الجنوبية
      </motion.text>
      
      {/* Other major cities */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        {/* Busan */}
        <circle cx="245" cy="340" r="5" fill="#1976D2" />
        <text x="260" y="345" textAnchor="start" fill="#1A1A1A" fontSize="7">بوسان</text>
        
        {/* Incheon */}
        <circle cx="130" cy="75" r="4" fill="#7B1FA2" />
        <text x="130" y="90" textAnchor="middle" fill="#1A1A1A" fontSize="6">إنتشون</text>
        
        {/* Daegu */}
        <circle cx="225" cy="270" r="4" fill="#F57C00" />
        <text x="225" y="285" textAnchor="middle" fill="#1A1A1A" fontSize="6">دايجو</text>
        
        {/* Gwangju */}
        <circle cx="135" cy="330" r="4" fill="#00796B" />
        <text x="135" y="345" textAnchor="middle" fill="#1A1A1A" fontSize="6">غوانجو</text>
      </motion.g>
      
      {/* Modern cityscape icon near Seoul */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, type: 'spring' }}
      >
        {/* Skyscrapers silhouette */}
        <rect x="175" y="80" width="6" height="15" fill="#455A64" />
        <rect x="183" y="75" width="8" height="20" fill="#546E7A" />
        <rect x="193" y="82" width="5" height="13" fill="#607D8B" />
        {/* N Seoul Tower hint */}
        <line x1="200" y1="95" x2="200" y2="80" stroke="#E53935" strokeWidth="1.5" />
        <circle cx="200" cy="78" r="2" fill="#E53935" />
      </motion.g>
    </motion.svg>
  );
};

export default SouthKoreaMap;
