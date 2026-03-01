/**
 * Root index — redirects to sign-in for now.
 * Phase 2 will replace this with an auth gate that checks stored tokens
 * and routes to either (donor)/index or (auth)/sign-in.
 */
import { Redirect } from 'expo-router';

export default function Root() {
  return <Redirect href="/(auth)/sign-in" />;
}
