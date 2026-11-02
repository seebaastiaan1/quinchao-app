import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Pill, Screen, SectionHeader } from '@/components';
import { eventType, eventTypes, events } from '@/data/events';
import type { EventItem, EventType } from '@/data/types';
import { colors, fonts, radius, shadow, spacing } from '@/theme';

const formatDate = (date: string) => new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`));

export default function EventsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<EventType | 'todas'>('todas');
  const visibleEvents = useMemo(() => filter === 'todas' ? events : events.filter((event) => event.type === filter), [filter]);
  const groups = useMemo(() => {
    const grouped = new Map<string, EventItem[]>();
    visibleEvents.forEach((event) => grouped.set(event.date, [...(grouped.get(event.date) ?? []), event]));
    return Array.from(grouped.entries());
  }, [visibleEvents]);

  return (
    <Screen>
      <Pressable onPress={() => router.replace('/')} accessibilityRole="button" accessibilityLabel="Volver al inicio" style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={colors.primary} />
        <AppText style={styles.backText}>Volver al inicio</AppText>
      </Pressable>
      <SectionHeader eyebrow="Agenda de Quinchao" title="Actividades para compartir" />
      <AppText style={styles.intro}>Consulta encuentros culturales, deportivos, recreativos y comunitarios para residentes y visitantes.</AppText>

      <View style={styles.filters}>
        <AppText variant="eyebrow">Filtrar por tipo</AppText>
        <View style={styles.pills}>
          {eventTypes.map((item) => (
            <Pill key={item.key} label={item.label} icon={item.icon} active={filter === item.key} onPress={() => setFilter(item.key)} />
          ))}
        </View>
      </View>

      {visibleEvents.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-clear-outline" size={28} color={colors.muted} />
          <AppText variant="heading">No hay actividades de este tipo</AppText>
          <AppText variant="small">Prueba con otra categoría.</AppText>
        </View>
      ) : (
        groups.map(([date, dateEvents]) => (
          <View key={date} style={styles.group}>
            <AppText variant="heading" style={styles.groupTitle}>{formatDate(date)}</AppText>
            {dateEvents.map((event) => {
              const type = eventType(event.type);
              return (
                <View key={event.id} style={styles.event}>
                  <View style={[styles.date, { backgroundColor: type?.color ?? colors.primary }]}>
                    <AppText variant="small" style={styles.dateText}>{new Date(`${event.date}T12:00:00`).getDate()}</AppText>
                    <AppText style={styles.monthText}>{new Intl.DateTimeFormat('es-CL', { month: 'short' }).format(new Date(`${event.date}T12:00:00`)).replace('.', '')}</AppText>
                  </View>
                  <View style={styles.copy}>
                    <AppText variant="small" style={{ color: type?.color ?? colors.primary }}>{type?.label}</AppText>
                    <AppText variant="heading">{event.title}</AppText>
                    <AppText variant="small">{event.description}</AppText>
                    <View style={styles.meta}>
                      <View style={styles.metaItem}><Ionicons name="location-outline" size={15} color={colors.muted} /><AppText variant="small">{event.place}</AppText></View>
                      <View style={styles.metaItem}><Ionicons name="time-outline" size={15} color={colors.muted} /><AppText variant="small">{event.time}</AppText></View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 44, alignSelf: 'flex-start' },
  backText: { color: colors.primary, fontFamily: fonts.semibold },
  intro: { color: colors.muted },
  filters: { gap: spacing.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  group: { gap: spacing.sm },
  groupTitle: { textTransform: 'capitalize' },
  event: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.md, ...shadow },
  date: { width: 58, height: 66, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  dateText: { color: colors.white, fontSize: 22, fontFamily: fonts.bold },
  monthText: { color: colors.white, fontSize: 12, textTransform: 'uppercase', fontFamily: fonts.semibold },
  copy: { flex: 1, gap: spacing.xs },
  meta: { gap: spacing.xs, marginTop: spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  empty: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg },
});