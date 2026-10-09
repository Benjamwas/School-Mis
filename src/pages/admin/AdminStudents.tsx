import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DownloadIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, FilterSelect, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { ConfirmDialog, Modal, SkeletonTable } from '../../components/ui/feedback';
import { GUARDIANS, STUDENTS } from '../../data/people';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { downloadCSV } from '../../lib/export';
import { useApp } from '../../contexts/AppContext';
import type { ApiClass, ApiStudent } from '../../api/types';

const STUDENT_STATUS: Record<string, string> = {
  ACTIVE: 'Active', ALUMNI: 'Alumni', ARCHIVED: 'Alumni', TRANSFERRED: 'Alumni'
};

function studentStatus(status?: string): string {
  if (!status) return 'On Leave';
  return STUDENT_STATUS[status] ?? 'On Leave';
}

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function AdminStudents() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [klass, setKlass] = useState('All classes');
  const [status, setStatus] = useState('All statuses');
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', phone: '', email: '' });
  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState('');

  const live = useApiLive();
  const students = useList<ApiStudent>('students/');
  const classes = useList<ApiClass>('schools/classes/');

  const classNames = useMemo(() => {
    const map = new Map<string, string>();
    (classes.data ?? []).forEach((c) => map.set(c.id, c.display_name || c.name));
    return map;
  }, [classes.data]);

  const rows: any[] = live
    ? (students.data ?? []).map((s) => {
      const name = s.full_name || s.person?.full_name || '—';
      return {
        id: s.id,
        name,
        admissionNo: s.admission_number || '',
        className: s.current_class_name || (s.current_class ? classNames.get(s.current_class) ?? '' : ''),
        gender: s.person?.gender || '—',
        avatarInitials: initialsOf(name),
        status: studentStatus(s.status)
      };
    })
    : STUDENTS;

  const classFilters = live
    ? ['All classes', ...Array.from(new Set(rows.map((r) => r.className).filter(Boolean)))]
    : ['All classes', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const filtered = rows.filter((s) => (klass === 'All classes' || s.className === klass) && (status === 'All statuses' || s.status === status));
  const table = useTableState(filtered, (r, q) => r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q), 8);

  const refresh = (fn: () => void) => {
    setLoading(true);
    fn();
    window.setTimeout(() => { setLoading(false); students.refresh(); }, 400);
  };

  const addStudent = async () => {
    if (!form.first_name || !form.last_name || !form.admission_number) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'First name, last name and admission number are required.' });
      return;
    }
    setBusy(true);
    try {
      await api.post('students/', {
        person: {
          first_name: form.first_name,
          last_name: form.last_name,
          gender: form.gender || undefined,
          date_of_birth: form.date_of_birth || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined
        },
        admission_number: form.admission_number,
        admission_date: new Date().toISOString().slice(0, 10)
      });
      toast({ tone: 'success', title: 'Student added', body: `${form.first_name} ${form.last_name} has been enrolled.` });
      setShowAdd(false);
      setForm({ first_name: '', last_name: '', admission_number: '', gender: '', date_of_birth: '', phone: '', email: '' });
      students.refresh();
    } catch (e: any) {
      toast({ tone: 'danger', title: 'Could not add student', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const removeStudent = async () => {
    if (!delId) return;
    setBusy(true);
    try {
      await api.delete(`students/${delId}/`);
      toast({ tone: 'success', title: 'Student removed', body: `${delName} has been archived.` });
      setDelId(null);
      students.refresh();
    } catch (e: any) {
      toast({ tone: 'danger', title: 'Could not remove student', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    downloadCSV('students', filtered.map((r) => ({
      Name: r.name, 'Admission No': r.admissionNo, Class: r.className, Gender: r.gender, Status: r.status
    })));
    toast({ tone: 'success', title: 'Export ready', body: 'Students CSV downloaded.' });
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={live ? `${rows.length} learners enrolled` : '1,148 learners across ECD, Lower Primary and Upper Primary.'}
        actions={
          <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />} onClick={exportCsv}>Export</Button>
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => setShowAdd(true)}>Add student</Button>
          </>
        } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total learners" value={live ? String(rows.length) : '1,148'} tone="primary" />
        <Stat label="Active" value={live ? String(rows.filter((r) => r.status === 'Active').length) : '38'} />
        <Stat label="Classes" value={live ? String(classNames.size) : '24'} tone="gold" />
        <Stat label="On leave" value={live ? String(rows.filter((r) => r.status === 'On Leave').length) : '6'} />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} records`} subtitle="Click a learner to open their full profile" />
        {live && students.error && <p className="px-5 pt-3 text-sm text-rose-600">{students.error}</p>}
        <TableToolbar
          query={table.query}
          onQuery={(v) => refresh(() => table.setQuery(v))}
          placeholder="Search by name or admission number…"
          filters={
            <>
              <FilterSelect label="Class" value={klass} onChange={(v) => refresh(() => setKlass(v))} options={classFilters} />
              <FilterSelect label="Status" value={status} onChange={(v) => refresh(() => setStatus(v))} options={['All statuses', 'Active', 'On Leave', 'Alumni']} />
            </>
          } />

        {loading ? <SkeletonTable rows={6} /> : (
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Learner',
                render: (r: any) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-[12px] text-ink-muted">{r.admissionNo}</span>
                    </span>
                  </span>
                )
              },
              { key: 'className', header: 'Class' },
              { key: 'gender', header: 'Gender', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right',
                render: (r: any) => (
                  <span className="flex items-center justify-end gap-1">
                    <Link to={`/admin/student/${r.id}`}>
                      <Button variant="ghost" size="sm">Open</Button>
                    </Link>
                    {live && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setDelId(r.id);
                          setDelName(r.name);
                        }}
                      >
                        <Trash2Icon size={14} className="text-rose-600" />
                      </Button>
                    )}
                  </span>
                )
              }
            ]}
            rows={table.slice}
            onRowClick={(r: any) => navigate(`/admin/student/${r.id}`)}
            mobileTitle={(r: any) => r.name}
            caption="Student records" />
        )}
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add student" description="Enrol a new learner. A unique admission number is required.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" required>
            <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Amani" />
          </Field>
          <Field label="Last name" required>
            <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Kiplagat" />
          </Field>
          <Field label="Admission number" required>
            <Input value={form.admission_number} onChange={(e) => setForm({ ...form, admission_number: e.target.value })} placeholder="SALA-2027-001" />
          </Field>
          <Field label="Gender">
            <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">—</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </Select>
          </Field>
          <Field label="Date of birth">
            <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="parent@example.com" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button size="sm" disabled={busy} onClick={addStudent}>{busy ? 'Saving…' : 'Add student'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={removeStudent}
        title="Remove student?"
        body={`${delName} will be archived. You can restore them later if needed.`}
        confirmLabel={busy ? 'Removing…' : 'Remove student'}
        danger
      />
    </div>
  );
}
