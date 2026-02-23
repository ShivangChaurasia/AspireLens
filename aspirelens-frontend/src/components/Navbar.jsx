import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthContext from '../context/authContext';
import ThemeContext from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="h-20 flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-gray-900 dark:to-gray-800 text-white transition-colors duration-300 relative z-50">
      {/* Logo */}
      <Link to="/" onClick={closeMenu}>
        <img src="/aspirelens-logo.png" alt="AspireLens Logo" className="h-[60px] w-[150px] mr-2 ml-4" />
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex space-x-8 ml-auto mr-6 font-bold">
        <li className="hover:text-yellow-300"><Link to="/">Home</Link></li>
        {!user && <li className="hover:text-yellow-300"><Link to="/adminlogin">Admin Portal</Link></li>}
        {user && <li className="hover:text-yellow-300"><Link to="/dashboard">Dashboard</Link></li>}
        {user && user.role === 'admin' && <li className="hover:text-yellow-300"><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
        {user && <li className="hover:text-yellow-300"><Link to="/profile">My Profile</Link></li>}
        <li className="hover:text-yellow-300"><Link to="/aboutus">About Us</Link></li>
      </ul>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex items-center space-x-2 font-bold">
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-xl border border-white/20 hover:scale-110"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {!user && (
          <>
            <Link to="/login"><button className="hover:text-yellow-300 border-2 rounded-md p-2">Login</button></Link>
            <Link to="/signup"><button className="hover:text-yellow-300 border-2 rounded-md p-2">SignUp</button></Link>
          </>
        )}
        {user && (
          <button onClick={() => { logout(); navigate("/login"); }} className="hover:text-yellow-300 border-2 rounded-md p-2">
            Logout
          </button>
        )}
      </div>

      {/* Mobile Right Controls */}
      <div className="flex md:hidden items-center space-x-2 ml-auto">
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-xl border border-white/20"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-gradient-to-b from-cyan-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 shadow-xl z-50 py-4 px-6 flex flex-col space-y-4 font-bold text-white">
          <Link to="/" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">Home</Link>
          {!user && <Link to="/adminlogin" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">Admin Portal</Link>}
          {user && <Link to="/dashboard" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">Dashboard</Link>}
          {user && user.role === 'admin' && <Link to="/admin/dashboard" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">Admin Dashboard</Link>}
          {user && <Link to="/profile" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">My Profile</Link>}
          <Link to="/aboutus" onClick={closeMenu} className="hover:text-yellow-300 py-2 border-b border-white/20">About Us</Link>

          <div className="flex flex-col space-y-2 pt-2">
            {!user && (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <button className="w-full text-left hover:text-yellow-300 border-2 rounded-md p-2">Login</button>
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  <button className="w-full text-left hover:text-yellow-300 border-2 rounded-md p-2">SignUp</button>
                </Link>
              </>
            )}
            {user && (
              <button onClick={() => { logout(); navigate("/login"); closeMenu(); }} className="w-full text-left hover:text-yellow-300 border-2 rounded-md p-2">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}