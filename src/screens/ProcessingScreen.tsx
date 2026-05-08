import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useProcessingStore } from '@/stores/processingStore';
import { StepIndicator } from '@/components/processing/StepIndicator';
import { ProgressBar } from '@/components/processing/ProgressBar';
import { ResultPreview } from '@/components/processing/ResultPreview';
import { useVideoProcessing } from '@/hooks/useVideoProcessing';
import { PIPELINE_STEPS } from '@/constants/pipeline';

export default function ProcessingScreen() {
  const { status, progress, currentStep, error, resultUri, script } = useProcessingStore();
  const { runPipeline, cancel, retry, goHome } = useVideoProcessing();

  useEffect(() => {
    runPipeline();
  }, []);

  if (status === 'completed' && resultUri) {
    return (
      <SafeAreaView style={styles.container}>
        <ResultPreview videoUri={resultUri} script={script} onBack={goHome} />
      </SafeAreaView>
    );
  }

  if (status === 'failed' || status === 'cancelled') {
    const isFail = status === 'failed';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusIcon, isFail && styles.errorIcon]}>
            {isFail ? '❌' : '⏹️'}
          </Text>
          <Text style={[styles.statusText, isFail && styles.errorText]}>
            {isFail ? '处理失败' : '已取消'}
          </Text>
          {isFail && error ? (
            <Text style={styles.errorDetail}>{error}</Text>
          ) : null}
          <View style={styles.btnRow}>
            {isFail ? (
              <TouchableOpacity style={styles.button} onPress={retry}>
                <Text style={styles.buttonText}>重试</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={runPipeline}>
                <Text style={styles.buttonText}>重新制作</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={goHome}>
              <Text style={[styles.buttonText, styles.secondaryText]}>返回首页</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentLabel = currentStep < PIPELINE_STEPS.length
    ? PIPELINE_STEPS[currentStep].label
    : '处理中...';

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar progress={progress} label={currentLabel} />
      <StepIndicator currentStep={currentStep} />
      <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={cancel}>
        <Text style={[styles.buttonText, styles.cancelText]}>取消处理</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statusContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  statusIcon: { fontSize: 48, marginBottom: Spacing.lg },
  errorIcon: {},
  statusText: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  errorText: { color: Colors.error },
  errorDetail: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 20 },
  btnRow: { width: '100%', gap: Spacing.sm, marginTop: Spacing.lg },
  button: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  secondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  buttonText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '600' },
  secondaryText: { color: Colors.text },
  cancelBtn: { margin: Spacing.lg, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.error },
  cancelText: { color: Colors.error },
});
