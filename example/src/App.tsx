import { createStyleSheet, ThemeProvider, useStyles } from '@screensdev/styles';
import { breakpoints, themes } from '../styles';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Main } from './Main';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const selectedTheme = darkMode ? themes.dark : themes.light;
  const { styles } = useStyles(stylesheet);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={selectedTheme} breakpoints={breakpoints}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.switchWrapper}>
            <Text>Switch Theme</Text>
            <Switch
              value={darkMode}
              onValueChange={(value: boolean) => setDarkMode(value)}
            />
          </View>
          <Main />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const stylesheet = createStyleSheet({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
});
