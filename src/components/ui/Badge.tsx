import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, fontSize, radius, spacing } from '@/theme';

interface BadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  success: { bg: colors.successBg, text: colors.success },
  warning: { bg: '#FEF9C3', text: '#A16207' },
  error:   { bg: colors.errorBg,   text: colors.error },
  info:    { bg: '#DBEAFE',         text: '#1D4ED8' },
};

export function Badge({ label, variant }: BadgeProps) {
  const { bg, text } = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: font.bold,
    fontSize: fontSize.xs,
    letterSpacing: 0.8,
  },
});
