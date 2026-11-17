import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable } from 'react-native';
import { AdminGate, AppText, PlaceForm, Screen, SectionHeader } from '@/components';
import { getCategory } from '@/data/categories';
import { uniqueId, type PlaceInput } from '@/data/placeForm';
import { usePlaces } from '@/data/placesStore';
import { colors } from '@/theme';

export default function NewPlaceScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { places, addPlace } = usePlaces();
  const initialCategory = category ? getCategory(category)?.key : undefined;

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/admin'));

  const save = (place: PlaceInput) => {
    const id = uniqueId(place.title, places.map((p) => p.id));
    addPlace({ ...place, id });
    Alert.alert('Lugar agregado', `${place.title} ya aparece en la app.`);
    goBack();
  };

  return (
    <AdminGate>
      <Screen>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Volver" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <AppText style={{ color: colors.primary }}>Volver</AppText>
        </Pressable>
        <SectionHeader eyebrow="Administración" title="Agregar lugar" />
        <PlaceForm initial={initialCategory ? { category: initialCategory } : undefined} onSubmit={save} />
      </Screen>
    </AdminGate>
  );
}
