import React, { useState } from 'react';
import { DownloadIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Avatar, Button, Card, CardHeader, Field, Input, PageHeader, Select, Stat } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { ConfirmDialog, Modal, SkeletonTable } from '../../components/ui/feedback';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { downloadCSV } from '../../lib/export';
import { useApp } from '../../contexts/AppContext';
import type { ApiEmployee } from '../../api/types';

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

const emptyForm = { first_name: '', last_name: '', employee_number: '', role_title: '', department: '', phone: '', email: '', employment_status: 'ACTIVE' };

export function AdminTeachers() {
  const { toast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState('');

  const live = useApiLive();
  const employees = useList<ApiEmployee>('hr/employees/');

  const teachers = live
    ? (employees.data ?? []).filter((e) => /teach/i.test(`${e.role_title ?? ''} ${e.department_name ?? ''} ${e.department ?? ''}`) || (e as any).is_teacher)
    : [];

  const rows = live
    ? teachers.map((e) => ({
      id: e.id,
      name: e.full_name || e.person?.full_name || '—',
      staffNo: e.employee_number || '—',
      role: e.role_title || e.department_name || e.department || 'Teacher',
      email: e.person?.email || '—',
      status: e.employment_status || 'ACTIVE',
      avatarInitials: initialsOf(e.full_name || e.person?.full_name || 'T')
    }))
    : [
      { id: 't1', name: 'Mr. Brian Kimani', staffNo: 'SALA-T-014', role: 'Class Teacher · Grade 4', email: 'brian@salaschools.ac.ke', status: 'ACTIVE', avatarInitials: 'BK' },
      { id: 't2', name: 'Ms. Lydia Achieng', staffNo: 'SALA-T-022', role: 'English · Grades 4–6', email: 'lydia@salaschools.ac.ke', status: 'ACTIVE', avatarInitials: 'LA' }
    ];

  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.staffNo.toLowerCase().includes(q), 8);

  const openAdd = () => { setForm(emptyForm); setShowForm(true); };

  const save = async () => {
    if (!form.first_name || !form.last_name || !form.employee_number) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Name and staff number are required.' });
      return;
    }
    setBusy(true);
    try {
      await api.post('hr/employees/', {
        person: { first_name: form.first_name, last_name: form.last_name, phone: form.phone || undefined, email: form.email || undefined },
        employee_number: form.employee_number,
        role_title: form.role_title || undefined,
        employment_status: form.employment_status,
        employment_date: new Date().toISOString().slice(0, 10)
      });
      toast({ tone: 'success', title: 'Teacher added', body: `${form.first_name} ${form.last_name} added to staff.` });
      setShowForm(false);
      employees.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Add failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!delId) return;
    setBusy(true);
    try {
      await api.delete(`hr/employees/${delId}/`);
      toast({ tone: 'success', title: 'Teacher removed', body: `${delName} removed from staff.` });
      setDelId(null);
      employees.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Remove failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle={live ? `${rows.length} teaching staff` : 'Teaching staff directory and allocation.'}
        actions={
          <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />} onClick={() => {
              downloadCSV('teachers', rows.map((r) => ({ Name: r.name, 'Staff No': r.staffNo, Role: r.role, Email: r.email, Status: r.status })));
              toast({ tone: 'success', title: 'Export ready', body: 'Teachers CSV downloaded.' });
            }}>Export</Button>
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAdd}>Add teacher</Button>
          </>
        } />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Teaching staff" value={String(rows.length)} tone="primary" />
        <Stat label="Departments" value={live ? '—' : '6'} />
        <Stat label="Avg. experience" value={live ? '—' : '11 yrs'} tone="gold" />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} teachers`} subtitle="Add, view or remove teaching staff" />
        {live && employees.error && <p className="px-5 pt-3 text-sm text-rose-600">{employees.error}</p>}
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search teachers…" />
        {employees.loading && live ? <SkeletonTable rows={5} /> : (
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Teacher',
                render: (r: any) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-[12px] text-ink-muted">{r.email}</span>
                    </span>
                  </span>
                )
              },
              { key: 'staffNo', header: 'Staff No' },
              { key: 'role', header: 'Role' },
              { key: 'status', header: 'Status' },
              {
                key: 'a',
                header: '',
                align: 'right',
                render: (r: any) => live ? (
                  <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDelId(r.id); setDelName(r.name); }}>
                    <Trash2Icon size={14} className="text-rose-600" />
                  </Button>
                ) : null
              }
            ]}
            rows={table.slice}
            mobileTitle={(r: any) => r.name}
            caption="Teachers" />
        )}
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add teacher" description="Create a teaching staff record.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" required>
            <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </Field>
          <Field label="Last name" required>
            <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </Field>
          <Field label="Staff number" required>
            <Input value={form.employee_number} onChange={(e) => setForm({ ...form, employee_number: e.target.value })} placeholder="SALA-T-025" />
          </Field>
          <Field label="Role title">
            <Input value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} placeholder="Class Teacher · Grade 4" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Employment status">
            <Select value={form.employment_status} onChange={(e) => setForm({ ...form, employment_status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="PROBATION">Probation</option>
              <option value="ON_LEAVE">On leave</option>
            </Select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="sm" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Add teacher'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={remove}
        title="Remove teacher?"
        body={`${delName} will be removed from the staff directory.`}
        confirmLabel={busy ? 'Removing…' : 'Remove teacher'}
        danger
      />
    </div>
  );
}
