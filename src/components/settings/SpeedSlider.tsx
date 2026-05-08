import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';

export function SpeedSlider() {
  const { speechRate, setSpeechRate } = useSettingsStore();
  const label = speechRate < 0.6 ? '极慢' : speechRate < 0.8 ? '较慢' : speechRate <= 1.0 ? '正常' : speechRate <= 1.2 ? '较快' : '极快';

  const handleSave = () => {
    useSettingsStore.getState().setSpeechRate(speechRate);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>语速设置</Text>

      <View style={styles.sliderRow}>
        <Text style={styles.sideLabel}>慢</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.3}
          maximumValue={1.5}
          step={0.05}
          value={speechRate}
          onValueChange={(v) => useSettingsStore.getState().setSpeechRate(v)}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.primary}
        />
        <Text style={styles.sideLabel}>快</Text>
      </View>

      <Text style={styles.value}>
        {speechRate.toFixed(2)}x — {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  slider: { flex: 1, height: 40 },
  sideLabel: { fontSize: FontSize.sm, color: Colors.textTertiary, width: 20, textAlign: 'center' },
  value: { textAlign: 'center', fontSize: FontSize.md, color: Colors.primary, marginTop: Spacing.xs, fontWeight: '500' },
});
