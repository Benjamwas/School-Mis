import React, { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button, Card, CardHeader, Field, Input, PageHeader, Select, StatusBadge } from '../../components/ui/primitives';
import { DataTable, TableToolbar, useTableState } from '../../components/ui/data';
import { ConfirmDialog, Modal, SkeletonTable } from '../../components/ui/feedback';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { useApp } from '../../contexts/AppContext';
import type { ApiAcademicYear, ApiClass, ApiGradeLevel } from '../../api/types';

const emptyForm = { name: '', academic_year: '', grade_level: '', section: '' };

export function AdminClasses() {
  const { toast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState('');

  const live = useApiLive();
  const classes = useList<ApiClass>('schools/classes/');
  const years = useList<ApiAcademicYear>('schools/academic-years/');
  const grades = useList<ApiGradeLevel>('schools/grade-levels/');

  const rows = live
    ? (classes.data ?? []).map((c) => ({
      id: c.id,
      name: c.display_name || c.name,
      year: c.academic_year_name || '',
      grade: c.grade_level_name || '',
      teacher: c.class_teacher ? String(c.class_teacher) : '—',
      status: c.status || 'ACTIVE'
    }))
    : [
      { id: 'c1', name: 'Grade 4 Acacia', year: '2026', grade: 'Grade 4', teacher: 'Mr. Brian Kimani', status: 'ACTIVE' },
      { id: 'c2', name: 'Grade 5 Cedar', year: '2026', grade: 'Grade 5', teacher: 'Mrs. Faith Wambui', status: 'ACTIVE' }
    ];

  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q), 10);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    const cls = (classes.data ?? []).find((c) => c.id === r.id);
    setForm({
      name: cls?.name || r.name,
      academic_year: cls?.academic_year || '',
      grade_level: cls?.grade_level || '',
      section: cls?.section || ''
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name) {
      toast({ tone: 'warning', title: 'Missing name', body: 'Class name is required.' });
      return;
    }
    setBusy(true);
    try {
      const body: Record<string, unknown> = { name: form.name, section: form.section || undefined };
      if (!editId) {
        body.academic_year = form.academic_year || (years.data?.[0]?.id ?? undefined);
        body.grade_level = form.grade_level || (grades.data?.[0]?.id ?? undefined);
        await api.post('schools/classes/', body);
        toast({ tone: 'success', title: 'Class created', body: `${form.name} added.` });
      } else {
        await api.patch(`schools/classes/${editId}/`, body);
        toast({ tone: 'success', title: 'Class renamed', body: `Updated to ${form.name}.` });
      }
      setShowForm(false);
      classes.refresh();
    } catch (e: any) {
      toast({ tone: 'danger', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!delId) return;
    setBusy(true);
    try {
      await api.delete(`schools/classes/${delId}/`);
      toast({ tone: 'success', title: 'Class deleted', body: `${delName} removed.` });
      setDelId(null);
      classes.refresh();
    } catch (e: any) {
      toast({ tone: 'danger', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle={live ? `${rows.length} classes this year` : 'Manage class groups and assignments.'}
        actions={<Button size="sm" icon={<PlusIcon size={15} />} onClick={openAdd}>Add class</Button>} />

      <Card>
        <CardHeader title={`${table.total} classes`} subtitle="Create, rename or delete classes" />
        {live && classes.error && <p className="px-5 pt-3 text-sm text-rose-600">{classes.error}</p>}
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search classes…" />
        {classes.loading && live ? <SkeletonTable rows={5} /> : (
          <DataTable
            columns={[
              { key: 'name', header: 'Class' },
              { key: 'year', header: 'Academic year', hideOnMobile: true },
              { key: 'grade', header: 'Grade level', hideOnMobile: true },
              { key: 'teacher', header: 'Class teacher', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
              {
                key: 'a',
                header: '',
                align: 'right',
                render: (r: any) => (
                  <span className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(r); }}>
                      <PencilIcon size={14} />
                    </Button>
                    {live && (
                      <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDelId(r.id); setDelName(r.name); }}>
                        <Trash2Icon size={14} className="text-rose-600" />
                      </Button>
                    )}
                  </span>
                )
              }
            ]}
            rows={table.slice}
            mobileTitle={(r: any) => r.name}
            caption="Classes" />
        )}
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? 'Rename class' : 'Add class'}
        description={editId ? 'Update the class name or section.' : 'Create a new class group.'}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Class name" required className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Grade 4 Acacia" />
          </Field>
          {!editId && (
            <>
              <Field label="Academic year">
                <Select value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })}>
                  <option value="">— select —</option>
                  {(years.data ?? []).map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                </Select>
              </Field>
              <Field label="Grade level">
                <Select value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })}>
                  <option value="">— select —</option>
                  {(grades.data ?? []).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </Select>
              </Field>
            </>
          )}
          <Field label="Section / stream">
            <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="A" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="sm" disabled={busy} onClick={save}>{busy ? 'Saving…' : editId ? 'Save changes' : 'Create class'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={remove}
        title="Delete class?"
        body={`${delName} will be permanently deleted. Enrolments may be affected.`}
        confirmLabel={busy ? 'Deleting…' : 'Delete class'}
        danger
      />
    </div>
  );
}
