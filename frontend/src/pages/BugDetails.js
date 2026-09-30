import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BugCard from '../components/BugCard';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/api';

const BugDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [closeLoading, setCloseLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBug();
    fetchComments();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps


  const fetchBug = async () => {
    try {
      const res = await fetch(`/api/bugs/${id}`);
      const data = await res.json();
      if (data.success) {
        setBug(data.data);
      }
    } catch (error) {
      console.error('Error fetching bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/bugs/${id}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await fetch(`/api/bugs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Bug status updated successfully' });
        fetchBug();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Error updating status' });
    }
  };

  const handleCloseBug = async () => {
    // Only tester who created the bug can close it
    if (user.role !== 'tester' || bug.createdBy._id !== user.id) {
      setMessage({ type: 'error', text: 'Only the bug creator can close this bug' });
      return;
    }

    // Confirm closure
    const confirmed = window.confirm('Are you sure you want to close this bug? This action can be reversed by reopening it.');
    if (!confirmed) return;

    setCloseLoading(true);
    try {
      const res = await fetch(`/api/bugs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Bug closed successfully!' });
        fetchBug();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to close bug' });
      }
    } catch (error) {
      console.error('Error closing bug:', error);
      setMessage({ type: 'error', text: 'Error closing bug' });
    } finally {
      setCloseLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/bugs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment })
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bug) {
    return <div>Bug not found</div>;
  }

  const isTesterOwner = user.role === 'tester' && bug.createdBy._id === user.id;
  const isDeveloperAssigned = user.role === 'developer' && bug.assignedTo?._id === user.id;
  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <BugCard bug={bug} />

      {/* Message Alert */}
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}
      
      {/* Screenshot Display */}
      {bug.screenshot && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Screenshot</h3>
            <p className="text-sm text-gray-600 mt-1">Attached image showing the bug</p>
          </div>
          <div className="p-6">
            <div className="w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={getImageUrl(bug.screenshot)}
                alt="Bug screenshot" 
                className="w-full h-auto"
                onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjQwMCIgeT0iMzAwIiBzdHlsZT0iZm9udC1zaXplOjQ4cHg7IGZpbGw6Izk5OTsgZm9udC1mYW1pbHk6IEFyaWFsOyIgZm9udC13ZWlnaHQ6ImJvbGQiPlNjcmVlbnNob3QgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Quick Actions */}
      {(isTesterOwner || isDeveloperAssigned || isAdmin) && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {isTesterOwner && (
              <>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                  onClick={handleCloseBug}
                  disabled={bug.status === 'verified' || closeLoading}
                >
                  {closeLoading ? 'Closing...' : bug.status === 'verified' ? 'Bug Closed' : 'Close Bug'}
                </button>
                <button 
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400"
                  onClick={() => handleStatusChange('reopened')}
                  disabled={bug.status === 'reopened'}
                >
                  Reopen Bug
                </button>
              </>
            )}
            {isDeveloperAssigned && (
              <>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={bug.status === 'in-progress'}
                >
                  Mark In Progress
                </button>
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
                  onClick={() => handleStatusChange('fixed')}
                  disabled={bug.status === 'fixed'}
                >
                  Mark Fixed
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div key={comment._id} className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {comment.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.user.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{comment.text}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50">
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="2"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition duration-200 whitespace-nowrap"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BugDetails;
