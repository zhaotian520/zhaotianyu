import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RootNavigator } from '@/navigation/RootNavigator';
import { setTtsModule } from '@/services/audioService';
import ttsModule from 'expo-android-tts';

// Register native TTS module
setTtsModule(ttsModule);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <RootNavigator />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
