import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileTextIcon, MessageSquareIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, StatusBadge } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { BarChartBlock, ChartFrame, DataTable, Tabs } from '../../components/ui/data';
import { ASSIGNMENTS, ATTENDANCE_SUMMARY, CLASS_SUBJECT_AVERAGES, SUBJECT_SCORES } from '../../data/academics';
import { FEE_SUMMARY, PAYMENTS, formatKES } from '../../data/finance';
import { GUARDIANS, STUDENTS, TEACHERS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

const TABS = ['Overview', 'Academics', 'Attendance', 'Fees', 'Documents', 'Parents'];

export function AdminStudentProfile() {
  const { id = 's1' } = useParams();
  const student = STUDENTS.find((s) => s.id === id) ?? STUDENTS[0];
  const guardian = GUARDIANS.find((g) => g.id === student.parentId) ?? GUARDIANS[0];
  const [tab, setTab] = useState(TABS[0]);
  const [remove, setRemove] = useState(false);
  const { toast } = useApp();

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/admin/students" className="hover:text-ink">
          Students
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{student.name}</span>
      </nav>

      <PageHeader
        title={student.name}
        subtitle={`${student.admissionNo} · ${student.className} ${student.stream} · ${student.age} years · ${student.gender}`}
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<MessageSquareIcon size={15} />}>
              Message parent
            </Button>
            <Button size="sm" variant="secondary" icon={<PencilIcon size={15} />}>
              Edit record
            </Button>
            <Button size="sm" variant="ghost" icon={<Trash2Icon size={15} />} onClick={() => setRemove(true)}>
              Delete
            </Button>
          </>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' &&
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <Avatar initials={student.avatarInitials} size="lg" />
                <div>
                  <h2 className="font-serif text-[22px] text-ink">{student.name}</h2>
                  <p className="text-[13px] text-ink-muted">
                    Class teacher {TEACHERS[0].name} · House Baobab · Route 6 (Ruaka)
                  </p>
                  <div className="mt-2 flex gap-2">
                    <StatusBadge status={student.status} />
                    <Badge tone="warning">Fees part paid</Badge>
                  </div>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-line pt-4">
                {[
              ['Term average', '75%'],
              ['Attendance', `${ATTENDANCE_SUMMARY.percentage}%`],
              ['Fee balance', formatKES(FEE_SUMMARY.balance)],
              ['Enrolled since', 'Jan 2021']].
              map(([k, v]) =>
              <div key={k}>
                    <dt className="text-[12px] text-ink-muted">{k}</dt>
                    <dd className="text-[17px] font-semibold text-ink tabular-nums">{v}</dd>
                  </div>
              )}
              </dl>
            </Card>

            <Card>
              <CardHeader title="Administrative details" />
              <div className="p-5 grid sm:grid-cols-2 gap-5">
                <Field label="Admission number">
                  <Input readOnly defaultValue={student.admissionNo} />
                </Field>
                <Field label="Class">
                  <Select defaultValue={`${student.className} ${student.stream}`}>
                    <option>{`${student.className} ${student.stream}`}</option>
                    <option>Grade 5 Acacia</option>
                  </Select>
                </Field>
                <Field label="Transport route">
                  <Select defaultValue="Route 6 — Ruaka">
                    <option>Route 6 — Ruaka</option>
                    <option>Route 2 — Parklands</option>
                    <option>No transport</option>
                  </Select>
                </Field>
                <Field label="Medical notes">
                  <Input defaultValue="No known allergies" />
                </Field>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Primary guardian" />
              <dl className="divide-y divide-line">
                {[
              ['Name', guardian.name],
              ['Relationship', guardian.relationship],
              ['Phone', guardian.phone],
              ['Email', guardian.email],
              ['Address', guardian.address]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
                    <dt className="text-[13px] text-ink-muted">{k}</dt>
                    <dd className="text-[13.5px] font-medium text-ink text-right">{v}</dd>
                  </div>
              )}
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Flags</h3>
              <ul className="mt-3 space-y-2 text-[13.5px] text-ink-muted">
                <li>· Mathematics support plan active (Term 3)</li>
                <li>· Fee balance {formatKES(FEE_SUMMARY.balance)} due 30 September</li>
                <li>· Consent form for Grade 4 trip outstanding</li>
              </ul>
            </Card>
          </div>
        </div>
      }

      {tab === 'Academics' &&
      <div className="space-y-6">
          <ChartFrame title="Performance by subject" subtitle="Learner vs class average">
            <BarChartBlock
            data={CLASS_SUBJECT_AVERAGES}
            xKey="subject"
            bars={[
            { key: 'average', name: student.name.split(' ')[0], color: '#1F5E43' },
            { key: 'classAvg', name: 'Class', color: '#D4A23A' }]
            } />
          
          </ChartFrame>
          <Card>
            <CardHeader title="Results — Term 3 2026" />
            <DataTable
            columns={[
            { key: 'subject', header: 'Subject', render: (r: any) => <span className="font-medium">{r.subject}</span> },
            { key: 'score', header: 'Score', align: 'right', render: (r: any) => `${r.score}%` },
            { key: 'grade', header: 'Grade' },
            { key: 'teacher', header: 'Teacher', hideOnMobile: true },
            { key: 'comment', header: 'Comment', hideOnMobile: true }]
            }
            rows={SUBJECT_SCORES}
            caption="Results" />
          
          </Card>
          <Card>
            <CardHeader title="Assignments" />
            <DataTable
            columns={[
            { key: 'title', header: 'Assignment', render: (r: any) => <span className="font-medium">{r.title}</span> },
            { key: 'subject', header: 'Subject', hideOnMobile: true },
            { key: 'due', header: 'Due' },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={ASSIGNMENTS}
            caption="Assignments" />
          
          </Card>
        </div>
      }

      {tab === 'Attendance' &&
      <Card>
          <CardHeader title="Attendance record" subtitle="Term 3 · 2026" />
          <div className="p-5 grid sm:grid-cols-4 gap-4">
            {[
          ['Rate', `${ATTENDANCE_SUMMARY.percentage}%`],
          ['Present', ATTENDANCE_SUMMARY.present],
          ['Absent', ATTENDANCE_SUMMARY.absent],
          ['Late', ATTENDANCE_SUMMARY.late]].
          map(([k, v]) =>
          <div key={k as string} className="rounded-lg bg-cream p-4">
                <p className="text-[12.5px] text-ink-muted">{k}</p>
                <p className="text-[22px] font-semibold text-ink tabular-nums">{v as any}</p>
              </div>
          )}
          </div>
          <DataTable
          columns={[
          { key: 'date', header: 'Date', render: (r: any) => <span className="font-medium">{r.date}</span> },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          { key: 'note', header: 'Note' },
          { key: 'recorded', header: 'Recorded by', hideOnMobile: true }]
          }
          rows={[
          { date: 'Wed, 23 Sep', status: 'Absent', note: 'Medical appointment — parent notified', recorded: 'Mr. Brian Kimani' },
          { date: 'Fri, 18 Sep', status: 'Late', note: 'Arrived 8:14am', recorded: 'Mr. Brian Kimani' },
          { date: 'Fri, 11 Sep', status: 'Late', note: 'Arrived 8:05am', recorded: 'Mr. Brian Kimani' },
          { date: 'Fri, 04 Sep', status: 'Absent', note: 'Unwell — no note received', recorded: 'Mr. Brian Kimani' }]
          }
          caption="Attendance record" />
        
        </Card>
      }

      {tab === 'Fees' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
          ['Billed this term', formatKES(FEE_SUMMARY.total)],
          ['Paid', formatKES(FEE_SUMMARY.paid)],
          ['Balance', formatKES(FEE_SUMMARY.balance)]].
          map(([k, v]) =>
          <Card key={k} className="p-5">
                <p className="text-[12.5px] text-ink-muted">{k}</p>
                <p className="mt-1 text-[22px] font-semibold text-ink tabular-nums">{v}</p>
              </Card>
          )}
          </div>
          <Card>
            <CardHeader title="Payment history" />
            <DataTable
            columns={[
            { key: 'date', header: 'Date' },
            { key: 'method', header: 'Method' },
            { key: 'reference', header: 'Reference' },
            { key: 'term', header: 'Term', hideOnMobile: true },
            { key: 'amount', header: 'Amount', align: 'right', render: (r: any) => formatKES(r.amount) }]
            }
            rows={PAYMENTS.filter((p) => p.student === student.name)}
            caption="Payment history" />
          
          </Card>
        </div>
      }

      {tab === 'Documents' &&
      <Card>
          <CardHeader title="Documents on file" action={<Button size="sm" variant="secondary">Upload</Button>} />
          <ul className="divide-y divide-line">
            {[
          ['Birth certificate.pdf', 'Verified', '18 Jan 2021'],
          ['Previous school report.pdf', 'Verified', '18 Jan 2021'],
          ['Immunisation record.pdf', 'Verified', '18 Jan 2021'],
          ['Grade 4 trip consent form', 'Pending', '—']].
          map(([name, status, date]) =>
          <li key={name} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[13.5px] text-ink">
                  <FileTextIcon size={16} className="text-ink-soft" />
                  {name}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-[12.5px] text-ink-muted">{date}</span>
                  <StatusBadge status={status} />
                </span>
              </li>
          )}
          </ul>
        </Card>
      }

      {tab === 'Parents' &&
      <Card>
          <CardHeader title="Linked guardians" />
          <ul className="divide-y divide-line">
            <li className="px-5 py-4 flex flex-wrap items-center gap-4">
              <Avatar initials="GK" size="md" tone="gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-medium text-ink">{guardian.name}</p>
                <p className="text-[12.5px] text-ink-muted">
                  {guardian.relationship} · {guardian.phone} · {guardian.email}
                </p>
              </div>
              <Badge tone="success">Portal active</Badge>
              <Link to="/admin/parents">
                <Button variant="ghost" size="sm">
                  Open parent
                </Button>
              </Link>
            </li>
          </ul>
        </Card>
      }

      <ConfirmDialog
        open={remove}
        onClose={() => setRemove(false)}
        onConfirm={() => {
          setRemove(false);
          toast({ tone: 'warning', title: 'Student archived', body: `${student.name} has been moved to archived records.` });
        }}
        title={`Delete ${student.name}?`}
        body="This removes the learner from active registers, class lists and the parent portal. Financial and academic records are archived, not destroyed."
        confirmLabel="Delete student"
        danger />
      
    </div>);

}