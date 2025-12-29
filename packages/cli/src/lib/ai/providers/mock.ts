import { ILLMProvider, LLMRequest, LLMResponse } from '../types';

export class MockProvider implements ILLMProvider {
  async generate(request: LLMRequest): Promise<LLMResponse> {
    console.log('[MockProvider] Generating for:', request.prompt.slice(0, 50) + '...');
    
    // Return a dummy JSON if the prompt looks like it expects JSON (basic heuristic)
    if (request.prompt.includes('json') || request.prompt.includes('JSON')) {
        return {
            text: JSON.stringify([{ name: "TestEntity", type: "Concept" }])
        };
    }
    
    return {
      text: "This is a mock response from mimi-memory."
    };
  }

  async embed(_text: string): Promise<number[]> {
    // Return random vector of dim 1536
    return Array.from({ length: 1536 }, () => Math.random());
  }
}
