import { useState, useEffect, useContext } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import api from '../api/api.js';
import { signInWithGoogle } from '../firebase.js';

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setFormData({ ...formData, password: newPassword });
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

    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      console.log("Signup success:", res.data);
      navigate("/email-verified");

    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { idToken } = await signInWithGoogle();
      const res = await api.post("/api/auth/google-login", { idToken });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
      console.log("Google Signup Successful:", res.data);
    } catch (error) {
      console.error("Google Signup Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

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

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-2 sm:px-0">

        {/* Left Side - Signup Form */}
        <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-md mx-auto w-full order-2 lg:order-1 transition-colors duration-300">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Begin Your Journey</h3>
            <p className="text-gray-500 dark:text-gray-400">Join thousands exploring smarter with AspireLens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="First"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
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
                    <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                    <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-600' :
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
                      className={`h-full transition-all duration-300 ${passwordStrength >= 4 ? 'w-full bg-green-500' :
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
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
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-sm text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            {/* Google Sign-Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-semibold">
                  Sign in here
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Have Queries? Contact careerwith.aspirelens@gmail.com</p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Benefits with Animation */}
        <div className="order-1 lg:order-2 hidden lg:block">
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