import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Role } from '../types';
import type { Toast } from '../components/ui/feedback';
import {
  apiLogin,
  apiLogout,
  apiMe,
  clearTokens,
  resolveSchoolFor,
  setSchoolId as setClientSchoolId,
  storeTokens,
} from '../api/client';
import { mapRole } from '../api/types';
import type { ApiUser } from '../api/types';

export type SessionMode = 'demo' | 'api';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  activeChildId: string;
  setActiveChildId: (id: string) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  booted: boolean;
  sessionMode: SessionMode;
  user: ApiUser | null;
  schoolId: string | null;
  setSchoolId: (id: string | null) => void;
  login: (email: string, password: string) => Promise<ApiUser>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children, initialRole = 'visitor' }: {children: React.ReactNode;initialRole?: Role;}) {
  const [role, setRole] = useState<Role>(initialRole);
  const [activeChildId, setActiveChildId] = useState('s1');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [sessionMode, setSessionMode] = useState<SessionMode>('demo');
  const [user, setUser] = useState<ApiUser | null>(null);
  const [schoolId, setSchoolIdState] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!localStorage.getItem('sala_access')) {
        if (alive) setBooted(true);
        return;
      }
      try {
        const me = await apiMe();
        if (!alive) return;
        setUser(me);
        setSessionMode('api');
        const mapped = mapRole(me.roles ?? []);
        if (mapped) setRole(mapped);
        const sid = await resolveSchoolFor(me);
        if (sid) {
          setSchoolIdState(sid);
          setClientSchoolId(sid);
        }
      } catch {
        clearTokens();
      }
      if (alive) setBooted(true);
    })();
    return () => { alive = false; };
  }, []);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const setSchoolId = useCallback((id: string | null) => {
    setSchoolIdState(id);
    setClientSchoolId(id);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiLogin(email, password);
    storeTokens(tokens.access, tokens.refresh);
    const me = await apiMe();
    setUser(me);
    setSessionMode('api');
    const mapped = mapRole(me.roles ?? []);
    if (mapped) setRole(mapped);
    const sid = await resolveSchoolFor(me);
    if (sid) {
      setSchoolIdState(sid);
      setClientSchoolId(sid);
    }
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore logout errors */
    }
    clearTokens();
    setUser(null);
    setSessionMode('demo');
    setSchoolIdState(null);
    setRole('visitor');
  }, []);

  const value = useMemo(
    () => ({
      role, setRole, activeChildId, setActiveChildId, toasts, toast, dismiss, searchOpen, setSearchOpen,
      booted, sessionMode, user, schoolId, setSchoolId, login, logout,
    }),
    [role, activeChildId, toasts, toast, dismiss, searchOpen, booted, sessionMode, user, schoolId, setSchoolId, login, logout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export const TEACHER_ROLES: Role[] = ['classteacher', 'subjectteacher'];