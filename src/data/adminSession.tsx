import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { isValidPin } from './admin';

// Desbloqueo del modo administración. Vive solo en memoria: se pierde al cerrar la app (no se guarda en AsyncStorage).
interface AdminSessionValue {
  unlocked: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  const unlock = useCallback((pin: string) => {
    const ok = isValidPin(pin);
    if (ok) setUnlocked(true);
    return ok;
  }, []);

  const lock = useCallback(() => setUnlocked(false), []);

  const value = useMemo(() => ({ unlocked, unlock, lock }), [unlocked, unlock, lock]);
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionValue {
  const context = useContext(AdminSessionContext);
  if (!context) throw new Error('useAdminSession debe usarse dentro de <AdminSessionProvider>.');
  return context;
}
