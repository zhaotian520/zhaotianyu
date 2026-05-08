import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import type { PropertyType } from '@/types';

const TYPES: PropertyType[] = ['租赁', '二手买卖', '新房买卖'];

export function PromptEditor() {
  const { prompts, updatePrompt, resetPrompts } = useSettingsStore();
  const [activeType, setActiveType] = useState<PropertyType>('二手买卖');
  const [dirty, setDirty] = useState(false);

  const handleReset = () => {
    Alert.alert('恢复默认', '将重置 Prompt 模板为默认值？', [
      { text: '取消', style: 'cancel' },
      { text: '恢复', style: 'destructive', onPress: () => { resetPrompts(); setDirty(false); } },
    ]);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Prompt 模板编辑</Text>

      <View style={styles.tabRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeType === t && styles.tabActive]}
            onPress={() => setActiveType(t)}
          >
            <Text style={[styles.tabText, activeType === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textarea}
        value={prompts[activeType]}
        onChangeText={(v) => { updatePrompt(activeType, v); setDirty(true); }}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        placeholder="输入 Prompt 模板..."
        placeholderTextColor={Colors.textTertiary}
      />

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, !dirty && styles.btnDisabled]}
          disabled={!dirty}
          onPress={() => { setDirty(false); Alert.alert('已保存', 'Prompt 模板已保存'); }}
        >
          <Text style={styles.btnText}>保存 Prompt 模板</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleReset}>
          <Text style={styles.btnText}>恢复默认</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  tabRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center', backgroundColor: Colors.background },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.text },
  tabTextActive: { color: Colors.white },
  textarea: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    padding: Spacing.md, fontSize: FontSize.sm, color: Colors.text, backgroundColor: Colors.background,
    minHeight: 160, lineHeight: 20,
  },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  btn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnDanger: { backgroundColor: Colors.error },
  btnText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '500' },
});
