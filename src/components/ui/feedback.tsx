import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { Button, Card, cx } from './primitives';

/* ---------------------------------- Modal ---------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md'








}: {open: boolean;onClose: () => void;title: string;description?: string;children?: React.ReactNode;footer?: React.ReactNode;size?: 'sm' | 'md' | 'lg';}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl' }[size];

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
          className="absolute inset-0 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className={cx('relative w-full bg-white rounded-t-2xl sm:rounded-card shadow-pop max-h-[92vh] overflow-y-auto sala-scroll', width)}>
          
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line sticky top-0 bg-white rounded-t-2xl sm:rounded-t-card">
              <div>
                <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
                {description && <p className="text-[13px] text-ink-muted mt-0.5">{description}</p>}
              </div>
              <button onClick={onClose} aria-label="Close dialog" className="h-8 w-8 grid place-items-center rounded-lg text-ink-muted hover:bg-cream transition-colors duration-150">
                <XIcon size={17} />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
            {footer && <div className="px-5 py-4 border-t border-line flex flex-wrap justify-end gap-2 sticky bottom-0 bg-white">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Confirm',
  danger








}: {open: boolean;onClose: () => void;onConfirm: () => void;title: string;body: string;confirmLabel?: string;danger?: boolean;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
      <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
    </Modal>);

}

/* ---------------------------------- Alerts --------------------------------- */

const ALERT_STYLE = {
  success: { cls: 'bg-forest-50 border-forest-200 text-forest-800', Icon: CheckCircle2Icon },
  warning: { cls: 'bg-gold-50 border-gold-200 text-gold-600', Icon: AlertTriangleIcon },
  error: { cls: 'bg-red-50 border-red-200 text-red-700', Icon: XCircleIcon },
  info: { cls: 'bg-sky-50 border-sky-200 text-sky-800', Icon: InfoIcon },
  pending: { cls: 'bg-amber-50 border-amber-200 text-amber-800', Icon: ClockIcon }
} as const;

export function Alert({ tone = 'info', title, children }: {tone?: keyof typeof ALERT_STYLE;title: string;children?: React.ReactNode;}) {
  const { cls, Icon } = ALERT_STYLE[tone];
  return (
    <div className={cx('flex gap-3 rounded-lg border p-3.5', cls)} role="status">
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 opacity-90 leading-relaxed">{children}</div>}
      </div>
    </div>);

}

/* ------------------------------- Empty state ------------------------------- */

export function EmptyState({ icon, title, body, action }: {icon: React.ReactNode;title: string;body: string;action?: React.ReactNode;}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto h-12 w-12 rounded-xl bg-cream grid place-items-center text-forest-600">{icon}</div>
      <p className="mt-3 text-[15px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>);

}

/* -------------------------------- Skeletons -------------------------------- */

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cx('animate-pulse rounded-md bg-cream', className)} />;
}

export function SkeletonCard() {
  return (
    <Card className="p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-32" />
      <Skeleton className="mt-2 h-3 w-40" />
    </Card>);

}

export function SkeletonTable({ rows = 5 }: {rows?: number;}) {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: rows }).map((_, i) =>
      <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-24 hidden sm:block" />
          <Skeleton className="h-3 w-16" />
        </div>
      )}
    </div>);

}

/* ---------------------------------- Toast ---------------------------------- */

export type Toast = {id: number;tone: keyof typeof ALERT_STYLE;title: string;body?: string;};

export function ToastStack({ toasts, dismiss }: {toasts: Toast[];dismiss: (id: number) => void;}) {
  return (
    <div className="fixed z-[60] bottom-4 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const { cls, Icon } = ALERT_STYLE[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className={cx('pointer-events-auto flex gap-3 rounded-lg border bg-white shadow-pop p-3.5', cls)}>
              
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div className="text-sm flex-1">
                <p className="font-semibold">{t.title}</p>
                {t.body && <p className="opacity-90 mt-0.5">{t.body}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="opacity-60 hover:opacity-100">
                <XIcon size={15} />
              </button>
            </motion.div>);

        })}
      </AnimatePresence>
    </div>);

}