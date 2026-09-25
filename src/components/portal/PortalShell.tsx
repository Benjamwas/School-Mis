import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import { Avatar, cx } from '../ui/primitives';
import { Icon, SalaMark } from '../ui/icons';
import { GlobalSearch, NotificationBell, RoleSwitcher, SearchTrigger } from './PortalWidgets';
import { ToastStack } from '../ui/feedback';
import { MOBILE_NAV, ROLE_LABELS, ROLE_NAV, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';

function SidebarContent({ onNavigate }: {onNavigate?: () => void;}) {
  const { role } = useApp();
  const groups = ROLE_NAV[role];
  const user = ROLE_USERS[role];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-forest-800/60 shrink-0">
        <SalaMark tone="white" className="h-9 w-9 text-[13px]" />
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-white leading-tight">St. Ann Lifred</p>
          <p className="text-[11.5px] text-forest-200 truncate">{ROLE_LABELS[role]}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto sala-scroll px-3 py-4 space-y-5" aria-label="Portal navigation">
        {groups.map((g) =>
        <div key={g.title}>
            <p className="px-2.5 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-forest-300">{g.title}</p>
            <ul className="space-y-0.5">
              {g.links.map((l) =>
            <li key={l.to + l.label}>
                  <NavLink
                to={l.to}
                end={l.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                cx(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors duration-150',
                  isActive ? 'bg-white/10 text-white font-medium' : 'text-forest-100/80 hover:bg-white/5 hover:text-white'
                )
                }>
                
                    <Icon name={l.icon} size={17} className="shrink-0 opacity-90" />
                    <span className="truncate">{l.label}</span>
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-forest-800/60 p-3 shrink-0">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar initials={user.initials} size="sm" tone="gold" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white truncate">{user.name}</p>
            <p className="text-[11.5px] text-forest-200 truncate">{user.context}</p>
          </div>
        </div>
      </div>
    </div>);

}

export function PortalShell() {
  const { role, toasts, dismiss, logout } = useApp();
  const [drawer, setDrawer] = useState(false);
  const navigate = useNavigate();
  const mobile = MOBILE_NAV[role];
  const user = ROLE_USERS[role];

  return (
    <div className="min-h-full w-full bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-forest-900 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer &&
        <div className="lg:hidden fixed inset-0 z-50">
            <motion.div className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={() => setDrawer(false)} />
            <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-y-0 left-0 w-[17rem] bg-forest-900">
            
              <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-4 h-8 w-8 grid place-items-center rounded-lg text-forest-100 hover:bg-white/10">
                <XIcon size={18} />
              </button>
              <SidebarContent onNavigate={() => setDrawer(false)} />
            </motion.div>
          </div>
        }
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-line">
          <div className="flex items-center gap-2 px-4 sm:px-6 h-16">
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden h-9 w-9 grid place-items-center rounded-lg border border-line bg-white text-ink">
              <MenuIcon size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <SearchTrigger />
            </div>
            <RoleSwitcher />
            <NotificationBell />
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="hidden sm:grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink-muted hover:text-ink hover:border-forest-300 transition-colors duration-150"
              aria-label="Sign out to public website">
              
              <LogOutIcon size={16} />
            </button>
            <span className="hidden xl:flex items-center gap-2 pl-2 ml-1 border-l border-line">
              <Avatar initials={user.initials} size="sm" />
              <span className="text-[13px] font-medium text-ink max-w-[10rem] truncate">{user.name}</span>
            </span>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-[1400px]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line" aria-label="Primary">
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${mobile.length}, minmax(0,1fr))` }}>
          {mobile.map((l) =>
          <li key={l.label}>
              <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
              cx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150', isActive ? 'text-forest-700' : 'text-ink-soft')
              }>
              
                <Icon name={l.icon} size={19} />
                {l.label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <GlobalSearch />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>);

}