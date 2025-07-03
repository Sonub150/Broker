import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/broker-logo.svg'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import{signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice'
import Oauth from '../components/Oauth'
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';



// Use backend URL from environment variable or fallback to localhost
const BACKEND = import.meta.env.VITE_BACKEND || 'https://broker-5m9x.onrender.com';

function Signin() {
  // State for form fields, error/success messages, loading, and password visibility
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes and reset messages
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  // Handle form submission and sign-in API call
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Basic validation
    if (!form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    dispatch(signInStart())
    setError('')
    setSuccess('')
    try {
      // Make POST request to backend /api/signin
      const res = await axios.post(`${BACKEND}/api/signin`, form, { withCredentials: true })
      dispatch(signInSuccess(res.data)); // Set user in Redux
      setSuccess('Sign in successful! Redirecting...')
      setError('')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      // Show error message from backend or generic error
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Sign in failed. Please try again.')
      }
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  // Google sign-in with Firebase
  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(signInSuccess(result.user)); // Set user in Redux
      setSuccess('Google sign-in successful!');
      setError('');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setError('Google sign-in failed.');
      setSuccess('');
    }
  };

  // GitHub sign-in with Firebase
  const handleGithubSignin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, githubProvider);
      dispatch(signInSuccess(result.user)); // Set user in Redux
      setSuccess('GitHub sign-in successful!');
      setError('');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setError('GitHub sign-in failed.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-2 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left side: Logo and welcome back (desktop only) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-400 via-blue-300 to-blue-500 p-10 w-1/2 text-white relative">
          <img src={logo} alt="BrokerX Logo" className="h-20 w-20 rounded-full shadow-lg border-4 border-white bg-white p-2 mb-6" />
          <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">Welcome Back!</h2>
          <p className="text-lg font-medium mb-4 text-blue-50/90 text-center">Sign in to access your broker dashboard and manage your account.</p>
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
            <span className="text-sm text-blue-100/80">Don't have an account?</span>
            <Link to="/sign-up" className="text-white font-semibold underline hover:text-blue-200 transition">Sign Up</Link>
          </div>
        </div>
        {/* Right side: Signin form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10">
          {/* Logo and site name for mobile */}
          <div className="flex flex-col items-center mb-6 md:hidden">
            <img src={logo} alt="BrokerX Logo" className="h-14 w-14 rounded-full shadow border-2 border-green-200 bg-white p-1 mb-2" />
            <span className="text-2xl font-extrabold text-green-700 tracking-tight drop-shadow">BrokerX</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center text-green-700">Sign In</h1>
          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-green-100"></div>
            <span className="mx-2 text-gray-400 text-sm">Sign In</span>
            <div className="flex-grow border-t border-green-100"></div>
          </div>
          {/* Error and success messages */}
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
          {/* Sign-in form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50"
                disabled={loading}
              />
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50 pr-10"
                disabled={loading}
              />
              {/* Password visibility toggle */}
              <button
                type="button"
                className="absolute right-3 top-9 text-green-400 hover:text-green-600 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="mt-2 text-right">
                <Link to="/forget-password" className="text-blue-500 hover:underline text-sm font-medium">Forgot password?</Link>
              </div>
            </div>
            {/* Submit button with loading spinner and animation */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow transition mb-6 text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-200
                ${loading ? 'cursor-not-allowed opacity-80 animate-pulse' : 'hover:scale-[1.03] active:scale-100'}`}
              disabled={loading}
            >
              {loading && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-blue-400 border-b-green-400 rounded-full animate-spin bg-gradient-to-tr from-green-200 to-blue-200"></span>
              )}
              <span className="tracking-wide">{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
            <Oauth/>
          </form>
          {/* Sign up link for mobile */}
          <div className="text-center text-gray-500 text-sm mb-1 md:hidden">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-green-600 hover:underline font-medium">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
