import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, CheckIcon, ChevronDownIcon, SearchIcon, UserCogIcon } from 'lucide-react';
import { Badge, Button, cx } from '../ui/primitives';
import { Modal } from '../ui/feedback';
import { NOTIFICATIONS, ROLE_HOME, ROLE_LABELS, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';
import type { Role } from '../../types';

const DEMO_ROLES: Role[] = ['superadmin', 'admin', 'finance', 'hr', 'classteacher', 'subjectteacher', 'parent', 'student', 'visitor'];

export function notificationKey(role: Role) {
  if (role === 'classteacher' || role === 'subjectteacher') return 'teacher';
  if (role === 'hr' || role === 'finance') return 'admin';
  if (role === 'parent' || role === 'student' || role === 'superadmin') return role;
  return 'admin';
}

export function RoleSwitcher({ compact }: {compact?: boolean;}) {
  const { role, setRole } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const pick = (r: Role) => {
    setRole(r);
    setOpen(false);
    navigate(ROLE_HOME[r]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cx(
          'inline-flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 h-9 text-[13px] font-medium text-ink hover:border-forest-300 transition-colors duration-150',
          compact && 'px-2'
        )}>
        
        <UserCogIcon size={15} className="text-gold-500" />
        {!compact && <span className="hidden lg:inline text-ink-muted">Viewing as</span>}
        <span className="max-w-[9rem] truncate">{ROLE_LABELS[role]}</span>
        <ChevronDownIcon size={14} className="text-ink-soft" />
      </button>
      <AnimatePresence>
        {open &&
        <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 z-40 mt-2 w-72 rounded-card border border-line bg-white shadow-pop p-2">
            
              <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Prototype role preview</p>
              {DEMO_ROLES.map((r) =>
            <button
              key={r}
              role="menuitem"
              onClick={() => pick(r)}
              className={cx(
                'w-full flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors duration-150',
                r === role ? 'bg-forest-50 text-forest-800' : 'text-ink hover:bg-cream'
              )}>
              
                  <span>
                    <span className="block font-medium">{ROLE_LABELS[r]}</span>
                    <span className="block text-[11.5px] text-ink-muted">{ROLE_USERS[r].name}</span>
                  </span>
                  {r === role && <CheckIcon size={15} className="text-forest-700 shrink-0" />}
                </button>
            )}
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}

export function NotificationBell() {
  const { role } = useApp();
  const [open, setOpen] = useState(false);
  const items = NOTIFICATIONS[notificationKey(role)] ?? [];
  const unread = items.filter((i) => i.unread).length;
  const toneCls: Record<string, string> = {
    success: 'bg-forest-500',
    info: 'bg-sky-500',
    warning: 'bg-gold-400',
    pending: 'bg-amber-500',
    error: 'bg-red-500'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications, ${unread} unread`}
        className="relative h-9 w-9 grid place-items-center rounded-lg border border-line bg-white text-ink-muted hover:text-ink hover:border-forest-300 transition-colors duration-150">
        
        <BellIcon size={17} />
        {unread > 0 &&
        <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-gold-400 text-[10px] font-semibold text-forest-900 grid place-items-center">
            {unread}
          </span>
        }
      </button>
      <AnimatePresence>
        {open &&
        <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 z-40 mt-2 w-[22rem] max-w-[92vw] rounded-card border border-line bg-white shadow-pop">
            
              <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                <p className="text-sm font-semibold text-ink">Notifications</p>
                <Badge tone="neutral">{unread} unread</Badge>
              </div>
              <ul className="max-h-80 overflow-y-auto sala-scroll divide-y divide-line">
                {items.map((n, i) =>
              <li key={i} className={cx('px-4 py-3 flex gap-3', n.unread && 'bg-forest-50/40')}>
                    <span className={cx('mt-1.5 h-2 w-2 rounded-full shrink-0', toneCls[n.tone])} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-ink">{n.title}</p>
                      <p className="text-[12.5px] text-ink-muted leading-relaxed">{n.body}</p>
                      <p className="text-[11.5px] text-ink-soft mt-0.5">{n.when}</p>
                    </div>
                  </li>
              )}
              </ul>
              <div className="px-4 py-2.5 border-t border-line">
                <button className="text-[13px] font-medium text-forest-700 hover:underline">Mark all as read</button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}

const SEARCH_RESULTS = [
{
  group: 'Students',
  items: [
  { title: 'Wanjiru Kamau', meta: 'Grade 4 Acacia · SALA/2021/0418', to: '/admin/student/s1' },
  { title: 'Amani Kiplagat', meta: 'Grade 5 Acacia · SALA/2020/0301', to: '/admin/student/s3' }]

},
{
  group: 'Applications',
  items: [{ title: 'APP-2026-0418 · Mark Otieno', meta: 'Grade 4 · Interview stage', to: '/admin/admissions' }]
},
{
  group: 'Payments',
  items: [{ title: 'KES 40,000 · Ref SALA7X92KQ', meta: 'Wanjiru Kamau · 02 Sep 2026', to: '/finance/payments' }]
},
{
  group: 'Assignments',
  items: [{ title: 'Fractions — comparing and ordering', meta: 'Grade 4 Acacia · due 24 Sep', to: '/teacher/assignments' }]
}];


export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const groups = SEARCH_RESULTS.map((g) => ({
    ...g,
    items: g.items.filter((i) => q ? i.title.toLowerCase().includes(q.toLowerCase()) : true)
  })).filter((g) => g.items.length);

  return (
    <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search SALA" description="Results are limited to what your role is permitted to see." size="md">
      <div className="relative mb-4">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Students, parents, payments, assignments…"
          aria-label="Search"
          className="w-full h-11 rounded-lg border border-line pl-9 pr-3 text-sm focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none" />
        
      </div>
      {groups.length === 0 ?
      <p className="text-sm text-ink-muted py-6 text-center">No matches for “{q}”. Try a name, receipt number or class.</p> :

      <div className="space-y-4">
          {groups.map((g) =>
        <div key={g.group}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1.5">{g.group}</p>
              <ul className="space-y-1">
                {g.items.map((i) =>
            <li key={i.title}>
                    <button
                onClick={() => {
                  setSearchOpen(false);
                  navigate(i.to);
                }}
                className="w-full text-left rounded-lg px-3 py-2 hover:bg-cream transition-colors duration-150">
                
                      <span className="block text-[13.5px] font-medium text-ink">{i.title}</span>
                      <span className="block text-[12px] text-ink-muted">{i.meta}</span>
                    </button>
                  </li>
            )}
              </ul>
            </div>
        )}
        </div>
      }
    </Modal>);

}

export function SearchTrigger() {
  const { setSearchOpen } = useApp();
  return (
    <Button variant="secondary" size="sm" icon={<SearchIcon size={15} />} onClick={() => setSearchOpen(true)} className="font-normal text-ink-muted">
      <span className="hidden lg:inline">Search students, payments…</span>
      <span className="lg:hidden">Search</span>
    </Button>);

}