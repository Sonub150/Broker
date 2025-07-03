import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BACKEND = (import.meta.env.Backend && import.meta.env.Backend.startsWith('mongodb'))
  ? import.meta.env.Backend
  : (import.meta.env.Backend || import.meta.env.VITE_MONGO || 'http://localhost:3000');

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!token) {
      setError('Invalid or missing token.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/resetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setMessage('Password reset successful! Redirecting to sign in...');
      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 mt-20">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
            className="border border-blue-200 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 shadow-sm"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="border border-blue-200 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 shadow-sm"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold py-2 rounded-full shadow transition text-lg"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && <div className="mt-4 text-green-600 text-center font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-500 text-center font-semibold">{error}</div>}
      </div>
    </div>
  );
} 