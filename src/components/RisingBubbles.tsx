import React from 'react';
import { motion } from 'framer-motion';

const RisingBubbles: React.FC = () => {
  const bubbles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    size: 6 + Math.random() * 18,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 8,
    color: [
      'hsla(220, 80%, 60%, 0.15)',
      'hsla(340, 75%, 60%, 0.12)',
      'hsla(35, 95%, 55%, 0.12)',
      'hsla(270, 60%, 60%, 0.12)',
      'hsla(155, 60%, 50%, 0.12)',
    ][i % 5],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: -30,
            width: b.size,
            height: b.size,
            background: b.color,
            border: `1px solid ${b.color}`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 60 : 1000)],
            x: [0, Math.sin(b.id * 0.7) * 40],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default RisingBubbles;
