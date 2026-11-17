import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { offlineAlways, offlineNever, offlineWithCopy } from '@/data/offline';
import type { IconName } from '@/data/types';
import { useOffline, type OfflineStatus } from '@/offline';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

const formatSize = (bytes: number): string => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()} a las ${two(d.getHours())}:${two(d.getMinutes())}`;
};

const titles: Record<OfflineStatus, string> = {
  checking: 'Revisando el contenido guardado…',
  none: 'Aún no hay una copia en este teléfono',
  outdated: 'Hay contenido nuevo para descargar',
  downloading: 'Descargando contenido…',
  ready: 'Listo para usar sin conexión',
};

function Line({ icon, color, text }: { icon: IconName; color: string; text: string }) {
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={16} color={color} />
      <AppText variant="small" style={{ flex: 1 }}>{text}</AppText>
    </View>
  );
}

// Tarjeta de la pestaña Información: estado de la copia sin conexión, qué incluye y acciones (descargar / actualizar / eliminar).
export function OfflineCard() {
  const { supported, isOnline, status, progress, manifest, message, download, remove } = useOffline();
  const ready = status === 'ready';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={ready ? 'cloud-done-outline' : 'cloud-download-outline'} size={26} color={ready ? colors.green : colors.primary} />
        <View style={{ flex: 1 }}>
          <AppText variant="eyebrow">Uso sin conexión</AppText>
          <AppText variant="heading">{supported ? titles[status] : 'Disponible en la app móvil'}</AppText>
        </View>
      </View>

      {!supported && <AppText variant="small">En el navegador la app necesita internet para mostrar fotografías. Instala la app en tu teléfono para guardar una copia.</AppText>}
      {supported && status === 'none' && (
        <AppText variant="small">
          {isOnline
            ? 'Descarga las fotografías ahora para verlas después sin internet. Los textos y teléfonos ya funcionan sin conexión.'
            : 'Ahora no tienes internet. Los textos y teléfonos funcionan igual; las fotografías se podrán descargar cuando vuelvas a conectarte.'}
        </AppText>
      )}
      {supported && status === 'downloading' && <AppText variant="small">{progress.done} de {progress.total} fotografías</AppText>}
      {supported && manifest && status !== 'downloading' && (
        <AppText variant="small">
          Copia del {formatDate(manifest.savedAt)} · {Object.keys(manifest.files).length} fotografías · {formatSize(manifest.bytes)}
        </AppText>
      )}
      {message && <AppText variant="small" style={{ color: colors.navy }}>{message}</AppText>}

      <View style={styles.list}>
        {offlineAlways.map((t) => <Line key={t} icon="checkmark-circle-outline" color={colors.green} text={`${t} · siempre`} />)}
        {offlineWithCopy.map((t) => <Line key={t} icon="download-outline" color={colors.primary} text={`${t} · requiere descarga previa`} />)}
        {offlineNever.map((t) => <Line key={t} icon="wifi-outline" color={colors.muted} text={`${t} · requiere internet`} />)}
      </View>

      {supported && (status === 'none' || status === 'outdated') && (
        <Button label={status === 'none' ? 'Descargar para usar sin conexión' : 'Actualizar copia'} icon="cloud-download-outline" onPress={download} />
      )}
      {supported && ready && <Button label="Volver a descargar" icon="refresh-outline" variant="outline" onPress={download} />}
      {supported && manifest && status !== 'downloading' && <Button label="Eliminar copia" icon="trash-outline" variant="outline" onPress={remove} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.mist },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  list: { gap: spacing.xs },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
});
