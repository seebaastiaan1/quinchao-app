import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { OfflineBanner } from '@/components';
import { AdminSessionProvider } from '@/data/adminSession';
import { PlacesProvider } from '@/data/placesStore';
import { OfflineProvider, useOffline } from '@/offline';

SplashScreen.preventAutoHideAsync();

// Sin conexión se muestra un aviso arriba. El aviso ya ocupa el margen superior seguro (notch),
// así que a las pantallas se les entrega top: 0 para que no dejen ese espacio dos veces.
function AppShell() {
  const insets = useSafeAreaInsets();
  const { isOnline } = useOffline();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isOnline ? 'dark' : 'light'} />
      <OfflineBanner />
      <SafeAreaInsetsContext.Provider value={isOnline ? insets : { ...insets, top: 0 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="category/[key]" />
          <Stack.Screen name="place/[id]" />
          <Stack.Screen name="admin/index" />
          <Stack.Screen name="admin/new" />
          <Stack.Screen name="admin/edit/[id]" />
        </Stack>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      {/* PlacesProvider va por fuera: el paquete sin conexión descarga las fotos de los lugares del store */}
      <PlacesProvider>
        <AdminSessionProvider>
          <OfflineProvider>
            <AppShell />
          </OfflineProvider>
        </AdminSessionProvider>
      </PlacesProvider>
    </SafeAreaProvider>
  );
}
