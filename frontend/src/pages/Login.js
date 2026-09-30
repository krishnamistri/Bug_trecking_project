import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
      await login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            <LogIn size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your BugTracker account</p>
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
              placeholder="Enter your password"
              label="Password"
              icon={Lock}
              required
            />

            <motion.div
              className="mb-6"
              variants={itemVariants}
            >
              <Link
                to="#"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                Forgot your password?
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
            >
              <AnimatedButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Sign In
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
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
