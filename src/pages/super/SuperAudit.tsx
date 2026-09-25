import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { AreaChartBlock, BarChartBlock, ChartFrame, DataTable, Pagination, TableToolbar, Tabs, useTableState } from '../../components/ui/data';
import { AUDIT_LOGS, INTEGRATIONS, MODULES, PLATFORM_ACTIVITY, SCHOOLS } from '../../data/platform';

const TABS = ['Audit logs', 'Analytics', 'Integrations'];

export function SuperAudit() {
  const { tab = 'Audit logs' } = useParams();
  const navigate = useNavigate();
  const table = useTableState(AUDIT_LOGS, (r, q) => r.user.toLowerCase().includes(q) || r.action.toLowerCase().includes(q) || r.module.toLowerCase().includes(q), 6);

  return (
    <div>
      <PageHeader
        title="Activity & analytics"
        subtitle="Platform-wide audit trail, usage analytics and third-party integrations."
        actions={
        <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
            Export log
          </Button>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/super/audit/${t}`)} />
      </div>

      {tab === 'Audit logs' &&
      <Card>
          <CardHeader title={`${table.total} recorded events`} subtitle="Last 7 days across all schools" />
          <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search user, action or module…" />
          <DataTable
          columns={[
          {
            key: 'user',
            header: 'User',
            render: (r: any) =>
            <span>
                    <span className="block font-medium">{r.user}</span>
                    <span className="block text-[12px] text-ink-muted">{r.role}</span>
                  </span>

          },
          { key: 'action', header: 'Action' },
          { key: 'target', header: 'Detail', hideOnMobile: true },
          { key: 'module', header: 'Module', render: (r: any) => <Badge tone="neutral">{r.module}</Badge>, hideOnMobile: true },
          { key: 'when', header: 'When', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={table.slice}
          mobileTitle={(r: any) => `${r.user} · ${r.action}`}
          caption="Audit logs" />
        
          <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
        </Card>
      }

      {tab === 'Analytics' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Sessions this week" value="26,355" sub="+8% on last week" tone="primary" />
            <Stat label="Daily active users" value="5,120" sub="Peak on Friday" />
            <Stat label="Mobile share" value="71%" sub="Parents and learners" tone="gold" />
            <Stat label="Average session" value="6m 12s" sub="Across all roles" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Sessions this week" subtitle="All schools">
              <AreaChartBlock data={PLATFORM_ACTIVITY} xKey="day" areaKey="sessions" name="Sessions" />
            </ChartFrame>
            <ChartFrame title="Module usage" subtitle="Adoption across schools">
              <BarChartBlock data={MODULES.slice(0, 8).map((m) => ({ name: m.name, usage: m.usage }))} xKey="name" bars={[{ key: 'usage', name: 'Adoption %', color: '#1F5E43' }]} />
            </ChartFrame>
          </div>
          <Card>
            <CardHeader title="Usage by school" />
            <DataTable
            columns={[
            { key: 'name', header: 'School', render: (r: any) => <span className="font-medium">{r.name}</span> },
            { key: 'learners', header: 'Learners', align: 'right' },
            { key: 'modules', header: 'Modules', align: 'right', hideOnMobile: true },
            { key: 'plan', header: 'Plan', hideOnMobile: true },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={SCHOOLS}
            mobileTitle={(r: any) => r.name}
            caption="Usage by school" />
          
          </Card>
        </div>
      }

      {tab === 'Integrations' &&
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {INTEGRATIONS.map((i) =>
        <Card key={i.name} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15.5px] font-semibold text-ink">{i.name}</h2>
                  <p className="text-[12.5px] text-ink-muted mt-0.5">{i.category}</p>
                </div>
                <StatusBadge status={i.status} />
              </div>
              <p className="mt-3 text-[13.5px] text-ink-muted">{i.detail}</p>
              <Button variant="secondary" size="sm" full className="mt-4">
                {i.status === 'Connected' ? 'Manage connection' : 'Connect'}
              </Button>
            </Card>
        )}
        </div>
      }
    </div>);

}