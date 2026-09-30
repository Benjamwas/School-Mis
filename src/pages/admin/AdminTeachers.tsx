import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Tabs } from '../../components/ui/data';
import { Modal } from '../../components/ui/feedback';
import { TEACHERS } from '../../data/people';
import { DUTY_ROSTER, HR_TICKETS, STAFF_LEAVE_QUEUE } from '../../data/hr';
import { formatKES } from '../../data/finance';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiEmployee } from '../../api/types';

const TABS = ['Directory', 'Allocation', 'Leave', 'Duties', 'HR tickets'];

const STAFF_STATUS: Record<string, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated',
  RESIGNED: 'Resigned'
};

function staffStatus(status?: string): string {
  if (!status) return 'On Leave';
  return STAFF_STATUS[status] ?? 'On Leave';
}

function isTeaching(e: ApiEmployee): boolean {
  if ((e as unknown as { is_teacher?: boolean }).is_teacher === true) return true;
  return /teach/i.test(`${e.role_title ?? ''} ${e.department_name ?? ''} ${e.department ?? ''}`);
}

export function AdminTeachers() {
  const [tab, setTab] = useState(TABS[0]);
  const [open, setOpen] = useState<string | null>(null);

  const live = useApiLive();
  const employees = useList<ApiEmployee>('hr/employees/');

  const teachers: any[] = live
    ? (employees.data ?? []).filter(isTeaching).map((e) => {
      const name = e.full_name || e.person?.full_name || '—';
      return {
        id: e.id,
        name,
        role: e.role_title || 'Teacher',
        subjects: [] as string[],
        classes: [] as string[],
        email: e.person?.email ?? '',
        phone: e.person?.phone ?? '',
        staffNo: e.employee_number || '',
        baseSalary: e.base_salary ?? '',
        status: staffStatus(e.employment_status)
      };
    })
    : TEACHERS;

  const teacher = teachers.find((t) => t.id === open);

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle="86 teaching and support staff. Payroll detail is managed by HR and Finance."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Add teacher
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Teaching staff" value="86" sub="64 teachers · 22 support" tone="primary" />
        <Stat label="On leave today" value="4" sub="Cover arranged" tone="gold" />
        <Stat label="Average class load" value="23" sub="Periods per week" />
        <Stat label="Open HR tickets" value={HR_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length} sub="Across all staff" />
      </div>

      <div className="mt-6 mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Directory' &&
      <Card>
          <CardHeader title={`${teachers.length} staff records`} />
          {live && employees.error &&
          <p className="px-5 pt-3 text-sm text-rose-600">{employees.error}</p>
          }
          <DataTable
          columns={[
          {
            key: 'name',
            header: 'Teacher',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                    <Avatar initials={r.name.split(' ').slice(-2).map((x: string) => x[0]).join('')} size="sm" />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-[12px] text-ink-muted">{r.staffNo}</span>
                    </span>
                  </span>

          },
          { key: 'role', header: 'Role' },
          { key: 'subjects', header: 'Subjects', hideOnMobile: true, render: (r: any) => r.subjects.join(', ') },
          { key: 'classes', header: 'Classes', hideOnMobile: true, render: (r: any) => r.classes.join(', ') },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            <Button variant="ghost" size="sm" onClick={() => setOpen(r.id)}>
                    Open
                  </Button>

          }]
          }
          rows={teachers}
          mobileTitle={(r: any) => r.name}
          caption="Teacher directory" />
        
        </Card>
      }

      {tab === 'Allocation' &&
      <Card>
          <CardHeader title="Teaching allocation" subtitle="Subjects and classes per teacher" />
          <ul className="divide-y divide-line">
            {teachers.map((t) =>
          <li key={t.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[14.5px] font-medium text-ink">{t.name}</p>
                  <Badge tone="neutral">{t.role}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[...t.subjects, ...t.classes].map((x) =>
              <span key={x} className="rounded-full border border-line bg-cream px-2.5 py-1 text-[12.5px] text-ink-muted">
                      {x}
                    </span>
              )}
                </div>
              </li>
          )}
          </ul>
        </Card>
      }

      {tab === 'Leave' &&
      <Card>
          <CardHeader title="Staff leave" subtitle="Approvals are recorded against payroll" action={<Link to="/hr/leave" className="text-[13px] font-medium text-forest-700 hover:underline">Open in HR</Link>} />
          <DataTable
          columns={[
          { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
          { key: 'role', header: 'Role', hideOnMobile: true },
          { key: 'type', header: 'Type' },
          { key: 'dates', header: 'Dates' },
          { key: 'days', header: 'Days', align: 'right', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={STAFF_LEAVE_QUEUE}
          caption="Staff leave" />
        
        </Card>
      }

      {tab === 'Duties' &&
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

      {tab === 'HR tickets' &&
      <Card>
          <CardHeader title="Staff HR tickets" />
          <DataTable
          columns={[
          { key: 'id', header: 'Ref' },
          { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
          { key: 'subject', header: 'Subject' },
          { key: 'category', header: 'Category', hideOnMobile: true },
          { key: 'owner', header: 'Owner', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={HR_TICKETS}
          caption="HR tickets" />
        
        </Card>
      }

      <Modal open={!!teacher} onClose={() => setOpen(null)} title={teacher?.name ?? ''} description={teacher?.role} size="lg">
        {teacher &&
        <div className="space-y-5">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {[
            ['Staff number', teacher.staffNo],
            ['Status', teacher.status],
            ['Email', teacher.email],
            ['Phone', teacher.phone],
            ['Subjects', teacher.subjects.join(', ')],
            ['Classes', teacher.classes.join(', ')],
            ['Gross monthly', teacher.baseSalary ? formatKES(Number(teacher.baseSalary)) : formatKES(112000)],
            ['Attendance (Sep)', '98%']].
            map(([k, v]) =>
            <div key={k}>
                  <dt className="text-[12px] text-ink-muted">{k}</dt>
                  <dd className="text-[13.5px] font-medium text-ink">{v}</dd>
                </div>
            )}
            </dl>
            <div className="flex flex-wrap gap-2">
              <Link to="/hr/payroll">
                <Button size="sm" variant="secondary">
                  Payroll record
                </Button>
              </Link>
              <Link to="/hr/leave">
                <Button size="sm" variant="secondary">
                  Leave history
                </Button>
              </Link>
              <Link to="/hr/tickets">
                <Button size="sm" variant="ghost">
                  HR tickets
                </Button>
              </Link>
            </div>
          </div>
        }
      </Modal>
    </div>);

}