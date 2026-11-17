import { AdminGate, AppText, Screen, SectionHeader } from '@/components';

export default function AdminScreen() {
  return (
    <AdminGate>
      <Screen>
        <SectionHeader eyebrow="Municipalidad de Quinchao" title="Administración" />
        <AppText>Gestión de lugares (tarea 11.7).</AppText>
      </Screen>
    </AdminGate>
  );
}
