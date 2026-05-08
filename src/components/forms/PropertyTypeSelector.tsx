import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import type { PropertyType } from '@/types';

const TYPES: { key: PropertyType; label: string }[] = [
  { key: '租赁', label: '租赁' },
  { key: '二手买卖', label: '二手买卖' },
  { key: '新房买卖', label: '新房买卖' },
];

interface Props {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

export function PropertyTypeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {TYPES.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[styles.btn, value === t.key && styles.btnActive]}
          onPress={() => onChange(t.key)}
        >
          <Text style={[styles.btnText, value === t.key && styles.btnTextActive]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  btn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
    alignItems: 'center',
  },
  btnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  btnText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  btnTextActive: { color: Colors.white },
});
