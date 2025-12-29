import { ILLMProvider } from "./types";
import { MockProvider } from "./providers/mock";
import { LocalProvider } from "./providers/local";
import { GoogleProvider } from "./providers/google";
import { Config } from "../../config/schema";

export class LLMFactory {
  private providers: Map<string, ILLMProvider> = new Map();

  constructor(private config: Config) {}

  getProvider(providerName: string): ILLMProvider {
    if (this.providers.has(providerName)) {
      return this.providers.get(providerName)!;
    }

    const providerConfig = this.config.providers[providerName];
    if (!providerConfig) {
      console.warn(
        `Provider '${providerName}' not found in config. Using MockProvider.`,
      );
      const mock = new MockProvider();
      this.providers.set(providerName, mock);
      return mock;
    }

    let provider: ILLMProvider;

    // Check type explicitly or via providerName
    const type = providerConfig.type || providerName;

    if (type === "google") {
      if (!providerConfig.apiKey)
        throw new Error(
          `API Key required for Google provider: ${providerName}`,
        );
      provider = new GoogleProvider(
        providerConfig.apiKey,
        providerConfig.model,
      );
    } else if (type === "local") {
      provider = new LocalProvider();
    } else {
      provider = new MockProvider();
    }

    this.providers.set(providerName, provider);
    return provider;
  }
}
