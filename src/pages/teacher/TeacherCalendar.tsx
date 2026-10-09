import React, { useMemo } from 'react';
import { Badge, Card, CardHeader, PageHeader, cx } from '../../components/ui/primitives';
import { DUTY_ROSTER } from '../../data/hr';
import { EVENTS } from '../../data/school';
import { useApiLive, useList, useObject } from '../../api/hooks';
import type { ApiEvent } from '../../api/types';

const DAY_LABELS: Record<string, string> = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday' };
const FALLBACK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const FALLBACK_PERIODS = [
  { name: 'Period 1', start_time: '08:00' },
  { name: 'Period 2', start_time: '08:40' },
  { name: 'Period 3', start_time: '09:40' },
  { name: 'Period 4', start_time: '10:20' },
  { name: 'Period 5', start_time: '11:40' },
  { name: 'Period 6', start_time: '12:20' }
];

type Period = { id?: string; name: string; start_time: string; end_time?: string; display_order?: number };
type Slot = { day_of_week: string; period: string; period_name?: string; subject_name?: string; class_name?: string; teacher_name?: string; room?: string };

type WeekPayload = { periods: Period[]; days: string[]; slots: Slot[] };

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function dayMonth(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function clockTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
}

export function TeacherCalendar() {
  const live = useApiLive();
  const eventsRes = useList<ApiEvent>('events/');
  const week = useObject<WeekPayload>('timetable/slots/week/');

  const liveEvents = useMemo(() => {
    if (!eventsRes.data) return null;
    return eventsRes.data.map((e) => ({
      id: e.id,
      title: e.title,
      date: dayMonth(e.start_time),
      time: e.end_time ? `${clockTime(e.start_time)} – ${clockTime(e.end_time)}` : clockTime(e.start_time),
      type: titleCase(e.event_type ?? ''),
      location: e.venue ?? '—',
      status: titleCase(e.status)
    }));
  }, [eventsRes.data]);

  const events = liveEvents ?? EVENTS;

  // Build timetable grid from API or fallback demo data
  const periods: Period[] = live && week.data?.periods?.length
    ? week.data.periods.filter((p) => !/break|lunch/i.test(p.name))
    : FALLBACK_PERIODS;
  const days: string[] = live && week.data?.days?.length ? week.data.days : FALLBACK_DAYS;

  const slotMap = useMemo(() => {
    const map = new Map<string, Slot>();
    if (live && week.data?.slots) {
      for (const s of week.data.slots) {
        map.set(`${s.day_of_week}-${s.period}`, s);
      }
    }
    return map;
  }, [live, week.data]);

  const className = live && week.data?.slots?.[0]?.class_name
    ? week.data.slots[0].class_name
    : 'Grade 9 A';
  const periodCount = live && week.data?.slots ? week.data.slots.length : 23;

  return (
    <div>
      <PageHeader
        title="My calendar"
        subtitle={live ? `Weekly timetable · ${className} · ${periodCount} periods` : 'Term 3 timetable, duties and school events in one view.'} />

      {live && week.error && <p className="mb-3 text-sm text-rose-600">{week.error}</p>}
      {live && eventsRes.error && <p className="text-sm text-rose-600">{eventsRes.error}</p>}

      <Card className="overflow-hidden">
        <CardHeader title="Weekly timetable" subtitle={live ? `${className} · ${periods.length} teaching periods` : 'Grade 4 Acacia · 23 periods per week'} />
        <div className="overflow-x-auto sala-scroll">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-cream/60 border-b border-line">
                <th scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted w-28">
                  Time
                </th>
                {days.map((d) => (
                  <th key={d} scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                    {DAY_LABELS[d] ?? d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => {
                const pid = p.id ?? p.name;
                return (
                  <tr key={pid} className="border-b border-line/70 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left text-[13px] font-medium text-forest-700 tabular-nums">
                      <span className="block">{p.name}</span>
                      {p.start_time && <span className="block text-[11px] text-ink-muted font-normal">{p.start_time}</span>}
                    </th>
                    {days.map((d) => {
                      const slot = slotMap.get(`${d}-${pid}`);
                      const label = slot
                        ? `${slot.subject_name ?? '—'}${slot.class_name ? ` · ${slot.class_name}` : ''}`
                        : (live ? null : null);
                      return (
                        <td key={d} className="px-3 py-2.5">
                          {label ? (
                            <span className="block rounded-lg px-3 py-2 text-[13px] font-medium bg-gold-50 text-gold-600">
                              {label}
                              {slot.room && <span className="block text-[11px] font-normal text-ink-muted mt-0.5">{slot.room}</span>}
                            </span>
                          ) : (
                            <span className="block px-3 py-2 text-[13px] text-ink-soft">{live ? 'Free' : '—'}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="My duties" subtitle="This week" />
          <ul className="divide-y divide-line">
            {DUTY_ROSTER.map((d) => (
              <li key={d.day + d.time} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{d.duty}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    {d.day} · {d.time} · {d.location}
                  </p>
                </div>
                <Badge tone={d.teacher === 'Mr. Brian Kimani' ? 'success' : 'neutral'}>
                  {d.teacher === 'Mr. Brian Kimani' ? 'You' : d.teacher.split(' ').slice(-1)}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="School events" subtitle="Next six weeks" />
          <ul className="divide-y divide-line">
            {(events.length ? events : EVENTS).map((e: any) => (
              <li key={e.id} className="px-5 py-3 flex items-start gap-3.5">
                <div className="w-12 shrink-0 rounded-lg bg-forest-50 text-center py-1.5">
                  <span className="block text-[16px] font-semibold text-forest-800 leading-none">{String(e.date).split(' ')[0]}</span>
                  <span className="block text-[11px] uppercase text-forest-600 mt-0.5">{String(e.date).split(' ')[1]}</span>
                </div>
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{e.title}</p>
                  <p className="text-[12.5px] text-ink-muted">{e.time} · {e.location}</p>
                </div>
              </li>
            ))}
            {events.length === 0 && (
              <li className="px-5 py-4 text-[13px] text-ink-muted">No events scheduled.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
