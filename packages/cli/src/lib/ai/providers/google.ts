import { ILLMProvider, LLMRequest, LLMResponse } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GoogleProvider implements ILLMProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private embedModel: any;

  constructor(apiKey: string, modelName: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    // Default embedding model for Google
    this.embedModel = this.genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const result = await this.model.generateContent(request.prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      usage: {
        input: response.usageMetadata?.promptTokenCount || 0,
        output: response.usageMetadata?.candidatesTokenCount || 0,
      },
    };
  }

  async embed(text: string): Promise<number[]> {
    const result = await this.embedModel.embedContent(text);
    return result.embedding.values;
  }
}
