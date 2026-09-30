import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

const BugCard = ({ bug, onClick, developers = [], onRefresh, user }) => {
  const [selectedDev, setSelectedDev] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'from-red-500 to-orange-500',
      high: 'from-orange-500 to-amber-500',
      medium: 'from-yellow-500 to-blue-500',
      low: 'from-blue-500 to-cyan-500',
    };
    return colors[severity] || colors.medium;
  };

  const getStatusIcon = (status) => {
    if (status === 'verified' || status === 'fixed') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'in-progress') return <Zap className="w-5 h-5 text-blue-600" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  const handleAssign = async () => {
    if (!selectedDev) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bugs/${bug._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignedTo: selectedDev })
      });

      if (res.ok) {
        if (onRefresh) onRefresh();
        setSelectedDev('');
      }
    } catch (err) {
      console.error('Assign error', err);
    }
  };

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bugs/${bug._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'in-progress' })
      });

      if (res.ok) {
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Accept error', err);
    }
  };

  const handleComplete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bugs/${bug._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'fixed' })
      });

      if (res.ok) {
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Complete error', err);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Close this bug?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bugs/${bug._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'verified' })
      });

      if (res.ok) {
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Close error', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this bug?')) return;
    setIsDeleting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bugs/${bug._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        if (onRefresh) onRefresh();
      } else {
        console.error('Delete failed:', data.message);
        alert(data.message || 'Failed to delete bug');
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete bug');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      {/* Gradient border effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getSeverityColor(
          bug.priority || 'medium'
        )} opacity-0 blur group-hover:opacity-20 transition-all duration-300 -z-10`}
      />

      {/* Card Content */}
      <motion.div 
        className="relative bg-white border border-gray-200 rounded-2xl p-6 h-full overflow-hidden group-hover:border-blue-300 group-hover:shadow-lg transition-all"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(bug);
        }}
      >
        {/* Top section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.div className="flex items-center gap-2 mb-2">
              {getStatusIcon(bug.status)}
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {bug.status}
              </span>
            </motion.div>
            <motion.h3
              className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
              whileHover={{ x: 4 }}
            >
              {bug.title}
            </motion.h3>
          </div>

          {/* Priority badge */}
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getSeverityColor(
              bug.priority || 'medium'
            )} shadow-md`}
            whileHover={{ scale: 1.05 }}
          >
            {bug.priority || 'normal'}
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{bug.description}</p>

        {/* Screenshot display */}
        {bug.screenshot && (
          <motion.div 
            className="mb-4 rounded-lg overflow-hidden border border-gray-200 group/img"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src={bug.screenshot.startsWith('/') ? bug.screenshot : `/uploads/${bug.screenshot}`}
                alt="Bug screenshot"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZm9udC1zaXplOjUwcHg7IGZpbGw6ICM5Y2ExMDY7IGZvbnQtZmFtaWx5OiBBcmlhbDsgIiBmb250LXdlaWdodD0iYm9sZCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='}
              />
            </div>
          </motion.div>
        )}

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <AlertCircle size={14} />
            <span>ID: {bug._id.slice(-6)}</span>
          </div>
          <div className="text-right">
            {new Date(bug.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Developer assignment */}
        {bug.assignedTo && (
          <motion.div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Assigned to:</p>
            <p className="text-sm font-semibold text-blue-600">{bug.assignedTo.name}</p>
          </motion.div>
        )}

        {/* Admin assignment section */}
        {user?.role === 'admin' && !bug.assignedTo && developers.length > 0 && (
          <motion.div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Assign to Developer
            </label>
            <div className="flex gap-2">
              <motion.select
                value={selectedDev}
                onChange={(e) => setSelectedDev(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Developer</option>
                {developers.map(dev => (
                  <option key={dev._id} value={dev._id} className="bg-white">
                    {dev.name}
                  </option>
                ))}
              </motion.select>
              <motion.button
                onClick={handleAssign}
                disabled={!selectedDev}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all font-medium whitespace-nowrap text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Assign
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Developer actions */}
        {user?.role === 'developer' && bug.assignedTo?._id === user.id && bug.status === 'open' && (
          <motion.div className="space-y-2">
            <motion.button
              onClick={handleAccept}
              className="w-full px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 text-sm font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accept Bug
            </motion.button>
          </motion.div>
        )}

        {user?.role === 'developer' && bug.assignedTo?._id === user.id && bug.status === 'in-progress' && (
          <motion.div className="space-y-2">
            <motion.button
              onClick={handleComplete}
              className="w-full px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-700 text-sm font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark Complete (Fixed)
            </motion.button>
          </motion.div>
        )}

        {/* Tester actions - Close bug */}
        {user?.role === 'tester' && bug.createdBy?._id === user.id && bug.status === 'fixed' && (
          <motion.button
            onClick={handleClose}
            className="w-full px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-sm font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close Bug
          </motion.button>
        )}

        {user?.role === 'developer' && bug.assignedTo?._id === user.id && (bug.status === 'fixed' || bug.status === 'verified') && (
          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-sm font-semibold transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BugCard;