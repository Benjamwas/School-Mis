import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader, Select } from '../../components/ui/primitives';
import { Tabs } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { MODULES, SCHOOLS } from '../../data/platform';
import { useApp } from '../../contexts/AppContext';

const TABS = ['Platform', 'School defaults', 'Security', 'Branding'];

export function SuperSettings() {
  const { tab = 'Platform' } = useParams();
  const navigate = useNavigate();
  const { toast } = useApp();

  return (
    <div>
      <PageHeader
        title="Platform settings"
        subtitle="Global configuration applied across every school on the platform."
        actions={<Button size="sm" onClick={() => toast({ tone: 'success', title: 'Platform settings saved' })}>Save changes</Button>} />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/super/settings/${t}`)} />
      </div>

      {tab === 'Platform' &&
      <div className="space-y-6">
          <Alert tone="warning" title="Global settings affect all 12 schools">Changes here override school-level preferences where they conflict.</Alert>
          <Card>
            <CardHeader title="Platform profile" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Platform name">
                <Input defaultValue="SALA Schools Platform" />
              </Field>
              <Field label="Support email">
                <Input defaultValue="support@salaplatform.co.ke" />
              </Field>
              <Field label="Default currency">
                <Select defaultValue="KES — Kenyan Shilling">
                  <option>KES — Kenyan Shilling</option>
                  <option>USD — US Dollar</option>
                </Select>
              </Field>
              <Field label="Default timezone">
                <Select defaultValue="Africa/Nairobi (EAT)">
                  <option>Africa/Nairobi (EAT)</option>
                  <option>UTC</option>
                </Select>
              </Field>
              <Field label="Default language">
                <Select defaultValue="English">
                  <option>English</option>
                  <option>Kiswahili</option>
                </Select>
              </Field>
              <Field label="Maintenance window">
                <Input defaultValue="Sundays, 1:00am – 3:00am EAT" />
              </Field>
            </div>
          </Card>
        </div>
      }

      {tab === 'School defaults' &&
      <div className="space-y-6">
          <Card>
            <CardHeader title="Defaults for new schools" subtitle="Applied when a school is onboarded" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Default plan">
                <Select defaultValue="Trial">
                  <option>Trial</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </Select>
              </Field>
              <Field label="Trial length">
                <Select defaultValue="30 days">
                  <option>14 days</option>
                  <option>30 days</option>
                  <option>60 days</option>
                </Select>
              </Field>
              <div className="sm:col-span-2 space-y-3">
                {MODULES.slice(0, 6).map((m) =>
              <Checkbox key={m.name} label={`Enable ${m.name} by default`} defaultChecked={m.enabled} />
              )}
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Schools on non-default configuration" />
            <ul className="divide-y divide-line">
              {SCHOOLS.filter((s) => s.modules < 14).map((s) =>
            <li key={s.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-medium text-ink">{s.name}</p>
                    <p className="text-[12.5px] text-ink-muted">
                      {s.modules} of 14 modules · {s.plan}
                    </p>
                  </div>
                  <Badge tone="neutral">{s.status}</Badge>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Security' &&
      <Card>
          <CardHeader title="Security & access" />
          <div className="p-5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Session timeout">
                <Select defaultValue="30 minutes">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                </Select>
              </Field>
              <Field label="Password policy">
                <Select defaultValue="Strong — 10 characters, mixed case, number">
                  <option>Standard — 8 characters</option>
                  <option>Strong — 10 characters, mixed case, number</option>
                </Select>
              </Field>
            </div>
            <div className="space-y-3">
              {[
            ['Require two-factor authentication for administrators', true],
            ['Require two-factor authentication for finance staff', true],
            ['Allow Google Workspace single sign-on for staff', true],
            ['Log every record view in the audit trail', true],
            ['Allow super admin impersonation of school accounts', false]].
            map(([l, on]) =>
            <Checkbox key={l as string} label={l as string} defaultChecked={on as boolean} />
            )}
            </div>
          </div>
        </Card>
      }

      {tab === 'Branding' &&
      <Card>
          <CardHeader title="Platform branding" subtitle="Applied to login screens and system emails" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="Primary colour">
              <Input defaultValue="#1F5E43 — Forest" />
            </Field>
            <Field label="Accent colour">
              <Input defaultValue="#D4A23A — Gold" />
            </Field>
            <Field label="Logo">
              <Input type="file" className="h-auto py-2.5" />
            </Field>
            <Field label="Email sender name">
              <Input defaultValue="SALA Schools" />
            </Field>
            <div className="sm:col-span-2 space-y-3">
              <Checkbox label="Allow schools to override the colour palette" defaultChecked />
              <Checkbox label="Show platform branding on school login pages" />
            </div>
          </div>
        </Card>
      }
    </div>);

}