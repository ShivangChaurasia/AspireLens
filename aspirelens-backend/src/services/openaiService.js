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
  classLevel,
  stream,
  level,
  testsTaken,
  performance,
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a professional career counsellor for students.

Student Profile:
- Class Level: ${classLevel}
- Stream: ${stream}
- Test Level: ${level}
- Tests Taken: ${testsTaken}

Performance Summary:
${JSON.stringify(performance, null, 2)}

Instructions:
- Identify key strengths
- Identify weak areas
- Recommend career paths in PRIORITY ORDER
- Suggest skill improvements
- Provide a short 30-day improvement plan

Return STRICT JSON only:
{
  "strengths": [],
  "weaknesses": [],
  "careerRecommendations": [],
  "improvementPlan": []
}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // 🔥 Remove markdown formatting
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error("❌ AI Counselling JSON Error (raw):", text);
    throw new Error("Invalid AI counselling response");
  }

  // ✅ Normalize output
  return {
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    careerRecommendations: parsed.careerRecommendations || [],
    improvementPlan: parsed.improvementPlan || [],
  };
};
