import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.ASPIRE_AI_KEY);

/* =========================================================
   AI QUESTION GENERATION (MCQ ONLY)
========================================================= */
export const generateQuestionsWithAI = async ({
  subject,
  section,
  classLevel,
  stream,
  difficulty = "medium",
  count = 10,
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

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

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // 🔥 Remove markdown wrappers
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("❌ AI Question JSON Error (raw):", text);
    throw new Error("Invalid AI question response");
  }

  // ✅ Normalize + Validate
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
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

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

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // 🔥 Sanitize JSON
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ AI Evaluation JSON Error (raw):", text);
    throw new Error("Invalid AI evaluation response");
  }
};

/* =========================================================
   AI CAREER COUNSELLING
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
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a senior career counsellor and aptitude analyst.

Your task is to generate a REALISTIC, UNBIASED, and ACTIONABLE career counselling report.
Do NOT exaggerate abilities.
Do NOT guarantee success.
Avoid motivational or emotional language.

--------------------------------------------------
STUDENT PROFILE
--------------------------------------------------
Education Level: ${educationLevel}
Education Stage: ${educationStage || "Not specified"}
Current Test Level: ${level}
Total Tests Taken: ${testsTaken}
Declared Interests: ${interests.join(", ") || "Not specified"}

--------------------------------------------------
TEST PERFORMANCE
--------------------------------------------------
Overall Score: ${scorePercentage}%

Section-wise Performance:
${performance
  .map(
    (p) =>
      `- ${p.section}: ${p.percentage}%`
  )
  .join("\n")}

--------------------------------------------------
STRICT ANALYSIS RULES
--------------------------------------------------
1. Strengths → sections with ≥ 70%
2. Weaknesses → sections with < 40%
3. 40–69% → developing areas (do NOT mark as strength)
4. Career recommendations must align with BOTH:
   - aptitude performance
   - declared interests
5. If interest conflicts with aptitude, clearly mention risk.
6. Suggest ONLY 2–4 career paths.
7. Provide a PRACTICAL 30–60 day improvement plan.
8. If performance is low, recommend foundation building, NOT careers.

--------------------------------------------------
OUTPUT FORMAT (STRICT JSON ONLY)
--------------------------------------------------
{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "developingAreas": ["..."],
  "careerRecommendations": [
    {
      "career": "...",
      "reason": "...",
      "suitabilityLevel": "High | Medium | Low"
    }
  ],
  "improvementPlan": [
    "...",
    "..."
  ],
  "nextTestAdvice": "..."
}

Return only valid JSON.
No markdown.
No explanation text.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // 🔥 Safety cleanup
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error("❌ AI Counselling JSON Error (raw):", text);
    throw new Error("Invalid AI counselling response");
  }

  // ✅ Normalized response
  return {
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    developingAreas: parsed.developingAreas || [],
    careerRecommendations: parsed.careerRecommendations || [],
    improvementPlan: parsed.improvementPlan || [],
    nextTestAdvice: parsed.nextTestAdvice || "",
  };
};

