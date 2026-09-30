import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedInput = ({
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
  required = false,
  icon: Icon = null,
  minLength = 0,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      {label && (
        <motion.label
          className="block text-sm font-semibold mb-3 text-gray-700"
          animate={{ opacity: 1 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative group">
        {/* Animated border on focus */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"
          animate={{
            opacity: isFocused ? 0.3 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Background container */}
        <motion.div
          className="relative bg-white rounded-xl border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-300 flex items-center shadow-sm hover:shadow-md"
          animate={{
            borderColor: isFocused ? '#3b82f6' : '#e5e7eb',
            boxShadow: isFocused
              ? '0 4px 20px rgba(59, 130, 246, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          {Icon && (
            <motion.div
              className="absolute left-4"
              animate={{
                scale: isFocused ? 1.1 : 1,
                color: isFocused ? '#3b82f6' : '#9ca3af',
              }}
            >
              <Icon size={20} />
            </motion.div>
          )}

          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            required={required}
            minLength={minLength}
            className={`w-full bg-transparent py-3 px-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${
              Icon ? 'pl-12' : ''
            } focus:placeholder-gray-500`}
          />

          {/* Focus indicator line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
            animate={{
              width: isFocused ? '100%' : '0%',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedInput;
