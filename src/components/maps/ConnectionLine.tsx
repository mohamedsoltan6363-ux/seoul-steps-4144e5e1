import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionLineProps {
  className?: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 300 100"
      className={className}
      preserveAspectRatio="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <defs>
        {/* Animated gradient */}
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <motion.stop
            offset="0%"
            stopColor="#DC2626"
            animate={{ stopColor: ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#DC2626'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.stop
            offset="50%"
            stopColor="#F59E0B"
            animate={{ stopColor: ['#F59E0B', '#10B981', '#3B82F6', '#DC2626', '#F59E0B'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.stop
            offset="100%"
            stopColor="#10B981"
            animate={{ stopColor: ['#10B981', '#3B82F6', '#DC2626', '#F59E0B', '#10B981'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="connectionGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="url(#connectionGradient)" />
        </marker>
      </defs>
      
      {/* Background glow path */}
      <motion.path
        d="M 10 50 Q 75 20, 150 50 Q 225 80, 290 50"
        stroke="url(#connectionGradient)"
        strokeWidth="8"
        fill="none"
        opacity="0.3"
        filter="url(#connectionGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2.8, duration: 2 }}
      />
      
      {/* Main connection line */}
      <motion.path
        d="M 10 50 Q 75 20, 150 50 Q 225 80, 290 50"
        stroke="url(#connectionGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 3, duration: 2, ease: 'easeInOut' }}
      />
      
      {/* Traveling particle */}
      <motion.circle
        r="5"
        fill="white"
        filter="url(#connectionGlow)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          offsetDistance: ['0%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 4,
          ease: 'linear'
        }}
        style={{
          offsetPath: "path('M 10 50 Q 75 20, 150 50 Q 225 80, 290 50')"
        }}
      />
      
      {/* Second traveling particle - opposite direction */}
      <motion.circle
        r="4"
        fill="#F59E0B"
        filter="url(#connectionGlow)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          offsetDistance: ['100%', '0%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 5.5,
          ease: 'linear'
        }}
        style={{
          offsetPath: "path('M 10 50 Q 75 20, 150 50 Q 225 80, 290 50')"
        }}
      />
      
      {/* Dots along the path */}
      {[0.2, 0.4, 0.6, 0.8].map((offset, i) => (
        <motion.circle
          key={i}
          cx={10 + offset * 280}
          cy={50 + Math.sin(offset * Math.PI * 2) * 20}
          r="3"
          fill="url(#connectionGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 3.5 + i * 0.3
          }}
        />
      ))}
    </motion.svg>
  );
};

export default ConnectionLine;
