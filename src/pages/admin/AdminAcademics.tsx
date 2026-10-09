import React, { useState } from 'react';
import { DownloadIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Textarea } from '../../components/ui/primitives';
import { DataTable, TableToolbar, useTableState } from '../../components/ui/data';
import { ConfirmDialog, Modal, SkeletonTable } from '../../components/ui/feedback';
import { PROGRAMS } from '../../data/school';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { downloadCSV } from '../../lib/export';
import { useApp } from '../../contexts/AppContext';
import type { ApiSubject } from '../../api/types';

const emptyForm = { name: '', code: '', description: '' };

export function AdminAcademics() {
  const { toast } = useApp();
  const [tab, setTab] = useState('Subjects');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState('');

  const live = useApiLive();
  const subjects = useList<ApiSubject>('subjects/subjects/');

  const rows = live
    ? (subjects.data ?? []).map((s) => ({
      id: s.id, name: s.name, code: s.code || '—', description: s.description || '—', status: s.status || 'ACTIVE'
    }))
    : [
      { id: 'sub1', name: 'English', code: 'ENG', description: 'Language & literature', status: 'ACTIVE' },
      { id: 'sub2', name: 'Mathematics', code: 'MTH', description: 'Number, measurement, geometry', status: 'ACTIVE' },
      { id: 'sub3', name: 'Kiswahili', code: 'KIS', description: 'National language', status: 'ACTIVE' }
    ];

  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q), 10);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ name: r.name, code: r.code === '—' ? '' : r.code, description: r.description === '—' ? '' : r.description });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name) {
      toast({ tone: 'warning', title: 'Missing name', body: 'Subject name is required.' });
      return;
    }
    setBusy(true);
    try {
      const body = { name: form.name, code: form.code || undefined, description: form.description || undefined };
      if (editId) {
        await api.patch(`subjects/subjects/${editId}/`, body);
        toast({ tone: 'success', title: 'Subject updated', body: `${form.name} saved.` });
      } else {
        await api.post('subjects/subjects/', body);
        toast({ tone: 'success', title: 'Subject added', body: `${form.name} added to the catalogue.` });
      }
      setShowForm(false);
      subjects.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!delId) return;
    setBusy(true);
    try {
      await api.delete(`subjects/subjects/${delId}/`);
      toast({ tone: 'success', title: 'Subject removed', body: `${delName} removed.` });
      setDelId(null);
      subjects.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Academics"
        subtitle="Subjects, programmes, years & terms"
        actions={
          tab === 'Subjects' ? (
            <>
              <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />} onClick={() => {
                downloadCSV('subjects', rows.map((r) => ({ Name: r.name, Code: r.code, Description: r.description, Status: r.status })));
                toast({ tone: 'success', title: 'Export ready', body: 'Subjects CSV downloaded.' });
              }}>Export</Button>
              <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAdd}>Add subject</Button>
            </>
          ) : null
        } />

      <div className="border-b border-line overflow-x-auto sala-scroll mb-6">
        <div className="flex gap-1 min-w-max">
          {['Subjects', 'Programmes', 'Years & terms'].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-[13.5px] font-medium rounded-t-md transition-colors ${tab === t ? 'text-gold' : 'text-ink-muted hover:text-ink'}`}
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold" />}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Subjects' && (
        <Card>
          <CardHeader title={`${table.total} subjects`} subtitle="Add, edit or remove subjects" />
          {live && subjects.error && <p className="px-5 pt-3 text-sm text-rose-600">{subjects.error}</p>}
          <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search subjects…" />
          {subjects.loading && live ? <SkeletonTable rows={5} /> : (
            <DataTable
              columns={[
                { key: 'name', header: 'Subject' },
                { key: 'code', header: 'Code' },
                { key: 'description', header: 'Description', hideOnMobile: true },
                { key: 'status', header: 'Status', render: (r: any) => <Badge tone={r.status === 'ACTIVE' ? 'success' : 'neutral'}>{r.status}</Badge> },
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
              caption="Subjects" />
          )}
        </Card>
      )}

      {tab === 'Programmes' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Card key={p.slug} className="p-5">
              <Badge tone="info">{p.stage}</Badge>
              <h3 className="mt-3 font-heading text-[17px] font-bold heading-color">{p.name}</h3>
              <p className="mt-1 text-[12px] text-ink-muted">{p.ages}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted line-clamp-2">{p.blurb}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.subjects.slice(0, 5).map((s) => (
                  <li key={s} className="rounded-full border border-surface-border bg-surface-light px-2 py-0.5 text-[11px] text-ink-muted">{s}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Years & terms' && (
        <Card>
          <CardHeader title="Academic years & terms" subtitle="Loaded from the academic calendar" />
          <div className="p-5 text-sm text-ink-muted">
            {live ? 'Years and terms are managed via the academic calendar API. Use Settings → Academic for the active year.' : 'Demo data: 2026 (Term 3 in progress). Connect the API to manage years and terms.'}
          </div>
        </Card>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? 'Edit subject' : 'Add subject'}
      >
        <div className="space-y-4">
          <Field label="Subject name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Integrated Science" />
          </Field>
          <Field label="Code">
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="ISC" />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="sm" disabled={busy} onClick={save}>{busy ? 'Saving…' : editId ? 'Save changes' : 'Add subject'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={remove}
        title="Remove subject?"
        body={`${delName} will be removed from the catalogue.`}
        confirmLabel={busy ? 'Removing…' : 'Remove subject'}
        danger
      />
    </div>
  );
}
