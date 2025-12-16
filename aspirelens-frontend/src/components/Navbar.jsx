import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import  AuthContext from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  return (
    <nav className="h-20 flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <Link to="/"><img src="/aspirelens-logo.png" alt="AspireLens Logo" className="h-32 w-32 mr-2 ml-4"/></Link>
      <ul className="flex space-x-8 ml-auto mr-6 font-bold">
        {user && <li className="hover:text-yellow-300"><Link to="/home-hero">Home</Link></li>}
        {!user && <li className="hover:text-yellow-300"><Link to="/home">Home</Link></li>}
        {!user && (<li className="hover:text-yellow-300"><Link to="/admin">Admin Portal</Link></li>)}
        {user && (<li className="hover:text-yellow-300"><Link to="/dashboard">Dashboard</Link></li>)}
        {user && user.role === 'admin' && (<li className="hover:text-yellow-300"><Link to="/admin/dashboard">Admin Dashboard</Link></li>)}
        {user && (<li className="hover:text-yellow-300"><Link to="/profile">My Profile</Link></li>)}
        <li className="hover:text-yellow-300"><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="space-x-2  font-bold">
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