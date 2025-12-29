import {
  Schema,
  Field,
  Utf8,
  FixedSizeList,
  Float32,
  TimestampMillisecond,
  List,
} from "apache-arrow";

// Dimension for embeddings.
// Updated to 384 for Xenova/all-MiniLM-L6-v2 (Local LLM)
export const VECTOR_DIM = 384;

export const MemorySchema = new Schema([
  new Field("id", new Utf8()),
  new Field("content", new Utf8()),
  new Field("type", new Utf8()),
  // Vector column for semantic search
  new Field(
    "vector",
    new FixedSizeList(VECTOR_DIM, new Field("item", new Float32())),
  ),
  // Metadata stored as JSON string because strict Arrow structs can be rigid for "arbitrary" flags
  new Field("metadata", new Utf8()),
  new Field("created_at", new TimestampMillisecond()),
  // List of associated Entity IDs
  new Field("entityIds", new List(new Field("item", new Utf8()))),
]);

export const EntitySchema = new Schema([
  new Field("id", new Utf8()),
  new Field("name", new Utf8()),
  new Field("type", new Utf8()),
  new Field("description", new Utf8(), true), // nullable
  // Entity vector for searching entities themselves
  new Field(
    "vector",
    new FixedSizeList(VECTOR_DIM, new Field("item", new Float32())),
  ),
]);
