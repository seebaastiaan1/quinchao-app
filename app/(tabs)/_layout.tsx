import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { colors, fonts } from '@/theme';
import type { IconName } from '@/data/types';

const tab = (title: string, icon: IconName) => ({
  title,
  // Desde SDK 58 el color puede llegar como ColorValue (incluye null): se usa el gris de inactivo como respaldo
  tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={icon} size={size} color={typeof color === 'string' ? color : colors.muted} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.line, backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen name="index" options={tab('Inicio', 'compass-outline')} />
      <Tabs.Screen name="explore" options={tab('Explorar', 'search-outline')} />
      <Tabs.Screen name="map" options={tab('Mapa', 'map-outline')} />
      <Tabs.Screen name="info" options={tab('Información', 'information-circle-outline')} />
    </Tabs>
  );
}
