import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, PropertyInfo } from '@/types';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useFormStore } from '@/stores/formStore';
import { validatePropertyInfo } from '@/utils/validation';
import { PropertyTypeSelector } from '@/components/forms/PropertyTypeSelector';
import { VideoUploader } from '@/components/forms/VideoUploader';
import { CoverUploader } from '@/components/forms/CoverUploader';
import { BGMSelector } from '@/components/forms/BGMSelector';
import { SpeedSelector } from '@/components/forms/SpeedSelector';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { Button } from '@/components/common/Button';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const {
    propertyType, propertyInfo, videoUri, coverUri, bgm, speechRate,
    setPropertyType, setPropertyInfo, setVideoUri, setCoverUri, setBgm, setSpeechRate,
  } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStart = () => {
    const result = validatePropertyInfo(propertyInfo, videoUri);
    setErrors(result.errors);
    if (result.isValid) {
      navigation.navigate('Processing');
    }
  };

  const handleReset = () => {
    useFormStore.getState().reset();
    setErrors({});
  };

  const handleInfoChange = (info: Partial<PropertyInfo>) => {
    setPropertyInfo(info);
    if (errors[Object.keys(info)[0]]) {
      setErrors({});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>房产视频智能剪辑</Text>
          <Text style={styles.subtitle}>一键生成专业营销视频</Text>
        </View>

        <PropertyTypeSelector value={propertyType} onChange={setPropertyType} />

        <VideoUploader value={videoUri} onChange={setVideoUri} />
        {errors.video ? <Text style={styles.errorText}>{errors.video}</Text> : null}

        <CoverUploader value={coverUri} onChange={setCoverUri} />

        <BGMSelector value={bgm} onChange={setBgm} />

        <SpeedSelector value={speechRate} onChange={setSpeechRate} />

        <PropertyForm
          values={propertyInfo}
          errors={errors}
          onChange={handleInfoChange}
        />

        <View style={styles.buttonRow}>
          <Button title="开始生成视频" onPress={handleStart} />
          <View style={styles.buttonSpacing} />
          <Button title="重置" variant="secondary" onPress={handleReset} />
          <View style={styles.buttonSpacing} />
          <Button title="设置" variant="secondary" onPress={() => navigation.navigate('Settings')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', paddingVertical: Spacing.xxl },
  title: { fontSize: FontSize.title, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  errorText: { color: Colors.error, fontSize: FontSize.xs, marginTop: -Spacing.sm, marginBottom: Spacing.sm },
  buttonRow: { marginTop: Spacing.xl },
  buttonSpacing: { height: Spacing.sm },
});
