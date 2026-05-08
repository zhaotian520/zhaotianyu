import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { ApiKeyInput } from '@/components/settings/ApiKeyInput';
import { SpeedSlider } from '@/components/settings/SpeedSlider';
import { PromptEditor } from '@/components/settings/PromptEditor';

export default function SettingsScreen() {
  const loadApiKey = useSettingsStore((s) => s.loadApiKey);

  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ApiKeyInput />
      <SpeedSlider />
      <PromptEditor />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
});
