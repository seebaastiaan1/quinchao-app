import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CategoryRow, EmptyState, PlaceCard, Screen, SectionHeader } from '@/components';
import { categories } from '@/data/categories';
import { places } from '@/data/places';
import { colors, fonts, radius, spacing } from '@/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(q ?? '');

  useEffect(() => setQuery(q ?? ''), [q]);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return [];
    return places.filter((p) => [p.title, p.area, p.tag, p.description].some((s) => s.toLowerCase().includes(text)));
  }, [query]);

  return (
    <Screen>
      <SectionHeader eyebrow="Explora Quinchao" title="Encuentra tu próxima historia" />
      <View style={styles.search}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Buscar lugares, experiencias o servicios" placeholderTextColor={colors.muted} style={styles.input} />
      </View>

      {query.trim() === '' ? (
        categories.map((c) => <CategoryRow key={c.key} category={c} onPress={() => router.push({ pathname: '/category/[key]', params: { key: c.key } })} />)
      ) : results.length === 0 ? (
        <EmptyState message={`No encontramos resultados para “${query}”.`} />
      ) : (
        results.map((p) => <PlaceCard key={p.id} place={p} onPress={() => router.push({ pathname: '/place/[id]', params: { id: p.id } })} />)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, paddingVertical: 12 },
});
