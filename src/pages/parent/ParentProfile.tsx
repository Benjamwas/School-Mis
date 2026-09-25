import React from 'react';
import { Avatar, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader, Select } from '../../components/ui/primitives';
import { GUARDIANS, STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

export function ParentProfile() {
  const parent = GUARDIANS[0];
  const children = STUDENTS.filter((s) => parent.childIds.includes(s.id));
  const { toast } = useApp();

  return (
    <div>
      <PageHeader
        title="My profile"
        subtitle="Your details, linked children and notification preferences."
        actions={<Button size="sm" onClick={() => toast({ tone: 'success', title: 'Profile updated', body: 'Your changes have been saved.' })}>Save changes</Button>} />
      

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Personal details" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Full name">
                <Input defaultValue={parent.name} />
              </Field>
              <Field label="Relationship">
                <Input defaultValue={parent.relationship} />
              </Field>
              <Field label="Phone number">
                <Input defaultValue={parent.phone} />
              </Field>
              <Field label="Email address">
                <Input defaultValue={parent.email} />
              </Field>
              <Field label="Occupation">
                <Input defaultValue={parent.occupation} />
              </Field>
              <Field label="Home address">
                <Input defaultValue={parent.address} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notification preferences" subtitle="How the school reaches you" />
            <div className="p-5 space-y-3.5">
              {[
              ['Assignment and grading updates', true],
              ['Attendance alerts (absence or late arrival)', true],
              ['Fee reminders and payment receipts', true],
              ['School announcements and newsletters', true],
              ['Event invitations and reminders', false],
              ['SMS in addition to in-app notifications', true]].
              map(([label, on]) =>
              <Checkbox key={label as string} label={label as string} defaultChecked={on as boolean} />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Security" />
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <Field label="Current password">
                <Input type="password" defaultValue="••••••••" />
              </Field>
              <Field label="New password">
                <Input type="password" placeholder="At least 8 characters" />
              </Field>
              <Field label="Preferred language">
                <Select defaultValue="English">
                  <option>English</option>
                  <option>Kiswahili</option>
                </Select>
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 text-center">
            <Avatar initials="GK" size="lg" tone="gold" />
            <p className="mt-3 text-[16px] font-semibold text-ink">{parent.name}</p>
            <p className="text-[13px] text-ink-muted">Parent · 2 children enrolled</p>
            <Button variant="secondary" size="sm" className="mt-4">
              Change photo
            </Button>
          </Card>

          <Card>
            <CardHeader title="Linked children" subtitle="You can only see these learners" />
            <ul className="divide-y divide-line">
              {children.map((c) =>
              <li key={c.id} className="px-5 py-3 flex items-center gap-3">
                  <Avatar initials={c.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-ink truncate">{c.name}</p>
                    <p className="text-[12px] text-ink-muted">
                      {c.className} {c.stream}
                    </p>
                  </div>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line text-[12.5px] text-ink-muted">
              To link another child, contact the school office.
            </div>
          </Card>
        </div>
      </div>
    </div>);

}