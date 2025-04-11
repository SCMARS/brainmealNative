import { Stack } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function RootLayout() {
  const { user } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            {!user ? (
              <Stack.Screen name="(auth)" />
            ) : (
              <Stack.Screen name="(tabs)" />
            )}
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}