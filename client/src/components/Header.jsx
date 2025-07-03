import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaUser, FaSignInAlt, FaUserPlus, FaInfoCircle, FaSearch, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import logo from '../assets/broker-logo.svg'
import { useSelector } from 'react-redux'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navSearch, setNavSearch] = useState('')
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser)
  // Support both direct user object and nested user object (backend response)
  const user = currentUser?.data?.user || currentUser;

  return (
    <header className="bg-gradient-to-r from-white via-green-100 to-blue-100 shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-3 sm:p-4">
        {/* Left: Logo and Site Name */}
        <div className="flex items-center gap-3 z-20 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="BrokerX Logo" className="h-12 w-12 rounded-full shadow border-2 border-green-200 bg-white p-1 transition-transform group-hover:scale-110" />
            <span className="text-3xl font-extrabold text-gray-700 tracking-tight drop-shadow hidden sm:inline">BrokerX</span>
          </Link>
        </div>
        {/* Center: Search Bar (desktop only) */}
        <form className="hidden sm:block flex-1 mx-8 max-w-lg" onSubmit={e => {
          e.preventDefault();
          if (!navSearch.trim()) return;
          navigate(`/search-results?q=${encodeURIComponent(navSearch)}`);
        }}>
          <div className="relative">
            <input
              type="text"
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-4 pr-12 py-2 rounded-full border border-green-100 bg-white shadow focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 transition text-gray-700"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-blue-400 bg-white rounded-full p-1 shadow">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </form>
        {/* Right: Hamburger and Nav */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger Icon for Mobile */}
          <button
            className="sm:hidden z-30 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes className="w-7 h-7 text-green-500" /> : <FaBars className="w-7 h-7 text-green-500" />}
          </button>
          {/* Navigation Links */}
          <nav className={`flex-col sm:flex-row flex gap-4 items-center
            ${menuOpen ? 'flex fixed top-0 left-0 w-full h-full bg-white/90 z-20 justify-center sm:static sm:bg-transparent sm:w-auto sm:h-auto sm:justify-end' : 'hidden sm:flex'}
          `}>
            <Link to="/" className="flex items-center gap-1 text-gray-700 font-medium px-3 py-2 rounded-lg transition bg-transparent hover:bg-gradient-to-r hover:from-green-200 hover:via-blue-100 hover:to-blue-200 hover:shadow-md hover:text-green-700" onClick={() => setMenuOpen(false)}>
              <FaHome className="w-5 h-5" /> Home
            </Link>
            <Link to="/about" className="flex items-center gap-1 text-gray-700 font-medium px-3 py-2 rounded-lg transition bg-transparent hover:bg-gradient-to-r hover:from-green-200 hover:via-blue-100 hover:to-blue-200 hover:shadow-md hover:text-green-700" onClick={() => setMenuOpen(false)}>
              <FaInfoCircle className="w-5 h-5" /> About
            </Link>
            {user && user.email ? (
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 font-medium px-3 py-2 rounded-lg transition bg-transparent hover:bg-gradient-to-r hover:from-green-200 hover:via-blue-100 hover:to-blue-200 hover:shadow-md hover:text-green-700" onClick={() => setMenuOpen(false)}>
                {user.photoURL || user.avatar ? (
                  <img src={user.photoURL || user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-green-200 shadow object-cover" />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-green-300" />
                )}
                <span className="hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <>
                <Link to="/sign-in" className="flex items-center gap-1 text-gray-700 font-medium px-3 py-2 rounded-lg transition bg-transparent hover:bg-gradient-to-r hover:from-green-200 hover:via-blue-100 hover:to-blue-200 hover:shadow-md hover:text-green-700" onClick={() => setMenuOpen(false)}>
                  <FaSignInAlt className="w-5 h-5" /> Sign In
                </Link>
                <Link to="/sign-up" className="flex items-center gap-1 text-white bg-green-400 hover:bg-gradient-to-r hover:from-green-400 hover:via-green-300 hover:to-blue-200 hover:text-green-900 font-semibold px-4 py-2 rounded-full shadow transition" onClick={() => setMenuOpen(false)}>
                  <FaUserPlus className="w-5 h-5" /> Sign Up
                </Link>
              </>
            )}
            {/* Search bar for mobile (shown only in mobile menu) */}
            <form className="w-full px-4 mt-4 sm:hidden" onSubmit={e => {
              e.preventDefault();
              if (!navSearch.trim()) return;
              setMenuOpen(false);
              navigate(`/search-results?q=${encodeURIComponent(navSearch)}`);
            }}>
              <div className="relative">
                <input
                  type="text"
                  value={navSearch}
                  onChange={e => setNavSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-4 pr-12 py-2 rounded-full border border-green-100 bg-white shadow focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 transition text-gray-700"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-blue-400 bg-white rounded-full p-1 shadow">
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </header>
  )
}
