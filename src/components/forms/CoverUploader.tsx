import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export function CoverUploader({ value, onChange }: Props) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('需要相册权限才能选择封面图');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>封面图（可选）</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.thumbnail} />
            <Text style={styles.changeText}>点击更换封面</Text>
          </View>
        ) : (
          <>
            <Text style={styles.icon}>🖼️</Text>
            <Text style={styles.uploadText}>点击选择封面图</Text>
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
    padding: Spacing.lg, alignItems: 'center', justifyContent: 'center',
    minHeight: 80,
  },
  icon: { fontSize: 28 },
  uploadText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  previewContainer: { alignItems: 'center' },
  thumbnail: { width: 200, height: 112, borderRadius: BorderRadius.sm, backgroundColor: Colors.background },
  changeText: { fontSize: FontSize.sm, color: Colors.primary, marginTop: Spacing.xs },
});
