import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  pause?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ texts, className = '', speed = 80, pause = 2500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentIndex, texts, speed, pause]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
};

export default TypewriterText;
