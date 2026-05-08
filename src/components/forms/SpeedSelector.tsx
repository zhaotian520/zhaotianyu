import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { SPEED_OPTIONS } from '@/constants/bgm';

interface Props {
  value: number;
  onChange: (speed: number) => void;
}

export function SpeedSelector({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  const current = SPEED_OPTIONS.find((s) => s.value === value);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>配音语速</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.selectorText}>
          {current?.label || value.toFixed(2)}x
        </Text>
        <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.options}>
          {SPEED_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, value === opt.value && styles.optionActive]}
              onPress={() => {
                onChange(opt.value);
                setExpanded(false);
              }}
            >
              <Text style={[styles.optionText, value === opt.value && styles.optionTextActive]}>
                {opt.label || `${opt.value.toFixed(2)}x`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  selectorText: { fontSize: FontSize.md, color: Colors.text },
  arrow: { color: Colors.textTertiary, fontSize: FontSize.xs },
  options: {
    marginTop: Spacing.xs, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  option: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  optionActive: { backgroundColor: Colors.primary },
  optionText: { fontSize: FontSize.sm, color: Colors.text },
  optionTextActive: { color: Colors.white },
});
