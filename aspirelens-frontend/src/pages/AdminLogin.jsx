import { useState } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
    twoFactorCode: '',
    securityKey: ''
  });
  const [loginStep, setLoginStep] = useState(1); // 1: Credentials, 2: 2FA
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!formData.adminId || !formData.password) {
      setError('Please enter both Admin ID and Password');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setLoginStep(2);
      setError('');
    }, 500);
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (!formData.twoFactorCode) {
      setError('Please enter 2FA code');
      return;
    }
    // Handle final admin login
    console.log('Admin login attempt:', formData);
    // Redirect or show success
  };

  const handleSecurityKeySubmit = (e) => {
    e.preventDefault();
    if (!formData.securityKey) {
      setError('Please enter security key');
      return;
    }
    // Handle security key login
    console.log('Security key login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Security Info */}
        <div className="hidden lg:block">
          <div className="max-w-lg">
            <div className="flex items-center mb-10">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-4 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AspireLens</h1>
                <p className="text-cyan-300 text-sm font-medium">Admin Control Panel</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Secure
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Admin Access
              </span>
            </h2>
            
            <p className="text-gray-300 text-lg mb-10">
              Enhanced security gateway for system administrators. Access requires multi-factor authentication and authorized credentials.
            </p>
            
            {/* Security Features */}
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Multi-Factor Authentication</h4>
                  <p className="text-gray-400 text-sm">Required for all admin accounts</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Encrypted Sessions</h4>
                  <p className="text-gray-400 text-sm">End-to-end TLS 1.3 encryption</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-4">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Activity Monitoring</h4>
                  <p className="text-gray-400 text-sm">All actions are logged and audited</p>
                </div>
              </div>
            </div>
            
            {/* Warning Notice */}
            <div className="mt-10 p-4 bg-gray-900/80 border border-amber-500/30 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-300 mb-1">Security Notice</h4>
                  <p className="text-gray-400 text-sm">
                    This portal is for authorized personnel only. Unauthorized access attempts are monitored and may result in legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Forms */}
        <div className="relative">
          {/* Floating Security Badge */}
          <div className="absolute -top-4 right-4 z-10">
            <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
              <Shield className="h-3 w-3 mr-2" />
              SECURED ACCESS
            </div>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 md:p-10 shadow-2xl">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-10">
              <div className={`flex items-center ${loginStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${loginStep >= 1 ? 'bg-cyan-500/20 border border-cyan-500' : 'bg-gray-700 border border-gray-600'}`}>
                  1
                </div>
                <div className={`h-1 w-16 ${loginStep >= 2 ? 'bg-cyan-500' : 'bg-gray-700'}`} />
              </div>
              <div className={`flex items-center ${loginStep >= 2 ? 'text-cyan-400' : 'text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${loginStep >= 2 ? 'bg-cyan-500/20 border border-cyan-500' : 'bg-gray-700 border border-gray-600'}`}>
                  2
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            {/* Step 1: Credentials */}
            {loginStep === 1 && (
              <>
                <div className="text-center mb-10">
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
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.adminId}
                        onChange={(e) => setFormData({...formData, adminId: e.target.value})}
                        className="pl-10 w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-gray-500"
                        placeholder="admin-username"
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
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-gray-500"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login Methods */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                    >
                      Continue to 2FA
                    </button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800 text-gray-500">Alternative Methods</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShow2FA(true)}
                      className="w-full bg-gray-900/70 border border-gray-600 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-gray-800 hover:border-gray-500 transition-colors mb-3"
                    >
                      Use Security Key
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: 2FA */}
            {loginStep === 2 && (
              <>
                <div className="text-center mb-10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-400">Enter the 6-digit code from your authenticator app</p>
                </div>

                <form onSubmit={handle2FASubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Authentication Code
                    </label>
                    <input
                      type="text"
                      value={formData.twoFactorCode}
                      onChange={(e) => setFormData({...formData, twoFactorCode: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-600 text-white text-center text-2xl tracking-widest rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-500"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Code refreshes every 30 seconds
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setLoginStep(1)}
                      className="bg-gray-900/70 border border-gray-600 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-gray-800 hover:border-gray-500 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Verify & Login
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Security Key Modal (Optional) */}
            {show2FA && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
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

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  <span className="text-cyan-400">⚠️</span> For security assistance, contact{' '}
                  <a href="mailto:security@aspirelens.com" className="text-cyan-400 hover:text-cyan-300">
                    security@aspirelens.com
                  </a>
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  Session will timeout after 15 minutes of inactivity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}