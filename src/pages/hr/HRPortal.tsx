import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckIcon, DownloadIcon, PlusIcon, XIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { DUTY_ROSTER, HR_TICKETS, PAYROLL_SUMMARY, PAYSLIP_HISTORY, STAFF_DIRECTORY, STAFF_LEAVE_QUEUE } from '../../data/hr';
import { formatKES } from '../../data/finance';
import { useApp } from '../../contexts/AppContext';

const TITLES: Record<string, {title: string;sub: string;}> = {
  overview: { title: 'Human resources', sub: '86 staff · attendance, leave, payroll and support' },
  staff: { title: 'Staff directory', sub: 'Teaching and support staff records' },
  attendance: { title: 'Staff attendance', sub: 'Clock-in records for September 2026' },
  leave: { title: 'Leave requests', sub: 'Approvals and leave history' },
  payroll: { title: 'Payroll', sub: 'September 2026 payroll run' },
  roster: { title: 'Duty roster', sub: 'Week 3 · Term 3' },
  tickets: { title: 'HR tickets', sub: 'Staff support requests' }
};

export function HRPortal() {
  const { tab = 'overview' } = useParams();
  const meta = TITLES[tab] ?? TITLES.overview;
  const { toast } = useApp();

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.sub}
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
              Export
            </Button>
            <Button size="sm" icon={<PlusIcon size={15} />}>
              Add staff
            </Button>
          </>
        } />
      

      {tab === 'overview' &&
      <div className="space-y-6">
          <Alert tone="pending" title="2 leave requests are awaiting your approval">Grade 4 Acacia needs cover for 12 – 16 October.</Alert>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total staff" value={PAYROLL_SUMMARY.staff} sub="64 teaching · 22 support" tone="primary" />
            <Stat label="Attendance today" value="97.8%" sub="4 on approved leave" />
            <Stat label="Monthly payroll" value={formatKES(PAYROLL_SUMMARY.grossMonthly)} sub={`Next run ${PAYROLL_SUMMARY.nextRun}`} tone="gold" />
            <Stat label="Open tickets" value={HR_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length} sub="Average 1.4 days to close" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Staff attendance" subtitle="Monthly rate">
              <BarChartBlock
              data={[
              { month: 'May', rate: 97 },
              { month: 'Jun', rate: 96 },
              { month: 'Jul', rate: 98 },
              { month: 'Aug', rate: 97 },
              { month: 'Sep', rate: 98 }]
              }
              xKey="month"
              bars={[{ key: 'rate', name: 'Attendance %', color: '#1F5E43' }]} />
            
            </ChartFrame>
            <Card>
              <CardHeader title="Leave awaiting approval" />
              <ul className="divide-y divide-line">
                {STAFF_LEAVE_QUEUE.filter((l) => l.status === 'Pending').map((l) =>
              <li key={l.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-ink">{l.staff}</p>
                      <p className="text-[12.5px] text-ink-muted">
                        {l.type} · {l.dates} · {l.days} days
                      </p>
                    </div>
                    <span className="flex gap-1.5">
                      <Button size="sm" icon={<CheckIcon size={14} />} onClick={() => toast({ tone: 'success', title: 'Leave approved', body: `${l.staff} · ${l.dates}` })}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" icon={<XIcon size={14} />} onClick={() => toast({ tone: 'warning', title: 'Leave rejected', body: `${l.staff} has been notified.` })}>
                        Reject
                      </Button>
                    </span>
                  </li>
              )}
              </ul>
            </Card>
          </div>
        </div>
      }

      {tab === 'staff' &&
      <Card>
          <CardHeader title={`${STAFF_DIRECTORY.length} staff records`} />
          <DataTable
          columns={[
          { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'role', header: 'Role' },
          { key: 'dept', header: 'Department', hideOnMobile: true },
          { key: 'staffNo', header: 'Staff no.', hideOnMobile: true },
          { key: 'phone', header: 'Phone', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={STAFF_DIRECTORY}
          mobileTitle={(r: any) => r.name}
          caption="Staff directory" />
        
        </Card>
      }

      {tab === 'attendance' &&
      <Card>
          <CardHeader title="Staff attendance" subtitle="Friday 20 September 2026" />
          <DataTable
          columns={[
          { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'dept', header: 'Department', hideOnMobile: true },
          { key: 'in', header: 'Clock in', render: (r: any) => r.status === 'On Leave' ? '—' : '7:12 am' },
          { key: 'out', header: 'Clock out', render: (r: any) => r.status === 'On Leave' ? '—' : '—' },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status === 'On Leave' ? 'On Leave' : 'Present'} /> }]
          }
          rows={STAFF_DIRECTORY}
          caption="Staff attendance" />
        
        </Card>
      }

      {tab === 'leave' &&
      <Card>
          <CardHeader title="Leave requests" subtitle="All staff" />
          <DataTable
          columns={[
          { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
          { key: 'role', header: 'Role', hideOnMobile: true },
          { key: 'type', header: 'Type' },
          { key: 'dates', header: 'Dates' },
          { key: 'days', header: 'Days', align: 'right', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            r.status === 'Pending' ?
            <span className="flex justify-end gap-1.5">
                      <Button size="sm" onClick={() => toast({ tone: 'success', title: 'Leave approved', body: `${r.staff} · ${r.dates}` })}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast({ tone: 'warning', title: 'Leave rejected' })}>
                        Reject
                      </Button>
                    </span> :
            null
          }]
          }
          rows={STAFF_LEAVE_QUEUE}
          mobileTitle={(r: any) => r.staff}
          caption="Leave requests" />
        
        </Card>
      }

      {tab === 'payroll' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Gross monthly" value={formatKES(PAYROLL_SUMMARY.grossMonthly)} sub="86 staff" tone="primary" />
            <Stat label="Net monthly" value={formatKES(PAYROLL_SUMMARY.netMonthly)} sub="After deductions" />
            <Stat label="Statutory" value={formatKES(PAYROLL_SUMMARY.statutory)} sub="PAYE, NSSF, SHIF" tone="gold" />
            <Stat label="Next run" value="28 Sep" sub="Approval due 25 Sep" />
          </div>
          <Card>
            <CardHeader title="Payslip history" subtitle="Sample staff record — Mr. Brian Kimani" />
            <DataTable
            columns={[
            { key: 'month', header: 'Month', render: (r: any) => <span className="font-medium">{r.month}</span> },
            { key: 'gross', header: 'Gross', align: 'right', render: (r: any) => formatKES(r.gross) },
            { key: 'net', header: 'Net', align: 'right', render: (r: any) => formatKES(r.net) },
            { key: 'status', header: 'Status', render: (r: any) => <Badge tone="success">{r.status}</Badge> }]
            }
            rows={PAYSLIP_HISTORY}
            caption="Payslip history" />
          
          </Card>
        </div>
      }

      {tab === 'roster' &&
      <Card>
          <CardHeader title="Duty roster" subtitle="Week 3 · Term 3" />
          <DataTable
          columns={[
          { key: 'day', header: 'Day', render: (r: any) => <span className="font-medium">{r.day}</span> },
          { key: 'time', header: 'Time' },
          { key: 'duty', header: 'Duty' },
          { key: 'teacher', header: 'Teacher' },
          { key: 'location', header: 'Location', hideOnMobile: true }]
          }
          rows={DUTY_ROSTER}
          caption="Duty roster" />
        
        </Card>
      }

      {tab === 'tickets' &&
      <Card>
          <CardHeader title="HR tickets" subtitle="Staff support requests" />
          <DataTable
          columns={[
          { key: 'id', header: 'Ref' },
          { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
          { key: 'subject', header: 'Subject' },
          { key: 'category', header: 'Category', hideOnMobile: true },
          { key: 'created', header: 'Created', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={HR_TICKETS}
          mobileTitle={(r: any) => r.subject}
          caption="HR tickets" />
        
        </Card>
      }
    </div>);

}