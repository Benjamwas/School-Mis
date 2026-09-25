import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2Icon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge } from '../../components/ui/primitives';
import { AreaChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { AUDIT_LOGS, MODULES, PLATFORM_ACTIVITY, PLATFORM_SUMMARY, SCHOOLS } from '../../data/platform';
import { useList } from '../../api/hooks';
import type { ApiSchool } from '../../api/types';

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SuperDashboard() {
  const schools = useList<ApiSchool>('/schools/schools/');

  const liveSchools = useMemo(() => {
    if (!schools.data) return null;
    return schools.data.map((s: ApiSchool) => ({
      name: s.name,
      county: s.slug ?? '—',
      learners: '—',
      plan: (s.code || '—').toUpperCase(),
      status: titleCase(s.status),
    }));
  }, [schools]);

  const schoolCount = liveSchools ? liveSchools.length : PLATFORM_SUMMARY.schools;
  const activeSchools = liveSchools ? liveSchools.filter((r) => r.status === 'Active').length : PLATFORM_SUMMARY.active;
  const schoolSub = liveSchools ? `${activeSchools} active on platform` : `${PLATFORM_SUMMARY.active} active · ${PLATFORM_SUMMARY.trial} trial`;
  return (
    <div>
      <PageHeader
        title="Platform dashboard"
        subtitle={`SALA Schools platform · ${schoolCount} schools`}
        actions={
        <Link to="/super/schools">
            <Button size="sm">Manage schools</Button>
          </Link>
        } />
      

      <div className="mb-6">
        <Alert tone="error" title="Coast Star Academy is suspended">Subscription lapsed three weeks ago. 574 learners currently have no portal access.</Alert>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Schools" value={schoolCount} sub={schoolSub} icon={<Building2Icon size={16} />} tone="primary" />
        <Stat label="Administrators" value={PLATFORM_SUMMARY.administrators} sub="Across all schools" icon={<ShieldCheckIcon size={16} />} />
        <Stat label="Platform users" value={PLATFORM_SUMMARY.users.toLocaleString()} sub="Parents, learners and staff" icon={<UsersIcon size={16} />} />
        <Stat label="Uptime" value={PLATFORM_SUMMARY.uptime} sub="Last 30 days" tone="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <ChartFrame title="Platform activity" subtitle="Sessions per day this week">
          <AreaChartBlock data={PLATFORM_ACTIVITY} xKey="day" areaKey="sessions" name="Sessions" />
        </ChartFrame>
        <Card>
          <CardHeader title="Module adoption" subtitle="Enabled across schools" />
          <ul className="divide-y divide-line max-h-64 overflow-y-auto sala-scroll">
            {MODULES.slice(0, 7).map((m) =>
            <li key={m.name} className="px-5 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13.5px] text-ink">{m.name}</span>
                  <span className="text-[12.5px] text-ink-muted tabular-nums">{m.usage}%</span>
                </div>
                <Progress className="mt-1.5" value={m.usage} label={m.name} />
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader title="Schools" subtitle="Status across the platform" action={<Link to="/super/schools" className="text-[13px] font-medium text-forest-700 hover:underline">All schools</Link>} />
          <DataTable
            columns={[
            { key: 'name', header: 'School', render: (r: any) => <span className="font-medium">{r.name}</span> },
            { key: 'county', header: 'County', hideOnMobile: true },
            { key: 'learners', header: 'Learners', align: 'right' },
            { key: 'plan', header: 'Plan', render: (r: any) => <Badge tone="neutral">{r.plan}</Badge>, hideOnMobile: true },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={liveSchools ?? SCHOOLS}
            mobileTitle={(r: any) => r.name}
            caption="Schools" />
          
        </Card>

        <Card>
          <CardHeader title="Recent platform activity" action={<Link to="/super/audit/Audit logs" className="text-[13px] font-medium text-forest-700 hover:underline">Audit log</Link>} />
          <ul className="divide-y divide-line">
            {AUDIT_LOGS.slice(0, 5).map((a, i) =>
            <li key={i} className="px-5 py-3">
                <p className="text-[13.5px] font-medium text-ink">
                  {a.user} · {a.action}
                </p>
                <p className="text-[12.5px] text-ink-muted">{a.target}</p>
                <p className="text-[11.5px] text-ink-soft mt-0.5">
                  {a.when} · {a.module}
                </p>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}