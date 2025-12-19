// src/pages/CareerCounselling.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, AlertTriangle } from 'lucide-react';
import api from "../api/api";
import { 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  BookOpen, 
  Target, 
  TrendingUp,
  Brain,
  GraduationCap,
  Award,
  Lightbulb,
  Clock,
  ChevronRight,
  Calendar,
  User,
  Home,
  BarChart3
} from 'lucide-react';

const CareerCounselling = () => {
  const { testSessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [counsellingData, setCounsellingData] = useState(null);
  const [error, setError] = useState("");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [targetExitPath, setTargetExitPath] = useState("");


  useEffect(() => {
    if (!testSessionId) {
      setError("No test session ID provided");
      setLoading(false);
      return;
    }

    fetchCounsellingData();
  }, [testSessionId]);

  const fetchCounsellingData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Use the GET endpoint
      const response = await api.get(
        `/api/counselling/data/${testSessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000
        }
      );

      const data = response.data;
      
      if (data.success) {
        if (data.status === "counselling_available") {
          setCounsellingData(data);
        } else if (data.status === "counselling_pending") {
          // Counselling not generated yet
          setCounsellingData({
            ...data,
            canGenerate: data.canGenerate
          });
        }
      } else {
        setError(data.message || "Failed to load counselling data");
      }
    } catch (err) {
      console.error("Error fetching counselling data:", err);
      
      if (err.response?.status === 404) {
        setError("Test session not found");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Unable to load counselling data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateCounselling = async () => {
    try {
      setGenerating(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/counselling/generate/${testSessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000 // Longer timeout for AI processing
        }
      );

      if (response.data.success) {
        // Refresh the data after generation
        await fetchCounsellingData();
      } else {
        setError(response.data.message || "Failed to generate counselling");
      }
    } catch (err) {
      console.error("Error generating counselling:", err);
      setError(err.response?.data?.message || "Failed to generate counselling. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const renderSuitabilityBadge = (level) => {
    const styles = {
      High: "bg-green-100 text-green-800 border-green-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[level] || styles.Medium}`}>
        {level} Suitability
      </span>
    );
  };

  // Add debug logging
  useEffect(() => {
    if (counsellingData?.counselling) {
      console.log("Counselling Data Structure:", {
        strengths: counsellingData.counselling.strengths?.length,
        careerRecs: counsellingData.counselling.careerRecommendations?.length,
        keys: Object.keys(counsellingData.counselling)
      });
      console.log("Full Counselling Data:", counsellingData.counselling);
    }
  }, [counsellingData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading Career Counselling</h2>
          <p className="text-gray-600 mt-2">Preparing your personalized career insights...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !counsellingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Counselling</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchCounsellingData}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Counselling not generated yet
  if (counsellingData?.status === "counselling_pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <Target className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Career Counselling Not Yet Generated</h1>
            <p className="text-gray-600 mb-6">
              Your test has been evaluated, but personalized career counselling hasn't been generated yet.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">What you'll get:</h3>
              <ul className="text-left text-blue-700 space-y-2">
                <li className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Personalized career recommendations
                </li>
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Strengths and areas for improvement
                </li>
                <li className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  30-60 day improvement plan
                </li>
              </ul>
            </div>
            
            {counsellingData.canGenerate ? (
              <button
                onClick={generateCounselling}
                disabled={generating}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Generating Counselling...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Generate Career Counselling
                  </>
                )}
              </button>
            ) : (
              <p className="text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                Your test needs to be evaluated before generating counselling. 
                Please wait or contact support if evaluation is taking too long.
              </p>
            )}
            
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main counselling view
  const { counselling, testPerformance, userProfile, testName, level } = counsellingData;

    const handleExitWithWarning = (path) => {
      setTargetExitPath(path);
      setShowExitWarning(true);
    };

    const handleExitConfirm = () => {
      setShowExitWarning(false);
      navigate(targetExitPath);
    };

    const handleExitCancel = () => {
      setShowExitWarning(false);
      setTargetExitPath("");
    };

    const ExitWarningModal = () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Save Before Exiting?</h3>
              <p className="text-gray-600 text-sm mt-1">Career Counselling Report</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-medium flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Recommendation
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Before exiting, please save your report for future reference. 
              Your AI-generated career insights are valuable for long-term planning.
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to leave without saving your personalized career counselling report?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExitCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel & Stay
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Now (Print)
            </button>
            <button
              onClick={handleExitConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Exit Anyway
            </button>
          </div>
        </div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* AI Generated Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Brain className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">AI-Generated Career Counselling Report</h2>
          </div>
          <p className="text-purple-100">
            This comprehensive report has been personalized for you using advanced AI analysis of your test performance and profile.
          </p>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Counselling Report</h1>
              <p className="text-gray-600 mt-2">
                Personalized insights based on your {testName || "Career Assessment"}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-3">
              <button
                onClick={generateCounselling}
                disabled={generating}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Report Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* User and Test Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Test Information</h3>
              </div>
              <p className="text-gray-900 font-medium">{testName}</p>
              <p className="text-gray-600 text-sm">Level {level}</p>
            </div>
            
            {testPerformance && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">Performance</h3>
                </div>
                <p className="text-gray-900 font-medium text-2xl">{testPerformance.scorePercentage}%</p>
                <p className="text-gray-600 text-sm">
                  {testPerformance.correctAnswers}/{testPerformance.totalQuestions} correct
                </p>
              </div>
            )}
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Student Profile</h3>
              </div>
              <p className="text-gray-900 font-medium">{userProfile.name}</p>
              <p className="text-gray-600 text-sm">{userProfile.educationLevel}</p>
            </div>
          </div>
        </div>

        {/* Counselling Content */}
        <div className="space-y-8">
          {/* Strengths */}
          {counselling.strengths && counselling.strengths.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI-Identified Strengths</h2>
                  <p className="text-gray-600">Based on your performance analysis</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {counselling.strengths.map((strength, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-5 hover:border-green-300 transition-colors">
                    <div className="flex items-start">
                      <div className="bg-green-100 text-green-800 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Recommendations */}
          {counselling.careerRecommendations && counselling.careerRecommendations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Career Recommendations</h2>
                  <p className="text-gray-600">Personalized career paths based on your profile</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {counselling.careerRecommendations.map((rec, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 font-bold rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{rec.career || rec}</h3>
                        </div>
                        <div className="ml-13">
                          {renderSuitabilityBadge(rec.suitabilityLevel || "Medium")}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{rec.reason || "Based on your performance and interests"}</p>
                    
                    {/* Additional details if available */}
                    {rec.details && Array.isArray(rec.details) && rec.details.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                          Potential Roles
                        </h4>
                        <ul className="space-y-1">
                          {rec.details.map((detail, idx) => (
                            <li key={idx} className="text-gray-600 text-sm flex items-center">
                              <ChevronRight className="h-3 w-3 mr-2 text-gray-400" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Plan */}
          {counselling.improvementPlan && counselling.improvementPlan.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-xl mr-4">
                  <Calendar className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">30–60 Day Improvement Plan</h2>
                  <p className="text-gray-600">Step-by-step guide for immediate progress</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {counselling.improvementPlan.map((step, index) => (
                  <div key={index} className="flex items-start p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                    <div className="bg-amber-100 text-amber-800 font-bold rounded-lg w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{step}</p>
                      {index === 0 && (
                        <p className="text-sm text-amber-700 mt-2 font-medium">
                          <Lightbulb className="h-4 w-4 inline mr-1" />
                          Start with this immediately for maximum impact
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Test Advice */}
          {counselling.nextTestAdvice && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Next Test Preparation Advice</h2>
              </div>
              <div className="bg-white/80 rounded-xl p-6 border border-blue-100">
                <p className="text-gray-800 text-lg leading-relaxed">{counselling.nextTestAdvice}</p>
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-blue-700 font-medium">AI-Generated Personalized Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Developing Areas if available */}
          {counselling.developingAreas && counselling.developingAreas.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-xl mr-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Areas with Growth Potential</h2>
                  <p className="text-gray-600">Skills that show promise for development</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {counselling.developingAreas.map((area, index) => (
                  <div key={index} className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-gray-800 font-medium">{area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses if available */}
          {counselling.weaknesses && counselling.weaknesses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-xl mr-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Areas for Improvement</h2>
                  <p className="text-gray-600">Focus on these to enhance your performance</p>
                </div>
              </div>
              <div className="space-y-3">
                {counselling.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start p-3 bg-red-50 rounded-xl">
                    <div className="bg-red-100 text-red-800 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleExitWithWarning("/dashboard")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => handleExitWithWarning(`/results/${testSessionId}`)}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Detailed Results
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Print Report
          </button>
        </div>
        {showExitWarning && <ExitWarningModal />}

      </div>
    </div>
  );
};

export default CareerCounselling;