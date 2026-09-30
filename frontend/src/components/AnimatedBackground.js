import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const shapes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    xStart: Math.random() * 100,
    yStart: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating shapes - subtle */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.xStart}%`,
            top: `${shape.yStart}%`,
            background: ['bg-blue-200', 'bg-purple-200', 'bg-indigo-200', 'bg-cyan-200'][
              shape.id % 4
            ],
            filter: 'blur(80px)',
            opacity: 0.1,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern - very subtle */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>
  );
};

export default AnimatedBackground;
