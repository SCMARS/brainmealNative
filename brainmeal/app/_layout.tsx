
import { useEffect } from 'react';
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { Slot, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    // Add your custom fonts here
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}