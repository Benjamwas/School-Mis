import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { AreaChartBlock, BarChartBlock, ChartFrame, DataTable, Pagination, TableToolbar, Tabs, useTableState } from '../../components/ui/data';
import { AUDIT_LOGS, INTEGRATIONS, MODULES, PLATFORM_ACTIVITY, SCHOOLS } from '../../data/platform';
import { useApiLive, useList, useObject } from '../../api/hooks';
import type { ApiAuditLog } from '../../api/types';

const TABS = ['Audit logs', 'Analytics', 'Integrations'];

interface AuditSummary {
  by_module?: Record<string, Record<string, number>>;
  total?: number;
}

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function dayMonthTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}`;
}

export function SuperAudit() {
  const { tab = 'Audit logs' } = useParams();
  const navigate = useNavigate();
  const live = useApiLive();
  const logs = useList<ApiAuditLog>('/audit/logs');
  const summary = useObject<AuditSummary>('/audit/summary');

  const liveRows = useMemo(() => {
    if (!logs.data) return null;
    return logs.data.map((l) => {
      const target = [l.entity_type, l.entity_id].filter(Boolean).join(' ');
      return {
        user: l.user_name || '—',
        role: (l as unknown as { school_name?: string }).school_name ?? '—',
        action: titleCase(String(l.action ?? '')),
        module: titleCase(String(l.module ?? '')),
        target: target || '—',
        when: dayMonthTime(l.created_at),
        status: 'Success'
      };
    });
  }, [logs.data]);

  const table = useTableState(
    liveRows ?? AUDIT_LOGS,
    (r, q) => r.user.toLowerCase().includes(q) || r.action.toLowerCase().includes(q) || String(r.module).toLowerCase().includes(q),
    6
  );

  const moduleBreakdown = useMemo(() => {
    const byModule = summary.data?.by_module;
    if (!byModule) return null;
    return Object.entries(byModule).map(([module, actions]) => ({
      module: titleCase(module),
      actions: Object.entries(actions).map(([action, count]) => ({ action: titleCase(action), count }))
    }));
  }, [summary.data]);

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
      

      {live && (logs.error ?? summary.error) &&
      <p className="text-sm text-rose-600">{logs.error ?? summary.error}</p>
      }

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/super/audit/${t}`)} />
      </div>

      {tab === 'Audit logs' &&
      <Card>
          <CardHeader title={`${table.total} recorded events`} subtitle={liveRows ? `${summary.data?.total ?? table.total} events on record` : 'Last 7 days across all schools'} />
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
            <Stat label="Audit events" value={summary.data?.total ?? '26,355'} sub={summary.data ? 'All time' : '+8% on last week'} tone="primary" />
            <Stat label="Daily active users" value="5,120" sub="Peak on Friday" />
            <Stat label="Mobile share" value="71%" sub="Parents and learners" tone="gold" />
            <Stat label="Average session" value="6m 12s" sub="Across all roles" />
          </div>
          {moduleBreakdown &&
          <Card>
            <CardHeader title="Audit activity by module" subtitle="Grouped counts from the platform audit trail" />
            <ul className="divide-y divide-line">
              {moduleBreakdown.map((m) =>
              <li key={m.module} className="px-5 py-3.5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">{m.module}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    {m.actions.map((a) => `${a.action} (${a.count})`).join(' · ') || '—'}
                  </p>
                </div>
                <Badge tone="neutral">{m.actions.reduce((a, b) => a + b.count, 0)}</Badge>
              </li>
              )}
              {moduleBreakdown.length === 0 &&
              <li className="px-5 py-4 text-[13px] text-ink-muted">No audit events recorded yet.</li>
              }
            </ul>
          </Card>
          }
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