import dotenv from "dotenv";
dotenv.config();


import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.ASPIRE_AI_KEY,
});

/* =========================================================
   AI QUESTION GENERATION (MCQ ONLY)
========================================================= */
export const generateQuestionsWithAI = async ({
  subject,
  section,
  classLevel,
  stream,
  difficulty = "hard",
  count = 10,
}) => {
  const prompt = `
You are an exam question generator.

Generate ${count} ${section} MCQ questions for the subject "${subject}".
Target student level: Class ${classLevel}, Stream: ${stream}.
Difficulty: ${difficulty}.

Rules:
- Questions must be original
- No repetition
- MCQ format only
- 4 options (A, B, C, D)
- Include correct option
- Output STRICT JSON only
- No markdown, no extra text
- You can Add Passage Based MCQ Questions also
- Generate Medium-Hard Competative level Questions

JSON Format:
[
  {
    "questionText": "",
    "options": [
      { "label": "A", "text": "" },
      { "label": "B", "text": "" },
      { "label": "C", "text": "" },
      { "label": "D", "text": "" }
    ],
    "correctOption": "A",
    "difficulty": "easy|medium|hard"
  }
]
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = response.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("❌ AI Question JSON Error (raw):", text);
    throw new Error("Invalid AI question response");
  }

  return parsed.map((q, index) => {
    if (
      !q.questionText ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      !q.correctOption
    ) {
      throw new Error(`Invalid question structure at index ${index}`);
    }

    return {
      questionText: q.questionText,
      options: q.options.map((opt) => ({
        label: opt.label,
        text: opt.text || opt.label,
      })),
      correctOption: q.correctOption,
      difficulty: q.difficulty || "medium",
    };
  });
};

/* =========================================================
   AI ANSWER EVALUATION (SUBJECTIVE)
========================================================= */
export const evaluateAnswerWithAI = async ({
  question,
  answer,
  maxMarks = 1,
}) => {
  const prompt = `
You are an exam evaluator.

Question:
"${question}"

Student Answer:
"${answer}"

Evaluation Rules:
- Score out of ${maxMarks}
- Consider clarity, relevance, logic, and correctness
- Be fair and objective
- Provide constructive feedback
- Provide ONE improvement tip

Return STRICT JSON only:
{
  "score": number,
  "feedback": "string",
  "improvementTip": "string"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  let text = response.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ AI Evaluation JSON Error (raw):", text);
    throw new Error("Invalid AI evaluation response");
  }
};
/* =========================================================
   AI CAREER COUNSELLING - DEBUGGED VERSION
========================================================= */
export const generateCareerCounsellingWithAI = async ({
  educationLevel,
  educationStage,
  interests,
  level,
  scorePercentage,
  performance,
  testsTaken,
}) => {
  console.log("[Groq AI] Starting career counselling generation...");
  
  // Format performance for better readability
  const performanceText = performance.map(p => 
    `- ${p.section}: ${p.percentage || p.score || 0}%`
  ).join("\n");

  const prompt = `
You are a senior career counsellor with expertise in aptitude analysis and career guidance.

STUDENT PROFILE:
- Education Level: ${educationLevel || "Not specified"}
- Education Stage: ${educationStage || "Not specified"}
- Current Test Level: ${level || 1}
- Total Tests Taken: ${testsTaken || 1}
- Declared Interests: ${interests?.join(", ") || "Not specified"}

TEST PERFORMANCE:
- Overall Score: ${scorePercentage || 0}%

SECTION-WISE PERFORMANCE:
${performanceText}

ANALYSIS RULES:
1. Strengths (areas with ≥70% score): Identify 2-3 key strengths
2. Weaknesses (areas with <40% score): Identify 2-3 areas needing improvement
3. Developing Areas (40-69% score): Areas with potential for growth
4. Career Recommendations: Suggest 3-4 career paths that align with both aptitude and interests
5. Improvement Plan: Provide a practical 30-60 day action plan with specific steps
6. Next Test Advice: Guidance for preparing for the next level test

IMPORTANT: Be realistic, data-driven, and practical. Avoid exaggeration and generic advice.

RETURN ONLY VALID JSON WITH THIS EXACT STRUCTURE:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "developingAreas": ["area1", "area2"],
  "careerRecommendations": [
    {
      "career": "Career Name",
      "reason": "Specific reason based on performance and interests",
      "suitabilityLevel": "High/Medium/Low"
    }
  ],
  "improvementPlan": ["step1", "step2", "step3", "step4", "step5"],
  "nextTestAdvice": "Specific, actionable advice for next test preparation"
}

DO NOT include any additional text, explanations, or markdown formatting.
`;

  console.log("[Groq AI] Prompt sent to model");
  
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 1500,
    });

    let rawText = response.choices[0].message.content;
    console.log("[Groq AI] Raw response received:", rawText.substring(0, 500) + "...");

    // Clean the response
    let text = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("[Groq AI] Cleaned text:", text.substring(0, 300) + "...");

    let parsed;
    try {
      parsed = JSON.parse(text);
      console.log("[Groq AI] Successfully parsed JSON");
      console.log("[Groq AI] Parsed data structure:", {
        hasStrengths: Array.isArray(parsed.strengths),
        hasCareerRecs: Array.isArray(parsed.careerRecommendations),
        strengthsCount: parsed.strengths?.length || 0,
        careerRecsCount: parsed.careerRecommendations?.length || 0
      });
    } catch (err) {
      console.error("[Groq AI] JSON Parse Error:", err.message);
      console.error("[Groq AI] Text that failed to parse:", text);
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log("[Groq AI] Attempting to extract JSON from text...");
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log("[Groq AI] Successfully extracted and parsed JSON");
        } catch (extractErr) {
          console.error("[Groq AI] Failed to extract JSON");
          throw new Error(`AI returned invalid JSON: ${extractErr.message}`);
        }
      } else {
        throw new Error(`AI returned non-JSON response: ${text.substring(0, 100)}...`);
      }
    }

    // Validate the parsed data structure
    const validatedData = validateAndEnhanceAIData(parsed, {
      educationLevel,
      interests,
      scorePercentage,
      performance
    });

    console.log("[Groq AI] Counselling generation successful");
    return validatedData;

  } catch (error) {
    console.error("[Groq AI] Error during generation:", error.message);
    
    // Return comprehensive fallback data
    return getComprehensiveFallbackData({
      educationLevel,
      educationStage,
      interests,
      level,
      scorePercentage,
      performance,
      testsTaken
    });
  }
};

/**
 * Validate and enhance AI response data
 */
function validateAndEnhanceAIData(aiData, context) {
  const {
    strengths = [],
    weaknesses = [],
    developingAreas = [],
    careerRecommendations = [],
    improvementPlan = [],
    nextTestAdvice = ""
  } = aiData;

  // Ensure arrays
  const validatedStrengths = Array.isArray(strengths) ? strengths : [];
  const validatedWeaknesses = Array.isArray(weaknesses) ? weaknesses : [];
  const validatedDevelopingAreas = Array.isArray(developingAreas) ? developingAreas : [];
  const validatedCareerRecs = Array.isArray(careerRecommendations) ? careerRecommendations : [];
  const validatedImprovementPlan = Array.isArray(improvementPlan) ? improvementPlan : [];

  // Enhance career recommendations with more details
  const enhancedCareerRecs = validatedCareerRecs.map((rec, index) => {
    // Ensure basic structure
    if (typeof rec === 'string') {
      return {
        career: rec,
        reason: `Based on your performance and interests in ${context.interests?.join(', ') || 'various fields'}`,
        suitabilityLevel: "Medium",
        details: getDefaultCareerDetails(rec),
        requiredSkills: ["Communication", "Problem-solving", "Technical aptitude"],
        growthProspects: "Good growth potential in this field"
      };
    }

    return {
      career: rec.career || `Career Path ${index + 1}`,
      reason: rec.reason || `Matches your ${context.scorePercentage}% performance and interests`,
      suitabilityLevel: rec.suitabilityLevel || "Medium",
      details: rec.details || getDefaultCareerDetails(rec.career),
      requiredSkills: rec.requiredSkills || ["Analytical skills", "Communication", "Technical knowledge"],
      growthProspects: rec.growthProspects || "Steady demand with growth opportunities"
    };
  });

  // If no career recommendations, add some based on interests
  let finalCareerRecs = enhancedCareerRecs;
  if (finalCareerRecs.length === 0) {
    finalCareerRecs = generateCareerRecommendationsFromContext(context);
  }

  // Ensure we have at least some data in each category
  return {
    strengths: validatedStrengths.length > 0 ? validatedStrengths : [
      "Good foundational knowledge",
      "Consistent performance across sections",
      "Strong learning potential"
    ],
    weaknesses: validatedWeaknesses.length > 0 ? validatedWeaknesses : [
      "Could improve time management",
      "Needs more practice in complex problem-solving",
      "Consistency across all test sections"
    ],
    developingAreas: validatedDevelopingAreas.length > 0 ? validatedDevelopingAreas : [
      "Advanced analytical skills",
      "Complex problem-solving techniques",
      "Time optimization strategies"
    ],
    careerRecommendations: finalCareerRecs,
    improvementPlan: validatedImprovementPlan.length > 0 ? validatedImprovementPlan : [
      "Practice 30 minutes daily on weak areas",
      "Take weekly mock tests to track progress",
      "Review incorrect answers thoroughly",
      "Focus on time management during practice",
      "Join study groups for collaborative learning"
    ],
    nextTestAdvice: nextTestAdvice || `Based on your ${context.scorePercentage}% score, focus on consistent practice and targeted improvement in weaker sections.`,
    
    // Additional fields for frontend
    skillDevelopment: [
      {
        skill: "Problem-solving",
        priority: "High",
        resources: ["Practice tests", "Analytical reasoning books"],
        timeline: "2-3 months"
      },
      {
        skill: "Time Management",
        priority: "High",
        resources: ["Timer-based practice", "Mock tests"],
        timeline: "1-2 months"
      }
    ],
    actionPlan: validatedImprovementPlan,
    personalAdvice: nextTestAdvice || `Your current performance shows potential. Focus on systematic improvement to achieve your career goals.`
  };
}

/**
 * Get default career details based on career name
 */
function getDefaultCareerDetails(careerName) {
  const detailsMap = {
    "Software Engineer": ["Backend development", "Frontend development", "System design"],
    "Data Analyst": ["Data visualization", "Statistical analysis", "Report generation"],
    "Business Analyst": ["Requirement analysis", "Process improvement", "Stakeholder management"],
    "Project Manager": ["Project planning", "Team coordination", "Risk management"],
    "Marketing Specialist": ["Digital marketing", "Content creation", "Market analysis"],
    "Teacher/Educator": ["Curriculum design", "Student assessment", "Educational planning"]
  };

  return detailsMap[careerName] || [
    "Core responsibilities in this field",
    "Typical work environment",
    "Career progression paths"
  ];
}

/**
 * Generate career recommendations based on context
 */
function generateCareerRecommendationsFromContext(context) {
  const { interests = [], scorePercentage = 0, educationLevel } = context;
  
  const recommendations = [];
  
  // Based on interests
  if (interests.includes("technology") || interests.includes("computers")) {
    recommendations.push({
      career: "Software Developer",
      reason: "Matches your interest in technology and requires strong logical thinking",
      suitabilityLevel: scorePercentage >= 70 ? "High" : "Medium",
      details: ["Web development", "Mobile apps", "Software testing"],
      requiredSkills: ["Programming", "Algorithms", "System Design"],
      growthProspects: "High demand with excellent growth opportunities"
    });
  }
  
  if (interests.includes("analysis") || interests.includes("data")) {
    recommendations.push({
      career: "Data Analyst",
      reason: "Aligns with analytical thinking and data interpretation skills",
      suitabilityLevel: scorePercentage >= 65 ? "High" : "Medium",
      details: ["Data processing", "Statistical analysis", "Business intelligence"],
      requiredSkills: ["Excel", "SQL", "Data Visualization"],
      growthProspects: "Growing field across all industries"
    });
  }
  
  // Based on education level
  if (educationLevel === "high_school" || !educationLevel) {
    recommendations.push({
      career: "Business Analyst",
      reason: "Good entry point that develops both analytical and communication skills",
      suitabilityLevel: "Medium",
      details: ["Documentation", "Process analysis", "Client communication"],
      requiredSkills: ["Communication", "Analysis", "MS Office"],
      growthProspects: "Steady demand with clear career progression"
    });
  }
  
  // Default recommendation if none added
  if (recommendations.length === 0) {
    recommendations.push({
      career: "Project Coordinator",
      reason: "Builds organizational and planning skills applicable to many fields",
      suitabilityLevel: "Medium",
      details: ["Project planning", "Team coordination", "Progress tracking"],
      requiredSkills: ["Organization", "Communication", "Time management"],
      growthProspects: "Good foundational role with diverse opportunities"
    });
  }
  
  return recommendations;
}

/**
 * Comprehensive fallback data
 */
function getComprehensiveFallbackData(context) {
  const { educationLevel, interests = [], scorePercentage = 0, performance = [] } = context;
  
  // Analyze performance for strengths/weaknesses
  const strengths = performance
    .filter(p => (p.percentage || p.score || 0) >= 70)
    .map(p => `Strong performance in ${p.section} (${p.percentage || p.score}%)`);
  
  const weaknesses = performance
    .filter(p => (p.percentage || p.score || 0) < 40)
    .map(p => `Needs improvement in ${p.section} (${p.percentage || p.score}%)`);
  
  const developingAreas = performance
    .filter(p => (p.percentage || p.score || 0) >= 40 && (p.percentage || p.score || 0) < 70)
    .map(p => `${p.section} shows potential for growth`);
  
  return {
    strengths: strengths.length > 0 ? strengths : ["Strong learning ability", "Good problem-solving foundation"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Time management", "Advanced problem-solving techniques"],
    developingAreas: developingAreas.length > 0 ? developingAreas : ["All test sections show room for growth"],
    careerRecommendations: generateCareerRecommendationsFromContext(context),
    improvementPlan: [
      "Dedicate 1 hour daily to focused practice",
      "Take at least 2 full-length practice tests weekly",
      "Analyze and review all incorrect answers",
      "Work on time management strategies",
      "Seek feedback from mentors or teachers"
    ],
    nextTestAdvice: `With ${scorePercentage}% in your current test, focus on consistent practice and addressing specific weak areas before attempting the next level.`,
    skillDevelopment: [
      {
        skill: "Quantitative Aptitude",
        priority: "High",
        resources: ["Practice books", "Online test series"],
        timeline: "2-4 months"
      },
      {
        skill: "Logical Reasoning",
        priority: "Medium",
        resources: ["Puzzle books", "Reasoning practice apps"],
        timeline: "3-6 months"
      }
    ],
    actionPlan: [
      "Week 1-2: Focus on weakest sections",
      "Week 3-4: Practice mixed question sets",
      "Week 5-6: Take timed full tests",
      "Week 7-8: Review and refine strategies"
    ],
    personalAdvice: `Your performance indicates good potential. With focused effort and systematic preparation, you can significantly improve your scores and career prospects.`
  };
}