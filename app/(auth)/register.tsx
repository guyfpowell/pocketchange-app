/**
 * Register — placeholder screen for Phase 1.
 * Full implementation in Phase 2.
 */
import { StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { colors, font, fontSize, spacing, tracking } from '@/theme';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo size={72} />
      <Text style={styles.heading}>CREATE ACCOUNT</Text>
      <Text style={styles.note}>Phase 1 scaffold — register coming in Phase 2</Text>
      <Button label="Back to Sign In" variant="outline" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: fontSize.lg,
    color: colors.teal,
    letterSpacing: tracking.heading,
  },
  note: {
    fontFamily: font.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
