import React, { useState } from 'react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Select, Stat, cx } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { MODULES, SCHOOLS } from '../../data/platform';
import { useApp } from '../../contexts/AppContext';

export function SuperModules() {
  const [school, setSchool] = useState(SCHOOLS[0].name);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(MODULES.map((m) => [m.name, m.enabled])));
  const { toast } = useApp();

  const on = MODULES.filter((m) => enabled[m.name]).length;

  return (
    <div>
      <PageHeader
        title="Modules"
        subtitle="Enable or disable platform modules for each school."
        actions={
        <Select value={school} onChange={(e) => setSchool(e.target.value)} className="h-9 w-64">
            {SCHOOLS.map((s) =>
          <option key={s.id}>{s.name}</option>
          )}
          </Select>
        } />
      

      <div className="mb-6">
        <Alert tone="info" title="Changes apply immediately">Disabling a module hides it from every user at that school, including administrators.</Alert>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Modules enabled" value={`${on} of ${MODULES.length}`} sub={school} tone="primary" />
        <Stat label="Average adoption" value={`${Math.round(MODULES.reduce((a, b) => a + b.usage, 0) / MODULES.length)}%`} sub="Across enabled modules" />
        <Stat label="Most used" value="Public Website" sub="96% adoption" tone="gold" />
        <Stat label="Least used" value="Gallery" sub="55% adoption" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const isOn = enabled[m.name];
          return (
            <Card key={m.name} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15.5px] font-semibold text-ink">{m.name}</h2>
                  <p className="text-[12.5px] text-ink-muted mt-0.5">{m.config}</p>
                </div>
                <Badge tone={isOn ? 'success' : 'neutral'}>{isOn ? 'Enabled' : 'Disabled'}</Badge>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12.5px] text-ink-muted mb-1.5">
                  <span>Usage</span>
                  <span className="tabular-nums">{isOn ? m.usage : 0}%</span>
                </div>
                <Progress value={isOn ? m.usage : 0} tone={m.usage < 60 ? 'gold' : 'forest'} label={`${m.name} usage`} />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`${isOn ? 'Disable' : 'Enable'} ${m.name}`}
                  onClick={() => {
                    setEnabled((e) => ({ ...e, [m.name]: !isOn }));
                    toast({ tone: isOn ? 'warning' : 'success', title: `${m.name} ${isOn ? 'disabled' : 'enabled'}`, body: `${school} · applied immediately.` });
                  }}
                  className={cx('relative h-6 w-11 rounded-full transition-colors duration-150', isOn ? 'bg-forest-600' : 'bg-line')}>
                  
                  <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-150', isOn ? 'left-[22px]' : 'left-0.5')} />
                </button>
                <span className="text-[13px] text-ink-muted">{isOn ? 'Available to this school' : 'Hidden from this school'}</span>
              </div>

              <Button variant="secondary" size="sm" full className="mt-4">
                Configure
              </Button>
            </Card>);

        })}
      </div>

      <Card className="mt-6">
        <CardHeader title="Module availability by plan" />
        <ul className="divide-y divide-line">
          {[
          ['Trial', '6 modules · Website, Admissions, CRM, Parent Portal, Academics, Communication'],
          ['Standard', '10 modules · adds Student Portal, LMS, Finance, Reports'],
          ['Premium', 'All 14 modules · adds HRM, CMS, Gallery, Events']].
          map(([plan, detail]) =>
          <li key={plan} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[14px] font-medium text-ink">{plan}</span>
              <span className="text-[13px] text-ink-muted">{detail}</span>
            </li>
          )}
        </ul>
      </Card>
    </div>);

}