import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckIcon, DownloadIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, Stat, StatusBadge, cx } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { Alert, ConfirmDialog, Modal } from '../../components/ui/feedback';
import { DUTY_ROSTER, HR_TICKETS, PAYROLL_SUMMARY, PAYSLIP_HISTORY, STAFF_DIRECTORY, STAFF_LEAVE_QUEUE } from '../../data/hr';
import { formatKES } from '../../data/finance';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useDashboard, useList } from '../../api/hooks';
import { api } from '../../api/client';
import { downloadCSV } from '../../lib/export';
import type { ApiEmployee, ApiLeaveRequest, DashboardHR } from '../../api/types';

const TITLES: Record<string, { title: string; sub: string }> = {
  overview: { title: 'Human resources', sub: 'Staff, attendance, leave, payroll and support' },
  staff: { title: 'Staff directory', sub: 'Teaching and support staff records' },
  attendance: { title: 'Staff attendance', sub: 'Clock-in records' },
  leave: { title: 'Leave requests', sub: 'Approve or reject leave applications' },
  payroll: { title: 'Payroll', sub: 'Payroll runs and payslips' },
  roster: { title: 'Duty roster', sub: 'Weekly duty assignments' },
  tickets: { title: 'HR tickets', sub: 'Staff support requests' }
};

type Dept = { id: string; name: string };

const emptyStaff = { first_name: '', last_name: '', employee_number: '', role_title: '', phone: '', email: '', employment_status: 'ACTIVE', department: '' };

/** Green approve / red reject toggle — readable on navy portal */
function LeaveActions({ id, status, onDecide, busyId }: {
  id: string;
  status: string;
  onDecide: (id: string, action: 'approve' | 'reject') => void;
  busyId: string | null;
}) {
  if (status !== 'Pending') {
    if (status === 'Approved') return <Badge tone="success">Approved</Badge>;
    if (status === 'Rejected') return <Badge tone="danger">Rejected</Badge>;
    return <StatusBadge status={status} />;
  }
  const busy = busyId === id;
  return (
    <span className="flex justify-end gap-1.5">
      <button
        type="button"
        disabled={busy}
        onClick={(e) => { e.stopPropagation(); onDecide(id, 'approve'); }}
        className={cx(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-150',
          busy
            ? 'bg-emerald-500/40 text-white/70 cursor-wait'
            : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-[0_0_12px_rgba(16,185,129,0.45)]'
        )}
      >
        <CheckIcon size={13} />
        Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={(e) => { e.stopPropagation(); onDecide(id, 'reject'); }}
        className={cx(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-150',
          busy
            ? 'bg-red-500/40 text-white/70 cursor-wait'
            : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_12px_rgba(239,68,68,0.45)]'
        )}
      >
        <XIcon size={13} />
        Reject
      </button>
    </span>
  );
}

export function HRPortal() {
  const { tab = 'overview' } = useParams();
  const meta = TITLES[tab] ?? TITLES.overview;
  const { toast } = useApp();

  const [showStaff, setShowStaff] = useState(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [staffBusy, setStaffBusy] = useState(false);
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [delStaffId, setDelStaffId] = useState<string | null>(null);
  const [delStaffName, setDelStaffName] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [leaveBusyId, setLeaveBusyId] = useState<string | null>(null);

  const live = useApiLive();
  const dashboard = useDashboard<DashboardHR>('hr');
  const employees = useList<ApiEmployee>('hr/employees/');
  const departments = useList<Dept>('hr/departments/');
  const leaveRequests = useList<ApiLeaveRequest>('hr/leave-requests/');
  const attendance = useList<Record<string, unknown>>('attendance/hr/');
  const payrollPeriods = useList<Record<string, unknown>>('hr/payroll-periods/');
  const payslips = useList<Record<string, unknown>>('hr/payslips/');
  const duties = useList<Record<string, unknown>>('hr/duty-assignments/');
  const tickets = useList<Record<string, unknown>>('hr/tickets/');

  const staffRows = live
    ? (employees.data ?? []).map((e) => ({
      id: e.id,
      name: e.full_name || e.person?.full_name || '—',
      role: e.role_title ?? '—',
      dept: e.department_name ?? '—',
      deptId: (e as any).department ?? '',
      staffNo: e.employee_number,
      status: e.employment_status === 'ACTIVE' ? 'Active' : (e.employment_status ?? '—'),
      phone: e.person?.phone ?? '—',
      email: e.person?.email ?? '—'
    }))
    : STAFF_DIRECTORY.map((r, i) => ({ ...r, id: `demo-${i}`, deptId: '', email: '—' }));

  const leaveRows = live
    ? (leaveRequests.data ?? []).map((r) => ({
      id: r.id,
      staff: r.employee_name,
      role: r.leave_type_name,
      type: r.leave_type_name,
      dates: `${r.start_date} – ${r.end_date}`,
      days: r.days,
      status: r.status === 'PENDING' ? 'Pending' : r.status === 'APPROVED' ? 'Approved' : r.status === 'REJECTED' ? 'Rejected' : r.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }))
    : STAFF_LEAVE_QUEUE.map((r, i) => ({ ...r, id: `demo-l-${i}` }));

  const staffCount = live ? staffRows.length : PAYROLL_SUMMARY.staff;
  const pendingTickets = dashboard.data?.pending_tickets ?? HR_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const pendingLeave = leaveRows.filter((r) => r.status === 'Pending').length;
  const payrollRows = live
    ? (payslips.data ?? []).map((s) => ({ month: String(s.payroll_period_name ?? s.payroll_period ?? 'Current period'), gross: Number(s.gross_salary ?? 0), net: Number(s.net_salary ?? 0), status: String(s.status ?? 'DRAFT').replace(/_/g, ' ') }))
    : PAYSLIP_HISTORY;
  const dutyRows = live
    ? (duties.data ?? []).map((a) => ({ day: String(a.date ?? '—'), time: `${a.start_time ?? '—'} – ${a.end_time ?? '—'}`, duty: String(a.duty_name ?? 'Duty'), teacher: String(a.employee_name ?? '—'), location: '—' }))
    : DUTY_ROSTER;
  const ticketRows = live
    ? (tickets.data ?? []).map((t) => ({ id: String(t.id ?? '—').slice(0, 8), staff: String(t.employee_name ?? '—'), subject: String(t.subject ?? '—'), category: String(t.category ?? '—'), created: String(t.created_at ?? '—').slice(0, 10), status: String(t.status ?? 'OPEN').replace(/_/g, ' ') }))
    : HR_TICKETS;
  const attendanceRows = live
    ? staffRows.map((row) => ({ ...row, status: String((attendance.data ?? []).find((r) => r.employee_name === row.name)?.status ?? row.status) }))
    : staffRows;
  const payrollLabel = live && payrollPeriods.data?.[0]?.name ? String(payrollPeriods.data[0].name) : 'Current payroll run';

  const decideLeave = async (id: string, action: 'approve' | 'reject') => {
    if (!live) {
      toast({ tone: action === 'approve' ? 'success' : 'warning', title: action === 'approve' ? 'Leave approved' : 'Leave rejected' });
      return;
    }
    setLeaveBusyId(id);
    try {
      await api.post(`hr/leave-requests/${id}/${action}/`, { comment: '' });
      toast({ tone: action === 'approve' ? 'success' : 'warning', title: action === 'approve' ? 'Leave approved' : 'Leave rejected' });
      leaveRequests.refresh();
    } catch (error) {
      toast({ tone: 'error', title: 'Leave action failed', body: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setLeaveBusyId(null);
    }
  };

  const openAddStaff = () => {
    setEditStaffId(null);
    setStaffForm(emptyStaff);
    setShowStaff(true);
  };

  const openEditStaff = (r: any) => {
    setEditStaffId(r.id);
    setStaffForm({
      first_name: String(r.name || '').split(' ')[0] || '',
      last_name: String(r.name || '').split(' ').slice(1).join(' ') || '',
      employee_number: r.staffNo === '—' ? '' : r.staffNo,
      role_title: r.role === '—' ? '' : r.role,
      phone: r.phone === '—' ? '' : r.phone,
      email: r.email === '—' ? '' : r.email,
      employment_status: r.status === 'Active' ? 'ACTIVE' : r.status,
      department: r.deptId || ''
    });
    setShowStaff(true);
  };

  const saveStaff = async () => {
    if (!staffForm.first_name || !staffForm.last_name || !staffForm.employee_number) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Name and staff number are required.' });
      return;
    }
    setStaffBusy(true);
    try {
      const body: Record<string, unknown> = {
        person: {
          first_name: staffForm.first_name,
          last_name: staffForm.last_name,
          phone: staffForm.phone || undefined,
          email: staffForm.email || undefined
        },
        employee_number: staffForm.employee_number,
        role_title: staffForm.role_title || undefined,
        employment_status: staffForm.employment_status,
        department: staffForm.department || null
      };
      if (editStaffId) {
        await api.patch(`hr/employees/${editStaffId}/`, body);
        toast({ tone: 'success', title: 'Staff updated', body: `${staffForm.first_name} ${staffForm.last_name} saved.` });
      } else {
        body.employment_date = new Date().toISOString().slice(0, 10);
        await api.post('hr/employees/', body);
        toast({ tone: 'success', title: 'Staff added', body: `${staffForm.first_name} ${staffForm.last_name} added.` });
      }
      setShowStaff(false);
      employees.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: editStaffId ? 'Update failed' : 'Add failed', body: e?.message || 'Try again.' });
    } finally {
      setStaffBusy(false);
    }
  };

  const removeStaff = async () => {
    if (!delStaffId) return;
    setDelBusy(true);
    try {
      await api.delete(`hr/employees/${delStaffId}/`);
      toast({ tone: 'success', title: 'Staff removed', body: `${delStaffName} removed.` });
      setDelStaffId(null);
      employees.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Remove failed', body: e?.message || 'Try again.' });
    } finally {
      setDelBusy(false);
    }
  };

  const exportStaff = () => {
    downloadCSV('staff', staffRows.map((r) => ({
      Name: r.name, Role: r.role, Department: r.dept, 'Staff No': r.staffNo, Phone: r.phone, Email: r.email, Status: r.status
    })));
    toast({ tone: 'success', title: 'Export ready', body: 'Staff CSV downloaded.' });
  };

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.sub}
        actions={
          <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />} onClick={exportStaff}>Export</Button>
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAddStaff}>Add staff</Button>
          </>
        } />

      {tab === 'overview' && (
        <div className="space-y-6">
          {pendingLeave > 0 && (
            <Alert tone="pending" title={`${pendingLeave} leave request${pendingLeave > 1 ? 's' : ''} awaiting approval`}>
              Review pending requests and arrange cover before approving.
            </Alert>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total staff" value={staffCount} sub="Teaching and support staff" tone="primary" />
            <Stat label="Pending leave" value={pendingLeave} sub="Awaiting your decision" tone="gold" />
            <Stat label="Monthly payroll" value={formatKES(PAYROLL_SUMMARY.grossMonthly)} sub={`Next run ${PAYROLL_SUMMARY.nextRun}`} />
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
                  { month: 'Sep', rate: 98 }
                ]}
                xKey="month"
                bars={[{ key: 'rate', name: 'Attendance %', color: '#F4C243' }]}
              />
            </ChartFrame>
            <Card>
              <CardHeader title="Leave awaiting approval" subtitle="Approve (green) or reject (red)" />
              {leaveRows.filter((l) => l.status === 'Pending').length === 0 ? (
                <p className="px-5 py-6 text-sm text-ink-muted">No pending leave requests.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {leaveRows.filter((l) => l.status === 'Pending').map((l) => (
                    <li key={l.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[14px] font-medium text-ink dark:text-white">{l.staff}</p>
                        <p className="text-[12.5px] text-ink-muted dark:text-gray-400">
                          {l.type} · {l.dates} · {l.days} days
                        </p>
                      </div>
                      <LeaveActions id={l.id} status={l.status} onDecide={decideLeave} busyId={leaveBusyId} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === 'staff' && (
        <Card>
          <CardHeader title={`${staffRows.length} staff records`} subtitle="Add, edit or remove staff" />
          <DataTable
            columns={[
              { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
              { key: 'role', header: 'Role' },
              { key: 'dept', header: 'Department', hideOnMobile: true },
              { key: 'staffNo', header: 'Staff no.', hideOnMobile: true },
              { key: 'phone', header: 'Phone', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right' as const,
                render: (r: any) => (
                  <span className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit staff"
                      onClick={(e) => { e.stopPropagation(); openEditStaff(r); }}
                      className="h-8 w-8 grid place-items-center rounded-lg text-gold hover:bg-gold/15 transition-colors"
                    >
                      <PencilIcon size={14} />
                    </button>
                    {live && (
                      <button
                        type="button"
                        title="Remove staff"
                        onClick={(e) => { e.stopPropagation(); setDelStaffId(r.id); setDelStaffName(r.name); }}
                        className="h-8 w-8 grid place-items-center rounded-lg text-red-400 hover:bg-red-500/15 transition-colors"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    )}
                  </span>
                )
              }
            ]}
            rows={attendanceRows}
            mobileTitle={(r: any) => r.name}
            caption="Staff directory" />
        </Card>
      )}

      {tab === 'attendance' && (
        <Card>
          <CardHeader title="Staff attendance" subtitle={payrollLabel} />
          <DataTable
            columns={[
              { key: 'name', header: 'Staff', render: (r: any) => <span className="font-medium">{r.name}</span> },
              { key: 'dept', header: 'Department', hideOnMobile: true },
              { key: 'in', header: 'Clock in', render: (r: any) => (r.status === 'On Leave' ? '—' : '7:12 am') },
              { key: 'out', header: 'Clock out', render: () => '—' },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status === 'On Leave' ? 'On Leave' : 'Present'} /> }
            ]}
            rows={staffRows}
            caption="Staff attendance" />
        </Card>
      )}

      {tab === 'leave' && (
        <Card>
          <CardHeader title="Leave requests" subtitle="Green = approve · Red = reject" />
          <DataTable
            columns={[
              { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
              { key: 'type', header: 'Type' },
              { key: 'dates', header: 'Dates' },
              { key: 'days', header: 'Days', align: 'right', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: 'Action',
                align: 'right' as const,
                render: (r: any) => <LeaveActions id={r.id} status={r.status} onDecide={decideLeave} busyId={leaveBusyId} />
              }
            ]}
            rows={leaveRows}
            mobileTitle={(r: any) => r.staff}
            caption="Leave requests" />
        </Card>
      )}

      {tab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Gross monthly" value={formatKES(PAYROLL_SUMMARY.grossMonthly)} sub="All staff" tone="primary" />
            <Stat label="Net monthly" value={formatKES(PAYROLL_SUMMARY.netMonthly)} sub="After deductions" />
            <Stat label="Statutory" value={formatKES(PAYROLL_SUMMARY.statutory)} sub="PAYE, NSSF, SHIF" tone="gold" />
            <Stat label="Next run" value="28 Sep" sub="Approval due 25 Sep" />
          </div>
          <Card>
            <CardHeader title="Payslip history" />
            <DataTable
              columns={[
                { key: 'month', header: 'Month', render: (r: any) => <span className="font-medium">{r.month}</span> },
                { key: 'gross', header: 'Gross', align: 'right', render: (r: any) => formatKES(r.gross) },
                { key: 'net', header: 'Net', align: 'right', render: (r: any) => formatKES(r.net) },
                { key: 'status', header: 'Status', render: (r: any) => <Badge tone="success">{r.status}</Badge> }
              ]}
              rows={payrollRows}
              caption="Payslip history" />
          </Card>
        </div>
      )}

      {tab === 'roster' && (
        <Card>
          <CardHeader title="Duty roster" />
          <DataTable
            columns={[
              { key: 'day', header: 'Day', render: (r: any) => <span className="font-medium">{r.day}</span> },
              { key: 'time', header: 'Time' },
              { key: 'duty', header: 'Duty' },
              { key: 'teacher', header: 'Teacher' },
              { key: 'location', header: 'Location', hideOnMobile: true }
            ]}
            rows={dutyRows}
            caption="Duty roster" />
        </Card>
      )}

      {tab === 'tickets' && (
        <Card>
          <CardHeader title="HR tickets" subtitle="Staff support requests" />
          <DataTable
            columns={[
              { key: 'id', header: 'Ref' },
              { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
              { key: 'subject', header: 'Subject' },
              { key: 'category', header: 'Category', hideOnMobile: true },
              { key: 'created', header: 'Created', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }
            ]}
            rows={ticketRows}
            mobileTitle={(r: any) => r.subject}
            caption="HR tickets" />
        </Card>
      )}

      {/* Add / Edit staff modal */}
      <Modal
        open={showStaff}
        onClose={() => setShowStaff(false)}
        title={editStaffId ? 'Edit staff' : 'Add staff'}
        description={editStaffId ? 'Update this staff member\'s record.' : 'Create a new staff record (teaching or support).'}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" required>
            <Input value={staffForm.first_name} onChange={(e) => setStaffForm({ ...staffForm, first_name: e.target.value })} />
          </Field>
          <Field label="Last name" required>
            <Input value={staffForm.last_name} onChange={(e) => setStaffForm({ ...staffForm, last_name: e.target.value })} />
          </Field>
          <Field label="Staff number" required>
            <Input value={staffForm.employee_number} onChange={(e) => setStaffForm({ ...staffForm, employee_number: e.target.value })} placeholder="SALA-S-030" />
          </Field>
          <Field label="Role title">
            <Input value={staffForm.role_title} onChange={(e) => setStaffForm({ ...staffForm, role_title: e.target.value })} placeholder="Class Teacher / Support Staff" />
          </Field>
          <Field label="Department">
            <Select value={staffForm.department} onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}>
              <option value="">— none —</option>
              {(departments.data ?? []).map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
              {(departments.data ?? []).length === 0 && (
                <>
                  <option value="">Teaching</option>
                  <option value="">Administration</option>
                  <option value="">Finance</option>
                  <option value="">Support</option>
                </>
              )}
            </Select>
          </Field>
          <Field label="Employment status">
            <Select value={staffForm.employment_status} onChange={(e) => setStaffForm({ ...staffForm, employment_status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="PROBATION">Probation</option>
              <option value="ON_LEAVE">On leave</option>
            </Select>
          </Field>
          <Field label="Phone">
            <Input value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowStaff(false)}>Cancel</Button>
          <Button size="sm" disabled={staffBusy} onClick={saveStaff}>
            {staffBusy ? 'Saving…' : editStaffId ? 'Save changes' : 'Add staff'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delStaffId}
        onClose={() => setDelStaffId(null)}
        onConfirm={removeStaff}
        title="Remove staff?"
        body={`${delStaffName} will be permanently removed from the staff directory.`}
        confirmLabel={delBusy ? 'Removing…' : 'Remove staff'}
        danger
      />
    </div>
  );
}
