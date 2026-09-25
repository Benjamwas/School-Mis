import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Avatar, Button, Card, PageHeader, Progress, StatusBadge } from '../../components/ui/primitives';
import { ATTENDANCE_SUMMARY, SUBJECT_SCORES } from '../../data/academics';
import { FEE_SUMMARY, formatKES } from '../../data/finance';
import { GUARDIANS, STUDENTS, TEACHERS } from '../../data/people';

export function ParentChildren() {
  const parent = GUARDIANS[0];
  const children = STUDENTS.filter((s) => parent.childIds.includes(s.id));
  const average = Math.round(SUBJECT_SCORES.reduce((a, s) => a + s.score, 0) / SUBJECT_SCORES.length);

  return (
    <div>
      <PageHeader title="My children" subtitle="Everything about your children at SALA, in one place. You can only see learners linked to your account." />

      <div className="grid gap-5 lg:grid-cols-2">
        {children.map((c, i) => {
          const avg = i === 0 ? average : 81;
          const attendance = i === 0 ? ATTENDANCE_SUMMARY.percentage : 99;
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar initials={c.avatarInitials} size="lg" tone={i === 0 ? 'forest' : 'gold'} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-[21px] text-ink">{c.name}</h2>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-[13px] text-ink-muted mt-0.5">
                    {c.className} {c.stream} · Adm. {c.admissionNo}
                  </p>
                  <p className="text-[13px] text-ink-muted">
                    Class teacher: {i === 0 ? TEACHERS[0].name : TEACHERS[4].name}
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-4 border-y border-line py-4">
                <div>
                  <dt className="text-[12px] text-ink-muted">Term average</dt>
                  <dd className="text-[19px] font-semibold text-ink tabular-nums">{avg}%</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-muted">Attendance</dt>
                  <dd className="text-[19px] font-semibold text-ink tabular-nums">{attendance}%</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-muted">Fee balance</dt>
                  <dd className="text-[19px] font-semibold text-ink tabular-nums">{formatKES(i === 0 ? FEE_SUMMARY.balance : 0)}</dd>
                </div>
              </dl>

              <div className="mt-4 space-y-2.5">
                {(i === 0 ? SUBJECT_SCORES.slice(0, 3) : [{ subject: 'English Reading', score: 88 }, { subject: 'Mathematics', score: 79 }, { subject: 'Creative Arts', score: 92 }]).map((s: any) =>
                <div key={s.subject} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-[13px] text-ink-muted truncate">{s.subject}</span>
                    <Progress value={s.score} tone={s.score < 60 ? 'gold' : 'forest'} label={s.subject} />
                    <span className="w-10 text-right text-[13px] font-medium text-ink tabular-nums">{s.score}%</span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/parent/child/${c.id}/Overview`}>
                  <Button size="sm" icon={<ArrowRightIcon size={15} />}>
                    Open profile
                  </Button>
                </Link>
                <Link to={`/parent/child/${c.id}/Assignments`}>
                  <Button size="sm" variant="secondary">
                    Assignments
                  </Button>
                </Link>
                <Link to="/parent/fees">
                  <Button size="sm" variant="ghost">
                    Fees
                  </Button>
                </Link>
              </div>
            </Card>);

        })}
      </div>
    </div>);

}