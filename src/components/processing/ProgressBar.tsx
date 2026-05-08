import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  progress: number;
  label: string;
}

export function ProgressBar({ progress, label }: Props) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
      <Text style={styles.percent}>{Math.round(clamped)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: Spacing.lg, alignItems: 'center' },
  label: { fontSize: FontSize.md, color: Colors.text, marginBottom: Spacing.md, textAlign: 'center' },
  track: {
    width: '100%', height: 8, backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.primary, borderRadius: BorderRadius.sm },
  percent: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary, marginTop: Spacing.md },
});
