// generateAiResponse.js (CommonJS style)

const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const generateAiResponse = async (code, problem) => {
  const prompt = `
You are a helpful programming tutor assisting students in understanding data structures and algorithms.

Given the following coding problem and the student's code, provide a detailed review that includes:

1. Understanding Check
2. Concept Explanation
3. Time & Space Complexity
4. Optimization Suggestions
5. Code Style Tips
6. Further Learning

---

Problem Description:
${problem}

Student's Code:
${code}

Respond in a clear and encouraging tone, as if you're helping a beginner improve their understanding.
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
  // console.log(response.text);
};

// Export for use in other files
module.exports = generateAiResponse;
