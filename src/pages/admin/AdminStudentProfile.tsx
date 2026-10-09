import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileTextIcon, MessageSquareIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, StatusBadge, Textarea } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { BarChartBlock, ChartFrame, DataTable, Tabs } from '../../components/ui/data';
import { ASSIGNMENTS, ATTENDANCE_SUMMARY, CLASS_SUBJECT_AVERAGES, SUBJECT_SCORES } from '../../data/academics';
import { FEE_SUMMARY, PAYMENTS, formatKES } from '../../data/finance';
import { GUARDIANS, STUDENTS, TEACHERS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useDetail, useList, useObject } from '../../api/hooks';
import { Modal } from '../../components/ui/feedback';
import type { ApiStudent } from '../../api/types';

const TABS = ['Overview', 'Academics', 'Attendance', 'Medical', 'Fees', 'Documents', 'Parents'];

const STUDENT_STATUS: Record<string, string> = {
  ACTIVE: 'Active',
  ALUMNI: 'Alumni',
  ARCHIVED: 'Alumni',
  TRANSFERRED: 'Alumni'
};

function studentStatus(status?: string): string {
  if (!status) return 'On Leave';
  return STUDENT_STATUS[status] ?? 'On Leave';
}

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const EMPTY_STUDENT = {
  id: '',
  name: '—',
  admissionNo: '',
  className: '',
  stream: '',
  age: '' as number | '',
  gender: '',
  avatarInitials: '',
  parentId: '',
  status: 'On Leave'
};

export function AdminStudentProfile() {
  const { id = 's1' } = useParams();
  const [tab, setTab] = useState(TABS[0]);
  const [remove, setRemove] = useState(false);
  const { toast } = useApp();

  const live = useApiLive();
  const record = useDetail<ApiStudent>('students/', id);
  const attendance = useObject<Record<string, number>>(`students/${id}/attendance/`);
  const academic = useObject<Record<string, any>>(`students/${id}/academic_summary/`);
  const medical = useList<Record<string, any>>(`medical-records/?student=${id}`);
  const [showExam, setShowExam] = useState(false);
  const [examBusy, setExamBusy] = useState(false);
  const [exam, setExam] = useState({
    height_cm: '', weight_kg: '', blood_group: '', vision: '', hearing: '',
    general_condition: 'Good', allergies: '', chronic_conditions: '', medications: '',
    physical_exam_notes: '', examined_by: '', next_checkup_date: ''
  });

  const student: any = live
    ? (record.data ? {
      id: record.data.id,
      name: record.data.full_name || record.data.person?.full_name || '—',
      admissionNo: record.data.admission_number || '',
      className: (record.data.current_class_name as string) || '',
      stream: '',
      age: '',
      gender: record.data.person?.gender || '—',
      avatarInitials: initialsOf(record.data.full_name || record.data.person?.full_name || ''),
      parentId: '',
      status: studentStatus(record.data.status)
    } : EMPTY_STUDENT)
    : STUDENTS.find((s) => s.id === id) ?? STUDENTS[0];

  const guardian = GUARDIANS.find((g) => g.id === student.parentId) ?? GUARDIANS[0];

  const attendanceTotals = attendance.data ?? null;
  const attendanceSummary = attendanceTotals
    ? {
      present: attendanceTotals.PRESENT ?? 0,
      absent: attendanceTotals.ABSENT ?? 0,
      late: attendanceTotals.LATE ?? 0,
      percentage: Math.round(
        ((attendanceTotals.PRESENT ?? 0) / Math.max(attendanceTotals.total ?? 0, 1)) * 100
      )
    }
    : ATTENDANCE_SUMMARY;

  const results: any[] = live && academic.data
    ? ((academic.data.subject_performance ?? []) as Record<string, any>[]).map((r) => ({
      subject: r.subject,
      score: r.total_score,
      grade: r.grade,
      teacher: '—',
      comment: r.term ? `${r.term} result` : ''
    }))
    : SUBJECT_SCORES;

  const resultsError = record.error ?? attendance.error ?? academic.error;

  const saveExam = async () => {
    if (!exam.height_cm || !exam.weight_kg) {
      toast({ tone: 'warning', title: 'Missing fields', body: 'Height and weight are required.' });
      return;
    }
    setExamBusy(true);
    try {
      await api.post('medical-records/', {
        student: record.data?.id ?? id,
        record_date: new Date().toISOString().slice(0, 10),
        height_cm: Number(exam.height_cm),
        weight_kg: Number(exam.weight_kg),
        blood_group: exam.blood_group || undefined,
        vision: exam.vision || undefined,
        hearing: exam.hearing || undefined,
        general_condition: exam.general_condition || undefined,
        allergies: exam.allergies || undefined,
        chronic_conditions: exam.chronic_conditions || undefined,
        medications: exam.medications || undefined,
        physical_exam_notes: exam.physical_exam_notes || undefined,
        examined_by: exam.examined_by || undefined,
        next_checkup_date: exam.next_checkup_date || undefined,
        status: 'FINAL'
      });
      toast({ tone: 'success', title: 'Examination recorded', body: 'Physical examination saved to the student record.' });
      setShowExam(false);
      medical.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setExamBusy(false);
    }
  };

  const medicalRows = (medical.data ?? []).map((m: any) => ({
    id: m.id,
    date: m.record_date,
    height: m.height_cm ? `${m.height_cm} cm` : '—',
    weight: m.weight_kg ? `${m.weight_kg} kg` : '—',
    bmi: m.bmi ?? '—',
    blood: m.blood_group || '—',
    vision: m.vision || '—',
    condition: m.general_condition || '—',
    allergies: m.allergies || '—',
    next: m.next_checkup_date || '—'
  }));
  const latestExam = medicalRows[0];

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
      

      {live && resultsError &&
      <p className="mb-4 text-sm text-rose-600">{resultsError}</p>
      }

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
              ['Term average', live && academic.data?.overall_performance != null ? `${academic.data.overall_performance}%` : '75%'],
              ['Attendance', live && attendanceTotals ? `${attendanceSummary.percentage}%` : `${ATTENDANCE_SUMMARY.percentage}%`],
              ['Fee balance', formatKES(FEE_SUMMARY.balance)],
              ['Enrolled since', live && record.data?.admission_date ? fmtDate(record.data.admission_date) : 'Jan 2021']].
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
                  <Input key={student.admissionNo} readOnly defaultValue={student.admissionNo} />
                </Field>
                <Field label="Class">
                  <Select key={`${student.className} ${student.stream}`} defaultValue={`${student.className} ${student.stream}`}>
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
            <CardHeader title={live && academic.data?.current_term?.name
              ? `Results — ${academic.data.current_term.name}`
              : 'Results — Term 3 2026'} />
            <DataTable
            columns={[
            { key: 'subject', header: 'Subject', render: (r: any) => <span className="font-medium">{r.subject}</span> },
            { key: 'score', header: 'Score', align: 'right', render: (r: any) => `${r.score}%` },
            { key: 'grade', header: 'Grade' },
            { key: 'teacher', header: 'Teacher', hideOnMobile: true },
            { key: 'comment', header: 'Comment', hideOnMobile: true }]
            }
            rows={results}
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
          ['Rate', `${attendanceSummary.percentage}%`],
          ['Present', attendanceSummary.present],
          ['Absent', attendanceSummary.absent],
          ['Late', attendanceSummary.late]].
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

      {tab === 'Medical' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-ink dark:text-white">Physical examination records</h3>
              <p className="text-[13px] text-ink-muted dark:text-gray-400">Height, weight, BMI, vision and health notes</p>
            </div>
            <Button size="sm" onClick={() => setShowExam(true)}>Record examination</Button>
          </div>

          {latestExam && (
            <Card className="p-6">
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-wide text-ink-muted dark:text-gray-400">Height</p>
                  <p className="text-[20px] font-semibold text-ink dark:text-white mt-1">{latestExam.height}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-wide text-ink-muted dark:text-gray-400">Weight</p>
                  <p className="text-[20px] font-semibold text-ink dark:text-white mt-1">{latestExam.weight}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-wide text-ink-muted dark:text-gray-400">BMI</p>
                  <p className="text-[20px] font-semibold text-ink dark:text-white mt-1">{latestExam.bmi}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-wide text-ink-muted dark:text-gray-400">Blood group</p>
                  <p className="text-[20px] font-semibold text-ink dark:text-white mt-1">{latestExam.blood}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-border dark:border-white/10 grid sm:grid-cols-2 gap-4 text-[13px]">
                <p><span className="font-medium text-ink dark:text-white">Vision:</span> <span className="text-ink-muted dark:text-gray-400">{latestExam.vision}</span></p>
                <p><span className="font-medium text-ink dark:text-white">Condition:</span> <span className="text-ink-muted dark:text-gray-400">{latestExam.condition}</span></p>
                <p><span className="font-medium text-ink dark:text-white">Allergies:</span> <span className="text-ink-muted dark:text-gray-400">{latestExam.allergies}</span></p>
                <p><span className="font-medium text-ink dark:text-white">Next checkup:</span> <span className="text-ink-muted dark:text-gray-400">{latestExam.next}</span></p>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title={`${medicalRows.length} examination record${medicalRows.length === 1 ? '' : 's'}`} />
            <DataTable
              columns={[
                { key: 'date', header: 'Date' },
                { key: 'height', header: 'Height' },
                { key: 'weight', header: 'Weight' },
                { key: 'bmi', header: 'BMI' },
                { key: 'blood', header: 'Blood', hideOnMobile: true },
                { key: 'vision', header: 'Vision', hideOnMobile: true },
                { key: 'condition', header: 'Condition', hideOnMobile: true }
              ]}
              rows={medicalRows}
              mobileTitle={(r: any) => `${r.date} — ${r.condition}`}
              caption="Medical records" />
          </Card>

          <Modal open={showExam} onClose={() => setShowExam(false)} title="Record physical examination" size="lg">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Height (cm)" required>
                <Input type="number" step="0.1" value={exam.height_cm} onChange={(e) => setExam({ ...exam, height_cm: e.target.value })} placeholder="145.5" />
              </Field>
              <Field label="Weight (kg)" required>
                <Input type="number" step="0.1" value={exam.weight_kg} onChange={(e) => setExam({ ...exam, weight_kg: e.target.value })} placeholder="38.2" />
              </Field>
              <Field label="Blood group">
                <Select value={exam.blood_group} onChange={(e) => setExam({ ...exam, blood_group: e.target.value })}>
                  <option value="">—</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Vision">
                <Input value={exam.vision} onChange={(e) => setExam({ ...exam, vision: e.target.value })} placeholder="6/6 — Normal" />
              </Field>
              <Field label="Hearing">
                <Input value={exam.hearing} onChange={(e) => setExam({ ...exam, hearing: e.target.value })} placeholder="Normal" />
              </Field>
              <Field label="General condition">
                <Input value={exam.general_condition} onChange={(e) => setExam({ ...exam, general_condition: e.target.value })} placeholder="Good" />
              </Field>
              <Field label="Allergies" className="sm:col-span-2">
                <Input value={exam.allergies} onChange={(e) => setExam({ ...exam, allergies: e.target.value })} placeholder="None known" />
              </Field>
              <Field label="Chronic conditions" className="sm:col-span-2">
                <Input value={exam.chronic_conditions} onChange={(e) => setExam({ ...exam, chronic_conditions: e.target.value })} />
              </Field>
              <Field label="Medications" className="sm:col-span-2">
                <Input value={exam.medications} onChange={(e) => setExam({ ...exam, medications: e.target.value })} />
              </Field>
              <Field label="Physical exam notes" className="sm:col-span-2">
                <Textarea value={exam.physical_exam_notes} onChange={(e) => setExam({ ...exam, physical_exam_notes: e.target.value })} rows={3} />
              </Field>
              <Field label="Examined by">
                <Input value={exam.examined_by} onChange={(e) => setExam({ ...exam, examined_by: e.target.value })} placeholder="Dr. …" />
              </Field>
              <Field label="Next checkup date">
                <Input type="date" value={exam.next_checkup_date} onChange={(e) => setExam({ ...exam, next_checkup_date: e.target.value })} />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowExam(false)}>Cancel</Button>
              <Button size="sm" disabled={examBusy} onClick={saveExam}>{examBusy ? 'Saving…' : 'Record examination'}</Button>
            </div>
          </Modal>
        </div>
      )}

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
        onConfirm={async () => {
          setRemove(false);
          try {
            await api.delete(`students/${student.id}/`);
            toast({ tone: 'success', title: 'Student archived', body: `${student.name} has been moved to archived records.` });
          } catch (e: any) {
            toast({ tone: 'error', title: 'Archive failed', body: e?.message || 'Try again.' });
          }
        }}
        title={`Delete ${student.name}?`}
        body="This removes the learner from active registers, class lists and the parent portal. Financial and academic records are archived, not destroyed."
        confirmLabel="Delete student"
        danger />
      
    </div>);

}