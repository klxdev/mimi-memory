import { Command } from 'commander';
import { Repository } from '../lib/storage/repository';
import fs from 'fs/promises';
import { Memory } from '../types';

export const verifyCommand = new Command()
  .name('verify')
  .description('Verify the existence of source files linked to memories in the database.')
  .action(async () => {
    console.log('Verifying memories...');
    const repository = new Repository();
    const memories: Memory[] = await repository.getAll(-1); // Get all memories

    let missingFilesCount = 0;

    for (const memory of memories) {
      if (memory.metadata && memory.metadata.sourceFile) {
        const filePath = memory.metadata.sourceFile;
        try {
          await fs.access(filePath, fs.constants.F_OK);
          // console.log(`[OK] ${filePath}`);
        } catch (_error) {
          console.warn(`[MISSING] Source file for memory ID ${memory.id}: ${filePath}`);
          missingFilesCount++;
        }
      }
    }

    if (missingFilesCount === 0) {
      console.log('All memory source files verified successfully.');
    } else {
      console.warn(`Verification complete. Found ${missingFilesCount} missing source file(s).`);
    }
  });
