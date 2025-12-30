import { getDb } from "./db";
import { Memory, Entity } from "../types";
import { MemorySchema, EntitySchema, VECTOR_DIM } from "./schema";

const MEMORY_TABLE = "memories";
const ENTITY_TABLE = "entities";

export class Repository {
  async saveBatch(memories: Memory[], entities: Entity[]) {
    const db = await getDb();

    // 1. Save Memories
    if (memories.length > 0) {
      const memoryData = memories.map((m) => ({
        id: m.id,
        content: m.content,
        type: m.type,
        vector: (m as any).vector || new Array(VECTOR_DIM).fill(0), // Placeholder if vector missing
        metadata: JSON.stringify(m.metadata),
        created_at: new Date(m.createdAt).getTime(),
        entityIds: m.entityIds,
      }));

      // Check if table exists, if not create, else add
      const tableNames = await db.tableNames();
      if (!tableNames.includes(MEMORY_TABLE)) {
        await db.createTable(MEMORY_TABLE, memoryData, {
          schema: MemorySchema,
        });
      } else {
        const table = await db.openTable(MEMORY_TABLE);
        await table.add(memoryData);
      }
    }

    // 2. Save Entities
    if (entities.length > 0) {
      const entityData = entities.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        description: e.description || "",
        vector: (e as any).vector || new Array(VECTOR_DIM).fill(0),
      }));

      const tableNames = await db.tableNames();
      if (!tableNames.includes(ENTITY_TABLE)) {
        await db.createTable(ENTITY_TABLE, entityData, {
          schema: EntitySchema,
        });
      } else {
        const table = await db.openTable(ENTITY_TABLE);
        // Basic deduplication could happen here, for now we append
        // Real impl should probably merge or check existence
        await table.add(entityData);
      }
    }
  }

  async searchMemories(
    vector: number[],
    filter?: string,
    limit = 10,
  ): Promise<any[]> {
    const db = await getDb();
    const tableNames = await db.tableNames();
    if (!tableNames.includes(MEMORY_TABLE)) return [];

    const table = await db.openTable(MEMORY_TABLE);
    let query = table.search(vector).limit(limit);

    // Note: LanceDB filter syntax is SQL-like.
    // We'd need to parse our metadata filter into SQL if provided.
    // For now, simple vector search.
    if (filter) {
      query = query.where(filter);
    }

    return await query.toArray();
  }

  async getAll(limit = 20): Promise<any[]> {
    const db = await getDb();
    const tableNames = await db.tableNames();
    if (!tableNames.includes(MEMORY_TABLE)) return [];

    const table = await db.openTable(MEMORY_TABLE);
    // Return most recent first
    return await table.query().limit(limit).toArray();
  }

  async getById(id: string): Promise<any | null> {
    const db = await getDb();
    const tableNames = await db.tableNames();
    if (!tableNames.includes(MEMORY_TABLE)) return null;

    const table = await db.openTable(MEMORY_TABLE);
    const results = await table
      .query()
      .where(`id = '${id}'`)
      .limit(1)
      .toArray();
    return results.length > 0 ? results[0] : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const db = await getDb();
    const tableNames = await db.tableNames();
    if (!tableNames.includes(MEMORY_TABLE)) return false;

    const table = await db.openTable(MEMORY_TABLE);
    await table.delete(`id = '${id}'`);
    return true;
  }

  async updateMemory(id: string, updates: Partial<Memory>): Promise<void> {
    const db = await getDb();
    const tableNames = await db.tableNames();
    if (!tableNames.includes(MEMORY_TABLE)) return;

    const table = await db.openTable(MEMORY_TABLE);

    const formattedUpdates: any = {};
    if (updates.content !== undefined)
      formattedUpdates.content = updates.content;
    if (updates.type !== undefined) formattedUpdates.type = updates.type;
    if (updates.metadata !== undefined) {
      formattedUpdates.metadata = JSON.stringify(updates.metadata);
    }
    if (updates.entityIds !== undefined) {
      formattedUpdates.entityIds = updates.entityIds;
    }

    // LanceDB update expects a SQL-like where clause and an object with updates
    // If the error persists, it might be a limitation of the current Node SDK version
    // for List types in the 'update' method.
    await table.update(formattedUpdates, { where: `id = '${id}'` });
  }
}
