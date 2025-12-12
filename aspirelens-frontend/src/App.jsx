import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import VerifyEmailInfo from './pages/verify-email-info.jsx';
import EmailVerified from './pages/VerifyEmail.jsx';
import VerifyEmail from './pages/email-verified.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from './pages/Dashboard.jsx';
import HeroHome from './pages/HeroHome.jsx';
import MyProfile from './pages/MyProfile.jsx';
// import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
    const location = useLocation();
    const hideNav = ['/login', '/signup', '/verify-email-info', '/email-verified', '/verify-email'];

    return (
        <>
            {(!hideNav.includes(location.pathname.toLowerCase())) && <Navbar />}

            <Routes>
                <Route path="/Nav" element={<Navbar />} />
                <Route path="/" element={<HeroSection />} />
                <Route path="/home-hero" element={<HeroHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
                <Route path="/email-verified" element={<EmailVerified />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }/>

                <Route path="/profile" element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    }/>

                {/* <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/> */}
            </Routes>
        </>
    );
}
