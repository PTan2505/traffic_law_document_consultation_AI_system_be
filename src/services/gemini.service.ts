import { GoogleGenerativeAI } from "@google/generative-ai";
import { APIError } from "../common/errors/app-errors";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new APIError(
        "GEMINI_API_KEY_MISSING",
        500,
        "Gemini API key is required"
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async sendToGemini(userPrompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are a helpful assistant who is an expert in Vietnamese traffic laws.
Always explain answers clearly and in detail, using real articles and examples from Vietnamese traffic regulations.
If the question is not related to Vietnamese traffic law, respond with:
"I'm sorry, I can only assist with questions related to Vietnamese traffic law."`,
      });

      const chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new APIError(
        "GEMINI_API_ERROR",
        500,
        "Failed to get response from AI assistant"
      );
    }
  }

  async generateTrafficLawResponse(question: string): Promise<string> {
    // Validate that the question is related to traffic law
    const trafficKeywords = [
      "traffic",
      "driving",
      "speed",
      "limit",
      "license",
      "vehicle",
      "road",
      "highway",
      "parking",
      "violation",
      "fine",
      "law",
      "regulation",
      "motorcycle",
      "car",
      "helmet",
      "seatbelt",
      "signal",
      "intersection",
      "overtaking",
      "drunk driving",
      "giao thông",
      "lái xe",
      "tốc độ",
      "bằng lái",
      "xe cộ",
      "đường",
      "cao tốc",
      "đậu xe",
      "vi phạm",
      "phạt",
      "luật",
      "quy định",
      "xe máy",
      "ô tô",
      "mũ bảo hiểm",
      "dây an toàn",
      "tín hiệu",
      "giao lộ",
      "vượt xe",
      "say rượu",
    ];

    const questionLower = question.toLowerCase();
    const isTrafficRelated = trafficKeywords.some((keyword) =>
      questionLower.includes(keyword.toLowerCase())
    );

    if (!isTrafficRelated) {
      return "I'm sorry, I can only assist with questions related to Vietnamese traffic law.";
    }

    return this.sendToGemini(question);
  }
}
