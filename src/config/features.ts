/**
 * Feature flags for the PocketChange app.
 *
 * Some features require a custom dev build and are not available in Expo Go.
 * Toggle them by setting the corresponding env var in your .env.local file.
 */
export const features = {
  /**
   * Stripe in-app wallet top-up (initPaymentSheet / presentPaymentSheet).
   *
   * Requires: custom dev build — @stripe/stripe-react-native uses native modules
   *           that are NOT included in the Expo Go app.
   *
   * To enable: add  EXPO_PUBLIC_STRIPE_ENABLED=true  to .env.local and run a
   *            custom build via `npm run ios` or `npm run android`.
   *
   * In Expo Go this is always false; the Top Up sheet shows an informational
   * message instead of the Stripe payment UI.
   */
  stripePayments: process.env.EXPO_PUBLIC_STRIPE_ENABLED === 'true',
} as const;
