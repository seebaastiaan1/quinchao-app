import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, PlaceImage, Screen } from '@/components';
import { callPlace, openDirections } from '@/data/actions';
import { cleanPhone, cleanText, hasValidLocation } from '@/data/availability';
import { usePlace, usePlaces } from '@/data/placesStore';
import { useOffline } from '@/offline';
import { colors, radius, spacing } from '@/theme';

export default function PlaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready } = usePlaces();
  const place = usePlace(id);
  const { isOnline } = useOffline();

  if (!place && !ready) return <Screen>{null}</Screen>;

  if (!place) {
    return (
      <Screen>
        <AppText variant="heading">Lugar no encontrado</AppText>
        <Button label="Volver" onPress={() => router.back()} />
      </Screen>
    );
  }

  const tag = cleanText(place.tag);
  const area = cleanText(place.area);
  const title = cleanText(place.title) ?? 'Información no disponible';
  const note = cleanText(place.note);
  const description = cleanText(place.description);
  const address = cleanText(place.address);
  const phone = cleanPhone(place.phone);
  const locationConfirmed = hasValidLocation(place);

  return (
    <Screen>
      <View style={styles.backRow}>
        <Button label="Volver" icon="chevron-back-outline" variant="outline" onPress={() => router.back()} />
      </View>

      <PlaceImage image={place.image} style={{ width: '100%', height: 220, borderRadius: radius.lg, backgroundColor: colors.mist }} />

      <View style={{ gap: spacing.xs }}>
        {(tag || area) && <AppText variant="eyebrow">{[tag, area].filter(Boolean).join(' · ')}</AppText>}
        <AppText variant="title">{title}</AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {locationConfirmed && address ? (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={colors.turquoise} />
            <AppText style={{ flex: 1 }}>{address}</AppText>
          </View>
        ) : (
          <View style={[styles.row, styles.unconfirmed]}>
            <Ionicons name="location-outline" size={18} color={colors.danger} />
            <AppText style={{ flex: 1, color: colors.danger }}>Ubicación no confirmada</AppText>
          </View>
        )}
        {note && (
          <View style={styles.row}>
            <Ionicons name="time-outline" size={18} color={colors.turquoise} />
            <AppText style={{ flex: 1 }}>{note}</AppText>
          </View>
        )}
      </View>

      <AppText>{description ?? 'Información no disponible'}</AppText>

      <View style={{ gap: spacing.sm }}>
        {phone && <Button label={`Llamar · ${phone}`} icon="call-outline" onPress={() => callPlace(phone)} />}
        {locationConfirmed && (
          <Button label="Cómo llegar" icon="navigate-outline" variant={phone ? 'outline' : 'primary'} onPress={() => openDirections(place)} />
        )}
        {locationConfirmed && (
          <Button
            label="Ver en el mapa"
            icon="map-outline"
            variant="outline"
            onPress={() => router.push({ pathname: '/map', params: { focus: place.id } })}
          />
        )}
        {!phone && <AppText variant="small" style={{ color: colors.muted }}>Contacto no disponible</AppText>}
        {!isOnline && (
          <AppText variant="small">Sin conexión: el mapa y las indicaciones necesitan internet.{phone ? ' Llamar funciona sin internet.' : ''}</AppText>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backRow: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  unconfirmed: { backgroundColor: colors.sea, borderRadius: radius.md, padding: spacing.sm },
});
