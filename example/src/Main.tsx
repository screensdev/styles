import { Platform, Text, View } from 'react-native';
import {
  container,
  useStyles,
  createStyleSheet,
  createContainerComponent,
  media,
} from '@screensdev/styles';
import { useState } from 'react';
import { PressableText } from './PressableText';
import { Typography, TypographyProps } from './Typography';

const ContainerCard = createContainerComponent(View);
const TestCard = createContainerComponent(View);

export function Main() {
  const [align, setAlign] = useState<'left' | 'center' | 'right' | undefined>(
    'center'
  );
  const { theme, styles } = useStyles(stylesheet);

  const handleOnPress = () => {
    setAlign((current) => (current === 'center' ? 'right' : 'center'));
  };

  // Performance - Reduce rerenders
  // Not defining these inline avoids rerendering every time the parent component rerenders (Main)
  // Outside the scope of this package for now
  const alignmentProp1: TypographyProps['align'] = {
    [container.width(0, 500)]: 'left',
    [container.width(500, 900)]: 'center',
    [container.width(900)]: 'right',
  };

  const alignmentProp2: TypographyProps['align'] = {
    [container.width(0, 600)]: 'center',
    [container.width(600)]: 'left',
  };

  const alignmentProp3: TypographyProps['align'] = {
    [container.width(0, 900)]: 'right',
    [container.width(900)]: 'center',
  };

  return (
    <View style={styles.container}>
      <Text>Current BackgroundColor: {theme?.colors.background}</Text>
      <PressableText handleOnPress={handleOnPress} />
      <Typography align={align}>Test 2</Typography>
      <ContainerCard style={styles.card}>
        <Typography align={alignmentProp1} size="md">
          Hello Container Styles
        </Typography>
        <Typography align={alignmentProp2} size="md">
          600 Left
        </Typography>
      </ContainerCard>
      <TestCard>
        <Typography align={alignmentProp3} size="md">
          Hello Container Styles
        </Typography>
      </TestCard>
      <Text style={styles.dynamicText}>Media Queries</Text>
    </View>
  );
}

export const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    width: '100%',
    // alignItems: "center",
    // justifyContent: "center",
  },
  card: {
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 400,
    maxWidth: 1000,
    width: '80%',
    height: 200,
    padding: 12,
    margin: 5,
    borderRadius: 15,
    // TODO: move into `useStyles` automatically under the `backgroundImage` style field
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(to bottom, rgba(78, 165, 241, 1), rgba(162, 227, 240, 1))',
      },
      default: {
        experimental_backgroundImage:
          'linear-gradient(to bottom, rgba(78, 165, 241, 1), rgba(162, 227, 240, 1))',
      },
    }),
  },
  dynamicText: (theme) => ({
    backgroundColor: theme?.colors.background2,
    [media.width(600, 'lg').and.height(600)]: {
      backgroundColor: theme?.colors.background,
    },
  }),
});
