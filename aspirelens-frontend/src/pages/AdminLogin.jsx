import axios from "axios";
import { useState, useEffect } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
    twoFactorCode: '',
    securityKey: ''
  });
  const [loginStep, setLoginStep] = useState(1);
  const [error, setError] = useState('');
  const [LottieComponent, setLottieComponent] = useState(null);
  const [animationData, setAnimationData] = useState(null);

  // Dynamically load Lottie and animation data
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
    import('../Json-Animation/AdminAuth.json')
      .then(module => {
        setAnimationData(module.default);
      })
      .catch(error => {
        console.warn('Failed to load animation:', error);
      });
  }, []);

  // Rest of your existing functions (handleCredentialsSubmit, handle2FASubmit, etc.)
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.adminId || !formData.password) {
      setError("Please enter both Admin ID and Password");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/auth/login-password",
        {
          email: formData.adminId,
          password: formData.password,
        }
      );

      setLoginStep(2);
    } catch (error) {
      setError(
        error.response?.data?.message || "Admin login failed"
      );
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!formData.twoFactorCode) {
      setError("Please enter OTP");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/auth/verify-otp",
        {
          email: formData.adminId,
          otp: formData.twoFactorCode,
        }
      );
    
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  };

  const handleSecurityKeySubmit = (e) => {
    e.preventDefault();
    if (!formData.securityKey) {
      setError('Please enter security key');
      return;
    }
    console.log('Security key login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
        {/* Left Side - Animation Display */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-xl">
            {/* Logo Section */}
            <div className="flex items-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-4 shadow-xl animate-pulse">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">AspireLens</h1>
                <p className="text-cyan-300 text-lg font-medium mt-1">Secure Admin Portal</p>
              </div>
            </div>
            
            {/* Animation Container */}
            {/* <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-2xl mb-8"> */}
              {/* <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Authentication Security</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5">
                    <span className="text-gray-300 text-sm mr-2">Security Active</span>
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div> */}

              {/* Animation or Fallback */}
              {/* <div className="flex justify-center items-center bg-gray-900/30 rounded-2xl p-4 border border-gray-700/30 min-h-[300px]"> */}
            <div className="mr-16">

              {LottieComponent && animationData ? (
                <LottieComponent
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', maxWidth: 800, height: 600 }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet'
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mb-6">
                    <Shield className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Security Animation Loading</h4>
                  <p className="text-gray-400 text-sm max-w-md">
                    Multi-layer authentication visualization. 
                    Each animated layer represents a different security protocol.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 group">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Shield className="h-5 w-5 text-cyan-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Military-Grade Encryption</h4>
                        <p className="text-gray-500 text-xs">AES-256 & TLS 1.3</p>
                      </div>
                    </div>
              
                    <div className="flex items-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all duration-300 group">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Lock className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Zero Trust Model</h4>
                        <p className="text-gray-500 text-xs">Verify every request</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 mt-6">
                    <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
            </div>
              {/* </div> */}
              
              {/* Animation Description */}
                {/* <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mr-3 mt-1">
                      <Lock className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">Multi-Layer Security Protocol</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Visual representation of our layered authentication system showing encryption, verification, and authorization processes in real-time.
                      </p>
                    </div>
                  </div>
                </div> */}
            {/* </div> */}
            
            {/* Security Stats */}
            {/* <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center">
                <div className="text-3xl font-bold text-green-300 mb-1">256-bit</div>
                <div className="text-gray-400 text-sm">Encryption</div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Monitoring</div>
              </div>
            </div> */}
            
            {/* Security Features */}
          </div>
        </div>

        {/* Rest of your existing JSX remains the same */}
        {/* Right Side - Login Forms */}
        <div className="lg:col-span-5 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 shadow-2xl">
              {/* SECURED ACCESS Badge */}
              <div className="flex justify-center mb-6">
                <div className="px-5 py-2.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center animate-pulse">
                  <Shield className="h-4 w-4 mr-2" />
                  Secured Access
                  <div className="ml-2 h-2 w-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className={`flex items-center ${loginStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${loginStep >= 1 ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-gray-700 border-2 border-gray-600'}`}>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className={`h-1 w-20 ${loginStep >= 2 ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                </div>
                <div className={`flex items-center ${loginStep >= 2 ? 'text-cyan-400' : 'text-gray-500'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${loginStep >= 2 ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-gray-700 border-2 border-gray-600'}`}>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              {/* Step 1: Credentials */}
              {loginStep === 1 && (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Admin Authentication</h3>
                    <p className="text-gray-400">Enter your administrator credentials</p>
                  </div>

                  <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                    {/* Admin ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admin ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.adminId}
                          onChange={(e) => setFormData({...formData, adminId: e.target.value})}
                          className="pl-12 w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-gray-500"
                          placeholder="admin@aspirelens.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Master Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="pl-12 pr-12 w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-gray-500"
                          placeholder="••••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Login Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                      >
                        Continue to 2FA
                      </button>
                      
                      <div className="text-center">
                        <p className="text-gray-500 text-sm">
                          Don't have an account?{' '}
                          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Request Access
                          </a>
                        </p>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Step 2: 2FA */}
              {loginStep === 2 && (
                <>
                  <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-400">Enter the 6-digit code sent to your email</p>
                    <p className="text-cyan-300 text-sm mt-2 font-medium">
                      {formData.adminId}
                    </p>
                  </div>

                  <form onSubmit={handle2FASubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Authentication Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.twoFactorCode}
                          onChange={(e) => setFormData({...formData, twoFactorCode: e.target.value})}
                          className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white text-center text-2xl tracking-widest rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-500"
                          placeholder="000000"
                          maxLength="6"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Lock className="h-3 w-3 text-green-400" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Check your email for the verification code (Valid for 10 minutes)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setLoginStep(1)}
                        className="bg-gray-900/70 border border-gray-600 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-gray-800 hover:border-gray-500 transition-colors flex items-center justify-center"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        Verify & Login →
                      </button>
                    </div>
                    
                    <div className="text-center pt-4">
                      <button
                        type="button"
                        className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                        onClick={() => {
                          // Resend OTP logic here
                          console.log('Resend OTP');
                        }}
                      >
                        Didn't receive code? Resend
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    <span className="text-amber-400">⚠️</span> For security assistance, contact{' '}
                    <a href="mailto:careerwith.aspirelens@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      security@aspirelens.com
                    </a>
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Session timeout: 15 minutes • All activities are logged
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Key Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Security Key Login</h3>
              <p className="text-gray-400 text-sm">Insert your physical security key</p>
            </div>

            <form onSubmit={handleSecurityKeySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Security Key
                </label>
                <input
                  type="password"
                  value={formData.securityKey}
                  onChange={(e) => setFormData({...formData, securityKey: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Press the button on your key"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="bg-gray-900/70 border border-gray-600 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Verify Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}