import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = '', delay = 0, hoverable = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
      whileHover={hoverable ? { y: -8 } : {}}
      onHoverStart={hoverable ? () => setIsHovered(true) : undefined}
      onHoverEnd={hoverable ? () => setIsHovered(false) : undefined}
      className="group relative"
    >
      {/* Animated border gradient */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 opacity-0 blur group-hover:opacity-100 transition-opacity duration-300 -z-10"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Card content */}
      <motion.div
        className={`relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 shadow-sm group-hover:shadow-xl ${className}`}
        animate={{
          borderColor: isHovered ? '#93c5fd' : '#e5e7eb',
          boxShadow: isHovered
            ? '0 20px 40px rgba(59, 130, 246, 0.1)'
            : '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCard;
