import React, { useMemo, useState } from 'react';
import { CheckIcon, ClockIcon, SaveIcon, XIcon } from 'lucide-react';
import { Avatar, Button, Card, CardHeader, PageHeader, Stat, StatusBadge, cx } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { BarChartBlock, ChartFrame } from '../../components/ui/data';
import { CLASS_ATTENDANCE_TREND } from '../../data/academics';
import { STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiAttendanceSession } from '../../api/types';

type Mark = 'present' | 'absent' | 'late';

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function dayMonth(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
}

export function TeacherAttendance() {
  const live = useApiLive();
  const sessions = useList<ApiAttendanceSession>('/attendance/sessions/');
  const learners = STUDENTS.filter((s) => s.className === 'Grade 4');
  const [marks, setMarks] = useState<Record<string, Mark>>(() =>
  Object.fromEntries(learners.map((s, i) => [s.id, i === 4 ? 'absent' : i === 6 ? 'late' : 'present'])) as Record<string, Mark>
  );
  const [saved, setSaved] = useState(false);
  const { toast } = useApp();

  const liveSessions = useMemo(() => {
    if (!sessions.data) return null;
    return sessions.data.map((s) => ({
      id: s.id,
      date: dayMonth(s.attendance_date),
      className: s.class_name,
      remarks: s.remarks || '—',
      status: titleCase(s.status)
    }));
  }, [sessions.data]);

  const counts = {
    present: Object.values(marks).filter((m) => m === 'present').length,
    absent: Object.values(marks).filter((m) => m === 'absent').length,
    late: Object.values(marks).filter((m) => m === 'late').length
  };

  const save = () => {
    setSaved(true);
    toast({ tone: 'success', title: 'Register submitted', body: `${counts.present} present, ${counts.absent} absent, ${counts.late} late. Parents of absent learners notified.` });
  };

  const OPTIONS: {key: Mark;label: string;icon: React.ReactNode;on: string;}[] = [
  { key: 'present', label: 'Present', icon: <CheckIcon size={15} />, on: 'bg-forest-600 border-forest-600 text-white' },
  { key: 'late', label: 'Late', icon: <ClockIcon size={15} />, on: 'bg-gold-400 border-gold-400 text-forest-900' },
  { key: 'absent', label: 'Absent', icon: <XIcon size={15} />, on: 'bg-red-500 border-red-500 text-white' }];


  return (
    <div>
      <PageHeader
        title="Attendance register"
        subtitle="Grade 4 Acacia · Friday 20 September 2026 · morning register"
        actions={
        <Button size="sm" icon={<SaveIcon size={15} />} onClick={save}>
            Submit register
          </Button>
        } />
      

      {live && sessions.error &&
      <p className="text-sm text-rose-600">{sessions.error}</p>
      }

      {saved &&
      <div className="mb-6">
          <Alert tone="success" title="Register submitted for today">Parents of absent learners have been sent an SMS.</Alert>
        </div>
      }

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Present" value={counts.present} sub="of 12 learners" tone="primary" />
        <Stat label="Absent" value={counts.absent} sub="Parents notified on submit" tone="danger" />
        <Stat label="Late" value={counts.late} sub="Arrived after 8:00am" tone="gold" />
        <Stat label="Month rate" value="96%" sub="September average" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader title="Mark the register" subtitle="Tap a status for each learner" />
          <ul className="divide-y divide-line">
            {learners.map((s) =>
            <li key={s.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                <Avatar initials={s.avatarInitials} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink truncate">{s.name}</p>
                  <p className="text-[12px] text-ink-muted">{s.admissionNo}</p>
                </div>
                <div className="flex gap-1.5" role="group" aria-label={`Attendance for ${s.name}`}>
                  {OPTIONS.map((o) => {
                  const on = marks[s.id] === o.key;
                  return (
                    <button
                      key={o.key}
                      onClick={() => setMarks((m) => ({ ...m, [s.id]: o.key }))}
                      aria-pressed={on}
                      className={cx(
                        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 h-9 text-[12.5px] font-medium transition-colors duration-150',
                        on ? o.on : 'border-line bg-white text-ink-muted hover:border-forest-300'
                      )}>
                      
                        {o.icon}
                        <span className="hidden sm:inline">{o.label}</span>
                      </button>);

                })}
                </div>
              </li>
            )}
          </ul>
          <div className="px-5 py-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-muted">Registers close at 9:30am. Late changes require the school office.</p>
            <Button size="sm" onClick={save}>
              Submit register
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {liveSessions &&
          <Card>
            <CardHeader title="Recorded registers" subtitle={`${liveSessions.length} sessions from the API`} />
            <ul className="divide-y divide-line">
              {liveSessions.slice(0, 8).map((s) =>
              <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate">{s.className}</p>
                  <p className="text-[12.5px] text-ink-muted truncate">
                    {s.date} · {s.remarks}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </li>
              )}
              {liveSessions.length === 0 &&
              <li className="px-5 py-4 text-[13px] text-ink-muted">No registers recorded yet.</li>
              }
            </ul>
          </Card>
          }

          <ChartFrame title="Attendance trend" subtitle="Monthly rate — Grade 4 Acacia">
            <BarChartBlock data={CLASS_ATTENDANCE_TREND} xKey="month" bars={[{ key: 'rate', name: 'Attendance %', color: '#1F5E43' }]} />
          </ChartFrame>

          <Card>
            <CardHeader title="Absence follow-up" subtitle="Needs your attention" />
            <ul className="divide-y divide-line">
              {[
              ['Samuel Kiptoo', '3 absences in 2 weeks — no notes received'],
              ['Aisha Hassan', 'Third late arrival this month']].
              map(([n, r]) =>
              <li key={n} className="px-5 py-3">
                  <p className="text-[13.5px] font-medium text-ink">{n}</p>
                  <p className="text-[12.5px] text-ink-muted">{r}</p>
                  <Button variant="secondary" size="sm" className="mt-2">
                    Contact parent
                  </Button>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}