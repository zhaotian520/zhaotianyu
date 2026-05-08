import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { BGM_LIST, type BGMItem } from '@/constants/bgm';
import type { BGMConfig } from '@/types';

interface Props {
  value: BGMConfig;
  onChange: (bgm: BGMConfig) => void;
}

export function BGMSelector({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);

  const selected = BGM_LIST.find((b) => b.id === value.id);
  const label = selected ? selected.name : value.name;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>背景音乐</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
        <Text style={[styles.selectorText, !selected && styles.placeholder]}>
          {label || '选择背景音乐'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择背景音乐</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.close}>关闭</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={BGM_LIST}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = value.id === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => {
                      onChange({ id: item.id, name: item.name });
                      setVisible(false);
                    }}
                  >
                    <View>
                      <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                    </View>
                    {isSelected && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              style={styles.list}
            />

            <TouchableOpacity
              style={styles.importBtn}
              onPress={() => {
                alert('从本机导入音频（后续实现）');
              }}
            >
              <Text style={styles.importText}>+ 从本机导入音频</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  placeholder: { color: Colors.textTertiary },
  arrow: { color: Colors.textTertiary, fontSize: FontSize.xs },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl, maxHeight: '70%', paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  close: { fontSize: FontSize.md, color: Colors.primary },
  list: { paddingHorizontal: Spacing.lg },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  itemSelected: { backgroundColor: Colors.background },
  itemName: { fontSize: FontSize.md, color: Colors.text },
  itemNameSelected: { color: Colors.primary, fontWeight: '600' },
  itemDesc: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  check: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '700' },
  importBtn: { alignItems: 'center', paddingVertical: Spacing.lg, marginTop: Spacing.sm },
  importText: { color: Colors.primary, fontSize: FontSize.md },
});
