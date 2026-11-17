import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable } from 'react-native';
import { AdminGate, AppText, Button, EmptyState, PlaceForm, Screen, SectionHeader } from '@/components';
import { confirmRemovePlace } from '@/data/admin';
import type { PlaceInput } from '@/data/placeForm';
import { usePlace, usePlaces } from '@/data/placesStore';
import { colors } from '@/theme';

export default function EditPlaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready, updatePlace, removePlace } = usePlaces();
  const place = usePlace(id);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/admin'));

  // El id no cambia al editar el nombre, para no romper enlaces existentes.
  const save = (changes: PlaceInput) => {
    if (!place) return;
    updatePlace(place.id, changes);
    Alert.alert('Cambios guardados', `${changes.title} se actualizó en la app.`);
    goBack();
  };

  const remove = () => {
    if (!place) return;
    confirmRemovePlace(place, () => {
      goBack();
      removePlace(place.id);
    });
  };

  const back = (
    <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Volver" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
      <Ionicons name="chevron-back" size={20} color={colors.primary} />
      <AppText style={{ color: colors.primary }}>Volver</AppText>
    </Pressable>
  );

  return (
    <AdminGate>
      <Screen>
        {back}
        {place ? (
          <>
            <SectionHeader eyebrow="Administración" title="Editar lugar" />
            <PlaceForm initial={place} onSubmit={save} submitLabel="Guardar cambios" />
            <Button label="Eliminar lugar" icon="trash-outline" variant="danger" onPress={remove} />
          </>
        ) : ready ? (
          <>
            <EmptyState message="Este lugar no existe o ya fue eliminado." />
            <Button label="Volver" onPress={goBack} />
          </>
        ) : null}
      </Screen>
    </AdminGate>
  );
}
