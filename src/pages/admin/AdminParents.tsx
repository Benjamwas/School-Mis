import React, { useState } from 'react';
import { DownloadIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Avatar, Button, Card, CardHeader, Field, Input, PageHeader, Stat } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { ConfirmDialog, Modal, SkeletonTable } from '../../components/ui/feedback';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import { downloadCSV } from '../../lib/export';
import { useApp } from '../../contexts/AppContext';
import type { ApiParent } from '../../api/types';

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

const emptyForm = { first_name: '', last_name: '', phone: '', email: '', occupation: '', employer: '' };

export function AdminParents() {
  const { toast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState('');

  const live = useApiLive();
  const parents = useList<ApiParent>('parents/');

  const rows = live
    ? (parents.data ?? []).map((p) => ({
      id: p.id,
      name: p.full_name || p.person?.full_name || '—',
      phone: p.person?.phone || '—',
      email: p.person?.email || '—',
      occupation: p.occupation || '—',
      avatarInitials: initialsOf(p.full_name || p.person?.full_name || 'P')
    }))
    : [
      { id: 'p1', name: 'Grace Wanjiku', phone: '+254 712 000 111', email: 'grace@example.com', occupation: 'Engineer', avatarInitials: 'GW' },
      { id: 'p2', name: 'Dennis Otieno', phone: '+254 722 000 222', email: 'dennis@example.com', occupation: 'Teacher', avatarInitials: 'DO' }
    ];

  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q), 8);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ first_name: r.name.split(' ')[0] || '', last_name: r.name.split(' ').slice(1).join(' '), phone: r.phone === '—' ? '' : r.phone, email: r.email === '—' ? '' : r.email, occupation: r.occupation === '—' ? '' : r.occupation, employer: '' });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.first_name || !form.last_name) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'First and last name are required.' });
      return;
    }
    setBusy(true);
    try {
      const body = {
        person: { first_name: form.first_name, last_name: form.last_name, phone: form.phone || undefined, email: form.email || undefined },
        occupation: form.occupation || undefined,
        employer: form.employer || undefined
      };
      if (editId) {
        await api.patch(`parents/${editId}/`, body);
        toast({ tone: 'success', title: 'Guardian updated', body: 'Changes saved.' });
      } else {
        await api.post('parents/', body);
        toast({ tone: 'success', title: 'Guardian added', body: `${form.first_name} ${form.last_name} added.` });
      }
      setShowForm(false);
      parents.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: editId ? 'Update failed' : 'Add failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!delId) return;
    setBusy(true);
    try {
      await api.delete(`parents/${delId}/`);
      toast({ tone: 'success', title: 'Guardian deleted', body: `${delName} removed.` });
      setDelId(null);
      parents.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Delete failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Parents & Guardians"
        subtitle={live ? `${rows.length} guardians on record` : 'Manage parent and guardian contacts.'}
        actions={
          <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />} onClick={() => {
              downloadCSV('guardians', rows.map((r) => ({ Name: r.name, Phone: r.phone, Email: r.email, Occupation: r.occupation })));
              toast({ tone: 'success', title: 'Export ready', body: 'Guardians CSV downloaded.' });
            }}>Export</Button>
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={openAdd}>Add guardian</Button>
          </>
        } />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total guardians" value={String(rows.length)} tone="primary" />
        <Stat label="With portal login" value={live ? '—' : '812'} />
        <Stat label="Primary contacts" value={live ? '—' : '640'} tone="gold" />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} guardians`} subtitle="Click edit to change details, or remove a guardian" />
        {live && parents.error && <p className="px-5 pt-3 text-sm text-rose-600">{parents.error}</p>}
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search by name or email…" />
        {parents.loading && live ? <SkeletonTable rows={5} /> : (
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Guardian',
                render: (r: any) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" tone="gold" />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-[12px] text-ink-muted">{r.email}</span>
                    </span>
                  </span>
                )
              },
              { key: 'phone', header: 'Phone' },
              { key: 'occupation', header: 'Occupation', hideOnMobile: true },
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
            caption="Guardians" />
        )}
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? 'Edit guardian' : 'Add guardian'}
        description={editId ? 'Update contact details.' : 'Create a new parent/guardian record.'}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" required>
            <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </Field>
          <Field label="Last name" required>
            <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Occupation">
            <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
          </Field>
          <Field label="Employer">
            <Input value={form.employer} onChange={(e) => setForm({ ...form, employer: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button size="sm" disabled={busy} onClick={save}>{busy ? 'Saving…' : editId ? 'Save changes' : 'Add guardian'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={remove}
        title="Delete guardian?"
        body={`${delName} will be removed. Linked students keep their records.`}
        confirmLabel={busy ? 'Deleting…' : 'Delete guardian'}
        danger
      />
    </div>
  );
}
