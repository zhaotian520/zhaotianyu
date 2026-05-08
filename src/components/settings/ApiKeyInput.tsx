import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';

export function ApiKeyInput() {
  const { glmApiKey, setGlmApiKey, clearApiKey } = useSettingsStore();
  const [secure, setSecure] = useState(true);
  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    Alert.alert('已保存', 'API Key 已加密存储');
  };

  const handleTest = async () => {
    if (!glmApiKey) {
      Alert.alert('提示', '请先输入 API Key');
      return;
    }
    setTesting(true);
    try {
      const res = await fetch(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${glmApiKey}`,
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: [{ role: 'user', content: '回复"连接成功"' }],
            max_tokens: 10,
          }),
        }
      );
      if (res.ok) {
        Alert.alert('测试通过', 'API Key 有效');
      } else {
        Alert.alert('测试失败', `HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (e) {
      Alert.alert('测试失败', '网络连接失败，请检查网络');
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    Alert.alert('确认清除', '将删除自定义 API Key，恢复内置密钥', [
      { text: '取消', style: 'cancel' },
      { text: '清除', style: 'destructive', onPress: clearApiKey },
    ]);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>API 配置</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={glmApiKey}
          onChangeText={setGlmApiKey}
          placeholder="输入智谱 API Key（留空使用内置）"
          placeholderTextColor={Colors.textTertiary}
          secureTextEntry={secure}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
          <Text style={styles.eyeIcon}>{secure ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>保存</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, testing && styles.btnDisabled]}
          onPress={handleTest}
          disabled={testing}
        >
          <Text style={styles.btnText}>{testing ? '测试中...' : '测试连接'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleClear}>
          <Text style={styles.btnText}>清除</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        使用智谱 AI GLM-4-Flash 模型（免费额度）。留空使用内置 API Key。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.sm,
    color: Colors.text, backgroundColor: Colors.background,
  },
  eyeBtn: { padding: Spacing.sm, marginLeft: Spacing.xs },
  eyeIcon: { fontSize: 20 },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  btn: {
    flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnDanger: { backgroundColor: Colors.error },
  btnText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '500' },
  hint: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.sm, lineHeight: 18 },
});
