import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

const SakuraParticles: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 8 + Math.random() * 14,
      rotation: Math.random() * 360,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -20,
            width: petal.size,
            height: petal.size,
          }}
          initial={{ y: -20, rotate: petal.rotation, opacity: 0 }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, Math.sin(petal.id) * 60, Math.cos(petal.id) * 40, 0],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 16 12 16C12 16 16 14 16 10C16 6 12 2 12 2Z"
              fill="hsla(340, 80%, 75%, 0.6)"
            />
            <path
              d="M12 2C12 2 6 4 4 8C2 12 6 16 6 16C6 16 10 14 12 10C14 6 12 2 12 2Z"
              fill="hsla(340, 75%, 80%, 0.4)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default SakuraParticles;
