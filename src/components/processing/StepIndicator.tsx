import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { PIPELINE_STEPS } from '@/constants/pipeline';

interface Props {
  currentStep: number;
}

export function StepIndicator({ currentStep }: Props) {
  return (
    <View style={styles.wrapper}>
      {PIPELINE_STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <View key={step.id} style={styles.row}>
            <View style={[styles.dot, isActive && styles.dotActive, isDone && styles.dotDone]}>
              <Text style={[styles.dotText, (isActive || isDone) && styles.dotTextActive]}>
                {isDone ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive, isDone && styles.labelDone]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  dotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  dotDone: { borderColor: Colors.success, backgroundColor: Colors.success },
  dotText: { fontSize: FontSize.xs, color: Colors.textTertiary, fontWeight: '700' },
  dotTextActive: { color: Colors.white },
  label: { fontSize: FontSize.sm, color: Colors.textTertiary },
  labelActive: { color: Colors.text, fontWeight: '600' },
  labelDone: { color: Colors.success },
});
