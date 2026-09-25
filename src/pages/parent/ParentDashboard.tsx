import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarCheckIcon, ClipboardListIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge } from '../../components/ui/primitives';
import { AreaChartBlock, ChartFrame } from '../../components/ui/data';
import { ASSIGNMENTS, ATTENDANCE_SUMMARY, SUBJECT_SCORES, TERM, TERM_TREND } from '../../data/academics';
import { FEE_SUMMARY, formatKES } from '../../data/finance';
import { EVENTS } from '../../data/school';
import { GUARDIANS, STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

export function ParentDashboard() {
  const { activeChildId, setActiveChildId } = useApp();
  const parent = GUARDIANS[0];
  const children = STUDENTS.filter((s) => parent.childIds.includes(s.id));
  const child = children.find((c) => c.id === activeChildId) ?? children[0];
  const average = Math.round(SUBJECT_SCORES.reduce((a, s) => a + s.score, 0) / SUBJECT_SCORES.length);
  const upcoming = ASSIGNMENTS.filter((a) => ['Not Started', 'In Progress', 'Late'].includes(a.status));

  return (
    <div>
      <PageHeader
        title={`Good morning, ${parent.name.split(' ')[1]}`}
        subtitle={`${TERM} · Here is how ${child.name.split(' ')[0]} is doing this week.`}
        actions={
        <Link to="/parent/fees">
            <Button icon={<WalletIcon size={16} />}>Pay school fees</Button>
          </Link>
        } />
      

      {/* Child switcher */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        {children.map((c) => {
          const on = c.id === child.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveChildId(c.id)}
              aria-pressed={on}
              className={
              'flex items-center gap-3 rounded-card border px-3.5 py-2.5 transition-colors duration-150 ' + (
              on ? 'border-forest-600 bg-white shadow-card' : 'border-line bg-white/60 hover:border-forest-300')
              }>
              
              <Avatar initials={c.avatarInitials} size="sm" tone={on ? 'forest' : 'gold'} />
              <span className="text-left">
                <span className="block text-[13.5px] font-semibold text-ink">{c.name}</span>
                <span className="block text-[12px] text-ink-muted">
                  {c.className} {c.stream} · {c.admissionNo}
                </span>
              </span>
            </button>);

        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Term average" value={`${average}%`} sub="Up 2 points from Term 2" icon={<TrendingUpIcon size={16} />} tone="primary" />
        <Stat label="Attendance" value={`${ATTENDANCE_SUMMARY.percentage}%`} sub={`${ATTENDANCE_SUMMARY.absent} absences · ${ATTENDANCE_SUMMARY.late} late`} icon={<CalendarCheckIcon size={16} />} />
        <Stat label="Open assignments" value={upcoming.length} sub="1 overdue — Social Studies" icon={<ClipboardListIcon size={16} />} tone="gold" />
        <Stat label="Fee balance" value={formatKES(FEE_SUMMARY.balance)} sub={`Due ${FEE_SUMMARY.deadline}`} icon={<WalletIcon size={16} />} tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <ChartFrame
            title="Performance trend"
            subtitle="Overall average across the last six terms"
            action={
            <Link to={`/parent/child/${child.id}/Academics`} className="text-[13px] font-medium text-forest-700 hover:underline">
                Full breakdown
              </Link>
            }>
            
            <AreaChartBlock data={TERM_TREND} xKey="term" areaKey="average" name="Average %" />
          </ChartFrame>

          <Card>
            <CardHeader
              title="Subjects this term"
              subtitle="Where extra attention will make the biggest difference"
              action={
              <Link to={`/parent/child/${child.id}/Results`}>
                  <Button variant="secondary" size="sm">
                    View results
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {SUBJECT_SCORES.map((s) =>
              <li key={s.subject} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium text-ink truncate">{s.subject}</p>
                      {s.score < 60 && <Badge tone="warning">Needs support</Badge>}
                    </div>
                    <p className="text-[12.5px] text-ink-muted mt-0.5 truncate">{s.teacher}</p>
                  </div>
                  <div className="w-28 hidden sm:block">
                    <Progress value={s.score} tone={s.score < 60 ? 'gold' : 'forest'} label={`${s.subject} score`} />
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-[15px] font-semibold text-ink tabular-nums">{s.score}%</span>
                    <span className="block text-[12px] text-ink-muted">Grade {s.grade}</span>
                  </div>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Assignments to watch"
              subtitle="Due in the next seven days"
              action={
              <Link to={`/parent/child/${child.id}/Assignments`}>
                  <Button variant="secondary" size="sm">
                    All assignments
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {upcoming.map((a) =>
              <li key={a.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-ink truncate">{a.title}</p>
                    <p className="text-[12.5px] text-ink-muted mt-0.5">
                      {a.subject} · {a.teacher} · due {a.due}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Fees — Term 3" subtitle={`Deadline ${FEE_SUMMARY.deadline}`} />
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-ink-muted">Paid</span>
                <span className="text-[15px] font-semibold text-ink tabular-nums">{formatKES(FEE_SUMMARY.paid)}</span>
              </div>
              <Progress className="mt-2" value={FEE_SUMMARY.paid / FEE_SUMMARY.total * 100} label="Fees paid" />
              <div className="mt-2 flex items-baseline justify-between text-[13px]">
                <span className="text-ink-muted">Balance</span>
                <span className="font-semibold text-red-600 tabular-nums">{formatKES(FEE_SUMMARY.balance)}</span>
              </div>
              <Link to="/parent/fees">
                <Button full className="mt-4">
                  Pay with M-Pesa
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="Upcoming events" />
            <ul className="divide-y divide-line">
              {EVENTS.slice(0, 4).map((e) =>
              <li key={e.id} className="px-5 py-3">
                  <p className="text-[13.5px] font-medium text-ink leading-snug">{e.title}</p>
                  <p className="text-[12.5px] text-ink-muted mt-0.5">
                    {e.date} · {e.time}
                  </p>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/parent/events" className="text-[13px] font-medium text-forest-700 hover:underline inline-flex items-center gap-1.5">
                Full calendar <ArrowRightIcon size={14} />
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="From the school" />
            <ul className="divide-y divide-line">
              {[
              { t: 'Parent–Teacher Consultation Day', b: 'Booking opens Monday at 8:00am. Slots are 15 minutes.', w: 'Today' },
              { t: 'Term 3 examination timetable', b: 'Assessments run 20 – 30 October.', w: '2 days ago' },
              { t: 'Grade 4 trip consent form', b: 'Please confirm by Friday 26 September.', w: '4 days ago' }].
              map((m) =>
              <li key={m.t} className="px-5 py-3.5">
                  <p className="text-[13.5px] font-medium text-ink">{m.t}</p>
                  <p className="text-[12.5px] text-ink-muted mt-0.5 leading-relaxed">{m.b}</p>
                  <p className="text-[11.5px] text-ink-soft mt-1">{m.w}</p>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/parent/messages" className="text-[13px] font-medium text-forest-700 hover:underline">
                Open messages
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}