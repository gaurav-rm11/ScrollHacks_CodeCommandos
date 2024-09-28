// utils/aiPrompt.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY!);

// Define the function to analyze a contract
export const analyzeContractWithGemini = async (contract: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Your role is to act as an AI smart contract auditor. Here is the Solidity contract: ${contract}. 
                    Provide an audit report with security and performance metrics, and suggestions for improvement in JSON format.`;

    const result = await model.generateContent(prompt);

    // Log the raw response for debugging
    console.log("Raw response from Gemini AI:", result.response);

    // Directly use the result as JSON
    const auditResult = result.response; // Assuming result.response is already in JSON format

    // Extract relevant data
    return {
      auditReport: auditResult,
      metrics: auditResult.performance,
      suggestions: auditResult.suggestions,
    };
  } catch (error) {
    console.error("Error calling Gemini AI model:", error);
    return null;
  }
};
