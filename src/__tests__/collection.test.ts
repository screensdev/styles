import { symmetricDifference } from '../utils/collections';

describe('collections', () => {
  describe('symmetricDifference util', () => {
    it('should work when source is bigger', () => {
      const result = symmetricDifference(new Set([1, 2, 3]), new Set([1]));

      expect(result).toEqual(new Set([2, 3]));
    });
    it('should work when compare is bigger', () => {
      const result = symmetricDifference(new Set([1]), new Set([1, 2, 3]));

      expect(result).toEqual(new Set([2, 3]));
    });
    it('should return empty set when they are the same', () => {
      const result = symmetricDifference(
        new Set([1, 2, 3]),
        new Set([1, 2, 3])
      );

      expect(result).toEqual(new Set());
    });
    it('should work when one is empty', () => {
      const result = symmetricDifference(new Set([]), new Set([1]));

      expect(result).toEqual(new Set([1]));
    });
    it('should order the items correctly', () => {
      const result = symmetricDifference(
        new Set([1, 2, 8, 6]),
        new Set([1, 3, 4, 6, 9])
      );

      expect(result).toEqual(new Set([2, 3, 4, 8, 9]));
    });
  });
});
