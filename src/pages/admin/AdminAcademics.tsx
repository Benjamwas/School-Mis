import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Tabs } from '../../components/ui/data';
import { ASSIGNMENTS, SUBJECT_TOPICS } from '../../data/academics';
import { PROGRAMS } from '../../data/school';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiAcademicYear, ApiSubject, ApiTerm } from '../../api/types';

const TABS = ['Years & terms', 'Subjects', 'Topics & LMS', 'Assignments', 'Grading'];

const TERM_STATUS: Record<string, string> = {
  ACTIVE: 'Active',
  CLOSED: 'Complete',
  UPCOMING: 'Scheduled'
};

function termStatus(status?: string): string {
  if (!status) return 'Scheduled';
  return TERM_STATUS[status] ?? 'Scheduled';
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function weeksBetween(start?: string | null, end?: string | null): number {
  if (!start || !end) return 0;
  const from = new Date(start).getTime();
  const to = new Date(end).getTime();
  if (isNaN(from) || isNaN(to)) return 0;
  return Math.max(0, Math.round((to - from) / (7 * 24 * 60 * 60 * 1000)));
}

const SUBJECT_STATUS: Record<string, string> = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  DROPPED: 'Dropped',
  TRANSFERRED_OUT: 'Transferred Out'
};

const MOCK_CALENDAR = [
  { term: 'Term 1 · 2026', start: '6 Jan 2026', end: '3 Apr 2026', weeks: 13, status: 'Complete' },
  { term: 'Term 2 · 2026', start: '4 May 2026', end: '7 Aug 2026', weeks: 14, status: 'Complete' },
  { term: 'Term 3 · 2026', start: '1 Sep 2026', end: '6 Nov 2026', weeks: 10, status: 'Active' },
  { term: 'Term 1 · 2027', start: '6 Jan 2027', end: '2 Apr 2027', weeks: 13, status: 'Scheduled' }];

export function AdminAcademics() {
  const [tab, setTab] = useState(TABS[0]);

  const live = useApiLive();
  const subjects = useList<ApiSubject>('subjects/subjects/');
  const terms = useList<ApiTerm>('schools/terms/');
  const years = useList<ApiAcademicYear>('schools/academic-years/');

  const calendar: any[] = live
    ? (terms.data ?? []).map((t) => ({
      term: `${t.name}${t.academic_year_name ? ` · ${t.academic_year_name}` : ''}`,
      start: fmtDate(t.start_date),
      end: fmtDate(t.end_date),
      weeks: weeksBetween(t.start_date, t.end_date),
      status: termStatus(t.status)
    }))
    : MOCK_CALENDAR;

  const calendarError = terms.error ?? years.error ?? subjects.error;

  const subjectRows: any[] = (subjects.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    description: s.description ?? '—',
    status: SUBJECT_STATUS[s.status] ?? s.status
  }));

  return (
    <div>
      <PageHeader
        title="Academics & LMS"
        subtitle="Academic years, terms, subjects, learning topics and grading scales."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Add subject
          </Button>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {live && calendarError &&
      <p className="mb-4 text-sm text-rose-600">{calendarError}</p>
      }

      {tab === 'Years & terms' && (
        <Card>
          <CardHeader title="Academic calendar" subtitle={live && years.data?.length ? `${years.data.length} academic years on record` : '2026 academic year'} />
          <DataTable
            columns={[
              { key: 'term', header: 'Term', render: (r: any) => <span className="font-medium">{r.term}</span> },
              { key: 'start', header: 'Starts' },
              { key: 'end', header: 'Ends' },
              { key: 'weeks', header: 'Weeks', align: 'right', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }
            ]}
            rows={calendar}
            caption="Academic calendar"
          />
        </Card>
      )}

      {tab === 'Subjects' && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            {PROGRAMS.map((p) => (
              <Card key={p.slug} className="p-5">
                <h2 className="text-[16px] font-semibold text-ink">{p.name}</h2>
                <p className="text-[12.5px] text-ink-muted mt-0.5">{p.ages}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.subjects.map((s) => (
                    <li key={s} className="rounded-full border border-line bg-cream px-2.5 py-1 text-[12.5px] text-ink-muted">
                      {s}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" full className="mt-4">
                  Manage subjects
                </Button>
              </Card>
            ))}
          </div>
          {live && (
            <Card>
              <CardHeader title="Subject catalogue" subtitle={`${(subjects.data ?? []).length} subjects on record`} />
              <DataTable
                columns={[
                  { key: 'name', header: 'Subject', render: (r: any) => <span className="font-medium">{r.name}</span> },
                  { key: 'code', header: 'Code' },
                  { key: 'description', header: 'Description', hideOnMobile: true },
                  { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }
                ]}
                rows={subjectRows}
                mobileTitle={(r: any) => r.name}
                caption="Subject catalogue"
              />
            </Card>
          )}
        </div>
      )}

      {tab === 'Topics & LMS' && (
        <div className="space-y-6">
          {SUBJECT_TOPICS.map((s) => (
            <Card key={s.subject}>
              <CardHeader title={s.subject} subtitle={`${s.topics.length} topics published · average completion ${s.progress}%`} />
              <ul className="divide-y divide-line">
                {s.topics.map((t) => (
                  <li key={t.name} className="px-5 py-3 flex flex-wrap items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-ink">{t.name}</p>
                      <p className="text-[12.5px] text-ink-muted">{t.lessons} lessons</p>
                    </div>
                    <div className="w-32 hidden sm:block">
                      <Progress value={t.progress} label={t.name} />
                    </div>
                    <Badge tone={t.status === 'Completed' ? 'success' : t.status === 'Locked' ? 'neutral' : 'pending'}>{t.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Assignments' &&
      <Card>
          <CardHeader title="All assignments" subtitle="Across every class this term" />
          <DataTable
          columns={[
          { key: 'title', header: 'Assignment', render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: 'subject', header: 'Subject' },
          { key: 'className', header: 'Class', hideOnMobile: true },
          { key: 'teacher', header: 'Teacher', hideOnMobile: true },
          { key: 'due', header: 'Due' },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={ASSIGNMENTS}
          caption="All assignments" />
        
        </Card>
      }

      {tab === 'Grading' &&
      <Card>
          <CardHeader title="Grading scale" subtitle="Applied to all reports from Grade 1" />
          <DataTable
          columns={[
          { key: 'grade', header: 'Grade', render: (r: any) => <span className="font-medium">{r.grade}</span> },
          { key: 'range', header: 'Range' },
          { key: 'descriptor', header: 'Descriptor' }]
          }
          rows={[
          { grade: 'A', range: '90 – 100%', descriptor: 'Exceeding expectation' },
          { grade: 'A-', range: '80 – 89%', descriptor: 'Meeting expectation strongly' },
          { grade: 'B+', range: '75 – 79%', descriptor: 'Meeting expectation' },
          { grade: 'B', range: '65 – 74%', descriptor: 'Approaching expectation' },
          { grade: 'C', range: '50 – 64%', descriptor: 'Below expectation — support plan' },
          { grade: 'D', range: 'Below 50%', descriptor: 'Well below — intervention required' }]
          }
          caption="Grading scale" />
        
        </Card>
      }
    </div>);

}
