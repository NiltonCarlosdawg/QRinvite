import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PulseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function PulseButton({ children, onClick, className = '' }: PulseButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${className}`}
    >
      {/* Animated pulse rings */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 blur-lg"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 blur-xl"
      />

      {/* Button content */}
      <div className="relative">{children}</div>
    </motion.button>
  );
}