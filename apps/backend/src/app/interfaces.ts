import type { Recipe } from '../domain/domain';

export interface FileStorage {
  /**
   * Upload a file to the storage
   * @param name - File name in storage
   * @param content - File content as Buffer or string
   * @returns A promise resolving to the file URL
   */
  uploadFile(name: string, content: Buffer | string): Promise<string>;
}

export interface RecipesRepository {
  getAll(): Promise<Recipe[]>;
}
