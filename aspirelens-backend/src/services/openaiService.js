import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.ASPIRE_AI_KEY);

/**
 * Generate AI questions (MCQ)
 */
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
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Question JSON Error:", text);
    throw new Error("Invalid AI question response");
  }
};

/**
 * AI ANSWER EVALUATION SERVICE
 * Used for short / subjective answers
 */
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

Evaluate the student's answer strictly based on the question.

Question:
"${question}"

Student Answer:
"${answer}"

Evaluation Rules:
- Score out of ${maxMarks}
- Consider clarity, relevance, logic, and correctness
- Be fair, not lenient
- Provide constructive feedback
- Provide one improvement tip

Return STRICT JSON only in this format:
{
  "score": number,
  "feedback": "string",
  "improvementTip": "string"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Evaluation JSON Error:", text);
    throw new Error("Invalid AI evaluation response");
  }
};

/**
 * AI CAREER COUNSELLING SERVICE
 * Generates personalized career advice based on test performance
 */
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
You are a career counsellor for students.

Based on the student's test performance, provide personalized career counselling.

Student Details:
- Class: ${classLevel}
- Stream: ${stream}
- Test Level: ${level}
- Tests Taken: ${testsTaken}

Performance Summary:
${JSON.stringify(performance, null, 2)}

Counselling Requirements:
- Identify 3-5 key strengths based on performance
- Identify 2-3 areas for improvement
- Suggest 3-5 suitable career paths/recommendations
- Provide a 4-6 point improvement plan

Return STRICT JSON only in this format:
{
  "strengths": ["string1", "string2", ...],
  "weaknesses": ["string1", "string2", ...],
  "careerRecommendations": ["string1", "string2", ...],
  "improvementPlan": ["string1", "string2", ...]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Counselling JSON Error:", text);
    throw new Error("Invalid AI counselling response");
  }
};
