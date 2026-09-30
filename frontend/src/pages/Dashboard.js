import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Loader, TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart3, Zap, Target, Activity, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BugCard from '../components/BugCard.js';
import CreateBug from './CreateBug';
import AnimatedCard from '../components/AnimatedCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateBug, setShowCreateBug] = useState(false);
  const [adminFilter, setAdminFilter] = useState('all'); // 'all', 'pending', 'assigned'

  // Calculate statistics from bugs
  const getStats = () => {
    const stats = {
      total: bugs.length,
      critical: bugs.filter(b => b.priority === 'critical').length,
      high: bugs.filter(b => b.priority === 'high').length,
      medium: bugs.filter(b => b.priority === 'medium').length,
      low: bugs.filter(b => b.priority === 'low').length,
      open: bugs.filter(b => b.status === 'open').length,
      inProgress: bugs.filter(b => b.status === 'in-progress').length,
      fixed: bugs.filter(b => b.status === 'fixed').length,
      verified: bugs.filter(b => b.status === 'verified').length,
    };
    return stats;
  };

  // Get developer bug statistics
  const getDeveloperStats = () => {
    const stats = {};
    developers.forEach(dev => {
      const assignedCount = bugs.filter(b => b.assignedTo && b.assignedTo._id === dev._id).length;
      stats[dev._id] = {
        name: dev.name,
        total: assignedCount,
        open: bugs.filter(b => b.assignedTo && b.assignedTo._id === dev._id && b.status === 'open').length,
        inProgress: bugs.filter(b => b.assignedTo && b.assignedTo._id === dev._id && b.status === 'in-progress').length,
        fixed: bugs.filter(b => b.assignedTo && b.assignedTo._id === dev._id && b.status === 'fixed').length,
      };
    });
    return stats;
  };

  // Filter bugs based on admin filter
  const getFilteredBugs = () => {
    switch(adminFilter) {
      case 'pending':
        return bugs.filter(b => b.status === 'open' && !b.assignedTo);
      case 'assigned':
        return bugs.filter(b => b.assignedTo);
      case 'all':
      default:
        return bugs;
    }
  };

  const stats = getStats();

  // StatCard component
  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className="relative group"
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${color} opacity-0 blur group-hover:opacity-30 transition-all duration-300 -z-10`} />
      <div className="relative bg-white border border-gray-200 rounded-xl p-6 h-full group-hover:border-blue-300 transition-all shadow-sm group-hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            <div className="flex items-end gap-2">
              <motion.h3 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {value}
              </motion.h3>
              {trend && (
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp size={14} /> {trend}
                </span>
              )}
            </div>
          </div>
          <motion.div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon size={24} className="text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    fetchBugs();
    if (user.role === 'admin') {
      fetchDevelopers();
    } else if (user.role === 'tester') {
      fetchAdmins();
    }
  }, [user]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/bugs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setBugs(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevelopers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      setDevelopers(data.data.filter(u => u.role === 'developer'));
    }
  };

  const fetchAdmins = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      setDevelopers(data.data.filter(u => u.role === 'admin'));
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

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'admin':
        const filteredBugs = getFilteredBugs();
        const developerStats = getDeveloperStats();
        
        return (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Admin Dashboard Header */}
            <motion.div className="flex items-center gap-3 mb-8" variants={itemVariants}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
            </motion.div>

            {/* Bug Filter Section */}
            <motion.div className="mb-8 flex flex-wrap gap-3" variants={itemVariants}>
              <button
                onClick={() => setAdminFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  adminFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={16} />
                All Bugs ({bugs.length})
              </button>
              <button
                onClick={() => setAdminFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  adminFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlertCircle size={16} />
                Pending ({bugs.filter(b => b.status === 'open' && !b.assignedTo).length})
              </button>
              <button
                onClick={() => setAdminFilter('assigned')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  adminFilter === 'assigned'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle size={16} />
                Assigned ({bugs.filter(b => b.assignedTo).length})
              </button>
            </motion.div>

            {/* Developer Statistics */}
            {Object.keys(developerStats).length > 0 && (
              <motion.div className="mb-8" variants={itemVariants}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-blue-600" />
                  Developer Workload
                </h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.entries(developerStats).map(([devId, stats]) => (
                      <motion.div key={devId} variants={itemVariants}>
                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                          <h4 className="font-bold text-gray-900 mb-3 text-lg">{stats.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total Assigned:</span>
                              <span className="font-bold text-blue-600 text-lg">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Open:</span>
                              <span className="font-semibold text-orange-600">{stats.open}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">In Progress:</span>
                              <span className="font-semibold text-purple-600">{stats.inProgress}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Fixed:</span>
                              <span className="font-semibold text-green-600">{stats.fixed}</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-4 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${stats.total > 0 ? (stats.fixed / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {stats.total > 0 ? Math.round((stats.fixed / stats.total) * 100) : 0}% Completed
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </motion.div>
            )}

            {/* Bugs List */}
            <motion.div variants={itemVariants} className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {adminFilter === 'all' && 'All Bugs'}
                {adminFilter === 'pending' && 'Pending Bugs (Unassigned)'}
                {adminFilter === 'assigned' && 'Assigned Bugs'}
              </h3>
            </motion.div>
            
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBugs.map((bug, idx) => (
                <motion.div key={bug._id} variants={itemVariants}>
                  <BugCard bug={bug} developers={developers} onRefresh={fetchBugs} user={user} />
                </motion.div>
              ))}
            </motion.div>

            {filteredBugs.length === 0 && (
              <motion.div
                className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
                variants={itemVariants}
              >
                <AlertCircle size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-lg">
                  {adminFilter === 'pending' && 'No pending bugs. All bugs are assigned!'}
                  {adminFilter === 'assigned' && 'No assigned bugs yet.'}
                  {adminFilter === 'all' && 'No bugs yet.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      
      case 'tester':
        return (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex items-center gap-3 mb-8" variants={itemVariants}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <AlertCircle size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">My Bug Reports</h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bugs.map((bug, idx) => (
                <motion.div key={bug._id} variants={itemVariants}>
                  <BugCard bug={bug} onRefresh={fetchBugs} user={user} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      
      case 'developer':
        return (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex items-center gap-3 mb-8" variants={itemVariants}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">My Assigned Bugs</h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bugs.map((bug, idx) => (
                <motion.div key={bug._id} variants={itemVariants}>
                  <BugCard bug={bug} onRefresh={fetchBugs} user={user} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-[60vh] gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader size={48} className="text-blue-600" />
        </motion.div>
        <p className="text-gray-600 text-lg font-medium">Loading your bugs...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <motion.p 
            className="text-lg text-gray-600 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your role:{' '}
            <span className="font-semibold capitalize text-blue-600">
              {user.role}
            </span>
          </motion.p>
        </motion.div>
        
        {user.role === 'tester' && (
          <motion.button
            onClick={() => setShowCreateBug(!showCreateBug)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Plus size={20} />
            {showCreateBug ? 'Cancel' : 'New Bug'}
          </motion.button>
        )}
      </motion.div>

      {/* Create Bug Form */}
      {showCreateBug && user.role === 'tester' && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedCard>
            <CreateBug onSuccess={() => {
              fetchBugs();
              setShowCreateBug(false);
            }} />
          </AnimatedCard>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          className="mb-8 p-4 rounded-xl flex gap-3 items-start border bg-red-50 border-red-200 text-red-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* Statistics Section */}
      {bugs.length > 0 && (
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
            <BarChart3 size={28} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          </motion.div>

          {/* Priority Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                icon={AlertTriangle}
                label="Critical"
                value={stats.critical}
                color="from-red-500 to-red-600"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={AlertCircle}
                label="High Priority"
                value={stats.high}
                color="from-orange-500 to-orange-600"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={Clock}
                label="Medium Priority"
                value={stats.medium}
                color="from-yellow-500 to-yellow-600"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={Activity}
                label="Low Priority"
                value={stats.low}
                color="from-green-500 to-green-600"
              />
            </motion.div>
          </motion.div>

          {/* Status Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                icon={Target}
                label="Total Bugs"
                value={stats.total}
                color="from-blue-500 to-blue-600"
                trend="All"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={Zap}
                label="Open"
                value={stats.open}
                color="from-indigo-500 to-indigo-600"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={Clock}
                label="In Progress"
                value={stats.inProgress}
                color="from-purple-500 to-purple-600"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                icon={CheckCircle}
                label="Fixed"
                value={stats.fixed + stats.verified}
                color="from-emerald-500 to-emerald-600"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      {bugs.length > 0 ? (
        renderRoleSpecificContent()
      ) : (
        <motion.div
          className="text-center py-20 px-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Target size={40} className="text-blue-600" />
          </motion.div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            No bugs yet
          </h3>
          {user.role === 'tester' ? (
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Ready to track your first issue? Click the "New Bug" button to create your first bug report and help us improve!
            </p>
          ) : (
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              No bugs assigned or reported yet. Check back soon!
            </p>
          )}
          {user.role === 'tester' && (
            <motion.button
              onClick={() => setShowCreateBug(true)}
              className="mt-8 px-8 py-3 rounded-lg font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create First Bug Report
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
