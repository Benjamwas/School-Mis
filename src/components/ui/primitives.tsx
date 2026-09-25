import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { StatusTone } from '../../types';

export const cx = (...c: (string | false | undefined | null)[]) => twMerge(c.filter(Boolean).join(' '));

/* ---------------------------------- Button --------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  full?: boolean;
};

const BTN_BASE =
'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-sala disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985] whitespace-nowrap';

const BTN_VARIANT: Record<string, string> = {
  primary: 'bg-forest-700 text-white hover:bg-forest-800 shadow-sm',
  secondary: 'bg-white text-forest-800 border border-line hover:border-forest-300 hover:bg-forest-50',
  ghost: 'text-ink-muted hover:text-ink hover:bg-forest-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  gold: 'bg-gold-400 text-forest-900 hover:bg-gold-300'
};

const BTN_SIZE: Record<string, string> = {
  sm: 'text-[13px] h-9 px-3',
  md: 'text-sm h-11 px-5',
  lg: 'text-[15px] h-12 px-6'
};

export function Button({ variant = 'primary', size = 'md', icon, full, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cx(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], full && 'w-full', className)} {...rest}>
      {icon}
      {children}
    </button>);

}

/* ----------------------------------- Card ---------------------------------- */

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('bg-white border border-line rounded-card shadow-card', className)} {...rest}>
      {children}
    </div>);

}

export function CardHeader({
  title,
  subtitle,
  action,
  className





}: {title: React.ReactNode;subtitle?: React.ReactNode;action?: React.ReactNode;className?: string;}) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-5 py-4 border-b border-line', className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-ink leading-tight">{title}</h3>
        {subtitle && <p className="text-[13px] text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}

/* ---------------------------------- Badge ---------------------------------- */

const TONE: Record<StatusTone, string> = {
  success: 'bg-forest-50 text-forest-700 border-forest-200',
  warning: 'bg-gold-50 text-gold-600 border-gold-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-cream text-ink-muted border-line',
  pending: 'bg-amber-50 text-amber-700 border-amber-200'
};

export function Badge({ tone = 'neutral', children, className }: {tone?: StatusTone;children: React.ReactNode;className?: string;}) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium', TONE[tone], className)}>
      {children}
    </span>);

}

export function statusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (['active', 'approved', 'paid', 'cleared', 'published', 'graded', 'present', 'complete', 'completed', 'success', 'connected', 'enrolled', 'confirmed', 'resolved', 'admitted', 'accepted'].some((k) => s.includes(k))) return 'success';
  if (['pending', 'in progress', 'under review', 'awaiting', 'scheduled', 'invited', 'part paid', 'planning', 'submitted', 'trial', 'interview', 'offer'].some((k) => s.includes(k))) return 'pending';
  if (['late', 'overdue', 'requires action', 'warning', 'draft', 'on leave', 'not started'].some((k) => s.includes(k))) return 'warning';
  if (['rejected', 'failed', 'suspended', 'blocked', 'absent', 'not submitted', 'inactive', 'closed', 'disabled'].some((k) => s.includes(k))) return 'danger';
  return 'neutral';
}

export function StatusBadge({ status }: {status: string;}) {
  const tone = statusTone(status);
  const dot: Record<StatusTone, string> = {
    success: 'bg-forest-500',
    warning: 'bg-gold-400',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
    neutral: 'bg-ink-soft',
    pending: 'bg-amber-500'
  };
  return (
    <Badge tone={tone}>
      <span className={cx('h-1.5 w-1.5 rounded-full', dot[tone])} aria-hidden="true" />
      {status}
    </Badge>);

}

/* ----------------------------------- Stat ---------------------------------- */

export function Stat({
  label,
  value,
  sub,
  icon,
  tone = 'neutral'






}: {label: string;value: React.ReactNode;sub?: React.ReactNode;icon?: React.ReactNode;tone?: 'neutral' | 'primary' | 'gold' | 'danger';}) {
  const ring: Record<string, string> = {
    neutral: 'bg-cream text-forest-700',
    primary: 'bg-forest-50 text-forest-700',
    gold: 'bg-gold-50 text-gold-600',
    danger: 'bg-red-50 text-red-600'
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {icon && <span className={cx('h-8 w-8 rounded-lg grid place-items-center', ring[tone])}>{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[12.5px] text-ink-muted">{sub}</p>}
    </Card>);

}

/* --------------------------------- Progress -------------------------------- */

export function Progress({ value, tone = 'forest', className, label }: {value: number;tone?: 'forest' | 'gold' | 'red';className?: string;label?: string;}) {
  const bar: Record<string, string> = { forest: 'bg-forest-600', gold: 'bg-gold-400', red: 'bg-red-500' };
  return (
    <div className={cx('w-full', className)}>
      <div className="h-2 w-full rounded-full bg-cream overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={cx('h-full rounded-full transition-[width] duration-300 ease-sala', bar[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>);

}

/* --------------------------------- Avatar ---------------------------------- */

export function Avatar({ initials, size = 'md', tone = 'forest' }: {initials: string;size?: 'sm' | 'md' | 'lg';tone?: 'forest' | 'gold';}) {
  const s = { sm: 'h-8 w-8 text-[11px]', md: 'h-10 w-10 text-[13px]', lg: 'h-14 w-14 text-base' }[size];
  const t = tone === 'gold' ? 'bg-gold-100 text-gold-600' : 'bg-forest-100 text-forest-700';
  return <span className={cx('grid place-items-center rounded-full font-semibold shrink-0', s, t)}>{initials}</span>;
}

/* ---------------------------------- Forms ---------------------------------- */

export function Field({ label, hint, required, children, className }: {label: string;hint?: string;required?: boolean;children: React.ReactNode;className?: string;}) {
  return (
    <label className={cx('block', className)}>
      <span className="block text-[13px] font-medium text-ink mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-ink-muted">{hint}</span>}
    </label>);

}

const CONTROL = 'w-full h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-soft focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors duration-150';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(CONTROL, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(CONTROL, 'pr-8', props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(CONTROL, 'h-auto min-h-[104px] py-2.5 leading-relaxed', props.className)} />;
}

export function Checkbox({ label, ...rest }: {label: string;} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-ink cursor-pointer">
      <input type="checkbox" {...rest} className="mt-0.5 h-4 w-4 rounded border-line text-forest-700 focus:ring-forest-200" />
      <span>{label}</span>
    </label>);

}

/* ------------------------------- Page header ------------------------------- */

export function PageHeader({ title, subtitle, actions }: {title: string;subtitle?: string;actions?: React.ReactNode;}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 className="font-serif text-[26px] sm:text-[30px] leading-tight text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>);

}

export function SectionTitle({ eyebrow, title, intro, center }: {eyebrow?: string;title: string;intro?: string;center?: boolean;}) {
  return (
    <div className={cx('max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && <p className="text-[13px] font-semibold text-gold-600 mb-2">{eyebrow}</p>}
      <h2 className="font-serif text-[28px] sm:text-[36px] leading-[1.15] text-ink">{title}</h2>
      {intro && <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{intro}</p>}
    </div>);

}