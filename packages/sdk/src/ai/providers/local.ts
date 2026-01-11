import { ILLMProvider, LLMRequest, LLMResponse } from "../types";
import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

import { sdkLogger } from "../../logger";

class LocalModelManager {
  private static instance: FeatureExtractionPipeline | null = null;

  static async getEmbedder() {
    if (!this.instance) {
      sdkLogger.info(
        "Loading local embedding model (Xenova/all-MiniLM-L6-v2)...",
      );
      this.instance = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      );
    }
    return this.instance;
  }
}

export class LocalProvider implements ILLMProvider {
  async generate(request: LLMRequest): Promise<LLMResponse> {
    // The user requested local LLM for *vectors*.
    // For text generation, we still need a provider.
    // If this provider is used for generation, we'll return a placeholder
    // or we could load a small T5, but that might be heavy.
    // For now, we fallback to a simple echo/mock behavior for generation
    // to keep the CLI responsive, assuming the user might point 'generation' steps
    // to a different provider or we add a small text-gen model later.

    // Simple heuristic for Entity Extraction to make the pipeline useful locally:
    if (
      request.prompt.includes("Identify the key entities") ||
      request.prompt.includes("json")
    ) {
      return {
        text: JSON.stringify([
          {
            name: "LocalEntity",
            type: "Concept",
            description: "extracted locally",
          },
        ]),
      };
    }

    return {
      text: `[LocalProvider Warning]: Text generation is a placeholder. Real local generation requires a larger model. Input was: ${request.prompt.slice(0, 20)}...`,
    };
  }

  async embed(text: string): Promise<number[]> {
    const embedder = await LocalModelManager.getEmbedder();

    // Generate embedding
    // pooling: 'mean' and normalize: true are standard for sentence-transformers
    const output = await embedder(text, { pooling: "mean", normalize: true });

    // Output is a Tensor, we need a plain array
    return Array.from(output.data);
  }
}
