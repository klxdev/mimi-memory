import { Config } from '../../config/schema';
import { LLMFactory } from '../ai/factory';
import { Memory, Entity, MemoryMetadata } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessingResult {
  memories: Memory[];
  entities: Entity[];
}

const ENTITY_EXTRACTION_PROMPT = `
Identify the key entities (people, places, concepts, organizations) in the following text.
Return a JSON list of objects with "name", "type", and "description".
Text:
`;

export class PipelineEngine {
  private llmFactory: LLMFactory;

  constructor(private config: Config) {
    this.llmFactory = new LLMFactory(config);
  }

  async createRawMemory(input: string, metadata: MemoryMetadata = {}): Promise<Memory> {
    const createdAt = new Date().toISOString();
    const rawMemory: Memory = {
      id: uuidv4(),
      content: input,
      type: 'raw',
      createdAt,
      metadata,
      entityIds: []
    };
    
    // Determine the embedder (prioritize 'local' for consistent dimension)
    const embedderName = this.config.providers['local'] ? 'local' : (Object.keys(this.config.providers)[0] || 'default');
    const embedder = this.llmFactory.getProvider(embedderName);
    
    rawMemory.vector = await embedder.embed(input);
    return rawMemory;
  }

  async extractEntities(memory: Memory): Promise<Entity[]> {
    const entities: Entity[] = [];
    const embedderName = this.config.providers['local'] ? 'local' : (Object.keys(this.config.providers)[0] || 'default');
    const embedder = this.llmFactory.getProvider(embedderName);
    
    const extractionProviderName = Object.keys(this.config.providers).find(k => k !== 'local') || embedderName;
    const extractionProvider = this.llmFactory.getProvider(extractionProviderName);
    
    try {
        const response = await extractionProvider.generate({
            prompt: ENTITY_EXTRACTION_PROMPT + memory.content
        });
        
        // Naive JSON parsing
        const jsonMatch = response.text.match(/\[.*\]/s);
        if (jsonMatch) {
            const rawEntities = JSON.parse(jsonMatch[0]);
            for (const re of rawEntities) {
                const entity: Entity = {
                    id: uuidv4(),
                    name: re.name,
                    type: re.type,
                    description: re.description
                };
                // ALWAYS use the consistent embedder for vectors
                entity.vector = await embedder.embed(`${re.name}: ${re.type} - ${re.description}`);
                entities.push(entity);
            }
        }
    } catch (e) {
        console.error("Failed to extract entities:", e);
    }
    return entities;
  }

  async runPipelineSteps(memory: Memory): Promise<Memory[]> {
    const memories: Memory[] = [];
    const createdAt = new Date().toISOString();
    const embedderName = this.config.providers['local'] ? 'local' : (Object.keys(this.config.providers)[0] || 'default');
    const embedder = this.llmFactory.getProvider(embedderName);

    if (this.config.pipeline) {
        for (const stepKey in this.config.pipeline) {
            const stepConfig = this.config.pipeline[stepKey];
            if (!stepConfig) continue;

            try {
                const provider = this.llmFactory.getProvider(stepConfig.provider);
                const response = await provider.generate({
                    prompt: `${stepConfig.prompt}\n\nInput Text:\n${memory.content}`
                });

                const stepMemory: Memory = {
                    id: uuidv4(),
                    content: response.text,
                    type: stepKey as any,
                    createdAt,
                    metadata: { ...memory.metadata, sourceStep: stepKey },
                    entityIds: []
                };
                // ALWAYS use the consistent embedder for vectors
                stepMemory.vector = await embedder.embed(response.text);
                memories.push(stepMemory);
            } catch (e) {
                console.error(`Pipeline step '${stepKey}' failed:`, e);
            }
        }
    }
    return memories;
  }

  async process(input: string, metadata: MemoryMetadata = {}): Promise<ProcessingResult> {
    const rawMemory = await this.createRawMemory(input, metadata);
    const entities = await this.extractEntities(rawMemory);
    rawMemory.entityIds = entities.map(e => e.id);
    const additionalMemories = await this.runPipelineSteps(rawMemory);
    
    return {
      memories: [rawMemory, ...additionalMemories],
      entities
    };
  }
}
