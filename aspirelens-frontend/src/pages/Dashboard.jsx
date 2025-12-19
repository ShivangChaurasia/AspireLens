import { useContext, useEffect, useState } from "react";
import api from "../api/api";
import AuthContext from "../context/authContext";
import { Link } from "react-router-dom";

import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Clock, 
  Brain, 
  Rocket, 
  Sparkles, 
  BarChart3,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  Zap,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileCompletion: 0,
    testsTaken: 0,
    weeklyProgress: 0,
    dailyStreak: 0,
    lastActive: null,
  });

  // Fetch user data (instead of separate stats endpoint)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch fresh user data from backend
      const res = await api.get(
        "/api/user/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = res.data;
      
      // Calculate stats from user data
      setStats({
        profileCompletion: userData.profile?.profileCompletion || 0,
        testsTaken: userData.profile?.testsTaken || 0,
        weeklyProgress: Math.min(100, (userData.profile?.testsTaken || 0) * 20), // Example calculation
        dailyStreak: 1, // Default - would come from separate streak tracking
        lastActive: userData.profile?.lastActive || null,
      });

      // Update activity in background
      try {
        await api.post(
          "/api/user/update-activity",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (activityErr) {
        console.log("Activity update failed:", activityErr.message);
      }

    } catch (err) {
      console.log("Dashboard Load Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  const { profileCompletion, testsTaken, dailyStreak } = stats;

  // Format last active time
  const formatLastActive = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const now = new Date();
      const lastActive = new Date(dateString);
      const diffHours = Math.floor((now - lastActive) / (1000 * 60 * 60));
      
      if (diffHours === 0) return "Just now";
      if (diffHours === 1) return "1 hour ago";
      if (diffHours < 24) return `${diffHours} hours ago`;
      return "Today";
    } catch {
      return "Today";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ---------------------- */}
        {/* 1. Welcome Section - Enhanced */}
        {/* ---------------------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 p-8 md:p-10 shadow-2xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Welcome back</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Hello, {user?.firstName || "Explorer"}! 👋
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
              Your journey to smarter career decisions continues. Here's your Dashboard.
            </p>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-white/90">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm">
                  Last active: {formatLastActive(stats.lastActive)}
                </span>
              </div>
              {user?.profile?.educationLevel && (
                <>
                  <div className="h-4 w-px bg-white/30" />
                  <div className="flex items-center gap-2 text-white/90">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{user.profile.educationLevel}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300/10 rounded-full -translate-x-20 translate-y-20" />
        </section>

        {/* ---------------------- */}
        {/* 3. Stats Section - Enhanced */}
        {/* ---------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Progress Dashboard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Profile Completion</h3>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {profileCompletion}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {profileCompletion < 50 ? "Let's get started!" : 
                   profileCompletion < 80 ? "Great progress!" : 
                   profileCompletion < 100 ? "Almost there!" : 
                   "Perfect! 🎉"}
                </div>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Tests Taken</h3>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {testsTaken}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {testsTaken === 0 ? "Ready for your first test?" : 
                   testsTaken === 1 ? "Great start!" : 
                   "Excellent progress!"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(testsTaken, 5))].map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 flex-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* <div className="group bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Weekly Progress</h3>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {weeklyProgress}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {weeklyProgress > 70 ? "Amazing pace! 🚀" : 
                   weeklyProgress > 40 ? "Good progress!" : 
                   "Let's build momentum!"}
                </div>
              </div>
              <div className={`flex items-center ${weeklyProgress > 50 ? "text-green-600" : "text-amber-600"}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {weeklyProgress > 70 ? "Excellent pace!" : 
                   weeklyProgress > 40 ? "Steady progress" : 
                   "Getting started"}
                </span>
              </div>
            </div> */}

            <div className="group bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Daily Streak</h3>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {dailyStreak} {dailyStreak === 1 ? "day" : "days"}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {dailyStreak === 0 ? "Start your streak today!" :
                   dailyStreak < 3 ? "Keep it up! 🔥" :
                   "Impressive streak! 🌟"}
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(Math.min(dailyStreak, 7))].map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 mx-0.5 group-hover:scale-125 transition-transform"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------- */}
        {/* 4. Feature Cards - Enhanced */}
        {/* ---------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore AspireLens Features
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Career Assessment Card */}
            <div className="group bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Career Assessment
              </h3>
              <p className="text-gray-600 mb-6">
                Analyze your interests, strengths, and future career opportunities with AI-powered insights.
              </p>
              
              {profileCompletion < 80 ? (
                <div className="space-y-3">
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    ⚡ Complete {100 - profileCompletion}% more of your profile for better assessment results
                  </div>
                  <Link to="/profile">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:-translate-y-0.5 transition-all duration-300">
                      Complete Profile
                    </button>
                  </Link>
                </div>
              ) : (
                <Link to="/start-test">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Start Assessment
                  </button>
                </Link>
              )}
            </div>

            {/* Goal Suggestions Card */}
            <div className="group bg-gradient-to-br from-white to-amber-50 p-8 rounded-3xl border border-amber-100 hover:shadow-2xl hover:shadow-amber-50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  {testsTaken > 0 ? "Coming Soon" : "Coming Soon"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Goal Suggestions
              </h3>
              <p className="text-gray-600 mb-6">
                Get AI-powered goals based on your assessment results and career interests.
              </p>
              
              {testsTaken > 0 ? (
                <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-orange-300 to-orange-300 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Coming Soon
                </button>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Complete a career assessment first to get personalized goals
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------------- */}
        {/* 5. Quick Actions */}
        {/* ---------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/profile">
            <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">My Profile</h4>
                  <p className="text-sm text-gray-500 mt-1">Update your information</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link to="/start-test">
            <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-green-600">Start Test</h4>
                  <p className="text-sm text-gray-500 mt-1">Begin assessment</p>
                </div>
                <Rocket className="h-5 w-5 text-gray-400 group-hover:text-green-500 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </Link>
          
          <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">Learning Resources</h4>
                <p className="text-sm text-gray-500 mt-1">Explore courses</p>
              </div>
              <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}