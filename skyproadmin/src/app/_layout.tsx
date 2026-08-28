import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import '@/global.css';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <View style={styles.root}>
        <StatusBar style="light" backgroundColor="#07090e" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#07090e' },
            animation: 'fade',
          }}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#07090e',
  },
});
