import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  type TouchableOpacityProps, type StyleProp, type ViewStyle,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, loading, variant = 'primary', style, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], (disabled || loading) && styles.disabled, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.primary} />
      ) : (
        <Text style={[styles.text, variant !== 'primary' && styles.secondaryText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  danger: { backgroundColor: Colors.error },
  disabled: { opacity: 0.5 },
  text: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '600' },
  secondaryText: { color: Colors.text },
});
