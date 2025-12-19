import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function EmailVerified() {
  const navigate = useNavigate();
  const [LottieComponent, setLottieComponent] = useState(null);
  const [animationData, setAnimationData] = useState(null);

  // Dynamically load Lottie and animation
  useEffect(() => {
    // Load Lottie component
    import('lottie-react')
      .then(module => {
        setLottieComponent(() => module.default);
      })
      .catch(error => {
        console.warn('Failed to load lottie-react:', error);
      });

    // Load success animation
    import('../Json-Animation/success.json')
      .then(module => {
        setAnimationData(module.default);
      })
      .catch(error => {
        console.warn('Failed to load animation:', error);
      });

    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white px-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-green-100">
        
        {/* Success Animation */}
        <div className="mb-8">
          {LottieComponent && animationData ? (
            <div className="max-w-[280px] mx-auto">
              <LottieComponent
                animationData={animationData}
                loop={true}
                autoplay={true}
                speed={0.8}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid meet'
                }}
              />
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping"></div>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-4 animate-fadeIn">
            <CheckCircle className="h-4 w-4 mr-2" />
            Verification Complete
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email Verified
            <span className="block text-5xl mt-2">🎉</span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Your account has been successfully activated and verified.
            Welcome to the AspireLens community!
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fadeIn">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Account secured</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>All features unlocked</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Ready to explore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <span>Go to Login</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 py-3 rounded-xl font-medium hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200"
          >
            Back to Homepage
          </button>
        </div>

        {/* Redirect Timer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span>Redirecting to login in 5 seconds...</span>
          </div>
          
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-blue-600 text-sm">🔒</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600">
                Your account is now fully secured. For any assistance, contact our support team.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}