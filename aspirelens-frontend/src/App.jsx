import { Routes, Route, useLocation } from 'react-router-dom'
import WelcomePage from './pages/Welcome.jsx';
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
// import VerifyEmailInfo from './pages/verify-email-info.jsx';
import EmailVerified from './pages/email-verified.jsx';
// import VerifyEmail from './pages/email-verified.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from './pages/Dashboard.jsx';
import HeroHome from './pages/HeroHome.jsx';
import MyProfile from './pages/MyProfile.jsx';
import StartTest from './pages/StartTest.jsx';
import TestRunner from './pages/TestRunner.jsx';
import TestSubmitted from './pages/TestSubmitted.jsx';
import TestResult from './pages/TestResult.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminAuthGuard from './components/AdminAuthGuard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthProvider  from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeContext';
import CareerCounselling from './pages/CareerCounselling.jsx';
import AboutUs from './pages/AboutUs.jsx';

export default function App() {
    const location = useLocation();
    const hideNav = [
      "/login",
      "/signup",
      "/verify-email-info",
      "/email-verified",
      "/verify-email",
      "/start-test",
      "/adminlogin"
    ];

    const shouldHideNav =
      hideNav.includes(location.pathname.toLowerCase()) ||
      location.pathname.startsWith("/test/") ||
      location.pathname.startsWith("/admin/");

    return (
        <ThemeProvider>
            <AuthProvider>
                <>
                    {!shouldHideNav && <Navbar />}
                    <Routes>
                        <Route path='/' element={<WelcomePage></WelcomePage>}/>
                        <Route path="/Nav" element={<Navbar />} />
                        <Route path="/home" element={<HeroSection />} />
                        <Route path="/home-hero" element={<HeroHome />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        {/* <Route path="/verify-email-info" element={<VerifyEmailInfo />} /> */}
                        <Route path="/email-verified" element={<EmailVerified />} />
                        {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}

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
                        <Route path='/aboutus' element={
                            <ProtectedRoute>
                                <AboutUs/>
                            </ProtectedRoute>
                        }/>

                        <Route path='/start-test' element={
                            <ProtectedRoute>
                                <StartTest />
                            </ProtectedRoute>
                        }/>
                        <Route path="/test/:testSessionId" element={
                            <ProtectedRoute>
                                <TestRunner />
                            </ProtectedRoute>
                        }/>
                        <Route path="/test/submitted/:testSessionId" element={
                            <ProtectedRoute>
                                <TestSubmitted />
                            </ProtectedRoute>
                        }/>

                        <Route path="/results/:testSessionId" element={<TestResult />} />
                        <Route path="/counselling/:testSessionId" element={<CareerCounselling />} />

                        
                        {/* Admin Routes */}
                        <Route path='/adminlogin' element={<AdminLogin></AdminLogin>}/>
                        
                        {/* Admin Dashboard Route with AdminLayout */}
                        <Route path='/admin/dashboard' element={
                            <AdminAuthGuard>
                                <AdminLayout>
                                    <AdminDashboard />
                                </AdminLayout>
                            </AdminAuthGuard>
                        }/>
                        
                        {/* Future Admin Routes - all wrapped with AdminLayout */}
                        <Route path='/admin/users' element={
                            <AdminAuthGuard>
                                <AdminLayout>
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Users Management</h1>
                                        <p className="text-gray-600">User management interface - coming soon</p>
                                    </div>
                                </AdminLayout>
                            </AdminAuthGuard>
                        }/>
                        
                        <Route path='/admin/tests' element={
                            <AdminAuthGuard>
                                <AdminLayout>
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tests Management</h1>
                                        <p className="text-gray-600">Test management interface - coming soon</p>
                                    </div>
                                </AdminLayout>
                            </AdminAuthGuard>
                        }/>
                        
                        <Route path='/admin/settings' element={
                            <AdminAuthGuard>
                                <AdminLayout>
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
                                        <p className="text-gray-600">Settings interface - coming soon</p>
                                    </div>
                                </AdminLayout>
                            </AdminAuthGuard>
                        }/>
                    </Routes>
                </>
            </AuthProvider>
        </ThemeProvider>
    );
}