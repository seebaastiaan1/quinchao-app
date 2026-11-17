import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AdminSessionProvider } from '@/data/adminSession';
import { PlacesProvider } from '@/data/placesStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <PlacesProvider>
        <AdminSessionProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="category/[key]" />
            <Stack.Screen name="place/[id]" />
            <Stack.Screen name="admin/index" />
            <Stack.Screen name="admin/new" />
            <Stack.Screen name="admin/edit/[id]" />
          </Stack>
        </AdminSessionProvider>
      </PlacesProvider>
    </SafeAreaProvider>
  );
}
