import React from 'react';
import { DownloadIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat } from '../../components/ui/primitives';
import { AreaChartBlock, BarChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { CLASS_ATTENDANCE_TREND } from '../../data/academics';
import { CLASSES } from '../../data/people';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiAttendanceSession } from '../../api/types';

const SESSION_STATUS: Record<string, string> = {
  OPEN: 'Not submitted',
  CLOSED: 'Submitted'
};

function sessionStatus(status?: string): string {
  if (!status) return 'Not submitted';
  return SESSION_STATUS[status] ?? status;
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminAttendance() {
  const live = useApiLive();
  const sessions = useList<ApiAttendanceSession>('attendance/sessions/');

  const rows: any[] = live
    ? (sessions.data ?? []).map((s) => ({
      id: s.id,
      name: s.class_name || '—',
      teacher: '—',
      learners: 0,
      present: 0,
      absent: 0,
      attendance: 0,
      date: fmtDate(s.attendance_date),
      status: sessionStatus(s.status)
    }))
    : CLASSES;

  const latest = rows.length ? rows[0].date : '';

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="School-wide learner attendance for Term 3 2026."
        actions={
        <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
            Export register
          </Button>
        } />
      

      <div className="mb-6">
        <Alert tone="pending" title="3 registers not yet submitted">Grade 2 Cedar, Grade 3 Baobab and PP2 Acacia. Registers close at 9:30am.</Alert>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Present today" value="1,104" sub="96.2% of learners" tone="primary" />
        <Stat label="Absent" value="31" sub="18 with a parent note" tone="danger" />
        <Stat label="Late" value="13" sub="Mostly Route 2 and 6" tone="gold" />
        <Stat label="Term average" value="95.4%" sub="Target 96%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartFrame title="Attendance trend" subtitle="School-wide monthly rate">
          <AreaChartBlock data={CLASS_ATTENDANCE_TREND} xKey="month" areaKey="rate" name="Attendance %" />
        </ChartFrame>
        <ChartFrame title="Attendance by class" subtitle="This week">
          <BarChartBlock data={CLASSES.map((c) => ({ name: c.name.replace('Grade ', 'G'), rate: c.attendance }))} xKey="name" bars={[{ key: 'rate', name: 'Attendance %', color: '#1F5E43' }]} />
        </ChartFrame>
      </div>

      <Card className="mt-6">
        <CardHeader title="Class registers" subtitle={live && latest ? latest : 'Friday 20 September 2026'} />
        {live && sessions.error &&
        <p className="px-5 pt-3 text-sm text-rose-600">{sessions.error}</p>
        }
        <DataTable
          columns={[
          { key: 'name', header: 'Class', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'teacher', header: 'Class teacher', hideOnMobile: true },
          { key: 'learners', header: 'Roll', align: 'right' },
          { key: 'present', header: 'Present', align: 'right', render: (r: any) => r.learners - 2 },
          { key: 'absent', header: 'Absent', align: 'right', render: () => 2 },
          { key: 'attendance', header: 'Rate', align: 'right', render: (r: any) => <Badge tone={r.attendance < 95 ? 'warning' : 'success'}>{r.attendance}%</Badge> },
          { key: 'status', header: 'Register', render: (r: any) => {
              const label = r.status ?? (r.id === 'c4' ? 'Not submitted' : 'Submitted');
              return <Badge tone={label === 'Not submitted' ? 'pending' : 'success'}>{label}</Badge>;
            } }]
          }
          rows={CLASSES}
          mobileTitle={(r: any) => r.name}
          caption="Class registers" />
        
      </Card>

      <Card className="mt-6">
        <CardHeader title="Absence trends" subtitle="Learners with three or more absences this term" />
        <DataTable
          columns={[
          { key: 'student', header: 'Learner', render: (r: any) => <span className="font-medium">{r.student}</span> },
          { key: 'cls', header: 'Class' },
          { key: 'absences', header: 'Absences', align: 'right' },
          { key: 'rate', header: 'Rate', align: 'right' },
          { key: 'action', header: 'Action', hideOnMobile: true }]
          }
          rows={[
          { student: 'Samuel Kiptoo', cls: 'Grade 4 Acacia', absences: 5, rate: '91%', action: 'Parent meeting requested' },
          { student: 'Daniel Wekesa', cls: 'Grade 2 Cedar', absences: 4, rate: '92%', action: 'Letter sent 12 Sep' },
          { student: 'Zawadi Mbugua', cls: 'Grade 3 Baobab', absences: 3, rate: '94%', action: 'Monitoring' }]
          }
          caption="Absence trends" />
        
      </Card>
    </div>);

}