
export default function Navbar() {
  return (
    <nav className="h-20 flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <a href="/"><img src="/aspirelens-logo.png" alt="AspireLens Logo" className="h-32 w-32 mr-2 ml-4"/></a>
      <ul className="flex space-x-16 ml-[800px] mr-[100px] font-bold">
        <li className="hover:text-yellow-300"><a href="/">Home</a></li>
        <li className="hover:text-yellow-300"><a href="/about">About</a></li>
        <li className="hover:text-yellow-300"><a href="/contact">Contact</a></li>
      </ul>
      <div className="space-x-2  font-bold">
        <button className="hover:text-yellow-300 border-2 rounded-md p-2">Login</button>
        <button className="hover:text-yellow-300 border-2 rounded-md p-2">SignUp</button>
      </div>
    </nav>
  );
}