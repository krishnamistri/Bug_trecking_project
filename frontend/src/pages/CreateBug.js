import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const CreateBug = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    screenshot: null,
    assignedTo: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data.filter(u => u.role === 'admin'));
      }
    } catch (err) {
      console.error('Failed to fetch admins');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'screenshot') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        screenshot: file
      });
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const removeScreenshot = () => {
    setFormData({
      ...formData,
      screenshot: null
    });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'screenshot' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== 'screenshot') {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/bugs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    });


      const data = await res.json();
      
      if (data.success) {
        onSuccess();
        setFormData({ title: '', description: '', priority: 'medium', screenshot: null, assignedTo: '' });
        setPreview(null);
      } else {
        setError(data.message || 'Failed to create bug');
      }
    } catch (err) {
      setError('Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Report New Bug</h3>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bug Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the issue"
            required
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Detailed steps to reproduce the issue..."
            required
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Admin (Optional)
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select an Admin --</option>
              {admins.map(admin => (
                <option key={admin._id} value={admin._id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot (Optional)
            </label>
            <input
              type="file"
              name="screenshot"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </motion.div>

        {/* Image Preview */}
        {preview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-lg border-2 border-blue-300 bg-gray-50 p-4 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Screenshot Added</p>
                  <p className="text-xs text-gray-600">{formData.screenshot?.name}</p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={removeScreenshot}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 hover:bg-gray-200 rounded-full transition-all"
              >
                <X size={18} className="text-gray-600" />
              </motion.button>
            </div>
            <div className="w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={preview} 
                alt="Screenshot preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Creating Bug...' : 'Create Bug Report'}
        </motion.button>
      </form>
    </div>
  );
};

export default CreateBug;
