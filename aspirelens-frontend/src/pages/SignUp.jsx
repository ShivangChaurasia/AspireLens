import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axiosConfig';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [LottieComponent, setLottieComponent] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load Lottie animation
  useEffect(() => {
    import('lottie-react')
      .then(module => {
        setLottieComponent(() => module.default);
      })
      .catch(error => {
        console.warn('Failed to load lottie-react:', error);
      });

    import('../Json-Animation/SignUp.json')
      .then(module => {
        setAnimationData(module.default);
      })
      .catch(error => {
        console.warn('Failed to load animation:', error);
      });
  }, []);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({...formData, password: newPassword});
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("You must agree to the Terms & Privacy Policy.");
      return;
    }

    try {
      const res = await api.post("/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      console.log("Signup success:", res.data);
      navigate("/verify-email-info");

    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Geometric floating shapes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${(i * 6.5) % 100}%`,
              top: `${(i * 9) % 100}%`,
              width: `${40 + (i % 5) * 20}px`,
              height: `${40 + (i % 5) * 20}px`,
              background: i % 3 === 0 ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' :
                        i % 3 === 1 ? 'linear-gradient(45deg, #06b6d4, #3b82f6)' : 
                        'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              borderRadius: i % 4 === 0 ? '50%' : i % 4 === 1 ? '30%' : i % 4 === 2 ? '10%' : '40%',
              transform: `translate(${mousePosition.x * (0.5 + i * 0.02)}px, ${mousePosition.y * (0.5 + i * 0.02)}px) rotate(${i * 36}deg)`,
              animation: `floatShape ${15 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              filter: 'blur(20px)',
            }}
          />
        ))}

        {/* Animated lines */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 49%, #3b82f6 50%, transparent 51%),
                            linear-gradient(0deg, transparent 49%, #8b5cf6 50%, transparent 51%)`,
            backgroundSize: '80px 80px',
            animation: 'gridMoveSignup 25s linear infinite',
          }}
        />
        
        {/* Pulsing circles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute border rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              borderColor: i % 3 === 0 ? 'rgba(59, 130, 246, 0.1)' :
                         i % 3 === 1 ? 'rgba(139, 92, 246, 0.08)' : 
                         'rgba(6, 182, 212, 0.06)',
              transform: 'translate(-50%, -50%)',
              animation: `pulseSignup ${8 + i * 2}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Floating dots trail */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${20 + (i * 7)}%`,
              top: `${30 + (i * 4) % 70}%`,
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              opacity: 0.3,
              animation: `dotTrail ${12 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            }}
          />
        ))}

        {/* Wave patterns */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.05), transparent)',
            maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z%22/%3E%3C/svg%3E")',
            animation: 'waveSignup 20s ease-in-out infinite',
          }}
        />

        {/* Light beams */}
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          style={{
            animation: 'lightBeamSignup 15s ease-in-out infinite',
          }}
        />
        
        <div 
          className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"
          style={{
            animation: 'lightBeamSignup 18s ease-in-out infinite reverse',
            animationDelay: '3s',
          }}
        />

      </div>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Signup Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-auto w-full order-2 lg:order-1">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Begin Your Journey</h3>
            <p className="text-gray-500">Join thousands exploring smarter with AspireLens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="First"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Last"
                    required
                  />
                </div>
              </div>
            </div>

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
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength >= 4 ? 'text-green-600' :
                      passwordStrength >= 3 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength >= 4 ? 'Strong' :
                       passwordStrength >= 3 ? 'Good' :
                       passwordStrength >= 2 ? 'Fair' : 'Weak'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength >= 4 ? 'w-full bg-green-500' :
                        passwordStrength >= 3 ? 'w-3/4 bg-yellow-500' :
                        passwordStrength >= 2 ? 'w-1/2 bg-orange-500' :
                        'w-1/4 bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Re-enter your password"
                  required
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>

            {/*Divider
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div> */}

            {/* Social Signup */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div> */}

            {/* Login Link */}
            <div className="text-center pt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign in here
                </a>
              </p>
              <p className="text-gray-600">Have Queries? Contact careerwith.aspirelens@gmail.com</p>
            </div>
          </form>
        </div>

        {/* Right Side - Benefits with Animation */}
        <div className="order-1 lg:order-2">
          <div className="max-w-lg ml-auto">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AspireLens
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start Exploring
              <span className="block text-purple-600">With Purpose</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-6">
              Join a community of learners, explorers, and visionaries. Unlock tools that transform how you see and interact with the world.
            </p>
            
            {/* Lottie Animation Container */}
            <div className="mb-8">
              {LottieComponent && animationData ? (
                <LottieComponent
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', maxWidth: 700, height: 500 }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet'
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Loading Welcome Animation</h4>
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                    <div className="h-2 w-2 bg-pink-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes floatShape {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-40px, 40px) rotate(180deg);
          }
          75% {
            transform: translate(30px, -20px) rotate(270deg);
          }
        }
        
        @keyframes gridMoveSignup {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 80px 80px;
          }
        }
        
        @keyframes pulseSignup {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes dotTrail {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -20px) scale(1.3);
            opacity: 0.6;
          }
          50% {
            transform: translate(-20px, 30px) scale(1.1);
            opacity: 0.4;
          }
          75% {
            transform: translate(15px, -15px) scale(1.2);
            opacity: 0.5;
          }
        }
        
        @keyframes waveSignup {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-50px);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes lightBeamSignup {
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
      `}</style>
    </div>
  );
}