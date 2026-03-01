/**
 * Donor Dashboard — placeholder for Phase 1.
 * Full wallet implementation in Phase 3.
 */
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, font, fontSize, spacing, tracking } from '@/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>DASHBOARD</Text>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>WALLET BALANCE</Text>
          <Text style={styles.balance}>£0.00</Text>
          <Button label="Top Up" style={styles.btn} />
        </Card>

        <Text style={styles.note}>Phase 1 scaffold — wallet coming in Phase 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: fontSize.lg,
    color: colors.teal,
    letterSpacing: tracking.heading,
  },
  card: {
    gap: spacing.sm,
  },
  cardLabel: {
    fontFamily: font.bold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: tracking.heading,
  },
  balance: {
    fontFamily: font.bold,
    fontSize: fontSize.xxl,
    color: colors.teal,
  },
  btn: {
    alignSelf: 'flex-start',
  },
  note: {
    fontFamily: font.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
