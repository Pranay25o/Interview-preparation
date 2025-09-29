
/**
 * Creates a simple prompt for the AI to generate interview questions and answers.
 * @param {string} role - The job role (e.g., "Software Engineer").
 * @param {string} experience - The candidate's experience level (e.g., "3 years").
 * @param {string} topicsToFocus - Comma-separated topics (e.g., "React, Node.js").
 * @param {number} numberOfQuestions - The number of questions to generate.
 * @returns {string} The formatted prompt for the AI.
 */
const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => {
  return `
    You are an interviewer for the role of ${role}.
    The candidate has ${experience} of experience.

    Please write exactly ${numberOfQuestions} interview questions.
    Focus on these topics: ${topicsToFocus}.

    For every question, give:
    - A short and clear answer (in simple words)
    - A short explanation (why the answer is correct)
    - If helpful, give a small code example

    IMPORTANT: Reply only in JSON format.
    The JSON must be an array of objects with keys:
    "question", "answer", "explanation", and (optional) "codeSnippet".

    Example:
    [
      {
        "question": "What is the virtual DOM?",
        "answer": "It is a copy of the real DOM kept in memory. React uses it to update the page faster.",
        "explanation": "Changing the real DOM directly is slow, but using a virtual copy makes updates quicker.",
        "codeSnippet": "const element = <h1>Hello</h1>;"
      }
    ]
  `;
};

/**
 * Creates a simple prompt for the AI to explain a concept.
 * @param {string} concept - The concept to be explained.
 * @returns {string} The formatted prompt for the AI.
 */
const conceptExplainPrompt = (concept) => {
  return `
    Explain the concept "${concept}" in very simple words.
    - Use a real-life example or story
    - If useful, show a small code example
    - Point out common mistakes people make about it
  `;
};

// Exporting functions
module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};
