import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { PLATFORM_SUMMARY, SCHOOLS } from '../../data/platform';

export function SuperSchools() {
  const navigate = useNavigate();
  const table = useTableState(SCHOOLS, (r, q) => r.name.toLowerCase().includes(q) || r.county.toLowerCase().includes(q), 6);

  return (
    <div>
      <PageHeader
        title="Schools"
        subtitle="Every school on the platform, their plan, modules and status."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Onboard school
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active" value={PLATFORM_SUMMARY.active} sub="Fully subscribed" tone="primary" />
        <Stat label="Trial" value={PLATFORM_SUMMARY.trial} sub="1 ends in 6 days" tone="gold" />
        <Stat label="Suspended" value={PLATFORM_SUMMARY.suspended} sub="Coast Star Academy" tone="danger" />
        <Stat label="Total learners" value="4,409" sub="Across all schools" />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} schools`} />
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search school or county…" />
        <DataTable
          columns={[
          { key: 'name', header: 'School', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'county', header: 'County', hideOnMobile: true },
          { key: 'learners', header: 'Learners', align: 'right' },
          { key: 'staff', header: 'Staff', align: 'right', hideOnMobile: true },
          { key: 'modules', header: 'Modules', align: 'right', hideOnMobile: true },
          { key: 'plan', header: 'Plan', render: (r: any) => <Badge tone="neutral">{r.plan}</Badge> },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            <Link to={`/super/school/${r.id}`}>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </Link>

          }]
          }
          rows={table.slice}
          onRowClick={(r: any) => navigate(`/super/school/${r.id}`)}
          mobileTitle={(r: any) => r.name}
          caption="Schools" />
        
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>
    </div>);

}