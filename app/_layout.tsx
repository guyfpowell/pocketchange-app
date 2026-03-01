import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';
import { QueryProvider } from '@/providers/QueryProvider';
import { StripeWrapper } from '@/providers/StripeWrapper';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeWrapper>
        <QueryProvider>
          <BottomSheetModalProvider>
            <StatusBar style="dark" backgroundColor={colors.bg} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(donor)" />
              <Stack.Screen name="recipient/[id]" />
              <Stack.Screen name="donation/[id]" />
            </Stack>
          </BottomSheetModalProvider>
        </QueryProvider>
      </StripeWrapper>
    </GestureHandlerRootView>
  );
}
