import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { TEACHERS } from '../../data/people';
import { ROLE_LABELS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';

export function TeacherProfile() {
  const { role, toast } = useApp();
  const teacher = role === 'classteacher' ? TEACHERS[0] : TEACHERS[1];

  return (
    <div>
      <PageHeader
        title="My profile"
        subtitle="Your staff record, teaching allocation and account settings."
        actions={<Button size="sm" onClick={() => toast({ tone: 'success', title: 'Profile saved' })}>Save changes</Button>} />
      

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card className="p-5 text-center">
            <Avatar initials={teacher.name.split(' ').slice(-2).map((x) => x[0]).join('')} size="lg" />
            <p className="mt-3 font-serif text-[21px] text-ink">{teacher.name}</p>
            <p className="text-[13px] text-ink-muted">{ROLE_LABELS[role]}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge tone="success">{teacher.status}</Badge>
              <Badge tone="neutral">{teacher.staffNo}</Badge>
            </div>
          </Card>

          <Card>
            <CardHeader title="Teaching allocation" />
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-ink-soft">Subjects</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {teacher.subjects.map((s) =>
                  <li key={s} className="rounded-full border border-line bg-cream px-2.5 py-1 text-[12.5px] text-ink-muted">
                      {s}
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-wide text-ink-soft">Classes</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {teacher.classes.map((s) =>
                  <li key={s} className="rounded-full border border-line bg-cream px-2.5 py-1 text-[12.5px] text-ink-muted">
                      {s}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert tone="info" title="What your role can access">
            {role === 'classteacher' ?
            'All subjects, attendance, groups, results and parent communication for Grade 4 Acacia, plus your own HR records. School-wide finance and other staff records are not visible.' :
            'English data for Grade 4, 5 and 6 only, plus your own HR records. School finance, payroll, other subjects and restricted learner information are not visible.'}
          </Alert>

          <Card>
            <CardHeader title="Contact details" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Full name">
                <Input defaultValue={teacher.name} />
              </Field>
              <Field label="Staff number">
                <Input readOnly defaultValue={teacher.staffNo} />
              </Field>
              <Field label="School email">
                <Input defaultValue={teacher.email} />
              </Field>
              <Field label="Phone number">
                <Input defaultValue={teacher.phone} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notifications" />
            <div className="p-5 space-y-3.5">
              {[
              ['New submissions to grade', true],
              ['Parent replies', true],
              ['Leave and HR ticket updates', true],
              ['Duty reminders the day before', true],
              ['School-wide announcements', false]].
              map(([l, on]) =>
              <Checkbox key={l as string} label={l as string} defaultChecked={on as boolean} />
              )}
            </div>
          </Card>

          <Card className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-medium text-ink">HR records</p>
              <p className="text-[13px] text-ink-muted">Attendance, leave, payslips, duties and support tickets.</p>
            </div>
            <Link to="/teacher/hr/My attendance">
              <Button variant="secondary" size="sm">
                Open My HR
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>);

}