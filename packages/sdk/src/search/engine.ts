import { Repository } from "../storage/repository";
import { LLMFactory } from "../ai/factory";
import { Config } from "../config/schema";

export interface SearchResult {
  memoryId: string;
  content: string;
  score: number;
  type: string;
  metadata: any;
}

export class SearchEngine {
  private repo: Repository;
  private llmFactory: LLMFactory;

  constructor(private config: Config) {
    this.repo = new Repository();
    this.llmFactory = new LLMFactory(config);
  }

  async search(
    phrase: string,
    filters: any = {},
    boostEntity?: string,
  ): Promise<SearchResult[]> {
    // 1. Embed query (prioritize 'local' for consistent dimension with stored data)
    const embedderName = this.config.providers["local"]
      ? "local"
      : Object.keys(this.config.providers)[0] || "default";
    const embedder = this.llmFactory.getProvider(embedderName);
    const vector = await embedder.embed(phrase);

    // 2. Build Filter String for LanceDB (SQL-like)
    // e.g. "metadata.project = 'main'"
    // Since metadata is stored as JSON string in 'metadata' column,
    // LanceDB might need string matching or if we stored it as struct.
    // In schema.ts we used `new Field('metadata', new Utf8())`.
    // So we can't easily query JSON fields with SQL in current LanceDB Node unless we used struct.
    // For now, we might have to do post-filtering if metadata is a string.
    // OR we change schema to use Struct if possible, but let's stick to post-filtering for MVP safety.

    // 3. Vector Search
    // We request more results to allow for post-filtering
    const rawResults = await this.repo.searchMemories(vector, undefined, 50);

    // 4. Post-Process (Filter & Boost)
    let results: SearchResult[] = rawResults.map((r: any) => ({
      memoryId: r.id,
      content: r.content,
      score: 1 - (r._distance || 0), // LanceDB returns distance usually, we want similarity/score
      type: r.type,
      metadata:
        typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata,
      entityIds: r.entityIds,
    }));

    // Filter
    if (Object.keys(filters).length > 0) {
      results = results.filter((r) => {
        for (const [key, val] of Object.entries(filters)) {
          if (r.metadata[key] !== val) return false;
        }
        return true;
      });
    }

    // Boost by Entity
    // This assumes we found the entity ID for the name 'boostEntity'.
    // For MVP, we might skip resolving the name to ID and just check if the name appears?
    // No, the requirements said "Entity graph relationships".
    // Realistically, we'd need to search the Entity table for `boostEntity`, get its ID,
    // and then boost memories containing that ID.
    if (boostEntity) {
      // TODO: Implement entity lookup. For now, we skip or naive check.
      // We'll leave this as a placeholder for the agent to expand.
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 10);
  }
}
