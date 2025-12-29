export type MemoryType = "raw" | "episodic" | "semantic" | "procedural";

export interface MemoryMetadata {
  projectId?: string;
  userId?: string;
  sourceFile?: string;
  [key: string]: any;
}

export interface Memory {
  id: string;
  content: string;
  type: MemoryType;
  createdAt: string; // ISO Date
  metadata: MemoryMetadata;
  entityIds: string[]; // Foreign keys to Entity nodes
  vector?: number[];
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  description?: string;
  vector?: number[];
}
