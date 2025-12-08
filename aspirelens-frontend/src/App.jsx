import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

export default function App(){
    const location = useLocation();
    const hideNav = ['/login', '/signup'];
    return (
        <>
            {(!hideNav.includes(location.pathname)) && <Navbar></Navbar>}
            <Routes>
                <Route path="/Nav" element={<Navbar />} />
                <Route path="/" element={<HeroSection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </>
    )
}