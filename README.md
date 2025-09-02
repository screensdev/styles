# Styles

Cross-platform styles for React Native without the complexity.

- Fully Typesafe
- No Babel Plugin Required
- No native code (Works in Expo Go)

## Installation

Add to your project using one of the following:

```bash
yarn add @screensdev/styles
```

```bash
bun add @screensdev/styles
```

```bash
npm install @screensdev/styles
```

## Basic Usage

```js
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from '@screensdev/styles';

export default function Component() {
  const styles = useStyles(styleSheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}></Text>
    </View>
  );
}

const styleSheet = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'red',
  },
});
```

## Features

- Theme Support
- Media queries
- Container queries
- Variants
- Responsive Variants
- Breakpoints

## Attribution

The foundation for this library was adapted from v2 of the **react-native-unistyles** library.

**Original source:** https://github.com/jpudysz/react-native-unistyles/tree/v2.43.0
**Author:** Jacek Pudysz
**License:** MIT

Compared to the original the following modifications have been made:

- Container queries
- Improved TypeScript support with stricter types
- Performance improvements
- Additional unit tests
- Overhauled theming system
- Removed native runtime
- Removed plugin support
- Removed dynamic style objects

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
