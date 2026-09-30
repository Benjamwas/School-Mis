import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, CheckIcon, ChevronDownIcon, SearchIcon, UserCogIcon } from 'lucide-react';
import { Badge, Button, cx } from '../ui/primitives';
import { Modal } from '../ui/feedback';
import { NOTIFICATIONS, ROLE_HOME, ROLE_LABELS, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList, useObject } from '../../api/hooks';
import type { ApiNotification, ApiSearchResult } from '../../api/types';
import type { Role } from '../../types';

const DEMO_ROLES: Role[] = ['superadmin', 'admin', 'finance', 'hr', 'classteacher', 'subjectteacher', 'parent', 'student', 'visitor'];

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const NOTIFICATION_TONE: Record<string, string> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  pending: 'pending',
  error: 'error',
  assignment: 'pending',
  submission: 'info',
  attendance: 'warning',
  leave: 'info',
  fee: 'success',
  result: 'info'
};

function notificationTone(type?: string): string {
  if (!type) return 'info';
  return NOTIFICATION_TONE[type.toLowerCase()] ?? 'info';
}

function relativeWhen(value?: string): string {
  if (!value) return '—';
  const then = new Date(value);
  if (Number.isNaN(then.getTime())) return '—';
  const minutes = Math.round((Date.now() - then.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) {
    const hours = Math.round(minutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (minutes < 60 * 48) return 'Yesterday';
  return then.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

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
  const live = useApiLive();
  const [open, setOpen] = useState(false);
  const unreadCount = useObject<{ count?: number }>('/notifications/unread_count/');
  const notifications = useList<ApiNotification>('/notifications/');
  const mockItems = NOTIFICATIONS[notificationKey(role)] ?? [];

  const liveItems = React.useMemo(() => {
    if (!notifications.data) return null;
    return notifications.data.map((n) => ({
      title: n.title,
      body: n.body ?? '',
      when: relativeWhen(n.created_at),
      tone: notificationTone(n.type),
      unread: !n.is_read
    }));
  }, [notifications.data]);

  const items = live ? liveItems ?? [] : mockItems;
  const unread = live
    ? unreadCount.data?.count ?? items.filter((i) => i.unread).length
    : items.filter((i) => i.unread).length;
  const error = live ? unreadCount.error ?? notifications.error : null;
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
              {error &&
              <p className="px-4 pt-3 text-sm text-rose-600">{error}</p>
              }
              {live && !error && items.length === 0 &&
              <p className="px-4 py-6 text-center text-sm text-ink-muted">You have no notifications.</p>
              }
              <ul className="max-h-80 overflow-y-auto sala-scroll divide-y divide-line">
                {items.map((n, i) =>
              <li key={i} className={cx('px-4 py-3 flex gap-3', n.unread && 'bg-forest-50/40')}>
                    <span className={cx('mt-1.5 h-2 w-2 rounded-full shrink-0', toneCls[n.tone] ?? toneCls.info)} aria-hidden="true" />
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


interface SearchGroup {
  group: string;
  items: { title: string; meta: string; to: string }[];
}

const SEARCH_CATEGORIES: { key: string; label: string; to: (id: string) => string }[] = [
  { key: 'students', label: 'Students', to: (id) => `/admin/student/${id}` },
  { key: 'parents', label: 'Parents', to: () => '/admin/parents' },
  { key: 'staff', label: 'Staff', to: () => '/admin/teachers' },
  { key: 'invoices', label: 'Invoices', to: () => '/finance/payments' },
  { key: 'leads', label: 'Leads', to: () => '/admin/crm' },
  { key: 'applications', label: 'Applications', to: () => '/admin/admissions' },
  { key: 'announcements', label: 'Announcements', to: () => '/admin/communication' },
  { key: 'events', label: 'Events', to: () => '/admin/content/Events' },
  { key: 'cms_pages', label: 'Pages', to: () => '/admin/content' }
];

function asText(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
}

function searchRow(key: string, row: ApiSearchResult): { title: string; meta: string; to: string } {
  const status = asText(row.status);
  const name = asText(row.name);
  const admission = asText(row.admission_number);
  const extra = [asText(row.email), asText(row.employee_number), asText(row.department),
    asText(row.invoice_number), asText(row.student), asText(row.number), asText(row.applicant),
    asText(row.slug), admission]
    .filter(Boolean)
    .filter((v) => v !== name)
    .join(' · ');
  const meta = [extra, status ? titleCase(status) : ''].filter(Boolean).join(' · ') || '—';
  const title = name || asText(row.title) || asText(row.invoice_number) || asText(row.number) || asText(row.slug) || 'Untitled';
  const route = SEARCH_CATEGORIES.find((c) => c.key === key)?.to ?? (() => '/');
  return { title, meta, to: route(row.id) };
}

function adaptSearch(payload: Record<string, ApiSearchResult[]> | null): SearchGroup[] {
  if (!payload) return [];
  return SEARCH_CATEGORIES.map((c) => {
    const rows = Array.isArray(payload[c.key]) ? payload[c.key] : [];
    return { group: c.label, items: rows.map((r) => searchRow(c.key, r)) };
  }).filter((g) => g.items.length);
}


export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useApp();
  const navigate = useNavigate();
  const live = useApiLive();
  const [q, setQ] = useState('');
  const [liveGroups, setLiveGroups] = useState<SearchGroup[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const term = q.trim();

  useEffect(() => {
    if (!live || term.length < 2) {
      setLiveGroups(null);
      setSearchError(null);
      return;
    }
    let alive = true;
    const timer = setTimeout(() => {
      api.get<Record<string, ApiSearchResult[]>>(`/search/?q=${encodeURIComponent(term)}`)
        .then((data) => {
          if (!alive) return;
          setLiveGroups(adaptSearch(data));
          setSearchError(null);
        })
        .catch((err) => {
          if (!alive) return;
          setLiveGroups(null);
          setSearchError(err instanceof Error ? err.message : 'Search failed.');
        });
    }, 300);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [live, term]);

  const mockGroups = React.useMemo(() => SEARCH_RESULTS.map((g) => ({
    ...g,
    items: g.items.filter((i) => q ? i.title.toLowerCase().includes(q.toLowerCase()) : true)
  })).filter((g) => g.items.length), [q]);

  const groups: SearchGroup[] = live ? liveGroups ?? [] : mockGroups;
  const error = live ? searchError : null;

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
      {error &&
      <p className="text-sm text-rose-600 mb-3">{error}</p>
      }
      {!error && live && liveGroups === null && term.length >= 2 &&
      <p className="text-sm text-ink-muted py-6 text-center">Searching…</p>
      }
      {!error && groups.length === 0 ?
      <p className="text-sm text-ink-muted py-6 text-center">No matches for “{q}”. Try a name, receipt number or class.</p> :

      <div className="space-y-4">
          {groups.map((g) =>
        <div key={g.group}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1.5">{g.group}</p>
              <ul className="space-y-1">
                {g.items.map((i) =>
            <li key={i.title + i.meta}>
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