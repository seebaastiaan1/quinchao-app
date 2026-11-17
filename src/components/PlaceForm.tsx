import { useMemo, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, View, type KeyboardTypeOptions } from 'react-native';
import { categories } from '@/data/categories';
import { draftToPlace, placeToDraft, validatePlace, type PlaceDraft, type PlaceErrors, type PlaceInput } from '@/data/placeForm';
import { usePlaces } from '@/data/placesStore';
import { sectorsOf } from '@/data/sectors';
import type { Place } from '@/data/types';
import { colors, fonts, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Pill } from './Pill';
import { TextField } from './TextField';

// iOS no tiene signo "-" en el teclado decimal; las coordenadas de Chile son negativas.
const COORDINATE_KEYBOARD: KeyboardTypeOptions = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';

// Formulario de lugar compartido por "Agregar" y "Editar".
export function PlaceForm({ initial, onSubmit, submitLabel = 'Guardar' }: {
  initial?: Partial<Place>;
  onSubmit: (place: PlaceInput) => void;
  submitLabel?: string;
}) {
  const { places } = usePlaces();
  const sectors = useMemo(() => sectorsOf(places), [places]);
  const [draft, setDraft] = useState<PlaceDraft>(() => placeToDraft(initial));
  const [customArea, setCustomArea] = useState(() => !!initial?.area && !sectorsOf(places).includes(initial.area));
  const [errors, setErrors] = useState<PlaceErrors>({});
  const localImage = typeof initial?.image === 'number' ? initial.image : undefined;

  const set = <K extends keyof PlaceDraft>(field: K, value: PlaceDraft[K]) => {
    setDraft((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const chooseSector = (sector: string | null) => {
    setCustomArea(sector === null);
    set('area', sector ?? '');
  };

  const setImageUrl = (text: string) => set('image', text === '' && localImage !== undefined ? localImage : text);

  const submit = () => {
    const found = validatePlace(draft);
    setErrors(found);
    const place = draftToPlace(draft);
    if (place) onSubmit(place);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const preview = typeof draft.image === 'number' ? draft.image : /^https:\/\/\S+$/.test(draft.image.trim()) ? { uri: draft.image.trim() } : null;

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={styles.group}>
        <AppText style={styles.label}>Categoría</AppText>
        <View style={styles.pills}>
          {categories.map((c) => (
            <Pill key={c.key} label={c.label} icon={c.icon} active={draft.category === c.key} onPress={() => set('category', c.key)} />
          ))}
        </View>
        {errors.category ? <AppText variant="small" style={styles.error}>{errors.category}</AppText> : null}
      </View>

      <TextField label="Nombre" value={draft.title} onChangeText={(t) => set('title', t)} error={errors.title} placeholder="Ej.: Cocinería El Fogón Isleño" />

      <View style={styles.group}>
        <AppText style={styles.label}>Sector</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing.sm }}>
          {sectors.map((s) => (
            <Pill key={s} label={s} icon="location-outline" active={!customArea && draft.area === s} onPress={() => chooseSector(s)} />
          ))}
          <Pill label="Otro" icon="add-outline" active={customArea} onPress={() => chooseSector(null)} />
        </ScrollView>
        {customArea ? (
          <TextField label="Nombre del sector" value={draft.area} onChangeText={(t) => set('area', t)} error={errors.area} placeholder="Ej.: Curaco de Vélez" />
        ) : errors.area ? (
          <AppText variant="small" style={styles.error}>{errors.area}</AppText>
        ) : null}
      </View>

      <TextField label="Etiqueta" value={draft.tag} onChangeText={(t) => set('tag', t)} error={errors.tag} placeholder="Ej.: Mariscos, Cabañas, Patrimonio" />
      <TextField label="Horario o dato corto" value={draft.note} onChangeText={(t) => set('note', t)} error={errors.note} placeholder="Ej.: Lun–Sáb · 09:00–18:00" />
      <TextField label="Descripción" value={draft.description} onChangeText={(t) => set('description', t)} error={errors.description} multiline />
      <TextField label="Dirección (opcional)" value={draft.address} onChangeText={(t) => set('address', t)} error={errors.address} />
      <TextField label="Teléfono (opcional)" value={draft.phone} onChangeText={(t) => set('phone', t)} error={errors.phone} keyboardType="phone-pad" placeholder="Ej.: +56 65 2 661 000" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <TextField label="Latitud" value={draft.lat} onChangeText={(t) => set('lat', t)} error={errors.lat} keyboardType={COORDINATE_KEYBOARD} placeholder="-42,4709" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Longitud" value={draft.lng} onChangeText={(t) => set('lng', t)} error={errors.lng} keyboardType={COORDINATE_KEYBOARD} placeholder="-73,4909" />
        </View>
      </View>
      <AppText variant="small">Tip: en Google Maps, mantén presionado el lugar y copia las coordenadas.</AppText>

      <View style={styles.group}>
        <TextField
          label="URL de imagen"
          value={typeof draft.image === 'string' ? draft.image : ''}
          onChangeText={setImageUrl}
          error={errors.image}
          hint={localImage !== undefined && typeof draft.image === 'number' ? 'Usa una imagen incluida en la app. Escribe una URL solo si quieres reemplazarla.' : undefined}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="https://…"
        />
        {preview ? (
          <Image source={preview} accessibilityLabel="Vista previa de la imagen" style={styles.preview} />
        ) : null}
      </View>

      {hasErrors ? <AppText variant="small" style={styles.error}>Revisa los campos marcados en rojo.</AppText> : null}
      <Button label={submitLabel} icon="checkmark-outline" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.navy },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
  error: { color: colors.danger },
  preview: { width: '100%', height: 160, borderRadius: radius.md, backgroundColor: colors.mist },
});
