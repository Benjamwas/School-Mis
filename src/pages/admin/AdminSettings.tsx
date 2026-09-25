import React, { useState } from 'react';
import { Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader, Select } from '../../components/ui/primitives';
import { Tabs } from '../../components/ui/data';
import { SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';

const TABS = ['School profile', 'Academic', 'Permissions', 'Payments', 'Notifications', 'Website'];

export function AdminSettings() {
  const [tab, setTab] = useState(TABS[0]);
  const { toast } = useApp();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="School-level configuration. Platform-wide settings are managed by the super administrator."
        actions={<Button size="sm" onClick={() => toast({ tone: 'success', title: 'Settings saved' })}>Save changes</Button>} />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'School profile' &&
      <Card>
          <CardHeader title="School profile" subtitle="Shown on the website, receipts and reports" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="School name" className="sm:col-span-2">
              <Input defaultValue={SCHOOL.name} />
            </Field>
            <Field label="Phone">
              <Input defaultValue={SCHOOL.phone} />
            </Field>
            <Field label="Email">
              <Input defaultValue={SCHOOL.email} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input defaultValue={SCHOOL.address} />
            </Field>
            <Field label="Office hours">
              <Input defaultValue={SCHOOL.hours} />
            </Field>
            <Field label="Motto">
              <Input defaultValue={SCHOOL.motto} />
            </Field>
          </div>
        </Card>
      }

      {tab === 'Academic' &&
      <Card>
          <CardHeader title="Academic settings" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="Current academic year">
              <Select defaultValue="2026">
                <option>2026</option>
                <option>2027</option>
              </Select>
            </Field>
            <Field label="Current term">
              <Select defaultValue="Term 3">
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </Select>
            </Field>
            <Field label="Grading scale">
              <Select defaultValue="CBC competency bands">
                <option>CBC competency bands</option>
                <option>Percentage only</option>
              </Select>
            </Field>
            <Field label="Report release">
              <Select defaultValue="Manual — admin approves">
                <option>Manual — admin approves</option>
                <option>Automatic at term end</option>
              </Select>
            </Field>
          </div>
        </Card>
      }

      {tab === 'Permissions' &&
      <Card>
          <CardHeader title="Role permissions" subtitle="What each role can see and do in the portal" />
          <div className="p-5 space-y-5">
            {[
          ['Class Teacher', ['All subjects for their class', 'Attendance register', 'Parent communication', 'Fee status summary only']],
          ['Subject Teacher', ['Their subject only', 'Assignments and results for their classes', 'No fee, payroll or HR records']],
          ['Parent', ['Their own children only', 'Academics, attendance, fees, messages']],
          ['Student', ['Their own learning and results only']],
          ['Finance Admin', ['Payments, balances, receipts, collections', 'No academic or HR records']],
          ['HR Admin', ['Staff records, leave, payroll, tickets', 'No learner academic data']]].
          map(([role, items]) =>
          <div key={role as string} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-semibold text-ink">{role}</p>
                  <Badge tone="success">Enabled</Badge>
                </div>
                <ul className="mt-2 space-y-1">
                  {(items as string[]).map((i) =>
              <li key={i} className="text-[13px] text-ink-muted">
                      · {i}
                    </li>
              )}
                </ul>
              </div>
          )}
          </div>
        </Card>
      }

      {tab === 'Payments' &&
      <Card>
          <CardHeader title="Payment settings" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="M-Pesa Paybill">
              <Input defaultValue="522533" />
            </Field>
            <Field label="Account format">
              <Input defaultValue="Admission number" />
            </Field>
            <Field label="Bank account">
              <Input defaultValue="KCB Muthaiga · 1157 2290 447" />
            </Field>
            <Field label="Late payment reminder">
              <Select defaultValue="7 days before deadline">
                <option>7 days before deadline</option>
                <option>3 days before deadline</option>
                <option>On deadline only</option>
              </Select>
            </Field>
            <div className="sm:col-span-2 space-y-3">
              <Checkbox label="Allow partial payments from the parent portal" defaultChecked />
              <Checkbox label="Send an automatic receipt after every payment" defaultChecked />
              <Checkbox label="Allow instalment plans without finance approval" />
            </div>
          </div>
        </Card>
      }

      {tab === 'Notifications' &&
      <Card>
          <CardHeader title="Notification settings" />
          <div className="p-5 space-y-3.5">
            {[
          ['Notify parents when an assignment is set', true],
          ['Notify parents when work is graded', true],
          ['Notify parents of absence on the day', true],
          ['Send fee reminders by SMS', true],
          ['Notify staff of leave decisions', true],
          ['Weekly summary email to parents', false]].
          map(([l, on]) =>
          <Checkbox key={l as string} label={l as string} defaultChecked={on as boolean} />
          )}
          </div>
        </Card>
      }

      {tab === 'Website' &&
      <Card>
          <CardHeader title="Website settings" subtitle="Public site content and visibility" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="Domain">
              <Input defaultValue="salaschools.ac.ke" />
            </Field>
            <Field label="Admissions banner">
              <Select defaultValue="Admissions open — January 2027">
                <option>Admissions open — January 2027</option>
                <option>Hidden</option>
              </Select>
            </Field>
            <div className="sm:col-span-2 space-y-3">
              <Checkbox label="Show the gallery on the public website" defaultChecked />
              <Checkbox label="Show news and events" defaultChecked />
              <Checkbox label="Allow online applications" defaultChecked />
              <Checkbox label="Allow school visit booking" defaultChecked />
            </div>
          </div>
        </Card>
      }
    </div>);

}