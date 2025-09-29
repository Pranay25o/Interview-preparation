// const {GoogleGenAI}=require("@google/genai");
// const {conceptExplainPrompt,questionAnswerPrompt}=require("../utils/promt")

// const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

// const generateInterviewQuestions=async (req,res)=>{
//     try {
//         const {role,experience,topicsToFocus,numberOfQuestions}=req.body;
//         if(!role || !experience || !topicsToFocus || !numberOfQuestions)
//         {
//            return  res.status(400).json({message:"Missing requried field"});
//         }
//         const prompt=questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions);
//         const response=await ai.models.generateContent({
//             model:"gemini-1.5-flash-latest",
//             contents:prompt,
//         })
//         let rawtext=response.text;

//         const cleanedText=rawtext.replace(/^```json\s*/,"").replace(/```$/,"").trim();
//         const data=JSON.parse(cleanedText);
//         res.status(200).json(data);
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message:"failed to generate questions",error:error.message});

//     }
// }




// const generateConceptExplanations=async (req,res)=>{
//       try {
//         const question=req.body;
        
//         if(!question)
//         {
//             return res.status(400).json({message:"Missing required field"});
//         }
//         const prompt=conceptExplainPrompt(question);
       
//         const response=await ai.models.generateContent({
//             model:"gemini-1.5-flash-latest",
//             contents:prompt,
//         });
        
        
//         // let rawtext=response.text; 
//         // const cleanedText=rawtext.replace(/^```json\s*/,"").replace(/```$/,"").trim();
//         //  console.log("hello");

//         // const data=JSON.parse(cleanedText);
        
//         // res.status(200).json(data);
//         let rawtext = response.text;
// // Send the plain text explanation back inside a JSON object
// res.status(200).json({ explanation: rawtext });
        
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({message:"failed to generate questions",error:error.message});
//       }
// };
// module.exports={generateConceptExplanations,generateInterviewQuestions};


const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/promt");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
        
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: prompt,
        });

        let rawtext = response.text;

        // Function to safely extract and parse JSON (handles both objects and arrays)
        function safeParseJSON(text) {
            // Remove markdown code blocks
            text = text.replace(/``````\n?/g, '').trim();
            
            // Try to find JSON array first (starts with [)
            let firstBracket = text.indexOf('[');
            let lastBracket = text.lastIndexOf(']');
            
            if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < lastBracket) {
                // It's an array
                let jsonString = text.substring(firstBracket, lastBracket + 1);
                return JSON.parse(jsonString);
            }
            
            // Try to find JSON object (starts with {)
            let firstBrace = text.indexOf('{');
            let lastBrace = text.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
                // It's an object
                let jsonString = text.substring(firstBrace, lastBrace + 1);
                return JSON.parse(jsonString);
            }
            
            throw new Error("No valid JSON found in response");
        }

        let data;
        try {
            data = safeParseJSON(rawtext);
            
            // If it's an array, wrap it in the expected format
            if (Array.isArray(data)) {
                data = { questions: data };
            }
            
        } catch (parseError) {
            console.error("Parse error:", parseError.message);
            return res.status(500).json({ 
                message: "Failed to parse AI response", 
                error: parseError.message 
            });
        }

        res.status(200).json(data);
        
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
}



const generateConceptExplanations=async (req,res)=>{
      try {
        const question=req.body;
        
        if(!question)
        {
            return res.status(400).json({message:"Missing required field"});
        }
        const prompt=conceptExplainPrompt(question);
       
        const response=await ai.models.generateContent({
            model:"gemini-1.5-flash-latest",
            contents:prompt,
        });
        
        
        // let rawtext=response.text; 
        // const cleanedText=rawtext.replace(/^```json\s*/,"").replace(/```$/,"").trim();
        //  console.log("hello");

        // const data=JSON.parse(cleanedText);
        
        // res.status(200).json(data);
        let rawtext = response.text;
// Send the plain text explanation back inside a JSON object
res.status(200).json({ explanation: rawtext });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({message:"failed to generate questions",error:error.message});
      }
};



module.exports = { generateConceptExplanations, generateInterviewQuestions };
