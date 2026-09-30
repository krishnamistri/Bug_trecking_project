import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  children,
  variant = 'primary',
  className = '',
  icon: Icon = null,
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200',
    secondary:
      'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 text-gray-700 shadow-sm',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-200',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group ${variants[variant]} ${className}`}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12"
        animate={{
          left: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {Icon && (
          <motion.div
            animate={{
              rotate: loading ? 360 : 0,
            }}
            transition={{
              duration: loading ? 1 : 0,
              repeat: loading ? Infinity : 0,
              ease: 'linear',
            }}
          >
            <Icon size={20} />
          </motion.div>
        )}
        <span>{loading ? 'Processing...' : children}</span>
      </div>
    </motion.button>
  );
};

export default AnimatedButton;
