import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, fonts } from '@/theme';
import type { IconName } from '@/data/types';

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={icon} size={size} color={color} />,
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
