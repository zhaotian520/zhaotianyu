import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {message ? <Text style={styles.text}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  box: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.xxl,
    alignItems: 'center',
    minWidth: 160,
  },
  text: { fontSize: FontSize.sm, color: Colors.text, marginTop: Spacing.md },
});
