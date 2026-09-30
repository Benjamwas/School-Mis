import React from 'react';
import { MailIcon, PlusIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { GUARDIANS, STUDENTS } from '../../data/people';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiParent } from '../../api/types';

export function AdminParents() {
  const live = useApiLive();
  const parents = useList<ApiParent>('parents/');

  const rows: any[] = live
    ? (parents.data ?? []).map((p) => ({
      id: p.id,
      name: p.full_name || p.person?.full_name || '—',
      relationship: p.occupation || 'Guardian',
      phone: p.person?.phone ?? '',
      email: p.person?.email ?? '',
      occupation: p.occupation ?? '',
      address: '',
      childIds: [] as string[]
    }))
    : GUARDIANS;

  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.email.toLowerCase().includes(q), 8);

  return (
    <div>
      <PageHeader
        title="Parents & guardians"
        subtitle="932 families with portal access across 1,148 learners."
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<MailIcon size={15} />}>
              Message all
            </Button>
            <Button size="sm" icon={<PlusIcon size={15} />}>
              Add guardian
            </Button>
          </>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Registered families" value="932" sub="81% portal adoption" tone="primary" />
        <Stat label="Active this week" value="704" sub="Signed in at least once" />
        <Stat label="Not yet activated" value="178" sub="Invitation pending" tone="gold" />
        <Stat label="Families with balances" value="214" sub="Term 3 fees" tone="danger" />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} guardians`} />
        {live && parents.error &&
        <p className="px-5 pt-3 text-sm text-rose-600">{parents.error}</p>
        }
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search name, phone or email…" />
        <DataTable
          columns={[
          {
            key: 'name',
            header: 'Guardian',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                  <Avatar initials={r.name.split(' ').map((x: string) => x[0]).slice(0, 2).join('')} size="sm" tone="gold" />
                  <span>
                    <span className="block font-medium">{r.name}</span>
                    <span className="block text-[12px] text-ink-muted">{r.relationship}</span>
                  </span>
                </span>

          },
          {
            key: 'children',
            header: 'Children',
            render: (r: any) => r.childIds.map((c: string) => STUDENTS.find((s) => s.id === c)?.name.split(' ')[0]).join(', ')
          },
          { key: 'phone', header: 'Phone', hideOnMobile: true },
          { key: 'email', header: 'Email', hideOnMobile: true },
          { key: 'portal', header: 'Portal', render: (r: any) => <Badge tone={r.id === 'p9' ? 'warning' : 'success'}>{r.id === 'p9' ? 'Invited' : 'Active'}</Badge> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                  Open
                </Button>

          }]
          }
          rows={table.slice}
          mobileTitle={(r: any) => r.name}
          caption="Guardians" />
        
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>
    </div>);

}