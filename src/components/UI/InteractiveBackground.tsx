import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Mouse follower gradient */}
      <motion.div
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated mesh gradient */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#d946ef', stopOpacity: 0.2 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#d946ef', stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        <motion.circle
          cx="30%"
          cy="30%"
          r="300"
          fill="url(#grad1)"
          animate={{
            cx: ['30%', '70%', '30%'],
            cy: ['30%', '70%', '30%'],
            r: [200, 400, 200],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="70%"
          cy="70%"
          r="250"
          fill="url(#grad1)"
          animate={{
            cx: ['70%', '30%', '70%'],
            cy: ['70%', '30%', '70%'],
            r: [250, 350, 250],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}