import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// This hook will protect the route access based on user authentication
function useProtectedRoute(isAuthenticated: boolean | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === null) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments]);
}

export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return unsubscribe;
    }, []);

    useProtectedRoute(isAuthenticated);

    if (isAuthenticated === null) {
        return null; // Or a loading screen
    }

    return (
        <SafeAreaProvider>
            <Stack 
                screenOptions={{ 
                    headerShown: false,
                    contentStyle: { backgroundColor: '#121212' }
                }}
            >
                <Stack.Screen 
                    name="(auth)" 
                    options={{ 
                        headerShown: false,
                        gestureEnabled: false 
                    }} 
                />
                <Stack.Screen 
                    name="(tabs)" 
                    options={{ 
                        headerShown: false,
                        gestureEnabled: false 
                    }} 
                />
            </Stack>
        </SafeAreaProvider>
    );
}