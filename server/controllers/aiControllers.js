const { GoogleGenerativeAI } = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/promt");
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.GEMINI_API_KEY });
// Generate interview questions (Gemini)
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    // Ask for strict JSON back
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an interview assistant. Respond ONLY with valid JSON. Shape: {\"questions\":[{\"question\":\"...\",\"answer\":\"...\"}]}",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" }, // forces JSON
    });

    const content = completion.choices[0].message.content; // string JSON
    const data = JSON.parse(content);

    // sanity check
    if (!data || !Array.isArray(data.questions)) {
      return res.status(500).json({ message: "Model did not return expected JSON shape" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ message: "Failed to generate questions", error: error.message });
  }
};


// Generate concept explanations (OpenAI GPT-4o-mini)
const generateConceptExplanations = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const prompt = conceptExplainPrompt(question);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful tutor who explains complex topics simply." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;
    res.status(200).json({ explanation: text });
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateConceptExplanations, generateInterviewQuestions };
