import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

/** Gate portal routes behind an active session. In `demo` mode any non-visitor
 *  role may browse the prototype; in `api` mode a valid token is required. */
export function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { booted, sessionMode, role } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!booted) return;
    const allowed = sessionMode === 'api' || (sessionMode === 'demo' && role !== 'visitor');
    if (!allowed) navigate('/login', { replace: true });
  }, [booted, sessionMode, role, navigate]);

  if (!booted) {
    return (
      <div className="min-h-screen bg-cream grid place-items-center">
        <p className="text-sm text-ink-muted">Loading SALA…</p>
      </div>
    );
  }

  return <>{children}</>;
}