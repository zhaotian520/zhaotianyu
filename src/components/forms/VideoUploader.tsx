import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export function VideoUploader({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('需要相册权限才能选择视频');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>房源视频 *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickVideo} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.thumbnail} />
            <Text style={styles.changeText}>点击更换视频</Text>
          </View>
        ) : (
          <>
            <Text style={styles.icon}>🎬</Text>
            <Text style={styles.uploadText}>点击选择视频</Text>
            <Text style={styles.hint}>支持 MP4、MOV 格式</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  uploadBox: {
    borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: BorderRadius.md, backgroundColor: Colors.card,
    padding: Spacing.xxl, alignItems: 'center', justifyContent: 'center',
    minHeight: 120,
  },
  icon: { fontSize: 32 },
  uploadText: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.sm },
  hint: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.xs },
  previewContainer: { alignItems: 'center' },
  thumbnail: { width: 200, height: 120, borderRadius: BorderRadius.sm, backgroundColor: Colors.background },
  changeText: { fontSize: FontSize.sm, color: Colors.primary, marginTop: Spacing.sm },
});
