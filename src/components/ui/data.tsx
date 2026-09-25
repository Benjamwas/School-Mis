import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { Card, cx } from './primitives';

/* ----------------------------------- Tabs ---------------------------------- */

export function Tabs({ tabs, active, onChange }: {tabs: string[];active: string;onChange: (t: string) => void;}) {
  return (
    <div className="border-b border-line overflow-x-auto sala-scroll" role="tablist">
      <div className="flex gap-1 min-w-max">
        {tabs.map((t) => {
          const on = t === active;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={on}
              onClick={() => onChange(t)}
              className={cx(
                'relative px-3.5 py-2.5 text-[13.5px] font-medium rounded-t-md transition-colors duration-150',
                on ? 'text-forest-800' : 'text-ink-muted hover:text-ink'
              )}>
              
              {t}
              {on && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-forest-700" />}
            </button>);

        })}
      </div>
    </div>);

}

/* ---------------------------------- Table ---------------------------------- */

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right';
  hideOnMobile?: boolean;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  onRowClick,
  caption,
  mobileTitle






}: {columns: Column<T>[];rows: T[];onRowClick?: (row: T) => void;caption?: string;mobileTitle?: (row: T) => React.ReactNode;}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto sala-scroll">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-line bg-cream/60">
              {columns.map((c) =>
              <th key={c.key} scope="col" className={cx('px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-ink-muted', c.align === 'right' ? 'text-right' : 'text-left')}>
                  {c.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) =>
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cx('border-b border-line/70 last:border-0 transition-colors duration-150', onRowClick && 'cursor-pointer hover:bg-forest-50/50')}>
              
                {columns.map((c) =>
              <td key={c.key} className={cx('px-5 py-3 align-middle text-ink', c.align === 'right' && 'text-right tabular-nums')}>
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden divide-y divide-line">
        {rows.map((row, i) =>
        <li key={i} onClick={onRowClick ? () => onRowClick(row) : undefined} className="px-4 py-3.5">
            <p className="text-sm font-semibold text-ink mb-1.5">
              {mobileTitle ? mobileTitle(row) : columns[0].render ? columns[0].render(row) : String(row[columns[0].key])}
            </p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {columns.slice(1).filter((c) => !c.hideOnMobile).map((c) =>
            <div key={c.key} className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wide text-ink-soft">{c.header}</dt>
                  <dd className="text-[13px] text-ink truncate">{c.render ? c.render(row) : String(row[c.key] ?? '')}</dd>
                </div>
            )}
            </dl>
          </li>
        )}
      </ul>
    </>);

}

export function TableToolbar({
  query,
  onQuery,
  placeholder = 'Search…',
  filters,
  right






}: {query: string;onQuery: (v: string) => void;placeholder?: string;filters?: React.ReactNode;right?: React.ReactNode;}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-line">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full h-10 rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-ink-soft focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors duration-150" />
          
        </div>
        {filters &&
        <div className="flex items-center gap-2">
            <SlidersHorizontalIcon size={15} className="text-ink-soft hidden sm:block" />
            {filters}
          </div>
        }
      </div>
      {right}
    </div>);

}

export function Pagination({ page, pages, onPage, total }: {page: number;pages: number;onPage: (p: number) => void;total: number;}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-line text-[13px] text-ink-muted">
      <span>
        Page {page} of {pages} · {total} records
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="h-8 w-8 grid place-items-center rounded-md border border-line disabled:opacity-40 hover:bg-cream transition-colors duration-150">
          
          <ChevronLeftIcon size={15} />
        </button>
        <button
          onClick={() => onPage(Math.min(pages, page + 1))}
          disabled={page === pages}
          aria-label="Next page"
          className="h-8 w-8 grid place-items-center rounded-md border border-line disabled:opacity-40 hover:bg-cream transition-colors duration-150">
          
          <ChevronRightIcon size={15} />
        </button>
      </div>
    </div>);

}

/* ---------------------------------- Charts --------------------------------- */

const AXIS = { stroke: '#8A9891', fontSize: 12 };
const TOOLTIP_STYLE = {
  contentStyle: { borderRadius: 10, border: '1px solid #E5E2DA', fontSize: 12, boxShadow: '0 12px 40px -12px rgba(16,32,26,0.28)' }
};

export function ChartFrame({ title, subtitle, children, action }: {title: string;subtitle?: string;children: React.ReactNode;action?: React.ReactNode;}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-[12.5px] text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-56">{children}</div>
    </Card>);

}

export function BarChartBlock({ data, xKey, bars }: {data: any[];xKey: string;bars: {key: string;name: string;color: string;}[];}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE4" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS} />
        <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: '#F1F7F3' }} />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b) =>
        <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} maxBarSize={38} />
        )}
      </BarChart>
    </ResponsiveContainer>);

}

export function LineChartBlock({ data, xKey, lines }: {data: any[];xKey: string;lines: {key: string;name: string;color: string;}[];}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE4" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS} />
        <Tooltip {...TOOLTIP_STYLE} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((l) =>
        <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        )}
      </LineChart>
    </ResponsiveContainer>);

}

export function AreaChartBlock({ data, xKey, areaKey, name, color = '#1F5E43' }: {data: any[];xKey: string;areaKey: string;name: string;color?: string;}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="salaArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE4" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Area type="monotone" dataKey={areaKey} name={name} stroke={color} strokeWidth={2.5} fill="url(#salaArea)" />
      </AreaChart>
    </ResponsiveContainer>);

}

const PIE_COLORS = ['#1F5E43', '#D4A23A', '#8DBCA4', '#5B9A7C'];

export function DonutChartBlock({ data }: {data: {name: string;value: number;}[];}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="86%" paddingAngle={2} stroke="none">
          {data.map((_, i) =>
          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          )}
        </Pie>
        <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => `${v}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>);

}

/* -------------------------------- Timeline --------------------------------- */

export function Timeline({ items }: {items: {title: string;meta?: string;body?: string;state?: 'complete' | 'active' | 'pending' | 'danger';}[];}) {
  const dot = {
    complete: 'bg-forest-600 border-forest-600',
    active: 'bg-white border-gold-400 ring-4 ring-gold-100',
    pending: 'bg-white border-line',
    danger: 'bg-red-500 border-red-500'
  };
  return (
    <ol className="relative">
      {items.map((it, i) =>
      <li key={i} className="relative pl-8 pb-6 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-[7px] top-4 bottom-0 w-px bg-line" aria-hidden="true" />}
          <span className={cx('absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2', dot[it.state ?? 'pending'])} aria-hidden="true" />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-sm font-semibold text-ink">{it.title}</p>
            {it.meta && <span className="text-[12.5px] text-ink-muted">{it.meta}</span>}
          </div>
          {it.body && <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{it.body}</p>}
        </li>
      )}
    </ol>);

}

/* ------------------------------ Filter select ------------------------------ */

export function FilterSelect({ value, onChange, options, label }: {value: string;onChange: (v: string) => void;options: string[];label: string;}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-10 rounded-lg border border-line bg-white px-3 pr-8 text-[13px] text-ink focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors duration-150">
      
      {options.map((o) =>
      <option key={o}>{o}</option>
      )}
    </select>);

}

export function useTableState<T>(rows: T[], matcher: (row: T, q: string) => boolean, pageSize = 8) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const filtered = query ? rows.filter((r) => matcher(r, query.toLowerCase())) : rows;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * pageSize, current * pageSize);
  return { query, setQuery: (v: string) => {setQuery(v);setPage(1);}, page: current, pages, setPage, slice, total: filtered.length };
}