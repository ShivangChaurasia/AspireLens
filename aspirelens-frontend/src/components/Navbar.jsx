import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="h-20 flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <Link to="/"><img src="/aspirelens-logo.png" alt="AspireLens Logo" className="h-32 w-32 mr-2 ml-4"/></Link>
      <ul className="flex space-x-8 ml-auto mr-6 font-bold">
        <li className="hover:text-yellow-300"><Link to="/">Home</Link></li>
        <li className="hover:text-yellow-300"><Link to="/admin">Admin Portal</Link></li>
        <li className="hover:text-yellow-300"><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="space-x-2  font-bold">
        <Link to="/login"><button className="hover:text-yellow-300 border-2 rounded-md p-2">Login</button></Link>
        <Link to="/signup"><button className="hover:text-yellow-300 border-2 rounded-md p-2">SignUp</button></Link>
      </div>
    </nav>
  );
}