import { CrudServiceOptions, CrudServiceResult } from '@/integrations/cms/types';

/**
 * BaseCrudService - Real Wix CMS integration
 * Connects to actual Wix collections via API
 */
export class BaseCrudService {
  private static readonly API_BASE = '/api/cms';

  static async create<T extends { _id: string }>(
    collectionId: string,
    itemData: T,
    multiRefs?: Record<string, string[]>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.API_BASE}/collections/${collectionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemData, multiRefs }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create item: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('BaseCrudService.create error:', error);
      throw error;
    }
  }

  static async getAll<T>(
    collectionId: string,
    refs?: { singleRef?: string[]; multiRef?: string[] },
    options?: { limit?: number; skip?: number }
  ): Promise<CrudServiceResult<T>> {
    try {
      const limit = options?.limit || 50;
      const skip = options?.skip || 0;
      
      const params = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
        ...(refs?.singleRef && { singleRef: refs.singleRef.join(',') }),
        ...(refs?.multiRef && { multiRef: refs.multiRef.join(',') }),
      });

      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items?${params}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('BaseCrudService.getAll error:', error);
      throw error;
    }
  }

  static async getById<T>(
    collectionId: string,
    itemId: string,
    refs?: { singleRef?: string[]; multiRef?: string[] }
  ): Promise<T | null> {
    try {
      const params = new URLSearchParams({
        ...(refs?.singleRef && { singleRef: refs.singleRef.join(',') }),
        ...(refs?.multiRef && { multiRef: refs.multiRef.join(',') }),
      });

      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items/${itemId}?${params}`,
        { method: 'GET' }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch item: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('BaseCrudService.getById error:', error);
      throw error;
    }
  }

  static async update<T extends { _id: string }>(
    collectionId: string,
    itemData: Partial<T> & { _id: string }
  ): Promise<T> {
    try {
      const { _id, ...data } = itemData;
      
      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items/${_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('BaseCrudService.update error:', error);
      throw error;
    }
  }

  static async delete<T>(collectionId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items/${itemId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }
    } catch (error) {
      console.error('BaseCrudService.delete error:', error);
      throw error;
    }
  }

  static async addReferences(
    collectionId: string,
    itemId: string,
    refs: Record<string, string[]>
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items/${itemId}/references/add`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(refs),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add references: ${response.statusText}`);
      }
    } catch (error) {
      console.error('BaseCrudService.addReferences error:', error);
      throw error;
    }
  }

  static async removeReferences(
    collectionId: string,
    itemId: string,
    refs: Record<string, string[]>
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.API_BASE}/collections/${collectionId}/items/${itemId}/references/remove`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(refs),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove references: ${response.statusText}`);
      }
    } catch (error) {
      console.error('BaseCrudService.removeReferences error:', error);
      throw error;
    }
  }
}
