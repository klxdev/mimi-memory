import { z } from "zod";

export const ProviderConfigSchema = z
  .object({
    apiKey: z.string().optional(),
    model: z.string(),
    endpoint: z.string().optional(),
    // Allow extra fields for specific providers
  })
  .catchall(z.any());

export const PipelineStepSchema = z.object({
  provider: z.string(), // Must match a key in providers
  prompt: z.string(),
});

export const ConfigSchema = z.object({
  providers: z.record(z.string(), ProviderConfigSchema),
  pipeline: z.record(z.string(), PipelineStepSchema),
  debug: z.boolean().optional(),
  logsDir: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
