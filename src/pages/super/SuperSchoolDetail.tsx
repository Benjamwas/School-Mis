import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable } from '../../components/ui/data';
import { AUDIT_LOGS, MODULES, PLATFORM_USERS, SCHOOLS } from '../../data/platform';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useDetail, useList } from '../../api/hooks';
import type { ApiSchool, ApiSchoolModule } from '../../api/types';

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SuperSchoolDetail() {
  const { id = 'sc1' } = useParams();
  const live = useApiLive();
  const schoolRes = useDetail<ApiSchool>('/schools/schools/', id);
  const schoolModules = useList<ApiSchoolModule>('/schools/school-modules/');
  const school = SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[0];
  const { toast } = useApp();

  const liveSchool = useMemo(() => {
    if (!schoolRes.data) return null;
    return {
      name: schoolRes.data.name,
      county: schoolRes.data.slug ?? '—',
      learners: '—' as const,
      staff: '—' as const,
      admins: '—' as const,
      plan: (schoolRes.data.code || '—').toUpperCase(),
      since: '—' as const,
      status: titleCase(schoolRes.data.status)
    };
  }, [schoolRes.data]);

  const liveModules = useMemo(() => {
    if (!schoolModules.data) return null;
    return schoolModules.data
      .filter((m) => m.school === id)
      .map((m) => ({
        name: m.module_name,
        enabled: m.enabled,
        usage: m.enabled ? 100 : 0,
        config: m.module_code
      }));
  }, [schoolModules.data, id]);

  const head = liveSchool ?? school;
  const modules = liveModules ?? MODULES;
  const enabledCount = liveModules ? liveModules.filter((m) => m.enabled).length : school.modules;
  const error = schoolRes.error ?? schoolModules.error;

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/super/schools" className="hover:text-ink">
          Schools
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{head.name}</span>
      </nav>

      <PageHeader
        title={head.name}
        subtitle={`${head.county} · ${head.plan} plan · on the platform since ${head.since}`}
        actions={
        <>
            <Link to="/super/modules">
              <Button size="sm" variant="secondary">
                Manage modules
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={() => toast({ tone: 'warning', title: 'School suspended', body: `${head.name} portal access has been disabled.` })}>
              Suspend school
            </Button>
          </>
        } />
      

      {live && error &&
      <p className="text-sm text-rose-600">{error}</p>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Learners" value={head.learners} sub="Enrolled" tone="primary" />
        <Stat label="Staff" value={head.staff} sub="Teaching and support" />
        <Stat label="Administrators" value={head.admins} sub="With portal access" />
        <Stat label="Modules enabled" value={`${enabledCount} of 14`} sub={head.plan} tone="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Enabled modules" subtitle="Toggled per school by the platform team" />
            <ul className="divide-y divide-line max-h-96 overflow-y-auto sala-scroll">
              {modules.map((m) =>
              <li key={m.name} className="px-5 py-3 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink">{m.name}</p>
                    <p className="text-[12.5px] text-ink-muted">{m.config}</p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <Progress value={m.usage} label={m.name} />
                  </div>
                  <Badge tone={m.enabled ? 'success' : 'neutral'}>{m.enabled ? 'Enabled' : 'Disabled'}</Badge>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Recent activity" />
            <DataTable
              columns={[
              { key: 'user', header: 'User', render: (r: any) => <span className="font-medium">{r.user}</span> },
              { key: 'action', header: 'Action' },
              { key: 'module', header: 'Module', hideOnMobile: true },
              { key: 'when', header: 'When', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
              }
              rows={AUDIT_LOGS.slice(0, 5)}
              caption="Recent activity" />
            
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="School profile" />
            <dl className="divide-y divide-line">
              {[
              ['Status', head.status],
              ['Plan', head.plan],
              ['County', head.county],
              ['Onboarded', head.since],
              ['Primary domain', 'salaschools.ac.ke'],
              ['Billing contact', 'p.njoroge@salaschools.ac.ke']].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
                  <dt className="text-[13px] text-ink-muted">{k}</dt>
                  <dd className="text-[13.5px] font-medium text-ink text-right">{v}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Administrators" />
            <ul className="divide-y divide-line">
              {PLATFORM_USERS.slice(0, 3).map((u) =>
              <li key={u.email} className="px-5 py-3">
                  <p className="text-[13.5px] font-medium text-ink">{u.name}</p>
                  <p className="text-[12.5px] text-ink-muted">{u.role}</p>
                  <p className="text-[11.5px] text-ink-soft mt-0.5">Last active {u.lastActive}</p>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/super/users/Administrators" className="text-[13px] font-medium text-forest-700 hover:underline">
                All administrators
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}