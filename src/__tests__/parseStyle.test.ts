import { container, media } from '..';
import { parseStyle } from '../parseStyle';

describe('useStyles', () => {
  it('should parse single basic object', () => {
    const result = parseStyle(
      {
        flex: 1,
        justifyContent: 'center',
      },
      0,
      { width: 0, height: 0 },
      undefined
    );
    expect(result).toStrictEqual({
      flex: 1,
      justifyContent: 'center',
    });
  });

  it('should ignore undefined', () => {
    const result = parseStyle(
      {
        flex: 1,
        justifyContent: undefined,
      },
      0,
      { width: 0, height: 0 },
      undefined
    );
    expect(result).toStrictEqual({
      flex: 1,
    });
  });

  describe('container queries', () => {
    it('ignores container styles when no container found', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
        0,
        { width: 0, height: 0 },
        undefined
      );
      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'blue',
      });
    });
    it('applies only the styles for matching container size', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
        705,
        { width: 900, height: 500 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
        fontSize: 20,
      });
    });
    it('applies container styles last', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
          backgroundColor: 'blue',
        },
        705,
        { width: 900, height: 500 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
        fontSize: 20,
      });
    });
    it('supports multiple container styles', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
          [container.width(800)]: {
            backgroundColor: 'purple',
            flexDirection: 'row',
          },
        },
        802,
        { width: 900, height: 500 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        fontSize: 20,
        backgroundColor: 'purple',
        flexDirection: 'row',
      });
    });
    it('applies container styles in cascading order', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(800)]: {
            backgroundColor: 'purple',
            flexDirection: 'row',
          },
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
        802,
        { width: 900, height: 500 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'red',
        fontSize: 20,
      });
    });
    it('supports minWidth and maxWidth', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700, 750)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
        730,
        { width: 900, height: 500 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
        fontSize: 20,
      });
    });
  });

  describe('variants', () => {
    const styleSheet = {
      flex: 1,
      justifyContent: 'center',
      variants: {
        background: {
          light: {
            backgroundColor: 'yellow',
          },
          dark: {
            backgroundColor: 'red',
          },
          default: {
            backgroundColor: 'blue',
          },
        },
      },
    } as const;
    it('should ignore variants if no selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        0,
        { width: 0, height: 0 }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
      });
    });
    it('should fallback to default if one is there', () => {
      const result = parseStyle(styleSheet, 0, { width: 0, height: 0 });
      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'blue',
      });
    });
    it('should select correct variant', () => {
      const result = parseStyle(
        styleSheet,
        0,
        { width: 0, height: 0 },
        { background: 'dark' }
      );
      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
      });
    });
    it('should support container queries in variant selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        51,
        { width: 65, height: 0 },
        {
          background: {
            [container.width(50)]: 'dark',
          },
        }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
      });
    });
    it('should select first matching container query in variant selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        90,
        { width: 65, height: 0 },
        {
          background: {
            [container.width(50)]: 'dark',
            [container.width(80)]: 'light',
          },
        }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
      });
    });
    it('should fallback to default if no container queries match in variant selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              default: {
                backgroundColor: 'green',
              },
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        49,
        { width: 65, height: 0 },
        {
          background: {
            [container.width(50)]: 'dark',
          },
        }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'green',
      });
    });
    it('should support media queries in variant selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              default: {
                backgroundColor: 'green',
              },
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        55,
        { width: 65, height: 0 },
        {
          background: {
            [media.only.width(50)]: 'light',
          },
        }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'yellow',
      });
    });
    it('should support media queries and container queries together in variant selection', () => {
      const result = parseStyle(
        {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              default: {
                backgroundColor: 'green',
              },
              light: {
                backgroundColor: 'yellow',
              },
              dark: {
                backgroundColor: 'red',
              },
            },
          },
        },
        55,
        { width: 65, height: 0 },
        {
          background: {
            [container.width(50)]: 'dark',
            [media.only.width(50)]: 'light',
          },
        }
      );

      expect(result).toStrictEqual({
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
      });
    });
  });
});
