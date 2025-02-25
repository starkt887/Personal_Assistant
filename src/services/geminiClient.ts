import { ENV } from "../utils/env";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(ENV.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// visit here- https://aistudio.google.com/app/apikey
export const sendPrompt=async(prompt:string):Promise<string>=>{
    const result = await model.generateContent(`${prompt} in two sentences`);
    console.log(result.response.text());
    let answer=result.response.text().replaceAll("*","").replaceAll("#","")
    return answer.trim()
}
