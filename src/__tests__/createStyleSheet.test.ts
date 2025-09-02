import { container, createStyleSheet } from '..';

describe('createStyleSheet', () => {
  it('should return the input without modification', () => {
    const styleSheet = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'center',
        [container.width(500)]: {
          width: 50,
        },
        [container.width(700)]: {
          width: 200,
        },
      },
    });

    expect(styleSheet).toStrictEqual(styleSheet);
  });
  it('should return a reference to the original object', () => {
    const originalObj = {
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    } as const;
    const styleSheet = createStyleSheet(originalObj);

    expect(styleSheet).toBe(originalObj);
    const styleSheet2 = createStyleSheet({
      test: {
        flex: 1,
        justifyContent: 'center',
      },
    });

    expect(styleSheet2).not.toBe(originalObj);
  });
});
