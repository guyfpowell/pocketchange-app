import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, font, fontSize, radius, spacing, tracking } from '@/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'outline';
  loading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        pressed && !isDisabled && (isPrimary ? styles.primaryPressed : styles.outlinePressed),
        isDisabled && styles.disabled,
        style as object,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.white : colors.teal}
        />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary ? styles.labelPrimary : styles.labelOutline,
          ]}
        >
          {label.toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: colors.teal,
  },
  primaryPressed: {
    backgroundColor: colors.tealDark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.teal,
  },
  outlinePressed: {
    backgroundColor: colors.teal + '15',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: font.bold,
    fontSize: fontSize.sm,
    letterSpacing: tracking.heading,
  },
  labelPrimary: {
    color: colors.white,
  },
  labelOutline: {
    color: colors.teal,
  },
});
