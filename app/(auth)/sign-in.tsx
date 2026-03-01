/**
 * Sign In — placeholder screen for Phase 1.
 * Full implementation in Phase 2.
 */
import { StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { colors, font, fontSize, spacing, tracking } from '@/theme';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo size={96} />

      <Text style={styles.heading}>POCKET CHANGE</Text>
      <Text style={styles.sub}>Making every penny count</Text>

      <View style={styles.actions}>
        <Button
          label="Sign In"
          onPress={() => router.replace('/(donor)/')}
        />
        <Button
          label="Create Account"
          variant="outline"
          onPress={() => router.push('/(auth)/register')}
        />
      </View>

      <Text style={styles.note}>Phase 1 scaffold — auth coming in Phase 2</Text>
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
    fontSize: fontSize.xl,
    color: colors.teal,
    letterSpacing: tracking.heading,
    marginTop: spacing.md,
  },
  sub: {
    fontFamily: font.regular,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  note: {
    fontFamily: font.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
