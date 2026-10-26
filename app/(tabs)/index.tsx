import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, CategoryRow, Screen } from '@/components';
import { categories } from '@/data/categories';
import { photos } from '@/data/places';
import { colors, fonts, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const search = () => router.push({ pathname: '/explore', params: { q: query } });

  return (
    <Screen topInset={false} style={{ paddingHorizontal: 0 }}>
      <ImageBackground source={{ uri: photos.hero }} style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.shade} />
        <AppText variant="eyebrow" style={{ color: colors.sun }}>Bienvenidos a Quinchao</AppText>
        <AppText variant="title" style={styles.heroTitle}>Islas con historias que merecen vivirse.</AppText>
        <AppText style={{ color: colors.white }}>Descubre paisajes, sabores y tradiciones en el corazón del archipiélago de Chiloé.</AppText>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            returnKeyType="search"
            placeholder="¿Qué te gustaría descubrir?"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable onPress={search} accessibilityRole="button" accessibilityLabel="Buscar" style={styles.searchBtn}>
            <AppText variant="button">Buscar</AppText>
          </Pressable>
        </View>
      </ImageBackground>

      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
        <AppText variant="eyebrow">Categorías</AppText>
        {categories.map((c) => (
          <CategoryRow key={c.key} category={c} onPress={() => router.push({ pathname: '/category/[key]', params: { key: c.key } })} />
        ))}
        {/* Botón de acceso rápido a emergencias (pantalla Inicio del documento) */}
        <Button label="Emergencias" icon="call-outline" variant="danger" onPress={() => router.push({ pathname: '/category/[key]', params: { key: 'emergencias' } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm, justifyContent: 'flex-end', minHeight: 420, overflow: 'hidden' },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,40,92,0.55)' },
  heroTitle: { color: colors.white, fontSize: 30, lineHeight: 38 },
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: radius.md, paddingLeft: spacing.md, paddingRight: 6, paddingVertical: 6, marginTop: spacing.md },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, paddingVertical: 8 },
  searchBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 16, paddingVertical: 10 },
});
