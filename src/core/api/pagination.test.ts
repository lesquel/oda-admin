import { describe, it, expect } from 'vitest';
import { normalizePaginated } from './pagination';

describe('pagination', () => {
  describe('normalizePaginated', () => {
    it('should handle array response', () => {
      const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = normalizePaginated(items, 1, 10);

      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle object with data array', () => {
      const raw = {
        data: [{ id: '1' }, { id: '2' }],
        total: 100,
        page: 2,
        limit: 20,
      };
      const result = normalizePaginated(raw, 1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(100);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it('should handle object with items array', () => {
      const raw = {
        items: [{ id: '1' }],
        total: 50,
      };
      const result = normalizePaginated(raw, 1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(50);
    });

    it('should handle object with results array', () => {
      const raw = {
        results: [{ id: '1' }, { id: '2' }, { id: '3' }],
      };
      const result = normalizePaginated(raw, 1, 10);

      expect(result.data).toHaveLength(3);
    });

    it('should handle object with body array', () => {
      const raw = {
        body: [{ id: '1' }],
      };
      const result = normalizePaginated(raw, 1, 10);

      expect(result.data).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const result = normalizePaginated([], 1, 10);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle null/undefined', () => {
      const result1 = normalizePaginated(null, 1, 10);
      expect(result1.data).toHaveLength(0);

      const result2 = normalizePaginated(undefined, 1, 10);
      expect(result2.data).toHaveLength(0);
    });

    it('should handle non-array non-object gracefully', () => {
      const result = normalizePaginated('not an array' as any, 1, 10);
      expect(result.data).toHaveLength(0);
    });

    it('should handle object without total and use data length', () => {
      const raw = {
        data: [{ id: '1' }, { id: '2' }],
      };
      const result = normalizePaginated(raw, 1, 10);

      expect(result.total).toBe(2);
    });

    it('should handle object with numeric strings', () => {
      const raw = {
        data: [{ id: '1' }],
        total: '50' as any,
        page: '2' as any,
        limit: '10' as any,
      };
      const result = normalizePaginated(raw, 1, 10);

      // The function only accepts numbers, so strings should fallback to defaults
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });
});
