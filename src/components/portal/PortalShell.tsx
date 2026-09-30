import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOutIcon, MenuIcon, XIcon, ChevronDownIcon, SunIcon, MoonIcon } from 'lucide-react';
import { Avatar, cx } from '../ui/primitives';
import { Icon, SalaMark } from '../ui/icons';
import { GlobalSearch, NotificationBell, RoleSwitcher, SearchTrigger } from './PortalWidgets';
import { ToastStack } from '../ui/feedback';
import { MOBILE_NAV, ROLE_LABELS, ROLE_NAV, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';
import { mapRole } from '../../api/types';
import type { ApiUser } from '../../api/types';

interface PortalIdentity {
  name: string;
  initials: string;
  context: string;
}

function apiIdentity(user: ApiUser): PortalIdentity {
  const name = user.full_name?.trim() || user.person?.full_name?.trim() || user.email;
  const parts = name.split(/[\s@.]+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'SA';
  return { name, initials, context: ROLE_LABELS[mapRole(user.roles ?? []) ?? 'visitor'] };
}

// Roles that use sidebar layout
const SIDEBAR_ROLES = ['admin', 'hr', 'finance', 'superadmin'];

function SidebarContent({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean; }) {
  const { role, sessionMode, user, darkMode, toggleDarkMode } = useApp();
  const groups = ROLE_NAV[role];
  const identity = (sessionMode === 'api' && user ? apiIdentity(user) : null) ?? ROLE_USERS[role];

  return (
    <div className="flex h-full flex-col">
      <div className={cx(
        'flex items-center border-b border-white/10 shrink-0 transition-all duration-300',
        collapsed ? 'justify-center px-2 h-16' : 'gap-2.5 px-4 h-16'
      )}>
        <SalaMark tone="white" className={cx('text-[13px] shrink-0', collapsed ? 'h-9 w-9' : 'h-9 w-9')} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-white leading-tight">St. Ann Lifred</p>
            <p className="text-[11.5px] text-gray-400 truncate">{ROLE_LABELS[role]}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto sala-scroll px-3 py-4 space-y-5" aria-label="Portal navigation">
        {groups.map((g) => (
          <div key={g.title}>
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-500">{g.title}</p>
            )}
            <ul className="space-y-0.5">
              {g.links.map((l) => (
                <li key={l.to + l.label}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    onClick={onNavigate}
                    className={({ isActive }) => cx(
                      'flex items-center gap-2.5 rounded-lg transition-all duration-150',
                      collapsed ? 'justify-center px-2 py-2.5' : 'px-2.5 py-2 text-[13.5px]',
                      isActive 
                        ? 'bg-gold/15 text-gold font-medium' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                    title={collapsed ? l.label : undefined}
                  >
                    <Icon name={l.icon} size={17} className="shrink-0 opacity-90" />
                    {!collapsed && <span className="truncate">{l.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 shrink-0">
        <div className={cx(
          'flex items-center rounded-lg px-2 py-2',
          collapsed ? 'justify-center' : 'gap-2.5'
        )}>
          <Avatar initials={identity.initials} size="sm" tone="gold" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-white truncate">{identity.name}</p>
              <p className="text-[11.5px] text-gray-400 truncate">{identity.context}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HorizontalNavbar() {
  const { role, sessionMode, user: apiUser, darkMode, toggleDarkMode, logout } = useApp();
  const navigate = useNavigate();
  const groups = ROLE_NAV[role];
  const identity = (sessionMode === 'api' && apiUser ? apiIdentity(apiUser) : null) ?? ROLE_USERS[role];
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-navy-900 border-b border-surface-border dark:border-white/10 shadow-sm">
      <div className="flex items-center h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-8">
          <SalaMark className="h-9 w-9 text-[13px]" />
          <span className="hidden sm:block leading-tight">
            <span className="block font-heading text-[13px] font-bold text-navy dark:text-white">ST. ANN LIFRED</span>
            <span className="block text-[9px] uppercase tracking-[0.15em] text-gold font-semibold">Academy</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Portal navigation">
          {groups.map((g) => (
            <div key={g.title} className="relative">
              {g.links.length === 1 ? (
                <NavLink
                  to={g.links[0].to}
                  end={g.links[0].end}
                  className={({ isActive }) => cx(
                    'px-3 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150',
                    isActive 
                      ? 'text-gold bg-gold/10' 
                      : 'text-ink-muted dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  )}
                >
                  {g.links[0].label}
                </NavLink>
              ) : (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === g.title ? null : g.title);
                    }}
                    className={cx(
                      'flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150',
                      openDropdown === g.title
                        ? 'text-gold bg-gold/10'
                        : 'text-ink-muted dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    )}
                  >
                    {g.title}
                    <ChevronDownIcon size={14} className={cx('transition-transform duration-200', openDropdown === g.title && 'rotate-180')} />
                  </button>
                  
                  <AnimatePresence>
                    {openDropdown === g.title && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-navy-800 rounded-xl shadow-pop border border-surface-border dark:border-white/10 py-2 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {g.links.map((l) => (
                          <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            onClick={() => setOpenDropdown(null)}
                            className={({ isActive }) => cx(
                              'flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors duration-150',
                              isActive 
                                ? 'text-gold bg-gold/10 font-medium' 
                                : 'text-ink dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                            )}
                          >
                            <Icon name={l.icon} size={16} className="shrink-0" />
                            {l.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="h-9 w-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-ink-muted dark:text-gray-400 hover:text-gold dark:hover:text-gold transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </motion.button>

          {sessionMode === 'demo' && <RoleSwitcher />}
          <NotificationBell />
          
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="hidden sm:grid h-9 w-9 place-items-center rounded-lg border border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink-muted dark:text-gray-400 hover:text-ink dark:hover:text-white hover:border-gold transition-colors duration-150"
            aria-label="Sign out"
          >
            <LogOutIcon size={16} />
          </button>
          
          <span className="hidden lg:flex items-center gap-2 pl-2 ml-1 border-l border-surface-border dark:border-white/10">
            <Avatar initials={identity.initials} size="sm" />
            <span className="text-[13px] font-medium text-ink dark:text-white max-w-[10rem] truncate">{identity.name}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

export function PortalShell() {
  const { role, sessionMode, user: apiUser, toasts, dismiss, logout, darkMode, toggleDarkMode } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const mobile = MOBILE_NAV[role];
  const identity = (sessionMode === 'api' && apiUser ? apiIdentity(apiUser) : null) ?? ROLE_USERS[role];
  const useSidebar = SIDEBAR_ROLES.includes(role);

  return (
    <div className="min-h-full w-full bg-white dark:bg-navy-dark transition-colors duration-300">
      {useSidebar ? (
        <>
          {/* Desktop sidebar */}
          <aside className={cx(
            'hidden lg:flex fixed inset-y-0 left-0 z-30 transition-all duration-300',
            sidebarCollapsed ? 'w-[72px]' : 'w-64'
          )}>
            <div className="w-full bg-gradient-to-b from-navy-900 to-navy-dark">
              <SidebarContent collapsed={sidebarCollapsed} />
            </div>
          </aside>

          {/* Mobile drawer */}
          <AnimatePresence>
            {drawer && (
              <div className="lg:hidden fixed inset-0 z-50">
                <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={() => setDrawer(false)} />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-y-0 left-0 w-[17rem] bg-gradient-to-b from-navy-900 to-navy-dark"
                >
                  <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-4 h-8 w-8 grid place-items-center rounded-lg text-gray-400 hover:bg-white/10">
                    <XIcon size={18} />
                  </button>
                  <SidebarContent onNavigate={() => setDrawer(false)} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className={cx('transition-all duration-300', sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64')}>
            {/* Top bar for sidebar layouts */}
            <header className="sticky top-0 z-20 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-surface-border dark:border-white/10">
              <div className="flex items-center gap-2 px-4 sm:px-6 h-16">
                <button onClick={() => setDrawer(true)} aria-label="Open menu" className="lg:hidden h-9 w-9 grid place-items-center rounded-lg border border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink dark:text-white">
                  <MenuIcon size={18} />
                </button>
                
                <button 
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                  aria-label="Toggle sidebar"
                  className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink-muted dark:text-gray-400 hover:text-navy dark:hover:text-white transition-colors duration-150"
                >
                  <MenuIcon size={16} />
                </button>
                
                <div className="flex-1 min-w-0">
                  <SearchTrigger />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="h-9 w-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-ink-muted dark:text-gray-400 hover:text-gold dark:hover:text-gold transition-colors duration-300"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                </motion.button>
                
                {sessionMode === 'demo' && <RoleSwitcher />}
                <NotificationBell />
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="hidden sm:grid h-9 w-9 place-items-center rounded-lg border border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink-muted dark:text-gray-400 hover:text-navy dark:hover:text-white hover:border-gold transition-colors duration-150"
                  aria-label="Sign out"
                >
                  <LogOutIcon size={16} />
                </button>
                <span className="hidden xl:flex items-center gap-2 pl-2 ml-1 border-l border-surface-border dark:border-white/10">
                  <Avatar initials={identity.initials} size="sm" />
                  <span className="text-[13px] font-medium text-ink dark:text-white max-w-[10rem] truncate">{identity.name}</span>
                </span>
              </div>
            </header>

            <main className="px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-[1400px]">
              <Outlet />
            </main>
          </div>
        </>
      ) : (
        <>
          {/* Horizontal navbar layout */}
          <HorizontalNavbar />
          
          <main className="pt-16 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-[1400px] mx-auto">
            <Outlet />
          </main>
        </>
      )}

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-navy-900 border-t border-surface-border dark:border-white/10" aria-label="Primary">
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${mobile.length}, minmax(0,1fr))` }}>
          {mobile.map((l) => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) => cx(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150',
                  isActive ? 'text-gold' : 'text-ink-soft dark:text-gray-500'
                )}
              >
                <Icon name={l.icon} size={19} />
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <GlobalSearch />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
