import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles, Shield, Rocket } from "lucide-react";

export default function EmailVerified() {
  const navigate = useNavigate();
  const [LottieComponent, setLottieComponent] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // Lazy-load lottie
    import("lottie-react")
      .then((module) => setLottieComponent(() => module.default))
      .catch(() => null);

    // Load animation
    import("../Json-Animation/success.json")
      .then((module) => setAnimationData(module.default))
      .catch(() => null);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto redirect (IMPORTANT: replace to avoid loop)
    const redirectTimer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 9000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-cyan-50 px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-float"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/50 relative overflow-hidden group">
          
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          {/* Corner Accents */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-green-500/10 rounded-tr-3xl"></div>

          {/* Header Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm font-bold mb-8 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            <Shield className="h-4 w-4 mr-2" />
            <span>Account Verified</span>
            <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
          </div>

          {/* Animation Section */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-emerald-400/30 to-green-400/30 rounded-full blur-xl animate-ping-slow"></div>
            </div>
            
            {LottieComponent && animationData ? (
              <div className="max-w-[280px] mx-auto relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                <LottieComponent
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  speed={0.7}
                />
              </div>
            ) : (
              <div className="flex justify-center relative z-10">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-2xl animate-bounce-subtle">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
              </div>
            )}
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2 p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg animate-float">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg animate-float-delayed">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="mb-10 space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-cyan-600 bg-clip-text text-transparent animate-slideUp">
              Email Verified 🎉
            </h1>
            
            <div className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                Your AspireLens account is now <span className="text-emerald-600 font-bold">active and secure</span>.
              </p>
              
              <div className="inline-flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">Account Ready</span>
                </div>
                <div className="h-4 w-px bg-emerald-200"></div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse delay-300"></div>
                  <span className="text-sm font-medium text-green-700">Profile Complete</span>
                </div>
                <div className="h-4 w-px bg-emerald-200"></div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-cyan-500 rounded-full mr-2 animate-pulse delay-600"></div>
                  <span className="text-sm font-medium text-cyan-700">Access Granted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-5">
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center">
                Launch Your Journey
                <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 py-4 rounded-2xl font-semibold hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 hover:scale-[1.02]"
            >
              Explore Homepage
            </button>
          </div>

          {/* Countdown & Redirect */}
          <div className="mt-10 pt-8 border-t border-emerald-100">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-emerald-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-600">{countdown}</span>
                </div>
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Redirecting to login in <span className="text-emerald-600 font-bold">{countdown}</span> seconds...
                </p>
                <div className="mt-2 h-1.5 w-48 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(4 - countdown) * 25}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="mt-8 flex justify-center space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom animations to your CSS or Tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}