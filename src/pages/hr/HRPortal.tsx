import { useParams } from 'react-router-dom';
import { CheckIcon, DownloadIcon, PlusIcon, XIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { DUTY_ROSTER, HR_TICKETS, PAYROLL_SUMMARY, PAYSLIP_HISTORY, STAFF_DIRECTORY, STAFF_LEAVE_QUEUE } from '../../data/hr';
import { formatKES } from '../../data/finance';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useDashboard, useList } from '../../api/hooks';
import { api } from '../../api/client';
import type { ApiEmployee, ApiLeaveRequest, DashboardHR } from '../../api/types';

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
  const live = useApiLive();
  const dashboard = useDashboard<DashboardHR>('hr');
  const employees = useList<ApiEmployee>('/hr/employees/');
  const leaveRequests = useList<ApiLeaveRequest>('/hr/leave-requests/');
  const attendance = useList<Record<string, unknown>>('/attendance/hr/');
  const payrollPeriods = useList<Record<string, unknown>>('/hr/payroll-periods/');
  const payslips = useList<Record<string, unknown>>('/hr/payslips/');
  const duties = useList<Record<string, unknown>>('/hr/duty-assignments/');
  const tickets = useList<Record<string, unknown>>('/hr/tickets/');

  const staffRows = live
    ? (employees.data ?? []).map((employee) => ({
      name: employee.full_name,
      role: employee.role_title ?? '—',
      dept: employee.department_name ?? '—',
      staffNo: employee.employee_number,
      status: employee.employment_status === 'ACTIVE' ? 'Active' : employee.employment_status,
      phone: employee.person?.phone ?? '—'
    }))
    : STAFF_DIRECTORY;
  const leaveRows = live
    ? (leaveRequests.data ?? []).map((request) => ({
      id: request.id,
      staff: request.employee_name,
      role: request.leave_type_name,
      type: request.leave_type_name,
      dates: `${request.start_date} – ${request.end_date}`,
      days: request.days,
      status: request.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }))
    : STAFF_LEAVE_QUEUE;
  const staffCount = live ? staffRows.length : PAYROLL_SUMMARY.staff;
  const pendingTickets = dashboard.data?.pending_tickets ?? HR_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const pendingLeave = leaveRows.filter((row) => row.status === 'Pending').length;
  const payrollRows = live
    ? (payslips.data ?? []).map((slip) => ({ month: String(slip.payroll_period_name ?? slip.payroll_period ?? 'Current period'), gross: Number(slip.gross_salary ?? 0), net: Number(slip.net_salary ?? 0), status: String(slip.status ?? 'DRAFT').replace(/_/g, ' ') }))
    : PAYSLIP_HISTORY;
  const dutyRows = live
    ? (duties.data ?? []).map((assignment) => ({ day: String(assignment.date ?? '—'), time: `${assignment.start_time ?? '—'} – ${assignment.end_time ?? '—'}`, duty: String(assignment.duty_name ?? 'Duty'), teacher: String(assignment.employee_name ?? '—'), location: '—' }))
    : DUTY_ROSTER;
  const ticketRows = live
    ? (tickets.data ?? []).map((ticket) => ({ id: String(ticket.id ?? '—').slice(0, 8), staff: String(ticket.employee_name ?? '—'), subject: String(ticket.subject ?? '—'), category: String(ticket.category ?? '—'), created: String(ticket.created_at ?? '—').slice(0, 10), status: String(ticket.status ?? 'OPEN').replace(/_/g, ' ') }))
    : HR_TICKETS;
  const attendanceRows = live
    ? staffRows.map((row) => ({ ...row, status: String((attendance.data ?? []).find((record) => record.employee_name === row.name)?.status ?? row.status) }))
    : staffRows;
  const payrollLabel = live && payrollPeriods.data?.[0]?.name ? String(payrollPeriods.data[0].name) : 'September 2026 payroll run';

  const decideLeave = async (id: string, action: 'approve' | 'reject') => {
    if (!live) {
      toast({ tone: action === 'approve' ? 'success' : 'warning', title: action === 'approve' ? 'Leave approved' : 'Leave rejected' });
      return;
    }
    try {
      await api.post(`/hr/leave-requests/${id}/${action}/`, { comment: '' });
      toast({ tone: action === 'approve' ? 'success' : 'warning', title: action === 'approve' ? 'Leave approved' : 'Leave rejected' });
      window.location.reload();
    } catch (error) {
      toast({ tone: 'warning', title: 'Leave action failed', body: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

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
          <Alert tone="pending" title={`${pendingLeave} leave requests are awaiting your approval`}>Review pending requests and arrange cover before approving.</Alert>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total staff" value={staffCount} sub="Teaching and support staff" tone="primary" />
            <Stat label="Attendance today" value="97.8%" sub="4 on approved leave" />
            <Stat label="Monthly payroll" value={formatKES(PAYROLL_SUMMARY.grossMonthly)} sub={`Next run ${PAYROLL_SUMMARY.nextRun}`} tone="gold" />
            <Stat label="Open tickets" value={pendingTickets} sub="Awaiting HR action" />
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
                {leaveRows.filter((l) => l.status === 'Pending').map((l) =>
              <li key={l.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-ink">{l.staff}</p>
                      <p className="text-[12.5px] text-ink-muted">
                        {l.type} · {l.dates} · {l.days} days
                      </p>
                    </div>
                    <span className="flex gap-1.5">
                      <Button size="sm" icon={<CheckIcon size={14} />} onClick={() => void decideLeave(l.id, 'approve')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" icon={<XIcon size={14} />} onClick={() => void decideLeave(l.id, 'reject')}>
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
          <CardHeader title={`${staffRows.length} staff records`} />
          <DataTable
          columns={[
          { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'role', header: 'Role' },
          { key: 'dept', header: 'Department', hideOnMobile: true },
          { key: 'staffNo', header: 'Staff no.', hideOnMobile: true },
          { key: 'phone', header: 'Phone', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
           rows={attendanceRows}
          mobileTitle={(r: any) => r.name}
          caption="Staff directory" />
        
        </Card>
      }

      {tab === 'attendance' &&
      <Card>
           <CardHeader title="Staff attendance" subtitle={payrollLabel} />
          <DataTable
          columns={[
          { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'dept', header: 'Department', hideOnMobile: true },
          { key: 'in', header: 'Clock in', render: (r: any) => r.status === 'On Leave' ? '—' : '7:12 am' },
          { key: 'out', header: 'Clock out', render: (r: any) => r.status === 'On Leave' ? '—' : '—' },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status === 'On Leave' ? 'On Leave' : 'Present'} /> }]
          }
          rows={staffRows}
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
                      <Button size="sm" onClick={() => void decideLeave(r.id, 'approve')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void decideLeave(r.id, 'reject')}>
                        Reject
                      </Button>
                    </span> :
            null
          }]
          }
          rows={leaveRows}
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
             rows={payrollRows}
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
           rows={dutyRows}
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
           rows={ticketRows}
          mobileTitle={(r: any) => r.subject}
          caption="HR tickets" />
        
        </Card>
      }
    </div>);

}
