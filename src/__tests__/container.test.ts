import { container } from '..';

describe('container', () => {
  describe('container util', () => {
    it('should correctly return width container query', () => {
      const result = [
        container.width(100, 200).description,
        container.width(0, 100).description,
        container.width(0, 0).description,
        container.width(undefined, 400).description,
        container.width(400).description,
        container.width().description,
      ];

      expect(result).toEqual([
        ':c:w[100, 200]',
        ':c:w[0, 100]',
        ':c:w[0, 0]',
        ':c:w[0, 400]',
        ':c:w[400, Infinity]',
        ':c:w[0, Infinity]',
      ]);
    });

    it('should allow for nulls', () => {
      const result = [
        container.width(500).description,
        container.width(null, 100).description,
        container.width(null, 999).description,
        container.width(null).description,
      ];

      expect(result).toEqual([
        ':c:w[500, Infinity]',
        ':c:w[0, 100]',
        ':c:w[0, 999]',
        ':c:w[0, Infinity]',
      ]);
    });

    it('should do nothing for unknown props', () => {
      // @ts-ignore
      const value = container.unknown;

      expect(value).toBe(undefined);

      // @ts-ignore
      const partialValue1 = container.width(100, 200).unknown;

      expect(partialValue1).toBe(undefined);

      const value1 = container.width(100, 200).toString();

      expect(value1).toBe('Symbol(:c:w[100, 200])');

      const value2 = container.width(100, 200).description;

      expect(value2).toBe(':c:w[100, 200]');
    });
  });
  it.todo('createContainerComponent');
});
