import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ListChecks,
  Shield,
  BarChart,
  Award,
  Clock
} from "lucide-react";

export default function TestSubmitted() {
  const { testSessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  
  // Get data from navigation state
  const { 
    autoSubmitted = false, 
    reason = null,
    networkError = false,
    serverError = false,
    submittedData = null // If submitTest returns data
  } = location.state || {};

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        // Use your existing endpoint
        const response = await axios.get(
          `http://localhost:5000/api/test/submitted/${testSessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000
          }
        );

        const data = response.data;
        
        // Process the data to match your backend response
        const summaryData = {
          testSessionId: data.testSessionId,
          status: data.status,
          submittedAt: data.submittedAt,
          evaluatedAt: data.evaluatedAt,
        
          totalQuestions: data.totalQuestions || 0,
          attempted: data.attemptedQuestions || 0,
          unattempted: data.unattemptedQuestions || 0,
        
          level: data.level || 1,
        
          scoreSummary: {
            scorePercentage: data.scorePercentage,
            accuracyPercentage: data.accuracyPercentage,
            correctAnswers: data.correctAnswers,
            wrongAnswers: data.wrongAnswers,
            sectionWiseScore: data.sectionWiseScore || {},
          },
        
          userDetails: data.userDetails || null,
        };


        // If we have data from submission, merge it
        if (submittedData) {
          Object.assign(summaryData, submittedData);
        }

        setSummary(summaryData);
        
      } catch (err) {
        console.error("Error fetching submission summary:", err);
        
        if (err.response?.status === 400 && err.response.data?.message?.includes("not submitted")) {
          // Test not submitted yet - redirect back to test
          navigate(`/test/${testSessionId}`, {
            state: { 
              message: "Test not submitted yet. Please complete the test first.",
              type: "warning"
            }
          });
          return;
        }
        
        if (err.response?.status === 404) {
          // Test session not found
          setError("Test session not found.");
          setTimeout(() => navigate("/dashboard"), 3000);
          return;
        }
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        
        // Create a fallback summary
        const fallbackSummary = {
          testSessionId,
          status: "submitted",
          submittedAt: new Date().toISOString(),
          autoSubmitted,
          autoSubmitReason: reason,
          totalQuestions: 0,
          attempted: 0,
          unattempted: 0,
          durationMinutes: 0,
          level: 1,
          hasErrors: true,
          errorMessage: networkError ? "Network error occurred" :
                      serverError ? "Server error occurred" :
                      "Unable to fetch details"
        };
        
        setSummary(fallbackSummary);
        setError("Failed to load complete details. Showing basic information.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [testSessionId, token, navigate, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Processing Your Test</h2>
          <p className="text-gray-600 mt-2">Analyzing your responses for personalized insights...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate percentage for progress
  const completionRate = summary.totalQuestions > 0 
    ? Math.round((summary.attempted / summary.totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Assessment Submitted!</h1>
                  <p className="text-green-100 mt-1 text-lg">
                    Your career assessment has been successfully recorded
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {summary.autoSubmitted && (
                  <div className="px-4 py-2 bg-white/20 rounded-xl text-white font-medium backdrop-blur-sm">
                    ⚡ {summary.autoSubmitReason || "Auto-submitted"}
                  </div>
                )}
                <div className="px-4 py-2 bg-white/20 rounded-xl text-white font-medium backdrop-blur-sm">
                  🎯 Level {summary.level || 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Warning */}
        {summary.hasErrors && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500 animate-shake">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">⚠️ Partial Information Loaded</p>
                <p className="text-amber-700 text-sm mt-1">
                  {summary.errorMessage || "Some details may be unavailable. Your results are being processed."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Test Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Test Performance</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">Total Questions</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{summary.totalQuestions}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700 font-medium">Attempted</span>
                    </div>
                    <span className="text-3xl font-bold text-green-700">{summary.attempted}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-gray-700 font-medium">Unattempted</span>
                    </div>
                    <span className="text-3xl font-bold text-amber-700">{summary.unattempted}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700 font-medium">Duration</span>
                    </div>
                    <span className="text-xl font-bold text-purple-700">{summary.durationMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Completion Rate</span>
                  <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-600 transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* AI Insights Preview
            {summary.aiInsights && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">AI Insights Preview</h2>
                </div>
                <p className="text-gray-600">
                  {summary.aiInsights.preview || "Our AI is analyzing your responses to provide personalized career recommendations..."}
                </p>
              </div>
            )} */}

            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">What's</h3>
                  <p className="text-gray-700 mb-3">
                    To explore further steps for results refer Navigation Button at Right Side.
                    <br></br> 
                    Mentioned process typically takes 2-3 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Next Steps & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score Summary (if available) */}
            {summary.scoreSummary && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">Score Summary</h2>
                </div>
                <p className="font-medium text-gray-400 mb-2 text-center opacity-100">
                  Coming Soon
                </p>
                {/* <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Score</span>
                    <span className="text-2xl font-bold text-gray-900">{summary.scoreSummary.overall || "N/A"}</span>
                  </div>
                  {summary.scoreSummary.sectionWise && Object.entries(summary.scoreSummary.sectionWise).map(([section, score]) => (
                    <div key={section} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{section}</span>
                      <span className="font-medium">{score}</span>
                    </div>
                  ))}
                </div> */}
              </div>
            )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  ← Back to Dashboard
                </button>

                <button
                  onClick={() => navigate(`/results/${testSessionId}`)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <BarChart className="h-5 w-5" />
                  View Detailed Results
                </button>
              </div>
            </div>

            {/* Important Notes */}
            {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 mb-2">Important Information</p>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Results are typically ready within 5 minutes</li>
                    <li>• You cannot modify answers after submission</li>
                    <li>• Results include AI-powered career insights</li>
                    <li>• Book a counselling session for personalized guidance</li>
                  </ul>
                </div>
              </div>
            </div> */}

        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Need assistance? Contact our support team at{" "}
            <a href="mailto:support@aspirelens.com" className="text-blue-600 hover:underline">
              careerwith.aspirelens@gmail.com
            </a>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Test submitted on {summary.submittedAt ? new Date(summary.submittedAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}