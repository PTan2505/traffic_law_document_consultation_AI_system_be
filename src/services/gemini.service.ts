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

  async sendToGemini(
    userPrompt: string,
    conversationHistory: Array<{ question: string; answer: string }> = []
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are a helpful assistant who is an expert in Vietnamese traffic laws.
Always explain answers clearly and in detail, using real articles and examples from Vietnamese traffic regulations.
If the question is not related to Vietnamese traffic law, respond with:
"I'm sorry, I can only assist with questions related to Vietnamese traffic law."

You have access to the conversation history to provide contextual responses. Use this context to better understand the user's questions and provide more relevant answers.`,
      });

      // Build conversation history for context
      const chatHistory = [];

      // Add conversation history
      for (const msg of conversationHistory) {
        chatHistory.push(
          {
            role: "user",
            parts: [{ text: msg.question }],
          },
          {
            role: "model",
            parts: [{ text: msg.answer }],
          }
        );
      }

      const chat = model.startChat({
        history: chatHistory,
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

  async sendToGeminiStream(
    userPrompt: string,
    onToken: (token: string) => void,
    conversationHistory: Array<{ question: string; answer: string }> = []
  ): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are a helpful assistant who is an expert in Vietnamese traffic laws.
Always explain answers clearly and in detail, using real articles and examples from Vietnamese traffic regulations.
If the question is not related to Vietnamese traffic law, respond with:
"I'm sorry, I can only assist with questions related to Vietnamese traffic law."

You have access to the conversation history to provide contextual responses. Use this context to better understand the user's questions and provide more relevant answers.`,
      });

      // Build conversation history for context
      const chatHistory = [];

      // Add conversation history
      for (const msg of conversationHistory) {
        chatHistory.push(
          {
            role: "user",
            parts: [{ text: msg.question }],
          },
          {
            role: "model",
            parts: [{ text: msg.answer }],
          }
        );
      }

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessageStream(userPrompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          // Split by words while preserving spaces
          const words = chunkText.split(/(\s+)/);
          for (const word of words) {
            if (word) {
              // Send both words and spaces
              onToken(word);
              // Add a small delay to make the streaming visible
              await new Promise((resolve) => setTimeout(resolve, 30));
            }
          }
        }
      }
    } catch (error) {
      console.error("Gemini API Stream Error:", error);
      throw new APIError(
        "GEMINI_API_ERROR",
        500,
        "Failed to get streaming response from AI assistant"
      );
    }
  }

  async generateTrafficLawResponse(
    question: string,
    conversationHistory: Array<{ question: string; answer: string }> = []
  ): Promise<string> {
    if (!this.isTrafficLawRelated(question, conversationHistory)) {
      return "I'm sorry, I can only assist with questions related to Vietnamese traffic law.";
    }

    return this.sendToGemini(question, conversationHistory);
  }

  async generateTrafficLawResponseStream(
    question: string,
    onToken: (token: string) => void,
    conversationHistory: Array<{ question: string; answer: string }> = []
  ): Promise<void> {
    if (!this.isTrafficLawRelated(question, conversationHistory)) {
      const errorMessage =
        "I'm sorry, I can only assist with questions related to Vietnamese traffic law.";
      // Simulate streaming for error message
      const words = errorMessage.split(" ");
      for (const word of words) {
        onToken(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    return this.sendToGeminiStream(question, onToken, conversationHistory);
  }

  private isTrafficLawRelated(
    question: string,
    conversationHistory: Array<{ question: string; answer: string }> = []
  ): boolean {
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
      "tuổi",
      "age",
      "năm",
      "years",
    ];

    const followUpIndicators = [
      "vậy",
      "thế",
      "còn",
      "và",
      "how about",
      "what about",
      "then",
      "so",
      "như thế nào",
      "sao",
      "tại sao",
      "why",
      "when",
      "khi nào",
      "bao nhiêu",
      "how much",
      "how many",
      "có được không",
      "được không",
      "can I",
      "may I",
    ];

    const questionLower = question.toLowerCase();

    // Direct keyword match
    const hasTrafficKeywords = trafficKeywords.some((keyword) =>
      questionLower.includes(keyword.toLowerCase())
    );

    if (hasTrafficKeywords) {
      return true;
    }

    // Check if it's a follow-up question and conversation history contains traffic law topics
    const isFollowUp = followUpIndicators.some((indicator) =>
      questionLower.includes(indicator.toLowerCase())
    );

    if (isFollowUp && conversationHistory.length > 0) {
      // Check if recent conversation history contains traffic law content
      const recentHistory = conversationHistory.slice(-3); // Last 3 messages
      const hasTrafficContext = recentHistory.some((msg) => {
        const combinedText = (msg.question + " " + msg.answer).toLowerCase();
        return trafficKeywords.some((keyword) =>
          combinedText.includes(keyword.toLowerCase())
        );
      });

      if (hasTrafficContext) {
        return true;
      }
    }

    return false;
  }
}
