import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { PLATFORM_SUMMARY, SCHOOLS } from '../../data/platform';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiSchool } from '../../api/types';

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SuperSchools() {
  const navigate = useNavigate();
  const live = useApiLive();
  const schoolsRes = useList<ApiSchool>('/schools/schools/');

  const rows = useMemo(() => {
    if (!schoolsRes.data) return null;
    return schoolsRes.data.map((s) => ({
      id: s.id,
      name: s.name,
      county: s.slug ?? '—',
       learners: 0,
       staff: 0,
       admins: 0,
      status: titleCase(s.status),
      plan: (s.code || '—').toUpperCase(),
       modules: 0,
      since: '—'
    }));
  }, [schoolsRes.data]);

  const table = useTableState(
    rows ?? SCHOOLS,
    (r, q) => r.name.toLowerCase().includes(q) || String(r.county).toLowerCase().includes(q),
    6
  );

  const active = rows ? rows.filter((r) => r.status === 'Active').length : PLATFORM_SUMMARY.active;
  const trial = rows ? rows.filter((r) => r.status === 'Trial').length : PLATFORM_SUMMARY.trial;
  const suspended = rows ? rows.filter((r) => r.status === 'Suspended').length : PLATFORM_SUMMARY.suspended;

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
      

      {live && schoolsRes.error &&
      <p className="text-sm text-rose-600">{schoolsRes.error}</p>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active" value={active} sub="Fully subscribed" tone="primary" />
        <Stat label="Trial" value={trial} sub="1 ends in 6 days" tone="gold" />
        <Stat label="Suspended" value={suspended} sub="Coast Star Academy" tone="danger" />
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
