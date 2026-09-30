import React, { useMemo } from 'react';
import { Badge, Card, CardHeader, PageHeader, cx } from '../../components/ui/primitives';
import { DUTY_ROSTER } from '../../data/hr';
import { EVENTS } from '../../data/school';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiEvent } from '../../api/types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = ['8:00', '9:20', '10:50', '12:00', '2:00'];

const TIMETABLE: Record<string, (string | null)[]> = {
  Monday: ['Maths · G4', 'Science · G4', 'Maths · G4', 'Pastoral · G4', 'Games'],
  Tuesday: ['Science · G4', 'Maths · G4', null, 'Maths · G4', 'Clubs'],
  Wednesday: ['Maths · G4', 'Assembly', 'Science · G4', 'Maths · G4', null],
  Thursday: ['Science · G4', 'Maths · G4', 'Maths · G4', null, 'Staff meeting'],
  Friday: ['Maths · G4', 'Science · G4', 'Maths · G4', 'Pastoral · G4', 'Games']
};

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
  const eventsRes = useList<ApiEvent>('/events/');

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

  return (
    <div>
      <PageHeader title="My calendar" subtitle="Term 3 timetable, duties and school events in one view." />

      {live && eventsRes.error &&
      <p className="text-sm text-rose-600">{eventsRes.error}</p>
      }

      <Card className="overflow-hidden">
        <CardHeader title="Weekly timetable" subtitle="Grade 4 Acacia · 23 periods per week" />
        <div className="overflow-x-auto sala-scroll">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-cream/60 border-b border-line">
                <th scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted w-24">
                  Time
                </th>
                {DAYS.map((d) =>
                <th key={d} scope="col" className="px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                    {d}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((p, i) =>
              <tr key={p} className="border-b border-line/70 last:border-0">
                  <th scope="row" className="px-4 py-3 text-left text-[13px] font-medium text-forest-700 tabular-nums">
                    {p}
                  </th>
                  {DAYS.map((d) => {
                  const cell = TIMETABLE[d][i];
                  return (
                    <td key={d} className="px-3 py-2.5">
                        {cell ?
                      <span className={cx('block rounded-lg px-3 py-2 text-[13px] font-medium', cell.includes('Maths') ? 'bg-forest-50 text-forest-800' : cell.includes('Science') ? 'bg-gold-50 text-gold-600' : 'bg-cream text-ink-muted')}>
                            {cell}
                          </span> :

                      <span className="block px-3 py-2 text-[13px] text-ink-soft">Free</span>
                      }
                      </td>);

                })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="My duties" subtitle="This week" />
          <ul className="divide-y divide-line">
            {DUTY_ROSTER.map((d) =>
            <li key={d.day + d.time} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{d.duty}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    {d.day} · {d.time} · {d.location}
                  </p>
                </div>
                <Badge tone={d.teacher === 'Mr. Brian Kimani' ? 'success' : 'neutral'}>{d.teacher === 'Mr. Brian Kimani' ? 'You' : d.teacher.split(' ').slice(-1)}</Badge>
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="School events" subtitle="Next six weeks" />
          <ul className="divide-y divide-line">
            {EVENTS.map((e) =>
            <li key={e.id} className="px-5 py-3 flex items-start gap-3.5">
                <div className="w-12 shrink-0 rounded-lg bg-forest-50 text-center py-1.5">
                  <span className="block text-[16px] font-semibold text-forest-800 leading-none">{e.date.split(' ')[0]}</span>
                  <span className="block text-[11px] uppercase text-forest-600 mt-0.5">{e.date.split(' ')[1]}</span>
                </div>
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{e.title}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    {e.time} · {e.location}
                  </p>
                </div>
              </li>
            )}
            {events.length === 0 &&
            <li className="px-5 py-4 text-[13px] text-ink-muted">No events scheduled.</li>
            }
          </ul>
        </Card>
      </div>
    </div>);

}