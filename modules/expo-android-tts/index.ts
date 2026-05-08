import { requireNativeModule } from 'expo-modules-core';

interface ExpoAndroidTtsModule {
  synthesizeToFile(text: string, outputPath: string): Promise<string>;
  setLanguage(locale: string): Promise<boolean>;
  setSpeechRate(rate: number): Promise<void>;
  setPitch(pitch: number): Promise<void>;
}

const module = requireNativeModule('ExpoAndroidTts') as ExpoAndroidTtsModule;

export default module;
