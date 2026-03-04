import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors, font, fontSize, radius, spacing, tracking } from '@/theme';

interface ShortCodeInputProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

/** Formats a raw 6-char alphanumeric string as "XXX-XXX" for display. */
function format(raw: string): string {
  const chars = raw.toUpperCase().slice(0, 6);
  if (chars.length <= 3) return chars;
  return `${chars.slice(0, 3)}-${chars.slice(3)}`;
}

export function ShortCodeInput({ onSubmit, isLoading = false, error }: ShortCodeInputProps) {
  // raw holds only the digits (max 6)
  const [raw, setRaw] = useState('');
  const inputRef = useRef<TextInput>(null);

  const displayValue = format(raw);
  const isComplete = raw.length === 6;

  function handleChange(text: string) {
    // Strip dashes (auto-inserted for display), uppercase, cap at 6
    const chars = text.replace(/-/g, '').toUpperCase().slice(0, 6);
    setRaw(chars);
  }

  function handleSubmit() {
    if (!isComplete) return;
    onSubmit(raw);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Enter 6-character code</Text>
      <Text style={styles.hint}>
        Found on the recipient's PocketChange badge.
      </Text>

      {/* Tappable display that opens the hidden TextInput */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[styles.display, error && styles.displayError]}
      >
        {/* Render the formatted code character by character with the dash */}
        {displayValue.length === 0 ? (
          <Text style={styles.placeholder}>XXX-XXX</Text>
        ) : (
          <Text style={styles.code}>{displayValue}</Text>
        )}
        {/* Blinking cursor indicator */}
        {raw.length < 6 && (
          <View style={styles.cursor} />
        )}
      </Pressable>

      {/* Hidden TextInput that actually captures input */}
      <TextInput
        ref={inputRef}
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="default"
        autoCapitalize="characters"
        maxLength={7} // 6 chars + 1 dash shown
        style={styles.hiddenInput}
        caretHidden
        onSubmitEditing={handleSubmit}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        label="Find Recipient"
        onPress={handleSubmit}
        disabled={!isComplete}
        loading={isLoading}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  label: {
    fontFamily: font.bold,
    fontSize: fontSize.md,
    color: colors.teal,
    letterSpacing: tracking.heading,
  },
  hint: {
    fontFamily: font.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  display: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  displayError: {
    borderColor: colors.error,
  },
  placeholder: {
    fontFamily: font.bold,
    fontSize: 32,
    color: colors.textMuted,
    letterSpacing: 8,
  },
  code: {
    fontFamily: font.bold,
    fontSize: 32,
    color: colors.teal,
    letterSpacing: 8,
  },
  cursor: {
    width: 2,
    height: 34,
    backgroundColor: colors.teal,
    opacity: 0.8,
    marginLeft: 2,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  error: {
    fontFamily: font.regular,
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: -spacing.sm,
  },
  btn: {
    marginTop: spacing.xs,
  },
});
