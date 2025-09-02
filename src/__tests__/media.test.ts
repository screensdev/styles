import { media, parseMediaQuery } from '../media';

describe('media', () => {
  describe('media util', () => {
    it('should correctly return width media query', () => {
      const result = [
        media.only.width(100, 200).description,
        media.only.width(0, 100).description,
        media.only.width(0, 0).description,
        media.only.width(undefined, 400).description,
        media.only.width(400).description,
        // @ts-ignore
        media.only.width('xs', 'lg').description,
        media.only.width().description,
      ];

      expect(result).toEqual([
        ':m:w[100, 200]',
        ':m:w[0, 100]',
        ':m:w[0, 0]',
        ':m:w[0, 400]',
        ':m:w[400, Infinity]',
        ':m:w[:b[xs], :b[lg]]',
        ':m:w[0, Infinity]',
      ]);
    });

    it('should correctly return height media query', () => {
      const result = [
        media.only.height(120, 750).description,
        media.only.height(0, 1000).description,
        media.only.height(0, 0).description,
        media.only.height(undefined, 250).description,
        media.only.height(75).description,
        // @ts-ignore
        media.only.height('md', 'xl').description,
        media.only.height().description,
      ];

      expect(result).toEqual([
        ':m:h[120, 750]',
        ':m:h[0, 1000]',
        ':m:h[0, 0]',
        ':m:h[0, 250]',
        ':m:h[75, Infinity]',
        ':m:h[:b[md], :b[xl]]',
        ':m:h[0, Infinity]',
      ]);
    });

    it('should correctly return combined media query', () => {
      const result = [
        media.width(0, 100).and.height(500).description,
        media.height(100, 200).and.width(undefined, 500).description,
        media.width(0, 100).and.height(500, -500).description,
        media.width(undefined, 200).and.height().description,
        // @ts-ignore test invalid case, even if typescript secures it
        media.width('xs', 'xxl').and.height('doesnt', 'exist').description,
      ];

      expect(result).toEqual([
        ':m:w[0, 100]:h[500, Infinity]',
        ':m:w[0, 500]:h[100, 200]',
        ':m:w[0, 100]:h[500, -500]',
        ':m:w[0, 200]:h[0, Infinity]',
        ':m:w[:b[xs], :b[xxl]]:h[:b[doesnt], :b[exist]]',
      ]);
    });

    it('should allow for nulls', () => {
      const result = [
        media.width(null, 100).and.height(300).description,
        media.height(100, 300).and.width(500).description,
        media.width(null, 100).and.height(500).description,
        media.width(null, 999).and.height().description,
        media.width(null).and.height(null).description,
      ];

      expect(result).toEqual([
        ':m:w[0, 100]:h[300, Infinity]',
        ':m:w[500, Infinity]:h[100, 300]',
        ':m:w[0, 100]:h[500, Infinity]',
        ':m:w[0, 999]:h[0, Infinity]',
        ':m:w[0, Infinity]:h[0, Infinity]',
      ]);
    });

    it('should allow for shortcuts', () => {
      const result = [
        media.width(100, 200).and.height(300).description,
        media.height(100, 300).and.width(500).description,
        media.width(100, 200).and.height(500, -500).description,
        media.width(undefined, 200).and.height().description,
        media.width().and.height(null).description,
      ];

      expect(result).toEqual([
        ':m:w[100, 200]:h[300, Infinity]',
        ':m:w[500, Infinity]:h[100, 300]',
        ':m:w[100, 200]:h[500, -500]',
        ':m:w[0, 200]:h[0, Infinity]',
        ':m:w[0, Infinity]:h[0, Infinity]',
      ]);
    });

    it('should do nothing for unknown props', () => {
      // @ts-ignore
      const value = media.unknown;

      expect(value).toBe(undefined);

      // @ts-ignore
      const partialValue1 = media.only.width(100, 200).unknown;

      expect(partialValue1).toBe(undefined);

      // @ts-ignore
      const partialValue2 = media.only.height(100, 200).unknown;

      expect(partialValue2).toBe(undefined);

      // @ts-ignore
      const partialValue3 = media.width(100, 200).and.height(100, 200).unknown;

      expect(partialValue3).toBe(undefined);

      // @ts-ignore
      const partialValue4 = media.height(100, 200).and.width(100, 200).unknown;

      expect(partialValue4).toBe(undefined);

      const value5 = media.width(100, 200).and.height(100, 200).toString();

      expect(value5).toBe('Symbol(:m:w[100, 200]:h[100, 200])');

      const value6 = media.height(100, 200).and.width(100, 200).toString();

      expect(value6).toBe('Symbol(:m:w[100, 200]:h[100, 200])');
    });
  });
  describe('parseMediaQuery', () => {
    const breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    };
    it('should parse without breakpoints', () => {
      const result = parseMediaQuery(':m:w[50, Infinity]', undefined);
      expect(result).toStrictEqual({
        width: { from: 50, to: Infinity },
        height: undefined,
      });
    });
    it('should parse breakpoint values', () => {
      const result = parseMediaQuery(':m:w[50, :b[md]]', breakpoints);
      expect(result).toStrictEqual({
        width: { from: 50, to: 768 },
        height: undefined,
      });
    });
    it('should return zero for unknown breakpoints', () => {
      const result = parseMediaQuery(':m:w[50, :b[fake]]', breakpoints);
      expect(result).toStrictEqual({
        width: { from: 50, to: 0 },
        height: undefined,
      });
    });
    it('should parse multiple breakpoints', () => {
      const result = parseMediaQuery(':m:w[:b[sm], :b[lg]]', breakpoints);
      expect(result).toStrictEqual({
        width: { from: 576, to: 992 },
        height: undefined,
      });
    });
    it('should handle breakpoints on both width and height', () => {
      const result = parseMediaQuery(
        ':m:w[:b[sm], :b[lg]]:h[:b[xs], :b[md]]',
        breakpoints
      );
      expect(result).toStrictEqual({
        width: { from: 576, to: 992 },
        height: { from: 0, to: 768 },
      });
    });
    it('should handle a mix on both width and height', () => {
      const result = parseMediaQuery(
        ':m:w[:b[sm], 950]:h[:b[xs], Infinity]',
        breakpoints
      );
      expect(result).toStrictEqual({
        width: { from: 576, to: 950 },
        height: { from: 0, to: Infinity },
      });
    });
  });
});
