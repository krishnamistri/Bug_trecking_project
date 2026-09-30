import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tester'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden p-4">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-4 shadow-lg shadow-blue-200"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <User size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join BugTracker and start tracking bugs</p>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: error ? 1 : 0,
            y: error ? 0 : -10,
          }}
          className={`mb-6 p-4 rounded-xl flex gap-3 items-start border ${
            error
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-transparent'
          }`}
        >
          {error && (
            <>
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </>
          )}
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: success ? 1 : 0,
            y: success ? 0 : -10,
          }}
          className={`mb-6 p-4 rounded-xl flex gap-3 items-start border ${
            success
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-transparent'
          }`}
        >
          {success && (
            <>
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </>
          )}
        </motion.div>

        {/* Form Card */}
        <AnimatedCard hoverable={false}>
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatedInput
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              label="Full Name"
              icon={User}
              required
            />

            <AnimatedInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              label="Email Address"
              icon={Mail}
              required
            />

            <AnimatedInput
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              label="Password"
              icon={Lock}
              required
              minLength={6}
            />

            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Role
              </label>
              <motion.select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 font-medium"
              >
                <option value="tester">Tester</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </motion.select>
            </motion.div>

            <motion.div
              variants={itemVariants}
            >
              <AnimatedButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </AnimatedButton>
            </motion.div>
          </motion.form>
        </AnimatedCard>

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
