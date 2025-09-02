import { createStyleSheet, useStyles } from '@screensdev/styles';
import { GestureResponderEvent, Text } from 'react-native';

export function PressableText({
  handleOnPress,
}: {
  handleOnPress: (event: GestureResponderEvent) => void;
}) {
  const { styles } = useStyles(stylesheet, {
    size: '1',
    height: true,
  });

  return (
    <Text onPress={handleOnPress} style={styles.text}>
      Press to Change Alignment
    </Text>
  );
}

export const stylesheet = createStyleSheet({
  text: (theme) => ({
    color: 'blue',
    variants: {
      size: {
        '1': {
          backgroundColor: theme?.colors.background,
          // color: "blue",
          // fontSize: 50,
          // lineHeight: 55,
          // letterSpacing: 0.0025,
        },
      },
      height: {
        true: {
          color: 'black',
        },
      },
    },
  }),
});
