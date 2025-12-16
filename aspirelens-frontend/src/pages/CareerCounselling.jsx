// src/pages/CareerCounselling.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CareerCounselling = () => {
  const { testSessionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [counsellingData, setCounsellingData] = useState(null);
  const [overallScore, setOverallScore] = useState(null);
  const [testLevel, setTestLevel] = useState(null);

  useEffect(() => {
    if (!testSessionId) return;

    const fetchCounsellingData = async () => {
      try {
        // Fetch counselling data
        const counsellingResponse = await axios.get(
          `/api/counselling/generate/${testSessionId}`
        );

        if (counsellingResponse.data.success) {
          setCounsellingData(counsellingResponse.data.counselling);
        }

        // Fetch test results
        const testResultsResponse = await axios.get(
          `/api/test/results/${testSessionId}`
        );

        if (testResultsResponse.data.success) {
          setOverallScore(testResultsResponse.data.overallScore);
          setTestLevel(testResultsResponse.data.testLevel);
        }
      } catch (error) {
        console.error("Error fetching counselling data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellingData();
  }, [testSessionId]);

  const renderSuitabilityBadge = (level) => {
    const styles = {
      High: "bg-green-50 text-green-700 border-green-200",
      Medium: "bg-amber-50 text-amber-700 border-amber-200",
      Low: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[level]}`}>
        {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading your career counselling report...</div>
      </div>
    );
  }

  if (!counsellingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Unable to load counselling data.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Career Counselling Report</h1>
          <p className="mt-1 text-gray-600 text-sm sm:text-base">Based on your recent assessment performance</p>
        </header>

        {/* Performance Overview */}
        {(overallScore !== null || testLevel !== null) && (
          <section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <div className="flex flex-wrap gap-6">
              {overallScore !== null && (
                <div>
                  <div className="text-3xl font-bold text-gray-900">{overallScore}%</div>
                  <div className="text-gray-500 text-sm mt-1">Overall Score</div>
                </div>
              )}
              {testLevel !== null && (
                <div>
                  <div className="text-3xl font-bold text-gray-900">{testLevel}</div>
                  <div className="text-gray-500 text-sm mt-1">Test Level</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Strengths & Weaknesses */}
        {(counsellingData.strengths.length > 0 || counsellingData.weaknesses.length > 0) && (
          <section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Strengths & Weaknesses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {counsellingData.strengths.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">Strengths</h3>
                  <ul className="space-y-2">
                    {counsellingData.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {counsellingData.weaknesses.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">Areas for Attention</h3>
                  <ul className="space-y-2">
                    {counsellingData.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-red-500 mr-2 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Developing Areas */}
        {counsellingData.developingAreas.length > 0 && (
          <section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Developing Areas</h2>
            <p className="text-gray-600 text-sm mb-3">These areas show potential for improvement with focused effort.</p>
            <ul className="space-y-2">
              {counsellingData.developingAreas.map((area, index) => (
                <li key={index} className="text-gray-700 text-sm flex items-start">
                  <span className="text-gray-400 mr-2 mt-1">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Career Recommendations */}
        {counsellingData.careerRecommendations.length > 0 && (
          <section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Career Recommendations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {counsellingData.careerRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">{rec.career}</h3>
                    {renderSuitabilityBadge(rec.suitabilityLevel)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Improvement Plan */}
        {counsellingData.improvementPlan.length > 0 && (
          <section className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">30–60 Day Improvement Plan</h2>
            <ol className="space-y-3">
              {counsellingData.improvementPlan.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-gray-100 text-gray-700 font-medium text-sm rounded w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Next Test Advice */}
        {counsellingData.nextTestAdvice && (
          <section className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Next Test Preparation</h2>
            <p className="text-gray-700 text-sm mb-2">{counsellingData.nextTestAdvice}</p>
            <div className="text-gray-600 text-xs">
              Recommended action: <span className="font-medium">Prepare and attempt next test</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CareerCounselling;