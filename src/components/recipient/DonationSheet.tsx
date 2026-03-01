import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { donationService } from '@/services/donation.service';
import { useInvalidateWallet } from '@/hooks/useWallet';
import { colors, font, fontSize, radius, spacing } from '@/theme';

type SheetState = 'amount' | 'processing' | 'success' | 'error';

interface DonationSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  recipientId: string;
  /** Raw QR token, present when the donor arrived via camera scan. */
  token?: string;
  displayName: string;
}

export function DonationSheet({
  sheetRef,
  recipientId,
  token,
  displayName,
}: DonationSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('amount');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const invalidateWallet = useInvalidateWallet();

  function reset() {
    setSheetState('amount');
    setAmount('');
    setErrorMsg('');
  }

  function close() {
    sheetRef.current?.close();
    setTimeout(reset, 300);
  }

  async function handleDonate() {
    const pence = Math.round(parseFloat(amount) * 100);
    if (isNaN(pence) || pence < 100) return; // minimum £1.00

    setSheetState('processing');
    try {
      if (token) {
        await donationService.donateByToken(token, pence);
      } else {
        await donationService.donateById(recipientId, pence);
      }
      await invalidateWallet();
      setSheetState('success');
    } catch (err) {
      const typed = err as { response?: { data?: { error?: string } } };
      setErrorMsg(
        typed?.response?.data?.error ?? 'Donation failed. Please try again.'
      );
      setSheetState('error');
    }
  }

  const renderBackdrop = useCallback(
    (props: object) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['48%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheetBg}
    >
      <View style={styles.container}>
        {sheetState === 'amount' && (
          <>
            <Text style={styles.title}>Donate to {displayName}</Text>

            <View style={styles.inputRow}>
              <Text style={styles.pound}>£</Text>
              <BottomSheetTextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleDonate}
              />
            </View>
            <Text style={styles.minNote}>Minimum donation £1.00</Text>

            <Button
              label="Donate"
              onPress={handleDonate}
              disabled={!amount || parseFloat(amount) < 1}
              style={styles.btn}
            />
          </>
        )}

        {sheetState === 'processing' && (
          <View style={styles.centred}>
            <Spinner size="large" color={colors.teal} />
            <Text style={styles.processingText}>Sending donation…</Text>
          </View>
        )}

        {sheetState === 'success' && (
          <View style={styles.centred}>
            <View style={styles.successCircle}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Donation sent!</Text>
            <Text style={styles.successSub}>
              Thank you for making a difference.
            </Text>
            <Button label="Done" onPress={close} style={styles.btn} />
          </View>
        )}

        {sheetState === 'error' && (
          <View style={styles.centred}>
            <Text style={styles.errorTitle}>Donation failed</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <View style={styles.errorBtns}>
              <Button
                label="Try Again"
                onPress={() => setSheetState('amount')}
                style={styles.halfBtn}
              />
              <Button
                label="Cancel"
                onPress={close}
                style={styles.halfBtn}
              />
            </View>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.white,
  },
  handle: {
    backgroundColor: colors.border,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontFamily: font.bold,
    fontSize: fontSize.md,
    color: colors.teal,
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.input,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  pound: {
    fontFamily: font.bold,
    fontSize: fontSize.xl,
    color: colors.teal,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontFamily: font.bold,
    fontSize: fontSize.xl,
    color: colors.teal,
    paddingVertical: spacing.md,
  },
  minNote: {
    fontFamily: font.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  btn: {
    marginTop: spacing.sm,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  processingText: {
    fontFamily: font.medium,
    fontSize: fontSize.sm,
    color: colors.teal,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheck: {
    fontSize: 28,
    color: colors.success,
    fontFamily: font.bold,
  },
  successTitle: {
    fontFamily: font.bold,
    fontSize: fontSize.md,
    color: colors.teal,
  },
  successSub: {
    fontFamily: font.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  errorTitle: {
    fontFamily: font.bold,
    fontSize: fontSize.md,
    color: colors.error,
  },
  errorMsg: {
    fontFamily: font.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  errorBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  halfBtn: {
    flex: 1,
  },
});
