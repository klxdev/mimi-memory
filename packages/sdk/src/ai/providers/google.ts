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

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 10,
    delay: number = 1000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      const isRetryable =
        error.status === 429 ||
        error.status === 503 ||
        error?.message?.includes("timeout");

      if (retries > 0 && isRetryable) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.withRetry(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
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
    });
  }

  async embed(text: string): Promise<number[]> {
    return this.withRetry(async () => {
      const result = await this.embedModel.embedContent(text);
      return result.embedding.values;
    });
  }
}
