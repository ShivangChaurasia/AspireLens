import { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/authContext';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const { setUser } = useContext(AuthContext);
  const [LottieComponent, setLottieComponent] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Load Lottie component
    import('lottie-react')
      .then(module => {
        setLottieComponent(() => module.default);
      })
      .catch(error => {
        console.warn('Failed to load lottie-react:', error);
      });

    // Load animation data
    import('../Json-Animation/Login.json')
      .then(module => {
        setAnimationData(module.default);
      })
      .catch(error => {
        console.warn('Failed to load animation:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/home-hero");

      console.log("Login Successful:", res.data);

    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Floating gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px)`,
            animation: 'float 15s ease-in-out infinite reverse'
          }}
        />
        
        <div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${-mousePosition.y * 0.4}px)`,
            animation: 'float 25s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            animation: 'float 18s ease-in-out infinite reverse'
          }}
        />

        {/* Animated grid lines */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(59, 130, 246, 0.3) 100%),
                              linear-gradient(0deg, transparent 95%, rgba(6, 182, 212, 0.3) 100%)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 90%, rgba(59, 130, 246, 0.2) 100%),
                              linear-gradient(-45deg, transparent 90%, rgba(6, 182, 212, 0.2) 100%)`,
            backgroundSize: '100px 100px',
            animation: 'gridMove 30s linear infinite reverse',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animation: `particleFloat ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            }}
          />
        ))}

        {/* Wave lines */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400/5 to-transparent"
          style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22%3E%3Cpath d=%22M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z%22/%3E%3Cpath d=%22M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35 6.36 117.1-6.53 35.75-12.89 74.22-28.1 109.63-44.16 35.44-16.07 74.47-33.26 108.46-50 33.99-16.74 71.18-36.82 99.58-56.5 28.4-19.68 50.4-41.05 72.19-63.96 21.79-22.92 43.6-47.3 64.49-72.72 20.89-25.42 41.78-51.87 63.19-78.24 21.41-26.37 43.3-53.68 65.2-81.29V0z%22/%3E%3C/svg%3E")',
            animation: 'waveMove 15s ease-in-out infinite',
          }}
        />
        
        <div 
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cyan-400/5 to-transparent"
          style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22%3E%3Cpath d=%22M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z%22/%3E%3Cpath d=%22M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35 6.36 117.1-6.53 35.75-12.89 74.22-28.1 109.63-44.16 35.44-16.07 74.47-33.26 108.46-50 33.99-16.74 71.18-36.82 99.58-56.5 28.4-19.68 50.4-41.05 72.19-63.96 21.79-22.92 43.6-47.3 64.49-72.72 20.89-25.42 41.78-51.87 63.19-78.24 21.41-26.37 43.3-53.68 65.2-81.29V0z%22/%3E%3C/svg%3E")',
            animation: 'waveMove 20s ease-in-out infinite reverse',
            animationDelay: '2s',
          }}
        />

        {/* Animated light streaks */}
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          style={{
            animation: 'lightStreak 8s ease-in-out infinite',
          }}
        />
        
        <div 
          className="absolute top-20 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
          style={{
            animation: 'lightStreak 12s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        
        <div 
          className="absolute bottom-20 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
          style={{
            animation: 'lightStreak 15s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />

        {/* Pulsing circles */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-300/20 rounded-full"
          style={{
            animation: 'pulseRing 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-300/15 rounded-full"
          style={{
            animation: 'pulseRing 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '1s',
          }}
        />

      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Brand/Info with Animation */}
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="flex items-center mb-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-4">
                <span className="text-white text-2xl">🔭</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                AspireLens
              </h1>
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              See Your World
              <span className="block text-blue-600">More Clearly</span>
            </h2>

            <p className="text-gray-600 text-lg">
              Access personalized insights, smart analytics, and tools that help you navigate your educational journey with precision.
            </p>

            <div className="mr-">
              {LottieComponent && animationData ? (
                <LottieComponent
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', maxWidth: 700, height: 550 }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet'
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mb-4">
                    <span className="text-4xl">🔭</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Loading Interactive Experience</h4>
                  <p className="text-gray-600 text-sm max-w-md">
                    Preparing your personalized login experience...
                  </p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Empty space for features if needed later */}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-500">Sign in to continue your exploration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Forgot password? careerwith.aspirelens@gmail.com
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Create one now
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -50px);
          }
          66% {
            transform: translate(-20px, 40px);
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100px 100px;
          }
        }
        
        @keyframes waveMove {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-30px);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes lightStreak {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          80%, 100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}