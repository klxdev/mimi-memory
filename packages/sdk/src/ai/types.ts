export interface LLMRequest {
  prompt: string;
  systemInstruction?: string;
}

export interface LLMResponse {
  text: string;
  usage?: { input: number; output: number };
}

export interface ILLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
  embed(text: string): Promise<number[]>;
}
