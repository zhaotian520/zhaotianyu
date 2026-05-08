import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  videoUri: string;
  script: string;
  onBack: () => void;
}

export function ResultPreview({ videoUri, script, onBack }: Props) {
  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(videoUri, { mimeType: 'video/mp4' });
      } else {
        Alert.alert('提示', '当前设备不支持分享');
      }
    } catch {
      Alert.alert('分享失败', '无法分享视频');
    }
  };

  const handleViewScript = () => {
    Alert.alert('AI 文案', script);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>处理完成！</Text>
      <Text style={styles.subtitle}>视频已生成，可分享或查看文案</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>分享视频</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleViewScript}>
          <Text style={[styles.buttonText, styles.secondaryText]}>查看文案</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onBack}>
          <Text style={[styles.buttonText, styles.secondaryText]}>返回首页</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: Spacing.lg, alignItems: 'center' },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.success },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.xxl },
  buttonRow: { width: '100%', gap: Spacing.sm },
  button: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  secondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  buttonText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '600' },
  secondaryText: { color: Colors.text },
});
