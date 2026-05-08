import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Input } from '@/components/common/Input';
import type { PropertyInfo } from '@/types';

interface Props {
  values: PropertyInfo;
  errors: Record<string, string>;
  onChange: (info: Partial<PropertyInfo>) => void;
}

export function PropertyForm({ values, errors, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>房源信息</Text>

      <Input
        label="小区名称 *"
        value={values.communityName}
        onChangeText={(v) => onChange({ communityName: v })}
        placeholder="请输入小区名称"
        error={errors.communityName}
      />

      <Input
        label="面积（㎡）*"
        value={values.area}
        onChangeText={(v) => onChange({ area: v })}
        placeholder="请输入面积"
        keyboardType="numeric"
        error={errors.area}
      />

      <Input
        label="朝向"
        value={values.orientation}
        onChangeText={(v) => onChange({ orientation: v })}
        placeholder="如：南北通透"
      />

      <Input
        label="价格 *"
        value={values.price}
        onChangeText={(v) => onChange({ price: v })}
        placeholder="请输入价格"
        keyboardType="numeric"
        error={errors.price}
      />

      <Input
        label="亮点"
        value={values.highlights}
        onChangeText={(v) => onChange({ highlights: v })}
        placeholder="输入房源亮点，用逗号分隔"
        multiline
        numberOfLines={3}
        style={{ minHeight: 72, textAlignVertical: 'top' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
});
