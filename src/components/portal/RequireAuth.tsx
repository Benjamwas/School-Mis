import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ROLE_HOME } from '../../data/navigation';
import type { Role } from '../../types';

interface RequireAuthProps {
  children: React.ReactNode;
  /** Roles permitted to view this branch. Omit to require any session. */
  allow?: readonly Role[];
}

/** Gate portal routes behind an active session and, when `allow` is given, the
 *  role the backend issued. A signed-in user without the required role is sent
 *  to their own portal home rather than shown the page. */
export function RequireAuth({ children, allow }: RequireAuthProps) {
  const { booted, sessionMode, role } = useApp();
  const navigate = useNavigate();

  const authenticated = sessionMode === 'api' || (sessionMode === 'demo' && role !== 'visitor');
  const permitted = !allow || allow.length === 0 || allow.includes(role);

  useEffect(() => {
    if (!booted) return;
    if (!authenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (!permitted) {
      navigate(role === 'visitor' ? '/' : ROLE_HOME[role] ?? '/', { replace: true });
    }
  }, [booted, authenticated, permitted, role, navigate]);

  if (!booted) {
    return (
      <div className="min-h-screen bg-cream grid place-items-center">
        <p className="text-sm text-ink-muted">Loading SALA…</p>
      </div>
    );
  }

  if (!authenticated || !permitted) return null;

  return <>{children}</>;
}
