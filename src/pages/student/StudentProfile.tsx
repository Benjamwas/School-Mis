import React from 'react';
import { Avatar, Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { ATTENDANCE_SUMMARY } from '../../data/academics';
import { STUDENTS, TEACHERS } from '../../data/people';

export function StudentProfile() {
  const me = STUDENTS[0];

  return (
    <div>
      <PageHeader title="My profile" subtitle="Your details and settings. Only you and your teachers can see this." />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5 text-center">
          <Avatar initials={me.avatarInitials} size="lg" />
          <p className="mt-3 font-serif text-[22px] text-ink">{me.name}</p>
          <p className="text-[13px] text-ink-muted">
            {me.className} {me.stream} · Admission {me.admissionNo}
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <Badge tone="success">Active learner</Badge>
            <Badge tone="info">House: Baobab</Badge>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-left">
            {[
            ['Age', `${me.age} years`],
            ['Attendance', `${ATTENDANCE_SUMMARY.percentage}%`],
            ['Class teacher', TEACHERS[0].name],
            ['Parent', 'Grace Wanjiku Kamau']].
            map(([k, v]) =>
            <div key={k}>
                <dt className="text-[12px] text-ink-muted">{k}</dt>
                <dd className="text-[13.5px] font-medium text-ink">{v}</dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="space-y-6">
          <Alert tone="info" title="What you can see here">
            Your own learning, assignments, results and progress. Other learners’ information, fees and staff records are not part of your account.
          </Alert>

          <Card>
            <CardHeader title="My details" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Preferred name">
                <Input defaultValue="Wanjiru" />
              </Field>
              <Field label="Class">
                <Input readOnly defaultValue={`${me.className} ${me.stream}`} />
              </Field>
              <Field label="Portal username">
                <Input readOnly defaultValue="wanjiru.k" />
              </Field>
              <Field label="Password">
                <Input type="password" defaultValue="••••••••" />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notifications" />
            <div className="p-5 space-y-3.5">
              {[
              ['Tell me when new assignments are set', true],
              ['Tell me when work is marked', true],
              ['Remind me the day before a deadline', true],
              ['Celebrate new badges', true]].
              map(([l, on]) =>
              <Checkbox key={l as string} label={l as string} defaultChecked={on as boolean} />
              )}
            </div>
            <div className="px-5 py-4 border-t border-line flex justify-end">
              <Button size="sm">Save settings</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}