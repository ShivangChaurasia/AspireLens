import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import ThemeContext from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <nav className="h-20 flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-gray-900 dark:to-gray-800 text-white transition-colors duration-300">
      <Link to="/"><img src="/aspirelens-logo.png" alt="AspireLens Logo" className="h-[60px] w-[150px] mr-2 ml-4" /></Link>
      <ul className="flex space-x-8 ml-auto mr-6 font-bold">
        <li className="hover:text-yellow-300"><Link to="/">Home</Link></li>
        {!user && (<li className="hover:text-yellow-300"><Link to="/adminlogin">Admin Portal</Link></li>)}
        {user && (<li className="hover:text-yellow-300"><Link to="/dashboard">Dashboard</Link></li>)}
        {user && user.role === 'admin' && (<li className="hover:text-yellow-300"><Link to="/admin/dashboard">Admin Dashboard</Link></li>)}
        {user && (<li className="hover:text-yellow-300"><Link to="/profile">My Profile</Link></li>)}
        <li className="hover:text-yellow-300"><Link to="/aboutus">About Us</Link></li>
      </ul>
      <div className="flex items-center space-x-2 font-bold">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-xl border border-white/20 hover:scale-110"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {!user && (
          <>
            <Link to="/login">
              <button className="hover:text-yellow-300 border-2 rounded-md p-2">
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button className="hover:text-yellow-300 border-2 rounded-md p-2">
                SignUp
              </button>
            </Link>
          </>
        )}

        {/* Show Logout ONLY when user IS logged in */}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="hover:text-yellow-300 border-2 rounded-md p-2"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}