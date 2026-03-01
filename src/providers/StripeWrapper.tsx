import type { ReactNode } from 'react';
import { features } from '@/config/features';

// Conditionally require the Stripe native module at module-load time.
// Using `require` (not `import`) means Metro only loads the native bindings
// when stripePayments is true — safe to use in Expo Go when false.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeProviderNative = features.stripePayments
  ? (require('@stripe/stripe-react-native').StripeProvider as React.ComponentType<{
      publishableKey: string;
      merchantIdentifier?: string;
      children: ReactNode;
    }>)
  : null;

/**
 * Wraps children in Stripe's StripeProvider only when the stripePayments
 * feature flag is enabled. In Expo Go (flag off) this is a transparent wrapper.
 */
export function StripeWrapper({ children }: { children: ReactNode }) {
  if (!StripeProviderNative) {
    return <>{children}</>;
  }

  return (
    <StripeProviderNative
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
      merchantIdentifier="merchant.org.pocketchange.app"
    >
      {children}
    </StripeProviderNative>
  );
}
