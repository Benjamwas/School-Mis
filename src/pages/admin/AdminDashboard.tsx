import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, GraduationCapIcon, LifeBuoyIcon, SendIcon, UserSquare2Icon, UsersIcon, WalletIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge } from '../../components/ui/primitives';
import { AreaChartBlock, BarChartBlock, ChartFrame, DonutChartBlock } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { COLLECTIONS_TREND, FINANCE_SUMMARY, PAYMENT_METHOD_SPLIT, formatKES } from '../../data/finance';
import { PIPELINE_COUNTS } from '../../data/crm';
import { CLASS_ATTENDANCE_TREND, CLASS_SUBJECT_AVERAGES } from '../../data/academics';
import { EVENTS } from '../../data/school';
import { STAFF_LEAVE_QUEUE, HR_TICKETS } from '../../data/hr';
import { useDashboard } from '../../api/hooks';
import type { DashboardAttendance, DashboardFinance, DashboardOverview } from '../../api/types';

export function AdminDashboard() {
  const overview = useDashboard<DashboardOverview>('overview');
  const finance = useDashboard<DashboardFinance>('finance');
  const attendance = useDashboard<DashboardAttendance>('attendance');

  const totalLearners = useMemo(() => (overview.data ? overview.data.students.total : '1,148'), [overview]);
  const totalLearnersSub = useMemo(() => (overview.data ? `${overview.data.academics.active_enrollments} active` : '+38 this term'), [overview]);
  const teachingStaff = overview.data ? overview.data.staff.teachers : '86';
  const parentsOnPortal = overview.data ? overview.data.students.parents : '932';
  const feesCollected = finance.data ? formatKES(finance.data.collected) : formatKES(FINANCE_SUMMARY.collected);
  const feesOutstanding = finance.data ? formatKES(finance.data.outstanding) : formatKES(FINANCE_SUMMARY.outstanding);
  const pendingApplications = overview.data ? overview.data.pending_admissions : '24';
  const pendingApplicationsSub = overview.data ? 'awaiting decision' : '5 awaiting decision';
  const attendanceToday = overview.data ? `${overview.data.attendance.rate}%` : '96.2%';
  const attendanceSub = overview.data
    ? `${overview.data.attendance.present} of ${overview.data.attendance.records} present`
    : '1,104 of 1,148 present';
  const openHrItems = overview.data ? overview.data.pending_leave : 6;
  const openHrSub = overview.data ? 'leave awaiting approval' : '2 leave · 4 tickets';
  const currentYear = overview.data?.academics.current_year;
  const alertPending = overview.data ? overview.data.pending_admissions : 5;

  const attendanceTrend = useMemo(() => {
    const trend = attendance.data?.weekly_trend;
    if (!trend || !trend.length) return CLASS_ATTENDANCE_TREND;
    return trend.map((t) => ({
      month: `${t.date.slice(8)}/${t.date.slice(5, 7)}`,
      rate: Math.round((t.present / Math.max(t.total, 1)) * 100),
    }));
  }, [attendance]);

  return (
    <div>
      <PageHeader
        title="School dashboard"
        subtitle={currentYear ? `${currentYear} · Sunrise Academy` : 'St. Ann Lifred Academy · Term 3 2026 · Friday 20 September'}
        actions={
        <>
            <Link to="/admin/communication">
              <Button variant="secondary" size="sm" icon={<SendIcon size={15} />}>
                Send announcement
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button size="sm">Generate report</Button>
            </Link>
          </>
        } />


      {alertPending > 0 &&
      <div className="mb-6">
        <Alert tone="warning" title={`${alertPending} applications are awaiting a decision`}>
          Two have passed the ten-working-day commitment. <Link to="/admin/admissions" className="underline font-medium">Review applications</Link>
        </Alert>
      </div>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total learners" value={totalLearners} sub={String(totalLearnersSub)} icon={<GraduationCapIcon size={16} />} tone="primary" />
        <Stat label="Teaching staff" value={teachingStaff} sub="on staff roll" icon={<UserSquare2Icon size={16} />} />
        <Stat label="Parents on portal" value={parentsOnPortal} sub="families on record" icon={<UsersIcon size={16} />} />
        <Stat label="Fees collected" value={feesCollected} sub={`${feesOutstanding} outstanding`} icon={<WalletIcon size={16} />} tone="gold" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New admissions" value="38" sub="January 2027 intake" />
        <Stat label="Pending applications" value={pendingApplications} sub={pendingApplicationsSub} tone="gold" />
        <Stat label="Attendance today" value={attendanceToday} sub={attendanceSub} tone="primary" />
        <Stat label="Open HR items" value={openHrItems} sub={openHrSub} icon={<BriefcaseIcon size={16} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartFrame title="Fees collection" subtitle="KES millions collected against target" action={<Link to="/finance/overview" className="text-[13px] font-medium text-forest-700 hover:underline">Finance</Link>}>
          <BarChartBlock
            data={COLLECTIONS_TREND}
            xKey="month"
            bars={[
            { key: 'collected', name: 'Collected', color: '#1F5E43' },
            { key: 'target', name: 'Target', color: '#B9D7C6' }]
            } />

        </ChartFrame>
        <ChartFrame title="Admissions pipeline" subtitle="Leads by stage this intake" action={<Link to="/admin/crm" className="text-[13px] font-medium text-forest-700 hover:underline">CRM</Link>}>
          <BarChartBlock data={PIPELINE_COUNTS} xKey="stage" bars={[{ key: 'count', name: 'Leads', color: '#D4A23A' }]} />
        </ChartFrame>
        <ChartFrame title="Attendance rate" subtitle="Last 7 school days">
          <AreaChartBlock data={attendanceTrend} xKey="month" areaKey="rate" name="Attendance %" />
        </ChartFrame>
        <ChartFrame title="Academic performance" subtitle="School average by subject">
          <BarChartBlock data={CLASS_SUBJECT_AVERAGES} xKey="subject" bars={[{ key: 'classAvg', name: 'Average %', color: '#1F5E43' }]} />
        </ChartFrame>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Leave awaiting approval" action={<Link to="/hr/leave" className="text-[13px] font-medium text-forest-700 hover:underline">HR</Link>} />
          <ul className="divide-y divide-line">
            {STAFF_LEAVE_QUEUE.filter((l) => l.status === 'Pending').map((l) =>
            <li key={l.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-medium text-ink">{l.staff}</p>
                  <StatusBadge status={l.status} />
                </div>
                <p className="text-[12.5px] text-ink-muted mt-0.5">
                  {l.type} · {l.dates} · {l.days} days
                </p>
              </li>
            )}
            {overview.data?.pending_leave === 0 &&
            <li className="px-5 py-3.5 text-[13px] text-ink-muted">No leave requests awaiting approval.</li>
            }
          </ul>
        </Card>

        <Card>
          <CardHeader title="Open HR tickets" action={<Link to="/hr/tickets" className="text-[13px] font-medium text-forest-700 hover:underline">All</Link>} />
          <ul className="divide-y divide-line">
            {HR_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').map((t) =>
            <li key={t.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-medium text-ink truncate">{t.subject}</p>
                  <Badge tone="pending">{t.id}</Badge>
                </div>
                <p className="text-[12.5px] text-ink-muted mt-0.5">
                  {t.staff} · {t.category}
                </p>
              </li>
            )}
            <li className="px-5 py-3.5 flex items-center gap-2 text-[13px] text-ink-muted">
              <LifeBuoyIcon size={15} /> Average response time: 1.4 days
            </li>
          </ul>
        </Card>

        <Card>
          <CardHeader title="Payment methods" subtitle="Share of fees collected" />
          <div className="p-5 h-56">
            <DonutChartBlock data={PAYMENT_METHOD_SPLIT} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader title="Enrolment by section" subtitle={overview.data ? `${overview.data.students.total} total learners` : '1,148 learners'} />
          <ul className="divide-y divide-line">
            {[
            ['Early Childhood (PP1 – PP2)', 286, 300],
            ['Lower Primary (Grade 1 – 3)', 441, 468],
            ['Upper Primary (Grade 4 – 6)', 421, 450]].
            map(([label, count, cap]) =>
            <li key={label as string} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-ink">{label}</span>
                  <span className="text-[13px] text-ink-muted tabular-nums">
                    {count} of {cap} places
                  </span>
                </div>
                <Progress className="mt-2" value={(count as number) / (cap as number) * 100} label={label as string} />
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Upcoming events" action={<Link to="/admin/content/Events" className="text-[13px] font-medium text-forest-700 hover:underline">Manage</Link>} />
          <ul className="divide-y divide-line">
            {EVENTS.slice(0, 5).map((e) =>
            <li key={e.id} className="px-5 py-3">
                <p className="text-[13.5px] font-medium text-ink leading-snug">{e.title}</p>
                <p className="text-[12.5px] text-ink-muted mt-0.5">
                  {e.date} · {e.location}
                </p>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}