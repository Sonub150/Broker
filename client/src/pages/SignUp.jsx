import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/broker-logo.svg'
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa'
import axios from 'axios'
import Oauth from '../components/Oauth'
import { auth, googleProvider, githubProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'

const BACKEND = import.meta.env.VITE_BACKEND || 'http://localhost:3000';

function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await axios.post(`${BACKEND}/api/signup`, form)
      setSuccess('Signup successful! Redirecting to sign in...')
      setError('')
      setForm({ username: '', email: '', password: '' })
      setTimeout(() => navigate('/sign-in'), 1500)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Signup failed. Please try again.')
      }
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  // Google sign-in with Firebase
  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in result:', result); // Debug: log the full result
      setSuccess('Google sign-in successful!');
      setError('');
      setTimeout(() => navigate('/'), 1000); // Redirect to home after success
      // Optionally: send result.user to backend or store in Redux
    } catch (err) {
      setError('Google sign-in failed.');
      setSuccess('');
    }
  };

  // GitHub sign-in with Firebase
  const handleGithubSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setSuccess('GitHub sign-in successful!');
      setError('');
    } catch (err) {
      setError('GitHub sign-in failed.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-2 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left side: Logo and welcome */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-400 via-blue-300 to-blue-500 p-10 w-1/2 text-white relative">
          <img src={logo} alt="BrokerX Logo" className="h-20 w-20 rounded-full shadow-lg border-4 border-white bg-white p-2 mb-6" />
          <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">Welcome to BrokerX</h2>
          <p className="text-lg font-medium mb-4 text-blue-50/90 text-center">Create your account to join our broker platform and unlock exclusive features.</p>
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
            <span className="text-sm text-blue-100/80">Already have an account?</span>
            <Link to="/sign-in" className="text-white font-semibold underline hover:text-blue-200 transition">Sign In</Link>
          </div>
        </div>
        {/* Right side: Signup form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10">
          <div className="flex flex-col items-center mb-6 md:hidden">
            <img src={logo} alt="BrokerX Logo" className="h-14 w-14 rounded-full shadow border-2 border-green-200 bg-white p-1 mb-2" />
            <span className="text-2xl font-extrabold text-green-700 tracking-tight drop-shadow">BrokerX</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center text-green-700">Create your account</h1>
          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-green-100"></div>
            <span className="mx-2 text-gray-400 text-sm">Sign Up</span>
            <div className="flex-grow border-t border-green-100"></div>
          </div>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1 font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50"
                disabled={loading}
              />
            </div>
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
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50 pr-10"
                disabled={loading}
              />
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
            </div>
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow transition mb-6 text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-200
                ${loading ? 'cursor-not-allowed opacity-80 animate-pulse' : 'hover:scale-[1.03] active:scale-100'}`}
              disabled={loading}
            >
              {loading && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-blue-400 border-b-green-400 rounded-full animate-spin bg-gradient-to-tr from-green-200 to-blue-200"></span>
              )}
              <span className="tracking-wide">{loading ? 'Signing Up...' : 'Sign Up'}</span>
            </button>
            <Oauth/>
          </form>
          {/* Social signup buttons */}
          <div className="flex flex-col gap-3 mb-3">
            <button onClick={handleGoogleSignup} className="flex items-center justify-center gap-3 w-full py-2 rounded-full border border-gray-200 bg-white hover:bg-green-50 shadow-sm font-semibold text-gray-700 transition" disabled={loading}>
              <FaGoogle className="text-red-500 w-5 h-5" /> Sign up with Google
            </button>
            <button onClick={handleGithubSignup} className="flex items-center justify-center gap-3 w-full py-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 shadow-sm font-semibold text-gray-700 transition" disabled={loading}>
              <FaGithub className="text-gray-800 w-5 h-5" /> Sign up with GitHub
            </button>
          </div>
          {/* Sign in link for mobile */}
          <div className="text-center text-gray-500 text-sm mb-1 md:hidden">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-green-600 hover:underline font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
