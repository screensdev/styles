import { act, renderHook } from '@testing-library/react-native';
import { createStyleSheet, useStyles, container } from '..';
import { useCachedContainerWidth } from '../container';

jest.mock('../container', () => {
  const actualUtils = jest.requireActual('../container');
  return {
    ...actualUtils,
    useCachedContainerWidth: jest.fn().mockReturnValue(0),
  };
});

describe('useStyles', () => {
  it('should parse single basic object', () => {
    const styleSheet = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    });

    const { result } = renderHook(() => useStyles(styleSheet));
    expect(result.current.styles).toStrictEqual({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    });
  });
  it('should parse multiple basic objects', () => {
    const styleSheet = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
      container: {
        height: 50,
        borderRadius: 10,
        backgroundColor: 'red',
      },
    });

    const { result } = renderHook(() => useStyles(styleSheet));
    expect(result.current.styles).toStrictEqual({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
      container: {
        height: 50,
        borderRadius: 10,
        backgroundColor: 'red',
      },
    });
  });

  it('recalculates when stylesheet changes', () => {
    const styleSheet = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    });
    const initialProps = {
      styleSheetProp: styleSheet,
    };
    const { result, rerender } = renderHook(
      ({ styleSheetProp }: { styleSheetProp: any }) =>
        useStyles(styleSheetProp),
      { initialProps }
    );
    expect(result.current.styles).toStrictEqual({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    });
    const styleSheet2 = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'red',
      },
    });
    rerender({
      styleSheetProp: styleSheet2,
    });
    expect(result.current.styles).toStrictEqual({
      test: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'red',
      },
    });
  });

  it.todo('recalculates when theme changes');

  it.todo('basic theme usage');

  describe('container queries', () => {
    it('should include correct container queries', () => {
      const styleSheet = createStyleSheet({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
      });

      const { result, rerender } = renderHook(() => useStyles(styleSheet));
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
        },
      });
      act(() => {
        (useCachedContainerWidth as jest.Mock).mockReturnValueOnce(705);
      });
      rerender({});
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'red',
          fontSize: 20,
        },
      });
    });
    it('recalculates when containerWidth changes size', () => {
      const styleSheet = createStyleSheet({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
          [container.width(700, 750)]: {
            backgroundColor: 'red',
            fontSize: 20,
          },
        },
      });

      const { result, rerender } = renderHook(() => useStyles(styleSheet));
      act(() => {
        (useCachedContainerWidth as jest.Mock).mockReturnValueOnce(751);
      });
      rerender({});
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'blue',
        },
      });
      act(() => {
        (useCachedContainerWidth as jest.Mock).mockReturnValueOnce(733);
      });
      rerender({});
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'red',
          fontSize: 20,
        },
      });
    });
  });

  describe('variants', () => {
    const styleSheet = createStyleSheet({
      test: {
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
      },
    });
    it('should select correct variant', () => {
      const { result } = renderHook(() =>
        useStyles(styleSheet, { background: 'dark' })
      );
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'red',
        },
      });
    });
    it('should select correct variant for multiple styleNames', () => {
      const styleSheetWithMultiple = createStyleSheet({
        test: {
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
        },
        container: {
          flex: 1,
          justifyContent: 'center',
          variants: {
            background: {
              light: {
                backgroundColor: 'white',
              },
              dark: {
                backgroundColor: 'black',
              },
              default: {
                backgroundColor: 'gray',
              },
            },
          },
        },
      });
      const { result } = renderHook(() =>
        useStyles(styleSheetWithMultiple, { background: 'dark' })
      );
      expect(result.current.styles).toStrictEqual({
        container: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'black',
        },
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'red',
        },
      });
    });
    it('should recalculate when variantMap changes', () => {
      const initialProps = {
        styleSheetProp: styleSheet,
        variantMap: {
          background: 'dark',
        },
      };
      const { result, rerender } = renderHook(
        ({
          styleSheetProp,
          variantMap,
        }: {
          styleSheetProp: any;
          variantMap: any;
        }) => useStyles(styleSheetProp, variantMap),
        { initialProps }
      );
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'red',
        },
      });
      rerender({
        styleSheetProp: styleSheet,
        variantMap: { background: 'light' },
      });
      expect(result.current.styles).toStrictEqual({
        test: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'yellow',
        },
      });
    });
  });
});
