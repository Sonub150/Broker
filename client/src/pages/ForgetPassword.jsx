import React, { useState } from 'react';

const BACKEND = (import.meta.env.VITE_BACKEND && import.meta.env.VITE_BACKEND.startsWith('mongodb'))
  ? import.meta.env.VITE_BACKEND
  : (import.meta.env.VITE_BACKEND || import.meta.env.VITE_MONGO || 'http://localhost:3000');

export default function ForgetPassword() {
  // State for form fields and UI
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('link'); // 'link' or 'otp'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Handle sending reset link
  const handleSendLink = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/forgetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setMessage(data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle resetting password with OTP
  const handleResetWithOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/resetpassword-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setMessage('Password reset successful! You can now sign in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 mt-20">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Forgot Password</h2>
        {/* Method selection buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full font-semibold shadow ${method === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-700'}`}
            onClick={() => { setMethod('link'); setOtpSent(false); setMessage(''); setError(''); }}
            disabled={loading}
          >
            Send Reset Link
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold shadow ${method === 'otp' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-700'}`}
            onClick={() => { setMethod('otp'); setOtpSent(false); setMessage(''); setError(''); }}
            disabled={loading}
          >
            Send OTP
          </button>
        </div>
        {/* Email input (always shown) */}
        <form onSubmit={method === 'link' ? handleSendLink : (otpSent ? handleResetWithOtp : handleSendOtp)} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-blue-200 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 shadow-sm"
            required
            disabled={loading || otpSent}
          />
          {/* OTP and new password fields (shown only for OTP method after OTP is sent) */}
          {method === 'otp' && otpSent && (
            <>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border border-blue-200 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 shadow-sm"
                required
                maxLength={6}
              />
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
            </>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold py-2 rounded-full shadow transition text-lg"
            disabled={loading}
          >
            {/* Button text changes based on method and state */}
            {loading
              ? (method === 'link' ? 'Sending...' : (otpSent ? 'Resetting...' : 'Sending OTP...'))
              : (method === 'link' ? 'Send Reset Link' : (otpSent ? 'Reset Password' : 'Send OTP'))}
          </button>
        </form>
        {/* Success and error messages */}
        {message && <div className="mt-4 text-green-600 text-center font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-500 text-center font-semibold">{error}</div>}
      </div>
    </div>
  );
} 