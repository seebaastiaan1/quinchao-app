import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { AppText, Button, Screen } from '@/components';
import { callPlace, openDirections } from '@/data/actions';
import { getPlace } from '@/data/places';
import { colors, radius, spacing } from '@/theme';

export default function PlaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id);

  if (!place) {
    return (
      <Screen>
        <AppText variant="heading">Lugar no encontrado</AppText>
        <Button label="Volver" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>Volver</AppText>
      </Pressable>

      <Image source={{ uri: place.image }} style={{ width: '100%', height: 220, borderRadius: radius.lg, backgroundColor: colors.mist }} />

      <View style={{ gap: spacing.xs }}>
        <AppText variant="eyebrow">{place.tag} · {place.area}</AppText>
        <AppText variant="title">{place.title}</AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {place.address && (
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Ionicons name="location-outline" size={18} color={colors.turquoise} />
            <AppText style={{ flex: 1 }}>{place.address}</AppText>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Ionicons name="time-outline" size={18} color={colors.turquoise} />
          <AppText style={{ flex: 1 }}>{place.note}</AppText>
        </View>
      </View>

      <AppText>{place.description}</AppText>

      {/* Pantalla 10 "Contacto": acciones directas */}
      <View style={{ gap: spacing.sm }}>
        {place.phone && <Button label={`Llamar · ${place.phone}`} icon="call-outline" onPress={() => callPlace(place.phone)} />}
        <Button label="Cómo llegar" icon="navigate-outline" variant={place.phone ? 'outline' : 'primary'} onPress={() => openDirections(place)} />
        <Button
          label="Ver en el mapa"
          icon="map-outline"
          variant="outline"
          onPress={() => router.push({ pathname: '/map', params: { focus: place.id } })}
        />
      </View>
    </Screen>
  );
}
