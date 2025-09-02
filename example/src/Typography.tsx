import {
  container,
  createStyleSheet,
  useStyles,
  type Variants,
} from '@screensdev/styles';
import { Text } from 'react-native';

export type TypographyProps = React.ComponentPropsWithRef<typeof Text> & {
  align?: Variants<typeof stylesheet>['align'];
  size?: Variants<typeof stylesheet>['size'];
};

export const Typography = ({
  ref,
  children,
  style,
  align,
  size,
  ...props
}: TypographyProps) => {
  const { styles } = useStyles(stylesheet, {
    align,
    size,
  });

  return (
    <Text {...props} ref={ref} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const stylesheet = createStyleSheet({
  text: {
    [container.width(800)]: {
      fontWeight: '700',
    },
    variants: {
      align: {
        left: {
          textAlign: 'left',
        },
        center: {
          textAlign: 'center',
        },
        right: {
          textAlign: 'right',
        },
      },
      size: {
        sm: {
          fontSize: 12,
        },
        md: {
          fontSize: 18,
        },
        lg: {
          fontSize: 24,
        },
      },
    },
  },
});
