import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, Tabs, useTableState } from '../../components/ui/data';
import { PLATFORM_SUMMARY, PLATFORM_USERS, SCHOOLS } from '../../data/platform';

const TABS = ['Administrators', 'All users'];

export function SuperUsers() {
  const { tab = 'Administrators' } = useParams();
  const navigate = useNavigate();

  const pool = tab === 'Administrators' ? PLATFORM_USERS.filter((u) => u.role.includes('Administrator')) : PLATFORM_USERS;
  const table = useTableState(pool, (r, q) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.school.toLowerCase().includes(q), 6);

  return (
    <div>
      <PageHeader
        title="Platform users"
        subtitle="School administrators, finance and HR staff with platform-level accounts."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Invite user
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Administrators" value={PLATFORM_SUMMARY.administrators} sub="Across 12 schools" tone="primary" />
        <Stat label="Platform users" value={PLATFORM_SUMMARY.users.toLocaleString()} sub="Parents, learners and staff" />
        <Stat label="Invitations pending" value="1" sub="Rift Valley Montessori" tone="gold" />
        <Stat label="Suspended accounts" value="1" sub="Coast Star Academy" tone="danger" />
      </div>

      <div className="mt-6 mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/super/users/${t}`)} />
      </div>

      <Card>
        <CardHeader title={`${table.total} accounts`} subtitle={tab} />
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search name, email or school…" />
        <DataTable
          columns={[
          {
            key: 'name',
            header: 'User',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                  <Avatar initials={r.name.split(' ').slice(-2).map((x: string) => x[0]).join('')} size="sm" />
                  <span>
                    <span className="block font-medium">{r.name}</span>
                    <span className="block text-[12px] text-ink-muted">{r.email}</span>
                  </span>
                </span>

          },
          { key: 'school', header: 'School', hideOnMobile: true },
          { key: 'role', header: 'Role', render: (r: any) => <Badge tone="neutral">{r.role}</Badge> },
          { key: 'lastActive', header: 'Last active', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                  Manage
                </Button>

          }]
          }
          rows={table.slice}
          mobileTitle={(r: any) => r.name}
          caption="Platform users" />
        
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>

      <Card className="mt-6">
        <CardHeader title="Users by school" subtitle="Portal accounts per school" />
        <DataTable
          columns={[
          { key: 'name', header: 'School', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'admins', header: 'Admins', align: 'right' },
          { key: 'staff', header: 'Staff', align: 'right', hideOnMobile: true },
          { key: 'learners', header: 'Learners', align: 'right', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={SCHOOLS}
          mobileTitle={(r: any) => r.name}
          caption="Users by school" />
        
      </Card>
    </div>);

}